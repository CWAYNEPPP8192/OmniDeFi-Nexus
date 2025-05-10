import { apiRequest } from "./queryClient";

export async function fetchArbitrageOpportunities() {
  const response = await fetch('/api/arbitrage/opportunities');
  if (!response.ok) throw new Error('Failed to fetch arbitrage opportunities');
  return response.json();
}

export async function executeArbitrageTrade(id: number) {
  return apiRequest('POST', `/api/arbitrage/execute/${id}`, {});
}

export async function fetchYieldOpportunities(filters?: Record<string, any>) {
  const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  const response = await fetch(`/api/yield/opportunities${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch yield opportunities');
  return response.json();
}

export async function depositToYield(id: number, amount: string) {
  return apiRequest('POST', `/api/yield/deposit/${id}`, { amount });
}

export async function fetchPortfolioRisk(userId?: number) {
  const queryParams = userId ? `?userId=${userId}` : '';
  const response = await fetch(`/api/portfolio/risk${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch portfolio risk');
  return response.json();
}

export async function fetchMarketTrends(timeframe: string = '24h') {
  const response = await fetch(`/api/market/trends?timeframe=${timeframe}`);
  if (!response.ok) throw new Error('Failed to fetch market trends');
  return response.json();
}

export async function performSwap(
  fromToken: string, 
  toToken: string, 
  amount: string, 
  chain: string,
  routerAddress?: string,
  approvalAddress?: string
) {
  return apiRequest('POST', '/api/swap', { 
    fromToken, 
    toToken, 
    amount, 
    chain,
    routerAddress,  // Include router address if provided
    approvalAddress // Include approval address if provided
  });
}

export async function estimateGasSavings(fromToken: string, toToken: string, amount: string, chain: string) {
  const response = await fetch(`/api/swap/gas-estimate?fromToken=${fromToken}&toToken=${toToken}&amount=${amount}&chain=${chain}`);
  if (!response.ok) throw new Error('Failed to estimate gas savings');
  return response.json();
}

export async function fetchGasSavings(userId?: number) {
  const queryParams = userId ? `?userId=${userId}` : '';
  const response = await fetch(`/api/gas-savings${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch gas savings');
  return response.json();
}

export async function fetchAiRecommendation(prompt: string) {
  return apiRequest('POST', '/api/ai/recommendation', { prompt });
}

export async function fetchAiConversationHistory(userId?: number) {
  const queryParams = userId ? `?userId=${userId}` : '';
  const response = await fetch(`/api/ai/conversations${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch AI conversation history');
  return response.json();
}

export async function applyAiStrategy(strategyId: string) {
  return apiRequest('POST', `/api/ai/apply-strategy/${strategyId}`, {});
}

export async function fetchUserBalance() {
  const response = await fetch('/api/balance');
  if (!response.ok) throw new Error('Failed to fetch user balance');
  return response.json();
}

export async function fetchUserTokens() {
  const response = await fetch('/api/tokens');
  if (!response.ok) throw new Error('Failed to fetch user tokens');
  return response.json();
}

export async function searchProtocols(query: string) {
  const response = await fetch(`/api/protocols/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search protocols');
  return response.json();
}
