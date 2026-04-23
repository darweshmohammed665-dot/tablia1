import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK using the config from the dedicated file
const app = initializeApp(firebaseConfig);

// Using Long Polling to bypass potential WebSocket blocks on specific networks
// Crucial: Passing the firestoreDatabaseId from the config to initialize the correct database instance
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, (firebaseConfig as any).firestoreDatabaseId || '(default)');

export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export type ConnectionStatus = 'loading' | 'connected' | 'error' | 'disconnected';
let connectionStatus: ConnectionStatus = 'loading';
let onStatusChange: ((status: ConnectionStatus) => void) | null = null;

export const getConnectionStatus = () => connectionStatus;
export const subscribeToConnectionStatus = (cb: (status: ConnectionStatus) => void) => {
  onStatusChange = cb;
  cb(connectionStatus);
  return () => { onStatusChange = null; };
};

async function testConnection() {
  if (!app || !db) return;
  try {
    // Attempt to fetch from server to verify connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    connectionStatus = 'connected';
    onStatusChange?.('connected');
  } catch (error: any) {
    console.warn("Connection check:", error.message);
    // If it's a permission error, it at least reached the server
    if (error.code === 'permission-denied') {
      connectionStatus = 'connected';
      onStatusChange?.('connected');
    } else {
      connectionStatus = 'error';
      onStatusChange?.('error');
    }
  }
}

testConnection();
