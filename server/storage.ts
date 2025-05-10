import { 
  users, type User, type InsertUser,
  arbitrageOpportunities, type ArbitrageOpportunity, type InsertArbitrageOpportunity,
  yieldOpportunities, type YieldOpportunity, type InsertYieldOpportunity,
  gasSavings, type GasSaving, type InsertGasSaving,
  portfolioRisk, type PortfolioRisk, type InsertPortfolioRisk,
  aiConversations, type AiConversation, type InsertAiConversation,
  marketData, type MarketData, type InsertMarketData
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserBalance(userId?: number): Promise<{ balance: string }>;
  getUserTokens(userId?: number): Promise<any[]>;

  // Arbitrage methods
  getArbitrageOpportunity(id: number): Promise<ArbitrageOpportunity | undefined>;
  getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]>;
  createArbitrageOpportunity(opportunity: InsertArbitrageOpportunity): Promise<ArbitrageOpportunity>;
  updateArbitrageOpportunity(id: number, opportunity: Partial<ArbitrageOpportunity>): Promise<ArbitrageOpportunity | undefined>;

  // Yield methods
  getYieldOpportunity(id: number): Promise<YieldOpportunity | undefined>;
  getYieldOpportunities(filters?: Record<string, any>): Promise<YieldOpportunity[]>;
  createYieldOpportunity(opportunity: InsertYieldOpportunity): Promise<YieldOpportunity>;
  updateYieldOpportunity(id: number, opportunity: Partial<YieldOpportunity>): Promise<YieldOpportunity | undefined>;
  
  // Gas savings methods
  getGasSavings(userId?: number): Promise<{
    total: string;
    transactions: number;
    byChain: { chain: string; amount: string; percentage: number }[];
  }>;
  createGasSaving(saving: InsertGasSaving): Promise<GasSaving>;
  
  // Portfolio risk methods
  getPortfolioRisk(userId?: number): Promise<PortfolioRisk | undefined>;
  createPortfolioRisk(risk: InsertPortfolioRisk): Promise<PortfolioRisk>;
  updatePortfolioRisk(id: number, risk: Partial<PortfolioRisk>): Promise<PortfolioRisk | undefined>;
  
  // AI conversation methods
  getAiConversation(id: number): Promise<AiConversation | undefined>;
  getAiConversations(userId?: number): Promise<AiConversation[]>;
  createAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  
  // Market data methods
  getMarketData(asset: string): Promise<MarketData | undefined>;
  getMarketTrends(timeframe: string): Promise<{
    labels: string[];
    datasets: { label: string; data: number[]; color: string }[];
  }>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  updateMarketData(id: number, data: Partial<MarketData>): Promise<MarketData | undefined>;

  // Protocol search
  searchProtocols(query: string): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private arbitrageOpps: Map<number, ArbitrageOpportunity>;
  private yieldOpps: Map<number, YieldOpportunity>;
  private gasSavingsData: Map<number, GasSaving>;
  private portfolioRiskData: Map<number, PortfolioRisk>;
  private aiConversationsData: Map<number, AiConversation>;
  private marketDataEntries: Map<number, MarketData>;
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.arbitrageOpps = new Map();
    this.yieldOpps = new Map();
    this.gasSavingsData = new Map();
    this.portfolioRiskData = new Map();
    this.aiConversationsData = new Map();
    this.marketDataEntries = new Map();
    this.currentId = 1;
    
    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Create a demo user
    this.createUser({ 
      username: "john_doe", 
      password: "password123", 
      email: "john.doe@example.com",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserBalance(userId?: number): Promise<{ balance: string }> {
    // In a real application, we would fetch the user's balance from the database
    return { balance: "$3,245.89" };
  }

  async getUserTokens(userId?: number): Promise<any[]> {
    // In a real application, we would fetch the user's tokens from the database
    return [
      { symbol: "ETH", name: "Ethereum", balance: "1.45", value: "$4,706.54", price: "$3,245.89" },
      { symbol: "USDC", name: "USD Coin", balance: "2,500.00", value: "$2,500.00", price: "$1.00" },
      { symbol: "SOL", name: "Solana", balance: "25.00", value: "$2,586.75", price: "$103.47" },
      { symbol: "MATIC", name: "Polygon", balance: "1,000.00", value: "$870.00", price: "$0.87" }
    ];
  }

  // Arbitrage methods
  async getArbitrageOpportunity(id: number): Promise<ArbitrageOpportunity | undefined> {
    return this.arbitrageOpps.get(id);
  }

  async getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    return Array.from(this.arbitrageOpps.values());
  }

  async createArbitrageOpportunity(opportunity: InsertArbitrageOpportunity): Promise<ArbitrageOpportunity> {
    const id = this.currentId++;
    const newOpportunity: ArbitrageOpportunity = { ...opportunity, id };
    this.arbitrageOpps.set(id, newOpportunity);
    return newOpportunity;
  }

  async updateArbitrageOpportunity(id: number, opportunity: Partial<ArbitrageOpportunity>): Promise<ArbitrageOpportunity | undefined> {
    const existingOpportunity = this.arbitrageOpps.get(id);
    if (!existingOpportunity) return undefined;
    
    const updatedOpportunity = { ...existingOpportunity, ...opportunity };
    this.arbitrageOpps.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  // Yield methods
  async getYieldOpportunity(id: number): Promise<YieldOpportunity | undefined> {
    return this.yieldOpps.get(id);
  }

  async getYieldOpportunities(filters?: Record<string, any>): Promise<YieldOpportunity[]> {
    let opportunities = Array.from(this.yieldOpps.values());
    
    if (filters) {
      if (filters.risk && filters.risk !== 'all') {
        opportunities = opportunities.filter(opp => opp.riskLevel === filters.risk);
      }
      
      if (filters.chain && filters.chain !== 'all') {
        opportunities = opportunities.filter(opp => opp.chain.toLowerCase() === filters.chain.toLowerCase());
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        opportunities = opportunities.filter(opp => 
          opp.protocol.toLowerCase().includes(searchTerm) || 
          opp.asset.toLowerCase().includes(searchTerm) ||
          opp.chain.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return opportunities;
  }

  async createYieldOpportunity(opportunity: InsertYieldOpportunity): Promise<YieldOpportunity> {
    const id = this.currentId++;
    const newOpportunity: YieldOpportunity = { ...opportunity, id };
    this.yieldOpps.set(id, newOpportunity);
    return newOpportunity;
  }

  async updateYieldOpportunity(id: number, opportunity: Partial<YieldOpportunity>): Promise<YieldOpportunity | undefined> {
    const existingOpportunity = this.yieldOpps.get(id);
    if (!existingOpportunity) return undefined;
    
    const updatedOpportunity = { ...existingOpportunity, ...opportunity };
    this.yieldOpps.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  // Gas savings methods
  async getGasSavings(userId?: number): Promise<{
    total: string;
    transactions: number;
    byChain: { chain: string; amount: string; percentage: number }[];
  }> {
    // In a real application, we would calculate this from the gas savings records in the database
    return {
      total: "$283,951",
      transactions: 8432,
      byChain: [
        { chain: "Ethereum", amount: "$180,241", percentage: 63.5 },
        { chain: "Polygon", amount: "$54,309", percentage: 19.1 },
        { chain: "Solana", amount: "$28,395", percentage: 10.0 },
        { chain: "Arbitrum", amount: "$14,197", percentage: 5.0 },
        { chain: "Other Chains", amount: "$6,809", percentage: 2.4 }
      ]
    };
  }

  async createGasSaving(saving: InsertGasSaving): Promise<GasSaving> {
    const id = this.currentId++;
    const newSaving: GasSaving = { ...saving, id };
    this.gasSavingsData.set(id, newSaving);
    return newSaving;
  }

  // Portfolio risk methods
  async getPortfolioRisk(userId?: number): Promise<PortfolioRisk | undefined> {
    // For demo purposes, return default risk data if no specific user risk data found
    if (this.portfolioRiskData.size === 0) {
      return {
        id: 0,
        userId: userId || 1,
        riskScore: 65,
        assetDiversification: 60,
        protocolExposure: 75,
        chainDiversification: 30,
        stablecoinRatio: 85,
        recommendations: [
          "Increase SOL exposure by 5%",
          "Reduce ETH by 3%",
          "Add exposure to L2 solutions"
        ],
        timestamp: new Date()
      };
    }
    
    if (userId) {
      return Array.from(this.portfolioRiskData.values()).find(risk => risk.userId === userId);
    }
    
    return this.portfolioRiskData.values().next().value;
  }

  async createPortfolioRisk(risk: InsertPortfolioRisk): Promise<PortfolioRisk> {
    const id = this.currentId++;
    const newRisk: PortfolioRisk = { ...risk, id };
    this.portfolioRiskData.set(id, newRisk);
    return newRisk;
  }

  async updatePortfolioRisk(id: number, risk: Partial<PortfolioRisk>): Promise<PortfolioRisk | undefined> {
    const existingRisk = this.portfolioRiskData.get(id);
    if (!existingRisk) return undefined;
    
    const updatedRisk = { ...existingRisk, ...risk };
    this.portfolioRiskData.set(id, updatedRisk);
    return updatedRisk;
  }

  // AI conversation methods
  async getAiConversation(id: number): Promise<AiConversation | undefined> {
    return this.aiConversationsData.get(id);
  }

  async getAiConversations(userId?: number): Promise<AiConversation[]> {
    let conversations = Array.from(this.aiConversationsData.values());
    
    if (userId) {
      conversations = conversations.filter(conv => conv.userId === userId);
    }
    
    return conversations;
  }

  async createAiConversation(conversation: InsertAiConversation): Promise<AiConversation> {
    const id = this.currentId++;
    const newConversation: AiConversation = { ...conversation, id };
    this.aiConversationsData.set(id, newConversation);
    return newConversation;
  }

  // Market data methods
  async getMarketData(asset: string): Promise<MarketData | undefined> {
    return Array.from(this.marketDataEntries.values()).find(data => data.asset === asset);
  }

  async getMarketTrends(timeframe: string): Promise<{
    labels: string[];
    datasets: { label: string; data: number[]; color: string }[];
  }> {
    // Generate time labels based on the requested timeframe
    let labels: string[] = [];
    
    if (timeframe === '24h') {
      labels = Array.from({length: 24}, (_, i) => `${i}:00`);
    } else if (timeframe === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 24; j += 6) {
          labels.push(`${days[i]} ${j}:00`);
        }
      }
    } else if (timeframe === '30d') {
      for (let i = 1; i <= 30; i++) {
        labels.push(`Day ${i}`);
      }
    } else if (timeframe === '1y') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        labels.push(months[i]);
      }
    }
    
    // Generate synthetic data for ETH and BTC prices
    const ethData = [3180, 3210, 3190, 3220, 3250, 3245, 3260, 3270, 3290, 3310, 3300, 3320, 3350, 3370, 3360, 3330, 3310, 3280, 3260, 3240, 3245, 3270, 3290, 3320];
    const btcData = [2900, 2933, 2920, 2947, 2967, 2987, 3000, 3020, 3040, 3060, 3073, 3067, 3053, 3040, 3027, 3013, 3000, 2987, 2967, 2947, 2933, 2920, 2907, 2900];
    
    // Adjust data length to match labels
    const normalizedEthData = this.normalizeDataLength(ethData, labels.length);
    const normalizedBtcData = this.normalizeDataLength(btcData, labels.length);
    
    return {
      labels,
      datasets: [
        {
          label: 'ETH Price',
          data: normalizedEthData,
          color: '#3B82F6'
        },
        {
          label: 'BTC Price (scaled)',
          data: normalizedBtcData,
          color: '#F59E0B'
        }
      ]
    };
  }

  private normalizeDataLength(data: number[], targetLength: number): number[] {
    if (data.length === targetLength) return data;
    
    if (data.length > targetLength) {
      // Downsample
      const step = data.length / targetLength;
      return Array.from({length: targetLength}, (_, i) => data[Math.floor(i * step)]);
    } else {
      // Upsample
      const result: number[] = [];
      const step = targetLength / data.length;
      
      for (let i = 0; i < targetLength; i++) {
        const dataIndex = Math.floor(i / step);
        result.push(data[dataIndex]);
      }
      
      return result;
    }
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const id = this.currentId++;
    const newData: MarketData = { ...data, id };
    this.marketDataEntries.set(id, newData);
    return newData;
  }

  async updateMarketData(id: number, data: Partial<MarketData>): Promise<MarketData | undefined> {
    const existingData = this.marketDataEntries.get(id);
    if (!existingData) return undefined;
    
    const updatedData = { ...existingData, ...data };
    this.marketDataEntries.set(id, updatedData);
    return updatedData;
  }

  // Protocol search
  async searchProtocols(query: string): Promise<any[]> {
    const protocols = [
      { id: 1, name: "Aave V3", symbol: "AAVE", type: "Lending" },
      { id: 2, name: "Uniswap V3", symbol: "UNI", type: "DEX" },
      { id: 3, name: "Compound", symbol: "COMP", type: "Lending" },
      { id: 4, name: "Curve", symbol: "CRV", type: "DEX" },
      { id: 5, name: "SushiSwap", symbol: "SUSHI", type: "DEX" },
      { id: 6, name: "Balancer", symbol: "BAL", type: "DEX" },
      { id: 7, name: "MakerDAO", symbol: "MKR", type: "Lending" },
      { id: 8, name: "Synthetix", symbol: "SNX", type: "Derivatives" },
      { id: 9, name: "Yearn Finance", symbol: "YFI", type: "Yield" },
      { id: 10, name: "Lido", symbol: "LDO", type: "Staking" }
    ];
    
    if (!query) return protocols;
    
    const searchTerm = query.toLowerCase();
    return protocols.filter(protocol => 
      protocol.name.toLowerCase().includes(searchTerm) || 
      protocol.symbol.toLowerCase().includes(searchTerm) ||
      protocol.type.toLowerCase().includes(searchTerm)
    );
  }
}

export const storage = new MemStorage();
