import admin from 'firebase-admin';
import fs from 'fs';
import { SECRET_FIREBASE_JSON } from '../constants';

// Type used in Inversify
export const FIRESTORE_TYPE = Symbol.for('firestore');

// Check if Firebase secret JSON file exists
const jsonExists = fs.existsSync(SECRET_FIREBASE_JSON);
if (!jsonExists) {
    console.error(`Firebase JSON file not found at ${SECRET_FIREBASE_JSON}`);
    process.exit(1);
}

const app = admin.initializeApp({
    credential: admin.credential.cert(SECRET_FIREBASE_JSON),
    databaseURL: "https://wallapp-b7805.firebaseio.com"
});

const firestore = app.firestore();
firestore.settings({
    timestampsInSnapshots: true
});

export { firestore };
