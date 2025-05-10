import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioRiskData } from "@/lib/types";

interface RiskAssessmentProps {
  data?: PortfolioRiskData;
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

const RiskAssessment = ({ data, isLoading }: RiskAssessmentProps) => {
  // Ensure we always have valid data by using a default if data is undefined
  const portfolioData = data || defaultData;

  // Safety check to prevent runtime errors
  if (!portfolioData || typeof portfolioData.metrics?.assetDiversification === 'undefined') {
    console.warn('Portfolio risk data is not properly structured');
    return (
      <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Portfolio Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading risk assessment data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="bg-background rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Risk Score</span>
                <span className={`${portfolioData.riskScore.color} font-medium`}>
                  {portfolioData.riskScore.label}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" 
                  style={{ width: `${portfolioData.riskScore.value}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
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
            
            <Button 
              className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20"
            >
              View Detailed Report
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
