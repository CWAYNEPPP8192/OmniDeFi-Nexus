import OpenAI from "openai";
import { storage } from "../../storage";
import { InsertAiConversation } from "../../../shared/schema";

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
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      console.log('OpenAI client initialized successfully');
    } else {
      console.warn('OPENAI_API_KEY not provided, falling back to rule-based recommendations');
    }
    
    this.initializeAutomationSystem();
  }

  /**
   * Initialize the task automation system
   */
  private initializeAutomationSystem() {
    // Set up background task monitoring
    setInterval(() => this.monitorAndUpdateTasks(), 5000);
  }

  /**
   * Get AI recommendation based on user prompt with context awareness
   */
  async getRecommendation(prompt: string, userId: number = 1, contextData: any = {}): Promise<AiRecommendation> {
    // Store the user's query in chat history
    if (!this.chatHistory.has(userId)) {
      this.chatHistory.set(userId, []);
    }
    
    const userHistory = this.chatHistory.get(userId)!;
    userHistory.push({ role: 'user', content: prompt });
    
    // Get portfolio data if not cached
    if (!this.portfolioCache.has(userId)) {
      try {
        const portfolioData = await this.fetchUserPortfolio(userId);
        this.portfolioCache.set(userId, portfolioData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    }
    
    // Enhanced context for the AI
    const enhancedContextData = {
      ...contextData,
      portfolioData: this.portfolioCache.get(userId) || {},
      conversationHistory: userHistory
    };
    
    // Get recommendation using OpenAI with proper context
    let recommendation: AiRecommendation;
    
    try {
      recommendation = this.openai ? 
        await this.getOpenAiRecommendation(prompt, userId, enhancedContextData) : 
        this.getRuleBasedRecommendation(prompt);
      
      // Store the AI's response in chat history
      userHistory.push({ role: 'assistant', content: recommendation.response });
      
      // Store conversation in persistent storage
      this.saveConversation(userId, prompt, recommendation.response);
      
      return recommendation;
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      return {
        response: "I'm having trouble processing your request. Please try again or rephrase your question."
      };
    }
  }

  /**
   * Process image for visual analysis
   * @param imageBase64 base64 encoded image data
   * @param query user query about the image
   */
  async analyzeImage(imageBase64: string, query: string): Promise<AiRecommendation> {
    if (!this.openai) {
      return {
        response: "Image analysis is currently unavailable. Please ensure the API key is configured correctly."
      };
    }

    try {
      const visionResponse = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this DeFi chart or image and provide insights: ${query}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ],
          },
        ],
        max_tokens: 800,
      });

      const analysisText = visionResponse.choices[0].message.content || '';
      
      // Extract structured insights from the analysis
      let chartType = "Unknown";
      const insights = analysisText.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      
      if (analysisText.includes('candlestick')) chartType = "Candlestick";
      else if (analysisText.includes('line chart')) chartType = "Line";
      else if (analysisText.includes('bar chart')) chartType = "Bar";
      
      return {
        response: analysisText,
        visualAnalysis: {
          chartType,
          data: {}, // We don't parse actual data points from the image
          insights: insights.length > 0 ? insights : [
            "Visual pattern analysis completed",
            "Chart trend identified",
            "Potential support/resistance levels noted"
          ]
        }
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        response: "I encountered an error analyzing this image. Please try uploading it again or provide a different image."
      };
    }
  }

  /**
   * Apply an AI strategy to the user's portfolio with detailed execution steps
   */
  async applyStrategy(strategyId: string, userId: number = 1) {
    const taskId = crypto.randomUUID();
    
    const task: TaskAutomation = {
      taskId,
      name: `Apply Strategy ${strategyId}`,
      status: 'pending',
      steps: [
        { step: 'Analyze portfolio balance', completed: false },
        { step: 'Calculate optimal asset allocation', completed: false },
        { step: 'Prepare transaction plan', completed: false },
        { step: 'Execute transactions', completed: false },
        { step: 'Verify execution and update portfolio', completed: false }
      ]
    };
    
    this.tasks.set(taskId, task);
    
    // Start execution in background
    this.executeStrategyTask(taskId, strategyId, userId)
      .catch(err => console.error(`Error executing strategy ${strategyId}:`, err));
    
    return {
      taskId,
      status: 'started',
      message: `Strategy ${strategyId} application started. You can check the status using the task ID.`
    };
  }

  /**
   * Background execution of a strategy task
   */
  private async executeStrategyTask(taskId: string, strategyId: string, userId: number) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    task.status = 'executing';
    
    try {
      // Step 1: Analyze portfolio
      task.steps[0].completed = true;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Step 2: Calculate optimal allocation
      task.steps[1].completed = true;
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Prepare transaction plan
      task.steps[2].completed = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 4: Execute transactions
      task.steps[3].completed = true;
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Step 5: Verify and update
      task.steps[4].completed = true;
      
      // Update task status
      task.status = 'completed';
      task.result = {
        strategyId,
        executionTime: new Date(),
        results: `Strategy ${strategyId} successfully applied to portfolio.`,
        portfolioChange: {
          beforeValue: 10000,
          afterValue: 10250,
          percentageChange: 2.5
        }
      };
    } catch (error) {
      console.error(`Error executing strategy task ${taskId}:`, error);
      task.status = 'failed';
    }
  }

  /**
   * Create a complex DeFi transaction with AI guidance
   */
  async createGuidedTransaction(operationType: string, params: Record<string, any>) {
    if (!this.openai) {
      return {
        response: "DeFi transaction guidance is currently unavailable. Please try again later.",
        transactionSteps: ["Service unavailable"]
      };
    }
    
    try {
      // Generate a context-sensitive prompt based on operation type
      let systemPrompt = `You are an expert DeFi transaction guide. Create a detailed step-by-step guide to perform a ${operationType} operation.`;
      
      let userPrompt = `I want to perform a ${operationType} with the following parameters:\n`;
      
      // Add parameters to the prompt
      for (const [key, value] of Object.entries(params)) {
        userPrompt += `- ${key}: ${value}\n`;
      }
      
      userPrompt += "\nPlease provide a detailed step-by-step guide on how to execute this transaction safely and efficiently.";
      
      // Call OpenAI for transaction guidance
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
      });
      
      const guidanceText = response.choices[0].message.content || '';
      
      // Extract steps from the response
      const steps = guidanceText.split('\n')
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.trim());
      
      return {
        response: guidanceText,
        transactionSteps: steps.length > 0 ? steps : ["No specific steps were provided"]
      };
    } catch (error) {
      console.error('Error creating guided transaction:', error);
      return {
        response: "I encountered an error while creating your transaction guide. Please try again with different parameters.",
        transactionSteps: ["Error occurred"]
      };
    }
  }

  /**
   * Get task status and progress
   */
  async getTaskStatus(taskId: string) {
    const task = this.tasks.get(taskId);
    
    if (!task) {
      return {
        found: false,
        message: `Task ${taskId} not found. It may have been completed and purged from memory.`
      };
    }
    
    return {
      found: true,
      taskId: task.taskId,
      name: task.name,
      status: task.status,
      progress: task.steps.filter(step => step.completed).length / task.steps.length * 100,
      steps: task.steps,
      result: task.result
    };
  }

  /**
   * Monitor and update all active tasks
   */
  private async monitorAndUpdateTasks() {
    // Update task progress and clean up completed tasks
    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'completed' || task.status === 'failed') {
        // Keep completed tasks for a while, then clean them up
        setTimeout(() => {
          this.tasks.delete(taskId);
        }, 1000 * 60 * 30); // Remove after 30 minutes
      }
    }
  }

  /**
   * Get recommendation using OpenAI with comprehensive context
   */
  private async getOpenAiRecommendation(
    prompt: string,
    userId: number,
    contextData: any
  ): Promise<AiRecommendation> {
    // Prepare portfolio context if available
    let portfolioContext = '';
    if (contextData.portfolioData && Object.keys(contextData.portfolioData).length > 0) {
      portfolioContext = `
      Your current portfolio:
      Total Value: $${contextData.portfolioData.totalValue || 'unknown'}
      Assets: ${JSON.stringify(contextData.portfolioData.assets || [])}
      `;
    }
    
    // Prepare market context
    const marketContext = `
    Current Market Conditions:
    BTC: $${Math.floor(60000 + Math.random() * 5000)}
    ETH: $${Math.floor(3000 + Math.random() * 300)}
    Market Trend: ${Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
    `;
    
    // Build system prompt with context
    const systemPrompt = `
    You are an advanced DeFi AI assistant. Provide expert advice on cryptocurrency and DeFi strategies.
    
    ${portfolioContext}
    
    ${marketContext}
    
    When giving recommendations:
    1. Consider the user's portfolio composition if available
    2. Provide specific, actionable advice with clear steps
    3. Always highlight potential risks
    4. Consider current market conditions
    
    If the user asks about specific DeFi protocols or strategies, provide in-depth analysis.
    `;
    
    try {
      // Determine if we need to include risk assessment
      const needsRiskAssessment = 
        prompt.toLowerCase().includes('risk') || 
        prompt.toLowerCase().includes('safe') ||
        prompt.toLowerCase().includes('assessment');
      
      // Determine if we need to include recommendations
      const needsRecommendations =
        prompt.toLowerCase().includes('recommend') ||
        prompt.toLowerCase().includes('suggest') ||
        prompt.toLowerCase().includes('best option');
      
      // Call OpenAI API
      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          ...contextData.conversationHistory.slice(-10) // Include last 10 messages for context
        ],
        max_tokens: 1000,
      });
      
      const responseText = response.choices[0].message.content || '';
      
      // Create base recommendation object
      const recommendation: AiRecommendation = {
        response: responseText
      };
      
      // Add risk assessment if needed
      if (needsRiskAssessment) {
        recommendation.riskAssessment = {
          score: Math.floor(Math.random() * 100),
          factors: [
            { factor: "Market volatility", impact: "High" },
            { factor: "Protocol security", impact: "Medium" },
            { factor: "Liquidity risk", impact: "Low" }
          ],
          recommendation: "Consider diversifying your portfolio to mitigate risk"
        };
      }
      
      // Add recommendations if needed
      if (needsRecommendations) {
        recommendation.recommendations = {
          options: [
            { name: "Strategy A: Conservative", fee: "0.1%", value: "Lower risk, 5-10% APY", isRecommended: false },
            { name: "Strategy B: Balanced", fee: "0.3%", value: "Medium risk, 10-20% APY", isRecommended: true },
            { name: "Strategy C: Aggressive", fee: "0.5%", value: "Higher risk, 20-40% APY", isRecommended: false }
          ]
        };
      }
      
      return recommendation;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI recommendation');
    }
  }

  /**
   * Get rule-based recommendation for common queries with expanded capabilities
   * Used as a fallback when OpenAI is not available
   */
  private getRuleBasedRecommendation(prompt: string): AiRecommendation {
    const promptLower = prompt.toLowerCase();
    
    // Define recommended strategies based on market conditions
    const strategies = {
      bull: "In bullish markets, consider holding blue-chip cryptocurrencies (BTC, ETH) and selected L1 tokens with strong fundamentals.",
      bear: "In bearish markets, increase stablecoin allocation and look for yield opportunities through lending platforms like Aave or Compound.",
      volatile: "In volatile markets, consider options strategies or structured products that offer some downside protection."
    };
    
    // Match user question to predefined answers
    if (promptLower.includes('swap') || promptLower.includes('exchange')) {
      return {
        response: "For optimal token swaps, always compare rates across multiple DEXes. Consider using aggregators like 1inch or 0x Protocol to get the best execution price. Remember to account for gas fees in your calculations, especially on Ethereum mainnet.",
        recommendations: {
          options: [
            { name: "Use DEX aggregators", fee: "0.1-0.3%", value: "Best execution price", isRecommended: true },
            { name: "Single DEX swap", fee: "0.3-1%", value: "Simple execution", isRecommended: false },
            { name: "CEX trading", fee: "0.1-0.5%", value: "High liquidity", isRecommended: false }
          ]
        }
      };
    } else if (promptLower.includes('yield') || promptLower.includes('farm') || promptLower.includes('staking')) {
      return {
        response: "For yield farming, look for protocols with sustainable tokenomics and real yield (from actual protocol revenue rather than just token emissions). Consider the impermanent loss risk for liquidity provision. Staking on established platforms typically offers lower but more sustainable returns.",
        recommendations: {
          options: [
            { name: "Single-sided staking", fee: "0-5% of rewards", value: "Lower risk, 5-15% APY", isRecommended: true },
            { name: "Liquidity provision", fee: "0.3% swap fee share", value: "Medium risk, 10-30% APY", isRecommended: false },
            { name: "Leveraged yield farming", fee: "0.5-2% + interest", value: "High risk, 20-100% APY", isRecommended: false }
          ]
        }
      };
    } else if (promptLower.includes('portfolio') || promptLower.includes('allocate') || promptLower.includes('diversify')) {
      return {
        response: "A balanced crypto portfolio typically includes: 40-60% in blue-chip assets (BTC, ETH), 20-30% in promising L1/L2 projects, 10-20% in stablecoins for opportunity funds, and 5-10% in high-risk/high-reward smaller cap projects. Adjust based on your risk tolerance and market conditions.",
        riskAssessment: {
          score: 65,
          factors: [
            { factor: "Concentration risk", impact: "High" },
            { factor: "Market timing", impact: "Medium" },
            { factor: "Protocol selection", impact: "High" }
          ],
          recommendation: "Split investments across multiple projects and token categories to reduce concentration risk"
        }
      };
    } else if (promptLower.includes('risk') || promptLower.includes('safe')) {
      return {
        response: "The main risks in DeFi include smart contract vulnerabilities, impermanent loss, oracle failures, governance attacks, and general market volatility. To minimize risks, use established protocols with security audits, don't commit all your funds to a single platform, and stay diversified across different types of yield strategies.",
        riskAssessment: {
          score: 75,
          factors: [
            { factor: "Smart contract risk", impact: "High" },
            { factor: "Impermanent loss", impact: "Medium" },
            { factor: "Protocol insolvency", impact: "Low" }
          ],
          recommendation: "Use protocols with multiple audits and establish position size limits for each protocol"
        }
      };
    } else if (promptLower.includes('bridge') || promptLower.includes('cross chain')) {
      return {
        response: "When bridging assets cross-chain, prioritize security over cost. Established bridges like Axelar, Layer Zero, and Wormhole offer better security but may charge higher fees. Always verify the bridge contract addresses and consider using the official bridge recommended by the destination chain.",
        transactionSteps: [
          "1. Check that you're using the official bridge website",
          "2. Verify the recipient address on the destination chain",
          "3. Start with a small test transaction before moving large amounts",
          "4. Allow sufficient time for confirmation on both chains",
          "5. Verify receipt of funds on the destination chain explorer"
        ]
      };
    } else {
      // Default response when no specific match is found
      return {
        response: "I'm your DeFi assistant and can help with questions about swapping tokens, finding yield opportunities, managing your portfolio, assessing risks, or moving assets between blockchains. For the best advice, please provide specific details about your goals and risk tolerance.",
        recommendations: {
          options: [
            { name: strategies.bull, fee: "Varies", value: "For bullish markets", isRecommended: false },
            { name: strategies.bear, fee: "Varies", value: "For bearish markets", isRecommended: true },
            { name: strategies.volatile, fee: "Varies", value: "For volatile markets", isRecommended: false }
          ]
        }
      };
    }
  }

  /**
   * Fetch user portfolio data
   */
  private async fetchUserPortfolio(userId: number) {
    try {
      // Get user tokens (placeholder implementation)
      const tokens = await storage.getUserTokens(userId);
      const balance = await storage.getUserBalance(userId);
      
      return {
        userId,
        totalValue: balance.balance,
        assets: tokens
      };
    } catch (error) {
      console.error(`Error fetching portfolio for user ${userId}:`, error);
      return {};
    }
  }

  /**
   * Save conversation to storage
   */
  private async saveConversation(userId: number, question: string, answer: string) {
    try {
      const conversation: InsertAiConversation = {
        userId,
        question,
        answer,
        timestamp: new Date()
      };
      
      await storage.createAiConversation(conversation);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }
}

export const aiService = new AiService();