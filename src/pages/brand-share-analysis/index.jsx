import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import GlobalFilterPanel from '../../components/ui/GlobalFilterPanel';
import ExportActionMenu from '../../components/ui/ExportActionMenu';
import BrandShareChart from './components/BrandShareChart';
import BrandMetricsTable from './components/BrandMetricsTable';
import FilterSidebar from './components/FilterSidebar';
import KPICards from './components/KPICards';
import InsightsPanel from './components/InsightsPanel';

const BrandShareAnalysis = () => {
  const [filters, setFilters] = useState({
    timeRange: 'last30days',
    category: 'all',
    region: 'all',
    channel: 'all'
  });

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock brand share data
  const brandData = [
    {
      id: 1,
      brand: "SUNBULAH Premium",
      marketShare: 24.8,
      volume: 125000,
      value: 2850000,
      growth: 8.2,
      rank: 1,
      category: "dairy",
      region: "all"
    },
    {
      id: 2,
      brand: "Competitor A",
      marketShare: 18.5,
      volume: 98000,
      value: 2100000,
      growth: 3.1,
      rank: 2,
      category: "dairy",
      region: "all"
    },
    {
      id: 3,
      brand: "Competitor B",
      marketShare: 15.2,
      volume: 87000,
      value: 1850000,
      growth: -1.5,
      rank: 3,
      category: "dairy",
      region: "all"
    },
    {
      id: 4,
      brand: "Market Leader X",
      marketShare: 12.8,
      volume: 75000,
      value: 1650000,
      growth: 5.7,
      rank: 4,
      category: "dairy",
      region: "all"
    },
    {
      id: 5,
      brand: "SUNBULAH Organic",
      marketShare: 9.3,
      volume: 52000,
      value: 1280000,
      growth: 12.4,
      rank: 5,
      category: "organic",
      region: "all"
    },
    {
      id: 6,
      brand: "Regional Brand Y",
      marketShare: 7.1,
      volume: 41000,
      value: 980000,
      growth: 2.8,
      rank: 6,
      category: "dairy",
      region: "north"
    },
    {
      id: 7,
      brand: "Premium Choice",
      marketShare: 5.9,
      volume: 35000,
      value: 890000,
      growth: -3.2,
      rank: 7,
      category: "dairy",
      region: "all"
    },
    {
      id: 8,
      brand: "Value Brand Z",
      marketShare: 4.2,
      volume: 68000,
      value: 720000,
      growth: 1.9,
      rank: 8,
      category: "dairy",
      region: "all"
    },
    {
      id: 9,
      brand: "Artisan Select",
      marketShare: 2.2,
      volume: 18000,
      value: 450000,
      growth: 15.6,
      rank: 9,
      category: "organic",
      region: "urban"
    }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleRowSelect = (brand) => {
    setSelectedRows(prev => {
      if (prev?.includes(brand?.id)) {
        return prev?.filter(id => id !== brand?.id);
      } else {
        return [...prev, brand?.id];
      }
    });
  };

  const handleExport = async (format, title) => {
    // Mock export functionality
    console.log(`Exporting ${title} as ${format}`);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real application, this would trigger actual export
    alert(`${title} exported as ${format?.toUpperCase()} successfully!`);
  };

  useEffect(() => {
    document.title = 'Brand Share Analysis - SaaS BI Analytics';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-full mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Brand Share Analysis
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive market share analysis and competitive positioning insights
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date()?.toLocaleDateString()} at {new Date()?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Global Filters */}
          <div className="mb-8">
            <GlobalFilterPanel 
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* KPI Cards */}
              <KPICards data={brandData} filters={filters} />

              {/* Brand Share Chart */}
              <BrandShareChart
                data={brandData}
                filters={filters}
                onBrandSelect={handleBrandSelect}
              />

              {/* Brand Metrics Table */}
              <BrandMetricsTable
                data={brandData}
                onRowSelect={handleRowSelect}
                selectedRows={selectedRows}
              />
            </div>

            {/* Right Panel - Insights */}
            <div className="hidden xl:block w-96 flex-shrink-0">
              <div className="sticky top-24">
                <InsightsPanel data={brandData} filters={filters} />
              </div>
            </div>
          </div>

          {/* Mobile Insights Panel */}
          <div className="xl:hidden mt-8">
            <InsightsPanel data={brandData} filters={filters} />
          </div>
        </div>
      </main>
      {/* Export Action Menu */}
      <ExportActionMenu onExport={handleExport} />
    </div>
  );
};

export default BrandShareAnalysis;