# dortmund-wahl-ki - GenAI for Dortmund Elections

#### We asked AI – How is Dortmund 2025 changing through politics?
This project explores how generative AI can support **political education** and **local voter engagement** in Dortmund. Using party programs and survey responses, we analyze content with large language models, generate visualizations of political visions, and make the results accessible via our [public webpage](https://dortmund-wahl-ki.de)!

If you want to learn more about this project and its background, you can read our [publicly available research paper](https://arxiv.org/abs/2510.11749). As part of the global [Young AI Leaders](https://aiforgood.itu.int/young-ai-leaders-community/) community, our initiative promotes **UN SDG 4: Quality Education** through the transparent use of AI. 

## 🚀 Running the AI

We implemented a central [main.py](src/main.py) script that allows to perform all the processing in individual steps. The [run_ai.sh](run_ai.sh) script gives an idea of how these steps connect to each other. 

If you want to run our solution locally, you can follow the steps below. Note we used AI models with up to 30B parameters, requiring a certain amount of processing power and VRAM. 

1. Clone the repository:
    ```bash
    git clone https://github.com/youngaileadersdortmund/dortmund-wahl-ki.git
    cd dortmund-wahl-ki
    ```

2. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Create a `programs` folder and use it to store the political programs that shall be analyzed.

4. Run the AI pipeline:

    ```bash
    for m in "translate" "summarize" "reason" "translate_results" "generate_images"
    do
        python3 src/main.py --mode $m --input_dir programs --output_dir [your directory]
    done
    ```

## 🌐 Launching the Webpage Locally

The project includes a Docker setup for running our webpage locally.

1. Make sure [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) are installed.

2. From the project root, start the containers:

```bash
docker compose up
```

3. Open http://localhost:3000 in your browser.

## 📖 About the Project

- Data Sources: Party election programs and [Kommunalomat](https://xn--whlt-loa.nrw/start/kommunalomat/) responses (obtained from Jugendring Dortmund).

- Models:

    - [Qwen3-30B-A3B](https://huggingface.co/Qwen/Qwen3-30B-A3B) for analysis & reasoning

    - [FLUX.1 [schnell]](https://huggingface.co/black-forest-labs/FLUX.1-schnell) for image generation

    - [BART](https://huggingface.co/facebook/bart-large-cnn) for text summarization

    - [TowerInstruct-13B](https://huggingface.co/Unbabel/TowerInstruct-13B-v0.1) for translation

This project is experimental and aims to stimulate discourse. **It is not a voting recommendation.**

## 📬 Contact and Use

This project was conducted by the Young AI Leaders - Dortmund Hub.
If you use or refer to our work, please link back to us, for example via the following Bibtex entries:

```bibtex
@misc{yail_dortmund_wahl_ki,
      title={Benefits and Limitations of Using {GenAI} for Political Education and Municipal Elections}, 
      author={Raphael Fischer and Youssef Abdelrahim and Katharina Poitz},
      year={2025},
      eprint={2510.11749},
      doi={10.48550/arXiv.2510.11749},
      url={https://arxiv.org/abs/2510.11749}, 
}
```

```bibtex
@misc{yail_dortmund_politics_2025,
  author       = {Raphael Fischer and Nico Koltermann and Jan Krawiec and Louisa von Essen and Youssef Abdelrahim and Tareq Khouja},
  title        = {{Young} {AI} {Leaders} - {GenAI} for {Dortmund} {Elections}},
  year         = {2025},
  howpublished = {https://dortmund-wahl-ki.de},
  note         = {Experimental project applying generative AI for political education and local elections in Dortmund}
}
```

If you have any feedback or questions, feel free to reach out!
- 🌍 [Website](https://youngaileaders-dortmund.de/)
- 🔗 [LinkedIn](https://www.linkedin.com/company/young-ai-leaders-dortmund/)
- 📧 dortmundhub.youngaileaders [at] gmail.com

© Young AI Leaders - Dortmund Hub
