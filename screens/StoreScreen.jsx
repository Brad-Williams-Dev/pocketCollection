import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { getDatabase, ref, set, push } from "firebase/database";
import { auth } from "../config/firebase";

const StoreScreen = () => {
  const [boosterPacks, setBoosterPacks] = useState([
    {
      name: "Sun & Moon",
      set: "sm115",
      cards: 10,
      imageUrl:
        "https://www.toycompany.com/components/com_virtuemart/shop_image/product/full/pkm_smbooster_pack58e42dff8713c.jpg",
    },
    {
      name: "XY Evolutions",
      set: "xy12",
      cards: 10,
      imageUrl:
        "https://m.media-amazon.com/images/I/61GMlh3u1zL._AC_SX466_.jpg",
    },
  ]);

  const addToCollection = async (boosterPack) => {
    const userId = auth.currentUser.uid;
    const collectionRef = ref(getDatabase(), `users/${userId}/collection`);

    // Generate a new unique key using push
    const newPackRef = push(collectionRef);

    // Set the pack details under the unique key
    set(newPackRef, {
      key: newPackRef.key,
      set: boosterPack.set,
      name: boosterPack.name,
      imageUrl: boosterPack.imageUrl,
      unopened: true,
    });
  };

  const purchasePack = async (pack) => {
    try {
      addToCollection(pack);
    } catch (error) {
      console.error(`Failed to purchase pack: ${error}`);
    }
  };

  const fetchBoosterPack = async (pack) => {
    const boosterPack = [];
    for (let i = 0; i < pack.cards; i++) {
      try {
        const response = await fetch(
          `https://api.pokemontcg.io/v2/cards?q=set.id:${pack.set}`,
          {
            headers: {
              "X-Api-Key": "084fe2c3-a7b3-4d67-93f0-08d06f22e714", // replace with your API key
            },
          }
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          // Choose a random card from the response
          const card = data.data[Math.floor(Math.random() * data.data.length)];
          boosterPack.push({
            imageUrl: card.images.small,
            name: card.name,
          });
        } else {
          throw new Error("No cards returned from the API.");
        }
      } catch (error) {
        console.error(`Failed to fetch card: ${error}`);
      }
    }
    return boosterPack;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store</Text>
      {boosterPacks.map((pack, index) => (
        <Button
          key={index}
          title={`Buy ${pack.name}`}
          buttonStyle={styles.buttonText}
          onPress={() => purchasePack(pack)}
        />
      ))}
    </View>
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
    fontSize: 84,
    color: "#ffcb05",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    backgroundColor: "#10717F",
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
});

export default StoreScreen;
