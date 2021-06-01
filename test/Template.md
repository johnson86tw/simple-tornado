# Test Template

```ts
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

let Test: ContractFactory;
let test: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  Test = await ethers.getContractFactory("Test");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  test = await Test.deploy();
});

describe("Test", () => {
  it("should test", async () => {});
});

```