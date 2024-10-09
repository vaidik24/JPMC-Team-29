import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SingleItem from './SingleItem';
import { signInStart } from '../redux//user/userSlice';
import toast from 'react-hot-toast';

export default function ItemDisplay({ category }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser); // Assuming 'user' is the slice name in your Redux store

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/inventory/available-products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on the selected category
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  }, [category, products]);

  const handleSignInRequired = () => {
    if (currentUser=== null) {
      toast.error('Please sign in first to view products.');
      dispatch(signInStart()); // Dispatch action to start sign-in process if needed
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {filteredProducts.map(product => (
        <SingleItem
          key={product._id}
          id={product._id}
          name={product.name}
          description={product.description}
          image={product.image_url}
          quantity={product.quantity}
          sku_id={product.sku_id}
          onClick={handleSignInRequired} // Pass onClick handler to SingleItem
        />
      ))}
  
    </div>
  );
}
