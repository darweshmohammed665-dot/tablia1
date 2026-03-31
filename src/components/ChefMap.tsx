import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, Order } from '../types';
import { ChefHat, ShoppingBag, MapPin, Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { motion } from 'motion/react';

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon Creators
const createChefIcon = () => {
  const iconHtml = renderToStaticMarkup(
    <div className="bg-brand-primary p-2 rounded-full text-white shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
      <ChefHat size={20} />
    </div>
  );
  return L.divIcon({
    html: iconHtml,
    className: 'custom-chef-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const createOrderIcon = () => {
  const iconHtml = renderToStaticMarkup(
    <div className="bg-brand-secondary p-1.5 rounded-full text-white shadow-md border border-white animate-pulse">
      <ShoppingBag size={14} />
    </div>
  );
  return L.divIcon({
    html: iconHtml,
    className: 'custom-order-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function ChefMap() {
  const [chefs, setChefs] = useState<UserProfile[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const center: [number, number] = [30.7865, 31.0004]; // Tanta, Egypt

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Chefs
        const chefsQ = query(collection(db, 'users'), where('role', '==', 'chef'));
        const chefsSnap = await getDocs(chefsQ);
        const chefsData = chefsSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
        
        // Add mock coordinates for Tanta area if missing
        const chefsWithCoords = chefsData.map((chef, i) => {
          if (!chef.coordinates) {
            return {
              ...chef,
              coordinates: {
                lat: center[0] + (Math.random() - 0.5) * 0.04,
                lng: center[1] + (Math.random() - 0.5) * 0.04
              }
            };
          }
          return chef;
        });
        setChefs(chefsWithCoords);

        // Fetch Recent Orders (to show active delivery zones)
        // Only fetch if authenticated to avoid permission errors on public map
        if (auth.currentUser) {
          try {
            const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(15));
            const ordersSnap = await getDocs(ordersQ);
            const ordersData = ordersSnap.docs.map(doc => {
              const data = doc.data();
              // Mock coordinates for orders near Tanta
              return {
                id: doc.id,
                lat: center[0] + (Math.random() - 0.5) * 0.06,
                lng: center[1] + (Math.random() - 0.5) * 0.06,
                ...data
              };
            });
            setRecentOrders(ordersData);
          } catch (orderError) {
            console.warn("Could not fetch orders for map (likely permission restriction):", orderError);
            // Silently fail for orders, we still have chefs
          }
        }

      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[600px] w-full bg-stone-100 rounded-[3rem] flex items-center justify-center border-4 border-white shadow-inner">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-brand-primary border-r-transparent"></div>
          <p className="text-stone-400 font-bold animate-pulse">جاري تحميل خريطة طبلية...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-right">
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              تغطية حية
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-stone-900 mb-4"
            >
              خريطة طبلية التفاعلية
            </motion.h2>
            <p className="text-stone-500 text-lg max-w-2xl">
              شاهد مواقع الشيفات النشطين ونطاق التوصيل المتاح حالياً في مدينة طنطا والقرى المجاورة.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-brand-cream px-6 py-3 rounded-2xl border border-stone-100 text-center">
              <p className="text-2xl font-bold text-brand-primary">{chefs.length}</p>
              <p className="text-xs text-stone-500 font-bold">شيف نشط</p>
            </div>
            <div className="bg-brand-cream px-6 py-3 rounded-2xl border border-stone-100 text-center">
              <p className="text-2xl font-bold text-brand-secondary">{recentOrders.length}+</p>
              <p className="text-xs text-stone-500 font-bold">طلب مؤخراً</p>
            </div>
          </div>
        </div>

        <div className="relative h-[650px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-stone-50 group">
          <MapContainer 
            center={center} 
            zoom={13} 
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Chef Markers & Coverage */}
            {chefs.map((chef) => (
              <React.Fragment key={chef.uid}>
                {chef.coordinates && (
                  <>
                    <Marker 
                      position={[chef.coordinates.lat, chef.coordinates.lng]} 
                      icon={createChefIcon()}
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 text-right min-w-[200px]" dir="rtl">
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={chef.photoURL || `https://picsum.photos/seed/${chef.uid}/100/100`} 
                              alt={chef.displayName} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary/20"
                            />
                            <div>
                              <h3 className="font-bold text-stone-900 m-0 leading-tight">{chef.displayName}</h3>
                              <p className="text-xs text-stone-500 m-0 flex items-center gap-1">
                                <MapPin size={10} /> {chef.location || 'طنطا'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-4 bg-brand-cream p-2 rounded-xl">
                            <div className="flex items-center gap-1 text-brand-accent">
                              <span className="text-sm font-bold">★ {chef.rating || '5.0'}</span>
                            </div>
                            <span className="text-[10px] font-bold text-stone-400">توصيل خلال 45 د</span>
                          </div>
                          <a 
                            href={`/chef/${chef.uid}`} 
                            className="block text-center bg-brand-primary text-white py-2 px-4 rounded-xl text-sm font-bold no-underline hover:bg-brand-primary/90 transition-colors shadow-md"
                          >
                            طلب أكل بيتي
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle 
                      center={[chef.coordinates.lat, chef.coordinates.lng]}
                      radius={3500}
                      pathOptions={{ 
                        fillColor: '#c65d3a', 
                        color: '#c65d3a', 
                        fillOpacity: 0.05,
                        weight: 1,
                        dashArray: '8, 12'
                      }}
                    />
                  </>
                )}
              </React.Fragment>
            ))}

            {/* Recent Orders Markers */}
            {recentOrders.map((order) => (
              <Marker 
                key={order.id} 
                position={[order.lat, order.lng]} 
                icon={createOrderIcon()}
              >
                <Popup>
                  <div className="text-right p-1" dir="rtl">
                    <p className="text-xs font-bold text-brand-secondary m-0">طلب جديد نصل إليه الآن!</p>
                    <p className="text-[10px] text-stone-400 m-0">#{order.id.slice(-6)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls Overlay */}
          <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
            <button className="bg-white p-3 rounded-2xl shadow-lg border border-stone-100 text-stone-600 hover:text-brand-primary transition-colors">
              <Navigation size={20} />
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-10 right-10 z-[1000] bg-brand-cream/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-stone-100 flex flex-col gap-4 min-w-[220px]">
            <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 mb-1">دليل الخريطة</h4>
            <div className="flex items-center gap-4 text-sm font-bold text-stone-700">
              <div className="w-5 h-5 bg-brand-primary rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <ChefHat size={10} className="text-white" />
              </div>
              <span>موقع الشيف</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-stone-700">
              <div className="w-5 h-5 bg-brand-secondary rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <ShoppingBag size={10} className="text-white" />
              </div>
              <span>طلب نشط حالياً</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-stone-700">
              <div className="w-5 h-5 bg-brand-primary/10 rounded-full border border-brand-primary border-dashed"></div>
              <span>نطاق التوصيل المتاح</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
