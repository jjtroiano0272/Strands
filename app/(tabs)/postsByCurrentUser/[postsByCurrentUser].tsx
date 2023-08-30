import LottieView from 'lottie-react-native';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { FireBasePost } from '~/@types/types';
import { getElapsedTime } from '~/constants/constants';

const UserPosts = () => {
  const theme = useTheme();
  const router = useRouter();
  const { postsByCurrentUser, uid } = useLocalSearchParams();

  const [postsByUser, setPostsByUser] =
    useState<(FireBasePost | DocumentData | { docId?: string })[]>();

  const fetchPosts = async () => {
    if (!uid) return console.error(`no uid @ postsByCurrentUser:fetchPosts`);

    try {
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

      const posts = query(postsCollectionRef, where('postedBy', '==', uid));
      const postsSnapshot = await getDocs(posts);
      console.log(`posts by this MF`);
      let tempPosts: (DocumentData | FireBasePost)[] = [];
      postsSnapshot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
        tempPosts.push({ docId: doc.id, ...doc.data() });
      });
      setPostsByUser(tempPosts);

      // if (!querySnapshot.empty) {
      //   const docSnapshot = querySnapshot.docs;
      //   const posts: (DocumentData | { docId: string })[] = docSnapshot.map(
      //     doc => {
      //       return { ...doc.data(), docId: doc.id };
      //     }
      //   );

      //   setPostsByUser(posts);

      //   console.log(`postsByUser: ${JSON.stringify(postsByUser, null, 2)}`);
      // } else {
      //   console.error('No matching post found.');
      // }
    } catch (error) {
      console.error(`Async error in fetchPosts:59`);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log(`postsByUser: ${JSON.stringify(postsByUser, null, 2)}`);
  }, [postsByUser]);

  // return postsByUser ? (
  //   /*
  //   "clientID": "1oLsVwRHB1CsBjBamz0x", "comments": "Has an undercut or shaved section that needs to be maintained or reshaped", "createdAt": "2023-05-04T17:45:55.325Z", "formulaUsed": {"description": "30g Lightest Blonde + 10g Beige Blonde + 40g 30 Vol Developer", "type": "tramesi"}, "geolocation": {"lat": "26.6298", "lng": "-81.6476"}, "lastUpdatedAt": {"nanoseconds": 171000000, "seconds": 1686769310}, "media": {"images": ["https://loremflickr.com/300/300/hairStylist?lock=88611"]}, "postedBy": "E10SFsZ5WbQjveWqQokzrahfA8Oh", "rating": 1, "salonSeenAt": "tramesi"}
  //   */
  //   <>
  //     <Stack.Screen options={{ headerShown: false }} />
  //     <ScrollView contentContainerStyle={styles.container}>
  //       {postsByUser?.map((post, index) => (
  //         <List.Item
  //           key={index}
  //           style={{ width: '100%' }}
  //           theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
  //           title={post?.comments}
  //           titleStyle={{ fontWeight: '600' }}
  //           description={post?.formulaUsed?.description ?? '-'}
  //           left={props => {
  //             return (
  //               <Avatar.Image
  //                 {...props}
  //                 size={42}
  //                 source={{
  //                   uri:
  //                     post?.media?.images?.[0] ??
  //                     post?.media?.images?.[0] ??
  //                     `https://api.dicebear.com/6.x/notionists/png/seed=${post?.clientName}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
  //                 }}
  //               />
  //             );
  //           }}
  //           onPress={() =>
  //             router.push({
  //               pathname: `posts/${docId}`,
  //               params: {
  //                 docId: uid,
  //               },
  //             })
  //           }
  //         />
  //       ))}
  //     </ScrollView>
  //   </>
  // ) : (
  //   <>
  //     <Stack.Screen options={{ headerShown: false }} />
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <LottieView
  //         source={require('~/assets/images/126314-empty-box-by-partho.json')}
  //         autoPlay={true}
  //         style={{ marginBottom: 40, height: 350, width: 350 }}
  //         // speed={0.3}
  //         // colorFilters={[
  //         //   { keypath: 'bottom', color: 'rgb(158, 42, 155)' },
  //         //   { keypath: 'top', color: 'rgb(255, 170, 243)' },
  //         // ]}
  //       />
  //       <Text style={{ marginBottom: 15 }}>
  //         Looks like you haven't posted anything yet...
  //       </Text>
  //       <Text style={{ fontSize: 36 }} onPress={() => router.push('add')}>
  //         Start now?
  //       </Text>
  //     </View>
  //   </>
  // );

  const getFormattedDate = (date: Date | string) => {
    return new Date(date).toISOString().slice(0, 10).replace(/-/g, '-');
  };

  return (
    <FlatList
      data={postsByUser}
      renderItem={({ item }) => (
        <List.Item
          // key={index}
          style={{ width: '100%' }}
          theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
          // return new Date(item?.createdAt).getFullYear()
          title={item?.comments}
          titleStyle={{ fontWeight: '600' }}
          // description={item?.formula?.description ?? '-'}
          description={getFormattedDate(item?.createdAt)}
          left={props => {
            return (
              <Avatar.Image
                {...props}
                size={42}
                source={{
                  uri:
                    item?.media?.images?.[0] ??
                    `https://api.dicebear.com/6.x/notionists/png/seed=${item?.clientName}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
                }}
              />
            );
          }}
          onPress={() =>
            router.push({
              pathname: `posts/${item.docId}`,
              params: {
                docId: item.docId,
              },
            })
          }
        />
      )}
      // Makes no sense to have ListEmptyComponent since you can only access this page if the user HAS posts
    />
  );
};

export default UserPosts;

const styles = StyleSheet.create({
  container: { flex: 1 },
  textHeader: { fontSize: 42 },
});
