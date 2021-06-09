#!/bin/bash

# This file should be store in ./scripts of the project folder
# This script will build following files in the ./build/contracts
#
# Verifier.sol

cd "$(dirname "$0")"

# check directory ../build/contracts
if [ -d ../build ]; then
  if [ -d ../build/contracts ]; then
    echo "skip: ../biuld and ../build/contracts already exists"
  else
    mkdir ../build/contracts
  fi
else
  mkdir -p ../build
  mkdir -p ../build/contracts
fi

cd ../build/contracts

# check Verifier.sol
if [ -f ../circuits/circuit_final.zkey ]; then
  if [ -f ./Verifier.sol ]; then
    echo "skip: ./build/contracts/Verifier.sol already exists"
  else
    snarkjs zkey export solidityverifier ../circuits/circuit_final.zkey Verifier.sol
    echo "success: ./build/contracts/Verifier.sol"
  fi
else
  echo "Fail: circuit_final.zkey not found"
fi

# check Hasher.json
if [ -f ./Hasher.json ]; then
  echo "skip: ./build/contracts/Hasher.json already exists"
else
  node ../../scripts/compileHasher.js
fi
