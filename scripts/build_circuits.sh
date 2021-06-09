#!/bin/bash

# This file should be store in ./scripts of the project folder
# This script will build following files in the ./build/circuits
#
# circuit.r1cs
# circuit.sym
# circuit.wasm
# powersOfTau28_hez_final_11.ptau
# circuit_0000.zkey
# circuit_final.zkey
# verification_key.json

# constants
TARGET_CIRCUIT=../../circuits/test.circom
PTAU_FILE=powersOfTau28_hez_final_11.ptau
ENTROPY_FOR_ZKEY=mnbvc

cd "$(dirname "$0")"

# build directory ../build/circuits
if [[ -d ../build && -d ../build/circuits ]]; then
    echo "skip: ../biuld directory already exists"
else
    mkdir -p ../build
    mkdir -p ../build/circuits
fi

cd ../build/circuits

# generate circuit.r1cs & circuit.sym & circuit.wasm
if [[ -f ./circuit.r1cs && -f ./circuit.sym && -f ./circuit.wasm ]]; then
    echo "skip: circuit.r1cs & circuit.sym & circuit.wasm already exists"
else
    echo 'Generating circuit.r1cs & circuit.sym & circuit.wasm'
    circom $TARGET_CIRCUIT --r1cs circuit.r1cs --wasm circuit.wasm --sym circuit.sym
fi

# download $PTAU_FILE
if [ -f ./$PTAU_FILE ]; then
    echo skip: "$PTAU_FILE already exists"
else
    echo "Downloading $PTAU_FILE"
    wget https://hermez.s3-eu-west-1.amazonaws.com/$PTAU_FILE
fi

# generate circuit_0000.zkey
if [ -f ./circuit_0000.zkey ]; then
    echo skip: "circuit_0000.zkey already exists"
else
    echo "Generating circuit_0000.zkey"
    snarkjs zkey new circuit.r1cs $PTAU_FILE circuit_0000.zkey
fi

# generate circuit_final.zkey
if [ -f ./circuit_final.zkey ]; then
    echo skip: "circuit_final.zkey already exists"
else
    echo "Generating circuit_final.zkey"
    echo $ENTROPY_FOR_ZKEY | snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey
fi

# generate verification_key.json
if [ -f ./verification_key.json ]; then
    echo skip: "verification_key.json already exists"
else
    echo "Generating verification_key.json"
    snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
fi
