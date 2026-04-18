import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Send, Utensils } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  chefId: string;
  chefName: string;
  orderId: string;
}

export default function ReviewModal({ isOpen, onClose, chefId, chefName, orderId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('من فضلك اختر تقييماً');
      return;
    }
    if (!comment.trim()) {
      toast.error('من فضلك اكتب تعليقاً');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!auth.currentUser) throw new Error('يجب تسجيل الدخول أولاً');

      // 1. Add review
      await addDoc(collection(db, 'reviews'), {
        chefId,
        orderId,
        customerId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'عميل طبلية',
        customerPhoto: auth.currentUser.photoURL || '',
        rating,
        comment,
        createdAt: Date.now()
      });

      // 2. Update Chef stats (optional but good for performance)
      const chefRef = doc(db, 'users', chefId);
      const chefSnap = await getDoc(chefRef);
      if (chefSnap.exists()) {
        const currentRating = chefSnap.data().rating || 0;
        const currentCount = chefSnap.data().reviewsCount || 0;
        const newCount = currentCount + 1;
        const newRating = (currentRating * currentCount + rating) / newCount;

        await updateDoc(chefRef, {
          rating: Number(newRating.toFixed(1)),
          reviewsCount: increment(1)
        });
      }

      // 3. Mark Order as reviewed
      if (orderId) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          isReviewed: true
        });
      }

      toast.success('شكراً لتقييمك! تم إرسال تعليقك بنجاح');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('حدث خطأ أثناء إرسال التقييم، حاول مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-secondary/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-brand-secondary">تقييم المطبخ</h3>
                    <p className="text-stone-500 font-bold">{chefName}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-stone-50 rounded-full text-stone-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center">
                  <p className="text-stone-600 font-bold mb-4">كيف كانت تجربتك؟</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="transition-all duration-200 hover:scale-110 active:scale-95"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          size={40}
                          className={`${
                            star <= (hover || rating)
                              ? 'fill-brand-primary text-brand-primary'
                              : 'text-stone-200'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-brand-secondary mb-3 pr-2">
                    اكتب رأيك بصراحة
                  </label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="مثال: الأكل وصل ساخن وطعمه تحفة، والتغليف ممتاز..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-stone-100 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none resize-none font-medium placeholder:text-stone-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-5 text-xl shadow-2xl shadow-brand-primary/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={20} />
                      <span>إرسال التقييم</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
