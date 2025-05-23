import argparse
import os
import subprocess

from llm import translate_pdf, summarize_content, reason_about_impact_points, impact_point_comparison_analysis


def run_gen_ai(prompt, image_gen_path, image_gen_call, save_path, base_img, n_images=2, guidance=10, num_steps=25):
    subdir = os.path.join(save_path, f'img_{os.path.basename(base_img).split(".")[0]}_guid{guidance}_nsteps{num_steps}')
    os.makedirs(subdir)
    image_gen_call = image_gen_call.format(prompt=prompt, base=base_img, dir=subdir, n_img=n_images, guid=guidance, nsteps=num_steps)
    print(image_gen_call)
    exitcode = subprocess.run(image_gen_call, shell=True, cwd=image_gen_path)
    if exitcode.returncode != 0:
        print("Error in generating image")
        return False
    return True


def process_program(input, image_gen_path, image_gen_call, base_imgs, n_images, guidance, num_steps):
    if os.path.isfile(input):
        # initialize subfolder structure
        base_path = os.path.dirname(input)
        for dirname in ['images', 'prompts']:
            if not os.path.exists(os.path.join(base_path, dirname)):
                os.makedirs(os.path.join(base_path, dirname))
        # translate and summarize the content and analyze key impact points
        translated_content = translate_pdf(input)
        summary = summarize_content(translated_content, input)
        key_points, reasoning = reason_about_impact_points(summary, input)
    elif os.path.isdir(input):
        # find and compare key impact points in the subfolders
        analysis = impact_point_comparison_analysis(input)
        print(analysis)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process program and generate images using AI.")
    parser.add_argument("--input", type=str, default="contents/2020", help="Either a single program (PDF) or a folder containing previously processed programs")
    # image arguments
    parser.add_argument("--uno_path", type=str, default="/home/fischer/repos/UNO", help="Path to UNO image generation")
    parser.add_argument("--uno_call", type=str, default='python3 inference.py --prompt "{prompt}" --image_paths "{base}" --save_path "{dir}" --num_images_per_prompt {n_img} --guidance {guid} --num_steps {nsteps}', help="UNO image generation call template")
    parser.add_argument("--base_img", type=str, default="contents/Herunterladen.jpg", help="Base image path")
    parser.add_argument("--n_images", type=int, default=3, help="Number of images to create")
    parser.add_argument("--guidance", type=int, default=10, help="Prompt guidance strength")
    parser.add_argument("--num_steps", type=int, default=25, help="Diffusion steps")

    args = parser.parse_args()

    process_program(
        args.input,
        args.uno_path,
        args.uno_call,
        os.path.join(os.path.dirname(os.path.dirname(__file__)), args.base_img),
        args.n_images,
        args.guidance,
        args.num_steps
    )




# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# ARTICLE = """ New York (CNN)When Liana Barrientos was 23 years old, she got married in Westchester County, New York.
# A year later, she got married again in Westchester County, but to a different man and without divorcing her first husband.
# Only 18 days after that marriage, she got hitched yet again. Then, Barrientos declared "I do" five more times, sometimes only within two weeks of each other.
# In 2010, she married once more, this time in the Bronx. In an application for a marriage license, she stated it was her "first and only" marriage.
# Barrientos, now 39, is facing two criminal counts of "offering a false instrument for filing in the first degree," referring to her false statements on the
# 2010 marriage license application, according to court documents.
# Prosecutors said the marriages were part of an immigration scam.
# On Friday, she pleaded not guilty at State Supreme Court in the Bronx, according to her attorney, Christopher Wright, who declined to comment further.
# After leaving court, Barrientos was arrested and charged with theft of service and criminal trespass for allegedly sneaking into the New York subway through an emergency exit, said Detective
# Annette Markowski, a police spokeswoman. In total, Barrientos has been married 10 times, with nine of her marriages occurring between 1999 and 2002.
# All occurred either in Westchester County, Long Island, New Jersey or the Bronx. She is believed to still be married to four men, and at one time, she was married to eight men at once, prosecutors say.
# Prosecutors said the immigration scam involved some of her husbands, who filed for permanent residence status shortly after the marriages.
# Any divorces happened only after such filings were approved. It was unclear whether any of the men will be prosecuted.
# The case was referred to the Bronx District Attorney\'s Office by Immigration and Customs Enforcement and the Department of Homeland Security\'s
# Investigation Division. Seven of the men are from so-called "red-flagged" countries, including Egypt, Turkey, Georgia, Pakistan and Mali.
# Her eighth husband, Rashid Rajput, was deported in 2006 to his native Pakistan after an investigation by the Joint Terrorism Task Force.
# If convicted, Barrientos faces up to four years in prison.  Her next court appearance is scheduled for May 18.
# """
# # Read the content of the PDF file
# reader = PdfReader(os.path.join(base_path, 'program.pdf'))
# contents = []
# for p_idx, page in enumerate(reader.pages):
#     text = page.extract_text().replace('\n', '\n ')
#     if len(text) > 1000:
#         result = summarizer(text, max_length=500, min_length=100, do_sample=False)
#         contents.append(result[0]['summary_text'])
#         break

# model_id = "CompVis/stable-diffusion-v1-4"
# device = "cuda"

# pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
# pipe = pipe.to(device)

# prompt = f"Erstelle ein realistisches Bild von Dortmund basierend auf folgenden Informationen: {contents[0]}"
# image = pipe(prompt).images[0]
# image.save(os.path.join(base_path, 'images', "ai_v0.png"))

