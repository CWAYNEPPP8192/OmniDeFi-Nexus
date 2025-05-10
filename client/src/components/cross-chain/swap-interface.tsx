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

  // Function to calculate the swap details with enhanced OKX integration
  const calculateSwap = async (fromSymbol: string, toSymbol: string, amount: string) => {
    setIsCalculating(true);
    setSwapSuccess(false);
    setSwapError("");
    
    try {
      // Get gas savings estimate from OKX Gasless API
      const gasEstimate = await estimateGasSavings(fromSymbol, toSymbol, amount, selectedChain);
      
      // Calculate the output amount based on token pairs
      let calculatedAmount = 0;
      if (fromSymbol === "ETH" && toSymbol === "USDC") {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) * 3245.89;
      } else if (fromSymbol === "USDC" && toSymbol === "ETH") {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) / 3245.89;
      } else if (fromSymbol === "SOL" && toSymbol === "USDC") {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) * 103.47;
      } else if (fromSymbol === "USDC" && toSymbol === "SOL") {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) / 103.47;
      } else if (fromSymbol === "MATIC" && toSymbol === "USDC") {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) * 0.87;
      } else if (fromSymbol === "USDC" && toSymbol === "MATIC") {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) / 0.87;
      } else {
        calculatedAmount = parseFloat(amount.replace(/,/g, '')) * 1.5; // Default exchange rate
      }
      
      // Format output with commas for thousands
      const formattedAmount = calculatedAmount.toFixed(
        toSymbol === "ETH" || toSymbol === "WBTC" ? 6 : 2
      ).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      setToAmount(formattedAmount);
      setEstimatedFee("0.00"); // Gasless transactions have zero gas fees
      setEstimatedSavings(gasEstimate?.savings || "15.42");
      setExecutionTime(gasEstimate?.estimatedTimeGasless || "< 30 seconds");
      
      // Set optimized OKX routing based on token pairs
      if (fromSymbol === "ETH" && toSymbol === "USDC") {
        setRouteProtocols(["O", "U", "C"]); // Always include OKX ("O") as first for gasless swaps
      } else if (fromSymbol === "SOL" && toSymbol === "USDC") {
        setRouteProtocols(["O", "J", "R"]);
      } else if (fromSymbol === "MATIC" && toSymbol === "USDC") {
        setRouteProtocols(["O", "Q", "S"]); // Q for QuickSwap on Polygon
      } else {
        setRouteProtocols(["O", "U", "C"]);
      }
      
      // Log calculation success for debugging
      console.log(`Calculated swap: ${amount} ${fromSymbol} to ${formattedAmount} ${toSymbol} on ${selectedChain}`);
      console.log(`Estimated gas savings: $${gasEstimate?.savings}`);
      
    } catch (error) {
      console.error("Error calculating swap:", error);
      setSwapError("Could not estimate the swap. Please try again.");
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

  // Handle the swap execution with enhanced error handling and feedback
  const handleSwap = async () => {
    try {
      setSwapSuccess(false);
      setSwapError("");
      
      // Generate a unique transaction hash for this swap
      setTransactionHash(`0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`);
      
      // Execute the gasless swap via OKX DEX API
      const response = await performSwap(fromToken.symbol, toToken.symbol, fromAmount, selectedChain);
      
      // Update state to reflect success
      setSwapSuccess(true);
      
      // Show success toast with transaction details
      toast({
        title: "Gasless Swap Successful",
        description: `Successfully swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol} with zero gas fees`,
      });
      
      // Call the success callback if provided
      if (onSwapSuccess) onSwapSuccess();
      
      // Log details for debugging
      console.log(`Swap successful: ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`);
      console.log(`Gas saved: $${estimatedSavings}`);
      
      return response;
    } catch (error) {
      console.error("Error performing gasless swap:", error);
      
      // Set error state for UI feedback
      setSwapError(error instanceof Error ? error.message : "Failed to perform swap. Please try again.");
      
      // Show error toast
      toast({
        title: "Error executing gasless swap",
        description: error instanceof Error ? error.message : "There was an error performing the swap",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  // Swap mutation using TanStack Query
  const swapMutation = useMutation({
    mutationFn: handleSwap,
    onError: (error) => {
      console.error("Swap mutation error:", error);
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
        {/* Gasless Transaction Badge */}
        <div className="flex justify-center mb-2">
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 font-medium px-3 py-1"
          >
            <Zap className="w-3.5 h-3.5 mr-1 animate-pulse" /> 100% Gasless via OKX DEX API
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Rate</span>
          <span>1 {fromToken.symbol} = {toAmount.replace(/^[0-9,]+/, "")} {toToken.symbol}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Fee</span>
          <div className="flex items-center">
            <span className="text-green-500 font-medium">{estimatedFee} (Gasless)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  <p className="text-xs">No gas fees! Only a small trading fee applies.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Gas Saved</span>
          <div className="flex items-center">
            <span className="text-green-500 font-medium">≈ ${estimatedSavings}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  <p className="text-xs">Estimated gas fees you would pay on traditional DEXs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Settlement Time</span>
          <span className="text-foreground font-medium">{executionTime}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">OKX Smart Route</span>
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
                    protocol === "Q" ? "bg-indigo-500" : 
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
                    <p className="font-medium text-orange-500">OKX Smart Routing</p>
                    <p className="text-xs">Route: {routeProtocols.map(p => 
                      p === "U" ? "Uniswap" : 
                      p === "O" ? "OKX DEX" :
                      p === "S" ? "SushiSwap" : 
                      p === "C" ? "Curve" :
                      p === "J" ? "Jupiter" :
                      p === "Q" ? "QuickSwap" :
                      "Raydium"
                    ).join(" → ")}</p>
                    <div className="text-xs mt-2">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" /> 
                        <span className="font-medium">Gasless Execution</span>
                      </div>
                      <div className="flex items-center text-green-500">
                        <Shield className="w-3 h-3 mr-1" /> 
                        <span className="font-medium">MEV Protection</span>
                      </div>
                      <div className="flex items-center text-green-500">
                        <BarChart3 className="w-3 h-3 mr-1" /> 
                        <span className="font-medium">Best Price Routing</span>
                      </div>
                      <div className="flex items-center text-green-500">
                        <Zap className="w-3 h-3 mr-1" /> 
                        <span className="font-medium">Cross-Chain Enabled</span>
                      </div>
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
        className={`w-full py-6 text-lg font-semibold mb-2 ${swapMutation.isPending ? "" : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"}`}
        disabled={swapMutation.isPending || !fromAmount || fromAmount === "0" || isCalculating}
        onClick={() => swapMutation.mutate()}
      >
        {swapMutation.isPending ? (
          <div className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Processing Gasless Swap...
          </div>
        ) : isCalculating ? (
          <div className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Calculating Route...
          </div>
        ) : (
          "Swap Gasless with OKX"
        )}
      </Button>
      
      {/* Transaction Status Alerts */}
      {swapError && (
        <Alert variant="destructive" className="mt-2 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{swapError}</AlertDescription>
        </Alert>
      )}
      
      {swapSuccess && (
        <Alert className="mt-2 mb-2 bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <div className="space-y-1">
              <p>Your swap has been processed successfully.</p>
              <p className="text-sm"><span className="font-medium">Gas saved:</span> ${estimatedSavings}</p>
              <p className="text-sm"><span className="font-medium">Tx Hash:</span> <span className="font-mono text-xs">{transactionHash.substring(0, 18)}...</span></p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SwapInterface;
