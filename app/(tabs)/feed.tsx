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
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
// import { fetchUser } from '../../redux/actions';
import { db } from '../../firebaseConfig';
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

const Feed = () => {
  const theme = useTheme();
  const [myDbData, setMyDbData] = useState<
    (FireBasePost | DocumentData | string)[] | undefined | null
  >(null);
  const [initialDbData, setInitialDbData] = useState<
    (FireBasePost | DocumentData | string)[] | undefined | null
  >(null);
  const [savedPosts, setSavedPosts] = useState<string[]>();
  const [refreshing, setRefreshing] = useState(false);
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height / 1.5);
  // TODO These set the height of the modal but I need some  way to grab the dynamic height of it based on what data is being shown
  const snapPoints = useMemo(() => ['75%'], []);
  const [dataIsCurrentlySortedBy, setdataIsCurrentlySortedBy] = useState<{
    var: string | boolean | number;
    sortAsc: boolean | null;
  } | null>(null);
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
  const userPostsCollectionRef = collection(db, 'posts');

  /**
   *  ALL DATA CALLS
   */
  // TODO There's a better way to write this so the output gets stored in a var
  const fetchMyData = async () => {
    let list: (DocumentData | string)[] = [];

    try {
      getDocs(userPostsCollectionRef).then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = doc.data(); // Get the data object
          data.docId = doc.id; // Add the id property with the value of doc.id

          list.push(data); // Push the modified object into the list array
        });
      });

      if (currentUserID) {
        const docRef = doc(db, 'users', currentUserID);
        const docSnap = await getDoc(docRef);

        docSnap.exists()
          ? setSavedPosts(docSnap.data().savedPosts)
          : // docSnap.data() will be undefined in this case
            console.log('No such document!');
      } else {
        console.warn('no current user!');
      }

      setMyDbData(list);
      setInitialDbData(list);

      // console.log(`list: ${JSON.stringify(list.slice(0, 2), null, 2)}`);
    } catch (error) {
      console.error(`Error getting document: \x1b[33m${error}`);

      setErrors(error);
    }
  };

  const fetchUsers = async (search: string) => {
    try {
      const q = query(
        userPostsCollectionRef,
        where('clientName', '>=', search)
      );

      const snapshot = await getDocs(q);

      let localUsers = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });

      // console.log(`users: ${JSON.stringify(localUsers)}`);
    } catch (err) {
      console.error(`Error with collection query for users: ${err}`);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    fetchMyData();

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
    data: (string | FireBasePost | DocumentData)[] | null | undefined,
    asc?: boolean
  ): (string | FireBasePost | DocumentData)[] | undefined | null => {
    if (data) {
      if (asc) {
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
    }
    // TODO Wouldn't it be more efficient to just return nothing instead passing any data around?
    // It's the same effect--no data has changed.
    return data;
  };

  const getDataSortedBy = (
    varName: string | null
  ): FireBasePost[] | undefined | void => {
    let result: (string | FireBasePost | DocumentData)[] | null | undefined;

    switch (varName) {
      case 'createdAt':
        setdataIsCurrentlySortedBy({
          var: varName,
          sortAsc: !dataIsCurrentlySortedBy?.sortAsc,
        });
        result = sortByProperty(varName, myDbData);
      case 'isSeasonal':
        result = sortByProperty(varName, myDbData);
        break;
      case 'displayName':
        result = sortByProperty(`auth.${varName}`, myDbData);
        break;
      case 'rating':
        setdataIsCurrentlySortedBy({
          var: varName,
          sortAsc: !dataIsCurrentlySortedBy?.sortAsc,
        });

        result = sortByProperty(
          varName,
          myDbData,
          dataIsCurrentlySortedBy?.sortAsc!
        );
        break;
      case null:
        console.log(`in null, resetting data....`);
        setdataIsCurrentlySortedBy(null);
        result = initialDbData;
        break;
      default:
        console.error(`No data supplied to sort by! Exiting...`);
        return;
    }

    setMyDbData(result);
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

    console.log(`myDbData: ${myDbData && JSON.stringify(myDbData[0])}`);

    // TODO: Might need some catches in here just for data type mismatches
    const result = myDbData?.filter(
      (item: FireBasePost | DocumentData | string) =>
        (item as DocumentData | FireBasePost)[filterName]
    );

    setMyDbData(result);
  };

  const handleReset = () => {
    getDataSortedBy(null);
    setSelectedFilters(null);
  };

  const filteredData = selectedFilters?.length
    ? myDbData?.filter((item: FireBasePost | any) =>
        selectedFilters?.every(filter => filter[item])
      )
    : myDbData;

  useEffect(() => {
    fetchMyData();
  }, [!myDbData]);

  useEffect(() => {
    fetchMyData();
  }, []);

  useEffect(() => {}, [myDbData]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!errors ? (
        <FlatList
          data={sortByProperty('createdAt', myDbData, false)?.filter(
            (
              item: any // TODO Clean up types
            ) =>
              !selectedFilters?.length ||
              selectedFilters.every(filter => filter[item])
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <Post postData={item} savedPosts={savedPosts} />
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
                            label?.varName === dataIsCurrentlySortedBy?.var
                              ? theme?.colors.primary
                              : ''
                          }
                        />
                      )}
                      right={props => {
                        if (label.varName === dataIsCurrentlySortedBy?.var) {
                          if (dataIsCurrentlySortedBy.sortAsc) {
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
            onPress={fetchMyData}
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
