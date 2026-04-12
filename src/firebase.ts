import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export type ConnectionStatus = 'loading' | 'connected' | 'error';
let connectionStatus: ConnectionStatus = 'loading';
let onStatusChange: ((status: ConnectionStatus) => void) | null = null;

export const getConnectionStatus = () => connectionStatus;
export const subscribeToConnectionStatus = (cb: (status: ConnectionStatus) => void) => {
  onStatusChange = cb;
  cb(connectionStatus);
  return () => { onStatusChange = null; };
};

async function testConnection() {
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
