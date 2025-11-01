import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Challenge, ChallengeFormData } from '@/types';

/**
 * Create a new challenge
 */
export async function createChallenge(
  data: ChallengeFormData,
  mentorId: string,
  mentorName: string
): Promise<string> {
  try {
    const challengeData: any = {
      ...data,
      mentorId,
      mentorName,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Only add deadline if it exists
    if (data.deadline) {
      challengeData.deadline = Timestamp.fromDate(data.deadline);
    }

    const docRef = await addDoc(collection(db, 'challenges'), challengeData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create challenge');
  }
}

/**
 * Get challenge by ID
 */
export async function getChallenge(challengeId: string): Promise<Challenge | null> {
  try {
    const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
    if (!challengeDoc.exists()) {
      return null;
    }
    return { id: challengeDoc.id, ...challengeDoc.data() } as Challenge;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get challenge');
  }
}

/**
 * Get all active challenges
 */
export async function getActiveChallenges(): Promise<Challenge[]> {
  try {
    console.log('Fetching active challenges from Firestore...');
    
    // Simplified query without orderBy to avoid composite index requirement
    // We'll sort on the client side instead
    const q = query(
      collection(db, 'challenges'),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Query snapshot size:', querySnapshot.size);
    console.log('Documents found:', querySnapshot.docs.length);
    
    if (querySnapshot.empty) {
      console.warn('No active challenges found in Firestore');
      return [];
    }
    
    const challenges = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Challenge data:', { id: doc.id, ...data });
      return {
        id: doc.id,
        ...data,
      } as Challenge;
    });
    
    console.log('Total challenges fetched:', challenges.length);
    
    // Sort by createdAt on the client side
    return challenges.sort((a, b) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime; // Descending order (newest first)
    });
  } catch (error: any) {
    console.error('Error in getActiveChallenges:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error(error.message || 'Failed to get challenges');
  }
}

/**
 * Get challenges by mentor
 */
export async function getChallengesByMentor(mentorId: string): Promise<Challenge[]> {
  try {
    // Simplified query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'challenges'),
      where('mentorId', '==', mentorId)
    );
    const querySnapshot = await getDocs(q);
    const challenges = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Challenge[];
    
    // Sort by createdAt on the client side
    return challenges.sort((a, b) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime; // Descending order (newest first)
    });
  } catch (error: any) {
    console.error('Error in getChallengesByMentor:', error);
    throw new Error(error.message || 'Failed to get mentor challenges');
  }
}

/**
 * Update challenge
 */
export async function updateChallenge(
  challengeId: string,
  updates: Partial<Challenge>
): Promise<void> {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    await updateDoc(challengeRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update challenge');
  }
}

/**
 * Delete challenge
 */
export async function deleteChallenge(challengeId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'challenges', challengeId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete challenge');
  }
}

/**
 * Get challenges by category
 */
export async function getChallengesByCategory(category: string): Promise<Challenge[]> {
  try {
    const q = query(
      collection(db, 'challenges'),
      where('category', '==', category),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Challenge[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get challenges by category');
  }
}

