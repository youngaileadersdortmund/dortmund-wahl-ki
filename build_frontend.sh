#! /bin/bash

if [ -d "src/frontent/public/contents" ]; then
    rm -rf src/frontent/public/contents
fi 

cp -r ./contents/ ./src/frontend/public/

cd src/frontend

npm install 

npm run build
