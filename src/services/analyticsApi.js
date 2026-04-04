import { API_BASE_URL } from './authApi';

const ANALYTICS_ENDPOINT = '/api/v1/analytics/dashboard/';

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getAnalyticsDashboard() {
  const response = await fetch(`${API_BASE_URL}${ANALYTICS_ENDPOINT}`, {
    method: 'GET',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to fetch analytics dashboard.';
    throw new Error(message);
  }

  return data || {};
}
