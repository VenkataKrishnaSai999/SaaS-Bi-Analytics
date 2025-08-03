import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegionalDataTable = ({ selectedRegions, onRegionSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'sales', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableData = [
    {
      id: 'north',
      region: 'North Region',
      sales: 2450000,
      volume: 1850,
      growth: 12.5,
      marketShare: 18.2,
      penetration: 78.5,
      territories: 15,
      avgOrderValue: 1324,
      customerCount: 1850,
      topProduct: 'Product A',
      lastUpdated: '2025-08-02'
    },
    {
      id: 'south',
      region: 'South Region',
      sales: 3200000,
      volume: 2400,
      growth: 8.3,
      marketShare: 23.8,
      penetration: 85.2,
      territories: 22,
      avgOrderValue: 1333,
      customerCount: 2400,
      topProduct: 'Product B',
      lastUpdated: '2025-08-02'
    },
    {
      id: 'east',
      region: 'East Region',
      sales: 2800000,
      volume: 2100,
      growth: 15.2,
      marketShare: 20.9,
      penetration: 82.1,
      territories: 18,
      avgOrderValue: 1333,
      customerCount: 2100,
      topProduct: 'Product C',
      lastUpdated: '2025-08-02'
    },
    {
      id: 'west',
      region: 'West Region',
      sales: 2100000,
      volume: 1600,
      growth: 6.7,
      marketShare: 15.6,
      penetration: 71.3,
      territories: 12,
      avgOrderValue: 1313,
      customerCount: 1600,
      topProduct: 'Product A',
      lastUpdated: '2025-08-02'
    },
    {
      id: 'central',
      region: 'Central Region',
      sales: 2900000,
      volume: 2200,
      growth: 10.8,
      marketShare: 21.5,
      penetration: 79.8,
      territories: 20,
      avgOrderValue: 1318,
      customerCount: 2200,
      topProduct: 'Product D',
      lastUpdated: '2025-08-02'
    }
  ];

  const filteredData = useMemo(() => {
    return selectedRegions?.length > 0 
      ? tableData?.filter(item => selectedRegions?.includes(item?.id))
      : tableData;
  }, [selectedRegions]);

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return filteredData;

    return [...filteredData]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        return sortConfig?.direction === 'asc' 
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }

      return sortConfig?.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US')?.format(number);
  };

  const getGrowthColor = (growth) => {
    if (growth > 10) return 'text-success';
    if (growth > 5) return 'text-warning';
    return 'text-error';
  };

  const columns = [
    { key: 'region', label: 'Region', sortable: true },
    { key: 'sales', label: 'Sales', sortable: true },
    { key: 'volume', label: 'Volume (K)', sortable: true },
    { key: 'growth', label: 'Growth %', sortable: true },
    { key: 'marketShare', label: 'Market Share %', sortable: true },
    { key: 'penetration', label: 'Penetration %', sortable: true },
    { key: 'territories', label: 'Territories', sortable: true },
    { key: 'avgOrderValue', label: 'Avg Order Value', sortable: true },
    { key: 'topProduct', label: 'Top Product', sortable: true }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Table" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Regional Contribution Analysis</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Showing {paginatedData?.length} of {sortedData?.length} regions</span>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                    column?.sortable ? 'cursor-pointer hover:bg-muted transition-smooth' : ''
                  }`}
                  onClick={column?.sortable ? () => handleSort(column?.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {column?.sortable && getSortIcon(column?.key)}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((row) => (
              <tr key={row?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedRegions?.includes(row?.id) ? 'bg-primary' : 'bg-muted'
                    }`} />
                    <span className="text-sm font-medium text-foreground">{row?.region}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                  {formatCurrency(row?.sales)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatNumber(row?.volume)}K
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${getGrowthColor(row?.growth)}`}>
                    {row?.growth > 0 ? '+' : ''}{row?.growth}%
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {row?.marketShare}%
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${row?.penetration}%` }}
                      />
                    </div>
                    <span>{row?.penetration}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {row?.territories}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatCurrency(row?.avgOrderValue)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {row?.topProduct}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSelection = selectedRegions?.includes(row?.id)
                          ? selectedRegions?.filter(id => id !== row?.id)
                          : [...selectedRegions, row?.id];
                        onRegionSelect(newSelection);
                      }}
                      iconName={selectedRegions?.includes(row?.id) ? "Eye" : "EyeOff"}
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      iconSize={14}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconSize={16}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconSize={16}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalDataTable;