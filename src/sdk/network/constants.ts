import { NetworkConfig } from ".";

export enum NetworkNames {
  Goerli = 'goerli',
  Mumbai = 'mumbai',
  BaseGoerli = 'baseGoerli',
  Sepolia = 'sepolia',
  Optimism = 'optimism',
  Polygon = 'polygon',
  Arbitrum = 'arbitrum',
  ArbitrumGoerli = 'arbitrumGoerli',
  Chiado = 'chiado',
  Fuse = 'fuse',
  FuseSparknet = 'fuseSparknet',
  Gnosis = 'gnosis',
  KromaTestnet = 'kromaTestnet',
  Mainnet = 'mainnet',
  OptimismGoerli = 'optimismGoerli',
  RSKTestnet = 'RSKTestnet',
  VerseTestnet = 'verseTestnet',
  Mantle = 'Mantle',
  MantleTestnet = 'MantleTestnet',
  Avalanche = 'avalanche',
  Base = 'base',
  Bsc = 'bsc',
  BscTestnet = 'bscTestnet',
  Fuji = 'fuji',
  Linea = 'linea',
  LineaTestnet = 'lineaTestnet',
  FlareTestnet = 'flareTestnet',
  Flare = 'flare',
  ScrollSepolia = 'scrollSepolia',
  Scroll = 'scroll',
  Klaytn = 'klaytn',
  KlaytnTestnet = 'klaytnTestnet',
}

export const SupportedNetworks =
  [1, 5, 10, 14, 31, 56, 97, 100, 114, 122, 123, 137, 420, 1001, 2357, 5000, 5001, 8217, 8453, 10200, 20197, 42161, 43113, 43114, 59140, 59144, 80001, 84531, 421613, 534351, 534352, 11155111]

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Goerli]: 5,
  [NetworkNames.Mumbai]: 80001,
  [NetworkNames.BaseGoerli]: 84531,
  [NetworkNames.Sepolia]: 11155111,
  [NetworkNames.Optimism]: 10,
  [NetworkNames.Polygon]: 137,
  [NetworkNames.Arbitrum]: 42161,
  [NetworkNames.ArbitrumGoerli]: 421613,
  [NetworkNames.Chiado]: 10200,
  [NetworkNames.Fuse]: 122,
  [NetworkNames.FuseSparknet]: 123,
  [NetworkNames.Gnosis]: 100,
  [NetworkNames.KromaTestnet]: 2357,
  [NetworkNames.Mainnet]: 1,
  [NetworkNames.OptimismGoerli]: 420,
  [NetworkNames.RSKTestnet]: 31,
  [NetworkNames.VerseTestnet]: 20197,
  [NetworkNames.Mantle]: 5000,
  [NetworkNames.MantleTestnet]: 5001,
  [NetworkNames.Avalanche]: 43114,
  [NetworkNames.Base]: 8453,
  [NetworkNames.Bsc]: 56,
  [NetworkNames.BscTestnet]: 97,
  [NetworkNames.Fuji]: 43113,
  [NetworkNames.Linea]: 59144,
  [NetworkNames.LineaTestnet]: 59140,
  [NetworkNames.FlareTestnet]: 114,
  [NetworkNames.Flare]: 14,
  [NetworkNames.ScrollSepolia]: 534351,
  [NetworkNames.Scroll]: 534352,
  [NetworkNames.Klaytn]: 8217,
  [NetworkNames.KlaytnTestnet]: 1001,
};

export const onRamperAllNetworks = ['OPTIMISM', 'POLYGON', 'ARBITRUM', 'FUSE', 'GNOSIS', 'ETHEREUM']

export const Networks: {
  [key: string]: NetworkConfig
} = {
  [5]: {
    chainId: 5,
    bundler: 'https://goerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  },
  [1001]: {
    chainId: 1001,
    bundler: 'https://klaytntestnet-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  }, 
  [80001]: {
    chainId: 80001,
    bundler: 'https://mumbai-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  },
  [84531]: {
    chainId: 84531,
    bundler: 'https://basegoerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  },
  [11155111]: {
    chainId: 11155111,
    bundler: 'https://sepolia-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [10]: {
    chainId: 10,
    bundler: 'https://rpc.etherspot.io/optimism?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [137]: {
    chainId: 137,
    bundler: 'https://rpc.etherspot.io/polygon?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [42161]: {
    chainId: 42161,
    bundler: 'https://rpc.etherspot.io/arbitrum?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [8217]: {
    chainId: 8217,
    bundler: 'https://klaytn-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [1]: {
    chainId: 1,
    bundler: 'https://rpc.etherspot.io/ethereum?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [421613]: {
    chainId: 421613,
    bundler: 'https://arbitrumgoerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  },
  [10200]: {
    chainId: 10200,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  },
  [122]: {
    chainId: 122,
    bundler: 'https://rpc.etherspot.io/fuse?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [123]: {
    chainId: 123,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [100]: {
    chainId: 100,
    bundler: 'https://rpc.etherspot.io/gnosis?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [2357]: {
    chainId: 2357,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [420]: {
    chainId: 420,
    bundler: 'https://optimismgoerli-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io',
  },
  [31]: {
    chainId: 31,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [20197]: {
    chainId: 20197,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [5000]: {
    chainId: 5000,
    bundler: 'https://rpc.etherspot.io/mantle?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [5001]: {
    chainId: 5001,
    bundler: 'https://mantletestnet-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: '',
  },
  [43114]: {
    chainId: 43114,
    bundler: 'https://rpc.etherspot.io/avalanche?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io'
  },
  [8453]: {
    chainId: 8453,
    bundler: 'https://rpc.etherspot.io/base?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: ''
  },
  [56]: {
    chainId: 56,
    bundler: 'https://rpc.etherspot.io/bnb?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'etherspot.pillarproject.io'
  },
  [97]: {
    chainId: 97,
    bundler: 'https://bnbtestnet-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io'
  },
  [43113]: {
    chainId: 43113,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: 'qa-etherspot.pillarproject.io'
  },
  [59144]: {
    chainId: 59144,
    bundler: 'https://rpc.etherspot.io/linea?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: ''
  },
  [59140]: {
    chainId: 59140,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: ''
  },
  [114]: {
    chainId: 114,
    bundler: 'https://flaretestnet-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '',
      }
    },
    graphqlEndpoint: ''
  },
  [14]: {
    chainId: 14,
    bundler: 'https://rpc.etherspot.io/flare?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: ''
  },
  [534351]: {
    chainId: 534351,
    bundler: 'https://scrollsepolia-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: ''
  },
  [534352]: {
    chainId: 534352,
    bundler: 'https://rpc.etherspot.io/scroll?api-key=',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: {
        etherspot: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
        zeroDev: '',
        simpleAccount: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    },
    graphqlEndpoint: ''
  },
};

interface ISafeConstant {
  MultiSend: Record<string, string>;
}

export const Safe: ISafeConstant = {
  // From https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/multi_send.json
  MultiSend: {
    "1": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "3": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "5": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "10": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "12": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "18": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "25": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "28": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "39": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "40": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "41": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "50": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "51": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "56": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "61": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "63": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "69": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "82": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "83": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "97": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "100": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "106": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "108": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "122": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "123": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "137": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "246": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "250": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "300": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "321": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "322": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "336": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "338": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "420": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "588": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "592": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "595": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "599": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "686": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "787": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1088": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1101": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1112": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1115": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1116": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1284": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1285": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1287": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1294": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1807": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1984": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2019": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2020": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2221": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2222": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "3737": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4689": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "4918": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4919": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "5001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7341": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "7700": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8217": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "9000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "9001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "9728": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10200": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11235": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11437": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "12357": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "23294": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "42161": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42170": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42220": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "43113": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "43114": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "43288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "44787": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "45000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "47805": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "54211": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "56288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "59140": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "71401": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "71402": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "73799": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "80001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "84531": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "200101": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "200202": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "333999": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421611": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421613": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534353": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11155111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "245022926": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1313161554": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1313161555": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1666600000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1666700000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11297108099": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11297108109": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  },
};

export const KERNEL_IMPL_ADDRESS = "0xf048AD83CB2dfd6037A43902a2A5Be04e53cd2Eb";
export const KERNEL_VALIDATOR_ADDRESS = "0xd9AB5096a832b9ce79914329DAEE236f8Eea0390";

export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } = Object.entries(
  NETWORK_NAME_TO_CHAIN_ID,
).reduce(
  (result, [networkName, chainId]) => ({
    ...result,
    [chainId]: networkName,
  }),
  {},
);

export function getNetworkConfig(key: number) {
  return Networks[key];
}
