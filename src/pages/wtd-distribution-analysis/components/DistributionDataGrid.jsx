import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DistributionDataGrid = ({ gridData, onDataUpdate }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North Region' },
    { value: 'south', label: 'South Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' },
    { value: 'central', label: 'Central Region' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'condiments', label: 'Condiments' }
  ];

  const columns = [
    { key: 'product', label: 'Product', sortable: true, width: '200px' },
    { key: 'region', label: 'Region', sortable: true, width: '120px' },
    { key: 'category', label: 'Category', sortable: true, width: '140px' },
    { key: 'wtdCurrent', label: 'Current WTD%', sortable: true, width: '120px' },
    { key: 'wtdPrevious', label: 'Previous WTD%', sortable: true, width: '120px' },
    { key: 'change', label: 'Change', sortable: true, width: '100px' },
    { key: 'availability', label: 'Availability', sortable: true, width: '120px' },
    { key: 'stores', label: 'Stores', sortable: true, width: '100px' },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true, width: '140px' }
  ];

  const filteredData = useMemo(() => {
    return gridData?.filter(item => {
      const matchesText = filterText === '' || 
        item?.product?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
        item?.region?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
        item?.category?.toLowerCase()?.includes(filterText?.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || item?.region?.toLowerCase() === selectedRegion;
      const matchesCategory = selectedCategory === 'all' || item?.category?.toLowerCase() === selectedCategory;
      
      return matchesText && matchesRegion && matchesCategory;
    });
  }, [gridData, filterText, selectedRegion, selectedCategory]);

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return filteredData;

    return [...filteredData]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue)?.toLowerCase();
      const bString = String(bValue)?.toLowerCase();
      
      if (sortConfig?.direction === 'asc') {
        return aString < bString ? -1 : aString > bString ? 1 : 0;
      } else {
        return aString > bString ? -1 : aString < bString ? 1 : 0;
      }
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

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

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return (
        <div className="flex items-center space-x-1 text-success">
          <Icon name="ArrowUp" size={14} />
          <span>+{change}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center space-x-1 text-error">
          <Icon name="ArrowDown" size={14} />
          <span>{change}%</span>
        </div>
      );
    }
    return <span className="text-muted-foreground">0%</span>;
  };

  const getAvailabilityBadge = (availability) => {
    if (availability >= 90) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Excellent</span>;
    } else if (availability >= 75) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">Good</span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">Poor</span>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Distribution Data Grid</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed distribution metrics by product, region, and time period
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Input
              type="search"
              placeholder="Search products, regions..."
              value={filterText}
              onChange={(e) => setFilterText(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={regionOptions}
              value={selectedRegion}
              onChange={setSelectedRegion}
              className="w-full sm:w-40"
            />
            
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-smooth"
                  style={{ width: column?.width }}
                  onClick={() => column?.sortable && handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column?.label}</span>
                    {column?.sortable && getSortIcon(column?.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((row, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {row?.product}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row?.region}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row?.category}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {row?.wtdCurrent}%
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row?.wtdPrevious}%
                </td>
                <td className="px-4 py-3 text-sm">
                  {getChangeIndicator(row?.change)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getAvailabilityBadge(row?.availability)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row?.stores?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row?.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData?.length)} of {sortedData?.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconSize={16}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconSize={16}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionDataGrid;