const lightDarkToggleButton = document.getElementById('light-dark-toggle');
const body = document.body;
lightDarkToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});