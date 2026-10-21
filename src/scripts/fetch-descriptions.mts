import { writeFileSync } from "node:fs";

type DescriptionResponse = {
  id: number;
  name: string;

  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
};

const endpoint = "https://pokeapi.co/api/v2/pokemon-species/";

async function fetchDescriptions(id: number) {
  const response = await fetch(`${endpoint}${id}`);

  if (!response.ok) {
    throw new Error(`Pokemon description request failed with the status code ${response.status}`);
  }

  const data: DescriptionResponse = await response.json();

  return {
    id: data.id,
    name: data.name,
    descriptions: data.flavor_text_entries
      .filter(entry => entry.language.name === "en")
      .map(entry => entry.flavor_text)
  };
}

const totalPokemons = 1025;
const descriptions = [];

console.time("duration");

for (let i = 1; i <= totalPokemons; i++) {
  const description = await fetchDescriptions(i);

  descriptions.push(description);

  console.log(`${i} / ${totalPokemons}`);
}

console.timeEnd("duration");

const output = JSON.stringify(descriptions, null, 2);

writeFileSync("./src/data/original-descriptions.json", output, "utf-8");
