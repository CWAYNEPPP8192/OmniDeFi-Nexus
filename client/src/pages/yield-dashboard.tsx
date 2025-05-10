import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OpportunitiesTable from "@/components/yield/opportunities-table";
import { fetchYieldOpportunities } from "@/lib/api";
import { YieldOpportunityData } from "@/lib/types";

const riskLevels = [
  { value: "all", label: "All Risks" },
  { value: "low", label: "Low Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "high", label: "High Risk" }
];

const chains = [
  { value: "all", label: "All Chains" },
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "solana", label: "Solana" },
  { value: "avalanche", label: "Avalanche" },
  { value: "bsc", label: "BNB Chain" }
];

const assets = [
  { value: "all", label: "All Assets" },
  { value: "stablecoins", label: "Stablecoins" },
  { value: "eth", label: "ETH" },
  { value: "btc", label: "BTC" },
  { value: "lp", label: "LP Tokens" }
];

const YieldDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedChain, setSelectedChain] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState("all");
  
  const { data: yieldOpportunities, isLoading: isLoadingYield } = useQuery({
    queryKey: ['/api/yield/opportunities', { risk: selectedRisk, chain: selectedChain, asset: selectedAsset, search: searchTerm }],
    queryFn: () => fetchYieldOpportunities({ risk: selectedRisk, chain: selectedChain, asset: selectedAsset, search: searchTerm })
  });

  return (
    <div>
      {/* Alert Banner */}
      <Alert className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
          <AlertDescription>
            Always research protocols before depositing. High APY often comes with higher risk.
          </AlertDescription>
        </div>
      </Alert>

      {/* Filters */}
      <Card className="bg-card rounded-xl shadow-lg border border-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Filter Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Input
                type="text"
                placeholder="Search protocols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div>
              <select 
                value={selectedRisk} 
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {riskLevels.map(risk => (
                  <option key={risk.value} value={risk.value}>{risk.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select 
                value={selectedChain} 
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {chains.map(chain => (
                  <option key={chain.value} value={chain.value}>{chain.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select 
                value={selectedAsset} 
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {assets.map(asset => (
                  <option key={asset.value} value={asset.value}>{asset.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yield Opportunities Table */}
      <Card className="bg-card rounded-xl shadow-lg border border-border">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Yield Opportunities</CardTitle>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <OpportunitiesTable 
            isLoading={isLoadingYield} 
            data={yieldOpportunities as YieldOpportunityData[]} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldDashboard;
