import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ 
  customItems = null,
  showHome = true,
  separator = "ChevronRight",
  className = ""
}) => {
  const location = useLocation();

  const routeMap = {
    '/dashboard-overview': { label: 'Dashboard Overview', icon: 'BarChart3' },
    '/file-upload-processing': { label: 'File Upload & Processing', icon: 'Upload' },
    '/brand-share-analysis': { label: 'Brand Share Analysis', icon: 'TrendingUp' },
    '/regional-sales-dashboard': { label: 'Regional Sales Dashboard', icon: 'Map' },
    '/wtd-distribution-analysis': { label: 'WTD Distribution Analysis', icon: 'Package' },
    '/reports-insights': { label: 'Reports & Insights', icon: 'FileText' }
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [];

    if (showHome && location.pathname !== '/dashboard-overview') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/dashboard-overview',
        icon: 'Home'
      });
    }

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap?.[currentPath];
      
      if (routeInfo) {
        breadcrumbs?.push({
          label: routeInfo?.label,
          path: currentPath,
          icon: routeInfo?.icon,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs?.map((item, index) => (
          <li key={item?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name={separator} 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            {item?.isLast ? (
              <span className="flex items-center space-x-2 text-foreground font-medium">
                {item?.icon && (
                  <Icon name={item?.icon} size={16} className="text-primary" />
                )}
                <span>{item?.label}</span>
              </span>
            ) : (
              <Link
                to={item?.path}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth"
              >
                {item?.icon && (
                  <Icon name={item?.icon} size={16} />
                )}
                <span>{item?.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;