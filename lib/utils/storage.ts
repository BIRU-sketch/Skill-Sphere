import { getStorage } from 'firebase-admin/storage';
import { initializeApp, cert, App } from 'firebase-admin/app';

export type UploadArtifactInput = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

let adminApp: App;

/**
 * Initialize Firebase Admin if not already initialized
 */
function initFirebaseAdmin() {
  if (!adminApp) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required');
    }

    adminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    });
  }
  return adminApp;
}

/**
 * Upload artifact (PDF/PPT/ZIP) to Firebase Storage
 * Returns public URL of uploaded file
 */
export async function uploadArtifact(file: UploadArtifactInput): Promise<string> {
  try {
    initFirebaseAdmin();
    const bucket = getStorage(adminApp).bucket();
    const fileName = `submissions/${Date.now()}_${file.originalname}`;
    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      resumable: false,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    await fileRef.makePublic();
    return fileRef.publicUrl();
  } catch (error) {
    console.error('Storage upload error:', error);
    throw new Error('Failed to upload file to storage');
  }
}

