/* 
 * App JS Puro - Compatibilidade Máxima webOS (ES5)
 */
function initApp() {
    var isDark = false;
    var root = document.getElementById('app-container');
    
    // Elementos do DOM
    var btnToggle = document.getElementById('theme-toggle');
    var welcomeTitle = document.getElementById('welcome-title');

    if (btnToggle) {
        btnToggle.onclick = function() {
            isDark = !isDark;
            if (isDark) {
                document.body.className = 'dark';
                btnToggle.innerText = 'Modo Claro';
            } else {
                document.body.className = '';
                btnToggle.innerText = 'Modo Escuro';
            }
        };
    }
    
    console.log('App webOS iniciado com sucesso.');
}

window.onload = initApp;
