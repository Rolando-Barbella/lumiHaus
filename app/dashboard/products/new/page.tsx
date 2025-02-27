'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { ProductForm } from '@/components/product/product-form';

export default function CreateProductPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <ProductForm mode="create" />
      </div>
    </ProtectedRoute>
  );
}