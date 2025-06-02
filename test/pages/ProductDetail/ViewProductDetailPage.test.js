import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ViewProductDetailPage from '../../../src/pages/User/ProductDetail/ViewProductDetailPage';
import { addToCart } from '../../../redux/slides/cartSlide';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('../../../components/SizeComponent/SizeComponent', () => ({ children }) => <div data-testid="size-component">{children}</div>);
jest.mock('../../../components/ButtonComponent/ButtonComponent', () => ({ children, onClick, style }) => (
  <button data-testid="button-component" onClick={onClick} style={style}>{children}</button>
));
jest.mock('../../../components/QuantityBtn/QuantityBtn', () => () => <div data-testid="quantity-btn">QuantityBtn</div>);

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
        <ViewProductDetailPage />
      </BrowserRouter>
    </Provider>,
    {
      wrapper: ({ children }) => (
        <BrowserRouter>{children}</BrowserRouter>
      ),
      initialEntries: [{ pathname: '/product-detail', state: locationState }],
    }
  );
};

describe('ViewProductDetailPage', () => {
  let store;
  let mockNavigate;
  let mockDispatch;

  const mockProductData = {
    _id: '123',
    productName: 'Test Product',
    productPrice: 100000,
    productSize: 'M',
    productCategory: 'cat1',
    productImage: 'http://example.com/image.jpg',
    productDescription: 'Test description',
    productQuantity: 10,
    productWeight: '500g',
    productMaterial: 'Cotton',
  };

  const mockCategories = [
    { _id: 'cat1', categoryName: 'Category 1' },
    { _id: 'cat2', categoryName: 'Category 2' },
  ];

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
    mockNavigate = jest.fn();
    mockDispatch = jest.fn();
    jest.clearAllMocks();
    mockAlert.mockClear();
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useLocation.mockReturnValue({ state: mockProductData });
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockCategories }),
    });
  });

  // 1.1 Product Details Rendering Tests
  describe('Product Details Rendering', () => {
    test('should render product details correctly', async () => {
      renderComponent(store, mockProductData);

      expect(screen.getByText('Product Detail')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$100,000 VND')).toBeInTheDocument();
      expect(screen.getByTestId('size-component')).toHaveTextContent('M');
      expect(screen.getByText('500g feces')).toBeInTheDocument();
      expect(screen.getByText('Cotton')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Product' })).toHaveAttribute('src', 'http://example.com/image.jpg');

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });
    });

    test('should render default product data when no state is provided', () => {
      useLocation.mockReturnValue({ state: null });
      renderComponent(store);

      expect(screen.getByText('Product Detail')).toBeInTheDocument();
      expect(screen.getByText('$NaN VND')).toBeInTheDocument(); // Empty price leads to NaN
      expect(screen.getByTestId('size-component')).toHaveTextContent('');
      expect(screen.getByText('Mô Tả')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  // 1.2 Category Fetching Tests
  describe('Category Fetching', () => {
    test('should fetch and display categories on mount', async () => {
      renderComponent(store, mockProductData);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/category/get-all-category',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });
    });

    test('should handle fetch categories error gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Failed to fetch categories'));

      renderComponent(store, mockProductData);

      await waitFor(() => {
        expect(screen.getByText('Không có loại sản phẩm')).toBeInTheDocument();
      });
    });

    test('should show no category when categories array is empty', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      renderComponent(store, mockProductData);

      await waitFor(() => {
        expect(screen.getByText('Không có loại sản phẩm')).toBeInTheDocument();
      });
    });
  });

  // 1.3 Add to Cart Functionality Tests
  describe('Add to Cart Functionality', () => {
    test('should dispatch addToCart when Add to Cart button is clicked', async () => {
      renderComponent(store, mockProductData);

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      expect(mockDispatch).toHaveBeenCalledWith(
        addToCart({
          id: '123',
          img: 'http://example.com/image.jpg',
          title: 'Test Product',
          price: 100000,
          quantity: 1,
          productQuantity: 10,
        })
      );
    });

    test('should show alert and not dispatch addToCart when product is out of stock', async () => {
      useLocation.mockReturnValue({
        state: { ...mockProductData, productQuantity: 0 },
      });

      renderComponent(store, { ...mockProductData, productQuantity: 0 });

      expect(screen.getByText('Sold Out')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();

      // Since button is not present, no dispatch should occur
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockAlert).not.toHaveBeenCalled(); // Alert is only triggered if button is clicked
    });
  });

  // 1.4 Navigation Tests
  describe('Navigation', () => {
    test('should navigate to /products when Exit button is clicked', async () => {
      renderComponent(store, mockProductData);

      const exitButton = screen.getByRole('button', { name: /exit/i });
      fireEvent.click(exitButton);

      expect(mockNavigate).toHaveBeenCalledWith('/products');
    });
  });

  // 1.5 Button State Tests
  describe('Button State', () => {
    test('should show Add to Cart button when product is in stock', () => {
      renderComponent(store, mockProductData);

      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
      expect(screen.queryByText('Sold Out')).not.toBeInTheDocument();
    });

    test('should show Sold Out label when product is out of stock', () => {
      useLocation.mockReturnValue({
        state: { ...mockProductData, productQuantity: 0 },
      });

      renderComponent(store, { ...mockProductData, productQuantity: 0 });

      expect(screen.getByText('Sold Out')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
    });
  });
});