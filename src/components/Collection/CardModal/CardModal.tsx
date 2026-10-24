import { type MouseEvent, useRef } from "react";

import type { Pokemon } from "@/types/pokemon";

import "./CardModal.css";
import icons from "@/assets/icons/icons.svg";

type CardModalProps = {
  pokemon: Pokemon;
  closeCardModal: () => void;
};

export default function CardModal({ pokemon, closeCardModal }: CardModalProps) {

  return (
    <>
      <div className="card-modal__backdrop" />

      <div className="card-modal">
        <div className="card-modal__content">
          <Card pokemon={pokemon} />

          <button className="card-modal__close-button" onClick={closeCardModal}>
            <svg className="card-modal__close-icon">
              <use href={`${icons}#arrow-left`} />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

type CardProps = {
  pokemon: Pokemon;
};

function Card({ pokemon }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const facts = [
    ["Type", pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)],
    ["Height", `${pokemon.height.toFixed(2)} m`],
    ["Weight", `${pokemon.weight} kg`]
  ];

  const stats = [
    ["HP", pokemon.stats.hp],
    ["Attack", pokemon.stats.attack],
    ["Defense", pokemon.stats.defense],
    ["Speed", pokemon.stats.speed]
  ];

  const tiltRange = 40;

  function handleCardTilt(e: MouseEvent) {
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

  function playCry(url: string) {
    new Audio(url).play();
  }

  return (
    <>
      <div className="card" onMouseMove={handleCardTilt} onMouseLeave={resetCardTilt}>
        <div className="card__face" ref={cardRef}>
          <div className="card__content" data-type={pokemon.type}>
            <div className="card__header">
              <span className="card__name">{pokemon.name}</span>

              <svg className="card__type-icon">
                <use href={`${icons}#${pokemon.type}`} />
              </svg>
            </div>

            <div className="card__body">
              <img src={pokemon.image} alt={pokemon.name} className="card__image" />
            </div>
          </div>
        </div>
      </div>

      <div className="card-details" data-type={pokemon.type}>
        <header className="card-details__header">
          <div className="card-details__identity">
            <h2 className="card-details__name">{pokemon.name}</h2>

            <span className="card-details__number">
              Pokédex entry #{String(pokemon.id).padStart(3, "0")}
            </span>
          </div>

          <button className="card-details__cry-button" onClick={() => playCry(pokemon.cry)}>
            <svg className="card-details__cry-icon">
              <use href={`${icons}#speaker`} />
            </svg>
          </button>
        </header>

        <div className="card-details__section">
          <h3 className="card-details__section-title">About</h3>

          <p className="card-details__description">
            {pokemon.description}
          </p>
        </div>

        <div className="card-details__section">
          <h3 className="card-details__section-title">Facts</h3>

          <ul className="card-details__facts">
            {facts.map(([label, value]) => (
              <li key={label} className="card-details__fact">
                <span className="card-details__fact-label">
                  {label}
                </span>

                <span className="card-details__fact-value">
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-details__section">
          <h3 className="card-details__section-title">Base stats</h3>

          <ul className="card-details__stats">
            {stats.map(([label, value]) => (
              <li key={label} className="card-details__stat">
                <span className="card-details__stat-label">
                  {label}
                </span>

                <progress className="card-details__stat-bar" value={value} max={150} />

                <span className="card-details__stat-value">
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-details__section">
          <h3 className="card-details__section-title">Abilities</h3>

          <ul className="card-details__abilities">
            {pokemon.abilities.map(ability => (
              <li key={ability} className="card-details__ability">
                {ability}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
