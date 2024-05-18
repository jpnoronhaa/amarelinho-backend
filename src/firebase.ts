import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "gs://amarelinho-notify.appspot.com"
});

const bucket = admin.storage().bucket();
export default bucket;