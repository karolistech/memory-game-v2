import { type ChangeEvent, useState } from "react";

import type { Screen } from "@/types/screen";
import type { Filter } from "@/types/collection";
import type { Pokemon } from "@/types/pokemon";

import { useCollection } from "@/hooks/useCollection";

import pokemons from "@/data/pokemons.json";

import HelpModal from "@/components/Collection/HelpModal/HelpModal";
import Card from "@/components/Collection/Card/Card";
import CardModal from "@/components/Collection/CardModal/CardModal";
import Pagination from "@/components/Collection/Pagination/Pagination";

import "./Collection.css";
import icons from "@/assets/icons/icons.svg";

type CollectionProps = {
  setScreen: (screen: Screen) => void;
};

const totalPokemon = 1025;

const ids = Array.from({ length: totalPokemon }, (_, i) => i + 1);
// const ids2 = pokemons.map(pokemon => pokemon.id);

export default function Collection({ setScreen }: CollectionProps) {
  const { collection, getPokemon } = useCollection();

  const [filter, setFilter] = useState<Filter>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // const filteredIds = filter === "collected" ? ids.filter(id => collection[id] !== undefined) : ids;
  const filteredIds = filter === "collected" ? ids.filter(id => collection.includes(id)) : ids;

  const collectedCount = collection.length;

  const totalPages = Math.ceil(filteredIds.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const paginatedIds = filteredIds.slice(startIndex, endIndex);

  function changeFilter(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    if (value === "all" || value === "collected") {
      setFilter(value);
      setCurrentPage(1);
    }
  }

  function changePageSize(e: ChangeEvent<HTMLSelectElement>) {
    const pageSize = Number(e.target.value);

    setPageSize(pageSize);
    setCurrentPage(1);
  }

  function openHelpModal() {
    setHelpModalOpen(true);
  }

  function closeHelpModal() {
    setHelpModalOpen(false);
  }

  function closeCardModal() {
    setSelectedPokemon(null);
  }

  return (
    <div className="collection">
      <header className="collection__header">
        <button className="collection__button" onClick={() => setScreen("main-menu")}>
          <svg className="collection__icon">
            <use href={`${icons}#arrow-left`} />
          </svg>
        </button>

        <h1 className="collection__title">Collection</h1>

        <button className="collection__button" onClick={openHelpModal}>
          <svg className="collection__icon">
            <use href={`${icons}#question-mark`} />
          </svg>
        </button>
      </header>

      {helpModalOpen && <HelpModal closeHelpModal={closeHelpModal} />}

      <div className="collection__controls">
        <div className="collection__filter">
          <select className="collection__select" value={filter} onChange={changeFilter}>
            <option value="all">All</option>
            <option value="collected">Collected</option>
          </select>

          <svg className="collection__select-icon">
            <use href={`${icons}#chevron`} />
          </svg>
        </div>

        <div className="collection__counter">
          <span className="collection__counter-label">Pokémon Collected</span>

          <span className="collection__counter-value">
            {collectedCount} / {totalPokemon}
          </span>
        </div>

        <div className="collection__page-size">
          <select className="collection__select" value={pageSize} onChange={changePageSize}>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={100}>100</option>
          </select>

          <svg className="collection__select-icon">
            <use href={`${icons}#chevron`} />
          </svg>
        </div>
      </div>

      {paginatedIds.length === 0 ? (
        <p className="collection__empty">No Pokémon collected yet.</p>
      ) : (
        <div className="collection__cards">
          {paginatedIds.map(id => (
            <Card key={id} pokemon={getPokemon(id)} setSelectedPokemon={setSelectedPokemon} />
          ))}
        </div>
      )}

      {selectedPokemon && (
        <CardModal pokemon={selectedPokemon} closeCardModal={closeCardModal} />
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
