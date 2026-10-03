const chatForm = document.getElementById('chat-form');
const taskForm = document.getElementById('task-form');
const questionInput = document.getElementById('question');
const responseBox = document.getElementById('response');
const taskList = document.getElementById('task-list');

async function renderTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();

  taskList.innerHTML = tasks
    .map(
      (task) => `
        <li class="task-item">
          <div class="task-title">${task.title}</div>
          <div class="task-meta">Assigned to: ${task.assignedTo} • ${task.status}</div>
        </li>
      `
    )
    .join('');
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();

  if (!question) return;

  responseBox.textContent = 'Thinking...';

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  responseBox.textContent = data.reply;
  questionInput.value = '';
  await renderTasks();
});

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const assignedTo = document.getElementById('task-assignee').value.trim();

  if (!title || !assignedTo) return;

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, assignedTo, status: 'pending' })
  });

  document.getElementById('task-title').value = '';
  document.getElementById('task-assignee').value = '';
  await renderTasks();
});

renderTasks();
