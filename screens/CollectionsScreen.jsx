import { View, Text, Image, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { Input, Button } from "react-native-elements";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { database, auth } from "../config/firebase";

const CollectionsScreen = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [collection, setCollection] = useState([]);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();

    // Get the current user's ID
    const userId = auth.currentUser.uid;

    // Create a reference to the user's collection in the database
    const collectionRef = ref(getDatabase(), `users/${userId}/collection`);

    // Listen for changes to the collection in the database
    const collectionListener = onValue(collectionRef, (snapshot) => {
      // Get the data from the snapshot
      const data = snapshot.val();

      // Convert the data to an array of Pokémon cards
      const collectionArray = data ? Object.values(data) : [];

      // Set the collection state variable
      setCollection(collectionArray);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      collectionListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={
          isFontLoaded
            ? { ...styles.title, fontFamily: "pokemon-font" }
            : styles.title
        }
      >
        Collections
      </Text>

      {Object.keys(collection).map((key) => (
        <View style={styles.collection} key={key}>
          <Image
            source={{ uri: collection[key].imageUrl }}
            style={styles.image}
          />
          <Text>{collection[key].name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#D7853F",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    color: "#10717F",
    marginTop: 100,
  },
  image: {
    height: 350,
    width: 250,
  },
  collection: {
    flexDirection: "grid",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});

export default CollectionsScreen;
