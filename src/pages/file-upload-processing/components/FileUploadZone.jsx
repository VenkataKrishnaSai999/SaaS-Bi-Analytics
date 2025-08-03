import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FileUploadZone = ({ onFileSelect, isProcessing, acceptedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const excelFile = files?.find(file => 
      file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file?.type === 'application/vnd.ms-excel'|| file?.name?.endsWith('.xlsx') ||
      file?.name?.endsWith('.xls')
    );
    
    if (excelFile) {
      onFileSelect(excelFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : acceptedFile 
              ? 'border-success bg-success/5' :'border-border hover:border-primary hover:bg-muted/50'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        {acceptedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-success/10 rounded-full">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">File Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">{acceptedFile?.name}</p>
              <p className="text-xs text-muted-foreground">
                {(acceptedFile?.size / 1024 / 1024)?.toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onFileSelect(null);
              }}
              iconName="X"
              iconPosition="left"
              disabled={isProcessing}
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
              <Icon name="Upload" size={32} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {isDragOver ? 'Drop your Excel file here' : 'Upload Excel File'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Drag and drop your Excel file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports .xlsx and .xls files up to 50MB
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Brand_Share_Cleaned</span>
              <span className="px-2 py-1 bg-muted rounded">Regional_Cleaned</span>
              <span className="px-2 py-1 bg-muted rounded">Wtd_Dist_Cleaned</span>
            </div>
          </div>
        )}
        
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-primary font-medium">Drop file to upload</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;