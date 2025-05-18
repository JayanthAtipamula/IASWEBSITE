import { db, auth, storage } from '../config/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';

/**
 * Tests the Firebase Firestore connection by attempting to fetch a single document
 * @returns Promise with connection status and details
 */
export const testFirestoreConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    // Try to get a single document from any collection
    const collections = ['courses', 'blogs', 'messages', 'quizzes'];
    
    // Try each collection until one works
    for (const collectionName of collections) {
      try {
        console.log(`Attempting to query ${collectionName} collection...`);
        const q = query(collection(db, collectionName), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          return {
            success: true,
            message: `Successfully connected to Firestore and retrieved data from ${collectionName} collection.`,
            details: {
              collectionName,
              documentCount: querySnapshot.size,
              sampleDocId: querySnapshot.docs[0].id
            }
          };
        }
      } catch (err) {
        console.log(`Error querying ${collectionName}: ${err}`);
        // Continue to the next collection
      }
    }
    
    // If we got here, we connected but found no documents
    return {
      success: true,
      message: 'Successfully connected to Firestore, but no documents found in any collection.',
      details: { collections }
    };
  } catch (error) {
    console.error('Error testing Firestore connection:', error);
    return {
      success: false,
      message: 'Failed to connect to Firestore.',
      details: error
    };
  }
};

/**
 * Tests the Firebase Storage connection by attempting to list files
 * @returns Promise with connection status and details
 */
export const testStorageConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    // Try to list files in storage root
    const storageRef = ref(storage);
    const result = await listAll(storageRef);
    
    return {
      success: true,
      message: 'Successfully connected to Firebase Storage.',
      details: {
        prefixes: result.prefixes.length,
        items: result.items.length
      }
    };
  } catch (error) {
    console.error('Error testing Storage connection:', error);
    return {
      success: false,
      message: 'Failed to connect to Firebase Storage.',
      details: error
    };
  }
};

/**
 * Tests the Firebase Auth connection
 * @returns Promise with connection status
 */
export const testAuthConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    // Just check if auth is initialized
    const currentUser = auth.currentUser;
    const isSignedIn = !!currentUser;
    
    return {
      success: true,
      message: 'Successfully connected to Firebase Authentication.',
      details: {
        isSignedIn,
        currentUser: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null
      }
    };
  } catch (error) {
    console.error('Error testing Auth connection:', error);
    return {
      success: false,
      message: 'Failed to connect to Firebase Authentication.',
      details: error
    };
  }
};

/**
 * Tests all Firebase connections (Firestore, Storage, Auth)
 * @returns Promise with connection status for all services
 */
export const testAllFirebaseConnections = async (): Promise<{
  firestore: { success: boolean; message: string; details?: any };
  storage: { success: boolean; message: string; details?: any };
  auth: { success: boolean; message: string; details?: any };
}> => {
  const firestoreResult = await testFirestoreConnection();
  const storageResult = await testStorageConnection();
  const authResult = await testAuthConnection();
  
  return {
    firestore: firestoreResult,
    storage: storageResult,
    auth: authResult
  };
};

/**
 * Logs Firebase configuration environment variables (without revealing actual values)
 * @returns Object indicating which environment variables are set
 */
export const checkFirebaseEnvVars = (): { [key: string]: boolean } => {
  // Check if environment variables are defined
  const envVars = {
    'VITE_FIREBASE_API_KEY': !!import.meta.env.VITE_FIREBASE_API_KEY,
    'VITE_FIREBASE_AUTH_DOMAIN': !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    'VITE_FIREBASE_PROJECT_ID': !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    'VITE_FIREBASE_STORAGE_BUCKET': !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    'VITE_FIREBASE_MESSAGING_SENDER_ID': !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    'VITE_FIREBASE_APP_ID': !!import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  console.log('Firebase environment variables check:');
  Object.entries(envVars).forEach(([key, isSet]) => {
    console.log(`${key}: ${isSet ? 'Set ✓' : 'Not set ✗'}`);
  });
  
  return envVars;
};
