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