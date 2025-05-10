export interface OverviewCardData {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
    neutral?: boolean;
  };
  info: string;
  tooltip: string;
}

export interface ArbitrageOpportunityData {
  asset: string;
  assetSymbol: string;
  color: string;
  from: string;
  to: string;
  profitPercentage: string;
  profitAmount: string;
  buyPrice: string;
  sellPrice: string;
}

export interface YieldOpportunityData {
  protocol: string;
  protocolSymbol: string;
  protocolColor: string;
  asset: string;
  assetSymbol: string;
  assetColor: string;
  chain: string;
  chainSymbol: string;
  chainColor: string;
  apy: string;
  tvl: string;
  isOptimal: boolean;
}

export interface PortfolioRiskData {
  riskScore: {
    value: number;
    label: string;
    color: string;
  };
  metrics: {
    assetDiversification: number;
    protocolExposure: number;
    chainDiversification: number;
    stablecoinRatio: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendations?: {
    options: {
      name: string;
      fee: string;
      value: string;
      isRecommended: boolean;
    }[];
  };
}

export interface GasSavingsData {
  total: string;
  transactions: number;
  byChain: {
    chain: string;
    amount: string;
    percentage: number;
  }[];
}

export interface TokenData {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  value: string;
  price: string;
}

export interface MarketTrendsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}
