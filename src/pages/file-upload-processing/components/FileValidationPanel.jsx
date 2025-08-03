import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileValidationPanel = ({ validationResults, onPreviewSheet }) => {
  const [expandedSheet, setExpandedSheet] = useState(null);

  if (!validationResults) {
    return null;
  }

  const { isValid, sheets, errors, warnings } = validationResults;

  const toggleSheetExpansion = (sheetName) => {
    setExpandedSheet(expandedSheet === sheetName ? null : sheetName);
  };

  const getSheetStatusIcon = (sheet) => {
    if (sheet?.errors?.length > 0) return { name: 'XCircle', color: 'var(--color-error)' };
    if (sheet?.warnings?.length > 0) return { name: 'AlertTriangle', color: 'var(--color-warning)' };
    return { name: 'CheckCircle', color: 'var(--color-success)' };
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">File Validation Results</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            isValid 
              ? 'bg-success/10 text-success' :'bg-error/10 text-error'
          }`}>
            <Icon 
              name={isValid ? 'CheckCircle' : 'XCircle'} 
              size={16} 
              color={isValid ? 'var(--color-success)' : 'var(--color-error)'} 
            />
            <span>{isValid ? 'Valid' : 'Invalid'}</span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Global Errors */}
        {errors?.length > 0 && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="XCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-error">File Errors</h4>
                <ul className="text-sm text-error/80 mt-1 space-y-1">
                  {errors?.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Global Warnings */}
        {warnings?.length > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-warning">File Warnings</h4>
                <ul className="text-sm text-warning/80 mt-1 space-y-1">
                  {warnings?.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Sheet Validation Results */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Sheet Analysis</h4>
          {sheets?.map((sheet) => {
            const statusIcon = getSheetStatusIcon(sheet);
            const isExpanded = expandedSheet === sheet?.name;

            return (
              <div key={sheet?.name} className="border border-border rounded-lg">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-smooth"
                  onClick={() => toggleSheetExpansion(sheet?.name)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={statusIcon?.name} size={20} color={statusIcon?.color} />
                    <div>
                      <h5 className="text-sm font-medium text-foreground">{sheet?.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        {sheet?.rowCount} rows, {sheet?.columnCount} columns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {sheet?.matchedColumns > 0 && (
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                        {sheet?.matchedColumns} matched
                      </span>
                    )}
                    <Icon 
                      name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-border p-3 bg-muted/25">
                    <div className="space-y-3">
                      {/* Column Matching */}
                      <div>
                        <h6 className="text-xs font-medium text-foreground mb-2">Column Matching</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {sheet?.expectedColumns?.map((col, index) => {
                            const isMatched = sheet?.detectedColumns?.includes(col);
                            return (
                              <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                                isMatched ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                              }`}>
                                <Icon 
                                  name={isMatched ? 'Check' : 'X'} 
                                  size={12} 
                                  color={isMatched ? 'var(--color-success)' : 'var(--color-error)'} 
                                />
                                <span>{col}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sheet-specific Issues */}
                      {(sheet?.errors?.length > 0 || sheet?.warnings?.length > 0) && (
                        <div className="space-y-2">
                          {sheet?.errors?.length > 0 && (
                            <div>
                              <h6 className="text-xs font-medium text-error mb-1">Errors</h6>
                              <ul className="text-xs text-error/80 space-y-1">
                                {sheet?.errors?.map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {sheet?.warnings?.length > 0 && (
                            <div>
                              <h6 className="text-xs font-medium text-warning mb-1">Warnings</h6>
                              <ul className="text-xs text-warning/80 space-y-1">
                                {sheet?.warnings?.map((warning, index) => (
                                  <li key={index}>• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Preview Button */}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onPreviewSheet(sheet?.name);
                          }}
                          iconName="Eye"
                          iconPosition="left"
                        >
                          Preview Data
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileValidationPanel;