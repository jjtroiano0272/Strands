import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '~/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { UserProfile } from '~/@types/types';

// CRUD options
export default function useFirebase(
  url: string,
  path: string,
  pathSegments?: string[],
  uid?: string
) {
  const [data, setData] = useState<DocumentData | DocumentData[]>();
  const [errors, setErrors] = useState<string[]>();

  const getUserProfile = async () => {
    try {
      const docRef = doc(db, 'users', uid as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setErrors([...(errors as string[]), `Error fetching user's data!`]);
      }
    } catch (error) {
      console.error(`error in getUserProfile`);
    }
  };

  const getPostsOfLoggedInUser = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        where('auth.uid', '==', FIREBASE_AUTH?.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        // This needs to be set to state
        console.log(doc.id, ' => ', doc.data());

        setData(prev =>
          prev?.map((obj: DocumentData) => ({ ...obj, id: doc.id }))
        );
      });
    } catch (error) {
      console.error(`Error in getPostsOfLoggedInUser`);
    }
  };

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
}

// const fetchUserData = async () => {
//   if (!uid) return;

// };
