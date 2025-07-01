import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

// Customer Dashboard Pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import ClientGallery from "./pages/ClientGallery";
import Favorites from "./components/dashboard/Favorites";
import Quotes from "./components/dashboard/Quotes";
import Settings from "./components/dashboard/Settings";
import CustomerGallery from "./pages/ClientGallery";
import QuoteRequestForm from "./components/dashboard/QuoteRequestForm";
import QuoteHistory from "./components/dashboard/QuoteHistory";

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ClientLogin from './pages/ClientLogin';
import CustomerRegistration from './pages/CustomerRegistration';
import RegisterComplete from './pages/RegisterComplete';
import NotFound from './pages/NotFound';

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminCustomer from "./pages/admin/AdminCustomer";
import AdminCustomerEdit from "./pages/admin/AdminCustomerEdit";
import AdminSessionCreate from "./pages/admin/AdminSessionCreate";
import AdminPhotoUpload from "./pages/admin/AdminPhotoUpload";
import AdminSessionDetails from "./pages/admin/AdminSessionDetails";




// 🔐 Admin Auth Wrapper — left unchanged
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log("🔐 CustomerRoute:", { loading, user });
  if (loading) return <div className="p-6">Checking login...</div>;
  return user ? children : <Navigate to="/client-login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log("🔐 CustomerRoute:", { loading, user });
  if (loading) return <div className="p-6">Checking admin auth...</div>;
  return user ? children : <Navigate to="/client-login" replace />;
};

const App = () => {
  return (
     <AuthProvider>
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
              <Route path="/dashboard/quote-request" element={<QuoteRequestForm />} />
              <Route path="quotes" element={<QuoteHistory />} />
          </Route>

          {/* 🔐 Admin Routes */}
<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="sessions" element={<AdminSessions />} />
  <Route path="customers" element={<AdminCustomer />} />
  <Route path="/admin/customer/:id/edit" element={<AdminCustomerEdit />} />
  <Route path="/admin/session/create" element={<AdminSessionCreate />} />
  <Route path="/admin/photo-upload" element={<AdminPhotoUpload />} />
  <Route path="/admin/session/:sessionId" element={<AdminSessionDetails />} />
  <Route path="/admin/customer/:id" element={<AdminCustomer />} />
</Route>
<Route path="/admin-login" element={<AdminLogin />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
     </AuthProvider>
  );
};

export default App;