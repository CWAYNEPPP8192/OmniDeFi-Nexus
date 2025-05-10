/**
 * Chain configuration with router and approval contract addresses
 * Used for cross-chain gasless swaps feature
 */

export interface ChainConfig {
  id: string;
  name: string;
  routerAddress: string;
  approvalAddress: string;
  isMainnet: boolean;
  explorerUrl: string;
  symbol: string;
  decimals: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Configuration for all supported chains
export const chainConfigs: Record<string, ChainConfig> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    routerAddress: "0x156ACd2bc5fC336D59BAAE602a2BD9b5e20D6672",
    approvalAddress: "0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f",
    isMainnet: true,
    explorerUrl: "https://etherscan.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    routerAddress: "0x5E8DF5b010D57e525562791717011D496676552A",
    approvalAddress: "0x3B86917369B83a6892f553609F3c2F439C184e31",
    isMainnet: true,
    explorerUrl: "https://polygonscan.com",
    symbol: "MATIC",
    decimals: 18,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18
    }
  },
  solana: {
    id: "solana",
    name: "Solana",
    routerAddress: "6m2CDdhRgxpH4WjvdzxAYbGxwdGUz5MziiL5jek2kBma",
    approvalAddress: "", // Solana uses a different approval mechanism
    isMainnet: true,
    explorerUrl: "https://explorer.solana.com",
    symbol: "SOL",
    decimals: 9,
    nativeCurrency: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9
    }
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche C-Chain",
    routerAddress: "0x38575264810371c15f0e5744fa2ab29cdef7245d",
    approvalAddress: "0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f",
    isMainnet: true,
    explorerUrl: "https://snowtrace.io",
    symbol: "AVAX",
    decimals: 18,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18
    }
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum One",
    routerAddress: "0x01D8EDB8eF96119d6Bada3F50463DeE6fe863B4C",
    approvalAddress: "0x70cBb871E8f30Fc8Ce23609E9E0Ea87B6b222F58",
    isMainnet: true,
    explorerUrl: "https://arbiscan.io",
    symbol: "ARB",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  base: {
    id: "base",
    name: "Base",
    routerAddress: "0x3D98f6F05E7940c056788Ff8492A943A0904240D",
    approvalAddress: "0x57df6092665eb6058DE53939612413ff4B09114E",
    isMainnet: true,
    explorerUrl: "https://basescan.org",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  bnb: {
    id: "bnb",
    name: "BNB Chain",
    routerAddress: "0xc44Ad35B5A41C428c0eAE842F20F84D1ff6ed917",
    approvalAddress: "0x2c34A2Fb1d0b4f55de51E1d0bDEfaDDce6b7cDD6",
    isMainnet: true,
    explorerUrl: "https://bscscan.com",
    symbol: "BNB",
    decimals: 18,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    }
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    routerAddress: "0x88156aAe243D7E2f8D92965581Ff169183D8355e",
    approvalAddress: "0x68D6B739D2020067D1e2F713b999dA97E4d54812",
    isMainnet: true,
    explorerUrl: "https://optimistic.etherscan.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  zksync: {
    id: "zksync",
    name: "zkSync Era",
    routerAddress: "0x6945C67f153a50fD0041c2F786664D89D0cC28Cb",
    approvalAddress: "0xc67879F4065d3B9fe1C09EE990B891Aa8E3a4c2f",
    isMainnet: true,
    explorerUrl: "https://explorer.zksync.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  linea: {
    id: "linea",
    name: "Linea",
    routerAddress: "0x7A7AD9aa93cd0A2D0255326E5Fb145CEc14997FF",
    approvalAddress: "0x57df6092665eb6058DE53939612413ff4B09114E",
    isMainnet: true,
    explorerUrl: "https://lineascan.build",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  mantle: {
    id: "mantle",
    name: "Mantle",
    routerAddress: "0x411d2C093e4c2e69Bf0D8E94be1bF13DaDD879c6",
    approvalAddress: "0x57df6092665eb6058DE53939612413ff4B09114E",
    isMainnet: true,
    explorerUrl: "https://explorer.mantle.xyz",
    symbol: "MNT",
    decimals: 18,
    nativeCurrency: {
      name: "Mantle",
      symbol: "MNT",
      decimals: 18
    }
  },
  scroll: {
    id: "scroll",
    name: "Scroll",
    routerAddress: "0x88EDbF47032fB84E45D6CD6d8199F28C7aa77076",
    approvalAddress: "0x57df6092665eb6058DE53939612413ff4B09114E",
    isMainnet: true,
    explorerUrl: "https://scrollscan.com",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  manta: {
    id: "manta",
    name: "Manta",
    routerAddress: "0x4f06A83A803029b3f01c401f2d8b8E82f099f3D4", 
    approvalAddress: "0x57df6092665eb6058DE53939612413ff4B09114E",
    isMainnet: true,
    explorerUrl: "https://explorer.manta.network",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  blast: {
    id: "blast",
    name: "Blast",
    routerAddress: "0x411d2C093e4c2e69Bf0D8E94be1bF13DaDD879c6",
    approvalAddress: "0x5fD2Dc91FF1dE7FF4AEB1CACeF8E9911bAAECa68",
    isMainnet: true,
    explorerUrl: "https://blastscan.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  mode: {
    id: "mode",
    name: "Mode",
    routerAddress: "0xD1b8997AaC08c619d40Be2e4284c9C72cAB33954",
    approvalAddress: "0xbd0EBE49779E154E5042B34D5BcfBc498e4B3249",
    isMainnet: true,
    explorerUrl: "https://explorer.mode.network",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  }
};

// Get all supported chain configs
export const getAllChainConfigs = (): ChainConfig[] => {
  return Object.values(chainConfigs);
};

// Get a specific chain config by ID
export const getChainConfigById = (chainId: string): ChainConfig | undefined => {
  return chainConfigs[chainId.toLowerCase()];
};

// Get the router address for a specific chain
export const getRouterAddressForChain = (chainId: string): string => {
  const config = getChainConfigById(chainId);
  return config?.routerAddress || '';
};

// Get the approval address for a specific chain
export const getApprovalAddressForChain = (chainId: string): string => {
  const config = getChainConfigById(chainId);
  return config?.approvalAddress || '';
};

// Groups of chains by ecosystem
export const chainGroups = {
  evm: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'bnb', 'avalanche', 'zksync', 'linea', 'mantle', 'scroll', 'blast', 'mode', 'manta'],
  nonEvm: ['solana', 'sui', 'ton', 'sei'],
  l2: ['arbitrum', 'optimism', 'base', 'zksync', 'linea', 'mantle', 'scroll', 'manta', 'mode'],
  mainChains: ['ethereum', 'polygon', 'solana', 'avalanche', 'bnb']
};