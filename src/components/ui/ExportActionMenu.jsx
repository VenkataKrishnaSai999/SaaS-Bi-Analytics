import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const ExportActionMenu = ({ 
  onExport,
  customFormats = [],
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  const getPageContext = () => {
    const path = location.pathname;
    switch (path) {
      case '/file-upload-processing':
        return { title: 'File Upload', formats: ['csv', 'xlsx'] };
      case '/dashboard-overview':
        return { title: 'Dashboard Overview', formats: ['pdf', 'png', 'xlsx', 'csv'] };
      case '/brand-share-analysis':
        return { title: 'Brand Share Analysis', formats: ['pdf', 'xlsx', 'png', 'csv'] };
      case '/regional-sales-dashboard':
        return { title: 'Regional Sales Dashboard', formats: ['pdf', 'xlsx', 'png', 'csv'] };
      case '/wtd-distribution-analysis':
        return { title: 'WTD Distribution Analysis', formats: ['pdf', 'xlsx', 'csv'] };
      case '/reports-insights':
        return { title: 'Reports & Insights', formats: ['pdf', 'docx', 'xlsx', 'csv'] };
      default:
        return { title: 'Current Page', formats: ['pdf', 'csv'] };
    }
  };

  const pageContext = getPageContext();
  const availableFormats = customFormats?.length > 0 ? customFormats : pageContext?.formats;

  const exportFormats = [
    {
      key: 'pdf',
      label: 'PDF Report',
      description: 'Complete report with charts and tables',
      icon: 'FileText',
      color: 'text-red-600'
    },
    {
      key: 'xlsx',
      label: 'Excel Workbook',
      description: 'Spreadsheet with raw data and calculations',
      icon: 'FileSpreadsheet',
      color: 'text-green-600'
    },
    {
      key: 'csv',
      label: 'CSV Data',
      description: 'Raw data in comma-separated format',
      icon: 'Database',
      color: 'text-blue-600'
    },
    {
      key: 'png',
      label: 'PNG Image',
      description: 'High-resolution chart images',
      icon: 'Image',
      color: 'text-purple-600'
    },
    {
      key: 'docx',
      label: 'Word Document',
      description: 'Formatted report document',
      icon: 'FileText',
      color: 'text-blue-700'
    }
  ];

  const filteredFormats = exportFormats?.filter(format => 
    availableFormats?.includes(format?.key)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = async (format) => {
    setIsExporting(true);
    setIsOpen(false);
    
    try {
      if (onExport) {
        await onExport(format, pageContext?.title);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleMenu = () => {
    if (!disabled && !isExporting) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`} ref={menuRef}>
      {/* Export Options Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-card border border-border rounded-lg shadow-elevation animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Export {pageContext?.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">Choose your preferred format</p>
          </div>
          
          <div className="p-2 max-h-64 overflow-y-auto">
            {filteredFormats?.map((format) => (
              <button
                key={format?.key}
                onClick={() => handleExport(format?.key)}
                disabled={isExporting}
                className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon 
                  name={format?.icon} 
                  size={20} 
                  className={`flex-shrink-0 mt-0.5 ${format?.color}`} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{format?.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{format?.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              Exports include current filter selections
            </p>
          </div>
        </div>
      )}
      {/* Floating Action Button */}
      <Button
        variant={isOpen ? "secondary" : "default"}
        size="lg"
        onClick={toggleMenu}
        disabled={disabled}
        loading={isExporting}
        className="rounded-full shadow-elevation hover:shadow-lg transition-all duration-200 w-14 h-14"
        iconName={isOpen ? "X" : "Download"}
        iconSize={20}
      />
      {/* Export Status Indicator */}
      {isExporting && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full animate-pulse">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
        </div>
      )}
    </div>
  );
};

export default ExportActionMenu;