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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };

  const authenticateUser = async () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);      return true;
    } else {
      setUser(null);
      sessionStorage.removeItem("user");
      return false;
    }
  };

  const updateUserProfile = async () => {
    try {
      const profileData = await userService.getProfile();
      
      if (user) {
        const updatedUser = {
          ...user,
          avatarUrl: profileData.avatarUrl,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          role: profileData.role
        };
        setUser(updatedUser);
        
        // Aktualizuj localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
        // Jeśli błąd jest związany z tokenem (401/403), wyloguj użytkownika
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          console.log('Token seems invalid, logging out...');
          logout();
          return;
        }
      }
      
      // Nie rzucaj błędu dalej - po prostu zaloguj i kontynuuj
      console.warn('Profile update failed, but continuing with existing user data');
    }
  };

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