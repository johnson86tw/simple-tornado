import { expect } from "chai";
import { toFixedHex } from "../../utils/ethers";
import { MerkleTree, MiMCSponge } from "../../utils/merkleTree";

const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

describe("merkleTree.ts", () => {
  it("index_to_key", async () => {
    expect(MerkleTree.indexToKey(2, 4)).to.equal("2-4");
  });

  it("should insert and verify proof", async () => {
    const tree = new MerkleTree(2);
    tree.insert(toFixedHex("5"));
    const { root, pathElements } = tree.proof(0);
    const calculatedRoot = MiMCSponge(MiMCSponge("5", pathElements[0]), pathElements[1]);
    expect(root).to.equal(calculatedRoot);
  });

  it("creation odd elements count", async () => {
    const leaves = [12, 13, 14, 15, 16, 17, 18, 19, 20].map(e => e.toString());
    const tree = new MerkleTree(levels);
    leaves.forEach(leaf => {
      tree.insert(leaf);
    });
    const batchTree = new MerkleTree(levels, leaves);

    for (let i = 0; i < leaves.length; i++) {
      expect(tree.proof(i)).to.deep.equal(batchTree.proof(i));
    }
  });

  it("creation even elements count", async () => {
    const leaves = [12, 13, 14, 15, 16, 17].map(e => e.toString());
    const tree = new MerkleTree(levels);
    leaves.forEach(leaf => {
      tree.insert(leaf);
    });
    const batchTree = new MerkleTree(levels, leaves);

    for (let i = 0; i < leaves.length; i++) {
      expect(tree.proof(i)).to.deep.equal(batchTree.proof(i));
    }
  });

  it("should find an element", async () => {
    const leaves = [12, 13, 14, 15, 16, 17, 18, 19, 20].map(e => e.toString());
    const tree = new MerkleTree(levels);
    leaves.forEach(leaf => {
      tree.insert(leaf);
    });

    let index = tree.getIndex("13");
    expect(index).to.equal(1);

    index = tree.getIndex("19");
    expect(index).to.equal(7);

    index = tree.getIndex("12");
    expect(index).to.equal(0);

    index = tree.getIndex("20");
    expect(index).to.equal(8);

    index = tree.getIndex("42");
    expect(index).to.equal(-1);
  });
});
