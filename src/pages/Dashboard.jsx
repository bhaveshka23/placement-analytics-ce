import DashboardLayout from '../components/Layout/DashboardLayout';
import KPISection from '../components/Dashboard/KPISection';
import FilterBar from '../components/Dashboard/FilterBar';
import ChartsSection from '../components/Dashboard/ChartsSection';
import SkillsChart from '../components/Dashboard/SkillsChart';
import PackageChart from '../components/Dashboard/PackageChart';
import Recruiters from '../components/Dashboard/Recruiters';
import PlacementTable from '../components/Dashboard/PlacementTable';
import RecentPlacements from '../components/Dashboard/RecentPlacements';
import ActivitiesPreview from '../components/Dashboard/ActivitiesPreview';
import Insights from '../components/Dashboard/Insights';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Placement Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Computer Engineering Department · Batch 2025</p>
        </div>

        <KPISection />
        <ChartsSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkillsChart />
          <PackageChart />
        </div>

        <Recruiters />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <PlacementTable />
          </div>
          <div className="space-y-4">
            <RecentPlacements />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivitiesPreview />
          <Insights />
        </div>
      </div>
    </DashboardLayout>
  );
}
