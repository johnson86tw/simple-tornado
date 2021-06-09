// @ts-ignore
import { groth16 } from "snarkjs";
import path from "path";

const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");
const vkey = require("../build/circuits/verification_key.json");

async function genProofArgs(proof: any, pub: any) {
  const calldata = await groth16.exportSolidityCallData(proof, pub);
  const args = JSON.parse("[" + calldata + "]");
  return args;
}

const input = { a: 2, b: 11 };

(async () => {
  console.log("input: ", input);
  const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
  console.log("pub: ", publicSignals);
  const isValid = await groth16.verify(vkey, ["22"], proof);

  console.log("isValid: ", isValid);
  process.exit(0);
})();

export { genProofArgs };
