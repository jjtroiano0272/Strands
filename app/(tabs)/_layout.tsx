// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Link, Tabs } from 'expo-router';
// import React, { useState } from 'react';
// import { Pressable, useColorScheme } from 'react-native';

// import Colors from '../../constants/Colors';

// /**
//  * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
//  */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const [loggedIn, setLoggedIn] = useState(false);

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//       }}
//     >
//       {/* <Tabs.Screen
//         name='register'
//         options={{
//           title: 'Register User',
//           tabBarIcon: ({ color }) => <TabBarIcon name='code' color={color} />,
//         }}
//       /> */}

//       <Tabs.Screen
//         name='index'
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
//           headerRight: () => (
//             <Link href='/modal' asChild>
//               <Pressable>
//                 {({ pressed }) => (
//                   <FontAwesome
//                     name='info-circle'
//                     size={25}
//                     color={Colors[colorScheme ?? 'light'].text}
//                     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
//                   />
//                 )}
//               </Pressable>
//             </Link>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name='two'
//         options={{
//           title: 'Settings?',
//           tabBarIcon: ({ color }) => <TabBarIcon name='code' color={color} />,
//         }}
//       />
//       {/* <Tabs.Screen
//         name='clientProfile'
//         options={{
//           title: 'Client Info',
//           // tabBarIcon: ({ color }) => <TabBarIcon name='account' color={color} />,
//         }}
//       /> */}
//     </Tabs>
//   );
// }
