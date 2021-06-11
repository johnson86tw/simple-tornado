import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import path from "path";
import { MerkleTree } from "../utils/merkleTree";
import { groth16, rbuffer, toBigIntLE, pedersenHash, genProofArgs } from "../utils/circuit";

let Verifier: ContractFactory;
let verifier: Contract;

const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");

const rbuf = rbuffer(31);
const secret = toBigIntLE(rbuf).toString();
const commitment = pedersenHash(rbuf);
const leafIndex = 2;
const leaves = ["123", "456", commitment.toString(), "789"];
const tree = new MerkleTree(levels, leaves);
const merkleProof = tree.proof(leafIndex);

before(async () => {
  Verifier = await ethers.getContractFactory("Verifier");
});

// `beforeEach` will run before each `it(...)`
beforeEach(async function () {
  verifier = await Verifier.deploy();
  await verifier.deployed();
});

describe("Verifier #verifyProof", () => {
  it("should be verified", async function () {
    const input = {
      secret,
      root: merkleProof.root,
      pathElements: merkleProof.pathElements,
      pathIndices: merkleProof.pathIndices,
    };

    let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
    const args = await genProofArgs(proof, publicSignals);
    expect(await verifier.verifyProof(...args)).to.equal(true);
  });
});
