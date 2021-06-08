import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory, utils } from "ethers";
import { ethers } from "hardhat";
import { toFixedHex } from "../utils/ethers";
import { shouldBehaveLikeProof } from "./proof.behavior";

const HasherPath = "../build/contracts/Hasher.json";
const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;
const denomination = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

let Hasher: ContractFactory;
let Verifier: ContractFactory;
let Tornado: ContractFactory;

let hasher: Contract;
let verifier: Contract;
let tornado: Contract;

let signers: SignerWithAddress[];

before(async () => {
  Hasher = await ethers.getContractFactory(require(HasherPath).abi, require(HasherPath).bytecode);
  Verifier = await ethers.getContractFactory("Verifier");
  Tornado = await ethers.getContractFactory("ETHTornado");
  signers = await ethers.getSigners();
});

beforeEach(async function () {
  hasher = await Hasher.deploy();
  verifier = await Verifier.deploy();
  tornado = await Tornado.deploy(verifier.address, denomination, levels, hasher.address);
});

describe("#constructor", () => {
  it("should initialize ", async () => {
    expect(await tornado.denomination()).to.equal(denomination);
  });
});

describe("#deposit", () => {
  it("should emit event", async () => {
    const commitment = toFixedHex(42);
    await expect(await tornado.deposit(commitment, { value: utils.parseEther("1") })).to.emit(tornado, "Deposit");
  });

  it("should revert if there is a such commitment", async () => {
    const commitment = toFixedHex(42);
    await tornado.deposit(commitment, { value: utils.parseEther("1") });
    await expect(tornado.deposit(commitment, { value: utils.parseEther("1") })).to.be.revertedWith(
      "The commitment has been submitted",
    );
  });

  it("should revert if ETH amount not equal to denomination", async () => {
    const commitment = toFixedHex(42);
    await expect(tornado.deposit(commitment, { value: utils.parseEther("2") })).to.be.revertedWith(
      "Please send `mixDenomination` ETH along with transaction",
    );
  });
});

describe("snark proof verification on js side", () => {
  shouldBehaveLikeProof();
});

describe("#withdraw", () => {
  it("should work", async () => {});
});
