import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import GlobalFilterPanel from '../../components/ui/GlobalFilterPanel';
import ExportActionMenu from '../../components/ui/ExportActionMenu';
import DashboardCard from './components/DashboardCard';
import MetricsSummary from './components/MetricsSummary';
import QuickActions from './components/QuickActions';
import SunbulahHighlight from './components/SunbulahHighlight';
import Icon from '../../components/AppIcon';
import { answerBusinessQuestion } from '../../utils/geminiClient';

const DashboardOverview = () => {
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [aiInsights, setAiInsights] = useState([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Load analysis results from localStorage
  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults');
    const storedBrand = localStorage.getItem('selectedBrand');
    
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        setAnalysisResults(results);
        setSelectedBrand(storedBrand || 'SUNBULAH');
        
        // Generate AI insights for key business questions
        generateKeyInsights(results, storedBrand || 'SUNBULAH');
      } catch (error) {
        console.error('Failed to load analysis results:', error);
      }
    }
  }, []);

  // Generate key business insights
  const generateKeyInsights = async (results, brand) => {
    if (!results || isGeneratingInsights) return;
    
    setIsGeneratingInsights(true);
    const insights = [];
    
    const questions = [
      'What percentage of the market does the brand control?',
      'Who are the top competitors?',
      'Are we stronger in volume or value?',
      'Which region contributes most to sales?',
      'Are products becoming more available?'
    ];

    try {
      for (const question of questions) {
        try {
          const answer = await answerBusinessQuestion(question, results, brand);
          insights?.push({
            question,
            answer,
            type: getInsightType(question)
          });
        } catch (error) {
          console.warn(`Failed to answer question: ${question}`, error);
        }
      }
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const getInsightType = (question) => {
    if (question?.includes('market') || question?.includes('control')) return 'market';
    if (question?.includes('competitor')) return 'competitive';
    if (question?.includes('volume') || question?.includes('value')) return 'performance';
    if (question?.includes('region')) return 'regional';
    if (question?.includes('available')) return 'distribution';
    return 'general';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'market': return 'TrendingUp';
      case 'competitive': return 'Users';
      case 'performance': return 'BarChart3';
      case 'regional': return 'Map';
      case 'distribution': return 'Package';
      default: return 'Lightbulb';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'market': return 'text-success';
      case 'competitive': return 'text-warning';
      case 'performance': return 'text-primary';
      case 'regional': return 'text-info';
      case 'distribution': return 'text-purple-500';
      default: return 'text-foreground';
    }
  };

  // Mock dashboard cards with real data if available
  const generateDashboardCards = () => {
    const cards = [];
    
    if (analysisResults?.brandShare) {
      const brandShareData = analysisResults?.brandShare?.allBrands?.slice(0, 6)?.map(brand => ({
        name: brand?.brand,
        value: brand?.share || brand?.volume,
        isFocus: brand?.brand?.toLowerCase()?.includes(selectedBrand?.toLowerCase())
      }));
      
      cards?.push({
        title: 'Brand Share Analysis',
        description: 'Market positioning and competitive insights',
        route: '/brand-share-analysis',
        icon: 'TrendingUp',
        chartType: 'bar',
        chartData: brandShareData,
        keyMetrics: [
          { 
            label: `${selectedBrand} Share`, 
            value: analysisResults?.brandShare?.focusBrand ? 
              `${(analysisResults?.brandShare?.focusBrand?.share || 0)?.toFixed(1)}%` : 'N/A' 
          },
          { 
            label: 'Market Rank', 
            value: `#${analysisResults?.brandShare?.focusBrandRank || 'N/A'}` 
          }
        ],
        trendIndicator: { direction: 'up', value: '+2.1%' },
        highlightBrand: true
      });
    }

    if (analysisResults?.regional) {
      const regionalData = analysisResults?.regional?.topRegions?.slice(0, 6)?.map(region => ({
        name: region?.region,
        value: region?.focusBrandValue
      }));
      
      cards?.push({
        title: 'Regional Sales Dashboard',
        description: 'Geographic performance and trends',
        route: '/regional-sales-dashboard',
        icon: 'Map',
        chartType: 'line',
        chartData: regionalData,
        keyMetrics: [
          { 
            label: 'Total Revenue', 
            value: `$${(regionalData?.reduce((sum, item) => sum + item?.value, 0) || 0)?.toLocaleString()}` 
          },
          { 
            label: 'Active Regions', 
            value: analysisResults?.regional?.totalRegions?.toString() || 'N/A' 
          }
        ],
        trendIndicator: { direction: 'up', value: '+12.5%' }
      });
    }

    if (analysisResults?.wtdDistribution) {
      const wtdData = analysisResults?.wtdDistribution?.channelPerformance?.slice(0, 4)?.map(channel => ({
        name: channel?.channel,
        value: channel?.focusBrandAvgDistribution
      }));
      
      cards?.push({
        title: 'WTD Distribution Analysis',
        description: 'Channel performance and distribution insights', 
        route: '/wtd-distribution-analysis',
        icon: 'Package',
        chartType: 'pie',
        chartData: wtdData,
        keyMetrics: [
          { 
            label: 'Top Channel', 
            value: wtdData?.[0]?.name || 'N/A' 
          },
          { 
            label: 'Avg Coverage', 
            value: `${(wtdData?.reduce((sum, item) => sum + item?.value, 0) / wtdData?.length || 0)?.toFixed(1)}%` 
          }
        ],
        trendIndicator: { direction: 'up', value: '+5.8%' }
      });
    }

    // Add default cards if no real data
    if (cards?.length === 0) {
      return [
        {
          title: 'Brand Share Analysis',
          description: 'Upload data to see market positioning insights',
          route: '/file-upload-processing',
          icon: 'Upload',
          chartType: 'bar',
          chartData: [],
          keyMetrics: [
            { label: 'Market Share', value: 'N/A' },
            { label: 'Market Rank', value: 'N/A' }
          ],
          trendIndicator: { direction: 'neutral', value: 'No data' },
          isEmpty: true
        }
      ];
    }
    
    return cards;
  };

  const dashboardCards = generateDashboardCards();

  useEffect(() => {
    // Simulate data refresh
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const handleExport = async (format, title) => {
    console.log(`Exporting ${title} as ${format}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">
                  {selectedBrand ? `AI-powered insights for ${selectedBrand}` : 'Comprehensive business intelligence insights'}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
                {isLoading && (
                  <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                )}
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

          {/* Metrics Summary */}
          <div className="mb-8">
            <MetricsSummary analysisResults={analysisResults} selectedBrand={selectedBrand} />
          </div>

          {/* Brand Highlight */}
          <div className="mb-8">
            <SunbulahHighlight analysisResults={analysisResults} selectedBrand={selectedBrand} />
          </div>

          {/* Dashboard Cards Grid */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="LayoutDashboard" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Analytics Dashboards</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {dashboardCards?.map((card, index) => (
                <DashboardCard
                  key={index}
                  {...card}
                  className={isLoading ? 'opacity-75 pointer-events-none' : ''}
                />
              ))}
            </div>
          </div>

          {/* AI Insights & Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              {/* AI-Generated Business Insights */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Sparkles" size={20} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">AI Business Insights</h3>
                  </div>
                  {isGeneratingInsights && (
                    <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                  )}
                </div>
                
                <div className="space-y-4">
                  {aiInsights?.length > 0 ? (
                    aiInsights?.map((insight, index) => (
                      <div key={index} className="p-4 bg-muted/30 border border-border/50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Icon 
                            name={getInsightIcon(insight?.type)} 
                            size={18} 
                            className={`flex-shrink-0 mt-0.5 ${getInsightColor(insight?.type)}`} 
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">
                              {insight?.question}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {insight?.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : analysisResults?.aiInsights ? (
                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: analysisResults?.aiInsights?.replace(/\n/g, '<br/>')?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        }}
                      />
                    </div>
                  ) : !analysisResults ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="FileUpload" size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Upload your Excel file to get AI-powered business insights</p>
                      <button 
                        onClick={() => window.location.href = '/file-upload-processing'}
                        className="text-primary hover:underline text-sm mt-2"
                      >
                        Upload data now →
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Loader2" size={32} className="mx-auto mb-2 opacity-50 animate-spin" />
                      <p>Generating AI insights...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-1">
              <QuickActions />
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
  );
};

export default DashboardOverview;