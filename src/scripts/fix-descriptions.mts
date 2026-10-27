import { readFileSync, writeFileSync } from "node:fs";

import type { Entry } from "@/types/entry";

const data = readFileSync("./src/data/fixed-names.json", "utf-8");

const entries: Entry[] = JSON.parse(data);

const fixes: Record<string, string> = {
  // pokemon names
  "2 KOFFINGs": "two Koffing", "DIGLETTs": "Diglett", "MAWHILE": "Mawile", "NIDORAN": "Nidoran", "MAGNEMITEs": "Magnemite",

  // pokemon moves
  "ACID": "Acid", "BODY SLAM": "Body Slam", "body slam": "Body Slam", "COMET PUNCH": "Comet Punch", "CONFUSION": "Confusion",
  "DESTINY BOND": "Destiny Bond", "DOUBLESLAP": "Double Slap", "double slap": "Double Slap", "HYPER BEAM": "Hyper Beam",
  "hyper beam": "Hyper Beam", "HYPNOSIS": "Hypnosis", "MIRROR MOVE": "Mirror Move", "POISONPOWDER": "Poison Powder",
  "SCREECH": "Screech", "SELFDESTRUCT": "Self-Destruct", "THUNDER WAVE": "Thunder Wave",

  // game terms
   "BERRIES": "berries", "POKéMON": "Pokémon", "POKEMON": "Pokémon", "POKé BALLS": "Poké Balls", "POKé BALL": "Poké Ball",
   "POKéGEAR": "Pokégear", "TRAINERS": "Trainers", "TRAINER": "Trainer", "trainers": "Trainers", "trainer": "Trainer",

  // ordinary words
  "BITE": "bite", "BUG": "bug", "CONSTRICT": "constrict", "DIGS": "digs", "DIG": "dig", "MPH": "mph", "SING": "sing",
  "STONES": "stones", "STONEs": "stones", "TACKLES": "tackles", "TACKLE": "tackle", "Tackles": "tackles", "Tackle": "tackle",
  "TELEPORTS": "teleports", "TELEPORT": "teleport", "Teleport": "teleport", "THRASHING": "thrashing",

  // spelling
  "towards": "toward"
};

const fixPatterns = Object.entries(fixes).map(([original, fix]) => ({
  pattern: new RegExp(`\\b${original}\\b`, "g"), fix
}));

const namePatterns = entries.map(({ name }) => ({
  pattern: new RegExp(`\\b${name.toUpperCase()}\\b`, "g"), name
}));

function fixDescriptions(descriptions: string[]): string[] {
  const normalized = descriptions.map(description => normalize(description));
  const corrected = normalized.map(description => correct(description));
  const capitalized = corrected.map(description => capitalize(description));
  const deduplicated = deduplicate(capitalized);

  return deduplicated;
}

function normalize(description: string): string {
  return description
    .replace(/\u00AD\s*/g, "")      // soft hyphen + line break: join the word
    .replace(/-\n/g, "-")           // real hyphen + line break: keep hyphen, drop break
    .replace(/\s+/g, " ")           // remaining newlines and \u000c become spaces
    .replace(/\s+-(?=[a-z])/g, "—") // line-wrapped dash: em dash
    .replace(/\s+-\s+|--/g, "—")    // spaced hyphen or double hyphen: em dash
    .replace(/\s*—\s*/g, "—")       // remove spaces around em dashes
    .replace(/\s[-–](?=\d)/g, " −") // negative numbers: real minus sign
    .replace(/\s”/g, " “")          // correct opening curly quotes
    .replace(/'/g, "’")

    .replace(/\b\d{4,}\b/g, n => Number(n).toLocaleString("en-US"))
    .replace(/(\d)F degrees/g, "$1 degrees Fahrenheit")
    .replace(/(\d)° F\b/g, "$1 degrees Fahrenheit")
    .replace(/degrees F\b/g, "degrees Fahrenheit")

    .trim()
}

function correct(description: string): string {
  for (const { pattern, fix } of fixPatterns) {
    description = description.replace(pattern, fix);
  }

  return description;
}

function capitalize(description: string): string {
  if (!/[A-Z]{2,}/.test(description)) return description;

  for (const { pattern, name } of namePatterns) {
    description = description.replace(pattern, name);
  }

  return description;
}

function deduplicate(descriptions: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const description of descriptions) {
    const key = description.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(description);
  }

  return result;
}

const fixed = entries.map(entry => ({
  ...entry, descriptions: fixDescriptions(entry.descriptions)
}));

const output = JSON.stringify(fixed, null, 2).replace(/},\n/g, "},\n\n") + "\n";

writeFileSync("./src/data/fixed-descriptions.json", output, "utf-8");

console.log("Descriptions fixed");
