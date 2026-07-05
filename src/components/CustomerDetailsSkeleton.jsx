const CustomerDetailsSkeleton = () => (
  <section className="cart-page__customer cart-customer-skeleton" aria-hidden="true">
    <div className="skeleton-block cart-customer-skeleton__title" />
    <ul className="cart-customer-skeleton__list">
      {[...Array(4)].map((_, index) => (
        <li key={`customer-${index}`} className="cart-customer-skeleton__item">
          <span className="skeleton-block cart-customer-skeleton__icon" />
          <span className="skeleton-block cart-customer-skeleton__line" />
        </li>
      ))}
    </ul>
  </section>
);

export default CustomerDetailsSkeleton;
