import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { collection, query, where, getDocs, limit, orderBy, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, Order } from '../types';

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
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
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData.map(provider => ({
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
import { ChefHat, ShoppingBag, MapPin, Navigation } from 'lucide-react';
import { CHEF_IMAGE_URL } from '../constants';
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
const createChefIcon = (isClosest: boolean = false) => {
  const iconHtml = renderToStaticMarkup(
    <div className={`p-2 rounded-full text-white shadow-lg border-2 border-white transform hover:scale-110 transition-transform ${isClosest ? 'bg-brand-secondary animate-bounce' : 'bg-brand-primary'}`}>
      <ChefHat size={isClosest ? 24 : 20} />
    </div>
  );
  return L.divIcon({
    html: iconHtml,
    className: 'custom-chef-icon',
    iconSize: isClosest ? [48, 48] : [40, 40],
    iconAnchor: isClosest ? [24, 48] : [20, 40],
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const center: [number, number] = [30.7865, 31.0004]; // Tanta, Egypt

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Could not get user location:", error);
        }
      );
    }

    const fetchData = async () => {
      if (!db) {
        console.warn('Firebase is disconnected. Skipping map data fetch.');
        setLoading(false);
        return;
      }
      try {
        // Fetch Chefs
        const chefsQ = query(collection(db, 'users'), where('role', '==', 'chef'));
        let chefsSnap;
        try {
          chefsSnap = await getDocs(chefsQ);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, 'users');
          return; // Should not reach here as handleFirestoreError throws
        }
        const chefsData = chefsSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
        
        // Add mock coordinates for Tanta area if missing
        let chefsWithCoords = chefsData.map((chef, i) => {
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

        // Sort chefs by proximity if user location is available
        if (userLocation) {
          chefsWithCoords = chefsWithCoords.sort((a, b) => {
            const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates!.lat, a.coordinates!.lng);
            const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates!.lat, b.coordinates!.lng);
            return distA - distB;
          });
        }

        setChefs(chefsWithCoords);

        // Fetch Recent Orders (to show active delivery zones)
        // Removed global orders fetch as it violates security rules and causes permission errors.
        setRecentOrders([]);

      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation]);

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
    <section className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-6">
          <div className="text-right w-full md:w-auto">
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-brand-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-4 block"
            >
              تغطية حية
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-stone-900 mb-4"
            >
              أقرب المطابخ إليك
            </motion.h2>
            <p className="text-stone-500 text-base md:text-lg max-w-2xl">
              شاهد مواقع المطابخ النشطة ونطاق التوصيل المتاح حالياً في مدينة طنطا.
            </p>
          </div>
          <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-start md:justify-end">
            <div className="flex-1 md:flex-none bg-brand-cream px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-stone-100 text-center">
              <p className="text-xl md:text-2xl font-bold text-brand-primary">{chefs.length}</p>
              <p className="text-[10px] md:text-xs text-stone-500 font-bold">مطبخ نشط</p>
            </div>
            <div className="flex-1 md:flex-none bg-brand-cream px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-stone-100 text-center">
              <p className="text-xl md:text-2xl font-bold text-brand-secondary">{recentOrders.length}+</p>
              <p className="text-[10px] md:text-xs text-stone-500 font-bold">طلب مؤخراً</p>
            </div>
          </div>
        </div>

        <div className="-mx-4 md:mx-0 relative h-[500px] md:h-[650px] w-[calc(100%+2rem)] md:w-full md:rounded-[3.5rem] overflow-hidden shadow-2xl border-y-2 md:border-[12px] border-stone-50 group">
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
            {chefs.map((chef, index) => {
              const isClosest = index < 3;
              if (!chef.coordinates || typeof chef.coordinates.lat !== 'number' || typeof chef.coordinates.lng !== 'number') {
                return null;
              }
              return (
                <React.Fragment key={chef.uid}>
                  <Marker 
                    position={[chef.coordinates.lat, chef.coordinates.lng]} 
                    icon={createChefIcon(isClosest)}
                  >
                    <Popup className="custom-popup">
                      <div className="p-3 text-right min-w-[200px]" dir="rtl">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={chef.photoURL || CHEF_IMAGE_URL} 
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
                      fillColor: isClosest ? '#f27d26' : '#c65d3a', 
                      color: isClosest ? '#f27d26' : '#c65d3a', 
                      fillOpacity: isClosest ? 0.15 : 0.05,
                      weight: isClosest ? 2 : 1,
                      dashArray: '8, 12'
                    }}
                  />
                </React.Fragment>
              );
            })}

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
          <div className="absolute bottom-2 right-2 md:bottom-10 md:right-10 z-[1000] bg-brand-cream/95 backdrop-blur-md p-3 md:p-6 rounded-[1rem] md:rounded-[2rem] shadow-2xl border border-stone-100 flex flex-col gap-2 md:gap-4 min-w-[140px] md:min-w-[220px]">
            <h4 className="text-xs md:text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 mb-1">دليل الخريطة</h4>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-bold text-stone-700">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-brand-primary rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <ChefHat size={8} className="text-white md:w-2.5 md:h-2.5" />
              </div>
              <span>موقع الشيف</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-bold text-stone-700">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-brand-secondary rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <ShoppingBag size={8} className="text-white md:w-2.5 md:h-2.5" />
              </div>
              <span>طلب نشط حالياً</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-bold text-stone-700">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-brand-primary/10 rounded-full border border-brand-primary border-dashed"></div>
              <span>نطاق التوصيل المتاح</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
