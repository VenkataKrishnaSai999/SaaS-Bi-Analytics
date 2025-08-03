import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProcessingConfigSidebar = ({ 
  config, 
  onConfigChange, 
  onStartProcessing, 
  canProcess, 
  isProcessing 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const cleaningOptions = [
    { 
      key: 'normalizeHeaders', 
      label: 'Normalize Headers', 
      description: 'Standardize column names and remove special characters',
      enabled: config?.cleaning?.normalizeHeaders ?? true
    },
    { 
      key: 'removeEmptyRows', 
      label: 'Remove Empty Rows', 
      description: 'Delete rows with no data or only whitespace',
      enabled: config?.cleaning?.removeEmptyRows ?? true
    },
    { 
      key: 'unmergeCells', 
      label: 'Unmerge Cells', 
      description: 'Split merged cells and duplicate values',
      enabled: config?.cleaning?.unmergeCells ?? true
    },
    { 
      key: 'standardizeFormats', 
      label: 'Standardize Formats', 
      description: 'Convert percentages and text to numeric values',
      enabled: config?.cleaning?.standardizeFormats ?? true
    }
  ];

  const transformationOptions = [
    { 
      key: 'unpivotRegional', 
      label: 'Unpivot Regional Data', 
      description: 'Transform regional columns into rows for analysis',
      enabled: config?.transformation?.unpivotRegional ?? true
    },
    { 
      key: 'unpivotWtd', 
      label: 'Unpivot WTD Data', 
      description: 'Transform WTD distribution data structure',
      enabled: config?.transformation?.unpivotWtd ?? true
    },
    { 
      key: 'calculatePercentages', 
      label: 'Calculate Percentages', 
      description: 'Compute market share and contribution percentages',
      enabled: config?.transformation?.calculatePercentages ?? true
    },
    { 
      key: 'generateRankings', 
      label: 'Generate Rankings', 
      description: 'Create brand and regional performance rankings',
      enabled: config?.transformation?.generateRankings ?? true
    }
  ];

  const outputFormatOptions = [
    { value: 'interactive', label: 'Interactive Dashboard' },
    { value: 'static', label: 'Static Reports' },
    { value: 'both', label: 'Dashboard + Reports' }
  ];

  const dashboardThemeOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'modern', label: 'Modern' },
    { value: 'minimal', label: 'Minimal' }
  ];

  const handleCleaningChange = (key, enabled) => {
    onConfigChange({
      ...config,
      cleaning: {
        ...config?.cleaning,
        [key]: enabled
      }
    });
  };

  const handleTransformationChange = (key, enabled) => {
    onConfigChange({
      ...config,
      transformation: {
        ...config?.transformation,
        [key]: enabled
      }
    });
  };

  const handleOutputFormatChange = (value) => {
    onConfigChange({
      ...config,
      outputFormat: value
    });
  };

  const handleThemeChange = (value) => {
    onConfigChange({
      ...config,
      dashboardTheme: value
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Processing Configuration</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </Button>
      </div>
      {/* Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 space-y-6">
          {/* Data Cleaning Options */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Sparkles" size={16} className="mr-2 text-primary" />
              Data Cleaning
            </h4>
            <div className="space-y-3">
              {cleaningOptions?.map((option) => (
                <Checkbox
                  key={option?.key}
                  label={option?.label}
                  description={option?.description}
                  checked={option?.enabled}
                  onChange={(e) => handleCleaningChange(option?.key, e?.target?.checked)}
                  disabled={isProcessing}
                />
              ))}
            </div>
          </div>

          {/* Data Transformation Options */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Shuffle" size={16} className="mr-2 text-primary" />
              Data Transformation
            </h4>
            <div className="space-y-3">
              {transformationOptions?.map((option) => (
                <Checkbox
                  key={option?.key}
                  label={option?.label}
                  description={option?.description}
                  checked={option?.enabled}
                  onChange={(e) => handleTransformationChange(option?.key, e?.target?.checked)}
                  disabled={isProcessing}
                />
              ))}
            </div>
          </div>

          {/* Output Configuration */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Settings" size={16} className="mr-2 text-primary" />
              Output Configuration
            </h4>
            <div className="space-y-4">
              <Select
                label="Output Format"
                options={outputFormatOptions}
                value={config?.outputFormat || 'interactive'}
                onChange={handleOutputFormatChange}
                disabled={isProcessing}
              />
              
              <Select
                label="Dashboard Theme"
                options={dashboardThemeOptions}
                value={config?.dashboardTheme || 'professional'}
                onChange={handleThemeChange}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Processing Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <h5 className="text-xs font-medium text-foreground mb-2">Processing Summary</h5>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Cleaning steps:</span>
                <span>{cleaningOptions?.filter(opt => opt?.enabled)?.length}/4</span>
              </div>
              <div className="flex justify-between">
                <span>Transformation steps:</span>
                <span>{transformationOptions?.filter(opt => opt?.enabled)?.length}/4</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated time:</span>
                <span>2-5 minutes</span>
              </div>
            </div>
          </div>

          {/* Process Button */}
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={onStartProcessing}
            disabled={!canProcess || isProcessing}
            loading={isProcessing}
            iconName="Play"
            iconPosition="left"
          >
            {isProcessing ? 'Processing Data...' : 'Start Processing'}
          </Button>

          {!canProcess && (
            <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-warning">Cannot Process</p>
                <p className="text-xs text-warning/80 mt-1">
                  Please upload a valid Excel file with required sheets before processing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingConfigSidebar;