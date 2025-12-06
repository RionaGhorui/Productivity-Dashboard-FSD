const TRACKS = [
  {
    id: 1,
    name: "Night Study",
    src: "/lofi1.mp3", 
  },
  {
    id: 2,
    name: "Soft Focus",
    src: "/lofi2.mp3",
  },
];

import { useState } from "react";

function LofiPlayer() {
  const [current, setCurrent] = useState(TRACKS[0]);

  return (
    <div>
      <h2 className="widget-title">Lofi Focus Player</h2>
      <p className="muted">
        Pick a track and let it play quietly while you work.
      </p>

      <ul className="task-list" style={{ marginTop: 10, marginBottom: 10 }}>
        {TRACKS.map((track) => (
          <li
            key={track.id}
            className={`card task-item ${
              current.id === track.id ? "task-completed" : ""
            }`}
            style={{ padding: "8px 12px" }}
          >
            <button
              className="btn"
              style={{ marginRight: 8 }}
              onClick={() => setCurrent(track)}
            >
              Play
            </button>
            <span>{track.name}</span>
          </li>
        ))}
      </ul>

      <audio
        key={current.src}
        controls
        style={{ width: "100%", marginTop: 4 }}
        src={current.src}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default LofiPlayer;
