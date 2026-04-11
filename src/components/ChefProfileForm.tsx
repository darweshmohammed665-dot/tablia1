import React, { useState, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Camera, MapPin, AlignLeft, Save, X, Utensils, Upload } from 'lucide-react';

interface ChefProfileFormProps {
  profile: UserProfile;
  onComplete: () => void;
  onCancel?: () => void;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400&h=400";

export default function ChefProfileForm({ profile, onComplete, onCancel }: ChefProfileFormProps) {
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || 'طنطا');
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
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
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoURL(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const finalPhotoURL = photoURL.trim() || DEFAULT_AVATAR;
      await updateDoc(doc(db, 'users', profile.uid), {
        bio,
        location,
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-stone-100 max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">إعداد ملف الشيف</h2>
        <p className="text-stone-500">أكمل بياناتك لتبدأ في عرض وجباتك الشهية للعملاء</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 group">
            <div className="w-full h-full rounded-full bg-brand-secondary flex items-center justify-center text-white border-4 border-stone-100 shadow-inner overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <img src={DEFAULT_AVATAR} alt="Default Profile" className="w-full h-full object-cover opacity-50" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-brand-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              title="رفع صورة جديدة"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="w-full text-center">
            <p className="text-sm text-stone-500 mb-2">يمكنك رفع صورة من جهازك أو تركها فارغة لاستخدام الصورة الافتراضية</p>
            <div className="flex items-center gap-2">
              <input 
                type="url" 
                placeholder="أو ضع رابط صورة هنا..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-secondary outline-none transition-all text-sm"
              />
              {photoURL && (
                <button
                  type="button"
                  onClick={() => setPhotoURL('')}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="إزالة الصورة"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
            <AlignLeft size={18} className="text-stone-400" /> نبذة عنك (Bio)
          </label>
          <textarea 
            required
            placeholder="احكِ للعملاء عن خبرتك في الطبخ وما يميز أكلاتك..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-secondary outline-none transition-all h-32 resize-none"
          ></textarea>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
            <MapPin size={18} className="text-stone-400" /> المنطقة / الموقع
          </label>
          <input 
            type="text" 
            required
            placeholder="مثال: طنطا - حي القحافة"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary flex-grow bg-brand-secondary hover:bg-brand-secondary/90 flex items-center justify-center gap-2 py-4"
          >
            {loading ? 'جاري الحفظ...' : <><Save size={20} /> حفظ الملف الشخصي</>}
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="px-8 py-4 rounded-full font-bold text-stone-500 hover:bg-stone-100 transition-colors flex items-center gap-2"
            >
              <X size={20} /> إلغاء
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
