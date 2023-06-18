import { arrayWithUpdateData } from '../../DATA_TO_UPDATE_WITH';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { FireBasePost } from '../../@types/types';
import Post from '../../components/Post';
import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  deleteField,
  doc,
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
import { db, postsRef, usersRef } from '../../firebaseConfig';
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
import { set } from 'firebase/database';
import { OLD_DATA } from '../../OLD_DATA';

const Feed = () => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height / 1.5);

  const [posts, setPosts] = useState<
    (FireBasePost | DocumentData | string)[] | undefined | null
  >(null);
  const [initialDbData, setInitialDbData] = useState<
    (FireBasePost | DocumentData | string)[] | undefined | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);
  // TODO These set the height of the modal but I need some  way to grab the dynamic height of it based on what data is being shown
  const snapPoints = useMemo(() => ['75%'], []);
  const [dataIsCurrentlySortedBy, setdataIsCurrentlySortedBy] = useState<{
    property: string | boolean | number;
    orderByDirection: 'asc' | 'desc';
  }>();
  const [selectedFilters, setSelectedFilters] = useState<string[] | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  let bottomSheetModalRef: any;

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

  // API initalizers

  let oldPosts: { [field: string]: any }[];
  let newPosts: { [field: string]: any }[];
  let newClients;

  /**
   *  ALL DATA CALLS
   */
  // TODO There's a better way to write this so the output gets stored in a var
  const fetchPostsData = async () => {
    let postData: (FireBasePost | DocumentData | string)[] = [];
    let userData: { [key: string]: any }[] = [];
    let result: {}[];

    try {
      // GET POSTS
      const recentPosts = query(postsRef, orderBy('createdAt', 'desc'));
      const postSnap = await getDocs(recentPosts);
      postSnap.forEach(post => {
        const data = { ...post.data(), docId: post.id }; // Get the data object
        postData.push(data); // Push the modified object into the list array
      });

      // GET USERS
      const userSnap = await getDocs(usersRef);
      userSnap.forEach(user => {
        userData.push(user.data());
      });

      // console.log(`userData: ${JSON.stringify(userData.slice(0, 3))}`);
      const combinedData = postData.map((post, index) => ({
        ...post,
        ...userData[index],
      }));
      setPosts(combinedData);
      // setPosts(postData);
      setInitialDbData(postData);
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
    data: (FireBasePost & DocumentData & string)[],
    orderByDirection: 'asc' | 'desc' = 'asc'
  ): (string & FireBasePost & DocumentData)[] | undefined => {
    if (!data) return;

    if (orderByDirection === 'asc') {
      return [...data].sort((a, b) => {
        if (a[property] > b[property]) {
          return 1;
        } else if (a[property] < b[property]) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      return [...data].sort((a, b) => {
        if (a[property] < b[property]) {
          return 1;
        } else if (a[property] > b[property]) {
          return -1;
        } else {
          return 0;
        }
      });
    }
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

  const handlePresentModalPress = useCallback(() => {
    // bottomSheetModalRef?.current?.present();
  }, []);

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
      (item: FireBasePost | DocumentData | string) =>
        (item as DocumentData | FireBasePost)[filterName]
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
  }, [!posts]);

  useEffect(() => {
    console.log(
      `posts (${posts?.length} found): ${JSON.stringify(
        posts?.slice(0, 3),
        null,
        2
      )}`
    );
  }, [posts]);

  // useEffect(() => {
  //   fetchPostsData();
  // }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {!errors ? (
        <FlatList
          data={posts?.filter(
            (post: any) =>
              !selectedFilters?.length ||
              selectedFilters.every(filter => filter[post])
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <Post
              postData={item}
              // savedPosts={savedPosts}
              // postedBy={item.postedBy}
            />
          )}
          contentContainerStyle={{
            paddingVertical: 8,
            paddingHorizontal: 4,
          }}
          ListFooterComponent={
            <BottomSheetModalProvider>
              <Button
                mode='outlined'
                onPress={handlePresentModalPress}
                contentStyle={{ borderRadius: 50 }}
              >
                Sort Results
              </Button>

              <BottomSheetModal
                backgroundStyle={{ backgroundColor: theme.colors.background }}
                handleIndicatorStyle={{ backgroundColor: theme.colors.text }}
                index={0}
                snapPoints={snapPoints}
                // ref={node => (bottomSheetModalRef = node)}
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
                            label?.varName === dataIsCurrentlySortedBy?.property
                              ? theme?.colors.primary
                              : ''
                          }
                        />
                      )}
                      right={props => {
                        if (
                          label.varName === dataIsCurrentlySortedBy?.property
                        ) {
                          if (dataIsCurrentlySortedBy.orderByDirection) {
                            return (
                              <List.Icon {...props} icon={'sort-ascending'} />
                            );
                          } else {
                            return (
                              <List.Icon {...props} icon={'sort-descending'} />
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
                  style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}
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
            </BottomSheetModalProvider>
          }
        />
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