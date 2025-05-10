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
  category?: 'main' | 'layer2' | 'emerging';
}

// Configuration for all supported chains with OKX DEX API integration
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
    },
    category: 'main'
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
    },
    category: 'main'
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    routerAddress: "0x7B42c68D1F42316C1da8Ddc44C974087B8C886aF",
    approvalAddress: "0xDa4714fEE90Ad7DE50bA48b8B42a8D63492fB9Df",
    isMainnet: true,
    explorerUrl: "https://arbiscan.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'layer2'
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    routerAddress: "0x9D5a7A7C4Fb401BaAB8222AC8C10B033E820FdAF",
    approvalAddress: "0xb14C2a2C91DA98CD431775Af1220A3Be17E3Ab5D",
    isMainnet: true,
    explorerUrl: "https://optimistic.etherscan.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'layer2'
  },
  base: {
    id: "base",
    name: "Base",
    routerAddress: "0x17Ee62225F728072CA830Fcdbb6Af449726F5b6b",
    approvalAddress: "0x27A64608aB9f79B3dE3F33A41d95c5A328A0eEc4",
    isMainnet: true,
    explorerUrl: "https://basescan.org",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'layer2'
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    routerAddress: "0x4Df8c5CBcD3C4A937bEe54E7e6aA2bD32Bf68893",
    approvalAddress: "0x5B8aF101B9B4e2C7E09B66D3d8E6A2637C7c2A96",
    isMainnet: true,
    explorerUrl: "https://snowtrace.io",
    symbol: "AVAX",
    decimals: 18,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18
    },
    category: 'main'
  },
  binance: {
    id: "binance",
    name: "BNB Chain",
    routerAddress: "0xCa140Dd5d87B3Df54726f34EC5C750c5f0B5CC39",
    approvalAddress: "0x15F0ef60aA8D3F46CdB7B1E2b4876A8AD4b68aaD",
    isMainnet: true,
    explorerUrl: "https://bscscan.com",
    symbol: "BNB",
    decimals: 18,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    category: 'main'
  },
  solana: {
    id: "solana",
    name: "Solana",
    routerAddress: "11111111111111111111111111111111",
    approvalAddress: "11111111111111111111111111111111",
    isMainnet: true,
    explorerUrl: "https://solscan.io",
    symbol: "SOL",
    decimals: 9,
    nativeCurrency: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9
    },
    category: 'main'
  },
  fantom: {
    id: "fantom",
    name: "Fantom",
    routerAddress: "0x8aC868693E9D90Ac4458Fe05236A4F513b9B9Af2",
    approvalAddress: "0x25C2a2A3a7B597d9b57C82483eD1E389A4bEE7A0",
    isMainnet: true,
    explorerUrl: "https://ftmscan.com",
    symbol: "FTM",
    decimals: 18,
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18
    },
    category: 'emerging'
  },
  celo: {
    id: "celo",
    name: "Celo",
    routerAddress: "0xB18D02EE58A6c6C6922A8cfa3A958087E6F3Fe42",
    approvalAddress: "0xEe72D391BEc3d0F5fFEB5c2f5D5Cf3F96dEaf7A5",
    isMainnet: true,
    explorerUrl: "https://celoscan.io",
    symbol: "CELO",
    decimals: 18,
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18
    },
    category: 'emerging'
  },
  gnosis: {
    id: "gnosis",
    name: "Gnosis",
    routerAddress: "0x672Fd27D646D02B499E0dE059F877C28C2503072",
    approvalAddress: "0xB8C2a51368EA93df49792aBC3b93764d39c10749",
    isMainnet: true,
    explorerUrl: "https://gnosisscan.io",
    symbol: "xDAI",
    decimals: 18,
    nativeCurrency: {
      name: "xDAI",
      symbol: "xDAI",
      decimals: 18
    },
    category: 'emerging'
  },
  polygonzkevm: {
    id: "polygonzkevm",
    name: "Polygon zkEVM",
    routerAddress: "0x304aC6D51C314d6c03c82525468a28a4Ef05abaD",
    approvalAddress: "0x7E8aAB2Df8D32b8F86de35CDfA9C8C61A3d924Ee",
    isMainnet: true,
    explorerUrl: "https://zkevm.polygonscan.com",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'layer2'
  },
  aurora: {
    id: "aurora",
    name: "Aurora",
    routerAddress: "0x5CE5b99679F72C32C7bC3E308cC3BF675c44B4C3",
    approvalAddress: "0xBA9cCfc05FC31CEf9e8E7C7F6a8861c7239BeC7B",
    isMainnet: true,
    explorerUrl: "https://aurorascan.dev",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'emerging'
  },
  linea: {
    id: "linea",
    name: "Linea",
    routerAddress: "0x46E14b5D16e9aB25323439640D98F06b15e9B949",
    approvalAddress: "0xc9890a88De05bB379De58dcE08C0f45F6d2E91b8",
    isMainnet: true,
    explorerUrl: "https://lineascan.build",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'layer2'
  },
  zksync: {
    id: "zksync",
    name: "zkSync Era",
    routerAddress: "0x579270F151D142eb8BdC081043a983307Aa15786",
    approvalAddress: "0x169ebd6cce9F44A3673b2ceDA85a8e3a6277cD01",
    isMainnet: true,
    explorerUrl: "https://explorer.zksync.io",
    symbol: "ETH",
    decimals: 18,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    },
    category: 'layer2'
  }
};

// Get all supported chain configs
export const getAllChainConfigs = (): ChainConfig[] => {
  return Object.values(chainConfigs);
};

// Get chains by category
export const getChainsByCategory = (category: 'main' | 'layer2' | 'emerging'): ChainConfig[] => {
  return Object.values(chainConfigs).filter(chain => chain.category === category);
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

// Get main network chains
export const getMainChains = (): ChainConfig[] => {
  return getChainsByCategory('main');
};

// Get layer 2 chains
export const getLayer2Chains = (): ChainConfig[] => {
  return getChainsByCategory('layer2');
};

// Get emerging network chains
export const getEmergingChains = (): ChainConfig[] => {
  return getChainsByCategory('emerging');
};

// Get default tokens for a chain
export const getDefaultTokens = (chainId: string) => {
  const defaultTokenMap: Record<string, { from: any, to: any }> = {
    ethereum: {
      from: { symbol: "ETH", name: "Ethereum", decimals: 18 },
      to: { symbol: "USDC", name: "USD Coin", decimals: 6 }
    },
    polygon: {
      from: { symbol: "MATIC", name: "Polygon", decimals: 18 },
      to: { symbol: "USDC", name: "USD Coin", decimals: 6 }
    },
    arbitrum: {
      from: { symbol: "ETH", name: "Ethereum", decimals: 18 },
      to: { symbol: "USDT", name: "Tether", decimals: 6 }
    },
    solana: {
      from: { symbol: "SOL", name: "Solana", decimals: 9 },
      to: { symbol: "USDC", name: "USD Coin", decimals: 6 }
    },
    avalanche: {
      from: { symbol: "AVAX", name: "Avalanche", decimals: 18 },
      to: { symbol: "USDC", name: "USD Coin", decimals: 6 }
    },
    binance: {
      from: { symbol: "BNB", name: "BNB", decimals: 18 },
      to: { symbol: "BUSD", name: "Binance USD", decimals: 18 }
    }
  };
  
  return defaultTokenMap[chainId] || defaultTokenMap.ethereum;
};

// List of tokens available on each chain
export const tokens: Record<string, any[]> = {
  ethereum: [
    { symbol: "ETH", name: "Ethereum", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", decimals: 6 },
    { symbol: "USDT", name: "Tether", decimals: 6 },
    { symbol: "DAI", name: "Dai Stablecoin", decimals: 18 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8 }
  ],
  polygon: [
    { symbol: "MATIC", name: "Polygon", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", decimals: 6 },
    { symbol: "USDT", name: "Tether", decimals: 6 },
    { symbol: "DAI", name: "Dai Stablecoin", decimals: 18 },
    { symbol: "WETH", name: "Wrapped Ethereum", decimals: 18 }
  ],
  arbitrum: [
    { symbol: "ETH", name: "Ethereum", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", decimals: 6 },
    { symbol: "USDT", name: "Tether", decimals: 6 },
    { symbol: "ARB", name: "Arbitrum", decimals: 18 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8 }
  ],
  solana: [
    { symbol: "SOL", name: "Solana", decimals: 9 },
    { symbol: "USDC", name: "USD Coin", decimals: 6 },
    { symbol: "USDT", name: "Tether", decimals: 6 },
    { symbol: "RAY", name: "Raydium", decimals: 6 },
    { symbol: "SRM", name: "Serum", decimals: 6 }
  ],
  avalanche: [
    { symbol: "AVAX", name: "Avalanche", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", decimals: 6 },
    { symbol: "USDT", name: "Tether", decimals: 6 },
    { symbol: "JOE", name: "Joe Token", decimals: 18 },
    { symbol: "WAVAX", name: "Wrapped AVAX", decimals: 18 }
  ],
  binance: [
    { symbol: "BNB", name: "BNB", decimals: 18 },
    { symbol: "BUSD", name: "Binance USD", decimals: 18 },
    { symbol: "USDT", name: "Tether", decimals: 6 },
    { symbol: "CAKE", name: "PancakeSwap", decimals: 18 },
    { symbol: "WBNB", name: "Wrapped BNB", decimals: 18 }
  ]
};