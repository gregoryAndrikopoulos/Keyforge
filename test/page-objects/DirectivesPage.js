import { $, $$ } from "@wdio/globals";

class DirectivesPage {
  get root() {
    return $('[data-testid="directives.root"]');
  }
  get title() {
    return $('[data-testid="directives.title"]');
  }
  get stepsItems() {
    return $$('[data-testid="directives.steps.item"]');
  }
  get categoryBlocks() {
    return $$('[data-testid="directives.category.block"]');
  }
  itemsForCategory(name) {
    return $$(
      `[data-testid="directives.category.item"][data-category="${name}"]`
    );
  }
  titleForCategory(name) {
    return $(
      `[data-testid="directives.category.title"][data-category="${name}"]`
    );
  }
  get scrollButton() {
    return $('[data-testid="directives.scroll.button"]');
  }

  async clickScrollUp() {
    const btn = await this.scrollButton;
    await btn.waitForDisplayed();
    await btn.click();
  }
}

export default new DirectivesPage();
