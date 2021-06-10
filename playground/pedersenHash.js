const circomlib = require("circomlib");
const crypto = require("crypto");

/** Generate random buffer of specified byte length */
const rbuffer = nbytes => crypto.randomBytes(nbytes);

/** Compute pedersen hash */
const pedersenHash = data => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

/** Must use toBigInt 'LE' to generate same result in circom pedersen */
const rbuf = rbuffer(31);
console.log("secret: ", toBigIntLE(rbuf).toString());
const commitment3 = pedersenHash(rbuf);
console.log("commitment3: ", commitment3.toString());

// source: https://github.com/no2chem/bigint-buffer/blob/c4d61b5c4fcaab36c55130840e906c162dfce646/src/index.ts#L25
function toBigIntLE(buf) {
  const reversed = Buffer.from(buf);
  reversed.reverse();
  const hex = reversed.toString("hex");
  if (hex.length === 0) {
    return BigInt(0);
  }
  return BigInt(`0x${hex}`);
}
