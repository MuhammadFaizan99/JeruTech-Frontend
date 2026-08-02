import { useEffect, useRef, useState } from "react";
import api from "../../api";

const getCompanyLogo = (company) => company?.logo || company?.image || company?.logoUrl || company?.brandLogo || company?.icon || "";

const BrandMarquee = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const trackRef = useRef(null);
  const hoverRef = useRef(false);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/companies?all=true");
        const rawCompanies = Array.isArray(response.data?.companies) ? response.data.companies : [];

        const uniqueCompanies = rawCompanies
          .filter((company, index, list) => {
            const companyName = company?.name?.trim();
            return Boolean(companyName) && list.findIndex((entry) => (entry?.name || "").trim().toLowerCase() === companyName.toLowerCase()) === index;
          })
          .sort((left, right) => (left?.name || "").localeCompare(right?.name || "", undefined, { sensitivity: "base" }));

        setCompanies(uniqueCompanies);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load partner brands right now.");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    if (companies.length < 2) {
      return undefined;
    }

    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    const step = () => {
      if (hoverRef.current || !track) {
        return;
      }

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      if (track.scrollLeft >= maxScroll - 1) {
        track.scrollLeft = 0;
        return;
      }

      track.scrollBy({ left: 180, behavior: "smooth" });
    };

    autoScrollRef.current = window.setInterval(step, 2200);
    return () => window.clearInterval(autoScrollRef.current);
  }, [companies]);

  const scrollByDirection = (direction) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (direction === "next") {
      if (track.scrollLeft >= maxScroll - 1) {
        track.scrollLeft = 0;
        return;
      }
      track.scrollBy({ left: 180, behavior: "smooth" });
      return;
    }

    if (track.scrollLeft <= 0) {
      track.scrollLeft = Math.max(maxScroll, 0);
      return;
    }

    track.scrollBy({ left: -180, behavior: "smooth" });
  };

  return (
    <section className="brand-marquee" aria-label="Partner brands">
      <div className="brand-marquee__label">Partner Brands</div>

      {loading ? (
        <div className="brand-marquee__status">Loading partner brands…</div>
      ) : error ? (
        <div className="brand-marquee__status brand-marquee__status--error">{error}</div>
      ) : companies.length === 0 ? (
        <div className="brand-marquee__status">No partner brands available right now.</div>
      ) : (
        <div className="brand-marquee__controls">
          <button type="button" className="brand-marquee__nav" aria-label="Previous partner brand" onClick={() => scrollByDirection("prev")}>
            <span aria-hidden="true">‹</span>
          </button>

          <div
            className="brand-marquee__track-wrap"
            ref={trackRef}
            onMouseEnter={() => {
              hoverRef.current = true;
            }}
            onMouseLeave={() => {
              hoverRef.current = false;
            }}
          >
            <div className="brand-marquee__track">
              {companies.map((company, index) => {
                const logo = getCompanyLogo(company);
                return (
                  <span key={`${company?.name || "company"}-${index}`} className="brand-marquee__item">
                    {logo ? (
                      <img src={logo} alt={company.name} className="brand-marquee__logo" />
                    ) : (
                      <span className="brand-marquee__name">{company?.name}</span>
                    )}
                    <span className="brand-marquee__dot" aria-hidden="true">
                      •
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          <button type="button" className="brand-marquee__nav" aria-label="Next partner brand" onClick={() => scrollByDirection("next")}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default BrandMarquee;
