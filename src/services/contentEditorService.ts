import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
  FirestoreError,
  deleteField
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ContentData {
  id: string;
  content: string;
  title?: string;
  lastModified: number;
  author?: string;
  metadata?: Record<string, any>;
}

export interface ContentEditorOptions {
  collection: string;
  documentId: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  onError?: (error: Error) => void;
  onSaved?: (data: ContentData) => void;
  onLoaded?: (data: ContentData) => void;
}

class ContentEditorService {
  private autoSaveTimers: Map<string, NodeJS.Timeout> = new Map();
  private pendingChanges: Map<string, Partial<ContentData>> = new Map();
  private unsubscribeFunctions: Map<string, () => void> = new Map();

  /**
   * Load content from Firebase Firestore
   */
  async loadContent(options: ContentEditorOptions): Promise<ContentData | null> {
    const { collection: collectionName, documentId, onError, onLoaded } = options;
    
    try {
      console.log(`🔄 Loading content from Firebase - Collection: ${collectionName}, Document: ${documentId}`);
      
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const contentData: ContentData = {
          id: documentId,
          content: data.content || '',
          title: data.title || '',
          lastModified: data.lastModified || Date.now(),
          author: data.author || '',
          metadata: data.metadata || {}
        };
        
        console.log(`✅ Content loaded successfully:`, {
          id: contentData.id,
          contentLength: contentData.content.length,
          title: contentData.title,
          lastModified: new Date(contentData.lastModified).toISOString()
        });
        
        if (onLoaded) {
          onLoaded(contentData);
        }
        
        return contentData;
      } else {
        console.log(`ℹ️ Document does not exist, creating new content for ${documentId}`);
        
        // Create a new document with empty content
        const newContentData: ContentData = {
          id: documentId,
          content: '',
          title: '',
          lastModified: Date.now(),
          author: '',
          metadata: {}
        };
        
        await this.saveContent(newContentData, options);
        
        if (onLoaded) {
          onLoaded(newContentData);
        }
        
        return newContentData;
      }
    } catch (error) {
      console.error(`❌ Error loading content from Firebase:`, error);
      
      const errorMessage = error instanceof FirestoreError 
        ? `Firebase Error (${error.code}): ${error.message}`
        : `Unknown error: ${error}`;
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      return null;
    }
  }

  /**
   * Save content to Firebase Firestore
   */
  async saveContent(data: Partial<ContentData>, options: ContentEditorOptions): Promise<boolean> {
    const { collection: collectionName, documentId, onError, onSaved } = options;
    
    try {
      console.log(`💾 Saving content to Firebase - Collection: ${collectionName}, Document: ${documentId}`, {
        contentLength: data.content?.length || 0,
        title: data.title || 'No title'
      });
      
      const docRef = doc(db, collectionName, documentId);
      
      // Prepare data for saving
      const saveData: any = {
        ...data,
        lastModified: Date.now(),
        updatedAt: Timestamp.now().toMillis()
      };
      
      // Remove undefined values
      Object.keys(saveData).forEach(key => {
        if (saveData[key] === undefined) {
          delete saveData[key];
        }
      });
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update existing document
        await updateDoc(docRef, saveData);
        console.log(`✅ Content updated successfully for document ${documentId}`);
      } else {
        // Create new document
        const createData = {
          ...saveData,
          createdAt: Timestamp.now().toMillis(),
          id: documentId
        };
        
        await setDoc(docRef, createData);
        console.log(`✅ New content document created successfully: ${documentId}`);
      }
      
      // Clear pending changes for this document
      this.pendingChanges.delete(`${collectionName}:${documentId}`);
      
      const savedData: ContentData = {
        id: documentId,
        content: data.content || '',
        title: data.title || '',
        lastModified: Date.now(),
        author: data.author || '',
        metadata: data.metadata || {}
      };
      
      if (onSaved) {
        onSaved(savedData);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Error saving content to Firebase:`, error);
      
      const errorMessage = error instanceof FirestoreError 
        ? `Firebase Save Error (${error.code}): ${error.message}`
        : `Unknown save error: ${error}`;
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      return false;
    }
  }

  /**
   * Enable auto-save functionality
   */
  enableAutoSave(data: Partial<ContentData>, options: ContentEditorOptions): void {
    const { collection: collectionName, documentId, autoSaveInterval = 5000 } = options;
    const key = `${collectionName}:${documentId}`;
    
    // Clear existing timer
    this.clearAutoSave(options);
    
    console.log(`🔄 Enabling auto-save for ${key} (interval: ${autoSaveInterval}ms)`);
    
    // Store pending changes
    this.pendingChanges.set(key, { ...this.pendingChanges.get(key), ...data });
    
    // Set new timer
    const timer = setTimeout(async () => {
      const pendingData = this.pendingChanges.get(key);
      if (pendingData) {
        console.log(`💾 Auto-saving content for ${key}`);
        await this.saveContent(pendingData, options);
      }
    }, autoSaveInterval);
    
    this.autoSaveTimers.set(key, timer);
  }

  /**
   * Clear auto-save timer
   */
  clearAutoSave(options: ContentEditorOptions): void {
    const { collection: collectionName, documentId } = options;
    const key = `${collectionName}:${documentId}`;
    
    const timer = this.autoSaveTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.autoSaveTimers.delete(key);
      console.log(`🛑 Auto-save cleared for ${key}`);
    }
  }

  /**
   * Set up real-time listener for content changes
   */
  setupRealtimeSync(options: ContentEditorOptions, onUpdate: (data: ContentData) => void): () => void {
    const { collection: collectionName, documentId } = options;
    const key = `${collectionName}:${documentId}`;
    
    console.log(`🔗 Setting up real-time sync for ${key}`);
    
    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const contentData: ContentData = {
            id: documentId,
            content: data.content || '',
            title: data.title || '',
            lastModified: data.lastModified || Date.now(),
            author: data.author || '',
            metadata: data.metadata || {}
          };
          
          console.log(`🔄 Real-time update received for ${key}`);
          onUpdate(contentData);
        }
      },
      (error) => {
        console.error(`❌ Real-time sync error for ${key}:`, error);
        if (options.onError) {
          options.onError(new Error(`Real-time sync error: ${error.message}`));
        }
      }
    );
    
    // Store unsubscribe function
    this.unsubscribeFunctions.set(key, unsubscribe);
    
    return unsubscribe;
  }

  /**
   * Cleanup real-time sync
   */
  cleanupRealtimeSync(options: ContentEditorOptions): void {
    const { collection: collectionName, documentId } = options;
    const key = `${collectionName}:${documentId}`;
    
    const unsubscribe = this.unsubscribeFunctions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribeFunctions.delete(key);
      console.log(`🛑 Real-time sync cleaned up for ${key}`);
    }
  }

  /**
   * Force save any pending changes
   */
  async forceSavePendingChanges(): Promise<void> {
    console.log(`💾 Force saving ${this.pendingChanges.size} pending changes`);
    
    const savePromises: Promise<boolean>[] = [];
    
    for (const [key, data] of this.pendingChanges.entries()) {
      const [collectionName, documentId] = key.split(':');
      const options: ContentEditorOptions = {
        collection: collectionName,
        documentId: documentId
      };
      
      savePromises.push(this.saveContent(data, options));
    }
    
    await Promise.all(savePromises);
  }

  /**
   * Cleanup all timers and subscriptions
   */
  cleanup(): void {
    console.log(`🧹 Cleaning up ContentEditorService`);
    
    // Clear all auto-save timers
    for (const timer of this.autoSaveTimers.values()) {
      clearTimeout(timer);
    }
    this.autoSaveTimers.clear();
    
    // Unsubscribe from all real-time listeners
    for (const unsubscribe of this.unsubscribeFunctions.values()) {
      unsubscribe();
    }
    this.unsubscribeFunctions.clear();
    
    // Clear pending changes
    this.pendingChanges.clear();
  }

  /**
   * Test Firebase connection
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log(`🔍 Testing Firebase connection...`);
      
      // Try to read from a test collection
      const testDocRef = doc(db, 'connection-test', 'test-doc');
      const testData = {
        testMessage: 'Connection test',
        timestamp: Timestamp.now().toMillis()
      };
      
      // Try to write
      await setDoc(testDocRef, testData);
      
      // Try to read back
      const docSnap = await getDoc(testDocRef);
      
      if (docSnap.exists()) {
        console.log(`✅ Firebase connection test successful`);
        return {
          success: true,
          message: 'Firebase connection is working correctly',
          details: {
            canWrite: true,
            canRead: true,
            testTimestamp: testData.timestamp
          }
        };
      } else {
        return {
          success: false,
          message: 'Failed to read back test data',
          details: { canWrite: true, canRead: false }
        };
      }
    } catch (error) {
      console.error(`❌ Firebase connection test failed:`, error);
      return {
        success: false,
        message: `Firebase connection test failed: ${error}`,
        details: { error }
      };
    }
  }
}

// Create singleton instance
export const contentEditorService = new ContentEditorService();

// Export types and service
export default contentEditorService;