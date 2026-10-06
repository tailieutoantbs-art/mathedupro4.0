const fs = require('fs');
const path = require('path');

const portalPath = path.join(__dirname, '..', 'js', 'portal.js');
let portalContent = fs.readFileSync(portalPath, 'utf8');

// Replace top drawer management in portal.js
const targetSnippet = `let practiceMenuLoaded = false;
let activeDrawerTab = 'exams';
let selectedInfographicGrade = '12';

function togglePracticeMenu(e) {
    if (e) e.stopPropagation();
    const drawer = document.getElementById('practice-drawer');
    const overlay = document.getElementById('practice-drawer-overlay');
    
    if (drawer.classList.contains('-translate-x-full')) {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        if (activeDrawerTab === 'exams' && !practiceMenuLoaded) loadPracticeExams();
        if (activeDrawerTab === 'infographics') loadInfographicsDrawer(selectedInfographicGrade);
    } else {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

function switchDrawerTab(tab) {
    activeDrawerTab = tab;
    let btnExams = document.getElementById('drawer-tab-exams');
    let btnInfographics = document.getElementById('drawer-tab-infographics');
    let contentExams = document.getElementById('practice-drawer-content');
    let contentInfographics = document.getElementById('infographics-drawer-content');

    if (tab === 'exams') {
        btnExams.className = 'px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-xs';
        btnInfographics.className = 'px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50';
        contentExams.classList.remove('hidden');
        contentInfographics.classList.add('hidden');
        if (!practiceMenuLoaded) loadPracticeExams();
    } else {
        btnInfographics.className = 'px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-xs';
        btnExams.className = 'px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50';
        contentExams.classList.add('hidden');
        contentInfographics.classList.remove('hidden');
        loadInfographicsDrawer(selectedInfographicGrade);
    }
}`;

const newDrawerManagement = `let practiceMenuLoaded = false;
let gamesMenuLoaded = false;
let activeDrawerTab = 'exams';
let selectedInfographicGrade = '12';
let currentGamesFilterMode = 'ALL';
let currentGamesSearchQuery = '';
let cachedGamesList = [];

function togglePracticeMenu(e) {
    if (e) e.stopPropagation();
    const drawer = document.getElementById('practice-drawer');
    const overlay = document.getElementById('practice-drawer-overlay');
    
    if (drawer.classList.contains('-translate-x-full')) {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        if (activeDrawerTab === 'exams' && !practiceMenuLoaded) loadPracticeExams();
        if (activeDrawerTab === 'games' && !gamesMenuLoaded) loadGamesDrawer();
        if (activeDrawerTab === 'infographics') loadInfographicsDrawer(selectedInfographicGrade);
    } else {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

function switchDrawerTab(tab) {
    activeDrawerTab = tab;
    let btnExams = document.getElementById('drawer-tab-exams');
    let btnGames = document.getElementById('drawer-tab-games');
    let btnInfographics = document.getElementById('drawer-tab-infographics');
    let contentExams = document.getElementById('practice-drawer-content');
    let contentGames = document.getElementById('games-drawer-content');
    let contentInfographics = document.getElementById('infographics-drawer-content');

    const defaultBtnClass = 'px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 shrink-0';
    const activeExamClass = 'px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-xs shrink-0';
    const activeGamesClass = 'px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shrink-0';
    const activeInfoClass = 'px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-xs shrink-0';

    if (btnExams) btnExams.className = (tab === 'exams') ? activeExamClass : defaultBtnClass;
    if (btnGames) btnGames.className = (tab === 'games') ? activeGamesClass : defaultBtnClass;
    if (btnInfographics) btnInfographics.className = (tab === 'infographics') ? activeInfoClass : defaultBtnClass;

    if (contentExams) contentExams.classList.toggle('hidden', tab !== 'exams');
    if (contentGames) contentGames.classList.toggle('hidden', tab !== 'games');
    if (contentInfographics) contentInfographics.classList.toggle('hidden', tab !== 'infographics');

    if (tab === 'exams' && !practiceMenuLoaded) loadPracticeExams();
    if (tab === 'games' && !gamesMenuLoaded) loadGamesDrawer();
    if (tab === 'infographics') loadInfographicsDrawer(selectedInfographicGrade);
}`;

// Normalize line endings for replacement
const normalize = str => str.replace(/\\r\\n/g, '\\n');

if (normalize(portalContent).includes(normalize(targetSnippet))) {
    // Replace with CRLF preserving
    portalContent = normalize(portalContent).replace(normalize(targetSnippet), newDrawerManagement);
    console.log('Replaced drawer tab switcher in portal.js');
} else {
    console.log('targetSnippet not directly matched, trying regex replacement...');
    const regex = /let practiceMenuLoaded = false;[\s\S]*?function switchDrawerTab\(tab\) \{[\s\S]*?loadInfographicsDrawer\(selectedInfographicGrade\);[\s\S]*?\}/;
    if (regex.test(portalContent)) {
        portalContent = portalContent.replace(regex, newDrawerManagement);
        console.log('Replaced drawer tab switcher using regex in portal.js');
    } else {
        console.error('Failed to locate drawer switcher in portal.js');
    }
}

// Now let's append the loadGamesDrawer implementation
const gamesDrawerImplementation = `
// ==========================================================================
// 🎮 DEDICATED MATH GAMES ARENA DRAWER ENGINE (MENU HAMBURGER)
// ==========================================================================
async function loadGamesDrawer(filterMode = null, searchQuery = null) {
    if (filterMode !== null) currentGamesFilterMode = filterMode;
    if (searchQuery !== null) currentGamesSearchQuery = searchQuery.trim().toLowerCase();
    
    let container = document.getElementById('games-drawer-content');
    if (!container) return;

    // Show loading skeleton if first time
    if (!cachedGamesList.length && !gamesMenuLoaded) {
        container.innerHTML = \`
            <div class="text-center text-amber-400 py-12">
                <i class="fa-solid fa-gamepad fa-bounce text-4xl mb-3"></i>
                <div class="font-black text-sm uppercase tracking-wider text-white">Đang tải Đấu Trường Games...</div>
                <p class="text-xs text-indigo-300 mt-1">Đồng bộ kho trò chơi toán học TBS</p>
            </div>
        \`;
    }

    try {
        let games = [];
        
        // 1. Fetch from Firestore GamesHistory collection
        if (window.db) {
            try {
                let snap = await db.collection("GamesHistory").orderBy('createdAt', 'desc').limit(50).get();
                snap.forEach(doc => {
                    let d = doc.data();
                    d.isGame = true;
                    games.push(d);
                });
            } catch(e) {}

            // 2. Also fetch games tagged in AdminHistory
            try {
                let snapAdmin = await db.collection("AdminHistory").orderBy('createdAt', 'desc').limit(60).get();
                snapAdmin.forEach(doc => {
                    let d = doc.data();
                    if (d.type === 'game' || d.isGame || (d.gameMode && d.gameMode.startsWith('game_'))) {
                        d.isGame = true;
                        games.push(d);
                    }
                });
            } catch(e) {}

            // 3. Fetch from GameData/GamesHistory doc
            try {
                let d = await db.collection("GameData").doc("GamesHistory").get();
                if (d.exists && d.data().list) {
                    games.push(...d.data().list);
                }
            } catch(e) {}
        }

        // 4. LocalStorage custom games fallback
        try {
            let localGames = JSON.parse(localStorage.getItem('tbs_saved_games') || '[]');
            games.push(...localGames);
        } catch(e) {}

        // 5. Built-in default games if list is small or empty
        const defaultSampleGames = [
            {
                code: 'TRIEUPHU12',
                name: 'Đấu Trường Ai Là Triệu Phú: Khảo Sát Hàm Số',
                folder: 'Lớp 12',
                gameMode: 'game_millionaire',
                author: 'Thầy Hùng TBS',
                date: 'Hôm nay',
                questionCount: 15,
                isGame: true,
                badge: '15 Mốc Thưởng',
                desc: 'Chinh phục 150 Triệu đồng với 4 quyền trợ giúp AI'
            },
            {
                code: 'SPEEDRUN60S',
                name: 'Đua Tốc Độ 60s: Đạo Hàm & Nguyên Hàm Siêu Tốc',
                folder: 'Lớp 12',
                gameMode: 'game_speed_run',
                author: 'Thầy Hùng TBS',
                date: 'Hôm nay',
                questionCount: 30,
                isGame: true,
                badge: 'Time Attack 60s',
                desc: 'Đếm ngược 60s, đúng +3s & nhân Combo x3'
            },
            {
                code: 'BOSSRUSH3HP',
                name: 'Vượt Ải Diệt Boss: Đại Chiến Tọa Độ Oxyz',
                folder: 'Lớp 12',
                gameMode: 'game_boss_rush',
                author: 'Thầy Hùng TBS',
                date: 'Hôm nay',
                questionCount: 25,
                isGame: true,
                badge: 'Thử Thách 3 HP',
                desc: '3 Mạng trái tim, hạ gục 3 Tầng Boss Toán học'
            },
            {
                code: 'MEMORYCARDS',
                name: 'Lật Thẻ Trí Nhớ: Bảng Công Thức Hình Không Gian',
                folder: 'Lớp 11-12',
                gameMode: 'game_card_flip',
                author: 'Thầy Hùng TBS',
                date: 'Hôm nay',
                questionCount: 20,
                isGame: true,
                badge: '3D Memory Flip',
                desc: 'Lưới 3D ghép đôi Đề bài & Đáp án công thức'
            }
        ];

        // Deduplicate games by code
        let uniqueGames = [];
        let seenCodes = new Set();
        [...games, ...defaultSampleGames].forEach(g => {
            if (g && g.code && !seenCodes.has(g.code)) {
                seenCodes.add(g.code);
                uniqueGames.push(g);
            }
        });

        cachedGamesList = uniqueGames;
        gamesMenuLoaded = true;

        // Filtering
        let displayList = cachedGamesList.filter(g => {
            if (currentGamesFilterMode !== 'ALL') {
                let gMode = g.gameMode || '';
                if (currentGamesFilterMode === 'millionaire' && !gMode.includes('millionaire')) return false;
                if (currentGamesFilterMode === 'speed_run' && !gMode.includes('speed')) return false;
                if (currentGamesFilterMode === 'boss_rush' && !gMode.includes('boss')) return false;
                if (currentGamesFilterMode === 'card_flip' && !gMode.includes('card')) return false;
            }
            if (currentGamesSearchQuery) {
                let matchName = (g.name || '').toLowerCase().includes(currentGamesSearchQuery);
                let matchCode = (g.code || '').toLowerCase().includes(currentGamesSearchQuery);
                let matchFolder = (g.folder || '').toLowerCase().includes(currentGamesSearchQuery);
                if (!matchName && !matchCode && !matchFolder) return false;
            }
            return true;
        });

        // Quick Arena Launchers Banner
        let quickLauncherHtml = \`
            <div class="p-3.5 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 rounded-2xl border border-amber-400/40 shadow-lg mb-3.5">
                <div class="flex items-center justify-between mb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-sm">⚡</span>
                        <div>
                            <h4 class="font-black text-amber-300 text-xs uppercase tracking-wider leading-tight">Đấu Trường Chơi Nhanh</h4>
                            <p class="text-[10px] text-slate-300">Chọn 1 trong 4 hình thức trò chơi toán học:</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <button onclick="launchQuickGame('millionaire')" class="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-amber-400/40 hover:border-amber-400 transition text-left group">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">🏆</span>
                            <b class="text-[11px] text-amber-300 font-black group-hover:text-amber-200">Triệu Phú</b>
                        </div>
                        <span class="text-[9px] text-slate-400 block truncate">15 Mốc & 4 Trợ giúp</span>
                    </button>

                    <button onclick="launchQuickGame('speed_run')" class="p-2.5 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 border border-rose-400/40 hover:border-rose-400 transition text-left group">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="w-6 h-6 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center shadow-xs">⚡</span>
                            <b class="text-[11px] text-rose-300 font-black group-hover:text-rose-200">Đua Tốc Độ</b>
                        </div>
                        <span class="text-[9px] text-slate-400 block truncate">60s & Combo x3</span>
                    </button>

                    <button onclick="launchQuickGame('boss_rush')" class="p-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 border border-purple-400/40 hover:border-purple-400 transition text-left group">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="w-6 h-6 rounded-lg bg-purple-500 text-white font-black text-xs flex items-center justify-center shadow-xs">⚔️</span>
                            <b class="text-[11px] text-purple-300 font-black group-hover:text-purple-200">Diệt Boss</b>
                        </div>
                        <span class="text-[9px] text-slate-400 block truncate">3 HP & 3 Ải RPG</span>
                    </button>

                    <button onclick="launchQuickGame('card_flip')" class="p-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 border border-emerald-400/40 hover:border-emerald-400 transition text-left group">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="w-6 h-6 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">🃏</span>
                            <b class="text-[11px] text-emerald-300 font-black group-hover:text-emerald-200">Lật Thẻ 3D</b>
                        </div>
                        <span class="text-[9px] text-slate-400 block truncate">Ghép Đề & Công Thức</span>
                    </button>
                </div>
            </div>
        \`;

        // Filter Pills
        const filterModes = [
            { id: 'ALL', label: 'Tất cả', icon: 'fa-cubes' },
            { id: 'millionaire', label: 'Triệu Phú', icon: 'fa-trophy', color: 'text-amber-400' },
            { id: 'speed_run', label: 'Tốc Độ', icon: 'fa-bolt', color: 'text-rose-400' },
            { id: 'boss_rush', label: 'Diệt Boss', icon: 'fa-dragon', color: 'text-purple-400' },
            { id: 'card_flip', label: 'Lật Thẻ', icon: 'fa-brain', color: 'text-emerald-400' }
        ];

        let filterPillsHtml = \`
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5">
                \${filterModes.map(f => {
                    let isSel = (currentGamesFilterMode === f.id);
                    return \`
                        <button onclick="loadGamesDrawer('\${f.id}', null); playSound('click');" class="px-2.5 py-1 rounded-xl text-[11px] font-black transition flex items-center gap-1 shrink-0 \${isSel ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}">
                            <i class="fa-solid \${f.icon} \${f.color || ''}"></i>
                            <span>\${f.label}</span>
                        </button>
                    \`;
                }).join('')}
            </div>
        \`;

        // Search Bar
        let searchBarHtml = \`
            <div class="relative mb-3">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                <input type="text" value="\${currentGamesSearchQuery}" oninput="loadGamesDrawer(null, this.value)" placeholder="Tìm kiếm game, lớp, chủ đề..." class="w-full pl-8 pr-3 py-2 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-xs font-bold outline-none focus:border-amber-400 placeholder-slate-400">
                \${currentGamesSearchQuery ? \`<button onclick="loadGamesDrawer(null, '');" class="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"><i class="fa-solid fa-xmark"></i></button>\` : ''}
            </div>
        \`;

        // Game Cards List
        let gamesListHtml = '';
        if (displayList.length === 0) {
            gamesListHtml = \`
                <div class="text-center text-slate-400 py-10 bg-slate-800/40 rounded-2xl border border-slate-800">
                    <i class="fa-solid fa-ghost text-4xl mb-2 text-slate-600"></i>
                    <div class="font-bold text-xs text-slate-400">Không tìm thấy trò chơi phù hợp.</div>
                </div>
            \`;
        } else {
            gamesListHtml = displayList.map(g => {
                let mode = g.gameMode || 'game_millionaire';
                let modeCfg = {
                    title: 'Đấu Trường Games',
                    icon: '🎮',
                    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
                    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/20',
                    actionBtnBg: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950',
                    targetMode: 'millionaire'
                };

                if (mode.includes('millionaire')) {
                    modeCfg = {
                        title: 'Ai Là Triệu Phú',
                        icon: '🏆',
                        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                        borderHover: 'hover:border-amber-400 hover:shadow-amber-500/20',
                        actionBtnBg: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950',
                        targetMode: 'millionaire'
                    };
                } else if (mode.includes('speed')) {
                    modeCfg = {
                        title: 'Đua Tốc Độ 60s',
                        icon: '⚡',
                        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
                        borderHover: 'hover:border-rose-400 hover:shadow-rose-500/20',
                        actionBtnBg: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white',
                        targetMode: 'speedrun'
                    };
                } else if (mode.includes('boss')) {
                    modeCfg = {
                        title: 'Diệt Boss 3 HP',
                        icon: '⚔️',
                        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
                        borderHover: 'hover:border-purple-400 hover:shadow-purple-500/20',
                        actionBtnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
                        targetMode: 'bossrush'
                    };
                } else if (mode.includes('card')) {
                    modeCfg = {
                        title: 'Lật Thẻ Trí Nhớ',
                        icon: '🃏',
                        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                        borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/20',
                        actionBtnBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950',
                        targetMode: 'cardflip'
                    };
                }

                return \`
                    <div class="p-3.5 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border-2 border-slate-700/80 \${modeCfg.borderHover} transition-all duration-300 shadow-md group relative overflow-hidden flex flex-col justify-between gap-3">
                        <div>
                            <div class="flex items-start justify-between gap-2 mb-1.5">
                                <div class="flex items-center gap-2">
                                    <span class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-base shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                                        \${modeCfg.icon}
                                    </span>
                                    <div>
                                        <div class="font-black text-white text-xs leading-snug group-hover:text-amber-300 transition-colors">\${g.name || 'Game Toán Học'}</div>
                                        <div class="flex items-center gap-1.5 mt-0.5">
                                            <span class="text-[9px] font-black uppercase px-2 py-0.2 rounded-md border \${modeCfg.badgeBg}">\${modeCfg.title}</span>
                                            <span class="text-[9px] font-bold text-slate-400">\${g.folder || 'Chung'}</span>
                                        </div>
                                    </div>
                                </div>
                                <span class="font-mono font-black text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2 py-0.5 rounded-lg text-[10px] tracking-wider shrink-0 shadow-2xs">
                                    \${g.code}
                                </span>
                            </div>

                            \${g.desc ? \`<p class="text-[10px] text-slate-400 line-clamp-2 mt-1">\${g.desc}</p>\` : ''}
                        </div>

                        <div class="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[10px]">
                            <div class="text-slate-400 flex items-center gap-2">
                                <span><i class="fa-solid fa-list-ol text-amber-400 mr-1"></i>\${g.questionCount || 15} câu</span>
                                <span>•</span>
                                <span>\${g.date || 'Gần đây'}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="copyGameCode('\${g.code}'); playSound('click');" class="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition shadow-2xs" title="Sao chép mã game">
                                    <i class="fa-solid fa-copy text-xs"></i>
                                </button>
                                <a href="student.html?code=\${g.code}&game=\${modeCfg.targetMode}" onclick="playSound('click');" class="px-3 py-1.5 \${modeCfg.actionBtnBg} font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition hover:scale-105 active:scale-95 flex items-center gap-1 btn-3d">
                                    <span>CHIẾN NGAY</span> <i class="fa-solid fa-play text-[10px]"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        container.innerHTML = \`
            \${quickLauncherHtml}
            \${searchBarHtml}
            \${filterPillsHtml}
            <div class="space-y-2.5">
                \${gamesListHtml}
            </div>
        \`;

    } catch (err) {
        console.error("Error loading games drawer:", err);
        container.innerHTML = \`
            <div class="text-center text-rose-400 py-10">
                <i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                <div class="font-bold text-xs">Lỗi tải danh mục game.</div>
            </div>
        \`;
    }
}

function launchQuickGame(gameMode) {
    playSound('powerup');
    // Find latest available code or use preset
    let targetCode = 'TRIEUPHU12';
    if (gameMode === 'speed_run') targetCode = 'SPEEDRUN60S';
    if (gameMode === 'boss_rush') targetCode = 'BOSSRUSH3HP';
    if (gameMode === 'card_flip') targetCode = 'MEMORYCARDS';

    if (cachedGamesList.length > 0) {
        let matched = cachedGamesList.find(g => (g.gameMode || '').includes(gameMode));
        if (matched && matched.code) targetCode = matched.code;
    }
    
    let targetSubMode = gameMode === 'speed_run' ? 'speedrun' : (gameMode === 'boss_rush' ? 'bossrush' : (gameMode === 'card_flip' ? 'cardflip' : 'millionaire'));
    window.location.href = \`student.html?code=\${targetCode}&game=\${targetSubMode}\`;
}

function copyGameCode(code) {
    if (!code) return;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast("📋 Đã sao chép mã Game: " + code + "! Bạn có thể chia sẻ cho học sinh.");
        });
    } else {
        showToast("Mã Game: " + code);
    }
}
window.loadGamesDrawer = loadGamesDrawer;
window.launchQuickGame = launchQuickGame;
window.copyGameCode = copyGameCode;
`;

// Filter out games from loadPracticeExams
const oldPracticeExamsCode = `        let uniqueHist = [];
        let seen = new Set();
        for (let h of hist) {
            if (!seen.has(h.code)) {
                seen.add(h.code);
                uniqueHist.push(h);
            }
        }`;

const newPracticeExamsCode = `        let uniqueHist = [];
        let seen = new Set();
        for (let h of hist) {
            // Filter out pure games from standard exams list
            if (h.type === 'game' || h.isGame) continue;
            if (!seen.has(h.code)) {
                seen.add(h.code);
                uniqueHist.push(h);
            }
        }`;

if (portalContent.includes(oldPracticeExamsCode)) {
    portalContent = portalContent.replace(oldPracticeExamsCode, newPracticeExamsCode);
    console.log('Filtered games out of practice exams list in portal.js');
}

portalContent += gamesDrawerImplementation;
fs.writeFileSync(portalPath, portalContent, 'utf8');
console.log('Successfully updated js/portal.js with Games drawer engine!');
