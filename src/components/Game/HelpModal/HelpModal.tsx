import "./HelpModal.css";

type HelpModalProps = {
  closeHelpModal: () => void;
};

export default function HelpModal({ closeHelpModal }: HelpModalProps) {
  return (
    <>
      <div className="help-modal__backdrop" />

      <div className="help-modal">
        <h2 className="help-modal__title">Game Help</h2>

        <p className="help-modal__intro">
          Welcome to the Pokémon Memory Game! Your goal is to select every Pokémon
          card without picking the same one twice. Test your memory and try to
          beat all three difficulty levels!
        </p>

        <ol className="help-modal__steps">
          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Pick a Card</h3>

            <p className="help-modal__step-text">
              Click a card to select a Pokémon. After each selection, all cards
              flip face-down and shuffle.
            </p>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Remember Picks</h3>

            <p className="help-modal__step-text">
              Keep track of your Pokémon. If you pick the same one twice, the game
              will end!
            </p>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Complete the Level</h3>

            <p className="help-modal__step-text">
              Select every Pokémon once to complete the level. You earn one point
              for each unique pick.
            </p>
          </li>

          <li className="help-modal__step help-modal__step--wide">
            <h3 className="help-modal__step-title">Level Up</h3>

            <p className="help-modal__step-text">
              Complete a level to advance to the next difficulty. Each level adds
              more cards and a bigger challenge:
            </p>

            <div className="help-modal__levels">
              <span>Easy: 4 cards</span>
              <span>Medium: 8 cards</span>
              <span>Hard: 12 cards</span>
            </div>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Build Collection</h3>

            <p className="help-modal__step-text">
              Every unique Pokémon you select is added to your Collection. Keep
              playing to discover new Pokémon and improve your best score!
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
