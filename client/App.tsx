import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import BibleReadingScreen from './screens/BibleReadingScreen';
import ConcordanceScreen from './screens/ConcordanceScreen';
import BibleThemesScreen from './screens/BibleThemesScreen';
import SermonNotesScreen from './screens/SermonNotesScreen';
import CommunityScreen from './screens/CommunityScreen';
import DailyDevotionScreen from './screens/DailyDevotionScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import HighlightsScreen from './screens/HighlightsScreen';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: string }> {
  state = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong: {this.state.error}</Text>
          <Text style={styles.errorText}>Please restart the app or contact support.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="BibleReading" component={BibleReadingScreen} />
            <Stack.Screen name="Concordance" component={ConcordanceScreen} />
            <Stack.Screen name="BibleThemes" component={BibleThemesScreen} />
            <Stack.Screen name="SermonNotes" component={SermonNotesScreen} />
            <Stack.Screen name="Community" component={CommunityScreen} />
            <Stack.Screen name="DailyDevotion" component={DailyDevotionScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
            <Stack.Screen name="Highlights" component={HighlightsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: '#FF0000', textAlign: 'center', marginBottom: 10 },
});

export default App;
