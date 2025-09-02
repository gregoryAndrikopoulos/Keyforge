class GeneratorPage {
  get root() {
    return $('[data-testid="generator"]');
  }
  get lengthGroup() {
    return $('[data-testid="length-group"]');
  }
  get slider() {
    return $('[data-testid="length-slider"]');
  }
  get btnGenerate() {
    return $('[data-testid="btn-generate"]');
  }
  get btnGenerateAgain() {
    return $('[data-testid="btn-generate-again"]');
  }
  checkbox(name) {
    return $(`[data-testid="checkbox-${name}"]`);
  }
  get output() {
    return $('[data-testid="password-output"]');
  }

  async open(path = "/") {
    await browser.url(path);
    await (await this.root).waitForExist();
    await (await this.lengthGroup).waitForDisplayed();
  }

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
    return el.getText();
  }
}

export default new GeneratorPage();
