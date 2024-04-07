/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, signOutUser } from "@/utils/firebase";
import { useRouter } from "next/router";
import { PROTECTED_ROUTES, UNPROTECTED_ROUTES } from "@/utils/constants";
import { PAGE } from "@/utils/enums";
import ReactDOM from "react-dom";

import UserIcon from "@/components/common/icons/user";
import { useSnackbar } from "./snack-bar-context";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        if (UNPROTECTED_ROUTES.includes(router.pathname as PAGE)) {
          router.push(PAGE.HOME);
        }
      } else {
        if (PROTECTED_ROUTES.includes(router.pathname as PAGE)) {
          router.push(PAGE.LOGIN);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router.pathname]);

  const signOut = async () => {
    try {
      await signOutUser();
      router.push(PAGE.LOGIN);
      openSnackbar("Logged out Successfully", false);
    } catch (error: any) {}
  };

  const logoutButton = (
    <Fragment>
      {user && (
        <div
          onClick={signOut}
          className={`flex fixed text-sm left-6 bottom-6  mx-auto w-fit px-4 py-2 rounded-xl text-center text-white transform  transition-all  duration-700 z-[10] bg-primary items-center cursor-pointer`}
        >
          <UserIcon className="mr-2" />
          Log Out
        </div>
      )}
    </Fragment>
  );

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(logoutButton, document.body)}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
