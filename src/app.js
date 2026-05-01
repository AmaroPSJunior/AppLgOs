/* 
 * App webOS - ES5 Purista (Compatibilidade Total)
 */
(function() {
    function init() {
        var isDark = false;
        var btnToggle = document.getElementById('theme-toggle');
        
        if (!btnToggle) {
            // Se o botão ainda não existir, tenta novamente em 100ms
            setTimeout(init, 100);
            return;
        }

        btnToggle.onclick = function() {
            isDark = !isDark;
            if (isDark) {
                document.body.className = 'dark';
                btnToggle.innerHTML = 'Modo Claro';
                btnToggle.style.background = '#334155';
                btnToggle.style.color = '#ffffff';
            } else {
                document.body.className = '';
                btnToggle.innerHTML = 'Modo Escuro';
                btnToggle.style.background = '#e2e8f0';
                btnToggle.style.color = '#000000';
            }
        };
        
        // Log básico para o Inspector
        console.log("WebOS App Inicializado: v1.0.2");
    }

    // Executa quando o DOM estiver pronto
    if (document.readyState === 'complete') {
        init();
    } else {
        window.onload = init;
    }
})();
