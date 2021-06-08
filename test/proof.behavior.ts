import { expect } from "chai";
import { toFixedHex } from "../utils/ethers";
import { MerkleTree, MiMCSponge } from "../utils/merkleTree";

const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 16;

export async function shouldBehaveLikeProof() {}
