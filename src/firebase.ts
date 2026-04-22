import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD6HIikH2V1zNbpQUGG6YvKA2DKTE8apiA",
  authDomain: "tablia-c0129.firebaseapp.com",
  projectId: "tablia-c0129",
  storageBucket: "tablia-c0129.firebasestorage.app",
  messagingSenderId: "924497528390",
  appId: "1:924497528390:web:758580a8feda73617fec47",
  measurementId: "G-KZC2HQ2P8V"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// @ts-ignore - experimentalForceLongPolling might not be in all TS definitions but it works to fix WebSocket blocking on 4G
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
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
  if (!app || !db) {
    console.warn('Firebase is disconnected. No configuration found.');
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection successful');
    connectionStatus = 'connected';
    onStatusChange?.('connected');
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore backend') || error.message.includes('Missing or insufficient permissions'))) {
      console.error(`🔥 FIRESTORE NOT ENABLED: Please go to the Firebase Console (https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore), click 'Create database', and start in Test Mode.`);
      connectionStatus = 'error';
      onStatusChange?.('error');
    } else {
      console.error("Firestore connection test failed:", error);
      // We don't set error here unless it's a definitive "not enabled" or "no permission" on the test doc
    }
  }
}

testConnection();
