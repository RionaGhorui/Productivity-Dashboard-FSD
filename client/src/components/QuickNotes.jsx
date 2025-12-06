import { useEffect, useState } from "react";

function QuickNotes() {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("quickNotes") || "";
    setNotes(stored);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    localStorage.setItem("quickNotes", value);
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2 className="widget-title">Quick Notes</h2>
      <p className="muted">
        Jot down ideas, links, or reminders. Notes stay on this device.
      </p>
      <textarea
        value={notes}
        onChange={handleChange}
        className="input textarea"
        style={{ marginTop: 8, minHeight: 120 }}
        placeholder="Brain dump, scratchpad, random thoughts..."
      />
    </div>
  );
}

export default QuickNotes;
