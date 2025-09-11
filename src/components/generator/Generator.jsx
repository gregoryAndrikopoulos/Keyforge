import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHECKBOXES, OPTION_LABELS, SETS } from "../../utils/constants.js";
import { buildPools, generatePassword } from "../../utils/helpers.js";
import "./Generator.css";

const SAMPLE_BY_NAME = {
  includeLowercase: "a-z",
  includeUppercase: "A-Z",
  includeNumbers: "0-9",
  includeSymbols: "!@#$%^&?",
  includeSpecial: "+-*/=…",
  excludeAmbiguous: "li1oO0",
};

const classifyChar = (ch) => {
  if (SETS.includeLowercase.includes(ch)) return "ch-lower";
  if (SETS.includeUppercase.includes(ch)) return "ch-upper";
  if (SETS.includeNumbers.includes(ch)) return "ch-digit";
  if (SETS.includeSpecial.includes(ch)) return "ch-special";
  if (SETS.includeSymbols.includes(ch)) return "ch-symbol";
  return "ch-other";
};

const CheckboxRow = ({ name, label, checked, onToggle }) => {
  const id = `checkbox-${name}`;
  const sample = SAMPLE_BY_NAME[name];
  return (
    <label className="switch-row" htmlFor={id}>
      <span className="switch-text">
        <span className="switch-title">{label}</span>
        {sample ? <span className="switch-sample">{sample}</span> : null}
      </span>
      <input
        id={id}
        type="checkbox"
        className="switch-input"
        name={name}
        checked={checked}
        onChange={onToggle}
        data-testid={`checkbox-${name}`}
      />
      <span aria-hidden="true" className="switch-visual" />
    </label>
  );
};

const Generator = () => {
  const MIN_LEN = 6;
  const MAX_LEN = 256;

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

  const labelByName = useMemo(
    () =>
      OPTION_LABELS.reduce((acc, o) => {
        acc[o.name] = o.label;
        return acc;
      }, {}),
    []
  );

  const pools = useMemo(() => buildPools(options), [options]);
  const charsetEmpty = useMemo(
    () => pools.reduce((n, p) => n + p.length, 0) === 0,
    [pools]
  );

  useEffect(() => setCopied(false), [generatedPassword]);

  const sliderRef = useRef(null);
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.style.setProperty("--min", String(MIN_LEN));
    el.style.setProperty("--max", String(MAX_LEN));
    el.style.setProperty("--val", String(passwordLength));
  }, [passwordLength, MIN_LEN, MAX_LEN]);

  const handleGenerateClick = useCallback(() => {
    if (charsetEmpty) {
      setGeneratedPassword("");
      setError("Select at least one character set.");
      return;
    }
    setError("");
    setGeneratedPassword(generatePassword(passwordLength, options));
  }, [charsetEmpty, options, passwordLength]);

  const handleCopyClick = useCallback(async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [generatedPassword]);

  const toggleOption = useCallback(
    (name) => setOptions((prev) => ({ ...prev, [name]: !prev[name] })),
    []
  );

  const outputRef = useRef(null);
  const handleOutputFocus = useCallback(() => {
    const el = outputRef.current;
    if (!el) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }, []);

  return (
    <div className="generator-shell" data-testid="generator">
      <header className="generator-header">
        <h1 className="generator-title">Password Generator</h1>
        <p className="generator-subtitle">
          Create strong, unique passwords instantly.
        </p>
      </header>

      <section className="generator-card">
        <div className="length-input" data-testid="length-group">
          <label htmlFor="length-slider" className="length-label">
            Password Length
          </label>
          <div className="length-control">
            <input
              ref={sliderRef}
              id="length-slider"
              type="range"
              min={MIN_LEN}
              max={MAX_LEN}
              value={passwordLength}
              onInput={(e) => {
                const v = parseInt(e.target.value, 10);
                setPasswordLength(v);
                e.currentTarget.style.setProperty("--val", String(v));
              }}
              aria-valuemin={MIN_LEN}
              aria-valuemax={MAX_LEN}
              aria-valuenow={passwordLength}
              data-testid="length-slider"
            />
            <span className="length-display" data-testid="length-display">
              {passwordLength}
            </span>
          </div>
        </div>

        <div className="options-grid">
          <div className="password-options" data-testid="options-labels">
            <div
              className="optionLabels visually-hidden"
              data-testid="labels-column"
            >
              {OPTION_LABELS.map((o) => (
                <label key={o.name} htmlFor={`checkbox-${o.name}`}>
                  {o.label}
                </label>
              ))}
            </div>
          </div>

          <div className="password-options" data-testid="options-controls">
            <div className="tickLabels" data-testid="controls-column">
              {CHECKBOXES.map((opt) => (
                <CheckboxRow
                  key={opt.name}
                  name={opt.name}
                  label={labelByName[opt.name] || opt.label}
                  checked={!!options[opt.name]}
                  onToggle={() => toggleOption(opt.name)}
                />
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="inline-error"
            data-testid="charset-error"
          >
            {error}
          </div>
        )}

        {generatedPassword && (
          <div className="generated-password" data-testid="generated-section">
            <div className="output-header">
              <strong>Generated Password</strong>
              <div
                aria-live="polite"
                role="status"
                className="copy-status"
                data-testid="copy-status"
              >
                {copied ? "Copied to clipboard." : ""}
              </div>
            </div>

            <div
              ref={outputRef}
              className="password-output"
              role="textbox"
              aria-readonly="true"
              tabIndex={0}
              onFocus={handleOutputFocus}
              data-testid="password-output"
              title="Click to select"
            >
              <span className="password-output-line">
                {generatedPassword.split("").map((ch, i) => (
                  <span key={i} className={classifyChar(ch)}>
                    {ch}
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}

        <div className="button-row" data-testid="button-group">
          {!generatedPassword ? (
            <button
              className="btn btn-primary"
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
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={handleGenerateClick}
                disabled={charsetEmpty}
                data-testid="btn-generate-again"
              >
                Generate Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCopyClick}
                disabled={!generatedPassword}
                data-testid="btn-copy"
              >
                Copy Password
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Generator;
