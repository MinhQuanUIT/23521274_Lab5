// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Sales Types
export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  customer: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}

// Analytics Types
export interface ChartData {
  date: string;
  value: number;
  category?: string;
}

export interface KPICard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

// Store States
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setFilters: (filters: ProductFilters) => void;
  fetchProducts: () => Promise<void>;
}

export interface SalesState {
  sales: Sale[];
  metrics: SalesMetrics;
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => void;
}

export interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'vi';
  currency: 'USD' | 'VND';
  notifications: boolean;
}

export interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}
