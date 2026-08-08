const MagneticButton = ({ children, className = "" }) => (
  <span className={`magnetic-wrap ${className}`.trim()}>
    {children}
  </span>
);

export default MagneticButton;
