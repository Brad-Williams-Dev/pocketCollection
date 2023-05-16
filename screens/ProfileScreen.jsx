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
      <Text style={styles.userInfo}>Username: {username}</Text>
      <Text style={styles.userInfo}>Money: ${money}</Text>
      <Text style={styles.userInfo}>Total # of Cards: {cards}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#3c5aa6",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    color: "#ffcb05",
  },
  userInfo: {
    fontSize: 24,
    color: "#ffffff",
  },
});

export default ProfileScreen;
