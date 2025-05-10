import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArbitrageOpportunityData } from "@/lib/types";
import { ArrowRight, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { executeArbitrageTrade } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ArbitrageOpportunitiesProps {
  data?: ArbitrageOpportunityData[];
  isLoading: boolean;
}

// Default data for demo
const defaultData: ArbitrageOpportunityData[] = [
  {
    asset: "Ethereum",
    assetSymbol: "ETH",
    color: "bg-blue-500",
    from: "Uniswap",
    to: "Sushiswap",
    profitPercentage: "0.52%",
    profitAmount: "~$174",
    buyPrice: "$3,245.89",
    sellPrice: "$3,262.75"
  },
  {
    asset: "Solana",
    assetSymbol: "SOL",
    color: "bg-green-500",
    from: "Jupiter",
    to: "Raydium",
    profitPercentage: "0.83%",
    profitAmount: "~$127",
    buyPrice: "$103.47",
    sellPrice: "$104.33"
  }
];

const ArbitrageOpportunities = ({ data, isLoading }: ArbitrageOpportunitiesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [executingId, setExecutingId] = useState<number | null>(null);
  
  const opportunities = data || defaultData;

  const executeTradeMutation = useMutation({
    mutationFn: (id: number) => executeArbitrageTrade(id),
    onMutate: (id) => {
      setExecutingId(id);
    },
    onSuccess: () => {
      toast({
        title: "Trade executed",
        description: "The arbitrage trade has been successfully executed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/arbitrage/opportunities'] });
      setExecutingId(null);
    },
    onError: (error) => {
      toast({
        title: "Error executing trade",
        description: error.message || "There was an error executing the trade.",
        variant: "destructive",
      });
      setExecutingId(null);
    }
  });

  const handleExecuteTrade = (id: number) => {
    executeTradeMutation.mutate(id);
  };

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Arbitrage Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {opportunities.map((opportunity, index) => (
              <div 
                key={index} 
                className="bg-background rounded-xl p-3 border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${opportunity.color} flex items-center justify-center mr-2`}>
                      <span>{opportunity.assetSymbol}</span>
                    </div>
                    <div>
                      <div className="font-medium">{opportunity.asset} Arbitrage</div>
                      <div className="text-xs text-muted-foreground">{opportunity.from} ↔ {opportunity.to}</div>
                    </div>
                  </div>
                  <div className="text-green-500 text-right">
                    <div className="font-medium">+{opportunity.profitPercentage}</div>
                    <div className="text-xs">{opportunity.profitAmount}</div>
                  </div>
                </div>
                <div className="flex items-center text-sm mb-3">
                  <div className="flex-1 flex-col">
                    <div className="text-center mb-1">Buy Price</div>
                    <div className="bg-card rounded-lg p-2 text-center font-mono">{opportunity.buyPrice}</div>
                  </div>
                  <div className="px-2">
                    <ArrowRight className="text-primary" />
                  </div>
                  <div className="flex-1 flex-col">
                    <div className="text-center mb-1">Sell Price</div>
                    <div className="bg-card rounded-lg p-2 text-center font-mono">{opportunity.sellPrice}</div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => handleExecuteTrade(index)}
                  disabled={executingId === index}
                >
                  {executingId === index ? "Executing..." : "Execute Trade"}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="text-primary mr-3 h-5 w-5" />
            <div>
              <div className="text-sm">AI Strategy Suggestion</div>
              <div className="text-xs text-muted-foreground">Increase SOL exposure by 5% and reduce ETH by 3% to optimize for current market conditions</div>
            </div>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground">
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArbitrageOpportunities;
