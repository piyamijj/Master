<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Piyami LifeOS</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#000000">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <style>
        :root {
            --bg-color: #000000;
            --card-bg: #111;
            --text-color: #f5f5f5;
            --active-color: #ff003c;
            --alive-color: #00ff41;
            --accent-color: #0a84ff;
            --border-color: #333;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { background-color: var(--bg-color); color: var(--text-color); font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; flex-direction: column; height: 100dvh; overflow: hidden; }

        /* RTL DESTEĞİ */
        body.rtl { direction: rtl; }
        body.rtl .sidebar { left: auto; right: -260px; border-right: none; border-left: 1px solid var(--active-color); }
        body.rtl .sidebar.open { right: 0; }
        body.rtl .chat-bubble { border-radius: 18px 18px 0 18px; text-align: right; border-left: none; border-right: 3px solid var(--alive-color); }
        body.rtl .chat-bubble.user { border-radius: 18px 18px 18px 0; text-align: right; border-right: none; border-left: 3px solid var(--active-color); }
        body.rtl input { text-align: right; }
        body.rtl .status-area { text-align: left; }
        body.rtl #lessonDropdown { left: auto; right: 80px; }

        /* HEADER */
        header { padding: 10px 15px; background: rgba(17,17,17,0.95); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; height: 60px; flex-shrink: 0; z-index: 100; backdrop-filter: blur(5px); }
        .controls { display: flex; gap: 8px; }
        .btn-small { background: #222; border: 1px solid #444; color: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
        .status-area { text-align: right; line-height: 1.3; }
        #greetingText { font-size: 0.85rem; color: var(--alive-color); font-weight: 600; }
        
        /* LIVE BADGE */
        .live-badge { font-size: 0.7rem; color: #888; display: flex; align-items: center; gap: 5px; cursor: pointer; }
        .dot { width: 8px; height: 8px; background-color: #555; border-radius: 50%; display: inline-block; }
        .live-badge.active .dot { background-color: var(--alive-color); box-shadow: 0 0 6px var(--alive-color); animation: blink 2s infinite; }
        .live-badge.active { color: #ccc; }
        @keyframes blink { 50% { opacity: 0.5; } }

        /* DASHBOARD */
        #dashboard { padding: 15px; flex-shrink: 0; border-bottom: 1px solid #222; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; max-height: 60vh; }
        
        /* HABER BANDI */
        .news-ticker { background: var(--active-color); color: #fff; padding: 8px 0; overflow: hidden; white-space: nowrap; font-size: 0.85rem; font-weight: bold; border-radius: 8px; }
        .marquee-content { display: inline-block; padding-left: 100%; animation: scroll-ltr 25s linear infinite; }
        body.rtl .marquee-content { animation: scroll-rtl 20s linear infinite; }
        @keyframes scroll-ltr { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
        @keyframes scroll-rtl { 0% { transform: translate(0, 0); } 100% { transform: translate(100%, 0); } }

        /* KARTLAR */
        .weather-card { background: var(--card-bg); border: 1px solid #222; border-radius: 15px; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .wc-temp { font-size: 2.5rem; font-weight: bold; margin: 0; }
        .wc-desc { font-size: 0.8rem; color: #aaa; }
        
        .grid-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .mini-card { background: var(--card-bg); border: 1px solid #222; border-radius: 15px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; height: 110px;}
        .mc-title { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .mc-value { font-size: 1.5rem; font-weight: 700; margin: 5px 0; }
        .mc-btn { background: #333; border: none; color: #fff; padding: 6px; border-radius: 8px; font-size: 0.75rem; cursor: pointer; width: 100%; margin-top: auto; }
        .mc-btn.active { background: var(--active-color); animation: pulse 1s infinite; }

        /* HESAP MAKİNESİ KARTI */
        .calc-card { background: var(--card-bg); border: 1px solid #222; border-radius: 15px; padding: 15px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
        .calc-card:active { background: #222; }
        .cc-icon { font-size: 1.8rem; }
        .cc-text { font-weight: bold; color: var(--alive-color); }

        /* HESAP MAKİNESİ MODAL (FULL EKRAN) */
        #calculatorModal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 3000;
            display: none; flex-direction: column; padding: 20px;
        }
        .calc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;}
        .calc-display { 
            background: #111; color: #fff; font-size: 2.5rem; text-align: right; padding: 20px; border-radius: 15px; 
            margin-bottom: 20px; word-wrap: break-word; border: 1px solid #333;
        }
        .calc-history { font-size: 0.9rem; color: #666; text-align: right; height: 60px; overflow-y: auto; margin-bottom: 10px; }
        .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; flex: 1; }
        .calc-btn { 
            background: #222; border: none; color: #fff; font-size: 1.2rem; border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .calc-btn:active { background: #444; }
        .calc-btn.op { background: #ff9500; color: #000; font-weight: bold; }
        .calc-btn.fn { background: #333; color: var(--alive-color); font-size: 1rem; display: none; } /* Gelişmiş modda görünür */
        .calc-btn.wide { grid-column: span 2; border-radius: 30px; }
        .advanced-mode .calc-btn.fn { display: flex; } /* Gelişmiş mod CSS */
        .advanced-mode .calc-grid { grid-template-columns: repeat(5, 1fr); } 

        /* SOHBET */
        #main-container { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px; }
        .chat-bubble { background: var(--bubble-bot); padding: 12px 16px; border-radius: 16px; max-width: 88%; line-height: 1.5; font-size: 0.95rem; border-left: 3px solid var(--alive-color); }
        .chat-bubble.user { align-self: flex-end; background: var(--bubble-user); color: #fff; border-left: none; border-right: 3px solid var(--active-color); }

        /* GİRİŞ */
        .input-area { background: var(--bg-color); padding: 10px 15px; border-top: 1px solid var(--border-color); display: flex; gap: 10px; align-items: center; padding-bottom: max(15px, env(safe-area-inset-bottom)); }
        input { flex: 1; padding: 12px 15px; border-radius: 25px; border: 1px solid #333; background: #111; color: #fff; font-size: 1rem; outline: none; }
        input:focus { border-color: var(--alive-color); }
        .icon-btn { width: 42px; height: 42px; border-radius: 50%; border: none; background: #222; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; }
        .send-btn { background: var(--alive-color); color: #000; }
        .listening { background: var(--active-color) !important; animation: pulse 1.5s infinite; }

        /* MENÜLER */
        .sidebar { position: fixed; top: 0; left: -260px; width: 260px; height: 100%; background: #151515; border-right: 1px solid var(--active-color); transition: 0.3s; z-index: 2000; display: flex; flex-direction: column; }
        .sidebar.open { left: 0; }
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1500; display: none; }
        .menu-dropdown { position: absolute; top: 60px; left: 60px; background: #222; border: 1px solid var(--active-color); border-radius: 10px; display: none; flex-direction: column; z-index: 1100; width: 200px; }
        .menu-item { padding: 12px; border-bottom: 1px solid #333; cursor: pointer; display: flex; gap: 10px; }
        
        video, canvas { display: none; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    </style>
</head>
<body>

    <div id="calculatorModal">
        <div class="calc-header">
            <button class="btn-small" onclick="toggleCalcMode()">Gelişmiş / پیشرفته</button>
            <span style="color:white; font-weight:bold;">Hesap Makinesi</span>
            <button class="btn-small" style="color:red" onclick="closeCalculator()">✕</button>
        </div>
        <div class="calc-history" id="calcHistory"></div>
        <div class="calc-display" id="calcDisplay">0</div>
        <div class="calc-grid" id="calcGrid">
            </div>
    </div>

    <div class="sidebar" id="sidebar">
        <div style="padding:20px; color:var(--alive-color); font-weight:bold; border-bottom:1px solid #333;">LifeOS Menü</div>
        <div class="history-list" id="historyList"></div>
        <div style="margin-top:auto; padding:15px;">
            <button onclick="clearAllHistory()" style="width:100%; padding:10px; background:#333; color:var(--active-color); border:none; border-radius:8px;">🗑️ Sıfırla</button>
        </div>
    </div>
    <div class="overlay" id="overlay" onclick="closeAllMenus()"></div>

    <header>
        <div class="controls">
            <button class="btn-small" onclick="toggleMenu()">☰</button>
            <button class="btn-small" onclick="toggleLessons()">📚</button>
            <button class="btn-small" onclick="toggleLanguage()" id="langBtn">TR</button>
        </div>
        <div class="status-area">
            <div id="greetingText">...</div>
            <div id="locationBadge" class="live-badge" onclick="openMap()">
                <span class="dot"></span> <span id="locationText">...</span>
            </div>
        </div>
    </header>

    <div id="lessonDropdown" class="menu-dropdown">
        <div class="menu-item" onclick="startLearning('Almanca')">🇩🇪 Almanca</div>
        <div class="menu-item" onclick="startLearning('İngilizce')">🇬🇧 İngilizce</div>
        <div class="menu-item" onclick="startLearning('Farsça')">🇮🇷 Farsça</div>
    </div>

    <div id="dashboard">
        <div class="news-ticker" onclick="toggleNewsSource()">
            <span class="marquee-content" id="newsContent">Haberler yükleniyor...</span>
        </div>

        <div class="weather-card" onclick="openWeather()">
            <div>
                <h3 id="lblWeather">HAVA</h3>
                <div class="wc-temp" id="weatherTemp">--°</div>
                <div class="wc-desc" id="fullDateDisplay">...</div>
            </div>
            <div style="font-size:2.5rem" id="weatherIcon">☁️</div>
        </div>

        <div class="grid-cards">
            <div class="mini-card">
                <div class="mc-title" id="lblStep">ADIM</div>
                <div class="mc-value" id="stepCount">0</div>
                <button class="mc-btn" id="stepBtn" onclick="togglePedometer()">▶ Başlat</button>
            </div>
            <div class="mini-card">
                <div class="mc-title" id="lblPulse">NABIZ</div>
                <div class="mc-value" style="color:var(--active-color)" id="pulseRate">--</div>
                <button class="mc-btn" id="pulseBtn" onclick="toggleHeartRate()">❤ Ölç</button>
            </div>
        </div>

        <div class="calc-card" onclick="openCalculator()">
            <div class="cc-icon">🧮</div>
            <div class="cc-text" id="lblCalc">Hesap Makinesi</div>
            <div style="color:#666">➔</div>
        </div>
    </div>

    <div id="main-container"></div>

    <div class="input-area">
        <button class="icon-btn" id="micBtn" onclick="toggleVoice()">🎙️</button>
        <input type="text" id="userInput" placeholder="..." onkeypress="handleEnter(event)">
        <button class="icon-btn send-btn" onclick="sendMessage()">➤</button>
    </div>

    <video id="video" autoplay muted></video>

    <script>
        let currentLang = "tr";
        let sessions = {};
        let currentSessionId = null;
        let isPedometerRunning = false;
        let stepCount = 0;
        let isPulseRunning = false;
        let pulseStream = null;
        let userLocation = { lat: 0, long: 0, city: "" };
        let calcHistory = []; // Hesap makinesi hafızası
        
        const shamsiMonths = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];

        const t = {
            tr: {
                menu: "Konular", greet: ["Günaydın", "İyi Günler", "İyi Akşamlar"],
                locActive: "Konum Aktif", locOff: "Konum Kapalı",
                lblWeather: "HAVA", lblStep: "ADIM", lblPulse: "NABIZ", lblCalc: "Hesap Makinesi",
                btnStart: "▶ Başlat", btnStop: "⏹ Durdur", btnMeasure: "❤ Ölç",
                welcome: "Merhaba Piyami! Ben LifeOS. Her zaman yanındayım.",
                placeholder: "Buraya yazabilirsin...", newsLoading: "Haberler..."
            },
            fa: {
                menu: "موضوعات", greet: ["صبح بخیر", "روز بخیر", "عصر بخیر"],
                locActive: "موقعیت فعال", locOff: "موقعیت خاموش",
                lblWeather: "هوا", lblStep: "گام", lblPulse: "ضربان", lblCalc: "ماشین حساب",
                btnStart: "▶ شروع", btnStop: "⏹ توقف", btnMeasure: "❤ اندازه‌گیری",
                welcome: "سلام پیامی! من LifeOS هستم. همیشه با تو هستم.",
                placeholder: "پیام بنویسید...", newsLoading: "اخبار..."
            }
        };

        window.onload = function() {
            loadSessions();
            if(Object.keys(sessions).length === 0) startNewSession();
            else switchSession(Object.keys(sessions).sort().reverse()[0]);
            
            const savedSteps = localStorage.getItem('lifeOS_steps');
            if(savedSteps) stepCount = parseInt(savedSteps);
            document.getElementById("stepCount").innerText = stepCount;

            updateUI();
            getLocation();
            fetchNews();
            renderCalculator(); // Hesap makinesi tuşlarını çiz
        };

        // --- HESAP MAKİNESİ (YENİ MODÜL) ---
        let calcExp = "";
        let isAdvCalc = false;

        function openCalculator() {
            document.getElementById("calculatorModal").style.display = "flex";
        }
        function closeCalculator() {
            document.getElementById("calculatorModal").style.display = "none";
        }
        function toggleCalcMode() {
            isAdvCalc = !isAdvCalc;
            document.getElementById("calculatorModal").classList.toggle("advanced-mode");
            renderCalculator();
        }

        function renderCalculator() {
            const grid = document.getElementById("calcGrid");
            grid.innerHTML = "";
            
            // Tuş Düzeni
            const keys = isAdvCalc ? 
                ['C', 'DEL', '(', ')', 'sin', 'cos', 'tan', 'log', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'] :
                ['C', 'DEL', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];

            keys.forEach(key => {
                const btn = document.createElement("button");
                btn.className = "calc-btn";
                if(['/', '*', '-', '+', '='].includes(key)) btn.classList.add("op");
                if(['0'].includes(key) && !isAdvCalc) btn.classList.add("wide"); // 0 tuşu geniş olsun
                if(['sin', 'cos', 'tan', 'log', '(', ')'].includes(key)) btn.classList.add("fn");
                
                btn.innerText = key;
                btn.onclick = () => handleCalcInput(key);
                grid.appendChild(btn);
            });
        }

        function handleCalcInput(key) {
            const display = document.getElementById("calcDisplay");
            const historyDiv = document.getElementById("calcHistory");
            
            if(key === 'C') { calcExp = ""; }
            else if(key === 'DEL') { calcExp = calcExp.slice(0, -1); }
            else if(key === '=') {
                try {
                    // Güvenli hesaplama için basit replace
                    let evalStr = calcExp
                        .replace('sin', 'Math.sin')
                        .replace('cos', 'Math.cos')
                        .replace('tan', 'Math.tan')
                        .replace('log', 'Math.log10');
                    
                    const result = eval(evalStr); // Basit matematik için eval kullanılabilir (dikkatli olunmalı)
                    
                    // Hafızaya Ekle
                    const histItem = `${calcExp} = ${result}`;
                    calcHistory.push(histItem);
                    if(calcHistory.length > 5) calcHistory.shift(); // Son 5 işlem
                    
                    historyDiv.innerHTML = calcHistory.join("<br>");
                    calcExp = result.toString();
                } catch(e) {
                    calcExp = "Error";
                }
            } else {
                calcExp += key;
            }
            display.innerText = calcExp || "0";
        }

        // --- DİĞER FONKSİYONLAR (SABİT) ---
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    userLocation.lat = pos.coords.latitude;
                    userLocation.long = pos.coords.longitude;
                    try {
                        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLocation.lat}&longitude=${userLocation.long}&localityLanguage=${currentLang}`);
                        const data = await res.json();
                        userLocation.city = data.city || data.locality || "Konum";
                        document.getElementById("locationText").innerText = userLocation.city;
                    } catch(e) { document.getElementById("locationText").innerText = t[currentLang].locActive; }
                    document.getElementById("locationBadge").classList.add("active");
                    getWeather(userLocation.lat, userLocation.long);
                }, () => document.getElementById("locationText").innerText = t[currentLang].locOff);
            }
        }

        async function getWeather(lat, lon) {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                const data = await res.json();
                document.getElementById("weatherTemp").innerText = Math.round(data.current_weather.temperature) + "°C";
                const code = data.current_weather.weathercode;
                document.getElementById("weatherIcon").innerText = code < 3 ? "☀️" : (code > 50 ? "🌧️" : "☁️");
            } catch(e) {}
        }
        
        async function fetchNews() {
             const rssUrl = currentLang === 'tr' ? 'https://www.trthaber.com/sitene-ekle/rss-sondakika.xml' : 'https://ir.voanews.com/api/z-$qie$qqp';
             const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
             try {
                 const res = await fetch(apiUrl); const data = await res.json();
                 if(data.items) document.getElementById("newsContent").innerText = data.items.slice(0,5).map(i=>i.title).join("  •  ");
             } catch(e) { document.getElementById("newsContent").innerText = t[currentLang].newsLoading; }
        }
        function toggleNewsSource() { fetchNews(); }

        function updateUI() {
            const langData = t[currentLang];
            const body = document.body;
            if (currentLang === 'fa') body.classList.add('rtl'); else body.classList.remove('rtl');

            document.getElementById('langBtn').innerText = currentLang === 'tr' ? "TR" : "FA";
            document.getElementById('lblWeather').innerText = langData.lblWeather;
            document.getElementById('lblStep').innerText = langData.lblStep;
            document.getElementById('lblPulse').innerText = langData.lblPulse;
            document.getElementById('lblCalc').innerText = langData.lblCalc; // Yeni Etiket
            document.getElementById("stepBtn").innerText = isPedometerRunning ? langData.btnStop : langData.btnStart;
            document.getElementById("pulseBtn").innerText = isPulseRunning ? langData.btnStop : langData.btnMeasure;
            document.getElementById("userInput").placeholder = langData.placeholder;

            const now = new Date();
            const hour = now.getHours();
            const timeGreet = hour < 12 ? langData.greet[0] : (hour < 18 ? langData.greet[1] : langData.greet[2]);
            document.getElementById('greetingText').innerText = timeGreet + " Piyami";
            
            const miladi = now.toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long' });
            const shamsiFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' });
            document.getElementById('fullDateDisplay').innerText = `${miladi} (${shamsiFmt.format(now)})`;
            
            fetchNews();
        }

        function toggleLanguage() { currentLang = currentLang === "tr" ? "fa" : "tr"; closeAllMenus(); updateUI(); }
        function openMap() { if(userLocation.lat) window.open(`https://www.google.com/maps?q=${userLocation.lat},${userLocation.long}`, '_blank'); }
        function openWeather() { if(userLocation.lat) window.open(`https://www.accuweather.com/en/search-locations?query=${userLocation.lat},${userLocation.long}`, '_blank'); }
        
        function togglePedometer() {
            if (!isPedometerRunning) {
                if (typeof DeviceMotionEvent.requestPermission === 'function') {
                    DeviceMotionEvent.requestPermission().then(r => { if (r=='granted') startStep(); }).catch(console.error);
                } else startStep();
                isPedometerRunning = true;
            } else { window.removeEventListener('devicemotion', handleMotion); isPedometerRunning = false; }
            updateUI();
        }
        function startStep() { window.addEventListener('devicemotion', handleMotion); }
        let lastAcc = {x:0,y:0,z:0}; let lastStepTime = 0;
        function handleMotion(e) {
            const acc = e.accelerationIncludingGravity;
            const delta = Math.abs(acc.x+acc.y+acc.z - (lastAcc.x+lastAcc.y+lastAcc.z));
            if(delta > 11 && (Date.now() - lastStepTime > 300)) {
                stepCount++; document.getElementById("stepCount").innerText = stepCount;
                localStorage.setItem('lifeOS_steps', stepCount); lastStepTime = Date.now();
            }
            lastAcc = {x:acc.x,y:acc.y,z:acc.z};
        }
        async function toggleHeartRate() {
             if (!isPulseRunning) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                    document.getElementById("video").srcObject = stream; pulseStream = stream; isPulseRunning = true; simulatePulse();
                } catch(e) { alert("Kamera izni gerekli."); }
            } else { if(pulseStream) pulseStream.getTracks().forEach(t=>t.stop()); isPulseRunning = false; document.getElementById("pulseRate").innerText = "--"; }
            updateUI();
        }
        function simulatePulse() { if(!isPulseRunning) return; setTimeout(() => { if(isPulseRunning) { document.getElementById("pulseRate").innerText = Math.floor(Math.random()*(90-65)+65) + " ❤️"; simulatePulse(); } }, 2000); }

        function closeAllMenus() { document.getElementById("sidebar").classList.remove("open"); document.getElementById("overlay").style.display = "none"; document.getElementById("lessonDropdown").style.display = "none"; }
        function toggleMenu() { const s = document.getElementById("sidebar"); if(s.classList.contains("open")) closeAllMenus(); else { closeAllMenus(); s.classList.add("open"); document.getElementById("overlay").style.display = "block"; } }
        function toggleLessons() { const m = document.getElementById("lessonDropdown"); if(m.style.display==="flex") closeAllMenus(); else { closeAllMenus(); m.style.display="flex"; } }
        
        function startNewSession(type='general', refreshMenu=true) { currentSessionId = Date.now().toString(); sessions[currentSessionId] = { type: type, messages: [], title: "" }; document.getElementById("main-container").innerHTML = ""; addBubble(t[currentLang].welcome, 'bot'); if(refreshMenu) { closeAllMenus(); updateMenu(); } }
        function loadSessions() { const s = localStorage.getItem('lifeOS_sessions'); if(s) sessions = JSON.parse(s); }
        function saveSessions() { localStorage.setItem('lifeOS_sessions', JSON.stringify(sessions)); }
        function switchSession(id) { currentSessionId = id; document.getElementById("main-container").innerHTML = ""; sessions[id].forEach(m => addBubble(m.text, m.sender)); closeAllMenus(); }
        function clearAllHistory() { if(confirm("Sil?")) { localStorage.removeItem('lifeOS_sessions'); sessions={}; startNewSession(); } }
        function deleteSession(id, event) { event.stopPropagation(); if(confirm("Sil?")) { delete sessions[id]; saveSessions(); if(id === currentSessionId) startNewSession('general', false); } }
        function updateMenu() { const list = document.getElementById("historyList"); list.innerHTML = ""; Object.keys(sessions).sort().reverse().forEach(id => { const sess = sessions[id]; let title = sess.title || (sess.messages[0] ? sess.messages[0].text : "Sohbet"); if(title.length>20) title=title.substring(0,20)+"..."; const d = document.createElement("div"); d.className = `history-item ${id===currentSessionId?'active':''}`; d.innerHTML=`<span class="history-title" onclick="switchSession('${id}')">${title}</span><button class="del-btn" onclick="deleteSession('${id}', event)">🗑️</button>`; list.appendChild(d); }); }

        async function sendMessage() {
            const input = document.getElementById("userInput"); const text = input.value.trim(); if (!text) return;
            addBubble(text, 'user');
            if(!sessions[currentSessionId]) sessions[currentSessionId] = { type: 'general', messages: [] };
            sessions[currentSessionId].messages.push({sender:'user', text:text}); saveSessions();
            input.value = "";
            const loading = addBubble("...", 'bot');
            try {
                const context = `Dil:${currentLang}, Tarih:${new Date().toLocaleString()}, Konum:${userLocation.city}`;
                const res = await fetch("/ask", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ question: text, context: context, history: sessions[currentSessionId].messages }) });
                const data = await res.json();
                loading.remove();
                addBubble(data.answer, 'bot');
                sessions[currentSessionId].messages.push({sender:'model', text:data.answer}); saveSessions();
            } catch(e) { loading.remove(); addBubble("Hata", 'bot'); }
        }
        function addBubble(text, sender) { const c = document.getElementById("main-container"); const b = document.createElement("div"); b.className = `chat-bubble ${sender}`; b.innerHTML = text.replace(/\n/g, "<br>"); c.appendChild(b); c.scrollTo(0, c.scrollHeight); return b; }
        function handleEnter(e) { if(e.key==='Enter') sendMessage(); }
        function toggleVoice() { const r = new (window.SpeechRecognition||window.webkitSpeechRecognition)(); r.lang = currentLang==='tr'?'tr-TR':'fa-IR'; r.start(); document.getElementById("micBtn").classList.add("listening"); r.onresult=(e)=>{document.getElementById("userInput").value=e.results[0][0].transcript; sendMessage(); document.getElementById("micBtn").classList.remove("listening");}; }
        function startLearning(l) { closeAllMenus(); startNewSession(); sendMessage(); }
    </script>
</body>
</html>
