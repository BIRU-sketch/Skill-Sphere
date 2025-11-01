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
    const challengeData = {
      ...data,
      mentorId,
      mentorName,
      status: 'active',
      deadline: data.deadline ? Timestamp.fromDate(data.deadline) : undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

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
    const q = query(
      collection(db, 'challenges'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Challenge[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get challenges');
  }
}

/**
 * Get challenges by mentor
 */
export async function getChallengesByMentor(mentorId: string): Promise<Challenge[]> {
  try {
    const q = query(
      collection(db, 'challenges'),
      where('mentorId', '==', mentorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Challenge[];
  } catch (error: any) {
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

