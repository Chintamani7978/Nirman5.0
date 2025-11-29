import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MinistryLayout from "./pages/ministry/MinistryLayout";
import MinistryLogin from "./pages/ministry/MinistryLogin";
import MinistryDashboard from "./pages/ministry/MinistryDashboard";
import MinistryProblemsPage from "./pages/ministry/problems";
import MinistryAnalyticsPage from "./pages/ministry/analytics";
import MinistryReportsPage from "./pages/ministry/reports";
import MinistryMapPage from "./pages/ministry/maps";
import SuspenseLoader from "@/components/SuspenseLoader";
import ProblemDetail from "./pages/ProblemDetail";
import ProtectedRoute from "@/components/ProtectedRoute";
import MinistryRoute from "@/components/MinistryRoute";
import MinistryDashboardPage from "./pages/MinistryDashboard";

// Lazy load ministry pages
const MinistryAuditPage = React.lazy(() => import("./pages/ministry/audit"));

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <React.Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problem/:id" element={<ProblemDetail />} />
          </Route>

          {/* Protected Ministry Route */}
          <Route element={<MinistryRoute />}>
            <Route path="/ministry-dashboard" element={<MinistryDashboardPage />} />
          </Route>

          {/* Ministry Routes */}
          <Route path="/ministry/login" element={<MinistryLogin />} />
          <Route path="/ministry" element={<MinistryLayout />}>
            <Route path="dashboard" element={<MinistryDashboard />} />
            <Route path="problems" element={<MinistryProblemsPage />} />
            <Route path="analytics" element={<MinistryAnalyticsPage />} />
            <Route path="reports" element={<MinistryReportsPage />} />
            <Route path="map" element={<MinistryMapPage />} />
            <Route path="audit" element={<MinistryAuditPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
