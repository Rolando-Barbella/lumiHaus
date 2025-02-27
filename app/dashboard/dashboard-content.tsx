'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { fetchProducts, deleteProduct } from '@/lib/services/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DashboardContent() {
  const { toast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
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

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedProducts(prev => {
      if (prev.size === products.length) {
        return new Set();
      }
      return new Set(products.map(p => p.id));
    });
  };

  const handleEdit = (productId: string) => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete));
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
    setProductToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto px-20">
          <div className="mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[32px] leading-[40px] tracking-[0px] font-semibold">
                Products
              </h1>
            </div>
            <div className="w-[1080px] h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto px-20">
          <div className="mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[32px] leading-[40px] tracking-[0px] font-semibold">
                Products
              </h1>
            </div>
            <div className="w-[1080px] h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-muted-foreground">
                  Make sure the JSON Server is running with: <code>npm run server</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto px-20">
        <div className="mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-[32px] leading-[40px] tracking-[0px] font-semibold">
              Products
            </h1>
            <CustomButton 
              variant="secondary"
              className="w-[164px] h-[48px]"
              onClick={() => router.push('/dashboard/products/new')}
            >
              CREATE NEW
            </CustomButton>
          </div>
          
          {products.length === 0 ? (
            <div className="bg-white w-[1080px] h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">No products available.</p>
            </div>
          ) : (
            <div className="bg-white w-[1080px]">
              <Table>
                <TableHeader>
                  <TableRow className="h-[56px] bg-[#F2F2F6]">
                    <TableHead className="w-12 px-4">
                      <Checkbox 
                        checked={selectedProducts.size === products.length && products.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="w-[24px] h-[24px] border border-[#8B9CA1] data-[state=checked]:border-none"
                      />
                    </TableHead>
                    <TableHead className="px-4 uppercase w-[400px]">Name</TableHead>
                    <TableHead className="uppercase w-[100px]">Price</TableHead>
                    <TableHead className="w-[230px] px-4 text-right"></TableHead>
                    <TableHead className="w-[230px] px-4 text-right"></TableHead>
                    <TableHead className="w-[230px] px-4 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow 
                      key={product.id} 
                      className="h-[80px] border-b border-[#E4E4E7]"
                    >
                      <TableCell className="px-4">
                        <Checkbox 
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => handleSelectProduct(product.id)}
                          className="w-[24px] h-[24px] border border-[#8B9CA1] data-[state=checked]:border-none"
                        />
                      </TableCell>
                      <TableCell className="px-4 w-[400px]">
                        <div className="flex items-center gap-4">
                          <div className="relative w-[64px] h-[64px] rounded-[4px] overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[100px]">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="w-[100px]"></TableCell>
                      <TableCell className="w-[100px]"></TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center justify-end w-[230px] h-[32px] gap-[48px]">
                          <Button
                            variant="ghost"
                            className="h-8 px-2 text-sm text-secondary hover:text-secondary"
                            onClick={() => handleEdit(product.id)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 px-2 text-sm text-[#D93434] hover:text-[#D93434]"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}