import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export function formatEther(bigN: BigNumber): string {
  return ethers.utils.formatEther(bigN);
}

export async function getBalance(address: string): Promise<BigNumber> {
  return await ethers.provider.getBalance(address);
}

export function toFixedHex(number: number | string, length = 32) {
  let str = BigNumber.from(number).toHexString();
  str = str.slice(2); // strip 0x prefix
  while (str.length < length * 2) {
    str = "0" + str;
  }
  str = "0x" + str;
  return str;
}
