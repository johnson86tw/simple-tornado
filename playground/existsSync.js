const fs = require("fs");
const path = require("path");

const hasherPath = path.join(__dirname, "..", "build/contracts/Hasher.json");
console.log(hasherPath);

if (fs.existsSync(hasherPath)) {
  console.log("exist");
}
