import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const AdvancedFilterSidebar = ({ isOpen, onClose, onFiltersApply, currentFilters }) => {
  const [filters, setFilters] = useState({
    productCategories: currentFilters?.productCategories || [],
    regions: currentFilters?.regions || [],
    wtdRange: currentFilters?.wtdRange || { min: 0, max: 100 },
    availabilityRange: currentFilters?.availabilityRange || { min: 0, max: 100 },
    storeCountRange: currentFilters?.storeCountRange || { min: 0, max: 10000 },
    timeComparison: currentFilters?.timeComparison || 'month',
    showTrendOnly: currentFilters?.showTrendOnly || false,
    includeSeasonality: currentFilters?.includeSeasonality || true,
    ...currentFilters
  });

  const productCategoryOptions = [
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks & Confectionery' },
    { value: 'condiments', label: 'Condiments & Sauces' },
    { value: 'bakery', label: 'Bakery Items' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'personal-care', label: 'Personal Care' }
  ];

  const regionOptions = [
    { value: 'north', label: 'North Region' },
    { value: 'south', label: 'South Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' },
    { value: 'central', label: 'Central Region' },
    { value: 'northeast', label: 'Northeast Region' },
    { value: 'southeast', label: 'Southeast Region' },
    { value: 'southwest', label: 'Southwest Region' }
  ];

  const timeComparisonOptions = [
    { value: 'week', label: 'Week over Week' },
    { value: 'month', label: 'Month over Month' },
    { value: 'quarter', label: 'Quarter over Quarter' },
    { value: 'year', label: 'Year over Year' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRangeChange = (rangeKey, field, value) => {
    setFilters(prev => ({
      ...prev,
      [rangeKey]: {
        ...prev?.[rangeKey],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleApplyFilters = () => {
    if (onFiltersApply) {
      onFiltersApply(filters);
    }
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      productCategories: [],
      regions: [],
      wtdRange: { min: 0, max: 100 },
      availabilityRange: { min: 0, max: 100 },
      storeCountRange: { min: 0, max: 10000 },
      timeComparison: 'month',
      showTrendOnly: false,
      includeSeasonality: true
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.productCategories?.length > 0) count++;
    if (filters?.regions?.length > 0) count++;
    if (filters?.wtdRange?.min > 0 || filters?.wtdRange?.max < 100) count++;
    if (filters?.availabilityRange?.min > 0 || filters?.availabilityRange?.max < 100) count++;
    if (filters?.storeCountRange?.min > 0 || filters?.storeCountRange?.max < 10000) count++;
    if (filters?.timeComparison !== 'month') count++;
    if (filters?.showTrendOnly) count++;
    if (!filters?.includeSeasonality) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-elevation z-50 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Categories */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Product Categories
            </label>
            <Select
              options={productCategoryOptions}
              value={filters?.productCategories}
              onChange={(value) => handleFilterChange('productCategories', value)}
              multiple
              searchable
              clearable
              placeholder="Select categories..."
            />
          </div>

          {/* Geographic Regions */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Geographic Regions
            </label>
            <Select
              options={regionOptions}
              value={filters?.regions}
              onChange={(value) => handleFilterChange('regions', value)}
              multiple
              searchable
              clearable
              placeholder="Select regions..."
            />
          </div>

          {/* WTD Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              WTD Percentage Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Min %"
                value={filters?.wtdRange?.min}
                onChange={(e) => handleRangeChange('wtdRange', 'min', e?.target?.value)}
                min="0"
                max="100"
              />
              <Input
                type="number"
                label="Max %"
                value={filters?.wtdRange?.max}
                onChange={(e) => handleRangeChange('wtdRange', 'max', e?.target?.value)}
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Availability Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Availability Score Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Min Score"
                value={filters?.availabilityRange?.min}
                onChange={(e) => handleRangeChange('availabilityRange', 'min', e?.target?.value)}
                min="0"
                max="100"
              />
              <Input
                type="number"
                label="Max Score"
                value={filters?.availabilityRange?.max}
                onChange={(e) => handleRangeChange('availabilityRange', 'max', e?.target?.value)}
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Store Count Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Store Count Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Min Stores"
                value={filters?.storeCountRange?.min}
                onChange={(e) => handleRangeChange('storeCountRange', 'min', e?.target?.value)}
                min="0"
              />
              <Input
                type="number"
                label="Max Stores"
                value={filters?.storeCountRange?.max}
                onChange={(e) => handleRangeChange('storeCountRange', 'max', e?.target?.value)}
                min="0"
              />
            </div>
          </div>

          {/* Time Comparison */}
          <div>
            <Select
              label="Time-based Comparison"
              options={timeComparisonOptions}
              value={filters?.timeComparison}
              onChange={(value) => handleFilterChange('timeComparison', value)}
            />
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Advanced Options</h4>
            
            <Checkbox
              label="Show trending products only"
              description="Display only products with significant trend changes"
              checked={filters?.showTrendOnly}
              onChange={(e) => handleFilterChange('showTrendOnly', e?.target?.checked)}
            />
            
            <Checkbox
              label="Include seasonality analysis"
              description="Factor in seasonal patterns for insights"
              checked={filters?.includeSeasonality}
              onChange={(e) => handleFilterChange('includeSeasonality', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
              iconName="RotateCcw"
              iconSize={16}
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
              iconName="Filter"
              iconSize={16}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilterSidebar;