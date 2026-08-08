import { useState, useEffect } from "react";

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
      {units.map((unit) => (
        <div key={unit.label} className="countdown-unit">
          <span className="countdown-value">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="countdown-label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
