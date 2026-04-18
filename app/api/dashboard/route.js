import { getCjDashboardData } from "../../../lib/cj";
import { cookies } from "next/headers";
import { isDashboardAuthorized } from "../../../lib/dashboard-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  if (!isDashboardAuthorized(cookieStore)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCjDashboardData();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        account: {
          openName: "CJ Dashboard",
          openEmail: null,
          root: null,
          isSandbox: 0
        },
        balance: {
          amount: 0,
          noWithdrawalAmount: 0,
          freezeAmount: 0
        },
        products: [],
        usingFallbackCatalog: false,
        metrics: {
          totalProducts: 0,
          unpaidCount: 0,
          processingCount: 0,
          shippedCount: 0,
          deliveredCount: 0,
          salesUsd: 0,
          recentOrderCount: 0
        },
        recentOrders: [],
        warnings: [error.message || "Dashboard data failed to load."],
        partial: true,
        generatedAt: new Date().toISOString()
      },
      { status: 200 }
    );
  }
}
