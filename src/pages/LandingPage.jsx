import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart2, Users, Building2, TrendingUp, ArrowRight,
  Search, LineChart, Handshake, Rocket, GraduationCap,
  MapPin, Phone, Mail,
} from "lucide-react";
import {
  BarChart, Bar, LabelList, XAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart as ReLineChart, Line, YAxis,
} from "recharts";
import { yearlyComparison } from "../data/placementsData";
import { activitiesData } from "../data/activitiesData";
import logo from "/kkw-logo.png";

const stats = [
  { label: "Students Placed", value: "312", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Companies Visited", value: "78", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg Package", value: "₹8.4 LPA", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Placement Rate", value: "86.7%", icon: BarChart2, color: "text-violet-600", bg: "bg-violet-50" },
];

const recruiterHighlights = [
  { id: 1, name: "Cybage", logo: "/cybage.png" },
  { id: 2, name: "Druva", logo: "/druva.png" },
  { id: 3, name: "FinIQ", logo: "/finia.jpg" },
  { id: 4, name: "Hexaware", logo: "/hexaware.png" },
  { id: 5, name: "KPIT", logo: "/kpit.png" },
  { id: 6, name: "Netwin", logo: "/netwein.png" },
  { id: 7, name: "NVIDIA", logo: "/nvidia.png" },
  { id: 8, name: "Quantafic", logo: "/quantafic.jpg" },
  { id: 9, name: "Tech Mahindra", logo: "/techmahindra.png" },
  { id: 10, name: "TIA", logo: "/tia.jpg" },
];

const howItWorks = [
  { step: "01", icon: Search, title: "Explore Data", desc: "Browse placement statistics and detailed reports by year." },
  { step: "02", icon: LineChart, title: "View Analytics", desc: "Understand trends and performance across batches." },
  { step: "03", icon: Handshake, title: "Discover Recruiters", desc: "Connect with top companies that visit our campus." },
  { step: "04", icon: Rocket, title: "Track Growth", desc: "Monitor placement success and package trends over time." },
];

const heroSlides = [
  {
    bg: "/header.png",
    tag: "K K Wagh Education Society",
    line1: "From data to decisions:",
    line2: "Empowering",
    line3: "placement excellence",
  },
  {
    bg: "/header1.png",
    tag: "Computer Engineering Department",
    line1: "Track. Analyse. Grow:",
    line2: "Real-time",
    line3: "placement analytics",
  },
];

const testimonial = {
  quote: "The placement analytics portal provided clear insights into company trends, helping me prepare effectively and secure a top role.",
  name: "Anjali Sharma",
  role: "Placed at Infosys",
};

export default function LandingPage() {
  const navigate = useNavigate();
  const activities = activitiesData[2025].slice(0, 3);
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setSlide(i);
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 5000);
  };

  const overviewTrend = yearlyComparison.filter(
    ({ year }) => Number(year) >= 2021 && Number(year) <= 2025
  );

  const companiesVisitedByYear = { 2021: 58, 2022: 62, 2023: 65, 2024: 71, 2025: 78 };
  const companiesVisitedTrend = overviewTrend.map(({ year }) => ({
    year,
    companiesVisited: companiesVisitedByYear[year],
  }));

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.10)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="KKWIEER" className="w-30 h-30 object-contain drop-shadow" />
          
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Home", href: "#" },
              { label: "Insights", href: "#overview" },
              { label: "Recruiters", href: "#recruiters" },
              { label: "Statistics", href: "#highlights" },
              { label: "Placement", href: "#activities" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors duration-200 ${
                  scrolled ? "text-gray-700 hover:text-indigo-600" : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className={`text-sm font-semibold px-5 py-2 rounded-full border-2 transition-all duration-200 ${
              scrolled
                ? "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                : "border-white text-white hover:bg-white hover:text-gray-900"
            }`}
          >
            Login
          </button>
        </div>
      </nav>

      {/* ── Hero Carousel ── */}
      <section className="relative h-screen min-h-[520px] overflow-hidden bg-slate-950">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: slide === i ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${s.bg}')` }}
            />
          </div>
        ))}

        {/* Left dark overlay fading right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.15) 60%, transparent 80%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.30) 0%, transparent 35%)" }}
        />

       
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="pl-[104px] sm:pl-[116px] pr-6 max-w-[56%]">
            <p className="text-amber-300 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              {heroSlides[slide].tag}
            </p>
            <h1 className="text-white leading-[1.15]">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light italic mb-1">
                {heroSlides[slide].line1}
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light italic text-amber-300 mb-1">
                {heroSlides[slide].line2}
              </span>
              <span className="block text-2xl sm:text-[2rem] lg:text-[2.4rem] font-extrabold">
                {heroSlides[slide].line3}
              </span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/placements/overview"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                View Insights <ArrowRight size={15} />
              </Link>
              <button
                onClick={() => navigate("/dashboard")}
                className="border border-white/50 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-white/10 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>

  
      </section>


      {/* ── Placement Insights Overview ── */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Placement Insights Overview</h2>
          <p className="text-gray-500 mt-2 text-sm">Year-wise placement highlights for Computer Engineering</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">1</p>
                <h3 className="text-base font-semibold text-gray-800">Year-wise Placements</h3>
              </div>
              <Link to="/placements/overview" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={overviewTrend} margin={{ top: 24, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                <Bar dataKey="placed" fill="url(#placedGrad)" radius={[6, 6, 0, 0]} maxBarSize={44}>
                  <LabelList dataKey="placed" position="top" style={{ fontSize: 11, fill: "#4f46e5", fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">2</p>
                <h3 className="text-base font-semibold text-gray-800">Companies Visited</h3>
              </div>
              <Link to="/placements/companies" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={companiesVisitedTrend} margin={{ top: 24, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#6ee7b7" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                <Bar dataKey="companiesVisited" fill="url(#compGrad)" radius={[6, 6, 0, 0]} maxBarSize={44}>
                  <LabelList dataKey="companiesVisited" position="top" style={{ fontSize: 11, fill: "#059669", fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
        </div>
      </section>

      {/* ── Top Recruiters ── */}
      <section id="recruiters" className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Top Recruiters</h2>
            <p className="text-gray-500 mt-2 text-sm">Leading companies that recruit from KKWIEER Computer Engineering</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {recruiterHighlights.map((company) => (
              <div key={company.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 p-4 flex flex-col items-center gap-3">
                <div className="h-30 w-full flex items-center justify-center">
                  <img src={company.logo} alt={company.name} className=" max-w-full object-contain" loading="lazy" />
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section id="highlights" className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            {[
              { icon: GraduationCap, val: "845", label: "Students Placed" },
              { icon: Building2, val: "112", label: "Companies Visited" },
              { icon: TrendingUp, val: "36.5 LPA", label: "Highest Package" },
              { icon: BarChart2, val: "6.2 LPA", label: "Average Package" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon size={28} className="text-white/70" />
                <p className="text-3xl sm:text-4xl font-extrabold">{item.val}</p>
                <p className="text-sm text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Placement Highlights ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Placement Highlights @ KKWagh</h2>
            <p className="text-gray-500 mt-2 text-sm">What makes our placement record stand out</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "500+", label: "Placed in 2024", color: "bg-indigo-50 border-indigo-100", text: "text-indigo-700" },
                { val: "90%", label: "Placement rate", color: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
                { val: "Top Packages", label: "In core industries", color: "bg-amber-50 border-amber-100", text: "text-amber-700" },
                { val: "Strong", label: "Alumni network", color: "bg-violet-50 border-violet-100", text: "text-violet-700" },
              ].map((h) => (
                <div key={h.label} className={`${h.color} border rounded-2xl p-5`}>
                  <p className={`text-xl font-bold ${h.text}`}>{h.val}</p>
                  <p className="text-sm text-gray-600 mt-1">{h.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* ── Recent Activities ── */}
      <section id="activities" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-2">Campus Highlights</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recent Activities</h2>
              <p className="text-gray-500 text-sm mt-1">Workshops, hackathons, expert sessions, and placement drives from 2025.</p>
            </div>
            <Link to="/activities/overview" className="hidden md:inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a) => {
              const formattedDate = new Date(a.date).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              });
              return (
                <article key={a.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-3 top-3 text-[11px] font-semibold bg-white text-gray-800 px-2.5 py-1 rounded-full shadow-sm">
                      {a.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2">{a.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{a.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{formattedDate}</span>
                      <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">{a.participants} participants</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="md:hidden text-center mt-8">
            <Link to="/activities/overview" className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
              View All <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-10 bg-gradient-to-r from-indigo-600 to-violet-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">Ready to explore placement insights?</p>
            <p className="text-indigo-200 text-sm mt-0.5">Unlock data-driven decisions.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap shadow-md"
          >
            View Dashboard
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-gray-950 text-gray-400 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="KKWagh" className="w-9 h-9 object-contain brightness-200" />
              <div>
                <p className="text-white font-bold text-sm">KKWagh</p>
                <p className="text-xs text-gray-500">Placement Analytics</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">Empowering futures through data.</p>
            <div className="flex gap-3 mt-5">
              {["in", "tw", "fb", "ig"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center text-xs text-gray-400 hover:text-white transition-colors uppercase font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Insights", to: "/placements/overview" },
                { label: "Recruiters", to: "/placements/companies" },
                { label: "Statistics", to: "/analytics" },
                { label: "Contact", to: "#contact" },
                { label: "Privacy Policy", to: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 text-indigo-400 shrink-0" />
                <p className="text-gray-500 leading-relaxed">K. K. Wagh Institute of Engineering Education and Research, Nashik, Maharashtra</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-indigo-400 shrink-0" />
                <a href="mailto:placement@kkwagh.edu.in" className="hover:text-white transition-colors">placement@kkwagh.edu.in</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-indigo-400 shrink-0" />
                <a href="tel:+912532510371" className="hover:text-white transition-colors">+91 253 251 0371</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
          © 2025 Computer Engineering Department, K. K. Wagh Institute. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
