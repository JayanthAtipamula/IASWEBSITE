# Firebase Environment Configuration

## Required Environment Variables

Create a `.env` file in your project root with the following Firebase configuration variables:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

## How to Get Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create a new one)
3. **Go to Project Settings** (gear icon → Project settings)
4. **Scroll down to "Your apps"**
5. **Select or add a Web app**
6. **Copy the configuration values** from the `firebaseConfig` object

Example configuration object from Firebase:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...", // Copy this to VITE_FIREBASE_API_KEY
  authDomain: "yourproject.firebaseapp.com", // Copy this to VITE_FIREBASE_AUTH_DOMAIN
  projectId: "yourproject", // Copy this to VITE_FIREBASE_PROJECT_ID
  storageBucket: "yourproject.appspot.com", // Copy this to VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // Copy this to VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123" // Copy this to VITE_FIREBASE_APP_ID
};
```

## Enable Required Firebase Services

### 1. Enable Firestore Database
1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location for your database

### 2. Enable Authentication (Optional but Recommended)
1. Go to **Authentication** in Firebase Console
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable desired sign-in methods (Email/Password recommended)

### 3. Enable Storage (If using image uploads)
1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Choose **Start in test mode** (for development)

## Firestore Security Rules

For development, you can use these permissive rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, use proper authentication-based rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write content
    match /blog-drafts/{documentId} {
      allow read, write: if request.auth != null;
    }
    
    match /test-content/{documentId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to published content
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Testing Your Configuration

After setting up your environment variables:

1. **Restart your development server**
2. **Visit** `/firebase-editor-debug` in your application
3. **Click "Test Firebase Connection"** to verify setup
4. **Check the console** for detailed error messages if connection fails

## Common Issues and Solutions

### Issue: "Firebase API key not set"
**Solution**: Make sure you have `VITE_FIREBASE_API_KEY` in your `.env` file

### Issue: "Project ID not found"  
**Solution**: Verify `VITE_FIREBASE_PROJECT_ID` matches exactly with your Firebase project ID

### Issue: "Permission denied"
**Solution**: Update your Firestore security rules to allow the operations you need

### Issue: "Network request failed"
**Solution**: Check your internet connection and Firebase project status

### Issue: Changes to .env not taking effect
**Solution**: Restart your development server after changing environment variables

## Verification Checklist

- [ ] `.env` file created in project root
- [ ] All 6 Firebase environment variables set
- [ ] Firestore Database enabled in Firebase Console  
- [ ] Firestore security rules configured
- [ ] Development server restarted after adding environment variables
- [ ] Firebase connection test passes at `/firebase-editor-debug`

## Next Steps

Once your Firebase configuration is working:

1. Visit `/firebase-editor-debug` to test the Firebase editor
2. Try creating and editing content
3. Check the Firebase Console to see data being created
4. Review the comprehensive guide in `FIREBASE_EDITOR_GUIDE.md`