import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTemperature } from "../contexts/TemperatureContext";

const CallAPI: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // Array to store weather data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit } = useTemperature();

  let { searchedCity } = useLocalSearchParams();
  if (searchedCity == undefined){
    searchedCity = "Calgary";
  }

  const fetchData = async () => {
    try {
        let response;
      // Make HTTP GET request to fetch all posts
      {temperatureUnit ? (
        // if temperatureUnit is Celsius:
      response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
      )) : (
        // if temperatureUnit is Farenheit:
        response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`
        // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
      ))}

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
