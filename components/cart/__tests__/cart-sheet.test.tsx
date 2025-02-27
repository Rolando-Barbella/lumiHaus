import '@testing-library/jest-dom';
import { render, screen, waitFor, act, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartSheet } from '../cart-sheet';
import { CartProvider } from '@/lib/store/cart-context';
import { mockRouter } from '../../../jest.setup';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { formatPrice } from '@/lib/utils';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  image: '/test-image.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('CartSheet', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
  });

  const renderCartSheet = () => {
    return render(
      <CartProvider>
        <CartSheet />
      </CartProvider>
    );
  };

  it('renders cart button with badge', () => {
    renderCartSheet();
    expect(screen.getByTestId('cart-button')).toBeTruthy();
    expect(screen.getByTestId('cart-badge')).toBeTruthy();
  });

  it('shows empty cart message when opened with no items', async () => {
    const user = userEvent.setup();
    renderCartSheet();

    await act(async () => {
      await user.click(screen.getByTestId('cart-button'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('empty-cart-message')).toBeTruthy();
    });
  });

  it('displays cart items and updates total', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider initialState={{ 
        items: [{ ...mockProduct, quantity: 1 }],
        total: mockProduct.price,
        isOpen: false 
      }}>
        <CartSheet />
      </CartProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('cart-button'));
    });

    await waitFor(() => {
      expect(screen.getByTestId(`cart-item-${mockProduct.id}`)).toBeTruthy();
      expect(screen.getByTestId(`item-price-${mockProduct.id}`).textContent).toBe(formatPrice(mockProduct.price));
      expect(screen.getByTestId(`item-quantity-${mockProduct.id}`).textContent).toBe('1');
    });
  });

  it('allows updating item quantity', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider initialState={{ 
        items: [{ ...mockProduct, quantity: 1 }],
        total: mockProduct.price,
        isOpen: true 
      }}>
        <CartSheet />
      </CartProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId(`increase-quantity-${mockProduct.id}`));
    });

    await waitFor(() => {
      const quantity = getByText(screen.getByTestId(`item-quantity-${mockProduct.id}`), '2');
      expect(quantity).toBeTruthy();
    });

    await act(async () => {
      await user.click(screen.getByTestId(`decrease-quantity-${mockProduct.id}`));
    });

    await waitFor(() => {
      expect(screen.getByTestId(`item-quantity-${mockProduct.id}`).textContent).toBe('1');
      expect(screen.getByTestId('cart-total').textContent).toBe(formatPrice(mockProduct.price));
    });
  });

  it('removes item when quantity reaches 0', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider initialState={{ 
        items: [{ ...mockProduct, quantity: 1 }],
        total: mockProduct.price,
        isOpen: true 
      }}>
        <CartSheet />
      </CartProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId(`decrease-quantity-${mockProduct.id}`));
    });

    await waitFor(() => {
      expect(screen.getByTestId('empty-cart-message')).toBeTruthy();
      expect(screen.queryByTestId(`cart-item-${mockProduct.id}`)).toBeNull();
    });
  });

  it('removes item when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider initialState={{ 
        items: [{ ...mockProduct, quantity: 1 }],
        total: mockProduct.price,
        isOpen: true 
      }}>
        <CartSheet />
      </CartProvider>
    );

    expect(screen.getByTestId(`cart-item-${mockProduct.id}`)).toBeTruthy();

    await act(async () => {
      await user.click(screen.getByTestId(`remove-item-${mockProduct.id}`));
    });

    await waitFor(() => {
      expect(screen.queryByTestId(`cart-item-${mockProduct.id}`)).toBeNull();
      expect(screen.getByTestId('empty-cart-message')).toBeTruthy();
    });
  });

  it('navigates to checkout when proceed button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider initialState={{ 
        items: [{ ...mockProduct, quantity: 1 }],
        total: mockProduct.price,
        isOpen: true 
      }}>
        <CartSheet />
      </CartProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('checkout-button'));
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/checkout');
  });
});