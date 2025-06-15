#! /bin/bash

if [[-d "src/frontent/public/content" ]]; then
    rm -rf src/frontent/public/content
fi 

cp content ./src/frontend/public

cd src/frontend

npm install 

npm run build
