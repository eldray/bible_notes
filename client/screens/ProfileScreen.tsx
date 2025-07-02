import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Use modern Picker
import { useAuth } from "../context/AuthContext"; // Use useAuth hook
import api from "../utils/api";
import { User } from "../utils/types";

const ProfileScreen = () => {
  const { user, logout } = useAuth(); // Use useAuth instead of useContext directly
  const [profile, setProfile] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    churchName: "",
    churchBranch: "",
    denomination: "Baptist",
    role: "Member",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const denominations = [
    "Baptist",
    "Catholic",
    "Pentecostal",
    "Methodist",
    "Presbyterian",
    "Lutheran",
    "Anglican",
    "Non-Denominational",
    "Other",
  ];
  const roles = [
    "Pastor",
    "Elder",
    "Deacon",
    "Member",
    "Youth Leader",
    "Worship Leader",
    "Teacher",
    "Other",
  ];

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        churchName: user.churchName || "",
        churchBranch: user.churchBranch || "",
        denomination: user.denomination || "Baptist",
        role: user.role || "Member",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update your profile.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.patch("/api/auth/profile", profile);
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully.");
        setProfile(response.data);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error: any) {
      console.error("Profile update error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={profile.firstName || ""}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, firstName: value }))
            }
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={profile.lastName || ""}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, lastName: value }))
            }
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={profile.phoneNumber || ""}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, phoneNumber: value }))
            }
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Church Name"
            value={profile.churchName || ""}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, churchName: value }))
            }
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Church Branch (Optional)"
            value={profile.churchBranch || ""}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, churchBranch: value }))
            }
            autoCapitalize="words"
          />
          <View
            style={[
              styles.pickerContainer,
              Platform.OS === "ios" && styles.pickerIOS,
            ]}
          >
            <Picker
              selectedValue={profile.denomination || "Baptist"}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev, denomination: value }))
              }
              style={styles.picker}
            >
              {denominations.map((denom) => (
                <Picker.Item key={denom} label={denom} value={denom} />
              ))}
            </Picker>
          </View>
          <View
            style={[
              styles.pickerContainer,
              Platform.OS === "ios" && styles.pickerIOS,
            ]}
          >
            <Picker
              selectedValue={profile.role || "Member"}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev, role: value }))
              }
              style={styles.picker}
            >
              {roles.map((role) => (
                <Picker.Item key={role} label={role} value={role} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio (Optional)"
            value={profile.bio || ""}
            onChangeText={(value) =>
              setProfile((prev) => ({ ...prev, bio: value }))
            }
            multiline
            numberOfLines={4}
          />
          <Button
            title={loading ? "Updating..." : "Update Profile"}
            onPress={handleUpdate}
            disabled={loading}
          />
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text style={styles.errorText}>
          Please log in to view your profile.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
  },
  pickerIOS: {
    height: 150,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
