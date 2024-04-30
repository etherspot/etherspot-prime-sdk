const { ethers } = require("ethers");

// Define types
const ModeCode = ethers.utils.Bytes32;
const CallType = ethers.utils.Bytes1;
const ExecType = ethers.utils.Bytes1;
const ModeSelector = ethers.utils.Bytes4;
const ModePayload = ethers.utils.Bytes22;

// Define constants
const CALLTYPE_SINGLE = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x00), 1);
const CALLTYPE_BATCH = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x01), 1);
const CALLTYPE_STATIC = ethers.utils.hexZeroPad(ethers.utils.hexlify(0xFE), 1);
const CALLTYPE_DELEGATECALL = ethers.utils.hexZeroPad(ethers.utils.hexlify(0xFF), 1);

const EXECTYPE_DEFAULT = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x00), 1);
const EXECTYPE_TRY = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x01), 1);

const MODE_DEFAULT = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x00000000), 4);

// Helper function to encode mode
function encodeMode(callType, execType, modeSelector, modePayload) {
    return ethers.utils.concat([callType, execType, modeSelector, modePayload]);
}

// Encode Simple Batch mode
function encodeSimpleBatch() {
    const modePayload = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x00), 22);
    return encodeMode(CALLTYPE_BATCH, EXECTYPE_DEFAULT, MODE_DEFAULT, modePayload);
}

// Encode Simple Single mode
function encodeSimpleSingle() {
    const modePayload = ethers.utils.hexZeroPad(ethers.utils.hexlify(0x00), 22);
    return encodeMode(CALLTYPE_SINGLE, EXECTYPE_DEFAULT, MODE_DEFAULT, modePayload);
}

function encodeSingle(target, value, callData) {
    // Encode parameters using ethers.js
    const userOpCalldata = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "bytes"],
      [target, value, callData]
    );
    
    return userOpCalldata;
  }
  