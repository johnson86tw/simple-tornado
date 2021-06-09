const circomlib = require("circomlib");
const crypto = require("crypto");

/** Generate random number of specified byte length */
const rbigint = nbytes => BigInt("0x" + crypto.randomBytes(nbytes).toString("hex"));

/** Compute pedersen hash */
const pedersenHash = data => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

console.log(rbigint(32));

console.log(pedersenHash("a"));
console.log("0x" + BigInt(pedersenHash("a")).toString(16));
