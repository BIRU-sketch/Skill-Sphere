import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { Certificate, Portfolio } from '@/types';

/**
 * Generate a unique verification code
 */
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Issue a certificate
 */
export async function issueCertificate(
  studentId: string,
  studentName: string,
  challengeId: string,
  challengeTitle: string,
  mentorId: string,
  mentorName: string,
  skills: string[],
  certificatePdfBlob: Blob
): Promise<string> {
  try {
    const verificationCode = generateVerificationCode();
    
    // Upload certificate PDF
    const certificateRef = ref(storage, `certificates/${verificationCode}.pdf`);
    await uploadBytes(certificateRef, certificatePdfBlob);
    const certificateUrl = await getDownloadURL(certificateRef);

    // Create certificate document
    const certificateData = {
      studentId,
      studentName,
      challengeId,
      challengeTitle,
      mentorId,
      mentorName,
      issueDate: Timestamp.now(),
      certificateUrl,
      verificationCode,
      skills,
    };

    const docRef = await addDoc(collection(db, 'certificates'), certificateData);
    
    // Update student's portfolio
    await updatePortfolioWithCertificate(studentId, {
      challengeId,
      challengeTitle,
      category: '',
      completedAt: Timestamp.now(),
      certificateId: docRef.id,
    }, skills);

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to issue certificate');
  }
}

/**
 * Get certificate by ID
 */
export async function getCertificate(certificateId: string): Promise<Certificate | null> {
  try {
    const certificateDoc = await getDoc(doc(db, 'certificates', certificateId));
    if (!certificateDoc.exists()) {
      return null;
    }
    return { id: certificateDoc.id, ...certificateDoc.data() } as Certificate;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get certificate');
  }
}

/**
 * Get certificates by student
 */
export async function getCertificatesByStudent(studentId: string): Promise<Certificate[]> {
  try {
    const q = query(
      collection(db, 'certificates'),
      where('studentId', '==', studentId),
      orderBy('issueDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Certificate[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get certificates');
  }
}

/**
 * Verify certificate by code
 */
export async function verifyCertificate(verificationCode: string): Promise<Certificate | null> {
  try {
    const q = query(
      collection(db, 'certificates'),
      where('verificationCode', '==', verificationCode)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Certificate;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to verify certificate');
  }
}

/**
 * Update student portfolio with new certificate
 */
async function updatePortfolioWithCertificate(
  studentId: string,
  completedChallenge: any,
  skills: string[]
): Promise<void> {
  try {
    const portfolioRef = doc(db, 'portfolios', studentId);
    const portfolioDoc = await getDoc(portfolioRef);

    if (portfolioDoc.exists()) {
      const portfolio = portfolioDoc.data() as Portfolio;
      const updatedChallenges = [...portfolio.completedChallenges, completedChallenge];
      const updatedSkills = Array.from(new Set([...portfolio.skills, ...skills]));

      await setDoc(portfolioRef, {
        ...portfolio,
        completedChallenges: updatedChallenges,
        skills: updatedSkills,
        certificateCount: portfolio.certificateCount + 1,
        totalPoints: portfolio.totalPoints + 100, // Award points
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new portfolio if doesn't exist
      const userDoc = await getDoc(doc(db, 'users', studentId));
      const userData = userDoc.data();

      await setDoc(portfolioRef, {
        id: studentId,
        studentId,
        studentName: userData?.displayName || '',
        bio: userData?.bio || '',
        email: userData?.email || '',
        photoURL: userData?.photoURL,
        skills,
        completedChallenges: [completedChallenge],
        certificateCount: 1,
        totalPoints: 100,
        profileUrl: `/portfolio/${studentId}`,
        isPublic: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update portfolio');
  }
}

