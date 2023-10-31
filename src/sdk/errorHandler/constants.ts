export const errorMsg = {
    '-32521': 'Check for balance in your Smart wallet', // execution reverted
    '-32500': `Please make sure you have enough funds for wallet creation.`, // transaction rejected by entryPoint's simulateValidation, during wallet creation or validation
    '-32501': `Check paymaster data`,  // transaction rejected by paymaster's validatePaymasterUserOp
    '-32502': 'Try with another bundler', //transaction rejected because of opcode validation
    '-32503': 'Try with valid validUntil and validAfter values', // UserOperation out of time-range
    '-32504': 'Try changing the bundler which accepts this paymaster', // transaction rejected because paymaster (or signature aggregator) is throttled/banned
    '-32505': 'Paymaster not staked or unstake-delay is too low. Try with another paymaster', // transaction rejected because paymaster (or signature aggregator) stake or unstake-delay is too low
    '-32506': null, // transaction rejected because wallet specified unsupported signature aggregator
    '-32507': null, // transaction rejected because of wallet signature check failed (or paymaster signature, if the paymaster uses its data as signature)
    '1': 'Make sure the sdk fn called has valid parameters', // sdk Validation errors
}