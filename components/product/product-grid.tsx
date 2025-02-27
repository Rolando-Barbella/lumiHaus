'use client';

import { useEffect, useRef, useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/store/cart-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { fetchProducts } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 3;

export function ProductGrid() {
  const { dispatch: cartDispatch } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef(null);

  // Fetch products from API
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setDisplayedItems(data.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, [toast]);

  // Infinite scroll
  useEffect(() => {
    if (!products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            const startIndex = (prevPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE + 1;
            const newItems = products.slice(0, endIndex);
            setDisplayedItems(newItems);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [products]);

  const handleAddToCart = (product: Product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card 
            key={index}
            data-testid="skeleton-card"
            className="w-[302px] h-[392px] shadow-none border-0 animate-pulse"
          >
            <div className="w-[302px] h-[312px] bg-muted" />
            <div className="pt-[15px] px-4 flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded" />
              </div>
              <div className="w-[44px] h-[44px] bg-muted rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products available.</p>
      </div>
    );
  }

  const hasMore = displayedItems.length < products.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((product) => (
          <Card 
            key={product.id} 
            className="w-[302px] h-[392px] shadow-none border-0" 
            data-testid={`product-card-${product.id}`}
            role="article"
          >
            <div className="w-[302px] h-[312px] relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="302px"
                unoptimized
                priority={displayedItems.indexOf(product) < 9}
              />
            </div>
            <div className="pt-[15px] px-4 flex justify-between items-center">
              <div>
                <h3 
                  className="text-[16px] leading-[24px] tracking-[2px] font-semibold" 
                  data-testid={`product-name-${product.id}`}
                >
                  {product.name}
                </h3>
                <p 
                  className="text-[16px] leading-[24px] tracking-[2px] font-medium pt-2" 
                  data-testid={`product-price-${product.id}`}
                >
                  {formatPrice(product.price)}
                </p>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="w-[44px] h-[44px] rounded-[96px] p-[12px] border border-secondary bg-transparent hover:bg-secondary/10"
                onClick={() => handleAddToCart(product)}
                data-testid={`add-to-cart-${product.id}`}
              >
                <ShoppingBag className="h-5 w-5 text-secondary" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {hasMore && (
        <div 
          ref={loadMoreRef} 
          className="w-full h-20 flex items-center justify-center mt-8"
          data-testid="load-more"
        >
          <div className="animate-pulse text-muted-foreground">
            Loading more products...
          </div>
        </div>
      )}
    </>
  );
}