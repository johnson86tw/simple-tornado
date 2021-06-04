import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// @ts-ignore
import { groth16 } from "snarkjs";
import fs from "fs";
import path from "path";
import { unstringifyBigInts } from "../utils/ethers";

let Verifier: ContractFactory;
let verifier: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

const publicPath = path.join(__dirname, "public.json");
const proofPath = path.join(__dirname, "proof.json");

const pub = unstringifyBigInts(JSON.parse(fs.readFileSync(publicPath, "utf8")));
const proof = unstringifyBigInts(
  JSON.parse(fs.readFileSync(proofPath, "utf8"))
);

before(async () => {
  Verifier = await ethers.getContractFactory("Verifier");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

// `beforeEach` will run before each `it(...)`
beforeEach(async function () {
  verifier = await Verifier.deploy();
  await verifier.deployed();
});

describe("Verify proof", () => {
  it("Should return true", async function () {
    const s = await groth16.exportSolidityCallData(proof, pub);
    let params = JSON.parse("[" + s + "]");
    const isVerified = await verifier.verifyProof(...params);
    expect(isVerified).to.equal(true);
  });
});
