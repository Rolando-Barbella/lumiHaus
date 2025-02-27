'use client';

import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '@/lib/validations/product';
import type * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Product } from '@/lib/types';
import { createProduct, updateProduct } from '@/lib/services/api';

type ProductFormValues = z.infer<typeof createProductSchema>;

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price.toString() || '',
      image: product?.image || '',
    },
  });

  // Initialize image URL from product data
  useEffect(() => {
    if (product?.image) {
      setImageUrl(product.image);
      form.setValue('image', product.image);
    }
  }, [product, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png'].includes(extension)) {
      toast({
        title: 'Error',
        description: 'Please upload a JPG or PNG file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      form.setValue('image', dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!values.image) {
        toast({
          title: 'Error',
          description: 'Please upload an image.',
          variant: 'destructive',
        });
        return;
      }

      if (mode === 'create') {
        await createProduct({
          name: values.name,
          price: parseFloat(values.price),
          image: values.image,
        });

        toast({
          title: 'Success',
          description: 'Product created successfully.',
        });
      } else {
        if (!product) return;

        await updateProduct(product.id, {
          name: values.name,
          price: parseFloat(values.price),
          image: values.image,
        });

        toast({
          title: 'Success',
          description: 'Product updated successfully.',
        });
      }

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} product. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto px-20">
      <div className="mx-auto py-8">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-[12px] leading-[16px] tracking-[2px] font-medium text-secondary hover:text-secondary/90 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-[32px] leading-[40px] tracking-[0px] font-semibold">
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[436px] space-y-8">
            <div className="flex gap-6 items-center">
              <div className="relative w-40 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <CustomButton 
                  variant="primary"
                  className="w-[136px] h-[32px] text-[12px] leading-[16px] tracking-[0px] font-medium uppercase"
                  type="button"
                  onClick={handleUploadClick}
                >
                  Upload Image
                </CustomButton>
                {form.formState.errors.image && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter product name" 
                        className="w-[436px] h-[44px] px-[12px] py-[12px] rounded-[6px] border-[1px] text-left placeholder:text-[#8B9CA1] placeholder:text-[14px] placeholder:leading-[20px] placeholder:tracking-[0px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-[123px] h-[44px] px-[12px] py-[12px] rounded-[6px] border-[1px] text-left placeholder:text-[#8B9CA1] placeholder:text-[14px] placeholder:leading-[20px] placeholder:tracking-[0px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-[50px]">
              <CustomButton 
                type="submit" 
                variant="primary"
                className="w-[105px] h-[48px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </CustomButton>
              <CustomButton 
                type="button" 
                variant="secondary"
                className="w-[127px] h-[48px]"
                onClick={() => router.push('/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </CustomButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}