import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContextType } from '../@types/types';

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log(`\x1b[32mUser logged ${isLoggedIn ? 'in!' : 'out!'}`);
  }, [isLoggedIn]);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
