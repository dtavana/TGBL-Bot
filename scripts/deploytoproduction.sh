#!/bin/bash
cd ~/Coding/TS/BoatWatcher || exit
git pull
git checkout master
docker-compose up -d --build
