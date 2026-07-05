import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiWatch,
  FiBatteryCharging,
} from "react-icons/fi";

const PageBackground = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const parallaxY1 = useTransform(scrollY, [0, 800], [0, -60]);
  const parallaxY2 = useTransform(scrollY, [0, 800], [0, -100]);
  const parallaxY3 = useTransform(scrollY, [0, 800], [0, -40]);

  useEffect(() => {
    const handleMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const floats = [
    { Icon: FiSmartphone, className: "page-bg-float--phone" },
    { Icon: FiMonitor, className: "page-bg-float--laptop" },
    { Icon: FiWatch, className: "page-bg-float--watch" },
    { Icon: FiHeadphones, className: "page-bg-float--headphones" },
    { Icon: FiBatteryCharging, className: "page-bg-float--charger" },
  ];

  return (
    <div className="page-bg-effects" aria-hidden="true">
      <div className="page-bg-base-gradient" />
      <div className="page-bg-beam page-bg-beam--1" />
      <div className="page-bg-beam page-bg-beam--2" />
      <div className="page-bg-grid" />
      <div className="page-bg-circuit" />
      <div className="page-bg-aurora page-bg-aurora--1" />
      <div className="page-bg-aurora page-bg-aurora--2" />
      <div className="page-bg-aurora page-bg-aurora--3" />

      <div className="page-bg-parallax">
        <motion.div style={{ y: parallaxY1 }}>
          {floats.slice(0, 2).map(({ Icon, className }) => (
            <span key={className} className={`page-bg-float ${className}`}>
              <Icon />
            </span>
          ))}
        </motion.div>
        <motion.div style={{ y: parallaxY2 }}>
          {floats.slice(2, 4).map(({ Icon, className }) => (
            <span key={className} className={`page-bg-float ${className}`}>
              <Icon />
            </span>
          ))}
        </motion.div>
        <motion.div style={{ y: parallaxY3 }}>
          {floats.slice(4).map(({ Icon, className }) => (
            <span key={className} className={`page-bg-float ${className}`}>
              <Icon />
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="page-bg-orb page-bg-orb--1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="page-bg-orb page-bg-orb--2"
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="page-bg-orb page-bg-orb--3"
        animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="page-bg-streak page-bg-streak--1" />
      <div className="page-bg-streak page-bg-streak--2" />

      <div
        className="page-bg-mouse-glow"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {[...Array(24)].map((_, i) => (
        <span
          key={i}
          className="page-bg-particle"
          style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
            animationDelay: `${i * 0.35}s`,
            animationDuration: `${4 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
};

export default PageBackground;
