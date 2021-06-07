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

// source: https://github.com/iden3/ffjavascript/blob/master/src/utils_bigint.js
export function unstringifyBigInts(o: any): any {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res: any = {};
    const keys = Object.keys(o);
    keys.forEach(k => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}
