import * as Haptics from 'expo-haptics';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { db } from '~/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Avatar } from 'react-native-paper';
import StarRating from '~/components/StarRating';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const CommonClient = () => {
  const router = useRouter();
  const auth = getAuth();
  const { clientName, otherStylistsUid } = useLocalSearchParams();
  const [theirPosts, setTheirPosts] = useState<DocumentData[]>();
  const [yourPosts, setYourPosts] = useState<DocumentData[]>();

  const theme = useTheme();

  const fetchUserData = async () => {
    if (!otherStylistsUid) return;

    const postsCollectionRef = collection(db, 'posts');
    const queryPosts = query(
      postsCollectionRef,
      where('auth.uid', '==', otherStylistsUid)
    );
    const loggedInUserPostsQueryRef = query(
      postsCollectionRef,
      where('auth.uid', '==', auth?.currentUser?.uid)
    );
    const querySnapshot = await getDocs(queryPosts);
    const querySnapshotForLoggedInUser = await getDocs(
      loggedInUserPostsQueryRef
    );

    if (!querySnapshot.empty && !querySnapshotForLoggedInUser.empty) {
      // Retrieve the first matching document
      const docSnapshot = querySnapshot.docs[0];
      const postsByUserYouAreViewing = [docSnapshot.data()];
      const postsByLoggedInUser = querySnapshotForLoggedInUser.docs.map(doc =>
        doc.data()
      );

      // set state
      setTheirPosts(postsByUserYouAreViewing);
      setYourPosts(postsByLoggedInUser);
    } else {
      console.log('No matching post found.');
    }
  };

  useEffect(() => {
    fetchUserData();

    console.log(`\x1b[33mTHEIRS: ${JSON.stringify(theirPosts, null, 2)}`);
    console.log(`\x1b[33mYOURS: ${JSON.stringify(yourPosts, null, 2)}`);

    console.log(clientName);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 24 }}>{clientName}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Avatar.Image
            size={64}
            source={{ uri: yourPosts && yourPosts[0].auth.profileImage }}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Avatar.Image
            size={64}
            source={{ uri: theirPosts && theirPosts[0].auth.profileImage }}
          />
        </View>
      </View>

      <Text style={styles.textSubheading}>Rating</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.columnContent}>
          {yourPosts && yourPosts[0].rating ? (
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5].map((item, index) => (
                <MaterialCommunityIcons
                  key={index}
                  name={item <= yourPosts[0].rating! ? 'star' : 'star-outline'}
                  size={16}
                  color='#FF9529'
                />
              ))}
            </View>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
        <View style={styles.columnContent}>
          {theirPosts && theirPosts[0].rating ? (
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5].map((item, index) => (
                <MaterialCommunityIcons
                  key={index}
                  name={item <= theirPosts[0].rating! ? 'star' : 'star-outline'}
                  size={16}
                  color='#FF9529'
                />
              ))}
            </View>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
      </View>

      <Text style={styles.textSubheading}>Description</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.columnContent}>
          {yourPosts && yourPosts[0].formula?.description ? (
            <Text>{yourPosts[0].formula?.description}</Text>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
        <View style={styles.columnContent}>
          <Text>{theirPosts && theirPosts[0].formula?.description}</Text>
        </View>
      </View>

      <Text style={styles.textSubheading}>Type</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.columnContent}>
          {yourPosts && yourPosts[0].formula?.type ? (
            <Text>{yourPosts[0].formula?.type}</Text>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
        <View style={styles.columnContent}>
          {theirPosts && theirPosts[0].formula?.type ? (
            <Text>{theirPosts[0].formula?.type}</Text>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
      </View>

      <Text style={styles.textSubheading}>Images</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.columnContent}>
          {yourPosts?.[0]?.media?.image ? (
            // <Swiper
            //   containerStyle={styles.swiper}
            //   dot={
            //     <View
            //       style={[
            //         styles.dotStyle,
            //         { borderColor: theme.colors.background },
            //       ]}
            //     />
            //   }
            //   activeDot={
            //     <View
            //       style={[
            //         styles.activeDotStyle,
            //         {
            //           borderColor: theme.colors.background,
            //           // backgroundColor: 'transparent',
            //         },
            //       ]}
            //     />
            //   }
            //   onIndexChanged={(index: number) =>
            //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            //   }
            // >
            //   {yourPosts[0].media.image.map((imgUri: string) => (
            //     <Image
            //       style={{ flex: 1 }}
            //       key={imgUri}
            //       source={{
            //         uri: imgUri,
            //       }}
            //     />
            //   ))}
            // </Swiper>

            <Image
              source={{ uri: theirPosts?.[0]?.media?.image?.[0] }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>

        <View style={styles.columnContent}>
          {theirPosts?.[0]?.media?.image ? (
            // <Swiper
            //   containerStyle={styles.swiper}
            //   dot={
            //     <View
            //       style={[
            //         styles.dotStyle,
            //         { borderColor: theme.colors.background },
            //       ]}
            //     />
            //   }
            //   activeDot={
            //     <View
            //       style={[
            //         styles.activeDotStyle,
            //         {
            //           borderColor: theme.colors.background,
            //           // backgroundColor: 'transparent',
            //         },
            //       ]}
            //     />
            //   }
            //   onIndexChanged={(index: number) =>
            //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            //   }
            // >
            //   {theirPosts?.[0].media?.image?.map((imgUri: string) => (
            //     <Image
            //       style={{ flex: 1 }}
            //       key={imgUri}
            //       source={{
            //         uri: imgUri,
            //       }}
            //     />
            //   ))}
            // </Swiper>
            <Image
              source={{ uri: theirPosts?.[0]?.media?.image?.[0] }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
      </View>

      <Text style={styles.textSubheading}>Salon</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.columnContent}>
          {yourPosts && yourPosts[0].salon ? (
            <Text>{yourPosts[0].salon}</Text>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
        <View style={styles.columnContent}>
          {theirPosts && theirPosts[0].salon ? (
            <Text>{theirPosts[0].salon}</Text>
          ) : (
            <Text style={styles.nullText}>-</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default CommonClient;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  textHeader: { fontSize: 42 },
  textSubheading: { fontSize: 16, fontWeight: 'bold', marginVertical: 20 },
  activeDotStyle: {
    margin: 7,
    justifyContent: 'space-between',
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 5,
  },
  dotStyle: {
    margin: 7,
    justifyContent: 'space-between',
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  swiper: { flex: 1, aspectRatio: 1, borderRadius: 30 },
  columnContent: { flex: 0.5, justifyContent: 'center', alignItems: 'center' },
  nullText: { fontSize: 16 },
});
