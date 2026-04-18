import { amazonEdit, cjProducts, storeMetrics } from "../data/products";
import { Storefront } from "../components/storefront";

export default function HomePage() {
  return (
    <Storefront
      amazonEdit={amazonEdit}
      cjProducts={cjProducts}
      storeMetrics={storeMetrics}
    />
  );
}
