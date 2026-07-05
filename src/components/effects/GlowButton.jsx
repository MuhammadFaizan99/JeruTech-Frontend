import { motion } from "framer-motion";
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
  const classes = `glow-btn glow-btn--${variant} glow-btn--${size} ${className}`;

  const content = (
    <>
      <span className="glow-btn__shine" />
      <span className="glow-btn__ripple" />
      {icon && <span className="glow-btn__icon">{icon}</span>}
      <span className="glow-btn__text">{children}</span>
    </>
  );

  const motionProps = {
    className: classes,
    whileHover: { scale: 1.04, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  if (to) {
    return (
      <motion.div {...motionProps} style={{ display: "inline-block" }}>
        <Link to={to} className="glow-btn__link">
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} {...motionProps} target="_blank" rel="noopener noreferrer">
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...motionProps}>
      {content}
    </motion.button>
  );
};

export default GlowButton;
