import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
} from "react";

const ErrorContext = createContext({
  error: "" as unknown,
  addError: (message: unknown) => {},
  removeError: () => {},
});

const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<unknown>("");

  const removeError = () => setError("");

  const addError = (message: unknown) => setError(message);

  const contextValue = {
    error,
    addError: useCallback((message: unknown) => addError(message), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const { error, addError, removeError } = useContext(ErrorContext);
  return { error, addError, removeError };
};

export default ErrorProvider;
