import { ObjectId } from 'mongodb';

export interface VehicleDoc {
  _id?: ObjectId;
  name: string;
  type: 'car' | 'bike' | 'suv' | 'luxury';
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  images: string[];
  features: string[];
  seats: number;
  transmission: string;
  fuel: string;
  rating: number;
  available: boolean;
}

export interface BookingDoc {
  _id?: ObjectId;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export interface BlogPostDoc {
  _id?: ObjectId;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export interface TestimonialDoc {
  _id?: ObjectId;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

/** Chuyển MongoDB document sang plain object với id string */
export function toJSON<T extends { _id?: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc;
  return { id: _id!.toString(), ...rest };
}
