const ProductDetailsSkeleton = () => (
  <div
    className="page-wrapper product-details-page product-details-skeleton"
    aria-hidden="true"
  >
    <section className="product-details-page__body">
      <div className="product-details-skeleton__back skeleton-block" />

      <div className="product-details-page__layout">
        <div className="product-details-skeleton__gallery skeleton-block" />

        <div className="product-details-skeleton__info">
          <div className="product-details-skeleton__tags">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
          </div>
          <div className="product-details-skeleton__title skeleton-block" />
          <div className="product-details-skeleton__company skeleton-block" />
          <div className="product-details-skeleton__price skeleton-block" />
          <div className="product-details-skeleton__desc skeleton-block" />
          <div className="product-details-skeleton__desc skeleton-block product-details-skeleton__desc--short" />
          <div className="product-details-skeleton__specs">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
            <span className="skeleton-block" />
          </div>
          <div className="product-details-skeleton__qty skeleton-block" />
          <div className="product-details-skeleton__actions">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ProductDetailsSkeleton;
