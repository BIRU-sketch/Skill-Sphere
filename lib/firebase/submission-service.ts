import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { Submission, SubmissionFormData } from '@/types';

/**
 * Submit work for a challenge
 */
export async function submitWork(
  enrollmentId: string,
  challengeId: string,
  studentId: string,
  studentName: string,
  data: SubmissionFormData,
  files?: File[]
): Promise<string> {
  try {
    // Upload files if any
    const fileUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const fileRef = ref(storage, `submissions/${challengeId}/${studentId}/${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        fileUrls.push(url);
      }
    }

    const submissionData: any = {
      enrollmentId,
      challengeId,
      studentId,
      studentName,
      submissionUrl: data.submissionUrl,
      description: data.description,
      status: 'pending',
      submittedAt: Timestamp.now(),
    };

    // Only add fileUrls if there are any
    if (fileUrls.length > 0) {
      submissionData.fileUrls = fileUrls;
    }

    const docRef = await addDoc(collection(db, 'submissions'), submissionData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit work');
  }
}

/**
 * Get submission by ID
 */
export async function getSubmission(submissionId: string): Promise<Submission | null> {
  try {
    const submissionDoc = await getDoc(doc(db, 'submissions', submissionId));
    if (!submissionDoc.exists()) {
      return null;
    }
    return { id: submissionDoc.id, ...submissionDoc.data() } as Submission;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get submission');
  }
}

/**
 * Get submissions by challenge
 */
export async function getSubmissionsByChallenge(challengeId: string): Promise<Submission[]> {
  try {
    const q = query(
      collection(db, 'submissions'),
      where('challengeId', '==', challengeId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get submissions');
  }
}

/**
 * Get submissions by student
 */
export async function getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
  try {
    const q = query(
      collection(db, 'submissions'),
      where('studentId', '==', studentId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get student submissions');
  }
}

/**
 * Review submission (approve/reject)
 */
export async function reviewSubmission(
  submissionId: string,
  status: 'approved' | 'rejected' | 'needs-revision',
  feedback?: string
): Promise<void> {
  try {
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, {
      status,
      feedback,
      reviewedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to review submission');
  }
}

