import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightsPanel = ({ data, filters }) => {
  const [activeTab, setActiveTab] = useState('insights');

  const generateInsights = () => {
    let filteredData = [...data];

    // Apply filters
    if (filters?.category && filters?.category !== 'all') {
      filteredData = filteredData?.filter(item => item?.category === filters?.category);
    }

    const sunbulahBrand = filteredData?.find(item => 
      item?.brand?.toLowerCase()?.includes('sunbulah')
    );

    const topCompetitors = filteredData?.filter(item => !item?.brand?.toLowerCase()?.includes('sunbulah'))?.sort((a, b) => b?.marketShare - a?.marketShare)?.slice(0, 3);

    const fastestGrowing = filteredData?.sort((a, b) => b?.growth - a?.growth)?.slice(0, 3);

    return {
      sunbulahBrand,
      topCompetitors,
      fastestGrowing,
      totalMarketSize: filteredData?.reduce((sum, item) => sum + item?.value, 0),
      avgGrowth: filteredData?.reduce((sum, item) => sum + item?.growth, 0) / filteredData?.length
    };
  };

  const insights = generateInsights();

  const keyInsights = [
    {
      type: 'performance',
      icon: 'TrendingUp',
      title: 'SUNBULAH Performance',
      content: insights?.sunbulahBrand 
        ? `SUNBULAH holds ${insights?.sunbulahBrand?.marketShare?.toFixed(1)}% market share, ranking #${insights?.sunbulahBrand?.rank} in the category. The brand shows ${insights?.sunbulahBrand?.growth >= 0 ? 'positive' : 'negative'} growth of ${insights?.sunbulahBrand?.growth?.toFixed(1)}% compared to the previous period.`
        : 'SUNBULAH data not available for current filters.',
      priority: 'high'
    },
    {
      type: 'competition',
      icon: 'Users',
      title: 'Competitive Landscape',
      content: `The top 3 competitors are ${insights?.topCompetitors?.map(c => `${c?.brand} (${c?.marketShare?.toFixed(1)}%)`)?.join(', ')}. The market shows ${insights?.avgGrowth >= 0 ? 'overall growth' : 'decline'} with an average of ${insights?.avgGrowth?.toFixed(1)}%.`,
      priority: 'medium'
    },
    {
      type: 'growth',
      icon: 'Zap',
      title: 'Growth Opportunities',
      content: `Fastest growing brands: ${insights?.fastestGrowing?.map(b => `${b?.brand} (+${b?.growth?.toFixed(1)}%)`)?.join(', ')}. Consider analyzing their strategies for potential market expansion opportunities.`,
      priority: 'medium'
    },
    {
      type: 'market',
      icon: 'PieChart',
      title: 'Market Dynamics',
      content: `Total market value is $${(insights?.totalMarketSize / 1000000)?.toFixed(1)}M. ${insights?.sunbulahBrand ? `SUNBULAH captures $${(insights?.sunbulahBrand?.value / 1000000)?.toFixed(1)}M of this value.` : ''} Focus on volume vs value optimization for better positioning.`,
      priority: 'low'
    }
  ];

  const recommendations = [
    {
      title: 'Strengthen Market Position',
      description: 'Focus on key product categories where SUNBULAH shows strong performance',
      action: 'Increase marketing spend in high-performing segments',
      impact: 'High',
      timeline: '3-6 months'
    },
    {
      title: 'Competitive Response',
      description: 'Monitor and respond to competitor pricing and promotional strategies',
      action: 'Develop competitive intelligence dashboard',
      impact: 'Medium',
      timeline: '1-3 months'
    },
    {
      title: 'Growth Channel Expansion',
      description: 'Explore underperforming regions and channels for expansion',
      action: 'Pilot programs in identified growth markets',
      impact: 'High',
      timeline: '6-12 months'
    },
    {
      title: 'Product Portfolio Optimization',
      description: 'Analyze volume vs value performance across product lines',
      action: 'Optimize product mix for better margins',
      impact: 'Medium',
      timeline: '3-9 months'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactBadge = (impact) => {
    const colors = {
      'High': 'bg-error/10 text-error',
      'Medium': 'bg-warning/10 text-warning',
      'Low': 'bg-success/10 text-success'
    };
    return colors?.[impact] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold text-foreground">Business Intelligence</h3>
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
                activeTab === 'insights' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
                activeTab === 'recommendations' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Actions
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Lightbulb" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                AI-Generated Market Insights
              </span>
              <span className="text-xs text-muted-foreground">
                Updated {new Date()?.toLocaleTimeString()}
              </span>
            </div>

            {keyInsights?.map((insight, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={insight?.icon} size={20} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-foreground">{insight?.title}</h4>
                      <span className={`text-xs font-medium ${getPriorityColor(insight?.priority)}`}>
                        {insight?.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight?.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Analysis Summary</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on current data filters, this analysis covers {data?.length} brands across 
                {filters?.category === 'all' ? ' all categories' : ` ${filters?.category} category`}
                {filters?.region === 'all' ? ' and all regions' : ` in ${filters?.region} region`}.
                Insights are automatically updated when filters change.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Target" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                Strategic Recommendations
              </span>
            </div>

            {recommendations?.map((rec, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-foreground">{rec?.title}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactBadge(rec?.impact)}`}>
                    {rec?.impact} Impact
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {rec?.description}
                </p>
                
                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-foreground mb-1">Recommended Action:</p>
                  <p className="text-sm text-muted-foreground">{rec?.action}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Timeline: {rec?.timeline}</span>
                  <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
                    View Details
                  </Button>
                </div>
              </div>
            ))}

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Rocket" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Quick Win Opportunity</span>
              </div>
              <p className="text-sm text-foreground">
                Focus on the top 3 fastest-growing segments where SUNBULAH has presence. 
                A 2% market share increase in these segments could add $
                {((insights?.totalMarketSize * 0.02) / 1000000)?.toFixed(1)}M in revenue.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;