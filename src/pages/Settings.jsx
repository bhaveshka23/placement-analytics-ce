import { useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { Save, Bell, Shield, Palette, Database } from 'lucide-react';

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const [notifs, setNotifs] = useState({ email: true, placement: true, internship: false, activity: true });
  const [prefs, setPrefs] = useState({ darkMode: false, compactView: false, autoRefresh: true });

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your portal preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-700">Profile Settings</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: 'Dr. R. Sharma', type: 'text' },
              { label: 'Email', value: 'r.sharma@cedept.edu.in', type: 'email' },
              { label: 'Role', value: 'Placement Coordinator', type: 'text' },
              { label: 'Department', value: 'Computer Engineering', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                <input
                  type={f.type}
                  defaultValue={f.value}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={18} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-700">Notification Preferences</h3>
          </div>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'placement', label: 'Placement Alerts', desc: 'New placement records added' },
              { key: 'internship', label: 'Internship Alerts', desc: 'New internship records added' },
              { key: 'activity', label: 'Activity Alerts', desc: 'New activities and events' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-gray-700">{n.label}</p>
                  <p className="text-xs text-gray-400">{n.desc}</p>
                </div>
                <ToggleSwitch checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Display */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={18} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-700">Display Preferences</h3>
          </div>
          <div className="space-y-3">
            {[
              { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme' },
              { key: 'compactView', label: 'Compact View', desc: 'Reduce spacing in tables' },
              { key: 'autoRefresh', label: 'Auto Refresh', desc: 'Refresh data every 5 minutes' },
            ].map(p => (
              <div key={p.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-gray-700">{p.label}</p>
                  <p className="text-xs text-gray-400">{p.desc}</p>
                </div>
                <ToggleSwitch checked={prefs[p.key]} onChange={v => setPrefs(prev => ({ ...prev, [p.key]: v }))} />
              </div>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
