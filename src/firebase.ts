import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK using the config from the dedicated file
const app = initializeApp(firebaseConfig);

// Crucial: Passing the firestoreDatabaseId from the config to initialize the correct database instance
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');

export const rtdb = getDatabase(app);
export const auth = getAuth(app);

// Explicitly set persistence to local
setPersistence(auth, browserLocalPersistence)
  .catch((error) => console.error("Error setting persistence:", error));

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export type ConnectionStatus = 'loading' | 'connected' | 'error' | 'disconnected';
let connectionStatus: ConnectionStatus = 'connected'; // Assume connected by default
let onStatusChange: ((status: ConnectionStatus) => void) | null = null;

export const getConnectionStatus = () => connectionStatus;
export const subscribeToConnectionStatus = (cb: (status: ConnectionStatus) => void) => {
  onStatusChange = cb;
  cb(connectionStatus);
  return () => { onStatusChange = null; };
};

// Removed aggressive getDocFromServer polling that causes 10-second timeout errors 
// on environments with slow websocket handshakes.
