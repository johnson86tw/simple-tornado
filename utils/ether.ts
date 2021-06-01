import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export function formatEther(bigN: BigNumber): string {
  return ethers.utils.formatEther(bigN);
}

export async function getBalance(address: string): Promise<BigNumber> {
  return await ethers.provider.getBalance(address);
}
