import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import Admin from './pages/Admin';
import SuperAdminSubadminPanel from './pages/superadmin-subadmin-panel';
import SuperAdminProductPanel from './pages/Superadmin-product-panel';
import RedirectOnLogin from './pages/RedirectOnLogin'
import ImageUploadForm from './pages/ImageUploadForm';
import SubAdminProducts from './pages/SubAdmin-products';
import InventoryPage from './pages/Inventory'
import SuperAdminSellerPanel from './pages/SuperAdminSellerPanel'

export default function App() {
  return (
    
    <BrowserRouter>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <RedirectOnLogin>
      <Routes>
      
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        
        <Route element={<PrivateRoute allowedRoles={['seller', 'subadmin','superadmin','buyer']} />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/upload' element={<ImageUploadForm />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['subadmin', 'superadmin']} />}>
        {/* For subadmin to see users -- yet to complete */}
          <Route path='/admin' element={<Admin />} /> 
          <Route path='/subadmin' element={<SubAdminProducts />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['superadmin']} />}>
        {/* For superadmin to manage subadmin (CRUD) */}
          <Route path='/superadmin-SubAdminPanel' element={<SuperAdminSubadminPanel />} />
        {/* For superadmin to manage aproval or rejection of products by superadmin  */}
          <Route path='/superadmin-ProductPanel' element={<SuperAdminProductPanel />} />
        {/* for  subadmin to manage inventory that will be seen by the buyers */}
        <Route path='/inventory' element={<InventoryPage />} />
        {/* for  subadmin to manage inventory that will be seen by the buyers */}
        <Route path='/superadmin-SellerPanel' element={<SuperAdminSellerPanel />} />

        </Route>
      </Routes>
      </RedirectOnLogin>
    </BrowserRouter>
   
    
  );
}
