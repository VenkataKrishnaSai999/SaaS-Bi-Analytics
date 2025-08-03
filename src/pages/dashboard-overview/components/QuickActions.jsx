import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ className = "" }) => {
  const quickActions = [
    {
      id: 'upload-data',
      label: 'Upload New Data',
      description: 'Process new Excel files',
      route: '/file-upload-processing',
      icon: 'Upload',
      variant: 'default',
      priority: 'high'
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      description: 'Create comprehensive insights',
      route: '/reports-insights',
      icon: 'FileText',
      variant: 'outline',
      priority: 'medium'
    },
    {
      id: 'brand-analysis',
      label: 'Brand Analysis',
      description: 'Deep dive into brand performance',
      route: '/brand-share-analysis',
      icon: 'TrendingUp',
      variant: 'outline',
      priority: 'medium'
    },
    {
      id: 'regional-view',
      label: 'Regional Dashboard',
      description: 'Geographic performance insights',
      route: '/regional-sales-dashboard',
      icon: 'Map',
      variant: 'outline',
      priority: 'low'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Data Upload Completed',
      description: 'Brand_Share_Cleaned.xlsx processed successfully',
      timestamp: '2 hours ago',
      icon: 'CheckCircle',
      status: 'success'
    },
    {
      id: 2,
      action: 'Report Generated',
      description: 'Q4 Regional Sales Analysis exported',
      timestamp: '4 hours ago',
      icon: 'FileText',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Dashboard Updated',
      description: 'WTD Distribution metrics refreshed',
      timestamp: '6 hours ago',
      icon: 'RefreshCw',
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'completed':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions?.map((action) => (
            <Link key={action?.id} to={action?.route} className="block">
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth group">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-smooth">
                    <Icon name={action?.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                      {action?.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action?.description}
                    </p>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground group-hover:text-primary transition-smooth" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Recent Activities */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          </div>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" iconSize={16} />
        </div>
        
        <div className="space-y-4">
          {recentActivities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-smooth">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getStatusColor(activity?.status)}`}>
                <Icon name={activity?.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity?.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity?.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity?.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth iconName="Clock" iconPosition="left">
            View All Activities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;