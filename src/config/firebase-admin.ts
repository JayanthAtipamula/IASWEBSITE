import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

let adminDb: any = null;

// Initialize Firebase Admin if not already initialized
try {
  if (!getApps().length) {
    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    console.log('Firebase Admin Config Check:', {
      hasProjectId: !!firebaseConfig.projectId,
      hasClientEmail: !!firebaseConfig.clientEmail,
      hasPrivateKey: !!firebaseConfig.privateKey
    });
    
    if (firebaseConfig.projectId && firebaseConfig.clientEmail && firebaseConfig.privateKey) {
      initializeApp({
        credential: cert(firebaseConfig),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      });
      
      adminDb = getFirestore();
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('Firebase Admin credentials missing - SSR will work with fallback data');
    }
  } else {
    adminDb = getFirestore();
  }
} catch (error) {
  console.error('Firebase Admin initialization failed:', error);
  adminDb = null;
}

export { adminDb };
