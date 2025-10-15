import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { useWalletStore } from "../lib/walletStore";
import { fetchEthBalance } from "../lib/walletUtils";

export const WalletScreen = ({ navigation }: any) => {
  const address = useWalletStore((state) => state.address);
  const balance = useWalletStore((state) => state.balance);
  const setBalance = useWalletStore((state) => state.setBalance);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rpcUrl = process.env.EXPO_PUBLIC_ETH_RPC_URL || "";

  const isMountedRef = useRef(true);

  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  const isRpcConfigured = useMemo(() => !!rpcUrl, [rpcUrl]);

  const loadBalance = async () => {
    if (!isMountedRef.current) return;

    if (!address || !isRpcConfigured) {
      if (isMountedRef.current) {
        setError("RPC URL not configured");
        setLoading(false);
      }
      return;
    }

    try {
      console.log("Fetching balance for:", address);
      console.log("Using RPC:", rpcUrl);

      if (isMountedRef.current) setLoading(true);

      const bal = await fetchEthBalance(address, rpcUrl);

      console.log("Balance fetched successfully:", bal, "ETH");

      if (isMountedRef.current) {
        setBalance(bal);
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      console.error(" Balance fetch failed:", err);
      if (isMountedRef.current) {
        console.log("Setting balance to 0.0000 (RPC unavailable)");
        setBalance("0.0000");
        setError(null);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadBalance();

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        loadBalance();
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [address, isRpcConfigured]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const copyAddress = async () => {
    if (address) {
      try {
        await Clipboard.setStringAsync(address);
        Alert.alert("Copied", "Address copied to clipboard");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  if (!address) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: No wallet found</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.replace("Onboarding")}
        >
          <Text style={styles.settingsButtonText}>Create Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wallet</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.address}>{address}</Text>

        <View style={styles.qrContainer}>
          <QRCode value={address} size={200} />
        </View>

        <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
          <Text style={styles.copyButtonText}> Copy Address</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Balance</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.balance}>
            {balance ? parseFloat(balance).toFixed(4) : "0.0000"} ETH
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.refreshButton,
            loading && styles.refreshButtonDisabled,
          ]}
          onPress={loadBalance}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? "Loading..." : " Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.settingsButtonText}> Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, marginTop:36 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  label: { fontSize: 12, color: "#666", marginTop: 16, marginBottom: 8 },
  address: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  qrContainer: { alignItems: "center", marginVertical: 20 },
  copyButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  copyButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  balance: { fontSize: 32, fontWeight: "bold", color: "#333" },
  error: { color: "#d32f2f", fontSize: 14 },
  refreshButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  refreshButtonDisabled: { backgroundColor: "#ccc", opacity: 0.6 },
  refreshButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  settingsButton: {
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  settingsButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
