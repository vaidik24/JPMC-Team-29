
// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { addToCart } from './cartSlice';

// const SingleItem = ({ id, name, description, image, quantity ,sku_id
// }) => {
//   const [count, setCount] = useState(0);
//   const dispatch = useDispatch();
//   // console.log(name)
//   const handleAddToCart = () => {
//     dispatch(addToCart({ id, name, description, image, count }));
//   };

//   const incrementCount = () => {
//     setCount(prevCount => prevCount + 1);
//   };

//   const decrementCount = () => {
//     if (count > 0) {
//       setCount(prevCount => prevCount - 1);
//     }
//   };

//   return (
//     <div className="single-item flex flex-col shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-md transition duration-200 ease-in-out">
//       <img
//         className="w-full h-64 object-cover" 
//         src={image}
//         alt={name}
//       />
//       <div className="px-4 py-3 flex-grow flex flex-col justify-between">
//         <div>
//           <div className="font-bold text-xl mb-2">{name}</div>
//           <p className='text-sm'>{sku_id}</p>
//           <p className="text-gray-700 text-base">{description}</p>
          
//         </div>
//         <div className="mt-4">
//           <div className="flex items-center mb-4 justify-center">
//             <button
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-l flex items-center justify-center text-lg"
//               onClick={decrementCount}
//             >
//               -
//             </button>
//             <input
//               type="number"
//               className="border outline-none w-16 h-10 bg-gray-100 text-center text-lg focus:ring-2 focus:ring-blue-500 mx-1"
//               value={count}
//               onChange={(e) => setCount(Number(e.target.value))}
//             />
//             <button
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-r flex items-center justify-center text-lg"
//               onClick={incrementCount}
//             >
//               +
//             </button>
//           </div>
//           <button
//             className="bg-[#E9EAEB] hover: w-full text-white font-bold py-2 px-4 rounded"
//             onClick={handleAddToCart}
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleItem;


import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import { toast } from 'react-hot-toast';

const SingleItem = ({ id, name, description, image, category,sku_id }) => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart);
  const currentUser = useSelector(state => state.user.currentUser); // Assuming 'user' is the slice name in your Redux store
  console.log(currentUser)
  const handleAddToCart = () => {
    const itemExists = items.find(item => item.id === id);
    if (itemExists && currentUser) {
      toast.error('Item already in the cart');
    } else if (currentUser==null){
      toast('Sign-in first!', {
  icon: '⚠️',
});

    }else {
      dispatch(addToCart({ id, name, description, image, quantity: 0,sku_id }));
      toast.success('Item added to the cart');
    }
  };

  return (
    <div className="single-item flex flex-col shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-md transition duration-200 ease-in-out">
      <img
        className="w-full h-64 object-cover" 
        src={image}
        alt={name}
      />
      <div className="px-4 py-3 flex-grow flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{name}</div>
          <p className='text-sm'> <span className='font-semibold'>SKU ID:</span>  <span className='text-cyan-800'>{sku_id}</span></p>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
        <div className="mt-4">
          <button
            className="btn btn-outline hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100s w-full text-black font-bold py-2 px-4 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
