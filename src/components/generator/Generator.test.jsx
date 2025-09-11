import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Generator from "./Generator.jsx";

function setSlider(val) {
  const slider = screen.getByTestId("length-slider");
  fireEvent.input(slider, { target: { value: String(val) } });
}

// Click the visible toggle (input + .switch-visual is the hit target)
async function clickToggle(name, desired) {
  const user = userEvent.setup();
  const input = screen.getByTestId(`checkbox-${name}`);
  const toggle = input.nextElementSibling?.classList.contains("switch-visual")
    ? input.nextElementSibling
    : input; // fallback, just in case

  const before = input.checked;

  if (desired === undefined) {
    await user.click(toggle);
    await waitFor(() => expect(input.checked).toBe(!before));
    return;
  }

  if (before !== desired) {
    await user.click(toggle);
    await waitFor(() => expect(input.checked).toBe(desired));
  }
}

// Read the generated password from the div-based output
async function getOutputValue() {
  const el = await screen.findByTestId("password-output");
  return el.textContent || "";
}

describe("Generator (component tests)", () => {
  it("renders and the Generate button is enabled by default", () => {
    render(<Generator />);
    const btn = screen.getByTestId("btn-generate");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });

  it("updates the displayed length when the slider moves", () => {
    render(<Generator />);
    setSlider(20);
    expect(screen.getByTestId("length-display")).toHaveTextContent("20");
  });

  it("disables generation when all character sets are unchecked", async () => {
    render(<Generator />);

    // Turn off all include* options
    await clickToggle("includeLowercase", false);
    await clickToggle("includeUppercase", false);
    await clickToggle("includeNumbers", false);
    await clickToggle("includeSymbols", false);
    // includeSpecial is false by default; leave as is

    // Button should be disabled; no error shown yet (no click)
    expect(screen.getByTestId("btn-generate")).toBeDisabled();
    expect(screen.queryByTestId("charset-error")).not.toBeInTheDocument();
  });

  it("generates exactly the selected length", async () => {
    const user = userEvent.setup();
    render(<Generator />);
    setSlider(16);
    await user.click(screen.getByTestId("btn-generate"));
    const val = await getOutputValue();
    expect(val.length).toBe(16);
  });

  it("guarantees at least one of each selected type", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // Ensure only lowercase, uppercase, numbers are selected
    await clickToggle("includeSymbols", false);
    await clickToggle("includeSpecial", false);
    await clickToggle("includeLowercase", true);
    await clickToggle("includeUppercase", true);
    await clickToggle("includeNumbers", true);

    // Set length equal to the number of enabled categories (6)
    setSlider(6);
    await user.click(screen.getByTestId("btn-generate"));

    const val = await getOutputValue();
    expect(val.length).toBe(6);
    expect(/[a-z]/.test(val)).toBe(true);
    expect(/[A-Z]/.test(val)).toBe(true);
    expect(/\d/.test(val)).toBe(true);
  });

  it("respects 'exclude ambiguous' (no l i 1 o O 0)", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // Turn on exclude ambiguous
    await clickToggle("excludeAmbiguous", true);

    setSlider(48);
    await user.click(screen.getByTestId("btn-generate"));
    const val = await getOutputValue();

    // No ambiguous chars present
    expect(/[li1oO0]/.test(val)).toBe(false);
  });

  it("copies to clipboard and shows status message", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // Spy on clipboard
    const spy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();

    setSlider(12);
    await user.click(screen.getByTestId("btn-generate"));
    const text = await getOutputValue();
    await user.click(screen.getByTestId("btn-copy"));

    expect(spy).toHaveBeenCalledWith(text);
    // Status message appears
    expect(screen.getByTestId("copy-status")).toHaveTextContent(
      "Copied to clipboard."
    );

    spy.mockRestore();
  });

  it("can generate digits-only when only Numbers is on", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // Turn off all except numbers
    await clickToggle("includeLowercase", false);
    await clickToggle("includeUppercase", false);
    await clickToggle("includeSymbols", false);
    await clickToggle("includeSpecial", false);
    await clickToggle("includeNumbers", true);

    setSlider(10);
    await user.click(screen.getByTestId("btn-generate"));
    const val = await getOutputValue();

    expect(/^\d{10}$/.test(val)).toBe(true);
  });

  it("toggling 'exclude ambiguous' doesn't crash and still generates", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // turn on exclude ambiguous
    await clickToggle("excludeAmbiguous", true);

    // generate a long password
    const slider = screen.getByTestId("length-slider");
    fireEvent.input(slider, { target: { value: "64" } });

    await user.click(screen.getByTestId("btn-generate"));
    const val = await getOutputValue();

    expect(val.length).toBe(64);
    expect(/[li1oO0]/.test(val)).toBe(false);
  });
});
