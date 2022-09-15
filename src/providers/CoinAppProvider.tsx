import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { getCoinApp } from "../core/CoinApp";

export type CoinAppContextType = ReturnType<typeof getCoinApp>;
const CoinsAppContext = createContext({} as any as CoinAppContextType);

export const CoinsAppProvider = ({ children }: { children: ReactNode }) => {
  const coinApp = useMemo(() => getCoinApp(), []);

  return (
    <CoinsAppContext.Provider value={coinApp}>
      {children}
    </CoinsAppContext.Provider>
  );
};

export const useCoinsAppContext = () => {
  const coinstApp = useContext(CoinsAppContext);
  return coinstApp;
};
