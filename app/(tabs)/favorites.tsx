import React, { useState, useCallback, useMemo } from "react";
import { Text, View, StyleSheet, Button, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import Header from "../../components/header"; 
import { useAuth } from "../../contexts/AuthContext"; 
import { supabase } from "../../lib/supabase"; 
import { router, useFocusEffect } from "expo-router";
import citiesData from "../../assets/worldcities current.json";

// Type for the structure of items in our final list
type FavoriteDetail = {
  key: string; // Unique key for FlatList (e.g., "lat,lng")
  city: string;
  country: string;
  lat: number;
  lng: number;
};

// Type for the raw data from Supabase
type RawFavorite = {
  favorite_lat: number;
  favorite_long: number;
};

// Type for the structure of the city lookup map
type CityLookupMap = Map<string, { city: string; country: string }>;

// Helper function to create a consistent key from lat/lng
const createCoordKey = (lat: number | string, lng: number | string): string => {
    const numLat = typeof lat === 'string' ? parseFloat(lat) : lat;
    const numLng = typeof lng === 'string' ? parseFloat(lng) : lng;
    return `${numLat.toFixed(6)},${numLng.toFixed(6)}`;
};


export default function FavoritesScreen() {
  const { user, loading: isAuthLoading } = useAuth(); // Get user and auth loading state
  const [favorites, setFavorites] = useState<FavoriteDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state for favorites data
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // For pull-to-refresh

  
  const cityLookup = useMemo<CityLookupMap>(() => {
    console.log("[FavoritesScreen] Creating city lookup map...");
    const map: CityLookupMap = new Map();
    if (Array.isArray(citiesData)) {
      citiesData.forEach((cityInfo: any) => {
        // Ensure lat/lng are treated as numbers for key creation
        const lat = parseFloat(cityInfo.lat);
        const lng = parseFloat(cityInfo.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          const key = createCoordKey(lat, lng);
          // Avoid overwriting if multiple cities share exact coords (take the first encountered)
          if (!map.has(key)) {
            map.set(key, { city: cityInfo.city || 'N/A', country: cityInfo.country || 'N/A' });
          }
        }
      });
    }
    console.log(`[FavoritesScreen] City lookup map created with ${map.size} entries.`);
    return map;
  }, []); // Empty dependency array: runs once on mount


  // --- Function to Fetch and Process Favorites ---
  const fetchAndProcessFavorites = useCallback(async () => {
    if (!user) {
      console.log("[fetchAndProcessFavorites] No user, exiting.");
      setFavorites([]); // Clear favorites if user logs out
      setIsLoading(false);
      setError(null);
      return;
    }

    console.log(`[fetchAndProcessFavorites] Fetching for user: ${user.id}`);
    setError(null); // Clear previous errors
    // Set loading true only if not already refreshing
    if(!isRefreshing) setIsLoading(true);

    try {
      // 1. Fetch coordinates from Supabase
      const { data: rawFavorites, error: supabaseError } = await supabase
        .from('user_favorites')
        .select('favorite_lat, favorite_long')
        .eq('id', user.id);

      if (supabaseError) {
        console.error("[fetchAndProcessFavorites] Supabase error:", supabaseError);
        throw new Error(supabaseError.message || "Failed to fetch favorites from database.");
      }

      if (!rawFavorites) {
          console.log("[fetchAndProcessFavorites] No data received from Supabase.");
          setFavorites([]); // Set empty if no data
          return; // Exit early
      }

      console.log("[fetchAndProcessFavorites] Raw favorites fetched:", rawFavorites);

      // 2. Map coordinates to city details using the lookup map
      const detailedFavorites: FavoriteDetail[] = rawFavorites
        .map((fav: RawFavorite) => {
          const key = createCoordKey(fav.favorite_lat, fav.favorite_long);
          const cityInfo = cityLookup.get(key);

          if (cityInfo) {
            return {
              key: key, // Use the coord key for FlatList
              city: cityInfo.city,
              country: cityInfo.country,
              lat: fav.favorite_lat,
              lng: fav.favorite_long,
            };
          } else {
            // Handle case where coordinate doesn't match any known city
            console.warn(`[fetchAndProcessFavorites] No city found for key: ${key} (Coords: ${fav.favorite_lat}, ${fav.favorite_long})`);
            // Optionally return a placeholder or filter it out
             return {
               key: key,
               city: `Unknown Location`,
               country: `(${fav.favorite_lat.toFixed(3)}, ${fav.favorite_long.toFixed(3)})`, // Show coords as fallback
               lat: fav.favorite_lat,
               lng: fav.favorite_long,
             };
          }
        })

      console.log("[fetchAndProcessFavorites] Processed favorites:", detailedFavorites);
      setFavorites(detailedFavorites);

    } catch (err: any) {
      console.error("[fetchAndProcessFavorites] Caught error during fetch/process:", err);
      setError(err.message || "An unexpected error occurred.");
      setFavorites([]); // Clear favorites on error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Ensure refreshing state is reset
      console.log("[fetchAndProcessFavorites] Fetch/process finished.");
    }
  }, [user, cityLookup, isRefreshing]); // Dependencies: user, the lookup map, and refresh state

  useFocusEffect(
    useCallback(() => {
      console.log("[useFocusEffect] Favorites Screen focused.");
      // Fetch data only if user is logged in and auth check is complete
      if (!isAuthLoading && user) {
        console.log("[useFocusEffect] User logged in, calling fetchAndProcessFavorites.");
        // We don't set isRefreshing=true here, normal fetch triggers isLoading
        fetchAndProcessFavorites();
      } else if (!isAuthLoading && !user) {
        // Handle case where user might have logged out while screen was blurred
        console.log("[useFocusEffect] No user or auth loading, clearing state.");
        setFavorites([]);
        setError(null);
        setIsLoading(false); // Ensure loading is off
      } else {
          console.log("[useFocusEffect] Auth still loading, skipping fetch.");
      }


    }, [isAuthLoading, user, fetchAndProcessFavorites]) // Dependencies for the effect callback
  );
  // --- End useFocusEffect ---

  // --- Pull-to-Refresh Handler ---
  const onRefresh = useCallback(() => {
    console.log("[onRefresh] Pull to refresh triggered.");
    setIsRefreshing(true); // Set refreshing state for indicator
    fetchAndProcessFavorites();
  }, [fetchAndProcessFavorites]);


  // Handle Auth Loading State
  if (isAuthLoading) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.messageText}>Loading user info...</Text>
        </View>
      </View>
    );
  }

  // Handle Not Logged In State
  if (!user) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.messageText}>Please log in to view favorites.</Text>
          <Button title="Log In" onPress={() => router.push("/LoginScreen")} />
        </View>
      </View>
    );
  }

  // Handle Favorites Loading State
  if (isLoading) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.messageText}>Loading favorites...</Text>
        </View>
      </View>
    );
  }

   // Handle Error State
  if (error) {
     return (
       <View style={styles.pageContainer}>
         <Header />
         <View style={styles.centeredMessageContainer}>
           <Text style={[styles.messageText, styles.errorText]}>Error loading favorites:</Text>
           <Text style={[styles.messageText, styles.errorText, {marginBottom: 15}]}>{error}</Text>
           <Button title="Try Again" onPress={fetchAndProcessFavorites} />
         </View>
       </View>
     );
   }

  // --- Render Main Content (Favorites List or Empty Message) ---
  return (
    <View style={styles.pageContainer}>
      <Header />
      {favorites.length === 0 ? (
        // Display message if no favorites are found
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.messageText}>You haven't added any favorites yet.</Text>
            <Text style={styles.messageText}>Use the search screen to add some!</Text>
        </View>
      ) : (
        // Display the list of favorites
        <FlatList
          data={favorites}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          keyExtractor={(item) => item.key} // Use the generated "lat,lng" key
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                // Navigate back to weather screen with selected favorite's details
                console.log("Navigating to weather for:", item.city);
                router.push({
                  pathname: "/", 
                  params: { searchedCityLat: item.lat, searchedCityLng: item.lng, searchedCityName: item.city },
                });
              }}
            >
              <View>
                <Text style={styles.cityText}>{item.city}</Text>
                <Text style={styles.countryText}>{item.country}</Text>
              </View>
               <Text style={styles.chevron}>{">"}</Text>
            </TouchableOpacity>
          )}
          // Add Pull-to-Refresh
           refreshControl={
             <RefreshControl
               refreshing={isRefreshing}
               onRefresh={onRefresh}
               colors={["#007AFF"]} // iOS loading indicator color
               tintColor={"#007AFF"} // Android loading indicator color
             />
           }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#c2e8ff", // Light blue background
  },
  // Centered container for loading/error/empty messages
  centeredMessageContainer: {
    flex: 1, // Take remaining space below header
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Add some padding
  },
  messageText: {
    fontSize: 18,
    color: "#333", // Darker text for readability
    textAlign: "center",
    marginBottom: 15,
  },
  errorText: {
    color: "#D32F2F", // Red color for errors
    fontWeight: 'bold',
  },
  // List specific styles
  list: {
    flex: 1, // Take remaining space
    width: '100%',
  },
  listContentContainer: {
      paddingTop: 10, // Space above the first item
      paddingBottom: 20, // Space below the last item
      paddingHorizontal: 10, // Horizontal padding for list items
  },
  listItem: {
    backgroundColor: "#FFF", // White background for items
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10, // Space between items
    flexDirection: 'row', // Arrange text and chevron side-by-side
    justifyContent: 'space-between', // Push text left, chevron right
    alignItems: 'center', // Vertically align items
    // Add subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  cityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  countryText: {
    fontSize: 14,
    color: "#666", // Gray color for country
    marginTop: 2,
  },
  chevron: {
      fontSize: 20,
      color: '#AAA', // Light gray for chevron
  },
});