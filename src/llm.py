import os

from PyPDF2 import PdfReader

import transformers
import torch


def read_pdf(base_path, fname='program.pdf'):
    reader = PdfReader(os.path.join(base_path, fname))
    contents = {}
    for p_idx, page in enumerate(reader.pages):
        text = page.extract_text().replace('\n', ' ')
        with open(os.path.join(base_path, 'summaries', f'{fname.replace(".pdf", "")}_content_p{str(p_idx).zfill(2)}.txt'), 'w') as f:
            f.write(text)
        n_words = len(text.split())
        if n_words > 40:
            print(f'Page {p_idx} has {n_words} words and {len(text)} characters and will be summarized')
            contents[p_idx] = text
    return contents


def summarize_pdf_per_page(base_path, fname='program.pdf', model_id="facebook/bart-large-cnn"):
    summarizer = transformers.pipeline("summarization", model=model_id)

    contents = read_pdf(base_path, fname)
    summaries = {}
    summary_path = os.path.join(base_path, 'summaries', fname.replace('.pdf', '_summary.txt'))
    if os.path.isfile(summary_path):
        os.remove(summary_path)

    for p_idx, content in contents.items():
        print(f'Page {p_idx} has {len(content.split())} words and will be summarized')
        result = summarizer(content[:3800], max_length=500, min_length=100, do_sample=False)
        summaries[p_idx] = result[0]['summary_text']
        with open(summary_path, 'a') as f:
            f.write(f'Page {p_idx}:\n{summaries[p_idx]}\n\n\n')
    return summaries


def find_visual_keys(base_path, fname='program.pdf', model_name="Qwen/Qwen3-30B-A3B"):
    prompt_fname = os.path.join(base_path, 'prompts', f"visual_keys_{model_name.split('/')[1]}.txt")

    if os.path.isfile(prompt_fname): # load previous output
        with open(prompt_fname, 'r') as f:
            content = f.read()
        content = content.split('\n\n\n\n')[1].strip()
    else:
        summaries = summarize_pdf_per_page(base_path, fname)
        print('Finishes summarization, not starting reasoning for identifying visual keys')

        # load the tokenizer and the model
        tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
        model = transformers.AutoModelForCausalLM.from_pretrained(model_name, torch_dtype="auto", device_map="auto")

        baseprompt = "From the following local election program summary, identify key aspects that would likely change about the visual appearance of the respective city. Only respond with a list of comma-separated visual aspects that would represent the changes resulting from the election program, without any additional information."
        prompt = baseprompt + '\n\n' + '\n'.join(summaries.values())

        messages = [ {"role": "user", "content": prompt} ]
        text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=True)
        model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

        # conduct text completion
        generated_ids = model.generate(**model_inputs, max_new_tokens=5000)
        output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()

        # parsing thinking content
        try:
            # rindex finding 151668 (</think>)
            index = len(output_ids) - output_ids[::-1].index(151668)
        except ValueError:
            index = 0

        thinking_content = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
        content = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")
            
        print("thinking content:", thinking_content)
        print("content:", content)

        with open(prompt_fname, 'w') as f:
            f.write(thinking_content + '\n\n\n\n\n\n' + content)
    return content
    
    
    
    