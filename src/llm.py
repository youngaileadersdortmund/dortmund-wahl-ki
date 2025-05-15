import os

from vllm import LLM
from vllm.sampling_params import SamplingParams
from PyPDF2 import PdfReader


def read_pdf(base_path):
    reader = PdfReader(os.path.join(base_path, 'program.pdf'))
    contents = {}
    for p_idx, page in enumerate(reader.pages):
        text = page.extract_text().replace('\n', ' ')
        with open(os.path.join(base_path, f'program_content_p{str(p_idx).zfill(2)}.txt'), 'w') as f:
            f.write(text)
        n_words = len(text.split())
        if n_words > 40:
            print(f'Page {p_idx} has {n_words} words and will be summarized')
            contents[p_idx] = text
    return contents


def generate_summary_and_prompt(base_path, model_name='Ministral', iterations=3):

    contents = read_pdf(base_path)

    sampling_params = SamplingParams(max_tokens=8192)
    if model_name == 'Ministral':
        llm = LLM(model='mistralai/Ministral-8B-Instruct-2410', tokenizer_mode="mistral", config_format="mistral", load_format="mistral")
    else:
        raise NotImplementedError(f'Model {model_name} not implemented')
    
    prompts_per_iter = []

    for iter in range(iterations):
        print(f'Iteration {iterations + 1} of {iterations}')

        prompt = "Identifiziere mögliche visuelle Veränderungen des Dortmunder Stadtbildes, sofern der folgende Ausschnitt aus dem Wahlprogramm umgesetzt wird. Antworte in knappen Stichpunkten, ohne zusätzliche Ausschmückung:\n\n\n" # Do we need to think for 10 seconds to find the answer of 1 + 1?"
        summaries = {}
        for p_idx, content in contents.items():
            messages = [ { "role": "user", "content": prompt + content} ]
            outputs = llm.chat(messages, sampling_params=sampling_params)
            summaries[p_idx] = outputs[0].outputs[0].text

        prompt = "Erstelle eine ganz knappe Liste von Dingen (eine Zeile, durch Komma getrennt jeweils 2-3 Wörter), die sich im optischen Erscheinungsbild der Stadt Dortmund ändern würden, auf Basis der folgenden Wahlprogramm Zusammenfassung:\n\n\n"
        messages = [ { "role": "user", "content": prompt + '\n\n'.join(summaries.values())} ]
        list_of_changes = llm.chat(messages, sampling_params=sampling_params)[0].outputs[0].text

        with open(os.path.join(base_path, f'program_summary_{iter}.txt'), 'w') as f:
            for p_idx, summary in summaries.items():
                f.write(f'Page {p_idx}:\n{summary}\n\n\n\n')
            f.write('\nList of Changes:\n\n' + list_of_changes)

        prompt = "Erstelle einen Prompt für eine bildgenerative KI, mit der ein Bild der Stadt Dortmund unter Berücksichtigung der folgenden Stichpunkte erzeugt wird. Antworte nur mit dem Prompt."
        messages = [ { "role": "user", "content": prompt + list_of_changes} ]
        output = llm.chat(messages, sampling_params=sampling_params)
        prompts_per_iter.append( output[0].outputs[0].text.replace('\n', ' ') )
        with open(os.path.join(base_path, 'prompts', f'DE_{model_name}_{iter}.txt'), 'w') as f:
            f.write(prompts_per_iter[-1])
    
    prompt = "Vereinheitliche die drei folgenden Prompts zu einem einzigen Prompt, ohne Sonderzeichen oder zusätzliche Ausschmückung:\n\n"
    messages = [ { "role": "user", "content": prompt + '\n\n'.join(prompts_per_iter)} ]
    output = llm.chat(messages, sampling_params=sampling_params)
    final_prompt = output[0].outputs[0].text.replace('\n', ' ')
    with open(os.path.join(base_path, 'prompts', f'DE_{model_name}.txt'), 'w') as f:
        f.write(final_prompt)

# prompt = "Generate a prompt for an image generation AI, creating an image of the city of Dortmung under consideration of the following keypoints:\n\n\n"
# messages = [ { "role": "user", "content": prompt + '\n\n'.join(summaries)} ]
# outputs = llm.chat(messages, sampling_params=sampling_params)
# with open(os.path.join(base_path, 'prompts', 'EN_Ministral-8B-Instruct-2410.txt'), 'w') as f:
#     f.write(outputs[0].outputs[0].text)