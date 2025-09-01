import { $, browser } from "@wdio/globals";

class FooterPage {
  // Roots & text
  get root() {
    return $('[data-testid="footer.root"]');
  }
  get content() {
    return $('[data-testid="footer.content"]');
  }
  get text() {
    return $('[data-testid="footer.text"]');
  }

  // Navigation
  async open(path = "/") {
    await browser.url(path);
    await (await this.root).waitForExist();
  }

  // Accessors
  async getText() {
    const el = await this.text;
    await el.waitForDisplayed();
    return el.getText();
  }
}

export default new FooterPage();
