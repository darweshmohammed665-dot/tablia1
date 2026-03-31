import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';

export default function Cart() {
  // Mock cart data for now
  const cartItems = [
    { id: '1', title: 'محشي ورق عنب بالريش', price: 250, quantity: 2, image: 'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'مكرونة بشاميل بيتي', price: 120, quantity: 1, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

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
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-stone-600">-</button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-stone-600">+</button>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors p-2">
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
            <div className="food-card p-[20px] sticky top-24">
              <h2 className="text-2xl font-bold text-brand-accent mb-8">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-500">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toFixed(0)} ج.م</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>رسوم التوصيل</span>
                  <span>{deliveryFee.toFixed(0)} ج.م</span>
                </div>
                <div className="pt-4 border-t border-stone-100 flex justify-between text-xl font-bold text-stone-900">
                  <span>الإجمالي</span>
                  <span className="text-brand-primary">{total.toFixed(0)} ج.م</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                إتمام الطلب <ChevronLeft size={20} />
              </Link>

              <div className="mt-8 p-4 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/10 flex items-center gap-3 text-sm text-brand-secondary">
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
