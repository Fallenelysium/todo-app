// 🌙☀️ THEME TOGGLE (dark/light) + onthouden
const themeToggleBtn = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
  themeToggleBtn.textContent = "☀️";
} else {
  body.classList.remove("light");
  themeToggleBtn.textContent = "🌙";
}

themeToggleBtn.addEventListener("click", () => {
  const isLight = body.classList.toggle("light");
  themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});


// =========================
// ✅ TO-DO APP (Optie B uitgebreid)
// =========================
const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const clearDoneBtn = document.getElementById("clearDone");
const error = document.getElementById("error");
const counter = document.getElementById("counter");

const categorySelect = document.getElementById("category");
const daySelect = document.getElementById("day");

// Filters
const catChips = document.querySelectorAll("[data-filter-cat]");
const dayChips = document.querySelectorAll("[data-filter-day]");
const toggleDoneViewBtn = document.getElementById("toggleDoneView");

let filterCat = "all";
let filterDay = "all";
let showDone = true;

// standaard dag = vandaag
daySelect.value = getTodayKey();

let todos = loadTodos();
render();

// ➕ Toevoegen
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();

  if (text === "") {
    error.hidden = false;
    return;
  }
  error.hidden = true;

  todos.push({
    id: Date.now(),
    text,
    done: false,
    important: false,
    category: categorySelect.value,
    day: daySelect.value
  });

  input.value = "";
  saveTodos();
  render();
});

// foutmelding weg bij typen
input.addEventListener("input", () => error.hidden = true);

// 🧹 Verwijder afgevinkt
clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
});

// Filters
catChips.forEach(btn => {
  btn.addEventListener("click", () => {
    filterCat = btn.dataset.filterCat;
    setActive(catChips, btn);
    render();
  });
});

dayChips.forEach(btn => {
  btn.addEventListener("click", () => {
    filterDay = btn.dataset.filterDay;
    setActive(dayChips, btn);
    render();
  });
});

if (toggleDoneViewBtn) {
  toggleDoneViewBtn.addEventListener("click", () => {
    showDone = !showDone;
    toggleDoneViewBtn.textContent = showDone ? "Toon afgevinkt" : "Verberg afgevinkt";
    toggleDoneViewBtn.classList.toggle("is-active", showDone);
    render();
  });
}

function setActive(group, activeBtn) {
  group.forEach(b => b.classList.remove("is-active"));
  activeBtn.classList.add("is-active");
}

// 🔁 Render
function render() {
  list.innerHTML = "";

  // Teller
  const openTasks = todos.filter(t => !t.done).length;
  counter.textContent =
    openTasks === 0 ? "🎉 Alles gedaan!" : `📝 Nog ${openTasks} taak${openTasks > 1 ? "en" : ""}`;

  // 👉 FILTER + ⭐ SORTERING
  const visibleTodos = getVisibleTodos()
    .sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return 0;
    });

  if (visibleTodos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todoItem";
    empty.innerHTML = `<span class="todoText">😅 Geen taken in deze filter.</span>`;
    list.appendChild(empty);
    return;
  }

  visibleTodos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todoItem" + (todo.done ? " todoItem--done" : "");

    // checkbox
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = todo.done;
    cb.addEventListener("change", () => {
      todo.done = cb.checked;
      saveTodos();
      render();
    });

    // tekst + labels
    const textWrap = document.createElement("div");
    textWrap.style.flex = "1";
    textWrap.style.minWidth = "0";

    const title = document.createElement("div");
    title.className = "todoText";
    title.textContent = todo.text;

    const meta = document.createElement("div");
    meta.className = "todoMeta";

    if (todo.important) {
      const starBadge = document.createElement("span");
      starBadge.className = "badge badge--star";
      starBadge.textContent = "⭐ Belangrijk";
      meta.appendChild(starBadge);
    }

    const cat = document.createElement("span");
    cat.className = `badge badge--${todo.category}`;
    cat.textContent = niceCategory(todo.category);

    const day = document.createElement("span");
    day.className = `badge badge--${todo.day}`;
    day.textContent = niceDay(todo.day);

    meta.appendChild(cat);
    meta.appendChild(day);

    textWrap.appendChild(title);
    textWrap.appendChild(meta);

    // ⭐ knop
    const starBtn = document.createElement("button");
    starBtn.className = "btn btn--mini";
    starBtn.textContent = todo.important ? "★" : "☆";
    starBtn.addEventListener("click", () => {
      todo.important = !todo.important;
      saveTodos();
      render();
    });

    // ❌ delete
    const del = document.createElement("button");
    del.className = "btn btn--x";
    del.textContent = "✕";
    del.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      render();
    });

    li.appendChild(cb);
    li.appendChild(textWrap);
    li.appendChild(starBtn);
    li.appendChild(del);
    list.appendChild(li);
  });
}

// helpers
function getVisibleTodos() {
  return todos.filter(t => {
    const catOk = filterCat === "all" || t.category === filterCat;
    const dayOk = filterDay === "all" || t.day === filterDay;
    const doneOk = showDone ? true : !t.done;
    return catOk && dayOk && doneOk;
  });
}

function niceCategory(cat) {
  if (cat === "werk") return "Werk";
  if (cat === "school") return "School";
  return "Privé";
}

function niceDay(day) {
  const map = {
    mon: "Maandag", tue: "Dinsdag", wed: "Woensdag",
    thu: "Donderdag", fri: "Vrijdag",
    sat: "Zaterdag", sun: "Zondag"
  };
  return map[day] || day;
}

function getTodayKey() {
  const d = new Date().getDay();
  return ["sun","mon","tue","wed","thu","fri","sat"][d];
}

// storage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadTodos() {
  const d = localStorage.getItem("todos");
  return d ? JSON.parse(d) : [];
}
