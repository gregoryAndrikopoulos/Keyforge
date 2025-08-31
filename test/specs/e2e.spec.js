import { expect } from "@wdio/globals";

describe("Keyforge smoke test", () => {
  it("renders the app shell with heading", async () => {
    await browser.url("/");

    const root = await $("#root");
    await expect(root).toBeExisting();

    const h1 = await $("h1");
    await expect(h1).toBeDisplayed();
    await expect(h1).toHaveText("Hello, Keyforge!");

    const title = await browser.getTitle();
    expect(title).toMatch(/Keyforge/i);
  });
});
