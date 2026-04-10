import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings optimized for sandboxed environments
const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
} as any, databaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

async function testConnection(retries = 5) {
  // Wait longer before testing to allow initialization and provisioning to settle
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Testing Firestore connection (Attempt ${i + 1}/${retries}) to database:`, databaseId);
      const testDoc = await getDocFromServer(doc(db, 'test', 'connection'));
      console.log('Firestore connection test successful:', testDoc.exists());
      return; // Success
    } catch (error) {
      console.error(`Firestore connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        console.log('Retrying in 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else {
        if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore backend'))) {
          console.error("Firestore is still unreachable after multiple attempts. This may be due to provisioning delays or network restrictions. The app will continue in offline mode.");
        }
      }
    }
  }
}

testConnection();
