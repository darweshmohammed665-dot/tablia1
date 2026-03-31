import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Package, Clock, ShoppingBag, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusTracker from '../components/OrderStatusTracker';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-[56px] font-bold text-brand-accent">طلباتي</h1>
          <Link to="/meals" className="text-brand-primary font-bold flex items-center gap-2 hover:underline">
            اطلب المزيد <ChevronLeft size={20} />
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="food-card p-8 md:p-10 relative overflow-hidden group"
              >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-700"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-black text-stone-400 tracking-wider">رقم الطلب: #{order.id.slice(-6).toUpperCase()}</span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-brand-primary/10 text-brand-primary'
                      }`}>
                        {order.status === 'pending' ? 'قيد الانتظار' : 
                         order.status === 'preparing' ? 'جاري التحضير' : 
                         order.status === 'out_for_delivery' ? 'في الطريق' :
                         order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-accent leading-tight">
                      {order.items.map(item => item.title).join('، ')}
                    </h3>
                  </div>
                  <div className="text-left md:text-right bg-brand-cream p-4 rounded-2xl border border-stone-100 w-full md:w-auto">
                    <p className="text-3xl font-bold text-brand-primary mb-1">{order.total} <span className="text-sm text-stone-500 font-bold">ج.م</span></p>
                    <p className="text-xs text-stone-400 flex items-center gap-1 justify-end font-bold">
                      <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 bg-brand-cream/50 rounded-3xl p-6 md:p-8 mb-8 border border-stone-100/50">
                  <OrderStatusTracker status={order.status} />
                </div>

                <div className="pt-8 border-t border-stone-100 flex flex-wrap gap-4 relative z-10">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-brand-cream px-5 py-3 rounded-2xl border border-stone-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-accent">{item.title}</p>
                        <p className="text-xs text-stone-500 font-bold">{item.quantity} × {item.price} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 food-card">
            <div className="bg-brand-cream w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-brand-accent mb-2">لا توجد طلبات بعد</h3>
            <p className="text-stone-500 mb-8">لم تقم بإجراء أي طلبات حتى الآن.</p>
            <Link to="/meals" className="btn-primary px-10 py-4">ابدأ التسوق الآن</Link>
          </div>
        )}
      </div>
    </div>
  );
}
