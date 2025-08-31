export const AMBIGUOUS_CHARS = "li1oO0";

export const SETS = {
  includeLowercase: "abcdefghijklmnopqrstuvwxyz",
  includeUppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  includeNumbers:   "0123456789",
  includeSymbols:   "!@#$%^&?",
  includeSpecial:   "{}[]()+-*/=\\'\"`~,;:._<>",
};

export const CHECKBOXES = [
  { name: "includeLowercase", label: " ( a-z )" },
  { name: "includeUppercase", label: " ( A-Z )" },
  { name: "includeNumbers",   label: " ( 0-9 )" },
  { name: "includeSymbols",   label: " ( !@#$%^&? )" },
  { name: "includeSpecial",   label: " ( e.g. +-*/= )" },
  { name: "excludeAmbiguous", label: " ( li1oO0 )" },
];

export const OPTION_LABELS = [
  { name: "includeLowercase", label: "Lowercase:" },
  { name: "includeUppercase", label: "Uppercase:" },
  { name: "includeNumbers",   label: "Numbers:" },
  { name: "includeSymbols",   label: "Symbols:" },
  { name: "includeSpecial",   label: "Special:" },
  { name: "excludeAmbiguous", label: "Excl. Ambiguous:" },
];
