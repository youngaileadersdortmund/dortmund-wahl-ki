#! /bin/bash

# pdf programs
for p in "contents/2025/cdu/program.pdf" "contents/2025/spd/program.pdf" "contents/2025/linke/program.pdf" "contents/2025/gruene/program.pdf" "contents/2025/fdp/program.pdf"
do
    python3 src/main.py --input $p
done

# kommunalomat programs
python src/main.py