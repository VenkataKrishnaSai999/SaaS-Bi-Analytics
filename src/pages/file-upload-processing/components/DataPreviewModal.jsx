import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DataPreviewModal = ({ isOpen, onClose, sheetName, previewData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  if (!isOpen || !previewData) return null;

  const { headers, rows, totalRows } = previewData;
  const totalPages = Math.ceil(rows?.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = rows?.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg shadow-elevation w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
            <p className="text-sm text-muted-foreground">{sheetName} - {totalRows} total rows</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground border-r border-border">
                    #
                  </th>
                  {headers?.map((header, index) => (
                    <th 
                      key={index} 
                      className="px-3 py-2 text-left text-xs font-medium text-muted-foreground border-r border-border last:border-r-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows?.map((row, rowIndex) => (
                  <tr key={startIndex + rowIndex} className="border-t border-border hover:bg-muted/50">
                    <td className="px-3 py-2 text-xs text-muted-foreground border-r border-border">
                      {startIndex + rowIndex + 1}
                    </td>
                    {row?.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        className="px-3 py-2 text-xs text-foreground border-r border-border last:border-r-0"
                        title={String(cell)}
                      >
                        <div className="max-w-32 truncate">
                          {cell !== null && cell !== undefined ? String(cell) : ''}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, rows?.length)} of {rows?.length} rows
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageIndex = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageIndex}
                    variant={pageIndex === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageIndex)}
                    className="w-8 h-8"
                  >
                    {pageIndex + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreviewModal;