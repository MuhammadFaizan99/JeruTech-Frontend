const FloatingInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
  rows = 4,
}) => {
  const filled = String(value || "").length > 0;

  return (
    <div
      className={`floating-field${filled ? " is-filled" : ""}${multiline ? " floating-field--area" : ""}`}
    >
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder=" "
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
        />
      )}
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

export default FloatingInput;
