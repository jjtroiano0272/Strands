import { Timestamp } from 'firebase/firestore';

export interface IAPIData {
  id: number;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: number | string;
    geo: {
      lat: number;
      lng: number;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  // Custom fields we'll set
  seasonal: boolean;
}

export type UserContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (arg: boolean) => void;
};

export type FireBasePost = {
  [key: string]: string | number | boolean;
  auth?: {
    displayName?: string;
    profileImage?: string;
    uid?: string;
  };
  geolocation?: {
    lat: number;
    lng: number;
  };
  formula: {
    description: string;
    type: string;
  };
  clientName?: string;
  comments?: string;
  createdAt?: string;
  downloadURL?: string;
  isSeasonal?: boolean;
  media?: {
    image?: string[] | null;
    video?: string[];
  };
  phoneNumber?: number;
  productsUsed?: [
    {
      label?: string;
      value?: string;
    }
  ];
  rating?: number;
  docId?: string;
  salon?: string;
  savedPosts?: string[];
  averageRating?: number;
  id?: string;
  postsAboutClient?: { [key: string]: unknown; }[];
};

type RefactoredPost = {
  [key: string]: string | number | boolean;
  geolocation?: {
    lat: number;
    lng: number;
  };
  formula: {
    description: string;
    type: string;
  };
  media?: {
    images?: string[] | null;
    videos?: string[];
  };
  productsUsed?: string[];
  clientName?: string;
  clientInfo: {
    phone: number;
    email: string;
    firstName: string;
    lastName: string;
    seasonalClient?: boolean;
  };
  comments?: string;
  createdAt?: string;
  createdBy?: string; // uid
  downloadURL?: string;
  rating?: number;
  docId?: string;
  salon?: string;
};

export type UserProfile = {
  [key: string]: string[] | string | number;
  username: string;
  bio: string;
  following: string[];
  followers: string[];
  displayName: string;
  socialMediaLinks: {
    youtube: string;
    instagram: string;
    facebook: string;
    reddit: string;
  };
  savedPosts: string[];
  profileImage: string;
};

export type SearchParams = {
  id?: string;
  name?: string;
  clientName?: string;
  username?: string;
  imgSrc?: string[];
  displayName?: string;
  auth?: string;
  comments?: string;
  createdAt?: string;
  isSeasonal?: string;
  productsUsed?: string;
  rating?: string;
};

export type PostProps = {
  imgSrc?: string[] | null;
  auth?: {
    displayName?: string;
    uid?: string;
    profileImage?: string;
  };
  displayName?: string;
  username?: string | number;
  clientName?: string;
  comments?: string;
  createdAt?: number | Timestamp | string;
  isSeasonal?: boolean;
  productsUsed?: [label: string, value: string];
  rating?: number;
  salon?: string | undefined;
  postData?: FireBasePost;
  savedPosts?: string[];
};

declare module 'react-particle-backgrounds' {
  function foo(): void;
  export = foo;
}
