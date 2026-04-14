import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ChevronDown, ChevronRight,
  Briefcase, GraduationCap, Activity, BarChart2, Settings, Building2
} from 'lucide-react';
import { getPlacementYears } from '../../services/placementsApi';
import { getInternshipYears } from '../../services/internshipsApi';

function NavItem({ to, children, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      {Icon && <Icon size={16} />}
      {children}
    </NavLink>
  );
}

function DropdownSection({ label, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <span className="flex items-center gap-3">
          <Icon size={16} />
          {label}
        </span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="ml-6 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const [placementYears, setPlacementYears] = useState([]);
  const [internshipYears, setInternshipYears] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadPlacementYears() {
      try {
        const response = await getPlacementYears();
        if (mounted) {
          setPlacementYears(response.years || []);
        }
      } catch {
        if (mounted) {
          setPlacementYears([]);
        }
      }
    }

    async function loadInternshipYears() {
      try {
        const response = await getInternshipYears();
        if (mounted) {
          setInternshipYears(response.years || []);
        }
      } catch {
        if (mounted) {
          setInternshipYears([]);
        }
      }
    }

    loadPlacementYears();
    loadInternshipYears();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40 transition-all duration-300 flex flex-col shadow-sm ${
        isOpen ? 'w-60' : 'w-0 overflow-hidden'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 leading-none">CE Dept</p>
            <p className="text-xs text-gray-400 mt-0.5">Placement Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>

        <div className="pt-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Placements</p>
          <DropdownSection label="Placements" icon={Briefcase} defaultOpen={location.pathname.startsWith('/placements')}>
            <NavItem to="/placements/overview">Overview</NavItem>
            {placementYears.map(y => <NavItem key={y} to={`/placements/${y}`}>{y}</NavItem>)}
            <NavItem to="/placements/companies">Companies</NavItem>
            
          </DropdownSection>
        </div>

        <div className="pt-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Internships</p>
          <DropdownSection label="Internships" icon={Building2} defaultOpen={location.pathname.startsWith('/internships')}>
            <NavItem to="/internships/overview">Overview</NavItem>
            {internshipYears.map(y => <NavItem key={y} to={`/internships/${y}`}>{y}</NavItem>)}
          </DropdownSection>
        </div>

        {/* <div className="pt-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Activities</p>
          <DropdownSection label="Activities" icon={Activity} defaultOpen={location.pathname.startsWith('/activities')}>
            <NavItem to="/activities/overview">Overview</NavItem>
            {years.map(y => <NavItem key={y} to={`/activities/${y}`}>{y}</NavItem>)}
          </DropdownSection>
        </div> */}

        <div className="pt-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">More</p>
          
          <NavItem to="/settings" icon={Settings}>Settings</NavItem>
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <p className="text-xs text-gray-400 text-center">CE Dept © 2025</p>
      </div>
    </aside>
  );
}
