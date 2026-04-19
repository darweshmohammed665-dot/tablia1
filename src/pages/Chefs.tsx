import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion } from 'motion/react';
import { Search, MapPin, Star, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHEF_IMAGE_URL } from '../constants';

export default function Chefs() {
  const [chefs, setChefs] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChefs = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      const path = 'users';
      try {
        const q = query(collection(db, path), where('role', '==', 'chef'));
        const querySnapshot = await getDocs(q);
        const chefsData = querySnapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
        setChefs(chefsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const filteredChefs = chefs.filter(chef => 
    chef.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-[100px] relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center">
          <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-6 block">أفضل المطابخ</span>
          <h1 className="text-6xl md:text-[100px] font-black text-brand-secondary leading-[0.9] tracking-tighter mb-8">ملوك <br /> <span className="text-brand-primary italic font-serif">النفس</span> الفلاحي</h1>
          <p className="text-stone-500 text-2xl max-w-2xl mx-auto font-medium">تعرف على أفضل المطابخ حولك.</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mb-8 md:mb-12 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن مطبخ بالاسم..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all bg-white shadow-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[18px] h-80 animate-pulse shadow-[0_8px_20px_rgba(0,0,0,0.08)]"></div>
            ))}
          </div>
        ) : filteredChefs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChefs.map((chef, i) => (
              <motion.div 
                key={chef.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="food-card p-[20px] text-center flex flex-col"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-brand-primary/10 rounded-full animate-pulse"></div>
                  <div className="w-full h-full rounded-full bg-brand-secondary flex items-center justify-center relative z-10 border-4 border-white shadow-md overflow-hidden">
                    <img 
                      src={CHEF_IMAGE_URL} 
                      alt={chef.displayName} 
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-brand-secondary text-white p-2 rounded-full shadow-lg z-20">
                    <ChefHat size={16} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-brand-accent mb-2">{chef.displayName}</h3>
                <div className="flex items-center justify-center gap-1 text-brand-primary mb-4">
                  <Star size={16} className={chef.rating ? 'fill-brand-primary' : 'text-stone-200'} />
                  <span className="text-stone-400 text-sm mr-2">({chef.rating?.toFixed(1) || '0.0'})</span>
                  {chef.reviewsCount !== undefined && (
                    <span className="text-stone-300 text-xs mr-1"> • {chef.reviewsCount} تقييم</span>
                  )}
                </div>
                
                <p className="text-stone-500 mb-8 line-clamp-2 text-sm flex-grow">
                  {chef.bio || "مطبخ منزلي شغوف يقدم أشهى الوجبات التقليدية بلمسة سحرية."}
                </p>
                
                <div className="flex items-center justify-center gap-4 text-stone-400 text-sm mb-6">
                  <span className="flex items-center gap-1"><MapPin size={16} /> {chef.location || 'متاح'}</span>
                </div>
                
                <Link to={`/chef/${chef.uid}`} className="btn-secondary w-full py-3 block mt-auto">
                  عرض المطبخ
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-stone-900 mb-2">لا توجد مطابخ بهذا الاسم</h3>
            <p className="text-stone-500">جرب البحث باسم آخر</p>
          </div>
        )}
      </div>
    </div>
  );
}
