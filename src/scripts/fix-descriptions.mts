import { readFileSync, writeFileSync } from "node:fs";

type Pokemon = {
  id: number;
  name: string;
  descriptions: string[];
};

const data = readFileSync("./src/data/fixed-descriptions.json", "utf-8");

const pokemons: Pokemon[] = JSON.parse(data);

const fixes: Record<string, string> = {
  // pokemon names
  MAWHILE: "Mawile", NIDORAN: "Nidoran",

  // pokemon moves
  // HYPNOSIS: "Hypnosis",

  // game terms
  // TRAINERS: "Trainers", TRAINER: "Trainer",

  // ordinary words
  BERRIES: "berries"
};

function fixDescriptions(descriptions: string[]): string[] {
  const normalized = descriptions.map(description => normalize(description));
  const corrected = normalized.map(description => correct(description));
  const capitalized = corrected.map(description => capitalize(description));

  return [...new Set(capitalized)];
}

function normalize(description: string): string {
  return description
    .replace(/\u00AD\s*/g, "")      // soft hyphen + line break: join the word
    .replace(/-\n/g, "-")           // real hyphen + line break: keep hyphen, drop break
    .replace(/\s+/g, " ")           // remaining newlines and \u000c become spaces

    // .replace(/\s+-(?=[a-z])/g, "—") // line-wrapped dash: em dash
    // .replace(/\s+-\s+|--/g, "—")    // spaced hyphen or double hyphen: em dash
    // .replace(/\s*—\s*/g, "—")       // remove spaces around em dashes

    // .replace(/\s[-–](?=\d)/g, " −") // negative numbers: real minus sign
    // .replace(/\b\d{4,}\b/g, n => Number(n).toLocaleString("en-US"))

    .replace(/'/g, "’")
    // .replace(/\s”/g, " “")          // correct opening curly quotes

    .replace(/POKéMON/g, "Pokémon")
    // .replace(/POKEMON/g, "Pokémon")
    // .replace(/POKé BALLS/g, "Poké Balls")
    // .replace(/POKé BALL/g, "Poké Ball")
    // .replace(/POKéGEAR/g, "Pokégear")

    .trim()
}

function correct(text: string): string {
  for (const [original, fix] of Object.entries(fixes)) {
    const pattern = new RegExp(`\\b${original}\\b`, "g");

    text = text.replace(pattern, fix);
  }

  return text;
}

const names = pokemons.map(pokemon => pokemon.name);

function capitalize(description: string): string {
  for (const name of names) {
    const shouted = name.toUpperCase();
    const pattern = new RegExp(`\\b${shouted}\\b`, "g");

    description = description.replace(pattern, name);
  }

  return description;
}

const fixed = pokemons.map(pokemon => ({
  ...pokemon, descriptions: fixDescriptions(pokemon.descriptions)
}));

const output = JSON.stringify(fixed, null, 2);

writeFileSync("./src/data/fixed-descriptions.json", output, "utf-8");

console.log("Descriptions fixed");
