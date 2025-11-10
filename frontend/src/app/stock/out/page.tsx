'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import { stockService, productService } from '@/lib/services';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function StockOutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    reference: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data.filter(p => p.currentStock > 0));
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setFormData({ ...formData, productId, quantity: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    if (formData.quantity > selectedProduct.currentStock) {
      toast.error(`Insufficient stock! Available: ${selectedProduct.currentStock}`);
      return;
    }

    setLoading(true);

    try {
      const result = await stockService.stockOut(formData);
      
      if (result.warning) {
        toast.warning(result.warning);
      } else {
        toast.success(`Stock removed successfully! New stock: ${result.product.currentStock}`);
      }
      
      setFormData({ productId: '', quantity: 1, reference: '' });
      setSelectedProduct(null);
      fetchProducts();
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📤 Stock Out</h1>
          <p className="text-gray-600 mb-6">Remove stock from inventory</p>

          <div className="bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                    Select Product *
                  </label>
                  <select
                    id="product"
                    required
                    value={formData.productId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">-- Select a product --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.productCode} - {product.name} (Stock: {product.currentStock})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProduct && (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Product Details</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Code:</strong> {selectedProduct.productCode}</p>
                      <p><strong>Name:</strong> {selectedProduct.name}</p>
                      <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                      <p><strong>Available Stock:</strong> {selectedProduct.currentStock}</p>
                      <p><strong>Min Stock:</strong> {selectedProduct.minStock}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    required
                    min="1"
                    max={selectedProduct?.currentStock || 1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    disabled={!selectedProduct}
                  />
                  {selectedProduct && formData.quantity > selectedProduct.currentStock && (
                    <p className="mt-1 text-sm text-red-600">
                      Insufficient stock! Available: {selectedProduct.currentStock}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Reference (Optional)
                  </label>
                  <input
                    type="text"
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Order number, customer name, etc."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedProduct}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}