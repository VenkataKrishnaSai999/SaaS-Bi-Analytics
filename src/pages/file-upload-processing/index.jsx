import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import ExportActionMenu from '../../components/ui/ExportActionMenu';
import FileUploadZone from './components/FileUploadZone';
import FileValidationPanel from './components/FileValidationPanel';
import ProcessingConfigSidebar from './components/ProcessingConfigSidebar';
import DataPreviewModal from './components/DataPreviewModal';
import BrandSelectionModal from './components/BrandSelectionModal';
import { processExcelFile, generateComprehensiveAnalysis } from '../../utils/excelProcessor';
import { generateBusinessInsights } from '../../utils/geminiClient';

const FileUploadProcessing = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showBrandSelection, setShowBrandSelection] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [processingConfig, setProcessingConfig] = useState({
    cleaning: {
      normalizeHeaders: true,
      removeEmptyRows: true,
      unmergeCells: true,
      standardizeFormats: true
    },
    transformation: {
      unpivotRegional: true,
      unpivotWtd: true,
      calculatePercentages: true,
      generateRankings: true
    },
    outputFormat: 'interactive',
    dashboardTheme: 'professional'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [processingError, setProcessingError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    sheetName: null,
    data: null
  });

  // Validate Excel file structure
  const validateFile = async (file) => {
    try {
      const data = await processExcelFile(file);
      
      const validation = {
        isValid: true,
        sheets: [],
        errors: [],
        warnings: []
      };

      // Check for required sheet patterns
      const requiredPatterns = ['brand', 'regional', 'wtd', 'distribution'];
      const foundPatterns = [];
      
      Object.keys(data?.sheets)?.forEach(sheetName => {
        const lowerName = sheetName?.toLowerCase();
        const sheet = data?.sheets?.[sheetName];
        
        const sheetInfo = {
          name: sheetName,
          rowCount: sheet?.rowCount,
          columnCount: sheet?.columnCount,
          headers: sheet?.headers,
          errors: [],
          warnings: []
        };

        // Check for data
        if (sheet?.rowCount === 0) {
          sheetInfo?.errors?.push('Sheet contains no data rows');
          validation.isValid = false;
        }

        // Identify sheet type and validate structure
        if (lowerName?.includes('brand') && lowerName?.includes('share')) {
          foundPatterns?.push('brand');
          const brandCol = sheet?.headers?.find(h => h && h?.toString()?.toLowerCase()?.includes('brand'));
          if (!brandCol) {
            sheetInfo?.warnings?.push('No Brand column detected');
          }
        } else if (lowerName?.includes('regional') || lowerName?.includes('region')) {
          foundPatterns?.push('regional');
          const regionCol = sheet?.headers?.find(h => h && h?.toString()?.toLowerCase()?.includes('region'));
          if (!regionCol) {
            sheetInfo?.warnings?.push('No Region column detected');
          }
        } else if (lowerName?.includes('wtd') || lowerName?.includes('distribution')) {
          foundPatterns?.push('wtd');
          const distCol = sheet?.headers?.find(h => h && h?.toString()?.toLowerCase()?.includes('distribution'));
          if (!distCol) {
            sheetInfo?.warnings?.push('No Distribution column detected');
          }
        }

        validation?.sheets?.push(sheetInfo);
      });

      // Check if we have sufficient data types
      if (foundPatterns?.length < 2) {
        validation?.warnings?.push(
          'Consider including sheets with Brand Share, Regional, and Distribution data for comprehensive analysis'
        );
      }

      // Set available brands
      setAvailableBrands(data?.brands || []);
      setProcessedData(data);

      return validation;
    } catch (error) {
      return {
        isValid: false,
        sheets: [],
        errors: [error?.message],
        warnings: []
      };
    }
  };

  // Generate preview data from actual processed data
  const generatePreviewData = (sheetName) => {
    if (!processedData?.sheets?.[sheetName]) return null;
    
    const sheet = processedData?.sheets?.[sheetName];
    const previewRows = sheet?.rows?.slice(0, 5); // Show first 5 rows
    
    return {
      headers: sheet?.headers,
      rows: previewRows?.map(row => 
        row?.map(cell => 
          typeof cell === 'number' ? cell?.toLocaleString() : cell?.toString() || ''
        )
      ),
      totalRows: sheet?.rowCount
    };
  };

  // Handle file selection
  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setValidationResults(null);
    setProcessedData(null);
    setAvailableBrands([]);
    setSelectedBrand('');
    setProcessingError(null);
    
    if (file) {
      try {
        const validation = await validateFile(file);
        setValidationResults(validation);
      } catch (error) {
        setProcessingError(`File validation failed: ${error?.message}`);
      }
    }
  };

  // Handle sheet preview
  const handlePreviewSheet = (sheetName) => {
    const previewData = generatePreviewData(sheetName);
    setPreviewModal({
      isOpen: true,
      sheetName,
      data: previewData
    });
  };

  // Handle brand selection
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setShowBrandSelection(false);
    handleStartProcessing();
  };

  // Handle processing start
  const handleStartProcessing = async () => {
    if (!selectedBrand && availableBrands?.length > 0) {
      setShowBrandSelection(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);
    setProcessingError(null);
    setEstimatedTime('2-3 minutes');

    try {
      // Step 1: Analyze Data
      setProcessingStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analysis = generateComprehensiveAnalysis(processedData, selectedBrand || 'SUNBULAH');
      setAnalysisResults(analysis);
      
      // Step 2: Generate AI Insights
      setProcessingStep(2);
      setEstimatedTime('1-2 minutes');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const insights = await generateBusinessInsights(analysis, selectedBrand || 'SUNBULAH');
        analysis.aiInsights = insights;
        setAnalysisResults(analysis);
      } catch (aiError) {
        console.warn('AI insights generation failed:', aiError);
        analysis.aiInsights = 'AI insights generation is currently unavailable. Please check your API configuration.';
      }

      // Step 3: Prepare Visualizations
      setProcessingStep(3);
      setEstimatedTime('30 seconds');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Complete
      setProcessingStep(4);
      setEstimatedTime('Finalizing...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store results in localStorage for dashboard access
      localStorage.setItem('analysisResults', JSON.stringify(analysis));
      localStorage.setItem('selectedBrand', selectedBrand || 'SUNBULAH');
      
      // Navigate to dashboard
      navigate('/dashboard-overview');
    } catch (error) {
      setProcessingError(`Processing failed: ${error?.message}`);
      setIsProcessing(false);
    }
  };

  // Handle export
  const handleExport = async (format, title) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Exporting ${title} as ${format}`);
  };

  const canProcess = selectedFile && validationResults?.isValid && !isProcessing;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">File Upload & Processing</h1>
            <p className="text-muted-foreground">
              Upload your Excel file to automatically generate AI-powered business intelligence dashboards
            </p>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="mb-8">
              <ProgressIndicator
                currentStep={processingStep}
                totalSteps={4}
                isProcessing={isProcessing}
                error={processingError}
                estimatedTime={estimatedTime}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload and Validation */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload Zone */}
              <FileUploadZone
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
                acceptedFile={selectedFile}
              />

              {/* File Validation Panel */}
              {validationResults && (
                <FileValidationPanel
                  validationResults={validationResults}
                  onPreviewSheet={handlePreviewSheet}
                />
              )}

              {/* Brand Selection Status */}
              {availableBrands?.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">Detected Brands</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableBrands?.slice(0, 8)?.map((brand, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border"
                      >
                        {brand}
                      </span>
                    ))}
                    {availableBrands?.length > 8 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{availableBrands?.length - 8} more
                      </span>
                    )}
                  </div>
                  {selectedBrand && (
                    <p className="text-sm text-success mt-2">
                      Selected focus brand: <strong>{selectedBrand}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Processing Configuration */}
            <div className="lg:col-span-1">
              <ProcessingConfigSidebar
                config={processingConfig}
                onConfigChange={setProcessingConfig}
                onStartProcessing={handleStartProcessing}
                canProcess={canProcess}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Getting Started Instructions */}
          {!selectedFile && (
            <div className="mt-12 bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Getting Started</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Upload Excel File</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload your Excel file with business data. Supports multiple sheets for comprehensive analysis.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Select Your Brand</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose your brand from detected companies to focus the analysis and competitive comparison.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">AI-Powered Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Get automated insights powered by Gemini AI, with interactive dashboards and actionable recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Brand Selection Modal */}
      <BrandSelectionModal
        isOpen={showBrandSelection}
        onClose={() => setShowBrandSelection(false)}
        brands={availableBrands}
        onBrandSelect={handleBrandSelect}
        isProcessing={isProcessing}
      />
      {/* Data Preview Modal */}
      <DataPreviewModal
        isOpen={previewModal?.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, sheetName: null, data: null })}
        sheetName={previewModal?.sheetName}
        previewData={previewModal?.data}
      />
      {/* Export Action Menu */}
      <ExportActionMenu
        onExport={handleExport}
        disabled={!selectedFile}
      />
    </div>
  );
};

export default FileUploadProcessing;