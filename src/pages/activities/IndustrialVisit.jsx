import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  MapPin, Calendar, Users, User, BookOpen,
  ExternalLink, X, CheckCircle, Filter, Plus,
  Trash2, Pencil, GraduationCap, Loader2, Clock,
} from "lucide-react";
import {
  getIndustrialVisits, createIndustrialVisit,
  registerForVisit, getVisitRegisteredStudents,
} from "../../services/industrialVisitsApi";

const YEARS = ["All", "FY", "SY", "TY", "BE"];
const STATUSES = ["All", "upcoming", "past"];
const YEAR_CHOICES = ["FY", "SY", "TY", "BE"];

const statusConfig = {
  upcoming: { label: "Upcoming", badge: "bg-blue-500 text-white border-blue-500" },
  past:     { label: "Past",     badge: "bg-gray-100 text-gray-600 border-gray-200" },
};

function getStatus(dateStr) {
  return new Date(dateStr) >= new Date(new Date().toDateString()) ? "upcoming" : "past";
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function IndustrialVisit() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registerVisit, setRegisterVisit] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [studentsModal, setStudentsModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVisits = async () => {
    setLoading(true); setError("");
    try { setVisits(await getIndustrialVisits()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVisits(); }, []);

  const filtered = useMemo(() => visits.filter(v => {
    const status = getStatus(v.date);
    const yearMatch = yearFilter === "All" || v.eligible_year === yearFilter;
    const statusMatch = statusFilter === "All" || status === statusFilter;
    return yearMatch && statusMatch;
  }), [visits, yearFilter, statusFilter]);

  const upcoming = filtered.filter(v => getStatus(v.date) === "upcoming");
  const past      = filtered.filter(v => getStatus(v.date) === "past");

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const d = new Date(); d.setHours(+h, +m);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Industrial Visits</h1>
            <p className="text-sm text-gray-500 mt-0.5">Scheduled industry exposure visits for CE students</p>
          </div>
          {isAdmin && (
            <button onClick={() => setAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all">
              <Plus size={15} /> Add Visit
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-2 text-gray-400 shrink-0">
              <Filter size={14} />
              <span className="text-sm font-medium text-gray-500">Filters</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-400">Year</label>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 min-w-[110px]">
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-400">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 min-w-[130px]">
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s === "All" ? "All" : statusConfig[s].label}</option>
                ))}
              </select>
            </div>
            {(yearFilter !== "All" || statusFilter !== "All") && (
              <button onClick={() => { setYearFilter("All"); setStatusFilter("All"); }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium self-end pb-1.5">
                <X size={13} /> Reset
              </button>
            )}
            <span className="ml-auto text-xs text-gray-400 self-end pb-1.5">
              {filtered.length} visit{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* Upcoming */}
        {(statusFilter === "All" || statusFilter === "upcoming") && upcoming.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Upcoming Visits</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcoming.map(v => (
                <VisitCard key={v.id} visit={v} isAdmin={isAdmin}
                  isRegistered={registeredIds.has(v.id)}
                  onRegister={() => setRegisterVisit(v)}
                  onViewStudents={() => setStudentsModal(v)}
                  formatDate={formatDate} formatTime={formatTime} />
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {(statusFilter === "All" || statusFilter === "past") && past.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Past Visits</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {past.map(v => (
                <VisitCard key={v.id} visit={v} isAdmin={isAdmin}
                  isRegistered={registeredIds.has(v.id)}
                  onRegister={null}
                  onViewStudents={() => setStudentsModal(v)}
                  formatDate={formatDate} formatTime={formatTime} />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading industrial visits...</span>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 text-center">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">No industrial visits found for the selected filters.</p>
          </div>
        )}
      </div>

      {registerVisit && (
        <RegisterModal visit={registerVisit}
          onClose={() => setRegisterVisit(null)}
          onRegistered={() => setRegisteredIds(prev => new Set([...prev, registerVisit.id]))}
          formatDate={formatDate} />
      )}
      {studentsModal && (
        <StudentsModal visit={studentsModal} onClose={() => setStudentsModal(null)} />
      )}
      {addModal && (
        <AddVisitModal onClose={() => setAddModal(false)} onCreated={fetchVisits} />
      )}
    </DashboardLayout>
  );
}

function VisitCard({ visit, isAdmin, isRegistered, onRegister, onViewStudents, formatDate, formatTime }) {
  const status = getStatus(visit.date);
  const cfg = statusConfig[status];
  const accompany = visit.accompanying_faculty_details ?? visit.accompanying_faculty ?? [];

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
      status === "upcoming" ? "border-blue-100" : "border-gray-100"
    }`}>
      <div className={`h-1 w-full ${status === "upcoming" ? "bg-blue-500" : "bg-gray-200"}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 border ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
            {visit.eligible_year}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{visit.industry_name}</h3>

        <div className="flex items-start gap-1.5 mb-4">
          <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed flex-1">{visit.address}</p>
          <a href={visit.location_link} target="_blank" rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            <ExternalLink size={10} /> Map
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
          <Detail icon={Calendar} label="Date"        value={formatDate(visit.date)} />
          <Detail icon={Clock}    label="Time"        value={formatTime(visit.time)} />
          <Detail icon={User}     label="Coordinator" value={visit.faculty_coordinater} />
          <Detail icon={Users}    label="Accompanying"
            value={accompany.length ? accompany.map(f => f.name ?? f).join(", ") : "—"} />
        </div>

        <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-4 border border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
            <BookOpen size={10} /> Objective
          </p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{visit.objective}</p>
        </div>

        {isAdmin ? (
          <div className="flex justify-end gap-2">
            <button onClick={onViewStudents}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-green-500 text-white border border-green-600 transition-colors">
              <GraduationCap size={13} /> View Students
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-blue-500 text-white border border-blue-600 transition-colors">
              <Pencil size={13} /> Edit
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-red-500 text-white border border-red-600 transition-colors">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        ) : (
          onRegister ? (
            <button onClick={onRegister} disabled={isRegistered}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isRegistered
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md"
              }`}>
              {isRegistered ? "Already Registered" : "Register Now"}
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-gray-50 text-gray-400 border border-gray-100">
              Registration Closed
            </div>
          )
        )}
      </div>
    </div>
  );
}

function RegisterModal({ visit, onClose, onRegistered, formatDate }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await registerForVisit(visit.id);
      onRegistered?.();
      setSubmitted(true);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Register</p>
            <h2 className="text-base font-bold text-gray-900">{visit.industry_name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(visit.date)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        {submitted ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <CheckCircle size={48} className="text-emerald-500" />
            <p className="text-lg font-bold text-gray-900">Registered Successfully!</p>
            <p className="text-sm text-gray-500">You're registered for the visit to <span className="font-medium text-gray-700">{visit.industry_name}</span>.</p>
            <button onClick={onClose} className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="bg-indigo-50 rounded-xl px-4 py-3 text-xs text-indigo-700 space-y-1">
              <p><span className="font-semibold">Industry:</span> {visit.industry_name}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(visit.date)}</p>
              <p><span className="font-semibold">Coordinator:</span> {visit.faculty_coordinater}</p>
              <p><span className="font-semibold">Eligible Year:</span> {visit.eligible_year}</p>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Registering..." : "Confirm Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function StudentsModal({ visit, onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getVisitRegisteredStudents(visit.id)
      .then(setStudents)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [visit.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Registered Students</p>
            <h2 className="text-base font-bold text-gray-900">{visit.industry_name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          {loading && (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading...</span>
            </div>
          )}
          {error && <p className="text-sm text-red-500 text-center py-8">{error}</p>}
          {!loading && !error && students.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No students registered yet.</p>
          )}
          {!loading && !error && students.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left pb-2 font-semibold">#</th>
                  <th className="text-left pb-2 font-semibold">Email</th>
                  <th className="text-left pb-2 font-semibold">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 text-gray-400">{i + 1}</td>
                    <td className="py-2 font-medium text-gray-800">{s.student_email}</td>
                    <td className="py-2 text-gray-500 text-xs">
                      {new Date(s.registered_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function AddVisitModal({ onClose, onCreated }) {
  const createdBy = localStorage.getItem("userEmail") || "";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    industry_name: "", address: "", location_link: "",
    date: "", time: "", eligible_year: "",
    faculty_coordinater: "", objective: "",
  });
  const [facultyRows, setFacultyRows] = useState([{ name: "", email: "" }]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const updateFaculty = (i, field, value) =>
    setFacultyRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  const addFacultyRow = () => setFacultyRows(r => [...r, { name: "", email: "" }]);
  const removeFacultyRow = (i) => setFacultyRows(r => r.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eligible_year) return;
    setLoading(true); setApiError("");
    try {
      await createIndustrialVisit({ ...form, accompanying_faculty: facultyRows });
      onCreated?.();
      setSubmitted(true);
    } catch (err) { setApiError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Admin</p>
            <h2 className="text-base font-bold text-gray-900">Add Industrial Visit</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        {submitted ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle size={48} className="text-emerald-500" />
            <p className="text-lg font-bold text-gray-900">Visit Added!</p>
            <p className="text-sm text-gray-500">The industrial visit has been saved successfully.</p>
            <button onClick={onClose} className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Industry Name</label>
                <input required value={form.industry_name} onChange={e => set("industry_name", e.target.value)}
                  placeholder="e.g. Tata Consultancy Services" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Address</label>
                <textarea required value={form.address} onChange={e => set("address", e.target.value)}
                  placeholder="Full address" rows={2} className={`${inputCls} resize-none`} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Location Link</label>
                <input required type="url" value={form.location_link} onChange={e => set("location_link", e.target.value)}
                  placeholder="https://maps.google.com/..." className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
                <input required type="date" value={form.date} onChange={e => set("date", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Time</label>
                <input required type="time" value={form.time} onChange={e => set("time", e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-2 block">Eligible Year</label>
                <div className="flex gap-2">
                  {YEAR_CHOICES.map(y => (
                    <button key={y} type="button" onClick={() => set("eligible_year", y)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                        form.eligible_year === y
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                      }`}>{y}</button>
                  ))}
                </div>
                {!form.eligible_year && <p className="text-xs text-red-400 mt-1">Select a year</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Faculty Coordinator</label>
                <input required value={form.faculty_coordinater} onChange={e => set("faculty_coordinater", e.target.value)}
                  placeholder="e.g. Prof. Sneha Patil" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-600">Accompanying Faculty</label>
                  <button type="button" onClick={addFacultyRow}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    <Plus size={12} /> Add Faculty
                  </button>
                </div>
                <div className="space-y-2">
                  {facultyRows.map((row, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={row.name} onChange={e => updateFaculty(i, "name", e.target.value)}
                        placeholder="Name" required
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      <input value={row.email} onChange={e => updateFaculty(i, "email", e.target.value)}
                        placeholder="Email" type="email" required
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      {facultyRows.length > 1 && (
                        <button type="button" onClick={() => removeFacultyRow(i)} className="text-red-400 hover:text-red-600">
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Objective</label>
                <textarea required value={form.objective} onChange={e => set("objective", e.target.value)}
                  placeholder="Describe the objective of this visit..." rows={3}
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Created By</label>
                <input readOnly value={createdBy}
                  className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
            </div>
            {apiError && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{apiError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={!form.eligible_year || loading}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Saving..." : "Add Visit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon size={13} className="text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-xs font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}