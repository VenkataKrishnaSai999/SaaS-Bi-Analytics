import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportSidebar = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState(['reports', 'insights']);

  const sidebarSections = [
    {
      id: 'reports',
      label: 'Report Library',
      icon: 'FileText',
      items: [
        { id: 'all-reports', label: 'All Reports', count: 24 },
        { id: 'brand-reports', label: 'Brand Analysis', count: 8 },
        { id: 'regional-reports', label: 'Regional Sales', count: 6 },
        { id: 'distribution-reports', label: 'Distribution', count: 5 },
        { id: 'market-reports', label: 'Market Insights', count: 5 }
      ]
    },
    {
      id: 'builder',
      label: 'Report Builder',
      icon: 'Settings',
      items: [
        { id: 'custom-builder', label: 'Custom Reports' },
        { id: 'templates', label: 'Report Templates' },
        { id: 'scheduled', label: 'Scheduled Reports' }
      ]
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: 'Brain',
      items: [
        { id: 'automated-insights', label: 'Automated Analysis' },
        { id: 'recommendations', label: 'Recommendations' },
        { id: 'questions', label: 'Business Q&A' }
      ]
    },
    {
      id: 'exports',
      label: 'Export Center',
      icon: 'Download',
      items: [
        { id: 'recent-exports', label: 'Recent Exports' },
        { id: 'export-queue', label: 'Export Queue' },
        { id: 'export-history', label: 'Export History' }
      ]
    }
  ];

  const quickActions = [
    { id: 'new-report', label: 'New Report', icon: 'Plus', variant: 'default' },
    { id: 'refresh-data', label: 'Refresh Data', icon: 'RefreshCw', variant: 'outline' },
    { id: 'export-all', label: 'Export All', icon: 'Download', variant: 'outline' }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev?.includes(categoryId) 
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSectionClick = (sectionId, itemId = null) => {
    const fullSectionId = itemId ? `${sectionId}-${itemId}` : sectionId;
    if (onSectionChange) {
      onSectionChange(fullSectionId);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-card border-r border-border shadow-soft flex flex-col">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
        {/* Collapsed Icons */}
        <div className="flex-1 py-4 space-y-2">
          {sidebarSections?.map(section => (
            <button
              key={section?.id}
              onClick={() => handleSectionClick(section?.id)}
              className={`w-full flex items-center justify-center p-2 mx-2 rounded-lg transition-smooth ${
                activeSection?.startsWith(section?.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={section?.label}
            >
              <Icon name={section?.icon} size={20} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border shadow-soft flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Reports & Insights</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="lg:hidden"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          {quickActions?.map(action => (
            <Button
              key={action?.id}
              variant={action?.variant}
              size="sm"
              fullWidth
              iconName={action?.icon}
              iconSize={16}
              onClick={() => handleSectionClick('quick-action', action?.id)}
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        {sidebarSections?.map(section => (
          <div key={section?.id} className="mb-4">
            <button
              onClick={() => toggleCategory(section?.id)}
              className="w-full flex items-center justify-between px-6 py-2 text-sm font-medium text-foreground hover:bg-muted transition-smooth"
            >
              <div className="flex items-center space-x-2">
                <Icon name={section?.icon} size={16} />
                <span>{section?.label}</span>
              </div>
              <Icon 
                name={expandedCategories?.includes(section?.id) ? 'ChevronDown' : 'ChevronRight'} 
                size={16} 
                className="text-muted-foreground"
              />
            </button>

            {expandedCategories?.includes(section?.id) && (
              <div className="mt-1 space-y-1">
                {section?.items?.map(item => (
                  <button
                    key={item?.id}
                    onClick={() => handleSectionClick(section?.id, item?.id)}
                    className={`w-full flex items-center justify-between px-8 py-2 text-sm transition-smooth ${
                      activeSection === `${section?.id}-${item?.id}`
                        ? 'bg-primary/10 text-primary border-r-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{item?.label}</span>
                    {item?.count && (
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        {item?.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Last data refresh:</p>
          <p className="font-medium">Dec 15, 2024 at 2:30 PM</p>
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={14} className="mt-2">
            Refresh Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportSidebar;