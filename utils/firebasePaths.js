// utils/firebasePaths.js

export const CATEGORY_PATHS = {
  mens: {
    mensPants: "/categories/mens/mensPants",
    mensShirt: "/categories/mens/mensShirt",
    mensShoes: "/categories/mens/mensShoes",
  },
  womens: {
    womensKurti: "/categories/womens/womensKurti",
    womensSaree: "/categories/womens/womensSaree",
    womensShoes: "/categories/womens/womensShoes",
  },
  kids: {
    kidsCloths: "/categories/kids/kidsCloths",
    kidsShoes: "/categories/kids/kidsShoes",
  },
  unisex: {
    bags: "/categories/unisex/bags",
    jewellery: "/categories/unisex/jewellery",
    sunglasses: "/categories/unisex/sunglasses",
    watches: "/categories/unisex/watches",
  },
};

export const getCategoryPath = (category) => {
  if (category === "All") return "categories";

  const lowerCat = category.toLowerCase();
  if (CATEGORY_PATHS[lowerCat]) {
    return `categories/${lowerCat}`;
  }

  // check subcategories
  for (const main in CATEGORY_PATHS) {
    for (const sub in CATEGORY_PATHS[main]) {
      if (sub.toLowerCase() === lowerCat) {
        return CATEGORY_PATHS[main][sub];
      }
    }
  }

  return "categories/mens"; // fallback
};

// 🔑 generate a unique key for product favourites
export const productKeyOf = (category, subCategory, firebaseId) => {
  if (!category || !subCategory || !firebaseId) return null;
  return `${category}|${subCategory}|${firebaseId}`;
};
