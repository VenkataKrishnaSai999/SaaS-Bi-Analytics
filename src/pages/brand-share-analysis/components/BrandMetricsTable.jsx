import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const BrandMetricsTable = ({ data, onRowSelect, selectedRows = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'marketShare', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    
    if (sortConfig?.key) {
      sortableData?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableData;
  }, [data, sortConfig]);

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

  const handleRowClick = (brand) => {
    if (onRowSelect) {
      onRowSelect(brand);
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const getGrowthIndicator = (growth) => {
    if (growth > 0) {
      return <Icon name="TrendingUp" size={16} className="text-success" />;
    } else if (growth < 0) {
      return <Icon name="TrendingDown" size={16} className="text-error" />;
    }
    return <Icon name="Minus" size={16} className="text-muted-foreground" />;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">🥇 #{rank}</span>;
    } else if (rank === 2) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">🥈 #{rank}</span>;
    } else if (rank === 3) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🥉 #{rank}</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Brand Performance Metrics</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed comparison of volume vs value performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {sortedData?.length} brands
            </span>
            <Icon name="Table" size={20} className="text-primary" />
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('rank')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Rank</span>
                  {getSortIcon('rank')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('brand')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Brand</span>
                  {getSortIcon('brand')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('marketShare')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Market Share</span>
                  {getSortIcon('marketShare')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('volume')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Volume</span>
                  {getSortIcon('volume')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Value</span>
                  {getSortIcon('value')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('growth')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Growth</span>
                  {getSortIcon('growth')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((brand, index) => (
              <tr
                key={brand?.id}
                onClick={() => handleRowClick(brand)}
                className={`
                  border-b border-border cursor-pointer transition-smooth hover:bg-muted/30
                  ${selectedRows?.includes(brand?.id) ? 'bg-primary/5' : ''}
                  ${brand?.brand?.toLowerCase()?.includes('sunbulah') ? 'bg-primary/10' : ''}
                `}
              >
                <td className="p-4">
                  {getRankBadge(brand?.rank)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      brand?.brand?.toLowerCase()?.includes('sunbulah') 
                        ? 'text-primary' :'text-foreground'
                    }`}>
                      {brand?.brand}
                    </span>
                    {brand?.brand?.toLowerCase()?.includes('sunbulah') && (
                      <Icon name="Star" size={16} className="text-primary fill-current" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">
                      {brand?.marketShare?.toFixed(1)}%
                    </span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(brand?.marketShare * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4 text-foreground">
                  {brand?.volume?.toLocaleString()} units
                </td>
                <td className="p-4 text-foreground">
                  ${brand?.value?.toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {getGrowthIndicator(brand?.growth)}
                    <span className={`font-medium ${
                      brand?.growth >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {brand?.growth >= 0 ? '+' : ''}{brand?.growth?.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {brand?.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {paginatedData?.map((brand) => (
          <div
            key={brand?.id}
            onClick={() => handleRowClick(brand)}
            className={`
              p-4 rounded-lg border border-border cursor-pointer transition-smooth
              ${selectedRows?.includes(brand?.id) ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
              ${brand?.brand?.toLowerCase()?.includes('sunbulah') ? 'bg-primary/10 border-primary/30' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${
                  brand?.brand?.toLowerCase()?.includes('sunbulah') 
                    ? 'text-primary' :'text-foreground'
                }`}>
                  {brand?.brand}
                </span>
                {brand?.brand?.toLowerCase()?.includes('sunbulah') && (
                  <Icon name="Star" size={16} className="text-primary fill-current" />
                )}
              </div>
              {getRankBadge(brand?.rank)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Market Share</span>
                <p className="font-medium text-foreground">{brand?.marketShare?.toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Growth</span>
                <div className="flex items-center space-x-1">
                  {getGrowthIndicator(brand?.growth)}
                  <span className={`font-medium ${
                    brand?.growth >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {brand?.growth >= 0 ? '+' : ''}{brand?.growth?.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Volume</span>
                <p className="font-medium text-foreground">{brand?.volume?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Value</span>
                <p className="font-medium text-foreground">${brand?.value?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData?.length)} of {sortedData?.length} brands
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            
            <span className="text-sm font-medium text-foreground px-3">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-smooth"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandMetricsTable;