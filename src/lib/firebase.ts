import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { InventoryItem, OwnerSettings, Seller } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with database ID specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test helper
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline. Falling back to cached data.');
    } else {
      console.log('Firebase connection tested:', error);
    }
    return false;
  }
}

// --- Firestore Sync & Data APIs ---

// 1. Sellers Collection Sync
export function subscribeSellers(
  onData: (sellers: Seller[]) => void,
  onError?: (err: any) => void
) {
  const path = 'sellers';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const sellers: Seller[] = [];
      snapshot.forEach((docSnap) => {
        sellers.push({ id: docSnap.id, ...docSnap.data() } as Seller);
      });
      onData(sellers);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export async function saveSellerDoc(seller: Seller) {
  const path = `sellers/${seller.id}`;
  try {
    await setDoc(doc(db, 'sellers', seller.id), seller, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSellerDoc(sellerId: string) {
  const path = `sellers/${sellerId}`;
  try {
    await deleteDoc(doc(db, 'sellers', sellerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 2. Inventory Collection Sync
export function subscribeInventory(
  onData: (items: InventoryItem[]) => void,
  onError?: (err: any) => void
) {
  const path = 'inventory';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as InventoryItem);
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export async function saveInventoryDoc(item: InventoryItem) {
  const path = `inventory/${item.id}`;
  try {
    await setDoc(doc(db, 'inventory', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteInventoryDoc(itemId: string) {
  const path = `inventory/${itemId}`;
  try {
    await deleteDoc(doc(db, 'inventory', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. Owner Settings Doc Sync
export function subscribeOwnerSettings(
  onData: (settings: OwnerSettings) => void,
  onError?: (err: any) => void
) {
  const path = 'owner_settings/config';
  return onSnapshot(
    doc(db, 'owner_settings', 'config'),
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as OwnerSettings);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

export async function saveOwnerSettingsDoc(settings: OwnerSettings) {
  const path = 'owner_settings/config';
  try {
    await setDoc(doc(db, 'owner_settings', 'config'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Helper to seed initial data to Firestore if collection is empty
export async function seedInitialFirebaseDataIfEmpty(
  initialInventory: InventoryItem[],
  initialSellers: Seller[],
  initialOwnerSettings: OwnerSettings
) {
  try {
    // Check sellers
    const sellersSnap = await getDocs(collection(db, 'sellers'));
    if (sellersSnap.empty) {
      console.log('Seeding initial sellers to Firestore...');
      for (const seller of initialSellers) {
        await setDoc(doc(db, 'sellers', seller.id), seller);
      }
    }

    // Check inventory
    const inventorySnap = await getDocs(collection(db, 'inventory'));
    if (inventorySnap.empty) {
      console.log('Seeding initial inventory to Firestore...');
      for (const item of initialInventory) {
        await setDoc(doc(db, 'inventory', item.id), item);
      }
    }

    // Check owner settings
    const ownerSnap = await getDocs(collection(db, 'owner_settings'));
    if (ownerSnap.empty) {
      console.log('Seeding initial owner settings to Firestore...');
      await setDoc(doc(db, 'owner_settings', 'config'), initialOwnerSettings);
    }
  } catch (err) {
    console.warn('Could not seed initial data to Firestore (may be offline or restricted):', err);
  }
}
