import * as SecureStore from 'expo-secure-store';

export const useSecureStorage = () => {
  const saveMnemonic = async (mnemonic: string) => {
    await SecureStore.setItemAsync('eth_mnemonic', mnemonic);
  };

  const getMnemonic = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('eth_mnemonic');
  };

  const deleteMnemonic = async () => {
    await SecureStore.deleteItemAsync('eth_mnemonic');
  };

  const hasMnemonic = async (): Promise<boolean> => {
    const mnemonic = await getMnemonic();
    return mnemonic !== null;
  };

  return { saveMnemonic, getMnemonic, deleteMnemonic, hasMnemonic };
};