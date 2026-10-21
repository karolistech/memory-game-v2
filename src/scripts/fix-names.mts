import { readFileSync, writeFileSync } from "node:fs";

type Pokemon = {
  id: number;
  name: string;
  descriptions: string[];
};

const data = readFileSync("./src/data/original-descriptions.json", "utf-8");

const pokemons: Pokemon[] = JSON.parse(data);

const fixes: Record<string, string> = {
  // form suffix removed
  "deoxys-normal": "Deoxys", "wormadam-plant": "Wormadam", "giratina-altered": "Giratina", "shaymin-land": "Shaymin",
  "basculin-red-striped": "Basculin", "darmanitan-standard": "Darmanitan", "frillish-male": "Frillish",
  "jellicent-male": "Jellicent", "tornadus-incarnate": "Tornadus", "thundurus-incarnate": "Thundurus",
  "landorus-incarnate": "Landorus", "keldeo-ordinary": "Keldeo", "meloetta-aria": "Meloetta", "pyroar-male": "Pyroar",
  "meowstic-male": "Meowstic", "aegislash-shield": "Aegislash", "pumpkaboo-average": "Pumpkaboo",
  "gourgeist-average": "Gourgeist", "zygarde-50": "Zygarde", "oricorio-baile": "Oricorio", "lycanroc-midday": "Lycanroc",
  "wishiwashi-solo": "Wishiwashi", "minior-red-meteor": "Minior", "mimikyu-disguised": "Mimikyu",
  "toxtricity-amped": "Toxtricity", "eiscue-ice": "Eiscue", "indeedee-male": "Indeedee", "morpeko-full-belly": "Morpeko",
  "urshifu-single-strike": "Urshifu", "basculegion-male": "Basculegion", "enamorus-incarnate": "Enamorus",
  "oinkologne-male": "Oinkologne", "maushold-family-of-four": "Maushold", "squawkabilly-green-plumage": "Squawkabilly",
  "palafin-zero": "Palafin", "tatsugiri-curly": "Tatsugiri", "dudunsparce-two-segment": "Dudunsparce",

  // hyphen becomes a space
  "tapu-koko": "Tapu Koko", "tapu-lele": "Tapu Lele", "tapu-bulu": "Tapu Bulu", "tapu-fini": "Tapu Fini",
  "great-tusk": "Great Tusk", "scream-tail": "Scream Tail", "brute-bonnet": "Brute Bonnet", "flutter-mane": "Flutter Mane",
  "slither-wing": "Slither Wing", "sandy-shocks": "Sandy Shocks", "iron-treads": "Iron Treads", "iron-bundle": "Iron Bundle",
  "iron-hands": "Iron Hands", "iron-jugulis": "Iron Jugulis", "iron-moth": "Iron Moth", "iron-thorns": "Iron Thorns",
  "roaring-moon": "Roaring Moon", "iron-valiant": "Iron Valiant", "walking-wake": "Walking Wake", "iron-leaves": "Iron Leaves",
  "gouging-fire": "Gouging Fire", "raging-bolt": "Raging Bolt", "iron-boulder": "Iron Boulder", "iron-crown": "Iron Crown",

  // hyphen is part of the name
  "ho-oh": "Ho-Oh", "porygon-z": "Porygon-Z", "jangmo-o": "Jangmo-o", "hakamo-o": "Hakamo-o", "kommo-o": "Kommo-o",
  "wo-chien": "Wo-Chien", "chien-pao": "Chien-Pao", "ting-lu": "Ting-Lu", "chi-yu": "Chi-Yu",

  // punctuation and special characters
  "nidoran-f": "Nidoran♀", "nidoran-m": "Nidoran♂", "farfetchd": "Farfetch’d", "mr-mime": "Mr. Mime", "mime-jr": "Mime Jr.",
  "flabebe": "Flabébé", "type-null": "Type: Null", "sirfetchd": "Sirfetch’d", "mr-rime": "Mr. Rime"
};

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const fixed = pokemons.map(pokemon => ({
  ...pokemon, name: fixes[pokemon.name] ?? capitalize(pokemon.name)
}));

const output = JSON.stringify(fixed, null, 2);

writeFileSync("./src/data/fixed-names.json", output, "utf-8");

console.log("Names fixed");
