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
          Collection is ...
        </p>

        <ol className="help-modal__steps">
          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Title</h3>

            <p className="help-modal__step-text">
              Step 1 placeholder text
            </p>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Title</h3>

            <p className="help-modal__step-text">
              Step 2 placeholder text
            </p>
          </li>

          <li className="help-modal__step">
            <h3 className="help-modal__step-title">Title</h3>

            <p className="help-modal__step-text">
              Step 3 placeholder text
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
