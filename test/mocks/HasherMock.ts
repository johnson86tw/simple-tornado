import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { toFixedHex } from "../../utils/ethers";
import fs from "fs";
import path from "path";

const { BigNumber } = ethers;
const circomlib = require("circomlib");
const mimcsponge = circomlib.mimcsponge;
const hashPath = path.join(
  __dirname,
  "..",
  "..",
  "build/contracts/Hasher.json"
);

let Hasher: ContractFactory;
let HasherMock: ContractFactory;

let hasher: Contract;
let hasherMock: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  if (!fs.existsSync(hashPath)) {
    throw new Error(
      "you should run `node ./scripts/compileHasher.js` for Hasher's abi and bytecode"
    );
  }

  Hasher = await ethers.getContractFactory(
    require(hashPath).abi,
    require(hashPath).bytecode
  );
  HasherMock = await ethers.getContractFactory("HasherMock");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  hasher = await Hasher.deploy();
  hasherMock = await HasherMock.deploy(hasher.address);
});

describe("Hasher", () => {
  it("should return MiMC multi-hash of 123 and 456", async () => {
    const hash = await hasherMock.hashLeftRight(
      toFixedHex(123),
      toFixedHex(456)
    );

    function hashLeftRight(left: number, right: number) {
      return mimcsponge.multiHash([BigInt(left), BigInt(right)]).toString();
    }

    expect(hash).to.equal(
      BigNumber.from(hashLeftRight(123, 456)).toHexString()
    );
  });
});
