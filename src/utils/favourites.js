const FAVOURITES_KEY = "jerutech_favourites";

const readFavourites = () => {
  try {
    const stored = localStorage.getItem(FAVOURITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeFavourites = (items) => {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
};

export const getFavourites = () => readFavourites();

export const isFavourite = (productId) =>
  readFavourites().some((item) => item.id === productId);

export const toggleFavourite = (product) => {
  const favourites = readFavourites();
  const exists = favourites.some((item) => item.id === product.id);

  if (exists) {
    const next = favourites.filter((item) => item.id !== product.id);
    writeFavourites(next);
    return { added: false, favourites: next };
  }

  const snapshot = {
    id: product.id,
    name: product.name,
    image: product.images?.[0] || product.image || "",
    price: product.finalPrice ?? product.price ?? 0,
    category: product.category,
    company: product.company || product.name?.split(" ")[0] || "JeruTech",
    addedAt: new Date().toISOString(),
  };

  const next = [snapshot, ...favourites];
  writeFavourites(next);
  return { added: true, favourites: next };
};

export const removeFavourite = (productId) => {
  const next = readFavourites().filter((item) => item.id !== productId);
  writeFavourites(next);
  return next;
};
