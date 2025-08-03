import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const WTDTrendChart = ({ chartData, onMetricChange, onTimeRangeChange }) => {
  const [selectedMetric, setSelectedMetric] = useState('wtd');
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [showTrendLines, setShowTrendLines] = useState(true);

  const metricOptions = [
    { value: 'wtd', label: 'WTD Percentage' },
    { value: 'availability', label: 'Availability Score' },
    { value: 'coverage', label: 'Store Coverage' },
    { value: 'reach', label: 'Distribution Reach' }
  ];

  const timeRangeOptions = [
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '12months', label: 'Last 12 Months' },
    { value: 'ytd', label: 'Year to Date' }
  ];

  const productLines = [
    { key: 'sunbulah', name: 'SUNBULAH', color: '#2563EB' },
    { key: 'competitor1', name: 'Competitor A', color: '#64748B' },
    { key: 'competitor2', name: 'Competitor B', color: '#F59E0B' },
    { key: 'competitor3', name: 'Competitor C', color: '#10B981' }
  ];

  const handleMetricChange = (value) => {
    setSelectedMetric(value);
    if (onMetricChange) {
      onMetricChange(value);
    }
  };

  const handleTimeRangeChange = (value) => {
    setSelectedTimeRange(value);
    if (onTimeRangeChange) {
      onTimeRangeChange(value);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">
                {entry?.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">WTD Distribution Trends</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track weighted distribution performance over time
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={handleMetricChange}
            className="w-full sm:w-48"
          />
          
          <Select
            options={timeRangeOptions}
            value={selectedTimeRange}
            onChange={handleTimeRangeChange}
            className="w-full sm:w-48"
          />

          <Button
            variant={showTrendLines ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTrendLines(!showTrendLines)}
            iconName="TrendingUp"
            iconSize={16}
          >
            Trend Lines
          </Button>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {productLines?.map((line) => (
              <Line
                key={line?.key}
                type="monotone"
                dataKey={line?.key}
                stroke={line?.color}
                strokeWidth={line?.key === 'sunbulah' ? 3 : 2}
                name={line?.name}
                dot={{ fill: line?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: line?.color, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={14} />
            <span>WTD = Weighted Distribution percentage</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={14} />
          <span>Last updated: {new Date()?.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default WTDTrendChart;