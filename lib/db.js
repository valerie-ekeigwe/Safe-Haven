import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { db } from './firebase';

// ============ POSTS ============

export const createPost = async (postData) => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      comments: 0,
      helpful: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (filters = {}) => {
  try {
    const postsRef = collection(db, 'posts');
    let q = query(postsRef, orderBy('createdAt', 'desc'));
    
    if (filters.category) {
      q = query(postsRef, where('category', '==', filters.category), orderBy('createdAt', 'desc'));
    }
    
    if (filters.neighborhood) {
      q = query(postsRef, where('neighborhood', '==', filters.neighborhood), orderBy('createdAt', 'desc'));
    }
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      return {
        id: postSnap.id,
        ...postSnap.data(),
        createdAt: postSnap.data().createdAt?.toDate(),
        updatedAt: postSnap.data().updatedAt?.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

export const updatePost = async (postId, updates) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const incrementPostViews = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      await updateDoc(postRef, {
        views: (postSnap.data().views || 0) + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};

// ============ USERS ============

export const createUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ============ NEIGHBORHOODS ============

export const createNeighborhood = async (neighborhoodData) => {
  try {
    const neighborhoodsRef = collection(db, 'neighborhoods');
    const docRef = await addDoc(neighborhoodsRef, {
      ...neighborhoodData,
      createdAt: serverTimestamp(),
      memberCount: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating neighborhood:', error);
    throw error;
  }
};

export const getNeighborhoods = async () => {
  try {
    const neighborhoodsRef = collection(db, 'neighborhoods');
    const q = query(neighborhoodsRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting neighborhoods:', error);
    throw error;
  }
};

// ============ COMMENTS ============

export const addComment = async (postId, commentData) => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
    });
    
    // Increment comment count on post
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      await updateDoc(postRef, {
        comments: (postSnap.data().comments || 0) + 1,
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// ============ ALERTS ============

export const createAlert = async (alertData) => {
  try {
    const alertsRef = collection(db, 'alerts');
    const docRef = await addDoc(alertsRef, {
      ...alertData,
      createdAt: serverTimestamp(),
      resolved: false,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export const getActiveAlerts = async (neighborhood) => {
  try {
    const alertsRef = collection(db, 'alerts');
    const q = query(
      alertsRef,
      where('neighborhood', '==', neighborhood),
      where('resolved', '==', false),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting alerts:', error);
    throw error;
  }
};
