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
import { db } from './config';
import { Enrollment } from '@/types';

/**
 * Enroll student in a challenge with application
 */
export async function enrollInChallenge(
  challengeId: string,
  challengeTitle: string,
  studentId: string,
  studentName: string,
  studentEmail: string,
  applicationData: {
    applicationEssay: string;
    whyJoin: string;
    experience: string;
  }
): Promise<string> {
  try {
    // Check if already enrolled
    const existing = await getEnrollmentByStudentAndChallenge(studentId, challengeId);
    if (existing) {
      throw new Error('Already enrolled in this challenge');
    }

    const enrollmentData = {
      challengeId,
      challengeTitle,
      studentId,
      studentName,
      studentEmail,
      status: 'enrolled',
      applicationEssay: applicationData.applicationEssay,
      whyJoin: applicationData.whyJoin,
      experience: applicationData.experience,
      enrolledAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'enrollments'), enrollmentData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to enroll in challenge');
  }
}

/**
 * Get enrollment by ID
 */
export async function getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
  try {
    const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentId));
    if (!enrollmentDoc.exists()) {
      return null;
    }
    return { id: enrollmentDoc.id, ...enrollmentDoc.data() } as Enrollment;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get enrollment');
  }
}

/**
 * Get enrollments by student
 */
export async function getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
  try {
    console.log('Fetching enrollments for student:', studentId);
    
    // Simplified query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Student enrollments found:', querySnapshot.docs.length);
    
    if (querySnapshot.empty) {
      console.warn('No enrollments found for this student');
      return [];
    }
    
    const enrollments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Enrollment[];
    
    // Sort by enrolledAt on the client side
    enrollments.sort((a, b) => {
      const aTime = a.enrolledAt?.toMillis() || 0;
      const bTime = b.enrolledAt?.toMillis() || 0;
      return bTime - aTime; // Descending order (newest first)
    });
    
    console.log('Total student enrollments returned:', enrollments.length);
    return enrollments;
  } catch (error: any) {
    console.error('Error in getEnrollmentsByStudent:', error);
    throw new Error(error.message || 'Failed to get student enrollments');
  }
}

/**
 * Get enrollments by challenge
 */
export async function getEnrollmentsByChallenge(challengeId: string): Promise<Enrollment[]> {
  try {
    console.log('Fetching enrollments for challenge:', challengeId);
    
    // Simplified query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'enrollments'),
      where('challengeId', '==', challengeId)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Enrollments query snapshot size:', querySnapshot.size);
    console.log('Enrollments found:', querySnapshot.docs.length);
    
    if (querySnapshot.empty) {
      console.warn('No enrollments found for this challenge');
      return [];
    }
    
    const enrollments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Enrollment data:', { id: doc.id, ...data });
      return {
        id: doc.id,
        ...data,
      } as Enrollment;
    });
    
    // Sort by enrolledAt on the client side
    enrollments.sort((a, b) => {
      const aTime = a.enrolledAt?.toMillis() || 0;
      const bTime = b.enrolledAt?.toMillis() || 0;
      return bTime - aTime; // Descending order (newest first)
    });
    
    console.log('Total enrollments returned:', enrollments.length);
    return enrollments;
  } catch (error: any) {
    console.error('Error in getEnrollmentsByChallenge:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      challengeId: challengeId
    });
    throw new Error(error.message || 'Failed to get challenge enrollments');
  }
}

/**
 * Get enrollment by student and challenge
 */
export async function getEnrollmentByStudentAndChallenge(
  studentId: string,
  challengeId: string
): Promise<Enrollment | null> {
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId),
      where('challengeId', '==', challengeId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Enrollment;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get enrollment');
  }
}

/**
 * Update enrollment status
 */
export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: Enrollment['status']
): Promise<void> {
  try {
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    const updates: any = { status };

    if (status === 'submitted') {
      updates.submittedAt = Timestamp.now();
    } else if (status === 'approved' || status === 'rejected') {
      updates.reviewedAt = Timestamp.now();
    }

    await updateDoc(enrollmentRef, updates);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update enrollment status');
  }
}

