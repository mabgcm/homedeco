import { amazonEdit, cjProducts } from "../data/products";
import { Storefront } from "../components/storefront";

export default function HomePage() {
  return (
    <Storefront
      amazonEdit={amazonEdit}
      cjProducts={cjProducts}
    />
  );
}
