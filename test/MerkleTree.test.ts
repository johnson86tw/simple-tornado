import { expect } from "chai";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { toFixedHex } from "../utils/ethers";
import { shouldBehaveLikeMerkleTree } from "./behavior/merkleTree.behavior";
import { MerkleTree as MerkleTreeUtil, MiMCSponge as hashLeftRight } from "../utils/merkleTree";

const HasherPath = "../build/contracts/Hasher.json";
const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

let Hasher: ContractFactory;
let MerkleTree: ContractFactory;

let hasher: Contract;
let merkleTree: Contract;

before(async () => {
  Hasher = await ethers.getContractFactory(require(HasherPath).abi, require(HasherPath).bytecode);
  MerkleTree = await ethers.getContractFactory("MerkleTreeMock");
});

beforeEach(async function () {
  hasher = await Hasher.deploy();
  merkleTree = await MerkleTree.deploy(levels, hasher.address);
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

    expect(hash).to.equal("0x" + BigInt(hashLeftRight(left, right)).toString(16));
  });
});

describe("merkleTreeUtil", () => {
  shouldBehaveLikeMerkleTree();
});

describe("#insert", () => {
  it("should insert", async () => {
    const tree = new MerkleTreeUtil(levels);

    for (let i = 0; i < 10; i++) {
      await merkleTree.insert(toFixedHex(i));
      tree.insert(i.toString());
      expect(await merkleTree.getLastRoot()).to.equal(BigNumber.from(tree.root()));
    }
  });

  it("should reject if tree is full", async () => {
    const levels = 6;
    const merkleTree = await MerkleTree.deploy(levels, hasher.address);

    for (let i = 0; i < 2 ** levels; i++) {
      await merkleTree.insert(toFixedHex(i + 42));
    }

    // note: 'await' must be moved outside the 'expect' when using reverted or revertedWith
    await expect(merkleTree.insert(toFixedHex(2046))).to.be.revertedWith(
      "Merkle tree is full. No more leaf can be added",
    );
    await expect(merkleTree.insert(toFixedHex(1345))).to.be.revertedWith(
      "Merkle tree is full. No more leaf can be added",
    );
  });
});

describe("#isKnownRoot", () => {
  it("should check outdated root", async () => {
    const tree = new MerkleTreeUtil(levels);
    for (let i = 0; i < 5; i++) {
      await merkleTree.insert(toFixedHex(i));
      tree.insert(i.toString());
      expect(await merkleTree.isKnownRoot(toFixedHex(tree.root()))).to.equal(true);
    }

    await merkleTree.insert(toFixedHex(42));
    expect(await merkleTree.isKnownRoot(toFixedHex(tree.root()))).to.equal(true);
  });

  it("should not return uninitialized roots", async () => {
    await merkleTree.insert(toFixedHex(42));
    expect(await merkleTree.isKnownRoot(toFixedHex(0))).to.equal(false);
  });
});
