import type { Difficulty } from "@/types/game";
import type { Screen } from "@/types/screen";

import "./DifficultyMenu.css";
import icons from "@/assets/icons/icons.svg";

type DifficultyMenuProps = {
  difficulties: Difficulty[];
  newGame: (difficulty: Difficulty) => void;
  setScreen: (screen: Screen) => void;
};

export default function DifficultyMenu({ difficulties, newGame, setScreen }: DifficultyMenuProps) {
  return (
    <div className="difficulty-menu">
      <h2 className="difficulty-menu__title">Select Difficulty</h2>

      <div className="difficulty-menu__actions">
        {difficulties.map(difficulty => (
          <button
            key={difficulty.level}
            className={`difficulty-menu__button difficulty-menu__button--${difficulty.level}`}
            onClick={() => newGame(difficulty)}
          >
            {difficulty.level}
          </button>
        ))}

        <button
          className="difficulty-menu__button difficulty-menu__button--back"
          onClick={() => setScreen("main-menu")}
        >
          <svg className="difficulty-menu__icon">
            <use href={`${icons}#arrow-left`} />
          </svg>
        </button>
      </div>
    </div>
  );
}
