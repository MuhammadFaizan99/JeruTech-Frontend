const WaveSeparator = ({ flip = false, className = "" }) => (
  <div className={`wave-separator ${flip ? "wave-separator--flip" : ""} ${className}`}>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(37, 99, 235, 0.4)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
          <stop offset="100%" stopColor="rgba(37, 99, 235, 0.4)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#waveGrad)"
        d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
      />
      <path
        fill="rgba(15, 23, 42, 0.85)"
        opacity="0.9"
        d="M0,80L60,74.7C120,69,240,59,360,64C480,69,600,91,720,90.7C840,91,960,69,1080,64C1200,59,1320,69,1380,74.7L1440,80L1440,120L0,120Z"
      />
    </svg>
  </div>
);

export default WaveSeparator;
