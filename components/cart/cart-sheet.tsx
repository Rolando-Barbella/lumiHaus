'use client';

import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { ShoppingCart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from './cart-item';
import { formatPrice } from '@/lib/utils';

export function CartSheet() {
  const { state, dispatch } = useCart();
  const router = useRouter();

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

  const handleCheckout = () => {
    dispatch({ type: 'TOGGLE_CART' });
    router.push('/checkout');
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const handleEmptyCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <Popover open={state.isOpen} onOpenChange={() => dispatch({ type: 'TOGGLE_CART' })}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-[28px] w-[28px] p-0 bg-transparent hover:bg-transparent"
          data-testid="cart-button"
        >
          <ShoppingCart 
            className="h-[28px] w-[28px] transition-colors duration-200 "
            style={{ color: state.isOpen ? '#419DB4' : '#2A2A2A' }}
          />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs transition-opacity duration-200"
            style={{ opacity: state.items.length > 0 ? 1 : 0 }}
            data-testid="cart-badge"
          >
            {state.items.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 rounded-lg shadow-[0px_5px_10px_0px_rgba(0,0,0,0.05)] border-0 mt-[10px]" 
        align="end"
        sideOffset={20}
        data-testid="cart-popup"
      >
        <Card className="border-0 shadow-none h-[622px] flex flex-col">
          <div className="h-[76px] flex items-center justify-between border-b border-b-[1px] px-6 flex-shrink-0">
            <h2 className="text-[18px] leading-[28px] font-semibold tracking-[0%]">
              Shopping Cart
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
              data-testid="close-cart"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              {state.items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8" data-testid="empty-cart-message">
                  Your cart is empty
                </p>
              ) : (
                <div className="px-6 pt-[10px] space-y-8" data-testid="cart-items">
                  {state.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>

            {state.items.length > 0 && (
              <>
                <div className="h-[76px] flex items-center justify-between px-6 border-b border-b-[0.5px]">
                  <span className="text-[16px] leading-[24px] font-medium">Total</span>
                  <span className="text-[16px] leading-[24px] font-medium" data-testid="cart-total">
                  {formatPrice(state.total)}
                  </span>
                </div>

                <div className="mt-5 h-[136px] px-6 pb-6 flex flex-col gap-4">
                  <CustomButton 
                    variant="primary"
                    className="w-[352px]"
                    onClick={handleCheckout}
                    data-testid="checkout-button"
                  >
                    Proceed to Checkout
                  </CustomButton>
                  <CustomButton 
                    variant="secondary"
                    className="w-[352px]"
                    onClick={handleEmptyCart}
                    data-testid="empty-cart-button"
                  >
                    Empty Cart
                  </CustomButton>
                </div>
              </>
            )}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}