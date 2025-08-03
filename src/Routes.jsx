import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FileUploadProcessing from './pages/file-upload-processing';
import DashboardOverview from './pages/dashboard-overview';
import ReportsInsights from './pages/reports-insights';
import BrandShareAnalysis from './pages/brand-share-analysis';
import WTDDistributionAnalysis from './pages/wtd-distribution-analysis';
import RegionalSalesDashboard from './pages/regional-sales-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BrandShareAnalysis />} />
        <Route path="/file-upload-processing" element={<FileUploadProcessing />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/reports-insights" element={<ReportsInsights />} />
        <Route path="/brand-share-analysis" element={<BrandShareAnalysis />} />
        <Route path="/wtd-distribution-analysis" element={<WTDDistributionAnalysis />} />
        <Route path="/regional-sales-dashboard" element={<RegionalSalesDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
