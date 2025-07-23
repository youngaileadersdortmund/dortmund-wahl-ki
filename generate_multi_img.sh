#! /bin/bash

# python3 src/main.py --input contents/2025

for p in "contents/2025/cdu/program.pdf" "contents/2025/spd/program.pdf" "contents/2025/linke/program.pdf" "contents/2025/gruene/program.pdf" "contents/2025/fdp/program.pdf"
do
    # for b in "contents/reinoldi.jpg" "contents/Herunterladen.jpg" "contents/stadtpanorama_volkswohlbund_01_roland_gorecki_1.jpg"
    # do
    #     for g in "1" "10" "100" "1000" "10000"
    #     do
    python3 src/process.py --input $p
    #     done
    # done
done