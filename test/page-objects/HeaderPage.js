import { $, browser } from "@wdio/globals";

class HeaderPage {
  get root() {
    return $('[data-testid="header.root"]');
  }
  get logo() {
    return $('[data-testid="header.logo"]');
  }

  async open(path = "/") {
    await browser.url(path);
    await (await this.root).waitForExist();
  }

  async getLogo() {
    const el = await this.logo;
    await el.waitForDisplayed();
    return el;
  }
}

export default new HeaderPage();
