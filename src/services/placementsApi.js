import { API_BASE_URL } from './authApi';

const PLACEMENTS_OVERVIEW_ENDPOINT = '/api/v1/placements/overview/';
const PLACEMENTS_YEARS_ENDPOINT = '/api/v1/placements/years/';
const PLACEMENTS_YEAR_DETAIL_ENDPOINT = '/api/v1/placements';
const COMPANIES_ENDPOINT = '/api/v1/companies/';

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getPlacementOverview(filters = {}) {
  const params = new URLSearchParams();

  if (filters.year && filters.year !== 'All') {
    params.set('year', filters.year);
  }
  if (filters.company && filters.company !== 'All') {
    params.set('company', filters.company);
  }
  if (filters.location && filters.location !== 'All') {
    params.set('location', filters.location);
  }
  if (filters.packageRange && filters.packageRange !== 'All') {
    params.set('package_range', filters.packageRange);
  }

  const query = params.toString();
  const url = `${API_BASE_URL}${PLACEMENTS_OVERVIEW_ENDPOINT}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch placement overview.';
    throw new Error(message);
  }

  return data || {};
}

export async function getPlacementYears() {
  const response = await fetch(`${API_BASE_URL}${PLACEMENTS_YEARS_ENDPOINT}`, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch placement years.';
    throw new Error(message);
  }

  return data || { years: [] };
}

export async function getPlacementYearDetail(year) {
  const response = await fetch(`${API_BASE_URL}${PLACEMENTS_YEAR_DETAIL_ENDPOINT}/${year}/`, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch placement year details.';
    throw new Error(message);
  }

  return data || {};
}

export async function getCompanies(search = '') {
  const params = new URLSearchParams();
  if (search?.trim()) {
    params.set('search', search.trim());
  }

  const url = `${API_BASE_URL}${COMPANIES_ENDPOINT}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch companies.';
    throw new Error(message);
  }

  return data || { companies: [] };
}
