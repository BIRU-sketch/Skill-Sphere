import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { Portfolio } from '@/types';

/**
 * Get portfolio by student ID
 */
export async function getPortfolio(studentId: string): Promise<Portfolio | null> {
  try {
    const portfolioDoc = await getDoc(doc(db, 'portfolios', studentId));
    if (!portfolioDoc.exists()) {
      return null;
    }
    return portfolioDoc.data() as Portfolio;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get portfolio');
  }
}

/**
 * Create or update portfolio
 */
export async function updatePortfolio(
  studentId: string,
  updates: Partial<Portfolio>
): Promise<void> {
  try {
    const portfolioRef = doc(db, 'portfolios', studentId);
    const portfolioDoc = await getDoc(portfolioRef);

    if (portfolioDoc.exists()) {
      await updateDoc(portfolioRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } else {
      await setDoc(portfolioRef, {
        id: studentId,
        studentId,
        completedChallenges: [],
        certificateCount: 0,
        totalPoints: 0,
        profileUrl: `/portfolio/${studentId}`,
        isPublic: true,
        ...updates,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update portfolio');
  }
}

/**
 * Toggle portfolio visibility
 */
export async function togglePortfolioVisibility(
  studentId: string,
  isPublic: boolean
): Promise<void> {
  try {
    const portfolioRef = doc(db, 'portfolios', studentId);
    await updateDoc(portfolioRef, {
      isPublic,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to toggle portfolio visibility');
  }
}

