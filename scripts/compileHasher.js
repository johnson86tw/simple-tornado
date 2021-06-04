// Generates Hasher artifact at compile-time using Truffle's external compiler
// mechanism
const path = require("path");
const fs = require("fs");
const genContract = require("circomlib/src/mimcsponge_gencontract.js");

const contractPath = "build/contracts";
const outputPath = path.join(__dirname, "..", contractPath, "Hasher.json");

function main() {
  const contract = {
    contractName: "Hasher",
    abi: genContract.abi,
    bytecode: genContract.createCode("mimcsponge", 220),
  };

  if (!fs.existsSync(contractPath)) {
    fs.mkdirSync(contractPath, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(contract));
}

main();
