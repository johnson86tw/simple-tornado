import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import path from "path";
import { genProofArgs, groth16 } from "../utils/snarks";

let Verifier: ContractFactory;
let verifier: Contract;

const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");

before(async () => {
  Verifier = await ethers.getContractFactory("Verifier");
});

// `beforeEach` will run before each `it(...)`
beforeEach(async function () {
  verifier = await Verifier.deploy();
  await verifier.deployed();
});

describe("#verifyProof", () => {
  it("should be verified", async function () {
    const input = { a: 4, b: 11 };
    let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
    const args = await genProofArgs(proof, publicSignals);
    expect(await verifier.verifyProof(...args)).to.equal(true);
  });
});
