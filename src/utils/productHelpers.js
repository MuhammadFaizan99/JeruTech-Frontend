const specsByCategory = {
  "Mobile Phones": [
    "5G / LTE connectivity",
    "OLED high-refresh display",
    "Advanced multi-lens camera",
    "Fast charging support",
    "Biometric security",
  ],
  Laptops: [
    "Latest-gen processor",
    "SSD storage",
    "Full HD+ display",
    "All-day battery life",
    "Wi-Fi 6 / Bluetooth 5",
  ],
  Headphones: [
    "Active noise cancellation",
    "Wireless Bluetooth 5.x",
    "Multi-device pairing",
    "Long battery life",
    "Comfort-fit design",
  ],
  "Smart Watches": [
    "Health & fitness tracking",
    "GPS enabled",
    "Water resistant",
    "Smart notifications",
    "Fast magnetic charging",
  ],
  Chargers: [
    "GaN fast charging",
    "Multi-port output",
    "Over-voltage protection",
    "Compact travel design",
    "Wide device compatibility",
  ],
  Accessories: [
    "Premium build quality",
    "Plug-and-play setup",
    "Durable materials",
    "1-year warranty",
    "JeruTech tested",
  ],
  "Other Gadgets": [
    "Smart home ready",
    "Easy setup",
    "Energy efficient",
    "App control",
    "Reliable performance",
  ],
};

export const getEffectivePrice = (product) => {
  if (!product) return 0;
  if (product.finalPrice != null) return product.finalPrice;
  return product.price ?? 0;
};

export const normalizeCartProduct = (product) => {
  const isDiscounted = Boolean(product.isDiscounted || product.discount > 0);
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    image: product.images?.[0] || product.image || "",
    description: product.description,
    price: getEffectivePrice(product),
    oldPrice: isDiscounted ? product.price : null,
    discounted: isDiscounted,
    discount: product.discount ?? 0,
    stock: product.stock,
    finalPrice: product.finalPrice ?? product.price,
  };
};

export const getCartKey = (id, discounted = false) =>
  `${id}-${discounted ? "deal" : "regular"}`;

export const isProductInCart = (cartItems, product) => {
  const isDiscounted = Boolean(
    product.discounted ?? product.isDiscounted ?? Number(product.discount) > 0
  );
  const productId = product.id ?? product._id;
  const cartKey = getCartKey(productId, isDiscounted);
  return cartItems.some((item) => item.cartKey === cartKey);
};

export const getProductSpecs = (product) => {
  if (product?.specs && typeof product.specs === "object") {
    const entries = Object.entries(product.specs);
    if (entries.length > 0) {
      return entries.map(([key, value]) => `${key}: ${value}`);
    }
  }

  const base = specsByCategory[product?.category] || specsByCategory.Accessories;
  const company = product?.company || product?.name?.split(" ")[0] || "JeruTech";
  return [
    `Company: ${company}`,
    `Category: ${product?.category || "Electronics"}`,
    ...base,
  ];
};

export const formatPrice = (amount) => {
  const numericAmount = Number(amount ?? 0);
  return `$${numericAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getProductGalleryImages = (product) => {
  if (product?.images?.length) return product.images;
  if (product?.image) return [product.image];
  return [];
};
