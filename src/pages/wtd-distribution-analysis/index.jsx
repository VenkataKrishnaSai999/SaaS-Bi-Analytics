import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import GlobalFilterPanel from '../../components/ui/GlobalFilterPanel';
import ExportActionMenu from '../../components/ui/ExportActionMenu';
import WTDMetricsCards from './components/WTDMetricsCards';
import WTDTrendChart from './components/WTDTrendChart';
import DistributionDataGrid from './components/DistributionDataGrid';
import DistributionInsightsPanel from './components/DistributionInsightsPanel';
import AdvancedFilterSidebar from './components/AdvancedFilterSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const WTDDistributionAnalysis = () => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [globalFilters, setGlobalFilters] = useState({});
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for WTD metrics
  const metricsData = {
    currentWTD: 78.5,
    wtdChange: 3.2,
    coverageImprovement: 12.8,
    coverageChange: 5.1,
    availabilityScore: 85,
    availabilityChange: 2.7,
    distributionReach: 2847,
    reachChange: 156
  };

  // Mock data for trend chart
  const trendChartData = [
    { month: 'Jan 2024', sunbulah: 72.3, competitor1: 68.5, competitor2: 71.2, competitor3: 69.8 },
    { month: 'Feb 2024', sunbulah: 74.1, competitor1: 69.2, competitor2: 70.8, competitor3: 70.5 },
    { month: 'Mar 2024', sunbulah: 75.8, competitor1: 70.1, competitor2: 72.3, competitor3: 71.2 },
    { month: 'Apr 2024', sunbulah: 76.9, competitor1: 71.5, competitor2: 73.1, competitor3: 72.0 },
    { month: 'May 2024', sunbulah: 77.2, competitor1: 72.8, competitor2: 74.5, competitor3: 72.8 },
    { month: 'Jun 2024', sunbulah: 78.5, competitor1: 73.2, competitor2: 75.2, competitor3: 73.5 },
    { month: 'Jul 2024', sunbulah: 79.1, competitor1: 74.0, competitor2: 76.1, competitor3: 74.2 },
    { month: 'Aug 2024', sunbulah: 78.8, competitor1: 74.5, competitor2: 75.8, competitor3: 74.8 }
  ];

  // Mock data for distribution grid
  const distributionGridData = [
    {
      product: 'SUNBULAH Cheese Slices',
      region: 'North',
      category: 'Dairy',
      wtdCurrent: 82.5,
      wtdPrevious: 79.3,
      change: 3.2,
      availability: 88,
      stores: 1245,
      lastUpdated: '2024-08-02'
    },
    {
      product: 'SUNBULAH Yogurt Cups',
      region: 'South',
      category: 'Dairy',
      wtdCurrent: 76.8,
      wtdPrevious: 74.2,
      change: 2.6,
      availability: 85,
      stores: 1156,
      lastUpdated: '2024-08-02'
    },
    {
      product: 'SUNBULAH Frozen Vegetables',
      region: 'East',
      category: 'Frozen',
      wtdCurrent: 71.2,
      wtdPrevious: 73.8,
      change: -2.6,
      availability: 79,
      stores: 987,
      lastUpdated: '2024-08-01'
    },
    {
      product: 'SUNBULAH Fruit Juice',
      region: 'West',
      category: 'Beverages',
      wtdCurrent: 84.3,
      wtdPrevious: 81.7,
      change: 2.6,
      availability: 92,
      stores: 1389,
      lastUpdated: '2024-08-02'
    },
    {
      product: 'SUNBULAH Snack Mix',
      region: 'Central',
      category: 'Snacks',
      wtdCurrent: 68.9,
      wtdPrevious: 71.5,
      change: -2.6,
      availability: 74,
      stores: 823,
      lastUpdated: '2024-08-01'
    },
    {
      product: 'SUNBULAH Olive Oil',
      region: 'North',
      category: 'Condiments',
      wtdCurrent: 89.2,
      wtdPrevious: 87.1,
      change: 2.1,
      availability: 95,
      stores: 1567,
      lastUpdated: '2024-08-02'
    },
    {
      product: 'SUNBULAH Ice Cream',
      region: 'South',
      category: 'Frozen',
      wtdCurrent: 73.6,
      wtdPrevious: 75.9,
      change: -2.3,
      availability: 81,
      stores: 1098,
      lastUpdated: '2024-08-01'
    },
    {
      product: 'SUNBULAH Pasta Sauce',
      region: 'East',
      category: 'Condiments',
      wtdCurrent: 77.4,
      wtdPrevious: 74.8,
      change: 2.6,
      availability: 86,
      stores: 1234,
      lastUpdated: '2024-08-02'
    }
  ];

  // Mock data for insights
  const insightsData = {
    gaps: [
      {
        type: 'critical',
        priority: 'high',
        title: 'Low WTD in Central Region Snacks Category',
        description: `SUNBULAH Snack Mix shows declining WTD performance in Central region with 68.9% current distribution, down 2.6% from previous period. This represents a significant availability gap affecting 823 stores.`,
        metrics: [
          { label: 'Current WTD', value: '68.9%' },
          { label: 'Target WTD', value: '75%' },
          { label: 'Gap', value: '-6.1%' }
        ],
        actions: [
          { label: 'Increase Supply', icon: 'TruckIcon' },
          { label: 'Review Pricing', icon: 'DollarSign' }
        ]
      },
      {
        type: 'warning',
        priority: 'medium',
        title: 'Frozen Category Availability Decline',
        description: `Both SUNBULAH Frozen Vegetables and Ice Cream showing negative trends. Combined impact affects 2,085 stores with average availability score of 80%.`,
        metrics: [
          { label: 'Affected Products', value: '2' },
          { label: 'Store Impact', value: '2,085' },
          { label: 'Avg Availability', value: '80%' }
        ],
        actions: [
          { label: 'Cold Chain Review', icon: 'Thermometer' },
          { label: 'Supplier Check', icon: 'Users' }
        ]
      }
    ],
    improvements: [
      {
        type: 'success',
        priority: 'low',
        title: 'Strong Performance in Condiments Category',
        description: `SUNBULAH Olive Oil leads with 89.2% WTD (+2.1%) and 95% availability score. Pasta Sauce also showing positive momentum with 77.4% WTD (+2.6%).`,
        metrics: [
          { label: 'Top WTD', value: '89.2%' },
          { label: 'Availability', value: '95%' },
          { label: 'Growth', value: '+2.1%' }
        ],
        actions: [
          { label: 'Expand Distribution', icon: 'ArrowRight' },
          { label: 'Leverage Success', icon: 'Copy' }
        ]
      },
      {
        type: 'info',
        priority: 'medium',
        title: 'Beverages Category Momentum',
        description: `SUNBULAH Fruit Juice achieving 84.3% WTD with strong 92% availability across 1,389 stores. Consistent month-over-month growth of 2.6%.`,
        metrics: [
          { label: 'WTD Growth', value: '+2.6%' },
          { label: 'Store Count', value: '1,389' },
          { label: 'Availability', value: '92%' }
        ],
        actions: [
          { label: 'Scale Strategy', icon: 'TrendingUp' },
          { label: 'New Variants', icon: 'Plus' }
        ]
      }
    ],
    anomalies: [
      {
        type: 'warning',
        priority: 'high',
        title: 'Seasonal Pattern Disruption in Frozen Category',
        description: `Frozen products typically show increased WTD during summer months, but current data shows decline. This anomaly suggests supply chain or competitive pressure issues.`,
        metrics: [
          { label: 'Expected WTD', value: '78%' },
          { label: 'Actual WTD', value: '72.4%' },
          { label: 'Variance', value: '-5.6%' }
        ],
        actions: [
          { label: 'Investigate Cause', icon: 'Search' },
          { label: 'Competitor Analysis', icon: 'Eye' }
        ]
      }
    ],
    recommendations: [
      {
        type: 'info',
        priority: 'high',
        title: 'Immediate Action Plan for Central Region',
        description: `Focus on Central region snacks category with targeted promotional campaigns and supply chain optimization. Potential to recover 6.1% WTD gap within 60 days.`,
        metrics: [
          { label: 'Recovery Target', value: '75%' },
          { label: 'Timeline', value: '60 days' },
          { label: 'Investment', value: '$50K' }
        ],
        actions: [
          { label: 'Launch Campaign', icon: 'Megaphone' },
          { label: 'Optimize Supply', icon: 'Settings' }
        ]
      },
      {
        type: 'success',
        priority: 'medium',
        title: 'Leverage Condiments Success Model',
        description: `Apply successful condiments distribution strategy to underperforming categories. Focus on pricing optimization and promotional support that drove olive oil success.`,
        metrics: [
          { label: 'Success Rate', value: '89.2%' },
          { label: 'Replication Potential', value: '3 categories' },
          { label: 'Expected Lift', value: '+5%' }
        ],
        actions: [
          { label: 'Strategy Template', icon: 'FileText' },
          { label: 'Pilot Program', icon: 'Play' }
        ]
      }
    ]
  };

  const handleGlobalFiltersChange = (filters) => {
    setGlobalFilters(filters);
    // Simulate data refresh
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAdvancedFiltersApply = (filters) => {
    setAdvancedFilters(filters);
    // Simulate data refresh
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleExport = async (format, title) => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting ${title} as ${format}`);
  };

  const handleMetricChange = (metric) => {
    console.log('Metric changed to:', metric);
  };

  const handleTimeRangeChange = (timeRange) => {
    console.log('Time range changed to:', timeRange);
  };

  const handleDataUpdate = (updatedData) => {
    console.log('Data updated:', updatedData);
  };

  return (
    <>
      <Helmet>
        <title>WTD Distribution Analysis - SaaS BI Analytics</title>
        <meta name="description" content="Monitor weighted distribution performance and product availability trends with comprehensive analytics and insights." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb />
            </div>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">WTD Distribution Analysis</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor weighted distribution performance and product availability trends
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterSidebarOpen(true)}
                  iconName="SlidersHorizontal"
                  iconSize={16}
                >
                  Advanced Filters
                </Button>
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconSize={16}
                  loading={isLoading}
                >
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* Global Filters */}
            <div className="mb-8">
              <GlobalFilterPanel
                onFiltersChange={handleGlobalFiltersChange}
                initialFilters={globalFilters}
              />
            </div>

            {/* Metrics Cards */}
            <div className="mb-8">
              <WTDMetricsCards metricsData={metricsData} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Trend Chart - Takes 2 columns on xl screens */}
              <div className="xl:col-span-2">
                <WTDTrendChart
                  chartData={trendChartData}
                  onMetricChange={handleMetricChange}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </div>

              {/* Insights Panel - Takes 1 column on xl screens */}
              <div className="xl:col-span-1">
                <DistributionInsightsPanel insightsData={insightsData} />
              </div>
            </div>

            {/* Distribution Data Grid */}
            <div className="mb-8">
              <DistributionDataGrid
                gridData={distributionGridData}
                onDataUpdate={handleDataUpdate}
              />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-card rounded-lg p-6 flex items-center space-x-3">
                  <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                  <span className="text-foreground">Updating data...</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Advanced Filter Sidebar */}
        <AdvancedFilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          onFiltersApply={handleAdvancedFiltersApply}
          currentFilters={advancedFilters}
        />

        {/* Export Action Menu */}
        <ExportActionMenu onExport={handleExport} />
      </div>
    </>
  );
};

export default WTDDistributionAnalysis;