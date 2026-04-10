import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag, ChevronLeft, Plus, Minus, Ticket, Info, Coins } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-stone-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-stone-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">سلة التسوق فارغة</h2>
        <p className="text-stone-500 mb-8">ابدأ بإضافة بعض الوجبات الشهية لسلتك</p>
        <Link to="/meals" className="btn-primary px-10 py-4">تصفح الوجبات</Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[56px] font-bold text-brand-accent mb-12 flex items-center gap-4">
          <ShoppingCart size={36} className="text-brand-primary" /> سلة التسوق
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="food-card p-[20px] flex flex-col sm:flex-row items-center gap-6"
              >
                <img src={item.image} alt={item.title} className="w-32 h-32 rounded-[18px] object-cover shadow-sm" />
                <div className="flex-grow text-center sm:text-right">
                  <h3 className="text-xl font-bold text-brand-accent mb-1">{item.title}</h3>
                  <p className="text-brand-primary font-bold mb-4">{item.price} ج.م</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-brand-cream rounded-full border border-stone-200 p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-stone-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-stone-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="text-xl font-bold text-brand-accent sm:mr-auto">
                  {(item.price * item.quantity).toFixed(0)} ج.م
                </div>
              </motion.div>
            ))}

            <Link to="/meals" className="inline-flex items-center gap-2 text-brand-secondary font-bold hover:underline mt-4">
              <ArrowRight size={20} /> إضافة المزيد من الوجبات
            </Link>
          </div>

          {/* Summary */}
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

              <Link to="/checkout" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                تابع للدفع <ChevronLeft size={20} />
              </Link>

              <div className="mt-4 p-4 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/10 flex items-center gap-3 text-sm text-brand-secondary">
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"></div>
                <span>توصيل سريع خلال 60 دقيقة في طنطا</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
