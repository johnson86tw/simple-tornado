// @ts-ignore
import { groth16 } from "snarkjs";

export async function genProofArgs(proof: any, pub: any) {
  const calldata = await groth16.exportSolidityCallData(proof, pub);
  const args = JSON.parse("[" + calldata + "]");
  return args;
}
