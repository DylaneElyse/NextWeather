import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Button, TextInput, FlatList, TouchableOpacity } from "react-native";
import Header from "../../components/header";
import { router } from "expo-router";
import citiesData from "../../assets/worldcities current.json";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<{ city: string; lat: string; lng: string; admin_name: string; country: string; id: string }[]>([]);
  const [cities, setCities] = useState<{ city: string; lat: string; lng: string; admin_name: string; country: string; id: string }[]>([]);

  useEffect(() => {
    if (Array.isArray(citiesData)) {
      setCities(citiesData); // Store full city objects
    }
  }, []);

  // const handleNavigate = () => {
  //   router.push({
  //     pathname: "/",
  //     params: { searchedCity: "Calgary" },
  //   });
  // };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    if (query.length > 0) {
      const results = cities.filter((item) =>
        item.city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(results);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelectCity = (city: string, lat: string, lng: string) => {
    setSearchQuery(city); // Set the search query to the selected city
    setFilteredCities([]); // Hide suggestions
    console.log()
    router.push({
      pathname: "/",
      params: { searchedCityLat: lat, searchedCityLng: lng, searchedCityName: city },
    });
  };

  return (
    <View style={styles.pageContainer}>
      <Header />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Button 
          title="Go" 
          onPress={() => {
            // Find the selected city in case the user types manually
            const selectedCity = cities.find(city => city.city.toLowerCase() === searchQuery.toLowerCase());
            if (selectedCity) {
              handleSelectCity(selectedCity.city, selectedCity.lat, selectedCity.lng); // Pass lat and lng to the function
            }
          }} 
        />
      </View>
      {/* Suggestion List */}
      {filteredCities.length > 0 && (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id.toString()}
          style={styles.suggestionList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectCity(item.city, item.lat, item.lng)} // Now behaves like "Go" button
            >
              <Text style={styles.suggestionText}>
                {item.city}, {item.country}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
  },
  searchBox: {
    position: "absolute",
    top: 70, // Place near the top
    width: "90%", // Full width
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  input: {
    flex: 1, // Takes full space
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
  },
  suggestionList: {
    position: "absolute",
    top: 120, // Below search bar
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 200,
    elevation: 3,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});
