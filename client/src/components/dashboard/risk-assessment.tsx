import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioRiskData } from "@/lib/types";
import { useEffect, useState } from "react";

interface RiskAssessmentProps {
  data?: any; // Using any to handle both API format and component format
  isLoading: boolean;
}

// Default data for demo
const defaultData: PortfolioRiskData = {
  riskScore: {
    value: 65,
    label: "Moderate",
    color: "text-yellow-500"
  },
  metrics: {
    assetDiversification: 60,
    protocolExposure: 75,
    chainDiversification: 30,
    stablecoinRatio: 85
  }
};

const getRiskColor = (value: number) => {
  if (value < 40) return "bg-red-500";
  if (value < 70) return "bg-yellow-500";
  return "bg-green-500";
};

const getRiskLabel = (value: number) => {
  if (value < 40) return "High Risk";
  if (value < 70) return "Moderate";
  return "Low Risk";
};

// Function to normalize API data to component format
const normalizeRiskData = (apiData: any): PortfolioRiskData => {
  // If data already has the right structure, return it
  if (apiData.metrics && typeof apiData.riskScore === 'object') {
    return apiData;
  }
  
  // Otherwise transform from API format
  return {
    riskScore: {
      value: apiData.riskScore || 50,
      label: getRiskLabel(apiData.riskScore || 50),
      color: getRiskColor(apiData.riskScore || 50).replace('bg-', 'text-')
    },
    metrics: {
      assetDiversification: apiData.assetDiversification || 50,
      protocolExposure: apiData.protocolExposure || 50,
      chainDiversification: apiData.chainDiversification || 50,
      stablecoinRatio: apiData.stablecoinRatio || 50
    }
  };
};

const RiskAssessment = ({ data, isLoading }: RiskAssessmentProps) => {
  // Ensure we always have valid data by using a default if data is undefined
  const rawData = data || defaultData;
  
  // Normalize data to component format
  const [portfolioData, setPortfolioData] = useState<PortfolioRiskData>(defaultData);
  
  useEffect(() => {
    if (rawData) {
      setPortfolioData(normalizeRiskData(rawData));
    }
  }, [rawData]);

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-muted">
                <span className={`text-xl font-bold ${portfolioData.riskScore.color}`}>
                  {portfolioData.riskScore.value}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium">{portfolioData.riskScore.label}</h3>
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Asset Diversification</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getRiskColor(portfolioData.metrics.assetDiversification)} rounded-full`} 
                    style={{ width: `${portfolioData.metrics.assetDiversification}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Protocol Exposure</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getRiskColor(portfolioData.metrics.protocolExposure)} rounded-full`} 
                    style={{ width: `${portfolioData.metrics.protocolExposure}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chain Diversification</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getRiskColor(portfolioData.metrics.chainDiversification)} rounded-full`} 
                    style={{ width: `${portfolioData.metrics.chainDiversification}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stablecoin Ratio</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getRiskColor(portfolioData.metrics.stablecoinRatio)} rounded-full`} 
                    style={{ width: `${portfolioData.metrics.stablecoinRatio}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">View Detailed Analysis</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;