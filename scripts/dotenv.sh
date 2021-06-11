#!/bin/bash

cd "$(dirname "$0")"

cd ..

if [ -f .env ]; then
  # Load Environment Variables
  export $(grep -v '^#' .env | xargs)
  # For instance, will be example_kaggle_key
  echo $ETH_AMOUNT
fi
