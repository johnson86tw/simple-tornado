const ethers = require("ethers");
const { utils, BigNumber } = ethers;

const s = "tornado";
const FIELD_SIZE =
  "21888242871839275222246405745257275088548364400416034343698204186575808495617";

console.log(
  BigNumber.from(utils.keccak256(utils.toUtf8Bytes(s)))
    .mod(BigNumber.from(FIELD_SIZE))
    .toString()
);

// ZERO_VALUE = 21663839004416932945382355908790599225266501822907911457504978515578255421292;
