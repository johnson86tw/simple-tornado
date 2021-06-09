# Simple Tornado

## Tech Stack
- circom 0.5.45
- snarkjs 0.4.4
- circomlib 0.5.2
- solidity 0.7.0
- ethers: 5.0.26
- hardhat: 2.0.8

## Build
```
yarn build
```
- To build circuits, you should install circom and snark in npm global for cmd like `circom` and `snarkjs` at first.

## Test
```
yarn test
```
or
```
npx hardhat test test/TEST_FILENAME
```
- you should compile Hasher contract at first.


## Questions
- why we need FIELD_SIZE and ZERO_VALUE in the merkle tree? (seems to be called "snark scalar field")