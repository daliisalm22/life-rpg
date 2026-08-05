const body = document.body;
const lightDarkToggleButton = document.getElementById('light-dark-toggle');
const darkIcon = lightDarkToggleButton.querySelector('.material-symbols-rounded');
lightDarkToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkIcon.textContent = 'light_mode';
    }
    else{
        darkIcon.textContent = 'dark_mode';
    }
    localStorage.setItem('rpg_dark_mode', isDarkMode);
});
const navButtons = document.querySelectorAll('.nav-icon-btn');
const screens = document.querySelectorAll('.screen');
const headerTitle = document.getElementById('header-title');
const screenTitles = {
    'home-screen': '𐙚DASHBOARD ⋆.˚˖࿔ ࣪',
    'tasks-screen': '𐙚TASKS ⋆.˚˖࿔ ࣪',
    'shop-screen': '𐙚SHOP ⋆.˚˖࿔ ࣪',
    'inventory-screen': '𐙚INVENTORY ⋆.˚˖࿔ ࣪',
    'settings-screen': '𐙚SETTINGS ⋆.˚˖࿔ ࣪'
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
let totalCoinsEarned = 0;
let tasks = [];
let shopItems = [
    {id: 1, title: 'bubble tea', cost: 50},
    {id: 2, title: '1 hr of gaming', cost: 75},
    {id: 3, title: 'watch a movie', cost: 100}
];
let inventoryItems = [];
let completedTasksCount = 0;
let currentStreak = 1;
let lastActiveDate = '';
let dailyMinutes = {};
const coinCountSpan = document.getElementById('coin-count');
const streakCountSpan = document.getElementById('streak-count');
const statTotalCoins = document.getElementById('stat-total-coins');
const statCompletedTasks = document.getElementById('stat-completed-tasks');
const statInventoryCount = document.getElementById('stat-inventory-count');
let currentTheme = 'theme-pink';
function saveData(){
    localStorage.setItem('rpg_coins', coins);
    localStorage.setItem('rpg_tasks', JSON.stringify(tasks));
    localStorage.setItem('rpg_shop', JSON.stringify(shopItems));
    localStorage.setItem('rpg_inventory', JSON.stringify(inventoryItems));
    localStorage.setItem('rpg_completed', completedTasksCount);
    localStorage.setItem('rpg_streak', currentStreak);
    localStorage.setItem('rpg_last_active', lastActiveDate);
    localStorage.setItem('rpg_daily_minutes', JSON.stringify(dailyMinutes));
    localStorage.setItem('rpg_total_earned', totalCoinsEarned);
    localStorage.setItem('rpg_theme', currentTheme);
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
    const savedStreak = localStorage.getItem('rpg_streak');
    if (savedStreak !== null) currentStreak = parseInt(savedStreak);
    const savedLastActive = localStorage.getItem('rpg_last_active');
    if (savedLastActive) lastActiveDate = savedLastActive;
    const savedDailyMinutes = localStorage.getItem('rpg_daily_minutes');
    if (savedDailyMinutes) dailyMinutes = JSON.parse(savedDailyMinutes);
    const savedTotalEarned = localStorage.getItem('rpg_total_earned');
    if (savedTotalEarned !== null) {
        totalCoinsEarned = parseInt(savedTotalEarned);
    }
    else{
        totalCoinsEarned = coins;
    }
    const savedTheme = localStorage.getItem('rpg_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        body.className = '';
        body.classList.add(currentTheme);
        if(body.classList.contains('dark-mode')){

        }
    }
    coinCountSpan.textContent = coins;
    if (streakCountSpan) streakCountSpan.textContent = currentStreak;
    const savedDarkMode = localStorage.getItem('rpg_dark_mode');
    if (savedDarkMode === 'true'){
        body.classList.add('dark-mode');
        if (darkIcon) darkIcon.textContent = 'light_mode';
    }
}

function updateStats(){
    coinCountSpan.textContent = coins;
    if (streakCountSpan) streakCountSpan.textContent = currentStreak;
    if (statTotalCoins) statTotalCoins.textContent = totalCoinsEarned;
    if (statCompletedTasks) statCompletedTasks.textContent = completedTasksCount;
    if (statInventoryCount) statInventoryCount.textContent = inventoryItems.length;
    renderRealChart();
    const dashCompleted = document.getElementById('dash-completed');
    const dashInventory = document.getElementById('dash-inventory');
    const dashTaskPreview = document.getElementById('dash-task-preview');
    if (dashCompleted) dashCompleted.textContent = completedTasksCount;
    if (dashInventory) dashInventory.textContent = inventoryItems.length;
    if (dashTaskPreview){
        if (tasks.length === 0){
            dashTaskPreview.innerHTML = `<p class="empty-state-text" style="font-size: 0.85rem;">no active tasks.</p>`;
        }
        else {
            let previewHTML = '';
            tasks.slice(0, 2).forEach(t => {
                previewHTML += `<div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-size: 0.9rem;">${t.title}</span>
                    <span style="font-size: 0.8rem; opacity: 0.7;">⏱️ ${t.duration}m</span>
                </div>`;
            });
            dashTaskPreview.innerHTML = previewHTML;
        }
    }
    renderRealChart();
}
function checkAndUpdateStreak(){
    const today = new Date(). toISOString().split('T')[0];
    if (lastActiveDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    if (lastActiveDate === yesterdayString){
        currentStreak++;
    }
    else if (lastActiveDate !== today){
        currentStreak = 1;
    }
    lastActiveDate = today;
}
function logTaskMinutes(duration){
    const today = new Date().toISOString().split('T')[0];
    dailyMinutes[today] = (dailyMinutes[today] || 0) + duration;
}
function renderRealChart(){
    const chartContainer = document.getElementById('real-chart-container');
    if (!chartContainer) return;
    let daysHTML = '';
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (let i = 4; i >= 0; i--){
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        const dayLabel = daysOfWeek[d.getDay()];
        const minutes = dailyMinutes[dateString] || 0;
        const heightPx = Math.min(85, Math.max(10, (minutes/120) * 85));
        daysHTML += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <span style="font-size: 0.65rem; opacity: 0.7;">${minutes}m</span>
                <div style="width: 16px; height: ${heightPx}px; background: rgba(255, 71, 87, ${minutes > 0 ? 0.8 : 0.2}); border-radius: 8px 8px 0 0;"></div>
                <span style="font-size: 0.7rem;">${dayLabel}</span>
            </div>
        `;
    }
    chartContainer.innerHTML = daysHTML;
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
    saveData();
    updateStats();
});
function renderTasks(){
    if (tasks.length === 0){
        taskList.innerHTML = `<p class="empty-state-text">no active tasks yet. add one above!</p>`;
        updateStats();
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
                <button class="glass-icon-btn" style="gap: 25px; background: rgba(255, 71, 87, 0.2); border: 1px solid rgba(255, 71, 87, 0.4); padding: 6px 10px; font-size: 0.8rem;" onclick="deleteTask(${task.id})">✕</button>
            </div>
        `;
        taskList.appendChild(taskCard);
    });
    updateStats();
}
window.completeTask = function(id){
    const taskIndex = tasks.findIndex(t => t.id === id);
    if(taskIndex !== -1){
        const taskDuration = tasks[taskIndex].duration;
        const earned = tasks[taskIndex].coins;
        coins += earned;
        totalCoinsEarned += earned;
        coinCountSpan.textContent = coins;
        tasks.splice(taskIndex, 1);
        completedTasksCount++;
        logTaskMinutes(taskDuration);
        checkAndUpdateStreak();
        renderTasks();
        saveData();
    }
};

window.deleteTask = function(id){
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    saveData();
};
window.deleteShopItem = function(id){
    shopItems = shopItems.filter(i => i.id !== id);
    renderShop();
    saveData();
};
window.deleteInventoryItem = function(index){
    const item = inventoryItems[index];
    const shopMatch = shopItems.find(s => s.title.toLowerCase() === item.title.toLowerCase());
    const refundAmount = shopMatch ? shopMatch.cost : 50;
    coins += refundAmount;
    inventoryItems.splice(index, 1);
    coinCountSpan.textContent = coins;
    renderInventory();
    saveData();
    alert(`refunded ${refundAmount} coins for deleting "${item.title}"!`);
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
                <button class="glass-icon-btn" style="gap: 25px; background: rgba(255, 71, 87, 0.2); border: 1px solid rgba(255, 71, 87, 0.4); padding: 6px 10px; font-size: 0.8rem;" onclick="deleteShopItem(${item.id})">✕</button>
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
        updateStats();
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
                <button class="glass-icon-btn" style="gap: 25px; background: rgba(255, 71, 87, 0.2); border: 1px solid rgba(255, 71, 87, 0.4); padding: 6px 10px; font-size: 0.8rem;" onclick="deleteInventoryItem(${index})" title="delete and get coin refund">✕</button>
            </div>
        `;
        inventoryList.appendChild(invCard);
    });
    updateStats();
}

const themeButtons = document.querySelectorAll('.theme-switch-btn');
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedTheme = btn.getAttribute('data-theme');
        body.classList.remove('theme-pink', 'theme-orange', 'theme-yellow', 'theme-green', 'theme-blue', 'theme-purple');
        body.classList.add(selectedTheme);
        currentTheme = selectedTheme;
        saveData();
    });
});

window.redeemReward = function(index){
    const claimed = inventoryItems.splice(index, 1);
    renderInventory();
    saveData();
    alert(`you redeemed"${claimed[0].title}"! enjoy your real life treat, you earned it lol.`);
};
renderShop();

window.resetAppData = function(){
    if (confirm("Are you sure you want to reset all your progress, coins and inventory?")){
        localStorage.clear()
        coins = 0;
        totalCoinsEarned = 0;
        currentStreak = 1;
        dailyMinutes = {};
        coinCountSpan.textContent = coins;
        streakCountSpan.textContent = currentStreak;
        tasks = [];
        shopItems = [
            {id: 1, title: 'bubble tea', cost: 50},
            {id: 2, title: '1 hr of gaming', cost: 75},
            {id: 3, title: 'watch a movie', cost: 100}
        ];
        inventoryItems= [];
        completedTasksCount = 0;
        body.className = '';
        currentTheme = 'theme-pink';
        renderTasks();
        renderShop();
        renderInventory();
        saveData();
        alert("RPG data reset successfully! fresh start yay!!");
    }
};

const onboardingModal = document.getElementById('onboarding-modal');
const closeOnboardingBtn = document.getElementById('close-onboarding-btn');
function checkOnboarding(){
    const hasSeenOnboarding = localStorage.getItem('charis_onboarding_seen');
    if(!hasSeenOnboarding && onboardingModal){
        onboardingModal.style.display = 'flex';
    }
}
closeOnboardingBtn.addEventListener('click', () => {
    onboardingModal.style.display = 'none';
    localStorage.setItem('charis_onboarding_seen', 'true');
});

checkOnboarding();
loadData();
renderTasks();
renderShop();
renderInventory();
updateStats();