import { storage } from "../storage";
import OpenAI from "openai";

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
}

/**
 * Service for AI-powered recommendations and strategies
 */
export class AiService {
  private openai: OpenAI | null = null;
  
  constructor() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }
  
  /**
   * Get AI recommendation based on user prompt
   */
  async getRecommendation(prompt: string): Promise<AiRecommendation> {
    try {
      console.log(`Getting AI recommendation for prompt: ${prompt}`);
      
      // If OpenAI is available, use it to generate recommendations
      if (this.openai) {
        return await this.getOpenAiRecommendation(prompt);
      }
      
      // Otherwise, provide rule-based responses for common queries
      return this.getRuleBasedRecommendation(prompt);
    } catch (error) {
      console.error("Error getting AI recommendation:", error);
      throw new Error(`Failed to get AI recommendation: ${(error as Error).message}`);
    }
  }
  
  /**
   * Apply an AI strategy to the user's portfolio
   */
  async applyStrategy(strategyId: string) {
    try {
      console.log(`Applying AI strategy: ${strategyId}`);
      
      // In a real application, this would execute trades, modify portfolio allocations, etc.
      
      // Simulate a delay to represent strategy execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return the strategy execution result
      return {
        success: true,
        strategyId,
        timestamp: new Date(),
        message: "Strategy applied successfully"
      };
    } catch (error) {
      console.error(`Error applying AI strategy ${strategyId}:`, error);
      throw new Error(`Failed to apply AI strategy: ${(error as Error).message}`);
    }
  }
  
  /**
   * Get recommendation using OpenAI
   */
  private async getOpenAiRecommendation(prompt: string): Promise<AiRecommendation> {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await this.openai!.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for OmniDeFi Nexus, a platform that combines DEX+CEX arbitrage trading, cross-chain DeFi tools, and AI-powered trading assistants. 
          Provide helpful, concise advice about DeFi, trading strategies, and blockchain technology. 
          When appropriate, include structured recommendations in your response.
          Output in JSON format with 'response' field for the text response, and 'recommendations' field containing options when relevant.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  }
  
  /**
   * Get rule-based recommendation for common queries
   * Used as a fallback when OpenAI is not available
   */
  private getRuleBasedRecommendation(prompt: string): AiRecommendation {
    const promptLower = prompt.toLowerCase();
    
    // Gas fee reduction query
    if (promptLower.includes("gas") || promptLower.includes("fee")) {
      return {
        response: "I recommend using our gasless swap feature! It uses OKX's Gasless API to eliminate gas fees completely. Here are your options:",
        recommendations: {
          options: [
            {
              name: "Uniswap route",
              fee: "0.3%",
              value: "1 ETH → 3,245.89 USDC",
              isRecommended: false
            },
            {
              name: "OKX Gasless",
              fee: "0.2%",
              value: "1 ETH → 3,247.92 USDC",
              isRecommended: true
            }
          ]
        }
      };
    }
    
    // Yield optimization query
    if (promptLower.includes("yield") || promptLower.includes("apy") || promptLower.includes("staking")) {
      return {
        response: "Based on your portfolio, I've found some optimal yield opportunities. Here are the best options for your assets:",
        recommendations: {
          options: [
            {
              name: "Aave V3 USDC",
              fee: "0%",
              value: "4.32% APY on Polygon",
              isRecommended: false
            },
            {
              name: "Raydium USDC-SOL LP",
              fee: "0%",
              value: "12.74% APY on Solana",
              isRecommended: true
            }
          ]
        }
      };
    }
    
    // Portfolio optimization query
    if (promptLower.includes("portfolio") || promptLower.includes("risk") || promptLower.includes("diversify")) {
      return {
        response: "Your portfolio could benefit from better chain diversification. Currently, 70% of your assets are on Ethereum. Here's my recommendation:",
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
              fee: "-",
              value: "50% ETH, 30% SOL, 20% MATIC",
              isRecommended: true
            }
          ]
        }
      };
    }
    
    // Default response for other queries
    return {
      response: "I can help you optimize your DeFi strategy across multiple chains. You can ask about gas fees, yield opportunities, portfolio risk, or arbitrage strategies. What specific information are you looking for today?"
    };
  }
}
