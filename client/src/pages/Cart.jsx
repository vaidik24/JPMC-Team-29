import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../redux/cart/cartSlice';
import toast from 'react-hot-toast';
import emptyCartImage from '../assets/Cart/Empty Cart.png'
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const cart = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendQuery = async () => {
    if (currentUser.role !== 'buyer') {
      toast.error('Only buyers can send queries.');
      return;
    }

    const queryDetails = cart.map(item => ({
      itemname: item.name,
      quantity: item.quantity,
      sku_id: item.sku_id
    }));
    console.log(queryDetails)

    const mailData = {
      buyerName: currentUser.username,
      buyerEmail: currentUser.email,
      queryDetails
    };

    try {
      const response = await fetch('http://localhost:3000/api/products/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mailData)
      });

      if (response.ok) {
        toast.success('Query sent successfully!');
      } else {
        toast.error('Failed to send query.');
      }
    } catch (error) {
      toast.error('Error sending query.');
    }
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white  rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center">
            <img src={emptyCartImage} alt="Empty Cart" className="w-64 mb-4" />
            <p className="text-3xl text-black">Your cart is empty</p>
            <p className='text-xl from-neutral-600'>Looks like you have not added anything to you cart. Go
ahead & explore top categories.</p>
          <button
              className='btn bg-red-500 hover:bg-red-400 mt-4'
              onClick={() => navigate('/')}
            >
              Shop Products
            </button>
          </div>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-4 rounded-lg shadow-none hover:shadow transition-shadow">
                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-500">{item.description}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="btn bg-black hover:btn-error text-white btn-sm mr-2"
                    onClick={() => dispatch(removeFromCart({ id: item.id }))}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-outline btn-sm ml-1"
                    onClick={() => {
                      if (item.quantity > 1) {
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                      }
                    }}
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    className="mx-2 w-16 text-center border rounded"
                  />
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  >
                    +
                  </button>
                  
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <button
              className="btn btn-warning"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
            <button
              className="btn btn-success"
              onClick={handleSendQuery}
            >
              Send Query
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ShoppingCart;
