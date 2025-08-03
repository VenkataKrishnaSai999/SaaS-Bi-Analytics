import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ExportActionMenu from '../../components/ui/ExportActionMenu';
import ReportSidebar from './components/ReportSidebar';
import ReportLibrary from './components/ReportLibrary';
import ReportBuilder from './components/ReportBuilder';
import AutomatedInsights from './components/AutomatedInsights';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ReportsInsights = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('reports-all-reports');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDownloadReport = async (report) => {
    console.log('Downloading report:', report);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleGenerateReport = async (config) => {
    console.log('Generating custom report:', config);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setActiveSection('reports-all-reports');
  };

  const handleDrillDown = (path) => {
    navigate(path);
  };

  const handleExport = async (format, title) => {
    console.log(`Exporting ${title} as ${format}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const renderMainContent = () => {
    // Report Library sections
    if (activeSection?.startsWith('reports-')) {
      return (
        <ReportLibrary 
          onDownloadReport={handleDownloadReport}
        />
      );
    }

    // Report Builder sections
    if (activeSection?.startsWith('builder-')) {
      return (
        <ReportBuilder 
          onGenerateReport={handleGenerateReport}
        />
      );
    }

    // AI Insights sections
    if (activeSection?.startsWith('insights-')) {
      return (
        <AutomatedInsights 
          onDrillDown={handleDrillDown}
        />
      );
    }

    // Export Center sections
    if (activeSection?.startsWith('exports-')) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-soft p-6">
          <div className="text-center py-12">
            <Icon name="Download" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Export Center</h3>
            <p className="text-muted-foreground mb-6">
              Manage your report exports and download history
            </p>
            <Button variant="outline" iconName="RefreshCw" iconSize={16}>
              Refresh Export Status
            </Button>
          </div>
        </div>
      );
    }

    // Quick Actions
    if (activeSection?.startsWith('quick-action-')) {
      const action = activeSection?.split('-')?.[2];
      if (action === 'new-report') {
        return (
          <ReportBuilder 
            onGenerateReport={handleGenerateReport}
          />
        );
      }
    }

    // Default to Report Library
    return (
      <ReportLibrary 
        onDownloadReport={handleDownloadReport}
      />
    );
  };

  const getSectionTitle = () => {
    if (activeSection?.startsWith('reports-')) return 'Report Library';
    if (activeSection?.startsWith('builder-')) return 'Report Builder';
    if (activeSection?.startsWith('insights-')) return 'AI Insights';
    if (activeSection?.startsWith('exports-')) return 'Export Center';
    return 'Reports & Insights';
  };

  const getSectionDescription = () => {
    if (activeSection?.startsWith('reports-')) return 'Access and download pre-generated business intelligence reports';
    if (activeSection?.startsWith('builder-')) return 'Create custom reports with your preferred metrics and formatting';
    if (activeSection?.startsWith('insights-')) return 'AI-powered business insights and strategic recommendations';
    if (activeSection?.startsWith('exports-')) return 'Manage report exports and download history';
    return 'Comprehensive reporting hub for business intelligence and insights';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 flex">
        {/* Sidebar */}
        <ReportSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Content Header */}
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {isMobile && sidebarCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleSidebar}
                  >
                    <Icon name="Menu" size={20} />
                  </Button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{getSectionTitle()}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getSectionDescription()}
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="outline" iconName="Settings" iconSize={16}>
                  Settings
                </Button>
                <Button variant="default" iconName="Plus" iconSize={16}>
                  New Report
                </Button>
              </div>
            </div>

            <Breadcrumb />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Export Action Menu */}
      <ExportActionMenu
        onExport={handleExport}
        customFormats={['pdf', 'xlsx', 'csv', 'html']}
      />
    </div>
  );
};

export default ReportsInsights;