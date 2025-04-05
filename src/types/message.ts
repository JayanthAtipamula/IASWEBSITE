export interface ContactMessage {
  id: string;
  name: string;
  phoneNumber: string;
  message: string;
  createdAt: number;
  isRead: boolean;
  contacted: boolean;
  adminComment?: string;
}

export interface ContactMessageFormData {
  name: string;
  phoneNumber: string;
  message: string;
} 