import React, { createContext, useState, useContext, ReactNode } from 'react';

type BannerType = 'success' | 'error' | 'info';

interface BannerContextType {
  showBanner: (message: string, type: BannerType) => void;
  hideBanner: () => void;
  message: string | null;
  type: BannerType | null;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export function BannerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<BannerType | null>(null);

  const showBanner = (message: string, type: BannerType) => {
    setMessage(message);
    setType(type);
    setTimeout(() => {
      hideBanner();
    }, 3000);
  };

  const hideBanner = () => {
    setMessage(null);
    setType(null);
  };

  return (
    <BannerContext.Provider value={{ showBanner, hideBanner, message, type }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
} 