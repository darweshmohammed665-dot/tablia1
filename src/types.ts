export type UserRole = 'customer' | 'chef';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  bio?: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
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
  items: {
    mealId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  createdAt: number;
}

export interface Review {
  id: string;
  mealId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: number;
}
