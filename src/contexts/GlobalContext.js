import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { getRankingInfo, getUserInfo } from "@components/HeaderRoom";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [globalState, setGlobalState] = useState({
    user: null,
    ranking: null,
  });

  const updateGlobalState = (updates) => {
    setGlobalState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    if (session && session.user) {
      Promise.all([
        getUserInfo(session.user.email),
        getRankingInfo(session.user.email),
      ]).then(([user, ticket]) => {
        updateGlobalState({ user, ticket });
      });
    }
  }, [session]);

  return (
    <GlobalContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
