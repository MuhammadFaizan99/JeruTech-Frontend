const TextReveal = ({ text, className = "", as: Tag = "span" }) => (
  <Tag className={`text-reveal ${className}`.trim()}>{text}</Tag>
);

export default TextReveal;
