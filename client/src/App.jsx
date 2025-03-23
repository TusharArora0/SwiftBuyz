import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import NewArrivals from './pages/NewArrivals';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Wishlist from './pages/Wishlist';
import OrderSuccess from './pages/OrderSuccess';
import OrderConfirmation from './pages/OrderConfirmation';
import Footer from './components/Footer';
import ProfileSettings from './pages/profiles/ProfileSettings';
import OrderHistory from './components/OrderHistory';
import ReturnPolicy from './pages/ReturnPolicy';
import SellerProducts from './pages/profiles/SellerProducts';
import ShippingPolicy from './pages/ShippingPolicy';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import BackToTop from './components/BackToTop';

// Add ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Suspense fallback={<Loading />}>
          <ScrollToTop />
          <Navbar />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['consumer', 'seller']}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/orders" 
                element={
                  <ProtectedRoute>
                    <Box sx={{ maxWidth: 'md', mx: 'auto', py: 4 }}>
                      <OrderHistory />
                    </Box>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/products" 
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route 
                path="/order-confirmation" 
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/settings" 
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <Footer />
          <BackToTop />
        </Suspense>
      </Box>
    </Router>
  );
}

export default App;