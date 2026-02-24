import { createContext, useContext } from "react";

type NavigationContextValue = {
  navigate: (screen: string) => void;
  currentScreen: string;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const useNavigation = () => useContext(NavigationContext);

export { NavigationContext, useNavigation };
