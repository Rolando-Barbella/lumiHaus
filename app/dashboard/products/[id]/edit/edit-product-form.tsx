'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from '@/components/product/product-form';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { fetchProduct } from '@/lib/services/api';

export function EditProductForm({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [id, router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto px-20">
          <div className="mx-auto py-8">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto px-20">
          <div className="mx-auto py-8">
            <p className="text-destructive">{error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductForm product={product} mode="edit" />
    </div>
  );
}