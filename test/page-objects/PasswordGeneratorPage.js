class PasswordGeneratorPage {
  get root() {
    return $('[data-testid="password-generator"]');
  }
  get lengthGroup() {
    return $('[data-testid="length-group"]');
  }
  get buttonGroup() {
    return $('[data-testid="button-group"]');
  }

  // Controls
  get slider() {
    return $('[data-testid="length-slider"]');
  }
  get btnGenerate() {
    return $('[data-testid="btn-generate"]');
  }
  get btnGenerateAgain() {
    return $('[data-testid="btn-generate-again"]');
  }
  get btnCopy() {
    return $('[data-testid="btn-copy"]');
  }

  checkbox(name) {
    return $(`[data-testid="checkbox-${name}"]`);
  }

  // Output / status
  get output() {
    return $('[data-testid="password-output"]');
  }
  get copyStatus() {
    return $('[data-testid="copy-status"]');
  }
  get charsetError() {
    return $('[data-testid="charset-error"]');
  }

  // Navigation
  async open(path = "/") {
    await browser.url(path);
    await (await this.root).waitForExist();
    await (await this.lengthGroup).waitForDisplayed();
  }

  // Actions
  async setLength(value) {
    const el = await this.slider;
    await browser.execute(
      (slider, val) => {
        slider.value = String(val);
        slider.dispatchEvent(new Event("input", { bubbles: true }));
        slider.dispatchEvent(new Event("change", { bubbles: true }));
      },
      el,
      value
    );
  }

  async toggle(name, desired) {
    const box = await this.checkbox(name);
    const selected = await box.isSelected();
    if (desired === undefined) {
      await box.click();
      return;
    }
    if (selected !== desired) await box.click();
  }

  async generate() {
    const primary = await this.btnGenerate;
    if (await primary.isExisting()) {
      await primary.click();
      return;
    }
    const again = await this.btnGenerateAgain;
    await again.click();
  }

  async getPassword() {
    const el = await this.output;
    await el.waitForDisplayed();
    return el.getValue();
  }
}

export default new PasswordGeneratorPage();
