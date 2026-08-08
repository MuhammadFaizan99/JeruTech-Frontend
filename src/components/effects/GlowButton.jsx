import { Link } from "react-router-dom";

const GlowButton = ({
  children,
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
  icon,
}) => {
  const classes = `glow-btn glow-btn--${variant} glow-btn--${size} ${className}`.trim();

  const content = (
    <>
      <span className="glow-btn__shine" />
      <span className="glow-btn__ripple" />
      {icon && <span className="glow-btn__icon">{icon}</span>}
      <span className="glow-btn__text">{children}</span>
    </>
  );

  if (to) {
    return (
      <span className={classes}>
        <Link to={to} className="glow-btn__link">
          {content}
        </Link>
      </span>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
};

export default GlowButton;
