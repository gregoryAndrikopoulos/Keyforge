import HeaderPage from "../page-objects/HeaderPage.js";
import DirectivesPage from "../page-objects/DirectivesPage.js";
import FooterPage from "../page-objects/FooterPage.js";

describe("Layout (Header / Directives / Footer)", () => {
  beforeEach(async () => {
    await HeaderPage.open("/");
  });

  it("header renders logo", async () => {
    await (await HeaderPage.root).waitForExist();
    const logo = await HeaderPage.getLogo();
    expect(await logo.isDisplayed()).toBe(true);
  });

  it("directives render with steps and categories", async () => {
    await (await DirectivesPage.root).waitForExist();

    const h2TextRaw = await (await DirectivesPage.title).getText();
    const h2Text = h2TextRaw.toLowerCase().replace(/\s+/g, " ").trim();
    if (
      !h2Text.includes("usage directives") ||
      !h2Text.includes("security tips")
    ) {
      throw new Error(`Directives title mismatch: "${h2TextRaw}"`);
    }

    const steps = await DirectivesPage.stepsItems;
    if (steps.length < 3) {
      throw new Error(`Expected >= 3 directive steps, found ${steps.length}`);
    }

    const categoryBlocks = await DirectivesPage.categoryBlocks;
    if (categoryBlocks.length < 3) {
      throw new Error(
        `Expected >= 3 categories, found ${categoryBlocks.length}`
      );
    }

    for (const cat of ["Basics", "Storage", "Authentication"]) {
      const titleEl = await DirectivesPage.titleForCategory(cat);
      if (!(await titleEl.isExisting())) {
        throw new Error(`Missing category heading: ${cat}`);
      }
      const items = await DirectivesPage.itemsForCategory(cat);
      if (items.length === 0) {
        throw new Error(`Category "${cat}" has no items`);
      }
    }

    // Ensure every category block has at least one item
    for (const block of await DirectivesPage.categoryBlocks) {
      const items = await block.$$('[data-testid="directives.category.item"]');
      if (items.length === 0) {
        const cat = await block.getAttribute("data-category");
        throw new Error(`Category "${cat}" has no items`);
      }
    }
  });

  it('scroll up button navigates to "#top"', async () => {
    await (await DirectivesPage.scrollButton).waitForDisplayed();
    await DirectivesPage.clickScrollUp();

    const url = await browser.getUrl();
    if (!url.includes("#top")) {
      throw new Error(`Expected URL to include "#top", got "${url}"`);
    }
    const hash = await browser.execute(() => window.location.hash);
    if (hash !== "#top") {
      throw new Error(
        `Expected window.location.hash to be "#top", got "${hash}"`
      );
    }
  });

  it("footer renders current year and brand", async () => {
    await (await FooterPage.root).waitForExist();
    const text = (await FooterPage.getText()).trim();
    const year = String(new Date().getFullYear());

    if (!text.includes(year)) {
      throw new Error(
        `Footer missing current year ${year}: "${year}" in "${text}"`
      );
    }
    if (!/Keyforge/i.test(text)) {
      throw new Error(`Footer missing brand name "Keyforge": "${text}"`);
    }
  });
});
