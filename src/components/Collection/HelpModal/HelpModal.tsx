import "./HelpModal.css";

type HelpModalProps = {
  closeHelpModal: () => void;
};

export default function HelpModal({ closeHelpModal }: HelpModalProps) {
  return (
    <>
      <div className="help-modal__backdrop" />

      <div className="help-modal">
        <h2 className="help-modal__title">Collection Help</h2>

        <p className="help-modal__intro">
          Welcome to your Pokémon Collection! Track your progress, revisit
          Pokémon you have discovered, and work toward completing the Pokédex.
          Can you catch 'em all?
        </p>

        <ol className="help-modal__steps">
          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Discover Pokémon</h3>

            <p className="help-modal__step-text">
              Play the Memory Game to discover new Pokémon. Each Pokémon you
              select for the first time is added to your Collection.
            </p>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Explore Collection</h3>

            <p className="help-modal__step-text">
              Browse the Pokédex to explore Pokémon from all generations. Select
              a Pokémon card to view its details and learn more.
            </p>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Manage Collection</h3>

            <p className="help-modal__step-text">
              Use the filter to view only collected Pokémon, adjust the number of
              cards displayed per page, and track your progress.
            </p>
          </li>
        </ol>

        <button className="help-modal__button" onClick={closeHelpModal}>
          Got It!
        </button>
      </div>
    </>
  );
}
