import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import api from "../utils/api";
import { Devotion } from "../utils/types";

const DailyDevotionScreen = () => {
  const [devotion, setDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDevotion();
  }, []);

  const fetchDevotion = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/devotions/today");
      // Validate response data
      if (response.data && typeof response.data === "object") {
        setDevotion(response.data);
      } else {
        throw new Error("Invalid devotion data received");
      }
    } catch (error: any) {
      console.error("Fetch devotion error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          "Failed to load devotion. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Devotion</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : devotion ? (
        <View style={styles.devotion}>
          <Text style={styles.devotionTitle}>
            {devotion.title || "No Title"}
          </Text>
          <Text style={styles.content}>{devotion.content || "No Content"}</Text>
          <Text style={styles.verse}>
            {devotion.verse?.reference
              ? `${devotion.verse.reference}: ${devotion.verse.text}`
              : "No Verse Available"}
          </Text>
        </View>
      ) : (
        <Text>No devotion available for today.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  devotion: { padding: 10 },
  devotionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  content: { marginBottom: 10 },
  verse: { fontStyle: "italic" },
});

export default DailyDevotionScreen;
