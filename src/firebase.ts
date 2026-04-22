import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Correct configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDxTi5jlnT6YyDTZi5m4HQIw8Rsw2RW3L8",
  authDomain: "tablia1-33645.firebaseapp.com",
  projectId: "tablia1-33645",
  storageBucket: "tablia1-33645.firebasestorage.app",
  messagingSenderId: "97431584399",
  appId: "1:97431584399:web:ca2dd99c63523b17367afa",
  measurementId: "G-CYGZNVMK43"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Using Long Polling to bypass potential WebSocket blocks on specific networks (like some Egypt ISPs/Wi-Fi)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

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
