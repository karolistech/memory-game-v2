import { type PointerEvent, useRef } from "react";

import type { Pokemon } from "@/types/pokemon";

import "./CardModal.css";
import icons from "@/assets/icons/icons.svg";

type CardModalProps = {
  pokemon: Pokemon;
  closeCardModal: () => void;
};

const tiltRange = 40;

export default function CardModal({ pokemon, closeCardModal }: CardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleCardTilt(e: PointerEvent) {
    const card = cardRef.current;

    if (card === null) return;

    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * tiltRange;
    const rotateY = (x - 0.5) * tiltRange;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function resetCardTilt() {
    const card = cardRef.current;

    if (card === null) return;

    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  }

  const stats = [
    ["HP", pokemon.stats.hp],
    ["Attack", pokemon.stats.attack],
    ["Defense", pokemon.stats.defense],
    ["Speed", pokemon.stats.speed]
  ];

  const facts = [
    ["Type", pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)],
    ["Height", `${pokemon.height.toFixed(2)} m`],
    ["Weight", `${pokemon.weight} kg`]
  ];

  function playCry(url: string) {
    new Audio(url).play();
  }

  return (
    <>
      <div className="card-modal__backdrop" />

      <div className="card-modal">
        <div className="card-modal__content">
          <div className="card-modal__card" onPointerMove={handleCardTilt} onPointerLeave={resetCardTilt}>
            <div className="card-modal__card-face" ref={cardRef}>
              <div className="card-modal__card-content" data-type={pokemon.type}>
                <div className="card-modal__card-header">
                  <span className="card-modal__card-name">{pokemon.name}</span>

                  <svg className="card-modal__card-type-icon">
                    <use href={`${icons}#${pokemon.type}`} />
                  </svg>
                </div>

                <div className="card-modal__card-body">
                  <img src={pokemon.image} alt={pokemon.name} className="card-modal__card-image" />
                </div>
              </div>
            </div>
          </div>

          <div className="card-modal__details" data-type={pokemon.type}>
            <header className="card-modal__details-header">
              <div className="card-modal__identity">
                <h2 className="card-modal__name">{pokemon.name}</h2>

                <span className="card-modal__number">
                  Pokédex entry #{String(pokemon.id).padStart(3, "0")}
                </span>
              </div>

              <button className="card-modal__button card-modal__button--audio" onClick={() => playCry(pokemon.cry)}>
                <svg className="card-modal__icon">
                  <use href={`${icons}#speaker`} />
                </svg>
              </button>
            </header>

            <div className="card-modal__section">
              <h3 className="card-modal__section-title">About</h3>

              <p className="card-modal__description">
                {pokemon.description}
              </p>
            </div>

            <div className="card-modal__section">
              <h3 className="card-modal__section-title">Facts</h3>

              <ul className="card-modal__facts">
                {facts.map(([label, value]) => (
                  <li key={label} className="card-modal__fact">
                    <span className="card-modal__fact-label">
                      {label}
                    </span>

                    <span className="card-modal__fact-value">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-modal__section">
              <h3 className="card-modal__section-title">Base stats</h3>

              <ul className="card-modal__stats">
                {stats.map(([label, value]) => (
                  <li key={label} className="card-modal__stat">
                    <span className="card-modal__stat-label">
                      {label}
                    </span>

                    <progress className="card-modal__stat-bar" value={value} max={150} />

                    <span className="card-modal__stat-value">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-modal__section">
              <h3 className="card-modal__section-title">Abilities</h3>

              <ul className="card-modal__abilities">
                {pokemon.abilities.map(ability => (
                  <li key={ability} className="card-modal__ability">
                    {ability}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="card-modal__button card-modal__button--back" onClick={closeCardModal}>
            <svg className="card-modal__icon">
              <use href={`${icons}#arrow-left`} />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
