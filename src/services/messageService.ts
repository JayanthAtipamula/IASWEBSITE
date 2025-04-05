import { 
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ContactMessage, ContactMessageFormData } from '../types/message';

const handleFirestoreError = (error: FirestoreError, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Get all messages
export const getMessages = async (): Promise<ContactMessage[]> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch messages');
    return [];
  }
};

// Create a new message
export const createMessage = async (data: ContactMessageFormData): Promise<string> => {
  try {
    const messagesRef = collection(db, 'messages');
    const now = Timestamp.now().toMillis();
    
    const message = {
      ...data,
      createdAt: now,
      isRead: false,
      contacted: false,
      adminComment: ''
    };
    
    const docRef = await addDoc(messagesRef, message);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'create message');
    return '';
  }
};

// Mark message as read
export const markMessageAsRead = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'mark message as read');
  }
};

// Update contacted status
export const updateContactedStatus = async (id: string, contacted: boolean): Promise<void> => {
  try {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { contacted });
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'update contacted status');
  }
};

// Update admin comment
export const updateAdminComment = async (id: string, adminComment: string): Promise<void> => {
  try {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { adminComment });
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'update admin comment');
  }
};

// Delete a message
export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'messages', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'delete message');
  }
}; 