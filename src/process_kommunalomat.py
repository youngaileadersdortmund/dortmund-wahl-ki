import os

import argparse
import pandas as pd
import numpy as np

from llm import translate, reason_about_visual_points
from images import generate_images_uno, generate_images_diffusers


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


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Process program and generate images using AI.")
    parser.add_argument("--input", type=str, default="contents/2025/kommunalomat_data.xlsx", help="Excel file with Kommunalomat data")

    parser.add_argument("--image_generator", type=str, default="black-forest-labs/FLUX.1-schnell", help="Either the path to UNO software, or model name")
    parser.add_argument("--uno_call", type=str, default='python3 inference.py --prompt "{prompt}" --image_paths "{base}" --save_path "{dir}" --num_images_per_prompt {n_img} --guidance {guid} --num_steps {nsteps}', help="UNO image generation call template")
    parser.add_argument("--base_img", type=str, default="contents/Herunterladen.jpg", help="Base image path")
    parser.add_argument("--n_images", type=int, default=5, help="Number of images to create")
    parser.add_argument("--guidance", type=float, default=0., help="Prompt guidance strength")
    parser.add_argument("--num_steps", type=int, default=5, help="Diffusion steps")

    args = parser.parse_args()
    image_gen, image_gen_call, base_img, n_images, guidance, num_steps = args.image_generator, args.uno_call, args.base_img, args.n_images, args.guidance, args.num_steps
    
    base_path = os.path.dirname(args.input)
    per_party = translate_kommunalomat(args.input)

    for party, responses in per_party.items():
        responses = '\n\n'.join(responses)
        
        # create directories
        for dirname in ['images_kommunalomat', 'prompts']:
            if not os.path.exists(os.path.join(base_path, party, dirname)):
                os.makedirs(os.path.join(base_path, party,dirname))

        with open(os.path.join(base_path, party, 'kommunalomat_responses.txt'), 'w') as f:
            f.write(responses)

        # generate prompt and images
        visual_points, reasoning = reason_about_visual_points(responses, os.path.join(base_path, party, 'dummy.txt'), out_fname='kommunalomat_visual_points.txt', type_of_input='open election compass answers')
        if os.path.isdir(image_gen):
            generate_images_uno(visual_points, image_gen, image_gen_call, os.path.join(base_path, 'images_direct'), base_img, n_images, guidance, num_steps)
        else:
            generate_images_diffusers(visual_points, image_gen, os.path.join(base_path, 'images_direct'), guidance, num_steps, n_images)
