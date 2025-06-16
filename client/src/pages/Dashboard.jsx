import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import PhotoGrid from "../components/dashboard/PhotoGrid";
import Favorites from "../components/dashboard/Favorites";
import QuoteHistory from "../components/dashboard/QuoteHistory";
import Settings from "../components/dashboard/Settings";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const verifySession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/client-login');
    } else {
      const { data: userData, error } = await supabase.auth.getUser();

      if (error) {
        console.error('User fetch error:', error.message);
        navigate('/client-login');
      } else {
        setLoading(false);
      }
    }
  };

  verifySession();
}, []);


  if (loading) return null; // Or add a loading spinner

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
