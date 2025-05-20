#! /bin/bash
for b in "contents/reinoldi.jpg" "contents/Herunterladen.jpg" "contents/stadtpanorama_volkswohlbund_01_roland_gorecki_1.jpg"
do
    for g in "1" "10" "100" "1000"
    do
        for n in "15" "25" "35"
        do
            python3 src/main.py --guidance $g --num_steps $n --base_img $b --base_path $1
        done
    done
done