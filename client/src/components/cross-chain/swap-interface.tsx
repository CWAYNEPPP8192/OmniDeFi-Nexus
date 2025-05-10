import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDown, RefreshCw, Info, Zap, AlertCircle, CheckCircle, Shield, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { performSwap, estimateGasSavings } from "@/lib/api";

interface SwapInterfaceProps {
  selectedChain: string;
  onSwapSuccess?: () => void;
}

// Mock tokens for demonstration
const tokens = {
  ethereum: [
    { symbol: "ETH", name: "Ethereum", balance: "1.45", icon: "bg-blue-500" },
    { symbol: "USDC", name: "USD Coin", balance: "2,500.00", icon: "bg-blue-400" },
    { symbol: "USDT", name: "Tether", balance: "1,000.00", icon: "bg-green-500" },
    { symbol: "DAI", name: "Dai", balance: "5,000.00", icon: "bg-yellow-500" },
  ],
  polygon: [
    { symbol: "MATIC", name: "Polygon", balance: "2,500.00", icon: "bg-purple-500" },
    { symbol: "USDC", name: "USD Coin", balance: "1,000.00", icon: "bg-blue-400" },
    { symbol: "WBTC", name: "Wrapped Bitcoin", balance: "0.05", icon: "bg-orange-500" },
    { symbol: "AAVE", name: "Aave", balance: "10.00", icon: "bg-pink-500" },
  ],
  solana: [
    { symbol: "SOL", name: "Solana", balance: "25.00", icon: "bg-green-500" },
    { symbol: "USDC", name: "USD Coin", balance: "500.00", icon: "bg-blue-400" },
    { symbol: "RAY", name: "Raydium", balance: "100.00", icon: "bg-purple-400" },
    { symbol: "SRM", name: "Serum", balance: "200.00", icon: "bg-red-400" },
  ],
  // Add other chains as needed
};

const getDefaultTokens = (chain: string) => {
  const chainTokens = tokens[chain as keyof typeof tokens] || tokens.ethereum;
  return {
    from: chainTokens[0],
    to: chainTokens[1]
  };
};

const SwapInterface = ({ selectedChain, onSwapSuccess }: SwapInterfaceProps) => {
  const { toast } = useToast();
  const chainTokens = tokens[selectedChain as keyof typeof tokens] || tokens.ethereum;
  
  const [fromToken, setFromToken] = useState(chainTokens[0]);
  const [toToken, setToToken] = useState(chainTokens[1]);
  const [fromAmount, setFromAmount] = useState("1.0");
  const [toAmount, setToAmount] = useState("3,245.89");
  const [estimatedFee, setEstimatedFee] = useState("0.00");
  const [estimatedSavings, setEstimatedSavings] = useState("0.00");
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeProtocols, setRouteProtocols] = useState<string[]>(["O", "U", "C"]);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapError, setSwapError] = useState("");
  const [executionTime, setExecutionTime] = useState("< 30 seconds");
  const [transactionHash, setTransactionHash] = useState("");
  
  // Reset tokens when chain changes
  useEffect(() => {
    const defaults = getDefaultTokens(selectedChain);
    setFromToken(defaults.from);
    setToToken(defaults.to);
    calculateSwap(defaults.from.symbol, defaults.to.symbol, "1.0");
  }, [selectedChain]);

  // Function to calculate the swap details
  const calculateSwap = async (fromSymbol: string, toSymbol: string, amount: string) => {
    setIsCalculating(true);
    
    try {
      // In a real application, this would call the API to get the estimate
      const gasEstimate = await estimateGasSavings(fromSymbol, toSymbol, amount, selectedChain);
      
      // For demo purposes, we'll use some placeholder calculations
      const rate = fromSymbol === "ETH" ? 3245.89 : fromSymbol === "SOL" ? 103.47 : 2.5;
      const calculatedAmount = parseFloat(amount.replace(/,/g, '')) * rate;
      
      setToAmount(calculatedAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      setEstimatedFee("0.00");
      setEstimatedSavings(gasEstimate?.savings || "15.42");
      
      // Simulate different routing protocols based on tokens
      if (fromSymbol === "ETH" && toSymbol === "USDC") {
        setRouteProtocols(["U", "S", "C"]);
      } else if (fromSymbol === "SOL" && toSymbol === "USDC") {
        setRouteProtocols(["J", "R"]);
      } else {
        setRouteProtocols(["U", "C"]);
      }
    } catch (error) {
      toast({
        title: "Error calculating swap",
        description: "Could not estimate the swap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle from token amount change
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    calculateSwap(fromToken.symbol, toToken.symbol, value);
  };

  // Handle from token selection change
  const handleFromTokenChange = (value: string) => {
    const newToken = chainTokens.find(t => t.symbol === value) || chainTokens[0];
    setFromToken(newToken);
    calculateSwap(newToken.symbol, toToken.symbol, fromAmount);
  };

  // Handle to token selection change
  const handleToTokenChange = (value: string) => {
    const newToken = chainTokens.find(t => t.symbol === value) || chainTokens[1];
    setToToken(newToken);
    calculateSwap(fromToken.symbol, newToken.symbol, fromAmount);
  };

  // Swap the tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    calculateSwap(toToken.symbol, fromToken.symbol, fromAmount);
  };

  // Swap mutation
  const swapMutation = useMutation({
    mutationFn: () => performSwap(fromToken.symbol, toToken.symbol, fromAmount, selectedChain),
    onSuccess: () => {
      toast({
        title: "Swap successful",
        description: `Successfully swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`,
      });
      if (onSwapSuccess) onSwapSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error executing swap",
        description: error.message || "There was an error performing the swap",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-4">
      {/* From Token Selection */}
      <Card className="bg-background rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">From</span>
          <span className="text-xs text-muted-foreground">Balance: {fromToken.balance} {fromToken.symbol}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full ${fromToken.icon} flex items-center justify-center mr-2`}>
              <span className="text-xs font-medium text-white">{fromToken.symbol}</span>
            </div>
            <Select defaultValue={fromToken.symbol} onValueChange={handleFromTokenChange}>
              <SelectTrigger className="bg-transparent border-0 text-foreground font-medium focus:ring-0 focus:ring-offset-0 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Token</SelectLabel>
                  {chainTokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Input
            type="text"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            className="bg-transparent text-right text-foreground text-lg font-mono font-medium w-32 focus:outline-none border-0 focus:ring-0"
          />
        </div>
        <div className="text-right text-xs text-muted-foreground mt-1">
          ≈ ${parseFloat(fromAmount.replace(/,/g, '')) * (fromToken.symbol === "ETH" ? 3245.89 : fromToken.symbol === "SOL" ? 103.47 : 1)}
        </div>
      </Card>
      
      {/* Swap Icon */}
      <div className="flex justify-center -my-2 relative z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-10 h-10 rounded-full bg-primary border-none text-primary-foreground"
          onClick={handleSwapTokens}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
      
      {/* To Token Selection */}
      <Card className="bg-background rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">To</span>
          <span className="text-xs text-muted-foreground">Balance: {toToken.balance} {toToken.symbol}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full ${toToken.icon} flex items-center justify-center mr-2`}>
              <span className="text-xs font-medium text-white">{toToken.symbol}</span>
            </div>
            <Select defaultValue={toToken.symbol} onValueChange={handleToTokenChange}>
              <SelectTrigger className="bg-transparent border-0 text-foreground font-medium focus:ring-0 focus:ring-offset-0 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Token</SelectLabel>
                  {chainTokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {isCalculating ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <Input
              type="text"
              value={toAmount}
              readOnly
              className="bg-transparent text-right text-foreground text-lg font-mono font-medium w-32 focus:outline-none border-0 focus:ring-0"
            />
          )}
        </div>
        <div className="text-right text-xs text-muted-foreground mt-1">
          ≈ ${toAmount.replace(/,/g, '')}
        </div>
      </Card>
      
      {/* Swap Details */}
      <Card className="rounded-lg bg-background p-3 mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Rate</span>
          <span>1 {fromToken.symbol} = {toAmount} {toToken.symbol}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Fee</span>
          <span className="text-green-500">{estimatedFee} (Gasless)</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Gas Saved</span>
          <span className="text-green-500">≈ ${estimatedSavings}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">OKX Route</span>
          <div className="flex items-center">
            <div className="flex">
              {routeProtocols.map((protocol, index) => (
                <div 
                  key={index}
                  className={`w-5 h-5 rounded-full ${
                    protocol === "U" ? "bg-blue-500" : 
                    protocol === "O" ? "bg-orange-500" : // OKX highlighted
                    protocol === "S" ? "bg-pink-500" : 
                    protocol === "C" ? "bg-purple-500" : 
                    protocol === "J" ? "bg-orange-400" : 
                    "bg-green-500"
                  } flex items-center justify-center ${index > 0 ? "-ml-1" : ""} border-2 border-background text-xs text-white`}
                >
                  {protocol}
                </div>
              ))}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="p-3 max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">OKX Smart Routing</p>
                    <p className="text-xs">Route: {routeProtocols.map(p => 
                      p === "U" ? "Uniswap" : 
                      p === "O" ? "OKX DEX" :
                      p === "S" ? "SushiSwap" : 
                      p === "C" ? "Curve" :
                      p === "J" ? "Jupiter" :
                      "Raydium"
                    ).join(" → ")}</p>
                    <div className="text-xs mt-2">
                      <p className="text-primary font-medium">✓ Gasless Execution</p>
                      <p className="text-primary font-medium">✓ MEV Protection</p>
                      <p className="text-primary font-medium">✓ Best Price Routing</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
      
      {/* Swap Button */}
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition duration-200 ease-in-out"
        onClick={() => swapMutation.mutate()}
        disabled={swapMutation.isPending || fromAmount === "" || parseFloat(fromAmount.replace(/,/g, '')) <= 0}
      >
        {swapMutation.isPending ? (
          <div className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </div>
        ) : (
          "Swap Now"
        )}
      </Button>
    </div>
  );
};

export default SwapInterface;
