export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: string;
  features: string[];
  paymentLink?: string;
  scheduleUrl?: string;
  createdAt: number;
  updatedAt: number;
}