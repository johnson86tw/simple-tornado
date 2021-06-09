import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export function formatEther(bigN: BigNumber): string {
  return ethers.utils.formatEther(bigN);
}

export async function getBalance(address: string): Promise<BigNumber> {
  return await ethers.provider.getBalance(address);
}

/** BigNumber to hex string of specified length */
export function toFixedHex(number: number | string, length = 32) {
  const str = BigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}
