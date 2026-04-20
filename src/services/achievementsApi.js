import { API_BASE_URL } from './authApi';

const BASE = `${API_BASE_URL}/api/v1/achievements`;

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJson(res) {
  try { return await res.json(); } catch { return null; }
}

export async function getHackathons(filters = {}) {
  const params = new URLSearchParams();
  if (filters.nature && filters.nature !== 'All') params.set('nature', filters.nature);
  if (filters.level  && filters.level  !== 'All') params.set('level',  filters.level);
  if (filters.prize  && filters.prize  !== 'All') params.set('prize',  filters.prize);

  const url = `${BASE}/hackathons/${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch hackathons.');
  return Array.isArray(data) ? data : (data?.results ?? []);
}

export async function getStudentAchievements(filters = {}) {
  const params = new URLSearchParams();
  if (filters.nature && filters.nature !== 'All') params.set('nature', filters.nature);
  if (filters.level  && filters.level  !== 'All') params.set('level',  filters.level);
  if (filters.prize  && filters.prize  !== 'All') params.set('prize',  filters.prize);
  if (filters.class  && filters.class  !== 'All') params.set('class',  filters.class);

  const url = `${BASE}/students/${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch student achievements.');
  return Array.isArray(data) ? data : (data?.results ?? []);
}

export async function createHackathon(formData) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${BASE}/hackathons/create/`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData, // FormData for file uploads
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to create hackathon.');
  return data;
}

export async function createStudentAchievement(formData) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${BASE}/students/create/`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to create achievement.');
  return data;
}

export async function deleteHackathon(pk) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${BASE}/hackathons/${pk}/`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || data?.message || 'Failed to delete hackathon.');
  }
}

export async function deleteStudentAchievement(pk) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${BASE}/students/${pk}/`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || data?.message || 'Failed to delete achievement.');
  }
}
