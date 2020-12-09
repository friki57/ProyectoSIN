#!/bin/bash

# codigo para actualizar automaticamente el repositorio de github

git pull
npm i
npm rebuild
npm start
