import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import GlobalFilterPanel from '../../components/ui/GlobalFilterPanel';
import ExportActionMenu from '../../components/ui/ExportActionMenu';
import RegionalMap from './components/RegionalMap';
import RegionalBarChart from './components/RegionalBarChart';
import RegionalDataTable from './components/RegionalDataTable';
import RegionalTrendChart from './components/RegionalTrendChart';
import RegionalControlPanel from './components/RegionalControlPanel';
import RegionalInsightsPanel from './components/RegionalInsightsPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RegionalSalesDashboard = () => {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'growth']);
  const [timeRange, setTimeRange] = useState('last6months');
  const [viewMode, setViewMode] = useState('overview');
  const [globalFilters, setGlobalFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate data refresh
  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // Handle drill down functionality
  const handleDrillDown = (region, metric) => {
    console.log(`Drilling down into ${region} region for ${metric} metric`);
    // In a real application, this would navigate to a detailed view
  };

  // Handle export functionality
  const handleExport = async (format, title) => {
    console.log(`Exporting ${title} in ${format} format`);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, this would generate and download the file
    const exportData = {
      title: 'Regional Sales Dashboard Export',
      timestamp: new Date()?.toISOString(),
      filters: {
        regions: selectedRegions,
        metrics: selectedMetrics,
        timeRange: timeRange,
        globalFilters: globalFilters
      },
      format: format
    };
    
    console.log('Export completed:', exportData);
  };

  // Update page title based on selected regions
  useEffect(() => {
    const regionCount = selectedRegions?.length;
    const pageTitle = regionCount > 0 
      ? `Regional Sales Dashboard (${regionCount} regions selected)`
      : 'Regional Sales Dashboard - All Regions';
    
    document.title = pageTitle;
  }, [selectedRegions]);

  const formatLastUpdated = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <>
      <Helmet>
        <title>Regional Sales Dashboard - SaaS BI Analytics</title>
        <meta name="description" content="Comprehensive regional sales analysis with interactive maps, performance metrics, and territory insights for data-driven decision making." />
        <meta name="keywords" content="regional sales, territory analysis, sales dashboard, geographic performance, business intelligence" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <Breadcrumb />
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Regional Sales Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    Analyze territory performance and distribution patterns across regions
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {formatLastUpdated(lastUpdated)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshData}
                    loading={isLoading}
                    iconName="RefreshCw"
                    iconSize={16}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Global Filters */}
            <div className="mb-8">
              <GlobalFilterPanel
                onFiltersChange={setGlobalFilters}
                initialFilters={globalFilters}
              />
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Control Panel - Sidebar */}
              <div className="xl:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <RegionalControlPanel
                    selectedRegions={selectedRegions}
                    onRegionChange={setSelectedRegions}
                    selectedMetrics={selectedMetrics}
                    onMetricChange={setSelectedMetrics}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onRefreshData={handleRefreshData}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="xl:col-span-3 space-y-8">
                {/* Map and Bar Chart Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RegionalMap
                    selectedRegions={selectedRegions}
                    onRegionSelect={setSelectedRegions}
                    salesData={globalFilters}
                  />
                  <RegionalBarChart
                    selectedRegions={selectedRegions}
                    selectedMetrics={selectedMetrics}
                    onDrillDown={handleDrillDown}
                  />
                </div>

                {/* Trend Chart */}
                <RegionalTrendChart
                  selectedRegions={selectedRegions}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />

                {/* Data Table */}
                <RegionalDataTable
                  selectedRegions={selectedRegions}
                  onRegionSelect={setSelectedRegions}
                />

                {/* Insights Panel */}
                <RegionalInsightsPanel
                  selectedRegions={selectedRegions}
                  selectedMetrics={selectedMetrics}
                  timeRange={timeRange}
                />
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                  <Icon name="MapPin" size={24} color="var(--color-primary)" />
                </div>
                <div className="text-2xl font-bold text-foreground">87</div>
                <div className="text-sm text-muted-foreground">Total Territories</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-4">
                  <Icon name="DollarSign" size={24} color="var(--color-success)" />
                </div>
                <div className="text-2xl font-bold text-foreground">$13.45M</div>
                <div className="text-sm text-muted-foreground">Total Regional Sales</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-4">
                  <Icon name="TrendingUp" size={24} color="var(--color-accent)" />
                </div>
                <div className="text-2xl font-bold text-foreground">10.5%</div>
                <div className="text-sm text-muted-foreground">Average Growth Rate</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-4">
                  <Icon name="Target" size={24} color="var(--color-warning)" />
                </div>
                <div className="text-2xl font-bold text-foreground">79.4%</div>
                <div className="text-sm text-muted-foreground">Avg Market Penetration</div>
              </div>
            </div>
          </div>
        </main>

        {/* Export Action Menu */}
        <ExportActionMenu
          onExport={handleExport}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default RegionalSalesDashboard;