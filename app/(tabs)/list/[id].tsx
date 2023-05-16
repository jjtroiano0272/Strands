import * as Haptics from 'expo-haptics';
import React from 'react';
import { Placeholder, PlaceholderMedia, ShineOverlay } from 'rn-placeholder';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button, Switch } from 'react-native-paper';
import { useNavigation, useRouter, useSearchParams } from 'expo-router';

const NewsDetails = () => {
  const { id } = useSearchParams();

  return (
    <Text>NewsDetails number {id}</Text>

    // <SafeAreaView style={styles.container}>
    //   <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
    //     {/* Header with profile image and access to DMs and ability to change image */}
    //     <View style={{ alignSelf: 'center' }}>
    //       <View style={styles.profileImage}>
    //         <TouchableOpacity
    //           onLongPress={() => {
    //             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    //           }}
    //           style={styles.image}
    //         >
    //           <Image
    //             source={{ uri: 'https://unsplash.it/300' }}
    //             style={styles.image}
    //             resizeMode='center'
    //           />
    //         </TouchableOpacity>
    //       </View>
    //       <View style={styles.dm}>
    //         <TouchableOpacity
    //           onPress={() => Alert.alert(`Tryin' to slide into my DMs?`)}
    //         >
    //           <MaterialIcons name='chat' size={18} color='#DFD8C8' />
    //         </TouchableOpacity>
    //       </View>
    //       {/* <View style={styles.active}></View> */}
    //     </View>

    //     {/* User's subtitle of name */}
    //     <View style={styles.infoContainer}>
    //       <Text style={[styles.text, { fontWeight: '200', fontSize: 36 }]}>
    //         {/* {userCtx.firstName} */}
    //       </Text>
    //       <Text style={[styles.text, { color: '#AEB5BC', fontSize: 14 }]}>
    //         {/* {userCtx.lastName} */}
    //       </Text>
    //     </View>

    //     {/* Number of user's followers, posts, etc. */}
    //     <View style={styles.statsContainer}>
    //       <View style={styles.statsBox}>
    //         <Text style={[styles.text, { fontSize: 24 }]}>483</Text>
    //         <Text style={[styles.text, styles.subText]}>Posts</Text>
    //       </View>
    //       <View
    //         style={[
    //           styles.statsBox,
    //           {
    //             borderColor: '#DFD8C8',
    //             borderLeftWidth: 1,
    //             borderRightWidth: 1,
    //           },
    //         ]}
    //       >
    //         <Text style={[styles.text, { fontSize: 24 }]}>45,844</Text>
    //         <Text style={[styles.text, styles.subText]}>Followers</Text>
    //       </View>
    //       <View style={styles.statsBox}>
    //         <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
    //         <Text style={[styles.text, styles.subText]}>Following</Text>
    //       </View>
    //     </View>

    //     {/* User's media carousel */}
    //     <View style={{ marginTop: 32 }}>
    //       <ScrollView
    //         horizontal={true}
    //         showsHorizontalScrollIndicator={false}
    //       ></ScrollView>

    //       <View style={styles.mediaCount}>
    //         <Text
    //           style={[
    //             styles.text,
    //             { fontSize: 24, color: '#DFD8C8', fontWeight: '300' },
    //           ]}
    //         >
    //           70
    //         </Text>
    //         <Text
    //           style={[
    //             styles.text,
    //             {
    //               fontSize: 12,
    //               color: '#DFD8C8',
    //               textTransform: 'uppercase',
    //             },
    //           ]}
    //         >
    //           Media
    //         </Text>
    //       </View>
    //     </View>
    //     <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>
    //     <View style={{ alignItems: 'center' }}>
    //       <View style={styles.recentItem}>
    //         <View style={styles.activityIndicator}></View>
    //         <View style={{ width: 250 }}>
    //           <Text
    //             style={[styles.text, { color: '#41444B', fontWeight: '300' }]}
    //           >
    //             Started following{' '}
    //             <Text style={{ fontWeight: '400' }}>Jake Challeahe</Text> and{' '}
    //             <Text style={{ fontWeight: '400' }}>Luis Poteer</Text>
    //           </Text>
    //         </View>
    //       </View>
    //       <View style={styles.recentItem}>
    //         <View style={styles.activityIndicator}></View>
    //         <View style={{ width: 250 }}>
    //           <Text
    //             style={[styles.text, { color: '#41444B', fontWeight: '300' }]}
    //           >
    //             Started following{' '}
    //             <Text style={{ fontWeight: '400' }}>Luke Harper</Text>
    //           </Text>
    //         </View>
    //       </View>
    //       <MaterialIcons name='keyboard-arrow-down' style={{ fontSize: 30 }} />
    //     </View>
    //     <View style={{ alignItems: 'center' }}>
    //       <Text style={{ margin: 20 }}>Dark Mode</Text>
    //     </View>
    //     <View style={{ bottom: -20, marginBottom: 20 }}>
    //       <Button
    //         style={styles.logoutButton}
    //         mode='contained'
    //         // onPress={authCtx.logout}
    //       >
    //         Logout
    //       </Button>
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'HelveticaNeue',
    color: '#52575D',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: '#AEB5BC',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  dm: {
    backgroundColor: '#41444B',
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#34FFB9',
    position: 'absolute',
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  add: {
    backgroundColor: '#41444B',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 32,
  },
  statsBox: {
    alignItems: 'center',
    flex: 1,
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  mediaCount: {
    backgroundColor: '#41444B',
    position: 'absolute',
    top: '50%',
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.38)',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIndicator: {
    backgroundColor: '#CABFAB',
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
  logoutButton: { margin: 30 },
});
