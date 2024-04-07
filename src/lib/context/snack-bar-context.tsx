import {
  createContext,
  useContext,
  useState,
  useCallback,
  Fragment,
} from "react";
import ReactDOM from "react-dom";

interface SnackbarContextType {
  openSnackbar: (message: string, error?: boolean) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const openSnackbar = useCallback((message: string, error: boolean = true) => {
    setMessage(message);
    setIsError(error);
    setIsOpen(true);
    setTimeout(() => setIsOpen(false), 4000); // Auto-close after 3 seconds
  }, []);

  const snackbarElement = (
    <Fragment>
      <div
        className={`flex fixed text-sm left-0 right-0 bottom-6  mx-auto w-fit px-4 py-2 rounded-xl text-center text-white transform  transition-all  duration-700 z-[10]  items-center cursor-pointer ${
          isError ? "bg-melon" : "bg-[#5cb85c]"
        }  ${isOpen ? "bottom-[10%] md:bottom-[5%]" : "bottom-[-100px]"}`}
      >
        {message}
      </div>
    </Fragment>
  );

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(snackbarElement, document.body)}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (context === null) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};
