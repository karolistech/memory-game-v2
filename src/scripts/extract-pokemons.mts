import { readFileSync, writeFileSync } from "node:fs";

import type { Pokemon } from "@/types/pokemon";

const data = readFileSync("./src/data/pokemons.json", "utf-8");

const pokemons: Pokemon[] = JSON.parse(data);

const extracted = pokemons.map(pokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  description: pokemon.description
}));

const output = JSON.stringify(extracted, null, 2).replace(/},\n/g, "},\n\n") + "\n";

writeFileSync("./src/data/pokemons-extracted.json", output, "utf-8");

console.log(`Extracted ${extracted.length} Pokémons`);
