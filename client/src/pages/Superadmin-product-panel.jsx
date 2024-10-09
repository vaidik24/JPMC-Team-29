import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

const SuperadminProductControlPanel = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/get-superadmin-products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Error fetching products');
      console.error('Error fetching products:', error);
    }
  };
    fetchProducts();
  }, []);

  


  const handleApproveProduct = async (productId) => {
    try {
      await axios.put(`http://localhost:3000/api/products/${productId}/approve`);
      // Update local state to mark the product as approved
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId ? { ...product, approved: true } : product
        )
      );
      toast.success('Product approved successfully');
    } catch (error) {
      console.error('Error approving product:', error);
      toast.error('Error approving product');
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}/delete`);
      // Update local state to remove the rejected product
      setProducts(prevProducts =>
        prevProducts.filter(product => product._id !== productId)
      );
      toast.success('Product rejected successfully');
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error('Error rejecting product');
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
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
      <h2 className="text-2xl font-bold mb-4">Superadmin Product Control Panel</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div
            key={product._id}
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
              </div>
              <div className="mt-2 flex space-x-2">
                <button
                  className="bg-green-500 text-white px-4 w-1/2 py-2 rounded-md transition-colors hover:bg-green-600"
                  onClick={() => handleApproveProduct(product._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 w-1/2 py-2 rounded-md transition-colors hover:bg-red-600"
                  onClick={() => handleRejectProduct(product._id)}
                >
                  Reject
                </button>
              </div>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600"
                onClick={() => openModal(product)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onRequestClose={closeModal}
          contentLabel="Product Details"
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-900"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 overflow-auto">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="mb-4 w-full h-64 flex items-center justify-center">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="max-h-full max-w-full object-contain cursor-pointer"
                onClick={() => openFullScreenImage(selectedProduct.image_url)}
              />
            </div>
            <p><strong>SKU ID:</strong> {selectedProduct.sku_id}</p>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Shape:</strong> {selectedProduct.shape}</p>
            <p><strong>Color:</strong> {selectedProduct.colour}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Availability:</strong> {selectedProduct.availability ? 'Available' : 'Not Available'}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600"
              onClick={closeModal}
            >
              Close
            </button>
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

export default SuperadminProductControlPanel;
