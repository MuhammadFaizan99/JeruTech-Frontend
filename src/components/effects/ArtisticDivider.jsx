const ArtisticDivider = ({ variant = "wave" }) => {
  if (variant === "gradient") {
    return (
      <div className="artistic-divider artistic-divider--gradient" aria-hidden="true">
        <span />
      </div>
    );
  }

  if (variant === "curve") {
    return (
      <div className="artistic-divider artistic-divider--curve" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="artistic-divider artistic-divider--wave" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default ArtisticDivider;
