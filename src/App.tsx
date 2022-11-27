import React, { useState } from 'react';
import UserLogin from './components/UserLogin';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';

export type SetIsLoggedIn = React.Dispatch<
  React.SetStateAction<loggedInDataType>
>;

export interface loggedInDataType {
  logUsername: string;
  isLoggedIn: boolean;
}

type AppType = () => JSX.Element;

const App: AppType = () => {
  const logUsername = sessionStorage.getItem('logUsername');

  const [loggedInData, setLoggedInData] = useState<loggedInDataType>({
    logUsername: logUsername || '',
    isLoggedIn: !!logUsername || false,
  });

  return (
    <>
      <Header />
      {loggedInData.isLoggedIn ? (
        <ChatRoom currentUser={loggedInData.logUsername} />
      ) : (
        <UserLogin setIsLoggedIn={setLoggedInData} />
      )}
    </>
  );
};

export default App;
