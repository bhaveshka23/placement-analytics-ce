import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { deletePlacement, getCompanies, lookupPlacement, updatePlacement, uploadPlacement } from '../services/placementsApi';
import { deleteInternship, getInternshipCompanies, getInternshipMentors, lookupInternship, updateInternship, uploadInternship } from '../services/internshipsApi';

const ACTION_LABELS = {
  upload: 'Upload Data',
  edit: 'Edit Data',
  delete: 'Delete Data',
  view: 'View Data',
  add: 'Add Data',
};

const SCOPE_LABELS = {
  placements: 'Placements',
  internships: 'Internships',
};

export default function AdminAction() {
  const { action, scope } = useParams();
  const [companies, setCompanies] = useState([]);
  const [companyError, setCompanyError] = useState('');
  const [companyLoading, setCompanyLoading] = useState(false);
  const [mentorOptions, setMentorOptions] = useState([]);
  const [mentorError, setMentorError] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);
  const [placementForm, setPlacementForm] = useState({
    prn: '',
    name: '',
    location: '',
    package: '',
    year: '',
    company: '',
  });
  const [internshipForm, setInternshipForm] = useState({
    name: '',
    location: '',
    stipend: '',
    year: '',
    company: '',
    mode: 'offline',
    ppoOffered: 'no',
    mentor: '',
  });
  const [uploadNotice, setUploadNotice] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupNotice, setLookupNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [internshipLookupLoading, setInternshipLookupLoading] = useState(false);
  const [internshipLookupError, setInternshipLookupError] = useState('');
  const [internshipLookupNotice, setInternshipLookupNotice] = useState('');
  const [internshipEditingId, setInternshipEditingId] = useState(null);

  const title = useMemo(() => {
    const actionLabel = ACTION_LABELS[action] || 'Admin Action';
    const scopeLabel = SCOPE_LABELS[scope] || 'Data';
    return `${actionLabel} - ${scopeLabel}`;
  }, [action, scope]);

  useEffect(() => {
    let active = true;

    async function loadCompanies() {
      if (!['upload', 'edit', 'add'].includes(action)) return;
      setCompanyLoading(true);
      setCompanyError('');
      try {
        const response = scope === 'internships'
          ? await getInternshipCompanies()
          : await getCompanies();
        if (active) {
          setCompanies(response.companies || []);
        }
      } catch (err) {
        if (active) {
          setCompanies([]);
          setCompanyError(err?.message || 'Unable to load companies.');
        }
      } finally {
        if (active) {
          setCompanyLoading(false);
        }
      }
    }

    loadCompanies();
    return () => {
      active = false;
    };
  }, [action, scope]);

  useEffect(() => {
    let active = true;

    async function loadMentors() {
      if (!['upload', 'edit', 'add'].includes(action) || scope !== 'internships') return;
      setMentorLoading(true);
      setMentorError('');
      try {
        const response = await getInternshipMentors();
        if (active) {
          setMentorOptions(response.mentors || []);
        }
      } catch (err) {
        if (active) {
          setMentorOptions([]);
          setMentorError(err?.message || 'Unable to load mentors.');
        }
      } finally {
        if (active) {
          setMentorLoading(false);
        }
      }
    }

    loadMentors();
    return () => {
      active = false;
    };
  }, [action, scope]);

  const onPlacementChange = (event) => {
    const { name, value } = event.target;
    setPlacementForm((prev) => ({ ...prev, [name]: value }));
  };

  const onLookupPlacement = async (event) => {
    event.preventDefault();
    setLookupError('');
    setLookupNotice('');
    setEditingId(null);

    if (!placementForm.prn && !placementForm.name) {
      setLookupError('Enter PRN or Name to search.');
      return;
    }

    setLookupLoading(true);
    try {
      const data = await lookupPlacement({
        prn: placementForm.prn,
        name: placementForm.name,
      });
      setEditingId(data.id);
      setPlacementForm({
        prn: data.prn || '',
        name: data.name || '',
        location: data.location || '',
        package: data.package || '',
        year: data.year || '',
        company: data.company || '',
      });
      setLookupNotice('Placement loaded. You can edit or delete it now.');
    } catch (err) {
      setLookupError(err?.message || 'Unable to find placement.');
    } finally {
      setLookupLoading(false);
    }
  };

  const onUpdatePlacement = async () => {
    if (!editingId) return;
    setUploadNotice('');
    setUploadError('');
    setUploadLoading(true);
    try {
      await updatePlacement(editingId, {
        name: placementForm.name,
        location: placementForm.location,
        package: placementForm.package,
        year: placementForm.year,
        company: placementForm.company,
      });
      setUploadNotice('Placement updated successfully.');
    } catch (err) {
      setUploadError(err?.message || 'Unable to update placement.');
    } finally {
      setUploadLoading(false);
    }
  };

  const onDeletePlacement = async () => {
    if (!editingId) return;
    setUploadNotice('');
    setUploadError('');
    setUploadLoading(true);
    try {
      await deletePlacement(editingId);
      setUploadNotice('Placement deleted successfully.');
      setEditingId(null);
      setPlacementForm({
        prn: '',
        name: '',
        location: '',
        package: '',
        year: '',
        company: '',
      });
    } catch (err) {
      setUploadError(err?.message || 'Unable to delete placement.');
    } finally {
      setUploadLoading(false);
    }
  };

  const onInternshipChange = (event) => {
    const { name, value } = event.target;
    setInternshipForm((prev) => ({ ...prev, [name]: value }));
  };

  const onLookupInternship = async (event) => {
    event.preventDefault();
    setInternshipLookupError('');
    setInternshipLookupNotice('');
    setInternshipEditingId(null);

    if (!internshipForm.name) {
      setInternshipLookupError('Enter Name to search.');
      return;
    }

    setInternshipLookupLoading(true);
    try {
      const data = await lookupInternship({
        name: internshipForm.name,
        year: internshipForm.year,
      });
      setInternshipEditingId(data.id);
      setInternshipForm({
        name: data.name || '',
        location: data.location || '',
        stipend: data.stipend || '',
        year: data.year || '',
        company: data.company || '',
        mode: data.mode || 'offline',
        ppoOffered: data.ppo_offered ? 'yes' : 'no',
        mentor: data.mentor || '',
      });
      setInternshipLookupNotice('Internship loaded. You can edit or delete it now.');
    } catch (err) {
      setInternshipLookupError(err?.message || 'Unable to find internship.');
    } finally {
      setInternshipLookupLoading(false);
    }
  };

  const onUpdateInternship = async () => {
    if (!internshipEditingId) return;
    setUploadNotice('');
    setUploadError('');
    setUploadLoading(true);
    try {
      await updateInternship(internshipEditingId, {
        name: internshipForm.name,
        location: internshipForm.location,
        stipend: internshipForm.stipend,
        year: internshipForm.year,
        company: internshipForm.company,
        mode: internshipForm.mode,
        mentor: internshipForm.mentor,
        ppo_offered: internshipForm.ppoOffered === 'yes' ? 1 : 0,
      });
      setUploadNotice('Internship updated successfully.');
    } catch (err) {
      setUploadError(err?.message || 'Unable to update internship.');
    } finally {
      setUploadLoading(false);
    }
  };

  const onDeleteInternship = async () => {
    if (!internshipEditingId) return;
    setUploadNotice('');
    setUploadError('');
    setUploadLoading(true);
    try {
      await deleteInternship(internshipEditingId);
      setUploadNotice('Internship deleted successfully.');
      setInternshipEditingId(null);
      setInternshipForm({
        name: '',
        location: '',
        stipend: '',
        year: '',
        company: '',
        mode: 'offline',
        ppoOffered: 'no',
        mentor: '',
      });
    } catch (err) {
      setUploadError(err?.message || 'Unable to delete internship.');
    } finally {
      setUploadLoading(false);
    }
  };

  const onUploadSubmit = async (event) => {
    event.preventDefault();
    setUploadNotice('');
    setUploadError('');

    if (action !== 'upload') {
      setUploadNotice('Upload flow will be connected to the backend next.');
      return;
    }

    setUploadLoading(true);
    try {
      if (scope === 'placements') {
        await uploadPlacement({
          prn: placementForm.prn,
          name: placementForm.name,
          location: placementForm.location,
          package: placementForm.package,
          year: placementForm.year,
          company: placementForm.company,
        });
        setUploadNotice('Placement saved successfully.');
      } else if (scope === 'internships') {
        await uploadInternship({
          name: internshipForm.name,
          location: internshipForm.location,
          stipend: internshipForm.stipend,
          year: internshipForm.year,
          company: internshipForm.company,
          mode: internshipForm.mode,
          mentor: internshipForm.mentor,
          ppo_offered: internshipForm.ppoOffered === 'yes' ? 1 : 0,
        });
        setUploadNotice('Internship saved successfully.');
      } else {
        setUploadNotice('Upload flow will be connected to the backend next.');
      }
    } catch (err) {
      setUploadError(err?.message || 'Unable to upload record.');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Admin tools for {SCOPE_LABELS[scope] || 'selected data'} will appear here.
          </p>
        </div>

        {action === 'upload' && scope === 'placements' && (
          <form className="space-y-4" onSubmit={onUploadSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">PRN</label>
                <input
                  name="prn"
                  value={placementForm.prn}
                  onChange={onPlacementChange}
                  placeholder="PRN"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Name</label>
                <input
                  name="name"
                  value={placementForm.name}
                  onChange={onPlacementChange}
                  placeholder="Student name"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Location</label>
                <input
                  name="location"
                  value={placementForm.location}
                  onChange={onPlacementChange}
                  placeholder="Location"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Package (LPA)</label>
                <input
                  name="package"
                  value={placementForm.package}
                  onChange={onPlacementChange}
                  placeholder="Package"
                  type="number"
                  step="0.1"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Year</label>
                <input
                  name="year"
                  value={placementForm.year}
                  onChange={onPlacementChange}
                  placeholder="2023-2024"
                  pattern="\d{4}-\d{4}"
                  title="Use format YYYY-YYYY, e.g. 2023-2024"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Format: 2023-2024</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Company</label>
                <input
                  list="placement-company-list"
                  name="company"
                  value={placementForm.company}
                  onChange={onPlacementChange}
                  placeholder="Select company"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <datalist id="placement-company-list">
                  {companies.map((company) => (
                    <option key={company.id || company.name} value={company.name} />
                  ))}
                </datalist>
                {companyLoading && (
                  <p className="mt-1 text-xs text-gray-400">Loading companies...</p>
                )}
                {companyError && (
                  <p className="mt-1 text-xs text-red-500">{companyError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              OR
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">Upload Excel</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="mt-1 w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
            </div>

            {uploadNotice && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                {uploadNotice}
              </div>
            )}

            {uploadError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                {uploadError}
              </div>
            )}

            <button
              type="submit"
              disabled={uploadLoading}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                uploadLoading
                  ? 'cursor-not-allowed bg-indigo-400'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {uploadLoading ? 'Saving...' : 'Save Placement'}
            </button>
          </form>
        )}

        {(action === 'edit' || action === 'add') && scope === 'placements' && (
          <div className="space-y-4">
            <form className="grid gap-4 md:grid-cols-3" onSubmit={onLookupPlacement}>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">PRN</label>
                <input
                  name="prn"
                  value={placementForm.prn}
                  onChange={onPlacementChange}
                  placeholder="PRN"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Name</label>
                <input
                  name="name"
                  value={placementForm.name}
                  onChange={onPlacementChange}
                  placeholder="Student name"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                    lookupLoading
                      ? 'cursor-not-allowed bg-indigo-400'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {lookupLoading ? 'Searching...' : 'Fetch Details'}
                </button>
              </div>
            </form>

            {lookupNotice && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                {lookupNotice}
              </div>
            )}

            {lookupError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                {lookupError}
              </div>
            )}

            {editingId && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Name</label>
                    <input
                      name="name"
                      value={placementForm.name}
                      onChange={onPlacementChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Location</label>
                    <input
                      name="location"
                      value={placementForm.location}
                      onChange={onPlacementChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Package (LPA)</label>
                    <input
                      name="package"
                      value={placementForm.package}
                      onChange={onPlacementChange}
                      type="number"
                      step="0.1"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Year</label>
                    <input
                      name="year"
                      value={placementForm.year}
                      onChange={onPlacementChange}
                      pattern="\d{4}-\d{4}"
                      title="Use format YYYY-YYYY, e.g. 2023-2024"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Company</label>
                    <input
                      list="placement-company-edit-list"
                      name="company"
                      value={placementForm.company}
                      onChange={onPlacementChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                    <datalist id="placement-company-edit-list">
                      {companies.map((company) => (
                        <option key={company.id || company.name} value={company.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {uploadNotice && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    {uploadNotice}
                  </div>
                )}

                {uploadError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    {uploadError}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onUpdatePlacement}
                    disabled={uploadLoading}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                      uploadLoading
                        ? 'cursor-not-allowed bg-indigo-400'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {uploadLoading ? 'Saving...' : 'Edit Data'}
                  </button>
                  <button
                    type="button"
                    onClick={onDeletePlacement}
                    disabled={uploadLoading}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete Data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(action === 'edit' || action === 'add') && scope === 'internships' && (
          <div className="space-y-4">
            <form className="grid gap-4 md:grid-cols-3" onSubmit={onLookupInternship}>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Name</label>
                <input
                  name="name"
                  value={internshipForm.name}
                  onChange={onInternshipChange}
                  placeholder="Student name"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Year</label>
                <input
                  name="year"
                  value={internshipForm.year}
                  onChange={onInternshipChange}
                  placeholder="2025-2026"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={internshipLookupLoading}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                    internshipLookupLoading
                      ? 'cursor-not-allowed bg-indigo-400'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {internshipLookupLoading ? 'Searching...' : 'Fetch Details'}
                </button>
              </div>
            </form>

            {internshipLookupNotice && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                {internshipLookupNotice}
              </div>
            )}

            {internshipLookupError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                {internshipLookupError}
              </div>
            )}

            {internshipEditingId && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Name</label>
                    <input
                      name="name"
                      value={internshipForm.name}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Location</label>
                    <input
                      name="location"
                      value={internshipForm.location}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Stipend (per month)</label>
                    <input
                      name="stipend"
                      value={internshipForm.stipend}
                      onChange={onInternshipChange}
                      type="number"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Year</label>
                    <input
                      name="year"
                      value={internshipForm.year}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Company</label>
                    <input
                      list="internship-company-edit-list"
                      name="company"
                      value={internshipForm.company}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                    <datalist id="internship-company-edit-list">
                      {companies.map((company) => (
                        <option key={company.id || company.name} value={company.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Mode</label>
                    <select
                      name="mode"
                      value={internshipForm.mode}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">PPO Offered</label>
                    <select
                      name="ppoOffered"
                      value={internshipForm.ppoOffered}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500">Mentor Name</label>
                    <input
                      list="internship-mentor-edit-list"
                      name="mentor"
                      value={internshipForm.mentor}
                      onChange={onInternshipChange}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                    <datalist id="internship-mentor-edit-list">
                      {mentorOptions.map((mentor) => (
                        <option key={mentor.id || mentor.name} value={mentor.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {uploadNotice && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    {uploadNotice}
                  </div>
                )}

                {uploadError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    {uploadError}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onUpdateInternship}
                    disabled={uploadLoading}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                      uploadLoading
                        ? 'cursor-not-allowed bg-indigo-400'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {uploadLoading ? 'Saving...' : 'Edit Data'}
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteInternship}
                    disabled={uploadLoading}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete Data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {action === 'upload' && scope === 'internships' && (
          <form className="space-y-4" onSubmit={onUploadSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Name</label>
                <input
                  name="name"
                  value={internshipForm.name}
                  onChange={onInternshipChange}
                  placeholder="Student name"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Location</label>
                <input
                  name="location"
                  value={internshipForm.location}
                  onChange={onInternshipChange}
                  placeholder="Location"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Stipend (per month)</label>
                <input
                  name="stipend"
                  value={internshipForm.stipend}
                  onChange={onInternshipChange}
                  placeholder="Stipend"
                  type="number"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Year</label>
                <input
                  name="year"
                  value={internshipForm.year}
                  onChange={onInternshipChange}
                  placeholder="2025-2026"
                  pattern="\d{4}-\d{4}"
                  title="Use format YYYY-YYYY, e.g. 2025-2026"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Format: 2025-2026</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Company</label>
                <input
                  list="internship-company-list"
                  name="company"
                  value={internshipForm.company}
                  onChange={onInternshipChange}
                  placeholder="Select company"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <datalist id="internship-company-list">
                  {companies.map((company) => (
                    <option key={company.id || company.name} value={company.name} />
                  ))}
                </datalist>
                {companyLoading && (
                  <p className="mt-1 text-xs text-gray-400">Loading companies...</p>
                )}
                {companyError && (
                  <p className="mt-1 text-xs text-red-500">{companyError}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Mode</label>
                <select
                  name="mode"
                  value={internshipForm.mode}
                  onChange={onInternshipChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">PPO Offered</label>
                <select
                  name="ppoOffered"
                  value={internshipForm.ppoOffered}
                  onChange={onInternshipChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Mentor Name</label>
                <input
                  list="internship-mentor-list"
                  name="mentor"
                  value={internshipForm.mentor}
                  onChange={onInternshipChange}
                  placeholder="Mentor name"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <datalist id="internship-mentor-list">
                  {mentorOptions.map((mentor) => (
                    <option key={mentor.id || mentor.name} value={mentor.name} />
                  ))}
                </datalist>
                {mentorLoading && (
                  <p className="mt-1 text-xs text-gray-400">Loading mentors...</p>
                )}
                {mentorError && (
                  <p className="mt-1 text-xs text-red-500">{mentorError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              OR
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">Upload Excel</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="mt-1 w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
            </div>

            {uploadNotice && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                {uploadNotice}
              </div>
            )}

            <button
              type="submit"
              disabled={uploadLoading}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                uploadLoading
                  ? 'cursor-not-allowed bg-indigo-400'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {uploadLoading ? 'Saving...' : 'Save Internship'}
            </button>
          </form>
        )}

        {action !== 'upload' && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            This section is ready for your upload, edit, delete, view, or add workflows.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
