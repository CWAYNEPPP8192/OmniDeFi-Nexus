import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OverviewCards from "@/components/dashboard/overview-cards";
import MarketTrends from "@/components/dashboard/market-trends";
import ArbitrageOpportunities from "@/components/dashboard/arbitrage-opportunities";
import RiskAssessment from "@/components/dashboard/risk-assessment";
import { fetchArbitrageOpportunities, fetchMarketTrends, fetchPortfolioRisk } from "@/lib/api";
import { ArbitrageOpportunityData, PortfolioRiskData } from "@/lib/types";

const Dashboard = () => {
  const { data: marketTrendsData, isLoading: isLoadingMarketTrends } = useQuery({
    queryKey: ['/api/market/trends'],
    queryFn: () => fetchMarketTrends('24h')
  });

  const { data: arbitrageData, isLoading: isLoadingArbitrage } = useQuery({
    queryKey: ['/api/arbitrage/opportunities'],
    queryFn: fetchArbitrageOpportunities
  });

  const { data: portfolioRiskData, isLoading: isLoadingPortfolioRisk } = useQuery({
    queryKey: ['/api/portfolio/risk'],
    queryFn: () => fetchPortfolioRisk()
  });

  return (
    <div>
      {/* Alert Banner */}
      <Alert className="bg-primary/10 border border-primary/20 rounded-lg mb-6">
        <div className="flex items-center justify-between w-full">
          <AlertDescription className="flex items-center">
            <svg className="mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>Experience gasless swaps with OKX DEX integration. <a href="#" className="text-primary hover:underline">Learn more</a></span>
          </AlertDescription>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </Button>
        </div>
      </Alert>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Market Insights and Swap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Market Trends Chart - 2 Columns Wide */}
        <div className="lg:col-span-2">
          <MarketTrends isLoading={isLoadingMarketTrends} data={marketTrendsData} />
        </div>

        {/* Gasless Swap Card */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium">Gasless Swap</h2>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-xs text-green-500">
                  <svg className="mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.3 5a9 9 0 0 1 1.4 1.6M15.4 3a20 20 0 0 1 1.5 2M11 3a20 20 0 0 1 2 5"/>
                    <path d="M2 19h16"/>
                    <path d="M12 19v-8.5a3.5 3.5 0 0 0-7 0V19"/>
                  </svg>
                  No gas fees
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Swap instantly across 20+ chains without paying gas</p>
          </div>
          
          <div className="p-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition duration-200 ease-in-out">
              Go to Swap Interface
            </Button>
          </div>
        </div>
      </div>
      
      {/* Yield Opportunities and Risk Assessment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Assessment Card */}
        <div>
          <RiskAssessment isLoading={isLoadingPortfolioRisk} data={portfolioRiskData as PortfolioRiskData} />
        </div>
        
        {/* Arbitrage Opportunities Card - 2 Columns Wide */}
        <div className="lg:col-span-2">
          <ArbitrageOpportunities 
            isLoading={isLoadingArbitrage} 
            data={arbitrageData as ArbitrageOpportunityData[]} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
