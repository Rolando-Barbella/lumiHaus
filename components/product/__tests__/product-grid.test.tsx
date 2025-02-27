import { render, screen, waitFor, act, within } from '@testing-library/react';
import { ProductGrid } from '../product-grid';
import { CartProvider } from '@/lib/store/cart-context';
import { formatPrice } from '@/lib/utils';
import userEvent from '@testing-library/user-event';

// Mock the API service
const defaultProducts = [
  { id: 1, name: 'Product 1', price: 100, image: '/product1.jpg' },
  { id: 2, name: 'Product 2', price: 200, image: '/product2.jpg' },
  { id: 3, name: 'Product 3', price: 300, image: '/product3.jpg' },
  { id: 4, name: 'Product 4', price: 400, image: '/product4.jpg' },
  { id: 5, name: 'Product 5', price: 500, image: '/product5.jpg' },
];

jest.mock('../../../lib/services/api', () => ({
  fetchProducts: jest.fn().mockResolvedValue([
    { id: 1, name: 'Product 1', price: 100, image: '/product1.jpg' },
    { id: 2, name: 'Product 2', price: 200, image: '/product2.jpg' },
    { id: 3, name: 'Product 3', price: 300, image: '/product3.jpg' },
    { id: 4, name: 'Product 4', price: 400, image: '/product4.jpg' },
    { id: 5, name: 'Product 5', price: 500, image: '/product5.jpg' },
  ]),
}));


const mockToast = jest.fn();
jest.mock('../../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    mockIntersectionObserver(callback);
  }
  disconnect = mockDisconnect;
  observe = mockObserve;
  unobserve = jest.fn();
}

describe('ProductGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();

    // Reset IntersectionObserver mock
    (global as any).IntersectionObserver = MockIntersectionObserver;
  });

  const renderProductGrid = () => {
    return render(
      <CartProvider>
        <ProductGrid />
      </CartProvider>
    );
  };

  const getProductCards = () => {
    return screen.queryAllByRole('article');
  };

  it('renders loading state initially', async () => {
    renderProductGrid();

    // Check for loading skeleton cards
    const skeletonCards = screen.getAllByTestId('skeleton-card');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('should render products after loading', async () => {
    await act(async () => {
      renderProductGrid();
    });

    await waitFor(() => {
      const productCards = getProductCards();
      expect(productCards).toHaveLength(3);
    });

    const firstProduct = defaultProducts[0];
    expect(screen.getByTestId(`product-name-${firstProduct.id}`).textContent).toBe(firstProduct.name);
    expect(screen.getByTestId(`product-price-${firstProduct.id}`).textContent).toBe(formatPrice(firstProduct.price));
  });

  it('shows error message when API fails', async () => {
    // Mock API failure
    const fetchProductsMock = require('../../../lib/services/api').fetchProducts;
    fetchProductsMock.mockRejectedValueOnce(new Error('Failed to fetch products'));

    await act(async () => {
      renderProductGrid();
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Failed to fetch products',
      variant: 'destructive',
    });
  });

  it('shows "No products available" when there are no products', async () => {
    const fetchProductsMock = require('../../../lib/services/api').fetchProducts;
    fetchProductsMock.mockResolvedValueOnce([]);

    await act(async () => {
      renderProductGrid();
    });

    await waitFor(() => {
      expect(screen.getByText('No products available.')).toBeInTheDocument();
    });
  });

  it('adds product to cart when "Add to Cart" is clicked', async () => {
    const user = userEvent.setup();
    renderProductGrid();

    // Wait for products to load
    await waitFor(() => {
      const productCards = getProductCards();
      expect(productCards).toHaveLength(3);
    });

    const firstProduct = defaultProducts[0];
    const addToCartButton = screen.getByTestId(`add-to-cart-${firstProduct.id}`);

    await act(async () => {
      await user.click(addToCartButton);
    });

    // Check toast notification
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Added to cart',
      description: `${firstProduct.name} has been added to your cart.`,
    });
  });


  it('loads more products when scrolling', async () => {
    renderProductGrid();

    await waitFor(() => {
      const initialProducts = getProductCards();
      expect(initialProducts).toHaveLength(3);
    });

    // Simulate intersection observer callback
    const [intersectionCallback] = mockIntersectionObserver.mock.calls[0];
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          target: document.createElement('div'),
        },
      ]);
    });
    await waitFor(() => {
      const newProducts = getProductCards();
      expect(screen.getByText('Loading more products...')).toBeInTheDocument();
    });
  });

  it('displays correct price formatting', async () => {
    renderProductGrid();

    // Wait for products to load
    await waitFor(() => {
      const productCards = getProductCards();
      expect(productCards).toHaveLength(3);
    });

    defaultProducts.slice(0, 3).forEach(product => {
      expect(screen.getByTestId(`product-price-${product.id}`).textContent).toBe(formatPrice(product.price));
    });
  });

  it('shows loading indicator when more products are being loaded', async () => {
    renderProductGrid();

    // Wait for initial products to load
    await waitFor(() => {
      const productCards = getProductCards();
      expect(productCards).toHaveLength(3);
    });

    // Simulate intersection observer callback
    const [intersectionCallback] = mockIntersectionObserver.mock.calls[0];
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          target: document.createElement('div'),
        },
      ]);
    });

    expect(screen.getByTestId('load-more')).toBeInTheDocument();
    expect(screen.getByText('Loading more products...')).toBeInTheDocument();
  });

  it('renders product images correctly', async () => {
    renderProductGrid();

    await waitFor(() => {
      const productCards = getProductCards();
      expect(productCards).toHaveLength(3);
    });


    defaultProducts.slice(0, 3).forEach(product => {
      const productCard = screen.getByTestId(`product-card-${product.id}`);
      const image = within(productCard).getByRole('img');
      expect(image).toHaveAttribute('src', product.image);
      expect(image).toHaveAttribute('alt', product.name);
    });
  });
});
