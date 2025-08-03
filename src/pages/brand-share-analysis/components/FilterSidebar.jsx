import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterSidebar = ({ filters, onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const timeRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks & Confectionery' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'bakery', label: 'Bakery Items' },
    { value: 'condiments', label: 'Condiments & Sauces' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'organic', label: 'Organic Products' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North Region' },
    { value: 'south', label: 'South Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' },
    { value: 'central', label: 'Central Region' },
    { value: 'urban', label: 'Urban Areas' },
    { value: 'suburban', label: 'Suburban Areas' },
    { value: 'rural', label: 'Rural Areas' }
  ];

  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    { value: 'supermarkets', label: 'Supermarkets' },
    { value: 'hypermarkets', label: 'Hypermarkets' },
    { value: 'convenience', label: 'Convenience Stores' },
    { value: 'online', label: 'Online Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'specialty', label: 'Specialty Stores' },
    { value: 'discount', label: 'Discount Stores' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      timeRange: 'last30days',
      category: 'all',
      region: 'all',
      channel: 'all'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = () => {
    return localFilters?.category !== 'all' || 
           localFilters?.region !== 'all' || 
           localFilters?.channel !== 'all' ||
           localFilters?.timeRange !== 'last30days';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } flex-shrink-0`}>
        <div className="bg-card border border-border rounded-lg h-fit sticky top-24">
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Icon name="Filter" size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Filters</h3>
                {hasActiveFilters() && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Active
                  </span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
            </Button>
          </div>

          {!isCollapsed && (
            <div className="p-4 space-y-6">
              <Select
                label="Time Range"
                options={timeRangeOptions}
                value={localFilters?.timeRange}
                onChange={(value) => handleFilterChange('timeRange', value)}
              />

              <Select
                label="Product Category"
                options={categoryOptions}
                value={localFilters?.category}
                onChange={(value) => handleFilterChange('category', value)}
                searchable
              />

              <Select
                label="Geographic Region"
                options={regionOptions}
                value={localFilters?.region}
                onChange={(value) => handleFilterChange('region', value)}
                searchable
              />

              <Select
                label="Sales Channel"
                options={channelOptions}
                value={localFilters?.channel}
                onChange={(value) => handleFilterChange('channel', value)}
                searchable
              />

              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  iconName="RotateCcw"
                  iconPosition="left"
                  fullWidth
                >
                  Reset Filters
                </Button>
              )}

              <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>💡 <strong>Tip:</strong> Use multiple filters to narrow down your analysis</p>
                  <p>📊 Charts update automatically when filters change</p>
                  <p>⭐ SUNBULAH brand is highlighted across all views</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Filter Panel */}
      <div className="lg:hidden mb-6">
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Filters</h3>
              {hasActiveFilters() && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                iconName="RotateCcw"
                iconSize={16}
              >
                Reset
              </Button>
            )}
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={localFilters?.timeRange}
              onChange={(value) => handleFilterChange('timeRange', value)}
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={localFilters?.category}
              onChange={(value) => handleFilterChange('category', value)}
              searchable
            />

            <Select
              label="Region"
              options={regionOptions}
              value={localFilters?.region}
              onChange={(value) => handleFilterChange('region', value)}
              searchable
            />

            <Select
              label="Channel"
              options={channelOptions}
              value={localFilters?.channel}
              onChange={(value) => handleFilterChange('channel', value)}
              searchable
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;