import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  Trophy, Users, MapPin, Calendar, Building2,
  Filter, X, Crown, Loader2, Plus, CheckCircle, Trash2,
} from "lucide-react";
import { getHackathons, createHackathon, deleteHackathon } from "../../services/achievementsApi";

const NATURES = ["All", "Hackathon", "Project Competition"];
const LEVELS  = ["All", "Department", "Institute", "University", "State", "National", "International"];
const PRIZES  = ["All", "First", "Second", "Third", "Consolation", "Participation"];

const prizeConfig = {
  First:         { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "🥇" },
  Second:        { color: "bg-gray-100 text-gray-600 border-gray-200",       icon: "🥈" },
  Third:         { color: "bg-orange-100 text-orange-700 border-orange-200", icon: "🥉" },
  Consolation:   { color: "bg-blue-50 text-blue-600 border-blue-200",        icon: "🏅" },
  Participation: { color: "bg-gray-50 text-gray-500 border-gray-200",        icon: "📜" },
};

const levelColor = {
  Department:    "bg-gray-100 text-gray-600",
  Institute:     "bg-indigo-50 text-indigo-600",
  University:    "bg-blue-50 text-blue-600",
  State:         "bg-emerald-50 text-emerald-700",
  National:      "bg-orange-50 text-orange-700",
  International: "bg-red-50 text-red-700",
};

export default function Hackathons() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [natureFilter, setNatureFilter] = useState("All");
  const [levelFilter,  setLevelFilter]  = useState("All");
  const [prizeFilter,  setPrizeFilter]  = useState("All");
  const [addModal,     setAddModal]     = useState(false);
  const [hackathons,   setHackathons]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  const fetchHackathons = () => {
    setLoading(true); setError("");
    getHackathons()
      .then(setHackathons)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHackathons(); }, []);

  const filtered = useMemo(() => hackathons.filter(h => {
    const natureMatch = natureFilter === "All" || h.nature === natureFilter;
    const levelMatch  = levelFilter  === "All" || h.level  === levelFilter;
    const prizeMatch  = prizeFilter  === "All" || h.prize  === prizeFilter;
    return natureMatch && levelMatch && prizeMatch;
  }), [hackathons, natureFilter, levelFilter, prizeFilter]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const reset = () => { setNatureFilter("All"); setLevelFilter("All"); setPrizeFilter("All"); };
  const isFiltered = natureFilter !== "All" || levelFilter !== "All" || prizeFilter !== "All";

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hackathons & Project Competitions</h1>
            <p className="text-sm text-gray-500 mt-0.5">Student achievements in hackathons and project competitions</p>
          </div>
          {isAdmin && (
            <button onClick={() => setAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all">
              <Plus size={15} /> Add Entry
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
            {[
              { label: "Nature", value: natureFilter, set: setNatureFilter, options: NATURES },
              { label: "Level",  value: levelFilter,  set: setLevelFilter,  options: LEVELS },
              { label: "Prize",  value: prizeFilter,  set: setPrizeFilter,  options: PRIZES },
            ].map(({ label, value, set, options }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-400">{label}</label>
                <select value={value} onChange={e => set(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 min-w-[150px]">
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            {isFiltered && (
              <button onClick={reset}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium self-end pb-1.5">
                <X size={13} /> Reset
              </button>
            )}
            <span className="ml-auto text-xs text-gray-400 self-end pb-1.5">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading hackathons...</span>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 text-center">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">No hackathons found for the selected filters.</p>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(h => (
              <HackathonCard key={h.id} h={h}
                isAdmin={isAdmin}
                onDelete={() => deleteHackathon(h.id).then(fetchHackathons).catch(e => alert(e.message))}
                formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>

    

      {/* Add modal */}
      {addModal && (
        <AddHackathonModal onClose={() => setAddModal(false)} onCreated={fetchHackathons} />
      )}
    </DashboardLayout>
  );
}

function HackathonCard({ h, formatDate, isAdmin, onDelete }) {
  const prize    = prizeConfig[h.prize]  ?? prizeConfig.Participation;
  const lvlColor = levelColor[h.level]   ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-1 w-full bg-indigo-500" />
      <div className="p-5">

        {/* Heading */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 leading-snug">{h.hackathon_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{h.nature}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-semibold text-indigo-600">Team: {h.team_name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${lvlColor}`}>{h.level}</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${prize.color}`}>
              {prize.icon} {h.prize}
            </span>
            {isAdmin && (
              <button onClick={onDelete}
                className="flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded transition-colors mt-0.5">
                <Trash2 size={10} /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
          <Detail icon={Building2} label="Organized by" value={h.organized_by} />
          <Detail icon={MapPin}    label="Venue"        value={h.venue} />
          <Detail icon={Calendar}  label="Date"         value={formatDate(h.date)} />
          <Detail icon={Trophy}    label="Remark"       value={h.remark || "—"} />
        </div>

        {/* Problem statement */}
        <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-4 border border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Problem Statement</p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{h.problem_statement}</p>
        </div>

        {/* Team members inline */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
            <Users size={12} className="text-gray-400" />
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              Team: {h.team_name} · {(h.team_members ?? []).length} member{(h.team_members ?? []).length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {(h.team_members ?? []).length === 0 ? (
              <p className="text-xs text-gray-400 px-3 py-2">No members added.</p>
            ) : (
              (h.team_members ?? []).map((m, i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-2 ${
                  m.name === h.team_leader ? "bg-indigo-50" : "bg-white"
                }`}>
                  <div className="flex items-center gap-1.5">
                    {m.name === h.team_leader && <Crown size={11} className="text-indigo-600 shrink-0" />}
                    <span className="text-xs font-medium text-gray-800">{m.name}</span>
                    {m.name === h.team_leader && (
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">Leader</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">{m.student_class}</span>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">Div {m.division}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function AddHackathonModal({ onClose, onCreated }) {
  const NATURES = ["Hackathon", "Project Competition"];
  const LEVELS  = ["Department", "Institute", "University", "State", "National", "International"];
  const PRIZES  = ["First", "Second", "Third", "Consolation", "Participation"];

  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState("");
  const [members,   setMembers]   = useState([{ name: "", student_class: "", division: "" }]);
  const [form, setForm] = useState({
    hackathon_name: "", team_name: "", team_leader: "",
    nature: "Hackathon", level: "Institute", organized_by: "",
    venue: "", date: "", problem_statement: "",
    prize: "Participation", remark: "",
  });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const updateMember = (i, f, v) => setMembers(ms => ms.map((m, idx) => idx === i ? { ...m, [f]: v } : m));
  const addMember    = () => setMembers(ms => [...ms, { name: "", student_class: "", division: "" }]);
  const removeMember = (i) => setMembers(ms => ms.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setApiError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      members.forEach((m, i) => {
        fd.append(`team_members[${i}][name]`, m.name);
        fd.append(`team_members[${i}][student_class]`, m.student_class);
        fd.append(`team_members[${i}][division]`, m.division);
      });
      await createHackathon(fd);
      onCreated?.();
      setSubmitted(true);
    } catch (err) { setApiError(err.message); }
    finally { setLoading(false); }
  };

  const inputCls  = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200";
  const selectCls = `${inputCls} bg-white`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Admin</p>
            <h2 className="text-base font-bold text-gray-900">Add Hackathon / Competition</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        {submitted ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <CheckCircle size={48} className="text-emerald-500" />
            <p className="text-lg font-bold text-gray-900">Entry Added!</p>
            <p className="text-sm text-gray-500">The hackathon entry has been saved successfully.</p>
            <button onClick={onClose} className="mt-2 bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Hackathon / Competition Name</label>
                <input required value={form.hackathon_name} onChange={e => set("hackathon_name", e.target.value)}
                  placeholder="e.g. Smart India Hackathon 2026" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Team Name</label>
                <input required value={form.team_name} onChange={e => set("team_name", e.target.value)}
                  placeholder="e.g. CodeStorm" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Team Leader</label>
                <input required value={form.team_leader} onChange={e => set("team_leader", e.target.value)}
                  placeholder="e.g. Anjali Sharma" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nature</label>
                <select value={form.nature} onChange={e => set("nature", e.target.value)} className={selectCls}>
                  {NATURES.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Level</label>
                <select value={form.level} onChange={e => set("level", e.target.value)} className={selectCls}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Organized By</label>
                <input required value={form.organized_by} onChange={e => set("organized_by", e.target.value)}
                  placeholder="e.g. IIT Bombay" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Venue</label>
                <input required value={form.venue} onChange={e => set("venue", e.target.value)}
                  placeholder="e.g. IIT Bombay, Mumbai" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
                <input required type="date" value={form.date} onChange={e => set("date", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Prize</label>
                <select value={form.prize} onChange={e => set("prize", e.target.value)} className={selectCls}>
                  {PRIZES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Remark</label>
                <input value={form.remark} onChange={e => set("remark", e.target.value)}
                  placeholder="e.g. Cash prize ₹25,000 + Trophy" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Problem Statement</label>
                <textarea required value={form.problem_statement} onChange={e => set("problem_statement", e.target.value)}
                  rows={3} placeholder="Describe the problem statement..." className={`${inputCls} resize-none`} />
              </div>

              {/* Team Members */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-600">Team Members</label>
                  <button type="button" onClick={addMember}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    <Plus size={12} /> Add Member
                  </button>
                </div>
                <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={m.name} onChange={e => updateMember(i, "name", e.target.value)}
                        placeholder="Name" required
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      <input value={m.student_class} onChange={e => updateMember(i, "student_class", e.target.value)}
                        placeholder="Class" required
                        className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      <input value={m.division} onChange={e => updateMember(i, "division", e.target.value)}
                        placeholder="Div" required
                        className="w-16 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      {members.length > 1 && (
                        <button type="button" onClick={() => removeMember(i)} className="text-red-400 hover:text-red-600 shrink-0">
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {apiError && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{apiError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Saving..." : "Add Entry"}
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
        <p className="text-xs font-medium text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}