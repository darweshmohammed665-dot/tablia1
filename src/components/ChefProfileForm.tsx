import React, { useState, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, AlignLeft, Save, X, ChevronRight, ChevronLeft, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ChefProfileFormProps {
  profile: UserProfile;
  onComplete: () => void;
  onCancel?: () => void;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400&h=400";

type Step = 'photo' | 'info' | 'review';

export default function ChefProfileForm({ profile, onComplete, onCancel }: ChefProfileFormProps) {
  const [step, setStep] = useState<Step>('photo');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || 'طنطا');
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setImageError('يرجى اختيار ملف صورة صالح (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setImageError('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setImageError('حدث خطأ أثناء قراءة الملف. يرجى المحاولة مرة أخرى.');
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setPhotoURL(dataUrl);
        } catch (err) {
          setImageError('فشل معالجة الصورة. يرجى تجربة صورة أخرى.');
        }
      };
      img.onerror = () => {
        setImageError('ملف الصورة تالف أو غير مدعوم.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!bio.trim() || !location.trim()) {
      setError('يرجى إكمال جميع الحقول المطلوبة');
      setStep('info');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalPhotoURL = photoURL.trim() || DEFAULT_AVATAR;
      await updateDoc(doc(db, 'users', profile.uid), {
        bio: bio.trim(),
        location: location.trim(),
        photoURL: finalPhotoURL,
        updatedAt: Date.now()
      });
      onComplete();
    } catch (err) {
      console.error("Error updating chef profile:", err);
      setError('حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'photo', label: 'الصورة الشخصية', icon: Camera },
    { id: 'info', label: 'المعلومات', icon: AlignLeft },
    { id: 'review', label: 'المراجعة', icon: Check },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 max-w-2xl mx-auto overflow-hidden"
    >
      {/* Stepper Header */}
      <div className="bg-stone-50 border-b border-stone-100 p-6 md:p-8">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-200 -translate-y-1/2 z-0"></div>
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0"
            initial={false}
            animate={{ 
              width: step === 'photo' ? '0%' : step === 'info' ? '50%' : '100%' 
            }}
          />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = (step === 'info' && idx === 0) || (step === 'review' && idx <= 1);
            
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <motion.div 
                  animate={{ 
                    backgroundColor: isActive || isCompleted ? 'var(--color-brand-primary)' : '#fff',
                    borderColor: isActive || isCompleted ? 'var(--color-brand-primary)' : '#e5e7eb',
                    scale: isActive ? 1.2 : 1
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${isActive || isCompleted ? 'text-white' : 'text-stone-400'}`}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </motion.div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-brand-primary' : 'text-stone-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8 md:p-12">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm flex items-center gap-3 border border-red-100"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'photo' && (
            <motion.div 
              key="photo-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-black text-stone-900 mb-2">صورتك الشخصية</h3>
                <p className="text-stone-500">الصورة هي أول ما يراه العملاء، اختر صورة تعبر عن احترافيتك</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 group">
                  <div className="w-full h-full rounded-full bg-stone-100 flex items-center justify-center text-stone-300 border-4 border-white shadow-xl overflow-hidden relative">
                    {photoURL ? (
                      <img src={photoURL} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={64} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white flex flex-col items-center gap-1 font-bold text-sm"
                      >
                        <Camera size={24} />
                        تغيير الصورة
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-brand-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white"
                  >
                    <Camera size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {imageError && (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={14} /> {imageError}
                  </p>
                )}

                <div className="w-full">
                  <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3 text-center">أو ضع رابط صورة مباشر</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="url" 
                      placeholder="https://example.com/image.jpg"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all text-sm font-medium"
                    />
                    {photoURL && (
                      <button
                        type="button"
                        onClick={() => setPhotoURL('')}
                        className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setStep('info')}
                  className="btn-primary px-10 py-4 flex items-center gap-3"
                >
                  الخطوة التالية <ChevronLeft size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'info' && (
            <motion.div 
              key="info-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-black text-stone-900 mb-2">معلوماتك المهنية</h3>
                <p className="text-stone-500">أخبر العملاء عن مهاراتك وموقعك لتسهيل الوصول إليك</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-stone-700 mb-3 flex items-center gap-2">
                    <AlignLeft size={18} className="text-brand-primary" /> نبذة عنك (Bio)
                  </label>
                  <textarea 
                    required
                    placeholder="احكِ للعملاء عن خبرتك في الطبخ وما يميز أكلاتك..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all h-40 resize-none font-medium leading-relaxed"
                  ></textarea>
                  <p className="text-[10px] text-stone-400 mt-2 text-right">يفضل أن تكون النبذة بين 50 إلى 200 كلمة</p>
                </div>

                <div>
                  <label className="block text-sm font-black text-stone-700 mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-brand-primary" /> المنطقة / الموقع
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: طنطا - حي القحافة"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  onClick={() => setStep('photo')}
                  className="px-8 py-4 rounded-2xl font-bold text-stone-500 hover:bg-stone-100 transition-colors flex items-center gap-2"
                >
                  <ChevronRight size={20} /> السابق
                </button>
                <button 
                  onClick={() => setStep('review')}
                  className="btn-primary px-10 py-4 flex items-center gap-3"
                >
                  مراجعة البيانات <ChevronLeft size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div 
              key="review-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-black text-stone-900 mb-2">مراجعة الملف</h3>
                <p className="text-stone-500">هكذا سيظهر ملفك الشخصي للعملاء</p>
              </div>

              <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6">
                  <img 
                    src={photoURL || DEFAULT_AVATAR} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="text-center md:text-right">
                    <h4 className="text-xl font-black text-stone-900 mb-1">{profile.displayName}</h4>
                    <p className="text-brand-primary font-bold flex items-center justify-center md:justify-start gap-1">
                      <MapPin size={14} /> {location}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-100 text-stone-600 leading-relaxed font-medium">
                  {bio || 'لا توجد نبذة شخصية مضافة'}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-grow py-5 text-xl shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><Save size={24} /> تأكيد وحفظ الملف</>
                  )}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStep('info')}
                    className="flex-1 sm:flex-none px-8 py-5 rounded-2xl font-bold text-stone-500 hover:bg-stone-100 transition-colors"
                  >
                    تعديل
                  </button>
                  {onCancel && (
                    <button 
                      onClick={onCancel}
                      className="flex-1 sm:flex-none px-8 py-5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
