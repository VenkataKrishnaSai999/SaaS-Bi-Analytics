import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RegionalMap = ({ selectedRegions, onRegionSelect, salesData }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regionData = [
    {
      id: 'north',
      name: 'North Region',
      sales: 2450000,
      growth: 12.5,
      marketShare: 18.2,
      territories: 15,
      color: '#10B981',
      coordinates: { x: 45, y: 20 }
    },
    {
      id: 'south',
      name: 'South Region',
      sales: 3200000,
      growth: 8.3,
      marketShare: 23.8,
      territories: 22,
      color: '#3B82F6',
      coordinates: { x: 45, y: 70 }
    },
    {
      id: 'east',
      name: 'East Region',
      sales: 2800000,
      growth: 15.2,
      marketShare: 20.9,
      territories: 18,
      color: '#8B5CF6',
      coordinates: { x: 75, y: 45 }
    },
    {
      id: 'west',
      name: 'West Region',
      sales: 2100000,
      growth: 6.7,
      marketShare: 15.6,
      territories: 12,
      color: '#F59E0B',
      coordinates: { x: 15, y: 45 }
    },
    {
      id: 'central',
      name: 'Central Region',
      sales: 2900000,
      growth: 10.8,
      marketShare: 21.5,
      territories: 20,
      color: '#EF4444',
      coordinates: { x: 45, y: 45 }
    }
  ];

  const getRegionIntensity = (sales) => {
    const maxSales = Math.max(...regionData?.map(r => r?.sales));
    return (sales / maxSales) * 0.8 + 0.2;
  };

  const handleRegionClick = (regionId) => {
    const newSelection = selectedRegions?.includes(regionId)
      ? selectedRegions?.filter(id => id !== regionId)
      : [...selectedRegions, regionId];
    onRegionSelect(newSelection);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Regional Sales Map</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full opacity-20"></div>
            <span>Low Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full opacity-60"></div>
            <span>Medium Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>High Performance</span>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Map Container */}
        <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Map Outline */}
            <rect
              x="10"
              y="15"
              width="80"
              height="70"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.5"
              rx="2"
            />
            
            {/* Region Circles */}
            {regionData?.map((region) => {
              const isSelected = selectedRegions?.includes(region?.id);
              const isHovered = hoveredRegion === region?.id;
              const intensity = getRegionIntensity(region?.sales);
              
              return (
                <g key={region?.id}>
                  <circle
                    cx={region?.coordinates?.x}
                    cy={region?.coordinates?.y}
                    r={isHovered ? "8" : "6"}
                    fill={region?.color}
                    fillOpacity={intensity}
                    stroke={isSelected ? region?.color : "var(--color-border)"}
                    strokeWidth={isSelected ? "2" : "1"}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleRegionClick(region?.id)}
                    onMouseEnter={() => setHoveredRegion(region?.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />
                  {/* Region Labels */}
                  <text
                    x={region?.coordinates?.x}
                    y={region?.coordinates?.y + 12}
                    textAnchor="middle"
                    className="text-xs font-medium fill-foreground pointer-events-none"
                  >
                    {region?.name?.split(' ')?.[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredRegion && (
            <div className="absolute top-4 right-4 bg-popover border border-border rounded-lg p-3 shadow-elevation z-10">
              {(() => {
                const region = regionData?.find(r => r?.id === hoveredRegion);
                return (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{region?.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sales:</span>
                        <span className="font-medium">{formatCurrency(region?.sales)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Growth:</span>
                        <span className={`font-medium ${region?.growth > 10 ? 'text-success' : region?.growth > 5 ? 'text-warning' : 'text-error'}`}>
                          {region?.growth > 0 ? '+' : ''}{region?.growth}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Share:</span>
                        <span className="font-medium">{region?.marketShare}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Territories:</span>
                        <span className="font-medium">{region?.territories}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Region Selection Summary */}
        {selectedRegions?.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} color="var(--color-primary)" />
                <span className="text-sm font-medium text-foreground">
                  Selected Regions ({selectedRegions?.length})
                </span>
              </div>
              <button
                onClick={() => onRegionSelect([])}
                className="text-xs text-primary hover:text-primary/80 transition-smooth"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRegions?.map(regionId => {
                const region = regionData?.find(r => r?.id === regionId);
                return (
                  <span
                    key={regionId}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                  >
                    {region?.name}
                    <button
                      onClick={() => handleRegionClick(regionId)}
                      className="ml-1 hover:text-primary/80"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionalMap;