const SectionDivider = ({ variant = "default" }) => (
  <div className={`section-divider section-divider--${variant}`} aria-hidden="true">
    <span className="section-divider__line" />
    <span className="section-divider__orb" />
    <span className="section-divider__line" />
  </div>
);

export default SectionDivider;
