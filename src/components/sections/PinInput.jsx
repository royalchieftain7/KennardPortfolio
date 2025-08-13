import React, { useRef } from "react";

const PinInput = ({ value, onChange, length = 6, disabled }) => {
  const inputs = Array.from({ length });
  const refs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newValue = value.split("");
    newValue[idx] = val[val.length - 1];
    onChange(newValue.join(""));
    if (idx < length - 1 && val) {
      refs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      refs.current[idx - 1].focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
      {inputs.map((_, idx) => (
        <input
          key={idx}
          ref={el => (refs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ""}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          style={{
            width: "2.5rem",
            height: "2.5rem",
            textAlign: "center",
            fontSize: "1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            background: "#232323",
            color: "var(--main-color)",
            fontFamily: '"DM Sans", sans-serif',
            outline: "none",
          }}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default PinInput;