import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BrandSelectionModal = ({ 
  isOpen, 
  onClose, 
  brands = [], 
  onBrandSelect, 
  isProcessing 
}) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands?.filter(brand =>
    brand?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedBrand && onBrandSelect) {
      onBrandSelect(selectedBrand);
    }
  };

  const handleCancel = () => {
    setSelectedBrand('');
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Select Your Brand</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the brand you want to focus your analysis on
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isProcessing}
              iconName="X"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isProcessing}
            />
          </div>

          {/* Brand List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredBrands?.length > 0 ? (
              filteredBrands?.map((brand, index) => (
                <label
                  key={index}
                  className={`
                    flex items-center p-3 rounded-lg border cursor-pointer transition-all
                    ${selectedBrand === brand
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                    ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={selectedBrand === brand}
                    onChange={(e) => setSelectedBrand(e?.target?.value)}
                    className="sr-only"
                    disabled={isProcessing}
                  />
                  <div className={`
                    w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                    ${selectedBrand === brand
                      ? 'border-primary bg-primary' :'border-border'
                    }
                  `}>
                    {selectedBrand === brand && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium">{brand}</span>
                </label>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No brands found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

          {brands?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="AlertCircle" size={32} className="mx-auto mb-2 opacity-50" />
              <p>No brands detected in the uploaded file</p>
              <p className="text-xs mt-1">Make sure your file contains a 'Brand' column</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {filteredBrands?.length} brand{filteredBrands?.length !== 1 ? 's' : ''} available
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!selectedBrand || isProcessing}
                iconName={isProcessing ? "Loader2" : "ArrowRight"}
                iconPosition="right"
                className={isProcessing ? "animate-spin" : ""}
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSelectionModal;