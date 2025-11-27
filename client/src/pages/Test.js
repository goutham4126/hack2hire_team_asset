import { useState, useEffect } from "react";

export default function Page() {
  const [data, setData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [completedCount, setCompletedCount] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/test")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Test endpoint error:", err));
  }, []);

  useEffect(() => {
    const loadTodosAndCount = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        const todosData = await res.json();
        setTodos(todosData);

        const countRes = await fetch(
          "http://127.0.0.1:5000/todos/completed-count",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ todos: todosData }),
          }
        );

        const countData = await countRes.json();
        setCompletedCount(countData.completed_count);
        setPendingCount(countData.pending_count);
      } catch (error) {
        console.error("Error loading todos or count:", error);
      }
    };

    loadTodosAndCount();
  }, []);

  return (
    <div>
      <h2>{data ? data.message : "Loading test endpoint..."}</h2>
      <p>Total todos fetched: {todos.length}</p>
      <div>
        {completedCount !== null ? (
          <p>Completed todos count: {completedCount}</p>
        ) : (
          <p>Calculating completed todos...</p>
        )}
      </div>

      <div>
        {pendingCount !== null ? (
          <p>Pending todos count: {pendingCount}</p>
        ) : (
          <p>Calculating pending todos...</p>
        )}
      </div>
    </div>
  );
}
