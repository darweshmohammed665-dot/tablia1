import React, { useState, useRef, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, AlignLeft, Save, X, ChevronRight, ChevronLeft, Check, AlertCircle, Image as ImageIcon, CreditCard, Phone as PhoneIcon, Landmark, Crosshair, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'sonner';
import { formatTime12h, generateTimeOptions } from '../lib/date-utils';

const TIME_OPTIONS = generateTimeOptions();

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface ChefProfileFormProps {
  profile: UserProfile;
  onComplete: () => void;
  onCancel?: () => void;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400&h=400";
const DEFAULT_CENTER: [number, number] = [30.7865, 31.0004]; // Tanta, Egypt

type Step = 'photo' | 'info' | 'review';

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function ChefProfileForm({ profile, onComplete, onCancel }: ChefProfileFormProps) {
  const [step, setStep] = useState<Step>('photo');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || 'طنطا');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    profile.coordinates ? [profile.coordinates.lat, profile.coordinates.lng] : null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    profile.coordinates ? [profile.coordinates.lat, profile.coordinates.lng] : DEFAULT_CENTER
  );
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');
  const [workingHours, setWorkingHours] = useState<{ shifts: { from: string; to: string }[] }>(
    profile.workingHours?.shifts?.length ? { shifts: profile.workingHours.shifts } : { shifts: [{ from: '09:00', to: '22:00' }] }
  );

  const addShift = () => {
    setWorkingHours({
      ...workingHours,
      shifts: [...workingHours.shifts, { from: '09:00', to: '22:00' }]
    });
  };

  const removeShift = (index: number) => {
    if (workingHours.shifts.length <= 1) {
      toast.error('يجب تحديد فترة عمل واحدة على الأقل');
      return;
    }
    const newShifts = [...workingHours.shifts];
    newShifts.splice(index, 1);
    setWorkingHours({ ...workingHours, shifts: newShifts });
  };

  const updateShift = (index: number, field: 'from' | 'to', value: string) => {
    const newShifts = [...workingHours.shifts];
    newShifts[index][field] = value;
    setWorkingHours({ ...workingHours, shifts: newShifts });
  };
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

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        setMapCenter([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error('فشل تحديد موقعك الحالي. يرجى المحاولة يدوياً.');
      }
    );
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
      const updateData: any = {
        bio: bio.trim(),
        location: location.trim(),
        photoURL: finalPhotoURL,
        workingHours,
        updatedAt: Date.now()
      };

      if (coordinates) {
        updateData.coordinates = {
          lat: coordinates[0],
          lng: coordinates[1]
        };
      }

      await updateDoc(doc(db, 'users', profile.uid), updateData);
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
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-black text-stone-700 flex items-center gap-2">
                      <Clock size={18} className="text-brand-primary" /> فترات العمل
                    </label>
                    <button 
                      type="button"
                      onClick={addShift}
                      className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full hover:bg-brand-primary/20 transition-colors"
                    >
                      + إضافة فترة عمل
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {workingHours.shifts.map((shift, idx) => (
                      <div key={idx} className="bg-white border border-stone-100 p-4 rounded-2xl relative group">
                        {workingHours.shifts.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeShift(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">من</span>
                            <select 
                              value={shift.from}
                              onChange={(e) => updateShift(idx, 'from', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold appearance-none bg-white text-xs"
                            >
                              {TIME_OPTIONS.map(time => (
                                <option key={time} value={time}>{formatTime12h(time)}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">إلى</span>
                            <select 
                              value={shift.to}
                              onChange={(e) => updateShift(idx, 'to', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold appearance-none bg-white text-xs"
                            >
                              {TIME_OPTIONS.map(time => (
                                <option key={time} value={time}>{formatTime12h(time)}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-stone-700 mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-brand-primary" /> المدينة
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="طنطا"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium mb-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-stone-700 mb-3 flex items-center gap-2">
                    <Crosshair size={18} className="text-brand-primary" /> حدد موقعك بدقة على الخريطة
                  </label>
                  <div className="h-64 rounded-2xl overflow-hidden border border-stone-200 relative z-0">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={13} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker position={coordinates} setPosition={setCoordinates} />
                    </MapContainer>
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-stone-50 transition-colors border border-stone-200 text-brand-primary"
                      title="حدد موقعي الحالي"
                    >
                      <Crosshair size={20} />
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 text-right">اضغط على الخريطة لتحديد موقع مطبخك بدقة، أو استخدم زر التحديد التلقائي</p>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
                   مـراجــعـة الـبـيـانـات
                </div>
                <h3 className="text-3xl font-black text-stone-900 mb-2 leading-tight">هكذا سيظهر ملفك للعملاء</h3>
                <p className="text-stone-400 font-medium italic">تأكد من دقة المعلومات قبل التفعيل النهائي</p>
              </div>

              {/* High-end Preview Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-primary/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-xl overflow-hidden">
                  
                  {/* Card Header Background Pattern */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                  
                  <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-right">
                    <div className="relative group/photo">
                      <div className="absolute -inset-2 bg-brand-primary/20 rounded-full blur-md opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                      <img 
                        src={photoURL || DEFAULT_AVATAR} 
                        alt="Preview" 
                        className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg z-10"
                      />
                    </div>
                    
                    <div className="flex-grow space-y-4">
                      <div>
                        <h4 className="text-3xl font-black text-brand-secondary tracking-tighter italic mb-1">{profile.displayName}</h4>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <span className="flex items-center gap-1.5 text-brand-primary font-bold text-sm bg-brand-primary/5 px-3 py-1 rounded-full border border-brand-primary/10">
                            <MapPin size={14} /> {location}
                          </span>
                          {coordinates && (
                            <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-wider">
                              <Crosshair size={12} /> تم الربط الجغرافي
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {workingHours.shifts.map((shift, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100 text-[10px] font-black text-stone-500">
                            <Clock size={12} className="text-brand-primary" />
                            {formatTime12h(shift.from)} - {formatTime12h(shift.to)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-8 group/bio">
                    <div className="absolute left-0 top-0 w-1 h-full bg-brand-primary/30 rounded-full" />
                    <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100/50 text-stone-600 leading-relaxed font-serif italic text-lg md:text-xl pr-8">
                      " {bio || 'لم يتم إضافة نبذة شخصية بعد. النبذة الشخصية تزيد من ثقة العملاء بمطبخك.'} "
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-grow bg-brand-primary hover:bg-brand-primary/90 text-white py-5 px-10 rounded-[2rem] font-black text-xl shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={24} className="group-hover:rotate-12 transition-transform" />
                        تأكيد وحفظ الملف الشخصي
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  <button 
                    onClick={() => setStep('info')}
                    className="flex items-center gap-2 text-stone-400 hover:text-stone-900 font-bold transition-colors group"
                  >
                    <ChevronRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                    تـعديـل الـبـيـانـات
                  </button>
                  
                  <div className="w-px h-4 bg-stone-200" />

                  {onCancel && (
                    <button 
                      onClick={onCancel}
                      className="text-red-400 hover:text-red-600 font-bold transition-colors"
                    >
                      إلـغـاء الأمـر
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
