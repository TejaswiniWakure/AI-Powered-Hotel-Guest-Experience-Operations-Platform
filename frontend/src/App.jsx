import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public
import Landing from './pages/landing/Landing';
import Pricing from './pages/pricing/Pricing';
import Login from './pages/auth/Login';

// Guest
import GuestLayout from './components/layout/GuestLayout';
import GuestHome from './pages/guest/GuestHome';
import GuestConcierge from './pages/guest/GuestConcierge';
import GuestServices from './pages/guest/GuestServices';
import GuestReport from './pages/guest/GuestReport';
import { GuestRequestsList, GuestRequestDetail } from './pages/guest/GuestRequests';
import GuestProfile from './pages/guest/GuestProfile';

// Staff
import StaffLayout from './components/layout/StaffLayout';
import StaffOverview from './pages/staff/StaffOverview';
import StaffTasks from './pages/staff/StaffTasks';
import StaffTaskDetail from './pages/staff/StaffTaskDetail';
import StaffAssistant from './pages/staff/StaffAssistant';
import StaffPerformance from './pages/staff/StaffPerformance';

// Manager
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

// Admin
import AdminLayout from './components/layout/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminHotel from './pages/admin/AdminHotel';
import AdminRooms from './pages/admin/AdminRooms';
import AdminStaff from './pages/admin/AdminStaff';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminServices from './pages/admin/AdminServices';
import AdminSLA from './pages/admin/AdminSLA';
import AdminKnowledge from './pages/admin/AdminKnowledge';
import AdminPermissions from './pages/admin/AdminPermissions';
import AdminLogs from './pages/admin/AdminLogs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />

        {/* Guest Portal */}
        <Route path="/guest" element={<GuestLayout />}>
          <Route index element={<GuestHome />} />
          <Route path="concierge" element={<GuestConcierge />} />
          <Route path="services" element={<GuestServices />} />
          <Route path="report" element={<GuestReport />} />
          <Route path="requests" element={<GuestRequestsList />} />
          <Route path="requests/:id" element={<GuestRequestDetail />} />
          <Route path="profile" element={<GuestProfile />} />
          <Route path="notifications" element={
            <div className="p-6 max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-primary mb-4">Alerts</h1>
              <div className="p-8 text-center text-text-muted">No new notifications.</div>
            </div>
          } />
        </Route>

        {/* Staff Portal */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffOverview />} />
          <Route path="tasks" element={<StaffTasks />} />
          <Route path="tasks/:id" element={<StaffTaskDetail />} />
          <Route path="assistant" element={<StaffAssistant />} />
          <Route path="performance" element={<StaffPerformance />} />
          <Route path="notifications" element={<div className="text-2xl font-bold text-primary">No new notifications.</div>} />
        </Route>

        {/* Manager Portal */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerOverview />} />
          <Route path="operations" element={<ManagerOperations />} />
          <Route path="requests" element={<ManagerRequests />} />
          <Route path="staff" element={<ManagerStaff />} />
          <Route path="analytics" element={<ManagerAnalytics />} />
          <Route path="trends" element={<ManagerTrends />} />
          <Route path="guest-preferences" element={<ManagerPreferences />} />
          <Route path="offers" element={<ManagerOffers />} />
          <Route path="safety" element={<ManagerSafety />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="notifications" element={<div className="text-2xl font-bold text-primary">No new notifications.</div>} />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="hotel" element={<AdminHotel />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="sla" element={<AdminSLA />} />
          <Route path="knowledge" element={<AdminKnowledge />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="settings" element={<div className="text-2xl font-bold text-primary">Settings</div>} />
          <Route path="configuration" element={<div className="text-2xl font-bold text-primary">System Configuration</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
