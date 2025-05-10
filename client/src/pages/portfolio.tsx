import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, PieChart, ArrowUpDown, DollarSign, RefreshCw } from "lucide-react";

const Portfolio = () => {
  // Sample data for demonstration
  const assets = [
    { id: 1, name: "Ethereum", symbol: "ETH", balance: "1.45", value: "$4,706.54", change: "+2.5%", color: "bg-blue-500" },
    { id: 2, name: "USD Coin", symbol: "USDC", balance: "2,500.00", value: "$2,500.00", change: "0%", color: "bg-blue-400" },
    { id: 3, name: "Solana", symbol: "SOL", balance: "25.00", value: "$2,586.75", change: "+4.2%", color: "bg-green-500" },
    { id: 4, name: "Polygon", symbol: "MATIC", balance: "2,500.00", value: "$2,175.00", change: "-0.8%", color: "bg-purple-500" },
    { id: 5, name: "Avalanche", symbol: "AVAX", balance: "34.5", value: "$1,181.47", change: "+1.7%", color: "bg-red-500" },
  ];

  const totalValue = "$13,149.76";
  const totalProfit = "$542.25";
  const percentageChange = "+4.3%";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Value Card */}
        <Card className="bg-card rounded-xl shadow-lg border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalValue}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0">
                    {percentageChange}
                  </Badge>
                  <span className="text-sm ml-2 text-muted-foreground">Last 24h</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Profit Card */}
        <Card className="bg-card rounded-xl shadow-lg border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-500">{totalProfit}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0">
                    {percentageChange}
                  </Badge>
                  <span className="text-sm ml-2 text-muted-foreground">Last 30d</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation Card */}
        <Card className="bg-card rounded-xl shadow-lg border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground">Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">5 Assets</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-muted-foreground">Diversified portfolio</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Table */}
      <Card className="bg-card rounded-xl shadow-lg border border-border">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Your Assets</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-muted-foreground text-sm border-b border-border">
                  <th className="text-left font-medium py-2 pl-3">Asset</th>
                  <th className="text-right font-medium py-2">Balance</th>
                  <th className="text-right font-medium py-2">Value</th>
                  <th className="text-right font-medium py-2 pr-3">24h</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 pl-3">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${asset.color} flex items-center justify-center mr-3`}>
                          <span className="text-xs font-medium text-white">{asset.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono">{asset.balance}</td>
                    <td className="py-3 text-right font-mono">{asset.value}</td>
                    <td className="py-3 pr-3 text-right">
                      <Badge variant="outline" className={`
                        ${asset.change.startsWith("-") 
                          ? "bg-red-500/10 text-red-500" 
                          : asset.change === "0%" 
                            ? "bg-gray-500/10 text-gray-500" 
                            : "bg-green-500/10 text-green-500"
                        } border-0
                      `}>
                        {asset.change}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-card rounded-xl shadow-lg border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ArrowUpDown className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">No recent transactions</p>
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              Make a Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;