const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const progressText = document.getElementById('progressText');
const barFill = document.getElementById('barFill');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Progress update
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;

  progressText.textContent = `${completed}/${total}`;
  barFill.style.width = total ? `${(completed / total) * 100}%` : '0%';
}

// Render
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;

    checkbox.onchange = () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    const span = document.createElement('span');
    span.textContent = task.text;

    // EDIT
    const editBtn = document.createElement('button');
    editBtn.textContent = "✏️";

    editBtn.onclick = () => {
      const newText = prompt('Edit task:', task.text);
      if (newText === null) return;

      const trimmed = newText.trim();
      if (!trimmed) return;

      tasks[index].text = trimmed;
      saveTasks();
      renderTasks();
    };

    // DELETE
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "🗑️";

    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  saveTasks();
  updateProgress();
}

// ADD TASK (improved)
function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) return;

  // prevent duplicates
  const exists = tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase());
  if (exists) {
    alert("Task already exists!");
    return;
  }

  tasks.push({ text: taskText, done: false });
  taskInput.value = '';

  saveTasks();
  renderTasks();
}

// Button click
addTaskBtn.onclick = addTask;

// ENTER key support
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Keyboard shortcuts (power feature)
document.addEventListener("keydown", (e) => {
  // Ctrl + D → mark all done
  if (e.ctrlKey && e.key === "d") {
    tasks = tasks.map(t => ({ ...t, done: true }));
    saveTasks();
    renderTasks();
  }

  // Ctrl + R → reset all
  if (e.ctrlKey && e.key === "r") {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();
