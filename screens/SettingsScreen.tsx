import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useWalletStore } from "../lib/walletStore";
import { useSecureStorage } from "../lib/useSecureStorage";

export const SettingsScreen = ({ navigation }: any) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const reset = useWalletStore((state) => state.reset);
  const { deleteMnemonic } = useSecureStorage();
  const [showSeed, setShowSeed] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleRevealSeed = useCallback(() => {
    if (!mnemonic) {
      Alert.alert("Error", "No seed phrase found");
      return;
    }

    Alert.alert(
      "Warning",
      "Your seed phrase will be visible. Make sure no one is watching.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reveal",
          onPress: () => setShowSeed(true),
          style: "destructive",
        },
      ]
    );
  }, [mnemonic]);

  const handleReset = useCallback(async () => {
    Alert.alert(
      "Reset Wallet?",
      "This will delete your wallet. Make sure you have backed up your seed phrase.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: async () => {
            try {
              setResetting(true);
              await deleteMnemonic();
              reset();
              navigation.replace("Onboarding");
            } finally {
              setResetting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  }, [deleteMnemonic, reset, navigation]);

  const handleHideSeed = useCallback(() => {
    setShowSeed(false);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {!showSeed ? (
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleRevealSeed}
          disabled={resetting}
        >
          <Text style={styles.buttonText}>Reveal Seed Phrase</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.seedBox}>
          <Text style={styles.seedLabel}>Your Seed Phrase:</Text>
          <Text style={styles.seedText}>
            {mnemonic || "No seed phrase found"}
          </Text>
          <TouchableOpacity
            style={styles.hideButton}
            onPress={handleHideSeed}
            disabled={resetting}
          >
            <Text style={styles.buttonText}>Hide</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.resetButton, resetting && styles.buttonDisabled]}
        onPress={handleReset}
        disabled={resetting}
      >
        <Text style={styles.buttonText}>
          {resetting ? "Resetting..." : " Reset Wallet"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        disabled={resetting}
      >
        <Text style={styles.backButtonText}> Back to Wallet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 25, marginTop: 26 },
  dangerButton: {
    backgroundColor: "#FF6B6B",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  seedBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: "#d32f2f",
    borderWidth: 2,
  },
  seedLabel: { fontWeight: "bold", marginBottom: 8 },
  seedText: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 12,
  },
  hideButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  backButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
