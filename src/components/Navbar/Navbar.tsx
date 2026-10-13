import type { View } from "@/types/view";

import "./Navbar.css";
import icons from "@/assets/icons/icons.svg";

type NavbarProps = {
  view: View;
  setView: (view: View) => void;
};

const views: View[] = ["editor", "design", "resume"];

export default function Navbar({ view: currentView, setView }: NavbarProps) {
  return (
    <>
      {views.map(view => (
        <button
          key={view}
          className={getNavbarButtonClass(view, currentView)}
          onClick={() => setView(view)}
        >
          <svg className="navbar__icon">
            <use href={`${icons}#${view}`} />
          </svg>

          <span className="navbar__label">
            {view}
          </span>
        </button>
      ))}
    </>
  );
}

function getNavbarButtonClass(view: View, currentView: View): string {
  const base = "navbar__button";
  const resume = view === "resume" && "navbar__button--resume";
  const selected = view === currentView && "navbar__button--selected";

  return [base, resume, selected].filter(Boolean).join(" ");
}
