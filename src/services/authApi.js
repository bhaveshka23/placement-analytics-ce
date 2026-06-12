//const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://placement-backend-rjxr.onrender.com").replace(/\/$/, "");
const API_BASE_URL = "http://127.0.0.1:8000"
const ENDPOINTS = {
  studentSendOtp: "/api/v1/auth/student/send-otp/",
  studentVerifyOtp: "/api/v1/auth/student/verify-otp/",
  adminLogin: "/api/v1/auth/admin/login/",
  adminVerifyOtp: "/api/v1/auth/admin/verify-otp/",
  logout: "/api/v1/auth/logout/",
  dashboard: "/api/v1/analytics/dashboard/"
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

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(buildErrorMessage(data, "Request failed."));
  }

  return data;
}

export function studentSendOtp({ email }) {
  return postJson(ENDPOINTS.studentSendOtp, { email });
}

export function studentVerifyOtp({ email, otp }) {
  return postJson(ENDPOINTS.studentVerifyOtp, { email, otp });
}

export function adminLogin({ email, password }) {
  return postJson(ENDPOINTS.adminLogin, { email, password });
}

export function adminVerifyOtp({ email, otp }) {
  return postJson(ENDPOINTS.adminVerifyOtp, { email, otp });
}

export function logoutUser() {
  return postJson(ENDPOINTS.logout, {});
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
