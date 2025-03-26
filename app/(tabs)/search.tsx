import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Button, TextInput, FlatList, TouchableOpacity } from "react-native";
import Header from "../../components/header";
import { router } from "expo-router";
import citiesData from "../../assets/searchableCities.json";
// import { TextInput } from "react-native-gesture-handler";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(citiesData)) {
      const cityNames = citiesData.map((item) => item.city); // Extract city names
      setCities(cityNames);
    }
  }, []);

  const handleNavigate = () => {
    router.push({
      pathname: "/",
      params: { searchedCity: "Calgary" },
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      const results = cities.filter((city) =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(results);
    }
    else{
      setFilteredCities([]);
    }
  };

  const handleSelectCity = (city: string) => {
    setSearchQuery(city);
    setFilteredCities([]); // Hide suggestions
    router.push({
      pathname: "/",
      params: { searchedCity: city },
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.searchBox}>
      <TextInput 
        style={styles.input}
        placeholder="Search for a city"
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={handleSearch}/>
      <Button title="Search" onPress={() => handleSelectCity(searchQuery)} />
      </View>
      {/* Suggestion List */}
      {filteredCities.length > 0 && (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item}
          style={styles.suggestionList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectCity(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e8ff",
    alignItems: "center",
    paddingTop: 150, // Push content down
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
