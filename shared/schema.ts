import { pgTable, text, serial, integer, boolean, decimal, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  walletAddress: text("wallet_address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  walletAddress: true,
});

// Arbitrage opportunities
export const arbitrageOpportunities = pgTable("arbitrage_opportunities", {
  id: serial("id").primaryKey(),
  asset: text("asset").notNull(),
  buyExchange: text("buy_exchange").notNull(),
  sellExchange: text("sell_exchange").notNull(),
  buyPrice: decimal("buy_price", { precision: 20, scale: 8 }).notNull(),
  sellPrice: decimal("sell_price", { precision: 20, scale: 8 }).notNull(),
  profitPercentage: decimal("profit_percentage", { precision: 8, scale: 4 }).notNull(),
  profitAmount: decimal("profit_amount", { precision: 20, scale: 8 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertArbitrageSchema = createInsertSchema(arbitrageOpportunities).omit({
  id: true,
});

// Yield opportunities
export const yieldOpportunities = pgTable("yield_opportunities", {
  id: serial("id").primaryKey(),
  protocol: text("protocol").notNull(),
  asset: text("asset").notNull(),
  chain: text("chain").notNull(),
  apy: decimal("apy", { precision: 8, scale: 2 }).notNull(),
  tvl: decimal("tvl", { precision: 20, scale: 2 }).notNull(),
  isRecommended: boolean("is_recommended").default(false),
  riskLevel: text("risk_level").notNull(),
});

export const insertYieldSchema = createInsertSchema(yieldOpportunities).omit({
  id: true,
});

// Gas savings tracker
export const gasSavings = pgTable("gas_savings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  transactionType: text("transaction_type").notNull(),
  chain: text("chain").notNull(),
  gasSaved: decimal("gas_saved", { precision: 20, scale: 8 }).notNull(),
  usdValue: decimal("usd_value", { precision: 20, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertGasSavingsSchema = createInsertSchema(gasSavings).omit({
  id: true,
});

// Portfolio assessment
export const portfolioRisk = pgTable("portfolio_risk", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).notNull(),
  assetDiversification: decimal("asset_diversification", { precision: 5, scale: 2 }).notNull(),
  protocolExposure: decimal("protocol_exposure", { precision: 5, scale: 2 }).notNull(),
  chainDiversification: decimal("chain_diversification", { precision: 5, scale: 2 }).notNull(),
  stablecoinRatio: decimal("stablecoin_ratio", { precision: 5, scale: 2 }).notNull(),
  recommendations: jsonb("recommendations"),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertPortfolioRiskSchema = createInsertSchema(portfolioRisk).omit({
  id: true,
});

// AI Assistant conversations
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  question: text("question").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
});

// Market data
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  asset: text("asset").notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  change24h: decimal("change_24h", { precision: 8, scale: 2 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ArbitrageOpportunity = typeof arbitrageOpportunities.$inferSelect;
export type InsertArbitrageOpportunity = z.infer<typeof insertArbitrageSchema>;

export type YieldOpportunity = typeof yieldOpportunities.$inferSelect;
export type InsertYieldOpportunity = z.infer<typeof insertYieldSchema>;

export type GasSaving = typeof gasSavings.$inferSelect;
export type InsertGasSaving = z.infer<typeof insertGasSavingsSchema>;

export type PortfolioRisk = typeof portfolioRisk.$inferSelect;
export type InsertPortfolioRisk = z.infer<typeof insertPortfolioRiskSchema>;

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
