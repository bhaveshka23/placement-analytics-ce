import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  X,
  Mail,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { placementsData, yearlyComparison } from "../data/placementsData";
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

const recruiterHighlights = [
  { id: 1, name: "Cybage", logo: "/cybage.png"},
  { id: 2, name: "Druva", logo: "/druva.png" },
  { id: 3, name: "FinIQ", logo: "/finia.jpg"},
  { id: 4, name: "Hexaware", logo: "/hexaware.png"},
  { id: 5, name: "KPIT", logo: "/kpit.png"},
  { id: 6, name: "Netwin", logo: "/netwein.png"},
  { id: 7, name: "NVIDIA", logo: "/nvidia.png"},
  { id: 8, name: "Quantafic", logo: "/quantafic.jpg"},
  { id: 9, name: "Tech Mahindra", logo: "/techmahindra.png"},
  { id: 10, name: "TIA", logo: "/tia.jpg"},
];

export default function LandingPage() {
  const navigate = useNavigate();
  const activities = activitiesData[2025].slice(0, 3);
  const [isScrolled, setIsScrolled] = useState(false);
  const openLoginPopup = () => {
    navigate("/dashboard");
  };


  const overviewTrend = yearlyComparison.filter(
    ({ year }) => Number(year) >= 2021 && Number(year) <= 2025
  );
  const companiesVisitedByYear = {
    2021: 58,
    2022: 62,
    2023: placementsData[2023].companiesVisited,
    2024: placementsData[2024].companiesVisited,
    2025: placementsData[2025].companiesVisited,
  };
  const companiesVisitedTrend = overviewTrend.map(({ year }) => ({
    year,
    companiesVisited: companiesVisitedByYear[year],
  }));

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
        className="sticky top-0 z-40 transition-all duration-300 text-gray-800 landing-nav-float bg-white "
          
      >
        <div className="px-4 sm:px-6 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className=" w-16 h-16 lg:w-20 lg:h-20 rounded-lg flex items-center justify-center shrink-0">
              <img src={logo} alt="KKWIEER Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <button
                type="button"
                onClick={openLoginPopup}
                className="text-sm sm:text-lg font-bold leading-none transition-colors  cursor-pointer"
              >
                KKWIEER
              </button>
              <p className="text-xs sm:text-sm ">Computer Engineering
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-5">
            <a
              href="#overview"
              className="text-sm font-medium  transition-colors hidden lg:block"
            >
              Overview
            </a>
            <a
              href="#recruiters"
              className="text-sm font-medium  transition-colors hidden lg:block"
            >
              Recruiters
            </a>
            <a
              href="#activities"
              className="text-sm font-medium  transition-colors hidden lg:block"
            >
              Activities
            </a>
            <button
              type="button"
              onClick={openLoginPopup}
              className="bg-blue-500 text-white text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-400 transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:shadow border border-blue-300"
            >
              Login <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[84vh] sm:min-h-[92vh] flex items-center overflow-hidden bg-slate-950">
        {/* Main Background */}
        <div
          className="absolute inset-0 bg-[url('/header.png')] bg-no-repeat bg-center bg-cover"
          aria-hidden="true"
        />

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 bg-linear-to-r from-black/80"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-transparent to-slate-900/20"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative w-full max-w-6xl px-4 sm:px-8 lg:px-20 py-16 sm:py-20">
          <div className="max-w-2xl landing-hero-glow">
            
            <h1 className="text-[2rem] sm:text-5xl font-bold text-white leading-tight landing-reveal">
              Computer Engineering
              <br />
              <span className="text-indigo-300">Placement Analytics</span>
            </h1>

            <p className="text-slate-100 mt-4 text-base sm:text-lg leading-relaxed max-w-xl landing-reveal landing-reveal-delay-1">
              Comprehensive placement data, insights, and analytics for the Computer Engineering
              Department. Track placements, internships, and student activities
              in one place.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-8 landing-reveal landing-reveal-delay-2">
              <button
                type="button"
                onClick={openLoginPopup}
                className="w-full sm:w-auto justify-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-xl"
              >
                Login <ArrowRight size={16} />
              </button>

              <Link
                to="/placements/overview"
                className="w-full sm:w-auto text-center border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                View Data
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
          KKWIEER Computer Engineering year-wise placement highlights
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#f3f9fc] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#d8e8ef] landing-reveal">
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-1">
              Companies Visited
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Year vs companies visited
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={companiesVisitedTrend} margin={{ top: 28, right: 8, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="companiesBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8d6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 4" stroke="#c9dce6" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#0f172a", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(20, 184, 166, 0.08)" }} />
                <Bar dataKey="companiesVisited" fill="url(#companiesBar)" radius={[12, 12, 0, 0]} maxBarSize={56}>
                  <LabelList dataKey="companiesVisited" position="top" fill="#0f766e" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="pt-3 text-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-700 text-white px-4 py-2 text-sm font-medium hover:bg-cyan-800 transition-colors"
              >
                View More
              </Link>
            </div>
          </div>
          <div className="bg-[#fff5f5] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#f6d5d8] landing-reveal landing-reveal-delay-1">
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-1">
              Total Students Placed
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Year vs students placed
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overviewTrend} margin={{ top: 28, right: 8, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="placedBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fda085" />
                    <stop offset="100%" stopColor="#c2415a" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 4" stroke="#f0c8ce" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#0f172a", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(190, 24, 93, 0.08)" }} />
                <Bar dataKey="placed" fill="url(#placedBar)" radius={[12, 12, 0, 0]} maxBarSize={56}>
                  <LabelList dataKey="placed" position="top" fill="#9f1239" fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="pt-3 text-center">
              <Link
                to="/placements/students"
                className="inline-flex items-center justify-center rounded-lg bg-rose-700 text-white px-4 py-2 text-sm font-medium hover:bg-rose-800 transition-colors"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiters */}
      <section id="recruiters" className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-start max-w-2xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Our Recruiters
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Leading companies that have recruited from KKWIEER Computer Engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {recruiterHighlights.map((company) => (
              <article
                key={company.id}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-[0_6px_18px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_28px_rgba(15,23,42,0.1)] hover:border-cyan-200 transition-all duration-300"
              >
                <div className="h-12 sm:h-30 flex items-center justify-center mb-3">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-h-full max-w-[90%] object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs sm:text-lg font-semibold text-slate-800 text-center leading-tight">
                  {company.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white to-slate-50/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-cyan-700 mb-2">
                Campus Highlights
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Recent Activities
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                Workshops, hackathons, expert sessions, and placement readiness drives from 2025.
              </p>
            </div>

            <Link
              to="/activities/overview"
              className="hidden md:inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              View More <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a, index) => {
              const formattedDate = new Date(a.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <article
                  key={a.id}
                  className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-300 landing-reveal ${
                    index === 1 ? "landing-reveal-delay-1" : ""
                  } ${index === 2 ? "landing-reveal-delay-2" : ""}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
                    <span className="absolute left-3 top-3 text-[11px] font-semibold bg-white/95 text-slate-900 px-2.5 py-1 rounded-full">
                      {a.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-2 min-h-12">
                      {a.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-16">
                      {a.description}
                    </p>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2.5 py-1">
                        {formattedDate}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-cyan-50 text-cyan-700 px-2.5 py-1 font-medium">
                        {a.participants} participants
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="md:hidden text-center mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              View More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
