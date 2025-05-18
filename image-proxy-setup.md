# Image Proxy Setup Guide

This guide explains how to deploy and use the Firebase Cloud Function that proxies image requests from Firebase Storage.

## Overview

The image proxy allows you to serve images from your own domain rather than directly from Firebase Storage. This has several advantages:

1. Better branding (images are served from your domain)
2. Improved security (real storage URLs are hidden)
3. Better SEO (images appear to be hosted on your site)
4. Protection against hotlinking

## Deployment Steps

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Log in to Firebase

```bash
firebase login
```

### 3. Initialize your project (if not already done)

```bash
firebase init
```

Select:
- Functions (Node.js)
- Hosting

### 4. Deploy the Cloud Function

```bash
firebase deploy --only functions
```

### 5. Deploy Hosting Configuration

```bash
firebase deploy --only hosting
```

## How to Use in Your Application

### 1. Using the Utility Function

The `getProxiedImageUrl` utility function has been created to convert Firebase Storage URLs to your proxied image URLs.

Import and use the function wherever you need to display an image:

```typescript
import { getProxiedImageUrl } from '../utils/imageUtils';

// Within your component
const displayUrl = getProxiedImageUrl(originalFirebaseUrl);

// Then use in your JSX
<img src={displayUrl} alt="Description" />
```

### 2. Components Already Updated

The `FeaturedImageUpload` component has already been updated to use the proxy. When you upload images through this component, they will be displayed using your domain.

### 3. Updating Other Components

For any other components that display images from Firebase Storage, you should:

1. Import the utility function:
```typescript
import { getProxiedImageUrl } from '../../utils/imageUtils';
```

2. Use it when displaying the image:
```typescript
<img src={getProxiedImageUrl(imageUrl)} alt="Description" />
```

## Testing

After deployment, you can test the proxy by:

1. Upload an image using your application
2. Check the URL of the displayed image - it should be in the format: `https://your-domain.com/images/your-image-path.jpg`
3. The image should load correctly, indicating that the Cloud Function is properly proxying the request

## Troubleshooting

If images are not loading:

1. Check the Firebase Function logs in the Firebase Console
2. Verify that the Firebase Storage URL is correctly formatted
3. Ensure that your Firebase Storage bucket has proper permissions
4. Check that the CORS configuration is correctly set on your Firebase Storage bucket

## Notes

- The proxy adds a small amount of latency since requests now go through an extra step
- Cloud Functions have quotas and usage limits. For high-traffic sites, you may need to upgrade your Firebase plan.
- This proxy handles only GET requests for images. It doesn't support other operations like uploading.

## Security Considerations

- The proxy function is set up to allow access from any origin (`*`). You may want to restrict this to your specific domain.
- Consider adding authentication to the proxy function if you want to restrict access to certain users. 