const fs = require('fs');
const path = require('path');

const studentJsPath = path.join(__dirname, '..', 'js', 'student.js');
let studentJs = fs.readFileSync(studentJsPath, 'utf8');

const startMarker = '// --- GAME 1: AI LÀ TRIỆU PHÚ (MILLIONAIRE) ---';
const startIndex = studentJs.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find startMarker in student.js');
    process.exit(1);
}

const beforePart = studentJs.substring(0, startIndex);

const newGamesCode = `// --- GAME 1: AI LÀ TRIỆU PHÚ TOÁN HỌC (PRO ARENA) ---
let millionaireState = {
    currentIndex: 0,
    currentQuestion: null,
    lifelines: { fifty: true, freeze: true, audience: true, swap: true },
    isFrozen: false,
    questions: [],
    ladder: [
        { level: 1, prize: "200.000", isMilestone: false },
        { level: 2, prize: "400.000", isMilestone: false },
        { level: 3, prize: "600.000", isMilestone: false },
        { level: 4, prize: "1.000.000", isMilestone: false },
        { level: 5, prize: "2.000.000", isMilestone: true },
        { level: 6, prize: "3.000.000", isMilestone: false },
        { level: 7, prize: "6.000.000", isMilestone: false },
        { level: 8, prize: "10.000.000", isMilestone: false },
        { level: 9, prize: "14.000.000", isMilestone: false },
        { level: 10, prize: "22.000.000", isMilestone: true },
        { level: 11, prize: "30.000.000", isMilestone: false },
        { level: 12, prize: "40.000.000", isMilestone: false },
        { level: 13, prize: "60.000.000", isMilestone: false },
        { level: 14, prize: "85.000.000", isMilestone: false },
        { level: 15, prize: "150.000.000", isMilestone: true }
    ]
};

function startMillionaireGame() {
    state.activeGameMode = 'millionaire';
    let pool = [...(GAME_DATA.round1 || [])];
    if (pool.length < 5) {
        (GAME_DATA.round3 || []).forEach(q => {
            pool.push({
                id: 'm_' + q.id,
                text: q.text,
                content_vi: q.content_vi || q.text,
                content_en: q.content_en || '',
                options: [String(q.answer), "0", "1", "2"].sort(() => Math.random() - 0.5),
                answer: String(q.answer)
            });
        });
    }
    
    pool.sort(() => Math.random() - 0.5);
    millionaireState.questions = pool;
    millionaireState.currentIndex = 0;
    millionaireState.lifelines = { fifty: true, freeze: true, audience: true, swap: true };
    millionaireState.isFrozen = false;
    
    renderMillionaireScreen();
    playSound('powerup');
}
window.startMillionaireGame = startMillionaireGame;

function renderMillionaireScreen() {
    if (millionaireState.currentIndex >= millionaireState.questions.length || millionaireState.currentIndex >= 15) {
        handleMillionaireVictory();
        return;
    }
    
    let q = millionaireState.questions[millionaireState.currentIndex];
    millionaireState.currentQuestion = q;
    let currLevel = millionaireState.ladder[millionaireState.currentIndex];
    
    let qContentHtml = typeof getBilingualQuestionHtml === 'function' 
        ? getBilingualQuestionHtml(q, window.APP_LANG) 
        : parseMarkdownSafe(stripQuestionPrefix(q.text || ''));

    let opts = (q.options || []).map((o, optIdx) => {
        let optClean = (typeof stripOptionPrefix === 'function' ? stripOptionPrefix(o) : o).trim();
        let ansClean = (typeof stripOptionPrefix === 'function' ? stripOptionPrefix(q.answer) : String(q.answer||'')).trim();
        let ansRaw = String(q.answer || '').trim();
        let optLetter = ['A', 'B', 'C', 'D'][optIdx];

        let isC = (String(o).trim().toLowerCase() === ansRaw.toLowerCase()) ||
                  (optClean && ansClean && optClean.toLowerCase() === ansClean.toLowerCase()) ||
                  (ansRaw.toUpperCase() === optLetter) ||
                  (ansRaw.toUpperCase() === optLetter + '.') ||
                  (String(o).trim().toUpperCase().startsWith(ansRaw.toUpperCase() + '.'));
        return { text: o, isCorrect: isC, letter: optLetter, index: optIdx };
    });

    let ladderHtml = [...millionaireState.ladder].reverse().map(tier => {
        let isCurrent = (tier.level - 1) === millionaireState.currentIndex;
        let isPassed = (tier.level - 1) < millionaireState.currentIndex;
        let itemCls = isCurrent 
            ? "ladder-active-step" 
            : (isPassed 
                ? "bg-emerald-600/80 text-white font-bold opacity-80 border-emerald-500/50" 
                : (tier.isMilestone ? "bg-indigo-950 text-amber-300 font-black border-2 border-amber-400/50 shadow-sm" : "bg-slate-900/80 text-slate-400 font-medium border-slate-800"));
        return \`
            <div class="px-3 py-1 rounded-xl text-[11px] flex justify-between items-center transition-all duration-300 border \${itemCls}">
                <span class="font-mono font-bold w-6">\${tier.level}</span>
                <span class="font-black font-display tracking-tight">\${tier.prize} đ</span>
                \${tier.isMilestone ? '<i class="fa-solid fa-crown text-amber-400 text-[10px]"></i>' : (isPassed ? '<i class="fa-solid fa-check text-white text-[10px]"></i>' : '<span class="w-3"></span>')}
            </div>
        \`;
    }).join('');

    let progressPercent = Math.round(((millionaireState.currentIndex + 1) / 15) * 100);

    document.getElementById('app-content').innerHTML = \`
        <div class="w-full max-w-5xl fade-in grid grid-cols-1 lg:grid-cols-4 gap-4">
            <!-- Left & Center: Question Arena -->
            <div class="lg:col-span-3 flex flex-col gap-4">
                <!-- Header Controls with Neon Glow -->
                <div class="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 rounded-3xl text-white shadow-2xl border-2 border-amber-400/40 flex items-center justify-between relative overflow-hidden">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div class="flex items-center gap-3 relative z-10">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/30">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <div>
                            <div class="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                                <span>AI LÀ TRIỆU PHÚ TOÁN HỌC</span>
                                <span class="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-mono text-[9px]">v3.0</span>
                            </div>
                            <div class="text-base font-black text-white font-display">CÂU HỎI SỐ \${millionaireState.currentIndex + 1} / 15</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 relative z-10">
                        <div class="px-3.5 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-400/50 rounded-2xl font-black text-xs shadow-inner">
                            Mốc: <span class="font-display font-black">\${currLevel ? currLevel.prize : '0'} đ</span>
                        </div>
                        <button onclick="renderDashboard(); playSound('click');" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/10">
                            <i class="fa-solid fa-house mr-1"></i> Rời Game
                        </button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-indigo-900/60 p-0.5">
                    <div class="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 h-full rounded-full transition-all duration-500 shadow-xs" style="width: \${progressPercent}%"></div>
                </div>

                <!-- 4 Lifelines Bar -->
                <div class="bg-white/95 backdrop-blur p-3 rounded-2xl border-2 border-indigo-200/80 shadow-md flex items-center justify-around gap-2">
                    <button onclick="useMillionaireLifeline('fifty')" id="m-ll-fifty" \${millionaireState.lifelines.fifty ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 \${millionaireState.lifelines.fifty ? 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-scale-balanced text-sm"></i> <span>50:50</span>
                    </button>
                    <button onclick="useMillionaireLifeline('freeze')" id="m-ll-freeze" \${millionaireState.lifelines.freeze ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 \${millionaireState.lifelines.freeze ? 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-snowflake text-sm"></i> <span>Đóng Băng</span>
                    </button>
                    <button onclick="useMillionaireLifeline('audience')" id="m-ll-audience" \${millionaireState.lifelines.audience ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 \${millionaireState.lifelines.audience ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-users text-sm"></i> <span>Khán Giả AI</span>
                    </button>
                    <button onclick="useMillionaireLifeline('swap')" id="m-ll-swap" \${millionaireState.lifelines.swap ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 \${millionaireState.lifelines.swap ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-rotate text-sm"></i> <span>Đổi Câu</span>
                    </button>
                </div>

                <!-- Glowing Question Box -->
                <div class="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-2xl border-4 border-amber-400/80 text-center relative overflow-hidden min-h-[170px] flex items-center justify-center">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none"></div>
                    <div class="relative z-10 text-base md:text-xl font-bold leading-relaxed prose-math text-white">
                        \${qContentHtml}
                    </div>
                </div>

                <!-- 4 Diamond Choice Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    \${opts.map((opt, i) => \`
                        <button onclick="handleMillionaireChoice(\${opt.isCorrect}, this)" id="m-opt-btn-\${i}" class="m-choice-btn p-4 md:p-5 rounded-2xl border-2 border-slate-200 text-slate-800 font-bold text-sm md:text-base text-left shadow-md flex items-center gap-3.5 group btn-3d">
                            <span class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 group-hover:bg-amber-400 group-hover:text-slate-950 text-indigo-700 font-black flex items-center justify-center shrink-0 transition text-sm shadow-2xs">
                                \${opt.letter}
                            </span>
                            <span class="prose-math leading-normal flex-1">\${parseMarkdownSafe(stripOptionPrefix(opt.text))}</span>
                        </button>
                    \`).join('')}
                </div>
            </div>

            <!-- Right: Prize Ladder Sidebar -->
            <div class="bg-slate-950 p-3.5 rounded-3xl border-2 border-indigo-900/60 shadow-2xl flex flex-col gap-1.5">
                <div class="text-[11px] font-black uppercase text-amber-400 tracking-wider text-center border-b border-slate-800 pb-2.5 mb-1 flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-stairs text-amber-400"></i> THÁP TIỀN THƯỞNG
                </div>
                \${ladderHtml}
            </div>
        </div>

        <!-- AI Audience Modal Container -->
        <div id="m-audience-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] hidden flex items-center justify-center p-4">
            <div class="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl border-4 border-amber-300 text-center zoom-in">
                <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner border border-amber-200">
                    <i class="fa-solid fa-chart-column"></i>
                </div>
                <h3 class="text-lg font-black text-slate-800 mb-1 uppercase tracking-wide">Ý KIẾN KHÁN GIẢ AI</h3>
                <p class="text-xs text-slate-500 mb-4 font-medium">Khán giả chuyên gia Toán học phân tích tỷ lệ bình chọn:</p>
                <div id="m-audience-chart" class="space-y-2 mb-5"></div>
                <button onclick="document.getElementById('m-audience-modal').classList.add('hidden')" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-wider btn-3d shadow-md">Đóng & Tiếp Tục Làm Bài</button>
            </div>
        </div>
    \`;
    triggerMathJax(document.getElementById('app-content'));
}

function handleMillionaireChoice(isCorrect, btnEl) {
    if (btnEl) {
        btnEl.classList.add(isCorrect ? 'm-choice-correct' : 'm-choice-wrong');
    }
    
    if (isCorrect) {
        playSound('correct');
        let prize = millionaireState.ladder[millionaireState.currentIndex].prize;
        showToast("🎉 CHÍNH XÁC! Bạn đã giành được " + prize + " đ!", false);
        millionaireState.currentIndex++;
        setTimeout(() => {
            renderMillionaireScreen();
        }, 1100);
    } else {
        playSound('wrong');
        setTimeout(() => {
            handleMillionaireGameOver();
        }, 800);
    }
}

function useMillionaireLifeline(type) {
    if (!millionaireState.lifelines[type]) return;
    millionaireState.lifelines[type] = false;
    playSound('powerup');
    
    if (type === 'fifty') {
        showToast("🎯 ĐÃ SỬ DỤNG TRỢ GIÚP 50:50!");
        let q = millionaireState.currentQuestion;
        let wrongIndices = [];
        (q.options || []).forEach((opt, idx) => {
            let optClean = stripOptionPrefix(opt).trim();
            let ansClean = stripOptionPrefix(q.answer).trim();
            let isC = (optClean.toLowerCase() === ansClean.toLowerCase());
            if (!isC) wrongIndices.push(idx);
        });
        wrongIndices.sort(() => Math.random() - 0.5);
        let toHide = wrongIndices.slice(0, 2);
        toHide.forEach(idx => {
            let btn = document.getElementById('m-opt-btn-' + idx);
            if (btn) btn.classList.add('opacity-10', 'pointer-events-none');
        });
        let btnEl = document.getElementById('m-ll-fifty');
        if (btnEl) btnEl.disabled = true;
    } else if (type === 'freeze') {
        showToast("❄️ ĐÃ ĐÓNG BĂNG ÁP LỰC!");
        let btnEl = document.getElementById('m-ll-freeze');
        if (btnEl) btnEl.disabled = true;
    } else if (type === 'audience') {
        let q = millionaireState.currentQuestion;
        let chartEl = document.getElementById('m-audience-chart');
        if (chartEl) {
            let correctLetter = 'A';
            (q.options || []).forEach((opt, idx) => {
                let optClean = stripOptionPrefix(opt).trim();
                let ansClean = stripOptionPrefix(q.answer).trim();
                if (optClean.toLowerCase() === ansClean.toLowerCase()) {
                    correctLetter = ['A', 'B', 'C', 'D'][idx];
                }
            });
            let probs = { A: 10, B: 10, C: 12, D: 8 };
            probs[correctLetter] = 70;
            
            chartEl.innerHTML = ['A', 'B', 'C', 'D'].map(L => \`
                <div class="flex items-center gap-2 text-xs font-bold">
                    <span class="w-6 text-slate-700 font-black">\${L}:</span>
                    <div class="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden border border-slate-200">
                        <div class="bg-gradient-to-r from-amber-500 to-indigo-600 h-full rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-black" style="width: \${probs[L]}%">\${probs[L]}%</div>
                    </div>
                </div>
            \`).join('');
        }
        document.getElementById('m-audience-modal')?.classList.remove('hidden');
        let btnEl = document.getElementById('m-ll-audience');
        if (btnEl) btnEl.disabled = true;
    } else if (type === 'swap') {
        showToast("🔄 ĐÃ ĐỔI CÂU HỎI MỚI!");
        millionaireState.currentIndex++;
        renderMillionaireScreen();
    }
}

function handleMillionaireVictory() {
    playSound('fanfare');
    document.getElementById('app-content').innerHTML = \`
        <div class="glass-panel p-8 md:p-10 rounded-3xl max-w-lg w-full text-center fade-in bg-white/95 shadow-2xl border-4 border-amber-400 relative overflow-hidden">
            <div class="w-24 h-24 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-slate-950 rounded-3xl flex items-center justify-center mx-auto mb-4 text-5xl shadow-xl shadow-amber-500/30 animate-bounce">
                🏆
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-1 font-display">NHÀ VÔ ĐỊCH TRIỆU PHÚ!</h2>
            <p class="text-xs text-slate-500 font-bold mb-5">Bạn đã xuất sắc vượt qua tất cả 15 câu hỏi và chinh phục đỉnh cao Toán học!</p>
            
            <div class="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 mb-6 shadow-inner">
                <div class="text-xs font-black uppercase text-amber-700 tracking-wider">TỔNG TIỀN THƯỞNG CHIẾN THẮNG</div>
                <div class="text-4xl font-black text-amber-600 font-display mt-1 drop-shadow-sm">150.000.000 đ</div>
                <div class="mt-2 text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <i class="fa-solid fa-circle-check"></i> Đạt danh hiệu: <b>Kiện Tướng Toán Học TBS</b>
                </div>
            </div>

            <div class="flex flex-col gap-2.5">
                <button onclick="startMillionaireGame()" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl text-sm shadow-lg hover:brightness-105 btn-3d uppercase">
                    <i class="fa-solid fa-rotate mr-1.5"></i> Chơi Lại Ván Mới
                </button>
                <button onclick="renderDashboard()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">
                    <i class="fa-solid fa-house mr-1.5"></i> Về Đấu Trường
                </button>
            </div>
        </div>
    \`;
}

function handleMillionaireGameOver() {
    let safePrize = "0";
    if (millionaireState.currentIndex >= 10) safePrize = "22.000.000";
    else if (millionaireState.currentIndex >= 5) safePrize = "2.000.000";
    
    document.getElementById('app-content').innerHTML = \`
        <div class="glass-panel p-8 rounded-3xl max-w-md w-full text-center fade-in bg-white/95 shadow-2xl border-t-4 border-rose-500">
            <div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner border border-rose-200">
                <i class="fa-solid fa-heart-crack"></i>
            </div>
            <h2 class="text-xl font-black text-slate-800 mb-1 uppercase tracking-wide">RẤT TIẾC! CÂU TRẢ LỜI CHƯA ĐÚNG</h2>
            <p class="text-xs text-slate-500 mb-4 font-medium">Bạn đã dừng chân tại Câu số <b>\${millionaireState.currentIndex + 1}</b>.</p>
            <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 mb-5">
                <span class="text-xs font-bold text-slate-500 uppercase">Tiền thưởng mốc an toàn đạt được:</span>
                <div class="text-2xl font-black text-amber-600 font-display mt-0.5">\${safePrize} đ</div>
            </div>
            <div class="flex flex-col gap-2.5">
                <button onclick="startMillionaireGame()" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md btn-3d">
                    <i class="fa-solid fa-rotate mr-1"></i> Thử Lại Ngay
                </button>
                <button onclick="renderDashboard()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">
                    <i class="fa-solid fa-house mr-1"></i> Về Đấu Trường
                </button>
            </div>
        </div>
    \`;
}


// --- GAME 2: ĐUA TỐC ĐỘ 60S (SPEED RUN CYBERPUNK) ---
let speedRunState = {
    timer: 60,
    intervalId: null,
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    totalCount: 0,
    pool: [],
    currentIndex: 0
};

function startSpeedRunGame() {
    state.activeGameMode = 'speedrun';
    let pool = [...(GAME_DATA.round1 || [])];
    if (!pool.length) {
        showToast("Chưa có câu hỏi cho chế độ này!", true);
        renderDashboard();
        return;
    }
    pool.sort(() => Math.random() - 0.5);
    speedRunState.pool = pool;
    speedRunState.currentIndex = 0;
    speedRunState.score = 0;
    speedRunState.streak = 0;
    speedRunState.maxStreak = 0;
    speedRunState.correctCount = 0;
    speedRunState.totalCount = 0;
    speedRunState.timer = 60;
    
    if (speedRunState.intervalId) clearInterval(speedRunState.intervalId);
    speedRunState.intervalId = setInterval(() => {
        speedRunState.timer--;
        let el = document.getElementById('sr-timer-disp');
        if (el) el.innerText = speedRunState.timer + 's';
        if (speedRunState.timer <= 0) {
            clearInterval(speedRunState.intervalId);
            endSpeedRunGame();
        }
    }, 1000);
    
    renderSpeedRunQuestion();
    playSound('powerup');
}
window.startSpeedRunGame = startSpeedRunGame;

function renderSpeedRunQuestion() {
    if (speedRunState.currentIndex >= speedRunState.pool.length) {
        speedRunState.pool.sort(() => Math.random() - 0.5);
        speedRunState.currentIndex = 0;
    }
    let q = speedRunState.pool[speedRunState.currentIndex];
    let mult = speedRunState.streak >= 10 ? 3.0 : (speedRunState.streak >= 5 ? 2.0 : (speedRunState.streak >= 3 ? 1.5 : 1.0));
    
    let qContentHtml = typeof getBilingualQuestionHtml === 'function' 
        ? getBilingualQuestionHtml(q, window.APP_LANG) 
        : parseMarkdownSafe(stripQuestionPrefix(q.text || ''));

    let opts = (q.options || []).map((o, optIdx) => {
        let optClean = stripOptionPrefix(o).trim();
        let ansClean = stripOptionPrefix(q.answer).trim();
        let isC = (optClean.toLowerCase() === ansClean.toLowerCase());
        return { text: o, isCorrect: isC, letter: ['A', 'B', 'C', 'D'][optIdx] };
    });

    document.getElementById('app-content').innerHTML = \`
        <div class="w-full max-w-3xl fade-in flex flex-col gap-4">
            <!-- HUD Cyberpunk Header -->
            <div class="bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 p-4 rounded-3xl text-white shadow-2xl flex items-center justify-between border-2 border-amber-300/40 relative overflow-hidden">
                <div class="flex items-center gap-3 relative z-10">
                    <div class="w-12 h-12 bg-black/30 rounded-2xl backdrop-blur flex items-center justify-center text-2xl font-black shadow-inner border border-white/20">
                        ⚡
                    </div>
                    <div>
                        <div class="text-[10px] font-black uppercase tracking-wider text-amber-200">ĐUA TỐC ĐỘ • 60S TIME ATTACK</div>
                        <div class="text-2xl font-black font-display tracking-tight">ĐIỂM: \${speedRunState.score}</div>
                    </div>
                </div>

                <div class="flex items-center gap-2.5 relative z-10">
                    <div class="px-4 py-2 bg-slate-950/80 rounded-2xl border border-rose-400/50 flex items-center gap-2 shadow-inner">
                        <i class="fa-solid fa-fire text-rose-400 animate-pulse"></i>
                        <span id="sr-timer-disp" class="font-mono font-black text-2xl text-rose-400 speedrun-timer-glow">\${speedRunState.timer}s</span>
                    </div>
                    <div class="px-3.5 py-2 bg-amber-400 text-slate-950 rounded-2xl font-black text-xs combo-pop-badge shadow-md">
                        COMBO x\${mult}
                    </div>
                    <button onclick="clearInterval(speedRunState.intervalId); renderDashboard(); playSound('click');" class="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">
                        Thoát
                    </button>
                </div>
            </div>

            <!-- Question Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-slate-200 text-center relative overflow-hidden">
                <div class="text-base md:text-lg font-bold leading-relaxed prose-math text-slate-800">
                    \${qContentHtml}
                </div>
            </div>

            <!-- Choices -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                \${opts.map((opt, i) => \`
                    <button onclick="handleSpeedRunAnswer(\${opt.isCorrect})" class="p-4 rounded-2xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-500 font-bold text-slate-800 text-left transition shadow-sm flex items-center gap-3.5 btn-3d group">
                        <span class="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white font-black text-xs flex items-center justify-center transition shrink-0 shadow-2xs">
                            \${opt.letter}
                        </span>
                        <span class="prose-math text-sm">\${parseMarkdownSafe(stripOptionPrefix(opt.text))}</span>
                    </button>
                \`).join('')}
            </div>
        </div>
    \`;
    triggerMathJax(document.getElementById('app-content'));
}

function handleSpeedRunAnswer(isCorrect) {
    speedRunState.totalCount++;
    if (isCorrect) {
        speedRunState.correctCount++;
        speedRunState.streak++;
        if (speedRunState.streak > speedRunState.maxStreak) speedRunState.maxStreak = speedRunState.streak;
        
        let mult = speedRunState.streak >= 10 ? 3.0 : (speedRunState.streak >= 5 ? 2.0 : (speedRunState.streak >= 3 ? 1.5 : 1.0));
        speedRunState.score += Math.round(100 * mult);
        speedRunState.timer += 3;
        playSound('correct');
        showToast("⚡ +3s! Combo x" + mult, false);
    } else {
        speedRunState.streak = 0;
        speedRunState.timer = Math.max(0, speedRunState.timer - 5);
        playSound('wrong');
        showToast("💥 -5s! Mất Combo", true);
    }
    speedRunState.currentIndex++;
    renderSpeedRunQuestion();
}

function endSpeedRunGame() {
    playSound('fanfare');
    let acc = speedRunState.totalCount > 0 ? Math.round((speedRunState.correctCount / speedRunState.totalCount) * 100) : 0;
    document.getElementById('app-content').innerHTML = \`
        <div class="glass-panel p-8 rounded-3xl max-w-md w-full text-center fade-in bg-white/95 shadow-2xl border-t-4 border-amber-500">
            <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-rose-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-3 text-4xl shadow-xl shadow-rose-500/30 animate-pulse">
                ⚡
            </div>
            <h2 class="text-2xl font-black text-slate-800 mb-1 font-display uppercase">TỔNG KẾT ĐUA TỐC ĐỘ</h2>
            <p class="text-xs text-slate-500 font-bold mb-4">Bạn đã hoàn thành 60 giây nghẹt thở!</p>

            <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 my-4 grid grid-cols-2 gap-3 text-left shadow-inner">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Tổng điểm:</span>
                    <div class="text-2xl font-black text-indigo-600 font-display">\${speedRunState.score}</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Max Combo:</span>
                    <div class="text-2xl font-black text-amber-500 font-display">x\${speedRunState.maxStreak}</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Số câu đúng:</span>
                    <div class="text-lg font-black text-emerald-600">\${speedRunState.correctCount} / \${speedRunState.totalCount}</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Độ chính xác:</span>
                    <div class="text-lg font-black text-sky-600">\${acc}%</div>
                </div>
            </div>
            <div class="flex flex-col gap-2.5">
                <button onclick="startSpeedRunGame()" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md btn-3d">
                    <i class="fa-solid fa-rotate mr-1"></i> Chơi Lại Lượt Mới
                </button>
                <button onclick="renderDashboard()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">
                    <i class="fa-solid fa-house mr-1"></i> Về Đấu Trường
                </button>
            </div>
        </div>
    \`;
}


// --- GAME 3: VƯỢT ẢI DIỆT BOSS RPG (PRO ARENA) ---
let bossRushState = {
    playerHp: 3,
    maxHp: 3,
    stage: 1,
    bossHp: 100,
    bossMaxHp: 100,
    bossName: "👾 Tiểu Quái Ma Trận (Ải 1)",
    currentQuestion: null,
    pool: [],
    currentIndex: 0
};

function startBossRushGame() {
    state.activeGameMode = 'bossrush';
    bossRushState.playerHp = 3;
    bossRushState.stage = 1;
    bossRushState.bossMaxHp = 100;
    bossRushState.bossHp = 100;
    bossRushState.bossName = "👾 Tiểu Quái Ma Trận (Ải 1)";
    bossRushState.pool = [...(GAME_DATA.round1 || []), ...(GAME_DATA.round2 || [])].sort(() => Math.random() - 0.5);
    bossRushState.currentIndex = 0;
    
    renderBossRushScreen();
    playSound('powerup');
}
window.startBossRushGame = startBossRushGame;

function renderBossRushScreen() {
    if (bossRushState.playerHp <= 0) {
        endBossRushGame(false);
        return;
    }
    if (bossRushState.bossHp <= 0) {
        if (bossRushState.stage === 1) {
            bossRushState.stage = 2;
            bossRushState.bossMaxHp = 150;
            bossRushState.bossHp = 150;
            bossRushState.bossName = "🛡️ Hộ Vệ OXYZ (Ải 2)";
            showToast("⚔️ ĐÃ HẠ GỤC ẢI 1! TIẾN VÀO ẢI 2: HỘ VỆ OXYZ!", false);
            playSound('fanfare');
        } else if (bossRushState.stage === 2) {
            bossRushState.stage = 3;
            bossRushState.bossMaxHp = 200;
            bossRushState.bossHp = 200;
            bossRushState.bossName = "🐉 HẮC LONG ĐẠI SỐ (TRÙM CUỐI)";
            showToast("🔥 CẢNH BÁO: TRÙM CUỐI HẮC LONG ĐÃ XUẤT HIỆN!", false);
            playSound('fanfare');
        } else {
            endBossRushGame(true);
            return;
        }
    }
    
    let q = bossRushState.pool[bossRushState.currentIndex % bossRushState.pool.length];
    bossRushState.currentQuestion = q;
    
    let qContentHtml = typeof getBilingualQuestionHtml === 'function' 
        ? getBilingualQuestionHtml(q, window.APP_LANG) 
        : parseMarkdownSafe(stripQuestionPrefix(q.text || ''));

    let opts = (q.options || ["Đúng", "Sai", "A", "B"]).map((o, optIdx) => {
        let optClean = stripOptionPrefix(o).trim();
        let ansClean = stripOptionPrefix(q.answer || 'Đúng').trim();
        let isC = (optClean.toLowerCase() === ansClean.toLowerCase());
        return { text: o, isCorrect: isC, letter: ['A', 'B', 'C', 'D'][optIdx] || optIdx };
    });

    let heartsHtml = Array.from({ length: bossRushState.maxHp }).map((_, i) => {
        return i < bossRushState.playerHp 
            ? '<i class="fa-solid fa-heart text-rose-500 text-xl drop-shadow-md"></i>' 
            : '<i class="fa-solid fa-heart text-slate-600 text-xl"></i>';
    }).join(' ');

    let bossPercent = Math.max(0, Math.round((bossRushState.bossHp / bossRushState.bossMaxHp) * 100));

    document.getElementById('app-content').innerHTML = \`
        <div id="boss-arena-box" class="w-full max-w-4xl fade-in flex flex-col gap-4">
            <!-- Boss Arena RPG HUD -->
            <div class="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 p-5 rounded-3xl text-white shadow-2xl border-2 border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                    <div class="w-16 h-16 bg-purple-900/80 rounded-2xl border-2 border-purple-400 flex items-center justify-center text-4xl shadow-lg boss-avatar-pulse">
                        \${bossRushState.stage === 3 ? '🐉' : (bossRushState.stage === 2 ? '🛡️' : '👾')}
                    </div>
                    <div>
                        <div class="text-[11px] font-black uppercase tracking-wider text-purple-300">\${bossRushState.bossName}</div>
                        <div class="w-48 sm:w-64 bg-slate-900 rounded-full h-5 overflow-hidden border border-purple-400/50 mt-1 p-0.5 shadow-inner">
                            <div class="boss-hp-bar h-full rounded-full transition-all duration-300" style="width: \${bossPercent}%"></div>
                        </div>
                        <span class="text-xs font-black text-amber-300 font-mono mt-0.5 block">\${bossRushState.bossHp} / \${bossRushState.bossMaxHp} HP (\${bossPercent}%)</span>
                    </div>
                </div>

                <div class="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur">
                    <div>
                        <span class="text-[10px] font-black uppercase text-rose-300 block tracking-wider">Mạng Thí Sinh:</span>
                        <div class="flex gap-1.5 mt-0.5">\${heartsHtml}</div>
                    </div>
                    <button onclick="renderDashboard()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">Thoát</button>
                </div>
            </div>

            <!-- Question Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-slate-200 text-center">
                <div class="text-base md:text-lg font-bold leading-relaxed prose-math text-slate-800">
                    \${qContentHtml}
                </div>
            </div>

            <!-- Choices -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                \${opts.map((opt, i) => \`
                    <button onclick="handleBossRushAnswer(\${opt.isCorrect})" class="p-4 rounded-2xl bg-white hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-500 font-bold text-slate-800 text-left transition shadow-sm flex items-center gap-3.5 btn-3d group">
                        <span class="w-9 h-9 rounded-xl bg-purple-100 group-hover:bg-purple-600 group-hover:text-white font-black text-xs flex items-center justify-center transition shrink-0 shadow-2xs">
                            \${opt.letter}
                        </span>
                        <span class="prose-math text-sm">\${parseMarkdownSafe(stripOptionPrefix(opt.text))}</span>
                    </button>
                \`).join('')}
            </div>
        </div>
    \`;
    triggerMathJax(document.getElementById('app-content'));
}

function handleBossRushAnswer(isCorrect) {
    let arenaBox = document.getElementById('boss-arena-box');
    if (isCorrect) {
        let dmg = 35;
        bossRushState.bossHp = Math.max(0, bossRushState.bossHp - dmg);
        playSound('correct');
        showToast("⚔️ ĐÒN CHÍ MẠNG! Boss bị trừ -" + dmg + " HP!", false);
        if (arenaBox) {
            arenaBox.classList.add('shake-screen');
            setTimeout(() => arenaBox.classList.remove('shake-screen'), 400);
        }
    } else {
        bossRushState.playerHp--;
        playSound('wrong');
        showToast("💥 BỊ TRÚNG ĐÒN! Bạn mất 1 Trái tim ❤️", true);
    }
    bossRushState.currentIndex++;
    renderBossRushScreen();
}

function endBossRushGame(won) {
    if (won) {
        playSound('fanfare');
        document.getElementById('app-content').innerHTML = \`
            <div class="glass-panel p-8 md:p-10 rounded-3xl max-w-md w-full text-center fade-in bg-white/95 shadow-2xl border-4 border-emerald-400">
                <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-5xl shadow-xl shadow-emerald-500/30 animate-bounce">
                    👑
                </div>
                <h2 class="text-2xl font-black text-slate-800 mb-1 font-display uppercase">CHIẾN THẮNG TUYỆT ĐỐI!</h2>
                <p class="text-xs text-slate-500 mb-6 font-medium">Bạn đã đập tan cả 3 Tầng Boss và bảo vệ thành công Đấu trường Toán học!</p>
                <div class="flex flex-col gap-2.5">
                    <button onclick="startBossRushGame()" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md btn-3d">Chơi Lại Ván Mới</button>
                    <button onclick="renderDashboard()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">Về Đấu Trường</button>
                </div>
            </div>
        \`;
    } else {
        playSound('wrong');
        document.getElementById('app-content').innerHTML = \`
            <div class="glass-panel p-8 rounded-3xl max-w-md w-full text-center fade-in bg-white/95 shadow-2xl border-4 border-rose-500">
                <div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner border border-rose-200">
                    💀
                </div>
                <h2 class="text-xl font-black text-slate-800 mb-1 uppercase tracking-wide">BẠN ĐÃ HẾT MẠNG!</h2>
                <p class="text-xs text-slate-500 mb-6 font-medium">Đừng nản lòng, hãy xem lại sổ tay công thức và phục thù nhé!</p>
                <div class="flex flex-col gap-2.5">
                    <button onclick="startBossRushGame()" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md btn-3d">Thử Lại Ngay</button>
                    <button onclick="renderDashboard()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">Về Đấu Trường</button>
                </div>
            </div>
        \`;
    }
}


// --- GAME 4: LẬT THẺ TRÍ NHỚ 3D (3D MEMORY FLIP) ---
let cardFlipState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 6,
    moves: 0,
    isLock: false
};

function startCardFlipGame() {
    state.activeGameMode = 'cardflip';
    let pool = [...(GAME_DATA.round1 || []), ...(GAME_DATA.round3 || [])];
    if (pool.length < 4) {
        showToast("Cần ít nhất 4 câu hỏi để tạo lưới lật thẻ!", true);
        renderDashboard();
        return;
    }
    pool.sort(() => Math.random() - 0.5);
    let selected = pool.slice(0, 6);
    cardFlipState.totalPairs = selected.length;
    cardFlipState.matchedPairs = 0;
    cardFlipState.moves = 0;
    cardFlipState.flippedCards = [];
    cardFlipState.isLock = false;
    
    let rawCards = [];
    selected.forEach((q, idx) => {
        let qText = stripQuestionPrefix(q.text || '').substring(0, 65);
        let aText = stripOptionPrefix(String(q.answer || 'Đáp án')).substring(0, 35);
        rawCards.push({ id: idx, type: 'q', content: qText, pairId: idx });
        rawCards.push({ id: idx, type: 'a', content: '🎯 ' + aText, pairId: idx });
    });
    rawCards.sort(() => Math.random() - 0.5);
    cardFlipState.cards = rawCards.map((c, i) => ({ ...c, uniqueId: i, isFlipped: false, isMatched: false }));
    
    renderCardFlipScreen();
    playSound('powerup');
}
window.startCardFlipGame = startCardFlipGame;

function renderCardFlipScreen() {
    let gridHtml = cardFlipState.cards.map((c, i) => \`
        <div onclick="handleCardFlip(\${i})" class="card-3d-scene aspect-square select-none cursor-pointer">
            <div class="card-3d-object \${c.isFlipped ? 'is-flipped' : ''}">
                <!-- Front Face (When hidden) -->
                <div class="card-3d-face card-3d-front">
                    <div class="flex flex-col items-center justify-center gap-1.5">
                        <i class="fa-solid fa-brain text-2xl text-amber-300"></i>
                        <span class="text-[9px] font-black uppercase text-indigo-300 tracking-wider">TBS 3D</span>
                    </div>
                </div>
                <!-- Back Face (When flipped) -->
                <div class="card-3d-face card-3d-back \${c.isMatched ? 'card-3d-matched' : ''}">
                    <span class="text-xs font-black leading-tight prose-math">\${parseMarkdownSafe(c.content)}</span>
                </div>
            </div>
        </div>
    \`).join('');

    document.getElementById('app-content').innerHTML = \`
        <div class="w-full max-w-3xl fade-in flex flex-col gap-4">
            <div class="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 rounded-3xl text-white shadow-xl flex items-center justify-between border-2 border-emerald-400/40">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md">
                        🃏
                    </div>
                    <div>
                        <div class="text-[10px] font-black uppercase text-emerald-300 tracking-wider">LẬT THẺ TRÍ NHỚ 3D • MEMORY MATCH</div>
                        <div class="text-sm font-black text-white">Ghép đúng: <span class="text-amber-400">\${cardFlipState.matchedPairs} / \${cardFlipState.totalPairs}</span> Cặp • Lượt: \${cardFlipState.moves}</div>
                    </div>
                </div>
                <button onclick="renderDashboard()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">Thoát</button>
            </div>

            <div class="bg-white/95 backdrop-blur p-4 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-2xl grid grid-cols-3 sm:grid-cols-4 gap-3">
                \${gridHtml}
            </div>
        </div>
    \`;
    triggerMathJax(document.getElementById('app-content'));
}

function handleCardFlip(cardIdx) {
    if (cardFlipState.isLock) return;
    let card = cardFlipState.cards[cardIdx];
    if (!card || card.isFlipped || card.isMatched) return;
    
    card.isFlipped = true;
    cardFlipState.flippedCards.push(card);
    playSound('click');
    renderCardFlipScreen();
    
    if (cardFlipState.flippedCards.length === 2) {
        cardFlipState.moves++;
        cardFlipState.isLock = true;
        let [c1, c2] = cardFlipState.flippedCards;
        
        if (c1.pairId === c2.pairId && c1.type !== c2.type) {
            playSound('correct');
            c1.isMatched = true;
            c2.isMatched = true;
            cardFlipState.matchedPairs++;
            cardFlipState.flippedCards = [];
            cardFlipState.isLock = false;
            showToast("🎯 KHỚP CẶP CHÍNH XÁC!", false);
            renderCardFlipScreen();
            
            if (cardFlipState.matchedPairs === cardFlipState.totalPairs) {
                setTimeout(() => {
                    playSound('fanfare');
                    showToast("🏆 HOÀN THÀNH LẬT THẺ TRÍ NHỚ!", false);
                }, 600);
            }
        } else {
            playSound('wrong');
            setTimeout(() => {
                c1.isFlipped = false;
                c2.isFlipped = false;
                cardFlipState.flippedCards = [];
                cardFlipState.isLock = false;
                renderCardFlipScreen();
            }, 800);
        }
    }
}
`;

studentJs = beforePart + newGamesCode;
fs.writeFileSync(studentJsPath, studentJs, 'utf8');
console.log('Successfully replaced game engines in student.js with upgraded Pro Gamification engines!');
