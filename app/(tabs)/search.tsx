import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Header from "../../components/header"; 
import { router } from "expo-router";
import citiesData from "../../assets/worldcities current.json"; 
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from "../../contexts/AuthContext"; 
import { supabase } from "../../lib/supabase";

// --- Helper function to normalize strings (remove diacritics, lowercase) ---
const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD') // Decompose characters into base + combining marks (e.g., 'é' -> 'e' + '\u0301')
    .replace(/[\u0300-\u036f]/g, '') // Remove the combining diacritical marks
    .toLowerCase(); // Convert to lowercase
};

type City = {
  city: string;
  normalizedCity: string;
  lat: string;
  lng: string;
  admin_name: string;
  country: string;
  id: string;
};

// Helper function to create a unique key string from lat/lng
const createLatLngKey = (lat: string | number, lng: string | number): string | null => {
    const numLat = typeof lat === 'string' ? parseFloat(lat) : lat;
    const numLng = typeof lng === 'string' ? parseFloat(lng) : lng;
    if (isNaN(numLat) || isNaN(numLng)) {
        console.warn(`[createLatLngKey] Invalid lat/lng pair: ${lat}, ${lng}`);
        return null;
    }
    return `${numLat.toFixed(6)},${numLng.toFixed(6)}`;
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [cities, setCities] = useState<City[]>([]); // Will store cities with normalized names
  const { session, user, loading: isAuthLoading } = useAuth();
  const isLoggedIn = !!session && !!user;

  const [favoriteLatLongs, setFavoriteLatLongs] = useState<Set<string>>(new Set());
  const [isFetchingFavorites, setIsFetchingFavorites] = useState(false);
  const [togglingFavoriteCityId, setTogglingFavoriteCityId] = useState<string | null>(null);

  // --- Fetch initial favorites ---
  const fetchUserFavorites = useCallback(async () => {
    console.log("[fetchUserFavorites] Starting fetch...");
    if (!user) {
      console.log("[fetchUserFavorites] No user found, clearing local favorites.");
      setFavoriteLatLongs(new Set());
      return;
    }
    console.log("[fetchUserFavorites] User found:", user.id);
    setIsFetchingFavorites(true);
    try {
      const { data, error, status } = await supabase
        .from('user_favorites')
        .select('favorite_lat, favorite_long') // Select the coordinates
        .eq('id', user.id); // Filter by user ID in the 'id' column

      console.log("[fetchUserFavorites] Supabase response status:", status);
      if (error) {
        console.error("[fetchUserFavorites] Supabase error:", error);
        throw error;
      }

      if (data) {
        console.log("[fetchUserFavorites] Received data:", data);
        const latLngKeys = new Set<string>();
        data.forEach(fav => {
          const key = createLatLngKey(fav.favorite_lat, fav.favorite_long);
          if (key) {
            latLngKeys.add(key);
          } else {
            console.warn("[fetchUserFavorites] Invalid key skipped for fav:", fav);
          }
        });
        setFavoriteLatLongs(latLngKeys);
        console.log("[fetchUserFavorites] Updated local state:", latLngKeys);
      } else {
        console.log("[fetchUserFavorites] No favorite data received.");
        setFavoriteLatLongs(new Set()); // Ensure state is empty if no data
      }
    } catch (error: any) {
      console.error("[fetchUserFavorites] Caught error:", error.message);
      Alert.alert("Error", "Could not load your favorite cities.");
      setFavoriteLatLongs(new Set()); // Reset on error
    } finally {
      console.log("[fetchUserFavorites] Fetch finished.");
      setIsFetchingFavorites(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchUserFavorites();
    } else {
        setFavoriteLatLongs(new Set());
    }
  }, [user, fetchUserFavorites]);

  useEffect(() => {
    console.log("[useEffect Cities] Loading and normalizing cities data...");
    if (Array.isArray(citiesData)) {
       const validatedCities: City[] = citiesData.map((item: any, index: number) => {
        const originalCityName = item.city || 'Unknown City';
        return {
          city: originalCityName,
          normalizedCity: normalizeString(originalCityName), // Add normalized name
          lat: String(item.lat || '0'),
          lng: String(item.lng || '0'),
          admin_name: item.admin_name || 'N/A',
          country: item.country || 'Unknown Country',
          id: String(item.id || `city_${index}`),
        };
       });
      setCities(validatedCities);
      console.log(`[useEffect Cities] Loaded and processed ${validatedCities.length} cities.`);
    } else {
       console.error("[useEffect Cities] citiesData is not an array:", citiesData);
       setCities([]);
    }
  }, []); 

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const normalizedQuery = normalizeString(query); // Normalize the input query

    if (normalizedQuery.length > 0) {
        // Filter using the pre-calculated normalizedCity field
        const results = cities.filter((item) =>
            item.normalizedCity.includes(normalizedQuery)
        );
        setFilteredCities(results);
    } else {
        setFilteredCities([]);
    }
  };

  const handleSelectCity = (city: City) => {
     console.log("[handleSelectCity] Navigating with city:", city.city);
      setSearchQuery(city.city); // Display the original name in the search bar
      setFilteredCities([]);
      router.push({
          pathname: "/",
          params: { searchedCityLat: city.lat, searchedCityLng: city.lng, searchedCityName: city.city },
      });
  };


  const handleFavoriteToggle = async (city: City) => {
    console.log("--- [handleFavoriteToggle] START ---");
    console.log("[handleFavoriteToggle] City:", city.city, "ID:", city.id, "Coords:", city.lat, city.lng);

    if (!isLoggedIn || !user) {
      console.warn("[handleFavoriteToggle] User not logged in or user object missing.");
      Alert.alert(
        "Login Required",
        "You need to be logged in to manage favorites.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push('/LoginScreen') } 
        ]
      );
      return;
    }
    console.log("[handleFavoriteToggle] User is logged in. User ID:", user.id);

    if (togglingFavoriteCityId) {
      console.warn("[handleFavoriteToggle] Already processing another favorite toggle, returning.");
      return;
    }

    const cityLatStr = city.lat;
    const cityLngStr = city.lng;
    const cityLat = parseFloat(cityLatStr);
    const cityLng = parseFloat(cityLngStr);
    const latLngKey = createLatLngKey(cityLat, cityLng);

    console.log(`[handleFavoriteToggle] Parsing Coords: Input (${cityLatStr}, ${cityLngStr}), Parsed (${cityLat}, ${cityLng})`);
    console.log(`[handleFavoriteToggle] Generated LatLng Key: ${latLngKey}`);

    if (isNaN(cityLat) || isNaN(cityLng) || !latLngKey) {
        console.error("[handleFavoriteToggle] Invalid coordinates or key generation failed.");
        Alert.alert("Error", "Invalid city coordinates. Cannot save favorite.");
        return;
    }

    setTogglingFavoriteCityId(city.id);

    const userId = user.id;
    const isCurrentlyFavorite = favoriteLatLongs.has(latLngKey);
    console.log(`[handleFavoriteToggle] Is Currently Favorite (local state check): ${isCurrentlyFavorite}`);

    try {
      if (isCurrentlyFavorite) {
        console.log("[handleFavoriteToggle] Attempting to DELETE favorite:", { id: userId, favorite_lat: cityLat, favorite_long: cityLng });
        const { error: deleteError, status: deleteStatus } = await supabase
          .from('user_favorites')
          .delete()
          .match({ id: userId, favorite_lat: cityLat, favorite_long: cityLng });

        console.log("[handleFavoriteToggle] Supabase DELETE response status:", deleteStatus);
        if (deleteError) {
            console.error("[handleFavoriteToggle] Supabase DELETE Error:", deleteError);
            throw deleteError;
        }
        console.log("[handleFavoriteToggle] DELETE successful.");
        setFavoriteLatLongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(latLngKey);
          console.log("[handleFavoriteToggle] Local state updated (removed):", newSet);
          return newSet;
        });
      } else {
        const favData = { id: userId, favorite_lat: cityLat, favorite_long: cityLng };
        console.log("[handleFavoriteToggle] Attempting to INSERT favorite:", favData);
        const { error: insertError, status: insertStatus } = await supabase
          .from('user_favorites')
          .insert(favData);

        console.log("[handleFavoriteToggle] Supabase INSERT response status:", insertStatus);
        if (insertError) {
            console.error("[handleFavoriteToggle] Supabase INSERT Error:", insertError);
            if (insertError.code === '23505') { // Handle duplicate
                console.warn("[handleFavoriteToggle] Favorite already exists (unique constraint violation). Forcing UI sync.");
                if (!favoriteLatLongs.has(latLngKey)) {
                    setFavoriteLatLongs(prev => {
                        const newSet = new Set(prev);
                        newSet.add(latLngKey);
                        console.log("[handleFavoriteToggle] Local state force-updated (added on duplicate):", newSet);
                        return newSet;
                    });
                }
            } else {
                throw insertError; // Rethrow other errors
            }
        } else {
            console.log("[handleFavoriteToggle] INSERT successful.");
            setFavoriteLatLongs(prev => {
                const newSet = new Set(prev);
                newSet.add(latLngKey);
                console.log("[handleFavoriteToggle] Local state updated (added):", newSet);
                return newSet;
            });
        }
      }
    } catch (error: any) {
      console.error("--- [handleFavoriteToggle] Error Caught ---");
      console.error("[handleFavoriteToggle] Error Details:", error);
      Alert.alert("Database Error", `Could not ${isCurrentlyFavorite ? 'remove' : 'add'} favorite. Please try again.`);
    } finally {
      console.log("--- [handleFavoriteToggle] FINALLY ---");
      setTogglingFavoriteCityId(null);
    }
  };


  const renderSuggestionItem = ({ item }: { item: City }) => {
    const itemLatLngKey = createLatLngKey(item.lat, item.lng);
    const isFavorite = itemLatLngKey ? favoriteLatLongs.has(itemLatLngKey) : false;
    const isLoadingToggle = togglingFavoriteCityId === item.id;

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectCity(item)}
        disabled={isLoadingToggle}
      >
        <View style={styles.suggestionItemContent}>
          {!isAuthLoading && isLoggedIn && itemLatLngKey && (
             <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); handleFavoriteToggle(item); }}
              style={styles.starButton}
              disabled={isAuthLoading || isFetchingFavorites || isLoadingToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isLoadingToggle ? (
                <ActivityIndicator size="small" color="#FFD700" />
              ) : (
                <FontAwesome
                  name={isFavorite ? "star" : "star-o"}
                  size={20}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              )}
            </TouchableOpacity>
          )}
          {(isAuthLoading || (isLoggedIn && !itemLatLngKey)) && <View style={styles.starPlaceholder} />}
          {/* Display the original city name */}
          <Text style={styles.suggestionText} numberOfLines={1} ellipsizeMode="tail">
            {item.city}, {item.country}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
               autoCorrect={false}
               autoCapitalize="words"
               editable={!isAuthLoading && !isFetchingFavorites}
           />
           {(isAuthLoading || isFetchingFavorites) ? (
             <ActivityIndicator style={{ paddingHorizontal: 10 }} color="#007AFF" />
           ) : (
             <Button
               title="Go"
                onPress={() => {
                    const normalizedQuery = normalizeString(searchQuery);
                    const selectedCity = cities.find(c => c.normalizedCity === normalizedQuery);
                    if (selectedCity) {
                        handleSelectCity(selectedCity);
                    } else if (filteredCities.length > 0) {
                         Alert.alert("Select from List", `No exact match for "${searchQuery}". Please select a city from the suggestions.`);
                    } else {
                        Alert.alert("Not Found", `City "${searchQuery}" not found.`);
                    }
               }}
               disabled={isAuthLoading || isFetchingFavorites || !searchQuery} // Disable if no query
             />
           )}
         </View>

      {filteredCities.length > 0 && (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id}
          style={styles.suggestionList}
          renderItem={renderSuggestionItem}
          keyboardShouldPersistTaps='handled'
          extraData={{ favoriteLatLongs, togglingFavoriteCityId, isAuthLoading, isLoggedIn }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#c2e8ff"
    },
    searchBox: {
        marginTop: 70,
        width: "90%",
        alignSelf: 'center',
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#333",
    },
    suggestionList: {
        marginTop: 5,
        width: "90%",
        alignSelf: 'center',
        backgroundColor: "#fff",
        borderRadius: 10,
        maxHeight: 350,
        elevation: 3,
        zIndex: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    suggestionItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    suggestionItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        minHeight: 45,
    },
    starButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    starPlaceholder: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    starIcon: {},
    suggestionText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
});
