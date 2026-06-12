import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SmoothScroll from '@/components/SmoothScroll';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PlacementOverview from './pages/placements/PlacementOverview';
import PlacementYear from './pages/placements/PlacementYear';
import Companies from './pages/placements/Companies';
import InternshipOverview from './pages/internships/InternshipOverview';
import InternshipYear from './pages/internships/InternshipYear';
import AdminAction from './pages/AdminAction';
import ExpertTalk from './pages/activities/ExpertTalk'
import IndustrialVisit from './pages/activities/IndustrialVisit'
import Hackathons from "./pages/achivements/Hackathons"
import StudentAchievements from "./pages/achivements/StudentAchivements"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}


export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Placements */}
          <Route
            path="/placements/overview"
            element={
              <ProtectedRoute>
                <PlacementOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placements/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placements/:year"
            element={
              <ProtectedRoute>
                <PlacementYear />
              </ProtectedRoute>
            }
          />

          {/* Internships */}
          <Route
            path="/internships/overview"
            element={
              <ProtectedRoute>
                <InternshipOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/:year"
            element={
              <ProtectedRoute>
                <InternshipYear />
              </ProtectedRoute>
            }
          />

        
          <Route
            path="/admin/:action/:scope"
            element={
              <AdminRoute>
                <AdminAction />
              </AdminRoute>
            }
          />

          <Route
            path="/activities/expert-talk"
            element={
              <ProtectedRoute>
                <ExpertTalk />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities/industrial-visit"
            element={
              <ProtectedRoute>
                <IndustrialVisit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/achievements/hackathons"
            element={
              <ProtectedRoute>
                <Hackathons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/achievements/students"
            element={
              <ProtectedRoute>
                <StudentAchievements />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}