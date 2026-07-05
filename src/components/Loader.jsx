const Loader = ({
  size = "md",
  label,
  className = "",
  centered = false,
  inline = false,
}) => (
  <div
    className={`app-loader app-loader--${size}${centered ? " app-loader--centered" : ""}${inline ? " app-loader--inline" : ""} ${className}`.trim()}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="app-loader__spinner" aria-hidden="true" />
    {label ? <span className="app-loader__label">{label}</span> : null}
  </div>
);

export default Loader;
