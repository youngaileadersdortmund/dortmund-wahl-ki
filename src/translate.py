import os

from PyPDF2 import PdfReader
import torch
from transformers import pipeline
import re

sentence_batch_size = 10

reader = PdfReader('contents/2020/spd/program.pdf')

full_text = []
for p_idx, page in enumerate(reader.pages):
    text = page.extract_text()
    lines = text.split('\n')
    for line in lines:
        if len(line) > 10 and not line.upper() == line:
            full_text.append(line.strip())
    # if len(full_text) > 25:
    #     break
full_text = ' '.join(full_text)
# Split the text into sentences using ., ?, or ! as delimiters
sentences = re.split(r'(?<=[.!?])\s+', full_text)
print('sentences', len(sentences), 'batches', len(sentences) // sentence_batch_size)

translated = []
pipe = pipeline("text-generation", model="Unbabel/TowerInstruct-13B-v0.1", torch_dtype=torch.bfloat16, device_map="auto")
for i, s in enumerate(range(0, len(sentences), sentence_batch_size)):
    paragraph = ' '.join(sentences[s:(s+sentence_batch_size)])
    messages = [{"role": "user", "content": f"Translate the following text from German into English.\nGerman: {paragraph}\nEnglish:"},]
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=256, do_sample=False)
    translated.append(outputs[0]["generated_text"].split('<|im_start|>assistant')[1].strip())
    print(f'Paragraph {i+1} / {len(sentences) // sentence_batch_size}:\n{paragraph}\n\n{translated[-1]}\n\n\n\n')
# concat paragraphs, split sentences across lines, write into file
translated = ' '.join(translated).replace('e.g.', 'for example')
sentences = re.split(r'(?<=[.!?])\s+', translated)
with open('contents/2020/spd/program_en.txt', 'w') as f:
    f.write('\n'.join(sentences))