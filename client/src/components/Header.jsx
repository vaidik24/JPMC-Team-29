import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoImage from '../assets/Homeassets/logo.png'; // Rename logo to logoImage to avoid conflict with logo variable name


export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const location = useLocation();

  // Calculate number of unique items in the cart
  const uniqueItemCount = new Set(cart.map(item => item.id)).size;

  return (
    <div className="navbarout">
      <div className='border-b-2 border-black'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to='/'>
            <div className='flex items-center'> {/* Fixed classname syntax */}
              <img src={logoImage} alt="Logo" className="h-8 sm:h-10 mr-4" />
              <h1 className='font-bold hidden text-lg sm:block'>Janardhan Prasad Memorial Multipurpose Social Service Society</h1>
            </div>
          </Link>
          <ul className='flex gap-4 font-semibold'>
            {/* Home link only shown if currentUser role is not superadmin */}
            {!currentUser || (currentUser && currentUser.role !== 'superadmin') && (
              <Link to='/' className={`hover:bg-slate-200 rounded-lg px-2 py-1 ${location.pathname === '/' ? 'bg-slate-200' : ''}`}>
                <li className='ml-2 mr-2'>Home</li>
              </Link>
            )}
            {currentUser && currentUser.role === 'seller' && (
              <Link to='/upload' className='hover:bg-slate-200 rounded-lg px-2 py-1'>
                <li className='ml-2 mr-2'>Upload Image</li>
              </Link>
            )}
            {currentUser && currentUser.role === 'subadmin' && (
              <Link to='/subadmin' className={`hover:bg-slate-200 rounded-lg px-2 py-1 ${location.pathname === '/subadmin' ? 'bg-slate-200' : ''}`}>
                <li className='ml-2 mr-2'>SubAdmin Dashboard</li>
              </Link>
            )}
            {currentUser && currentUser.role === 'superadmin' && (
              <>
                <Link to='/superadmin-SubAdminPanel' className={`hover:bg-slate-200 rounded-lg flex text-center px-2 py-1 ${location.pathname === '/superadmin-SubAdminPanel' ? 'bg-slate-200' : ''}`}>
                  <li className='ml-2 mr-2'>Manage Subadmins</li>
                </Link>
                <Link to='/superadmin-SellerPanel' className={`hover:bg-slate-200 flex text-center rounded-lg px-2 py-1 ${location.pathname === '/superadmin-SellerPanel' ? 'bg-slate-200' : ''}`}>
                  <li className='ml-2 mr-2'>Manage Sellers</li>
                </Link>
                <Link to='/superadmin-ProductPanel' className={`hover:bg-slate-200 flex text-center rounded-lg px-2 py-1 ${location.pathname === '/superadmin-ProductPanel' ? 'bg-slate-200' : ''}`}>
                  <li className='ml-2 mr-2'>Manage Products</li>
                </Link>
                <Link to='/inventory' className={`hover:bg-slate-200 flex text-center rounded-lg px-2 py-1 ${location.pathname === '/inventory' ? 'bg-slate-200' : ''}`}>
                  <li className='ml-2 mr-2'>Inventory Panel</li>
                </Link>
                
              </>
            )}
            {/* Cart link only shown if currentUser role is not superadmin */}
            {!currentUser || (currentUser && currentUser.role !== 'superadmin') && (
              <Link to='/cart' className={`hover:bg-slate-200 rounded-lg px-2 py-1 relative ${location.pathname === '/cart' ? 'bg-slate-200' : ''}`}>
                <li className='ml-2 mr-2'>
                  Cart {uniqueItemCount > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -top-1 -right-1">{uniqueItemCount}</span>}
                </li>
              </Link>
            )}
            <Link to={currentUser ? '/profile' : '/sign-in'} className='hover:bg-gray-100 rounded-lg px-2 py-1'>
              {currentUser ? (
                <img
                  src={currentUser.profilePicture}
                  alt='profile'
                  className='h-7 w-7 rounded-full object-cover ml-2 mr-2'
                />
              ) : (
                <li className='ml-2 mr-2'>Sign In</li>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
