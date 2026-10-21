import { writeFileSync } from "node:fs";

import type { Pokemon } from "@/types/pokemon";

type PokemonResponse = {
  id: number;
  name: string;

  types: {
    type: { name: string };
  }[];

  height: number;
  weight: number;

  stats: {
    base_stat: number;
    stat: { name: string };
  }[];

  abilities: {
    ability: { name: string };
  }[];

  sprites: {
    other: { "official-artwork": { front_default: string } };
  };

  cries: {
    latest: string;
  };
};

async function fetchPokemon(id: number): Promise<Pokemon> {
  const endpoint = "https://pokeapi.co/api/v2/pokemon/";

  const response = await fetch(`${endpoint}${id}`);
  const description = await fetchPokemonDescription(id);

  if (!response.ok) {
    throw new Error(`Pokemon request failed with the status code ${response.status}`);
  }

  const data: PokemonResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    type: data.types[0].type.name,
    height: data.height / 10,
    weight: data.weight / 10,

    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
    },

    abilities: data.abilities.map(({ ability }) => ability.name.replace(/-/g, " ")),

    image: data.sprites.other["official-artwork"].front_default,
    cry: data.cries.latest,
    description: description
  };
}

type PokemonDescriptionResponse = {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
};

async function fetchPokemonDescription(id: number): Promise<string> {
  const endpoint = "https://pokeapi.co/api/v2/pokemon-species/";

  const response = await fetch(`${endpoint}${id}`);

  if (!response.ok) {
    throw new Error(`Pokemon description request failed with the status code ${response.status}`);
  }

  const data: PokemonDescriptionResponse = await response.json();

  const entry = data.flavor_text_entries.findLast(entry => entry.language.name === "en");

  if (entry === undefined) {
    throw new Error(`English description for Pokémon#${id} was not found`);
  }

  return entry.flavor_text.replace(/\s+/g, " ");
}

const totalPokemons = 1025;
const pokemons: Pokemon[] = [];

console.time("duration");

for (let i = 1; i <= totalPokemons; i++) {
  const pokemon = await fetchPokemon(i);

  pokemons.push(pokemon);

  console.log(`${i} / ${totalPokemons}`);
}

console.timeEnd("duration");

const output = JSON.stringify(pokemons, null, 2);

writeFileSync("./src/data/pokemons.json", output, "utf-8");
