import { useState } from "react";

import type { Screen } from "@/types/screen";

import { storage } from "@/api/local-storage";

import "./MainMenu.css";
import icons from "@/assets/icons/icons.svg";

type MainMenuProps = {
  setScreen: (screen: Screen) => void;
};

export default function MainMenu({ setScreen }: MainMenuProps) {
  const [resetMenuOpen, setResetMenuOpen] = useState(false);

  function confirmReset() {
    storage.reset();
    setResetMenuOpen(false);
  }

  return (
    <div className="main-menu">
      <h1 className="main-menu__title">
        <span className="main-menu__pokemon">Pokémon</span>
        <span className="main-menu__memory-game">Memory Game</span>
      </h1>

      <nav className="main-menu__actions">
        <button className="main-menu__button" onClick={() => setScreen("game")}>
          <svg className="main-menu__icon">
            <use href={`${icons}#cards`} />
          </svg>

          <span className="main-menu__label">New Game</span>
        </button>

        <button className="main-menu__button" onClick={() => setScreen("collection")}>
          <svg className="main-menu__icon">
            <use href={`${icons}#collection`} />
          </svg>

          <span className="main-menu__label">Collection</span>
        </button>

        <button className="main-menu__button" onClick={() => setResetMenuOpen(true)}>
          <svg className="main-menu__icon">
            <use href={`${icons}#reset`} />
          </svg>

          <span className="main-menu__label">Reset</span>
        </button>
      </nav>

      {resetMenuOpen && (
        <>
          <div className="reset-menu__backdrop" />

          <div className="reset-menu">
            <p className="reset-menu__warning">
              Your collection and best score will be lost!
            </p>

            <p className="reset-menu__question">
              Are you sure you want to reset your progress?
            </p>

            <div className="reset-menu__actions">
              <button
                className="reset-menu__button reset-menu__button--confirm"
                onClick={confirmReset}
              >
                Confirm
              </button>

              <button
                className="reset-menu__button"
                onClick={() => setResetMenuOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
