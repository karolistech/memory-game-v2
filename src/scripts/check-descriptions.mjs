// Run with: node scripts/check-descriptions.mjs [path]     (default: src/data/pokemon.json)
// Checks the names and descriptions against the rules from the review rounds. Exit code 1 if any rule fails.
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "src/data/pokemons.json";
const data = JSON.parse(readFileSync(file, "utf8"));

// Exceptions that were reviewed on purpose
const clauseFinal = new Set([120, 206, 259, 315, 352, 387, 473, 486, 530]); // “it is” / “they are” at the end of a clause, where a contraction would be wrong
const keepSpelledNumber = new Set([138, 262, 393, 748, 949]);                                   // “around ten”, kept by choice
const hyphenNames = new Set(["Ho-Oh", "Porygon-Z", "Jangmo-o", "Hakamo-o", "Kommo-o", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu"]);
const likeWords = new Set(["childlike", "lifelike", "unlike", "alike", "dislike", "dislikes"]);

const protect = t => t.replace(/\b(Mr|Jr)\. /g, "$1\u0001 ");
const sentences = t => protect(t).split(/(?<=[.!?”])\s+/).map(s => s.replace(/\u0001/g, "."));
const find = re => r => r.description.match(re)?.[0] ?? null;
const snippet = (t, re) => { const m = t.match(re); if (!m) return ""; const i = m.index; return "…" + t.slice(Math.max(0, i - 25), i + m[0].length + 25).trim() + "…"; };

const rules = [
  // names
  ["name starts with a capital letter", r => (/^[A-Z]/.test(r.name) ? null : r.name)],
  ["name uses only letters, space and . : ♀ ♂ ’ é", r => (/^[A-Za-zé♀♂’ .:0-9-]+$/.test(r.name) ? null : r.name)],
  ["name has a hyphen only where the hyphen is part of the name", r => (r.name.includes("-") && !hyphenNames.has(r.name) ? r.name : null)],
  ["name has no leftover form suffix (normal, male, incarnate, …)", r => r.name.match(/\b(normal|plant|altered|land|striped|standard|male|female|incarnate|ordinary|aria|shield|average|baile|midday|solo|meteor|disguised|amped|ice|full|belly|single|strike|family|plumage|zero|curly|segment)\b/i)?.[0] ?? null],

  // layout and typography
  ["no leading, trailing or double spaces", find(/^\s|\s$|\s{2,}/)],
  ["no control or invisible characters (soft hyphen, line breaks)", find(/[\u0000-\u001f\u00ad\u200b\ufeff]/)],
  ["starts with a capital letter", r => (/^[A-Z]/.test(r.description) ? null : r.description.slice(0, 20))],
  ["ends with a period (or period and closing quote)", r => (/[.][”"]?$/.test(r.description) ? null : r.description.slice(-20))],
  ["curly apostrophes and quotes only", find(/['"]/)],
  ["no exclamation points or ellipses", find(/!|\.\.|…/)],
  ["spacing around punctuation", find(/\s[.,;:!?]|[a-z][.,;:][A-Za-z]/)],
  ["no repeated word (the the)", find(/\b(\w+)\s+\1\b/i)],
  ["“Pokémon” spelled with the accent and a capital", find(/Pokemon|\bpokémon\b/)],

  // length
  ["length between 58 and 210 characters", r => (r.description.length < 58 || r.description.length > 210 ? `${r.description.length} characters` : null)],
  ["at most three sentences", r => (sentences(r.description).length > 3 ? `${sentences(r.description).length} sentences` : null)],
  ["no sentence of two words or fewer", r => sentences(r.description).find(s => s.split(" ").length <= 2) ?? null],
  ["no “A … Pokémon that …” sentence without a main verb (fragment, heuristic)", r => sentences(r.description).find(s => /^(A|An) (?:(?!(?:this|these|its|their|the|of|that|which)\b)(?:[a-zé]+(?<!ed)|[a-zé]+-[a-zé-]+),? ){0,6}(Pokémon|creature|beast|species|bird|monkey|insect|guard|performer|wielder|specimen|life-form|swimmer|mimic|symbol|fish)(?!’)\b( that| who| with| from| in| of)?[^.]*\.$/i.test(s) && !/\b(is|are|was|were|has|have|had|can|could|will|would|may|might|must|does|do|did)\b|\b(it|he|she|this|there|what|who)’s\b|’(re|ve|ll|d)\b|,\s*(it|this|these|they|its|[A-Z][a-zé]+)\b/.test(s)) ?? null],

  // voice
  ["no “you / your”", find(/\b(you|your|yours|yourself|you’re|you’ll|you’ve|you’d)\b/i)],
  ["no first person (I, me, my, we, us)", find(/\b(I|me|my|mine|myself|we|us)\b/)],
  ["no Trainer or partner wording", find(/\b(trainers?|partners?)\b/i)],
  ["no sentence starting with “However”", find(/(^|[.!?”]\s)However\b/)],

  // contractions
  ["negatives are contracted (doesn’t, won’t, isn’t, can’t, …)", find(/\b(does not|will not|are not|is not|do not|did not|cannot|can not|could not|would not|should not|was not|were not|has not|have not|had not)\b/i)],
  ["“it is / that is / there is / they are” are contracted (clause-final ones excepted)", r => (clauseFinal.has(r.id) ? null : r.description.match(/\b(it|that|there|what|who|he|she) is\b|\b(they|we) are\b/i)?.[0] ?? null)],
  ["no “it’ll / they’ll / it’d” (the data uses “it will”)", find(/\b(it|they|that|who|there)’(ll|d)\b/i)],

  // content
  ["no imperial units", find(/\b\d[\d,.]*\s*(degrees Fahrenheit|mph|feet|miles?|pounds?|yards?|inches|knots|lbs?)\b|\b(Fahrenheit|mph)\b/i)],
  ["no region names", find(/\b(Kanto|Johto|Hoenn|Sinnoh|Unova|Kalos|Alola\w*|Galar\w*|Hisui\w*|Paldea\w*|Area Zero)\b/)],
  ["no game jargon (Ultra Beast, Mega, Dynamax, Tera, Primal, Team …)", find(/\b(Ultra Beasts?|Ultra Wormhole|UB|Mega|Dynamax|Gigantamax|Terastal|Tera|Primal|Showdown|Apricorn|Team (Plasma|Rocket|Aqua|Magma|Galactic))\b/)],
  ["no relative time (recently, nowadays, these days)", find(/\b(recently|recent years|nowadays|these days|currently|lately)\b/i)],

  // spelling and style
  ["US spelling (no British forms)", find(/\b(colour\w*|favourite|armour\w*|neighbour\w*|behaviour|honour\w*|flavour\w*|grey|centre|metre|litre|whilst|amongst|learnt|spelt|dreamt|leapt|smelt|rubbish|moustache|aeons?|flyers?|child-like|far-away|tyres?|mum|aluminium|jewellery|catalogue|defence|offence|licence|programme|storey|plough|cosy)\b/i)],
  ["“-like” compounds are hyphenated", r => [...r.description.matchAll(/\b[a-z]+like\b/gi)].map(m => m[0]).find(w => !likeWords.has(w.toLowerCase())) ?? null],
  ["small numbers (one to nine) are spelled out", r => r.description.replace(/\bMach \d\b/g, "Mach").match(/(?<![\d,.-])\b[1-9]\b(?![\d,.])/)?.[0] ?? null],
  ["numbers from 10 up use digits", r => (keepSpelledNumber.has(r.id) ? null : r.description.match(/\b(ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/i)?.[0] ?? null)],
  ["large numbers use words, not 100,000,000", find(/\d{1,3}(,\d{3}){2,}/)],
  ["Oxford comma in lists of three single words", r => (/\b[A-Za-z’-]+, [A-Za-z’-]+ (and|or) [A-Za-z’-]+/.test(r.description) && !/, [A-Za-z’-]+, (and|or) /.test(r.description) ? r.description.match(/\b[A-Za-z’-]+, [A-Za-z’-]+ (and|or) [A-Za-z’-]+/)[0] : null)]
];

// structure
const problems = [];
if (!Array.isArray(data)) problems.push("the file is not an array");
else {
  data.forEach((r, i) => {
    if (r.id !== i + 1) problems.push(`entry ${i + 1} has id ${r.id}`);
    if (typeof r.name !== "string" || typeof r.description !== "string" || !r.name || !r.description) problems.push(`#${r.id} is missing a name or a description`);
  });
  const names = new Map(); data.forEach(r => names.set(r.name, (names.get(r.name) ?? []).concat(r.id)));
  for (const [n, ids] of names) if (ids.length > 1) problems.push(`name “${n}” is used by #${ids.join(", #")}`);
  const descs = new Map(); data.forEach(r => descs.set(r.description, (descs.get(r.description) ?? []).concat(r.id)));
  for (const ids of descs.values()) if (ids.length > 1) problems.push(`#${ids.join(", #")} have the same description`);
}
console.log(`Checked ${Array.isArray(data) ? data.length : 0} entries in ${file}\n`);
console.log(`${problems.length ? "FAIL" : "PASS"}  structure (ids in order, names and descriptions present, no duplicates)`);
problems.forEach(p => console.log(`      ${p}`));

let failed = problems.length ? 1 : 0;
for (const [label, test] of rules) {
  const hits = data.map(r => [r, test(r)]).filter(([, h]) => h);
  console.log(`${hits.length ? "FAIL" : "PASS"}  ${label}${hits.length ? ` (${hits.length})` : ""}`);
  if (hits.length) { failed++; hits.slice(0, 8).forEach(([r, h]) => console.log(`      #${r.id} ${r.name}: ${String(h).slice(0, 90)}`)); if (hits.length > 8) console.log(`      … and ${hits.length - 8} more`); }
}
console.log(`\n${rules.length + 1} checks, ${failed ? failed + " failed" : "all passed"}`);
process.exit(failed ? 1 : 0);
