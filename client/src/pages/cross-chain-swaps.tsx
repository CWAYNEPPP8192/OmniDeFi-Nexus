import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import SwapInterface from "@/components/cross-chain/swap-interface";
import GasSavings from "@/components/cross-chain/gas-savings";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { fetchGasSavings } from "@/lib/api";
import { GasSavingsData } from "@/lib/types";

const supportedChains = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", color: "bg-purple-500" },
  { id: "solana", name: "Solana", symbol: "SOL", color: "bg-green-500" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", color: "bg-red-500" },
  { id: "bsc", name: "BNB Chain", symbol: "BNB", color: "bg-yellow-500" },
  { id: "optimism", name: "Optimism", symbol: "OP", color: "bg-red-600" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", color: "bg-blue-600" },
  { id: "base", name: "Base", symbol: "ETH", color: "bg-blue-400" },
];

const CrossChainSwaps = () => {
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState(supportedChains[0]);
  
  const { data: gasSavingsData, isLoading: isLoadingGasSavings } = useQuery({
    queryKey: ['/api/gas-savings'],
    queryFn: () => fetchGasSavings()
  });

  const handleSwapSuccess = () => {
    toast({
      title: "Swap Successful",
      description: "Your token swap was completed successfully.",
      variant: "default",
    });
  };

  return (
    <div>
      {/* Success Banner */}
      <Alert className="bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
        <div className="flex items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
          <AlertDescription>
            Your tokens can be swapped across chains with zero gas fees. Powered by OKX Gasless API.
          </AlertDescription>
        </div>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Supported Chains */}
        <Card className="bg-card rounded-xl shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Supported Chains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {supportedChains.map((chain) => (
                <div 
                  key={chain.id}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedChain.id === chain.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedChain(chain)}
                >
                  <div className={`w-8 h-8 rounded-full ${chain.color} flex items-center justify-center mb-2`}>
                    <span className="text-xs font-bold text-white">{chain.symbol.charAt(0)}</span>
                  </div>
                  <span className="text-xs font-medium">{chain.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Swap Interface */}
        <Card className="bg-card rounded-xl shadow-lg border border-border lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Gasless Cross-Chain Swap</CardTitle>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full ${selectedChain.color} flex items-center justify-center mr-1`}>
                  <span className="text-xs font-bold text-white">{selectedChain.symbol.charAt(0)}</span>
                </div>
                <span className="text-sm">{selectedChain.name}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SwapInterface 
              selectedChain={selectedChain.id} 
              onSwapSuccess={handleSwapSuccess} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gas Savings Metrics */}
        <div className="lg:col-span-2">
          <GasSavings 
            isLoading={isLoadingGasSavings} 
            data={gasSavingsData as GasSavingsData} 
          />
        </div>
        
        {/* Routing Explainer Card */}
        <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
          <CardHeader>
            <CardTitle className="text-lg font-medium">AI Smart Routing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Route Optimization</span>
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Saving 0.3%</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-background text-xs">U</div>
                    <ArrowRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center border-2 border-background text-xs">S</div>
                    <ArrowRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center border-2 border-background text-xs">C</div>
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">Via Uniswap → SushiSwap → Curve</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price Impact:</span>
                  <span className="text-sm">0.05%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">MEV Protection:</span>
                  <span className="text-sm text-green-500">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Slippage Tolerance:</span>
                  <span className="text-sm">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Protocol Fee:</span>
                  <span className="text-sm">0.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrossChainSwaps;
