import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useWalletStore } from "../lib/walletStore";
import { useSecureStorage } from "../lib/useSecureStorage";
import {
  generateMnemonic,
  validateMnemonic,
  derivateAddress,
} from "../lib/walletUtils";

export const OnboardingScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<"create" | "import">("create");
  const [importText, setImportText] = useState("");
  const [loading, setLoading] = useState(false);

  const setMnemonic = useWalletStore((state) => state.setMnemonic);
  const setAddress = useWalletStore((state) => state.setAddress);
  const setInitialized = useWalletStore((state) => state.setInitialized);
  const { saveMnemonic } = useSecureStorage();

  const handleCreateWallet = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const mnemonic = generateMnemonic();
      setMnemonic(mnemonic);

      const address = derivateAddress(mnemonic);
      setAddress(address);

      await saveMnemonic(mnemonic);
      setInitialized(true);

      navigation.replace("SeedDisplay");
    } catch (error) {
      console.error("Error in handleCreateWallet:", error);
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    setMnemonic,
    setAddress,
    setInitialized,
    saveMnemonic,
    navigation,
  ]);

  const handleImportWallet = useCallback(async () => {
    if (loading) return;

    if (!importText.trim()) {
      Alert.alert("Error", "Please enter a seed phrase");
      return;
    }

    if (!validateMnemonic(importText)) {
      Alert.alert("Error", "Invalid seed phrase");
      return;
    }

    try {
      setLoading(true);
      const address = derivateAddress(importText);
      setMnemonic(importText);
      setAddress(address);
      await saveMnemonic(importText);
      setInitialized(true);
      setImportText("");
      Alert.alert("Success", "Wallet imported successfully");
      navigation.replace("Wallet");
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    importText,
    setMnemonic,
    setAddress,
    setInitialized,
    saveMnemonic,
    navigation,
  ]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mini Trust Wallet</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "create" && styles.activeTab]}
          onPress={() => setTab("create")}
          disabled={loading}
        >
          <Text style={styles.tabText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "import" && styles.activeTab]}
          onPress={() => setTab("import")}
          disabled={loading}
        >
          <Text style={styles.tabText}>Import</Text>
        </TouchableOpacity>
      </View>

      {tab === "create" ? (
        <View style={styles.tabContent}>
          <Text style={styles.description}>
            Create a new wallet with a randomly generated 12-word seed phrase
          </Text>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateWallet}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Generate New Wallet</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tabContent}>
          <Text style={styles.description}>
            Import an existing wallet using your 12 or 24-word seed phrase
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your seed phrase..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            value={importText}
            onChangeText={setImportText}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleImportWallet}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Import Wallet</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 15,
    textAlign: "center",
  },
  tabContainer: { flexDirection: "row", marginBottom: 20 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: { borderBottomColor: "#007AFF" },
  tabText: { textAlign: "center", fontSize: 16, fontWeight: "bold" },
  tabContent: { marginBottom: 32 },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    fontSize: 14,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#ccc", opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
