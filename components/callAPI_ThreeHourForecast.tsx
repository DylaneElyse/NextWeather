import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

/**
 * CallAPI Component
 * Purpose: Fetches and displays weather forecast from OpenWeatherMap API
 * Features: Loading states, error handling, data display
 */
const CallAPI: React.FC = () => {
  // State management for API data and UI states
  const [data, setData] = useState<any[]>([]); // Array to store weather data
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track any errors

  let { searchedCity } = useLocalSearchParams();
  if (searchedCity == undefined){
    searchedCity = "Calgary";
  }

  /**
   * fetchData Function
   * Purpose: Fetch posts from JSONPlaceholder API
   * Returns: Promise<void>
   */
  const fetchData = async () => {
    try {
      // Make HTTP GET request to fetch all posts
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts${process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY}`
        // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
      );

      // Check if the response was successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse JSON response
      const result = await response.json();

      // Update data state with received posts
      setData(result);
    } catch (error) {
      // Handle errors appropriately
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      // Always set loading to false after request completion
      setLoading(false);
    }
  };

  /**
   * useEffect Hook
   * Purpose: Fetch data when component mounts
   * Dependencies: Empty array means runs only once on mount
   */
  useEffect(() => {
    fetchData();
  }, []);

  // Render loading state
  if (loading) return <Text>Loading...</Text>;

  // Render error state
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>

    </View>
  );
};

export default CallAPI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  post: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  id: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  body: {
    fontSize: 14,
    color: "#666",
  },
});
