import { createContext, useContext, useState, ReactNode } from 'react';

type ContactDialogContextValue = {
  isOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactDialogContext = createContext<ContactDialogContextValue | undefined>(undefined);

export const ContactDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContactDialogContext.Provider
      value={{
        isOpen,
        openContact: () => setIsOpen(true),
        closeContact: () => setIsOpen(false),
      }}
    >
      {children}
    </ContactDialogContext.Provider>
  );
};

export const useContactDialog = () => {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) throw new Error('useContactDialog must be used within ContactDialogProvider');
  return ctx;
};
