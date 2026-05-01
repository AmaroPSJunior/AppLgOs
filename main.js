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
        isIptvMode = show;
        document.getElementById('dashboard-view').style.display = show ? 'none' : 'grid';
        document.getElementById('iptv-view').style.display = show ? 'flex' : 'none';
        document.getElementById('btn-iptv-launch').innerText = show ? '⬅️ VOLTAR AO DASH' : '🚀 LANÇAR IPTV PRO';
        
        if (show) {
            log('Mode: IPTV Player Pro Active');
            currentFocus = 10;
            renderIptvGrid();
        } else {
            currentFocus = 1;
        }
        updateFocus();
    }

    async function loadIptvList(url) {
        log('IPTV: Fetching list from ' + url);
        try {
            const response = await fetch(url);
            const text = await response.text();
            parseM3U(text);
            log('IPTV: List loaded successfully');
            renderIptvGrid();
        } catch (e) {
            log('IPTV Error: Failed to fetch list: ' + e.message);
        }
    }

    function parseM3U(content) {
        const lines = content.split('\n');
        iptvData = { live: [], movies: [], series: [] };
        let currentItem = null;

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
                const info = line.split(',');
                const title = info[info.length - 1];
                const meta = line.match(/tvg-logo="([^"]+)"/) || [];
                const group = line.match(/group-title="([^"]+)"/) || [null, 'Uncategorized'];
                
                currentItem = {
                    title: title,
                    logo: meta[1] || 'https://via.placeholder.com/150',
                    group: group[1]
                };
            } else if (line.startsWith('http') && currentItem) {
                currentItem.url = line;
                
                // Heurística simples de categorização
                const lowerGroup = currentItem.group.toLowerCase();
                if (lowerGroup.includes('movie') || lowerGroup.includes('filme')) {
                    iptvData.movies.push(currentItem);
                } else if (lowerGroup.includes('series') || lowerGroup.includes('serie')) {
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

        if (items.length === 0) {
            grid.innerHTML = '<div style="grid-column: span 4; text-align: center; color: #64748b; padding: 40px;">Nenhum conteúdo encontrado nesta categoria.</div>';
            return;
        }

        items.slice(0, 40).forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'focusable iptv-card';
            card.tabIndex = 100 + idx;
            card.style.cssText = 'background: #1e293b; border-radius: 10px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s;';
            card.innerHTML = `
                <img src="${item.logo}" style="width: 100%; height: 100px; object-fit: contain; border-radius: 5px; margin-bottom: 5px;">
                <div style="font-size: 12px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
            `;
            
            card.addEventListener('click', () => playContent(item));
            grid.appendChild(card);
        });
    }

    function playContent(item) {
        log('IPTV: Playing ' + item.title);
        const player = document.getElementById('iptv-player');
        document.getElementById('playing-title').innerText = item.title;
        document.getElementById('playing-desc').innerText = 'Categoria: ' + item.group;
        
        player.src = item.url;
        player.play().catch(e => {
            log('Player Err: codec not supported on this TV: ' + e.message);
        });
    }

    // Luna BT Support
    function checkBluetooth() {
        log('Req: bluetooth/getStatus');
        if (window.webOS && webOS.service) {
            webOS.service.request("luna://com.webos.service.bluetooth", {
                method: "getStatus",
                onSuccess: function(res) {
                    log('BT Status: ' + (res.enabled ? 'ENABLED' : 'DISABLED'));
                }
            });
        }
    }

    // Chamadas Luna Bus
    function fetchAllTelemetry() {
        log('Initializing Batch Luna Scan...');

        // 1. System Info
        if (window.webOS && webOS.service && webOS.service.request) {
            log('Req: systemproperty/getSystemInfo');
            webOS.service.request("luna://com.webos.service.tv.systemproperty", {
                method: "getSystemInfo",
                parameters: { 
                    "keys": ["modelName", "firmwareVersion", "sdkVersion", "UHD"]
                },
                onSuccess: function (res) {
                    log('Res: System info retrieved');
                    document.getElementById('tv-model').innerText = res.modelName || 'LG Generic';
                    document.getElementById('val-webos').innerText = res.firmwareVersion || 'Unknown';
                    document.getElementById('val-sdk').innerText = 'SDK ' + (res.sdkVersion || 'Unknown');
                },
                onFailure: function (err) {
                    log('Err: systemproperty failed: ' + err.errorText);
                    // Mock para testes em browser comum
                    document.getElementById('tv-model').innerText = 'BROWSER_SIMULATOR';
                }
            });

            // 2. Network Status
            log('Req: connectionmanager/getStatus');
            webOS.service.request("luna://com.webos.service.connectionmanager", {
                method: "getStatus",
                onSuccess: function (res) {
                    log('Res: Network state: ' + res.state);
                    if (res.wifi && res.wifi.state === "connected") {
                        document.getElementById('val-wifi').innerText = 'WiFi Core';
                        document.getElementById('val-ip').innerText = res.wifi.ipAddress || '0.0.0.0';
                    } else if (res.wired && res.wired.state === "connected") {
                        document.getElementById('val-wifi').innerText = 'Ethernet Core';
                        document.getElementById('val-ip').innerText = res.wired.ipAddress || '0.0.0.0';
                    } else {
                        document.getElementById('val-wifi').innerText = 'Disconnected';
                    }
                }
            });

            // 3. Time/Clock
            log('Req: systemservice/clock/getTime');
            webOS.service.request("luna://com.webos.service.systemservice", {
                method: "clock/getTime",
                onSuccess: function(res) {
                    if (res.localtime) {
                        var h = res.localtime.hour.toString().padStart(2, '0');
                        var m = res.localtime.minute.toString().padStart(2, '0');
                        document.getElementById('val-clock').innerText = h + ':' + m;
                    }
                }
            });

            // 4. Country
            webOS.service.request("luna://com.webos.service.tv.systemproperty", {
                method: "getSystemInfo",
                parameters: { "keys": ["country"] },
                onSuccess: function(res) {
                    document.getElementById('val-region-code').innerText = res.country || 'Not Set';
                }
            });
        } else {
            log('Warn: webOS library not detected. Running in Sandbox mode.');
            // Simulação local
            document.getElementById('tv-model').innerText = 'DEV_WORKSPACE';
            document.getElementById('val-webos').innerText = 'v4.5.0-sandbox';
            document.getElementById('val-sdk').innerText = 'SDK 1.2.4';
        }
    }

    // Tratamento de Controle Remoto (Focus Management)
    function handleKeyDown(e) {
        log('IRC Key: ' + e.keyCode);
        
        // Se estiver no campo de input, não interceptar setas (exceto back/exit)
        if (document.activeElement.tagName === 'INPUT' && e.keyCode !== 461 && e.keyCode !== 27) return;

        switch(e.keyCode) {
            case 37: // Seta Esquerda
                if (isIptvMode) {
                    if (currentFocus >= 101) currentFocus--;
                    else if (currentFocus >= 100) currentFocus = 10;
                } else if (currentFocus > 1) {
                    currentFocus--;
                }
                updateFocus();
                break;
            case 39: // Seta Direita
                if (isIptvMode) {
                    if (currentFocus < 13) currentFocus = 100;
                    else if (currentFocus >= 100) currentFocus++;
                } else if (currentFocus < totalCards) {
                    currentFocus++;
                }
                updateFocus();
                break;
            case 38: // Seta Cima
                if (isIptvMode) {
                    if (currentFocus >= 104) currentFocus -= 4;
                    else if (currentFocus >= 100) currentFocus = 12;
                    else if (currentFocus > 10) currentFocus--;
                } else if (currentFocus > 2) {
                    currentFocus -= 2;
                }
                updateFocus();
                break;
            case 40: // Seta Baixo
                if (isIptvMode) {
                    if (currentFocus >= 10 && currentFocus < 13) currentFocus++;
                    else if (currentFocus < 100) currentFocus = 100;
                    else currentFocus += 4;
                } else if (currentFocus <= 2) {
                    currentFocus += 2;
                }
                updateFocus();
                break;
            case 13: // OK / Enter
                if (e.target.id === 'btn-iptv-launch' || (currentFocus === 1 && !isIptvMode)) {
                    toggleIptvView(!isIptvMode);
                } else if (currentFocus === 4 && !isIptvMode) {
                    testToast();
                } else if (currentFocus >= 10 && currentFocus <= 12) {
                    const cats = ['live', 'movies', 'series'];
                    activeCategory = cats[currentFocus - 10];
                    renderIptvGrid();
                } else if (currentFocus === 13) {
                    document.getElementById('modal-list').style.display = 'flex';
                    document.getElementById('iptv-url-input').focus();
                } else if (currentFocus >= 100) {
                    const idx = currentFocus - 100;
                    const items = iptvData[activeCategory] || [];
                    if (items[idx]) playContent(items[idx]);
                }
                flashCard();
                break;
            case 403: // Botão Vermelho
                if (!isIptvMode) fetchAllTelemetry();
                else checkBluetooth();
                break;
            case 404: // Botão Verde
                document.getElementById('luna-console').innerHTML = '';
                log('Log cleared.');
                break;
            case 461: // Botão BACK (webOS)
            case 27:  // ESC
                if (document.getElementById('modal-list').style.display === 'flex') {
                    document.getElementById('modal-list').style.display = 'none';
                    currentFocus = 13;
                    updateFocus();
                } else if (isIptvMode) {
                    toggleIptvView(false);
                } else {
                    log('Requesting App Exit...');
                    if (window.close) window.close();
                }
                break;
        }
    }

    function updateFocus() {
        var focusables = document.querySelectorAll('.focusable');
        focusables.forEach(function(c) { c.blur(); });
        
        var selector = '[tabindex="' + currentFocus + '"]';
        var target = document.querySelector(selector);
        
        if (target) {
            target.focus();
            if (target.classList.contains('iptv-card')) {
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    function flashCard() {
        var target = document.querySelector('[tabindex="' + currentFocus + '"]');
        if (target) {
            target.style.borderColor = '#ffffff';
            setTimeout(function() { target.style.borderColor = ''; }, 200);
        }
    }

    function testToast() {
        log('Luna Request: notification/createToast');
        if (window.webOS && webOS.service) {
            webOS.service.request("luna://com.webos.notification", {
                method: "createToast",
                parameters: { 
                    "message": "Luna Bus Connection Active! Hello Amaro!",
                    "noClick": true 
                },
                onSuccess: function(res) { log('Toast SUCCESS'); },
                onFailure: function(err) { log('Toast ERROR: ' + err.errorText); }
            });
        } else {
            alert('Toast Test: Luna Bus not available in this environment');
        }
    }

    // Init loop
    window.onload = function() {
        log('--- SYSTEM INITIALIZED ---');
        
        const launchBtn = document.getElementById('btn-iptv-launch');
        if (launchBtn) {
            launchBtn.addEventListener('click', function() { toggleIptvView(!isIptvMode); });
        }
        
        const configBtn = document.getElementById('btn-iptv-config');
        if (configBtn) {
            configBtn.addEventListener('click', function() {
                document.getElementById('modal-list').style.display = 'flex';
                document.getElementById('iptv-url-input').focus();
            });
        }

        const saveBtn = document.getElementById('btn-save-list');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const url = document.getElementById('iptv-url-input').value;
                if (url) loadIptvList(url);
                document.getElementById('modal-list').style.display = 'none';
                currentFocus = 10;
                updateFocus();
            });
        }

        const closeBtn = document.getElementById('btn-close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                document.getElementById('modal-list').style.display = 'none';
                currentFocus = 13;
                updateFocus();
            });
        }

        // Carregar lista salva
        const savedUrl = localStorage.getItem('iptv_url');
        if (savedUrl) {
            document.getElementById('iptv-url-input').value = savedUrl;
            loadIptvList(savedUrl);
        }

        updateFocus();
        fetchAllTelemetry();
        
        // Loop de atualização rápida do relógio (opcional)
        setInterval(function() {
            var now = new Date();
            var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            document.getElementById('val-clock').innerText = timeStr;
        }, 10000);

        window.addEventListener('keydown', handleKeyDown);
    };

})();
