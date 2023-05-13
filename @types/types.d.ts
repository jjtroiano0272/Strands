import { Timestamp } from 'firebase/firestore';

export interface IAPIData {
  id: number,
  name: string,
  username: string,
  email: string,
  profileImage?: string,
  address: {
    street: string,
    suite: string,
    city: string,
    zipcode: number | string,
    geo: {
      lat: number,
      lng: number;
    };
  },
  phone: string,
  website: string,
  company: {
    name: string,
    catchPhrase: string,
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

  clientName?: string;
  comments?: string;
  createdAt?: string;
  // createdAt?: {
  //   seconds?: number,
  //   nanoseconds?: number;
  // };
  downloadURL?: string;
  isSeasonal?: boolean;
  media?: {
    image: string[] | null;
    video: string[];
  };
  phoneNumber: number;
  productsUsed?: [
    {
      label?: string,
      value?: string;
    }];
  rating?: number;
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
  postData?: FireBasePost;
};

declare module "react-particle-backgrounds" {
  function foo(): void;
  export = foo;
}