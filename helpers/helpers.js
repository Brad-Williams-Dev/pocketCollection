export const fetchBoosterPack = async (pack) => {
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

export const boosterPacks = [
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
  }
];
