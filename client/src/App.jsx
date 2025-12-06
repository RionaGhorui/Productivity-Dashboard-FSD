import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import LofiPlayer from "./components/LofiPlayer";
import FocusTimer from "./components/FocusTimer";
import QuickNotes from "./components/QuickNotes";

const QUOTES = [
  "Small consistent progress beats random bursts of effort.",
  "You don’t need more time, you need more focus.",
  "Your future self is watching what you do today.",
  "Done is better than perfect.",
  "Discipline is remembering what you want.",
];

function App() {
  const [visitCount, setVisitCount] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("visitCount") || "0";
    const next = Number(raw) + 1;
    localStorage.setItem("visitCount", String(next));
    setVisitCount(next);

    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(random);
  }, []);

  return (
    <div className="app-root">
      <header className="app-header card">
        <div className="header-top">
          <h1 className="header-title">Productivity Dashboard</h1>
          <span className="header-subtitle">Simple Task Manager</span>
        </div>
        <p className="visit-text">
          You&apos;ve opened this dashboard {visitCount} times on this device.
        </p>
        {quote && <p className="quote-text">“{quote}”</p>}
      </header>

      <main className="app-grid">
        <section className="grid-main">
          <TaskList />
        </section>

        <section className="grid-side">
          <div className="card">
            <LofiPlayer />
          </div>
          <FocusTimer />
          <QuickNotes />
        </section>
      </main>
    </div>
  );
}

export default App;
