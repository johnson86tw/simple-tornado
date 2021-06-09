// Generates Hasher artifact at compile-time using Truffle's external compiler
// mechanism
const path = require("path");
const fs = require("fs");
const genContract = require("circomlib/src/mimcsponge_gencontract.js");

const outputPath = path.join(__dirname, "..", "build/contracts/Hasher.json");

function main() {
  const contract = {
    contractName: "Hasher",
    abi: genContract.abi,
    bytecode: genContract.createCode("mimcsponge", 220),
  };

  fs.writeFileSync(outputPath, JSON.stringify(contract));
  console.log("success: ./build/contracts/Hasher.json");
}

main();
