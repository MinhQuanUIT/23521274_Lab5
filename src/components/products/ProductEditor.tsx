import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';
import './ProductEditor.css';

interface ProductEditorProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
  description?: string;
}

export function ProductEditor({ product, isOpen, onClose, onSave }: ProductEditorProps) {
  // Calculate initial form data based on product prop
  const initialFormData = useMemo(() => {
    if (product) {
      return {
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        status: product.status,
        description: product.description,
        image: product.image
      };
    }
    return {
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      status: 'active' as const,
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    };
  }, [product]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Reset form when modal closes
  const handleClose = () => {
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    const price = parseFloat(formData.price);
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (price > 1000000) {
      newErrors.price = 'Price must be less than 1,000,000';
    }

    const stock = parseInt(formData.stock, 10);
    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(stock) || stock < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => new Set(prev).add(field));
    validateForm();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched.has(field)) {
      validateForm();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched(new Set(['name', 'category', 'price', 'stock', 'description']));
    
    if (!validateForm()) {
      return;
    }

    const updatedProduct: Partial<Product> = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      status: formData.status,
      description: formData.description.trim(),
      image: formData.image
    };

    onSave(updatedProduct);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">
              Product Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={errors.name && touched.has('name') ? 'error' : ''}
            />
            {errors.name && touched.has('name') && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                className={errors.category && touched.has('category') ? 'error' : ''}
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Sports">Sports</option>
                <option value="Home & Garden">Home & Garden</option>
              </select>
              {errors.category && touched.has('category') && (
                <span className="error-message">{errors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive' | 'out-of-stock')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price ($) <span className="required">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                onBlur={() => handleBlur('price')}
                className={errors.price && touched.has('price') ? 'error' : ''}
              />
              {errors.price && touched.has('price') && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                onBlur={() => handleBlur('stock')}
                className={errors.stock && touched.has('stock') ? 'error' : ''}
              />
              {errors.stock && touched.has('stock') && (
                <span className="error-message">{errors.stock}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={errors.description && touched.has('description') ? 'error' : ''}
            />
            {errors.description && touched.has('description') && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
