import { memo } from "react";

const ScrollReveal = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

export default memo(ScrollReveal);
