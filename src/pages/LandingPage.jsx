import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BarChart2,
  Building2,
  ChevronDown,
  GraduationCap,
  Mail,
  Menu,
  MapPin,
  Phone,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { yearlyComparison } from "../data/placementsData";
import { activitiesData } from "../data/activitiesData";
import {
  adminLogin,
  adminVerifyOtp,
  studentSendOtp,
  studentVerifyOtp,
} from "../services/authApi";
import logo from "/kkw-logo.png";

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

const heroSlides = [
  
  {
    bg: "/header1.png",
    line1: "Track. Analyse. Grow:",
    line2: "Real-time",
    line3: "Placement Analytics",
  },
];

const testimonial = {
  quote:
    "The placement analytics portal provided clear insights into company trends, helping me prepare effectively and secure a top role.",
  name: "Anjali Sharma",
  role: "Placed at Infosys",
};

const companiesVisitedByYear = {
  2021: 58,
  2022: 62,
  2023: 65,
  2024: 71,
  2025: 78,
};

const sectionLabelClass =
  "mb-2 font-body text-[0.68rem] font-bold uppercase tracking-[0.18em] text-indigo-600";
const sectionHeadingClass =
  "font-display text-[clamp(1.7rem,3vw,2.4rem)] font-normal leading-[1.2] text-slate-950";
const sectionSubClass = "mt-2 font-body text-[0.85rem] text-slate-500";
const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold tracking-[0.02em] text-slate-950 shadow-[0_4px_16px_rgba(232,160,32,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400";
const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium tracking-[0.02em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10";

function AnimatedCounter({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const numTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numTarget));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(numTarget);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm shadow-lg">
        <p className="font-semibold text-slate-800">{label}</p>
        <p className="font-bold" style={{ color }}>
          {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const activities = activitiesData[2025].slice(0, 3);
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [loginStep, setLoginStep] = useState("request");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginNotice, setLoginNotice] = useState("");
  const [loginForm, setLoginForm] = useState({
    role: "student",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const timerRef = useRef(null);
  const loginCloseTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setSlide((current) => (current + 1) % heroSlides.length),
      5000,
    );
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (loginCloseTimerRef.current) {
        clearTimeout(loginCloseTimerRef.current);
      }
    };
  }, []);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setSlide(index);
    timerRef.current = setInterval(
      () => setSlide((current) => (current + 1) % heroSlides.length),
      5000,
    );
  };

  const resetLoginFlow = () => {
    setLoginStep("request");
    setLoginLoading(false);
    setLoginError("");
    setLoginNotice("");
    setOtp("");
  };

  const openLogin = () => {
    if (loginCloseTimerRef.current) {
      clearTimeout(loginCloseTimerRef.current);
    }
    resetLoginFlow();
    setLoginVisible(true);
    requestAnimationFrame(() => setLoginOpen(true));
  };

  const closeLogin = () => {
    setLoginOpen(false);
    loginCloseTimerRef.current = setTimeout(() => {
      setLoginVisible(false);
      resetLoginFlow();
    }, 200);
  };

  const onLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginError("");
    setLoginNotice("");
    setLoginForm((prev) => {
      if (name === "role" && value === "student") {
        setLoginStep("request");
        setOtp("");
        return { ...prev, role: value, password: "" };
      }
      if (name === "role") {
        setLoginStep("request");
        setOtp("");
      }
      if (name === "email" && loginStep === "verify") {
        setLoginStep("request");
        setOtp("");
      }
      return { ...prev, [name]: value };
    });
  };

  const onLoginSubmit = async (event) => {
    event.preventDefault();
    if (loginLoading) return;

    setLoginLoading(true);
    setLoginError("");
    setLoginNotice("");

    try {
      if (loginStep === "request") {
        if (loginForm.role === "student") {
          await studentSendOtp({ email: loginForm.email });
        } else {
          await adminLogin({
            email: loginForm.email,
            password: loginForm.password,
          });
        }
        setLoginStep("verify");
        setLoginNotice("OTP sent to your email.");
      } else {
        const response =
          loginForm.role === "student"
            ? await studentVerifyOtp({
                email: loginForm.email,
                otp,
              })
            : await adminVerifyOtp({
                email: loginForm.email,
                otp,
              });

        const emailName = loginForm.email.split("@")[0] || "User";
        const displayName = emailName
          .split(".")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

        localStorage.setItem("authToken", response?.token || "");
        localStorage.setItem(
          "isAdmin",
          response?.is_admin ? "true" : "false",
        );
        localStorage.setItem("userName", displayName);
        localStorage.setItem("userEmail", loginForm.email);

        closeLogin();
        navigate("/dashboard");
      }
    } catch (err) {
      setLoginError(err?.message || "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const overviewTrend = yearlyComparison.filter(
    ({ year }) => Number(year) >= 2021 && Number(year) <= 2025,
  );

  const companiesVisitedTrend = overviewTrend.map(({ year }) => ({
    year,
    companiesVisited: companiesVisitedByYear[year],
  }));

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Insights", href: "#overview" },
    { label: "Recruiters", href: "#recruiters" },
    { label: "Statistics", href: "#highlights" },
    { label: "Contact", href: "#contact" },
  ];

  

  const milestoneItems = [
    {
      icon: GraduationCap,
      val: "845",
      suffix: "+",
      label: "Students Placed",
      sub: "Across all batches",
      color: "text-sky-300",
      border: false,
    },
    {
      icon: Building2,
      val: "112",
      suffix: "+",
      label: "Companies Visited",
      sub: "Top industry names",
      color: "text-emerald-300",
      border: true,
    },
    {
      icon: TrendingUp,
      val: "36.5",
      suffix: " LPA",
      label: "Highest Package",
      sub: "Record CTC offered",
      color: "text-amber-300",
      border: true,
    },
    {
      icon: BarChart2,
      val: "8.6",
      suffix: " LPA",
      label: "Average Package",
      sub: "Consistent growth",
      color: "text-violet-300",
      border: true,
    },
  ];

  const highlightItems = [
    {
      val: "500+",
      label: "Placed in 2024",
      accent: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      val: "90%",
      label: "Placement Rate",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      val: "₹36.5L",
      label: "Peak CTC Offered",
      accent: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      val: "Strong",
      label: "Alumni Network",
      accent: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Recruiters", to: "/placements/companies" },
    { label: "Statistics", to: "/analytics" },
    { label: "Contact TPO", to: "#contact" },
    { label: "Privacy Policy", to: "#" },
  ];

  const footerContacts = [
    {
      Icon: MapPin,
      text: "K. K. Wagh Institute of Engineering Education and Research, Nashik, Maharashtra",
    },
    {
      Icon: Mail,
      text: "placement@kkwagh.edu.in",
      href: "mailto:placement@kkwagh.edu.in",
    },
    {
      Icon: Phone,
      text: "+91 253 251 0371",
      href: "tel:+912532510371",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.08),0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-15">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="KKWIEER"
              className={`h-14 w-auto object-contain sm:h-18 lg:h-22 ${scrolled ? "" : "brightness-0 invert"}`}
            />
            <div
              className={`border-l pl-3 ${scrolled ? "border-slate-200" : "border-white/25"}`}
            >
              <p
                className={`m-0 text-lg font-bold tracking-[0.04em] ${scrolled ? "text-slate-950" : "text-white"}`}
              >
                KKWIEER
              </p>
              <p
                className={`m-0 text-sm font-normal tracking-[0.06em] ${scrolled ? "text-slate-400" : "text-white/65"}`}
              >
                Computer Engineering
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1 md:flex ">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-md px-3.5 py-1.5 text-md font-medium tracking-[0.02em] transition-colors duration-200 ${
                  scrolled
                    ? "text-black hover:bg-slate-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={openLogin}
            className={`hidden rounded-lg border px-5 py-2 text-md font-semibold tracking-[0.03em] transition-all duration-200 hover:-translate-y-0.5 md:inline-flex ${
              scrolled
                ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                : "border-white/70 bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Login →
          </button>

          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 md:hidden ${
              scrolled
                ? "border-slate-200 bg-white text-black"
                : "border-white/40 bg-white/10 text-white"
            }`}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 pb-4 pt-3 backdrop-blur md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/85 transition-colors duration-200 hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLogin();
                }}
                className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
              >
                Login →
              </button>
            </div>
          </div>
        )}
      </nav>

      <section className="relative h-svh min-h-screen overflow-hidden bg-slate-950">
        {heroSlides.map((slideItem, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${slide === index ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slideItem.bg}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-[center_30%]"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-black/55" />

        <div className="relative flex h-full items-center justify-center px-5 pt-24 text-center sm:px-6">
          <div className="w-full max-w-4xl">
            <p className="mb-3 animate-[fadeUp_0.7s_ease_both] text-[clamp(0.95rem,1.8vw,1.2rem)] font-semibold uppercase tracking-[0.22em] text-amber-500 [animation-delay:90ms]">
              Department of
            </p>
            <h1 className="mb-6 animate-[fadeUp_0.7s_ease_both] font-body text-5xl md:text-[clamp(2.2rem,7vw,5.2rem)] font-extrabold leading-[1.05] tracking-[-0.02em]  text-white [animation-delay:140ms]">
              Computer Engineering
            </h1>

            <p className="mx-auto mb-9 max-w-3xl animate-[fadeUp_0.7s_ease_both] text-base leading-8 text-white/70 [animation-delay:260ms] sm:text-lg">
              Explore placement data, top recruiters, and salary
              trends from our campus recruitment cell.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 animate-[fadeUp_0.7s_ease_both] [animation-delay:400ms]">
              <Link to="/placements/overview" className={primaryButtonClass}>
                View Insights <ArrowRight size={15} />
              </Link>
              <button
                onClick={openLogin}
                className={secondaryButtonClass}
              >
                Login to Dashboard
              </button>
            </div>

            
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-1 rounded-full border-0 transition-all duration-300 ${slide === index ? "w-11 bg-amber-500" : "w-7 bg-white/30"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-7 right-9 flex items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.12em] text-white/30">
            Scroll
          </span>
          <ChevronDown size={14} className="text-white/30" />
        </div>
      </section>

      

      <section id="overview" className="bg-[#faf9f7] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-13">
            <p className={sectionLabelClass}>Analytics</p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className={sectionHeadingClass}>
                  Placement Insights <em>Overview</em>
                </h2>
                <p className={sectionSubClass}>
                  Year-wise placement highlights for Computer Engineering
                </p>
              </div>
              <Link
                to="/placements/overview"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4daff] bg-[#eef1ff] px-4 py-2 text-[0.8rem] font-semibold text-indigo-600 transition-colors duration-200 hover:bg-[#e3e8ff]"
              >
                View Full Report <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.07)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="m-0 text-[0.9rem] font-bold text-slate-950">
                    Year-wise Placements
                  </p>
                  <p className="mt-1 text-[0.73rem] text-slate-400">
                    Students placed per academic year
                  </p>
                </div>
                <span className="rounded-full bg-[#eef1ff] px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-indigo-600">
                  2021-25
                </span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart
                  data={overviewTrend}
                  margin={{ top: 20, right: 4, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b56de" />
                      <stop offset="100%" stopColor="#7c99f0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="2 4"
                    stroke="#f0f2f8"
                  />
                  <XAxis
                    dataKey="year"
                    tick={{
                      fontSize: 11,
                      fill: "#94a3b8",
                      fontFamily: "Outfit, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#94a3b8",
                      fontFamily: "Outfit, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip color="#3b56de" />} />
                  <Bar
                    dataKey="placed"
                    fill="url(#placedGrad)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={40}
                  >
                    <LabelList
                      dataKey="placed"
                      position="top"
                      style={{
                        fontSize: 10,
                        fill: "#3b56de",
                        fontWeight: 700,
                        fontFamily: "Outfit, sans-serif",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.07)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="m-0 text-[0.9rem] font-bold text-slate-950">
                    Companies Visited
                  </p>
                  <p className="mt-1 text-[0.73rem] text-slate-400">
                    Recruiters visiting campus each year
                  </p>
                </div>
                <span className="rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-emerald-600">
                  2021-25
                </span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart
                  data={companiesVisitedTrend}
                  margin={{ top: 20, right: 4, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#6ee7b7" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="2 4"
                    stroke="#f0f2f8"
                  />
                  <XAxis
                    dataKey="year"
                    tick={{
                      fontSize: 11,
                      fill: "#94a3b8",
                      fontFamily: "Outfit, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#94a3b8",
                      fontFamily: "Outfit, sans-serif",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip color="#059669" />} />
                  <Bar
                    dataKey="companiesVisited"
                    fill="url(#compGrad)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={40}
                  >
                    <LabelList
                      dataKey="companiesVisited"
                      position="top"
                      style={{
                        fontSize: 10,
                        fill: "#059669",
                        fontWeight: 700,
                        fontFamily: "Outfit, sans-serif",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section id="recruiters" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-13 text-center">
            <p className={sectionLabelClass}>Industry Partners</p>
            <h2 className={sectionHeadingClass}>
              Our Top <em>Recruiters</em>
            </h2>
            <p className="mx-auto mt-2.5 max-w-120 text-[0.85rem] text-slate-500">
              Leading companies that recruit from KKWIEER Computer Engineering
            </p>
          </div>

          <div className="mb-4 overflow-hidden">
            <div className="marquee-track flex w-max items-stretch gap-5 animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused] py-10">
              {[...recruiterHighlights, ...recruiterHighlights].map(
                (company, index) => (
                  <div
                    key={`${company.id}-${index}`}
                    className="flex min-w-32.5 shrink-0 flex-col items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-7 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-600 hover:shadow-[0_8px_24px_rgba(59,86,222,0.12)]"
                  >
                    <div className="flex h-20 items-center justify-center">
                      <img
                        src={company.logo}
                        alt={company.name}
                        loading="lazy"
                        className="max-h-11 max-w-25 object-contain grayscale-20"
                      />
                    </div>
                    <p className="m-0 text-center text-md font-semibold text-slate-600">
                      {company.name}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="marquee-track-rev flex w-max items-stretch gap-5 animate-[marqueeReverse_36s_linear_infinite]">
              {[
                ...recruiterHighlights.slice().reverse(),
                ...recruiterHighlights.slice().reverse(),
              ].map((company, index) => (
                <div
                  key={`${company.id}-rev-${index}`}
                  className="flex min-w-32.5 shrink-0 flex-col items-center gap-2.5 rounded-xl border border-slate-200 bg-[#faf9f7] px-7 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-600 hover:shadow-[0_8px_24px_rgba(59,86,222,0.12)]"
                >
                  <div className="flex h-18 items-center justify-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      loading="lazy"
                      className="max-h-11 max-w-25 object-contain grayscale-20"
                    />
                  </div>
                  <p className="m-0 text-center text-[0.72rem] font-semibold text-slate-600">
                    {company.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="highlights"
        className="relative overflow-hidden bg-slate-950 px-6 py-20"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(59,86,222,0.15)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-20 left-[20%] h-75 w-75 rounded-full bg-[radial-gradient(circle,rgba(232,160,32,0.1)_0%,transparent_65%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-2.5 font-body text-[0.68rem] font-bold uppercase tracking-[0.18em] text-amber-500">
              By The Numbers
            </p>
            <h2 className="font-display text-[clamp(1.7rem,3vw,2.2rem)] font-normal text-white">
              Placement <em>Milestones</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {milestoneItems.map((item) => (
              <div
                key={item.label}
                className={`px-6 py-8 text-center ${item.border ? "border-l border-white/10" : ""}`}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                  <item.icon size={22} className={item.color} />
                </div>
                <p className="mb-1 text-[2.4rem] font-extrabold leading-none tracking-[-0.02em] text-white">
                  <AnimatedCounter target={item.val} suffix={item.suffix} />
                </p>
                <p className="mb-1 text-[0.82rem] font-semibold text-white/75">
                  {item.label}
                </p>
                <p className="m-0 text-[0.72rem] text-white/35">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#070f1c] px-6 pb-8 pt-16">
        <div className="mx-auto max-w-7xl">
          

          <div className="mb-12 grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={logo}
                  alt="KKWagh"
                  className="h-9 w-auto object-contain brightness-0 invert opacity-85"
                />
                <div className="border-l border-white/10 pl-3">
                  <p className="m-0 text-[0.82rem] font-bold text-white">
                    KKWIEER
                  </p>
                  <p className="m-0 text-[0.65rem] tracking-[0.06em] text-white/40">
                    Placement Analytics
                  </p>
                </div>
              </div>
              <p className="mb-5 max-w-70 text-[0.8rem] leading-7 text-white/40">
                Empowering futures through transparent placement data and
                analytics for Computer Engineering students.
              </p>
              <div className="flex gap-2">
                {["in", "tw", "fb", "ig"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[0.65rem] font-bold uppercase text-white/40 transition-all duration-200 hover:bg-indigo-600 hover:text-white"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white/90">
                Quick Links
              </h4>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-1.5 text-[0.82rem] text-white/40 transition-colors duration-200 hover:text-white"
                    >
                      <span className="text-[0.6rem] text-indigo-600">▶</span>{" "}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white/90">
                Contact
              </h4>
              <div className="flex flex-col gap-3.5">
                {footerContacts.map(({ Icon, text, href }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600/15">
                      <Icon size={13} className="text-indigo-400" />
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-[0.8rem] leading-6 text-white/40 transition-colors duration-200 hover:text-white"
                      >
                        {text}
                      </a>
                    ) : (
                      <p className="m-0 text-[0.8rem] leading-6 text-white/40">
                        {text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
            <p className="m-0 text-[0.74rem] text-white/25">
              © 2025 Computer Engineering Department, K. K. Wagh Institute. All
              rights reserved.
            </p>
            <p className="m-0 text-[0.74rem] text-white/20">
              Built by Training & Placement Office
            </p>
          </div>
        </div>
      </footer>

      {loginVisible && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-white/10 px-4 py-8 backdrop-blur-md transition-opacity duration-200 ${
            loginOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className="absolute inset-0"
            onClick={closeLogin}
            aria-hidden="true"
          />
          <div
            className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.35)] transition-all duration-200 ${
              loginOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-3 scale-95 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between bg-slate-900 px-6">
              <div className="flex flex-1 flex-col items-center gap-1">
                <img
                  src={logo}
                  alt="KKWagh"
                  className="h-34 w-auto object-contain brightness-0 invert"
                />
                
              </div>
              <button
                onClick={closeLogin}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10"
                aria-label="Close login"
              >
                <X size={16} />
              </button>
            </div>

            <form className="space-y-4 px-6 py-6" onSubmit={onLoginSubmit}>
              <div>
                <label
                  htmlFor="role"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  Select Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={loginForm.role}
                    onChange={onLoginChange}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={onLoginChange}
                  placeholder="you@kkw.edu.in"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Only @kkwagh.edu.in email IDs are allowed.
                </p>
              </div>

              {loginForm.role === "admin" && loginStep === "request" && (
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={onLoginChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              )}

              {loginStep === "verify" && (
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    OTP Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter the OTP"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              )}

              {loginError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {loginError}
                </div>
              )}

              {loginNotice && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  {loginNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className={`w-full rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_28px_rgba(37,99,235,0.3)] transition-all duration-200 ${
                  loginLoading
                    ? "cursor-not-allowed bg-blue-400"
                    : "bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700"
                }`}
              >
                {loginLoading
                  ? loginStep === "request"
                    ? "Sending..."
                    : "Verifying..."
                  : loginStep === "request"
                    ? "Get OTP"
                    : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
