import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import KPISection from '../components/Dashboard/KPISection';
import ChartsSection from '../components/Dashboard/ChartsSection';
import PlacementRatioChart from '../components/Dashboard/PlacementRatioChart';
import PackageChart from '../components/Dashboard/PackageChart';
import Recruiters from '../components/Dashboard/Recruiters';
import { getAnalyticsDashboard } from '../services/analyticsApi';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const data = await getAnalyticsDashboard();
        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load analytics dashboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const subtitle = useMemo(() => {
    if (!dashboardData?.kpis) {
      return 'Computer Engineering Department';
    }
    return `Updated from backend analytics API`;
  }, [dashboardData]);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Placement Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {loading && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Loading dashboard analytics...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <KPISection kpis={dashboardData?.kpis} />
        <ChartsSection
          yearVsCompanies={dashboardData?.year_vs_companies}
          yearWisePlacements={dashboardData?.year_wise_placements}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PlacementRatioChart placementRatio={dashboardData?.placement_ratio} />
          <PackageChart packageDistribution={dashboardData?.package_distribution} />
        </div>

        <Recruiters recruiters={dashboardData?.top_recruiters} />
      </div>
    </DashboardLayout>
  );
}
