import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import PhotoGrid from "../components/dashboard/PhotoGrid";
import Favorites from "../components/dashboard/Favorites";
import QuoteHistory from "../components/dashboard/QuoteHistory";
import Settings from "../components/dashboard/Settings";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="gallery" replace />} />
        <Route path="gallery" element={<PhotoGrid />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="quotes" element={<QuoteHistory />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
