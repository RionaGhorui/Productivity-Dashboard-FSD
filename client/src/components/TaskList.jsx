import { useEffect, useState, useMemo } from "react";
import api from "../api";

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | active | completed

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const res = await api.post("/tasks", form);
      setTasks((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "", priority: "medium", dueDate: "" });
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await api.patch(`/tasks/${task._id}`, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  // overall stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const pending = total - completed;
    const today = new Date();
    const dueToday = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return isSameDay(d, today);
    }).length;

    const completion =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, completion, dueToday };
  }, [tasks]);

  // filtered list for display
  const visibleTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.isCompleted);
    if (filter === "completed") return tasks.filter((t) => t.isCompleted);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="task-section">
      <h2 className="section-title">Tasks</h2>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="card task-form">
        <div className="task-form-row">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            className="input"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="input textarea"
          />
        </div>

        <div className="task-form-row">
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="input select"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="input"
          />

          <button type="submit" className="btn primary">
            Add
          </button>
        </div>
      </form>

      {/* Stats bar + quick info */}
      <div className="card stats-card">
        <div className="stats-header">
          <span className="stats-title">Task Progress</span>
          <span className="stats-number">{stats.completion}% done</span>
        </div>
        <div className="stats-bar-outer">
          <div
            className="stats-bar-inner"
            style={{ width: `${stats.completion}%` }}
          />
        </div>
        <div className="stats-footer">
          <span>Total: {stats.total}</span>
          <span>Completed: {stats.completed}</span>
          <span>Pending: {stats.pending}</span>
          <span>Due today: {stats.dueToday}</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="filter-row">
        <button
          className={`chip ${filter === "all" ? "chip-active" : ""}`}
          onClick={() => setFilter("all")}
          type="button"
        >
          All
        </button>
        <button
          className={`chip ${filter === "active" ? "chip-active" : ""}`}
          onClick={() => setFilter("active")}
          type="button"
        >
          Active
        </button>
        <button
          className={`chip ${filter === "completed" ? "chip-active" : ""}`}
          onClick={() => setFilter("completed")}
          type="button"
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <p className="muted">Loading tasks...</p>
      ) : visibleTasks.length === 0 ? (
        <p className="muted">No tasks in this view.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li
              key={task._id}
              className={`task-item card ${
                task.isCompleted ? "task-completed" : ""
              }`}
            >
              <div className="task-main">
                <div className="task-title-row">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleComplete(task)}
                  />
                  <span
                    className={`task-title ${
                      task.isCompleted ? "task-title-done" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`pill ${
                      task.priority === "high"
                        ? "pill-high"
                        : task.priority === "medium"
                        ? "pill-medium"
                        : "pill-low"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="task-meta">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="btn danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
