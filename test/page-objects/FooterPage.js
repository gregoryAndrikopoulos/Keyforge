import { $ } from "@wdio/globals";

class FooterPage {
  get root() {
    return $('[data-testid="footer.root"]');
  }
  get text() {
    return $('[data-testid="footer.text"]');
  }
  async getText() {
    const el = await this.text;
    await el.waitForDisplayed();
    return el.getText();
  }
}

export default new FooterPage();
