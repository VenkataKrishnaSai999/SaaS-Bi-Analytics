import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RegionalTrendChart = ({ selectedRegions, timeRange, onTimeRangeChange }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'growth']);

  const trendData = [
    {
      period: 'Jan 2025',
      north_sales: 2200000,
      north_growth: 10.2,
      north_share: 17.8,
      south_sales: 3000000,
      south_growth: 7.5,
      south_share: 23.2,
      east_sales: 2600000,
      east_growth: 13.8,
      east_share: 20.1,
      west_sales: 1950000,
      west_growth: 5.2,
      west_share: 15.1,
      central_sales: 2750000,
      central_growth: 9.8,
      central_share: 21.2
    },
    {
      period: 'Feb 2025',
      north_sales: 2300000,
      north_growth: 11.1,
      north_share: 18.0,
      south_sales: 3100000,
      south_growth: 8.0,
      south_share: 23.5,
      east_sales: 2700000,
      east_growth: 14.5,
      east_share: 20.5,
      west_sales: 2000000,
      west_growth: 6.0,
      west_share: 15.3,
      central_sales: 2800000,
      central_growth: 10.2,
      central_share: 21.4
    },
    {
      period: 'Mar 2025',
      north_sales: 2350000,
      north_growth: 11.8,
      north_share: 18.1,
      south_sales: 3150000,
      south_growth: 8.2,
      south_share: 23.6,
      east_sales: 2750000,
      east_growth: 15.0,
      east_share: 20.7,
      west_sales: 2050000,
      west_growth: 6.5,
      west_share: 15.4,
      central_sales: 2850000,
      central_growth: 10.5,
      central_share: 21.6
    },
    {
      period: 'Apr 2025',
      north_sales: 2400000,
      north_growth: 12.2,
      north_share: 18.1,
      south_sales: 3180000,
      south_growth: 8.1,
      south_share: 23.7,
      east_sales: 2780000,
      east_growth: 15.1,
      east_share: 20.8,
      west_sales: 2080000,
      west_growth: 6.6,
      west_share: 15.5,
      central_sales: 2880000,
      central_growth: 10.7,
      central_share: 21.7
    },
    {
      period: 'May 2025',
      north_sales: 2420000,
      north_growth: 12.3,
      north_share: 18.2,
      south_sales: 3190000,
      south_growth: 8.2,
      south_share: 23.7,
      east_sales: 2790000,
      east_growth: 15.1,
      east_share: 20.9,
      west_sales: 2090000,
      west_growth: 6.7,
      west_share: 15.6,
      central_sales: 2890000,
      central_growth: 10.8,
      central_share: 21.8
    },
    {
      period: 'Jun 2025',
      north_sales: 2450000,
      north_growth: 12.5,
      north_share: 18.2,
      south_sales: 3200000,
      south_growth: 8.3,
      south_share: 23.8,
      east_sales: 2800000,
      east_growth: 15.2,
      east_share: 20.9,
      west_sales: 2100000,
      west_growth: 6.7,
      west_share: 15.6,
      central_sales: 2900000,
      central_growth: 10.8,
      central_share: 21.5
    }
  ];

  const timeRangeOptions = [
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const metricOptions = [
    { value: 'sales', label: 'Sales Revenue', color: '#3B82F6' },
    { value: 'growth', label: 'Growth Rate', color: '#10B981' },
    { value: 'share', label: 'Market Share', color: '#F59E0B' }
  ];

  const regionColors = {
    north: '#3B82F6',
    south: '#10B981',
    east: '#8B5CF6',
    west: '#F59E0B',
    central: '#EF4444'
  };

  const formatTooltipValue = (value, name) => {
    const [region, metric] = name.split('_');
    
    switch (metric) {
      case 'sales':
        return [
          new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            minimumFractionDigits: 0 
          })?.format(value),
          `${region?.charAt(0)?.toUpperCase() + region?.slice(1)} Sales`
        ];
      case 'growth':
        return [`${value}%`, `${region?.charAt(0)?.toUpperCase() + region?.slice(1)} Growth`];
      case 'share':
        return [`${value}%`, `${region?.charAt(0)?.toUpperCase() + region?.slice(1)} Share`];
      default:
        return [value, name];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {formatTooltipValue(entry?.value, entry?.dataKey)?.[1]}:
                </span>
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

  const renderLines = () => {
    const lines = [];
    const regionsToShow = selectedRegions?.length > 0 ? selectedRegions : ['north', 'south', 'east', 'west', 'central'];
    
    regionsToShow?.forEach(region => {
      selectedMetrics?.forEach(metric => {
        const dataKey = `${region}_${metric}`;
        lines?.push(
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            stroke={regionColors?.[region]}
            strokeWidth={2}
            dot={{ fill: regionColors?.[region], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: regionColors?.[region], strokeWidth: 2 }}
            name={dataKey}
          />
        );
      });
    });
    
    return lines;
  };

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev?.includes(metric) 
        ? prev?.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Regional Trends</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={onTimeRangeChange}
            className="w-40"
          />
        </div>
      </div>
      {/* Metric Toggles */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm text-muted-foreground mr-2">Metrics:</span>
        {metricOptions?.map((metric) => (
          <Button
            key={metric?.value}
            variant={selectedMetrics?.includes(metric?.value) ? "default" : "outline"}
            size="sm"
            onClick={() => handleMetricToggle(metric?.value)}
            className="text-xs"
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: metric?.color }}
              />
              <span>{metric?.label}</span>
            </div>
          </Button>
        ))}
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Summary */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Showing:</span>
            <span className="ml-2 text-foreground font-medium">
              {selectedRegions?.length > 0 ? selectedRegions?.length : 5} regions
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Metrics:</span>
            <span className="ml-2 text-foreground font-medium">
              {selectedMetrics?.length} selected
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Period:</span>
            <span className="ml-2 text-foreground font-medium">
              {timeRangeOptions?.find(option => option?.value === timeRange)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalTrendChart;