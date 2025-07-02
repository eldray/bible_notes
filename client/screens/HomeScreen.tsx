// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import api from "../utils/api";
import { CommunityPost } from "../utils/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [recentPosts, setRecentPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/community/posts", {
          params: { limit: 5 },
        });
        console.log("API Response:", {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });
        if (Array.isArray(response.data)) {
          setRecentPosts(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setError("Failed to load posts: Invalid data format received from server.");
        }
      } catch (error: any) {
        console.error("Failed to load recent posts:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        if (error.response?.status === 401) {
          navigation.navigate("Login");
        } else {
          setError("Failed to load recent posts. Please check your network or try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FaithfulNotes</Text>
      <Button
        title="Bible Reading"
        onPress={() => navigation.navigate("BibleReading")}
      />
      <Button
        title="Concordance"
        onPress={() => navigation.navigate("Concordance")}
      />
      <Button
        title="Themes"
        onPress={() => navigation.navigate("BibleThemes")}
      />
      <Button
        title="Sermon Notes"
        onPress={() => navigation.navigate("SermonNotes")}
      />
      <Button
        title="Community"
        onPress={() => navigation.navigate("Community")}
      />
      <Button
        title="Daily Devotion"
        onPress={() => navigation.navigate("DailyDevotion")}
      />
      <Button
        title="Bookmarks"
        onPress={() => navigation.navigate("Bookmarks")}
      />
      <Button
        title="Highlights"
        onPress={() => navigation.navigate("Highlights")}
      />
      <Button title="Profile" onPress={() => navigation.navigate("Profile")} />
      <Text style={styles.subTitle}>Recent Community Posts</Text>
      {loading ? (
        <Text style={styles.infoText}>Loading posts...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : recentPosts.length === 0 ? (
        <Text style={styles.infoText}>No recent posts available.</Text>
      ) : (
        recentPosts.map((post) => (
          <Text key={post.id} style={styles.post}>
            {post.content}
          </Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  subTitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  post: { padding: 10, borderBottomWidth: 1 },
  infoText: { fontSize: 16, textAlign: "center", color: "#666" },
  errorText: { fontSize: 16, textAlign: "center", color: "#FF0000" },
});

export default HomeScreen;