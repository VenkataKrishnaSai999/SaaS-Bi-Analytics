import React, { useState, useEffect } from 'react';
import Select from './Select';
import Input from './Input';
import Button from './Button';
import Icon from '../AppIcon';

const GlobalFilterPanel = ({ 
  onFiltersChange,
  initialFilters = {},
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    customStartDate: '',
    customEndDate: '',
    regions: [],
    brands: [],
    categories: [],
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(!isCollapsed);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const regionOptions = [
    { value: 'north', label: 'North Region' },
    { value: 'south', label: 'South Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' },
    { value: 'central', label: 'Central Region' },
    { value: 'northeast', label: 'Northeast Region' },
    { value: 'southeast', label: 'Southeast Region' },
    { value: 'southwest', label: 'Southwest Region' },
    { value: 'northwest', label: 'Northwest Region' }
  ];

  const brandOptions = [
    { value: 'brand-a', label: 'Brand A' },
    { value: 'brand-b', label: 'Brand B' },
    { value: 'brand-c', label: 'Brand C' },
    { value: 'brand-d', label: 'Brand D' },
    { value: 'brand-e', label: 'Brand E' },
    { value: 'private-label', label: 'Private Label' },
    { value: 'premium-line', label: 'Premium Line' },
    { value: 'economy-line', label: 'Economy Line' }
  ];

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'health-beauty', label: 'Health & Beauty' },
    { value: 'sports-outdoors', label: 'Sports & Outdoors' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'books-media', label: 'Books & Media' },
    { value: 'food-beverage', label: 'Food & Beverage' }
  ];

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: 'last30days',
      customStartDate: '',
      customEndDate: '',
      regions: [],
      brands: [],
      categories: []
    });
  };

  const hasActiveFilters = () => {
    return filters?.regions?.length > 0 || 
           filters?.brands?.length > 0 || 
           filters?.categories?.length > 0 || 
           filters?.dateRange !== 'last30days';
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (onToggleCollapse) {
      onToggleCollapse(!isExpanded);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Global Filters</h3>
          {hasActiveFilters() && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {[filters?.regions?.length, filters?.brands?.length, filters?.categories?.length]?.filter(n => n > 0)?.length} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconSize={16}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="md:hidden"
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 space-y-4">
          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              className="md:col-span-1"
            />
            
            {filters?.dateRange === 'custom' && (
              <>
                <Input
                  label="Start Date"
                  type="date"
                  value={filters?.customStartDate}
                  onChange={(e) => handleFilterChange('customStartDate', e?.target?.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={filters?.customEndDate}
                  onChange={(e) => handleFilterChange('customEndDate', e?.target?.value)}
                />
              </>
            )}
          </div>

          {/* Multi-select Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Regions"
              options={regionOptions}
              value={filters?.regions}
              onChange={(value) => handleFilterChange('regions', value)}
              multiple
              searchable
              clearable
              placeholder="Select regions..."
            />
            
            <Select
              label="Brands"
              options={brandOptions}
              value={filters?.brands}
              onChange={(value) => handleFilterChange('brands', value)}
              multiple
              searchable
              clearable
              placeholder="Select brands..."
            />
            
            <Select
              label="Categories"
              options={categoryOptions}
              value={filters?.categories}
              onChange={(value) => handleFilterChange('categories', value)}
              multiple
              searchable
              clearable
              placeholder="Select categories..."
            />
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters() && (
          <div className="px-4 pb-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters?.regions?.map(region => (
                  <span key={region} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                    {regionOptions?.find(r => r?.value === region)?.label}
                    <button
                      onClick={() => handleFilterChange('regions', filters?.regions?.filter(r => r !== region))}
                      className="ml-1 hover:text-primary/80"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
                {filters?.brands?.map(brand => (
                  <span key={brand} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-accent/10 text-accent">
                    {brandOptions?.find(b => b?.value === brand)?.label}
                    <button
                      onClick={() => handleFilterChange('brands', filters?.brands?.filter(b => b !== brand))}
                      className="ml-1 hover:text-accent/80"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
                {filters?.categories?.map(category => (
                  <span key={category} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-success/10 text-success">
                    {categoryOptions?.find(c => c?.value === category)?.label}
                    <button
                      onClick={() => handleFilterChange('categories', filters?.categories?.filter(c => c !== category))}
                      className="ml-1 hover:text-success/80"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalFilterPanel;