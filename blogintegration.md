# Cyberensis Blog & Admin Integration

This package contains the core components of the Cyberensis blog system and admin panel, ready to be integrated into other React projects.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Prerequisites](#prerequisites)
4. [Integration Steps](#integration-steps)
5. [Configuration](#configuration)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

## Overview

This integration package provides a complete blog system with an admin panel that includes:

- Blog post management (create, read, update, delete)
- Category management
- User authentication for admin access
- Protected routes for admin functionality
- Responsive blog display components

## Directory Structure

```
blog-admin-integration/
├── src/
│   ├── components/
│   │   ├── admin/         # Admin UI components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── admin/         # Admin page components
│   │   └── blog/          # Blog page components
│   └── services/
│       └── blogService.ts # Blog data operations
└── README.md
```

## Prerequisites

Before integrating, ensure your project has:

1. React 16.8+ (for Hooks support)
2. React Router v6+
3. Firebase (Firestore) setup
4. Tailwind CSS (recommended but optional)

Required npm packages:
```bash
npm install firebase react-router-dom react-helmet-async slugify
```

## Integration Steps

### 1. Copy Files to Your Project

Copy the directories from this package to your project, maintaining the same structure:

```bash
cp -r blog-admin-integration/src/* your-project/src/
```

### 2. Firebase Configuration

Ensure you have a Firebase configuration file in your project. Create `src/lib/firebase.ts` if it doesn't exist:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 3. Add Types

Create a `src/types/blog.ts` file with the following types:

```typescript
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
```

### 4. Set Up Routes

Add the blog and admin routes to your main routing file (e.g., `App.tsx`):

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Blog Pages
import BlogIndex from './pages/blog/BlogIndex';
import BlogPost from './pages/blog/BlogPost';
import CategoryPage from './pages/blog/CategoryPage';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogPosts from './pages/admin/BlogPosts';
import NewBlogPost from './pages/admin/NewBlogPost';
import EditBlogPost from './pages/admin/EditBlogPost';
import Categories from './pages/admin/Categories';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Your existing routes */}
        
        {/* Blog Routes */}
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<BlogPosts />} />
            <Route path="posts/new" element={<NewBlogPost />} />
            <Route path="posts/edit/:id" element={<EditBlogPost />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
```

### 5. Add Navigation Links

Add links to your blog and admin panel in your main navigation component:

```jsx
<nav>
  {/* Your existing navigation links */}
  <Link to="/blog">Blog</Link>
  
  {/* Admin link (optional - can be shown conditionally based on user role) */}
  <Link to="/admin">Admin</Link>
</nav>
```

## Configuration

### Admin Access Control

By default, the admin panel is protected by Firebase Authentication. You can modify the `AuthContext.tsx` to use a different authentication method if needed.

To add admin users:

1. Create a user in Firebase Authentication
2. Set up a Firestore collection named `admin_users` with documents containing the user's email

### Blog Post Storage

Blog posts are stored in Firestore. The default collection names are:
- `blog_posts` - for blog post data
- `categories` - for category data

You can modify these in `blogService.ts` if needed.

## Customization

### Styling

The components use Tailwind CSS by default. You can modify the styling by:

1. Editing the component files directly
2. Overriding the styles with your own CSS
3. Modifying your Tailwind configuration

### Layout and Components

You can customize the layout and appearance by modifying the components in:
- `src/pages/blog/` - for blog pages
- `src/pages/admin/` - for admin pages
- `src/components/admin/` - for admin UI components

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Ensure your Firebase project has Authentication enabled
   - Check that your Firebase config is correct

2. **Routing Issues**
   - Make sure you're using React Router v6+
   - Check that all route paths are correct

3. **Styling Issues**
   - If using Tailwind, ensure your Tailwind config includes all necessary plugins
   - Check for CSS conflicts with your existing styles

### Getting Help

If you encounter issues during integration, check:
1. Firebase documentation: https://firebase.google.com/docs
2. React Router documentation: https://reactrouter.com/docs/en/v6

## License

This integration package is provided as-is for use with Cyberensis projects. 