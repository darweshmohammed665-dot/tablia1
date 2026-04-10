import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck, Ticket, Info, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function StripeForm({ amount, onSuccess, onLoading }: { amount: number, onSuccess: (paymentIntentId: string) => void, onLoading: (loading: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    onLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        setError(backendError);
        onLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as any,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'حدث خطأ أثناء الدفع');
        onLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError('فشل الاتصال بالخادم');
      onLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-xl border border-stone-200 bg-white">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#35091a',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#f11d58',
            },
          },
        }} />
      </div>
      {error && <p className="text-brand-primary text-sm font-bold">{error}</p>}
      <div className="flex items-center gap-2 text-stone-500 text-xs">
        <ShieldCheck size={14} />
        <span>دفع آمن ومسفر عبر Stripe</span>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [formData, setFormData] = useState({
    address: '',
    area: 'طنطا - وسط البلد',
    phone: ''
  });

  const { cartItems, cartTotal, clearCart } = useCart();

  const subtotal = cartTotal;
  const deliveryFee = 18.99;
  const serviceFee = 5.00;
  const isFirstOrder = true; // Mock for demo
  const total = subtotal - discount + (isFirstOrder ? 0 : deliveryFee) + serviceFee;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'TABLYA30') {
      setDiscount(30);
      toast.success('تم تطبيق الخصم بنجاح!');
    } else {
      toast.error('كود الخصم غير صحيح');
    }
  };

  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (!formData.address || !formData.phone) {
      toast.error('يرجى إكمال بيانات التوصيل');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('سلة التسوق فارغة');
      return;
    }

    setLoading(true);
    try {
      // If Stripe is selected, we handle it via the StripeForm component's submit
      // But we need a way to trigger that submit from here or vice versa.
      // Let's modify the flow: if stripe, we confirm payment first, then create order.
      
      if (paymentMethod === 'stripe') {
        const form = document.getElementById('payment-form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
          return; // The StripeForm will call handleOrderCreation on success
        }
      }

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
      const orderData = {
        customerId: auth.currentUser?.uid,
        customerName: auth.currentUser?.displayName || 'عميل طبلية',
        customerPhone: formData.phone,
        customerAddress: `${formData.area} - ${formData.address}`,
        chefId: cartItems[0].chefId,
        items: cartItems.map(item => ({
          mealId: item.mealId,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        status: 'pending',
        paymentMethod: paymentMethod,
        paymentId: paymentId || null,
        createdAt: Date.now()
      };

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
        <h1 className="text-[56px] font-bold text-brand-accent mb-12">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Address Section */}
            <div className="food-card p-[20px]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-2xl font-bold">عنوان التوصيل</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-stone-700 mb-2">العنوان بالتفصيل</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="اسم الشارع، رقم العمارة، الشقة"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">المنطقة</label>
                  <select 
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    <option>طنطا - وسط البلد</option>
                    <option>طنطا - سيجر</option>
                    <option>طنطا - القحافة</option>
                    <option>طنطا - الجلاء</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input 
                      type="tel" 
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="food-card p-[20px]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-bold">طريقة الدفع</h2>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-right flex items-center gap-4 ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary/5' : 'border-stone-100 hover:border-stone-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-primary' : 'border-stone-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-brand-primary"></div>}
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-lg">الدفع عند الاستلام</p>
                    <p className="text-sm text-stone-500 font-medium">ادفع نقداً بمجرد وصول طلبك</p>
                  </div>
                  <Truck className={paymentMethod === 'cod' ? 'text-brand-primary' : 'text-stone-400'} size={32} />
                </button>

                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-right flex items-center gap-4 ${paymentMethod === 'stripe' ? 'border-brand-primary bg-brand-primary/5' : 'border-stone-100 hover:border-stone-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-brand-primary' : 'border-stone-300'}`}>
                    {paymentMethod === 'stripe' && <div className="w-3 h-3 rounded-full bg-brand-primary"></div>}
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-lg">بطاقة ائتمان</p>
                    <p className="text-sm text-stone-500 font-medium">ادفع بأمان باستخدام بطاقتك عبر Stripe</p>
                  </div>
                  <CreditCard className={paymentMethod === 'stripe' ? 'text-brand-primary' : 'text-stone-400'} size={32} />
                </button>

                <AnimatePresence>
                  {paymentMethod === 'stripe' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 px-2">
                        <Elements stripe={stripePromise}>
                          <StripeForm 
                            amount={total} 
                            onSuccess={(id) => handleOrderCreation(id)} 
                            onLoading={(l) => setLoading(l)}
                          />
                        </Elements>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="food-card p-[20px] sticky top-24 space-y-8">
              {/* Coupon Section */}
              <div>
                <h3 className="text-lg font-bold text-brand-accent mb-4 flex items-center gap-2">
                  <Ticket size={20} className="text-brand-primary" />
                  وفر على طلبك
                </h3>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="text" 
                      placeholder="قم بإدخال رمز القسيمة هنا"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-accent transition-colors"
                  >
                    إرسال
                  </button>
                </div>
              </div>

              <hr className="border-stone-100" />

              <div>
                <h2 className="text-2xl font-bold text-brand-accent mb-6">ملخص الدفع</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-stone-600">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span className="bg-green-100 px-2 py-0.5 rounded">خصم</span>
                      <span>-{discount.toFixed(2)} ج.م</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600 items-center">
                    <div className="flex items-center gap-1">
                      <span className={isFirstOrder ? "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold" : ""}>
                        توصيل مجاني أول طلب
                      </span>
                      <Info size={14} className="text-stone-400" />
                    </div>
                    <span className={isFirstOrder ? "line-through text-stone-400" : ""}>
                      {deliveryFee.toFixed(2)} ج.م
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-center">
                    <div className="flex items-center gap-1">
                      <span>رسوم الخدمة</span>
                      <Info size={14} className="text-stone-400" />
                    </div>
                    <span>{serviceFee.toFixed(2)} ج.م</span>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between text-2xl font-black text-stone-900">
                    <span>المبلغ الإجمالي</span>
                    <span className="text-brand-primary">{total.toFixed(2)} ج.م</span>
                  </div>
                </div>
              </div>

              {discount > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Coins className="text-orange-600" size={20} />
                    </div>
                    <p className="text-orange-900 font-bold">لقد وفرت</p>
                  </div>
                  <p className="text-orange-600 font-black text-lg">EGP {discount.toFixed(2)}</p>
                </div>
              )}

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
