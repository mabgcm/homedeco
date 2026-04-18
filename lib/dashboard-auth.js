export const DASHBOARD_COOKIE_NAME = "dashboard_auth";

export function getDashboardPassword() {
  return process.env.DASHBOARD_PASSWORD || "change-this-dashboard-password";
}

export function isDashboardAuthorized(cookieStore) {
  const stored = cookieStore.get(DASHBOARD_COOKIE_NAME)?.value;
  return stored === getDashboardPassword();
}
