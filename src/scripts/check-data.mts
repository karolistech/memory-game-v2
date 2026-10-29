import { readFileSync } from "node:fs";
import { inspect } from "node:util";

import type { Pokemon } from "@/types/pokemon";

const file = "./src/data/pokemons.json";
const data = readFileSync(file, "utf-8");

const pokemons: Pokemon[] = JSON.parse(data);

const keys = ["id", "name", "type", "height", "weight", "stats", "abilities", "image", "cry", "description"];
const names = new Set(["Nidoran♀", "Nidoran♂", "Farfetch’d", "Mr. Mime", "Porygon2", "Ho-Oh", "Mime Jr.", "Porygon-Z", "Flabébé", "Type: Null", "Jangmo-o", "Hakamo-o", "Kommo-o", "Sirfetch’d", "Mr. Rime", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu"]);
const types = new Set(["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying", "ghost", "grass", "ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water"]);
const uncontracted = new Set([120, 259, 315, 352, 473, 530]);

const find = (text: string, pattern: RegExp) => text.match(pattern)?.[0] ?? null;

const rules: [string, (p: Pokemon) => string | null][] = [
  ["[object] matches the expected keys", p => Object.keys(p).join() === keys.join() ? null : Object.keys(p).join(", ")],

  ["[id] matches the entry position", p => p.id === pokemons.indexOf(p) + 1 ? null : String(p.id)],

  ["[name] starts with a capital letter", p => /^[A-Z]/.test(p.name) ? null : p.name[0]],
  ["[name] uses only letters and space", p => names.has(p.name) ? null : find(p.name, /[^A-Za-z ]/)],
  ["[name] no leading, trailing, or double spaces", p => /^\s|\s$|\s{2,}/.test(p.name) ? p.name : null],

  ["[type] is a valid type", p => types.has(p.type) ? null : p.type],

  ["[height/weight] are positive numbers", p => [p.height, p.weight].every(v => Number.isFinite(v) && v > 0) ? null : `${p.height} / ${p.weight}`],

  ["[stats] values between 1 and 255", p => Object.values(p.stats).every(v => Number.isInteger(v) && v >= 1 && v <= 255) ? null : inspect(p.stats)],

  ["[abilities] between 1 and 3 entries", p => p.abilities.length >= 1 && p.abilities.length <= 3 ? null : String(p.abilities.length)],
  ["[abilities] no duplicate entries", p => new Set(p.abilities).size === p.abilities.length ? null : inspect(p.abilities)],

  ["[image] url starts with the correct host", p => p.image.startsWith("https://raw.githubusercontent.com/PokeAPI/sprites/") ? null : p.image],
  ["[image] url matches the id", p => p.image.endsWith(`/${p.id}.png`) ? null : p.image.slice(-20)],

  ["[cry] url starts with the correct host", p => p.cry.startsWith("https://raw.githubusercontent.com/PokeAPI/cries/") ? null : p.cry],
  ["[cry] url matches the id", p => p.cry.endsWith(`/${p.id}.ogg`) ? null : p.cry.slice(-20)],

  // formatting
  ["[description] sentence starts with a capital letter", p => find(p.description, /^[^A-Z]\w*|\. [^A-Z]\w*/)],
  ["[description] no control or invisible characters", p => find(p.description, /[\u0000-\u001f\u00a0\u00ad\u200b]/)],
  ["[description] no leading, trailing, or double spaces", p => find(p.description, /^\s|\s$|\s{2,}/)],
  ["[description] no disallowed punctuation", p => find(p.description, /[!?()'"“”]|\.{2,}/)],
  ["[description] correct punctuation spacing", p => find(p.description, /\s[,.;:]|[,.;:][A-Za-z]/)],
  ["[description] ends with a period", p => find(p.description, /[^.]$/)],

  // length
  ["[description] between 50 and 200 characters", p => p.description.length >= 50 && p.description.length <= 200 ? null : String(p.description.length)],

  // voice
  ["[description] no first-person pronouns", p => find(p.description, /\b(I|me|my|myself|we|us|our|ours|ourselves)\b/i)],
  ["[description] no second-person pronouns", p => find(p.description, /\b(you|your|yours|yourself|yourselves)\b/i)],
  ["[description] no third-person pronouns", p => find(p.description, /\b(he|him|his|himself|she|her|hers|herself)\b/i)],

  // contractions
  ["[description] no uncontracted negative forms", p => find(p.description, /\b(do|does|did|is|are|was|were|have|has|had|will|could|would|should)\s+not\b|\bcan\s*not\b/i)],
  ["[description] no uncontracted positive forms", p => uncontracted.has(p.id) ? null : find(p.description, /\b(it|that|there)\s+is\b|\bthey\s+are\b/i)],
  ["[description] no auxiliary-verb contractions", p => find(p.description, /\w+’(ll|d|ve)\b/)],

  // content
  ["[description] no trainer or partner references", p => find(p.description, /\b(trainer|partner)s?\b/i)],
  ["[description] no academic or scientific references", p => find(p.description, /\b(book|journal|magazine|article|research(er)?|scientist|scholar|experiment)s?\b/i)],
  ["[description] no region references", p => find(p.description, /(Johto|Sinnoh|Unova|Kalos|Alola|Galar|Paldea|Hisui)\w*/)],
  ["[description] no game-specific references", p => find(p.description, /Primal Reversion|Team Plasma|(Ultra Wormhole|Ultra Beast|UB|Tera Jewel)s?/)],

  // spelling and style
  ["[description] no measurement units", p => find(p.description, /\b(mach|fahrenheit|mph|ft|(mile|yard|pound|ounce|gallon|knot)s?)\b/)],
  ["[description] no numbers from 1 to 10", p => find(p.description, /(?<!\d[.,])\b([1-9]|10)\b(?![.,]\d)/)],
  ["[description] no spelled-out numbers from 11 to 90", p => find(p.description, /\b(eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/i)],
  ["[description] no large numbers", p => find(p.description, /\d{1,3}(,\d{3}){2,}|\d{4,}/)],
  ["[description] no relative time", p => find(p.description, /today|these days|recent(ly)?|latest/i)],
  ["[description] no unnecessary adverbs", p => find(p.description, /apparently|however/i)],
  ["[description] no unhyphenated -like compounds", p => find(p.description, /\b(?!(?:alike|unlike)\b)\w+like\b/i)],
  ["[description] no consecutive repeated words", p => find(p.description, /\b(\w+)\s+\1\b/i)],
];

function validate() {
  console.log(`Checked ${pokemons.length} entries in ${file}\n`);

  let failures = 0;

  for (const [rule, check] of rules) {
    const issues: string[] = [];

    for (const p of pokemons) {
      const issue = check(p);

      if (issue !== null) issues.push(`      #${p.id} ${p.name}: ${issue}`);
    }

    if (issues.length === 0) {
      console.log(`PASS  ${rule}`);
    } else {
      failures++;

      console.log(`FAIL  ${rule} (${issues.length})`);
      console.log(issues.join("\n"));
    }
  }

  console.log(`\n${rules.length} checks, ${failures === 0 ? "all passed" : `${failures} failed`}`);
}

validate();
