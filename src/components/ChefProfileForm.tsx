import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';
import { Camera, MapPin, AlignLeft, Save, X } from 'lucide-react';

interface ChefProfileFormProps {
  profile: UserProfile;
  onComplete: () => void;
  onCancel?: () => void;
}

export default function ChefProfileForm({ profile, onComplete, onCancel }: ChefProfileFormProps) {
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || 'طنطا');
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        bio,
        location,
        photoURL,
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
            <img 
              src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=c65d3a&color=fff&size=200`} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-4 border-stone-100 shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={24} />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-stone-700 mb-2">رابط صورة الملف الشخصي</label>
            <input 
              type="url" 
              required
              placeholder="https://example.com/photo.jpg"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
            />
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
