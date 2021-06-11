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
- install Node.js.
- Install circom and snarkjs.
```
npm install -g circom
npm install -g snarkjs
```

## Build
- install dependencies
```
yarn
```
- To build circuits, you should install circom and snark in npm global for cmd like `circom` and `snarkjs` at first.

```
yarn build
```

## Test
- total 78.73 seconds

```
yarn test
```
or
```
npx hardhat test test/FILENAME.test.ts
```
- pre-request: build Verifier.sol and Hasher.json by `yarn build` at first.

## Questions
- why we need FIELD_SIZE and ZERO_VALUE in the merkle tree? (seems to be called "snark scalar field")