import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

console.log('Initializing Firebase with config:', { ...firebaseConfig, apiKey: '***' });
const app = initializeApp(firebaseConfig);

// Using initializeFirestore with experimentalForceLongPolling: true
// This helps in environments where standard WebSockets might be blocked or unstable.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

async function testConnection() {
  try {
    console.log('Testing Firestore connection to database:', firebaseConfig.firestoreDatabaseId || '(default)');
    const testDoc = await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection test successful:', testDoc.exists());
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    if(error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore backend'))) {
      console.error("Please check your Firebase configuration or internet connection. If this persists, the database may still be provisioning.");
    }
  }
}
testConnection();
