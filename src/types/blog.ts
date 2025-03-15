export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  categories: string[];
  tags?: string[];
  author: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BlogPostFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  categories: string[];
  tags?: string[];
  author: string;
  published: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
