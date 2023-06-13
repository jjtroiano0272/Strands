import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { List, MD3LightTheme, Avatar, MD3DarkTheme } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

const UserPosts = () => {
  const theme = useTheme();
  const router = useRouter();
  const { postsByCurrentUser, uid } = useLocalSearchParams();

  const [postsByUser, setPostsByUser] =
    useState<(DocumentData | { docId?: string })[]>();

  const fetchPosts = async () => {
    if (!uid) return;

    const docRef = doc(db, 'posts', uid as string);
    const docSnap = await getDoc(docRef);
    const specificData = docSnap.data();
    console.log(`Data for ${uid}: ${JSON.stringify(specificData, null, 2)}`);

    const postsCollectionRef = collection(db, 'posts');

    const userPosts = query(
      postsCollectionRef,
      where('auth.uid', '==', postsByCurrentUser)
    );
    const querySnapshot = await getDocs(userPosts);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs;
      const posts: (DocumentData | { docId: string })[] = docSnapshot.map(
        doc => {
          return { ...doc.data(), docId: doc.id };
        }
      );

      setPostsByUser(posts);

      console.log(`postsByUser: ${JSON.stringify(postsByUser, null, 2)}`);
    } else {
      console.error('No matching post found.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {postsByUser &&
        postsByUser?.map((post, index) => (
          <List.Item
            key={index}
            style={{ width: '100%' }}
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            title={post?.clientName}
            titleStyle={{ fontWeight: '600' }}
            description={post?.formula?.description ?? '-'}
            left={props => {
              return (
                <Avatar.Image
                  {...props}
                  size={42}
                  source={{
                    uri:
                      post?.media?.image?.[0] ??
                      post?.media?.images?.[0] ??
                      `https://api.dicebear.com/6.x/notionists/png/seed=${post?.clientName}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
                  }}
                />
              );
            }}
            onPress={() =>
              router.push({
                pathname: `posts/${docId}`,
                params: {
                  docId: uid,
                },
              })
            }
          />
        ))}
    </ScrollView>
  );
};

export default UserPosts;

const styles = StyleSheet.create({
  container: { flex: 1 },
  textHeader: { fontSize: 42 },
});
