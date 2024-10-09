import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shape: '',
    color: '',
    description: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/get-subadmin-product');
        setProducts(response.data); // Assuming response.data directly contains the array of products
      } catch (error) {
        toast.error('Error fetching products');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      shape: product.shape || '',
      color: product.color || '',
      description: product.description || '',
    });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleRejectProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}/delete`);
      setProducts(products.filter(p => p._id !== productId));
      if (selectedProduct && selectedProduct._id === productId) {
        setSelectedProduct(null);
      }
      toast.success('Product rejected successfully');
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error('Failed to reject product');
    }
  };

  const handleSubmitProduct = async () => {
    try {
      const updatedData = {
        name: formData.name,
        shape: formData.shape,
        colour: formData.color,
        description: formData.description,
      };

      const response = await axios.put(`http://localhost:3000/api/products/${selectedProduct._id}/accept`, updatedData);
      const updatedProduct = response.data.product;

      // Remove the accepted product from the products state
      setProducts(products.filter(p => p._id !== updatedProduct._id));

      // Reset the selected product and form data
      setSelectedProduct(null);
      setFormData({
        name: '',
        shape: '',
        color: '',
        description: '',
      });
      toast.success('Product accepted successfully');
    } catch (error) {
      console.error('Error accepting product:', error);
      toast.error('Failed to accept product');
    }
  };

  const commonColors = [
    'Red',
    'Green',
    'Blue',
    'Yellow',
    'Purple',
    'Orange',
    'Pink',
    'Black',
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white border-solid border-2 border-slate-800 rounded-2xl overflow-hidden flex transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="w-1/3 h-32 flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.category}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(product.image_url)}
              />
            </div>
            <div className="p-4 flex flex-col justify-between w-2/3">
              <div>
                <p className="font-semibold text-gray-700"><strong>Category:</strong> {product.category}</p>
                <p className="text-gray-500"><strong>Seller ID:</strong> {product.seller_id}</p>
              </div>
              <div className="mt-2 flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600"
                  onClick={() => handleViewProduct(product)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-red-600"
                  onClick={() => handleRejectProduct(product._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <div className="flex justify-end">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="mb-4">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.category}
                className="w-32 h-32 object-cover mx-auto rounded-md"
              />
            </div>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            />
            <label className="block mb-2">Shape:</label>
            <select
              value={formData.shape}
              onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            >
              <option value="">Select Shape</option>
              <option value="Square">Square</option>
              <option value="Rectangle">Rectangle</option>
              <option value="Circle">Circle</option>
              <option value="Triangle">Triangle</option>
              <option value="Other">Other</option>
            </select>
            <label className="block mb-2">Color:</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            >
              <option value="">Select Color</option>
              {commonColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <label className="block mb-2">Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            />
            <button
              onClick={handleSubmitProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600"
            >
              Accept Product
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative">
            <button
              className="absolute top- right-2 rounded-md text-black font-bold text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Product"
              className="max-w-full max-h-full bg-cover rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
