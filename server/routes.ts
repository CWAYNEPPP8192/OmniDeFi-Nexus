import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ArbitrageService } from "./services/arbitrage";
import { OkxService } from "./services/okx";
import { AiService } from "./services/ai";
import path from "path";

// Services initialization
const arbitrageService = new ArbitrageService();
const okxService = new OkxService();
const aiService = new AiService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Arbitrage routes
  app.get("/api/arbitrage/opportunities", async (req, res) => {
    try {
      const opportunities = await arbitrageService.getOpportunities();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch arbitrage opportunities", error: (error as Error).message });
    }
  });

  app.post("/api/arbitrage/execute/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await arbitrageService.executeTrade(parseInt(id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to execute arbitrage trade", error: (error as Error).message });
    }
  });

  // Yield opportunities routes
  app.get("/api/yield/opportunities", async (req, res) => {
    try {
      const filters = req.query;
      const opportunities = await storage.getYieldOpportunities(filters);
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch yield opportunities", error: (error as Error).message });
    }
  });

  app.post("/api/yield/deposit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const result = await okxService.depositToYield(parseInt(id), amount);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to process deposit", error: (error as Error).message });
    }
  });

  // Portfolio risk routes
  app.get("/api/portfolio/risk", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const risk = await storage.getPortfolioRisk(userId);
      res.json(risk);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio risk data", error: (error as Error).message });
    }
  });

  // Market data routes
  app.get("/api/market/trends", async (req, res) => {
    try {
      const { timeframe = "24h" } = req.query;
      const trends = await storage.getMarketTrends(timeframe as string);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market trends", error: (error as Error).message });
    }
  });

  // Swap routes
  app.post("/api/swap", async (req, res) => {
    try {
      const { fromToken, toToken, amount, chain } = req.body;
      const result = await okxService.performSwap(fromToken, toToken, amount, chain);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform swap", error: (error as Error).message });
    }
  });

  app.get("/api/swap/gas-estimate", async (req, res) => {
    try {
      const { fromToken, toToken, amount, chain } = req.query;
      const estimate = await okxService.estimateGasSavings(
        fromToken as string,
        toToken as string, 
        amount as string, 
        chain as string
      );
      res.json(estimate);
    } catch (error) {
      res.status(500).json({ message: "Failed to estimate gas savings", error: (error as Error).message });
    }
  });

  // Gas savings routes
  app.get("/api/gas-savings", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const savings = await storage.getGasSavings(userId);
      res.json(savings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gas savings", error: (error as Error).message });
    }
  });

  // AI routes
  app.post("/api/ai/recommendation", async (req, res) => {
    try {
      const { prompt } = req.body;
      const recommendation = await aiService.getRecommendation(prompt);
      
      // Store the conversation
      if (req.query.userId) {
        await storage.createAiConversation({
          userId: parseInt(req.query.userId as string),
          question: prompt,
          response: recommendation.response,
          timestamp: new Date()
        });
      }
      
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI recommendation", error: (error as Error).message });
    }
  });

  app.get("/api/ai/conversations", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const conversations = await storage.getAiConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI conversations", error: (error as Error).message });
    }
  });

  app.post("/api/ai/apply-strategy/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await aiService.applyStrategy(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to apply AI strategy", error: (error as Error).message });
    }
  });

  // User balance and tokens routes
  app.get("/api/balance", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const balance = await storage.getUserBalance(userId);
      res.json(balance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user balance", error: (error as Error).message });
    }
  });

  app.get("/api/tokens", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const tokens = await storage.getUserTokens(userId);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tokens", error: (error as Error).message });
    }
  });

  // Protocol search route
  app.get("/api/protocols/search", async (req, res) => {
    try {
      const { q } = req.query;
      const protocols = await storage.searchProtocols(q as string);
      res.json(protocols);
    } catch (error) {
      res.status(500).json({ message: "Failed to search protocols", error: (error as Error).message });
    }
  });

  // Serve the logo image
  app.get("/images/logo.png", (req, res) => {
    const logoPath = path.join(process.cwd(), 'images', 'OmniDeFi_Nexus_Logo.png');
    res.sendFile(logoPath);
  });

  const httpServer = createServer(app);

  return httpServer;
}
