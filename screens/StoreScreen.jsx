import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Button } from "react-native-elements";
import { getDatabase, ref, set, push, get } from "firebase/database";
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
      price: "$15.00",
    },
    {
      name: "XY Evolutions",
      set: "xy12",
      cards: 10,
      imageUrl:
        "https://m.media-amazon.com/images/I/61GMlh3u1zL._AC_SX466_.jpg",
      price: "$15.00",
    },
    {
      name: "Scarlet & Violet",
      set: "sv1",
      cards: 10,
      imageUrl:
        "https://www.totalcards.net/media/catalog/product/cache/7635224f4fa597d4a3e42d3638e7f61a/s/c/scarvi-bp-4.jpg",
      price: "$15.00",
    },
    {
      name: "Evolving Skies",
      set: "swsh7",
      cards: 10,
      imageUrl:
        "https://m.media-amazon.com/images/I/61HfONe953L._AC_SY879_.jpg",
      price: "$15.00",
    },
    {
      name: "Pokemon Base Set",
      set: "base1",
      cards: 11,
      imageUrl:
        "https://d1rw89lz12ur5s.cloudfront.net/photo/collectorscache/file/509177b0555211e88ca10722830d131a/1st%20blastoise%20pack.jpg",
      price: "$4500.00",
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

      const userId = auth.currentUser.uid;
      const userRef = ref(getDatabase(), `users/${userId}`);
      const packAmount = parseFloat(pack.price.replace("$", ""));

      get(userRef)
        .then((snapshot) => {
          const userData = snapshot.val();
          const currentMoney = userData.money || 0;

          if (currentMoney >= packAmount) {
            const updatedMoney = currentMoney - packAmount;

            // Update the user's money in the database
            set(userRef, { ...userData, money: updatedMoney })
              .then(() => {
                addToCollection(pack, cards); // Moved the addToCollection function here
                Alert.alert("Success", "Pack purchased successfully.");
                console.log("User's money updated successfully.");
              })
              .catch((error) => {
                console.error("Failed to update user's money:", error);
              });
          } else {
            Alert.alert(
              "Insufficient Funds",
              "You don't have enough money to purchase this pack."
            );
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
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
            set: card.set.name,
            rarity: card.rarity,
            prices: card.tcgplayer.prices,
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
    <SafeAreaView style={styles.container}>
      <Text
        style={[styles.title, isFontLoaded && { fontFamily: "pokemon-font" }]}
      >
        Store
      </Text>
      <ScrollView contentContainerStyle={styles.packContainer}>
        {boosterPacks.map((pack, index) => (
          <TouchableOpacity
            key={index}
            style={styles.packItem}
            onPress={() => purchasePack(pack)}
          >
            <Image source={{ uri: pack.imageUrl }} style={styles.packImage} />
            <View style={styles.packInfo}>
              <Text style={styles.packName}>Name: {pack.name}</Text>
              <Text style={styles.packPrice}>Price: {pack.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3c5aa6",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#ffcb05",
  },
  packContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  packItem: {
    width: "45%",
    margin: 5,
    backgroundColor: "#9DD6EB",
    borderRadius: 10,
    padding: 10,
  },
  packImage: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  packPrice: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "bold",
  },
});

export default StoreScreen;
