import type { Pokemon } from "@/types/pokemon";

import "./Card.css";
import icons from "@/assets/icons/icons.svg";
import cardBack from "@/assets/images/card-back.webp";

type CardProps = {
  pokemon: Pokemon | undefined;
  setSelectedPokemon: (pokemon: Pokemon) => void;
};

export default function Card({ pokemon, setSelectedPokemon }: CardProps) {
  if (pokemon === undefined) {
    return (
      <div className="card">
        <div className="card__face card__face--back">
          <img src={cardBack} alt="Pokémon card back" className="card__back-image" />
        </div>
      </div>
    );
  }

  return (
    <button className="card" onClick={() => setSelectedPokemon(pokemon)}>
      <div className="card__face card__face--front">
        <div className="card__content" data-type={pokemon.type}>
          <div className="card__header">
            <span className="card__name">{pokemon.name}</span>

            <svg className="card__type-icon">
              <use href={`${icons}#${pokemon.type}`} />
            </svg>
          </div>

          <div className="card__body">
            <img src={pokemon.image} alt={pokemon.name} className="card__front-image" />
          </div>
        </div>
      </div>
    </button>
  );
}
