#! /bin/bash

for p in "contents/2020/spd/program.pdf" "contents/2020/cdu/program.pdf" "contents/2020/linke/program.pdf" "contents/2020/gruene/program.pdf" "contents/2020/fdp/program.pdf"
do
    # for b in "contents/reinoldi.jpg" "contents/Herunterladen.jpg" "contents/stadtpanorama_volkswohlbund_01_roland_gorecki_1.jpg"
    # do
    #     for g in "1" "10" "100" "1000" "10000"
    #     do
    for n in "1" "5" "20"
    do
        python3 src/main.py --input $p --guidance 0.0 --num_steps $n
    done
    #     done
    # done
done