import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import CAFForm from './pages/student/CAFForm';
import Internships from './pages/student/Internships';
import PlacementDrives from './pages/student/PlacementDrives';
import MockInterviewResults from './pages/student/MockInterviewResults';
import AdminNotifications from './pages/admin/Notifications';
import StudentFilter from './pages/admin/StudentFilter';
import MockInterviewUpload from './pages/admin/MockInterviewUpload';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="caf" element={<CAFForm />} />
            <Route path="internships" element={<Internships />} />
            <Route path="placements" element={<PlacementDrives />} />
            <Route path="mock-interviews" element={<MockInterviewResults />} />
          </Route>

          {/* Admin Routes */}
          {/* <Route path="/admin" element={<ProtectedRoute role="admin" />}> */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="students" element={<StudentFilter />} />
            <Route path="mock-upload" element={<MockInterviewUpload />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
