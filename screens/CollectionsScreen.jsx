import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as Font from "expo-font";
import { fetchBoosterPack } from "../helpers/helpers";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  update,
  set,
  push,
} from "firebase/database";
import { database, auth } from "../config/firebase";
import Swiper from "react-native-swiper";

const CollectionsScreen = () => {
  const db = getDatabase();
  const userId = auth.currentUser.uid;

  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [collection, setCollection] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [swiperShow, setSwiperShow] = useState(false);
  const [cardsToShow, setCardsToShow] = useState([]);

  const loadFont = async () => {
    await Font.loadAsync({
      "pokemon-font": require("../assets/fonts/pokemon-font.ttf"),
    });
    setIsFontLoaded(true);
  };

  const openBoosterPack = async (pack) => {
    if (!pack.cards || pack.cards.length === 0) {
      throw new Error("No cards found in the pack.");
    }

    const userId = auth.currentUser.uid;
    const db = getDatabase();

    // Remove the booster pack from the collection
    await remove(ref(db, `users/${userId}/collection/${pack.key}`));

    // Set the cards to show in the swiper
    setCardsToShow(pack.cards);

    // Display the swiper
    setSwiperShow(true);
  };

  const handleOpenPack = (item) => {
    if (item.unopened) {
      // Show the option to open the pack
      setSelectedCard(item);
      setModalVisible(true);
    } else {
      // Show the card details
      setSelectedCard(item);
      setModalVisible(true);
    }
  };

  const fetchCollection = () => {
    const userId = auth.currentUser.uid;
    const collectionRef = ref(database, `users/${userId}/collection`);
    const collectionListener = onValue(collectionRef, (snapshot) => {
      const data = snapshot.val();

      const collectionArray = data
        ? Object.entries(data).map(([key, value]) => ({
            ...value,
            key,
          }))
        : [];

      setCollection(collectionArray);
    });
  };

  useEffect(() => {
    loadFont();
    auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCollection();
      }
    });
  }, []);

  const windowWidth = useWindowDimensions().width;

  const renderCard = ({ item }) => {
    const handleClick = () => {
      // Set the selected card and show the modal
      setSelectedCard(item);
      setModalVisible(true);
    };

    return (
      <SafeAreaView style={styles.collection}>
        <SafeAreaView
          style={[styles.imageContainer, { width: windowWidth / 2 - 20 }]}
        >
          <TouchableOpacity onPress={() => handleOpenPack(item)}>
            <Image
              source={{ uri: item.imageUrl }}
              resizeMode="contain"
              style={styles.image}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    );
  };

  const removeCard = () => {
    if (selectedCard) {
      const userId = auth.currentUser.uid;
      const cardRef = ref(
        getDatabase(),
        `users/${userId}/collection/${selectedCard.key}`
      );
      remove(cardRef)
        .then(() => {
          console.log("Card successfully removed from Firebase database.");

          setCollection((prevCollection) =>
            prevCollection.filter((card) => card.key !== selectedCard.key)
          );
          setModalVisible(false);
        })
        .catch((error) => {
          // Handle any errors
          console.log("Error removing card:", error);
        });
    }
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
        Collection
      </Text>
      <View style={styles.scroll}>
        <FlatList
          data={collection}
          numColumns={2}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCard && (
              <>
                <Image
                  source={{ uri: selectedCard.imageUrl }}
                  resizeMode="contain"
                  style={styles.modalImage}
                />
                <View>
                  {selectedCard && selectedCard.unopened && (
                    <TouchableOpacity
                      style={{
                        marginBottom: 10,
                        backgroundColor: "#ffcb05",
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        openBoosterPack(selectedCard);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={{ color: "white" }}>Open Pack</Text>
                    </TouchableOpacity>
                  )}
                  <View>
                    <TouchableOpacity
                      style={{
                        marginBottom: 10,
                        backgroundColor: "#ffcb05",
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                      onPress={removeCard}
                    >
                      <Text style={{ color: "white" }}>Remove Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        marginBottom: 10,
                        backgroundColor: "#ffcb05",
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={{ color: "white" }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {swiperShow && (
        <View style={{ flex: 1 }}>
          <Swiper
            loop={false}
            onIndexChanged={async (index) => {
              if (index === cardsToShow.length - 1) {
                // All cards have been viewed, hide the swiper
                setTimeout(() => {
                  setSwiperShow(false);
                }, 2000);
              }
              if (index === cardsToShow.length) {
                // All cards have been viewed, hide the swiper
                setSwiperShow(false);
              } else {
                // Add the currently viewed card to the collection
                const card = cardsToShow[index];
                const newCardRef = push(ref(db, `users/${userId}/collection`));
                await set(newCardRef, {
                  key: newCardRef.key,
                  ...card,
                });

                // Refresh the collection
                fetchCollection();
              }
            }}
          >
            {cardsToShow.map((card, index) => (
              <View key={index} style={styles.slide}>
                <Image
                  source={{ uri: card.imageUrl }}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
            ))}
          </Swiper>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#3c5aa6",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    color: "#ffcb05",
    marginTop: Platform.OS === "ios" ? 100 : 40,
    textDecorationLine: "underline",
  },
  scroll: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    width: "100%",
    shadowColor: "#ffcb05",
    shadowOffset: { width: 0, height: 0 }, // Center the shadow under the box
    shadowOpacity: 1, // Increase the visibility of the shadow
    shadowRadius: 10, // Increase the blurriness of the shadow
    elevation: 5, // This adds a drop shadow on Android and increases the "glow" effect
  },
  collection: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#3c5aa6",
    borderRadius: 10,
    padding: 20,
    width: "80%", // specify width, you can adjust as per your requirement
    alignSelf: "center", // center horizontally
  },
  modalImage: {
    width: "100%", // to make it responsive
    height: 200,
    marginBottom: 20,
    alignSelf: "center", // center horizontally
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
    width: "100%",
    height: "100%",
  },
});

export default CollectionsScreen;
