const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...rest
}) => (
  <button
    type={type}
    className={`loading-btn ${className}${loading ? " loading-btn--loading" : ""}`.trim()}
    disabled={disabled || loading}
    onClick={onClick}
    {...rest}
  >
    {loading && <span className="loading-btn__spinner" aria-hidden="true" />}
    <span className="loading-btn__label">{children}</span>
  </button>
);

export default LoadingButton;
