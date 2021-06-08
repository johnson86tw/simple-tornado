import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
// @ts-ignore
import { groth16 } from "snarkjs";
import fs from "fs";
import path from "path";
import { unstringifyBigInts } from "../../utils/ethers";

let Verifier: ContractFactory;
let verifier: Contract;

const publicPath = path.join(__dirname, "../../build/public.json");
const proofPath = path.join(__dirname, "../../build/proof.json");

const pub = unstringifyBigInts(JSON.parse(fs.readFileSync(publicPath, "utf8")));
const proof = unstringifyBigInts(JSON.parse(fs.readFileSync(proofPath, "utf8")));

async function genProof(proof: any, pub: any) {
  const data = await groth16.exportSolidityCallData(proof, pub);
  let params = JSON.parse("[" + data + "]");
  return params;
}

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
    const params = await genProof(proof, pub);
    expect(await verifier.verifyProof(...params)).to.equal(true);
  });
});
