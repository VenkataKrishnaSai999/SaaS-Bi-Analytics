import React from 'react';
import Icon from '../../../components/AppIcon';

const SunbulahHighlight = ({ analysisResults, selectedBrand = 'SUNBULAH' }) => {
  const brandName = selectedBrand || 'SUNBULAH';
  
  // Generate highlight metrics from analysis
  const generateHighlights = () => {
    if (!analysisResults) {
      return {
        marketPosition: 'Upload data to see market position',
        keyStrength: 'Upload data to analyze strengths',
        opportunity: 'Upload data to identify opportunities',
        recommendation: 'Upload data for AI recommendations'
      };
    }

    const highlights = {};

    // Market Position
    if (analysisResults?.brandShare?.focusBrandRank) {
      const rank = analysisResults?.brandShare?.focusBrandRank;
      const share = analysisResults?.brandShare?.focusBrand?.share || 0;
      highlights.marketPosition = `Ranked #${rank} with ${share?.toFixed(1)}% market share`;
    }

    // Key Strength
    if (analysisResults?.regional?.topRegions) {
      const topRegion = analysisResults?.regional?.topRegions?.[0];
      if (topRegion) {
        highlights.keyStrength = `Dominant in ${topRegion?.region} region with ${topRegion?.marketShare?.toFixed(1)}% share`;
      }
    }

    // Growth Opportunity
    if (analysisResults?.wtdDistribution?.channelPerformance) {
      const lowestChannel = analysisResults?.wtdDistribution?.channelPerformance?.sort((a, b) => a?.focusBrandAvgDistribution - b?.focusBrandAvgDistribution)?.[0];
      if (lowestChannel) {
        highlights.opportunity = `Growth potential in ${lowestChannel?.channel} channel (${lowestChannel?.focusBrandAvgDistribution?.toFixed(1)}% current distribution)`;
      }
    }

    // AI Recommendation
    if (analysisResults?.brandShare && analysisResults?.regional) {
      const marketShare = analysisResults?.brandShare?.focusBrand?.share || 0;
      if (marketShare < 30) {
        highlights.recommendation = 'Focus on market share expansion through regional penetration and channel optimization';
      } else {
        highlights.recommendation = 'Maintain market leadership while exploring new product categories';
      }
    }

    return highlights;
  };

  const highlights = generateHighlights();

  const highlightCards = [
    {
      title: 'Market Position',
      content: highlights?.marketPosition,
      icon: 'Trophy',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      title: 'Key Strength',
      content: highlights?.keyStrength,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Growth Opportunity',
      content: highlights?.opportunity,
      icon: 'Target',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'AI Recommendation',
      content: highlights?.recommendation,
      icon: 'Lightbulb',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {brandName?.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{brandName} Highlights</h2>
          <p className="text-sm text-muted-foreground">
            Key insights and strategic focus areas
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlightCards?.map((card, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${card?.bgColor} ${card?.borderColor}`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={card?.icon} size={16} className={card?.color} />
              <span className="text-sm font-medium text-foreground">
                {card?.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {card?.content}
            </p>
          </div>
        ))}
      </div>
      {!analysisResults && (
        <div className="mt-4 p-4 bg-muted/30 border border-border/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>
              Upload your Excel data to see personalized insights for {brandName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunbulahHighlight;