import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/inventory/get-inventory');
        setProducts(response.data);
      } catch (error) {
        toast.error('Error fetching inventory products');
        console.error('Error fetching inventory products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleUpdateProduct = async (sku_id, updatedDetails) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/inventory/${sku_id}`, updatedDetails);
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.sku_id === sku_id ? response.data.product : product
        )
      );
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  const handleUpdateAvailability = async (sku_id, availability) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/inventory/${sku_id}/put-availability`, { availability });
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.sku_id === sku_id ? response.data.product : product
        )
      );
      toast.success('Product availability updated successfully');
    } catch (error) {
      console.error('Error updating product availability:', error);
      toast.error('Error updating product availability');
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    handleUpdateProduct(selectedProduct.sku_id, {
      name: selectedProduct.name,
      description: selectedProduct.description,
      quantity: selectedProduct.quantity,
    });
    closeModal();
  };

  const openFullScreenImage = (imageUrl) => {
    setFullScreenImageUrl(imageUrl);
    setIsFullScreenOpen(true);
  };

  const closeFullScreenImage = () => {
    setIsFullScreenOpen(false);
    setFullScreenImageUrl('');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div
            key={product.sku_id}
            className="bg-white border-solid border-2 border-slate-800 rounded-2xl overflow-hidden flex flex-col transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="w-full h-32 flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.category}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openFullScreenImage(product.image_url)}
              />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <p className="font-semibold text-gray-700"><strong>SKU ID:</strong> {product.sku_id}</p>
                <p className="font-semibold text-gray-700"><strong>Name:</strong> {product.name}</p>
                <p className="text-gray-500"><strong>Category:</strong> {product.category}</p>
                <p className="text-gray-500"><strong>Quantity:</strong> {product.quantity}</p>
                <p className="text-gray-500"><strong>Description:</strong> {product.description}</p>
                <p className="text-gray-500"><strong>Availability:</strong> {product.availability ? 'Available' : 'Not Available'}</p>
              </div>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600"
                onClick={() => openModal(product)}
              >
                Edit
              </button>
              <button
                className={`mt-2 ${product.availability ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md transition-colors hover:${product.availability ? 'bg-red-600' : 'bg-green-600'}`}
                onClick={() => handleUpdateAvailability(product.sku_id, !product.availability)}
              >
                {product.availability ? 'Set Unavailable' : 'Set Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onRequestClose={closeModal}
          contentLabel="Edit Product"
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-900"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 overflow-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <label className="block mb-2">
              <span className="text-gray-700">Name:</span>
              <input
                type="text"
                name="name"
                value={selectedProduct.name}
                onChange={handleInputChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Description:</span>
              <textarea
                name="description"
                value={selectedProduct.description}
                onChange={handleInputChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Quantity:</span>
              <input
                type="number"
                name="quantity"
                value={selectedProduct.quantity}
                onChange={handleInputChange}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </label>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-green-600"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-red-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isFullScreenOpen && (
        <Modal
          isOpen={isFullScreenOpen}
          onRequestClose={closeFullScreenImage}
          contentLabel="Full Screen Image"
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-900"
        >
          <div className="relative">
            <button
              className="absolute top-4 right-4 w-9 font-bold bg-red-500 text-white p-1 rounded-full focus:outline-none"
              onClick={closeFullScreenImage}
            >
              X
            </button>
            <img
              src={fullScreenImageUrl}
              alt="Full size"
              className="max-h-screen max-w-screen object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryManagement;
