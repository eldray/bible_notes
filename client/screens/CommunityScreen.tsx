import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import api from "../utils/api";
import { supabase } from "../config/supabase";
import { CommunityPost } from "../utils/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CommunityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState({ content: "", scripture: "" });
  const [filter, setFilter] = useState<"all" | "scripture" | "saved">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription
    const subscription = supabase
      .channel("community_posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts" },
        (payload) => {
          console.log("Realtime event received:", payload);
          fetchPosts();
        },
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up subscription");
      supabase.removeChannel(subscription);
    };
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/community/posts", {
        params: { filter },
      });
      console.log("Fetch posts response:", {
        status: response.status,
        data: response.data,
      });
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("Invalid posts data:", response.data);
        setPosts([]);
        setError("Received invalid data from server");
        Alert.alert("Error", "Received invalid data from server");
      }
    } catch (error: any) {
      console.error("Fetch posts error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.message.includes("Network Error")) {
        setError("Network error: Unable to connect to server. Please check your connection.");
        Alert.alert("Network Error", "Unable to connect to server. Please check your network and try again.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigation.navigate("Login");
      } else {
        setError(error.response?.data?.error || "Failed to load posts");
        Alert.alert("Error", error.response?.data?.error || "Failed to load posts");
      }
    } finally {
      setLoading(false);
    }
  };

  const addPost = async () => {
    if (!newPost.content.trim()) {
      Alert.alert("Error", "Post content cannot be empty");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/community/posts", newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ content: "", scripture: "" });
    } catch (error: any) {
      console.error("Add post error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigation.navigate("Login");
      } else {
        setError(error.response?.data?.error || "Failed to create post");
        Alert.alert("Error", error.response?.data?.error || "Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!content.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }
    try {
      await api.post(`/api/community/posts/${postId}/comments`, { content });
      fetchPosts();
    } catch (error: any) {
      console.error("Add comment error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigation.navigate("Login");
      } else {
        setError(error.response?.data?.error || "Failed to add comment");
        Alert.alert("Error", error.response?.data?.error || "Failed to add comment");
      }
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      await api.put(`/api/community/posts/${postId}/like`);
      fetchPosts();
    } catch (error: any) {
      console.error("Toggle like error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigation.navigate("Login");
      } else {
        setError(error.response?.data?.error || "Failed to like post");
        Alert.alert("Error", error.response?.data?.error || "Failed to like post");
      }
    }
  };

  const toggleSave = async (postId: string) => {
    try {
      await api.put(`/api/community/posts/${postId}/save`);
      fetchPosts();
    } catch (error: any) {
      console.error("Toggle save error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigation.navigate("Login");
      } else {
        setError(error.response?.data?.error || "Failed to save post");
        Alert.alert("Error", error.response?.data?.error || "Failed to save post");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community</Text>
      <View style={styles.filters}>
        <Button title="All" onPress={() => setFilter("all")} />
        <Button title="Scripture" onPress={() => setFilter("scripture")} />
        <Button title="Saved" onPress={() => setFilter("saved")} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Share your thoughts..."
        value={newPost.content}
        onChangeText={(value) => setNewPost({ ...newPost, content: value })}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Scripture reference (optional)"
        value={newPost.scripture}
        onChangeText={(value) => setNewPost({ ...newPost, scripture: value })}
      />
      <Button
        title={loading ? "Posting..." : "Post"}
        onPress={addPost}
        disabled={loading}
      />
      {loading ? (
        <Text style={styles.infoText}>Loading posts...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text>{item.content}</Text>
              {item.scripture && (
                <Text style={styles.scripture}>{item.scripture}</Text>
              )}
              <Text>Likes: {item.likes || 0}</Text>
              <Button
                title={item.saved ? "Unsave" : "Save"}
                onPress={() => toggleSave(item.id)}
              />
              <Button title="Like" onPress={() => toggleLike(item.id)} />
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                onSubmitEditing={(e) => {
                  addComment(item.id, e.nativeEvent.text);
                  e.target.value = "";
                }}
              />
              {item.comments && Array.isArray(item.comments) ? (
                item.comments.map((comment: Comment) => (
                  <Text key={comment.id} style={styles.comment}>
                    {comment.content}
                  </Text>
                ))
              ) : (
                <Text style={styles.comment}>No comments yet.</Text>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.infoText}>No posts available.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  post: { padding: 10, borderBottomWidth: 1 },
  scripture: { fontStyle: "italic" },
  comment: { marginLeft: 20, marginTop: 5 },
  infoText: { fontSize: 16, textAlign: "center", color: "#666", marginTop: 20 },
  errorText: { fontSize: 16, textAlign: "center", color: "#FF0000", marginTop: 20 },
});

export default CommunityScreen;