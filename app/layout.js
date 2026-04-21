import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "../components/cart-provider";

export const metadata = {
  metadataBase: new URL("https://linenandform.com"),
  title: "Linen & Form | Curated Home Decor Store",
  description:
    "Soft-modern home decor with sculptural accents, layered textiles, and secure guest checkout.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Linen & Form | Curated Home Decor Store",
    description:
      "Soft-modern home decor collections with layered lighting, sculptural accents, and optional Amazon add-ons.",
    url: "https://linenandform.com",
    siteName: "Linen & Form",
    locale: "en_CA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Linen & Form | Curated Home Decor Store",
    description:
      "Soft-modern home decor with secure checkout and a small Amazon edit."
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Linen & Form",
  description:
    "Soft-modern home decor store with guest checkout and a curated Amazon add-on edit.",
  url: "https://linenandform.com",
  paymentAccepted: "Stripe",
  currenciesAccepted: "CAD"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <CartProvider>{children}</CartProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
