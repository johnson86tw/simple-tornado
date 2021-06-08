import { MerkleTree } from "../utils/merkleTree";

const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 16;

const tree = new MerkleTree(levels);

export async function shouldBehaveLikeProof() {
  it("#test", async () => {});
}
