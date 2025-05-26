import os
import re
import json

from PyPDF2 import PdfReader
import transformers
import torch


def translate_pdf(fname, sentence_batch_size=10, break_after=None):
    tr_fname = fname.replace('.pdf', '_en.txt')
    if os.path.isfile(tr_fname):
        with open(tr_fname, 'r') as f:
            content = f.read()
        print(f'Loading pre-compiled translation of {len(content.split("\n"))} sentences from {tr_fname}')
    else:
        reader = PdfReader(fname)
        full_text = []
        for p_idx, page in enumerate(reader.pages):
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                if len(line) > 10 and not line.upper() == line:
                    full_text.append(line.strip())
            if break_after and len(full_text) > break_after:
                break
        full_text = ' '.join(full_text)
        # Split the text into sentences using ., ?, or ! as delimiters
        sentences = re.split(r'(?<=[.!?])\s+', full_text)
        print(f'Number of sentences in {fname}: {len(sentences)}, to be processed in {len(sentences) // sentence_batch_size} batches')
        # translate single paragraphs
        translated = []
        pipe = transformers.pipeline("text-generation", model="Unbabel/TowerInstruct-13B-v0.1", torch_dtype=torch.bfloat16, device_map="auto")
        for i, s in enumerate(range(0, len(sentences), sentence_batch_size)):
            paragraph = ' '.join(sentences[s:(s+sentence_batch_size)])
            messages = [{"role": "user", "content": f"Translate the following text from German into English.\nGerman: {paragraph}\nEnglish:"},]
            prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            outputs = pipe(prompt, max_new_tokens=256, do_sample=False)
            translated.append(outputs[0]["generated_text"].split('<|im_start|>assistant')[1].strip())
            print(f'\n\n\n\nParagraph {i+1} / {len(sentences)//sentence_batch_size+1}:\n{paragraph}\n\n{translated[-1]}')
        # concat paragraphs, split sentences across lines, write into file
        translated = ' '.join(translated).replace('e.g.', 'for example')
        sentences = re.split(r'(?<=[.!?])\s+', translated)
        content = '\n'.join(sentences)
        with open(tr_fname, 'w') as f:
            f.write(content)
        print(f'Compiled translation of {len(sentences)} sentences into {tr_fname}')
    return content


def summarize_content(content, fname, sentence_batch_size=20, summarization_rate=0.25, model_id="facebook/bart-large-cnn"):
    sum_fname = fname.replace('.pdf', '_sum.txt')
    if os.path.isfile(sum_fname):
        with open(sum_fname, 'r') as f:
            summary = f.read()
        print_str = f'Loading pre-compiled summary from {sum_fname}'
    else:
        sentences = content.split('\n')
        summarizer = transformers.pipeline("summarization", model=model_id)
        summary_sentences = []
        for i, s in enumerate(range(0, len(sentences), sentence_batch_size)):
            paragraph = ' '.join(sentences[s:(s+sentence_batch_size)])
            maxl, minl = int(len(paragraph) * summarization_rate / 4), int(len(paragraph) * summarization_rate / 8)
            summary = summarizer(paragraph, max_length=maxl, min_length=minl, do_sample=False)
            summary = summary[0]['summary_text']
            summary_splitted = re.split(r'(?<=[.!?])\s+', summary)
            for sentence in summary_splitted:
                summary_sentences.append(sentence.strip())
            print(f'Summarized sentence batch {i+1} / {len(sentences)//sentence_batch_size+1}, summary has {len(summary)} characters instead of {len(paragraph)} ({len(summary)/len(paragraph)*100:4.2f}% of original size)')
        summary = '\n'.join(summary_sentences)
        with open(sum_fname, 'w') as f:
            f.write(summary)
        print_str = f'Compiled summary into {sum_fname}'
    print(f'{print_str} - {len(summary)} characters, {len(summary)/len(content)*100:4.2f}% of the original translation ({len(content)} characters)')
    return summary


def reason(model, tokenizer, prompt, max_new_tokens=5000, end_of_reasoning_token=151668):
    # construct query
    messages = [ {"role": "user", "content": prompt} ]
    text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=True)
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
    # run and parse output
    generated_ids = model.generate(**model_inputs, max_new_tokens=max_new_tokens)
    output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()
    try:
        index = len(output_ids) - output_ids[::-1].index(end_of_reasoning_token) # rindex finding 151668 (</think>)
    except ValueError:
        index = 0
    reasoning = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
    answer = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")
    return reasoning, answer


def reason_about_impact_points(summary, fname, model_name="Qwen/Qwen3-30B-A3B"):
    point_fname, reasoning_fname = fname.replace('.pdf', '_impact_points.json'), fname.replace('.pdf', '_impact_point_reasoning.txt'), 
    if os.path.isfile(point_fname):
        with open(point_fname, 'r') as f:
            impact_points = json.load(f)
        with open(reasoning_fname, 'r') as f:
            reasoning = f.read()
        print_str = f'Loading pre-compiled impact points from {point_fname}'
    else:
        # init model
        tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
        model = transformers.AutoModelForCausalLM.from_pretrained(model_name, torch_dtype="auto", device_map="auto")
        # run model
        baseprompt = 'From the following election program summary, identify ten central "impact points" relating to specific local aspects that would be affected or changed if the program is coming into effect. Find meaningful identifier strings that summarize each point and also formulate a short description for each of them. Assign an importance weight betweeon 0 and 1 to each impact point, based on how pronounced and rich the point is discussed in the program, and formulate a short respective explanation. Return the results as a JSON-formatted string (list of impact points with "identifier", "description", "importance" and "importance_reasoning"). Make sure to not use quotation marks or other JSON-syntax symbols for the descriptions and reasoning.'
        reasoning, impact_points = reason(model, tokenizer, baseprompt + '\n\n' + summary)
        # write results
        with open(point_fname, 'w') as f:
            f.write(impact_points)
        with open(reasoning_fname, 'w') as f:
            f.write(reasoning)

        # check for json compatibility
        file_ok, iter = False, 5
        while not file_ok and iter > 0:
            try: # check if json is readble
                with open(point_fname, 'r') as f:
                    fstring = f.read()
                impact_points = json.loads(fstring)
                if ('impact_points' not in impact_points) or \
                        (not isinstance(impact_points['impact_points'], list)) or \
                        ('identifier' not in impact_points['impact_points'][0]) or \
                        ('description' not in impact_points['impact_points'][0]) or \
                        ('importance' not in impact_points['impact_points'][0]) or \
                        ('importance_reasoning' not in impact_points['impact_points'][0]):
                    raise RuntimeError
                file_ok = True
            except json.JSONDecodeError:
                prompt = 'The following JSON content is malformed and raises a JSONDecodeError, please fix it and only provide the correctly formatted json string:\n\n' + fstring
            except RuntimeError:
                prompt = 'The JSON content does not have the desired structure, on root level, it should contain the "impact_points" as a list, with each element having an "identifier" (str), "description" (str), "importance" (float between 0.0 - 1.0) and "importance_reasoning" (str). Please fix it and only provide the correctly formatted json string:\n\n' + fstring
            if not file_ok:
                # try to fix JSON with the reasoning model
                print(f'\n\nJSON ERROR! ITERATION {iter}\n\n')
                json_reasoning, fixed_fstring = reason(model, tokenizer, prompt)
                print(json_reasoning)
                with open(point_fname, 'w') as f:
                    f.write(fixed_fstring)
                iter -= 1
                
        # finalize
        print_str = f'Compiled impact points into {point_fname}'
        if not file_ok:
            print_str = print_str + ', but with remaining json errors'
            impact_points = fstring

    print('\n', print_str, '\n', "reasoning content:", reasoning, '\n', str(impact_points))
    return impact_points, reasoning

def impact_point_comparison_analysis(dirname, model_name="Qwen/Qwen3-30B-A3B"):
    fname_analysis, fname_analysis_reasons = os.path.join(dirname, 'impact_analysis.txt'), os.path.join(dirname, 'impact_analysis_reasoning.txt')
    if os.path.isfile(fname_analysis):
        with open(fname_analysis, 'r') as f:
            analysis = f.read()
        with open(fname_analysis_reasons, 'r') as f:
            reasoning = f.read()
        print_str = f'Loading pre-compiled impact point analysis from {fname_analysis}'
    else:
        # load impact points from all parties
        impact_points = {}
        for root, _, files in os.walk(dirname):
            for f in files:
                if '_impact_points.json' in f:
                    if root in impact_points:
                        raise RuntimeError('Found two impact point files in ' + root)
                    try:
                        with open(os.path.join(root, f), 'r') as content:
                            impact_points[root] = json.load(content)['impact_points']
                    except:
                        raise RuntimeError('Could not load impact points from ' + os.path.join(root, f))
        points_txt = '\n'.join([f'Program {program_idx} Point {p_idx}: {p["identifier"]} - {p["description"]}' for program_idx, plist in enumerate(impact_points.values()) for p_idx, p in enumerate(plist)])
        print('Analyzing Impact Points:\n' + points_txt)
        # init model
        tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
        model = transformers.AutoModelForCausalLM.from_pretrained(model_name, torch_dtype="auto", device_map="auto")
        # analyze the impact points
        prompt = 'Analyze the following impact points obtained from different political programs. Investigate common points and highlight notable differences in the programs. Think about how the different political programs and impact points would affect the visual appearance of the region. For each program, identify five visual changes that stand out strongest in comparison to the other programs, summarized as short keypoints. The final answer should consist of a summary of the analysis in the first textline, followed by individual textlines for each program, with comma-seperated keypoints summarizing the most crucial visual changes. Accordingly, the response format should be "Summary: [summary of your toughts] \nProgram 1: [keypoints for visual changes] \nProgram 2: [keypoints for visual changes] \nProgram 3: [keypoints for visual changes]")'
        reasoning, analysis = reason(model, tokenizer, prompt + '\n' + points_txt)
        with open(fname_analysis, 'w') as f:
            f.write(analysis)
        with open(fname_analysis_reasons, 'w') as f:
            f.write(reasoning)
        # check for output compatibility
        file_ok, iter = False, 5
        while not file_ok and iter > 0:
            try: # check if json is readble
                per_program = analysis.split('\n')[1:]
                assert len(per_program) == len(impact_points)
                for ana, root in zip(per_program, impact_points.keys()):
                    with open(os.path.join(root, 'prompts', 'visual_impact_points.txt'), 'w') as f:
                        f.write(re.sub(r'Program \d: ', '', ana))
                file_ok = True
            except:
                prompt = 'The formatting is not correct, the response format should be "Summary: ... \nProgram 1: ... \nProgram 2: ... \nProgram 3: ...") Please fix it:\n\n' + analysis
            if not file_ok:
                # try to fix JSON with the reasoning model
                print(f'\n\nJSON ERROR! ITERATION {iter}\n\n')
                fix_reasoning, fixed_analysis = reason(model, tokenizer, prompt)
                print(fix_reasoning)
                with open(fname_analysis, 'w') as f:
                    f.write(fixed_analysis)
                iter -= 1
        print_str = f'Compiled impact point analysis into {fname_analysis}'
        if not file_ok:
            print_str.append(', but could not extract the individual program prompts!')

    print(print_str)
    return analysis
