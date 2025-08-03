import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const BrandShareChart = ({ data, filters, onBrandSelect }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);

  const chartData = useMemo(() => {
    let filteredData = [...data];

    // Apply filters
    if (filters?.category && filters?.category !== 'all') {
      filteredData = filteredData?.filter(item => item?.category === filters?.category);
    }

    if (filters?.region && filters?.region !== 'all') {
      filteredData = filteredData?.filter(item => item?.region === filters?.region);
    }

    // Sort by market share descending
    return filteredData?.sort((a, b) => b?.marketShare - a?.marketShare);
  }, [data, filters]);

  const handleBarClick = (data) => {
    if (onBrandSelect) {
      onBrandSelect(data);
    }
  };

  const handleLegendClick = (dataKey) => {
    setSelectedBrands(prev => {
      if (prev?.includes(dataKey)) {
        return prev?.filter(brand => brand !== dataKey);
      } else {
        return [...prev, dataKey];
      }
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-elevation">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Market Share:</span>
              <span className="font-medium ml-2">{data?.marketShare?.toFixed(1)}%</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-medium ml-2">{data?.volume?.toLocaleString()} units</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium ml-2">${data?.value?.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Growth:</span>
              <span className={`font-medium ml-2 ${data?.growth >= 0 ? 'text-success' : 'text-error'}`}>
                {data?.growth >= 0 ? '+' : ''}{data?.growth?.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBrandColor = (brandName) => {
    if (brandName?.toLowerCase()?.includes('sunbulah')) {
      return '#2563EB'; // Primary blue for SUNBULAH
    }
    
    const colors = [
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#8B5CF6', // violet-500
      '#06B6D4', // cyan-500
      '#F97316', // orange-500
      '#84CC16', // lime-500
      '#EC4899'  // pink-500
    ];
    
    const index = brandName?.length % colors?.length;
    return colors?.[index];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Brand Market Share Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {chartData?.length} brands • Updated {new Date()?.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedBrands([])}
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            Show All
          </button>
          <Icon name="BarChart3" size={20} className="text-primary" />
        </div>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="brand" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="var(--color-muted-foreground)"
            />
            <YAxis 
              label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }}
              fontSize={12}
              stroke="var(--color-muted-foreground)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              onClick={handleLegendClick}
              wrapperStyle={{ cursor: 'pointer' }}
            />
            <Bar 
              dataKey="marketShare" 
              name="Market Share (%)"
              fill={(entry) => getBrandColor(entry?.brand)}
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-sm text-muted-foreground">SUNBULAH (Highlighted)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-sm text-muted-foreground">Competitors</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Click bars for detailed analysis • Click legend to filter
        </div>
      </div>
    </div>
  );
};

export default BrandShareChart;