import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, subscribeToConnectionStatus, ConnectionStatus } from './firebase';
import { UserProfile } from './types';
import { AlertCircle, ExternalLink, X } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
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
import JoinUs from './pages/JoinUs';

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
          <Route path="/join-us" element={<PageWrapper><JoinUs /></PageWrapper>} />
          
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
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('loading');
  const [showBanner, setShowBanner] = useState(true);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubConn = subscribeToConnectionStatus(setConnStatus);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          let docSnap;
          try {
            docSnap = await getDoc(docRef);
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
            return;
          }
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
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
      unsubConn();
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
          {connStatus === 'error' && showBanner && (
            <div className="bg-red-600 text-white p-4 sticky top-0 z-[100] shadow-xl animate-in slide-in-from-top duration-500">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">إعداد قاعدة البيانات مطلوب (Firestore Setup Required)</p>
                    <p className="text-white/90 text-sm">
                      يبدو أن قاعدة البيانات لم يتم تفعيلها بعد. يرجى الذهاب إلى لوحة تحكم Firebase وتفعيل Cloud Firestore في "Test Mode".
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <a 
                    href="https://console.firebase.google.com/project/tablia1/firestore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none bg-white text-red-600 px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    تفعيل الآن
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
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
