import { API_BASE_URL } from './authApi';

const BASE = `${API_BASE_URL}/api/v1/activities/expert-talk`;

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJson(res) {
  try { return await res.json(); } catch { return null; }
}

export async function getExpertTalks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.year && filters.year !== 'All') params.set('year', filters.year);
  if (filters.status && filters.status !== 'All') params.set('status', filters.status);

  const url = `${BASE}/${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch expert talks.');
  return Array.isArray(data) ? data : (data?.results ?? []);
}

export async function createExpertTalk(payload) {
  const res = await fetch(`${BASE}/create/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to create expert talk.');
  return data;
}

export async function registerForTalk(pk) {
  const res = await fetch(`${BASE}/${pk}/register/`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Registration failed.');
  return data;
}

export async function getRegisteredStudents(pk) {
  const res = await fetch(`${BASE}/${pk}/students/`, { headers: authHeaders() });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch students.');
  return Array.isArray(data) ? data : (data?.results ?? []);
}
