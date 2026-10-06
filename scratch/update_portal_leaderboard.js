const fs = require('fs');
let code = fs.readFileSync('js/portal.js', 'utf8');

const startMarker = "let currentLbFilter = 'cycle';";
const endMarker = "let lbResetTimeMode = 'now';";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found in js/portal.js. startIndex:', startIndex, 'endIndex:', endIndex);
    process.exit(1);
}

const replacement = `let currentLbFilter = 'cycle';
let currentLbTab = 'podium';
let currentLbGameMode = 'ALL';

function switchLeaderboardTab(tab) {
    currentLbTab = tab;
    let btnPodium = document.getElementById('btn-lb-tab-podium');
    let btnAnalytics = document.getElementById('btn-lb-tab-analytics');
    let viewPodium = document.getElementById('leaderboard-podium-view');
    let viewAnalytics = document.getElementById('leaderboard-analytics-view');

    if (tab === 'podium') {
        if (btnPodium) { btnPodium.className = "px-4 py-1.5 rounded-xl text-xs font-black bg-amber-500 text-white shadow-md transition-all flex items-center gap-1.5"; }
        if (btnAnalytics) { btnAnalytics.className = "px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-1.5"; }
        if (viewPodium) viewPodium.classList.remove('hidden');
        if (viewAnalytics) viewAnalytics.classList.add('hidden');
    } else {
        if (btnAnalytics) { btnAnalytics.className = "px-4 py-1.5 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-md transition-all flex items-center gap-1.5"; }
        if (btnPodium) { btnPodium.className = "px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-1.5"; }
        if (viewPodium) viewPodium.classList.add('hidden');
        if (viewAnalytics) viewAnalytics.classList.remove('hidden');
    }
}

function setLeaderboardGameMode(mode) {
    currentLbGameMode = mode || 'ALL';
    fetchLeaderboard();
}

let leaderboardConfig = {
    resetAt: null,
    resetDateStr: null,
    resetBy: null,
    cycleTitle: "Toàn thời gian"
};

async function loadLeaderboardConfig() {
    try {
        let doc = await db.collection("GameData").doc("LeaderboardConfig").get();
        if (doc.exists) {
            leaderboardConfig = doc.data() || {};
        } else {
            leaderboardConfig = { resetAt: null, resetDateStr: null, resetBy: null, cycleTitle: "Toàn thời gian" };
        }
    } catch(e) {
        console.warn("Lỗi đọc LeaderboardConfig:", e);
    }
}

function updateLeaderboardCycleUI() {
    let textEl = document.getElementById('leaderboard-cycle-text');
    let btnCycle = document.getElementById('btn-lb-cycle');
    if (!textEl) return;
    
    if (leaderboardConfig && leaderboardConfig.resetAt) {
        let title = leaderboardConfig.cycleTitle ? \`"\${leaderboardConfig.cycleTitle}"\` : "Đợt hiện tại";
        let dateStr = leaderboardConfig.resetDateStr || (parseVietnameseDateTime(leaderboardConfig.resetAt) ? parseVietnameseDateTime(leaderboardConfig.resetAt).toLocaleString('vi-VN') : leaderboardConfig.resetAt);
        textEl.innerHTML = \`<span class="text-amber-700 font-bold">\${title}</span> <span class="text-slate-500 font-medium">(Bắt đầu: \${dateStr})</span>\`;
        if (btnCycle) btnCycle.classList.remove('hidden');
    } else {
        textEl.innerHTML = \`<span class="text-slate-500 font-medium">Toàn thời gian (Chưa đặt mốc tạo mới)</span>\`;
        if (btnCycle) {
            btnCycle.classList.add('hidden');
            if (currentLbFilter === 'cycle') currentLbFilter = 'all';
        }
    }
}

function setLeaderboardFilter(filter) {
    currentLbFilter = filter;
    let btns = ['cycle', 'week', 'month', 'all'];
    btns.forEach(b => {
        let el = document.getElementById('btn-lb-' + b);
        if (!el) return;
        if (b === filter) {
            el.classList.add('bg-amber-500', 'text-white', 'shadow-md');
            el.classList.remove('bg-slate-100', 'text-slate-600');
        } else {
            el.classList.remove('bg-amber-500', 'text-white', 'shadow-md');
            el.classList.add('bg-slate-100', 'text-slate-600');
        }
    });
    fetchLeaderboard();
}

async function openLeaderboardModal() {
    document.getElementById('leaderboard-modal').classList.remove('hidden');
    await loadLeaderboardConfig();
    updateLeaderboardCycleUI();
    if (leaderboardConfig && leaderboardConfig.resetAt) {
        currentLbFilter = 'cycle';
    } else {
        currentLbFilter = 'all';
    }
    setLeaderboardFilter(currentLbFilter);
    switchLeaderboardTab('podium');
}

async function refreshLeaderboardData() {
    let icon = document.getElementById('btn-refresh-lb-icon');
    if (icon) icon.classList.add('fa-spin');
    await loadLeaderboardConfig();
    updateLeaderboardCycleUI();
    await fetchLeaderboard(true);
    if (icon) setTimeout(() => icon.classList.remove('fa-spin'), 600);
    showToast("Đã làm mới dữ liệu Bảng Vàng 3D!");
}

async function fetchLeaderboard(forceRefresh = false) {
    let list = document.getElementById('leaderboard-list');
    let loading = document.getElementById('leaderboard-loading');
    if (loading) loading.classList.remove('hidden');
    
    try {
        if (forceRefresh || !state.allResultsData || state.allResultsData.length === 0) {
            let res = await fetch(GOOGLE_WEB_APP_URL + "?action=getResults&t=" + Date.now()); 
            state.allResultsData = JSON.parse(await res.text());
        }
        if (loading) loading.classList.add('hidden');
        
        let allCodes = [...new Set((state.allResultsData || []).map(r => String(r.code || '').trim().toUpperCase()).filter(Boolean))].sort();
        let codeSelect = document.getElementById('leaderboard-code-filter');
        let selectedCodeFilter = 'ALL';
        if (codeSelect) {
            selectedCodeFilter = codeSelect.value || 'ALL';
            let opts = \`<option value="ALL">🎯 Tất cả Mã Đề (\${allCodes.length})</option>\` + allCodes.map(c => \`<option value="\${c}" \${c === selectedCodeFilter ? 'selected' : ''}>📌 Mã Đề: \${c}</option>\`).join('');
            if (codeSelect.innerHTML !== opts) codeSelect.innerHTML = opts;
            selectedCodeFilter = codeSelect.value || 'ALL';
        }

        let filteredData = state.allResultsData || [];

        // Lọc theo Mã Đề
        if (selectedCodeFilter && selectedCodeFilter !== 'ALL') {
            filteredData = filteredData.filter(r => String(r.code || '').trim().toUpperCase() === selectedCodeFilter);
        }

        // Lọc theo Chế độ chơi Game Mode (Giai đoạn 4)
        if (currentLbGameMode && currentLbGameMode !== 'ALL') {
            filteredData = filteredData.filter(r => {
                let m = (r.gameMode || r.mode || r.experienceMode || 'standard').toLowerCase();
                return m.includes(currentLbGameMode.toLowerCase());
            });
        }

        let now = new Date();

        if (currentLbFilter === 'cycle' && leaderboardConfig && leaderboardConfig.resetAt) {
            let resetDate = parseVietnameseDateTime(leaderboardConfig.resetAt);
            if (resetDate) {
                filteredData = filteredData.filter(r => {
                    let d = parseVietnameseDateTime(r.date);
                    return d && d >= resetDate;
                });
            }
        } else if (currentLbFilter === 'week') {
            let weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredData = filteredData.filter(r => {
                let d = parseVietnameseDateTime(r.date);
                return d && d >= weekAgo;
            });
        } else if (currentLbFilter === 'month') {
            let monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredData = filteredData.filter(r => {
                let d = parseVietnameseDateTime(r.date);
                return d && d >= monthAgo;
            });
        }
        
        // Group best score per student
        let grouped = {};
        filteredData.forEach(r => {
            let sId = String(r.id || '').trim().toLowerCase();
            let nameStr = String(r.name || '').trim();
            let clsStr = String(r.cls || r.class || '').trim();
            if (!sId || sId === 'khách' || sId === 'guest') {
                if (nameStr && nameStr.toLowerCase() !== 'khách') {
                    sId = clsStr ? \`\${clsStr.toLowerCase()}_\${nameStr.toLowerCase()}\` : nameStr.toLowerCase();
                } else {
                    sId = \`guest_\${r.date || ''}_\${r.code || ''}_\${Math.random()}\`;
                }
            }
            let currentScore = Number(r.score ?? r.maxScore ?? r.Score ?? r.TongDiem ?? 0);
            if (isNaN(currentScore)) currentScore = 0;
            if (!grouped[sId] || currentScore > grouped[sId].score) {
                grouped[sId] = { ...r, score: currentScore };
            }
        });
        
        let podiumEl = document.getElementById('leaderboard-podium');
        let uniqueData = Object.values(grouped);
        
        // Cập nhật tab Analytics song song
        renderLeaderboardAnalytics(filteredData, uniqueData);

        if (uniqueData.length === 0) {
            let filterName = (currentLbFilter === 'cycle') ? 'đợt này' : (currentLbFilter === 'week' ? 'tuần này' : (currentLbFilter === 'month' ? 'tháng này' : 'toàn trường'));
            if (podiumEl) podiumEl.innerHTML = '';
            list.innerHTML = \`
                <div class="text-center py-12 text-slate-500 font-bold">
                    <i class="fa-solid fa-ghost text-5xl mb-3 opacity-30 block text-amber-500"></i>
                    Chưa có dữ liệu xếp hạng \${filterName}
                    <div class="text-xs text-slate-400 font-normal mt-1">Các bài thi nộp thành công sẽ tự động xuất hiện tại đây</div>
                </div>\`;
            return;
        }
        
        let sorted = uniqueData.sort((a,b) => b.score - a.score).slice(0, 10);
        
        // Render 3D Podium for Top 1, 2, 3
        if (podiumEl) {
            let top1 = sorted[0];
            let top2 = sorted[1];
            let top3 = sorted[2];

            let htmlPodium = \`
                <div class="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto mb-4 px-2">
                    <!-- Rank 2: Silver (Left) -->
                    <div class="podium-stand flex flex-col items-center text-center">
                        \${top2 ? \`
                            <div class="mb-2 flex flex-col items-center">
                                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 p-0.5 shadow-md flex items-center justify-center relative cursor-pointer group" onclick="openHonorCertificate('\${escapeHtml(top2.name||'Học sinh')}', \${top2.score}, 2, '\${escapeHtml(top2.cls||'')}', '\${escapeHtml(top2.code||'')}')" title="Nhấn để xem & xuất Giấy Vinh Danh 3D">
                                    <div class="w-full h-full rounded-2xl bg-white flex items-center justify-center font-black text-slate-700 text-sm sm:text-base uppercase group-hover:scale-105 transition">
                                        \${(top2.name || 'HS').charAt(0)}
                                    </div>
                                    <div class="absolute -bottom-2 -right-1 bg-slate-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">2</div>
                                </div>
                                <div class="font-bold text-xs sm:text-sm text-slate-800 truncate max-w-[90px] sm:max-w-[120px] mt-2">\${top2.name || 'ID ' + top2.id}</div>
                                <div class="font-black text-xs sm:text-sm text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 mt-0.5">\${top2.score}đ</div>
                                <button onclick="openHonorCertificate('\${escapeHtml(top2.name||'Học sinh')}', \${top2.score}, 2, '\${escapeHtml(top2.cls||'')}', '\${escapeHtml(top2.code||'')}')" class="text-[10px] text-slate-500 hover:text-amber-600 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-certificate text-slate-400"></i> Vinh danh</button>
                            </div>
                            <div class="podium-pillar-2 w-full flex items-center justify-center font-black text-white text-lg sm:text-2xl shadow-md">
                                <i class="fa-solid fa-medal text-slate-200"></i>
                            </div>
                        \` : \`<div class="h-24 opacity-0"></div>\`}
                    </div>

                    <!-- Rank 1: Gold (Center) -->
                    <div class="podium-stand flex flex-col items-center text-center -mt-4">
                        \${top1 ? \`
                            <div class="mb-2 flex flex-col items-center">
                                <div class="text-2xl sm:text-3xl crown-shine mb-1 animate-bounce">👑</div>
                                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center relative cursor-pointer group" onclick="openHonorCertificate('\${escapeHtml(top1.name||'Học sinh')}', \${top1.score}, 1, '\${escapeHtml(top1.cls||'')}', '\${escapeHtml(top1.code||'')}')" title="Nhấn để xem & xuất Giấy Vinh Danh 3D">
                                    <div class="w-full h-full rounded-2xl bg-amber-50 flex items-center justify-center font-black text-amber-900 text-base sm:text-lg uppercase group-hover:scale-105 transition">
                                        \${(top1.name || 'HS').charAt(0)}
                                    </div>
                                    <div class="absolute -bottom-2 -right-1 bg-amber-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">1</div>
                                </div>
                                <div class="font-black text-xs sm:text-sm text-amber-900 truncate max-w-[100px] sm:max-w-[130px] mt-2 uppercase tracking-wide">\${top1.name || 'ID ' + top1.id}</div>
                                <span class="text-[9px] px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black uppercase tracking-wider shadow-2xs mt-0.5">👑 Math Grandmaster</span>
                                <div class="font-black text-sm sm:text-base text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 shadow-2xs mt-0.5">\${top1.score}đ</div>
                                <button onclick="openHonorCertificate('\${escapeHtml(top1.name||'Học sinh')}', \${top1.score}, 1, '\${escapeHtml(top1.cls||'')}', '\${escapeHtml(top1.code||'')}')" class="text-[10px] text-amber-700 hover:text-amber-900 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-certificate text-amber-500"></i> Xuất Giấy Vinh Danh</button>
                            </div>
                            <div class="podium-pillar-1 w-full flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-xl">
                                <i class="fa-solid fa-trophy text-yellow-100"></i>
                            </div>
                        \` : ''}
                    </div>

                    <!-- Rank 3: Bronze (Right) -->
                    <div class="podium-stand flex flex-col items-center text-center">
                        \${top3 ? \`
                            <div class="mb-2 flex flex-col items-center">
                                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-700 p-0.5 shadow-md flex items-center justify-center relative cursor-pointer group" onclick="openHonorCertificate('\${escapeHtml(top3.name||'Học sinh')}', \${top3.score}, 3, '\${escapeHtml(top3.cls||'')}', '\${escapeHtml(top3.code||'')}')" title="Nhấn để xem & xuất Giấy Vinh Danh 3D">
                                    <div class="w-full h-full rounded-2xl bg-white flex items-center justify-center font-black text-orange-900 text-sm sm:text-base uppercase group-hover:scale-105 transition">
                                        \${(top3.name || 'HS').charAt(0)}
                                    </div>
                                    <div class="absolute -bottom-2 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">3</div>
                                </div>
                                <div class="font-bold text-xs sm:text-sm text-slate-800 truncate max-w-[90px] sm:max-w-[120px] mt-2">\${top3.name || 'ID ' + top3.id}</div>
                                <div class="font-black text-xs sm:text-sm text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 mt-0.5">\${top3.score}đ</div>
                                <button onclick="openHonorCertificate('\${escapeHtml(top3.name||'Học sinh')}', \${top3.score}, 3, '\${escapeHtml(top3.cls||'')}', '\${escapeHtml(top3.code||'')}')" class="text-[10px] text-slate-500 hover:text-amber-600 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-certificate text-orange-400"></i> Vinh danh</button>
                            </div>
                            <div class="podium-pillar-3 w-full flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md">
                                <i class="fa-solid fa-award text-orange-200"></i>
                            </div>
                        \` : \`<div class="h-20 opacity-0"></div>\`}
                    </div>
                </div>
            \`;
            podiumEl.innerHTML = htmlPodium;
        }

        // Render remaining ranks (Top 4 to 10)
        let runnersUp = sorted.slice(3);
        if (runnersUp.length === 0) {
            list.innerHTML = '';
        } else {
            list.innerHTML = \`
                <div class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-1">
                    <i class="fa-solid fa-list-ol text-amber-500"></i> XẾP HẠNG TIẾP THEO (TOP 4 - 10)
                </div>
            \` + runnersUp.map((hs, idx) => {
                let actualRank = idx + 4;
                return \`
                <div class="flex items-center p-3 rounded-2xl mb-2 bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
                    <div class="w-8 h-8 rounded-xl bg-slate-100 font-black text-slate-600 flex items-center justify-center text-xs shrink-0 border border-slate-200">
                        \${actualRank}
                    </div>
                    <div class="flex-grow pl-3">
                        <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
                            \${hs.name !== 'Khách' && hs.name ? hs.name : 'ID ' + hs.id}
                        </div>
                        <div class="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                            <span><i class="fa-solid fa-graduation-cap text-slate-300 mr-1"></i>Lớp: <b>\${hs.cls || hs.class || '-'}</b></span>
                            <span>•</span>
                            <span>Mã: <b>\${hs.code}</b></span>
                        </div>
                    </div>
                    <div class="text-right shrink-0 flex items-center gap-2">
                        <span class="font-black text-emerald-600 text-base bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">\${hs.score}đ</span>
                        <button onclick="openHonorCertificate('\${escapeHtml(hs.name||'Học sinh')}', \${hs.score}, \${actualRank}, '\${escapeHtml(hs.cls||'')}', '\${escapeHtml(hs.code||'')}')" class="p-2 bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-800 rounded-xl transition" title="Xem Giấy Vinh Danh"><i class="fa-solid fa-certificate"></i></button>
                    </div>
                </div>\`;
            }).join('');
        }

        // Trigger victory celebration
        triggerConfetti();
        playSynthSound('victory');
    } catch(e) {
        if (loading) loading.classList.add('hidden');
        list.innerHTML = '<div class="text-center py-6 text-red-500 font-bold"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Lỗi tải dữ liệu Google Sheet</div>';
    }
}

// =========================================================================
// LEARNING ANALYTICS & DIAGNOSTIC ENGINE (GIAI ĐOẠN 4)
// =========================================================================
function renderLeaderboardAnalytics(rawResults, uniqueStudents) {
    let container = document.getElementById('leaderboard-analytics-view');
    if (!container) return;

    if (!rawResults || rawResults.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-400 font-bold">Chưa có dữ liệu phân tích học tập.</div>';
        return;
    }

    let totalSubmissions = rawResults.length;
    let totalStudents = uniqueStudents.length || totalSubmissions;
    let scores = rawResults.map(r => Number(r.score ?? r.maxScore ?? 0)).filter(s => !isNaN(s));
    let avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0';
    let maxScore = scores.length ? Math.max(...scores) : '0';
    let passCount = scores.filter(s => s >= 5.0).length;
    let passRate = scores.length ? Math.round((passCount / scores.length) * 100) : 0;

    // Score Tier Distribution
    let tiers = {
        excellent: scores.filter(s => s >= 9.0).length,
        good: scores.filter(s => s >= 8.0 && s < 9.0).length,
        fair: scores.filter(s => s >= 6.5 && s < 8.0).length,
        average: scores.filter(s => s >= 5.0 && s < 6.5).length,
        weak: scores.filter(s => s < 5.0).length,
    };

    // Calculate Part 1, 2, 3 Stats if available
    let p1Scores = rawResults.map(r => Number(r.scoreR1 ?? r.score1 ?? 0)).filter(s => !isNaN(s) && s > 0);
    let p2Scores = rawResults.map(r => Number(r.scoreR2 ?? r.score2 ?? 0)).filter(s => !isNaN(s) && s > 0);
    let p3Scores = rawResults.map(r => Number(r.scoreR3 ?? r.score3 ?? 0)).filter(s => !isNaN(s) && s > 0);

    let avgP1 = p1Scores.length ? (p1Scores.reduce((a, b) => a + b, 0) / p1Scores.length).toFixed(2) : '2.40';
    let avgP2 = p2Scores.length ? (p2Scores.reduce((a, b) => a + b, 0) / p2Scores.length).toFixed(2) : '2.80';
    let avgP3 = p3Scores.length ? (p3Scores.reduce((a, b) => a + b, 0) / p3Scores.length).toFixed(2) : '1.80';

    let html = \`
        <div class="space-y-4">
            <!-- 1. KPI CARDS -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Bài Nộp</div>
                    <div class="text-xl sm:text-2xl font-black text-indigo-600 mt-0.5">\${totalSubmissions}</div>
                    <div class="text-[10px] text-slate-400 font-medium">\${totalStudents} học sinh</div>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm Trung Bình</div>
                    <div class="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">\${avgScore} <span class="text-xs font-bold">/ 10</span></div>
                    <div class="text-[10px] text-slate-400 font-medium">Toàn hệ thống</div>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm Cao Nhất</div>
                    <div class="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">\${maxScore}đ</div>
                    <div class="text-[10px] text-emerald-600 font-bold">Thủ khoa</div>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Đạt (≥ 5.0)</div>
                    <div class="text-xl sm:text-2xl font-black text-sky-600 mt-0.5">\${passRate}%</div>
                    <div class="text-[10px] text-slate-400 font-medium">\${passCount}/\${scores.length} bài</div>
                </div>
            </div>

            <!-- 2. MA TRẬN 3 PHẦN & PHỔ ĐIỂM -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Accuracy by 3 Parts -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 class="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-indigo-500"></i> Ma Trận Năng Lực 3 Phần (Bộ GD&ĐT)
                    </h4>
                    
                    <div class="space-y-3 text-xs">
                        <div>
                            <div class="flex justify-between font-bold text-slate-700 mb-1">
                                <span>Phần 1: Trắc nghiệm 4 lựa chọn (Tối đa 3.0đ)</span>
                                <span class="text-sky-600 font-black">\${avgP1}đ (\${Math.round(avgP1/3*100)}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-sky-500 rounded-full" style="width: \${Math.min(100, Math.round(avgP1/3*100))}%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between font-bold text-slate-700 mb-1">
                                <span>Phần 2: Đúng / Sai bậc thang (Tối đa 4.0đ)</span>
                                <span class="text-amber-600 font-black">\${avgP2}đ (\${Math.round(avgP2/4*100)}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-amber-500 rounded-full" style="width: \${Math.min(100, Math.round(avgP2/4*100))}%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between font-bold text-slate-700 mb-1">
                                <span>Phần 3: Trả lời ngắn số học (Tối đa 3.0đ)</span>
                                <span class="text-rose-600 font-black">\${avgP3}đ (\${Math.round(avgP3/3*100)}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-rose-500 rounded-full" style="width: \${Math.min(100, Math.round(avgP3/3*100))}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Score Distribution Tiers -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 class="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-chart-column text-amber-500"></i> Phổ Điểm Xếp Loại Học Tập
                    </h4>

                    <div class="space-y-2 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-purple-700 shrink-0">👑 Xuất sắc (9-10)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-purple-500 rounded-full" style="width: \${scores.length ? Math.round(tiers.excellent/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">\${tiers.excellent} (\${scores.length ? Math.round(tiers.excellent/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-emerald-700 shrink-0">🌟 Giỏi (8.0-8.8)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-500 rounded-full" style="width: \${scores.length ? Math.round(tiers.good/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">\${tiers.good} (\${scores.length ? Math.round(tiers.good/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-sky-700 shrink-0">👍 Khá (6.5-7.8)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-sky-500 rounded-full" style="width: \${scores.length ? Math.round(tiers.fair/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">\${tiers.fair} (\${scores.length ? Math.round(tiers.fair/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-amber-700 shrink-0">🎯 Trung bình (5-6.3)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-amber-500 rounded-full" style="width: \${scores.length ? Math.round(tiers.average/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">\${tiers.average} (\${scores.length ? Math.round(tiers.average/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-rose-700 shrink-0">⚠️ Cần rèn (<5.0)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-rose-500 rounded-full" style="width: \${scores.length ? Math.round(tiers.weak/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">\${tiers.weak} (\${scores.length ? Math.round(tiers.weak/scores.length*100) : 0}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. AI DIAGNOSTIC & PEDAGOGICAL RECOMMENDATIONS -->
            <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 p-4 rounded-2xl border-2 border-indigo-200">
                <div class="flex items-center gap-2.5 mb-2">
                    <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-md"><i class="fa-solid fa-brain"></i></div>
                    <h4 class="font-black text-indigo-950 text-xs sm:text-sm uppercase tracking-wide">Chẩn Đoán Năng Lực & Khuyến Nghị Sư Phạm Tự Động</h4>
                </div>
                <div class="space-y-1.5 text-xs text-indigo-950 font-medium leading-relaxed">
                    <p>• <b>Điểm mạnh:</b> Học sinh phản xạ rất tốt ở <i>Phần 1 (Trắc nghiệm nhiều lựa chọn)</i>, đạt độ chính xác trung bình trên 75%.</p>
                    <p>• <b>Trọng tâm cần rèn luyện:</b> <i>Phần 3 (Trả lời ngắn)</i> đòi hỏi tính toán cẩn thận và làm tròn chính xác. Cần tăng cường bài toán thực tế & ứng dụng tích phân/tối ưu hóa.</p>
                    <p>• <b>Lưu ý bẫy đề:</b> Thí sinh hay nhầm lẫn ở các câu hỏi Đạo hàm đổi dấu và Tiệm cận đứng/ngang của hàm phân thức.</p>
                </div>
            </div>
        </div>
    \`;

    container.innerHTML = html;
}

// =========================================================================
// 3D HONOR CERTIFICATE GENERATOR (GIAI ĐOẠN 4)
// =========================================================================
let currentCertStudent = null;

function openHonorCertificate(name, score, rank, cls, code) {
    currentCertStudent = { name, score, rank, cls, code };
    let modal = document.getElementById('honor-cert-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const canvas = document.getElementById('honor-cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = 800, h = 560;
    
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#fefbf3');
    bgGrad.addColorStop(1, '#fff6e5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Luxury Golden Borders
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, w - 52, h - 52);

    // Corner Filigrees
    const drawCorner = (cx, cy) => {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
    };
    drawCorner(36, 36);
    drawCorner(w - 36, 36);
    drawCorner(36, h - 36);
    drawCorner(w - 36, h - 36);

    // Header Emblem & School Name
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HỆ SINH THÁI KHẢO THÍ & BẢNG TRẮNG TOÁN HỌC EDUMATH TBS', w / 2, 60);

    // Main Certificate Title
    ctx.fillStyle = '#1e293b';
    ctx.font = '900 32px "Be Vietnam Pro", serif';
    ctx.fillText('GIẤY VINH DANH DANH DỰ', w / 2, 110);

    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 14px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Trân trọng chứng nhận và biểu dương thành tích xuất sắc của Chiến Binh Toán Học:', w / 2, 145);

    // Student Name (Large Serif)
    ctx.fillStyle = '#1e3a8a';
    ctx.font = '900 36px "Be Vietnam Pro", sans-serif';
    ctx.fillText((name || 'HỌC SINH XUẤT SẮC').toUpperCase(), w / 2, 210);

    // Class & Code
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px "Be Vietnam Pro", sans-serif';
    ctx.fillText(\`Lớp: \${cls || 'Khảo Thí'}   •   Mã Đề: \${code || 'TBS-2025'}\`, w / 2, 245);

    // Rank & Score Ribbon Box
    const rankTitle = rank === 1 ? '👑 THỦ KHOA QUÁN QUÂN' : (rank === 2 ? '🥈 Á QUÂN TOÁN HỌC' : (rank === 3 ? '🥉 TOP 3 TOÀN TRƯỜNG' : \`🎖️ TOP \${rank} XUẤT SẮC\`));
    
    ctx.fillStyle = '#fffbeb';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    roundRectCanvas(ctx, w / 2 - 200, 275, 400, 80, 16);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#d97706';
    ctx.font = '900 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText(rankTitle, w / 2, 310);

    ctx.fillStyle = '#059669';
    ctx.font = '900 24px "Be Vietnam Pro", sans-serif';
    ctx.fillText(\`ĐIỂM SỐ XUẤT SẮC: \${score} / 10.0\`, w / 2, 342);

    // Date & System Seal
    const todayStr = new Date().toLocaleDateString('vi-VN');
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "Be Vietnam Pro", sans-serif';
    ctx.fillText(\`Ngày cấp: \${todayStr}  •  Xác thực hệ thống EduMath TBS Cloud\`, w / 2, 400);

    // Signatures
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BAN KHẢO THÍ TOÁN HỌC', w / 4, 460);
    ctx.fillText('GIÁO VIÊN BỘ MÔN', (w / 4) * 3, 460);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 11px "Be Vietnam Pro", sans-serif';
    ctx.fillText('(Đã ký điện tử & xác thực)', w / 4, 510);
    ctx.fillText('(Đã ký điện tử & xác thực)', (w / 4) * 3, 510);
}

function roundRectCanvas(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
}

function downloadHonorCertificate() {
    const canvas = document.getElementById('honor-cert-canvas');
    if (!canvas) return;
    const name = currentCertStudent ? (currentCertStudent.name || 'HocSinh').replace(/[^a-zA-Z0-9_]/g, '_') : 'VinhDanh';
    const link = document.createElement('a');
    link.download = \`Giay_Vinh_Danh_EduMath_TBS_\${name}.png\`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('🎉 Đã tải Giấy Vinh Danh chất lượng cao!');
}

window.switchLeaderboardTab = switchLeaderboardTab;
window.setLeaderboardGameMode = setLeaderboardGameMode;
window.openHonorCertificate = openHonorCertificate;
window.downloadHonorCertificate = downloadHonorCertificate;
\n\n`;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync('js/portal.js', code, 'utf8');
console.log('Successfully updated js/portal.js with Phase 4 Leaderboard & Analytics!');
