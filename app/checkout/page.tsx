'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useCart } from '@/lib/store/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart/cart-item';
import { CustomButton } from '@/components/ui/custom-button';
import { formatPrice } from '@/lib/utils';
import { PublicRoute } from '@/components/auth/public-route';


export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const handlePurchase = () => {
    if (state.items.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty.',
        variant: 'destructive',
      });
      return;
    }

    // Here you would typically integrate with a payment processor
    toast({
      title: 'Success',
      description: 'Thank you for your purchase!',
    });
    dispatch({ type: 'CLEAR_CART' });
    router.push('/');
  };

  const subtotal = state.total;
  const shipping = subtotal > 0 ? 10 : 0; // Flat rate shipping
  const total = subtotal + shipping;

  return (
    <PublicRoute>
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto px-20">
        <div className="mx-auto py-8">
          <div className="grid grid-cols-[1fr_400px] gap-6">
            {/* Left Column - Checkout Title and Cart Items */}
            <div>
              <h1 className="text-[32px] leading-[40px] tracking-[0px] font-semibold mb-8">
                Checkout
              </h1>

              {/* Cart Items */}
              <div className="max-w-[560px]">
                {state.items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-8">
                    {state.items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        width="wide"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <Card className="w-[400px] h-[352px] border-[0.5px] border-[#2A2A2A] rounded-[8px]">
              <div className="p-6 space-y-6">
                <h2 className="text-[24px] leading-[36px] tracking-[0px] font-semibold">
                  Summary
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <span className="text-[16px] leading-[24px] tracking-[0%] font-light text-[#8B9CA1]">
                        Subtotal
                      </span>
                      <span className="text-[16px] leading-[24px] tracking-[0%] font-light text-[#8B9CA1]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <span className="text-[16px] leading-[24px] tracking-[0%] font-light text-[#8B9CA1]">
                        Shipping
                      </span>
                      <span className="text-[16px] leading-[24px] tracking-[0%] font-light text-[#8B9CA1]">
                        {formatPrice(shipping)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between pt-5">
                    <span className="text-[20px] leading-[36px] tracking-[0%] font-medium">
                      Total
                    </span>
                    <span className="text-[20px] leading-[28px] tracking-[0%] font-medium">
                    {formatPrice(total)}
                    </span>
                  </div>
                  <Separator className="my-6" />
                  <CustomButton 
                    variant="primary"
                    className="w-[336px] h-[48px] uppercase"
                    onClick={handlePurchase}
                    disabled={state.items.length === 0}
                  >
                    Purchase
                  </CustomButton>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </PublicRoute>
  );
}