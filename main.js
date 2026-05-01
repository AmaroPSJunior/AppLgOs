(function() {
    'use strict';

    var currentFocus = 1;
    var totalCards = 4;

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
        
        switch(e.keyCode) {
            case 37: // Seta Esquerda
                if (currentFocus > 1) currentFocus--;
                updateFocus();
                break;
            case 39: // Seta Direita
                if (currentFocus < totalCards) currentFocus++;
                updateFocus();
                break;
            case 38: // Seta Cima
                if (currentFocus > 2) currentFocus -= 2;
                updateFocus();
                break;
            case 40: // Seta Baixo
                if (currentFocus <= 2) currentFocus += 2;
                updateFocus();
                break;
            case 13: // OK / Enter
                log('Action: Execute card command ' + currentFocus);
                flashCard();
                if (currentFocus === 4) {
                    testToast();
                }
                break;
            case 403: // Botão Vermelho
                fetchAllTelemetry();
                break;
            case 404: // Botão Verde
                document.getElementById('luna-console').innerHTML = '';
                log('Log cleared.');
                break;
            case 461: // Botão BACK (webOS)
            case 27:  // ESC
                log('Requesting App Exit...');
                if (window.close) window.close();
                break;
        }
    }

    function updateFocus() {
        var cards = document.querySelectorAll('.info-card');
        cards.forEach(function(c) { c.blur(); });
        
        var target = document.querySelector('.info-card[tabindex="' + currentFocus + '"]');
        if (target) {
            target.focus();
        }
    }

    function flashCard() {
        var target = document.querySelector('.info-card[tabindex="' + currentFocus + '"]');
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
