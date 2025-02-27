'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  width?: 'default' | 'wide';
}

export function CartItem({ item, onUpdateQuantity, onRemove, width = 'default' }: CartItemProps) {
  const containerWidth = width === 'wide' ? 'w-[560px]' : 'w-[352px]';
  
  return (
    <div className={`flex gap-[10px] ${containerWidth}`} data-testid={`cart-item-${item.id}`}>
      <div className="relative w-[90px] h-[120px] rounded-[4px] overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 
            className="text-[14px] leading-[24px] font-semibold tracking-[2px] text-[#000000]"
            data-testid={`item-name-${item.id}`}
          >
            {item.name}
          </h3>
          <p 
            className="text-[14px] leading-[24px] font-medium tracking-[2px] text-[#000000]"
            data-testid={`item-price-${item.id}`}
          >
           {formatPrice(item.price)}
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <Button
            variant="outline"
            size="icon"
            className="h-[24px] w-[24px] rounded-[96px] p-[4px] bg-brand-secondary hover:bg-brand-secondary/90"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            data-testid={`decrease-quantity-${item.id}`}
          >
            <Minus className="h-4 w-4 text-white" />
          </Button>
          <div 
            className="w-[64px] h-[32px] border border-[#8B9CA1] rounded-[2px] flex items-center justify-center"
            data-testid={`item-quantity-${item.id}`}
          >
            {item.quantity}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-[24px] w-[24px] rounded-[96px] p-[4px] bg-brand-secondary hover:bg-brand-secondary/90"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            data-testid={`increase-quantity-${item.id}`}
          >
            <Plus className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-[24px] w-[24px] ml-auto p-0"
            onClick={() => onRemove(item.id)}
            data-testid={`remove-item-${item.id}`}
          >
            <Trash2 className="h-[20px] w-[20px] text-[#D93434]" />
          </Button>
        </div>
      </div>
    </div>
  );
}