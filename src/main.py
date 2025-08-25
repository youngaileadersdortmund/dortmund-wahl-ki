import os

import argparse
import pandas as pd
import numpy as np
from llm import load_llm, load_translation_model, translate, translate_pdf, reason_about_visual_points, summarize_content
from images import load_model_diffusers, generate_images_diffusers
import glob


def translate_kommunalomat(model, fname, output_dir, only_approved=True):
    translation_fname = os.path.join(output_dir, os.path.basename(fname.replace('.xlsx', '_translated.txt')))

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
        translated = translate(model, questions)
        df = df.rename({q: qf for q, qf in zip(df.columns[question_cols], translated)}, axis=1)

        # Translate responses
        all_responses = []
        for col in response_cols:
            all_responses.extend(df.iloc[:, col].dropna().tolist())
        translated = translate(model, all_responses, source_lan='German', target_lan='English')
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
                if not only_approved or 'Approval' in score:
                    party_results.append(f'{question}:\n{score} - {reasoning}\n')
            results.append(f'Party {party_idx}\n\n' + '\n'.join(party_results))

        results = '\n\n\n'.join(results)
        with open(translation_fname, 'w') as f:
            f.write(results)

        print(f"Created translation file {translation_fname}")

    per_party = [party_response.split('\n\n')[1:] for party_response in results.split('\n\n\n')]
    # synch with party identifiers, manually read from excel
    per_party = {p: r for p, r in zip(['tierschutz', 'diepartei', 'spd', 'linke', 'cdu', 'gruene', 'bvt', 'fdp', 'bli', 'volt'], per_party)}
    for p, r in per_party.items():
        out_dir = os.path.join(output_dir, p)
        os.makedirs(out_dir, exist_ok=True)
        out_file = os.path.join(out_dir, "kommunalomat_responses_en.txt")
        with open(out_file, "w") as f:
            f.write('\n\n'.join(r))
        print(f"Wrote kommunalomat results for {p} to {out_file}")
    return per_party


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Iterative processing of party programs.")
    parser.add_argument("--mode", type=str, default='translate', choices=["translate", "summarize", "reason", "translate_results", "generate_images"], help="Processing mode")
    parser.add_argument("--input_dir", type=str, default="programs", help="Directory containing party program pdfs")
    parser.add_argument("--output_dir", type=str, default="src/frontend/public/political_content_dortmund_2025_all", help="Output directory for results")
    # reasoning
    parser.add_argument("--llm", type=str, default="Qwen/Qwen3-30B-A3B", help="Name of the LLM to use for reasoning")
    parser.add_argument("--n_points", type=int, default=5, help="Number of visual points to generate")
    # image generation
    parser.add_argument("--image_generator", type=str, default="black-forest-labs/FLUX.1-schnell", help="Model name or path for image generation")
    parser.add_argument("--guidance", type=float, default=0., help="Prompt guidance strength")
    parser.add_argument("--num_steps", type=int, default=5, help="Diffusion steps")
    parser.add_argument("--n_images", type=int, default=5, help="Number of images to create")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    party_dirs = [d for d in os.listdir(args.output_dir) if os.path.isdir(os.path.join(args.output_dir, d))]

    if args.mode == "translate":
        print('TRANSLATING KOMMUNALOMAT')
        model = load_translation_model()

        # translate kommunalomat data
        komm_data = os.path.join(args.input_dir, "kommunalomat_data.xlsx")
        komm_translations = translate_kommunalomat(model, komm_data, args.output_dir)

        # translate pdfs
        print('TRANSLATING PROGRAMS')
        pdfs = glob.glob(os.path.join(args.input_dir, "*.pdf"))
        for pdf_path in pdfs:
            party = os.path.splitext(os.path.basename(pdf_path))[0]
            out_dir = os.path.join(args.output_dir, party)
            os.makedirs(out_dir, exist_ok=True)
            out_file = os.path.join(out_dir, "program_en.txt")
            if os.path.isfile(out_file):
                print(f"{out_file} already exists, skipping.")
                continue
            print(f"Translating {pdf_path} -> {out_file}")
            translated = translate_pdf(model, pdf_path)
            with open(out_file, "w") as f:
                f.write(translated)

    elif args.mode == "summarize":
        print('SUMMARIZING PROGRAMS')
        for party in party_dirs:
            in_file = os.path.join(args.output_dir, party, "program_en.txt")
            out_file = os.path.join(args.output_dir, party, "program_sum.txt")
            if not os.path.isfile(in_file):
                print(f"{in_file} not found, skipping.")
                continue
            if os.path.isfile(out_file):
                print(f"{out_file} already exists, skipping.")
                continue
            print(f"Summarizing {in_file} -> {out_file}")
            with open(in_file, "r") as f:
                content = f.read()
            summary = summarize_content(content, in_file)
            with open(out_file, "w") as f:
                f.write(summary)

    elif args.mode == "reason":
        print('REASONING ABOUT VISUAL POINTS')
        dirname = f'p{args.n_points}_{args.llm.replace("/", "_")}'
        llm = load_llm(args.llm)
        for party in party_dirs:
            for in_file, out_points, input_type in [("program_sum.txt", "program", "election program summary"), ("kommunalomat_responses_en.txt", "kommunalomat", "open election compass answers")]:
                in_file_full = os.path.join(args.output_dir, party, in_file)
                out_points_full = os.path.join(args.output_dir, party, f'results_{dirname}_{out_points}',  "prompt.txt")
                out_reasoning = out_points_full.replace('.txt', '_reasoning.txt')
                if not os.path.isfile(in_file_full):
                    print(f"{in_file_full} not found, skipping.")
                    continue
                if os.path.isfile(out_points) and os.path.isfile(out_reasoning):
                    print(f"{out_points} and {out_reasoning} already exist, skipping.")
                    continue
                print(f"Reasoning for {party} {input_type}")
                with open(in_file_full, "r") as f:
                    input = f.read()
                visual_points, reasoning = reason_about_visual_points(llm, input, type_of_input=input_type, n_points=args.n_points)
                os.makedirs(os.path.dirname(out_points_full), exist_ok=True)
                with open(out_points_full, "w") as f:
                    f.write(visual_points)
                with open(out_reasoning, "w") as f:
                    f.write(reasoning)

    elif args.mode == "translate_results":
        print('TRANSLATING REASONING RESULTS TO GERMAN')
        model = load_translation_model()

        for root, dirs, files in os.walk(args.output_dir):
            for input_fname in files:
                if os.path.basename(input_fname) in ["prompt.txt", "prompt_reasoning.txt"]:
                    out_name = os.path.join(root, input_fname.replace('.txt', '_de.txt'))
                    if os.path.isfile(out_name):
                        print(f"{out_name} already exists, skipping.")
                        continue        
                    print(f"Translating results for {os.path.join(root, input_fname)}")
                    with open(os.path.join(root, input_fname), "r") as f:
                        input = f.read().split('\n')
                    translated = translate(model, input)
                    if isinstance(translated, list):
                        translated = '\n'.join(translated)
                    with open(out_name, "w") as f:
                        f.write(translated)

    elif args.mode == "generate_images":
        print('GENERATING IMAGES FOR VISUAL POINTS')
        model = load_model_diffusers(args.image_generator)
    
        for root, dirs, files in os.walk(args.output_dir):
            for input_fname in files:
                if os.path.basename(input_fname) == "prompt.txt":
                    with open(os.path.join(root, input_fname), "r") as f:
                        input = f.read()
                    save_path = os.path.join(root, f'img_{args.image_generator.split("/")[-1]}_guid{args.guidance}_nsteps{args.num_steps}')
                    if os.path.exists(save_path):
                        print(f"{save_path} already exists, skipping.")
                        continue
                    print(f"Generating images for {save_path}")
                    generate_images_diffusers(model, input, save_path, args.guidance, args.num_steps, args.n_images)
