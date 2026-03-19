import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart2,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { yearlyComparison } from "../data/placementsData";
import { companiesData } from "../data/companiesData";
import { activitiesData } from "../data/activitiesData";
import Footer from "../components/Layout/Footer";
import logo from "../assets/logo.png"

const stats = [
  {
    label: "Students Placed",
    value: "312",
    icon: Users,
    color: "text-indigo-600",
  },
  {
    label: "Companies Visited",
    value: "78",
    icon: Building2,
    color: "text-green-600",
  },
  {
    label: "Avg Package",
    value: "₹8.4 LPA",
    icon: TrendingUp,
    color: "text-amber-600",
  },
  {
    label: "Placement Rate",
    value: "86.7%",
    icon: BarChart2,
    color: "text-purple-600",
  },
];

export default function LandingPage() {
  const activities = activitiesData[2025].slice(0, 3);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className="sticky top-0 z-30 transition-all duration-300 bg-white border-b border-gray-200 text-gray-800"
      >
        <div className="px-4 sm:px-6 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className=" w-16 h-16 lg:w-20 lg:h-20 rounded-lg flex items-center justify-center shrink-0">
              <img src={logo} alt="KKWIEER Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p
                className="text-sm sm:text-lg font-bold leading-none transition-colors text-gray-800"
              >
                KKWIEER
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Computer Engineering
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <a
              href="#overview"
              className="text-md transition-colors hidden lg:block"
            >
              Overview
            </a>
            <a
              href="#recruiters"
              className="text-md transition-colors hidden lg:block"
            >
              Recruiters
            </a>
            <a
              href="#activities"
              className="text-md transition-colors hidden lg:block"
            >
              Activities
            </a>
            <Link
              to="/dashboard"
              className="bg-blue-800 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
            >
              Login <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[85vh] sm:min-h-screen flex items-end sm:items-center overflow-hidden bg-blue-900">
        {/* Main Background */}
        <div
          className="absolute inset-0 bg-[url('/header.png')] bg-no-repeat bg-top bg-contain sm:bg-center sm:bg-cover"
          aria-hidden="true"
        />

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/70 sm:bg-black/30"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-20 pt-[34vh] pb-20 sm:py-20">
          <div className="max-w-2xl">
            
            <h1 className="text-[2rem] sm:text-5xl font-bold text-white leading-tight">
              Computer Engineering
              <br />
              <span className="text-indigo-300">Placement Analytics</span>
            </h1>

            <p className="text-indigo-100 mt-4 text-lg sm:text-lg leading-relaxed max-w-xl">
              Comprehensive placement data, insights, and analytics for the CE
              Department. Track placements, internships, and student activities
              in one place.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-8">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto justify-center bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
              >
                View Dashboard <ArrowRight size={16} />
              </Link>

              <Link
                to="/placements/overview"
                className="w-full sm:w-auto text-center border border-indigo-400 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Placement Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center"
            >
              <s.icon size={24} className={`mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview Charts */}
      <section id="overview" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Placement Overview
        </h2>
        <p className="text-gray-500 mb-8">
          Year-wise placement trends and performance metrics
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Students Placed (2021–2025)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="placed"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Placed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Avg Package Trend (LPA)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={yearlyComparison}>
                <defs>
                  <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="avg"
                  stroke="#22c55e"
                  fill="url(#avgGrad)"
                  strokeWidth={2}
                  name="Avg LPA"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recruiters */}
      <section id="recruiters" className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Our Recruiters
          </h2>
          <p className="text-gray-500 mb-8">
            Top companies that recruit from our department
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companiesData.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
              >
                <span className="text-3xl mb-2">{c.logo}</span>
                <p className="text-xs font-semibold text-gray-700 text-center">
                  {c.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{c.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Recent Activities
        </h2>
        <p className="text-gray-500 mb-8">
          Workshops, hackathons, and events from 2025
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                  {a.category}
                </span>
                <h3 className="text-sm font-semibold text-gray-800 mt-2">
                  {a.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {a.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {a.date} · {a.participants} participants
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/activities/overview"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            View all activities <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
