import { IUser } from "@/types/user";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface IUserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  authenticateUser: () => Promise<boolean>;
}

const UserContext = createContext<IUserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<IUser | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const setUser = (newUser: IUser | null) => {
    setUserState(newUser);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  const authenticateUser = async () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      return true;
    } else {
      setUser(null);
      sessionStorage.removeItem("user");
      return false;
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, authenticateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};