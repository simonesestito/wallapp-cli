import * as admin from "firebase-admin";
const serviceAccount = require("./secret/firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wallapp-b7805.firebaseio.com",
  storageBucket: "wallapp-b7805.appspot.com"
});

const storage = admin.storage();
const firestore = admin.firestore();
firestore.settings( { timestampsInSnapshots: true })

export { storage, firestore };
