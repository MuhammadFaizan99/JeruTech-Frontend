import { useEffect, useState } from "react";
import { FiCpu } from "react-icons/fi";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("jerutech-loaded")) {
      setVisible(false);
      return;
    }

    let frame;
    const start = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          sessionStorage.setItem("jerutech-loaded", "1");
          setVisible(false);
        }, 350);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  return (
    <div className="loading-screen" aria-live="polite" aria-label="Loading JeruTech">
      <div className="loading-screen__glow" aria-hidden="true" />
      <div className="loading-screen__logo">
        <FiCpu />
        <span>JeruTech</span>
      </div>
      <div className="loading-screen__bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-screen__text">Loading premium experience…</p>
    </div>
  );
};

export default LoadingScreen;
