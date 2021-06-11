import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory, utils } from "ethers";
import { ethers } from "hardhat";
const { provider } = ethers;
import { toFixedHex } from "../utils/ethers";
import { MerkleTree } from "../utils/merkleTree";
import { genProofArgs, groth16, pedersenHash, rbuffer, toBigIntLE } from "../utils/circuit";
import path from "path";

// build
const HasherPath = "../build/contracts/Hasher.json";
const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");

// env
const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;
const denomination = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

// contract
let [Hasher, Verifier, Tornado]: ContractFactory[] = [];
let [hasher, verifier, tornado]: Contract[] = [];
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
    await expect(tornado.deposit(commitment, { value: utils.parseEther("1") })).to.emit(tornado, "Deposit");
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

describe("#withdraw", () => {
  it("should work", async () => {
    const privateTransactionAmount = utils.parseEther("1.0");

    const randomBuf = rbuffer(31);
    const secret = toBigIntLE(randomBuf);
    const commitment = pedersenHash(randomBuf).toString();
    const tree = new MerkleTree(levels);

    tree.insert(commitment);
    const txResponse = await tornado.deposit(toFixedHex(commitment), { value: privateTransactionAmount });
    const txReceipt = await txResponse.wait();
    const depositEvents = txReceipt.events?.filter((x: any) => {
      return x.event === "Deposit";
    });
    const leafIndex = depositEvents[0].args.leafIndex;
    const merkleProof = tree.proof(leafIndex);

    expect(await tornado.isKnownRoot(toFixedHex(tree.root()))).to.equal(true);

    const input = {
      secret: secret.toString(),
      root: tree.root(),
      pathElements: merkleProof.pathElements,
      pathIndices: merkleProof.pathIndices,
    };

    const nullifierHash = secret;

    let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
    const proofArgs = await genProofArgs(proof, publicSignals);
    const args = [
      toFixedHex(tree.root()),
      toFixedHex(nullifierHash.toString()),
      signers[1].address,
      signers[0].address,
      0,
      0,
    ];

    const before = await provider.getBalance(signers[1].address);
    await tornado.withdraw(...proofArgs, ...args);
    const after = await provider.getBalance(signers[1].address);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
    expect(await tornado.isSpent(toFixedHex(nullifierHash.toString()))).to.equal(true);
    // should prevent double spend
    await expect(tornado.withdraw(...proofArgs, ...args)).to.be.revertedWith("The note has been already spent");
  });
});
