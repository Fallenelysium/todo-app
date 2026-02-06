// 🌙☀️ THEME TOGGLE (dark/light) + onthouden

const themeToggleBtn = document.getElementById("themeToggle");
const body = document.body;

// 1) Bij starten: lees opgeslagen theme
const savedTheme = localStorage.getItem("theme"); // "light" of "dark"
if (savedTheme === "light") {
  body.classList.add("light");
  themeToggleBtn.textContent = "☀️";
} else {
  body.classList.remove("light");
  themeToggleBtn.textContent = "🌙";
}

// 2) Klik op knop = wisselen
themeToggleBtn.addEventListener("click", () => {
  const isLight = body.classList.toggle("light");

  if (isLight) {
    themeToggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "light");
  } else {
    themeToggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
});

// ✅ TO-DO APP (toevoegen / afvinken / verwijderen / bewaren)

const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const clearDoneBtn = document.getElementById("clearDone");

let todos = loadTodos();
render();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  todos.push({
    id: Date.now(),
    text: text,
    done: false
  });

  input.value = "";
  saveTodos();
  render();
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
});

function render() {
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todoItem" + (todo.done ? " todoItem--done" : "");

    // ⬜ checkbox
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = todo.done;
    cb.addEventListener("change", () => {
      todo.done = cb.checked;
      saveTodos();
      render();
    });

    // 📝 tekst
    const text = document.createElement("span");
    text.className = "todoText";
    text.textContent = todo.text;

    // ❌ delete knop
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn--x";
    del.textContent = "✕";
    del.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      render();
    });

    li.appendChild(cb);
    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const data = localStorage.getItem("todos");
  return data ? JSON.parse(data) : [];
}
