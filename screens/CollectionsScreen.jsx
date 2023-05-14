import { View, Text, Image, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { Input, Button } from "react-native-elements";
import React, { useEffect, useState } from "react";

const CollectionsScreen = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();
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
});

export default CollectionsScreen;
