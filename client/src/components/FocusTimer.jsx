import { useEffect, useState } from "react";

const FOCUS_MINUTES = 20; 

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(() => {
    const raw = localStorage.getItem("focusSessions") || "0";
    return Number(raw);
  });

  useEffect(() => {
    let id;
    if (isRunning && secondsLeft > 0) {
      id = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      const next = completedSessions + 1;
      setCompletedSessions(next);
      localStorage.setItem("focusSessions", String(next));
      // simple alert; you can replace with a nicer UI later
      alert("Focus session complete! Take a short break.");
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isRunning, secondsLeft, completedSessions]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(FOCUS_MINUTES * 60);
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2 className="widget-title">Focus Timer</h2>
      <p className="muted">
        Classic {FOCUS_MINUTES}-minute deep work sprint. Sessions completed on this
        device: <strong>{completedSessions}</strong>
      </p>

      <div
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          marginTop: 12,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {formatTime(secondsLeft)}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button className="btn primary" onClick={handleStartPause} type="button">
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="btn" onClick={handleReset} type="button">
          Reset
        </button>
      </div>
    </div>
  );
}

export default FocusTimer;
