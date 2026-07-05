const brands = [
  "Apple",
  "Samsung",
  "Dell",
  "HP",
  "Lenovo",
  "Bosch",
  "Yamaha",
  "Creality",
  "Sony",
  "DJI",
];

const BrandMarquee = () => (
  <section className="brand-marquee" aria-label="Featured brands">
    <div className="brand-marquee__label">Featured Brands</div>
    <div className="brand-marquee__track-wrap">
      <div className="brand-marquee__track">
        {[...brands, ...brands].map((brand, i) => (
          <span key={`${brand}-${i}`} className="brand-marquee__item">
            {brand}
            <span className="brand-marquee__dot" aria-hidden="true">
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default BrandMarquee;
