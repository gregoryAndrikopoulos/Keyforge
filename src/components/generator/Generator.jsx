import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHECKBOXES, OPTION_LABELS, SETS } from "../../utils/constants.js";
import { buildPools, generatePassword } from "../../utils/helpers.js";
import "./Generator.css";

const SAMPLE_BY_NAME = {
  includeLowercase: "a-z",
  includeUppercase: "A-Z",
  includeNumbers: "0-9",
  includeSymbols: "!@#$%^&?",
  includeSpecial: "+-*/=...",
  excludeAmbiguous: "li1oO0",
};

const CLASS_BY_NAME = {
  includeLowercase: "legend-lower",
  includeUppercase: "legend-upper",
  includeNumbers: "legend-digit",
  includeSymbols: "legend-symbol",
  includeSpecial: "legend-special",
  excludeAmbiguous: "legend-ambiguous",
};

const classifyChar = (ch) => {
  if (SETS.includeLowercase.includes(ch)) return "ch-lower";
  if (SETS.includeUppercase.includes(ch)) return "ch-upper";
  if (SETS.includeNumbers.includes(ch)) return "ch-digit";
  if (SETS.includeSpecial.includes(ch)) return "ch-special";
  if (SETS.includeSymbols.includes(ch)) return "ch-symbol";
  return "ch-other";
};

const CheckboxOption = ({ label, checked, onChange, name }) => {
  const id = `checkbox-${name}`;
  const base = String(label).split("(")[0].trim();
  const sample = SAMPLE_BY_NAME[name];
  const sampleClass = CLASS_BY_NAME[name];

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
      <span>{base}</span>
      {sample && (
        <>
          {" "}
          <span className={sampleClass}>{sample}</span>
        </>
      )}
    </label>
  );
};

const Generator = () => {
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
      .catch(() => setCopied(false));
  };

  const handleCheckboxChange = (optionName) =>
    setOptions((prev) => ({ ...prev, [optionName]: !prev[optionName] }));

  const outputRef = useRef(null);
  const handleOutputFocus = () => {
    const el = outputRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  return (
    <div className="container generator-container" data-testid="generator">
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
        <div className="generated-password" data-testid="generated-section">
          <strong>Generated Password:</strong>
          <div
            ref={outputRef}
            className="password-output"
            role="textbox"
            aria-readonly="true"
            tabIndex={0}
            onFocus={handleOutputFocus}
            data-testid="password-output"
          >
            <span className="password-output-line">
              {generatedPassword.split("").map((ch, i) => (
                <span key={i} className={classifyChar(ch)}>
                  {ch}
                </span>
              ))}
            </span>
          </div>
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

export default Generator;
