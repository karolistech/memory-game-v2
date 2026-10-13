import { useState } from "react";

import type { Collection } from "@/types/collection";
import type { Pokemon } from "@/types/pokemon";

import { storage } from "@/api/local-storage";

import pokemons from "@/data/pokemons.json";

export function useCollection() {
  const [collection] = useState<Collection>(() => storage.loadCollection());

  function getPokemon(id: number): Pokemon | undefined {
    return collection.includes(id) ? pokemons[id - 1] : undefined;
  }

  function unlockPokemon(id: number) {
    const collection = storage.loadCollection();

    if (collection.includes(id)) return;

    storage.saveCollection([...collection, id]);
  }

  return { collection, getPokemon, unlockPokemon };
}
