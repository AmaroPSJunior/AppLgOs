(function() {
    'use strict';

    var currentFocus = 1;
    var totalCards = 4;
    var isIptvMode = false;
    var iptvData = { live: [], movies: [], series: [] };
    var activeCategory = 'live';

    function log(msg) {
        var consoleElem = document.getElementById('luna-console');
        if (!consoleElem) return;
        var now = new Date();
        var time = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0') + ':' + 
                   now.getSeconds().toString().padStart(2, '0');
        
        var messageLine = '<div style="margin-bottom:5px"><span style="color:#64748b">[' + time + ']</span> ' + msg + '</div>';
        consoleElem.innerHTML = messageLine + consoleElem.innerHTML;
        
        // Remove logs antigos
        if (consoleElem.children.length > 20) {
            consoleElem.removeChild(consoleElem.lastChild);
        }
    }

    // IPTV Logic
    function toggleIptvView(show) {
        log(show ? 'Entering IPTV mode' : 'Returning to Dashboard');
        isIptvMode = show;
        document.getElementById('dashboard-view').style.display = show ? 'none' : 'grid';
        document.getElementById('iptv-view').style.display = show ? 'flex' : 'none';
        document.getElementById('btn-iptv-launch').innerText = show ? '⬅️ VOLTAR AO DASH' : '🚀 LANÇAR IPTV PRO';
        
        if (show) {
            currentFocus = 10;
            renderIptvGrid();
        } else {
            currentFocus = 1;
        }
        updateFocus();
    }

    async function loadIptvList(url) {
        if (!url) return;
        log('IPTV: Fetching list...');
        try {
            // Usando proxy para evitar problemas de CORS no browser (no app real webos não costuma precisar)
            const response = await fetch(url);
            const text = await response.text();
            parseM3U(text);
            log('IPTV: ' + (iptvData.live.length + iptvData.movies.length + iptvData.series.length) + ' items loaded');
            renderIptvGrid();
        } catch (e) {
            log('IPTV Error: Failed to fetch list. Check URL.');
            // Fallback para exemplo caso falhe
            iptvData.live = [{ title: 'Canal de Teste (Falha no Fetch)', url: '', group: 'ERROR', logo: '' }];
            renderIptvGrid();
        }
    }

    function parseM3U(content) {
        const lines = content.split('\n');
        iptvData = { live: [], movies: [], series: [] };
        let currentItem = null;

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
                const titleMatch = line.split(',').pop();
                const logoMatch = line.match(/tvg-logo="([^"]+)"/) || [];
                const groupMatch = line.match(/group-title="([^"]+)"/) || [null, 'OUTROS'];
                
                currentItem = {
                    title: titleMatch,
                    logo: logoMatch[1] || 'https://via.placeholder.com/200x300?text=Amaro+Pro',
                    group: groupMatch[1].toUpperCase()
                };
            } else if (line.startsWith('http') && currentItem) {
                currentItem.url = line;
                const g = currentItem.group;
                if (g.includes('FILME') || g.includes('MOVIE') || g.includes('VOD')) {
                    iptvData.movies.push(currentItem);
                } else if (g.includes('SERIE') || g.includes('SÉRIE') || g.includes('SEASON')) {
                    iptvData.series.push(currentItem);
                } else {
                    iptvData.live.push(currentItem);
                }
                currentItem = null;
            }
        });
        
        localStorage.setItem('iptv_url', document.getElementById('iptv-url-input').value);
    }

    function renderIptvGrid() {
        const grid = document.getElementById('iptv-grid');
        grid.innerHTML = '';
        const items = iptvData[activeCategory] || [];

        // Atualizar estilo visual do menu
        document.querySelectorAll('.iptv-menu-item').forEach(item => {
            if (item.getAttribute('data-cat') === activeCategory) {
                item.style.background = '#cf0652';
            } else {
                item.style.background = 'rgba(255,255,255,0.05)';
            }
        });

        if (items.length === 0) {
            grid.innerHTML = '<div style="grid-column: span 4; text-align: center; color: #64748b; padding: 100px; font-size: 24px;">Nenhum conteúdo carregado.<br><br>Vá em CONFIGURATIONS para adicionar uma lista.</div>';
            return;
        }

        items.slice(0, 100).forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'focusable iptv-card';
            card.tabIndex = 100 + idx;
            card.innerHTML = `
                <img src="${item.logo}" onerror="this.src='https://via.placeholder.com/200x300?text=AMARO+IPTV'">
                <div style="font-size: 16px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 5px;">${item.title}</div>
            `;
            
            card.addEventListener('click', () => playContent(item));
            grid.appendChild(card);
        });
        
        if (isIptvMode && currentFocus >= 100) updateFocus();
    }

    function playContent(item) {
        log('Playing: ' + item.title);
        const player = document.getElementById('iptv-player');
        document.getElementById('playing-title').innerText = item.title;
        document.getElementById('playing-group').innerText = item.group;
        document.getElementById('playing-desc').innerText = 'Reproduzindo conteúdo de alta qualidade via lista Amaro Pro. Use as setas para trocar de canal.';
        
        player.src = item.url;
        player.play().catch(e => {
            log('Player Codec Hint: Try HLS/MPEG-TS');
        });
    }

    function handleKeyDown(e) {
        const key = e.keyCode;
        const modal = document.getElementById('modal-list');
        const isModalOpen = modal && modal.style.display === 'flex';
        
        log('IRC Key: ' + key);

        // Atalho Botão Vermelho: Toggle IPTV
        if (key === 403) {
            toggleIptvView(!isIptvMode);
            return;
        }

        // Se o modal estiver aberto, focar apenas nos elementos do modal
        if (isModalOpen) {
            if (key === 13) { // Enter
                if (currentFocus === 21) saveList();
                else if (currentFocus === 22) closeModal();
                else if (currentFocus === 20) {
                    currentFocus = 21; // Pula do input pros botões ao dar OK no input (teclado virtual fecha)
                }
                updateFocus();
                return;
            }
            if (key === 461 || key === 27) { // Back/ESC
                closeModal();
                return;
            }
            if (key === 37) { // Left
                if (currentFocus === 22) currentFocus = 21;
                updateFocus();
            } else if (key === 39) { // Right
                if (currentFocus === 21) currentFocus = 22;
                updateFocus();
            } else if (key === 38) { // Up
                if (currentFocus === 21 || currentFocus === 22) currentFocus = 20;
                updateFocus();
            } else if (key === 40) { // Down
                if (currentFocus === 20) currentFocus = 21;
                updateFocus();
            }
            return;
        }

        if (document.activeElement.tagName === 'INPUT' && key !== 13 && key !== 27 && key !== 461) return;

        switch(key) {
            case 37: // Left
                if (isIptvMode) {
                    if (currentFocus >= 100) {
                        if (currentFocus % 4 === 0) currentFocus = 10;
                        else currentFocus--;
                    }
                } else {
                    if (currentFocus === 2) currentFocus = 1;
                    else if (currentFocus === 4) currentFocus = 3;
                }
                break;
            
            case 39: // Right
                if (isIptvMode) {
                    if (currentFocus >= 10 && currentFocus <= 13) currentFocus = 100;
                    else if (currentFocus >= 100) currentFocus++;
                } else {
                    if (currentFocus === 1) currentFocus = 2;
                    else if (currentFocus === 3) currentFocus = 4;
                    else if (currentFocus === 2 || currentFocus === 4) currentFocus = 5;
                }
                break;

            case 38: // Up
                if (isIptvMode) {
                    if (currentFocus >= 104) currentFocus -= 4;
                    else if (currentFocus >= 100) currentFocus = 100;
                    else if (currentFocus > 10) currentFocus--;
                    else if (currentFocus === 10) currentFocus = 5;
                } else {
                    if (currentFocus === 3) currentFocus = 1;
                    else if (currentFocus === 4) currentFocus = 2;
                    else if (currentFocus === 1 || currentFocus === 2) currentFocus = 5;
                }
                break;

            case 40: // Down
                if (isIptvMode) {
                    if (currentFocus === 5) currentFocus = 10;
                    else if (currentFocus >= 10 && currentFocus < 13) currentFocus++;
                    else if (currentFocus >= 100) currentFocus += 4;
                } else {
                    if (currentFocus === 5) currentFocus = 1;
                    else if (currentFocus === 1) currentFocus = 3;
                    else if (currentFocus === 2) currentFocus = 4;
                }
                break;

            case 13: // Enter
                if (currentFocus === 5) {
                    toggleIptvView(!isIptvMode);
                } else if (currentFocus >= 10 && currentFocus <= 12) {
                    const cats = ['live', 'movies', 'series'];
                    activeCategory = cats[currentFocus - 10];
                    renderIptvGrid();
                } else if (currentFocus === 13) {
                    modal.style.display = 'flex';
                    currentFocus = 20;
                    updateFocus();
                } else if (currentFocus >= 100) {
                    const idx = currentFocus - 100;
                    const items = iptvData[activeCategory] || [];
                    if (items[idx]) playContent(items[idx]);
                } else if (currentFocus === 4) {
                    testToast();
                }
                break;

            case 461: // Back (webOS)
            case 27:  // ESC
                if (isIptvMode) {
                    toggleIptvView(false);
                } else {
                    if (window.close) window.close();
                }
                break;
        }
        updateFocus();
    }

    function saveList() {
        const urlInput = document.getElementById('iptv-url-input');
        const url = urlInput ? urlInput.value.trim() : "";
        if (url) {
            log('Saving URL: ' + url);
            localStorage.setItem('iptv_url', url);
            closeModal();
            loadIptvList(url);
        } else {
            log('Save ignored: Empty URL');
        }
    }

    function closeModal() {
        const modal = document.getElementById('modal-list');
        if (modal) modal.style.display = 'none';
        log('Modal closed');
        currentFocus = 13; // Retorna para CONFIGURATIONS
        updateFocus();
    }

    function updateFocus() {
        document.querySelectorAll('.focusable').forEach(el => el.blur());
        const target = document.querySelector('[tabindex="' + currentFocus + '"]');
        if (target) {
            target.focus();
            if (target.classList.contains('iptv-card')) {
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    // Luna Services
    function checkBluetooth() {
        if (window.webOS && webOS.service) {
            webOS.service.request("luna://com.webos.service.bluetooth", {
                method: "getStatus",
                onSuccess: (res) => {
                    const status = res.enabled ? 'ON' : 'OFF';
                    document.getElementById('bt-status-ui').innerText = status;
                    document.getElementById('conf-bt-audio').innerText = status;
                }
            });
        }
    }

    function fetchAllTelemetry() {
        if (window.webOS && webOS.service) {
            webOS.service.request("luna://com.webos.service.tv.systemproperty", {
                method: "getSystemInfo",
                parameters: { "keys": ["modelName", "firmwareVersion", "sdkVersion", "country"] },
                onSuccess: function (res) {
                    document.getElementById('tv-model').innerText = res.modelName || 'LG SMART TV';
                    document.getElementById('val-webos').innerText = res.firmwareVersion || 'v.Latest';
                    document.getElementById('val-sdk').innerText = 'SDK ' + (res.sdkVersion || '6.0');
                    document.getElementById('val-region-code').innerText = res.country || 'BRA';
                    document.getElementById('conf-tv-name').innerText = res.modelName || 'LG TV';
                }
            });

            webOS.service.request("luna://com.webos.service.connectionmanager", {
                method: "getStatus",
                onSuccess: function (res) {
                    const wifiIn = res.wifi && res.wifi.state === "connected";
                    document.getElementById('val-ip').innerText = wifiIn ? res.wifi.ipAddress : (res.wired.ipAddress || '0.0.0.0');
                    document.getElementById('val-wifi').innerText = wifiIn ? 'WiFi Active' : 'Ethernet Core';
                }
            });
            checkBluetooth();
        } else {
            // Mock para dev
            document.getElementById('tv-model').innerText = 'SIMULADOR LG';
            document.getElementById('val-webos').innerText = 'v6.5.0-DEMO';
        }
    }

    function testToast() {
        if (window.webOS && webOS.service) {
            webOS.service.request("luna://com.webos.notification", {
                method: "createToast",
                parameters: { "message": "Sistema Amaro Conectado!" }
            });
        }
    }

    window.onload = function() {
        const savedUrl = localStorage.getItem('iptv_url');
        if (savedUrl) {
            document.getElementById('iptv-url-input').value = savedUrl;
            loadIptvList(savedUrl);
        }

        fetchAllTelemetry();
        updateFocus();
        window.addEventListener('keydown', handleKeyDown);
        
        setInterval(() => {
            const d = new Date();
            document.getElementById('val-clock').innerText = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
        }, 10000);
    };

})();
