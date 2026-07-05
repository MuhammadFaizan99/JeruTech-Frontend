import { motion } from "framer-motion";

const TextReveal = ({ text, className = "", as: Tag = "span", delay = 0 }) => {
  const words = text.split(" ");

  return (
    <Tag className={`text-reveal ${className}`.trim()}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="text-reveal__word"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </Tag>
  );
};

export default TextReveal;
