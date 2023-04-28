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
import { IAPIData } from '../@types/types';
import Colors from '../constants/Colors';
import useFetch from '../hooks/useFetch';
import { ExternalLink } from '../components/ExternalLink';
import { MonoText } from '../components/StyledText';
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
import { Text, View } from '../components/Themed';
import { Link, Stack, useRouter, useSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

// TODO Offload to types file
type NewType = {
  id?: string;
  name?: string;
  clientName?: string;
  username?: string;
  imgSrc?: string;
  //
  displayName?: string;
  auth?: string;
  comments?: string;
  createdAt?: string;
  isSeasonal?: string;
  productsUsed?: string;
  rating?: string;
};

export default function ClientProfile() {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    faker.phone.number('###-###-###').toString()
  );

  const {
    name,
    clientName,
    username,
    imgSrc,
    //,
    displayName,
    auth,
    comments,
    createdAt,
    isSeasonal,
    productsUsed,
    rating,
  }: NewType = useSearchParams();

  // TODO These need to be replace with actual data, but will need to be engineered.
  // For example, user actually needs to come from something like the user context for the actual user.
  const placeholders = {
    recipient: faker.name.firstName(),
    user: faker.name.fullName(),
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

  useEffect(() => {
    // console.log(`uri used: https://picsum.photos/id/${id + 64}/700/700`);
    console.log(`imgSrc is??: ${imgSrc}`);
  }, []);

  return (
    <ScrollView style={styles.getStartedContainer}>
      <Stack.Screen options={{ title: `@${name}` }} />

      {/* TODO Offload to custom component with only the needed text, standardized format */}
      <Card
        style={{ margin: 10, minWidth: 300 }}
        theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
      >
        <Card.Title
          theme={MD3DarkTheme}
          // Client's name
          title={clientName}
          titleStyle={{
            color: theme.colors.text,
            fontSize: 42,
            paddingTop: 30,
          }}
          subtitle={`${displayName}`}
          subtitleStyle={{
            color: theme.colors.text,
            fontSize: 14,
            paddingVertical: 14,
          }}
        />
        <Card.Content>
          <Card.Cover
            source={{
              uri: imgSrc,
            }}
          />
          {/* TWO COLUMNS of list items */}
          {/* Recent reviews, listed in order of submission and saying who wrote what, and their own rating */}

          {/* Phone + prompt to hook into API to call */}
          <List.Item
            theme={!theme.dark ? MD3LightTheme : MD3DarkTheme}
            title={phoneNumber}
            // description='Item description'
            left={props => (
              <MaterialCommunityIcons
                name='phone'
                size={24}
                color={theme.colors.primary}
              />
            )}
            onPress={() => handleOptionsMenu(phoneNumber)}
            style={{ padding: 10, marginVertical: 10, borderRadius: 7 }}
          />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
