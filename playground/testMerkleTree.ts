import { MerkleTree, MiMCSponge } from "../utils/merkleTree";

const leaves = [12, 13, 14, 15, 16, 17, 18, 19, 20].map((e) => e.toString());
const batchTree = new MerkleTree(16, leaves);

const tree = new MerkleTree(16);
leaves.forEach((leaf) => {
  tree.insert(leaf);
});

for (let i = 0; i < leaves.length; i++) {
  console.log(batchTree.proof(i));
  console.log(tree.proof(i));
}
