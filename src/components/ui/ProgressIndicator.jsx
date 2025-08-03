import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  steps = [
    { label: 'Upload File', description: 'Select and upload your data file' },
    { label: 'Validate Data', description: 'Checking data format and structure' },
    { label: 'Process Data', description: 'Cleaning and transforming data' },
    { label: 'Generate Dashboard', description: 'Creating visualizations and insights' }
  ],
  isProcessing = false,
  error = null,
  estimatedTime = null
}) => {
  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (error && stepNumber === currentStep) return 'error';
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return isProcessing ? 'processing' : 'current';
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="Check" size={16} color="white" />;
      case 'processing':
        return <Icon name="Loader2" size={16} color="white" className="animate-spin" />;
      case 'error':
        return <Icon name="X" size={16} color="white" />;
      case 'current':
        return <Icon name="Circle" size={16} color="white" />;
      default:
        return <Icon name="Circle" size={16} color="currentColor" />;
    }
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success border-success text-success-foreground';
      case 'processing':
        return 'bg-primary border-primary text-primary-foreground animate-pulse';
      case 'error':
        return 'bg-error border-error text-error-foreground';
      case 'current':
        return 'bg-primary border-primary text-primary-foreground';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getConnectorStyles = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber < currentStep) return 'bg-success';
    if (error && stepNumber === currentStep) return 'bg-error';
    return 'bg-border';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Processing Your Data
        </h3>
        {estimatedTime && (
          <p className="text-sm text-muted-foreground">
            Estimated time remaining: {estimatedTime}
          </p>
        )}
      </div>
      {/* Desktop Progress Steps */}
      <div className="hidden md:flex items-center justify-between relative">
        {steps?.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps?.length - 1;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth
                    ${getStepStyles(status)}
                  `}
                >
                  {getStepIcon(status)}
                </div>
                
                {/* Step Content */}
                <div className="mt-3 text-center max-w-32">
                  <p className={`text-sm font-medium ${
                    status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {step?.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">
                    {step?.description}
                  </p>
                </div>
              </div>
              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div className={`h-0.5 transition-smooth ${getConnectorStyles(index)}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile Progress Steps */}
      <div className="md:hidden space-y-4">
        {steps?.map((step, index) => {
          const status = getStepStatus(index);

          return (
            <div key={index} className="flex items-start space-x-4">
              {/* Step Circle */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-smooth flex-shrink-0
                  ${getStepStyles(status)}
                `}
              >
                {getStepIcon(status)}
              </div>
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {step?.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-error">Processing Error</p>
              <p className="text-sm text-error/80 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              error ? 'bg-error' : 'bg-primary'
            }`}
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;