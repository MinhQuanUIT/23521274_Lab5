import { create } from 'zustand';
import type { SalesState, Sale, SalesMetrics } from '../types';

const mockSales: Sale[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Laptop Dell XPS 15',
    quantity: 2,
    totalPrice: 2599.98,
    customer: 'John Doe',
    date: '2024-12-01',
    status: 'completed'
  },
  {
    id: '2',
    productId: '2',
    productName: 'iPhone 15 Pro',
    quantity: 5,
    totalPrice: 4999.95,
    customer: 'Jane Smith',
    date: '2024-12-02',
    status: 'completed'
  },
  {
    id: '3',
    productId: '3',
    productName: 'Office Chair Ergonomic',
    quantity: 10,
    totalPrice: 2999.90,
    customer: 'ABC Company',
    date: '2024-12-03',
    status: 'pending'
  },
  {
    id: '4',
    productId: '5',
    productName: 'Mechanical Keyboard',
    quantity: 3,
    totalPrice: 389.97,
    customer: 'Tech Store',
    date: '2024-12-04',
    status: 'completed'
  }
];

const calculateMetrics = (sales: Sale[]): SalesMetrics => {
  const completedSales = sales.filter(s => s.status === 'completed');
  const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalOrders = completedSales.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    growthRate: 12.5 // Mock growth rate
  };
};

export const useSalesStore = create<SalesState>((set) => ({
  sales: [],
  metrics: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    growthRate: 0
  },
  loading: false,
  error: null,

  fetchSales: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const metrics = calculateMetrics(mockSales);
      set({ sales: mockSales, metrics, loading: false });
    } catch {
      set({ error: 'Failed to fetch sales', loading: false });
    }
  },

  addSale: (sale) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString()
    };
    set(state => {
      const updatedSales = [...state.sales, newSale];
      const metrics = calculateMetrics(updatedSales);
      return { sales: updatedSales, metrics };
    });
  }
}));
