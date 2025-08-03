import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegionalControlPanel = ({ 
  selectedRegions, 
  onRegionChange, 
  selectedMetrics, 
  onMetricChange,
  timeRange,
  onTimeRangeChange,
  viewMode,
  onViewModeChange,
  onRefreshData,
  isLoading
}) => {
  const regionOptions = [
    { id: 'north', label: 'North Region', territories: 15, color: '#3B82F6' },
    { id: 'south', label: 'South Region', territories: 22, color: '#10B981' },
    { id: 'east', label: 'East Region', territories: 18, color: '#8B5CF6' },
    { id: 'west', label: 'West Region', territories: 12, color: '#F59E0B' },
    { id: 'central', label: 'Central Region', territories: 20, color: '#EF4444' }
  ];

  const metricOptions = [
    { id: 'sales', label: 'Sales Revenue', icon: 'DollarSign' },
    { id: 'volume', label: 'Sales Volume', icon: 'Package' },
    { id: 'growth', label: 'Growth Rate', icon: 'TrendingUp' },
    { id: 'marketShare', label: 'Market Share', icon: 'PieChart' },
    { id: 'penetration', label: 'Market Penetration', icon: 'Target' }
  ];

  const timeRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const viewModeOptions = [
    { value: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { value: 'detailed', label: 'Detailed Analysis', icon: 'BarChart3' },
    { value: 'comparison', label: 'Region Comparison', icon: 'GitCompare' },
    { value: 'trends', label: 'Trend Analysis', icon: 'TrendingUp' }
  ];

  const handleRegionToggle = (regionId) => {
    const newSelection = selectedRegions?.includes(regionId)
      ? selectedRegions?.filter(id => id !== regionId)
      : [...selectedRegions, regionId];
    onRegionChange(newSelection);
  };

  const handleMetricToggle = (metricId) => {
    const newSelection = selectedMetrics?.includes(metricId)
      ? selectedMetrics?.filter(id => id !== metricId)
      : [...selectedMetrics, metricId];
    onMetricChange(newSelection);
  };

  const handleSelectAllRegions = () => {
    if (selectedRegions?.length === regionOptions?.length) {
      onRegionChange([]);
    } else {
      onRegionChange(regionOptions?.map(region => region?.id));
    }
  };

  const handleSelectAllMetrics = () => {
    if (selectedMetrics?.length === metricOptions?.length) {
      onMetricChange([]);
    } else {
      onMetricChange(metricOptions?.map(metric => metric?.id));
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Control Panel</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshData}
          loading={isLoading}
          iconName="RefreshCw"
          iconSize={16}
        >
          Refresh Data
        </Button>
      </div>
      <div className="space-y-6">
        {/* View Mode Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            View Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {viewModeOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={viewMode === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange(option?.value)}
                iconName={option?.icon}
                iconSize={16}
                className="justify-start text-xs"
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Time Range Selection */}
        <div>
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={timeRange}
            onChange={onTimeRangeChange}
            className="w-full"
          />
        </div>

        {/* Region Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">
              Regions ({selectedRegions?.length} selected)
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllRegions}
              className="text-xs"
            >
              {selectedRegions?.length === regionOptions?.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {regionOptions?.map((region) => (
              <div key={region?.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-smooth">
                <Checkbox
                  checked={selectedRegions?.includes(region?.id)}
                  onChange={() => handleRegionToggle(region?.id)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: region?.color }}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{region?.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {region?.territories} territories
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">
              Metrics ({selectedMetrics?.length} selected)
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllMetrics}
              className="text-xs"
            >
              {selectedMetrics?.length === metricOptions?.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {metricOptions?.map((metric) => (
              <div key={metric?.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-smooth">
                <Checkbox
                  checked={selectedMetrics?.includes(metric?.id)}
                  onChange={() => handleMetricToggle(metric?.id)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <Icon name={metric?.icon} size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm font-medium text-foreground">{metric?.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <label className="text-sm font-medium text-foreground mb-3 block">
            Quick Actions
          </label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={16}
              className="justify-start text-xs"
            >
              Export Regional Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              iconSize={16}
              className="justify-start text-xs"
            >
              Share Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              iconSize={16}
              className="justify-start text-xs"
            >
              Set Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalControlPanel;