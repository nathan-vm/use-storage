import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { stringifyOrKepOriginal, tryParseJSON } from './utils/parseJson';

interface IStorageContext {
  getItem: <T = string>(key: string) => T | null;
  setItem: (key: string, value: any) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

type StorageMemory<T = unknown> = Record<string, T>;

const defaultStorageState = {
  getItem: (_k: string) => null,
  setItem: (_k: string, _v: string | object) => {},
  removeItem: (_k: string) => {},
  clear: () => {},
};

const StorageContext = createContext<IStorageContext>(defaultStorageState);

export function useStorage(): IStorageContext {
  const context = useContext(StorageContext);

  return context;
}

export const StorageProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [storageMemory, setStorageMemory] = useState<StorageMemory>({});

  const getItem = useCallback(
    function <T = string | null>(key: string) {
      if (key in storageMemory) {
        return storageMemory[key] as T;
      }
      const rawValue = localStorage.getItem(key);
      if (rawValue) {
        const value = tryParseJSON<T>(rawValue);
        setStorageMemory((s) => ({ ...s, [key]: value }));
        return value as T;
      }
      return null;
    },
    [storageMemory, setStorageMemory]
  );

  const setItem = useCallback(
    function (key: string, value: any) {
      setStorageMemory((s) => ({ ...s, [key]: value }));
      localStorage.setItem(key, stringifyOrKepOriginal(value));
    },
    [setStorageMemory]
  );

  const clear = useCallback(() => {
    setStorageMemory({});
    localStorage.clear();
  }, [setStorageMemory]);

  const removeItem = useCallback(
    (key: string) => {
      const store = { ...storageMemory };
      delete store[key];
      setStorageMemory(store);
      localStorage.removeItem(key);
    },
    [storageMemory, setStorageMemory]
  );

  const value: IStorageContext = {
    getItem,
    setItem,
    clear,
    removeItem,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};
