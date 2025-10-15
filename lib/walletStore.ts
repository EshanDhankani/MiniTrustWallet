import { create } from 'zustand';

interface WalletState {
  address: string | null;
  balance: string;
  mnemonic: string | null;
  isInitialized: boolean;
  setAddress: (address: string) => void;
  setBalance: (balance: string) => void;
  setMnemonic: (mnemonic: string | null) => void;
  setInitialized: (value: boolean) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: '0',
  mnemonic: null,
  isInitialized: false,
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setMnemonic: (mnemonic) => set({ mnemonic }),
  setInitialized: (value) => set({ isInitialized: value }),
  reset: () =>
    set({
      address: null,
      balance: '0',
      mnemonic: null,
      isInitialized: false,
    }),
}));