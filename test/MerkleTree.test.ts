import { expect } from "chai";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { toFixedHex } from "../utils/ethers";
import { shouldBehaveLikeMerkleTree } from "./merkleTree.behavior";
import { MiMCSponge as hashLeftRight } from "../utils/merkleTree";

const HasherPath = "../build/contracts/Hasher.json";

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
    const left = toFixedHex(123);
    const right = toFixedHex(456);
    const hash = await merkleTree.hashLeftRight(left, right);

    expect(hash).to.equal(
      "0x" + BigInt(hashLeftRight(left, right)).toString(16)
    );
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
