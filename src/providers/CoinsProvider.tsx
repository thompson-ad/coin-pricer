import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
} from "react";
import { ICoin } from "../core/Coins";

const CoinsContext = createContext({
  coins: [] as ICoin[],
  addCoins: (coins: ICoin[]) => {},
});

const CoinsProvider = ({ children }: { children: ReactNode }) => {
  const [coins, setCoins] = useState<ICoin[]>([]);

  const addCoins = (coins: ICoin[]) => setCoins(coins);

  const contextValue = {
    coins,
    addCoins: useCallback((coins: ICoin[]) => addCoins(coins), []),
  };

  return (
    <CoinsContext.Provider value={contextValue}>
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoinsContext = () => {
  const { coins, addCoins } = useContext(CoinsContext);
  return { coins, addCoins };
};

export default CoinsProvider;
