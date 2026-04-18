import { cookies } from "next/headers";
import { DashboardClient } from "../../components/dashboard-client";
import { DashboardLogin } from "../../components/dashboard-login";
import { isDashboardAuthorized } from "../../lib/dashboard-auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  if (!isDashboardAuthorized(cookieStore)) {
    return <DashboardLogin />;
  }

  return <DashboardClient />;
}
