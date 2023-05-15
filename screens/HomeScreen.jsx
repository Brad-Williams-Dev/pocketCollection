import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getDatabase, ref, onValue } from "firebase/database";
import axios from "axios";
import { random } from "lodash";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuthentication();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [pokemonSpriteUrls, setPokemonSpriteUrls] = useState({});

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  const [pokemonTypes, setPokemonTypes] = useState({});

  const fetchPokemonSprites = async () => {
    const urls = {};
    const types = {};

    for (let i = 1; i <= 4; i++) {
      const randomId = Math.floor(Math.random() * 151) + 1; // for a random number between 1 and 151
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      urls[i] = response.data.sprites.front_default;
      types[i] = response.data.types[0].type.name; // Assume we only care about the first type
    }

    setPokemonSpriteUrls(urls);
    setPokemonTypes(types);
  };

  const getPokemonGlowColor = (type) => {
    const typeColorMap = {
      fire: "#FFA756",
      water: "#58ABF6",
      grass: "#78C850",
      electric: "#F7D02C",
      psychic: "#F95587",
      ice: "#96D9D6",
      dragon: "#6F35FC",
      dark: "#705746",
      fairy: "#D685AD",
      flying: "#A98FF3",
      fighting: "#C22E28",
      normal: "#A8A77A",
      poison: "#A33EA1",
      ground: "#E2BF65",
      rock: "#B6A136",
      bug: "#A6B91A",
      ghost: "#735797",
      steel: "#B7B7CE",
    };

    return typeColorMap[type] || "#000"; // Default color if type is not in the map
  };

  useEffect(() => {
    loadFont();
    fetchPokemonSprites();

    if (user) {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setFirstName(data?.first_name || "");
        setLastName(data?.last_name || "");
      });
    }
  }, [user]);

  const handleLogout = () => {
    signOut();
    navigation.navigate("SignIn");
  };

  const menuItems = [
    {
      name: "Search",
      onPress: () => navigation.navigate("Search"),
      sprite: pokemonSpriteUrls[1],
    },
    {
      name: "Camera",
      onPress: () => navigation.navigate("Camera"),
      sprite: pokemonSpriteUrls[2],
    },
    {
      name: "Collection",
      onPress: () => navigation.navigate("Collection"),
      sprite: pokemonSpriteUrls[3],
    },
    { name: "Logout", onPress: handleLogout, sprite: pokemonSpriteUrls[4] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffcb05" barStyle="dark-content" />
      <View style={styles.header}>
        <Text
          style={
            isFontLoaded
              ? { ...styles.title, fontFamily: "pokemon-font" }
              : styles.title
          }
        >
          Pocket Collection
        </Text>
      </View>
      <View style={styles.footer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            style={{
              ...styles.listBox,
              shadowColor: getPokemonGlowColor(pokemonTypes[index + 1]),
              backgroundColor: getPokemonGlowColor(pokemonTypes[index + 1]),
            }}
            onPress={() => navigation.navigate(menuItems[index])}
          >
            <Image source={{ uri: item.sprite }} style={styles.icon} />
            <Text style={styles.listText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3c5aa6",
    height: "100%",
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#3c5aa6",
  },
  title: {
    fontSize: 45,
    color: "#ffcb05",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: -20,
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3c5aa6",
  },
  listBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "white",
    width: "80%",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 }, // Center the shadow under the box
    shadowOpacity: 1, // Increase the visibility of the shadow
    shadowRadius: 10, // Increase the blurriness of the shadow
    elevation: 5, // This adds a drop shadow on Android and increases the "glow" effect
  },

  listText: {
    fontSize: 24,
    color: "#fff",
    marginLeft: 20,
    fontWeight: "500",
  },
  icon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});
