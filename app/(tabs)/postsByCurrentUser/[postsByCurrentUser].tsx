import LottieView from 'lottie-react-native';
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
import { db } from '~/firebaseConfig';
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

  return postsByUser ? (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        {postsByUser?.map((post, index) => (
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
    </>
  ) : (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('~/assets/images/126314-empty-box-by-partho.json')}
          autoPlay={true}
          style={{ marginBottom: 40, height: 350, width: 350 }}
          // speed={0.3}
          // colorFilters={[
          //   { keypath: 'bottom', color: 'rgb(158, 42, 155)' },
          //   { keypath: 'top', color: 'rgb(255, 170, 243)' },
          // ]}
        />
        <Text style={{ marginBottom: 15 }}>
          Looks like you haven't posted anything yet...
        </Text>
        <Text style={{ fontSize: 36 }} onPress={() => router.push('add')}>
          Start now?
        </Text>
      </View>
    </>
  );
};

export default UserPosts;

const styles = StyleSheet.create({
  container: { flex: 1 },
  textHeader: { fontSize: 42 },
});
