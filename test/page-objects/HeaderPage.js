import { $, browser } from "@wdio/globals";

class HeaderPage {
  // Roots & key elements
  get root() {
    return $('[data-testid="header.root"]');
  }
  get title() {
    return $('[data-testid="header.title"]');
  }
  get subtitle() {
    return $('[data-testid="header.subtitle"]');
  }

  // Navigation
  async open(path = "/") {
    await browser.url(path);
    await (await this.root).waitForExist();
  }

  // Accessors
  async getTitleText() {
    const el = await this.title;
    await el.waitForDisplayed();
    return el.getText();
  }

  async getSubtitleText() {
    const el = await this.subtitle;
    await el.waitForDisplayed();
    return el.getText();
  }
}

export default new HeaderPage();
