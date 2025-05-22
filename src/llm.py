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

        # generate prompt
        baseprompt = 'From the following election program summary, identify ten central "impact points" relating to specific local aspects that would be affected or changed if the program is coming into effect. Find meaningful identifier strings that summarize each point and also formulate a short description for each of them. Assign an importance weight betweeon 0 and 1 to each impact point, based on how pronounced and rich the point is discussed in the program, and formulate a short respective explanation. Return the results as a JSON-formatted string (list of impact points with "identifier", "description", "importance" and "importance_reasoning"). Make sure to not use quotation marks or other JSON-syntax symbols for the descriptions and reasoning.'
        messages = [ {"role": "user", "content": baseprompt + '\n\n' + summary} ]
        text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=True)
        model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

        # run and parse thinking content
        generated_ids = model.generate(**model_inputs, max_new_tokens=5000)
        output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()
        try:
            index = len(output_ids) - output_ids[::-1].index(151668) # rindex finding 151668 (</think>)
        except ValueError:
            index = 0
        reasoning = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
        impact_points = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")

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
                file_ok = True
            except json.JSONDecodeError as e:
                # try to fix it with the reasoning model
                print(f'\n\nJSON ERROR! ITERATION {iter}\n\n')
                prompt = 'The following JSON content is malformed and raises a JSONDecodeError, please fix it and only provide the correctly formatted json string:\n\n' + fstring
                messages = [ {"role": "user", "content": prompt} ]
                text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=True)
                model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
                generated_ids = model.generate(**model_inputs, max_new_tokens=5000)
                output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()

                # split into reasoning and fixed json, and write to file
                try:
                    index = len(output_ids) - output_ids[::-1].index(151668) # rindex finding 151668 (</think>)
                except ValueError:
                    index = 0
                json_reasoning = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
                fixed_fstring = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")
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
