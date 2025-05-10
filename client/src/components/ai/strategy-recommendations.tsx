import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, BrainCircuit, Lightbulb, Sparkles, Timer, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { applyAiStrategy } from "@/lib/api";

// Sample strategies for demonstration
const strategies = [
  {
    id: "strategy-1",
    title: "Optimal Yield Strategy",
    description: "Rebalance your assets to maximize yield across chains and protocols",
    impact: "+3.42% APY Increase",
    risk: "Low",
    icon: <TrendingUp className="h-5 w-5" />,
    timeframe: "Medium-term",
    details: "This strategy redistributes your assets from low-yield positions to higher-yield opportunities while maintaining your risk profile. It focuses on capturing the higher APYs on Solana while keeping exposure to blue-chip assets on Ethereum."
  },
  {
    id: "strategy-2",
    title: "Arbitrage Opportunity",
    description: "Execute ETH/USDC arbitrage between Uniswap and OKX",
    impact: "+0.82% Profit",
    risk: "Very Low",
    icon: <BarChart3 className="h-5 w-5" />,
    timeframe: "Immediate",
    details: "There's currently a price discrepancy between Uniswap and OKX for the ETH/USDC pair. This strategy executes a gasless arbitrage trade to capture approximately 0.82% profit with minimal risk."
  },
  {
    id: "strategy-3",
    title: "Risk Hedging",
    description: "Diversify across chains to reduce single-chain dependency",
    impact: "-15% Volatility",
    risk: "Very Low",
    icon: <Sparkles className="h-5 w-5" />,
    timeframe: "Long-term",
    details: "Your portfolio currently has heavy exposure to Ethereum. This strategy recommends redistributing approximately 25% of your ETH-based assets to Solana, Polygon, and Arbitrum to reduce chain-specific risks."
  }
];

const StrategyRecommendations = () => {
  const { toast } = useToast();
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  
  const { data: aiStrategies, isLoading } = useQuery({
    queryKey: ['/api/ai/strategies'],
    enabled: false, // Disabled for now, using static data
  });
  
  const strategiesData = aiStrategies || strategies;
  
  const applyStrategyMutation = useMutation({
    mutationFn: applyAiStrategy,
    onSuccess: () => {
      toast({
        title: "Strategy Applied",
        description: "The AI strategy has been successfully applied to your portfolio.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Apply Strategy",
        description: error.message || "There was an error applying the strategy.",
        variant: "destructive",
      });
    }
  });
  
  const toggleExpand = (id: string) => {
    if (expandedStrategy === id) {
      setExpandedStrategy(null);
    } else {
      setExpandedStrategy(id);
    }
  };
  
  const handleApplyStrategy = (id: string) => {
    applyStrategyMutation.mutate(id);
  };

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Strategy Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {strategiesData.map((strategy) => (
              <Card 
                key={strategy.id}
                className={`bg-background hover:bg-background/80 transition-all duration-200 border-border ${expandedStrategy === strategy.id ? 'card-highlight card-glow' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${expandedStrategy === strategy.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} mr-3`}>
                        {strategy.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{strategy.title}</h3>
                        <p className="text-xs text-muted-foreground">{strategy.description}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => toggleExpand(strategy.id)}
                    >
                      {expandedStrategy === strategy.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className={`mt-2 grid grid-cols-3 gap-2 ${expandedStrategy === strategy.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'} transition-all duration-300`}>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Impact</div>
                      <div className="text-sm font-medium text-green-500">{strategy.impact}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Risk</div>
                      <div className="text-sm font-medium">{strategy.risk}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Timeframe</div>
                      <div className="text-sm font-medium flex items-center justify-center">
                        <Timer className="h-3 w-3 mr-1 inline" /> {strategy.timeframe}
                      </div>
                    </div>
                  </div>
                  
                  {expandedStrategy === strategy.id && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-sm mb-3">{strategy.details}</div>
                      <Button 
                        className="w-full"
                        onClick={() => handleApplyStrategy(strategy.id)}
                        disabled={applyStrategyMutation.isPending && applyStrategyMutation.variables === strategy.id}
                      >
                        {applyStrategyMutation.isPending && applyStrategyMutation.variables === strategy.id ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Applying...
                          </div>
                        ) : (
                          <span className="flex items-center">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Apply Strategy
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
          <div className="flex items-center text-sm font-medium mb-1">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            AI Insight
          </div>
          <p className="text-xs text-muted-foreground">
            Based on market analysis, consider increasing exposure to layer-2 solutions as they're showing strong growth potential with reduced gas costs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyRecommendations;
