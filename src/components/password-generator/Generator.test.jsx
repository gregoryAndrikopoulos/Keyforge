import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Generator from "./Generator.jsx";

function setSlider(val) {
  const slider = screen.getByTestId("length-slider");
  fireEvent.input(slider, { target: { value: String(val) } });
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
    const user = userEvent.setup();
    render(<Generator />);

    // Turn off all include* options
    await user.click(screen.getByTestId("checkbox-includeLowercase"));
    await user.click(screen.getByTestId("checkbox-includeUppercase"));
    await user.click(screen.getByTestId("checkbox-includeNumbers"));
    await user.click(screen.getByTestId("checkbox-includeSymbols"));
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
    const output = await screen.findByTestId("password-output");
    expect(output.value.length).toBe(16);
  });

  it("guarantees at least one of each selected type", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // Ensure only lowercase, uppercase, numbers are selected
    // (Symbols off, Special off by default)
    const cbSymbols = screen.getByTestId("checkbox-includeSymbols");
    if (cbSymbols.checked) await user.click(cbSymbols);

    const cbSpecial = screen.getByTestId("checkbox-includeSpecial");
    if (cbSpecial.checked) await user.click(cbSpecial);

    // Make sure core three are ON (they are by default, but make explicit)
    const cbLower = screen.getByTestId("checkbox-includeLowercase");
    if (!cbLower.checked) await user.click(cbLower);
    const cbUpper = screen.getByTestId("checkbox-includeUppercase");
    if (!cbUpper.checked) await user.click(cbUpper);
    const cbNums = screen.getByTestId("checkbox-includeNumbers");
    if (!cbNums.checked) await user.click(cbNums);

    // Set length equal to the number of enabled categories (6)
    setSlider(6);
    await user.click(screen.getByTestId("btn-generate"));
    const val = (await screen.findByTestId("password-output")).value;

    expect(val.length).toBe(6);
    expect(/[a-z]/.test(val)).toBe(true);
    expect(/[A-Z]/.test(val)).toBe(true);
    expect(/\d/.test(val)).toBe(true);
  });

  it("respects 'exclude ambiguous' (no l i 1 o O 0)", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // Turn on exclude ambiguous
    await user.click(screen.getByTestId("checkbox-excludeAmbiguous"));

    setSlider(48);
    await user.click(screen.getByTestId("btn-generate"));
    const val = (await screen.findByTestId("password-output")).value;

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
    const output = await screen.findByTestId("password-output");
    await user.click(screen.getByTestId("btn-copy"));

    expect(spy).toHaveBeenCalledWith(output.value);
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
    const toggles = [
      "checkbox-includeLowercase",
      "checkbox-includeUppercase",
      "checkbox-includeSymbols",
      "checkbox-includeSpecial",
    ];
    for (const id of toggles) {
      const cb = screen.getByTestId(id);
      if (cb.checked) await user.click(cb);
    }
    const cbNums = screen.getByTestId("checkbox-includeNumbers");
    if (!cbNums.checked) await user.click(cbNums);

    setSlider(10);
    await user.click(screen.getByTestId("btn-generate"));
    const val = (await screen.findByTestId("password-output")).value;

    expect(/^\d{10}$/.test(val)).toBe(true);
  });

  it("toggling 'exclude ambiguous' doesn't crash and still generates", async () => {
    const user = userEvent.setup();
    render(<Generator />);

    // turn on exclude ambiguous
    const cb = screen.getByTestId("checkbox-excludeAmbiguous");
    if (!cb.checked) await user.click(cb);

    // generate a long password
    const slider = screen.getByTestId("length-slider");
    fireEvent.input(slider, { target: { value: "64" } });

    await user.click(screen.getByTestId("btn-generate"));
    const val = (await screen.findByTestId("password-output")).value;

    expect(val.length).toBe(64);
    expect(/[li1oO0]/.test(val)).toBe(false);
  });
});
