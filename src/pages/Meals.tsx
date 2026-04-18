import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Meal } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Clock, X, ChevronDown, SlidersHorizontal, ArrowUpDown, ShoppingCart, ShoppingBag, UtensilsCrossed, Coffee, Pizza, IceCream, Sandwich, Flame, Award, Sparkles, BadgeCheck, ChefHat, Salad, Soup, Utensils } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MealCard } from '../components/MealCard';
import { toast } from 'sonner';

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize categories from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategories([cat]);
    }
  }, [searchParams]);

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
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'instant' | 'preorder'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
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
      const matchesOrderType = orderTypeFilter === 'all' || meal.orderType === orderTypeFilter;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesDelivery && matchesOrderType;
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

  const categories = [
    'الكل', 
    'أكل بيتي مصري', 
    'أكلات شعبية', 
    'مشويات', 
    'أكل فلاحي / ريفي', 
    'أكلات فورية ومطلوبة', 
    'وجبات دايت / صحي', 
    'أكلات عالمية منتشرة في مصر', 
    'الحلويات'
  ];

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setMinRating(0);
    setMaxDeliveryTime(120);
    setOrderTypeFilter('all');
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen py-[100px] relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center">
          <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-6 block">تصفح الاكلات</span>
          <h1 className="text-6xl md:text-[100px] font-black text-brand-secondary leading-[0.9] tracking-tighter mb-8 drop-shadow-sm">أشهى الأكلات <br /> <span className="text-brand-primary italic font-serif">البيتي</span></h1>
          <p className="text-brand-secondary/70 text-2xl max-w-2xl mx-auto font-medium mb-8">كل اللي نفسك فيه وأكتر.. أكل بيتي سخن وطازة بيوصلك لحد الباب.</p>
          
          <div className="inline-block px-8 py-4 bg-brand-primary/10 border-2 border-brand-primary border-dashed rounded-2xl mb-8">
            <p className="text-lg font-bold text-brand-primary">
              الوجبات اليومية للطلاب والموظفين اطلب ووفر اكتر
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

          {/* Categories Horizontal */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-brand-accent">ماذا تشتهي اليوم؟</h3>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide flex-row-reverse">
              {[
                { label: 'أكل بيتي مصري', icon: '🍲' },
                { label: 'أكلات شعبية', icon: '🥙' },
                { label: 'مشويات', icon: '🍗' },
                { label: 'أكل فلاحي / ريفي', icon: '🚜' },
                { label: 'أكلات فورية ومطلوبة', icon: '🍔' },
                { label: 'أكلات عالمية منتشرة في مصر', icon: '🍝' },
                { label: 'الحلويات', icon: '🍰' },
                { label: 'وجبات دايت / صحي', icon: '🥗' }
              ].map((cat) => (
                <button 
                  key={cat.label}
                  onClick={() => {
                    const newCats = selectedCategories.includes(cat.label) ? [] : [cat.label];
                    setSelectedCategories(newCats);
                    if (newCats.length > 0) {
                      setSearchParams({ category: cat.label });
                    } else {
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    }
                  }}
                  className="flex flex-col items-center gap-4 min-w-[120px] group"
                >
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-xl transition-all border-4 ${selectedCategories.includes(cat.label) ? 'bg-brand-primary border-white rotate-6 scale-110' : 'bg-white border-transparent group-hover:scale-110 group-hover:border-brand-primary/20'}`}>
                    {cat.icon}
                  </div>
                  <span className={`font-black text-sm text-center transition-colors ${selectedCategories.includes(cat.label) ? 'text-brand-primary' : 'text-stone-600 group-hover:text-brand-primary'}`}>{cat.label}</span>
                </button>
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

                  {/* Order Type */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900">طريقة الطلب</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setOrderTypeFilter('all')}
                        className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${orderTypeFilter === 'all' ? 'bg-brand-secondary text-white border-brand-secondary shadow-lg' : 'bg-white text-stone-500 border-stone-100 hover:border-brand-secondary'}`}
                      >
                        الكل
                      </button>
                      <button
                        onClick={() => setOrderTypeFilter('instant')}
                        className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${orderTypeFilter === 'instant' ? 'bg-green-500 text-white border-green-500 shadow-lg' : 'bg-white text-stone-500 border-stone-100 hover:border-green-500'}`}
                      >
                        فوري ⚡
                      </button>
                      <button
                        onClick={() => setOrderTypeFilter('preorder')}
                        className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${orderTypeFilter === 'preorder' ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-white text-stone-500 border-stone-100 hover:border-blue-500'}`}
                      >
                        يوم بيومه 🗓️
                      </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[18px] h-96 animate-pulse shadow-[0_8px_20px_rgba(0,0,0,0.08)]"></div>
            ))}
          </div>
        ) : filteredAndSortedMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedMeals.map((meal, i) => (
              <div key={meal.id} className="relative">
                <MealCard meal={meal} index={i} />
                {/* Dynamic Attention Badges based on index for visual flair */}
                {i % 3 === 0 && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 pointer-events-none z-20">
                    <Flame size={14} className="fill-current" /> الأكثر طلباً
                  </div>
                )}
                {i % 3 === 1 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 pointer-events-none z-20">
                    <Award size={14} className="fill-current" /> اختيار الشيف
                  </div>
                )}
                {i % 3 === 2 && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 pointer-events-none z-20">
                    <Sparkles size={14} className="fill-current" /> طازج 100%
                  </div>
                )}
              </div>
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
