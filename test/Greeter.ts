import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

let Greeter: ContractFactory;
let greeter: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  Greeter = await ethers.getContractFactory("Greeter");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

// `beforeEach` will run before each `it(...)`
beforeEach(async function () {
  greeter = await Greeter.deploy("Hello, world!");
  await greeter.deployed();
});

describe("Deployment", () => {
  it("Should return initial setting of greeter", async function () {
    expect(await greeter.greet()).to.equal("Hello, world!");
  });
});

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async () => {
    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
