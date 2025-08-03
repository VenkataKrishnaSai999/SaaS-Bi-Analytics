import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedInsights = ({ onDrillDown }) => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const businessQuestions = [
    {
      id: 'q1',
      question: 'Which brand is gaining the most market share this quarter?',
      answer: `SUNBULAH has gained 3.2% market share this quarter, the highest among all brands. This growth is primarily driven by strong performance in the North and Central regions, with a 15% increase in sales volume compared to the previous quarter.`,
      confidence: 92,
      dataPoints: ['Market Share: +3.2%', 'Sales Volume: +15%', 'Regional Growth: North (+18%), Central (+12%)'],
      supportingChart: 'brand-share-trend',
      lastUpdated: '2024-12-15T14:30:00Z'
    },
    {
      id: 'q2',
      question: 'What are the key factors driving regional sales variations?',
      answer: `Regional sales variations are primarily influenced by distribution density and local market preferences. The West region shows 22% higher sales due to better distribution coverage, while the East region lags by 8% due to limited retail partnerships.`,
      confidence: 87,
      dataPoints: ['West Region: +22% vs average', 'Distribution Coverage: 85% vs 62%', 'East Region: -8% vs average'],
      supportingChart: 'regional-performance',
      lastUpdated: '2024-12-15T13:45:00Z'
    },
    {
      id: 'q3',
      question: 'How effective are current distribution channels?',
      answer: `Current distribution channels show mixed effectiveness. Traditional retail channels maintain 68% efficiency, while e-commerce channels have improved to 45% efficiency. Direct-to-consumer channels show the highest growth potential at 23% quarter-over-quarter growth.`,
      confidence: 89,
      dataPoints: ['Traditional Retail: 68% efficiency', 'E-commerce: 45% efficiency', 'D2C Growth: +23% QoQ'],
      supportingChart: 'distribution-efficiency',
      lastUpdated: '2024-12-15T12:20:00Z'
    },
    {
      id: 'q4',
      question: 'What seasonal trends are impacting sales performance?',
      answer: `Seasonal analysis reveals strong Q4 performance with 28% increase in holiday-related product categories. Dairy products show consistent year-round demand, while frozen foods peak during summer months with 35% seasonal uplift.`,
      confidence: 94,
      dataPoints: ['Q4 Holiday Products: +28%', 'Dairy: Consistent demand', 'Frozen Foods: +35% summer peak'],
      supportingChart: 'seasonal-trends',
      lastUpdated: '2024-12-15T11:15:00Z'
    }
  ];

  const keyInsightCards = [
    {
      id: 'insight-1',
      title: 'Market Share Leadership',
      metric: '+3.2%',
      description: 'SUNBULAH gained significant market share this quarter',
      trend: 'up',
      impact: 'high',
      category: 'brand-performance',
      drillDownPath: '/brand-share-analysis'
    },
    {
      id: 'insight-2',
      title: 'Regional Growth Opportunity',
      metric: '22%',
      description: 'West region outperforming due to distribution density',
      trend: 'up',
      impact: 'medium',
      category: 'regional-performance',
      drillDownPath: '/regional-sales-dashboard'
    },
    {
      id: 'insight-3',
      title: 'Distribution Efficiency',
      metric: '68%',
      description: 'Traditional retail channels maintaining strong efficiency',
      trend: 'stable',
      impact: 'medium',
      category: 'distribution',
      drillDownPath: '/wtd-distribution-analysis'
    },
    {
      id: 'insight-4',
      title: 'Seasonal Performance',
      metric: '+28%',
      description: 'Holiday products showing exceptional Q4 growth',
      trend: 'up',
      impact: 'high',
      category: 'seasonal-trends',
      drillDownPath: '/dashboard-overview'
    }
  ];

  const strategicRecommendations = [
    {
      id: 'rec-1',
      priority: 'high',
      title: 'Expand SUNBULAH Distribution',
      description: 'Leverage current market share momentum by expanding SUNBULAH distribution to underperforming regions, particularly East region.',
      expectedImpact: 'Potential 5-8% additional market share gain',
      timeframe: '3-6 months',
      resources: 'Distribution team, regional partnerships'
    },
    {
      id: 'rec-2',
      priority: 'medium',
      title: 'Optimize E-commerce Channels',
      description: 'Improve e-commerce channel efficiency from 45% to target 60% through better inventory management and fulfillment optimization.',
      expectedImpact: '15-20% increase in online sales',
      timeframe: '2-4 months',
      resources: 'Technology investment, logistics optimization'
    },
    {
      id: 'rec-3',
      priority: 'high',
      title: 'Seasonal Inventory Planning',
      description: 'Implement advanced seasonal forecasting for holiday and summer peak products to maximize revenue opportunities.',
      expectedImpact: '10-15% reduction in stockouts',
      timeframe: '1-3 months',
      resources: 'Forecasting tools, inventory management'
    }
  ];

  const handleRefreshInsights = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 80) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'TrendingUp';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      case 'stable': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactBadge = (impact) => {
    const colors = {
      high: 'bg-error/10 text-error',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-muted text-muted-foreground'
    };
    return colors?.[impact] || colors?.low;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-error/10 text-error',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-success/10 text-success'
    };
    return colors?.[priority] || colors?.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Automated Business Insights</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered analysis of your business data with actionable recommendations
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshInsights}
          loading={refreshing}
          iconName="RefreshCw"
          iconSize={16}
        >
          Refresh Insights
        </Button>
      </div>
      {/* Key Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyInsightCards?.map(insight => (
          <div key={insight?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation transition-smooth cursor-pointer"
               onClick={() => onDrillDown && onDrillDown(insight?.drillDownPath)}>
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactBadge(insight?.impact)}`}>
                {insight?.impact} impact
              </span>
              <Icon 
                name={getTrendIcon(insight?.trend)} 
                size={16} 
                className={getTrendColor(insight?.trend)} 
              />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{insight?.metric}</div>
            <h3 className="text-sm font-medium text-foreground mb-1">{insight?.title}</h3>
            <p className="text-xs text-muted-foreground">{insight?.description}</p>
          </div>
        ))}
      </div>
      {/* Business Questions & Answers */}
      <div className="bg-card border border-border rounded-lg shadow-soft">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Business Questions & AI Answers</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automated analysis answers to key business questions
          </p>
        </div>
        <div className="p-6 space-y-6">
          {businessQuestions?.map(qa => (
            <div key={qa?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-md font-medium text-foreground pr-4">{qa?.question}</h4>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`text-xs font-medium ${getConfidenceColor(qa?.confidence)}`}>
                    {qa?.confidence}% confidence
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(qa?.lastUpdated)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {qa?.answer}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {qa?.dataPoints?.map((point, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
                    {point}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Supporting chart: {qa?.supportingChart}
                </span>
                <Button variant="ghost" size="sm" iconName="ExternalLink" iconSize={14}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Strategic Recommendations */}
      <div className="bg-card border border-border rounded-lg shadow-soft">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Strategic Recommendations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI-generated strategic recommendations based on data analysis
          </p>
        </div>
        <div className="p-6 space-y-4">
          {strategicRecommendations?.map(rec => (
            <div key={rec?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(rec?.priority)}`}>
                    {rec?.priority} priority
                  </span>
                  <h4 className="text-md font-medium text-foreground">{rec?.title}</h4>
                </div>
                <Icon name="Target" size={16} className="text-primary flex-shrink-0" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {rec?.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-medium text-foreground">Expected Impact:</span>
                  <p className="text-muted-foreground mt-1">{rec?.expectedImpact}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Timeframe:</span>
                  <p className="text-muted-foreground mt-1">{rec?.timeframe}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Resources:</span>
                  <p className="text-muted-foreground mt-1">{rec?.resources}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomatedInsights;