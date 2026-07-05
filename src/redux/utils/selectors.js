const isMatchingId = (productId, targetId) => {
  if (productId === targetId) return true;
  if (typeof productId === "string" && typeof targetId === "string") {
    return productId === targetId;
  }
  if (typeof productId === "number" && Number(targetId) === productId) return true;
  return false;
};

export const selectProductById = (state, id) => {
  const regular = state.product.products.find((p) => isMatchingId(p.id, id));
  if (regular) return { ...regular, discounted: Boolean(regular.isDiscounted) };

  const deal = state.product.discountedProducts.find((p) => isMatchingId(p.id, id));
  if (deal) return { ...deal, discounted: true };

  return null;
};

export const selectRelatedProducts = (state, product, limit = 4) => {
  if (!product) return [];
  const all = [...state.product.products, ...state.product.discountedProducts];
  const pool = all.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  if (pool.length >= limit) return pool.slice(0, limit);
  const rest = all.filter((p) => p.id !== product.id);
  return [...pool, ...rest.filter((p) => !pool.find((x) => x.id === p.id))].slice(0, limit);
};
