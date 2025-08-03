import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DistributionInsightsPanel = ({ insightsData }) => {
  const [activeTab, setActiveTab] = useState('gaps');

  const tabs = [
    { id: 'gaps', label: 'Availability Gaps', icon: 'AlertTriangle' },
    { id: 'improvements', label: 'Improvements', icon: 'TrendingUp' },
    { id: 'anomalies', label: 'Anomalies', icon: 'Zap' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'critical': return { icon: 'AlertCircle', color: 'text-error' };
      case 'warning': return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'success': return { icon: 'CheckCircle', color: 'text-success' };
      case 'info': return { icon: 'Info', color: 'text-primary' };
      default: return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-error/10 text-error border-error/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-success/10 text-success border-success/20'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badges?.[priority] || badges?.low}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}Priority
              </span>
    );
  };

  const renderInsightContent = () => {
    const currentInsights = insightsData?.[activeTab] || [];
    
    if (currentInsights?.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No insights available for this category</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {currentInsights?.map((insight, index) => {
          const iconConfig = getInsightIcon(insight?.type);
          
          return (
            <div
              key={index}
              className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={iconConfig?.icon} 
                  size={20} 
                  className={`flex-shrink-0 mt-0.5 ${iconConfig?.color}`} 
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {insight?.title}
                    </h4>
                    {insight?.priority && getPriorityBadge(insight?.priority)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight?.description}
                  </p>
                  
                  {insight?.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      {insight?.metrics?.map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-center">
                          <div className="text-lg font-semibold text-foreground">
                            {metric?.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metric?.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {insight?.actions && insight?.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {insight?.actions?.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="outline"
                          size="sm"
                          iconName={action?.icon}
                          iconSize={14}
                        >
                          {action?.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Distribution Insights</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered analysis and actionable recommendations
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
          >
            Refresh
          </Button>
        </div>
      </div>
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6" aria-label="Insights tabs">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {insightsData?.[tab?.id] && insightsData?.[tab?.id]?.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {insightsData?.[tab?.id]?.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {renderInsightContent()}
      </div>
      <div className="px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Last analysis: {new Date()?.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Cpu" size={14} />
            <span>AI-powered insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionInsightsPanel;