#! /bin/bash

# pdf programs
for m in "translate" "summarize" "reason" "translate_results" "generate_images"
do
    python3 src/main.py --mode $m --output_dir src/frontend/public/political_content_dortmund_2025_all
done
