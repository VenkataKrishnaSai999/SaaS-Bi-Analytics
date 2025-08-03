import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegionalBarChart = ({ selectedRegions, selectedMetrics, onDrillDown }) => {
  const [viewMode, setViewMode] = useState('sales'); // sales, growth, share

  const chartData = [
    {
      region: 'North',
      sales: 2450000,
      growth: 12.5,
      marketShare: 18.2,
      volume: 1850,
      territories: 15,
      penetration: 78.5
    },
    {
      region: 'South',
      sales: 3200000,
      growth: 8.3,
      marketShare: 23.8,
      volume: 2400,
      territories: 22,
      penetration: 85.2
    },
    {
      region: 'East',
      sales: 2800000,
      growth: 15.2,
      marketShare: 20.9,
      volume: 2100,
      territories: 18,
      penetration: 82.1
    },
    {
      region: 'West',
      sales: 2100000,
      growth: 6.7,
      marketShare: 15.6,
      volume: 1600,
      territories: 12,
      penetration: 71.3
    },
    {
      region: 'Central',
      sales: 2900000,
      growth: 10.8,
      marketShare: 21.5,
      volume: 2200,
      territories: 20,
      penetration: 79.8
    }
  ];

  const filteredData = selectedRegions?.length > 0 
    ? chartData?.filter(item => selectedRegions?.includes(item?.region?.toLowerCase()))
    : chartData;

  const viewModeOptions = [
    { key: 'sales', label: 'Sales Performance', icon: 'DollarSign' },
    { key: 'growth', label: 'Growth Rate', icon: 'TrendingUp' },
    { key: 'share', label: 'Market Share', icon: 'PieChart' }
  ];

  const formatTooltipValue = (value, name) => {
    switch (name) {
      case 'sales':
        return [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })?.format(value), 'Sales'];
      case 'growth':
        return [`${value}%`, 'Growth Rate'];
      case 'marketShare':
        return [`${value}%`, 'Market Share'];
      case 'volume':
        return [`${value}K units`, 'Volume'];
      case 'penetration':
        return [`${value}%`, 'Market Penetration'];
      default:
        return [value, name];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation">
          <p className="font-semibold text-foreground mb-2">{`${label} Region`}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground">{entry?.name}:</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatTooltipValue(entry?.value, entry?.dataKey)?.[0]}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (onDrillDown) {
      onDrillDown(data?.region?.toLowerCase(), viewMode);
    }
  };

  const getBarColor = (viewMode) => {
    switch (viewMode) {
      case 'sales':
        return 'var(--color-primary)';
      case 'growth':
        return 'var(--color-success)';
      case 'share':
        return 'var(--color-accent)';
      default:
        return 'var(--color-primary)';
    }
  };

  const renderBars = () => {
    switch (viewMode) {
      case 'sales':
        return (
          <>
            <Bar 
              dataKey="sales" 
              fill={getBarColor('sales')} 
              name="Sales"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
            <Bar 
              dataKey="volume" 
              fill="var(--color-secondary)" 
              name="Volume (K units)"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
          </>
        );
      case 'growth':
        return (
          <Bar 
            dataKey="growth" 
            fill={getBarColor('growth')} 
            name="Growth Rate (%)"
            onClick={handleBarClick}
            className="cursor-pointer"
          />
        );
      case 'share':
        return (
          <>
            <Bar 
              dataKey="marketShare" 
              fill={getBarColor('share')} 
              name="Market Share (%)"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
            <Bar 
              dataKey="penetration" 
              fill="var(--color-warning)" 
              name="Market Penetration (%)"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Regional Performance</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {viewModeOptions?.map((option) => (
            <Button
              key={option?.key}
              variant={viewMode === option?.key ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(option?.key)}
              iconName={option?.icon}
              iconSize={16}
              className="text-xs"
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="region" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Controls */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              Showing {filteredData?.length} of {chartData?.length} regions
            </span>
            {selectedRegions?.length > 0 && (
              <span className="text-primary">
                Filtered by: {selectedRegions?.join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Click bars to drill down into territories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalBarChart;