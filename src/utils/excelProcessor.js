import * as XLSX from 'xlsx';

/**
 * Process Excel file and extract data from all sheets
 * @param {File} file - The Excel file to process
 * @returns {Promise<Object>} Processed data from all sheets
 */
export const processExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const processedData = {
          sheets: {},
          brands: new Set(),
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            processedAt: new Date().toISOString(),
            sheetNames: workbook.SheetNames
          }
        };

        // Process each sheet
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length > 0) {
            const headers = jsonData[0];
            const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
            
            processedData.sheets[sheetName] = {
              headers,
              rows,
              rowCount: rows.length,
              columnCount: headers.length
            };

            // Extract brand names from Brand column if exists
            const brandColumnIndex = headers.findIndex(header => 
              header && header.toString().toLowerCase().includes('brand')
            );
            
            if (brandColumnIndex !== -1) {
              rows.forEach(row => {
                if (row[brandColumnIndex]) {
                  processedData.brands.add(row[brandColumnIndex].toString().trim());
                }
              });
            }
          }
        });

        // Convert brands Set to Array
        processedData.brands = Array.from(processedData.brands);
        
        resolve(processedData);
      } catch (error) {
        reject(new Error(`Failed to process Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Analyze brand share data
 * @param {Object} sheetData - Brand share sheet data
 * @param {string} focusBrand - Brand to focus analysis on
 * @returns {Object} Analyzed brand share data
 */
export const analyzeBrandShareData = (sheetData, focusBrand) => {
  if (!sheetData || !sheetData?.rows) return null;

  const { headers, rows } = sheetData;
  const brandIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('brand'));
  const volumeIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('volume'));
  const valueIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('value'));
  const shareIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('share'));

  if (brandIndex === -1) return null;

  const brandData = rows?.map(row => ({
    brand: row?.[brandIndex]?.toString()?.trim(),
    volume: volumeIndex !== -1 ? parseFloat(row?.[volumeIndex]?.toString()?.replace(/[^\d.-]/g, '')) || 0 : 0,
    value: valueIndex !== -1 ? parseFloat(row?.[valueIndex]?.toString()?.replace(/[^\d.-]/g, '')) || 0 : 0,
    share: shareIndex !== -1 ? parseFloat(row?.[shareIndex]?.toString()?.replace(/[^\d.-]/g, '')) || 0 : 0
  }))?.filter(item => item?.brand);

  // Calculate market share if not provided
  if (shareIndex === -1 && volumeIndex !== -1) {
    const totalVolume = brandData?.reduce((sum, item) => sum + item?.volume, 0);
    brandData?.forEach(item => {
      item.share = totalVolume > 0 ? (item?.volume / totalVolume) * 100 : 0;
    });
  }

  // Sort by share/volume descending
  brandData?.sort((a, b) => (b?.share || b?.volume) - (a?.share || a?.volume));

  const focusBrandData = brandData?.find(item => 
    item?.brand?.toLowerCase()?.includes(focusBrand?.toLowerCase())
  );

  const competitors = brandData?.filter(item => 
    !item?.brand?.toLowerCase()?.includes(focusBrand?.toLowerCase())
  )?.slice(0, 5); // Top 5 competitors

  return {
    allBrands: brandData,
    focusBrand: focusBrandData,
    competitors,
    totalMarketShare: brandData?.reduce((sum, item) => sum + item?.share, 0),
    focusBrandRank: brandData?.findIndex(item => 
      item?.brand?.toLowerCase()?.includes(focusBrand?.toLowerCase())
    ) + 1
  };
};

/**
 * Analyze regional data
 * @param {Object} sheetData - Regional sheet data
 * @param {string} focusBrand - Brand to focus analysis on
 * @returns {Object} Analyzed regional data
 */
export const analyzeRegionalData = (sheetData, focusBrand) => {
  if (!sheetData || !sheetData?.rows) return null;

  const { headers, rows } = sheetData;
  const regionIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('region'));
  const brandIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('brand'));

  if (regionIndex === -1) return null;

  // Find quarter/period columns
  const periodColumns = headers?.map((header, index) => ({
    index,
    header: header?.toString(),
    isPeriod: header && (
      header?.toString()?.toLowerCase()?.includes('q') ||
      header?.toString()?.toLowerCase()?.includes('sales') ||
      header?.toString()?.toLowerCase()?.includes('revenue')
    )
  }))?.filter(col => col?.isPeriod);

  const regionalData = {};
  
  rows?.forEach(row => {
    const region = row?.[regionIndex]?.toString()?.trim();
    const brand = brandIndex !== -1 ? row?.[brandIndex]?.toString()?.trim() : '';
    
    if (!region) return;

    if (!regionalData?.[region]) {
      regionalData[region] = { brands: {}, total: 0 };
    }

    periodColumns?.forEach(col => {
      const value = parseFloat(row?.[col?.index]?.toString()?.replace(/[^\d.-]/g, '')) || 0;
      
      if (!regionalData?.[region]?.brands?.[brand]) {
        regionalData[region].brands[brand] = 0;
      }
      
      regionalData[region].brands[brand] += value;
      regionalData[region].total += value;
    });
  });

  // Process for focus brand
  const focusBrandRegional = Object.entries(regionalData)?.map(([region, data]) => ({
    region,
    focusBrandValue: data?.brands?.[focusBrand] || 0,
    totalValue: data?.total,
    marketShare: data?.total > 0 ? ((data?.brands?.[focusBrand] || 0) / data?.total) * 100 : 0,
    competitors: Object.entries(data?.brands)?.filter(([brand]) => brand !== focusBrand)?.map(([brand, value]) => ({ brand, value }))?.sort((a, b) => b?.value - a?.value)?.slice(0, 3)
  }))?.sort((a, b) => b?.focusBrandValue - a?.focusBrandValue);

  return {
    regionalBreakdown: focusBrandRegional,
    topRegions: focusBrandRegional?.slice(0, 5),
    totalRegions: Object.keys(regionalData)?.length
  };
};

/**
 * Analyze WTD distribution data
 * @param {Object} sheetData - WTD distribution sheet data
 * @param {string} focusBrand - Brand to focus analysis on
 * @returns {Object} Analyzed distribution data
 */
export const analyzeWTDData = (sheetData, focusBrand) => {
  if (!sheetData || !sheetData?.rows) return null;

  const { headers, rows } = sheetData;
  const productIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('product'));
  const channelIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('channel'));
  const distributionIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('distribution'));
  const availabilityIndex = headers?.findIndex(h => h && h?.toString()?.toLowerCase()?.includes('availability'));

  const distributionData = rows?.map(row => ({
    product: productIndex !== -1 ? row?.[productIndex]?.toString()?.trim() : '',
    channel: channelIndex !== -1 ? row?.[channelIndex]?.toString()?.trim() : '',
    distribution: distributionIndex !== -1 ? parseFloat(row?.[distributionIndex]?.toString()?.replace(/[^\d.-]/g, '')) || 0 : 0,
    availability: availabilityIndex !== -1 ? parseFloat(row?.[availabilityIndex]?.toString()?.replace(/[^\d.-]/g, '')) || 0 : 0
  }))?.filter(item => item?.product || item?.channel);

  // Filter for focus brand products
  const focusBrandProducts = distributionData?.filter(item =>
    item?.product?.toLowerCase()?.includes(focusBrand?.toLowerCase())
  );

  // Analyze by channel
  const channelAnalysis = {};
  distributionData?.forEach(item => {
    if (!item?.channel) return;
    
    if (!channelAnalysis?.[item?.channel]) {
      channelAnalysis[item.channel] = {
        totalDistribution: 0,
        totalAvailability: 0,
        focusBrandDistribution: 0,
        focusBrandAvailability: 0,
        productCount: 0,
        focusBrandProductCount: 0
      };
    }

    channelAnalysis[item.channel].totalDistribution += item?.distribution;
    channelAnalysis[item.channel].totalAvailability += item?.availability;
    channelAnalysis[item.channel].productCount += 1;

    if (item?.product?.toLowerCase()?.includes(focusBrand?.toLowerCase())) {
      channelAnalysis[item.channel].focusBrandDistribution += item?.distribution;
      channelAnalysis[item.channel].focusBrandAvailability += item?.availability;
      channelAnalysis[item.channel].focusBrandProductCount += 1;
    }
  });

  // Calculate averages
  Object.values(channelAnalysis)?.forEach(channel => {
    channel.avgDistribution = channel?.productCount > 0 ? channel?.totalDistribution / channel?.productCount : 0;
    channel.avgAvailability = channel?.productCount > 0 ? channel?.totalAvailability / channel?.productCount : 0;
    channel.focusBrandAvgDistribution = channel?.focusBrandProductCount > 0 ? channel?.focusBrandDistribution / channel?.focusBrandProductCount : 0;
    channel.focusBrandAvgAvailability = channel?.focusBrandProductCount > 0 ? channel?.focusBrandAvailability / channel?.focusBrandProductCount : 0;
  });

  return {
    channelAnalysis,
    focusBrandProducts,
    totalProducts: distributionData?.length,
    channelPerformance: Object.entries(channelAnalysis)?.map(([channel, data]) => ({
        channel,
        ...data
      }))?.sort((a, b) => b?.focusBrandAvgDistribution - a?.focusBrandAvgDistribution)
  };
};

/**
 * Generate comprehensive analysis from all sheets
 * @param {Object} processedData - All processed sheet data
 * @param {string} focusBrand - Brand to focus analysis on
 * @returns {Object} Comprehensive analysis results
 */
export const generateComprehensiveAnalysis = (processedData, focusBrand) => {
  const analysis = {
    focusBrand,
    timestamp: new Date()?.toISOString(),
    metadata: processedData?.metadata
  };

  // Analyze each sheet type
  Object.entries(processedData?.sheets)?.forEach(([sheetName, sheetData]) => {
    const lowerSheetName = sheetName?.toLowerCase();
    
    if (lowerSheetName?.includes('brand') && lowerSheetName?.includes('share')) {
      analysis.brandShare = analyzeBrandShareData(sheetData, focusBrand);
    } else if (lowerSheetName?.includes('regional') || lowerSheetName?.includes('region')) {
      analysis.regional = analyzeRegionalData(sheetData, focusBrand);
    } else if (lowerSheetName?.includes('wtd') || lowerSheetName?.includes('distribution')) {
      analysis.wtdDistribution = analyzeWTDData(sheetData, focusBrand);
    }
  });

  return analysis;
};