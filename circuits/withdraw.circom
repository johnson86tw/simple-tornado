include "../node_modules/circomlib/circuits/pedersen.circom";
include "../node_modules/circomlib/circuits/bitify.circom";
include "./merkleTree.circom";

template CommitmentHasher() {
    signal input secret;
    signal output commitment;

    component hasher = Pedersen(248);
    component secretBits = Num2Bits(248);
    secretBits.in <== secret;

    for (var i = 0; i < 248; i++) {
        hasher.in[i] <== secretBits.out[i];
    }

    commitment <== hasher.out[0];
}

template Withdraw(levels) {
    signal input root;
    signal private input secret;
    signal private input pathElements[levels];
    signal private input pathIndices[levels];

    component hasher = CommitmentHasher();
    hasher.secret <== secret;

    component tree = MerkleTreeCheck(levels);
    tree.leaf <== hasher.commitment;
    tree.root <== root;
    
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }
}

component main = Withdraw(20);