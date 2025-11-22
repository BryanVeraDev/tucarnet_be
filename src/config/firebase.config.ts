import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

export const initializeFirebase = () => {
  let serviceAccount: ServiceAccount;

  if (process.env.NODE_ENV === 'production') {
    // En producción: leer desde variable de entorno
    serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );
  } else {
    // En desarrollo: leer desde archivo local
    serviceAccount = require('../../../firebase-admin-key.json');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin;
};