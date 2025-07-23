import os

import argparse
import pandas as pd
import numpy as np

from llm import load_llm, translate, translate_pdf, reason_about_visual_points, summarize_content
from images import generate_images_uno, load_model_diffusers, generate_images_diffusers


def translate_kommunalomat(fname):
    translation_fname = fname.replace('.xlsx', '_translated.txt')

    if os.path.isfile(translation_fname):
        print(f"Translation file {translation_fname} already exists")
        with open(translation_fname, 'r') as f:
            results = f.read()
    else:
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(fname)
        question_cols = list(range(8, 122, 2))
        response_cols = list(np.array(question_cols) + 1)

        # Translate questions
        questions = df.columns[question_cols].map(lambda q: q.replace('.', '').strip()).to_list()
        translated = translate(questions)
        df = df.rename({q: qf for q, qf in zip(df.columns[question_cols], translated)}, axis=1)

        # Translate responses
        all_responses = []
        for col in response_cols:
            all_responses.extend(df.iloc[:, col].dropna().tolist())
        translated = translate(all_responses, source_lan='German', target_lan='English')
        idx = 0
        for col in response_cols:
            col_responses = df.iloc[:, col].dropna().index
            for row in col_responses:
                df.iat[row, col] = translated[idx]
                idx += 1

        # translate scores
        df = df.fillna('')
        df = df.replace('Starke Zustimmung', 'Strong Approval')
        df = df.replace('Zustimmung', 'Approval')
        df = df.replace('Ablehnung', 'Rejection')
        df = df.replace('Starke Ablehnung', 'Strong Rejection')

        # Extract and format the results for each party
        results = []
        for party_idx in range(df.shape[0]):
            party_results = []
            for question_idx in question_cols:
                question = df.columns[question_idx]
                score = df.iloc[party_idx, question_idx]
                reasoning = df.iloc[party_idx, question_idx+1].strip()
                party_results.append(f'{question}:\n{score} - {reasoning}\n')
            results.append(f'Party {party_idx}\n\n' + '\n'.join(party_results))

        results = '\n\n\n'.join(results)
        with open(translation_fname, 'w') as f:
            f.write(results)

        print(f"Created translation file {translation_fname}")

    per_party = [party_response.split('\n\n')[1:] for party_response in results.split('\n\n\n')]
    # synch with party identifiers, manually read from excel
    per_party = {p: r for p, r in zip(['tierschutz', 'diepartei', 'spd', 'linke', 'cdu', 'gruene', 'bvt', 'fdp', 'bli', 'volt'], per_party)}
    return per_party


def process_kommunalomat(args):

    # translate
    base_path = os.path.dirname(args.input)
    per_party = translate_kommunalomat(args.input)
    
    # reason for each program
    llm = load_llm(args.llm) # init llm
    points_and_directory = {}
    for party, responses in per_party.items():
        print(f'Reasoning for {party}')
        responses = '\n\n'.join(responses)
        # create directories
        results_dir = os.path.join(base_path, party, f'results_p{args.n_points}_{args.llm.split("/")[1]}_kommunalomat')
        if not os.path.exists(results_dir):
            os.makedirs(results_dir)
        with open(os.path.join(base_path, party, 'kommunalomat_responses.txt'), 'w') as f:
            f.write(responses)
        # reasoning
        points, reasoning = reason_about_visual_points(responses, os.path.join(results_dir, 'prompt.txt'), llm, 'open election compass answers', args.n_points)
        points_and_directory[party] = (results_dir, points, reasoning)
    del llm  # free memory

    # translate all reasonings
    for party, (results_dir, points, reasoning) in points_and_directory.items():
        if not os.path.isfile(os.path.join(results_dir, 'prompt_de.txt')):
            print(f'Translating reasoning for {party}')
            tr_points, tr_reasoning = translate([points, reasoning], source_lan='English', target_lan='German')
            print(tr_points, '\n', tr_reasoning)
            with open(os.path.join(results_dir, 'prompt_de.txt'), 'w') as f:
                f.write(tr_points)
            with open(os.path.join(results_dir, 'prompt_reasoning_de.txt'), 'w') as f:
                f.write(tr_reasoning)

    # init image generation
    if not os.path.isdir(args.image_generator):
        model = load_model_diffusers(args.image_generator)
    # generate images for each program
    for party, (results_dir, points, _) in points_and_directory.items():
        print(f'Generating images for {party}')
        if os.path.isdir(args.image_generator):
            raise NotImplementedError
        else:
            save_path = os.path.join(results_dir, f'img_{args.image_generator.split("/")[1]}_guid{args.guidance}_nsteps{args.num_steps}')
            generate_images_diffusers(points, model, save_path, args.guidance, args.num_steps, args.n_images)


def process_program(args):

    # initialize subfolder structure
    base_path = os.path.dirname(args.input)
    results_dir = os.path.join(base_path, f'results_p{args.n_points}_{args.llm.split("/")[1]}_program')
    if not os.path.exists(results_dir):
        os.makedirs(results_dir)
            
    # translate and summarize the content and analyze key impact points
    translated_content = translate_pdf(args.input)
    summary = summarize_content(translated_content, args.input)
    llm = load_llm(args.llm)
    visual_points, reasoning = reason_about_visual_points(summary, os.path.join(results_dir, 'prompt.txt'), llm, n_points=args.n_points)
    del llm

    # translate reasoning and points
    if not os.path.isfile(os.path.join(results_dir, 'prompt_de.txt')):
        tr_points, tr_reasoning = translate([visual_points, reasoning], source_lan='English', target_lan='German')
        print(tr_points, '\n', tr_reasoning)
        with open(os.path.join(results_dir, 'prompt_de.txt'), 'w') as f:
            f.write(tr_points)
        with open(os.path.join(results_dir, 'prompt_reasoning_de.txt'), 'w') as f:
            f.write(tr_reasoning)

    if os.path.isdir(args.image_generator):
        generate_images_uno(visual_points, args.image_generator, args.image_gen_call, os.path.join(base_path, 'images_direct'), args.base_img, args.n_images, args.guidance, args.num_steps)
    else:
        if os.path.isdir(args.image_generator):
            raise NotImplementedError
        else:
            model = load_model_diffusers(args.image_generator)
            save_path = os.path.join(results_dir, f'img_{args.image_generator.split("/")[1]}_guid{args.guidance}_nsteps{args.num_steps}')
            generate_images_diffusers(visual_points, model, save_path, args.guidance, args.num_steps, args.n_images)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Process program and generate images using AI.")
    parser.add_argument("--input", type=str, default="contents/2025/kommunalomat_data.xlsx", help="Excel file with Kommunalomat data")
    parser.add_argument("--llm", type=str, default="Qwen/Qwen3-30B-A3B", help="Name of the LLM to use for reasoning")
    parser.add_argument("--n_points", type=int, default=5, help="Number of visual points to generate")

    parser.add_argument("--image_generator", type=str, default="black-forest-labs/FLUX.1-schnell", help="Either the path to UNO software, or model name")
    parser.add_argument("--uno_call", type=str, default='python3 inference.py --prompt "{prompt}" --image_paths "{base}" --save_path "{dir}" --num_images_per_prompt {n_img} --guidance {guid} --num_steps {nsteps}', help="UNO image generation call template")
    parser.add_argument("--base_img", type=str, default="contents/Herunterladen.jpg", help="Base image path")
    parser.add_argument("--guidance", type=float, default=0., help="Prompt guidance strength")
    parser.add_argument("--num_steps", type=int, default=5, help="Diffusion steps")
    parser.add_argument("--n_images", type=int, default=5, help="Number of images to create")

    args = parser.parse_args()
    
    if args.input.endswith('.xlsx'):
        process_kommunalomat(args)
    elif args.input.endswith('.pdf'):
        process_program(args)
    else:
        print("Unsupported input file type. Please provide a readable PDF or an Excel file with Kommunalomat data.")
        exit(1)
