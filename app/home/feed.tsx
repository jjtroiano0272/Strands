import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { RefreshControl, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useTheme } from '@react-navigation/native';

import React from 'react';
import { ScrollView } from 'react-native';
import { FireBasePost } from '../../@types/types';
import useFetch from '../../hooks/useFetch';
import GridItem from '../../components/GridItem';
import { Stack } from 'expo-router';
import {
  DocumentData,
  Timestamp,
  collection,
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
import { FirebaseError } from 'firebase/app';

type RedditAPIData = {
  data: [
    {
      data: {
        title: string;
        thumbnail: 'default' | 'self' | 'nsfw';
        url_overridden_by_dest: string;
        author: string;
      };
    }
  ];
  error: string | null;
  loading: string | boolean | null;
};

const Feed = () => {
  // const userPostsCollectionRef = collection(db, 'posts', userID!, 'userPosts');
  const theme = useTheme();
  const [myDbData, setMyDbData] = useState<FireBasePost[] | undefined | null>(
    null
  );
  const [initialDbData, setInitialDbData] = useState<
    FireBasePost[] | undefined | null
  >(null);
  const userPostsCollectionRef = collection(db, 'postNew');
  const [refreshing, setRefreshing] = useState(false);
  const dimensions = useWindowDimensions();
  const top = useSharedValue(dimensions.height / 1.5);
  const [finalData, setFinalData] = useState<unknown[] | null>(null);
  const currentUser = getAuth().currentUser;
  const userID = getAuth().currentUser?.uid;
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

  const apiUrl = 'https://www.reddit.com/r/FancyFollicles.json';

  /**
   *  ALL DATA CALLS
   */
  // TODO There's a better way to write this so the output gets stored in a var
  const {
    data: redditPlaceholderData,
    error,
    loading,
  }: RedditAPIData = useFetch(apiUrl);

  const fetchMyData = () => {
    let list: DocumentData[] = [];
    getDocs(userPostsCollectionRef)
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          list.push(doc.data());
        });

        setMyDbData(list);
        setInitialDbData(list);
      })
      .catch((error: FirebaseError) => {
        console.log(
          'Error getting document: \x1b[34m',
          error.code,
          error.message
        );
      });
  };

  const fetchUsers = async (search: string) => {
    // FIREBASE 8 METHODOLOGY
    // Also, back then firestore didn't contain a fuzzy search
    // firebase
    //   .firestore()
    //   .collection('users')
    //   .where('name', '>=', search)
    //   .get()
    //   .then((snapshot: any) => {
    //     let localUsers = snapshot.docs.map((doc: any) => {
    //       const data = doc.data();
    //       const id = doc.id;
    //       return { id, ...data };
    //     });

    // FIREBASE 9 METHODOLOGY
    // const db = getFirestore();
    const q = query(
      collection(db, 'postNew'),
      where('clientName', '>=', search)
    );

    const snapshot = await getDocs(q);

    let localUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });

    console.log(`users: ${JSON.stringify(localUsers)}`);
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
    data: FireBasePost[] | undefined | null,
    asc?: boolean
  ): FireBasePost[] | undefined | null => {
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
  const [pressed, setPressed] = useState<boolean | null>(null);
  const getDataSortedBy = (
    varName: string | null
  ): FireBasePost[] | undefined | void => {
    let result: FireBasePost[] | undefined | null;

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

  const [dataIsCurrentlySortedBy, setdataIsCurrentlySortedBy] = useState<{
    var: string | boolean | number;
    sortAsc: boolean | null;
  } | null>(null);
  // rename to activeFilters
  const [selectedFilters, setSelectedFilters] = useState<string[] | null>(null);

  useEffect(() => {
    fetchMyData();
  }, [!myDbData]);

  useEffect(() => {
    // console.log(`\x1b[32m${JSON.stringify(myDbData, null, 2)}`);
    console.log(
      `Sort direction: ${
        dataIsCurrentlySortedBy?.sortAsc ? 'asc' : 'desc' ? 'null' : 'no'
      }`
    );
  }, [dataIsCurrentlySortedBy?.sortAsc]);

  useEffect(() => {
    console.log(`selectedFilter: ${JSON.stringify(selectedFilters, null, 2)}`);
  }, [selectedFilters]);

  useEffect(() => {
    // myDbData.map((item: FireBasePost, index: number) => (

    console.log(`myDbData: ${JSON.stringify(myDbData, null, 2)}`);
  }, [myDbData]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  // TODO These set the height of the modal but I need some  way to grab the dynamic height of it based on what data is being shown
  const snapPoints = useMemo(() => ['75%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);
  9;
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

    console.log(
      `${filterName}: ${!selectedFilters?.includes(filterName) ? 'ON' : 'OFF'}`
    );

    // TODO: Might need some catches in here just for data type mismatches
    const result = myDbData?.filter(item => item[filterName]);
    setMyDbData(result);

    console.log(
      `selectedFilters after pressing: ${JSON.stringify(
        selectedFilters,
        null,
        2
      )}`
    );
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
    console.log(`filteredData: ${filteredData ? true : false}`);
  }, [filteredData]);

  return (
    <>
      <BottomSheetModalProvider>
        <ScrollView
          style={styles.getStartedContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Stack.Screen
            options={{
              headerShown: false,
            }}
          />

          {/* TODO Add a filter button for like 'Show me people of x hair type within x miles of me, etc. */}
          <View style={styles.container}>
            {/* TODO Offload to custom component with only the needed text, standardized format */}

            <View style={styles.cardsContainer}>
              {selectedFilters?.length
                ? myDbData
                    ?.filter((item: FireBasePost | any) =>
                      selectedFilters?.every(filter => filter[item])
                    )
                    .map((item: FireBasePost, index: number) => (
                      <GridItem
                        key={index}
                        usingMyOwnDB={true}
                        createdAt={item?.createdAt?.seconds}
                        isSeasonal={item?.isSeasonal}
                        auth={item?.auth}
                        imgSrc={
                          item?.downloadURL
                            ? item.downloadURL
                            : `https://unsplash.it/id/${index}/200/200`
                        }
                      />
                    ))
                : myDbData?.map((item: FireBasePost, index: number) => (
                    <GridItem
                      key={index}
                      usingMyOwnDB={true}
                      createdAt={item?.createdAt?.seconds}
                      isSeasonal={item?.isSeasonal}
                      auth={item?.auth}
                      imgSrc={
                        item?.downloadURL
                          ? item.downloadURL
                          : `https://unsplash.it/id/${index}/200/200`
                      }
                    />
                  ))}
            </View>
          </View>

          <Button
            mode='outlined'
            onPress={handlePresentModalPress}
            contentStyle={{ borderRadius: 50 }}
          >
            Sort Results
          </Button>
        </ScrollView>

        <BottomSheetModal
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.text }}
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
                      label?.varName === dataIsCurrentlySortedBy?.var
                        ? theme?.colors.primary
                        : ''
                    }
                  />
                )}
                right={props => {
                  if (label.varName === dataIsCurrentlySortedBy?.var) {
                    if (dataIsCurrentlySortedBy.sortAsc) {
                      return <List.Icon {...props} icon={'sort-ascending'} />;
                    } else {
                      return <List.Icon {...props} icon={'sort-descending'} />;
                    }
                  }
                  return <List.Icon {...props} icon={''} />;
                }}
                onPress={() => getDataSortedBy(label.varName)}
              />
            ))}
          <Text>Filter</Text>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
            {sortLabelsObj
              .filter(x => x.displayName !== null)
              .map((label, index: number) => (
                <Chip
                  key={index}
                  style={{ margin: 5 }}
                  // icon='information'
                  onPress={() => handleFilterPress(label.varName)}
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
    </>
  );
};

export default Feed;

const styles = StyleSheet.create({
  getStartedContainer: {
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  container: { flexDirection: 'row', flexWrap: 'wrap', flex: 1, padding: 8 },
  cardsContainer: {
    // marginHorizontal: 'auto',
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
