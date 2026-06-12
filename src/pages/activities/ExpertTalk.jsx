import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  Calendar, Clock, Building2, User, BookOpen, Tag,
  MapPin, Users, X, CheckCircle, ChevronDown, Filter,
  Plus, Trash2, Pencil, GraduationCap, Loader2,
} from "lucide-react";
import {
  getExpertTalks, createExpertTalk, registerForTalk, getRegisteredStudents,
} from "../../services/expertTalksApi";

const YEARS = ["All", "FY", "SY", "TY", "BE"];
const STATUSES = ["All", "ongoing", "past"];

const statusConfig = {
  ongoing: { label: "Upcoming / Ongoing", badge: "bg-blue-500 text-white border-blue-500" },
  past:    { label: "Past",               badge: "bg-gray-100 text-gray-600 border-gray-200" },
};

// Derive status from date field
function getTalkStatus(dateStr) {
  return new Date(dateStr) >= new Date(new Date().toDateString()) ? "ongoing" : "past";
}

function RegisterModal({ talk, onClose, onRegistered }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerForTalk(talk.id);
      onRegistered?.();
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Register</p>
            <h2 className="text-base font-bold text-gray-900 leading-snug">{talk.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{talk.speaker_name} · {talk.organization}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <CheckCircle size={48} className="text-emerald-500" />
            <p className="text-lg font-bold text-gray-900">Registered Successfully!</p>
            <p className="text-sm text-gray-500">You're registered for <span className="font-medium text-gray-700">{talk.title}</span>.</p>
            <button onClick={onClose} className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-gray-600">
              Confirm your registration for <span className="font-semibold text-gray-800">{talk.title}</span> by <span className="font-semibold text-gray-800">{talk.speaker_name}</span>.
            </p>
            <div className="bg-indigo-50 rounded-xl px-4 py-3 text-xs text-indigo-700 space-y-1">
              <p><span className="font-semibold">Date:</span> {new Date(talk.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
              <p><span className="font-semibold">Venue:</span> {talk.location}</p>
              <p><span className="font-semibold">Duration:</span> {talk.duration} min</p>
            </div>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Registering..." : "Confirm Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ExpertTalk() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registerTalk, setRegisterTalk] = useState(null);
  const [registeredModal, setRegisteredModal] = useState(null);
  const [addModal, setAddModal] = useState(false);

  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeredIds, setRegisteredIds] = useState(new Set());

  const fetchTalks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getExpertTalks();
      setTalks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTalks(); }, []);

  const filtered = useMemo(() => {
    return talks.filter(t => {
      const status = getTalkStatus(t.date);
      const yearMatch = yearFilter === "All" || t.eligible_year === yearFilter;
      const statusMatch = statusFilter === "All" || status === statusFilter;
      return yearMatch && statusMatch;
    });
  }, [talks, yearFilter, statusFilter]);

  const ongoing = filtered.filter(t => getTalkStatus(t.date) === "ongoing");
  const past    = filtered.filter(t => getTalkStatus(t.date) === "past");

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

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Expert Talks</h1>
            <p className="text-sm text-gray-500 mt-0.5">Industry expert sessions, guest lectures, and knowledge sessions for CE students</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all">
              <Plus size={15} />
              Add Expert Talk
            </button>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">

            {/* Label */}
            <div className="flex items-center gap-2 text-gray-400 shrink-0">
              <Filter size={14} />
              <span className="text-sm font-medium text-gray-500">Filters</span>
            </div>

            {/* Year */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-400">Year</label>
              <select
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 min-w-[110px]"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y === "All" ? "All" : y}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-400">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 min-w-[160px]"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s === "All" ? "All" : statusConfig[s].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            {(yearFilter !== "All" || statusFilter !== "All") && (
              <button
                onClick={() => { setYearFilter("All"); setStatusFilter("All"); }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium self-end pb-1.5"
              >
                <X size={13} /> Reset
              </button>
            )}

            <span className="ml-auto text-xs text-gray-400 self-end pb-1.5">
              {filtered.length} talk{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* ── Upcoming / Ongoing ── */}
        {(statusFilter === "All" || statusFilter === "ongoing") && ongoing.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Upcoming & Ongoing</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ongoing.map(talk => (
                <TalkCard key={talk.id} talk={talk}
                  onRegister={() => setRegisterTalk(talk)}
                  isRegistered={registeredIds.has(talk.id)}
                  formatDate={formatDate} formatTime={formatTime}
                  isAdmin={isAdmin} onViewRegistered={() => setRegisteredModal(talk)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Past ── */}
        {(statusFilter === "All" || statusFilter === "past") && past.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Past Talks</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {past.map(talk => (
                <TalkCard key={talk.id} talk={talk} onRegister={null}
                  formatDate={formatDate} formatTime={formatTime}
                  isAdmin={isAdmin} onViewRegistered={() => setRegisteredModal(talk)} />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading expert talks...</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">No expert talks found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* Registration modal */}
      {registerTalk && (
        <RegisterModal
          talk={registerTalk}
          onClose={() => setRegisterTalk(null)}
          onRegistered={() => setRegisteredIds(prev => new Set([...prev, registerTalk.id]))}
        />
      )}

      {/* Registered students modal (admin) */}
      {registeredModal && (
        <RegisteredStudentsModal talk={registeredModal} onClose={() => setRegisteredModal(null)} />
      )}

      {/* Add Expert Talk modal (admin) */}
      {addModal && (
        <AddExpertTalkModal onClose={() => setAddModal(false)} onCreated={fetchTalks} />
      )}
    </DashboardLayout>
  );
}

function TalkCard({ talk, onRegister, formatDate, formatTime, isAdmin, onViewRegistered, isRegistered }) {
  const status = getTalkStatus(talk.date);
  const cfg = statusConfig[status];

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
      status === "ongoing" ? "border-emerald-100" : "border-gray-100"
    }`}>
      {/* Top accent bar */}
      <div className={`h-1 w-full ${status === "ongoing" ? "bg-blue-500" : "bg-gray-200"}`} />

      <div className="p-5">
        {/* Status + year badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 border ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
            {talk.eligible_year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-3">{talk.title}</h3>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <Detail icon={User}      label="Speaker"      value={talk.speaker_name} />
          <Detail icon={Building2} label="Organisation" value={talk.organization} />
          <Detail icon={Tag}       label="Topic"        value={talk.topic} />
          <Detail icon={BookOpen}  label="Subject"      value={talk.subject} />
          <Detail icon={Calendar}  label="Date"         value={formatDate(talk.date)} />
          <Detail icon={Clock}     label="Time · Duration" value={`${formatTime(talk.time)} · ${talk.duration} min`} />
          <Detail icon={MapPin}    label="Venue"        value={talk.location} />
          <Detail icon={User}      label="Faculty"      value={talk.faculty} />
        </div>

        {/* Admin actions */}
        {isAdmin ? (
          <div className="flex justify-end gap-2">
            <button
              onClick={onViewRegistered}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-green-500 text-white border border-green-200"
            >
              <GraduationCap size={13} />
              View Students
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-blue-500 text-white border border-blue-200">
              <Pencil size={13} />
              Edit
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-red-500 text-white border border-red-200">
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        ) : (
          onRegister ? (
            <button
              onClick={onRegister}
              disabled={isRegistered}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isRegistered
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md"
              }`}
            >
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

function AddExpertTalkModal({ onClose, onCreated }) {
  const ELIGIBLE_YEARS = ["FY", "SY", "TY", "BE"];
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    title: "", speaker_name: "", organization: "", topic: "",
    subject: "", faculty: "", date: "", time: "", duration: "",
    location: "", eligible_year: "",
  });

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eligible_year) return;
    setLoading(true);
    setApiError("");
    try {
      await createExpertTalk({
        ...form,
        duration: Number(form.duration),
      });
      setSubmitted(true);
      onCreated?.();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            
            <h2 className="text-base font-bold text-gray-900">Add Expert Talk</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle size={48} className="text-emerald-500" />
            <p className="text-lg font-bold text-gray-900">Expert Talk Added!</p>
            <p className="text-sm text-gray-500">The talk has been saved successfully.</p>
            <button onClick={onClose} className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Title</label>
                <input required value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="e.g. Introduction to Machine Learning" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Speaker Name</label>
                <input required value={form.speaker_name} onChange={e => set("speaker_name", e.target.value)}
                  placeholder="e.g. Dr. Rahul Mehta" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Organization</label>
                <input required value={form.organization} onChange={e => set("organization", e.target.value)}
                  placeholder="e.g. IIT Bombay" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Topic</label>
                <input required value={form.topic} onChange={e => set("topic", e.target.value)}
                  placeholder="e.g. Deep Learning" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
                <input required value={form.subject} onChange={e => set("subject", e.target.value)}
                  placeholder="e.g. Artificial Intelligence" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Faculty Coordinator</label>
                <input required value={form.faculty} onChange={e => set("faculty", e.target.value)}
                  placeholder="e.g. Prof. Sneha Patil" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Location / Venue</label>
                <input required value={form.location} onChange={e => set("location", e.target.value)}
                  placeholder="e.g. Seminar Hall A" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
                <input required type="date" value={form.date} onChange={e => set("date", e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Time</label>
                <input required type="time" value={form.time} onChange={e => set("time", e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Duration</label>
                <input required value={form.duration} onChange={e => set("duration", e.target.value)}
                  placeholder="e.g. 1.5 hrs" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-2 block">Eligible Year</label>
                <div className="flex gap-2 flex-wrap">
                  {ELIGIBLE_YEARS.map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => set("eligible_year", y)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                        form.eligible_year === y
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {!form.eligible_year && (
                  <p className="text-xs text-red-400 mt-1">Select a year</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={!form.eligible_year || loading}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Saving..." : "Add Talk"}
              </button>
            </div>
            {apiError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{apiError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function RegisteredStudentsModal({ talk, onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRegisteredStudents(talk.id)
      .then(setStudents)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [talk.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Registered Students</p>
            <h2 className="text-base font-bold text-gray-900 leading-snug">{talk.title}</h2>
           
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Student list */}
        <div className="overflow-y-auto flex-1 p-5">
          {loading && (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500 text-center py-8">{error}</p>
          )}
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

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon size={13} className="text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-xs font-medium text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}