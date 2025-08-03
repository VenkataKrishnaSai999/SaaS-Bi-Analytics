import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportLibrary = ({ onDownloadReport }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reportCategories = [
    { id: 'all', label: 'All Reports', count: 24 },
    { id: 'brand-analysis', label: 'Brand Analysis', count: 8 },
    { id: 'regional-sales', label: 'Regional Sales', count: 6 },
    { id: 'distribution', label: 'Distribution', count: 5 },
    { id: 'market-insights', label: 'Market Insights', count: 5 }
  ];

  const preGeneratedReports = [
    {
      id: 'rpt-001',
      title: 'Q4 2024 Brand Share Performance Analysis',
      category: 'brand-analysis',
      description: 'Comprehensive analysis of brand market share performance across all regions with competitor benchmarking and strategic recommendations.',
      generatedAt: '2024-12-15T10:30:00Z',
      dataSource: 'Brand_Share_Cleaned.xlsx',
      format: 'markdown',
      size: '2.4 MB',
      downloadCount: 127,
      tags: ['quarterly', 'brand-share', 'competitive-analysis']
    },
    {
      id: 'rpt-002',
      title: 'Regional Sales Distribution Dashboard Report',
      category: 'regional-sales',
      description: 'Detailed breakdown of sales performance by region with trend analysis and growth opportunities identification.',
      generatedAt: '2024-12-14T16:45:00Z',
      dataSource: 'Regional_Cleaned.xlsx',
      format: 'pdf',
      size: '1.8 MB',
      downloadCount: 89,
      tags: ['regional', 'sales-performance', 'growth-analysis']
    },
    {
      id: 'rpt-003',
      title: 'WTD Distribution Channel Effectiveness Study',
      category: 'distribution',
      description: 'Analysis of week-to-date distribution channel performance with efficiency metrics and optimization recommendations.',
      generatedAt: '2024-12-14T09:15:00Z',
      dataSource: 'Wtd_Dist_Cleaned.xlsx',
      format: 'html',
      size: '3.1 MB',
      downloadCount: 156,
      tags: ['wtd', 'distribution', 'channel-optimization']
    },
    {
      id: 'rpt-004',
      title: 'Market Share Trend Analysis - December 2024',
      category: 'market-insights',
      description: 'Monthly market share trends with predictive analytics and strategic positioning recommendations for key brands.',
      generatedAt: '2024-12-13T14:20:00Z',
      dataSource: 'Combined_Analysis.xlsx',
      format: 'markdown',
      size: '1.9 MB',
      downloadCount: 203,
      tags: ['market-trends', 'predictive-analytics', 'strategic-planning']
    },
    {
      id: 'rpt-005',
      title: 'SUNBULAH Brand Performance Deep Dive',
      category: 'brand-analysis',
      description: 'Focused analysis on SUNBULAH brand performance across all metrics with competitive positioning and growth strategies.',
      generatedAt: '2024-12-12T11:30:00Z',
      dataSource: 'Brand_Share_Cleaned.xlsx',
      format: 'pdf',
      size: '2.7 MB',
      downloadCount: 94,
      tags: ['sunbulah', 'brand-focus', 'competitive-positioning']
    },
    {
      id: 'rpt-006',
      title: 'Cross-Regional Performance Comparison',
      category: 'regional-sales',
      description: 'Comparative analysis of performance metrics across all regions with best practices identification and replication strategies.',
      generatedAt: '2024-12-11T13:45:00Z',
      dataSource: 'Regional_Cleaned.xlsx',
      format: 'html',
      size: '2.2 MB',
      downloadCount: 78,
      tags: ['cross-regional', 'performance-comparison', 'best-practices']
    }
  ];

  const filteredReports = preGeneratedReports?.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report?.category === selectedCategory;
    const matchesSearch = report?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         report?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         report?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return 'FileText';
      case 'html': return 'Globe';
      case 'markdown': return 'FileCode';
      default: return 'File';
    }
  };

  const getFormatColor = (format) => {
    switch (format) {
      case 'pdf': return 'text-red-600';
      case 'html': return 'text-blue-600';
      case 'markdown': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Report Library</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Access pre-generated reports and download in various formats
            </p>
          </div>
          <Button variant="outline" iconName="RefreshCw" iconSize={16}>
            Refresh Library
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {reportCategories?.map(category => (
              <button
                key={category?.id}
                onClick={() => setSelectedCategory(category?.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  selectedCategory === category?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category?.label} ({category?.count})
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Reports Grid */}
      <div className="p-6">
        {filteredReports?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Reports Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or category filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports?.map(report => (
              <div key={report?.id} className="border border-border rounded-lg p-4 hover:shadow-elevation transition-smooth">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getFormatIcon(report?.format)} 
                      size={20} 
                      className={getFormatColor(report?.format)} 
                    />
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getFormatColor(report?.format)} bg-opacity-10`}>
                      {report?.format?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{report?.size}</span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {report?.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {report?.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {report?.tags?.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <span>Generated: {formatDate(report?.generatedAt)}</span>
                    <span>Source: {report?.dataSource}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Download" size={14} />
                    <span>{report?.downloadCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconSize={14}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Download"
                    iconSize={14}
                    onClick={() => onDownloadReport(report)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportLibrary;