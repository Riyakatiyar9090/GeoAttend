import { useRef, useEffect } from "react";
import "./OTPInput.css";

export default function OTPInput({
  length = 6,
  value,
  onChange,
  error,
  disabled,
}) {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const setDigit = (index, digit) => {
    const next = value.split("");
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  };

  const handleChange = (e, index) => {
    const digit = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    if (!digit) return;
    setDigit(index, digit);
    if (index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(value.length, "").slice(0, length));
    const lastIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className={`otp-input-group ${error ? "otp-error" : ""}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-box"
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
