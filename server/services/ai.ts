import { storage } from "../storage";
import OpenAI from "openai";
import { readFileSync } from "fs";
import path from "path";

interface AiRecommendation {
  response: string;
  recommendations?: {
    options: {
      name: string;
      fee: string;
      value: string;
      isRecommended: boolean;
    }[];
  };
  transactionSteps?: string[];
  visualAnalysis?: {
    chartType: string;
    data: any;
    insights: string[];
  };
  riskAssessment?: {
    score: number;
    factors: Array<{factor: string, impact: string}>;
    recommendation: string;
  };
}

interface TaskAutomation {
  taskId: string;
  name: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  steps: Array<{step: string, completed: boolean}>;
  result?: any;
}

/**
 * Advanced AI service for DeFi copiloting, strategy recommendations, and task automation
 */
export class AiService {
  private openai: OpenAI | null = null;
  private tasks: Map<string, TaskAutomation> = new Map();
  private chatHistory: Map<number, Array<{role: string, content: string}>> = new Map();
  private portfolioCache: Map<number, any> = new Map();
  
  constructor() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log("Initialized OpenAI client for AI copilot services");
    } else {
      console.warn("OpenAI API key not found. AI functionality will be limited to rule-based responses.");
    }
    
    // Initialize task automation system
    this.initializeAutomationSystem();
  }
  
  /**
   * Initialize the task automation system
   */
  private initializeAutomationSystem() {
    // Setup periodic task monitoring
    setInterval(() => {
      this.monitorAndUpdateTasks();
    }, 5000);
    
    console.log("Task automation system initialized");
  }
  
  /**
   * Get AI recommendation based on user prompt with context awareness
   */
  async getRecommendation(prompt: string, userId: number = 1, contextData: any = {}): Promise<AiRecommendation> {
    try {
      console.log(`Getting AI copilot recommendation for prompt: ${prompt}`);
      
      // Get chat history for this user or initialize if not exists
      if (!this.chatHistory.has(userId)) {
        this.chatHistory.set(userId, []);
      }
      const history = this.chatHistory.get(userId)!;
      
      // Update chat history
      history.push({ role: "user", content: prompt });
      
      // Set context limit to prevent history from growing too large
      const maxHistoryLength = 10; // Last 10 messages
      const trimmedHistory = history.slice(-maxHistoryLength);
      
      // Get portfolio data for context if available
      let portfolioContext = "";
      if (this.portfolioCache.has(userId)) {
        portfolioContext = JSON.stringify(this.portfolioCache.get(userId));
      } else {
        // Try to get portfolio data from storage
        try {
          const tokens = await storage.getUserTokens(userId);
          const balance = await storage.getUserBalance(userId);
          const risk = await storage.getPortfolioRisk(userId);
          
          const portfolioData = { tokens, balance, risk };
          this.portfolioCache.set(userId, portfolioData);
          portfolioContext = JSON.stringify(portfolioData);
        } catch (e) {
          console.warn("Could not fetch portfolio data for context");
        }
      }
      
      // If OpenAI is available, use it to generate recommendations with context
      if (this.openai) {
        const result = await this.getOpenAiRecommendation(prompt, trimmedHistory, portfolioContext, contextData);
        
        // Update chat history with AI response
        history.push({ role: "assistant", content: result.response });
        
        return result;
      }
      
      // Otherwise, provide rule-based responses for common queries
      const ruleBasedResponse = this.getRuleBasedRecommendation(prompt);
      
      // Update chat history with rule-based response
      history.push({ role: "assistant", content: ruleBasedResponse.response });
      
      return ruleBasedResponse;
    } catch (error) {
      console.error("Error getting AI recommendation:", error);
      throw new Error(`Failed to get AI recommendation: ${(error as Error).message}`);
    }
  }
  
  /**
   * Process image for visual analysis
   * @param imageBase64 base64 encoded image data
   * @param query user query about the image
   */
  async analyzeImage(imageBase64: string, query: string): Promise<AiRecommendation> {
    try {
      if (!this.openai) {
        throw new Error("OpenAI API key is required for image analysis");
      }
      
      console.log("Processing image analysis with AI copilot");
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a DeFi visual analysis expert that can interpret charts, screenshots, and financial data visualizations. 
            Provide detailed insights about the image, focusing on trends, patterns, and actionable insights for crypto traders.
            Output in JSON format with 'response' for the main analysis and 'visualAnalysis' containing chartType, insights array, and any detected data.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: query || "Analyze this chart and provide insights about the data shown."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error(`Failed to analyze image: ${(error as Error).message}`);
    }
  }
  
  /**
   * Apply an AI strategy to the user's portfolio with detailed execution steps
   */
  async applyStrategy(strategyId: string, userId: number = 1) {
    try {
      console.log(`Applying AI strategy: ${strategyId} for user ${userId}`);
      
      // Create a new task for this strategy application
      const taskId = `strategy-${Date.now()}`;
      const task: TaskAutomation = {
        taskId,
        name: `Strategy Execution: ${strategyId}`,
        status: 'executing',
        steps: [
          { step: "Analyzing portfolio composition", completed: false },
          { step: "Calculating optimal trade sizes", completed: false },
          { step: "Checking current market conditions", completed: false },
          { step: "Preparing transaction bundle", completed: false },
          { step: "Executing trades via OKX Gasless API", completed: false }
        ]
      };
      
      // Store the task
      this.tasks.set(taskId, task);
      
      // Simulate task execution in the background
      this.executeStrategyTask(taskId, strategyId, userId);
      
      // Return task initiation response
      return {
        success: true,
        strategyId,
        taskId,
        timestamp: new Date(),
        message: "Strategy execution started",
        status: "executing",
        estimatedCompletionTime: "2-3 minutes"
      };
    } catch (error) {
      console.error(`Error applying AI strategy ${strategyId}:`, error);
      throw new Error(`Failed to apply AI strategy: ${(error as Error).message}`);
    }
  }
  
  /**
   * Background execution of a strategy task
   */
  private async executeStrategyTask(taskId: string, strategyId: string, userId: number) {
    try {
      const task = this.tasks.get(taskId)!;
      
      // Simulate step completion with realistic timing
      for (let i = 0; i < task.steps.length; i++) {
        // Update step status
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        task.steps[i].completed = true;
        this.tasks.set(taskId, {...task});
      }
      
      // Finalize the task
      task.status = 'completed';
      task.result = {
        success: true,
        transactionsExecuted: 3,
        gasSaved: "$12.47",
        portfolioChange: "+2.3%",
        timestamp: new Date()
      };
      
      this.tasks.set(taskId, task);
      console.log(`Task ${taskId} completed successfully`);
    } catch (error) {
      console.error(`Error executing task ${taskId}:`, error);
      const task = this.tasks.get(taskId);
      if (task) {
        task.status = 'failed';
        task.result = { error: (error as Error).message };
        this.tasks.set(taskId, task);
      }
    }
  }
  
  /**
   * Create a complex DeFi transaction with AI guidance
   */
  async createGuidedTransaction(operationType: string, params: Record<string, any>) {
    try {
      console.log(`Creating guided DeFi transaction: ${operationType}`);
      
      let steps: string[] = [];
      let gasSavings = "0.00";
      
      switch (operationType) {
        case "flash_loan_arbitrage":
          steps = [
            "Borrow 1000 ETH via flash loan from Aave",
            "Execute trade at Uniswap V3 (ETH → USDC)",
            "Execute trade at Binance (USDC → ETH)",
            "Repay flash loan + 0.09% fee to Aave",
            "Collect profit (~0.3% of principal)"
          ];
          gasSavings = "37.42";
          break;
        case "yield_farming":
          steps = [
            "Deposit USDC into Raydium liquidity pool",
            "Stake LP tokens in Raydium farm",
            "Set up auto-compounding strategy",
            "Configure take-profit at 15% APY",
            "Enable IL protection module"
          ];
          gasSavings = "12.87";
          break;
        case "cross_chain_swap":
          steps = [
            "Initiate gasless transaction via OKX DEX API",
            "Bridge assets from Ethereum to Solana via portal bridge",
            "Execute swap on Jupiter aggregator",
            "Verify transaction settlement",
            "Update portfolio balance"
          ];
          gasSavings = "22.35";
          break;
        default:
          steps = [
            "Analyze transaction parameters",
            "Simulate transaction execution",
            "Prepare transaction payload",
            "Submit via OKX Gasless API",
            "Confirm transaction success"
          ];
          gasSavings = "8.12";
      }
      
      // Create a transaction guidance response
      return {
        success: true,
        operationType,
        steps,
        gasSavings,
        params,
        timestamp: new Date(),
        message: `${operationType} transaction prepared successfully`
      };
    } catch (error) {
      console.error(`Error creating guided transaction ${operationType}:`, error);
      throw new Error(`Failed to create guided transaction: ${(error as Error).message}`);
    }
  }
  
  /**
   * Get task status and progress
   */
  async getTaskStatus(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    return {
      taskId: task.taskId,
      name: task.name,
      status: task.status,
      progress: task.steps.filter(s => s.completed).length / task.steps.length,
      steps: task.steps,
      result: task.result,
      timestamp: new Date()
    };
  }
  
  /**
   * Monitor and update all active tasks
   */
  private async monitorAndUpdateTasks() {
    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'pending' || task.status === 'executing') {
        // Check if task has timed out
        const maxTaskDuration = 5 * 60 * 1000; // 5 minutes
        const taskAge = Date.now() - parseInt(taskId.split('-')[1]);
        
        if (taskAge > maxTaskDuration) {
          task.status = 'failed';
          task.result = { error: "Task execution timed out" };
          this.tasks.set(taskId, task);
          console.warn(`Task ${taskId} timed out and was marked as failed`);
        }
      }
    }
  }
  
  /**
   * Get recommendation using OpenAI with comprehensive context
   */
  private async getOpenAiRecommendation(
    prompt: string, 
    chatHistory: Array<{role: string, content: string}>,
    portfolioContext: string,
    additionalContext: any = {}
  ): Promise<AiRecommendation> {
    // Prepare the system prompt with enhanced context
    const currentDate = new Date().toISOString().split('T')[0];
    const systemPrompt = `You are an advanced AI DeFi copilot for OmniDeFi Nexus, a comprehensive platform that combines DEX+CEX arbitrage trading, cross-chain gasless swaps, yield optimization, and AI-powered strategy assistance.

Current date: ${currentDate}

User portfolio context: ${portfolioContext || "No portfolio data available"}

Your capabilities:
- Provide step-by-step guidance for complex DeFi operations
- Analyze portfolio risk and recommend optimizations
- Explain complex DeFi concepts in simple terms
- Generate visualizable strategy recommendations
- Guide users through cross-chain transactions
- Recommend gas optimization strategies using OKX DEX API

When providing recommendations:
1. Be specific with token symbols, protocols, and chains
2. Consider gas costs and transaction efficiency
3. Explain risks and potential downsides
4. Provide clear next steps for implementation

Output in JSON format with:
- 'response' field for the main text response
- 'recommendations' field when suggesting specific options
- 'transactionSteps' field when explaining implementation steps
- 'riskAssessment' field when analyzing risks
- 'visualAnalysis' field when analyzing charts or data`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory
    ];
    
    const response = await this.openai!.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  }
  
  /**
   * Get rule-based recommendation for common queries with expanded capabilities
   * Used as a fallback when OpenAI is not available
   */
  private getRuleBasedRecommendation(prompt: string): AiRecommendation {
    const promptLower = prompt.toLowerCase();
    
    // Gas fee reduction and OKX gasless transactions
    if (promptLower.includes("gas") || promptLower.includes("fee") || promptLower.includes("transaction cost")) {
      return {
        response: "I recommend using our gasless swap feature powered by OKX DEX API! It eliminates gas fees completely across multiple chains. Here are your options:",
        recommendations: {
          options: [
            {
              name: "Standard Uniswap route",
              fee: "0.3% + $15.42 gas",
              value: "1 ETH → 3,245.89 USDC",
              isRecommended: false
            },
            {
              name: "OKX Gasless DEX API",
              fee: "0.2% + $0 gas",
              value: "1 ETH → 3,247.92 USDC",
              isRecommended: true
            }
          ]
        },
        transactionSteps: [
          "Connect wallet to OmniDeFi Nexus",
          "Select ETH as source token and USDC as destination",
          "Choose 'Gasless' option in the route selector",
          "Enter amount and approve the transaction",
          "Confirm in your wallet with zero gas fee"
        ]
      };
    }
    
    // Flash loan and arbitrage strategies
    if (promptLower.includes("flash loan") || promptLower.includes("arbitrage")) {
      return {
        response: "I can guide you through executing a flash loan arbitrage strategy using OmniDeFi Nexus. This advanced technique allows you to profit from price differences without requiring upfront capital:",
        recommendations: {
          options: [
            {
              name: "Basic Arbitrage",
              fee: "$25-40 gas fees",
              value: "Potential 0.2-0.5% profit",
              isRecommended: false
            },
            {
              name: "OKX Gasless Flash Loan",
              fee: "0.09% loan fee, $0 gas",
              value: "Potential 0.3-0.7% profit",
              isRecommended: true
            }
          ]
        },
        transactionSteps: [
          "Navigate to Advanced Trading section",
          "Select 'Flash Loan Arbitrage' option",
          "Choose asset pair (ETH/USDC recommended)",
          "Set minimum profit threshold (0.3% recommended)",
          "Enable MEV protection for optimal execution",
          "Click 'Execute Strategy' button to initiate"
        ],
        riskAssessment: {
          score: 75,
          factors: [
            {factor: "Smart Contract Risk", impact: "Medium"},
            {factor: "Market Movement Risk", impact: "High"},
            {factor: "Transaction Failure Risk", impact: "Low with OKX Gasless"}
          ],
          recommendation: "Use sandwich attack protection and set reasonable profit thresholds"
        }
      };
    }
    
    // Yield optimization with advanced context
    if (promptLower.includes("yield") || promptLower.includes("apy") || promptLower.includes("staking") || promptLower.includes("farm")) {
      return {
        response: "Based on current market conditions and your portfolio, I've identified optimal yield opportunities with minimal risk exposure. Here are the best options:",
        recommendations: {
          options: [
            {
              name: "Aave V3 USDC Lending",
              fee: "0% deposit fee",
              value: "4.32% APY on Polygon",
              isRecommended: false
            },
            {
              name: "Raydium USDC-SOL LP",
              fee: "0.05% deposit fee",
              value: "12.74% APY on Solana",
              isRecommended: true
            },
            {
              name: "OKX Earn BTC Staking",
              fee: "0% deposit fee",
              value: "3.5% APY with flexible withdrawals",
              isRecommended: false
            }
          ]
        },
        riskAssessment: {
          score: 42,
          factors: [
            {factor: "Smart Contract Risk", impact: "Low"},
            {factor: "Impermanent Loss Risk", impact: "Medium"},
            {factor: "Protocol Insolvency Risk", impact: "Very Low"}
          ],
          recommendation: "The Raydium pool offers best risk-adjusted returns with minimal IL risk"
        }
      };
    }
    
    // Portfolio risk assessment and optimization
    if (promptLower.includes("portfolio") || promptLower.includes("risk") || promptLower.includes("diversify")) {
      return {
        response: "I've analyzed your portfolio and identified several optimization opportunities to reduce risk while maintaining yield potential:",
        recommendations: {
          options: [
            {
              name: "Current Allocation",
              fee: "-",
              value: "70% ETH, 20% SOL, 10% MATIC",
              isRecommended: false
            },
            {
              name: "Optimized Allocation",
              fee: "$5.42 (gasless with OKX)",
              value: "50% ETH, 25% SOL, 15% MATIC, 10% stables",
              isRecommended: true
            }
          ]
        },
        riskAssessment: {
          score: 68,
          factors: [
            {factor: "Asset Concentration", impact: "High - Overexposed to ETH"},
            {factor: "Chain Diversification", impact: "Medium - Good spread but could improve"},
            {factor: "Stablecoin Buffer", impact: "Low - Insufficient for market volatility"}
          ],
          recommendation: "Rebalance to reduce ETH concentration and add stablecoin position"
        },
        transactionSteps: [
          "Navigate to Portfolio Manager",
          "Select 'Rebalance Portfolio' option",
          "Review and approve the suggested allocation changes",
          "Enable 'Gasless Execution' toggle for zero-fee rebalancing",
          "Confirm the transaction bundle in your wallet"
        ]
      };
    }
    
    // Cross-chain transaction guidance
    if (promptLower.includes("cross chain") || promptLower.includes("bridge") || promptLower.includes("transfer between")) {
      return {
        response: "I can help you perform a gasless cross-chain transaction using OKX DEX API integration. This allows you to move assets between chains without paying any gas fees:",
        transactionSteps: [
          "Navigate to Cross-Chain Swaps page",
          "Select source chain (e.g., Ethereum) and destination chain (e.g., Solana)",
          "Enter the amount you wish to transfer",
          "Select tokens on both source and destination chains",
          "Review the quoted rate and confirm zero gas fees",
          "Approve the transaction in your wallet",
          "Wait for confirmation (typically 2-5 minutes for cross-chain)"
        ],
        recommendations: {
          options: [
            {
              name: "Traditional Bridge",
              fee: "$15-30 gas + 0.3% bridge fee",
              value: "10-30 minute settlement time",
              isRecommended: false
            },
            {
              name: "OKX Gasless Bridge",
              fee: "0.2% fee, $0 gas",
              value: "2-5 minute settlement time",
              isRecommended: true
            }
          ]
        }
      };
    }
    
    // Default copilot response
    return {
      response: "I'm your DeFi copilot at OmniDeFi Nexus! I can guide you through complex transactions, optimize your portfolio, find the best yield opportunities, and help you execute gasless trades. What would you like assistance with today?",
      recommendations: {
        options: [
          {
            name: "Gasless Cross-Chain Swaps",
            fee: "$0 gas fees",
            value: "Transfer assets between chains",
            isRecommended: true
          },
          {
            name: "Yield Optimization",
            fee: "Varies by protocol",
            value: "Find best risk-adjusted yields",
            isRecommended: false
          },
          {
            name: "Portfolio Analysis",
            fee: "Free",
            value: "Get risk assessment and suggestions",
            isRecommended: false
          },
          {
            name: "Flash Loan Arbitrage",
            fee: "0.09% loan fee",
            value: "Advanced profit strategies",
            isRecommended: false
          }
        ]
      }
    };
  }
}
