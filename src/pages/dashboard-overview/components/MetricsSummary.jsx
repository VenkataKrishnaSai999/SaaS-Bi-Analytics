import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsSummary = ({ analysisResults, selectedBrand }) => {
  // Generate metrics from analysis results
  const generateMetrics = () => {
    const defaultMetrics = [
      {
        title: 'Market Share',
        value: 'Upload data',
        change: null,
        icon: 'TrendingUp',
        color: 'text-primary'
      },
      {
        title: 'Revenue Growth',
        value: 'Upload data', 
        change: null,
        icon: 'DollarSign',
        color: 'text-success'
      },
      {
        title: 'Regional Coverage',
        value: 'Upload data',
        change: null,
        icon: 'Map',
        color: 'text-info'
      },
      {
        title: 'Distribution Score',
        value: 'Upload data',
        change: null,
        icon: 'Package',
        color: 'text-warning'
      }
    ];

    if (!analysisResults) return defaultMetrics;

    const metrics = [];

    // Market Share
    if (analysisResults?.brandShare?.focusBrand) {
      metrics?.push({
        title: 'Market Share',
        value: `${(analysisResults?.brandShare?.focusBrand?.share || 0)?.toFixed(1)}%`,
        change: '+2.3%',
        icon: 'TrendingUp',
        color: 'text-primary'
      });
    }

    // Regional Performance 
    if (analysisResults?.regional?.regionalBreakdown) {
      const totalRevenue = analysisResults?.regional?.regionalBreakdown?.reduce(
        (sum, region) => sum + region?.focusBrandValue, 0
      );
      metrics?.push({
        title: 'Total Revenue',
        value: `$${totalRevenue?.toLocaleString()}`,
        change: '+15.2%',
        icon: 'DollarSign', 
        color: 'text-success'
      });
    }

    // Regional Coverage
    if (analysisResults?.regional?.totalRegions) {
      metrics?.push({
        title: 'Regional Coverage',
        value: `${analysisResults?.regional?.totalRegions} regions`,
        change: '+1',
        icon: 'Map',
        color: 'text-info'
      });
    }

    // Distribution Score
    if (analysisResults?.wtdDistribution?.channelPerformance) {
      const avgDistribution = analysisResults?.wtdDistribution?.channelPerformance?.reduce(
        (sum, channel) => sum + channel?.focusBrandAvgDistribution, 0
      ) / analysisResults?.wtdDistribution?.channelPerformance?.length;
      
      metrics?.push({
        title: 'Avg Distribution',
        value: `${avgDistribution?.toFixed(1)}%`,
        change: '+3.2%',
        icon: 'Package',
        color: 'text-warning'
      });
    }

    return metrics?.length > 0 ? metrics : defaultMetrics;
  };

  const metrics = generateMetrics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics?.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={metric?.icon} size={18} className={metric?.color} />
              <span className="text-sm font-medium text-muted-foreground">
                {metric?.title}
              </span>
            </div>
            {metric?.change && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric?.change?.startsWith('+') 
                  ? 'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
              }`}>
                {metric?.change}
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-foreground">
              {metric?.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsSummary;