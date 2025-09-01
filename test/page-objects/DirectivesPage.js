import { $, $$, browser } from "@wdio/globals";

class DirectivesPage {
  // Roots & headings
  get root() {
    return $('[data-testid="directives.root"]');
  }
  get title() {
    return $('[data-testid="directives.title"]');
  }

  // Steps (ordered list)
  get stepsTitle() {
    return $('[data-testid="directives.steps.title"]');
  }
  get stepsList() {
    return $('[data-testid="directives.steps.list"]');
  }
  get stepsItems() {
    return $$('[data-testid="directives.steps.item"]');
  }

  // Categories (repeatable blocks)
  get categoryBlocks() {
    return $$('[data-testid="directives.category.block"]');
  }
  get categoryTitles() {
    return $$('[data-testid="directives.category.title"]');
  }
  get categoryLists() {
    return $$('[data-testid="directives.category.list"]');
  }
  get categoryItemsAll() {
    return $$('[data-testid="directives.category.item"]');
  }

  // Per-category helpers
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

  listForCategory(name) {
    return $(
      `[data-testid="directives.category.list"][data-category="${name}"]`
    );
  }

  // Scroll button
  get scrollBlock() {
    return $('[data-testid="directives.scroll.block"]');
  }
  get scrollButton() {
    return $('[data-testid="directives.scroll.button"]');
  }

  async clickScrollUp() {
    const btn = await this.scrollButton;
    await btn.waitForDisplayed();
    await btn.click();
  }

  // Navigation
  async open(path = "/") {
    await browser.url(path);
    await (await this.root).waitForExist();
  }
}

export default new DirectivesPage();
