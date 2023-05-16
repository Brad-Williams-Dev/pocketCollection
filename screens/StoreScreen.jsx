import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-elements";
import { getDatabase, ref, set, push } from "firebase/database";
import { auth } from "../config/firebase";
import { boosterPacks } from "../helpers/helpers";
import { TouchableOpacity, Image } from "react-native";
import * as Font from "expo-font";

const StoreScreen = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
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
    {
      name: "Scarlet & Violet",
      set: "sv1",
      cards: 10,
      imageUrl:
        "https://www.totalcards.net/media/catalog/product/cache/7635224f4fa597d4a3e42d3638e7f61a/s/c/scarvi-bp-4.jpg",
    },
    {
      name: "Evolving Skies",
      set: "swsh7",
      cards: 10,
      imageUrl:
        "https://m.media-amazon.com/images/I/61HfONe953L._AC_SY879_.jpg",
    },
    {
      name: "Pokemon Base Set",
      set: "base1",
      cards: 11,
      imageUrl:
        "https://d1rw89lz12ur5s.cloudfront.net/photo/collectorscache/file/509177b0555211e88ca10722830d131a/1st%20blastoise%20pack.jpg",
    },
  ]);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  useEffect(() => {
    loadFont();
  }, []);

  const addToCollection = async (boosterPack, cards) => {
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
      cards,
    });
  };

  const purchasePack = async (pack) => {
    try {
      const cards = await fetchBoosterPack(pack);
      addToCollection(pack, cards);
      Alert.alert("Success", "Pack purchased successfully.");
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
      <Text
        style={
          isFontLoaded
            ? { ...styles.title, fontFamily: "pokemon-font" }
            : styles.title
        }
      >
        Store
      </Text>
      <View style={styles.packs}>
        {boosterPacks.map((pack, index) => (
          <TouchableOpacity key={index} onPress={() => purchasePack(pack)}>
            <Image
              source={{ uri: pack.imageUrl }}
              style={{ width: 100, height: 150, margin: 5, borderRadius: 10 }}
            />
          </TouchableOpacity>
        ))}
      </View>
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
  packs: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  title: {
    fontSize: 84,
    color: "#ffcb05",
    marginTop: -300,
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
