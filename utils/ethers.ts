import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import type { TransactionReceipt } from "@ethersproject/abstract-provider";

export function formatEther(bigN: BigNumber): string {
  return ethers.utils.formatEther(bigN);
}

export async function getBalance(address: string): Promise<BigNumber> {
  return await ethers.provider.getBalance(address);
}

/** BigNumber to hex string of specified length */
export function toFixedHex(number: number | string, length = 32) {
  const str = BigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

/**
 * Parses transaction events from the logs in a transaction receipt
 * @param {TransactionReceipt} receipt Transaction receipt containing the events in the logs
 * @returns {{[eventName: string]: TransactionEvent}}
 */
// export function getTransactionEvents(receipt: TransactionReceipt): { [eventName: string]: TransactionEvent } {
//   const txEvents: { [eventName: string]: TransactionEvent } = {};

//   // for each log in the transaction receipt
//   for (const log of receipt.logs) {
//     // for each event in the ABI
//     for (const abiEvent of Object.values(this.contract.interface.events)) {
//       // if the hash of the ABI event equals the tx receipt log
//       if (abiEvent.topics[0] == log.topics[0]) {
//         // Parse the event from the log topics and data
//         txEvents[abiEvent.name] = abiEvent.parse(log.topics, log.data);

//         // stop looping through the ABI events
//         break;
//       }
//     }
//   }

//   return txEvents;
// }
