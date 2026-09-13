import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public Pages
import Landing from './pages/landing/Landing';
import Pricing from './pages/pricing/Pricing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import GuestAccess from './pages/auth/GuestAccess';

// Guest Portal
import GuestLayout from './components/layout/GuestLayout';
import GuestHome from './pages/guest/GuestHome';
import GuestConcierge from './pages/guest/GuestConcierge';
import GuestServices from './pages/guest/GuestServices';
import GuestReport from './pages/guest/GuestReport';
import { GuestRequestsList, GuestRequestDetail } from './pages/guest/GuestRequests';
import GuestProfile from './pages/guest/GuestProfile';
import GuestRoomService from './pages/guest/room-service/GuestRoomService';
import CartPage from './pages/guest/room-service/CartPage';

// Staff Portal
import StaffLayout from './components/layout/StaffLayout';
import StaffOverview from './pages/staff/StaffOverview';
import StaffTasks from './pages/staff/StaffTasks';
import StaffTaskDetail from './pages/staff/StaffTaskDetail';
import StaffAssistant from './pages/staff/StaffAssistant';
import StaffPerformance from './pages/staff/StaffPerformance';

// Manager Portal
import ManagerLayout from './components/layout/ManagerLayout';
import ManagerOverview from './pages/manager/ManagerOverview';
import ManagerOperations from './pages/manager/ManagerOperations';
import ManagerRequests from './pages/manager/ManagerRequests';
import ManagerStaff from './pages/manager/ManagerStaff';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import ManagerTrends from './pages/manager/ManagerTrends';
import ManagerPreferences from './pages/manager/ManagerPreferences';
import ManagerOffers from './pages/manager/ManagerOffers';
import ManagerSafety from './pages/manager/ManagerSafety';
import ManagerReports from './pages/manager/ManagerReports';
import ManagerMenu from './pages/manager/ManagerMenu';
import ManagerMenuForm from './pages/manager/ManagerMenuForm';
import ManagerMenuSettings from './pages/manager/ManagerMenuSettings';
import ManagerFoodOrders from './pages/manager/ManagerFoodOrders';

// Admin Portal (Streamlined 4 Core SaaS Owner Modules)
import AdminLayout from './components/layout/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminHotels from './pages/admin/AdminHotels';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminSupport from './pages/admin/AdminSupport';

import NotificationsPage from './pages/common/NotificationsPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/guest-access" element={<GuestAccess />} />

            {/* Guest Portal */}
            <Route
              path="/guest"
              element={
                <ProtectedRoute allowedRoles={['guest']}>
                  <GuestLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<GuestHome />} />
              <Route path="concierge" element={<GuestConcierge />} />
              <Route path="services" element={<GuestServices />} />
              <Route path="services/room-service" element={<GuestRoomService />} />
              <Route path="services/room-service/cart" element={<CartPage />} />
              <Route path="report" element={<GuestReport />} />
              <Route path="requests" element={<GuestRequestsList />} />
              <Route path="requests/:id" element={<GuestRequestDetail />} />
              <Route path="profile" element={<GuestProfile />} />
              <Route path="notifications" element={<NotificationsPage title="Guest Alerts & Updates" />} />
            </Route>

            {/* Staff Portal */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffOverview />} />
              <Route path="tasks" element={<StaffTasks />} />
              <Route path="tasks/:id" element={<StaffTaskDetail />} />
              <Route path="assistant" element={<StaffAssistant />} />
              <Route path="performance" element={<StaffPerformance />} />
              <Route path="room-service/orders" element={<ManagerFoodOrders />} />
              <Route path="notifications" element={<NotificationsPage title="Staff Operational Alerts" />} />
            </Route>

            {/* Manager Portal */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ManagerOverview />} />
              <Route path="operations" element={<ManagerOperations />} />
              <Route path="requests" element={<ManagerRequests />} />
              <Route path="food-orders" element={<ManagerFoodOrders />} />
              <Route path="orders" element={<ManagerFoodOrders />} />
              <Route path="services/menu" element={<ManagerMenu />} />
              <Route path="services/menu/add" element={<ManagerMenuForm />} />
              <Route path="services/menu/:id/edit" element={<ManagerMenuForm />} />
              <Route path="services/menu/settings" element={<ManagerMenuSettings />} />
              <Route path="staff" element={<ManagerStaff />} />
              <Route path="analytics" element={<ManagerAnalytics />} />
              <Route path="trends" element={<ManagerTrends />} />
              <Route path="guest-preferences" element={<ManagerPreferences />} />
              <Route path="offers" element={<ManagerOffers />} />
              <Route path="safety" element={<ManagerSafety />} />
              <Route path="reports" element={<ManagerReports />} />
              <Route path="notifications" element={<NotificationsPage title="Manager Command Notifications" />} />
            </Route>

            {/* Admin Portal (SaaS Platform Owner) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
