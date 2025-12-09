import { useEffect, useMemo, useState, useCallback } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter } from '../components/products/ProductFilter';
import { ProductEditor } from '../components/products/ProductEditor';
import { useProductStore } from '../store/productStore';
import { useNotificationStore } from '../store/notificationStore';
import { useDebounce } from '../hooks';
import type { Product, ProductFilters } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Plus } from 'lucide-react';
import './ProductsPage.css';

export function ProductsPage() {
  const { products, loading, fetchProducts, deleteProduct, updateProduct, addProduct, filters, setFilters } = useProductStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);
  const debouncedSearch = useDebounce(localFilters.search, 300);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setFilters({ ...localFilters, search: debouncedSearch });
  }, [debouncedSearch, localFilters, setFilters]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !localFilters.search || 
        product.name.toLowerCase().includes(localFilters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(localFilters.search.toLowerCase());
      
      const matchesCategory = !localFilters.category || 
        product.category === localFilters.category;
      
      const matchesStatus = !localFilters.status || 
        product.status === localFilters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, localFilters]);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      addNotification({
        type: 'success',
        message: 'Product deleted successfully',
        read: false
      });
    }
  }, [deleteProduct, addNotification]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  }, []);

  const handleSaveProduct = useCallback((updatedData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, updatedData);
      addNotification({
        type: 'success',
        message: `Product "${updatedData.name}" updated successfully`,
        read: false
      });
    } else {
      addProduct(updatedData as Omit<Product, 'id'>);
      addNotification({
        type: 'success',
        message: `Product "${updatedData.name}" created successfully`,
        read: false
      });
    }
  }, [editingProduct, updateProduct, addProduct, addNotification]);

  if (loading && products.length === 0) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <div className="products-page">
      <header className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory</p>
        </div>
        <button className="btn-add-product" onClick={handleAddNew}>
          <Plus size={20} />
          Add Product
        </button>
      </header>

      <ProductFilter 
        filters={localFilters}
        onFilterChange={setLocalFilters}
      />

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProductEditor
        key={editingProduct?.id || 'new'}
        product={editingProduct}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
