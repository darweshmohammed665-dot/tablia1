import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Info, Coins, Bell, BellOff, UserCircle, MessageSquare, Clock, Plus, Wallet, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { formatTime12h } from '../lib/date-utils';
import { UserProfile } from '../types';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod] = useState<'cod'>('cod');
  const [deliveryInstruction, setDeliveryInstruction] = useState('call');
  const [deliveryType, setDeliveryType] = useState<'quick' | 'scheduled'>('quick');
  const [scheduledDay, setScheduledDay] = useState('غداً');
  const [scheduledTime, setScheduledTime] = useState('');
  const [chef, setChef] = useState<UserProfile | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    address: '',
    area: '',
    phone: '',
    notes: ''
  });
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.location) {
              setFormData(prev => ({ ...prev, address: data.location }));
            }
            if (data.phoneNumber) {
              setFormData(prev => ({ ...prev, phone: data.phoneNumber }));
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchChefData = async () => {
      if (cartItems.length > 0 && db) {
        try {
          const chefDoc = await getDoc(doc(db, 'users', cartItems[0].chefId));
          if (chefDoc.exists()) {
            setChef(chefDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching chef data:", error);
        }
      }
    };
    fetchChefData();
  }, [cartItems]);

  useEffect(() => {
    if (chef?.workingHours?.shifts) {
      const slots: string[] = [];
      chef.workingHours.shifts.forEach(shift => {
        let current = new Date(`2024-01-01T${shift.from}:00`);
        const end = new Date(`2024-01-01T${shift.to}:00`);
        
        while (current < end) {
          const timeStr = current.toTimeString().slice(0, 5);
          if (!slots.includes(timeStr)) {
            slots.push(timeStr);
          }
          current.setMinutes(current.getMinutes() + 30);
        }
      });
      const sortedSlots = slots.sort();
      setTimeSlots(sortedSlots);
      if (sortedSlots.length > 0 && !scheduledTime) {
        setScheduledTime(sortedSlots[0]);
      }
    }
  }, [chef, scheduledTime]);

  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const hasPreorder = cartItems.some(item => item.orderType === 'preorder');
  const hasInstant = cartItems.some(item => item.orderType === 'instant');

  useEffect(() => {
    if (hasPreorder) {
      setDeliveryType('scheduled');
    } else if (hasInstant) {
      setDeliveryType('quick');
    }
  }, [hasPreorder, hasInstant]);

  const totalFoodValue = cartTotal;
  const serviceFeeRate = 0.05;
  const serviceFee = totalFoodValue * serviceFeeRate;
  const deliveryFee = 18.99;
  const isFirstOrder = true; // Mock for demo
  const total = totalFoodValue + serviceFee + (isFirstOrder ? 0 : deliveryFee);

  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (!formData.address || !formData.phone) {
      toast.error('يرجى إكمال بيانات التوصيل');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (cartItems.length === 0) {
      toast.error('سلة التسوق فارغة');
      return;
    }

    if (chef?.isClosed) {
      toast.error('عذراً، المطبخ مغلق حالياً ولا يستقبل طلبات. يرجى إزالة الوجبات من السلة أو المحاولة لاحقاً.');
      return;
    }

    setLoading(true);
    try {
      await handleOrderCreation();
    } catch (error) {
      console.error("Error placing order:", error);
      alert('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  const handleOrderCreation = async (paymentId?: string) => {
    setLoading(true);
    try {
      if (!db) {
        toast.error('قاعدة البيانات غير متصلة حالياً.');
        setLoading(false);
        return;
      }
      const orderData = {
        customerId: auth.currentUser?.uid || 'anonymous',
        customerName: auth.currentUser?.displayName || 'عميل طبلية',
        customerPhone: formData.phone || '',
        customerAddress: `${formData.area || ''} - ${formData.address || ''}`,
        deliveryType: deliveryType || 'quick',
        scheduledDay: deliveryType === 'scheduled' ? (scheduledDay || 'غداً') : null,
        scheduledTime: deliveryType === 'scheduled' ? (scheduledTime || null) : null,
        chefId: cartItems[0]?.chefId || 'unknown',
        chefName: cartItems[0]?.chefName || 'مطبخ طبلية',
        items: cartItems.map(item => ({
          mealId: item.id || 'unknown',
          title: item.title || 'بدون اسم',
          quantity: item.quantity || 1,
          price: item.price || 0,
          scheduledDate: item.scheduledDate || null,
          scheduledTime: item.scheduledTime || null
        })),
        total: total || 0,
        subtotal: totalFoodValue || 0,
        serviceFee: serviceFee || 0,
        status: 'pending',
        paymentMethod: paymentMethod || 'cod',
        paymentId: paymentId || null,
        createdAt: Date.now()
      };

      // Remove any undefined values just in case
      Object.keys(orderData).forEach(key => {
        if ((orderData as any)[key] === undefined) {
          delete (orderData as any)[key];
        }
      });

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error('حدث خطأ أثناء إنشاء الطلب.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-4xl font-bold text-stone-900 mb-4">تم استلام طلبك بنجاح!</h1>
        <p className="text-xl text-stone-500 mb-12 max-w-md">
          طلبك الآن قيد المراجعة من قبل الشيف. سنقوم بإخطارك بمجرد بدء التحضير.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/orders" className="btn-primary px-10 py-4">تتبع الطلب</Link>
          <Link to="/" className="btn-secondary px-10 py-4">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          {step > 1 && step < 4 && (
            <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-white rounded-full transition-all">
              <ArrowRight size={24} />
            </button>
          )}
          <h1 className="text-3xl md:text-[56px] font-black text-brand-accent leading-tight">
            {step === 1 ? 'تنفيذ الطلب' : step === 2 ? 'التوصيل والدفع' : 'نظرة أخيرة...'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Address Section */}
                <div className="food-card p-[20px]">
                  <h2 className="text-2xl font-black mb-8">التوصيل</h2>
                  
                  {/* Map Mockup */}
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-8 border border-stone-100 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
                      alt="Map" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                        <MapPin size={24} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                      موقع الطباخ
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                      <label className="block text-sm font-black text-brand-accent mb-2">العنوان بالتفصيل</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                        <input 
                          type="text" 
                          placeholder="مثال: شارع النادي، عمارة 5، شقة 12"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-100 focus:ring-2 focus:ring-brand-primary outline-none font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-brand-accent mb-2">المدينة</label>
                      <input 
                        type="text" 
                        placeholder="طنطا"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-4 rounded-2xl border border-stone-100 focus:ring-2 focus:ring-brand-primary outline-none font-medium appearance-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-brand-accent mb-2">رقم الهاتف المتنقل</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                        <input 
                          type="tel" 
                          placeholder="+20 1107507344"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-100 focus:ring-2 focus:ring-brand-primary outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-black text-brand-accent mb-4">نوع الطلب</h3>
                    
                    {!hasPreorder && (
                      <div 
                        onClick={() => setDeliveryType('quick')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${deliveryType === 'quick' ? 'border-brand-accent bg-brand-accent/5' : 'border-stone-100 bg-white hover:border-stone-200'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === 'quick' ? 'border-brand-accent' : 'border-stone-300'}`}>
                            {deliveryType === 'quick' && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent"></div>}
                          </div>
                          <div>
                            <p className="font-black">وجبة فورية (الآن)</p>
                            <p className="text-xs text-stone-500 font-bold mt-1">يصل خلال 30-45 دقيقة</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {(hasPreorder || !hasInstant) && (
                      <div 
                        onClick={() => setDeliveryType('scheduled')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-4 ${deliveryType === 'scheduled' ? 'border-brand-primary bg-brand-primary/5' : 'border-stone-100 bg-white hover:border-stone-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === 'scheduled' ? 'border-brand-primary' : 'border-stone-300'}`}>
                              {deliveryType === 'scheduled' && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>}
                            </div>
                            <div>
                              <p className="font-black">وجبة يومية (مجدولة)</p>
                              <p className="text-xs text-stone-500 font-bold mt-1">
                                {hasPreorder ? "هذا الطلب يحتوي على وجبات يومية تتطلب حجز مسبق" : "اطلب اليوم، يوصلك في اليوم المحدد"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {deliveryType === 'scheduled' && (
                          <>
                            <div className="pl-9 pr-4">
                            <label className="block text-xs font-bold text-stone-600 mb-2">اختر يوم التوصيل:</label>
                            <select 
                              value={scheduledDay}
                              onChange={(e) => setScheduledDay(e.target.value)}
                              className="w-full p-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none font-bold text-sm"
                            >
                              <option value="غداً">غداً</option>
                              <option value="بعد غد">بعد غد</option>
                              <option value="الأحد القادم">الأحد القادم</option>
                              <option value="الاثنين القادم">الاثنين القادم</option>
                              <option value="الثلاثاء القادم">الثلاثاء القادم</option>
                            </select>
                          </div>

                          <div className="pl-9 pr-4 mt-4">
                            <label className="block text-xs font-bold text-stone-600 mb-2">اختر وقت التوصيل (ص/م):</label>
                            {timeSlots.length > 0 ? (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {timeSlots.map((time) => (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => setScheduledTime(time)}
                                    className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition-all ${scheduledTime === time ? 'border-brand-primary bg-brand-primary text-white' : 'border-stone-100 bg-white text-stone-600 hover:border-stone-200'}`}
                                  >
                                    {formatTime12h(time)}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 italic text-[10px]">
                                <AlertCircle size={14} />
                                عذراً، لم يحدد الطباخ مواعيد عمل لهذا اليوم.
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                    {hasPreorder && hasInstant && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                        <Info className="text-amber-500 shrink-0" size={20} />
                        <p className="text-xs text-amber-700 font-bold">
                          سلة التسوق تحتوي على مزيج من الوجبات الفورية واليومية. تم اختيار التوصيل المجدول لضمان وصول كل الوجبات معاً.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Delivery Instructions */}
                <div className="food-card p-[20px]">
                  <h2 className="text-2xl font-black mb-8">تعليمات التوصيل</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'call', label: 'اتصل عند الوصول', icon: Phone },
                      { id: 'no-ring', label: 'لا تطرق الجرس', icon: BellOff },
                      { id: 'reception', label: 'اتركه بالاستقبال', icon: UserCircle },
                      { id: 'ring', label: 'اطرق الجرس', icon: Bell }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setDeliveryInstruction(item.id)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${deliveryInstruction === item.id ? 'border-brand-primary bg-brand-primary/5' : 'border-stone-100 hover:border-stone-200'}`}
                      >
                        <item.icon size={24} className={deliveryInstruction === item.id ? 'text-brand-primary' : 'text-stone-400'} />
                        <span className={`text-xs font-black ${deliveryInstruction === item.id ? 'text-brand-primary' : 'text-stone-600'}`}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <input type="checkbox" id="save-instructions" className="w-5 h-5 rounded border-stone-300 text-brand-primary focus:ring-brand-primary" />
                    <label htmlFor="save-instructions" className="text-sm font-bold text-stone-600">استخدم تعليماتي لهذا العنوان في المرة القادمة</label>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="food-card p-[20px]">
                  <h2 className="text-2xl font-black mb-8">طريقة الدفع</h2>
                  <div className="space-y-4">
                    <div 
                      className="w-full p-6 rounded-2xl border-2 border-brand-primary bg-brand-primary/5 text-right flex items-center gap-4"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-brand-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-lg">نقداً عند الاستلام</p>
                        <p className="text-xs text-stone-500 font-bold">الدفع كاش للمندوب عند وصول الطلب</p>
                      </div>
                      <Coins className="text-brand-primary" size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="food-card p-6 md:p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary/10">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 6, ease: 'linear' }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                  
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-black text-brand-accent mb-2">{formData.area}</h3>
                    <p className="text-stone-500 font-medium break-words whitespace-normal text-sm md:text-base leading-relaxed max-w-full overflow-hidden text-ellipsis">
                      {formData.address ? (formData.address.length > 60 ? formData.address.substring(0, 60) + '...' : formData.address) : 'لم يتم إدخال العنوان'}
                    </p>
                    {deliveryType === 'scheduled' && (
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="inline-block bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-xl font-bold text-xs md:text-sm self-center">
                          توصيل مجدول: {scheduledDay}
                        </div>
                        {scheduledTime && (
                          <div className="inline-block bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-xs md:text-sm self-center">
                            الساعة: {formatTime12h(scheduledTime)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <hr className="border-stone-100 my-6 md:my-8" />

                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-primary font-black text-sm md:text-base">1</div>
                      <p className="font-black text-base md:text-lg truncate max-w-[150px] md:max-w-[200px] text-right">{cartItems[0]?.title || 'كنافة كريمة'}</p>
                    </div>
                  </div>

                  <hr className="border-stone-100 my-6 md:my-8" />

                  <div className="flex items-center justify-between mb-8 md:mb-12">
                    <div className="flex items-center gap-3 md:gap-4">
                      <Coins className="text-stone-400 w-5 h-5 md:w-6 md:h-6" />
                      <p className="font-black text-base md:text-lg">نقداً</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:gap-4">
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-3 md:py-4 rounded-2xl border-2 border-stone-100 font-black text-stone-600 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      تعديل الطلب (00:0{countdown})
                    </button>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary w-full py-4 md:py-5 text-xl md:text-2xl shadow-2xl shadow-brand-primary/30"
                    >
                      {loading ? 'جاري التنفيذ...' : 'كل شيء تمام'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="food-card p-[20px] sticky top-24 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-brand-accent mb-6">ملخص الدفع</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-stone-600">
                    <span className="font-bold">ثمن الوجبات</span>
                    <span className="font-bold">{totalFoodValue.toFixed(2)} ج.م</span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-center">
                    <div className="flex items-center gap-1">
                      <span>رسوم خدمة (5%)</span>
                      <Info size={14} className="text-stone-300" />
                    </div>
                    <span>{serviceFee.toFixed(2)} ج.م</span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-center">
                    <div className="flex items-center gap-1">
                      <span className={isFirstOrder ? "bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider" : ""}>
                        توصيل مجاني أول طلب
                      </span>
                      <Info size={14} className="text-stone-300" />
                    </div>
                    <span className={isFirstOrder ? "font-bold text-brand-primary" : ""}>
                      {isFirstOrder ? "00.00" : deliveryFee.toFixed(2)} ج.م
                    </span>
                  </div>

                  <div className="pt-6 border-t border-dashed border-stone-200 flex justify-between items-baseline">
                    <span className="text-xl font-black text-brand-secondary">المبلغ الإجمالي</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-brand-primary tracking-tighter">
                        {total.toFixed(2)}
                      </span>
                      <span className="text-sm font-black text-brand-primary">ج.م</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary w-full py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : null}
                  تنفيذ الطلب
                </button>
                
                <Link 
                  to="/meals" 
                  className="w-full py-4 text-center block font-bold text-stone-600 hover:text-brand-primary transition-colors border-2 border-stone-100 rounded-2xl"
                >
                  أضف المزيد
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-stone-400 text-xs pt-4">
                <ShieldCheck size={14} />
                <span>مؤمن وفق معايير حماية بيانات الدفع (PCI)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
