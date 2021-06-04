import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
const { utils, BigNumber } = ethers;
import { toFixedHex } from "../utils/ethers";

let Hasher: ContractFactory;
let MerkleTreeWithHistory: ContractFactory;

let hasher: Contract;
let merkleTreeWithHistory: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  Hasher = await ethers.getContractFactory(
    require("../Hasher.json").abi,
    require("../Hasher.json").bytecode
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
  it("should test", async () => {});
});
