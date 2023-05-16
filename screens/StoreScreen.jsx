import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import { getDatabase, ref, push } from "firebase/database";
import { database, auth } from "../config/firebase";

const StoreScreen = () => {
  const [boosterPacks, setBoosterPacks] = useState([
    // Add your booster packs here
    { id: 1, name: "Booster Pack 1", price: 100, cards: 10 },
    { id: 2, name: "Booster Pack 2", price: 200, cards: 20 },
  ]);

  const purchaseBoosterPack = (pack) => {
    const userId = auth.currentUser.uid;
    const collectionRef = ref(getDatabase(), `users/${userId}/collection`);

    // Add cards to the user's collection
    for (let i = 0; i < pack.cards; i++) {
      const newCardRef = push(collectionRef);

      // Here, you would normally add a random card from the booster pack
      // For simplicity, let's assume we're adding a placeholder card
      set(newCardRef, {
        key: newCardRef.key,
        imageUrl: "http://example.com/placeholder.png",
        name: "Placeholder Card",
      });
    }

    Alert.alert("Purchase Successful!", `You've bought ${pack.name}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Store</Text>

      {boosterPacks.map((pack, index) => (
        <View key={index} style={styles.pack}>
          <Text style={styles.packTitle}>{pack.name}</Text>
          <Text style={styles.packText}>Price: {pack.price}</Text>
          <Text style={styles.packText}>Cards: {pack.cards}</Text>
          <Button
            title="Buy"
            buttonStyle={styles.buttonText}
            onPress={() => purchaseBoosterPack(pack)}
          />
        </View>
      ))}
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
    fontSize: 30,
    color: "#ffcb05",
    marginBottom: 20,
  },
  pack: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  packTitle: {
    fontSize: 22,
    color: "#3B4CCA",
    marginBottom: 10,
  },
  packText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  buttonText: {
    backgroundColor: "#10717F",
  },
});

export default StoreScreen;
