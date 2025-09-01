export const AMBIGUOUS_CHARS = "li1oO0";

export const SETS = {
  includeLowercase: "abcdefghijklmnopqrstuvwxyz",
  includeUppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  includeNumbers: "0123456789",
  includeSymbols: "!@#$%^&?",
  includeSpecial: "{}[]()+-*/=\\'\"`~,;:._<>",
};

export const CHECKBOXES = [
  { name: "includeLowercase", label: " ( a-z )" },
  { name: "includeUppercase", label: " ( A-Z )" },
  { name: "includeNumbers", label: " ( 0-9 )" },
  { name: "includeSymbols", label: " ( !@#$%^&? )" },
  { name: "includeSpecial", label: " ( e.g. +-*/= )" },
  { name: "excludeAmbiguous", label: " ( li1oO0 )" },
];

export const OPTION_LABELS = [
  { name: "includeLowercase", label: "Lowercase:" },
  { name: "includeUppercase", label: "Uppercase:" },
  { name: "includeNumbers", label: "Numbers:" },
  { name: "includeSymbols", label: "Symbols:" },
  { name: "includeSpecial", label: "Special:" },
  { name: "excludeAmbiguous", label: "Excl. Ambiguous:" },
];

export const DIRECTIVES_STEPS = [
  "Adjust the password length using the range slider.",
  "Check the options that you want to include or exclude in the password.",
  'Click "Generate Password" to create your password.',
  'Use the "Copy Password" button to copy the password to the clipboard.',
];

export const SECURITY_TIPS = {
  Basics: [
    "Password strength is defined by the interrelation of length and complexity.",
    "Given the current capacity of brute force attacks, passwords should be at least 16 characters long.",
    "Easily guessable information such as birthdays, names, postcodes, house or phone numbers, ID numbers, and social security numbers should be avoided.",
    "Patterns in the form of numbers or coherent text within the password should be avoided as much as possible.",
    "Different passwords should be distinct from one another and not share patterns or similarities.",
    "No matter how strong, reusing the same password across different online services is not advised.",
    "It is a good practice to update passwords regularly for increased security.",
    "Passwords should be checked on credible websites from time to time in case they have been compromised in a data breach.",
  ],
  Storage: [
    "It is not recommended to write down passwords, or store them in easily accessible physical or digital locations.",
    "It is advisable to avoid storing critical passwords in the cloud. Instead, safely storing passwords on encrypted drives is preferable.",
    "Smart devices typically use lockscreen passwords as an encryption method. Computers and storage drives should also be encrypted separately.",
    "Copying and pasting passwords can store the information in keyboard clipboards, which could become problematic if forgotten.",
    "The use of a password manager to securely store passwords is highly advised.",
    "Browser-embedded password managers are typically not very secure, lack important features, and are not recommended.",
    "Back up your password manager’s recovery options in case you lose access to your primary device.",
    "Review saved passwords in your manager periodically, and remove old/unused accounts.",
  ],
  Authentication: [
    "Enable multi-factor authentication (MFA) wherever possible, ideally using an authenticator app or hardware key rather than SMS.",
    "Consider using hardware-based security keys (e.g., YubiKey) for critical accounts as they are resistant to phishing.",
    "Avoid using the same recovery questions/answers across multiple accounts, and never use guessable answers (e.g., pet’s name, mother’s maiden name).",
    "Disable accounts you no longer use rather than leaving them active with old passwords.",
    "Using two-step authentication whenever possible adds an extra security layer making it exponentially more difficult to be hacked.",
  ],
  Safety: [
    "Browsing the web and using passwords on others' devices could potentially store them in their browser's embedded password manager and expose them to other users of the device.",
    "Logging into critical accounts when connected to public Wi-Fi hotspots, Tor, free VPNs, or web proxies can potentially compromise passwords to hackers.",
    "Unencrypted connections such as HTTP, FTP, Telnet etc are dangerous as they can compromise information. Encrypted connections such as HTTPS, SFTP, FTPS, SMTPS etc are preferable.",
    "Any website lacking an encrypted connection should be treated with suspicion and avoided.",
    "Be cautious with autofill features in browsers and apps, as they can sometimes expose credentials on malicious sites.",
    "Be wary of phishing attacks that try to trick you into entering passwords on fake websites. Always double-check the URL before logging in.",
  ],
  Devices: [
    "It is crucial to avoid using end-of-life operating systems and browsers that no longer receive security updates.",
    "Keep your devices patched and secure, since malware can steal even strong passwords if the system itself is compromised.",
  ],
  Advanced: [
    "Where available, consider using passphrases (a string of random words) as they can be easier to remember but still highly secure.",
    "Using multiple email addresses for different purposes is a solid practice with several benefits.",
  ],
  Principle: [
    "This should go without saying, but passwords are personal and they should never be shared physically, verbally or digitally.",
  ],
};
