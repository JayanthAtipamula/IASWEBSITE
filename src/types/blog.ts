export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription?: string;
  featuredImage?: string;
  categories: string[];
  tags?: string[];
  author: string;
  published: boolean;
  isCurrentAffair?: boolean;
  currentAffairDate?: number;
  examType?: 'upsc' | 'tgpsc' | 'appsc';
  createdAt: number;
  updatedAt: number;
}

export interface BlogPostFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  metaDescription?: string;
  featuredImage?: string;
  categories: string[];
  tags?: string[];
  author: string;
  published: boolean;
  isCurrentAffair?: boolean;
  currentAffairDate?: number;
  examType?: 'upsc' | 'tgpsc' | 'appsc';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
