import { readFileSync, writeFileSync } from "node:fs";

type Pokemon = {
  id: number;
  name: string;
  descriptions: string[];
};

const data = readFileSync("./src/data/original-descriptions.json", "utf-8");

const pokemons: Pokemon[] = JSON.parse(data);

function fixDescriptions(descriptions: string[]): string[] {
  const normalized = descriptions.map(description => normalize(description));

  return [...new Set(normalized)];
}

function normalize(description: string): string {
  return description
    .replace(/\u00AD\s*/g, "") // soft hyphen + line break: join the word
    .replace(/-\n/g, "-")      // real hyphen + line break: keep hyphen, drop break
    .replace(/\s+/g, " ")      // remaining newlines and \u000c become spaces
    .replace(/'/g, "’")
    .replace(/POKéMON/g, "Pokémon")
    .trim()
}

const fixed = pokemons.map(pokemon => ({
  ...pokemon, descriptions: fixDescriptions(pokemon.descriptions)
}));

const output = JSON.stringify(fixed, null, 2);

writeFileSync("./src/data/fixed-descriptions.json", output, "utf-8");

console.log("Descriptions fixed");
