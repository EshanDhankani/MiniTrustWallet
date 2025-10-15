import { ethers } from "ethers";
import { getRandomValues } from "expo-crypto";

let cachedProvider: ethers.providers.JsonRpcProvider | null = null;
let cachedRpcUrl: string = "";

const getProvider = (rpcUrl: string): ethers.providers.JsonRpcProvider => {
  if (cachedProvider && cachedRpcUrl === rpcUrl) {
    return cachedProvider;
  }

  cachedProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  cachedRpcUrl = rpcUrl;
  return cachedProvider;
};

export const generateMnemonic = (): string => {
  const randomBytes = getRandomValues(new Uint8Array(16));

  const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
  return mnemonic;
};

export const validateMnemonic = (mnemonic: string): boolean => {
  try {
    ethers.utils.HDNode.fromMnemonic(mnemonic.trim());
    return true;
  } catch {
    return false;
  }
};

export const derivateAddress = (mnemonic: string): string => {
  try {
    const cleanMnemonic = mnemonic.trim();

    const hdNode = ethers.utils.HDNode.fromMnemonic(cleanMnemonic);

    const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");

    return ethers.utils.getAddress(wallet.address);
  } catch (error) {
    throw new Error(`Failed to derive address: ${error}`);
  }
};

export const fetchEthBalance = async (
  address: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const provider = getProvider(rpcUrl);
    const balanceWei = await provider.getBalance(address);
    return ethers.utils.formatEther(balanceWei);
  } catch (error) {
    console.error("Balance fetch failed:", error);
    throw new Error("Failed to fetch balance");
  }
};
