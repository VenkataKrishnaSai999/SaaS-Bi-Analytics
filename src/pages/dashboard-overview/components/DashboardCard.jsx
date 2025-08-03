import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DashboardCard = ({ 
  title, 
  description, 
  route, 
  icon, 
  chartType, 
  chartData, 
  keyMetrics, 
  trendIndicator,
  highlightBrand = false,
  className = ""
}) => {
  const renderChart = () => {
    if (!chartData || chartData?.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <Icon name="BarChart3" size={32} />
        </div>
      );
    }

    const colors = highlightBrand 
      ? ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']
      : ['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'];

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Bar dataKey="value" fill={highlightBrand ? '#2563EB' : '#64748B'} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={highlightBrand ? '#2563EB' : '#64748B'} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={50}
                dataKey="value"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <Icon name="TrendingUp" size={32} />
          </div>
        );
    }
  };

  const getTrendIcon = () => {
    if (!trendIndicator) return null;
    
    const { direction, value } = trendIndicator;
    const iconName = direction === 'up' ? 'TrendingUp' : direction === 'down' ? 'TrendingDown' : 'Minus';
    const colorClass = direction === 'up' ? 'text-success' : direction === 'down' ? 'text-error' : 'text-muted-foreground';
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon name={iconName} size={16} />
        <span className="text-sm font-medium">{value}</span>
      </div>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-soft hover:shadow-elevation transition-all duration-200 ${className}`}>
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              highlightBrand ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={icon} size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {getTrendIcon()}
        </div>

        {/* Key Metrics */}
        {keyMetrics && keyMetrics?.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {keyMetrics?.map((metric, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
                <p className="text-xs text-muted-foreground">{metric?.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Chart Area */}
      <div className="px-6 pb-4">
        {renderChart()}
      </div>
      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date()?.toLocaleDateString()}
          </span>
          <Link to={route}>
            <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;