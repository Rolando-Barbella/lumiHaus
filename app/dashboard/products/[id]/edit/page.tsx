'use client';

import { useParams } from 'next/navigation';
import { EditProductForm } from './edit-product-form';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  return (
    <ProtectedRoute>
      <EditProductForm id={id} />
    </ProtectedRoute>
  );
}