import { randUser } from '@ngneat/falso';
import { arrayWithUpdateData } from '../../DATA_TO_UPDATE_WITH';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { FireBasePost } from '../../@types/types';
import Post from '../../components/Post';
import {
  DocumentData,
  FieldPath,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  documentId,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
// import { fetchUser } from '../../redux/actions';
import { clientsRef, db, postsRef, usersRef } from '~/firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
  Button,
  Chip,
  List,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  sortLabels,
  sortLabelsObj,
  springConfig,
} from '../../constants/constants';
import RippleButton from '~/components/RippleButton';
import { Stack } from 'expo-router';
import { faker } from '@faker-js/faker';
import { get, set } from 'firebase/database';
import { OLD_DATA } from '../../OLD_DATA';

const Feed = () => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height / 1.5);

  const [postsSavedByUser, setPostsSavedByUser] = useState<string[]>();
  const [posts, setPosts] = useState<FireBasePost[]>();
  const [initialDbData, setInitialDbData] = useState<FireBasePost[]>();
  const [refreshing, setRefreshing] = useState(false);
  // TODO These set the height of the modal but I need some  way to grab the dynamic height of it based on what data is being shown
  const snapPoints = useMemo(() => ['75%'], []);
  const [dataIsCurrentlySortedBy, setdataIsCurrentlySortedBy] = useState<{
    property: string | boolean | number;
    orderByDirection: 'asc' | 'desc';
  } | null>();
  const [selectedFilters, setSelectedFilters] = useState<string[] | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // let bottomSheetModalRef: any;

  const [pressed, setPressed] = useState<boolean | null>(null);
  const [finalData, setFinalData] = useState<unknown[] | null>(null);
  const currentUser = getAuth().currentUser;
  const currentUserID = getAuth().currentUser?.uid;
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<string[] | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);
  const sheetStyle = useAnimatedStyle(() => {
    return { top: withSpring(top.value, springConfig) };
  });
  const [sortCriteria, setSortCriteria] = useState<
    { label: string; value: string }[]
  >(
    sortLabels.map(text => ({
      label: text,
      value: text,
    }))
  );
  const [sortingBy, setSortingBy] = useState<
    string | number | Timestamp | null
  >(null);
  const [errors, setErrors] = useState<unknown>();
  const [refreshingData, setRefreshingData] = useState(false);

  /**
   *  ALL DATA CALLS
   */
  // TODO There's a better way to write this so the output gets stored in a var
  const fetchPostsData = async () => {
    let postData: (FireBasePost | DocumentData)[] = [];
    let userData: { [key: string]: any }[] = [];

    try {
      // GET POSTS
      const recentPosts = query(postsRef, orderBy('createdAt', 'desc'));
      const postSnap = await getDocs(recentPosts);
      postSnap.forEach(post => {
        postData.push({ ...post.data(), docId: post.id }); // Push the modified object into the list array
        console.log(
          `{...post.data(), docId: post.id}: ${JSON.stringify(
            { ...post.data(), docId: post.id },
            null,
            2
          )}`
        );
      });

      // Construction
      const postsNewRef = query(postsRef);
      const userRef = query(usersRef);
      const postsSnapshot = await getDocs(postsNewRef);
      const dataSet: (FireBasePost | DocumentData)[] = [];

      postsSnapshot.forEach(async postSnapshot => {
        const postedBySnapshot = await getDoc(
          doc(db, 'users', postSnapshot?.data().postedBy)
        );

        // console.log(
        //   `FULL RECORD IS: ${JSON.stringify(
        //     { ...postSnapshot.data(), ...postedBySnapshot.data() },
        //     null,
        //     2
        //   )}`
        // );

        const fullPostRecord = {
          ...postSnapshot.data(),
          ...postedBySnapshot.data(),
          docId: postSnapshot.id,
        };

        dataSet.push(fullPostRecord);
      });
      // res.json(dataSet);

      // Construction

      const users = query(usersRef);
      const usersSnap = await getDocs(users);
      usersSnap.forEach(user => {
        userData.push({ ...user.data(), userId: user.id });
      });

      postData.forEach(post => {
        if (userData.includes({ userId: '62JdkwCUwpXoDNMBZjXwN1F2eKzI' })) {
          console.log(`includes: ${post.userId}`);
        }

        const userIdToFind = post.postedByDisplayName;
        const doesUserExist = userData.some(
          user => user.userId === userIdToFind
        );

        if (doesUserExist) {
          const userRef = doc(db, 'users', post.postedByDisplayName);
          let result;
          getDoc(userRef).then(foo => {
            // console.log(`found user: ${JSON.stringify(foo.data())}`);
            result = foo.data();
          });

          if (post && result) {
            post = result;
          }
        }
      });

      if (userData.includes({ userId: '62JdkwCUwpXoDNMBZjXwN1F2eKzI' })) {
        console.log(`found something`);
      }

      // The keys of tempVar are the index of that POST and its DAta
      const tempVar = { ...postData, ...userData };
      console.log(`tempVar[0]: ${JSON.stringify(tempVar[0], null, 2)}`);

      setPosts(dataSet);
    } catch (error) {
      console.error(`Error getting document: \x1b[33m${error}`);
      console.log(`Coal mine canary!`);

      setErrors(error);
    }
  };

  const fetchUserData = async () => {
    if (!currentUserID) return;

    try {
      const docRef = doc(db, 'users', currentUserID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // For some reason, the savedPosts field comes back as an object, not the array it's stored as in the DB, and
        // I don't want to take the extra time to properly fix it right now.
        setPostsSavedByUser(docSnap.data().savedPosts);
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
    } catch (error) {
      console.error(`Error getting document: \x1b[33m${error}`);

      setErrors(error);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    fetchPostsData();

    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  }, []);

  const handleGesture = useAnimatedGestureHandler({
    onStart(_, context: any) {
      // context.startTop = top.value;
      context.y = top.value;
    },

    onActive(event, context: any) {
      top.value = context.startTop + event.translationY;
      top.value = context.y + event.translationY;
    },

    onEnd(event, context) {
      if (top.value > dimensions.height / 2 + 200) {
        top.value = dimensions.height;
      } else {
        top.value = dimensions.height / 2;
      }
    },
  });

  const sortByProperty = (
    property: string,
    data: FireBasePost[],
    orderByDirection: 'asc' | 'desc' = 'asc'
  ): (FireBasePost | { docId: string })[] | undefined => {
    if (!data) return;

    return [...data].sort((a, b) => {
      // const aValue = a[property];
      const aValue: unknown = a[a.indexOf(property)]; // parse through a for the element whose value is `property`
      const bValue = b[b.indexOf(property)];

      if (aValue && !bValue) {
        return orderByDirection === 'asc' ? 1 : -1;
      } else if (!aValue && bValue) {
        return orderByDirection === 'asc' ? -1 : 1;
      } else if (aValue && bValue) {
        if (aValue > bValue) {
          return orderByDirection === 'asc' ? 1 : -1;
        } else if (aValue < bValue) {
          return orderByDirection === 'asc' ? -1 : 1;
        }
      }

      return 0;
    });
  };

  const getDataSortedBy = (
    varName: string | null
  ): FireBasePost[] | undefined | void => {
    let result: (FireBasePost & DocumentData & string)[];

    switch (varName) {
      case 'createdAt':
        setdataIsCurrentlySortedBy({
          property: varName,
          orderByDirection:
            dataIsCurrentlySortedBy?.orderByDirection === 'asc'
              ? 'desc'
              : 'asc',
        });
        posts && setPosts(sortByProperty(varName, posts));
      case 'isSeasonal':
        posts && setPosts(sortByProperty(varName, posts));
        break;
      case 'displayName':
        posts && setPosts(sortByProperty(`auth.${varName}`, posts));
        break;
      case 'rating':
        setdataIsCurrentlySortedBy({
          property: varName,
          // sortAsc: !dataIsCurrentlySortedBy?.sortAsc,
          orderByDirection:
            dataIsCurrentlySortedBy?.orderByDirection === 'asc'
              ? 'desc'
              : 'asc',
        });

        posts &&
          setPosts(
            sortByProperty(
              varName,
              posts,
              dataIsCurrentlySortedBy?.orderByDirection!
            )
          );
        break;
      case null:
        console.log(`in null, resetting data....`);
        setdataIsCurrentlySortedBy(null);
        setPosts(initialDbData);
        break;

      default:
        console.error(`No data supplied to sort by! Exiting...`);
        return;
    }

    // setPosts(result);
  };

  const handlePresentModalPress = () => {
    bottomSheetModalRef?.current?.present();
  };

  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const handleFilterPress = (filterName: string) => {
    if (selectedFilters?.includes(filterName)) {
      const result = selectedFilters.filter(name => name !== filterName);
      console.warn(
        `result: ${JSON.stringify(
          selectedFilters.filter(name => name !== filterName),
          null,
          2
        )}`
      );

      return setSelectedFilters(
        selectedFilters.filter(name => name !== filterName)
      );
    } else if (!selectedFilters?.includes(filterName)) {
      return selectedFilters
        ? setSelectedFilters([...selectedFilters, filterName])
        : setSelectedFilters([filterName]);
    } else {
      // return setMyDbData(initialDbData);
    }

    // TODO: Might need some catches in here just for data type mismatches
    const result = posts?.filter(
      item => Object.keys(item).indexOf(filterName) !== -1
    );

    setPosts(result);
  };

  const handleReset = () => {
    getDataSortedBy(null);
    setSelectedFilters(null);
  };

  const filteredData = selectedFilters?.length
    ? posts?.filter((item: FireBasePost | any) =>
        selectedFilters?.every(filter => filter[item])
      )
    : posts;

  useEffect(() => {
    fetchPostsData();
    // fetchUserData();
  }, []);

  useEffect(() => {
    console.log(`posts: ${JSON.stringify(posts?.slice(0, 1), null, 2)}`);
  }, [posts]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {!errors ? (
        <>
          <BottomSheetModalProvider>
            <FlatList
              contentContainerStyle={{
                paddingVertical: 8,
                paddingHorizontal: 10,
              }}
              data={posts?.filter(
                (post: any) =>
                  !selectedFilters?.length ||
                  selectedFilters.every(filter => filter[post])
              )}
              ListFooterComponent={() =>
                !errors && posts && posts.length > 0 ? (
                  <>
                    <Button
                      mode='outlined'
                      onPress={handlePresentModalPress}
                      contentStyle={{ borderRadius: 50 }}
                    >
                      Sort Results
                    </Button>
                    <BottomSheetModal
                      backgroundStyle={{
                        backgroundColor: theme.colors.background,
                        // backgroundColor: 'red',
                      }}
                      handleIndicatorStyle={{
                        backgroundColor: theme.colors.text,
                      }}
                      index={0}
                      snapPoints={snapPoints}
                      ref={bottomSheetModalRef}
                      enablePanDownToClose={true}
                      onChange={handleSheetChanges}
                    >
                      <Text>Sort by</Text>
                      {sortLabelsObj
                        .filter(x => x.displayName !== null)
                        .map((label, index: number) => (
                          <List.Item
                            key={index}
                            style={{ width: '100%' }}
                            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
                            title={label.displayName}
                            left={props => (
                              <List.Icon
                                {...props}
                                icon={label.icon}
                                color={
                                  label?.varName ===
                                  dataIsCurrentlySortedBy?.property
                                    ? theme?.colors.primary
                                    : ''
                                }
                              />
                            )}
                            right={props => {
                              if (
                                label.varName ===
                                dataIsCurrentlySortedBy?.property
                              ) {
                                if (dataIsCurrentlySortedBy.orderByDirection) {
                                  return (
                                    <List.Icon
                                      {...props}
                                      icon={'sort-ascending'}
                                    />
                                  );
                                } else {
                                  return (
                                    <List.Icon
                                      {...props}
                                      icon={'sort-descending'}
                                    />
                                  );
                                }
                              }
                              return <List.Icon {...props} icon={''} />;
                            }}
                            onPress={() => getDataSortedBy(label.varName)}
                          />
                        ))}
                      <Text>Filter</Text>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        {sortLabelsObj
                          .filter(x => x.displayName !== null)
                          .map((label, index: number) => (
                            <Chip
                              key={index}
                              style={{ margin: 5 }}
                              onPress={() => handleFilterPress(label.varName)}
                              // icon='information'
                              // selected={selectedFilters?.includes(label.varName)}
                              mode={
                                selectedFilters?.includes(label.varName)
                                  ? 'flat'
                                  : 'outlined'
                              }
                              showSelectedOverlay={true}
                            >
                              {label.displayName}
                            </Chip>
                          ))}
                      </View>
                      <Button mode='outlined' onPress={handleReset}>
                        RESET
                      </Button>
                    </BottomSheetModal>
                  </>
                ) : null
              }
              refreshing={refreshing}
              onRefresh={handleRefresh}
              keyExtractor={(_, index) => index.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <Post
                  postData={item}
                  postsSavedByUser={postsSavedByUser ?? ['']} // TODO: Not a great bulletproof method, but hey it'll work for now.
                  // postedById={}
                />
              )}
            />
          </BottomSheetModalProvider>
        </>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <RippleButton
            style={{ padding: 50, borderRadius: 100 }}
            onPress={fetchPostsData}
          >
            Retry
          </RippleButton>
        </View>
      )}
    </>
  );
};

export default Feed;

const styles = StyleSheet.create({
  getStartedContainer: {
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  container: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // flex: 1,
    // padding: 8,
  },
  cardsContainer: {
    // marginHorizontal: 'auto',
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    //
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // width: '100%',
    // justifyContent: 'space-between',
    // flex: 1,
    // justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
    // flexDirection: 'row', // IT'S THIS ONE
    // flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  card: {
    width: 190,
    margin: 2,
  },
});
