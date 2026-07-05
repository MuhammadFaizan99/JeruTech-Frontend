import { motion } from "framer-motion";

const variants = {
  up: { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -48 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}) => {
  const variant = variants[direction] || variants.up;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15, margin: "-40px" }}
      variants={variant}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
