export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  categories: string[];
  createdAt: number;
  updatedAt: number;
  published: boolean;
}

export interface CustomPageFormData {
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  categories: string[];
  published: boolean;
} 