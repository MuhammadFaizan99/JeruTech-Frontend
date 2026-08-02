import { useEffect, useState } from "react";
import api from "../../api";
import ScrollReveal from "./ScrollReveal";
import AnimatedCounter from "./AnimatedCounter";

const defaultStats = {
  happyCustomers: 0,
  products: 0,
  partnerBrands: 0,
  categories: 0,
};

const TrustSection = () => {
  const [stats, setStats] = useState([
    { end: 0, suffix: "+", label: "Happy Customers" },
    { end: 0, suffix: "+", label: "Products" },
    { end: 0, suffix: "+", label: "Partner Brands" },
    { end: 0, suffix: "+", label: "Categories" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/analytics/home-stats");
        const totals = response.data?.data?.totals || defaultStats;

        setStats([
          { end: Number(totals.happyCustomers ?? 0), suffix: "+", label: "Happy Customers" },
          { end: Number(totals.products ?? 0), suffix: "+", label: "Products" },
          { end: Number(totals.partnerBrands ?? 0), suffix: "+", label: "Partner Brands" },
          { end: Number(totals.categories ?? 0), suffix: "+", label: "Categories" },
        ]);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load statistics right now.");
        setStats([
          { end: 0, suffix: "+", label: "Happy Customers" },
          { end: 0, suffix: "+", label: "Products" },
          { end: 0, suffix: "+", label: "Partner Brands" },
          { end: 0, suffix: "+", label: "Categories" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="trust-section">
      <div className="trust-section__container">
        <ScrollReveal direction="up">
          <div className="trust-section__header">
            <span className="section-eyebrow">Trusted Worldwide</span>
            <h2>Numbers That Speak</h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="trust-section__status">Loading live statistics…</div>
        ) : (
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
        )}

        {error && !loading && <p className="trust-section__status trust-section__status--error">{error}</p>}
      </div>
    </section>
  );
};

export default TrustSection;
