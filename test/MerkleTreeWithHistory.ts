import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
const { utils, BigNumber } = ethers;
import { toFixedHex } from "../utils/ethers";
const circomlib = require("circomlib");
const mimcsponge = circomlib.mimcsponge;

function hashLeftRight(left: number, right: number) {
  return mimcsponge.multiHash([BigInt(left), BigInt(right)]).toString();
}

let Hasher: ContractFactory;
let MerkleTreeWithHistory: ContractFactory;

let hasher: Contract;
let merkleTreeWithHistory: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

const HasherPath = "../build/contracts/Hasher.json";

before(async () => {
  Hasher = await ethers.getContractFactory(
    require(HasherPath).abi,
    require(HasherPath).bytecode
  );
  MerkleTreeWithHistory = await ethers.getContractFactory(
    "MerkleTreeWithHistory"
  );
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  hasher = await Hasher.deploy();
  merkleTreeWithHistory = await MerkleTreeWithHistory.deploy(hasher.address);
});

describe("Hasher", () => {
  it("should return MiMC hash of 123 and 456", async () => {
    const hash = await merkleTreeWithHistory.hashLeftRight(
      toFixedHex(123),
      toFixedHex(456)
    );
    expect(hash).to.equal(
      BigNumber.from(hashLeftRight(123, 456)).toHexString()
    );
  });
});
