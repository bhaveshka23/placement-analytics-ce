import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SmoothScroll from '@/components/SmoothScroll';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PlacementOverview from './pages/placements/PlacementOverview';
import PlacementYear from './pages/placements/PlacementYear';
import Companies from './pages/placements/Companies';
import InternshipOverview from './pages/internships/InternshipOverview';
import InternshipYear from './pages/internships/InternshipYear';
import Settings from './pages/Settings';


export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={ <Dashboard />}/>

          {/* Placements */}
          <Route path="/placements/overview" element={<PlacementOverview />} />
          <Route path="/placements/companies" element={<Companies />} />
          <Route path="/placements/:year" element={<PlacementYear />} />

          {/* Internships */}
          <Route path="/internships/overview" element={<InternshipOverview />} />
          <Route path="/internships/:year" element={<InternshipYear />} />

          {/* More */}
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}
