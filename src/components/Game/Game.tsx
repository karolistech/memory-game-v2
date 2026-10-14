import { useEffect, useState } from "react";

import type { Screen } from "@/types/screen";
import type { Pokemon } from "@/types/pokemon";
import type { Cards, Difficulty, Game } from "@/types/game";

import pokemons from "@/data/pokemons.json";

import { storage } from "@/api/local-storage";

import { useCollection } from "@/hooks/useCollection";

import LoadingScreen from "@/components/Game/LoadingScreen/LoadingScreen";
import DifficultyMenu from "@/components/Game/DifficultyMenu/DifficultyMenu";
import HelpModal from "@/components/Game/HelpModal/HelpModal";
import Card from "@/components/Game/Card/Card";

import "./Game.css";
import icons from "@/assets/icons/icons.svg";

const difficulties: Difficulty[] = [
  { level: "easy", cards: 4 },
  { level: "medium", cards: 8 },
  { level: "hard", cards: 12 }
];

type GameProps = {
  setScreen: (screen: Screen) => void;
};

export default function Game({ setScreen }: GameProps) {
  const [game, setGame] = useState<Game>("difficulty-menu");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [cards, setCards] = useState<Cards>("closed");
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => storage.loadBestScore());
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const { unlockPokemon } = useCollection();

  useEffect(() => {
    if (game !== "playing") return;

    if (cards === "closed") {
      const shuffleTimer = setTimeout(() => setPokemons(pokemon => shuffle(pokemon)), 1000);
      const animationTimer = setTimeout(() => setCards("animating"), 1500);

      return () => {
        clearTimeout(shuffleTimer);
        clearTimeout(animationTimer);
      };
    }

    if (cards === "animating") {
      const timer = setTimeout(() => setCards("open"), 800);

      return () => clearTimeout(timer);
    }
  }, [game, cards]);

  function newGame(difficulty: Difficulty) {
    setDifficulty(difficulty);
    setGame("loading");

    const pokemons = getRandomPokemon(difficulty.cards);

    setPokemons(pokemons);
    setTimeout(() => setGame("playing"), 3000);
  }

  function nextGame() {
    if (difficulty === null) return;

    const index = difficulties.indexOf(difficulty);
    const nextDifficulty = difficulties[index + 1] ?? difficulty;

    setDifficulty(nextDifficulty);
    setGame("loading");
    setCards("closed");
    setSelectedCards([]);

    const pokemons = getRandomPokemon(nextDifficulty.cards);

    setPokemons(pokemons);
    setTimeout(() => setGame("playing"), 3000);
  }

  function retry() {
    setCards("closed");
    setSelectedCards([]);
    setScore(0);
    setGame("playing");
  }

  function selectCard(pokemon: Pokemon) {
    if (game !== "playing") return;

    if (selectedCards.includes(pokemon.id)) {
      setGame("lost");
      return;
    }

    const updatedSelectedCards = [...selectedCards, pokemon.id];
    const updatedScore = score + 1;

    setSelectedCards(updatedSelectedCards);
    setScore(updatedScore);

    unlockPokemon(pokemon.id);

    if (updatedScore > bestScore) {
      setBestScore(updatedScore);
      storage.saveBestScore(updatedScore);
    }

    if (updatedSelectedCards.length === pokemons.length) {
      setGame("won");
      return;
    }

    setCards("closed");
  }

  function openHelpModal() {
    setHelpModalOpen(true);
  }

  function closeHelpModal() {
    setHelpModalOpen(false);
  }

  return (
    <>
      {game === "difficulty-menu" && (
        <DifficultyMenu difficulties={difficulties} newGame={newGame} setScreen={setScreen} />
      )}

      {game === "loading" && <LoadingScreen />}

      {(game === "playing" || game === "won" || game === "lost") && (
        <div className="game">
          <header className="game__header">
            <button className="game__button" onClick={() => setScreen("main-menu")}>
              <svg className="game__icon">
                <use href={`${icons}#arrow-left`} />
              </svg>
            </button>

            <h1 className="game__title">Memory Game</h1>

            <button className="game__button" onClick={openHelpModal}>
              <svg className="game__icon">
                <use href={`${icons}#question-mark`} />
              </svg>
            </button>
          </header>

          {helpModalOpen && <HelpModal closeHelpModal={closeHelpModal} />}

          <div className="game__scoreboard">
            <div className="game__scores">
              <span>Score: {score}</span>
              <span>Best Score: {bestScore}</span>
            </div>

            <span className="game__progress">
              {selectedCards.length} / {pokemons.length}
            </span>
          </div>

          <div className={`game__cards game__cards--${pokemons.length}`}>
            {pokemons.map(pokemon => (
              <Card key={pokemon.id} pokemon={pokemon} state={cards} selectCard={selectCard} />
            ))}
          </div>

          {game === "won" && (
            <div className="game__outcome game__outcome--won">
              <h2 className="game__outcome-title">You won!</h2>
              <p className="game__outcome-message">You remembered every Pokémon!</p>

              <button
                className="game__outcome-button game__outcome-button--next-game"
                onClick={nextGame}
              >
                Next Game
              </button>

              <button
                className="game__outcome-button game__outcome-button--main-menu"
                onClick={() => setScreen("main-menu")}
              >
                Main Menu
              </button>
            </div>
          )}

          {game === "lost" && (
            <div className="game__outcome game__outcome--lost">
              <h2 className="game__outcome-title">Game over!</h2>
              <p className="game__outcome-message">You picked the same Pokémon twice!</p>
              <p className="game__outcome-score">Score: {score}</p>

              <button
                className="game__outcome-button game__outcome-button--retry"
                onClick={retry}
              >
                Retry
              </button>

              <button
                className="game__outcome-button game__outcome-button--main-menu"
                onClick={() => setScreen("main-menu")}
              >
                Main Menu
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function getRandomPokemon(count: number): Pokemon[] {
  // const ids: number[] = [7, 100, 624, 875];
  const ids: number[] = [];

  while (ids.length < count) {
    const id = Math.floor(Math.random() * pokemons.length);

    if (!ids.includes(id)) {
      ids.push(id);
    }
  }

  return ids.map(id => pokemons[id]);
}

function shuffle(pokemon: Pokemon[]): Pokemon[] {
  const shuffled = [...pokemon];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
