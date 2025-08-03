import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegionalInsightsPanel = ({ selectedRegions, selectedMetrics, timeRange }) => {
  const [activeInsight, setActiveInsight] = useState('performance');

  const insights = {
    performance: {
      title: 'Performance Analysis',
      icon: 'TrendingUp',
      content: [
        {
          type: 'highlight',
          title: 'Top Performer',
          description: `South Region leads with $3.2M in sales, representing 23.8% market share and maintaining steady 8.3% growth rate.`,
          metric: '+23.8%',
          trend: 'positive'
        },
        {
          type: 'concern',
          title: 'Growth Opportunity',
          description: `West Region shows lowest growth at 6.7% despite having strong market penetration potential in untapped territories.`,
          metric: '6.7%',
          trend: 'neutral'
        },
        {
          type: 'insight',
          title: 'Emerging Leader',
          description: `East Region demonstrates highest growth rate at 15.2%, indicating successful market expansion strategies and strong customer acquisition.`,
          metric: '+15.2%',
          trend: 'positive'
        }
      ]
    },
    opportunities: {
      title: 'Growth Opportunities',
      icon: 'Target',
      content: [
        {
          type: 'opportunity',
          title: 'Territory Expansion',
          description: `West Region has only 12 territories compared to South's 22. Expanding by 5-8 territories could increase revenue by $400K-600K annually.`,metric: '+$500K',trend: 'positive'
        },
        {
          type: 'opportunity',title: 'Market Penetration',description: `North Region shows 78.5% penetration vs industry average of 85%. Improving penetration could yield additional $200K in quarterly revenue.`,metric: '+6.5%',trend: 'positive'
        },
        {
          type: 'opportunity',title: 'Cross-Regional Learning',description: `East Region's successful growth strategies (15.2% growth) can be replicated in West and North regions for similar performance gains.`,
          metric: 'Best Practice',
          trend: 'positive'
        }
      ]
    },
    recommendations: {
      title: 'Strategic Recommendations',
      icon: 'Lightbulb',
      content: [
        {
          type: 'action',
          title: 'Immediate Actions (0-3 months)',
          description: `Focus on West Region territory expansion and implement East Region's successful customer acquisition strategies in underperforming areas.`,
          metric: 'High Priority',trend: 'positive'
        },
        {
          type: 'action',title: 'Medium-term Strategy (3-6 months)',
          description: `Develop regional specialization programs based on top-performing products in each region and establish cross-regional knowledge sharing.`,
          metric: 'Medium Priority',trend: 'neutral'
        },
        {
          type: 'action',title: 'Long-term Vision (6-12 months)',
          description: `Establish regional centers of excellence and implement predictive analytics for territory performance optimization and resource allocation.`,
          metric: 'Strategic',trend: 'positive'
        }
      ]
    },
    trends: {
      title: 'Market Trends',icon: 'Activity',
      content: [
        {
          type: 'trend',title: 'Seasonal Patterns',
          description: `Q2 shows consistent 12-15% uptick across all regions, with South and East leading seasonal performance improvements.`,
          metric: '+13.5%',trend: 'positive'
        },
        {
          type: 'trend',title: 'Customer Behavior',description: `Average order values increased by 8.2% year-over-year, with Central Region showing highest AOV growth at $1,318 per order.`,metric: '+8.2%',trend: 'positive'
        },
        {
          type: 'trend',title: 'Competitive Landscape',
          description: `Market share gains in East and North regions indicate successful competitive positioning, while West faces increased competition.`,
          metric: 'Mixed',trend: 'neutral'
        }
      ]
    }
  };

  const insightTypes = [
    { key: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { key: 'opportunities', label: 'Opportunities', icon: 'Target' },
    { key: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' },
    { key: 'trends', label: 'Trends', icon: 'Activity' }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'highlight':
        return { name: 'Star', color: 'var(--color-success)' };
      case 'concern':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      case 'insight':
        return { name: 'Lightbulb', color: 'var(--color-primary)' };
      case 'opportunity':
        return { name: 'Target', color: 'var(--color-accent)' };
      case 'action':
        return { name: 'CheckCircle', color: 'var(--color-primary)' };
      case 'trend':
        return { name: 'TrendingUp', color: 'var(--color-success)' };
      default:
        return { name: 'Info', color: 'var(--color-muted-foreground)' };
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      case 'neutral':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const currentInsights = insights?.[activeInsight];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Brain" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">AI-Powered Insights</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Updated 5 minutes ago</span>
        </div>
      </div>
      {/* Insight Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {insightTypes?.map((type) => (
          <Button
            key={type?.key}
            variant={activeInsight === type?.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveInsight(type?.key)}
            iconName={type?.icon}
            iconSize={16}
            className="text-xs"
          >
            {type?.label}
          </Button>
        ))}
      </div>
      {/* Insights Content */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name={currentInsights?.icon} size={18} color="var(--color-primary)" />
          <h4 className="font-semibold text-foreground">{currentInsights?.title}</h4>
        </div>

        {currentInsights?.content?.map((insight, index) => {
          const iconInfo = getInsightIcon(insight?.type);
          return (
            <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon name={iconInfo?.name} size={16} color={iconInfo?.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-foreground">{insight?.title}</h5>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(insight?.trend)} bg-current/10`}>
                      {insight?.metric}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight?.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Context Information */}
      <div className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">Analysis Context</p>
            <p className="text-muted-foreground">
              Insights generated based on {selectedRegions?.length > 0 ? selectedRegions?.length : 'all'} regions, 
              {selectedMetrics?.length} metrics, and {timeRange} time period. 
              Recommendations use industry benchmarks and historical performance data.
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
            className="text-xs"
          >
            Export Insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Share"
            iconSize={16}
            className="text-xs"
          >
            Share Report
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RefreshCw"
          iconSize={16}
          className="text-xs"
        >
          Regenerate
        </Button>
      </div>
    </div>
  );
};

export default RegionalInsightsPanel;