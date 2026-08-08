import { memo } from "react";
import {
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiWatch,
  FiBatteryCharging,
} from "react-icons/fi";

const PageBackground = () => {
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
        <div>
          {floats.slice(0, 2).map(({ Icon, className }) => (
            <span key={className} className={`page-bg-float ${className}`}>
              <Icon />
            </span>
          ))}
        </div>
        <div>
          {floats.slice(2, 4).map(({ Icon, className }) => (
            <span key={className} className={`page-bg-float ${className}`}>
              <Icon />
            </span>
          ))}
        </div>
        <div>
          {floats.slice(4).map(({ Icon, className }) => (
            <span key={className} className={`page-bg-float ${className}`}>
              <Icon />
            </span>
          ))}
        </div>
      </div>

      <div className="page-bg-orb page-bg-orb--1" />
      <div className="page-bg-orb page-bg-orb--2" />
      <div className="page-bg-orb page-bg-orb--3" />

      <div className="page-bg-streak page-bg-streak--1" />
      <div className="page-bg-streak page-bg-streak--2" />

      {[...Array(14)].map((_, i) => (
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

export default memo(PageBackground);
