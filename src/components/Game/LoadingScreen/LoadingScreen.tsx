import "./LoadingScreen.css";
import icons from "@/assets/icons/icons.svg";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <svg className="loading-screen__icon">
        <use href={`${icons}#pokeball`} />
      </svg>

      <p className="loading-screen__text">Loading game...</p>
    </div>
  );
}
