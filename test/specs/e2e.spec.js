import PasswordGeneratorPage from "../page-objects/PasswordGeneratorPage.js";

const SETS = {
  includeLowercase: "abcdefghijklmnopqrstuvwxyz",
  includeUppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  includeNumbers:   "0123456789",
  includeSymbols:   "!@#$%^&?",
  includeSpecial:   "{}[]()+-*/=\\'\"`~,;:._<>",
};
const AMBIGUOUS = new Set(["l", "i", "1", "o", "O", "0"]);

function hasOneFrom(str, chars) {
  const pool = new Set(chars.split(""));
  for (const ch of str) if (pool.has(ch)) return true;
  return false;
}

function filterAmbiguous(chars) {
  return [...chars].filter((c) => !AMBIGUOUS.has(c)).join("");
}

async function setOnlyNumbers() {
  await PasswordGeneratorPage.toggle("includeLowercase", false);
  await PasswordGeneratorPage.toggle("includeUppercase", false);
  await PasswordGeneratorPage.toggle("includeSymbols", false);
  await PasswordGeneratorPage.toggle("includeSpecial", false);
  await PasswordGeneratorPage.toggle("includeNumbers", true);
}

describe("Password Generator (E2E)", () => {
  beforeEach(async () => {
    await PasswordGeneratorPage.open();
  });

  it("loads and generates a default password", async () => {
    await PasswordGeneratorPage.generate();
    const value = await PasswordGeneratorPage.getPassword();
    if (!value || value.length < 6) {
      throw new Error(`Expected a generated password length >= 6, got "${value}"`);
    }
  });

  it("numbers-only flow (12 digits)", async () => {
    await setOnlyNumbers();
    await PasswordGeneratorPage.setLength(12);
    await PasswordGeneratorPage.generate();

    const val = await PasswordGeneratorPage.getPassword();
    if (!/^\d{12}$/.test(val)) {
      throw new Error(`Expected exactly 12 digits, got "${val}"`);
    }
  });

  it("excludes ambiguous characters when enabled", async () => {
    await PasswordGeneratorPage.toggle("excludeAmbiguous", true);
    await PasswordGeneratorPage.setLength(64);
    await PasswordGeneratorPage.generate();

    const val = await PasswordGeneratorPage.getPassword();
    if (/[li1oO0]/.test(val)) {
      throw new Error(`Found ambiguous characters in "${val}"`);
    }
  });

  it("regenerate produces a different password (very high probability)", async () => {
    await PasswordGeneratorPage.setLength(24);
    await PasswordGeneratorPage.generate();
    const first = await PasswordGeneratorPage.getPassword();

    await PasswordGeneratorPage.generate();
    let second = await PasswordGeneratorPage.getPassword();

    if (second === first) {
      await PasswordGeneratorPage.generate();
      second = await PasswordGeneratorPage.getPassword();
    }
    if (second === first) {
      throw new Error("Expected regenerate to change the password value.");
    }
  });

  it("all categories included (no ambiguous) → at least one from each set", async () => {
    await PasswordGeneratorPage.toggle("includeLowercase", true);
    await PasswordGeneratorPage.toggle("includeUppercase", true);
    await PasswordGeneratorPage.toggle("includeNumbers", true);
    await PasswordGeneratorPage.toggle("includeSymbols", true);
    await PasswordGeneratorPage.toggle("includeSpecial", true);
    await PasswordGeneratorPage.toggle("excludeAmbiguous", false);

    await PasswordGeneratorPage.setLength(32);
    await PasswordGeneratorPage.generate();

    const val = await PasswordGeneratorPage.getPassword();
    for (const key of Object.keys(SETS)) {
      if (!hasOneFrom(val, SETS[key])) {
        throw new Error(`Expected at least one character from set "${key}"`);
      }
    }
  });

  it("all categories + exclude ambiguous → includes each set and no ambiguous chars", async () => {
    await PasswordGeneratorPage.toggle("includeLowercase", true);
    await PasswordGeneratorPage.toggle("includeUppercase", true);
    await PasswordGeneratorPage.toggle("includeNumbers", true);
    await PasswordGeneratorPage.toggle("includeSymbols", true);
    await PasswordGeneratorPage.toggle("includeSpecial", true);
    await PasswordGeneratorPage.toggle("excludeAmbiguous", true);

    await PasswordGeneratorPage.setLength(32);
    await PasswordGeneratorPage.generate();

    const val = await PasswordGeneratorPage.getPassword();
    if (/[li1oO0]/.test(val)) {
      throw new Error(`Found ambiguous characters in "${val}"`);
    }
    for (const key of Object.keys(SETS)) {
      const filtered = filterAmbiguous(SETS[key]);
      if (filtered.length === 0) continue;
      if (!hasOneFrom(val, filtered)) {
        throw new Error(`Expected at least one from filtered set "${key}"`);
      }
    }
  });
});
