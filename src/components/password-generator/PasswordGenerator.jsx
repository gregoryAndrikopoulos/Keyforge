import { useCallback, useEffect, useMemo, useState } from "react";
import "./PasswordGenerator.css";
import { CHECKBOXES, OPTION_LABELS } from "../../utils/constants.js";
import { buildPools, generatePassword } from "../../utils/helpers.js";

const CheckboxOption = ({ label, checked, onChange, name }) => {
  const id = `checkbox-${name}`;
  return (
    <label htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        data-testid={`checkbox-${name}`}
      />
      {label}
    </label>
  );
};

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [options, setOptions] = useState({
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeSpecial: false,
    excludeAmbiguous: false,
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const pools = useMemo(() => buildPools(options), [options]);
  const charsetEmpty = useMemo(
    () => pools.reduce((n, p) => n + p.length, 0) === 0,
    [pools]
  );

  useEffect(() => setCopied(false), [generatedPassword]);

  const handleGenerateClick = useCallback(() => {
    if (charsetEmpty) {
      setGeneratedPassword("");
      setError("Select at least one character set.");
      return;
    }
    setError("");
    setGeneratedPassword(generatePassword(passwordLength, options));
  }, [charsetEmpty, options, passwordLength]);

  const handleCopyClick = () => {
    if (!generatedPassword) return;
    navigator.clipboard
      .writeText(generatedPassword)
      .then(() => setCopied(true))
      .catch((err) => {
        console.error("Error copying password to clipboard:", err);
        setCopied(false);
      });
  };

  const handleCheckboxChange = (optionName) => {
    setOptions((prev) => ({ ...prev, [optionName]: !prev[optionName] }));
  };

  return (
    <div
      className="container generator-container"
      data-testid="password-generator"
    >
      <div className="length-input" data-testid="length-group">
        <label htmlFor="length-slider">Password Length: </label>
        <span className="length-display" data-testid="length-display">
          {passwordLength}
        </span>
        <input
          id="length-slider"
          type="range"
          min="6"
          max="256"
          value={passwordLength}
          onInput={(e) => setPasswordLength(parseInt(e.target.value, 10))}
          aria-valuemin={6}
          aria-valuemax={256}
          aria-valuenow={passwordLength}
          data-testid="length-slider"
        />
      </div>

      <div className="column" data-testid="options-labels">
        <div className="password-options">
          <div className="optionLabels" data-testid="labels-column">
            {OPTION_LABELS.map((option) => (
              <label key={option.name} htmlFor={`checkbox-${option.name}`}>
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="column" data-testid="options-controls">
        <div className="password-options">
          <div className="tickLabels" data-testid="controls-column">
            {CHECKBOXES.map((opt) => (
              <CheckboxOption
                key={opt.name}
                name={opt.name}
                label={opt.label}
                checked={options[opt.name]}
                onChange={() => handleCheckboxChange(opt.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          style={{ color: "#b00020", marginTop: "0.5rem" }}
          data-testid="charset-error"
        >
          {error}
        </div>
      )}

      {generatedPassword && (
        <div
          className="generated-password"
          data-testid="generated-section"
        >
          <strong>Generated Password:</strong>
          <textarea
            className="password-textarea"
            value={generatedPassword}
            readOnly
            aria-label="Generated password"
            onFocus={(e) => e.target.select()}
            data-testid="password-output"
          />
          <div
            aria-live="polite"
            role="status"
            style={{ minHeight: "1.25rem", marginTop: "0.25rem" }}
            data-testid="copy-status"
          >
            {copied ? "Copied to clipboard." : ""}
          </div>
        </div>
      )}

      <div className="button-container" data-testid="button-group">
        {!generatedPassword && (
          <button
            className="primary-button"
            onClick={handleGenerateClick}
            disabled={charsetEmpty}
            data-testid="btn-generate"
            title={
              charsetEmpty
                ? "Enable at least one character set"
                : "Generate a password"
            }
          >
            Generate Password
          </button>
        )}
        {generatedPassword && (
          <>
            <button
              className="primary-button"
              onClick={handleGenerateClick}
              disabled={charsetEmpty}
              data-testid="btn-generate-again"
            >
              Generate Again
            </button>
            <button
              className="primary-button"
              onClick={handleCopyClick}
              disabled={!generatedPassword}
              data-testid="btn-copy"
            >
              Copy Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
