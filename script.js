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
let tasks = [];
let shopItems = [
    {id: 1, title: 'bubble tea', cost: 50},
    {id: 2, title: '1 hr of gaming', cost: 75},
    {id: 3, title: 'watch a movie', cost: 100}
];
let inventoryItems = [];
let completedTasksCount = 0;
const coinCountSpan = document.getElementById('coin-count');
const statTotalCoins = document.getElementById('stat-total-coins');
const statCompletedTasks = document.getElementById('stat-completed-tasks');
const statInventoryCount = document.getElementById('stat-inventory-count');
function saveData(){
    localStorage.setItem('rpg_coins', coins);
    localStorage.setItem('rpg_tasks', JSON.stringify(tasks));
    localStorage.setItem('rpg_shop', JSON.stringify(shopItems));
    localStorage.setItem('rpg_inventory', JSON.stringify(inventoryItems));
    localStorage.setItem('rpg_completed', completedTasksCount);
    updateStats();
}
function loadData(){
    const savedCoins = localStorage.getItem('rpg_coins');
    if (savedCoins !== null) coins = parseInt(savedCoins);
    const savedTasks = localStorage.getItem('rpg_tasks');
    if (savedTasks) tasks = JSON.parse(savedTasks);
    const savedShop = localStorage.getItem('rpg_shop');
    if (savedShop) shopItems = JSON.parse(savedShop);
    const savedInventory = localStorage.getItem('rpg_inventory');
    if (savedInventory) inventoryItems=JSON.parse(savedInventory);
    const savedCompleted = localStorage.getItem('rpg_completed');
    if (savedCompleted !== null) completedTasksCount = parseInt(savedCompleted);
    coinCountSpan.textContent = coins;
}

function updateStats(){
    coinCountSpan.textContent = coins;
    if (statTotalCoins) statTotalCoins.textContent = coins;
    if (statCompletedTasks) statCompletedTasks.textContent = completedTasksCount;
    if (statInventoryCount) statInventoryCount.textContent = inventoryItems.length;
}


const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskDuration = document.getElementById('task-duration');
const taskList = document.getElementById('task-list');
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
        completedTasksCount++;
        renderTasks();
        saveData();
    }
};

const rewardForm = document.getElementById('reward-form');
const rewardInput = document.getElementById('reward-input');
const rewardCost = document.getElementById('reward-cost');
const shopList = document. getElementById('shop-list');
const inventoryList = document.getElementById('inventory-list');

rewardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = rewardInput.value.trim();
    const cost = parseInt(rewardCost.value);
    const newReward = {
        id: Date.now(),
        title,
        cost
    };
    shopItems.push(newReward);
    rewardInput.value = '';
    rewardCost.value = '';
    renderShop();
    saveData();
});
function renderShop(){
    if (shopItems.length === 0){
        shopList.innerHTML = `<p class="empty-state-text">no rewards in the shop yet. add one above!</p>`;
        return;
    }
    shopList.innerHTML='';
    shopItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'glass-card task-item-card';
        itemCard.innerHTML = `
            <div class="task-details">
                <h3>${item.title}</h3>
                <span class="task-reward">🪙 ${item.cost} coins</span>
            </div>
            <div class="task-actions">
                <button class="glass-btn primary-btn" style="padding: 8px 14px; font-size: 0.85rem;" onclick="buyReward(${item.id})">buy</button>
            </div>
        `;
        shopList.appendChild(itemCard);
    });
}
window.buyReward = function(id) {
    const itemIndex = shopItems.findIndex(i => i.id === id);
    if(itemIndex !== -1) {
        const item = shopItems[itemIndex];
        if (coins >= item.cost){
            coins -= item.cost;
            coinCountSpan.textContent = coins;
            inventoryItems.push({
                id: Date.now(),
                title: item.title
            });
            renderInventory();
            saveData();
            alert(`success! you bought: "${item.title}". check your inventory screen!`);
        }    
        else{
            alert(`not enough coins! complete more tasks to earn ${item.cost - coins} more coins.`);
        }
    }
};
function renderInventory(){
    if (inventoryItems.length === 0){
        inventoryList.innerHTML = `<p class="empty-state-text">your inventory is empty. go earn those hours and buy something nice!</p>`;
        return;
    }
    inventoryList.innerHTML = '';
    inventoryItems.forEach((item, index) => {
        const invCard = document.createElement('div');
        invCard.className = 'glass-card task-item-card';
        invCard.innerHTML = `
            <div class="task-details">
                <h3>${item.title}</h3>
                <span class="task-reward">ready to claim</span>
            </div>
            <div class="task-actions">
                <button class="glass-btn complete-btn" onclick="redeemReward(${index})">redeem</button>
            </div>
        `;
        inventoryList.appendChild(invCard);
    });
}
window.redeemReward = function(index){
    const claimed = inventoryItems.splice(index, 1);
    renderInventory();
    saveData();
    alert(`you redeemed"${claimed[0].title}"! enjoy your real life treat, you earned it lol.`);
};
renderShop();

function updateStats(){
    if (statTotalCoins) statTotalCoins.textContent = coins;
    if (statCompletedTasks) statCompletedTasks.textContent = completedTasksCount;
    if (statInventoryCount) statInventoryCount.textContent = inventoryItems.length;
}
window.resetAppData = function(){
    if (confirm("Are you sure you want to reset all your progress, coins and inventory?")){
        localStorage.clear()
        coins = 0;
        coinCountSpan.textContent = coins;
        tasks = [];
        shopItems = [
            {id: 1, title: 'bubble tea', cost: 50},
            {id: 2, title: '1 hr of gaming', cost: 75},
            {id: 3, title: 'watch a movie', cost: 100}
            ];
            inventoryItems= [];
            completedTasksCount = 0;
            renderTasks();
            renderShop();
            renderInventory();
            saveData();
            alert("RPG data reset successfully! fresh start yay!!");
    }
};

loadData();
renderTasks();
renderShop();
renderInventory();
updateStats();