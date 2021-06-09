// @ts-ignore
import { groth16 } from "snarkjs";

async function genProofArgs(proof: any, pub: any) {
  proof = unstringifyBigInts(proof);
  pub = unstringifyBigInts(pub);
  const calldata = await groth16.exportSolidityCallData(proof, pub);
  const args = JSON.parse("[" + calldata + "]");
  return args;
}

// source: https://github.com/iden3/ffjavascript/blob/master/src/utils_bigint.js
function unstringifyBigInts(o: any): any {
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

export { genProofArgs, unstringifyBigInts, groth16 };
