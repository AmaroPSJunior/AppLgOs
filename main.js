(function() {
    'use strict';

    // Simple Logger for webOS
    function log(msg) {
        console.log('[webOS App]: ' + msg);
        if (window.webOS && window.webOS.info) {
            // Se houver API webOS, poderíamos usar logs específicos aqui
        }
    }

    // Global Error Handler
    window.onerror = function(msg, url, line, col, error) {
        var consoleDiv = document.getElementById('debug-console');
        if (consoleDiv) {
            consoleDiv.style.display = 'block';
            consoleDiv.innerText += [
                'Error: ' + msg,
                'URL: ' + url,
                'Line: ' + line,
                'Col: ' + col,
                '---'
            ].join('\n') + '\n';
        }
        return false;
    };

    // DOM Elements
    var themeToggle = document.getElementById('theme-toggle');
    var themeIcon = document.getElementById('theme-icon');
    var body = document.body;

    // Theme Logic
    function toggleTheme() {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeIcon.innerText = '☀️';
            log('Theme changed to DARK');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeIcon.innerText = '🌙';
            log('Theme changed to LIGHT');
        }
    }

    // Init
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    log('App Initialized Successfully - Version 1.1');
})();
