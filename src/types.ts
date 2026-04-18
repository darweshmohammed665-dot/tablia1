export type UserRole = 'customer' | 'chef';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  address?: string;
  rating?: number;
  reviewsCount?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  paymentMethods?: {
    vodafoneCash?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    instapay?: string;
  };
  workingHours?: {
    shifts: { from: string; to: string }[];
    closedDays?: string[];
  };
  isClosed?: boolean;
  createdAt: number;
}

export interface Meal {
  id: string;
  chefId: string;
  chefName: string;
  title: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Up to 6 images
  orderType?: 'instant' | 'preorder'; // فوري ولا طلب يوم بيومه
  category: string;
  rating: number;
  reviewsCount: number;
  available: boolean;
  deliveryTime?: number; // in minutes
  featured?: boolean;
  orderCount?: number;
}

export interface Order {
  id: string;
  customerId: string;
  chefId: string;
  chefName: string;
  items: {
    mealId: string;
    title: string;
    quantity: number;
    price: number;
    scheduledDate?: string;
    scheduledTime?: string;
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  createdAt: number;
  isReviewed?: boolean;
}

export interface Review {
  id: string;
  chefId: string;
  mealId?: string;
  customerId: string;
  customerName: string;
  customerPhoto?: string;
  rating: number;
  comment: string;
  orderId?: string;
  createdAt: number;
}
