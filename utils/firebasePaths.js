export const getCategoryPath = (category) => {
  switch (category) {
    case "Mens":
      return "/categories/mens/mensPants";
    case "Womens":
      return "/categories/womens/womensKurti";
    case "Kids":
      return "/categories/kids/kidsCloths";
    case "Unisex":
      return "/categories/unisex/bags";
    default:
      return "/categories/mens/mensPants";
  }
};
