import React from 'react';
import Icon from '../../../components/AppIcon';

const WTDMetricsCards = ({ metricsData }) => {
  const metrics = [
    {
      id: 'current-wtd',
      title: 'Current WTD',
      value: metricsData?.currentWTD,
      unit: '%',
      change: metricsData?.wtdChange,
      changeType: metricsData?.wtdChange >= 0 ? 'positive' : 'negative',
      icon: 'TrendingUp',
      description: 'Weighted distribution percentage'
    },
    {
      id: 'coverage-improvement',
      title: 'Coverage Improvement',
      value: metricsData?.coverageImprovement,
      unit: '%',
      change: metricsData?.coverageChange,
      changeType: metricsData?.coverageChange >= 0 ? 'positive' : 'negative',
      icon: 'Target',
      description: 'Month-over-month improvement'
    },
    {
      id: 'availability-score',
      title: 'Availability Score',
      value: metricsData?.availabilityScore,
      unit: '/100',
      change: metricsData?.availabilityChange,
      changeType: metricsData?.availabilityChange >= 0 ? 'positive' : 'negative',
      icon: 'CheckCircle',
      description: 'Product availability index'
    },
    {
      id: 'distribution-reach',
      title: 'Distribution Reach',
      value: metricsData?.distributionReach,
      unit: ' stores',
      change: metricsData?.reachChange,
      changeType: metricsData?.reachChange >= 0 ? 'positive' : 'negative',
      icon: 'MapPin',
      description: 'Total store coverage'
    }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevation transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name={metric?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{metric?.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{metric?.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-foreground">
                {metric?.value?.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">{metric?.unit}</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 ${getChangeColor(metric?.changeType)}`}>
                <Icon name={getChangeIcon(metric?.changeType)} size={14} />
                <span className="text-sm font-medium">
                  {Math.abs(metric?.change)}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WTDMetricsCards;