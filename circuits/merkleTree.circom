include "../node_modules/circomlib/circuits/mimcsponge.circom";

template HashLeftRight() {
    signal input left;
    signal input right;
    signal output hash;

    component hasher = MiMCSponge(2, 220, 1);
    hasher.ins[0] <== left;
    hasher.ins[1] <== right;
    hasher.k <== 0;

    hash <== hasher.outs[0];
}

// if s == 0 returns [in[0], in[1]]
// if s == 1 returns [in[1], in[0]]
template Selector() {
	signal input in[2];
	signal input indice;
	signal output outs[2];

	indice * (1 - indice) === 0; // constrain s equal to 0 or 1
	outs[0] <== (in[1] - in[0]) * indice + in[0];
	outs[1] <== (in[0] - in[1]) * indice + in[1];
}

template MerkleTreeCheck(levels) {
	signal input leaf;
	signal input root;
	signal input pathElements[levels];
	signal input pathIndices[levels];

	component hashers[levels];
	component selectors[levels];

	for (var i = 0; i < levels; i++) {
		selectors[i] = Selector();
		selectors[i].in[0] <== i == 0 ? leaf : hashers[i - 1].hash;
		selectors[i].in[1] <== pathElements[i];
		selectors[i].indice <== pathIndices[i];

		hashers[i] = HashLeftRight();
		hashers[i].left <== selectors[i].outs[0];
		hashers[i].right <== selectors[i].outs[1];
	}

	root === hashers[levels - 1].hash;
}