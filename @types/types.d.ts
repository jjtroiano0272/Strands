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
  phone: numer | string,
  website: string,
  company: {
    name: string,
    catchPhrase: string,
    bs: string;
  };
}