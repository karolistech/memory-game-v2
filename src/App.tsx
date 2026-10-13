import { useView } from "@/hooks/useView";

import Navbar from "@/components/Navbar/Navbar";

import "./App.css";

export default function App() {
  const { view, setView } = useView();

  return (
    <div className={`app app--${view}`}>
      <div className="app__navbar">
        <Navbar view={view} setView={setView} />
      </div>

      <div className="app__panel app__panel--editor">
        Editor
      </div>

      <div className="app__panel app__panel--design">
        Design
      </div>

      <div className="app__panel app__panel--resume">
        Resume
      </div>
    </div>
  );
}
