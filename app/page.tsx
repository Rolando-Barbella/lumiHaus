'use client';

import { Header } from '@/components/layout/header';
import { ProductGrid } from '@/components/product/product-grid';
import { CustomButton } from '@/components/ui/custom-button';
import { PublicRoute } from '@/components/auth/public-route';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <PublicRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section */}
          <div className="relative h-[600px] w-full overflow-hidden">
            {/* Skeleton loader */}
            {imageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            
            {/* Preload hero background image */}
            <Image
              src="/images/hero-background.svg"
              alt='Hero Background'
              width={1440}
              height={600}
              className="absolute inset-0 bg-cover bg-center"
              placeholder='blur'
              blurDataURL='/images/hero-background.svg'
              style={{
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
              onLoadingComplete={() => setImageLoading(false)}
            />
            
            {/* Hero Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-[1440px] mx-auto px-20 max-w-full">
                <div className="w-[1280px] mx-auto max-w-full">
                  <div className="max-w-[603px] flex flex-col gap-3">
                    <h2 className="text-[16px] leading-[24px] tracking-[2px] text-brand-secondary mb-4 font-medium">
                      Winter Comfort, Timeless Design
                    </h2>
                    {/* Optimize main heading for LCP */}
                    <h1 
                      className="text-[48px] leading-[56px] tracking-[0px] font-semibold text-balance"
                      style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased'
                      }}
                    >
                      Discover Our Winter Furniture Collection
                    </h1>
                    <p className="text-[16px] leading-[24px] tracking-[2px] font-normal max-w-[480px]">
                      Transform your space with pieces designed for warmth and style this season.
                    </p>
                    <CustomButton 
                      variant="primary"
                      className="w-[140px] h-[48px] px-8 py-3 rounded-[100px] mt-4"
                    >
                      BUY NOW
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="container mx-auto">
            <h2 className="text-[32px] leading-[40px] tracking-[0px] font-semibold mb-8">
              Our Products
            </h2>
            <ProductGrid />
          </div>
        </main>
      </div>
    </PublicRoute>
  );
}