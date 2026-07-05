import { useRef } from "react";

const RippleSurface = ({ children, className = "", as: Tag = "div", ...props }) => {
  const ref = useRef(null);

  const handleClick = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple-surface__wave";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
    props.onClick?.(e);
  };

  return (
    <Tag ref={ref} className={`ripple-surface ${className}`.trim()} onClick={handleClick} {...props}>
      {children}
    </Tag>
  );
};

export default RippleSurface;
