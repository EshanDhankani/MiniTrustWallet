import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useWalletStore } from "../lib/walletStore";

export const SeedDisplayScreen = ({ navigation }: any) => {
  const mnemonic = useWalletStore((state) => state.mnemonic);
  const [confirmed, setConfirmed] = useState(false);

  const words = useMemo(() => {
    if (!mnemonic) return [];
    return mnemonic.split(" ");
  }, [mnemonic]);

  if (!mnemonic || words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: No seed phrase found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Onboarding")}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = () => {
    if (!confirmed) {
      Alert.alert(
        "Warning",
        "Please confirm that you have written down your seed phrase"
      );
      return;
    }
    navigation.replace("Wallet");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Secret Recovery Phrase</Text>
      <Text style={styles.warning}>
        Never share this with anyone. Store it safely offline.
      </Text>

      <View style={styles.seedGrid}>
        {words.map((word, idx) => (
          <View key={idx} style={styles.seedWord}>
            <Text style={styles.wordIndex}>{idx + 1}</Text>
            <Text style={styles.word}>{word}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => setConfirmed(!confirmed)}
      >
        <Text style={styles.checkboxText}>
          {confirmed ? "✓" : "☐"} I have written down my seed phrase
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !confirmed && styles.buttonDisabled]}
        disabled={!confirmed}
        onPress={handleConfirm}
      >
        <Text style={styles.buttonText}>Continue to Wallet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, marginTop: 15 },
  warning: { color: "#d32f2f", marginBottom: 20, lineHeight: 20 },
  seedGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  seedWord: { width: "50%", marginBottom: 12, paddingHorizontal: 8 },
  wordIndex: { fontSize: 12, color: "#666" },
  word: { fontSize: 16, fontWeight: "bold", color: "#333" },
  checkbox: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  checkboxText: { fontSize: 16 },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
