import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Meal } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Clock, X, ChevronDown, SlidersHorizontal, ArrowUpDown, ShoppingCart, ShoppingBag } from 'lucide-react';
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
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-6 block">المنيو</span>
          <h1 className="text-6xl md:text-[100px] font-black text-brand-secondary leading-[0.9] tracking-tighter mb-8">أشهى الأكلات <br /> <span className="text-brand-primary italic font-serif">البيتي</span></h1>
          <p className="text-stone-500 text-2xl max-w-2xl mx-auto font-medium">كل اللي نفسك فيه وأكتر.. أكل بيتي سخن وطازة بيوصلك لحد الباب.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن أكلة أو شيف..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all bg-white shadow-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-6 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-700 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
              >
                <SlidersHorizontal size={20} />
                <span>تصفية</span>
                {(selectedCategories.length > 0 || minRating > 0 || maxDeliveryTime < 120 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                )}
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
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-black text-brand-primary shadow-sm">
                    {meal.price} ج.م
                  </div>
                  {meal.featured && (
                    <div className="absolute top-4 right-4 bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                      مميز
                    </div>
                  )}
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
