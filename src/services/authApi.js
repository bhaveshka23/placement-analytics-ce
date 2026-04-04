const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

const ENDPOINTS = {
  logout: "/api/auth/logout/",
  dashboard: "/api/v1/analytics/dashboard/",
};

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildErrorMessage(data, fallbackMessage) {
  return data?.message || data?.error || fallbackMessage;
}



export async function getDashboardUser() {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.dashboard}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await parseJsonResponse(response);
  if (!response.ok || !data?.success) {
    throw new Error(buildErrorMessage(data, "Unable to fetch dashboard details."));
  }

  return data;
}

export { API_BASE_URL, ENDPOINTS };
