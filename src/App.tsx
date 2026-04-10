import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';

// Pages
import Home from './pages/Home';
import Meals from './pages/Meals';
import Chefs from './pages/Chefs';
import ChefProfile from './pages/ChefProfile';
import MealDetails from './pages/MealDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChefDashboard from './pages/ChefDashboard';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import FAQ from './pages/FAQ';
import DriverTracking from './pages/DriverTracking';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { CartProvider } from './context/CartContext';

// Page Transition Wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = ({ profile }: { profile: UserProfile | null }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/meals" element={<PageWrapper><Meals /></PageWrapper>} />
          <Route path="/chefs" element={<PageWrapper><Chefs /></PageWrapper>} />
          <Route path="/chef/:id" element={<PageWrapper><ChefProfile /></PageWrapper>} />
          <Route path="/meal/:id" element={<PageWrapper><MealDetails /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/orders" element={<PageWrapper><MyOrders /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
          <Route path="/driver-tracking" element={<PageWrapper><DriverTracking /></PageWrapper>} />
          
          {/* Protected Chef Route */}
          <Route 
            path="/dashboard" 
            element={
              profile?.role === 'chef' ? <PageWrapper><ChefDashboard profile={profile} /></PageWrapper> : <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          // If Firestore is unreachable, we might still have a user but no profile
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col font-sans" dir="rtl">
          <Toaster position="top-center" richColors />
          {isOffline && (
            <div className="bg-red-500 text-white text-center py-2 text-sm font-bold animate-pulse">
              أنت تعمل في وضع عدم الاتصال. قد لا تتوفر بعض الميزات.
            </div>
          )}
          <Navbar user={user} profile={profile} />
          <main className="flex-grow">
            <AnimatedRoutes profile={profile} />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}
