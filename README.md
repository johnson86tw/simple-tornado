# Simple Tornado
This is a simple version of [Tornado Cash](https://tornado.cash/) which is a private transactions solution based on zkSNARKs. The project rewrites from [tornado-core](https://github.com/tornadocash/tornado-core), and it's suitable for a beginner to learn development of applications with Zero Knowledge Proofs.

## Tech Stack
- circom 0.5.45
- snarkjs 0.4.4
- circomlib 0.5.2
- solidity 0.7.0
- ethers: 5.0.26
- hardhat
- typescript

## Pre-requisites
- install Node.js with cmd `node`
- Install `circom` and `snarkjs` as global command-line
```
npm install -g circom
npm install -g snarkjs
```

## Build
- install dependencies
```
yarn
```
- pre-requisites: `circom` and `snarkjs` as global command-line

```
yarn build
```

## Test
- pre-requisites: run `yarn build` for circuits and Hasher.json
```
yarn test
```
or
```
npx hardhat test test/FILENAME.test.ts
```

## Questions
- why we need FIELD_SIZE and ZERO_VALUE in the merkle tree? (seems to be called "snark scalar field")
- Is it possible to have nullifier equal to secret? (this project implements like this but the original tornado-core divide nullifier and secret)