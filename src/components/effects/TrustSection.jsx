import ScrollReveal from "./ScrollReveal";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { end: 120, suffix: "+", label: "Happy Customers" },
  { end: 80, suffix: "+", label: "Products" },
  { end: 8, suffix: "+", label: "Partner Brands" },
  { end: 7, suffix: "/7", label: "Support" },
];

const TrustSection = () => (
  <section className="trust-section">
    <div className="trust-section__container">
      <ScrollReveal direction="up">
        <div className="trust-section__header">
          <span className="section-eyebrow">Trusted Worldwide</span>
          <h2>Numbers That Speak</h2>
        </div>
      </ScrollReveal>
      <div className="trust-section__grid">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} direction="up" delay={i * 0.08}>
            <div className="trust-section__card glass-panel">
              <span className="trust-section__value">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </span>
              <span className="trust-section__label">{stat.label}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
