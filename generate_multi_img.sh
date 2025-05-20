#! /bin/bash
for g in "1" "10" "100" "1000"
do
    for n in "15" "25" "35"
    do
        python3 src/main.py --guidance $g --num_steps $n
    done
done