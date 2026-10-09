// School-Safe Content Moderation & Profanity Filtering System for RGGA

export type ContentCheckResult = {
  isValid: boolean;
  prohibitedWordsFound: string[];
  cleanPreview: string;
  reason?: string;
};

// Base list of school-restricted words (profanities, insults, bullying, vulgarities, and age-inappropriate words)
export const DEFAULT_RESTRICTED_WORDS: string[] = [
  // Profanities & Swear Words
  "fuck", "fucking", "fucked", "fucker", "shit", "bitch", "bastard", "asshole", 
  "crap", "piss", "damn", "dick", "cock", "pussy", "cunt", "slut", "whore", 
  "wanker", "prick", "twat", "arse", "bollocks", "motherfucker", "bullshit",

  // Insults, Bullying, and Demeaning Terms
  "stupid", "idiot", "moron", "fool", "dumb", "imbecile", "loser", "ugly", 
  "retard", "shut up", "hate you", "pathetic", "useless", "disgusting", "freak",
  "trash", "worthless", "scumbag", "clown", "lazy",

  // Threatening & Violent Language
  "kill you", "die", "murder", "beat you up", "punch you", "burn in hell", "slit", 
  "suicide", "hang yourself", "terrorist", "bomb the school",

  // Inappropriate & Vulgar Slang
  "porn", "sex", "nude", "naked", "boobs", "tits", "penis", "vagina", "horny", 
  "masturbate", "erotic", "weed", "cocaine", "drugs", "alcohol", "drunk", "high",
  "gay" /* when used pejoratively as an insult */, "fag", "faggot", "nigger", "nigga"
];

const STORAGE_RESTRICTED_WORDS_KEY = "rgga_restricted_words";

// Retrieve current list (including custom words added by administrators)
export function getRestrictedWordList(): string[] {
  if (typeof window === "undefined") return DEFAULT_RESTRICTED_WORDS;
  try {
    const saved = localStorage.getItem(STORAGE_RESTRICTED_WORDS_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_RESTRICTED_WORDS_KEY, JSON.stringify(DEFAULT_RESTRICTED_WORDS));
      return DEFAULT_RESTRICTED_WORDS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RESTRICTED_WORDS;
  } catch (e) {
    console.error("Failed to load restricted words list", e);
    return DEFAULT_RESTRICTED_WORDS;
  }
}

export function addRestrictedWord(word: string): string[] {
  const current = getRestrictedWordList();
  const normalized = word.trim().toLowerCase();
  if (!normalized || current.includes(normalized)) return current;
  const updated = [...current, normalized];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_RESTRICTED_WORDS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function removeRestrictedWord(word: string): string[] {
  const current = getRestrictedWordList();
  const updated = current.filter((w) => w.toLowerCase() !== word.trim().toLowerCase());
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_RESTRICTED_WORDS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function resetRestrictedWords(): string[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_RESTRICTED_WORDS_KEY, JSON.stringify(DEFAULT_RESTRICTED_WORDS));
  }
  return DEFAULT_RESTRICTED_WORDS;
}

// Normalize text to defeat common evasion attempts (leetspeak, obfuscation like f.u.c.k, f*ck, sh!t, etc.)
function normalizeTextForCheck(text: string): string {
  let normalized = text.toLowerCase();

  // Convert common leetspeak substitutions
  normalized = normalized
    .replace(/[@4]/g, "a")
    .replace(/[$5]/g, "s")
    .replace(/[!|1]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[3]/g, "e")
    .replace(/[+]/g, "t")
    .replace(/[*_~`\-./\\,]/g, " "); // Convert punctuation to spaces to catch "f.u.c.k" or "s-t-u-p-i-d"

  // Collapse repeated multiple characters: "fuuuuck" -> "fuck", "shiiit" -> "shit"
  normalized = normalized.replace(/(.)\1{2,}/g, "$1$1");

  return normalized;
}

/**
 * Validates text against the school-safety dictionary.
 * Returns whether the content is safe, along with any flagged words.
 */
export function validateSchoolSafeContent(rawText: string): ContentCheckResult {
  if (!rawText || !rawText.trim()) {
    return {
      isValid: true,
      prohibitedWordsFound: [],
      cleanPreview: "",
    };
  }

  const restrictedList = getRestrictedWordList();
  const normalized = normalizeTextForCheck(rawText);
  const foundWords: string[] = [];

  // Match words and multi-word offensive phrases
  for (const restricted of restrictedList) {
    const escaped = restricted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Boundary check for standalone word or phrase
    const regex = new RegExp(`(?:^|\\s|[^a-zA-Z0-9])${escaped}(?:$|\\s|[^a-zA-Z0-9])`, "i");

    if (regex.test(normalized) || normalized.includes(restricted.toLowerCase())) {
      if (!foundWords.includes(restricted)) {
        foundWords.push(restricted);
      }
    }
  }

  // Create masked preview (e.g. "s***t")
  let cleanPreview = rawText;
  for (const word of foundWords) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const mask = word.length > 2 
      ? word[0] + "*".repeat(word.length - 2) + word[word.length - 1]
      : "*".repeat(word.length);
    cleanPreview = cleanPreview.replace(new RegExp(escaped, "gi"), mask);
  }

  const isValid = foundWords.length === 0;

  return {
    isValid,
    prohibitedWordsFound: foundWords,
    cleanPreview,
    reason: isValid
      ? undefined
      : `Contains restricted or disrespectful language (${foundWords.map((w) => `"${w}"`).join(", ")}). Please keep comments polite, positive, and appropriate for a primary & secondary school community.`,
  };
}
