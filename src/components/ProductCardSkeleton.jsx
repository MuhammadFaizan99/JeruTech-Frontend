const ProductCardSkeleton = () => (
  <div className="product-card-skeleton" aria-hidden="true">
    <div className="product-card-skeleton__media skeleton-block" />
    <div className="product-card-skeleton__body">
      <div className="product-card-skeleton__chip skeleton-block" />
      <div className="product-card-skeleton__title skeleton-block" />
      <div className="product-card-skeleton__desc skeleton-block" />
      <div className="product-card-skeleton__desc skeleton-block product-card-skeleton__desc--short" />
      <div className="product-card-skeleton__price skeleton-block" />
      <div className="product-card-skeleton__actions">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
