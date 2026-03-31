import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';

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

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans" dir="rtl">
        <Navbar user={user} profile={profile} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/chefs" element={<Chefs />} />
            <Route path="/chef/:id" element={<ChefProfile />} />
            <Route path="/meal/:id" element={<MealDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Chef Route */}
            <Route 
              path="/dashboard" 
              element={
                profile?.role === 'chef' ? <ChefDashboard profile={profile} /> : <Navigate to="/" />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
