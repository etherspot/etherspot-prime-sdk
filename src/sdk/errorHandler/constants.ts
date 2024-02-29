export const errorMsg = {
    '429': 'Rate limit exceeded for the given bundler api key. Please contact bundler team for increasing bandwidth.', // Rate limit quota execeeded
    '-32521': 'Check for balance in your Smart wallet', // execution reverted
    '-32500': `Please make sure you have enough funds for wallet creation.`, // transaction rejected by entryPoint's simulateValidation, during wallet creation or validation
    '-32501': `Check paymaster data`,  // transaction rejected by paymaster's validatePaymasterUserOp
    '-32502': 'If using skandha bundler or the default one, please report this issue on https://github.com/etherspot/skandha/issues or ticket on https://discord.etherspot.io', //transaction rejected because of opcode validation
    '-32503': 'validUntil and validAfter cannot be past timestamps', // UserOperation out of time-range
    '-32504': 'This paymaster is not whitelisted on current bundler, contact bundler team to whitelist', // transaction rejected because paymaster (or signature aggregator) is throttled/banned
    '-32505': 'Factory or Wallet or Paymaster not staked or unstake-delay is too low. Try with another entity', // transaction rejected because some entity (or signature aggregator) stake or unstake-delay is too low
    '-32506': 'Please create an issue https://github.com/etherspot/etherspot-prime-sdk/issues or ticket on https://discord.etherspot.io', // transaction rejected because wallet specified unsupported signature aggregator
    '-32507': 'Please create an issue https://github.com/etherspot/etherspot-prime-sdk/issues or ticket on https://discord.etherspot.io', // transaction rejected because of wallet signature check failed (or paymaster signature, if the paymaster uses its data as signature)
    '1': 'Make sure the sdk fn called has valid parameters', // sdk Validation errors,
    '400': 'Either the bundler url is unreachable or the api key rate limit has reached. Please contact support for more info', // Bundler using ethers package returning SERVER_ERROR
    '404': 'The request sent has reached timeout. Check your internet access or the bundler url if using etherspot bundler, the rate limit might be reached Please contact support for more info', // ethers package 
    '-429': 'Rate limit exceeded for the given bundler api key. Please contact bundler team for increasing bandwidth.', // Rate limit quota execeeded
}

export const entryPointErrorMsg = {
    'AA10 sender already constructed': 'The sender was already created, so the initCode does not need to be run. This error may occur if you attempt to create an account multiple times',
    'AA13 initCode failed or OOG': 'The initCode failed to create the account or ran out of gas. "OOG" is an abbreviation for Out-Of-Gas. Check the amount of gas consumed, and then verify the initCode or the factory contract is correct',
    'AA14 initCode must return sender': 'The initCode does not return the sender address. Check the initCode or the factory contract',
    'AA15 initCode must create sender': 'The initCode in the user operation does not create an account. Check the initCode or the factory contract',
    'AA20 account not deployed': 'The sender of the user operation is not deployed and there is no initCode specified. If this is the first transaction by this account make sure an initCode is included. Otherwise, check that the correct sender address is specified and is an ERC-4337 account',
    "AA21 didn't pay prefund": `The sender did not have enough to prefund the EntryPoint for the user operation. If you are using a paymaster, the paymasterAndData field is likely not set. If you aren't using a paymaster, the address of the sender does not have enough gas token. After the user operation is executed, the remainder of the prefund is credited back to the sender`,
    'AA22 expired or not due': 'The signature is not valid because it is outside of the specified time range',
    'AA23 reverted (or OOG)': `The sender does not have sufficient native tokens to cover the User Operation's gas costs. If you intended to use a Paymaster for sponsorship, ensure that the paymasterAndData field of the user operation is correctly set to enable proper handling of gas fees`,
    'AA24 signature error': `Check the signature field of the user operation. It may be in an incompatible format`,
    'AA25 invalid account nonce': 'The nonce is invalid. The user operation may be re-using an old nonce, or formatted the nonce incorrectly',
    'AA30 paymaster not deployed': 'The paymaster address specified by paymasterAndData contains no code. Check that the first characters of the paymasterAndData field are the paymaster address you intend to use',
    'AA31 paymaster deposit too low': `The paymaster is out of funds. More gas tokens must be deposited into the EntryPoint for the paymaster. This is usually done by calling the paymaster contract's deposit function. If you are using a paymaster service, contact them immediately`,
    'AA32 paymaster expired or not due': `The paymaster's signature is not valid because it is outside of the specified time range`,
    'AA33 reverted (or OOG)': `The paymaster validation was rejected or ran out of gas. "OOG" is an abbreviation for Out-Of-Gas. First check the paymaster's signature in paymasterAndData. If the signature is correct, the verificationGasLimit may be too low`,
    'AA34 signature error': `The paymaster's signature is invalid. Check the format of the signature in paymasterAndData`,
    'AA40 over verificationGasLimit': `The verification gas limit was exceeded. Check the verificationGasLimit in your user operation`,
    'AA41 too little verificationGas': `Verifying the user operation took too much gas and did not complete. You may need to increase verificationGasLimit`,
    'AA50 postOp reverted': `After the user operation was completed, the execution of additional logic by the EntryPoint reverted`,
    'AA51 prefund below actualGasCost': `The actual cost of the user operation is higher than the total amount of gas approved. The prefund is the amount that the EntryPoint is allowed to execute the user operation. After the user operation is executed, the remainder of the prefund is credited back to the sender`,
}