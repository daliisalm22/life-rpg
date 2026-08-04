const body = document.body;
const lightDarkToggleButton = document.getElementById('light-dark-toggle');
const darkIcon = lightDarkToggleButton.querySelector('.material-symbols-rounded');
lightDarkToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkIcon.textContent = 'light_mode';
    }
    else{
        darkIcon.textContent = 'dark_mode';
    }
});
const navButtons = document.querySelectorAll('.nav-icon-btn');
const screens = document.querySelectorAll('.screen');
const headerTitle = document.getElementById('header-title');
const screenTitles = {
    'home-screen': 'DASHBOARD',
    'tasks-screen': 'TASKS',
    'shop-screen': 'SHOP',
    'inventory-screen': 'INVENTORY',
    'settings-screen': 'SETTINGS'
};
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        screens.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        const targetScreenId = btn.getAttribute('data-target');
        document.getElementById(targetScreenId).classList.add('active');
        if(screenTitles[targetScreenId]){
            headerTitle.textContent = screenTitles[targetScreenId];
        }
    });
});

let coins = 0;
const coinCountSpan = document.getElementById('coin-count');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskDuration = document.getElementById('task-duration');
const taskList = document.getElementById('task-list');
let tasks = [];
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    const category = taskCategory.value;
    const durationMins = parseInt(taskDuration.value);
    const earnedCoins = Math.max(1, Math.floor(durationMins/5));
    const newTask = {
        id: Date.now(),
        title,
        category,
        duration: durationMins,
        coins: earnedCoins
    };
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
});
function renderTasks(){
    if (tasks.length === 0){
        taskList.innerHTML = `<p class="empty-state-text">no active tasks yet. add one above!</p>`;
        return;
    }
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'glass-card task-item-card';
        taskCard.innerHTML = `
            <div class="task-details">
                <span class="task-badge">${task.category}</span>
                <h3>${task.title}</h3>
                <span class="task-reward">⏱️ ${task.duration}m &bull; 🪙 +${task.coins} coins</span>
            </div>
            <div class="task-actions">
                <button class="glass-btn complete-btn" onclick="completeTask(${task.id})">done</button>
            </div>
        `;
        taskList.appendChild(taskCard);
    });
}
window.completeTask = function(id){
    const taskIndex = tasks.findIndex(t => t.id === id);
    if(taskIndex !== -1){
        coins += tasks[taskIndex].coins;
        coinCountSpan.textContent = coins;
        tasks.splice(taskIndex, 1);
        renderTasks();
    }
};