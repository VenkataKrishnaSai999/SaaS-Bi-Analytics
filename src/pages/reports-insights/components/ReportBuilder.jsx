import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportBuilder = ({ onGenerateReport }) => {
  const [reportConfig, setReportConfig] = useState({
    title: '',
    description: '',
    metrics: [],
    timePeriod: 'last30days',
    customStartDate: '',
    customEndDate: '',
    regions: [],
    brands: [],
    categories: [],
    outputFormat: 'pdf',
    includeCharts: true,
    includeInsights: true,
    includeRecommendations: true,
    branding: 'company'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const metricOptions = [
    { value: 'market-share', label: 'Market Share Analysis' },
    { value: 'sales-volume', label: 'Sales Volume Metrics' },
    { value: 'revenue-analysis', label: 'Revenue Analysis' },
    { value: 'regional-performance', label: 'Regional Performance' },
    { value: 'brand-comparison', label: 'Brand Comparison' },
    { value: 'distribution-efficiency', label: 'Distribution Efficiency' },
    { value: 'trend-analysis', label: 'Trend Analysis' },
    { value: 'competitive-positioning', label: 'Competitive Positioning' }
  ];

  const timePeriodOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const regionOptions = [
    { value: 'north', label: 'North Region' },
    { value: 'south', label: 'South Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' },
    { value: 'central', label: 'Central Region' }
  ];

  const brandOptions = [
    { value: 'sunbulah', label: 'SUNBULAH' },
    { value: 'brand-a', label: 'Brand A' },
    { value: 'brand-b', label: 'Brand B' },
    { value: 'brand-c', label: 'Brand C' },
    { value: 'private-label', label: 'Private Label' }
  ];

  const categoryOptions = [
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'packaged', label: 'Packaged Goods' }
  ];

  const outputFormatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'html', label: 'HTML Dashboard' },
    { value: 'markdown', label: 'Markdown Document' },
    { value: 'excel', label: 'Excel Workbook' }
  ];

  const brandingOptions = [
    { value: 'company', label: 'Company Branding' },
    { value: 'minimal', label: 'Minimal Design' },
    { value: 'custom', label: 'Custom Template' }
  ];

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGeneratePreview = () => {
    const mockPreview = {
      title: reportConfig?.title || 'Custom Business Intelligence Report',
      sections: [
        'Executive Summary',
        'Key Metrics Overview',
        ...(reportConfig?.includeCharts ? ['Data Visualizations'] : []),
        ...(reportConfig?.includeInsights ? ['Business Insights'] : []),
        ...(reportConfig?.includeRecommendations ? ['Strategic Recommendations'] : []),
        'Appendix'
      ],
      estimatedPages: Math.max(5, reportConfig?.metrics?.length * 2),
      estimatedTime: '3-5 minutes'
    };
    setPreviewData(mockPreview);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate generation
      if (onGenerateReport) {
        onGenerateReport(reportConfig);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isConfigValid = () => {
    return reportConfig?.title?.trim() && reportConfig?.metrics?.length > 0;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Settings" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-foreground">Custom Report Builder</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Create customized reports with your preferred metrics and formatting
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Report Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Report Title</label>
              <input
                type="text"
                value={reportConfig?.title}
                onChange={(e) => handleConfigChange('title', e?.target?.value)}
                placeholder="Enter report title..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Select
              label="Output Format"
              options={outputFormatOptions}
              value={reportConfig?.outputFormat}
              onChange={(value) => handleConfigChange('outputFormat', value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={reportConfig?.description}
              onChange={(e) => handleConfigChange('description', e?.target?.value)}
              placeholder="Brief description of the report purpose..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        {/* Metrics Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Metrics & Analysis</h3>
          <Select
            label="Select Metrics"
            description="Choose the metrics to include in your report"
            options={metricOptions}
            value={reportConfig?.metrics}
            onChange={(value) => handleConfigChange('metrics', value)}
            multiple
            searchable
            placeholder="Select metrics..."
          />
        </div>

        {/* Time Period */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Time Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Time Range"
              options={timePeriodOptions}
              value={reportConfig?.timePeriod}
              onChange={(value) => handleConfigChange('timePeriod', value)}
            />
            {reportConfig?.timePeriod === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                  <input
                    type="date"
                    value={reportConfig?.customStartDate}
                    onChange={(e) => handleConfigChange('customStartDate', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                  <input
                    type="date"
                    value={reportConfig?.customEndDate}
                    onChange={(e) => handleConfigChange('customEndDate', e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Regions"
              options={regionOptions}
              value={reportConfig?.regions}
              onChange={(value) => handleConfigChange('regions', value)}
              multiple
              placeholder="All regions"
            />
            <Select
              label="Brands"
              options={brandOptions}
              value={reportConfig?.brands}
              onChange={(value) => handleConfigChange('brands', value)}
              multiple
              placeholder="All brands"
            />
            <Select
              label="Categories"
              options={categoryOptions}
              value={reportConfig?.categories}
              onChange={(value) => handleConfigChange('categories', value)}
              multiple
              placeholder="All categories"
            />
          </div>
        </div>

        {/* Report Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Report Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Checkbox
                label="Include Charts & Visualizations"
                description="Add interactive charts and graphs"
                checked={reportConfig?.includeCharts}
                onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
              />
              <Checkbox
                label="Include Business Insights"
                description="Add automated insights and analysis"
                checked={reportConfig?.includeInsights}
                onChange={(e) => handleConfigChange('includeInsights', e?.target?.checked)}
              />
              <Checkbox
                label="Include Recommendations"
                description="Add strategic recommendations"
                checked={reportConfig?.includeRecommendations}
                onChange={(e) => handleConfigChange('includeRecommendations', e?.target?.checked)}
              />
            </div>
            <div>
              <Select
                label="Branding Style"
                options={brandingOptions}
                value={reportConfig?.branding}
                onChange={(value) => handleConfigChange('branding', value)}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {previewData && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-md font-medium text-foreground mb-3">Report Preview</h4>
            <div className="space-y-2">
              <p className="text-sm"><strong>Title:</strong> {previewData?.title}</p>
              <p className="text-sm"><strong>Sections:</strong> {previewData?.sections?.join(', ')}</p>
              <p className="text-sm"><strong>Estimated Pages:</strong> {previewData?.estimatedPages}</p>
              <p className="text-sm"><strong>Generation Time:</strong> {previewData?.estimatedTime}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleGeneratePreview}
            iconName="Eye"
            iconSize={16}
            disabled={!isConfigValid()}
          >
            Preview Report
          </Button>
          <Button
            variant="default"
            onClick={handleGenerateReport}
            loading={isGenerating}
            iconName="FileText"
            iconSize={16}
            disabled={!isConfigValid()}
            className="flex-1 sm:flex-none"
          >
            {isGenerating ? 'Generating Report...' : 'Generate Report'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;