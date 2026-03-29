import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ReportWaste from './pages/ReportWaste';
import LandingPage from './pages/LandingPage';
import ImpactAnalytics from './pages/ImpactAnalytics';
import CollectorHistory from './pages/CollectorHistory';
import UserHistory from './pages/UserHistory';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/report" element={<ReportWaste />} />
          <Route path="/impact" element={<ImpactAnalytics />} />
          <Route path="/history" element={<CollectorHistory />} />
          <Route path="/my-reports" element={<UserHistory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
