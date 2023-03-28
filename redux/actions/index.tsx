// import { initializeApp } from 'firebase/app';
// import { USER_STATE_CHANGE } from '../constants';
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   Firestore,
// } from 'firebase/firestore/lite';
// import { useReducer } from 'react';
// import { firebaseConfig } from '../../firebaseConfig';
// // Follow this pattern to import other Firebase services
// // import { } from 'firebase/<service>';import { Auth, getAuth } from 'firebase/auth';

// export function fetchUser() {
//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   // Get a list of cities from your database
//   async function getCities(db: Firestore) {
//     const usersCol = collection(db, 'users');
//     console.log(`anything here?: ${collection(db, 'users')}`);
//     const userSnapshot = await getDocs(usersCol);

//     if (userSnapshot) {
//       dispatch({
//         type: USER_STATE_CHANGE,
//         currentUser: userSnapshot.docs,
//       });
//     } else {
//       console.error(`userSnapshot error! Doesn't exist!`);
//     }

//     const cityList = citySnapshot.docs.map(doc => doc.data());
//     return cityList;
//   }

//   // return getAuth().currentUser?.uid;
//   getFirestore();

//   disp;
// }
