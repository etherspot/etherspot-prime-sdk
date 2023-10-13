export const ECDSAKernelFactoryAbi = [
    {
      inputs: [
        {
          internalType: "contract KernelFactory",
          name: "_singletonFactory",
          type: "address",
        },
        {
          internalType: "contract ECDSAValidator",
          name: "_validator",
          type: "address",
        },
        {
          internalType: "contract IEntryPoint",
          name: "_entryPoint",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "createAccount",
      outputs: [
        {
          internalType: "contract EIP1967Proxy",
          name: "proxy",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "entryPoint",
      outputs: [
        {
          internalType: "contract IEntryPoint",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "getAccountAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "singletonFactory",
      outputs: [
        {
          internalType: "contract KernelFactory",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "validator",
      outputs: [
        {
          internalType: "contract ECDSAValidator",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;