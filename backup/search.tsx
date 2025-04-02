import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Header from "../../components/header"; // Adjust path if needed
import { router } from "expo-router";
import citiesData from "../../assets/worldcities current.json"; // Adjust path if needed
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if needed
import { supabase } from "../../lib/supabase"; // Adjust path if needed

// Define the City type
type City = {
  city: string;
  lat: string; // Keep as string from source initially
  lng: string; // Keep as string from source initially
  admin_name: string;
  country: string;
  id: string; // City's unique identifier from the JSON file
};

// Helper function to create a unique key string from lat/lng
// Handles potential parsing errors and normalizes format
const createLatLngKey = (lat: string | number, lng: string | number): string | null => {
    const numLat = typeof lat === 'string' ? parseFloat(lat) : lat;
    const numLng = typeof lng === 'string' ? parseFloat(lng) : lng;
    if (isNaN(numLat) || isNaN(numLng)) {
        console.warn(`[createLatLngKey] Invalid lat/lng pair: ${lat}, ${lng}`);
        return null; // Invalid key
    }
    // Using fixed precision can help avoid floating point comparison issues
    return `${numLat.toFixed(6)},${numLng.toFixed(6)}`;
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  // Assuming AuthContext provides 'isLoading'. If it's 'loading', change here.
  const { session, user, loading: isAuthLoading } = useAuth();
  const isLoggedIn = !!session && !!user;

  // State to track favorite status using "lat,lng" string keys
  const [favoriteLatLongs, setFavoriteLatLongs] = useState<Set<string>>(new Set());
  const [isFetchingFavorites, setIsFetchingFavorites] = useState(false);
  // Track UI loading state by city.id for simplicity during interaction
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
  }, [user]); // Dependency: run when user object changes

  useEffect(() => {
    // Fetch favorites only when the user object is available and fetch function is stable
    if (user) {
        fetchUserFavorites();
    } else {
        // Clear favorites if user becomes null (logs out)
        setFavoriteLatLongs(new Set());
    }
  }, [user, fetchUserFavorites]); // Re-run if user or the function itself changes
  // --- End Fetch Favorites ---

  useEffect(() => {
    // Load cities data once on mount
    console.log("[useEffect Cities] Loading cities data...");
    if (Array.isArray(citiesData)) {
       const validatedCities: City[] = citiesData.map((item: any, index: number) => ({
        city: item.city || 'Unknown City',
        lat: String(item.lat || '0'), // Ensure lat is string
        lng: String(item.lng || '0'), // Ensure lng is string
        admin_name: item.admin_name || 'N/A',
        country: item.country || 'Unknown Country',
        // Ensure ID is unique and string. Using index as fallback if item.id is missing/null
        id: String(item.id || `city_${index}`),
      }));
      setCities(validatedCities);
      console.log(`[useEffect Cities] Loaded ${validatedCities.length} cities.`);
    } else {
       console.error("[useEffect Cities] citiesData is not an array:", citiesData);
       setCities([]);
    }
  }, []); // Empty dependency array means run only once on mount

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

  const handleSelectCity = (city: City) => {
     console.log("[handleSelectCity] Navigating with city:", city.city);
      setSearchQuery(city.city);
      setFilteredCities([]); // Hide suggestions after selection
      router.push({
          pathname: "/", // Assuming this is your main weather display screen
          params: { searchedCityLat: city.lat, searchedCityLng: city.lng, searchedCityName: city.city },
      });
  };

  // --- Updated handleFavoriteToggle with FULL ERROR CHECKING ---
  const handleFavoriteToggle = async (city: City) => {
    console.log("--- [handleFavoriteToggle] START ---");
    console.log("[handleFavoriteToggle] City:", city.city, "ID:", city.id, "Coords:", city.lat, city.lng);

    // Check login status from AuthContext
    if (!isLoggedIn || !user) {
      console.warn("[handleFavoriteToggle] User not logged in or user object missing.");
      Alert.alert(
        "Login Required",
        "You need to be logged in to manage favorites.",
        [
          { text: "Cancel", style: "cancel" },
          // Ensure this route '/LoginScreen' exists and is correctly named in your Expo Router setup
          { text: "Login", onPress: () => router.push('/LoginScreen') }
        ]
      );
      return; // Stop execution
    }
    console.log("[handleFavoriteToggle] User is logged in. User ID:", user.id);

    // Prevent multiple simultaneous operations for the same user
    if (togglingFavoriteCityId) {
      console.warn("[handleFavoriteToggle] Already processing another favorite toggle, returning.");
      return;
    }

    // Parse coordinates and generate the key
    const cityLatStr = city.lat;
    const cityLngStr = city.lng;
    const cityLat = parseFloat(cityLatStr);
    const cityLng = parseFloat(cityLngStr);
    const latLngKey = createLatLngKey(cityLat, cityLng);

    console.log(`[handleFavoriteToggle] Parsing Coords: Input (${cityLatStr}, ${cityLngStr}), Parsed (${cityLat}, ${cityLng})`);
    console.log(`[handleFavoriteToggle] Generated LatLng Key: ${latLngKey}`);

    // Validate coordinates and key *before* proceeding
    if (isNaN(cityLat) || isNaN(cityLng) || !latLngKey) {
        console.error("[handleFavoriteToggle] Invalid coordinates or key generation failed.");
        Alert.alert("Error", "Invalid city coordinates. Cannot save favorite.");
        return; // Stop execution
    }

    // Set loading state for this specific item in the UI
    setTogglingFavoriteCityId(city.id);

    const userId = user.id;
    // Check the *current* local state to decide action
    const isCurrentlyFavorite = favoriteLatLongs.has(latLngKey);
    console.log(`[handleFavoriteToggle] Is Currently Favorite (local state check): ${isCurrentlyFavorite}`);

    try {
      if (isCurrentlyFavorite) {
        // --- Action: Remove from Favorites ---
        console.log("[handleFavoriteToggle] Attempting to DELETE favorite:", { id: userId, favorite_lat: cityLat, favorite_long: cityLng });
        const { error: deleteError, status: deleteStatus } = await supabase
          .from('user_favorites')
          .delete()
          .match({
              id: userId,          // Match the user ID
              favorite_lat: cityLat, // Match the specific latitude
              favorite_long: cityLng // Match the specific longitude
          });

        console.log("[handleFavoriteToggle] Supabase DELETE response status:", deleteStatus);

        // Check specifically for errors from the delete operation
        if (deleteError) {
            console.error("[handleFavoriteToggle] Supabase DELETE Error:", deleteError);
            // Rethrow the error to be handled by the main catch block
            throw deleteError;
        }

        console.log("[handleFavoriteToggle] DELETE successful (or no matching row found to delete).");
        // Update local state *after* successful DB operation
        setFavoriteLatLongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(latLngKey); // Remove the key from the set
          console.log("[handleFavoriteToggle] Local state updated (removed):", newSet);
          return newSet;
        });

      } else {
        // --- Action: Add to Favorites ---
        const favData = {
            id: userId,           // User's ID goes into the 'id' column
            favorite_lat: cityLat,  // Parsed latitude
            favorite_long: cityLng, // Parsed longitude
        };
        console.log("[handleFavoriteToggle] Attempting to INSERT favorite:", favData);
        const { error: insertError, status: insertStatus } = await supabase
          .from('user_favorites')
          .insert(favData); // Insert the prepared data object

        console.log("[handleFavoriteToggle] Supabase INSERT response status:", insertStatus);

        // Check specifically for errors from the insert operation
        if (insertError) {
            console.error("[handleFavoriteToggle] Supabase INSERT Error:", insertError);
            // Specifically handle unique constraint violation (code '23505' for PostgreSQL)
            if (insertError.code === '23505') {
                console.warn("[handleFavoriteToggle] Favorite already exists (unique constraint violation). Forcing UI sync.");
                // If the DB says it exists, make sure our local state agrees
                if (!favoriteLatLongs.has(latLngKey)) {
                    setFavoriteLatLongs(prev => {
                        const newSet = new Set(prev);
                        newSet.add(latLngKey);
                        console.log("[handleFavoriteToggle] Local state force-updated (added on duplicate):", newSet);
                        return newSet;
                    });
                }
                // Don't treat duplicate as a full error, proceed to finally block
            } else {
                // For any other insert error, rethrow it
                throw insertError;
            }
        } else {
            // --- SUCCESSFUL INSERT ---
            console.log("[handleFavoriteToggle] INSERT successful.");
            // Update local state *after* successful insert
            setFavoriteLatLongs(prev => {
                const newSet = new Set(prev);
                newSet.add(latLngKey); // Add the key to the set
                console.log("[handleFavoriteToggle] Local state updated (added):", newSet);
                return newSet;
            });
        }
      }
    } catch (error: any) {
      // Catch block handles errors thrown from either DELETE or INSERT blocks
      console.error("--- [handleFavoriteToggle] Error Caught in Catch Block ---");
      console.error("[handleFavoriteToggle] Error Code:", error?.code);
      console.error("[handleFavoriteToggle] Error Message:", error?.message);
      console.error("[handleFavoriteToggle] Error Details:", error?.details);
      console.error("[handleFavoriteToggle] Full Error Object:", error);
      // Provide feedback to the user
      Alert.alert("Database Error", `Could not ${isCurrentlyFavorite ? 'remove' : 'add'} favorite. Please check your connection and RLS policies, then try again.`);
    } finally {
      // This block executes regardless of success or failure in the try/catch
      console.log("--- [handleFavoriteToggle] FINALLY ---");
      // Always clear the loading state for the specific item
      setTogglingFavoriteCityId(null);
    }
  };
  // --- End Updated handleFavoriteToggle ---

  // --- Render Suggestion Item ---
  const renderSuggestionItem = ({ item }: { item: City }) => {
    // Generate key for this item to check favorite status
    const itemLatLngKey = createLatLngKey(item.lat, item.lng);
    // Determine favorite status from local state (only if key is valid)
    const isFavorite = itemLatLngKey ? favoriteLatLongs.has(itemLatLngKey) : false;
    // Check if this specific item's toggle action is in progress
    const isLoadingToggle = togglingFavoriteCityId === item.id;

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectCity(item)}
        // Disable row interaction while its favorite status is being updated
        disabled={isLoadingToggle}
      >
        <View style={styles.suggestionItemContent}>
          {/* Conditions to show the star interaction:
              1. Auth is not loading
              2. User is logged in
              3. The city item has valid coordinates (itemLatLngKey is not null)
          */}
          {!isAuthLoading && isLoggedIn && itemLatLngKey && (
             <TouchableOpacity
              // Prevent tap from bubbling up to the row's onPress
              onPress={(e) => { e.stopPropagation(); handleFavoriteToggle(item); }}
              style={styles.starButton}
              // Disable star button if auth/favorites are loading OR if this specific item is being toggled
              disabled={isAuthLoading || isFetchingFavorites || isLoadingToggle}
              // Increase tappable area for the star
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {/* Show ActivityIndicator if this item is loading, otherwise show star icon */}
              {isLoadingToggle ? (
                <ActivityIndicator size="small" color="#FFD700" />
              ) : (
                <FontAwesome
                  // Choose icon based on favorite status
                  name={isFavorite ? "star" : "star-o"}
                  size={20}
                  color="#FFD700" // Gold color for star
                  style={styles.starIcon}
                />
              )}
            </TouchableOpacity>
          )}
          {/* Show placeholder:
              1. If auth is still loading OR
              2. If logged in but the item has invalid coords (so star can't be shown)
          */}
          {(isAuthLoading || (isLoggedIn && !itemLatLngKey)) && <View style={styles.starPlaceholder} />}

          {/* City and Country Text */}
          <Text style={styles.suggestionText} numberOfLines={1} ellipsizeMode="tail">
            {item.city}, {item.country}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  // --- End renderSuggestionItem ---


  // --- Main Component Return ---
  return (
    <View style={styles.pageContainer}>
      <Header />
       {/* Search Box Area */}
       <View style={styles.searchBox}>
           <TextInput
               style={styles.input}
               placeholder="Search for a city"
               placeholderTextColor="#666"
               value={searchQuery}
               onChangeText={handleSearch}
               autoCorrect={false} // Common for search inputs
               autoCapitalize="words" // Good for city names
               // Disable input while critical data (auth/favorites) is loading
               editable={!isAuthLoading && !isFetchingFavorites}
           />
           {/* Show loading indicator or Go button */}
           {(isAuthLoading || isFetchingFavorites) ? (
             <ActivityIndicator style={{ paddingHorizontal: 10 }} color="#007AFF" /> // Use a theme color
           ) : (
             <Button
               title="Go"
                onPress={() => {
                    // Find exact match first (case-insensitive)
                    const selectedCity = cities.find(c => c.city.toLowerCase() === searchQuery.toLowerCase());
                    if (selectedCity) {
                        handleSelectCity(selectedCity);
                    } else {
                        // Optionally handle case where typed text doesn't match any known city
                        Alert.alert("Not Found", `City "${searchQuery}" not found in our list.`);
                    }
               }}
               // Disable Go button while loading
               disabled={isAuthLoading || isFetchingFavorites}
             />
           )}
         </View>

      {/* Suggestion List - Renders only if filteredCities has items */}
      {filteredCities.length > 0 && (
        <FlatList
          data={filteredCities}
          // Use city's unique file ID for React keys - crucial for performance
          keyExtractor={(item) => item.id}
          style={styles.suggestionList}
          renderItem={renderSuggestionItem}
          // Helps with tapping items while keyboard might be transitioning
          keyboardShouldPersistTaps='handled'
          // IMPORTANT: Tells FlatList to re-render items when these state values change
          extraData={{ favoriteLatLongs, togglingFavoriteCityId, isAuthLoading, isLoggedIn }}
          // Optional: Add indicator if list itself is loading (though usually covered by global indicators)
          // ListFooterComponent={isFetchingFavorites ? <ActivityIndicator /> : null}
        />
      )}
    </View>
  );
}
// --- End Main Component Return ---

// --- Styles ---
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#c2e8ff"
    },
    searchBox: {
        marginTop: 70, // Adjust as needed based on Header height
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
        elevation: 3, // Android shadow
        zIndex: 10, // Ensure it's above the list
    },
    input: {
        flex: 1, // Take remaining space
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#333", // Darker text color
    },
    suggestionList: {
        marginTop: 5, // Space below search box
        width: "90%",
        alignSelf: 'center',
        backgroundColor: "#fff",
        borderRadius: 10,
        maxHeight: 350, // Adjust max height as needed
        elevation: 3,
        zIndex: 5, // Below search box
        borderWidth: 1,
        borderColor: '#eee', // Subtle border
    },
    suggestionItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd", // Separator line
    },
    suggestionItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        minHeight: 45, // Ensure consistent row height
    },
    // Style for the tappable area around the star/indicator
    starButton: {
        width: 30, // Fixed width helps alignment
        height: 30, // Make it square
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10, // Space between star and text
    },
    // Placeholder takes up same space as starButton when star isn't shown
    starPlaceholder: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    // Direct styling for the FontAwesome icon itself (optional)
    starIcon: {
        // You could add padding here if needed, but hitSlop on TouchableOpacity is usually better
    },
    suggestionText: {
        fontSize: 16,
        color: "#333",
        flex: 1, // Allow text to take remaining space
    },
});
// --- End Styles ---