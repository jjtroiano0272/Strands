export interface IAPIData {
  id: number,
  name: string,
  username: string,
  email: string,
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