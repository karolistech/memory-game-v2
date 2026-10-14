import { readFile, writeFile } from 'fs/promises';

async function extractPokemonData() {
  try {
    // 1. Read the original file
    const rawData = await readFile('./src/data/pokemons.json', 'utf8');
    const pokemon = JSON.parse(rawData);

    // 2. Extract only the fields you want
    const extracted = pokemon.map(({ id, name, description }) => ({
      id,
      name,
      description
    }));

    // 3. Write the new array to a file
    await writeFile(
      './src/data/pokemon-extracted.json',
      JSON.stringify(extracted, null, 2), // pretty-printed
      'utf8'
    );

    console.log(`Successfully extracted ${extracted.length} Pokémon → pokemon-extracted.json`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

extractPokemonData();