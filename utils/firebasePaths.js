// helper/categoryPaths.js
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
  if (category === "All") return "categories"; // fetch everything

  const lowerCat = category.toLowerCase();
  if (CATEGORY_PATHS[lowerCat]) {
    return `categories/${lowerCat}`; // fetch all subcategories inside main category
  }

  return "categories/mens"; // fallback
};