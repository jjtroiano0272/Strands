import log from 'loglevel';
import { Skeleton } from 'moti/skeleton';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import { MotiView } from 'moti';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Image,
  Pressable,
} from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { FireBasePost } from '../../../@types/types';
import Post from '../../../components/Post';
import {
  DocumentData,
  FieldValue,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
// import { fetchUser } from '../../redux/actions';
import { PASS, USER, db, postsRef, usersRef } from '~/firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  Badge,
  Button,
  Chip,
  IconButton,
  List,
  MD3DarkTheme,
  MD3LightTheme,
  Snackbar,
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
} from '../../../constants/constants';
import RippleButton from '~/components/RippleButton';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '~/context/auth';
import { UserContext } from '~/context/UserContext';
import { useHaptics } from '~/hooks/useHaptics';
import { FirebaseError } from 'firebase/app';

const Feed = () => {
  const myAuth = useAuth();
  const firebaseAuth = getAuth();
  const userCtx = useContext(UserContext);

  const searchParams = useLocalSearchParams() as {
    snackbarMessage: string;
    seePostID?: string;
  };
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height / 1.5);
  const router = useRouter();
  const [dark, toggle] = useReducer(s => !s, true);
  // Per the tutorial
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

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
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedFilterFoo, setSelectedFilterFoo] = useState<string>('');
  const [sortByField, setSortByField] = useState<string>();
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
  const [errors, setErrors] = useState<FirebaseError | unknown>();
  const [refreshingData, setRefreshingData] = useState(false);

  const hapticFeedbackLight = useHaptics('light');

  /**
   *  ALL DATA CALLS
   */
  // TODO There's a better way to write this so the output gets stored in a var
  const fetchPostsData = async () => {
    try {
      let postData: (FireBasePost | DocumentData)[] = [];
      let userData: { [key: string]: any }[] = [];
      // const dataSet: (FireBasePost | DocumentData)[] = [];

      // GET POSTS
      // recentPostsSnap?.forEach(post => {
      //   postData.push({ ...post.data(), docId: post.id }); // Push the modified object into the list array
      // });
      const recentPostsQuery = query(postsRef, orderBy('createdAt', 'desc'));
      const recentPostsSnap = await getDocs(recentPostsQuery);
      postData = recentPostsSnap?.docs?.map(doc => {
        // console.log(`inside postData Loop`);

        // console.log(
        //   `createdAt: ${JSON.stringify(
        //     { ...doc.data().createdAt, docId: doc.id },
        //     null,
        //     2
        //   )}`
        // );

        return { ...doc.data(), docId: doc.id };
      });

      // GET Posts
      // const postsQuery = query(postsRef);
      // const postsSnapshot = await getDocs(recentPostsQuery);
      // let postsDocs = postsSnapshot?.docs?.map(doc => {
      //   console.log(
      //     `{ ...doc.data(), docId: doc.id }: ${JSON.stringify(
      //       { ...doc.data(), docId: doc.id },
      //       null,
      //       2
      //     )}`
      //   );
      //   return { ...doc.data(), docId: doc.id };
      // });
      // dataSet.push(postData);
      // 6ReiiEmL9B39kzCUdnzY
      // Lk1qdYiKLHFYtVPqIagF

      // res.json(dataSet);

      // GET Users
      const users = query(usersRef);
      const usersSnap = await getDocs(users);
      usersSnap?.forEach(user => {
        userData.push({ ...user.data(), userId: user.id });
      });

      // I think this block is mostly useless
      postData.forEach(post => {
        const userIdToFind = post.postedByDisplayName;
        const userExists = userData.some(user => user.userId === userIdToFind);

        if (userExists) {
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

      // Previously: setPosts(postsDocs);
      setPosts(postData);
    } catch (error: FirebaseError | unknown) {
      // console.error(`Error getting document: \x1b[33m${error}`);
      // console.log(`Coal mine canary!`);
      console.error(`other error in fetch Data`);

      setErrors(error);
      setSnackbarVisible(true);
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

    try {
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      hapticFeedbackLight;

      fetchPostsData();

      setTimeout(() => {
        setRefreshing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 2000);
    } catch (error) {
      console.error(`Some error with Haptic async function: ${error}`);
    }
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
      let aValue;
      let bValue;

      if (a && b && property) {
        try {
          aValue = a[0]; // parse through a for the element whose value is `property`
          bValue = b[0];
        } catch (error) {
          console.error(`sortByProperty done fucked up somewhere`);
        }
      }

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
    // const result = selectedFilters.filter(name => name !== filterName);
    let result;

    try {
      if (selectedFilters?.includes(filterName)) {
        return setSelectedFilters(
          selectedFilters.filter(name => name !== filterName)
        );
      } else {
        return selectedFilters
          ? setSelectedFilters([...selectedFilters, filterName])
          : setSelectedFilters([filterName]);
      }

      // TODO: Might need some catches in here just for data type mismatches
      // if (filterName) {
      //   result = posts?.filter(
      //     item => Object.keys(item).indexOf(filterName) !== -1
      //   );
      // }

      setPosts(result);
    } catch (error) {
      console.error(`Error in handleFilterPress: ${error}`);
    }
  };

  const handleResetFilters = () => {
    // getDataSortedBy(null);
    // setSelectedFilters(null);
    setSelectedFilterFoo('');
  };

  const filteredData = selectedFilters?.length
    ? posts?.filter((item: FireBasePost | any) =>
        selectedFilters?.every(filter => filter[item])
      )
    : posts;

  const printErrors = (): string => {
    if (searchParams?.snackbarMessage) {
      return searchParams.snackbarMessage;
    } else if (
      !String(errors).includes('Missing or insufficient permissions')
    ) {
      return JSON.stringify(errors);
    } else {
      return JSON.stringify(errors);
    }
  };

  const handleDebugLogin = () => {
    console.log('debug logging in');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    signInWithEmailAndPassword(firebaseAuth, USER, PASS)
      .then(res => {
        console.log(`\x1b[34mlogin res: ${JSON.stringify(res, null, 2)}`);
        myAuth?.signIn();
        userCtx?.setIsLoggedIn(true);
      })
      // }
      .catch(err => {
        console.log(`Sign in error! ${err}`);
      });
  };

  const toggleOrder = () => {
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setOrder(newOrder);
  };

  const postListFiltered = posts?.filter(post => {
    return Object.keys(post)
      .toString()
      .toLowerCase()
      .includes(selectedFilterFoo?.toLowerCase());
  });

  const postListSorted = postListFiltered?.sort((a, b) => {
    if (order === 'ASC') {
      // console.log(`a: ${JSON.stringify(a, null, 2)}`);
      // console.log(`b: ${JSON.stringify(b, null, 2)}`);

      return a?.createdAt;
    }
    return b?.createdAt;
  });
  // const postListSorted = postListFiltered;

  useEffect(() => {
    fetchPostsData();
    // fetchUserData();
  }, [refreshing]);

  useEffect(() => {
    // console.log(
    //   `selectedFilterFoo: ${JSON.stringify(selectedFilterFoo, null, 2)}`
    // );
  }, [selectedFilterFoo]);

  useEffect(() => {
    // console.log(
    //   `sorting by: ${JSON.stringify(sortByField, null, 2)}, ${order}`
    // );
  }, [sortByField]);

  useEffect(() => {
    searchParams?.snackbarMessage && setSnackbarVisible(true);
  }, [searchParams]);

  useEffect(() => {
    // postListSorted &&
    //   console.log(
    //     `postListSorted[0]: ${JSON.stringify(postListSorted[0], null, 2)}`
    //   );
  }, []);

  useEffect(() => {
    console.log(`all posts: `);

    posts?.forEach(element => console.log(JSON.stringify(element)));
  }, [posts]);

  function convertToServerTimestamp(dateString: string): FieldValue {
    const date = new Date(dateString);
    return Timestamp.fromDate(date);
  }
  const tempFunction = async () => {
    let postsToUpdate: DocumentData[] = [];
    const q = query(postsRef);
    const snap = await getDocs(q);
    snap?.docs?.map(doc => {
      const dateString = doc?.data()?.createdAt;
      const dateTimestamp = new Date(dateString).getTime();
      const referenceTimestamp = new Date('2023-07-20T09:31:59.461Z').getTime();

      if (dateTimestamp < referenceTimestamp) {
        console.log(
          `new one: ${JSON.stringify(
            convertToServerTimestamp(dateString),
            null,
            2
          )}`
        );
        // MONDAY 16:00 LEFT OFF SETTING UP FUNCTION TO CHANGE ALL PREVIOUS STRING DATES TO TIMESTAMP
        updateDoc(doc.ref, {
          createdAt: convertToServerTimestamp(dateString),
        });
      } else {
      }
    });

    console.log(`postsToDelete: ${JSON.stringify(postsToUpdate[0], null, 2)}`);

    // Once found, delete these
  };
  tempFunction();

  return (
    <>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Stack.Screen
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          // title: 'My home',
          headerTitle: '',
          headerStyle: { backgroundColor: 'transparent' },

          // https://reactnavigation.org/docs/headers#adjusting-header-styles
          // headerStyle: { backgroundColor: '#f4511e' },
          // headerTintColor: '#fff',
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
          // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
          // headerTitle: props => {
          //   return (
          //     <Image
          //       style={{ width: 50, height: 50 }}
          //       source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          //     />
          //   );
          // },
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
            >
              {/* <Badge
                visible={!!selectedFilterFoo}
                size={10}
                style={{
                  backgroundColor: 'blue',
                  position: 'absolute',
                  top: 5,
                  left: 10,
                }}
              /> */}
              <RippleButton
                icon='filter-outline'
                onPress={handlePresentModalPress}
                // mode='
                size={16}
                // iconColor='red'
              />
              <RippleButton
                icon='debug-step-into'
                onPress={handleDebugLogin}
                mode='outlined'
                size={12}
                iconColor='red'
              />
            </View>
          ),
        }}
      />

      {!errors ? (
        <>
          {/* <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing' }}
          >
            <Text>Hello World!</Text>
          </MotiView> */}

          <BottomSheetModalProvider>
            {selectedFilterFoo && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  marginTop: 10,
                }}
              >
                <Text>Filtering by: </Text>
                <Chip
                  // icon='information'
                  // selected={selectedFilters?.includes(label.varName)}
                  mode='flat'
                >
                  {selectedFilterFoo}
                </Chip>
                <IconButton
                  icon='close'
                  size={12}
                  onPress={handleResetFilters}
                />
              </View>
            )}

            <FlatList
              data={
                //   posts?.filter(
                //   (post: any) =>
                //     !selectedFilters?.length ||
                //     selectedFilters.every(filter => filter[post])
                // )
                postListSorted
              }
              contentContainerStyle={{
                paddingVertical: 8,
                paddingHorizontal: 10,
              }}
              ListEmptyComponent={
                selectedFilterFoo ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Text>
                      Nothing matches this filter: {selectedFilterFoo}
                    </Text>
                    <Button
                      mode='outlined'
                      onPress={handleResetFilters}
                      style={{ marginVertical: 20 }}
                    >
                      RESET
                    </Button>
                  </View>
                ) : null
              }
              ListFooterComponent={() =>
                !errors && posts && posts.length > 0 ? (
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
                    // style={{ padding: 20 }}
                  >
                    <Text style={styles.sectionHeaderText}>Sort by</Text>
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
                            // if (
                            //   label.varName ===
                            //   dataIsCurrentlySortedBy?.property
                            // ) {
                            //   if (dataIsCurrentlySortedBy.orderByDirection) {
                            //     return (
                            //       <List.Icon
                            //         {...props}
                            //         icon={'sort-ascending'}
                            //       />
                            //     );
                            //   } else {
                            //     return (
                            //       <List.Icon
                            //         {...props}
                            //         icon={'sort-descending'}
                            //       />
                            //     );
                            //   }
                            // }
                            // return <List.Icon {...props} icon={''} />;

                            if (
                              sortByField === label.varName &&
                              order === 'ASC'
                            ) {
                              return (
                                <List.Icon {...props} icon={'sort-ascending'} />
                              );
                            }
                            if (
                              sortByField === label.varName &&
                              order === 'DESC'
                            ) {
                              return (
                                <List.Icon
                                  {...props}
                                  icon={'sort-descending'}
                                />
                              );
                            }
                          }}
                          // onPress={() => getDataSortedBy(label.varName)}
                          onPress={() => {
                            setSortByField(label.varName);
                            toggleOrder();
                          }}
                        />
                      ))}

                    <Text style={styles.sectionHeaderText}>Filter</Text>
                    <View
                      style={{
                        // flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        backgroundColor: 'transparent',
                        paddingHorizontal: 10,
                      }}
                    >
                      {sortLabelsObj
                        .filter(x => x.displayName !== null)
                        .map((label, index: number) => (
                          <Chip
                            // icon='information'
                            // selected={selectedFilters?.includes(label.varName)}
                            key={index}
                            style={{ margin: 5 }}
                            onPress={() => setSelectedFilterFoo(label.varName)}
                            showSelectedOverlay={true}
                            mode={
                              selectedFilterFoo?.includes(label.varName)
                                ? 'flat'
                                : 'outlined'
                            }
                          >
                            {label.displayName}
                          </Chip>
                        ))}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        marginHorizontal: 15,
                      }}
                    >
                      <Button mode='outlined' onPress={handleResetFilters}>
                        RESET
                      </Button>
                    </View>
                  </BottomSheetModal>
                ) : null
              }
              refreshing={refreshing}
              onRefresh={handleRefresh}
              keyExtractor={(_, index) => index.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <>
                  <MotiView
                    transition={{
                      type: 'timing',
                    }}
                    // style={{
                    //   flex: 1,
                    //   justifyContent: 'center',
                    //   padding: 16,
                    // }}
                    style={{ backgroundColor: 'transparent' }}
                    // animate={{ backgroundColor: !dark ? '#ccc' : '#ffffff' }}
                  >
                    <Post
                      postData={item}
                      postsSavedByUser={postsSavedByUser ?? ['']} // TODO: Not a great bulletproof method, but hey it'll work for now.
                      onPressArgs={{
                        pathname: '/home/[post]',
                        params: { docId: item?.docId },
                      }}
                      loading={!!item}
                    />
                  </MotiView>
                </>
              )}
            />
          </BottomSheetModalProvider>
          {/* <Button buttonColor='red' textColor='white' onPress={toggle}>
            Flip skele theme
          </Button> */}
        </>
      ) : (
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            },
            styles.RTCViewFix,
          ]}
        >
          <RippleButton
            style={{ padding: 50, borderRadius: 100 }}
            onPress={fetchPostsData}
          >
            Retry
          </RippleButton>
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'See Post',
          onPress: () => {
            // Do something
            console.log(`new post id: ${searchParams?.seePostID}`);
            // searchParams?.seePostID
            router.push({
              pathname: '/home/[post]',
              params: {
                docId: searchParams?.seePostID,
              },
            });
          },
        }}
      >
        {printErrors()}
      </Snackbar>
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
  sectionHeaderText: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 12,
    marginVertical: 12,
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
  RTCViewFix: {
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
  },
});
