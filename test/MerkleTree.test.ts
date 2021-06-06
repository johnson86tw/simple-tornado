import { expect } from "chai";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { toFixedHex } from "../utils/ethers";
import { shouldBehaveLikeMerkleTree } from "./merkleTree.behavior";

const circomlib = require("circomlib");
const mimcsponge = circomlib.mimcsponge;
const HasherPath = "../build/contracts/Hasher.json";

// return hex string with 0x
function hashLeftRight(left: string, right: string): string {
  return (
    "0x" + mimcsponge.multiHash([BigInt(left), BigInt(right)]).toString(16)
  );
}

let Hasher: ContractFactory;
let MerkleTree: ContractFactory;

let hasher: Contract;
let merkleTree: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  Hasher = await ethers.getContractFactory(
    require(HasherPath).abi,
    require(HasherPath).bytecode
  );
  MerkleTree = await ethers.getContractFactory("MerkleTree");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  hasher = await Hasher.deploy();
  merkleTree = await MerkleTree.deploy(4, hasher.address);
});

describe("#contructor", () => {
  it("should initialize", async () => {
    const zeroValue: BigNumber = await merkleTree.ZERO_VALUE();
    expect(await merkleTree.zeros(0)).to.equal(zeroValue);
    expect(await merkleTree.filledSubtrees(0)).to.equal(zeroValue);
  });
});

describe("#hashLeftRight", () => {
  it("should return MiMC multi-hash inside the field", async () => {
    const hash = await merkleTree.hashLeftRight(
      toFixedHex(123),
      toFixedHex(456)
    );
    expect(hash).to.equal(hashLeftRight("123", "456"));
  });
});

describe("merkleTreeUtil", () => {
  shouldBehaveLikeMerkleTree();
});

describe("#insert", () => {
  it("should insert", async () => {});
  it("should reject if tree is full", async () => {});
});

describe("#isKnownRoot", () => {
  it("should work", async () => {});
  it("should not return uninitialized roots", async () => {});
});
