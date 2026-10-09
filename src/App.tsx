import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminLayout } from './components/layout/AdminLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import PublicProfile from './pages/PublicProfile';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Advertise from './pages/Advertise';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import AddProperty from './pages/dashboard/AddProperty';
import EditProperty from './pages/dashboard/EditProperty';
import MyProperties from './pages/dashboard/MyProperties';
import UserFavorites from './pages/dashboard/UserFavorites';
import UserInquiries from './pages/dashboard/UserInquiries';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminLogin from './pages/admin/AdminLogin';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminLocations from './pages/admin/AdminLocations';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* General Marketplace Routes (Accessible by everyone) */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/users/:id" element={<PublicProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Guest-Only Authentication Routes (Redirect to dashboard if logged in) */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* User Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="properties/edit/:id" element={<EditProperty />} />
            <Route path="favorites" element={<UserFavorites />} />
            <Route path="inquiries" element={<UserInquiries />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/pending" element={<AdminProperties />} />
            <Route path="properties/edit/:id" element={<EditProperty />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
