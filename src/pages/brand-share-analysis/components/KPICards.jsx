import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICards = ({ data, filters }) => {
  // Calculate KPIs based on filtered data
  const calculateKPIs = () => {
    let filteredData = [...data];

    // Apply filters
    if (filters?.category && filters?.category !== 'all') {
      filteredData = filteredData?.filter(item => item?.category === filters?.category);
    }

    if (filters?.region && filters?.region !== 'all') {
      filteredData = filteredData?.filter(item => item?.region === filters?.region);
    }

    // Find SUNBULAH brand data
    const sunbulahBrand = filteredData?.find(item => 
      item?.brand?.toLowerCase()?.includes('sunbulah')
    );

    // Calculate total market size
    const totalMarketValue = filteredData?.reduce((sum, item) => sum + item?.value, 0);
    const totalMarketVolume = filteredData?.reduce((sum, item) => sum + item?.volume, 0);

    // Calculate average growth
    const avgGrowth = filteredData?.reduce((sum, item) => sum + item?.growth, 0) / filteredData?.length;

    return {
      sunbulahShare: sunbulahBrand ? sunbulahBrand?.marketShare : 0,
      sunbulahRank: sunbulahBrand ? sunbulahBrand?.rank : 0,
      sunbulahGrowth: sunbulahBrand ? sunbulahBrand?.growth : 0,
      totalMarketValue,
      totalMarketVolume,
      avgGrowth,
      totalBrands: filteredData?.length,
      topPerformer: filteredData?.sort((a, b) => b?.marketShare - a?.marketShare)?.[0]
    };
  };

  const kpis = calculateKPIs();

  const kpiCards = [
    {
      title: 'SUNBULAH Market Share',
      value: `${kpis?.sunbulahShare?.toFixed(1)}%`,
      change: kpis?.sunbulahGrowth,
      icon: 'Star',
      color: 'primary',
      description: 'Current market position'
    },
    {
      title: 'Market Rank',
      value: `#${kpis?.sunbulahRank}`,
      change: kpis?.sunbulahRank <= 3 ? 5.2 : -2.1,
      icon: 'Trophy',
      color: kpis?.sunbulahRank === 1 ? 'warning' : kpis?.sunbulahRank <= 3 ? 'success' : 'secondary',
      description: 'Position among competitors'
    },
    {
      title: 'Total Market Value',
      value: `$${(kpis?.totalMarketValue / 1000000)?.toFixed(1)}M`,
      change: 8.3,
      icon: 'DollarSign',
      color: 'success',
      description: 'Overall market size'
    },
    {
      title: 'Market Growth',
      value: `${kpis?.avgGrowth?.toFixed(1)}%`,
      change: kpis?.avgGrowth,
      icon: 'TrendingUp',
      color: kpis?.avgGrowth >= 0 ? 'success' : 'error',
      description: 'Average category growth'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      secondary: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return {
        icon: 'ArrowUp',
        color: 'text-success',
        prefix: '+'
      };
    } else if (change < 0) {
      return {
        icon: 'ArrowDown',
        color: 'text-error',
        prefix: ''
      };
    }
    return {
      icon: 'Minus',
      color: 'text-muted-foreground',
      prefix: ''
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards?.map((kpi, index) => {
        const changeIndicator = getChangeIndicator(kpi?.change);
        
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation transition-smooth"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg border ${getColorClasses(kpi?.color)}`}>
                <Icon name={kpi?.icon} size={24} />
              </div>
              <div className={`flex items-center space-x-1 ${changeIndicator?.color}`}>
                <Icon name={changeIndicator?.icon} size={16} />
                <span className="text-sm font-medium">
                  {changeIndicator?.prefix}{Math.abs(kpi?.change)?.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {kpi?.title}
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {kpi?.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {kpi?.description}
              </p>
            </div>
            {/* Progress bar for market share */}
            {kpi?.title?.includes('Market Share') && (
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(kpis?.sunbulahShare * 2, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;