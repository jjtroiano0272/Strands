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
  formulaUsed?: {
    description?: string,
    type?: string;
  },
  geolocation?: {
    lng?: number,
    lat?: number;
  },
  lastUpdatedAt?: {
    seconds?: number,
    nanoseconds?: number;
  },
  media?: {
    images?: string[],
    videos?: string[];
  },
  bio?: string,
  clientID?: string,
  comments?: string,
  createdAt?: string | Date,
  displayName?: string,
  docId?: string,
  followers?: [],
  following?: [],
  postedByDisplayName?: string,
  profileImage?: string,
  rating?: number,
  savedPosts?: string[],
  username?: string;
  docId?: string;
  data?: { [key: string]: DocumentData, docId: string; };
  [key: string]: DocumentData;
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

export type YetAnotherNewOne = {
  lastUpdatedAt: {
    seconds: number,
    nanoseconds: number;
  },
  geolocation: {
    lng: number,
    lat: number;
  },
  formulaUsed: {
    description: string,
    type: string;
  },
  media: {
    images: string[],
    videos: string[];
  },
  postedBy: string,
  rating: number,
  comments: string,
  createdAt: string, // Maybe with Date type?
  docId: string,
  following: [],
  profileImage: string,
  savedPosts: [],
  followers: [],
  bio: string,
  displayName: string,
  username: string;
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
  postedBy?: string;
};

declare module 'react-particle-backgrounds' {
  function foo(): void;
  export = foo;
}

