import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Meal } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Clock, X, ChevronDown, SlidersHorizontal, ArrowUpDown, ShoppingCart, ShoppingBag, UtensilsCrossed, Coffee, Pizza, IceCream, Sandwich, Flame, Award, Sparkles, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  // Advanced Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState(120);
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      const path = 'meals';
      try {
        const q = query(collection(db, path), where('available', '==', true));
        const querySnapshot = await getDocs(q);
        const mealsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            deliveryTime: data.deliveryTime || 45 // Default 45 mins if missing
          } as Meal;
        });
        setMeals(mealsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filteredAndSortedMeals = useMemo(() => {
    let result = meals.filter(meal => {
      const matchesSearch = meal.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                           meal.chefName.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(meal.category);
      const matchesPrice = meal.price >= priceRange[0] && meal.price <= priceRange[1];
      const matchesRating = meal.rating >= minRating;
      const matchesDelivery = (meal.deliveryTime || 45) <= maxDeliveryTime;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesDelivery;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;
      default: // newest
        // Assuming ID or some other field for newest if no timestamp
        break;
    }

    return result;
  }, [meals, searchTerm, selectedCategories, priceRange, minRating, maxDeliveryTime, sortBy]);

  const categories = ['الكل', 'محاشي', 'مشويات', 'مكرونات', 'حلويات', 'مخبوزات', 'أكل صحي'];

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setMinRating(0);
    setMaxDeliveryTime(120);
    setSelectedCategories([]);
  };

  return (
    <div className="bg-brand-cream min-h-screen py-[100px] relative">
      {/* Background Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-grain"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center">
          <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-6 block">المنيو</span>
          <h1 className="text-6xl md:text-[100px] font-black text-brand-secondary leading-[0.9] tracking-tighter mb-8">أشهى الأكلات <br /> <span className="text-brand-primary italic font-serif">البيتي</span></h1>
          <p className="text-stone-500 text-2xl max-w-2xl mx-auto font-medium mb-8">كل اللي نفسك فيه وأكتر.. أكل بيتي سخن وطازة بيوصلك لحد الباب.</p>
          
          <div className="inline-block px-8 py-4 bg-red-50 border-2 border-red-500 border-dashed rounded-2xl">
            <p className="text-lg font-bold text-red-600">
              صفحة المنيو (لسه هنضيف الوجبات بعد م ناخد التفاصيل من الطباخات)
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-12 mb-20">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="ابحث عن طعامك، بقالتك اليومية، ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border border-stone-100 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all bg-white shadow-xl text-lg font-medium"
              />
            </div>
          </div>

          {/* Categories Icons */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-brand-accent">ماذا تشتهي اليوم؟</h3>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { id: 'burger', label: 'البرجر', icon: '🍔' },
                { id: 'shawarma', label: 'شاورما', icon: '🌯' },
                { id: 'coffee', label: 'شاي وقهوة', icon: '☕' },
                { id: 'chicken', label: 'دجاج مقلي', icon: '🍗' },
                { id: 'sweets', label: 'الحلويات', icon: '🍰' },
                { id: 'pizza', label: 'بيتزا', icon: '🍕' },
                { id: 'pasta', label: 'مكرونة', icon: '🍝' }
              ].map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategories([cat.label])}
                  className="flex flex-col items-center gap-4 min-w-[100px] group"
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all border ${selectedCategories.includes(cat.label) ? 'bg-brand-primary border-brand-primary scale-110' : 'bg-white border-stone-50 group-hover:scale-110'}`}>
                    {cat.icon}
                  </div>
                  <span className={`font-black transition-colors ${selectedCategories.includes(cat.label) ? 'text-brand-primary' : 'text-stone-600 group-hover:text-brand-primary'}`}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Most Searched Tags */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-brand-accent">الأكثر بحثاً على طبلية</h3>
            <div className="flex flex-wrap gap-3">
              {['بيتزا', 'كشري', 'مشويات', 'برجر', 'كريب', 'حلويات النصر'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-6 py-3 bg-white rounded-2xl border border-stone-100 font-bold text-stone-600 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm flex items-center gap-2"
                >
                  <ArrowUpDown size={14} className="rotate-45" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stores Near You */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-brand-accent">المتاجر الكبرى بالقرب منك</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { name: 'بيم', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/BIM_logo.svg/1200px-BIM_logo.svg.png' },
                { name: 'حاج عرفة', logo: 'https://hajarafa.com/wp-content/uploads/2021/04/Haj-Arafa-Logo.png' },
                { name: 'خير زمان', logo: 'https://khairzaman.com.eg/wp-content/uploads/2021/06/KZ-Logo.png' },
                { name: 'طبلية ماركت', logo: 'https://i.ibb.co/B2Fm90cV/Whats-Ap-Image-2026-04-02-at-13-09-41-1.jpg' }
              ].map((store) => (
                <div key={store.name} className="min-w-[140px] flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-white rounded-3xl p-4 shadow-lg border border-stone-50 flex items-center justify-center overflow-hidden">
                    <img src={store.logo} alt={store.name} className="w-full h-auto object-contain" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-sm text-stone-900">{store.name}</p>
                    <p className="text-[10px] text-stone-400 font-bold">10-25 دقيقة</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-12 border-t border-stone-100">
            <h2 className="text-3xl font-black text-brand-accent">كل الوجبات</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-6 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-700 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
              >
                <SlidersHorizontal size={20} />
                <span>تصفية</span>
              </button>
              <div className="relative group">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-10 pr-12 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-700 hover:border-brand-primary hover:text-brand-primary outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-low">السعر: من الأقل</option>
                  <option value="price-high">السعر: من الأعلى</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="popular">الأكثر طلباً</option>
                </select>
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Slide-over Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-[101] shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-stone-900">تصفية النتائج</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 md:space-y-10">
                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900">الأقسام</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.filter(c => c !== 'الكل').map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-stone-200 hover:border-brand-primary transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, cat]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== cat));
                              }
                            }}
                            className="accent-brand-primary w-5 h-5"
                          />
                          <span className="font-bold text-stone-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900 flex items-center justify-between">
                      <span>نطاق السعر</span>
                      <span className="text-brand-primary text-sm">{priceRange[0]} - {priceRange[1]} ج.م</span>
                    </h3>
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-brand-primary h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900">الحد الأدنى للتقييم</h3>
                    <div className="flex gap-2">
                      {[0, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={`flex-1 py-3 rounded-xl border font-bold transition-all flex items-center justify-center gap-1 ${minRating === r ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-white border-stone-200 text-stone-500 hover:border-brand-accent'}`}
                        >
                          {r === 0 ? 'الكل' : (
                            <>
                              {r} <Star size={16} className="fill-current" />
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900 flex items-center justify-between">
                      <span>أقصى وقت للتوصيل</span>
                      <span className="text-brand-primary text-sm">{maxDeliveryTime} دقيقة</span>
                    </h3>
                    <input 
                      type="range" 
                      min="15" 
                      max="120" 
                      step="15"
                      value={maxDeliveryTime}
                      onChange={(e) => setMaxDeliveryTime(parseInt(e.target.value))}
                      className="w-full accent-brand-secondary h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-stone-400 font-medium">
                      <span>15 دقيقة</span>
                      <span>120+ دقيقة</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-stone-100 grid grid-cols-2 gap-4">
                  <button 
                    onClick={resetFilters}
                    className="py-4 rounded-2xl border border-stone-200 font-bold text-stone-600 hover:bg-brand-cream transition-colors"
                  >
                    إعادة ضبط
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="py-4 rounded-2xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all"
                  >
                    عرض النتائج
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[18px] h-96 animate-pulse shadow-[0_8px_20px_rgba(0,0,0,0.08)]"></div>
            ))}
          </div>
        ) : filteredAndSortedMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredAndSortedMeals.map((meal, i) => (
              <motion.div 
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 border border-stone-100"
              >
                <div className="relative h-64 overflow-hidden group/img">
                  <Link to={`/meal/${meal.id}`} className="block h-full">
                    <img src={meal.image} alt={meal.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: meal.id,
                          title: meal.title,
                          price: meal.price,
                          quantity: 1,
                          image: meal.image,
                          chefId: meal.chefId,
                          chefName: meal.chefName
                        });
                        toast.success(`تم إضافة ${meal.title} إلى السلة`);
                      }}
                      className="bg-white text-brand-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                    >
                      <ShoppingBag size={24} />
                    </button>
                  </div>

                  {/* Dynamic Attention Badges based on index for visual flair */}
                  {i % 3 === 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                      <Flame size={14} className="fill-current" /> الأكثر طلباً
                    </div>
                  )}
                  {i % 3 === 1 && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                      <Award size={14} className="fill-current" /> اختيار الشيف
                    </div>
                  )}
                  {i % 3 === 2 && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                      <Sparkles size={14} className="fill-current" /> طازج 100%
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-2xl text-sm font-black text-brand-primary shadow-lg">
                    {meal.price} ج.م
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/meal/${meal.id}`} className="text-2xl font-black text-brand-accent hover:text-brand-primary transition-colors leading-tight">{meal.title}</Link>
                    <div className="flex items-center gap-1 bg-brand-primary/10 px-2 py-1 rounded-lg text-brand-primary">
                      <Star size={14} className="fill-brand-primary" />
                      <span className="text-xs font-black">{meal.rating}</span>
                    </div>
                  </div>
                  <p className="text-stone-500 mb-6 flex items-center gap-2 text-sm font-bold">
                    بواسطة <Link to={`/chef/${meal.chefId}`} className="text-brand-accent hover:underline">{meal.chefName}</Link>
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-stone-400 text-sm font-black">
                      <Clock size={16} /> {meal.deliveryTime || 45} دقيقة
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/meal/${meal.id}`} className="bg-stone-100 text-stone-600 p-3 rounded-2xl hover:bg-stone-200 transition-colors">
                        عرض
                      </Link>
                      <button 
                        onClick={() => {
                          addToCart({
                            id: meal.id,
                            title: meal.title,
                            price: meal.price,
                            quantity: 1,
                            image: meal.image,
                            chefId: meal.chefId,
                            chefName: meal.chefName
                          });
                          toast.success(`تم إضافة ${meal.title} إلى السلة`);
                        }}
                        className="bg-brand-primary text-white py-3 px-6 rounded-2xl text-sm font-black hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">لا توجد نتائج</h3>
            <p className="text-stone-500">جرب البحث بكلمات أخرى أو تغيير القسم</p>
          </div>
        )}
      </div>
    </div>
  );
}
