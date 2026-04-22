import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Chrome, Apple, Phone, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { CHEF_IMAGE_URL } from '../constants';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.53-.67-2.87-.67-1.36 0-1.85.65-2.87.67-1.17.02-2.15-.73-3.27-1.75-2.25-2.06-3.87-5.83-3.87-9.15 0-3.32 1.66-5.1 3.27-5.1 1.12 0 1.95.63 2.75.63.78 0 1.83-.75 3.15-.75 1.1 0 2.5.53 3.37 1.63-2.58 1.4-2.13 5.13.43 6.35-.9 2.1-2.13 4.87-3.97 6.57zM12.03 5.2c-.12-2.3 1.62-4.3 3.6-4.2.25 2.3-1.85 4.4-3.6 4.2z"/>
  </svg>
);

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();
    const cleanPassword = password.trim();
    
    if (!cleanPhone || !cleanPassword) {
      setError('يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const virtualEmail = `${cleanPhone}@tablia.com`;
      await signInWithEmailAndPassword(auth, virtualEmail, cleanPassword);
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('خطأ في رقم الهاتف أو كلمة المرور. يرجى المحاولة مرة أخرى.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('تسجيل الدخول غير مفعل حالياً. يرجى تفعيله من لوحة تحكم Firebase أو استخدام جوجل.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم حظر الدخول مؤقتاً بسبب محاولات فاشلة كثيرة. حاول لاحقاً.');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول: ' + (err.message || 'خطأ غير معروف'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists, if not create a basic customer profile
      if (db) {
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email || 'no-email@example.com',
            displayName: result.user.displayName || 'مستخدم جديد',
            photoURL: result.user.photoURL || '',
            role: 'customer',
            createdAt: Date.now(),
          });
        }
      }
      
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('فشل تسجيل الدخول باستخدام جوجل: ' + (err.message || 'خطأ غير معروف'));
    }
  };

  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      
      if (db) {
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email || 'no-email@example.com',
            displayName: result.user.displayName || 'مستخدم جديد',
            photoURL: result.user.photoURL || '',
            role: 'customer',
            createdAt: Date.now(),
          });
        }
      }
      
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Apple login error:', err);
      setError('فشل تسجيل الدخول باستخدام أبل: ' + (err.message || 'خطأ غير معروف'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-cream">
      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-brand-cream">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-12">
            <h1 className="text-[40px] md:text-[56px] font-black text-brand-accent mb-4 leading-tight">مرحباً بك في طبلية</h1>
            <p className="text-stone-500 text-xl font-medium">سجل دخولك أو أنشئ حساباً جديداً للمتابعة</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-medium flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 mr-1">رقم الهاتف</label>
              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input 
                  type="tel" 
                  required 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-200 bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all text-lg"
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-stone-700">كلمة المرور</label>
                <Link to="#" className="text-sm font-bold text-brand-primary hover:underline">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-200 bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all text-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight size={20} className="rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-brand-cream text-stone-400 font-medium">أو سجل عبر</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-stone-200 text-stone-700 py-4 rounded-2xl text-lg font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <GoogleIcon />
              جوجل
            </button>
            <button 
              onClick={handleAppleLogin}
              className="w-full bg-stone-900 text-white py-4 rounded-2xl text-lg font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <AppleIcon />
              أبل
            </button>
          </div>

          <p className="mt-10 text-center text-stone-500 text-lg">
            ليس لديك حساب؟ <Link to="/register" className="text-brand-primary font-bold hover:underline">أنشئ حساباً جديداً</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
