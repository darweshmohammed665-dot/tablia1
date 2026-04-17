import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from '../firebase';
import { motion } from 'motion/react';
import { Mail, Lock, User, ChefHat, ArrowRight, Chrome, CheckCircle2, Apple, MapPin, Phone } from 'lucide-react';
import { UserRole } from '../types';
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

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<UserRole>((searchParams.get('role') as UserRole) || 'customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const virtualEmail = `${phoneNumber}@tablia.com`;
    console.log('Submitting registration form...', { phoneNumber, role, location });
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      if (db) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: virtualEmail,
          displayName: name,
          phoneNumber,
          location,
          role,
          createdAt: Date.now(),
        });
      }

      toast.success('تم إنشاء الحساب بنجاح!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('رقم الهاتف مستخدم بالفعل. حاول تسجيل الدخول بدلاً من ذلك.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('تسجيل الدخول غير مفعل حالياً. يرجى تفعيله من لوحة تحكم Firebase أو استخدام جوجل.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً. يجب أن تكون 6 أحرف على الأقل.');
      } else if (err.code === 'auth/invalid-email') {
        setError('رقم الهاتف غير صالح.');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب: ' + (err.message || 'خطأ غير معروف'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (db) {
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email || 'no-email@example.com',
            displayName: result.user.displayName || 'مستخدم جديد',
            photoURL: result.user.photoURL || '',
            role: role,
            createdAt: Date.now(),
          });
        } else {
          // If user exists, don't overwrite role or createdAt
          await setDoc(userRef, {
            email: result.user.email || 'no-email@example.com',
            displayName: result.user.displayName || 'مستخدم جديد',
            photoURL: result.user.photoURL || '',
          }, { merge: true });
        }
        navigate('/profile');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('فشل إنشاء الحساب باستخدام جوجل: ' + (err.message || 'خطأ غير معروف'));
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
            role: role,
            createdAt: Date.now(),
          });
        } else {
          await setDoc(userRef, {
            email: result.user.email || 'no-email@example.com',
            displayName: result.user.displayName || 'مستخدم جديد',
            photoURL: result.user.photoURL || '',
          }, { merge: true });
        }

        navigate('/profile');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Apple login error:', err);
      setError('فشل إنشاء الحساب باستخدام أبل: ' + (err.message || 'خطأ غير معروف'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-cream">
      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-brand-cream overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full py-12"
        >
          <div className="mb-10">
            <h1 className="text-[56px] font-bold text-brand-accent mb-4">إنشاء حساب جديد</h1>
            <p className="text-stone-500 text-xl">انضم لأكبر مجتمع للطعام البيتي.</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button 
              onClick={() => setRole('customer')}
              className={`relative p-6 rounded-3xl border-2 transition-all group ${role === 'customer' ? 'border-brand-primary bg-white shadow-lg shadow-brand-primary/5' : 'border-stone-200 bg-transparent text-stone-400 hover:border-stone-300'}`}
            >
              <div className={`mb-3 p-3 rounded-2xl inline-block transition-colors ${role === 'customer' ? 'bg-brand-primary text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'}`}>
                <User size={24} />
              </div>
              <div className={`font-bold text-lg ${role === 'customer' ? 'text-stone-900' : 'text-stone-400'}`}>أنا عميل</div>
              {role === 'customer' && <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-brand-primary"></div>}
            </button>
            
            <button 
              onClick={() => setRole('chef')}
              className={`relative p-6 rounded-3xl border-2 transition-all group ${role === 'chef' ? 'border-brand-secondary bg-white shadow-lg shadow-brand-secondary/5' : 'border-stone-200 bg-transparent text-stone-400 hover:border-stone-300'}`}
            >
              <div className={`mb-3 p-3 rounded-2xl inline-block transition-colors ${role === 'chef' ? 'bg-brand-secondary text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'}`}>
                <ChefHat size={24} />
              </div>
              <div className={`font-bold text-lg ${role === 'chef' ? 'text-stone-900' : 'text-stone-400'}`}>أنا طباخ</div>
              {role === 'chef' && <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-brand-secondary"></div>}
            </button>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 mr-1">الاسم بالكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-200 bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all text-lg"
                  placeholder="أحمد محمد"
                />
              </div>
            </div>

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
              <label className="text-sm font-bold text-stone-700 mr-1">كلمة المرور</label>
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 mr-1">المنطقة / الموقع</label>
              <div className="relative group">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  required 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-200 bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all text-lg"
                  placeholder="طنطا"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 ${role === 'chef' ? 'btn-secondary' : 'btn-primary'}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  إنشاء الحساب
                  <ArrowRight size={20} className="rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
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

          <p className="mt-8 text-center text-stone-500 text-lg">
            لديك حساب بالفعل؟ <Link to="/login" className="text-brand-primary font-bold hover:underline">سجل دخولك</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
