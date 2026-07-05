import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const getTimeLeft = (endDate) => {
  const diff = Math.max(0, endDate - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const CountdownTimer = () => {
  const endDate = new Date("2026-07-01T00:00:00").getTime();
  const [time, setTime] = useState(getTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  return (
    <div className="countdown-timer">
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          className="countdown-unit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <motion.span
            key={unit.value}
            className="countdown-value"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(unit.value).padStart(2, "0")}
          </motion.span>
          <span className="countdown-label">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
