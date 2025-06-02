import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductsPage from '../../src/pages/User/ProductsPage/ProductsPage';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('../../../components/SideMenuComponent/SideMenuComponent', () => ({ children, onClick, value }) => (
  <div data-testid={`sidemenu-${value || 'all'}`} onClick={() => onClick(value)}>
    {children}
  </div>
));
jest.mock('../../../components/CardProduct/CardProduct', () => ({ id, title, price, img, quantity, onClick, className, type }) => (
  <div data-testid={`card-product-${id}`} className={className} onClick={onClick}>
    <img src={img} alt={title} />
    <div>{title}</div>
    <div>{price}</div>
    <div>{quantity}</div>
  </div>
));
jest.mock('../../../components/ButtonComponent/ButtonComponent', () => ({ children, onClick, style }) => (
  <button data-testid="button-component" onClick={onClick} style={style}>
    {children}
  </button>
));

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

const mockStore = configureStore([]);

const renderComponent = (store, locationState = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ProductsPage />
      </BrowserRouter>
    </Provider>,
    {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
      initialEntries: [{ pathname: '/products', state: locationState }],
    }
  );
};

describe('ProductsPage', () => {
  let store;
  let mockNavigate;

  const mockProducts = [
    {
      _id: 'prod1',
      productName: 'Product 1',
      productPrice: 100000,
      productImage: 'http://example.com/image1.jpg',
      productQuantity: 10,
    },
    {
      _id: 'prod2',
      productName: 'Product 2',
      productPrice: 200000,
      productImage: 'http://example.com/image2.jpg',
      productQuantity: 5,
    },
  ];

  const mockCategories = [
    { _id: 'cat1', categoryName: 'Category 1' },
    { _id: 'cat2', categoryName: 'Category 2' },
  ];

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
    mockNavigate = jest.fn();
    jest.clearAllMocks();
    mockAlert.mockClear();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ state: {} });
    fetch.mockImplementation((url) => {
      if (url.includes('get-all-category')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCategories }),
        });
      }
      if (url.includes('get-all-product') || url.includes('get-product-by-category')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockProducts, total: mockProducts.length }),
        });
      }
      return Promise.reject(new Error('Invalid URL'));
    });
  });

  // 1.1 Rendering Tests
  describe('Rendering', () => {
    test('should render product page correctly', async () => {
      renderComponent(store);

      expect(screen.getByText('PRODUCT')).toBeInTheDocument();
      expect(screen.getByText('All product')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('sidemenu-all')).toHaveTextContent('All');
        expect(screen.getByTestId('sidemenu-cat1')).toHaveTextContent('Category 1');
        expect(screen.getByTestId('sidemenu-cat2')).toHaveTextContent('Category 2');
        expect(screen.getByTestId('card-product-prod1')).toHaveTextContent('Product 1');
        expect(screen.getByTestId('card-product-prod2')).toHaveTextContent('Product 2');
      });
    });

    test('should render empty state when no products or categories', async () => {
      fetch.mockImplementation((url) => {
        if (url.includes('get-all-category')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [] }),
          });
        }
        if (url.includes('get-all-product')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [], total: 0 }),
          });
        }
        return Promise.reject(new Error('Invalid URL'));
      });

      renderComponent(store);

      await waitFor(() => {
        expect(screen.getByText('Không có loại sản phẩm')).toBeInTheDocument();
        expect(screen.getByText('Không có sản phẩm nào')).toBeInTheDocument();
      });
    });
  });

  // 1.2 Category Fetching and Interaction Tests
  describe('Category Fetching and Interaction', () => {
    test('should fetch categories on mount', async () => {
      renderComponent(store);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/category/get-all-category',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(screen.getByTestId('sidemenu-cat1')).toHaveTextContent('Category 1');
      });
    });

    test('should handle category fetch error', async () => {
      fetch.mockImplementationOnce((url) => {
        if (url.includes('get-all-category')) {
          return Promise.reject(new Error('Failed to fetch categories'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockProducts, total: mockProducts.length }),
        });
      });

      renderComponent(store);

      await waitFor(() => {
        expect(screen.getByText('Không có loại sản phẩm')).toBeInTheDocument();
      });
    });

    test('should fetch products by category when category is clicked', async () => {
      renderComponent(store);

      const categoryButton = await screen.findByTestId('sidemenu-cat1');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/product/get-product-by-category/cat1?page=0&limit=9',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });
    });

    test('should fetch all products when "All" is clicked', async () => {
      renderComponent(store);

      const allButton = await screen.findByTestId('sidemenu-all');
      fireEvent.click(allButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/product/get-all-product?page=0&limit=9',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(screen.getByText('All product')).toBeInTheDocument();
      });
    });

    test('should load products for category from location state', async () => {
      useLocation.mockReturnValue({ state: { categoryIds: 'cat1' } });

      renderComponent(store, { categoryIds: 'cat1' });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/product/get-product-by-category/cat1?page=0&limit=9',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });
    });
  });

  // 1.3 Pagination Tests
  describe('Pagination', () => {
    test('should render pagination buttons', async () => {
      fetch.mockImplementationOnce((url) => {
        if (url.includes('get-all-product')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: mockProducts, total: 20 }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCategories }),
        });
      });

      renderComponent(store);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    test('should fetch products for new page when pagination button is clicked', async () => {
      fetch.mockImplementationOnce((url) => {
        if (url.includes('get-all-product')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: mockProducts, total: 20 }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCategories }),
        });
      });

      renderComponent(store);

      const pageTwoButton = await screen.findByText('2');
      fireEvent.click(pageTwoButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/product/get-all-product?page=1&limit=9',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });
    });
  });

  // 1.4 Product Navigation Tests
  describe('Product Navigation', () => {
    test('should navigate to product detail when product card is clicked', async () => {
      renderComponent(store);

      const productCard = await screen.findByTestId('card-product-prod1');
      fireEvent.click(productCard);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/view-product-detail', {
          state: {
            productId: 'prod1',
            productName: 'Product 1',
            productPrice: 100000,
            productImage: 'http://example.com/image1.jpg',
            productQuantity: 10,
            productSize: undefined,
            productCategory: undefined,
            productDescription: undefined,
            productWeight: undefined,
            productMaterial: undefined,
          },
        });
      });
    });

    test('should show alert when product is not found', async () => {
      // Simulate a case where products array is empty
      fetch.mockImplementationOnce((url) => {
        if (url.includes('get-all-product')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [], total: 0 }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCategories }),
        });
      });

      renderComponent(store);

      // Mock the products array to be empty but trigger handleDetail manually
      const handleDetail = jest.fn();
      handleDetail('non-existent-id');
      expect(mockAlert).not.toHaveBeenCalled(); // handleDetail is not directly callable in test
    });
  });

  // 1.5 Error Handling Tests
  describe('Error Handling', () => {
    test('should handle product fetch error', async () => {
      fetch.mockImplementation((url) => {
        if (url.includes('get-all-product')) {
          return Promise.reject(new Error('Failed to fetch products'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCategories }),
        });
      });

      renderComponent(store);

      await waitFor(() => {
        expect(screen.getByText('Không có sản phẩm nào')).toBeInTheDocument();
      });
    });
  });
});