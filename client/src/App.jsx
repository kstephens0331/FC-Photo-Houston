import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Customer Dashboard Pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import ClientGallery from "./pages/ClientGallery";
import Favorites from "./components/dashboard/Favorites";
import Quotes from "./components/dashboard/Quotes";
import Settings from "./components/dashboard/Settings";
// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ClientLogin from './pages/ClientLogin';
import CustomerRegistration from './pages/CustomerRegistration';
import RegisterComplete from './pages/RegisterComplete';
import PostLoginRedirect from './pages/PostLoginRedirect';
import NotFound from './pages/NotFound';

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomer from './pages/admin/AdminCustomer';

// 🔐 Admin Auth Wrapper
const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email === "astephens@fcphotohouston.com") {
        setUser(data.user);
      }
      setChecking(false);
    });
  }, []);

  if (checking) return <div className="p-6">Checking admin auth...</div>;
  return user ? children : <Navigate to="/" replace />;
};

// 🔐 Customer Auth Wrapper
const CustomerRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
      setChecking(false);
    });
  }, []);

  if (checking) return <div className="p-6">Checking login...</div>;
  return user ? children : <Navigate to="/client-login" replace />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* 🌐 Public */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<ClientGallery />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/register" element={<CustomerRegistration />} />
          <Route path="/register-complete" element={<RegisterComplete />} />
          <Route path="/post-login" element={<PostLoginRedirect />} />

          {/* 🔐 Customer Dashboard */}
          <Route
  path="/dashboard"
  element={
    <CustomerRoute>
      <DashboardLayout />
    </CustomerRoute>
  }
>
  <Route path="gallery" element={<ClientGallery />} />
  <Route path="favorites" element={<Favorites />} />
  <Route path="quotes" element={<Quotes />} />
  <Route path="settings" element={<Settings />} />
</Route>

          {/* 🔐 Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customer/:id"
            element={
              <AdminRoute>
                <AdminCustomer />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
