import { create } from 'zustand';
import type { ProductState, Product } from '../types';

// Mock data - 5000+ products for Live Inventory Feed requirement
const generateMockProducts = (): Product[] => {
  const baseProducts = [
    { name: 'Laptop', category: 'Electronics', basePrice: 1299.99, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400' },
    { name: 'Smartphone', category: 'Electronics', basePrice: 999.99, image: 'https://images.unsplash.com/photo-1592286927505-fa02e3150ec5?w=400' },
    { name: 'Office Chair', category: 'Furniture', basePrice: 299.99, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
    { name: 'Desk', category: 'Furniture', basePrice: 499.99, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400' },
    { name: 'Wireless Mouse', category: 'Accessories', basePrice: 29.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
    { name: 'Mechanical Keyboard', category: 'Accessories', basePrice: 129.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
    { name: 'Monitor', category: 'Electronics', basePrice: 399.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400' },
    { name: 'Headphones', category: 'Electronics', basePrice: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { name: 'T-Shirt', category: 'Clothing', basePrice: 24.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Jeans', category: 'Clothing', basePrice: 59.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
  ];

  const products: Product[] = [];
  const statuses: Array<'active' | 'inactive' | 'out-of-stock'> = ['active', 'active', 'active', 'inactive', 'out-of-stock'];

  for (let i = 0; i < 5000; i++) {
    const base = baseProducts[i % baseProducts.length];
    const variation = Math.floor(i / baseProducts.length);
    const status = statuses[i % statuses.length];
    
    products.push({
      id: String(i + 1),
      name: `${base.name} ${variation > 0 ? `v${variation}` : ''}`,
      category: base.category,
      price: base.basePrice + (variation * 10),
      stock: status === 'out-of-stock' ? 0 : Math.floor(Math.random() * 200) + 1,
      status,
      image: base.image,
      description: `High-quality ${base.name.toLowerCase()} with excellent features`,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date(2024, 11, Math.floor(Math.random() * 9) + 1).toISOString()
    });
  }

  return products;
};

const mockProducts = generateMockProducts();

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  filters: {},

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ products: mockProducts, loading: false });
    } catch {
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(state => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: (id, updatedData) => {
    set(state => ({
      products: state.products.map(product =>
        product.id === id
          ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
          : product
      )
    }));
  },

  deleteProduct: (id) => {
    set(state => ({
      products: state.products.filter(product => product.id !== id)
    }));
  },

  setFilters: (filters) => {
    set({ filters });
  }
}));
