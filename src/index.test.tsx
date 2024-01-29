import * as React from 'react';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StorageProvider, useStorage } from './index';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('StorageProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get item from storageMemory and localStorage', () => {
    render(
      <StorageProvider>
        <ComponentUsingStorage />
      </StorageProvider>
    );

    const input = screen.getByTestId('input');
    const setButton = screen.getByTestId('set-button');
    const getButton = screen.getByTestId('get-button');

    act(() => {
      userEvent.type(input, 'TestValue');
      userEvent.click(setButton);
      userEvent.click(getButton);
    });

    expect(screen.getByTestId('result').textContent).toBe('TestValue');
  });

  it('should return null for getItem when key is not in storageMemory or localStorage', () => {
    render(
      <StorageProvider>
        <ComponentUsingStorage />
      </StorageProvider>
    );

    const getButton = screen.getByTestId('get-button');

    act(() => {
      userEvent.click(getButton);
    });

    expect(screen.getByTestId('result').textContent).toBe('null');
  });
});

const ComponentUsingStorage = () => {
  const { getItem, setItem } = useStorage();
  const [inputValue, setInputValue] = React.useState('');
  const [result, setResult] = React.useState('');

  const handleSetItem = () => {
    setItem('testKey', inputValue);
  };

  const handleGetItem = () => {
    const value = getItem('testKey');
    setResult(String(value));
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        data-testid="input"
      />
      <button onClick={handleSetItem} data-testid="set-button">
        Set Item
      </button>
      <button onClick={handleGetItem} data-testid="get-button">
        Get Item
      </button>
      <div data-testid="result">{result}</div>
    </div>
  );
};

