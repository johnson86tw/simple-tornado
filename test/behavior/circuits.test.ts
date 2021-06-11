import { expect } from "chai";
import path from "path";
import { MerkleTree } from "../../utils/merkleTree";
import { groth16, rbuffer, toBigIntLE, pedersenHash } from "../../utils/snarks";

const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

const wasmPath = path.join(__dirname, "../../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../../build/circuits/circuit_final.zkey");
const vkeyPath = path.join(__dirname, "../../build/circuits/verification_key.json");
const vkey = require(vkeyPath);

const rbuf = rbuffer(31);
const secret = toBigIntLE(rbuf).toString();
const commitment = pedersenHash(rbuf);
const leafIndex = 2;
const leaves = ["123", "456", commitment.toString(), "789"];
const tree = new MerkleTree(levels, leaves);
const merkleProof = tree.proof(leafIndex);

describe("circuits", () => {
  it("should be verified", async function () {
    const input = {
      secret,
      root: merkleProof.root,
      pathElements: merkleProof.pathElements,
      pathIndices: merkleProof.pathIndices,
    };

    let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);

    expect(await groth16.verify(vkey, publicSignals, proof)).to.equal(true);
  });
});
