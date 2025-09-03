import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import database from '@react-native-firebase/database';

import ProductCard from '../components/ProductCard';
import Vector from '../assets/images/vector.png';
import Heart from '../assets/images/heart.png';
import HeartFill from '../assets/images/heartFill.png';
import BackIcon from '../assets/backButtonImage.png';
import { ROUTES } from '../helper/routes';
import Header from '../components/Header';

const SavedScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const ref = database().ref('categories');

    const handleSnapshot = snapshot => {
      if (!snapshot.exists()) {
        setFavourites([]);
        return;
      }

      const data = snapshot.val();
      const list = [];

      Object.entries(data).forEach(([categoryName, subcats]) => {
        Object.entries(subcats).forEach(([subCategoryName, products]) => {
          Object.entries(products).forEach(([id, product]) => {
            if (product && product.isFavourite) {
              list.push({
                id,
                ...product,
                category: categoryName,
                subCategory: subCategoryName,
              });
            }
          });
        });
      });

      setFavourites(list);
    };

    ref.on('value', handleSnapshot);
    return () => ref.off('value', handleSnapshot);
  }, []);

  const handleToggleFavourite = product => {
    const productRef = database().ref(
      `categories/${product.category}/${product.subCategory}/${product.id}`,
    );

    productRef.remove();

    setFavourites(prev => prev.filter(item => item.id !== product.id));
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={Heart} style={styles.staticHeartIcon} />
      <Text style={styles.emptyTitle}>No Saved Items!</Text>
      <Text style={styles.emptySubtitle}>
        You don’t have any saved items. Go to home and add some.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={'Saved Items'} />
      {favourites.length === 0 ? (
        renderEmptyComponent()
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item, index) => item.id ?? `fav-${index}`}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={item.isFavourite ? HeartFill : Heart}
              onPress={() =>
                navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })
              }
              onToggleFavourite={handleToggleFavourite}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  staticHeartIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
    marginBottom: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },

  emptySubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 6,
    textAlign: 'center',
  },
});
