import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, CreditCard, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    area: 'طنطا - وسط البلد',
    phone: ''
  });

  // Mock cart items for the demo
  const cartItems = [
    { mealId: '1', title: 'محشي ورق عنب بالريش', price: 250, quantity: 2, chefId: 'chef_1' },
    { mealId: '2', title: 'مكرونة بشاميل بيتي', price: 120, quantity: 1, chefId: 'chef_1' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (!formData.address || !formData.phone) {
      alert('يرجى إكمال بيانات التوصيل');
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would group items by chefId and create multiple orders if needed.
      // For this demo, we'll assume all items are from the same chef.
      const orderData = {
        customerId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'عميل طبلية',
        customerPhone: formData.phone,
        customerAddress: `${formData.area} - ${formData.address}`,
        chefId: cartItems[0].chefId, // Assuming all items from same chef for demo
        items: cartItems.map(item => ({
          mealId: item.mealId,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        status: 'pending',
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
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
    <div className="bg-stone-50 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-12">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Address Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100">
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
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 opacity-50 pointer-events-none">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-bold">طريقة الدفع</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border-2 border-brand-primary bg-brand-primary/5 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-4 border-brand-primary"></div>
                  <div className="flex-grow">
                    <p className="font-bold">الدفع عند الاستلام</p>
                    <p className="text-sm text-stone-500">ادفع نقداً بمجرد وصول طلبك</p>
                  </div>
                  <Truck className="text-brand-primary" />
                </div>
                <div className="p-4 rounded-2xl border border-stone-100 flex items-center gap-4 opacity-50">
                  <div className="w-6 h-6 rounded-full border-2 border-stone-200"></div>
                  <div className="flex-grow">
                    <p className="font-bold">بطاقة ائتمان (قريباً)</p>
                    <p className="text-sm text-stone-500">ادفع بأمان باستخدام بطاقتك</p>
                  </div>
                  <CreditCard className="text-stone-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-stone-100 sticky top-24">
              <h2 className="text-2xl font-bold text-stone-900 mb-8">تفاصيل الطلب</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-700">
                  <span>2x محشي ورق عنب</span>
                  <span>500 ج.م</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>1x مكرونة بشاميل</span>
                  <span>120 ج.م</span>
                </div>
                <hr className="border-stone-100" />
                <div className="flex justify-between text-stone-500">
                  <span>المجموع الفرعي</span>
                  <span>620 ج.م</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>رسوم التوصيل</span>
                  <span>30 ج.م</span>
                </div>
                <div className="pt-4 border-t border-stone-100 flex justify-between text-xl font-bold text-stone-900">
                  <span>الإجمالي</span>
                  <span className="text-brand-primary">650 ج.م</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : null}
                تأكيد الطلب
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
