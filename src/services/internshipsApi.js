import { API_BASE_URL } from './authApi';

const INTERNSHIPS_OVERVIEW_ENDPOINT = '/api/v1/internships/overview/';
const INTERNSHIPS_YEARS_ENDPOINT = '/api/v1/internships/years/';
const INTERNSHIPS_YEAR_DETAIL_ENDPOINT = '/api/v1/internships';

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getInternshipOverview(filters = {}) {
  const params = new URLSearchParams();

  if (filters.year && filters.year !== 'All') {
    params.set('year', filters.year);
  }
  if (filters.company && filters.company !== 'All') {
    params.set('company', filters.company);
  }
  if (filters.stipendRange && filters.stipendRange !== 'All') {
    params.set('stipend_range', filters.stipendRange);
  }
  if (filters.location && filters.location !== 'All') {
    params.set('location', filters.location);
  }
  if (filters.mentor && filters.mentor !== 'All') {
    params.set('mentor', filters.mentor);
  }
  if (filters.mode && filters.mode !== 'All') {
    params.set('mode', filters.mode);
  }

  const query = params.toString();
  const url = `${API_BASE_URL}${INTERNSHIPS_OVERVIEW_ENDPOINT}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch internship overview.';
    throw new Error(message);
  }

  return data || {};
}

export async function getInternshipYears() {
  const response = await fetch(`${API_BASE_URL}${INTERNSHIPS_YEARS_ENDPOINT}`, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch internship years.';
    throw new Error(message);
  }

  return data || { years: [] };
}

export async function getInternshipYearDetail(year) {
  const response = await fetch(`${API_BASE_URL}${INTERNSHIPS_YEAR_DETAIL_ENDPOINT}/${year}/`, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch internship year details.';
    throw new Error(message);
  }

  return data || {};
}