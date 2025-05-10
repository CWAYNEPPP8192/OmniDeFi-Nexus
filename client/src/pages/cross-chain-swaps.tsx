import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import SwapInterface from "@/components/cross-chain/swap-interface";
import GasSavings from "@/components/cross-chain/gas-savings";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { fetchGasSavings } from "@/lib/api";
import { GasSavingsData } from "@/lib/types";
import { chainConfigs, ChainConfig, chainGroups } from "@/lib/chain-config";

// Function to assign appropriate colors based on chain ID
function getChainColor(chainId: string): string {
  const colorMap: Record<string, string> = {
    ethereum: "bg-blue-500", 
    polygon: "bg-purple-500",
    solana: "bg-green-500",
    avalanche: "bg-red-500",
    bnb: "bg-yellow-500",
    bsc: "bg-yellow-500", // Alias for BNB Chain
    arbitrum: "bg-blue-600",
    base: "bg-blue-400",
    optimism: "bg-red-600",
    zksync: "bg-blue-700",
    linea: "bg-teal-500",
    mantle: "bg-indigo-600",
    scroll: "bg-pink-500",
    manta: "bg-cyan-600",
    blast: "bg-orange-500",
    mode: "bg-violet-500"
  };
  
  return colorMap[chainId] || "bg-gray-500";
}

// Map chain configs to UI display format
const supportedChains = [
  // Main chains
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: getChainColor("ethereum"), routerAddress: chainConfigs.ethereum.routerAddress, approvalAddress: chainConfigs.ethereum.approvalAddress },
  { id: "polygon", name: "Polygon", symbol: "MATIC", color: getChainColor("polygon"), routerAddress: chainConfigs.polygon.routerAddress, approvalAddress: chainConfigs.polygon.approvalAddress },
  { id: "solana", name: "Solana", symbol: "SOL", color: getChainColor("solana"), routerAddress: chainConfigs.solana.routerAddress, approvalAddress: chainConfigs.solana.approvalAddress },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", color: getChainColor("avalanche"), routerAddress: chainConfigs.avalanche.routerAddress, approvalAddress: chainConfigs.avalanche.approvalAddress },
  { id: "bsc", name: "BNB Chain", symbol: "BNB", color: getChainColor("bsc"), routerAddress: chainConfigs.bnb.routerAddress, approvalAddress: chainConfigs.bnb.approvalAddress },
  
  // Popular L2s
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", color: getChainColor("arbitrum"), routerAddress: chainConfigs.arbitrum.routerAddress, approvalAddress: chainConfigs.arbitrum.approvalAddress },
  { id: "optimism", name: "Optimism", symbol: "OP", color: getChainColor("optimism"), routerAddress: chainConfigs.optimism.routerAddress, approvalAddress: chainConfigs.optimism.approvalAddress },
  { id: "base", name: "Base", symbol: "ETH", color: getChainColor("base"), routerAddress: chainConfigs.base.routerAddress, approvalAddress: chainConfigs.base.approvalAddress },
  
  // Emerging L2s & Other Networks
  { id: "zksync", name: "zkSync Era", symbol: "ETH", color: getChainColor("zksync"), routerAddress: chainConfigs.zksync.routerAddress, approvalAddress: chainConfigs.zksync.approvalAddress },
  { id: "linea", name: "Linea", symbol: "ETH", color: getChainColor("linea"), routerAddress: chainConfigs.linea.routerAddress, approvalAddress: chainConfigs.linea.approvalAddress },
  { id: "mantle", name: "Mantle", symbol: "MNT", color: getChainColor("mantle"), routerAddress: chainConfigs.mantle.routerAddress, approvalAddress: chainConfigs.mantle.approvalAddress },
  { id: "scroll", name: "Scroll", symbol: "ETH", color: getChainColor("scroll"), routerAddress: chainConfigs.scroll.routerAddress, approvalAddress: chainConfigs.scroll.approvalAddress },
  { id: "manta", name: "Manta", symbol: "ETH", color: getChainColor("manta"), routerAddress: chainConfigs.manta.routerAddress, approvalAddress: chainConfigs.manta.approvalAddress },
  { id: "blast", name: "Blast", symbol: "ETH", color: getChainColor("blast"), routerAddress: chainConfigs.blast.routerAddress, approvalAddress: chainConfigs.blast.approvalAddress },
  { id: "mode", name: "Mode", symbol: "ETH", color: getChainColor("mode"), routerAddress: chainConfigs.mode.routerAddress, approvalAddress: chainConfigs.mode.approvalAddress },
];

const CrossChainSwaps = () => {
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState(supportedChains[0]);
  
  // Get chain from URL if present
  useEffect(() => {
    // Check if URL has chain param, like from sidebar navigation
    const urlParams = new URLSearchParams(window.location.search);
    const chainParam = urlParams.get('chain');
    
    if (chainParam) {
      const matchedChain = supportedChains.find(c => c.id === chainParam.toLowerCase());
      if (matchedChain) {
        setSelectedChain(matchedChain);
      }
    }
  }, []);
  
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
            <div className="h-[280px] overflow-y-auto pr-1">
              {/* Main Chains Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Main Chains</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {supportedChains.slice(0, 5).map((chain) => (
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
              </div>
              
              {/* Popular L2s Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular L2s</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {supportedChains.slice(5, 8).map((chain) => (
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
              </div>
              
              {/* Emerging Networks Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Emerging Networks</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {supportedChains.slice(8).map((chain) => (
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
              </div>
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
              routerAddress={selectedChain.routerAddress}
              approvalAddress={selectedChain.approvalAddress}
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
        
        {/* OKX Gasless API Integration Card */}
        <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
          <CardHeader>
            <CardTitle className="text-lg font-medium">OKX Gasless Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">AI Smart Routing</span>
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">100% Gas Free</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-background text-xs">U</div>
                    <ArrowRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center border-2 border-background text-xs">O</div>
                    <ArrowRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center border-2 border-background text-xs">C</div>
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">Via Uniswap → OKX → Curve</span>
                </div>
              </div>
              
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="text-sm font-medium mb-2">OKX DEX API Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-2" />
                    <span>Zero gas fees on all transactions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-2" />
                    <span>Multi-chain liquidity aggregation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-2" />
                    <span>MEV protection built-in</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price Impact:</span>
                  <span className="text-sm">0.05%</span>
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
