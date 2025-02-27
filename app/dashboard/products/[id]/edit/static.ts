import { defaultProducts } from '@/lib/store/products-context';

export function generateStaticParams() {
  return defaultProducts.map((product) => ({
    id: product.id,
  }));
}