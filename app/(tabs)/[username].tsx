import * as Haptics from 'expo-haptics';
import { faker } from '@faker-js/faker';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { IAPIData, SearchParams } from '../../@types/types';
import Colors from '../../constants/Colors';
import useFetch from '../../hooks/useFetch';
import { ExternalLink } from '../../components/ExternalLink';
import { MonoText } from '../../components/StyledText';
import {
  Avatar,
  Button,
  Card,
  Title,
  Subheading,
  Paragraph,
  MD3LightTheme,
  MD3DarkTheme,
  List,
} from 'react-native-paper';
import { Text, View } from '../../components/Themed';
import {
  Link,
  Stack,
  useRouter,
  useSearchParams,
  usePathname,
  useSegments,
  useNavigation,
  useLocalSearchParams,
} from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import Swiper from 'react-native-swiper';

export default function ClientProfile() {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

  // const {
  //   clientName,
  //   comments,
  //   displayName,
  //   imgSrc,
  //   username,
  //   name,
  //   auth,
  //   createdAt,
  //   isSeasonal,
  //   productsUsed,
  //   rating,
  // }: SearchParams = useSearchParams();
  const {
    name,
    imgSrc,
    imgParam,
    phoneNumber,
    postedBy,
    comments,
  }: {
    name?: string;
    imgSrc?: { image: string[]; video: string[] };
    imgParam?: string;
    phoneNumber?: number | string;
    postedBy?: string;
    comments?: string;
  } = useSearchParams();

  // TODO These need to be replace with actual data, but will need to be engineered.
  // For example, user actually needs to come from something like the user context for the actual user.
  const placeholders = {
    recipient: faker.name.firstName(),
    user: faker.name.fullName(),
    phoneNumber: faker.phone.number('(###) ###-###').toString(),
  };
  const messageBody = encodeURI(
    `Hi ${placeholders.recipient} this is ${placeholders.user}. I just wanted to confirm the upcoming appointment with you`
  );

  const handleOptionsMenu = (phoneNumber: string) => {
    const menuOptions = ['Call', 'Text', 'Cancel'];

    // Show the action sheet to the user
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: menuOptions,
        cancelButtonIndex: menuOptions.length - 1,
      },
      async (index: number) => {
        // if else method
        try {
          if (menuOptions[index] === 'Call') {
            await Linking.openURL(`tel:${phoneNumber}`);
          } else if (menuOptions[index] === 'Text') {
            await Linking.openURL(`sms:${phoneNumber}?body=${messageBody}`);
          } else {
            return;
          }
        } catch (err) {
          console.error(`menu option error: ${err}`);
        }
      }
    );
  };

  // Replace `instagram://user?username=USERNAME` with the Instagram link you want to open
  const onClickInstagramLink = () => {
    const instagramLink = `instagram://user?username=jonathan.troiano`;

    ExpoLinking.canOpenURL(instagramLink)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${instagramLink}`);
        } else {
          return ExpoLinking.openURL(instagramLink);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  useEffect(() => {
    console.log(`phone: ${typeof phoneNumber}`);
  }, []);

  return (
    <ScrollView style={styles.getStartedContainer}>
      <Stack.Screen options={{ title: `${name}` }} />

      <Card
        style={styles.card}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        <Card.Title
          theme={MD3DarkTheme}
          title={null} // Client's name
          titleStyle={[{ color: theme.colors.text }, styles.cardTitle]}
          // TODO: Make username URL
          subtitle={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <Text style={{ lineHeight: 18 }}>Seen by {postedBy}</Text>
              <View
                style={{ backgroundColor: 'transparent' }}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              ></View>
            </View>
          }
          subtitleStyle={[{ color: theme.colors.text }, styles.cardSubtitle]}
        />

        <Card.Content>
          {/* <Card.Cover
              source={{
                uri: imgSrc,
              }}
            /> */}

          <Swiper
            // containerStyle={styles.swiperContainer}
            containerStyle={{ flex: 1, aspectRatio: 1, borderRadius: 30 }}
            dot={
              <View
                style={{
                  margin: 7,
                  justifyContent: 'space-between',
                  width: 10,
                  height: 10,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: theme.colors.background,
                  backgroundColor: 'transparent',
                }}
              />
            }
            activeDot={
              <View
                style={{
                  margin: 7,
                  justifyContent: 'space-between',
                  width: 10,
                  height: 10,
                  borderRadius: 50,
                  borderWidth: 5,
                  borderColor: theme.colors.background,
                  // backgroundColor: 'transparent',
                }}
              />
            }
            onIndexChanged={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            {imgParam?.split(',').map(imgUri => (
              <Image
                // style={styles.swiperImage}
                key={imgUri}
                style={{ flex: 1 }}
                source={{
                  uri: imgUri,
                }}
              />
            ))}
          </Swiper>

          {/* TWO COLUMNS of list items */}
          {/* Recent reviews, listed in order of submission and saying who wrote what, and their own rating */}
          {/* Phone + prompt to hook into API to call */}
          {phoneNumber !== 'undefined' && (
            <List.Item
              style={styles.listItem}
              theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
              title={`(${phoneNumber?.toString().slice(0, 3)}) ${phoneNumber
                ?.toString()
                .slice(3, 6)}-${phoneNumber?.toString().slice(6)}`}
              // description='Item description'
              left={() => (
                <MaterialCommunityIcons
                  color={theme.colors.primary}
                  size={24}
                  name='phone'
                />
              )}
              onPress={() => handleOptionsMenu(phoneNumber as string)}
            />
          )}

          {/* Salon */}
          <Subheading style={[styles.subtitle, { color: theme.colors.text }]}>
            Salon
          </Subheading>
          <Paragraph>Redken</Paragraph>
          {/* Comments */}
          <Subheading style={[styles.subtitle, { color: theme.colors.text }]}>
            Comments
          </Subheading>
          <Paragraph style={{ color: theme.colors.text }}>{comments}</Paragraph>
          <Paragraph style={{ color: 'red' }} onPress={onClickInstagramLink}>
            TEST LINK
          </Paragraph>
          <Link
            href={{ pathname: 'users/123', params: { id: 123 } }}
            style={{
              color: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            POSTED BY SOMEONE
          </Link>
        </Card.Content>
      </Card>

      <Modal
        visible={phoneModalVisible}
        animationType='slide'
        transparent={true}
      >
        <View
          style={{
            position: 'absolute',
            padding: 20,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}
        >
          <TouchableOpacity
            onPress={() => setPhoneModalVisible(!phoneModalVisible)}
          >
            <Text style={{ fontSize: 36 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('15 more minutes')}>
            <Text style={{ fontSize: 36 }}>15 more minutes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('No more limit for today')}
          >
            <Text style={{ fontSize: 36 }}>No more limit for today</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* TODO Offload to custom component with only the needed text, standardized format */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { margin: 10, minWidth: 300 },
  getStartedContainer: {
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  cardsContainer: {
    marginHorizontal: 'auto',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  titleText: {
    fontSize: 42,
    margin: 20,
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
  subtitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardTitle: { fontSize: 42, paddingTop: 30 },
  cardSubtitle: { fontSize: 14, paddingVertical: 14 },
  swiperContainer: { height: 300, width: '100%', borderRadius: 30 },
  listItem: { padding: 10, marginVertical: 10, borderRadius: 7 },
  circleOutline: {},
  circleFilled: {},
});
