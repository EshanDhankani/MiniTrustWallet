# MiniTrustWallet

# Architecture Notes
# Security
Mnemonic Storage: Stored in iOS Keychain / Android Keystore (expo-secure-store)
Address Derivation: BIP-44 standard path (m/44'/60'/0'/0/0)
Checksum: EIP-55 checksummed addresses (ethers.js auto-applies)
No Private Key Export: Private key only exists in memory during derive, never persisted

# State Management

Zustand Store: Holds address, balance, mnemonic (non-sensitive copy for display)
Secure Storage: Mnemonic only fetched on app boot, saved immediately

# Balance Fetching

Provider: ethers.JsonRpcProvider via LlamaRPC
Refresh: Auto-refresh every 15 seconds in WalletScreen
Manual Refresh: User can tap Refresh button

# QR Code

react-native-qrcode-svg: Generates scannable QR from address
No external API calls


# Out-of-Time Checklist
If time is running out, prioritize in this order:
Must-Have (Core MVP)
 Onboarding: create + import flows
 Wallet: address + QR + balance display
 Settings: reveal seed + reset
 Secure storage (Keychain/Keystore)
 BIP-44 derivation + EIP-55 checksum
