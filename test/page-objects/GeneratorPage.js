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

  checkboxInput(name) {
    return $(`[data-testid="checkbox-${name}"]`);
  }

  checkboxToggle(name) {
    return $(`#checkbox-${name} + .switch-visual`);
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
    const input = await this.checkboxInput(name);
    const toggle = await this.checkboxToggle(name);

    await toggle.scrollIntoView();
    await toggle.moveTo();

    const current = await input.isSelected();

    if (desired === undefined) {
      await toggle.click();
      await browser.waitUntil(
        async () => (await input.isSelected()) !== current,
        { timeout: 1500, timeoutMsg: `Toggle "${name}" did not change state` }
      );
      return;
    }

    if (current !== desired) {
      await toggle.click();
      await browser.waitUntil(
        async () => (await input.isSelected()) === desired,
        {
          timeout: 1500,
          timeoutMsg: `Toggle "${name}" did not reach desired state`,
        }
      );
    }
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
