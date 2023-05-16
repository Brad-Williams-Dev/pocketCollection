import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../config/firebase";

const ProfileScreen = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [money, setMoney] = useState(500);
  const [cards, setCards] = useState(0);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const collectionRef = ref(db, `users/${userId}/collection`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsername(data.username || "");
        setMoney(data.money || 500);
      }
    });

    onValue(collectionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCards(Object.keys(data).length);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={
          isFontLoaded
            ? { ...styles.title, fontFamily: "pokemon-font" }
            : styles.title
        }
      >
        Profile
      </Text>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Username:</Text>
        <Text style={styles.userInfoValue}>{username}</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Money:</Text>
        <Text style={styles.userInfoValue}>${money}</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Total Cards:</Text>
        <Text style={styles.userInfoValue}>{cards}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#3c5aa6",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffcb05",
    marginTop: -400,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#333333",
  },
  userInfoValue: {
    fontSize: 16,
    color: "#666666",
  },
});

export default ProfileScreen;
