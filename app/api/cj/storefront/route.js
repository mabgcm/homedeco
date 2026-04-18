import {
  getCuratedStorefrontCatalog,
  getCjSettings,
} from "../../../../lib/cj";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.CJ_API_KEY && !process.env.CJ_ACCESS_TOKEN) {
      return Response.json({
        connected: false,
        account: null,
        products: [],
        message: "CJ credentials are not configured."
      });
    }

    const settings = await getCjSettings();
    const catalog = await getCuratedStorefrontCatalog();
    const products = catalog.products;

    return Response.json({
      connected: true,
      account: {
        openId: settings?.openId || null,
        openName: settings?.openName || null,
        openEmail: settings?.openEmail || null,
        root: settings?.root || null,
        isSandbox: settings?.isSandbox || 0
      },
      products,
      warnings: catalog.warnings || [],
      message: products.length
        ? null
        : "Connected to CJ, but curated product sync did not return any items."
    });
  } catch (error) {
    return Response.json(
      {
        connected: false,
        account: null,
        products: [],
        message: error.message || "Unable to load CJ storefront data."
      },
      { status: 500 }
    );
  }
}
