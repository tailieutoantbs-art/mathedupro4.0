// student.js - Student Exam Taking, Anti-cheat & Scoring Engine for EduMath TBS

let GAME_DATA = null;
let state = { 
    currentPlayCode: '', 
    currentSettings: null, 
    studentList: [], 
    studentId: '', 
    studentName: '', 
    studentClass: '', 
    timer: { totalSeconds: 0, remaining: 0, intervalId: null, isRunning: false }, 
    currentRound: null, 
    currentQuestion: null, 
    answeredQuestions: [], 
    userChoices: {}, 
    stats: { round1: { total: 0, correct: 0 }, round2: { total: 0, correct: 0 }, round3: { total: 0, correct: 0 } }, 
    streak: 0, 
    violationCount: 0, 
    shuffledOptions: {}, 
    shuffledQuestions: null, 
    shuffledStatements: {}, 
    powerups: { freeze: 1, fifty: 1 }, 
    score: 0, 
    scoreR1: 0, 
    scoreR2: 0, 
    scoreR3: 0,
    isSubmitted: false
};

async function initStudentApp() {
    // Attempt offline sync if online
    if (typeof syncPendingOfflineSubmissions === 'function') {
        syncPendingOfflineSubmissions().catch(() => {});
    }

    if (window.OFFLINE_GAME_DATA) {
        let bundle = window.OFFLINE_GAME_DATA;
        GAME_DATA = bundle.data;
        state.currentSettings = bundle.settings || { examMode: 'practice', timeLimit: 60 };
        state.currentPlayCode = bundle.code || 'OFFLINE';
        let codeEl = document.getElementById('header-play-code');
        if (codeEl) codeEl.innerText = state.currentPlayCode;
        state.studentList = bundle.studentList || [];
        renderStudentSetupScreen();
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) { window.location.href = 'index.html'; return; }
    state.currentPlayCode = code.toUpperCase();
    let codeEl = document.getElementById('header-play-code');
    if (codeEl) codeEl.innerText = state.currentPlayCode;

    try {
        let snap = await db.collection("SharedGames").doc(state.currentPlayCode).get();
        if(!snap.exists) throw new Error("Đề thi không tồn tại!");
        let d = snap.data(); GAME_DATA = d.data; state.currentSettings = d.settings || {};
        try { let snap = await db.collection("Students").get(); snap.forEach(doc => state.studentList.push(doc.data())); } catch(e){}
        renderStudentSetupScreen();
    } catch(e) { alert(e.message); window.location.href = 'index.html'; }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initStudentApp();
} else {
    document.addEventListener('DOMContentLoaded', initStudentApp);
    window.addEventListener('load', initStudentApp);
}

function renderStudentSetupScreen() {
    let authUser = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
    let modeBadge = (state.currentSettings && state.currentSettings.examMode === 'exam')
        ? `<div class="bg-rose-50 text-rose-600 px-4 py-1 inline-block font-bold text-xs rounded-full border border-rose-200 shadow-sm"><i class="fa-solid fa-lock mr-1"></i> Chế độ Thi nghiêm túc</div>`
        : `<div class="bg-sky-50 text-main px-4 py-1 inline-block font-bold text-xs rounded-full border border-sky-200 shadow-sm"><i class="fa-solid fa-gamepad mr-1"></i> Chế độ Luyện tập</div>`;

    if (authUser && authUser.role === 'student' && authUser.id) {
        state.studentId = authUser.id;
        state.studentName = authUser.name || authUser.id;
        state.studentClass = authUser.cls || 'Lớp TBS';

        document.getElementById('app-content').innerHTML = `
            <div class="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-md text-center fade-in border-t-4 border-main bg-white/90 shadow-2xl">
                <div class="w-16 h-16 bg-sky-100 text-main rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner border border-sky-200">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
                <h2 class="text-2xl font-black text-slate-800 mb-1">XÁC NHẬN THÍ SINH</h2>
                <div class="mb-5">${modeBadge}</div>
                
                <div class="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 text-left mb-6 space-y-1.5 shadow-inner">
                    <div class="text-xs font-bold text-slate-500 uppercase">Họ và tên thí sinh:</div>
                    <div class="text-lg font-black text-main flex items-center justify-between">
                        <span>${state.studentName}</span>
                        <span class="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-slate-700">${state.studentClass}</span>
                    </div>
                    <div class="text-xs font-mono font-bold text-slate-500 pt-1 border-t border-sky-200/60">Mã ID: <b>${state.studentId}</b></div>
                </div>

                <div class="flex flex-col gap-2.5">
                    <button onclick="proceedToGame()" class="w-full py-3.5 bg-gradient-to-r from-sky-500 to-mainDark hover:from-sky-600 hover:to-mainDark text-white font-black rounded-2xl text-base shadow-lg transition btn-3d tracking-wider uppercase">
                        <i class="fa-solid fa-play mr-2"></i> BẮT ĐẦU LÀM BÀI
                    </button>
                    <button onclick="openStudentChangePasswordModal()" class="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-xs transition border border-amber-200 flex items-center justify-center gap-1.5 shadow-2xs">
                        <i class="fa-solid fa-key text-amber-600"></i> Đổi Mật Khẩu Cá Nhân
                    </button>
                    <button onclick="logoutStudentExam()" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition">
                        Đổi tài khoản khác
                    </button>
                </div>
            </div>
        `;
        return;
    }

    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-md text-center fade-in border-t-4 border-main bg-white/90 shadow-2xl">
            <h2 class="text-2xl font-black text-slate-700 mb-1">ĐĂNG NHẬP THÍ SINH</h2>
            <div class="mb-6">${modeBadge}</div>
            <div class="space-y-4 text-left">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã định danh Học sinh (ID):</label>
                    <input type="text" id="indiv-id" placeholder="Nhập ID số..." class="w-full p-3 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 outline-none focus:border-main uppercase tracking-wider shadow-sm" oninput="handleIdInput()">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mật mã bảo vệ bài thi cá nhân:</label>
                    <input type="password" id="student-personal-password" placeholder="Nhập mật mã của bạn..." class="w-full p-3 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 outline-none focus:border-main shadow-sm">
                </div>
                <div id="student-info-display" class="hidden bg-sky-50 p-3 rounded-xl border border-sky-100 text-center">
                    <span id="display-name" class="font-black text-main text-base block"></span>
                    <span id="display-class" class="text-xs font-bold text-slate-500"></span>
                </div>
            </div>
            <button onclick="checkResumeGame()" class="w-full mt-6 py-3.5 bg-main text-white font-black rounded-xl text-base hover:bg-mainDark btn-3d tracking-wider uppercase">Bắt đầu làm bài</button>
        </div>
    `;
}

function logoutStudentExam() {
    if (typeof clearAuthUser === 'function') clearAuthUser();
    window.location.href = 'index.html';
}

function handleIdInput() {
    let val = document.getElementById('indiv-id').value.trim();
    let box = document.getElementById('student-info-display');
    if(!val || !state.studentList.length) { box.classList.add('hidden'); return; }
    let found = state.studentList.find(s => String(s.id).toLowerCase() === val.toLowerCase());
    if(found) {
        document.getElementById('display-name').innerText = found.name;
        document.getElementById('display-class').innerText = "Lớp: " + found.cls;
        state.studentName = found.name; state.studentClass = found.cls; box.classList.remove('hidden');
    } else { box.classList.add('hidden'); state.studentName = ''; }
}

async function checkResumeGame() {
    let sId = document.getElementById('indiv-id').value.trim().toUpperCase();
    let sPw = document.getElementById('student-personal-password').value.trim();
    if(!sId) { showToast("Vui lòng nhập Mã ID hoặc Tên thí sinh!", true); return; }

    if (window.OFFLINE_GAME_DATA || typeof firebase === 'undefined' || !window.db) {
        state.studentId = sId;
        state.studentName = state.studentName || sId;
        state.studentClass = state.studentClass || "Lớp Tự Do";
        if (typeof saveAuthUser === 'function') {
            saveAuthUser({ role: 'student', id: sId, name: state.studentName, cls: state.studentClass });
        }
        proceedToGame();
        return;
    }

    if(!sPw) { showToast("Vui lòng điền mật mã bảo mật!", true); return; }

    let btn = document.querySelector('button[onclick="checkResumeGame()"]');
    let oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang kiểm tra...';
    btn.disabled = true;

    try {
        let docSnap = await db.collection("Students").doc(sId).get();
        if (!docSnap.exists) {
            throw new Error("Không tìm thấy mã học sinh này!");
        }
        let sData = docSnap.data();
        let validPw = sData.password || 'hungtbs';
        if (validPw !== sPw && sData.password !== sPw) {
            throw new Error("Mật mã không chính xác!");
        }
        
        state.studentId = sData.id;
        state.studentName = sData.name;
        state.studentClass = sData.cls;

        if (typeof saveAuthUser === 'function') {
            saveAuthUser({ role: 'student', id: sData.id, name: sData.name, cls: sData.cls });
        }

        if (!sData.password || sData.password === 'hungtbs' || sData.password === '123456') {
            document.getElementById('app-content').innerHTML = `
                <div class="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-md text-center fade-in border-t-4 border-amber-500 bg-white/90 shadow-2xl">
                    <div class="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                        <i class="fa-solid fa-key"></i>
                    </div>
                    <h2 class="text-2xl font-black text-amber-600 mb-1 uppercase tracking-wide">ĐỔI MẬT KHẨU MỚI</h2>
                    <p class="text-xs font-bold text-slate-500 mb-6">Tài khoản đang dùng mật khẩu mặc định (hungtbs). Hãy đổi để bảo mật hơn!</p>
                    <div class="space-y-4 text-left">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mật khẩu mới:</label>
                            <input type="password" id="new-password" placeholder="Nhập mật khẩu mới" class="w-full p-3 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 outline-none focus:border-amber-500 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nhập lại mật khẩu mới:</label>
                            <input type="password" id="new-password-confirm" placeholder="Nhập lại mật khẩu mới" class="w-full p-3 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 outline-none focus:border-amber-500 shadow-sm">
                        </div>
                    </div>
                    <div class="mt-6 space-y-2.5">
                        <button onclick="submitNewPassword()" class="w-full py-3.5 bg-amber-500 text-white font-black rounded-xl text-sm hover:bg-amber-600 btn-3d tracking-wider uppercase flex items-center justify-center gap-2">
                            <i class="fa-solid fa-check"></i> Cập Nhật & Vào Thi
                        </button>
                        <button onclick="proceedToGame()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-forward"></i> Bỏ qua & Vào thi ngay (Dùng tiếp hungtbs)
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        proceedToGame();

    } catch(e) {
        showToast(e.message, true);
    } finally {
        btn.innerHTML = oldHtml;
        btn.disabled = false;
    }
}

async function submitNewPassword() {
    let p1 = document.getElementById('new-password').value.trim();
    let p2 = document.getElementById('new-password-confirm').value.trim();
    if (!p1 || !p2) return showToast("Vui lòng điền đủ 2 ô!", true);
    if (p1 !== p2) return showToast("Mật khẩu không khớp!", true);
    if (p1 === 'hungtbs' || p1 === '123456') return showToast("Vui lòng chọn mật khẩu khác 'hungtbs'!", true);
    if (p1.length < 3) return showToast("Mật khẩu phải từ 3 ký tự trở lên!", true);

    let btn = document.querySelector('button[onclick="submitNewPassword()"]');
    let oldHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang lưu...';
        btn.disabled = true;
    }

    try {
        await db.collection("Students").doc(state.studentId).update({ password: p1 });
        showToast("Đổi mật khẩu thành công!");
        proceedToGame();
    } catch(e) {
        showToast("Có lỗi xảy ra: " + e.message, true);
        if (btn) {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
        }
    }
}

function openStudentChangePasswordModal() {
    let modal = document.getElementById('student-change-pw-modal');
    if (!modal) return;
    let nameEl = document.getElementById('change-pw-student-name');
    let idEl = document.getElementById('change-pw-student-id');
    if (nameEl) nameEl.innerText = state.studentName || state.studentId || "Thí sinh";
    if (idEl) idEl.innerText = state.studentId || "---";
    
    let curr = document.getElementById('modal-curr-password');
    let p1 = document.getElementById('modal-new-password');
    let p2 = document.getElementById('modal-new-password-confirm');
    if (curr) curr.value = '';
    if (p1) p1.value = '';
    if (p2) p2.value = '';
    
    modal.classList.remove('hidden');
}

function closeStudentChangePasswordModal() {
    let modal = document.getElementById('student-change-pw-modal');
    if (modal) modal.classList.add('hidden');
}

async function submitStudentChangePasswordModal() {
    let curr = document.getElementById('modal-curr-password')?.value.trim();
    let p1 = document.getElementById('modal-new-password')?.value.trim();
    let p2 = document.getElementById('modal-new-password-confirm')?.value.trim();
    
    if (!state.studentId) {
        showToast("Chưa xác định tài khoản thí sinh!", true);
        return;
    }
    if (!curr) {
        showToast("Vui lòng nhập mật khẩu hiện tại!", true);
        return;
    }
    if (!p1 || !p2) {
        showToast("Vui lòng điền đầy đủ mật khẩu mới!", true);
        return;
    }
    if (p1 !== p2) {
        showToast("Mật khẩu mới và xác nhận mật khẩu không khớp!", true);
        return;
    }
    if (p1.length < 3) {
        showToast("Mật khẩu mới phải từ 3 ký tự trở lên!", true);
        return;
    }
    if (p1 === curr) {
        showToast("Mật khẩu mới phải khác mật khẩu hiện tại!", true);
        return;
    }

    let btn = document.getElementById('btn-submit-modal-change-pw');
    let oldHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Đang lưu...';
        btn.disabled = true;
    }

    try {
        if (window.db) {
            let docSnap = await db.collection("Students").doc(state.studentId).get();
            if (!docSnap.exists) {
                let qSnap = await db.collection("Students").where("id", "==", state.studentId).get();
                if (qSnap.empty) throw new Error("Không tìm thấy dữ liệu học sinh trên hệ thống!");
                docSnap = qSnap.docs[0];
            }
            let sData = docSnap.data();
            let validPw = sData.password || 'hungtbs';
            if (curr !== validPw && curr !== sData.password) {
                throw new Error("Mật khẩu hiện tại không chính xác!");
            }
            await docSnap.ref.update({ password: p1 });
        } else {
            showToast("Đang ở chế độ Offline: Đã cập nhật mật khẩu tạm thời!");
        }

        showToast("✅ Đổi mật khẩu thành công!");
        playSound('correct');
        closeStudentChangePasswordModal();
    } catch(e) {
        showToast("Lỗi: " + (e.message || "Không thể đổi mật khẩu"), true);
        playSound('wrong');
    } finally {
        if (btn) {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
        }
    }
}

function proceedToGame() {
    let nameEl = document.getElementById('header-student-name');
    if (nameEl) nameEl.innerText = state.studentName ? `${state.studentName} (${state.studentClass})` : `ID: ${state.studentId}`;
    
    let cacheKey = 'math_tbs_progress_' + state.currentPlayCode + '_' + state.studentId;
    let cacheStr = localStorage.getItem(cacheKey);
    if(cacheStr) {
        try {
            let cache = JSON.parse(cacheStr);
            let ansCount = (cache.answeredQuestions || []).length;
            let mins = Math.floor((cache.timer || 0) / 60);
            let secs = (cache.timer || 0) % 60;
            let resumeDesc = document.querySelector('#resume-confirm-modal p');
            if (resumeDesc) {
                resumeDesc.innerHTML = `Hệ thống phát hiện phiên làm bài trước: <b>${ansCount} câu đã làm</b>, thời gian còn <b>${mins} phút ${secs} giây</b>. Bạn muốn tiếp tục hay làm lại từ đầu?`;
            }
        } catch(e){}
        document.getElementById('resume-confirm-modal').classList.remove('hidden');
    } else { 
        startGame(false); 
    }
}

window.addEventListener('beforeunload', () => {
    if (state.timer && state.timer.isRunning && !state.isSubmitted) {
        saveProgress();
    }
});

function startGame(resume = false) {
    document.getElementById('resume-confirm-modal').classList.add('hidden');
    if(resume) {
        let cache = JSON.parse(localStorage.getItem('math_tbs_progress_' + state.currentPlayCode + '_' + state.studentId));
        state.score = cache.score; state.scoreR1 = cache.scoreR1||0; state.scoreR2 = cache.scoreR2||0; state.scoreR3 = cache.scoreR3||0;
        state.timer.remaining = cache.timer; state.answeredQuestions = cache.answeredQuestions||[];
        state.userChoices = cache.userChoices||{}; state.stats = cache.stats; state.streak = cache.streak||0;
        state.shuffledOptions = cache.shuffledOptions||{}; state.powerups = cache.powerups;
        state.shuffledQuestions = cache.shuffledQuestions || null;
        state.shuffledStatements = cache.shuffledStatements || {};
    } else {
        state.timer.remaining = (state.currentSettings && state.currentSettings.timeLimit) ? state.currentSettings.timeLimit * 60 : 3600;
        let shuffleArr = (arr) => { let a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
        state.shuffledQuestions = {
            round1: shuffleArr((GAME_DATA.round1||[]).map(q=>q.id)),
            round2: shuffleArr((GAME_DATA.round2||[]).map(q=>q.id)),
            round3: shuffleArr((GAME_DATA.round3||[]).map(q=>q.id))
        };
        state.shuffledStatements = {};
    }
    if(state.shuffledQuestions) {
        let sR = state.shuffledQuestions;
        if(GAME_DATA.round1) GAME_DATA.round1.sort((a,b) => sR.round1.indexOf(a.id) - sR.round1.indexOf(b.id));
        if(GAME_DATA.round2) GAME_DATA.round2.sort((a,b) => sR.round2.indexOf(a.id) - sR.round2.indexOf(b.id));
        if(GAME_DATA.round3) GAME_DATA.round3.sort((a,b) => sR.round3.indexOf(a.id) - sR.round3.indexOf(b.id));
    }
    document.getElementById('scoreboard').classList.remove('hidden');
    document.getElementById('timer-container').classList.remove('hidden');

    if(state.currentSettings && state.currentSettings.examMode !== 'exam') document.getElementById('streak-indicator').classList.remove('hidden');
    
    applyHamburgerMenuVisibility();
    try {
        if (window.db) {
            db.collection("GameData").doc("SystemSettings").onSnapshot(doc => {
                if (doc.exists && doc.data().showHamburgerMenu !== undefined) {
                    let isShow = doc.data().showHamburgerMenu;
                    localStorage.setItem('showHamburgerMenu', isShow ? 'true' : 'false');
                    applyHamburgerMenuVisibility();
                }
            });
        }
    } catch(e){}
    updateStreakDisplay();
    setupAntiCheat(); startTimer(); updateScoreUI();
    
    // Auto-launch requested Game Mode if specified in URL or exam settings
    const urlParams = new URLSearchParams(window.location.search);
    let targetGame = urlParams.get('game') || (state.currentSettings && state.currentSettings.gameMode);
    if (targetGame) {
        let tg = String(targetGame).toLowerCase();
        if (tg.includes('millionaire')) {
            startMillionaireGame();
            return;
        } else if (tg.includes('speed')) {
            startSpeedRunGame();
            return;
        } else if (tg.includes('boss')) {
            startBossRushGame();
            return;
        } else if (tg.includes('card')) {
            startCardFlipGame();
            return;
        }
    }
    renderDashboard();
}

function applyHamburgerMenuVisibility() {
    let show = localStorage.getItem('showHamburgerMenu') !== 'false';
    let floatBtn = document.getElementById('floating-menu-btn');
    let persistentMenu = document.getElementById('persistent-dropdown-menu');
    let headerBtn = document.getElementById('btn-header-hamburger');
    if (floatBtn) floatBtn.style.display = show ? '' : 'none';
    if (headerBtn) headerBtn.style.display = show ? '' : 'none';
    if (!show && persistentMenu) persistentMenu.classList.add('hidden');
}

function toggleHeaderVisibility() {
    let header = document.querySelector('header');
    let floatingContainer = document.getElementById('floating-hamburger-container');
    let statusEl = document.getElementById('menu-header-status');
    if (header) {
        let isHidden = header.classList.toggle('hidden');
        if (floatingContainer) {
            if (isHidden) floatingContainer.classList.remove('hidden');
            else floatingContainer.classList.add('hidden');
        }
        if (statusEl) {
            statusEl.innerText = isHidden ? 'Ẩn' : 'Hiện';
        }
    }
}

function updateStreakDisplay() {
    let indicator = document.getElementById('streak-indicator');
    let countEl = document.getElementById('streak-count');
    if (countEl) countEl.innerText = state.streak;
    if (indicator) {
        if (state.streak >= 2) {
            indicator.classList.remove('hidden', 'streak-level-1', 'streak-level-2', 'streak-level-3');
            if (state.streak >= 10) {
                indicator.classList.add('streak-level-3');
            } else if (state.streak >= 5) {
                indicator.classList.add('streak-level-2');
            } else {
                indicator.classList.add('streak-level-1');
            }
        } else {
            indicator.classList.add('hidden');
        }
    }
}

function triggerComboNotification(count) {
    if (count < 2) return;
    let comboText = `🔥 COMBO x${count}!`;
    if (count >= 10) comboText = `⚡ THẦN THOẠI COMBO x${count}! 👑`;
    else if (count >= 5) comboText = `⚡ THẦN TỐC COMBO x${count}! 🚀`;
    else if (count >= 3) comboText = `🔥 SIÊU COMBO x${count}! 💥`;

    let comboEl = document.createElement('div');
    comboEl.className = 'fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100000] pointer-events-none animate-bounce flex flex-col items-center';
    comboEl.innerHTML = `
        <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white px-8 py-4 rounded-3xl shadow-2xl border-4 border-white font-black text-2xl md:text-3xl tracking-wider uppercase drop-shadow-2xl flex items-center gap-3">
            <i class="fa-solid fa-fire text-amber-300 text-3xl animate-pulse"></i>
            <span>${comboText}</span>
        </div>
    `;
    document.body.appendChild(comboEl);
    try { 
        triggerConfetti(); 
        playSynthSound('streak');
    } catch(e){}
    setTimeout(() => comboEl.remove(), 1600);
}

let _antiCheatBlurTimeout = null;

function preventDevKeys(e) {
    if (state.currentSettings && state.currentSettings.examMode === 'exam' && !state.isSubmitted) {
        // F12 or Ctrl+Shift+I or Ctrl+Shift+J or Ctrl+Shift+C or Ctrl+U or Ctrl+S
        if (
            e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
            (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))
        ) {
            e.preventDefault();
            e.stopPropagation();
            showToast("⚠️ Chế độ Thi nghiêm túc: Đã khóa phím tắt nhà phát triển & lưu trang!", true);
            return false;
        }
    }
}

function preventContextMenu(e) {
    if (state.currentSettings && state.currentSettings.examMode === 'exam' && !state.isSubmitted) {
        e.preventDefault();
        showToast("⚠️ Chế độ Thi nghiêm túc: Vui lòng không dùng chuột phải!", true);
        return false;
    }
}

function handleWindowBlur() {
    if (state.isSubmitted) return;
    if (state.currentSettings && state.currentSettings.examMode === 'exam') {
        if (_antiCheatBlurTimeout) clearTimeout(_antiCheatBlurTimeout);
        _antiCheatBlurTimeout = setTimeout(() => {
            if (document.hidden || !document.hasFocus()) {
                handleViolation("Rời khỏi cửa sổ bài thi");
            }
        }, 400);
    }
}

function handleVisibilityChange() {
    if (state.isSubmitted) return;
    if (document.visibilityState === 'hidden') {
        handleViolation("Chuyển tab hoặc ẩn trình duyệt");
    }
}

function handleViolation(reason = "Chuyển tab") {
    if (state.isSubmitted) return;
    let limit = 3;
    state.violationCount = (state.violationCount || 0) + 1;
    saveProgress();
    
    if (state.violationCount >= limit) {
        showToast(`🚨 Đã vi phạm quy chế thi ${state.violationCount}/${limit} lần (${reason}). Hệ thống tự động nộp bài!`, true);
        forceSubmitScore();
    } else {
        let maxDisp = document.getElementById('violation-max-display');
        let cntDisp = document.getElementById('violation-count-display');
        if (maxDisp) maxDisp.innerText = limit;
        if (cntDisp) cntDisp.innerText = state.violationCount;
        document.getElementById('cheat-warning-modal')?.classList.remove('hidden');
        showToast(`⚠️ Cảnh báo vi phạm lần ${state.violationCount}/${limit}: ${reason}`, true);
        playSound('wrong');
    }
}

function setupAntiCheat() {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleWindowBlur);
    document.removeEventListener("keydown", preventDevKeys);
    document.removeEventListener("contextmenu", preventContextMenu);

    if (state.currentSettings && state.currentSettings.examMode === 'exam') {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);
        document.addEventListener("keydown", preventDevKeys);
        document.addEventListener("contextmenu", preventContextMenu);
    }
}

function startTimer() {
    state.timer.isRunning = true;
    state.timer.intervalId = setInterval(() => {
        state.timer.remaining--; updateTimerDisplay();
        if(state.timer.remaining % 5 === 0) { 
            saveProgress();
        }
        if(state.timer.remaining <= 60 && state.timer.remaining > 0) { playSynthSound('tick'); }
        if(state.timer.remaining <= 0) { forceSubmitScore(); }
    }, 1000);
}

function updateTimerDisplay() {
    let disp = document.getElementById('timer-display');
    if (disp) {
        disp.innerText = `${Math.floor(state.timer.remaining / 60).toString().padStart(2, '0')}:${(state.timer.remaining % 60).toString().padStart(2, '0')}`;
        if (state.timer.remaining <= 300) {
            disp.classList.add('text-rose-600', 'animate-pulse');
        }
    }
}

function updateScoreUI() {
    let totalScoreEl = document.getElementById('student-total-score');
    if (totalScoreEl) totalScoreEl.innerText = state.score;
}

function renderDashboard() {
    state.currentRound = null; state.currentQuestion = null;
    let r1Count = (GAME_DATA.round1 || []).length;
    let r2Count = (GAME_DATA.round2 || []).length;
    let r3Count = (GAME_DATA.round3 || []).length;
    let totalQuestions = r1Count + r2Count + r3Count;

    let ansCount = state.answeredQuestions.filter(k => k.startsWith('round1_') || k.startsWith('round3_')).length;
    (GAME_DATA.round2 || []).forEach(q => {
        if ([0,1,2,3].every(i => state.answeredQuestions.includes(`round2_${q.id}_${i}`))) ansCount++;
    });

    let progressPercent = totalQuestions > 0 ? Math.round((ansCount / totalQuestions) * 100) : 0;
    
    let isRev = state.isSubmitted;
    let isPracticeArena = (!isRev && state.currentSettings && state.currentSettings.examMode !== 'exam');


    // In Review Mode, compute stats per round
    let r1Correct = 0, r2FullCorrect = 0, r3Correct = 0;
    if (isRev) {
        (GAME_DATA.round1 || []).forEach(q => {
            if (state.userChoices[`round1_${q.id}`]?.isCorrect) r1Correct++;
        });
        (GAME_DATA.round2 || []).forEach(q => {
            let correctStmts = 0;
            for(let j=0; j<4; j++) {
                if (state.userChoices[`round2_${q.id}_${j}`]?.isCorrect) correctStmts++;
            }
            if (correctStmts === 4) r2FullCorrect++;
        });
        (GAME_DATA.round3 || []).forEach(q => {
            if (state.userChoices[`round3_${q.id}`]?.isCorrect) r3Correct++;
        });
    }

    let reviewHeroBanner = isRev ? `
        <!-- Review Mode Hero Header -->
        <div class="mb-6 p-5 md:p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl border-2 border-indigo-400/50 text-left">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-check"></i> Đã hoàn thành bài thi
                        </span>
                        <span class="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full font-bold text-xs">
                            <i class="fa-solid fa-eye mr-1"></i> Chế độ xem lại bài làm
                        </span>
                    </div>
                    <h3 class="text-xl md:text-2xl font-black font-display text-white mt-1">Bảng Tổng Hợp Kết Quả & Lời Giải</h3>
                    <p class="text-xs text-indigo-200 font-medium">Bấm vào từng phần dưới đây để xem lại chi tiết từng câu, phân tích lỗi sai và lời giải chuẩn.</p>
                </div>
                <div class="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/15">
                    <div class="text-right">
                        <div class="text-[10px] font-black uppercase text-indigo-300 tracking-wider">TỔNG ĐIỂM</div>
                        <div class="text-3xl font-black text-amber-300 font-display">${state.score} <span class="text-sm font-bold text-white">/ 10.0</span></div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2.5">
                <button onclick="document.getElementById('stats-modal').classList.remove('hidden'); playSound('click');" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider transition btn-3d shadow-sm flex items-center gap-1.5">
                    <i class="fa-solid fa-trophy text-amber-800"></i> Xem Xếp Hạng & Bảng Điểm
                </button>
                <button onclick="printSubmissionReport()" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition btn-3d shadow-sm flex items-center gap-1.5">
                    <i class="fa-solid fa-print"></i> In / Xuất Phiếu Điểm PDF
                </button>
                <button onclick="exportSubmissionJSON()" class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition btn-3d shadow-sm flex items-center gap-1.5">
                    <i class="fa-solid fa-file-export"></i> Tải file JSON
                </button>
                <button onclick="openStudentExamHistoryModal()" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition border border-white/20 flex items-center gap-1.5">
                    <i class="fa-solid fa-clock-rotate-left"></i> Lịch sử thi
                </button>
            </div>
        </div>
    ` : `
        <!-- Progress Energy Header -->
        <div class="mb-6 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div class="flex justify-between items-center text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                <span class="flex items-center gap-1.5"><i class="fa-solid fa-battery-half text-indigo-600"></i> Tiến độ làm bài:</span>
                <span class="text-indigo-600 font-bold font-mono text-sm">${ansCount} / ${totalQuestions} câu (${progressPercent}%)</span>
            </div>
            <div class="energy-bar-container">
                <div class="energy-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
        </div>
    `;

    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-4xl text-center fade-in bg-white/90 shadow-2xl border-t-4 border-indigo-600">
            ${reviewHeroBanner}

            <!-- Banner Sổ Tay Lý Thuyết Trọng Tâm (Scaffolding Theory Access) -->
            <div class="mb-6 p-4 md:p-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-indigo-300/40">
                <div class="flex items-center gap-3.5 text-left">
                    <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl text-amber-300 shrink-0 border border-white/20">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <div class="text-[10px] uppercase font-black tracking-widest text-indigo-200">${isRev ? 'Tra Cứu Kiến Thức • Sổ Tay' : 'Ôn Tập Trước Khi Thi • Scaffolding'}</div>
                        <h3 class="text-base md:text-lg font-black font-display leading-snug">${(GAME_DATA.theory && GAME_DATA.theory.title) ? GAME_DATA.theory.title : 'Sổ Tay Lý Thuyết & Công Thức Cốt Lõi'}</h3>
                        <p class="text-xs text-indigo-100 font-medium">Khái niệm, công thức then chốt, phương pháp giải và lưu ý bẫy sai lầm.</p>
                    </div>
                </div>
                <button onclick="openStudentTheoryModal(); playSound('click');" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition shrink-0 btn-3d flex items-center gap-2">
                    <i class="fa-solid fa-book-open text-sm"></i> Xem Sổ Tay
                </button>
            </div>

            
            ${isPracticeArena ? `
                <!-- ARENA MODES HUB: 5 HOT GAME ENGINES -->
                <div class="mb-8 p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl text-white shadow-2xl border-2 border-indigo-400/50 text-left">
                    <div class="flex items-center justify-between mb-4 border-b border-indigo-500/30 pb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-md">🎮</span>
                            <div>
                                <h3 class="text-lg font-black tracking-wide font-display text-amber-300 uppercase">ĐẤU TRƯỜNG LUYỆN TẬP TOÁN HỌC</h3>
                                <p class="text-xs text-indigo-200">Chọn 1 trong 5 hình thức ôn luyện & Mini Game để củng cố kiến thức:</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <!-- Mode 1: Ai Là Triệu Phú -->
                        <div onclick="startMillionaireGame()" class="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer transition hover:scale-[1.03] shadow-md flex flex-col justify-between group">
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow-sm group-hover:rotate-6 transition">🏆</span>
                                <div class="font-black text-xs text-amber-300 uppercase">Ai Là Triệu Phú</div>
                            </div>
                            <p class="text-[11px] text-slate-300 font-medium mb-3">15 Mốc thưởng (100k - 150M), 4 Quyền trợ giúp.</p>
                            <span class="w-full py-1.5 bg-amber-400 text-slate-950 rounded-xl text-[11px] font-black text-center shadow-xs">VÀO ĐẤU TRƯỜNG</span>
                        </div>

                        <!-- Mode 2: Đua Tốc Độ -->
                        <div onclick="startSpeedRunGame()" class="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer transition hover:scale-[1.03] shadow-md flex flex-col justify-between group">
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-9 h-9 rounded-xl bg-rose-500 text-white font-black text-base flex items-center justify-center shadow-sm group-hover:rotate-6 transition">⚡</span>
                                <div class="font-black text-xs text-rose-300 uppercase">Đua Tốc Độ (60s)</div>
                            </div>
                            <p class="text-[11px] text-slate-300 font-medium mb-3">Đếm ngược 60s, đúng +3s & nhân Combo, sai -5s.</p>
                            <span class="w-full py-1.5 bg-rose-500 text-white rounded-xl text-[11px] font-black text-center shadow-xs">BẮT ĐẦU ĐUA</span>
                        </div>

                        <!-- Mode 3: Vượt Ải Diệt Boss -->
                        <div onclick="startBossRushGame()" class="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer transition hover:scale-[1.03] shadow-md flex flex-col justify-between group">
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-9 h-9 rounded-xl bg-purple-500 text-white font-black text-base flex items-center justify-center shadow-sm group-hover:rotate-6 transition">⚔️</span>
                                <div class="font-black text-xs text-purple-300 uppercase">Diệt Boss (3 HP)</div>
                            </div>
                            <p class="text-[11px] text-slate-300 font-medium mb-3">3 Mạng trái tim, hạ gục 3 Tầng Boss Toán học.</p>
                            <span class="w-full py-1.5 bg-purple-500 text-white rounded-xl text-[11px] font-black text-center shadow-xs">KHIÊU CHIẾN BOSS</span>
                        </div>

                        <!-- Mode 4: Lật Thẻ Trí Nhớ -->
                        <div onclick="startCardFlipGame()" class="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer transition hover:scale-[1.03] shadow-md flex flex-col justify-between group">
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-9 h-9 rounded-xl bg-emerald-500 text-white font-black text-base flex items-center justify-center shadow-sm group-hover:rotate-6 transition">🃏</span>
                                <div class="font-black text-xs text-emerald-300 uppercase">Lật Thẻ Trí Nhớ</div>
                            </div>
                            <p class="text-[11px] text-slate-300 font-medium mb-3">Lưới 3D ghép đôi Đề bài & Đáp án công thức.</p>
                            <span class="w-full py-1.5 bg-emerald-500 text-white rounded-xl text-[11px] font-black text-center shadow-xs">LẬT THẺ NGAY</span>
                        </div>
                    </div>
                </div>
            ` : ''}

            <h2 class="text-xl font-black text-slate-800 mb-6 uppercase tracking-wider font-display flex items-center justify-center gap-2">
                <i class="fa-solid fa-layer-group text-indigo-600"></i> ${isRev ? 'DANH SÁCH CÁC PHẦN BÀI THI' : 'CẤU TRÚC ĐỀ THI 3 PHẦN'}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div onclick="selectRound('round1'); playSound('click');" class="bg-gradient-to-br from-sky-50 to-white p-6 rounded-3xl cursor-pointer hover:border-indigo-500 border-2 transition-all duration-300 shadow-md border-slate-200 group hover:shadow-xl hover:-translate-y-1">
                    <div class="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-list-check"></i></div>
                    <h3 class="font-black text-slate-800 text-base mb-1">Phần I: Trắc nghiệm</h3>
                    <p class="text-xs text-slate-500 font-medium mb-3">4 lựa chọn (A, B, C, D)</p>
                    ${isRev ? `
                        <div class="flex flex-col gap-1 items-center">
                            <span class="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-black rounded-full shadow-2xs">${state.scoreR1} điểm</span>
                            <span class="text-[11px] font-bold text-slate-500">Đúng: <b class="text-emerald-600">${r1Correct}</b>/${r1Count} câu</span>
                        </div>
                    ` : `
                        <span class="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-black rounded-full shadow-2xs">${r1Count} Câu hỏi</span>
                    `}
                </div>

                <div onclick="selectRound('round2'); playSound('click');" class="bg-gradient-to-br from-amber-50 to-white p-6 rounded-3xl cursor-pointer hover:border-amber-500 border-2 transition-all duration-300 shadow-md border-slate-200 group hover:shadow-xl hover:-translate-y-1">
                    <div class="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-check-double"></i></div>
                    <h3 class="font-black text-slate-800 text-base mb-1">Phần II: Đúng / Sai</h3>
                    <p class="text-xs text-slate-500 font-medium mb-3">4 mệnh đề con (a, b, c, d)</p>
                    ${isRev ? `
                        <div class="flex flex-col gap-1 items-center">
                            <span class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full shadow-2xs">${state.scoreR2} điểm</span>
                            <span class="text-[11px] font-bold text-slate-500">Đúng trọn vẹn: <b class="text-emerald-600">${r2FullCorrect}</b>/${r2Count} câu</span>
                        </div>
                    ` : `
                        <span class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full shadow-2xs">${r2Count} Đơn vị câu</span>
                    `}
                </div>

                <div onclick="selectRound('round3'); playSound('click');" class="bg-gradient-to-br from-rose-50 to-white p-6 rounded-3xl cursor-pointer hover:border-rose-500 border-2 transition-all duration-300 shadow-md border-slate-200 group hover:shadow-xl hover:-translate-y-1">
                    <div class="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-keyboard"></i></div>
                    <h3 class="font-black text-slate-800 text-base mb-1">Phần III: Trả lời ngắn</h3>
                    <p class="text-xs text-slate-500 font-medium mb-3">Nhập kết quả số hoặc biểu thức</p>
                    ${isRev ? `
                        <div class="flex flex-col gap-1 items-center">
                            <span class="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-full shadow-2xs">${state.scoreR3} điểm</span>
                            <span class="text-[11px] font-bold text-slate-500">Đúng: <b class="text-emerald-600">${r3Correct}</b>/${r3Count} câu</span>
                        </div>
                    ` : `
                        <span class="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-full shadow-2xs">${r3Count} Câu hỏi số</span>
                    `}
                </div>
            </div>
        </div>
    `;
}

function enterReviewMode() {
    state.isSubmitted = true;
    renderDashboard();
}

function selectRound(roundId) {
    state.currentRound = roundId;
    let isRev = state.isSubmitted;
    
    let btns = (GAME_DATA[roundId]||[]).map((q, index) => {
        let isAns = (roundId==='round1'||roundId==='round3') 
            ? state.answeredQuestions.includes(`${roundId}_${q.id}`) 
            : [0,1,2,3].every(i=>state.answeredQuestions.includes(`round2_${q.id}_${i}`));
        
        let btnCls = "bg-white text-slate-700 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 shadow-xs";
        let statusBadge = "";

        if (isRev) {
            if (roundId === 'round1') {
                let choice = state.userChoices[`round1_${q.id}`];
                if (!choice) {
                    btnCls = "bg-slate-100 text-slate-400 border-dashed border-slate-300"; // Chưa làm
                    statusBadge = `<span class="text-[9px] block font-bold text-slate-400">Bỏ trống</span>`;
                } else if (choice.isCorrect) {
                    btnCls = "!bg-emerald-500 !border-emerald-600 text-white shadow-md"; // Đúng
                    statusBadge = `<span class="text-[9px] block font-black text-emerald-100">Đúng</span>`;
                } else {
                    btnCls = "!bg-rose-500 !border-rose-600 text-white shadow-md"; // Sai
                    statusBadge = `<span class="text-[9px] block font-black text-rose-100">Sai</span>`;
                }
            } else if (roundId === 'round2') {
                let correctCount = 0, answeredCount = 0;
                for(let j=0; j<4; j++) {
                    let k = `round2_${q.id}_${j}`;
                    if (state.userChoices[k]) {
                        answeredCount++;
                        if (state.userChoices[k].isCorrect) correctCount++;
                    }
                }
                if (answeredCount === 0) {
                    btnCls = "bg-slate-100 text-slate-400 border-dashed border-slate-300";
                    statusBadge = `<span class="text-[9px] block font-bold text-slate-400">Bỏ trống</span>`;
                } else if (correctCount === 4) {
                    btnCls = "!bg-emerald-500 !border-emerald-600 text-white shadow-md";
                    statusBadge = `<span class="text-[9px] block font-black text-emerald-100">4/4 Đúng</span>`;
                } else if (correctCount > 0) {
                    btnCls = "!bg-amber-500 !border-amber-600 text-white shadow-md";
                    statusBadge = `<span class="text-[9px] block font-black text-amber-100">${correctCount}/4 Đúng</span>`;
                } else {
                    btnCls = "!bg-rose-500 !border-rose-600 text-white shadow-md";
                    statusBadge = `<span class="text-[9px] block font-black text-rose-100">0/4 Sai</span>`;
                }
            } else if (roundId === 'round3') {
                let choice = state.userChoices[`round3_${q.id}`];
                if (!choice) {
                    btnCls = "bg-slate-100 text-slate-400 border-dashed border-slate-300";
                    statusBadge = `<span class="text-[9px] block font-bold text-slate-400">Bỏ trống</span>`;
                } else if (choice.isCorrect) {
                    btnCls = "!bg-emerald-500 !border-emerald-600 text-white shadow-md";
                    statusBadge = `<span class="text-[9px] block font-black text-emerald-100">Đúng</span>`;
                } else {
                    btnCls = "!bg-rose-500 !border-rose-600 text-white shadow-md";
                    statusBadge = `<span class="text-[9px] block font-black text-rose-100">Sai</span>`;
                }
            }
        } else {
            if (isAns) {
                btnCls = "bg-emerald-500 border-emerald-600 text-white shadow-md";
            }
        }

        return `
            <button onclick="openQuestion('${q.id}'); playSound('click');" class="w-full aspect-square rounded-2xl font-black text-base md:text-lg border-2 transition-all duration-200 btn-3d flex flex-col items-center justify-center ${btnCls}">
                <span>${index + 1}</span>
                ${statusBadge}
            </button>
        `;
    }).join('');
    
    let title = roundId === 'round1' ? "Phần I: Trắc nghiệm 4 lựa chọn" : roundId === 'round2' ? "Phần II: Câu trắc nghiệm Đúng / Sai" : "Phần III: Trắc nghiệm Trả lời ngắn";
    
    let legendHtml = isRev ? `
        <div class="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded-md bg-emerald-500 inline-block shadow-2xs"></span> Trả lời đúng</span>
            ${roundId === 'round2' ? '<span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded-md bg-amber-500 inline-block shadow-2xs"></span> Đúng một phần (1-3 ý)</span>' : ''}
            <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded-md bg-rose-500 inline-block shadow-2xs"></span> Trả lời sai</span>
            <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300 inline-block shadow-2xs"></span> Bỏ trống / Chưa làm</span>
        </div>
    ` : '';

    document.getElementById('app-content').innerHTML = `
        <div class="w-full max-w-4xl fade-in">
            <div class="flex items-center justify-between mb-4 px-6 py-4 bg-white rounded-3xl shadow-md border-2 border-slate-200">
                <div>
                    <h2 class="font-black text-slate-800 text-base sm:text-lg uppercase tracking-wider font-display flex items-center gap-2">
                        <i class="fa-solid fa-bullseye text-indigo-600"></i> ${title}
                    </h2>
                    ${isRev ? `<div class="text-[11px] font-bold text-indigo-600 mt-0.5"><i class="fa-solid fa-eye mr-1"></i> Bấm vào từng câu để xem chi tiết bài làm & lời giải</div>` : ''}
                </div>
                <button onclick="renderDashboard(); playSound('click');" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 flex items-center gap-1.5 btn-3d">
                    <i class="fa-solid fa-house text-indigo-500"></i> Tổng quan
                </button>
            </div>
            <div class="bg-white/90 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-200 shadow-lg">
                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    ${btns}
                </div>
                ${legendHtml}
            </div>
        </div>
    `;
}

function toggleStudentMenu(e) {
    if(e) e.stopPropagation();
    let m = document.getElementById('persistent-dropdown-menu');
    if(m) {
        m.classList.toggle('hidden');
        if (GAME_DATA) {
            let r1 = document.getElementById('menu-r1-count'); if(r1) r1.innerText = (GAME_DATA.round1||[]).length;
            let r2 = document.getElementById('menu-r2-count'); if(r2) r2.innerText = (GAME_DATA.round2||[]).length;
            let r3 = document.getElementById('menu-r3-count'); if(r3) r3.innerText = (GAME_DATA.round3||[]).length;
        }
    }
}

function usePowerup(type) {
    if (state.currentSettings && state.currentSettings.examMode === 'exam') return;
    if (state.isSubmitted) return;
    if (!state.powerups[type] || state.powerups[type] <= 0) return;
    state.powerups[type]--;
    playSound('powerup');
    
    if (type === 'freeze') {
        showToast("❄️ ĐÃ ĐÓNG BĂNG ĐỒNG HỒ TRONG 60 GIÂY!");
        let origTimer = state.timer.remaining;
        let freezeInterval = setInterval(() => { state.timer.remaining = origTimer; updateTimerDisplay(); }, 1000);
        setTimeout(() => { clearInterval(freezeInterval); showToast("Đồng hồ tiếp tục chạy!"); }, 60000);
    } else if (type === 'fifty') {
        showToast("🎯 ĐÃ DÙNG TRỢ GIÚP 50:50!");
        let q = state.currentQuestion;
        if (state.currentRound === 'round1') {
            let qK = `round1_${q.id}`;
            let wrongIndices = [];
            (state.shuffledOptions[qK] || []).forEach((opt, idx) => {
                if (!opt.isCorrect) wrongIndices.push(idx);
            });
            wrongIndices.sort(() => Math.random() - 0.5);
            let toHide = wrongIndices.slice(0, 2);
            toHide.forEach(idx => {
                let btn = document.getElementById(`r1-opt-btn-${idx}`);
                if (btn) {
                    btn.classList.add('opacity-20', 'pointer-events-none');
                }
            });
        }
    }
    openQuestion(state.currentQuestion.id);
}

function openQuestion(qId) {
    let currentRoundData = GAME_DATA[state.currentRound] || [];
    let currentIndex = currentRoundData.findIndex(x => String(x.id) === String(qId));
    if(currentIndex === -1) return;
    let q = currentRoundData[currentIndex];
    state.currentQuestion = q;

    let prevId = currentIndex > 0 ? currentRoundData[currentIndex - 1].id : null;
    let nextId = currentIndex < currentRoundData.length - 1 ? currentRoundData[currentIndex + 1].id : null;
    let totalQs = currentRoundData.length;

    let isAnsAll = (state.currentRound==='round1'||state.currentRound==='round3') 
        ? state.answeredQuestions.includes(`${state.currentRound}_${q.id}`) 
        : q.statements?.every((_,i)=>state.answeredQuestions.includes(`round2_${q.id}_${i}`));
    
    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');
    let isRev = state.isSubmitted; 
    let qTextClean = stripQuestionPrefix(q.text);

    // Compute question score & status banner in Review Mode
    let reviewQuestionBanner = "";
    if (isRev) {
        if (state.currentRound === 'round1') {
            let choice = state.userChoices[`round1_${q.id}`];
            if (!choice) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-question text-slate-400"></i> Bạn chưa chọn phương án nào cho câu này</span><span class="font-mono font-black text-slate-500">0.00 / 0.25đ</span></div>`;
            } else if (choice.isCorrect) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> KẾT QUẢ: CHÍNH XÁC HOÀN TOÀN</span><span class="font-mono font-black text-emerald-700">+0.25đ</span></div>`;
            } else {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-xmark text-rose-600 text-sm"></i> KẾT QUẢ: CHƯA CHÍNH XÁC</span><span class="font-mono font-black text-rose-600">0.00 / 0.25đ</span></div>`;
            }
        } else if (state.currentRound === 'round2') {
            let correctCount = 0, answeredCount = 0;
            for(let j=0; j<4; j++) {
                let k = `round2_${q.id}_${j}`;
                if (state.userChoices[k]) {
                    answeredCount++;
                    if (state.userChoices[k].isCorrect) correctCount++;
                }
            }
            let pts = (correctCount === 1 ? 0.1 : (correctCount === 2 ? 0.25 : (correctCount === 3 ? 0.5 : (correctCount === 4 ? 1.0 : 0.0))));
            if (answeredCount === 0) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-question text-slate-400"></i> Bạn chưa trả lời các mệnh đề</span><span class="font-mono font-black text-slate-500">0.00 / 1.00đ</span></div>`;
            } else if (correctCount === 4) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> KẾT QUẢ: ĐÚNG CẢ 4/4 MỆNH ĐỀ</span><span class="font-mono font-black text-emerald-700">+1.00đ</span></div>`;
            } else if (correctCount > 0) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation text-amber-600 text-sm"></i> KẾT QUẢ: ĐÚNG ${correctCount}/4 MỆNH ĐỀ</span><span class="font-mono font-black text-amber-700">+${pts}đ</span></div>`;
            } else {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-xmark text-rose-600 text-sm"></i> KẾT QUẢ: SAI CẢ 4 MỆNH ĐỀ</span><span class="font-mono font-black text-rose-600">0.00 / 1.00đ</span></div>`;
            }
        } else if (state.currentRound === 'round3') {
            let choice = state.userChoices[`round3_${q.id}`];
            if (!choice) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-question text-slate-400"></i> Bạn chưa nhập kết quả</span><span class="font-mono font-black text-slate-500">0.00 / 0.50đ</span></div>`;
            } else if (choice.isCorrect) {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> KẾT QUẢ: CHÍNH XÁC TUYỆT ĐỐI</span><span class="font-mono font-black text-emerald-700">+0.50đ</span></div>`;
            } else {
                reviewQuestionBanner = `<div class="mb-3 px-4 py-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-black text-xs flex items-center justify-between"><span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-xmark text-rose-600 text-sm"></i> KẾT QUẢ: CHƯA CHÍNH XÁC</span><span class="font-mono font-black text-rose-600">0.00 / 0.50đ</span></div>`;
            }
        }
    }

    let powerupsHtml = (!isExam || isRev) ? `
        <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div class="flex items-center gap-2 flex-wrap">
                ${!isExam && !isRev ? `
                    <span class="text-xs font-black text-slate-400 uppercase tracking-wider mr-1"><i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Trợ giúp:</span>
                    <button onclick="usePowerup('fifty')" ${state.powerups.fifty > 0 ? '' : 'disabled'} class="powerup-btn ${state.powerups.fifty > 0 ? 'text-indigo-700' : ''}">
                        <i class="fa-solid fa-scale-balanced text-indigo-500"></i> 50:50 (${state.powerups.fifty || 0})
                    </button>
                    <button onclick="usePowerup('freeze')" ${state.powerups.freeze > 0 ? '' : 'disabled'} class="powerup-btn ${state.powerups.freeze > 0 ? 'text-sky-700' : ''}">
                        <i class="fa-solid fa-snowflake text-sky-500"></i> Đóng băng (${state.powerups.freeze || 0})
                    </button>
                ` : ''}
            </div>
            <button onclick="openStudentTheoryModal(); playSound('click');" class="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-2xs btn-3d">
                <i class="fa-solid fa-graduation-cap text-amber-600"></i> <span>Tra cứu Lý thuyết</span>
            </button>
        </div>
    ` : '';

    let html = `
        <div class="w-full max-w-4xl fade-in flex flex-col">
            <div class="flex justify-between items-center mb-3">
                <button onclick="selectRound('${state.currentRound}'); playSound('click');" class="px-4 py-2 bg-white border-2 border-slate-200 shadow-xs rounded-2xl font-bold text-xs text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition flex items-center gap-1.5 btn-3d">
                    <i class="fa-solid fa-arrow-left text-indigo-500"></i> Danh sách câu
                </button>
                <div class="flex items-center gap-2">
                    <span class="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 text-white rounded-2xl font-black text-xs uppercase shadow-md tracking-wider">
                        Câu ${currentIndex + 1} / ${totalQs}
                    </span>
                </div>
            </div>

            ${reviewQuestionBanner}
            ${powerupsHtml}

            <div class="question-text prose-math bg-white p-6 md:p-8 rounded-3xl mb-4 shadow-md border-2 border-slate-200 text-base md:text-lg font-bold leading-relaxed relative overflow-hidden">
                <div class="relative z-10">
                    ${typeof getBilingualQuestionHtml === "function" ? getBilingualQuestionHtml(q, window.APP_LANG) : parseMarkdownSafe(qTextClean || "")}
                </div>
                ${q.image ? `<div class="mt-4 flex justify-center"><img src="${q.image}" class="max-h-80 max-w-full rounded-2xl shadow-md border-2 border-slate-200 object-contain hover:scale-[1.02] transition cursor-pointer" onclick="window.open(this.src, '_blank')"></div>` : ''}
            </div>
    `;

    if (state.currentRound === 'round1') {
        let qK = `round1_${q.id}`; let isAns = state.answeredQuestions.includes(qK);
        if (!state.shuffledOptions[qK]) {
            let opts = (q.options||[]).map((o, optIdx) => {
                let optClean = (typeof stripOptionPrefix === 'function' ? stripOptionPrefix(o) : o).trim();
                let ansClean = (typeof stripOptionPrefix === 'function' ? stripOptionPrefix(q.answer) : String(q.answer||'')).trim();
                let ansRaw = String(q.answer || '').trim();
                let optLetter = ['A', 'B', 'C', 'D'][optIdx];

                let isC = (String(o).trim().toLowerCase() === ansRaw.toLowerCase()) ||
                          (optClean && ansClean && optClean.toLowerCase() === ansClean.toLowerCase()) ||
                          (ansRaw.toUpperCase() === optLetter) ||
                          (ansRaw.toUpperCase() === `${optLetter}.`) ||
                          (String(o).trim().toUpperCase().startsWith(`${ansRaw.toUpperCase()}.`));

                return { text: o, isCorrect: isC, originalIndex: optIdx };
            });
            if (!isRev) opts.sort(()=>Math.random()-0.5); 
            state.shuffledOptions[qK] = opts;
        }
        html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">` + state.shuffledOptions[qK].map((opt, i) => {
            let cls = "";
            let tagBadge = "";
            let isUserSel = (state.userChoices[qK]?.optText === String(opt.text).trim());

            if (isRev) {
                if (isUserSel && opt.isCorrect) {
                    cls = "!bg-emerald-500 !text-white !border-emerald-600 shadow-lg pointer-events-none";
                    tagBadge = `<span class="text-[10px] bg-white text-emerald-800 px-2 py-0.5 rounded-full font-black ml-2 shadow-2xs">✓ Lựa chọn của bạn (Đúng)</span>`;
                } else if (isUserSel && !opt.isCorrect) {
                    cls = "!bg-rose-500 !text-white !border-rose-600 shadow-lg pointer-events-none";
                    tagBadge = `<span class="text-[10px] bg-white text-rose-800 px-2 py-0.5 rounded-full font-black ml-2 shadow-2xs">✗ Lựa chọn của bạn (Sai)</span>`;
                } else if (opt.isCorrect) {
                    cls = "!bg-emerald-100 !border-2 !border-emerald-500 !text-emerald-950 font-black shadow-md pointer-events-none";
                    tagBadge = `<span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black ml-2 shadow-2xs">★ Đáp án đúng</span>`;
                } else {
                    cls = "opacity-40 pointer-events-none bg-slate-50";
                }
            } else if (isAns) {
                if (isExam) {
                    if(isUserSel) cls = "selected";
                    else cls = "opacity-40 pointer-events-none";
                } else {
                    if (isUserSel) {
                        cls = state.userChoices[qK].isCorrect ? "!bg-emerald-500 !text-white !border-emerald-600 shadow-lg" : "!bg-rose-500 !text-white !border-rose-600 shake-wrong shadow-lg";
                    } else if (opt.isCorrect) { cls = "!bg-emerald-100 !border-emerald-400 !text-emerald-900 pointer-events-none"; }
                    else { cls = "opacity-40 pointer-events-none"; }
                }
            }
            let optTextClean = stripOptionPrefix(opt.text);
            let optLetter = ['A', 'B', 'C', 'D'][i];
            let themeClass = `opt-card-theme-${i % 4}`;
            return `<div id="r1-opt-btn-${i}" onclick="checkAnswer(this, ${i})" class="question-option-card ${themeClass} ${cls} ${isAns || isRev ? 'pointer-events-none' : ''}">
                <div class="question-option-key font-mono font-black">${optLetter}.</div>
                <div class="math-scroll flex-grow font-bold text-sm md:text-base leading-relaxed">
                    ${parseMarkdownSafe(optTextClean||"", true)}
                    ${tagBadge}
                </div>
            </div>`;
        }).join('') + `</div>`;
    } 
    else if (state.currentRound === 'round2') {
        let sK = `round2_${q.id}`;
        if (!state.shuffledStatements) state.shuffledStatements = {};
        if (!state.shuffledStatements[sK]) {
            let order = (q.statements||[]).map((_, i) => i);
            state.shuffledStatements[sK] = order;
        }
        let renderStmts = state.shuffledStatements[sK].map(idx => ({...q.statements[idx], originalIndex: idx}));
        html += `<div class="flex flex-col gap-3">` + renderStmts.map((s, renderIndex) => {
            let qK = `round2_${q.id}_${s.originalIndex}`; 
            let isA = state.answeredQuestions.includes(qK);
            let tC="bg-slate-100 text-slate-700 border-slate-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-600";
            let fC="bg-slate-100 text-slate-700 border-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-600";
            let resultTag = "";

            if (isRev) {
                let userChoiceObj = state.userChoices[qK];
                let uVal = userChoiceObj ? userChoiceObj.userChoice : null;
                let isRight = userChoiceObj ? userChoiceObj.isCorrect : false;

                if (uVal === true) {
                    tC = isRight ? "!bg-emerald-500 !text-white !border-emerald-600 shadow-md" : "!bg-rose-500 !text-white !border-rose-600 shadow-md";
                    fC = "opacity-25 pointer-events-none";
                } else if (uVal === false) {
                    fC = isRight ? "!bg-emerald-500 !text-white !border-emerald-600 shadow-md" : "!bg-rose-500 !text-white !border-rose-600 shadow-md";
                    tC = "opacity-25 pointer-events-none";
                } else {
                    tC = "opacity-40 pointer-events-none";
                    fC = "opacity-40 pointer-events-none";
                }

                resultTag = `
                    <div class="mt-2 pt-2 border-t border-slate-200 text-xs font-bold flex items-center justify-between flex-wrap gap-2">
                        <span class="${userChoiceObj ? (isRight ? 'text-emerald-700' : 'text-rose-600') : 'text-slate-500'}">
                            ${userChoiceObj ? (isRight ? '✓ Bạn trả lời đúng' : '✗ Bạn trả lời sai') : 'Chưa làm'}
                        </span>
                        <span class="text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                            Đáp án chuẩn: <b class="${s.isTrue ? 'text-emerald-700' : 'text-rose-600'}">${s.isTrue ? 'ĐÚNG' : 'SAI'}</b>
                        </span>
                    </div>
                `;
            } else if (isA && state.userChoices[qK]) {
                let ch = state.userChoices[qK];
                if (isExam) {
                    if(ch.userChoice) { tC = "bg-indigo-600 text-white border-indigo-700 shadow-md"; fC = "opacity-30 pointer-events-none"; }
                    else { fC = "bg-indigo-600 text-white border-indigo-700 shadow-md"; tC = "opacity-30 pointer-events-none"; }
                } else {
                    if(ch.userChoice) { tC = ch.isCorrect ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-rose-500 text-white border-rose-600 shake-wrong shadow-md"; fC = "opacity-30 pointer-events-none"; }
                    else { fC = ch.isCorrect ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-rose-500 text-white border-rose-600 shake-wrong shadow-md"; tC = "opacity-30 pointer-events-none"; }
                }
            } else if (isExam) {
                tC="bg-slate-100 text-slate-700 border-slate-300 hover:bg-indigo-500 hover:text-white"; 
                fC="bg-slate-100 text-slate-700 border-slate-300 hover:bg-indigo-500 hover:text-white";
            }

            let stmtTheme = `stmt-card-theme-${renderIndex % 4}`;
            return `
            <div class="stmt-card ${stmtTheme} p-4 md:p-5 rounded-2xl border-2 flex flex-col justify-between gap-3 shadow-xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="font-bold flex-grow text-sm md:text-base leading-relaxed flex items-center">
                        <span class="stmt-badge font-mono font-black mr-2.5 shrink-0">${['a','b','c','d'][renderIndex]})</span>
                        <span class="text-slate-800">${parseMarkdownSafe(s.text||"", true)}</span>
                    </div>
                    <div class="flex gap-2 shrink-0">
                        <button onclick="checkTF(this, true, ${s.originalIndex})" ${isA || isRev ? 'disabled' : ''} class="px-5 py-2.5 rounded-xl font-black text-xs border-2 transition-all btn-3d flex items-center gap-1.5 ${tC}">
                            <i class="fa-solid fa-check"></i> ĐÚNG
                        </button>
                        <button onclick="checkTF(this, false, ${s.originalIndex})" ${isA || isRev ? 'disabled' : ''} class="px-5 py-2.5 rounded-xl font-black text-xs border-2 transition-all btn-3d flex items-center gap-1.5 ${fC}">
                            <i class="fa-solid fa-xmark"></i> SAI
                        </button>
                    </div>
                </div>
                ${resultTag}
            </div>`;
        }).join('') + `</div>`;
    } 
    else if (state.currentRound === 'round3') {
        let qK = `round3_${q.id}`; 
        let isA = state.answeredQuestions.includes(qK);
        let userChoiceObj = state.userChoices[qK];
        let boxHtml = '';

        if (isRev) {
            if (userChoiceObj) {
                boxHtml = `
                    <div class="mt-3 p-4 rounded-2xl border-2 ${userChoiceObj.isCorrect ? 'text-emerald-900 border-emerald-300 bg-emerald-50' : 'text-rose-900 border-rose-300 bg-rose-50'} shadow-sm space-y-1 text-sm font-bold">
                        <div class="flex justify-between items-center">
                            <span>Câu trả lời của bạn: <b class="font-mono text-base ${userChoiceObj.isCorrect ? 'text-emerald-700' : 'text-rose-700'}">${userChoiceObj.userVal || '---'}</b></span>
                            <span class="${userChoiceObj.isCorrect ? 'text-emerald-700' : 'text-rose-600'}">${userChoiceObj.isCorrect ? '✓ Chính xác (+0.5đ)' : '✗ Chưa đúng (0đ)'}</span>
                        </div>
                        <div class="pt-2 border-t ${userChoiceObj.isCorrect ? 'border-emerald-200' : 'border-rose-200'} text-xs text-slate-700">
                            Đáp án chuẩn của đề thi: <b class="font-mono text-indigo-700 text-sm font-black">${q.answer}</b>
                        </div>
                    </div>
                `;
            } else {
                boxHtml = `
                    <div class="mt-3 p-4 rounded-2xl border-2 text-slate-700 border-slate-300 bg-slate-50 shadow-sm space-y-1 text-sm font-bold">
                        <div>Bạn chưa nhập câu trả lời cho câu này.</div>
                        <div class="text-xs text-slate-600 pt-1 border-t border-slate-200">
                            Đáp án chuẩn của đề thi: <b class="font-mono text-indigo-700 text-sm font-black">${q.answer}</b>
                        </div>
                    </div>
                `;
            }
        } else if (isA && userChoiceObj) {
            if (isExam) {
                boxHtml = `<div class="mt-3 p-3.5 rounded-2xl font-bold text-center border-2 text-indigo-800 border-indigo-300 bg-indigo-50 shadow-xs">Đã ghi nhận câu trả lời</div>`;
            } else {
                boxHtml = `<div class="mt-3 p-3.5 rounded-2xl font-black text-center border-2 ${userChoiceObj.isCorrect?'text-emerald-800 border-emerald-300 bg-emerald-50':'text-rose-800 border-rose-300 bg-rose-50'} shadow-xs">${userChoiceObj.isCorrect?'🎉 Chính xác tuyệt đối!':`❌ Chưa đúng. Đáp án chuẩn: ${q.answer}`}</div>`;
            }
        }

        html += `<div class="flex flex-col gap-2.5">
            <div class="flex rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md bg-white">
                <math-field id="r3-input" value="${userChoiceObj?.userVal||''}" ${isA || isRev ? 'disabled' : ''} class="flex-grow p-4 font-bold outline-none text-xl bg-white min-h-[60px] text-indigo-950" math-virtual-keyboard-policy="manual"></math-field>
                ${!isRev ? `<button onclick="checkR3Answer(document.getElementById('r3-input').value)" ${isA?'disabled':''} class="px-8 bg-gradient-to-r from-indigo-600 to-sky-600 text-white font-black hover:from-indigo-700 hover:to-sky-700 transition text-base uppercase tracking-wider btn-3d"><i class="fa-solid fa-paper-plane mr-1.5"></i> NỘP</button>` : ''}
            </div>
            ${!isA && !isRev ? `<button onclick="document.getElementById('r3-input').executeCommand('toggleVirtualKeyboard')" class="py-1.5 px-4 text-xs bg-indigo-50 text-indigo-700 font-black rounded-xl border border-indigo-200 shadow-2xs w-max hover:bg-indigo-100 transition flex items-center gap-1.5"><i class="fa-solid fa-keyboard"></i> Bàn phím Toán ảo</button>` : ''}
            ${boxHtml}
        </div>`;
    }

    let explHtml = (q.explanation && (isRev || (!isExam && isAnsAll))) ? `
        <div class="mt-5 p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-200/80 text-slate-800 text-sm md:text-base shadow-sm">
            <b class="text-amber-900 text-base mb-3 flex items-center gap-2 border-b border-amber-200 pb-2.5">
                <i class="fa-solid fa-lightbulb text-amber-500 text-xl"></i> Hướng dẫn giải chi tiết:
            </b>
            <div class="mt-3 explanation-box">${formatExplanation(q.explanation)}</div>
        </div>
    ` : '';

    let navHtml = `
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 gap-3">
            <button ${prevId ? `onclick="openQuestion('${prevId}'); playSound('click');"` : 'disabled'} class="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition ${prevId ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-2 border-indigo-200 shadow-sm btn-3d' : 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed border-2 border-slate-200'}">
                <i class="fa-solid fa-arrow-left"></i> <span>Câu trước</span>
            </button>
            <button onclick="selectRound('${state.currentRound}'); playSound('click');" class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs sm:text-sm transition border-2 border-slate-200 shadow-sm btn-3d">
                <i class="fa-solid fa-grid-2 mr-1"></i> Danh sách (${currentIndex + 1}/${totalQs})
            </button>
            <button ${nextId ? `onclick="openQuestion('${nextId}'); playSound('click');"` : 'disabled'} class="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition ${nextId ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-2 border-indigo-200 shadow-sm btn-3d' : 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed border-2 border-slate-200'}">
                <span>Câu tiếp</span> <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;

    document.getElementById('app-content').innerHTML = html + explHtml + navHtml + `</div>`; 
    triggerMathJax();
}

// =========================================================================
// ANSWER SUBMISSION & REAL-TIME EVALUATION ENGINE FOR ALL 3 PARTS
// =========================================================================

function checkAnswer(el, optIndex) {
    let q = state.currentQuestion;
    if (!q) return;
    let qK = `round1_${q.id}`;
    if (state.answeredQuestions.includes(qK) || state.isSubmitted) return;

    state.answeredQuestions.push(qK);
    let opt = (state.shuffledOptions[qK] || [])[optIndex];
    let optText = opt ? String(opt.text).trim() : "";
    let isRight = opt ? !!opt.isCorrect : false;

    state.userChoices[qK] = {
        optText: optText,
        isCorrect: isRight,
        index: optIndex
    };

    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');
    if (isExam) {
        playSound('click');
    } else {
        if (isRight) {
            playSound('correct');
            state.streak = (state.streak || 0) + 1;
            updateStreakDisplay();
            if (state.streak >= 2) triggerComboNotification(state.streak);
            showFloatingPoints(0.25);
        } else {
            playSound('wrong');
            state.streak = 0;
            updateStreakDisplay();
        }
    }

    recalculateScores();
    openQuestion(q.id);
}

function checkTF(el, userChoiceBool, stmtOriginalIndex) {
    let q = state.currentQuestion;
    if (!q) return;
    let qK = `round2_${q.id}_${stmtOriginalIndex}`;
    if (state.answeredQuestions.includes(qK) || state.isSubmitted) return;

    state.answeredQuestions.push(qK);
    let stmt = q.statements && q.statements[stmtOriginalIndex];
    let isTrueVal = stmt ? stmt.isTrue : false;
    let isTrueBool = (isTrueVal === true || String(isTrueVal).trim().toLowerCase() === 'true');
    let isRight = (userChoiceBool === isTrueBool);

    state.userChoices[qK] = {
        userChoice: userChoiceBool,
        isCorrect: isRight
    };

    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');
    if (isExam) {
        playSound('click');
    } else {
        if (isRight) {
            playSound('correct');
            state.streak = (state.streak || 0) + 1;
            updateStreakDisplay();
            if (state.streak >= 2) triggerComboNotification(state.streak);
        } else {
            playSound('wrong');
            state.streak = 0;
            updateStreakDisplay();
        }
    }

    recalculateScores();
    openQuestion(q.id);
}

function checkR3Answer(userVal) {
    let q = state.currentQuestion;
    if (!q) return;
    let qK = `round3_${q.id}`;
    if (state.answeredQuestions.includes(qK) || state.isSubmitted) return;

    if (userVal === undefined || userVal === null || String(userVal).trim() === '') {
        showToast("Vui lòng nhập kết quả trước khi nộp!", true);
        return;
    }

    let rawVal = String(userVal).trim();
    let isRight = typeof isMathAnswerCorrect === 'function'
        ? isMathAnswerCorrect(rawVal, q.answer)
        : (rawVal.toLowerCase() === String(q.answer).trim().toLowerCase());

    state.answeredQuestions.push(qK);
    state.userChoices[qK] = {
        userVal: rawVal,
        isCorrect: isRight
    };

    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');
    if (isExam) {
        playSound('click');
        showToast("Đã ghi nhận câu trả lời!");
    } else {
        if (isRight) {
            playSound('correct');
            triggerConfetti();
            state.streak = (state.streak || 0) + 1;
            updateStreakDisplay();
            if (state.streak >= 2) triggerComboNotification(state.streak);
            showFloatingPoints(0.5);
        } else {
            playSound('wrong');
            state.streak = 0;
            updateStreakDisplay();
        }
    }

    recalculateScores();
    openQuestion(q.id);
}

function recalculateScores() {
    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');

    // Round 1: 0.25 pt per question
    let scoreR1 = 0;
    (GAME_DATA.round1 || []).forEach(q => {
        let qK = `round1_${q.id}`;
        if (state.userChoices[qK] && state.userChoices[qK].isCorrect) {
            scoreR1 += 0.25;
        }
    });

    // Round 2: 0.1 / 0.25 / 0.5 / 1.0 pt per question based on correct statement count
    let scoreR2 = 0;
    (GAME_DATA.round2 || []).forEach(q => {
        let correctCount = 0;
        for (let j = 0; j < 4; j++) {
            let k = `round2_${q.id}_${j}`;
            if (state.userChoices[k] && state.userChoices[k].isCorrect) {
                correctCount++;
            }
        }
        if (correctCount === 1) scoreR2 += 0.1;
        else if (correctCount === 2) scoreR2 += 0.25;
        else if (correctCount === 3) scoreR2 += 0.5;
        else if (correctCount === 4) scoreR2 += 1.0;
    });

    // Round 3: 0.5 pt per question
    let scoreR3 = 0;
    (GAME_DATA.round3 || []).forEach(q => {
        let qK = `round3_${q.id}`;
        if (state.userChoices[qK] && state.userChoices[qK].isCorrect) {
            scoreR3 += 0.5;
        }
    });

    state.scoreR1 = Math.round(scoreR1 * 100) / 100;
    state.scoreR2 = Math.round(scoreR2 * 100) / 100;
    state.scoreR3 = Math.round(scoreR3 * 100) / 100;
    state.score = Math.round((state.scoreR1 + state.scoreR2 + state.scoreR3) * 100) / 100;

    updateScoreUI();
    saveProgress();
}

function showFloatingPoints(pts, isN = false) {
    let el = document.createElement('div');
    el.className = `fixed pointer-events-none z-[9999] text-5xl md:text-7xl font-black ${isN ? 'text-rose-500' : 'text-emerald-500'} drop-shadow-2xl animate-bounce`;
    el.innerHTML = isN ? pts : `+${pts}`;
    el.style.left = '50%';
    el.style.top = '35%';
    el.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
}

function saveProgress() {
    if (!state.currentPlayCode || !state.studentId) return;
    try {
        localStorage.setItem('math_tbs_progress_' + state.currentPlayCode + '_' + state.studentId, JSON.stringify({
            score: state.score,
            scoreR1: state.scoreR1,
            scoreR2: state.scoreR2,
            scoreR3: state.scoreR3,
            timer: state.timer.remaining,
            answeredQuestions: state.answeredQuestions,
            userChoices: state.userChoices,
            stats: state.stats,
            streak: state.streak,
            shuffledOptions: state.shuffledOptions,
            powerups: state.powerups,
            shuffledQuestions: state.shuffledQuestions,
            shuffledStatements: state.shuffledStatements
        }));
    } catch(e){}
}

// =========================================================================
// SUBMISSION, LOCAL STORAGE PERSISTENCE, EXPORT & PRINTING ENGINE
// =========================================================================

function buildSubmissionRecord(attemptCount) {
    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');
    let examTitle = (state.currentSettings && state.currentSettings.title) || (GAME_DATA.theory && GAME_DATA.theory.title) || state.currentPlayCode || "Đề Thi Toán TBS";
    
    // Build question-level breakdown
    let round1Details = (GAME_DATA.round1 || []).map((q, idx) => {
        let qK = `round1_${q.id}`;
        let uChoice = state.userChoices[qK];
        return {
            index: idx + 1,
            id: q.id,
            idCode: q.idCode || "",
            topic: q.topic || "",
            level: q.level || "",
            type: "Phần I - Trắc nghiệm 4 lựa chọn",
            text: q.text,
            options: q.options,
            userChoice: uChoice ? uChoice.optText : null,
            officialAnswer: q.answer,
            isCorrect: uChoice ? uChoice.isCorrect : false,
            points: uChoice && uChoice.isCorrect ? 0.25 : 0,
            explanation: q.explanation || ""
        };
    });

    let round2Details = (GAME_DATA.round2 || []).map((q, idx) => {
        let stmts = (q.statements || []).map((s, sIdx) => {
            let k = `round2_${q.id}_${sIdx}`;
            let uChoice = state.userChoices[k];
            return {
                label: ['a', 'b', 'c', 'd'][sIdx],
                text: s.text,
                userChoice: uChoice ? (uChoice.userChoice ? "Đúng" : "Sai") : null,
                officialAnswer: s.isTrue ? "Đúng" : "Sai",
                isCorrect: uChoice ? uChoice.isCorrect : false
            };
        });
        let correctCount = stmts.filter(s => s.isCorrect).length;
        let pts = (correctCount === 1 ? 0.1 : (correctCount === 2 ? 0.25 : (correctCount === 3 ? 0.5 : (correctCount === 4 ? 1.0 : 0.0))));
        return {
            index: idx + 1,
            id: q.id,
            idCode: q.idCode || "",
            topic: q.topic || "",
            level: q.level || "",
            type: "Phần II - Trắc nghiệm Đúng/Sai",
            text: q.text,
            statements: stmts,
            correctStatementsCount: correctCount,
            points: pts,
            explanation: q.explanation || ""
        };
    });

    let round3Details = (GAME_DATA.round3 || []).map((q, idx) => {
        let qK = `round3_${q.id}`;
        let uChoice = state.userChoices[qK];
        return {
            index: idx + 1,
            id: q.id,
            idCode: q.idCode || "",
            topic: q.topic || "",
            level: q.level || "",
            type: "Phần III - Trắc nghiệm Trả lời ngắn",
            text: q.text,
            userChoice: uChoice ? uChoice.userVal : null,
            officialAnswer: q.answer,
            isCorrect: uChoice ? uChoice.isCorrect : false,
            points: uChoice && uChoice.isCorrect ? 0.5 : 0,
            explanation: q.explanation || ""
        };
    });

    return {
        id: "SUB_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        examCode: state.currentPlayCode,
        examTitle: examTitle,
        studentId: state.studentId || "ANON",
        studentName: state.studentName || "Thí sinh",
        studentClass: state.studentClass || "Tự do",
        examMode: isExam ? "Thi nghiêm túc" : "Luyện tập",
        attempt: attemptCount,
        submittedAt: new Date().toLocaleString('vi-VN'),
        timestamp: Date.now(),
        score: state.score,
        scoreR1: state.scoreR1,
        scoreR2: state.scoreR2,
        scoreR3: state.scoreR3,
        violations: isExam ? state.violationCount : 0,
        userChoices: state.userChoices,
        answeredQuestions: state.answeredQuestions,
        breakdown: {
            round1: round1Details,
            round2: round2Details,
            round3: round3Details
        }
    };
}

function saveStudentSubmissionToStorage(record) {
    try {
        let history = JSON.parse(localStorage.getItem('math_tbs_student_submissions') || '[]');
        history.unshift(record);
        if (history.length > 50) history = history.slice(0, 50); // Keep 50 most recent submissions
        localStorage.setItem('math_tbs_student_submissions', JSON.stringify(history));
    } catch(e) {
        console.warn("Lỗi lưu lịch sử bài thi:", e);
    }
}

async function syncPendingOfflineSubmissions() {
    let pending = [];
    try {
        pending = JSON.parse(localStorage.getItem('math_tbs_pending_submissions') || '[]');
    } catch(e) { pending = []; }

    if (!pending.length) return;
    if (!navigator.onLine) return;

    let remaining = [];
    let syncedCount = 0;

    for (let item of pending) {
        let success = false;
        try {
            // 1. Try Google Sheets Web App
            if (typeof GOOGLE_WEB_APP_URL !== 'undefined' && GOOGLE_WEB_APP_URL) {
                await fetch(GOOGLE_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(item.payload)
                });
                success = true;
            }

            // 2. Try Firestore
            if (window.db && typeof firebase !== 'undefined') {
                if (item.submissionRecord) {
                    await db.collection("Submissions").doc(item.submissionRecord.id).set(item.submissionRecord, { merge: true });
                }
                if (item.payload) {
                    await db.collection("ExamResults").add({
                        ...item.payload,
                        syncedAt: firebase.firestore.FieldValue.serverTimestamp ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
                    });
                }
                success = true;
            }
        } catch(err) {
            console.warn("Lỗi đồng bộ bài nộp offline:", err);
            success = false;
        }

        if (success) {
            syncedCount++;
        } else {
            remaining.push(item);
        }
    }

    localStorage.setItem('math_tbs_pending_submissions', JSON.stringify(remaining));
    if (syncedCount > 0) {
        showToast(`✅ Đã đồng bộ thành công ${syncedCount} bài nộp lưu offline lên máy chủ!`);
    }
}
window.syncPendingOfflineSubmissions = syncPendingOfflineSubmissions;
window.addEventListener('online', syncPendingOfflineSubmissions);

async function forceSubmitScore() {
    clearInterval(state.timer.intervalId); 
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleWindowBlur);
    document.removeEventListener("keydown", preventDevKeys);
    document.removeEventListener("contextmenu", preventContextMenu);

    let btn = document.getElementById('btn-submit-score'); if(btn) btn.disabled = true;
    
    let isExam = (state.currentSettings && state.currentSettings.examMode === 'exam');
    if(isExam) {
        state.scoreR1 = 0; state.scoreR2 = 0; state.scoreR3 = 0;
        let r1List = state.currentSettings?.round1Ids || (GAME_DATA.round1 || []).map(q => q.id);
        r1List.forEach(id => { let qK = `round1_${id}`; if(state.userChoices[qK] && state.userChoices[qK].isCorrect) state.scoreR1 += 0.25; });

        let r2List = state.currentSettings?.round2Ids || (GAME_DATA.round2 || []).map(q => q.id);
        r2List.forEach(id => { 
            let correctCount = 0; 
            for(let j=0; j<4; j++) { 
                let k = `round2_${id}_${j}`; 
                if(state.userChoices[k] && state.userChoices[k].isCorrect) correctCount++; 
            } 
            if(correctCount === 1) state.scoreR2 += 0.1; 
            else if(correctCount === 2) state.scoreR2 += 0.25; 
            else if(correctCount === 3) state.scoreR2 += 0.5; 
            else if(correctCount === 4) state.scoreR2 += 1.0; 
        });

        let r3List = state.currentSettings?.round3Ids || (GAME_DATA.round3 || []).map(q => q.id);
        r3List.forEach(id => { let qK = `round3_${id}`; if(state.userChoices[qK] && state.userChoices[qK].isCorrect) state.scoreR3 += 0.5; });

        state.scoreR1 = Math.round(state.scoreR1 * 100) / 100; 
        state.scoreR2 = Math.round(state.scoreR2 * 100) / 100; 
        state.scoreR3 = Math.round(state.scoreR3 * 100) / 100;
        state.score = Math.round((state.scoreR1 + state.scoreR2 + state.scoreR3) * 100) / 100;
    }
    
    let attemptKey = 'math_tbs_attempts_' + state.currentPlayCode + '_' + state.studentId;
    let attemptCount = (parseInt(localStorage.getItem(attemptKey)) || 0) + 1;
    localStorage.setItem(attemptKey, attemptCount);

    state.isSubmitted = true;

    // Build comprehensive submission record
    let submissionRecord = buildSubmissionRecord(attemptCount);
    state.lastSubmission = submissionRecord;
    saveStudentSubmissionToStorage(submissionRecord);

    let payload = { 
        action: "submitScore", 
        khoi: "12", 
        id: state.studentId, 
        name: state.studentName || "Khách", 
        cls: state.studentClass || "Tự do", 
        code: state.currentPlayCode, 
        score: state.score, 
        scoreR1: state.scoreR1, 
        scoreR2: state.scoreR2, 
        scoreR3: state.scoreR3, 
        attempt: attemptCount,
        violations: isExam ? state.violationCount : 0,
        examMode: isExam ? "Thi nghiêm túc" : "Luyện tập",
        date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
        timestamp: Date.now()
    };

    let submittedOnline = false;

    // 1. Submit to Google Sheets Web App
    if (!window.OFFLINE_GAME_DATA && typeof GOOGLE_WEB_APP_URL !== 'undefined' && GOOGLE_WEB_APP_URL) {
        try { 
            await fetch(GOOGLE_WEB_APP_URL, { 
                method: 'POST', 
                mode: 'no-cors', 
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
                body: JSON.stringify(payload) 
            }); 
            submittedOnline = true;
        } catch(e) {
            console.warn("Lỗi gửi Google Sheets Web App:", e);
        }
    }

    // 2. Submit to Firebase Firestore (Submissions & ExamResults)
    if (!window.OFFLINE_GAME_DATA && window.db && typeof firebase !== 'undefined') {
        try {
            await Promise.all([
                db.collection("Submissions").doc(submissionRecord.id).set(submissionRecord),
                db.collection("ExamResults").add({
                    ...payload,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
                })
            ]);
            submittedOnline = true;
        } catch(e) {
            console.warn("Lỗi lưu Firestore submission:", e);
        }
    }

    if (submittedOnline) {
        showToast("✅ Nộp bài thi và đồng bộ đám mây thành công!");
    } else {
        // Queue for offline sync
        try {
            let pending = JSON.parse(localStorage.getItem('math_tbs_pending_submissions') || '[]');
            pending.push({ payload, submissionRecord, queuedAt: Date.now() });
            localStorage.setItem('math_tbs_pending_submissions', JSON.stringify(pending));
        } catch(err){}
        showToast("💾 Đã lưu kết quả thi Offline! Sẽ tự động tải lên khi có mạng Internet.");
    }

    localStorage.removeItem('math_tbs_progress_' + state.currentPlayCode + '_' + state.studentId);
    
    document.getElementById('scoreboard')?.classList.add('hidden');
    document.getElementById('submit-confirm-modal')?.classList.add('hidden');

    let statsContent = document.getElementById('stats-content');
    if (statsContent) {
        // Compute Rank & Title
        let scoreVal = Number(state.score) || 0;
        let rankClass = "rank-badge-c", rankLetter = "C", rankTitle = "Tân Binh Cần Cố Gắng";
        if (scoreVal >= 9.0) { rankClass = "rank-badge-s"; rankLetter = "S+"; rankTitle = "Chiến Thần Toán Học TBS"; }
        else if (scoreVal >= 8.0) { rankClass = "rank-badge-s"; rankLetter = "S"; rankTitle = "Đại Sư Giải Tích"; }
        else if (scoreVal >= 6.5) { rankClass = "rank-badge-a"; rankLetter = "A"; rankTitle = "Hiệp Sĩ Khảo Thí"; }
        else if (scoreVal >= 5.0) { rankClass = "rank-badge-b"; rankLetter = "B"; rankTitle = "Chiến Binh Rèn Luyện"; }

        statsContent.innerHTML = `
            <div class="space-y-4">
                <!-- Rank Hero Card -->
                <div class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden border-2 border-indigo-400/50">
                    <div class="flex flex-col items-center justify-center mb-3">
                        <div class="rank-badge ${rankClass} mb-2">${rankLetter}</div>
                        <h4 class="font-black text-amber-300 text-sm md:text-base uppercase tracking-wider">${rankTitle}</h4>
                    </div>

                    <div class="text-[11px] font-black uppercase tracking-widest text-indigo-200 mb-1">TỔNG ĐIỂM HOÀN THÀNH</div>
                    <div class="text-5xl font-black font-display text-white drop-shadow-md">${state.score} <span class="text-lg font-bold text-indigo-300">${isExam ? '/ 10.0' : 'pts'}</span></div>
                    
                    <div class="mt-4 pt-3 text-xs font-bold text-indigo-200 flex justify-center items-center gap-4 border-t border-white/15 flex-wrap">
                        <span><i class="fa-solid fa-rotate-right mr-1 text-amber-400"></i> Lần nộp thứ: <b class="text-white text-sm">${attemptCount}</b></span>
                        ${isExam ? `<span><i class="fa-solid fa-shield-halved mr-1 ${state.violationCount > 0 ? 'text-rose-400' : 'text-emerald-400'}"></i> Vi phạm: <b class="${state.violationCount > 0 ? 'text-rose-300' : 'text-emerald-300'} text-sm">${state.violationCount} lần</b></span>` : ''}
                    </div>
                </div>

                <!-- 3 Part Score Breakdown -->
                <div class="grid grid-cols-3 gap-3 text-center">
                    <div class="bg-sky-50 p-3.5 rounded-2xl border-2 border-sky-200 shadow-xs">
                        <div class="text-sky-700 text-[11px] font-black uppercase">Phần I</div>
                        <div class="text-2xl font-black text-sky-950 mt-0.5 font-display">${state.scoreR1}đ</div>
                        <div class="text-[10px] text-slate-500 font-bold mt-0.5">Trắc nghiệm</div>
                    </div>
                    <div class="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs">
                        <div class="text-amber-700 text-[11px] font-black uppercase">Phần II</div>
                        <div class="text-2xl font-black text-amber-950 mt-0.5 font-display">${state.scoreR2}đ</div>
                        <div class="text-[10px] text-slate-500 font-bold mt-0.5">Đúng / Sai</div>
                    </div>
                    <div class="bg-rose-50 p-3.5 rounded-2xl border-2 border-rose-200 shadow-xs">
                        <div class="text-rose-700 text-[11px] font-black uppercase">Phần III</div>
                        <div class="text-2xl font-black text-rose-950 mt-0.5 font-display">${state.scoreR3}đ</div>
                        <div class="text-[10px] text-slate-500 font-bold mt-0.5">Trả lời ngắn</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Step 1: Render and show Student Answer Sheet confirmation modal first
    renderStudentAnswerSheet(submissionRecord);
    let answerSheetModal = document.getElementById('student-answer-sheet-modal');
    if (answerSheetModal) {
        answerSheetModal.classList.remove('hidden');
    } else {
        document.getElementById('stats-modal')?.classList.remove('hidden');
        triggerConfetti();
    }
    updateScoreUI();
}

/**
 * =========================================================================
 * 1. PHIẾU TRẢ LỜI TRẮC NGHIỆM CỦA THÍ SINH (XÁC NHẬN VÀ IN LƯU TRỮ)
 * =========================================================================
 */
function renderStudentAnswerSheet(rec) {
    if (!rec) rec = state.lastSubmission || buildSubmissionRecord(1);
    let container = document.getElementById('student-answer-sheet-body');
    if (!container) return;

    let r1List = rec.breakdown?.round1 || [];
    let r2List = rec.breakdown?.round2 || [];
    let r3List = rec.breakdown?.round3 || [];

    // Map helper to find letter selected in Part I
    let getSelectedLetter = (q) => {
        if (!q.userChoice || !q.options) return '-';
        let idx = q.options.findIndex(opt => stripOptionPrefix(opt).trim() === stripOptionPrefix(q.userChoice).trim());
        return idx !== -1 ? ['A', 'B', 'C', 'D'][idx] : '-';
    };

    let r1Cards = r1List.map((q) => {
        let selLetter = getSelectedLetter(q);
        return `
        <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
            <span class="font-mono font-black text-xs text-slate-700 w-12">Câu ${q.index}</span>
            <div class="flex items-center gap-1.5 font-mono text-xs font-black">
                ${['A', 'B', 'C', 'D'].map(l => {
                    let isSel = (selLetter === l);
                    return `<span class="w-6 h-6 rounded-full flex items-center justify-center border text-[11px] ${isSel ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'}">${l}</span>`;
                }).join('')}
            </div>
            <span class="text-[11px] font-mono font-bold ${selLetter !== '-' ? 'text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded' : 'text-slate-400'}">${selLetter !== '-' ? `[ ${selLetter} ]` : 'Trống'}</span>
        </div>`;
    }).join('');

    let r2Cards = r2List.map((q) => {
        return `
        <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div class="font-bold text-xs text-indigo-950 flex justify-between border-b border-slate-100 pb-1.5">
                <span>Câu ${q.index} (Trắc nghiệm Đúng/Sai)</span>
                <span class="text-[10px] text-slate-500 font-medium">4 ý phát biểu</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                ${(q.statements || []).map(s => {
                    let hasChoice = s.userChoice !== null && s.userChoice !== undefined;
                    let isDung = s.userChoice === 'Đúng';
                    let isSai = s.userChoice === 'Sai';
                    return `
                    <div class="p-1.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <b class="text-slate-700">${s.label})</b>
                        <div class="flex gap-1 text-[10px] font-bold">
                            <span class="px-1.5 py-0.5 rounded ${isDung ? 'bg-indigo-600 text-white font-black' : 'text-slate-400'}">Đ</span>
                            <span class="px-1.5 py-0.5 rounded ${isSai ? 'bg-indigo-600 text-white font-black' : 'text-slate-400'}">S</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }).join('');

    let r3Cards = r3List.map((q) => {
        let ansVal = q.userChoice ? String(q.userChoice).trim() : '';
        return `
        <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
            <span class="font-mono font-black text-xs text-slate-700 w-14">Câu ${q.index}</span>
            <div class="flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-sm text-indigo-950 truncate">
                ${ansVal ? ansVal : '<span class="text-slate-400 font-normal italic text-xs">Chưa điền đáp án</span>'}
            </div>
        </div>`;
    }).join('');

    container.innerHTML = `
        <div class="bg-white p-5 md:p-6 rounded-2xl border-2 border-indigo-100 shadow-sm space-y-5 font-sans">
            <!-- Header Paper -->
            <div class="border-b-2 border-slate-800 pb-4 text-center space-y-1">
                <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">HỆ THỐNG KHẢO THÍ TOÁN HỌC TRỰC TUYẾN EDUMATH TBS</div>
                <h2 class="text-lg md:text-xl font-black text-slate-900 uppercase">PHIẾU TRẢ LỜI TRẮC NGHIỆM CỦA THÍ SINH</h2>
                <p class="text-xs text-slate-600 italic">Bản ghi nhận minh chứng bài làm chính thức phục vụ đối chiếu và lưu trữ hồ sơ</p>
            </div>

            <!-- Candidate Info Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div><span class="text-slate-500">Họ và tên thí sinh:</span> <b class="text-slate-900 block text-sm font-black">${rec.studentName}</b></div>
                <div><span class="text-slate-500">Mã định danh / SBD:</span> <b class="font-mono text-indigo-700 block text-sm font-black">${rec.studentId}</b></div>
                <div><span class="text-slate-500">Lớp / Đơn vị:</span> <b class="text-slate-900 block font-bold">${rec.studentClass}</b></div>
                <div><span class="text-slate-500">Mã đề thi:</span> <b class="font-mono text-purple-700 block font-black">${rec.examCode}</b></div>
                <div><span class="text-slate-500">Chế độ thi:</span> <b class="text-slate-900 block font-bold">${rec.examMode}</b></div>
                <div><span class="text-slate-500">Thời gian nộp:</span> <b class="text-slate-900 block font-bold">${rec.submittedAt}</b></div>
            </div>

            <!-- Part I Answers -->
            ${r1List.length > 0 ? `
            <div>
                <h4 class="font-black text-xs uppercase tracking-wider text-indigo-900 mb-2.5 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">I</span>
                    PHẦN I: CÂU TRẮC NGHIỆM NHIỀU LỰA CHỌN (${r1List.length} CÂU)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    ${r1Cards}
                </div>
            </div>` : ''}

            <!-- Part II Answers -->
            ${r2List.length > 0 ? `
            <div>
                <h4 class="font-black text-xs uppercase tracking-wider text-indigo-900 mb-2.5 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">II</span>
                    PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG / SAI (${r2List.length} CÂU)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${r2Cards}
                </div>
            </div>` : ''}

            <!-- Part III Answers -->
            ${r3List.length > 0 ? `
            <div>
                <h4 class="font-black text-xs uppercase tracking-wider text-indigo-900 mb-2.5 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">III</span>
                    PHẦN III: CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (${r3List.length} CÂU)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    ${r3Cards}
                </div>
            </div>` : ''}

            <!-- Signature block -->
            <div class="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-end text-xs text-slate-600 gap-4">
                <div class="space-y-1">
                    <p><i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> Tôi xác nhận đã hoàn thành bài thi với toàn bộ các phương án đã chọn trên đây.</p>
                    <p class="text-[11px] text-slate-400">Mã giao dịch xác thực: <span class="font-mono text-slate-600">${rec.id || 'N/A'}</span></p>
                </div>
                <div class="text-center font-bold">
                    <span class="block text-slate-400 text-[10px] uppercase tracking-wider">Chữ ký thí sinh</span>
                    <div class="h-8 flex items-center justify-center text-indigo-700 italic font-mono text-sm">${rec.studentName}</div>
                </div>
            </div>
        </div>
    `;

    triggerMathJax(container);
}

/**
 * In phiếu trả lời trắc nghiệm chuẩn A4 để lưu trữ hồ sơ
 */
function printStudentAnswerSheet() {
    let rec = state.lastSubmission || buildSubmissionRecord(1);
    let printWin = window.open('', '_blank');
    if (!printWin) {
        showToast("Vui lòng cho phép mở popup để in phiếu trả lời!", true);
        return;
    }

    let r1List = rec.breakdown?.round1 || [];
    let r2List = rec.breakdown?.round2 || [];
    let r3List = rec.breakdown?.round3 || [];

    let getSelectedLetter = (q) => {
        if (!q.userChoice || !q.options) return '-';
        let idx = q.options.findIndex(opt => stripOptionPrefix(opt).trim() === stripOptionPrefix(q.userChoice).trim());
        return idx !== -1 ? ['A', 'B', 'C', 'D'][idx] : '-';
    };

    let r1Rows = r1List.map(q => {
        let sel = getSelectedLetter(q);
        return `
        <tr>
            <td style="text-align: center; font-weight: bold; border: 1px solid #000; padding: 4px;">Câu ${q.index}</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px; font-weight: bold; ${sel === 'A' ? 'background: #000; color: #fff;' : ''}">A</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px; font-weight: bold; ${sel === 'B' ? 'background: #000; color: #fff;' : ''}">B</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px; font-weight: bold; ${sel === 'C' ? 'background: #000; color: #fff;' : ''}">C</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px; font-weight: bold; ${sel === 'D' ? 'background: #000; color: #fff;' : ''}">D</td>
            <td style="text-align: center; border: 1px solid #000; padding: 4px; font-weight: bold; color: #1e3a8a;">${sel !== '-' ? sel : 'Trống'}</td>
        </tr>`;
    }).join('');

    let r2Rows = r2List.map(q => {
        let stmts = q.statements || [];
        return `
        <tr>
            <td style="text-align: center; font-weight: bold; border: 1px solid #000; padding: 4px;">Câu ${q.index}</td>
            ${stmts.map(s => `
                <td style="text-align: center; border: 1px solid #000; padding: 4px; font-weight: bold;">
                    <b>${s.label})</b> ${s.userChoice || '-'}
                </td>
            `).join('')}
        </tr>`;
    }).join('');

    let r3Rows = r3List.map(q => `
        <tr>
            <td style="text-align: center; font-weight: bold; border: 1px solid #000; padding: 5px; width: 80px;">Câu ${q.index}</td>
            <td style="border: 1px solid #000; padding: 5px; font-family: monospace; font-size: 14px; font-weight: bold; color: #1e3a8a;">${q.userChoice || '(Bỏ trống)'}</td>
        </tr>
    `).join('');

    let docHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Phiếu Trả Lời Trắc Nghiệm - ${rec.studentName}</title>
        <style>
            body { font-family: 'Times New Roman', serif; padding: 25px; color: #000; line-height: 1.4; font-size: 13px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: bold; text-transform: uppercase; margin: 4px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 14px; padding: 8px; border: 1px solid #000; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px; }
            th { background: #f1f5f9; border: 1px solid #000; padding: 5px; text-align: center; }
            .sec-title { font-weight: bold; font-size: 13px; text-transform: uppercase; margin: 10px 0 4px 0; }
            @media print { button { display: none; } body { padding: 0; } }
        </style>
    </head>
    <body>
        <div style="text-align: right; margin-bottom: 10px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #000; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">🖨️ In Phiếu Trả Lời A4</button>
        </div>
        <div class="header">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase;">SỞ GD&ĐT • HỆ THỐNG KHẢO THÍ TOÁN HỌC EDUMATH TBS</div>
            <div class="title">PHIẾU TRẢ LỜI TRẮC NGHIỆM CỦA HỌC SINH</div>
            <div style="font-style: italic; font-size: 11px;">Mã đề thi: <b>${rec.examCode}</b> • Ngày làm bài: ${rec.submittedAt}</div>
        </div>

        <div class="info-grid">
            <div>Họ và tên thí sinh: <b>${rec.studentName}</b></div>
            <div>Mã số ID/SBD: <b>${rec.studentId}</b></div>
            <div>Lớp: <b>${rec.studentClass}</b></div>
            <div>Tên bài kiểm tra: <b>${rec.examTitle}</b></div>
        </div>

        ${r1List.length > 0 ? `
            <div class="sec-title">PHẦN I: Câu hỏi trắc nghiệm 4 lựa chọn (Tô đen phương án chọn)</div>
            <table>
                <thead>
                    <tr><th style="width: 80px;">Câu</th><th>A</th><th>B</th><th>C</th><th>D</th><th style="width: 100px;">Đã chọn</th></tr>
                </thead>
                <tbody>${r1Rows}</tbody>
            </table>
        ` : ''}

        ${r2List.length > 0 ? `
            <div class="sec-title">PHẦN II: Câu hỏi trắc nghiệm Đúng / Sai</div>
            <table>
                <thead>
                    <tr><th style="width: 80px;">Câu</th><th>Ý a)</th><th>Ý b)</th><th>Ý c)</th><th>Ý d)</th></tr>
                </thead>
                <tbody>${r2Rows}</tbody>
            </table>
        ` : ''}

        ${r3List.length > 0 ? `
            <div class="sec-title">PHẦN III: Câu hỏi trắc nghiệm Trả lời ngắn</div>
            <table>
                <thead>
                    <tr><th style="width: 80px;">Câu</th><th>Kết quả trả lời của thí sinh</th></tr>
                </thead>
                <tbody>${r3Rows}</tbody>
            </table>
        ` : ''}

        <div style="margin-top: 30px; display: flex; justify-content: space-between; text-align: center;">
            <div>
                <b>XÁC NHẬN CỦA THÍ SINH</b><br>
                <span style="font-size: 10px; font-style: italic;">(Ký và ghi rõ họ tên)</span>
                <div style="margin-top: 35px; font-weight: bold;">${rec.studentName}</div>
            </div>
            <div>
                <b>CÁN BỘ COI THI / GIÁO VIÊN</b><br>
                <span style="font-size: 10px; font-style: italic;">(Ký duyệt lưu trữ)</span>
            </div>
        </div>
    </body>
    </html>
    `;

    printWin.document.write(docHtml);
    printWin.document.close();
}

/**
 * =========================================================================
 * 2. ĐỐI CHIẾU ĐÁP ÁN SONG SONG 2 MÀN HÌNH (SPLIT SCREEN COMPARISON)
 * =========================================================================
 */
function confirmAnswerSheetAndShowComparison() {
    let answerSheetModal = document.getElementById('student-answer-sheet-modal');
    if (answerSheetModal) answerSheetModal.classList.add('hidden');

    let compModal = document.getElementById('student-comparison-modal');
    if (compModal) {
        compModal.classList.remove('hidden');
        renderStudentComparison(state.lastSubmission);
    }
}

function backToAnswerSheetModal() {
    let compModal = document.getElementById('student-comparison-modal');
    if (compModal) compModal.classList.add('hidden');

    let answerSheetModal = document.getElementById('student-answer-sheet-modal');
    if (answerSheetModal) answerSheetModal.classList.remove('hidden');
}

function proceedToFinalStatsModal() {
    let compModal = document.getElementById('student-comparison-modal');
    if (compModal) compModal.classList.add('hidden');

    let statsModal = document.getElementById('stats-modal');
    if (statsModal) {
        statsModal.classList.remove('hidden');
        triggerConfetti();
        playSound('success');
    }
}

function renderStudentComparison(rec) {
    if (!rec) rec = state.lastSubmission || buildSubmissionRecord(1);
    
    // 1. Render Score Banner
    let bannerEl = document.getElementById('comparison-score-banner');
    if (bannerEl) {
        bannerEl.innerHTML = `
            <div class="flex items-center gap-3 flex-wrap">
                <span class="bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-xs">
                    <i class="fa-solid fa-user-check mr-1"></i> ${rec.studentName} (${rec.studentClass})
                </span>
                <span class="bg-white text-slate-700 px-3 py-1 rounded-xl text-xs border border-indigo-200">
                    Mã đề: <b class="text-purple-700">${rec.examCode}</b>
                </span>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
                <span class="bg-sky-100 text-sky-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-sky-300">Phần I: <b>${rec.scoreR1}đ</b></span>
                <span class="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-300">Phần II: <b>${rec.scoreR2}đ</b></span>
                <span class="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-rose-300">Phần III: <b>${rec.scoreR3}đ</b></span>
                <span class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-1 rounded-xl text-xs font-black shadow-md">
                    Tổng: ${rec.score} / 10.0đ
                </span>
            </div>
        `;
    }

    // 2. Render 2-column split body
    let container = document.getElementById('student-comparison-split-body');
    if (!container) return;

    let r1List = rec.breakdown?.round1 || [];
    let r2List = rec.breakdown?.round2 || [];
    let r3List = rec.breakdown?.round3 || [];

    // Left Column: Student Answers
    let leftHtml = `
        <div class="space-y-4">
            <div class="p-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl shadow-xs font-black text-xs uppercase tracking-wider flex items-center justify-between sticky top-0 z-20">
                <span><i class="fa-solid fa-user-pen mr-1.5"></i> CỘT 1: BÀI LÀM CỦA HỌC SINH</span>
                <span class="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">Đã chấm điểm</span>
            </div>

            <!-- Part I Student -->
            ${r1List.map(q => `
                <div class="p-4 bg-white rounded-2xl border-2 ${q.isCorrect ? 'border-emerald-300 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'} shadow-2xs space-y-2">
                    <div class="flex items-center justify-between text-xs font-black">
                        <span class="text-indigo-900">Câu ${q.index} (Phần I - TN 4LC)</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] ${q.isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                            ${q.isCorrect ? '✓ ĐÚNG (+0.25đ)' : '✗ SAI (0.00đ)'}
                        </span>
                    </div>
                    <div class="text-xs font-medium text-slate-700 math-scroll line-clamp-3">
                        ${parseMarkdownSafe(q.text || '', true)}
                    </div>
                    <div class="p-2.5 rounded-xl border text-xs font-bold ${q.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}">
                        Lựa chọn của bạn: <b class="font-mono">${q.userChoice ? parseMarkdownSafe(q.userChoice, true) : '<span class="italic text-slate-400">Chưa làm</span>'}</b>
                    </div>
                </div>
            `).join('')}

            <!-- Part II Student -->
            ${r2List.map(q => `
                <div class="p-4 bg-white rounded-2xl border-2 ${q.points > 0 ? 'border-amber-300 bg-amber-50/20' : 'border-rose-200 bg-rose-50/20'} shadow-2xs space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-black">
                        <span class="text-indigo-900">Câu ${q.index} (Phần II - Đúng/Sai)</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                            Đạt: +${q.points}đ (${q.correctStatementsCount}/4 ý đúng)
                        </span>
                    </div>
                    <div class="text-xs font-medium text-slate-700 math-scroll line-clamp-2">
                        ${parseMarkdownSafe(q.text || '', true)}
                    </div>
                    <div class="space-y-1.5 text-xs font-mono">
                        ${(q.statements || []).map(s => `
                            <div class="p-2 rounded-lg border flex items-center justify-between ${s.isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-rose-50/80 border-rose-200 text-rose-950'}">
                                <span><b>${s.label})</b> ${s.userChoice ? s.userChoice : '<span class="text-slate-400">Trống</span>'}</span>
                                <span class="text-[10px] font-bold ${s.isCorrect ? 'text-emerald-700' : 'text-rose-600'}">${s.isCorrect ? '✓ Đúng' : '✗ Sai'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}

            <!-- Part III Student -->
            ${r3List.map(q => `
                <div class="p-4 bg-white rounded-2xl border-2 ${q.isCorrect ? 'border-emerald-300 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'} shadow-2xs space-y-2">
                    <div class="flex items-center justify-between text-xs font-black">
                        <span class="text-indigo-900">Câu ${q.index} (Phần III - TLN)</span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] ${q.isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                            ${q.isCorrect ? '✓ ĐÚNG (+0.50đ)' : '✗ SAI (0.00đ)'}
                        </span>
                    </div>
                    <div class="text-xs font-medium text-slate-700 math-scroll line-clamp-2">
                        ${parseMarkdownSafe(q.text || '', true)}
                    </div>
                    <div class="p-2.5 rounded-xl border text-xs font-bold ${q.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}">
                        Kết quả bạn điền: <b class="font-mono text-sm">${q.userChoice ? q.userChoice : '<span class="italic text-slate-400 font-normal">Chưa điền</span>'}</b>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Right Column: Official Answer Key + Detailed Solutions
    let rightHtml = `
        <div class="space-y-4">
            <div class="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xs font-black text-xs uppercase tracking-wider flex items-center justify-between sticky top-0 z-20">
                <span><i class="fa-solid fa-key mr-1.5"></i> CỘT 2: ĐÁP ÁN CHUẨN & LỜI GIẢI CHI TIẾT</span>
                <span class="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">Hệ thống</span>
            </div>

            <!-- Part I Official Key -->
            ${r1List.map(q => {
                let mathBadge = (typeof window.formatMathIdBadge === 'function' && q.idCode) ? window.formatMathIdBadge(q.idCode) : (q.idCode ? `<span class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-indigo-200">${q.idCode}</span>` : '');
                return `
                <div class="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-2xs space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-black flex-wrap gap-2">
                        <span class="text-slate-800 flex items-center gap-1.5">Đáp án chuẩn Câu ${q.index} ${mathBadge}</span>
                        <span class="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            Thang điểm: 0.25đ
                        </span>
                    </div>
                    <div class="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-xs font-bold text-indigo-950">
                        Đáp án đúng: <b class="text-emerald-700 font-mono text-sm">${parseMarkdownSafe(q.officialAnswer || '', true)}</b>
                    </div>
                    ${q.explanation ? `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                            <b class="text-amber-800 flex items-center gap-1.5"><i class="fa-solid fa-lightbulb text-amber-500"></i> Lời giải:</b>
                            <div class="math-scroll leading-relaxed font-medium">${formatExplanation(q.explanation)}</div>
                        </div>
                    ` : ''}
                </div>
            `;}).join('')}

            <!-- Part II Official Key -->
            ${r2List.map(q => {
                let mathBadge = (typeof window.formatMathIdBadge === 'function' && q.idCode) ? window.formatMathIdBadge(q.idCode) : (q.idCode ? `<span class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-indigo-200">${q.idCode}</span>` : '');
                return `
                <div class="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-2xs space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-black flex-wrap gap-2">
                        <span class="text-slate-800 flex items-center gap-1.5">Đáp án chuẩn Câu ${q.index} ${mathBadge}</span>
                        <span class="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            Thang điểm: 1.00đ
                        </span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        ${(q.statements || []).map(s => `
                            <div class="p-1.5 bg-indigo-50/70 rounded-lg border border-indigo-200 text-center font-bold">
                                <span class="text-slate-600">${s.label}: </span>
                                <b class="${s.officialAnswer === 'Đúng' ? 'text-emerald-700' : 'text-rose-600'}">${s.officialAnswer}</b>
                            </div>
                        `).join('')}
                    </div>
                    ${q.explanation ? `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                            <b class="text-amber-800 flex items-center gap-1.5"><i class="fa-solid fa-lightbulb text-amber-500"></i> Lời giải:</b>
                            <div class="math-scroll leading-relaxed font-medium">${formatExplanation(q.explanation)}</div>
                        </div>
                    ` : ''}
                </div>
            `;}).join('')}

            <!-- Part III Official Key -->
            ${r3List.map(q => {
                let mathBadge = (typeof window.formatMathIdBadge === 'function' && q.idCode) ? window.formatMathIdBadge(q.idCode) : (q.idCode ? `<span class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-indigo-200">${q.idCode}</span>` : '');
                return `
                <div class="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-2xs space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-black flex-wrap gap-2">
                        <span class="text-slate-800 flex items-center gap-1.5">Đáp án chuẩn Câu ${q.index} ${mathBadge}</span>
                        <span class="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            Thang điểm: 0.50đ
                        </span>
                    </div>
                    <div class="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-xs font-bold text-indigo-950">
                        Đáp án số chuẩn: <b class="text-emerald-700 font-mono text-sm">${parseMarkdownSafe(q.officialAnswer || '', true)}</b>
                    </div>
                    ${q.explanation ? `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                            <b class="text-amber-800 flex items-center gap-1.5"><i class="fa-solid fa-lightbulb text-amber-500"></i> Lời giải:</b>
                            <div class="math-scroll leading-relaxed font-medium">${formatExplanation(q.explanation)}</div>
                        </div>
                    ` : ''}
                </div>
            `;}).join('')}
        </div>
    `;

    container.innerHTML = leftHtml + rightHtml;
    triggerMathJax(container);
}

/**
 * In bảng đối chiếu đáp án chi tiết song song (Print Comparison Report)
 */
function printComparisonReport() {
    printSubmissionReport();
}

/**
 * Export student's exam submission to JSON file
 */
function exportSubmissionJSON() {
    let data = state.lastSubmission || buildSubmissionRecord(1);
    let filename = `KetQua_${(state.studentName || 'HocSinh').replace(/[^a-zA-Z0-9_]/g, '_')}_${state.currentPlayCode || 'TBS'}.json`;
    let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    showToast("Đã tải xuống file kết quả bài làm!");
}

/**
 * Print / Export PDF score sheet and detailed exam submission report
 */
function printSubmissionReport() {
    let rec = state.lastSubmission || buildSubmissionRecord(1);
    let printWin = window.open('', '_blank');
    if (!printWin) {
        showToast("Vui lòng cho phép mở cửa sổ popup để in phiếu điểm!", true);
        return;
    }

    let r1Html = (rec.breakdown.round1 || []).map(q => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; text-align: center; font-weight: bold;">Câu ${q.index}</td>
            <td style="padding: 8px;">${q.text.substring(0, 100)}...</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: ${q.isCorrect ? '#16a34a' : '#dc2626'};">${q.userChoice ? q.userChoice.substring(0, 30) : 'Chưa làm'}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: #2563eb;">${q.officialAnswer ? q.officialAnswer.substring(0, 30) : ''}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: ${q.isCorrect ? '#16a34a' : '#dc2626'};">${q.isCorrect ? '+0.25đ' : '0.00đ'}</td>
        </tr>
    `).join('');

    let r2Html = (rec.breakdown.round2 || []).map(q => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; text-align: center; font-weight: bold;">Câu ${q.index}</td>
            <td style="padding: 8px;" colspan="3">
                ${(q.statements || []).map(s => `
                    <div style="font-size: 11px; margin-bottom: 4px;">
                        <b>${s.label})</b> ${s.text.substring(0, 80)}... 
                        | Chọn: <b style="color: ${s.isCorrect ? '#16a34a' : '#dc2626'};">${s.userChoice || 'Bỏ trống'}</b>
                        | Khóa: <b>${s.officialAnswer}</b> (${s.isCorrect ? 'Đúng' : 'Sai'})
                    </div>
                `).join('')}
            </td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: #16a34a;">+${q.points}đ</td>
        </tr>
    `).join('');

    let r3Html = (rec.breakdown.round3 || []).map(q => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; text-align: center; font-weight: bold;">Câu ${q.index}</td>
            <td style="padding: 8px;">${q.text.substring(0, 100)}...</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: ${q.isCorrect ? '#16a34a' : '#dc2626'}; font-family: monospace;">${q.userChoice || 'Chưa làm'}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: #2563eb; font-family: monospace;">${q.officialAnswer}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: ${q.isCorrect ? '#16a34a' : '#dc2626'};">${q.isCorrect ? '+0.50đ' : '0.00đ'}</td>
        </tr>
    `).join('');

    let docHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Phiếu Báo Điểm - ${rec.studentName} - ${rec.examCode}</title>
        <style>
            body { font-family: 'Times New Roman', serif; padding: 25px; color: #1e293b; line-height: 1.5; font-size: 13px; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; }
            .title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 5px 0; color: #0f172a; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
            .score-banner { display: flex; justify-content: space-around; background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 15px; border: 2px solid #94a3b8; }
            .score-box h4 { margin: 0; font-size: 11px; text-transform: uppercase; color: #64748b; }
            .score-box .val { font-size: 20px; font-weight: bold; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }
            th { background: #e2e8f0; padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; }
            td { border: 1px solid #cbd5e1; }
            .sec-title { font-weight: bold; font-size: 14px; text-transform: uppercase; margin: 12px 0 6px 0; color: #1e3a8a; }
            @media print {
                button { display: none; }
                body { padding: 0; }
            }
        </style>
    </head>
    <body>
        <div style="text-align: right; margin-bottom: 10px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ In Phiếu Điểm / Lưu PDF</button>
        </div>
        <div class="header">
            <div style="font-size: 13px; font-weight: bold; text-transform: uppercase;">HỆ THỐNG KHẢO THÍ TOÁN HỌC TRỰC TUYẾN EDUMATH TBS</div>
            <div class="title">PHIẾU BÁO ĐIỂM & KẾT QUẢ BÀI THI</div>
            <div style="font-style: italic; font-size: 12px;">Môn: Toán học • Cấu trúc chuẩn 3 Phần GDPT 2018</div>
        </div>

        <div class="info-grid">
            <div><b>Họ và tên thí sinh:</b> ${rec.studentName}</div>
            <div><b>Mã đề thi:</b> ${rec.examCode}</div>
            <div><b>Lớp / Nhóm:</b> ${rec.studentClass} (Mã ID: ${rec.studentId})</div>
            <div><b>Tên đề thi:</b> ${rec.examTitle}</div>
            <div><b>Thời gian nộp bài:</b> ${rec.submittedAt}</div>
            <div><b>Chế độ bài thi:</b> ${rec.examMode} (Lần nộp: ${rec.attempt})</div>
            <div><b>Số lần vi phạm quy chế:</b> <span style="color: ${rec.violations > 0 ? '#dc2626' : '#16a34a'}; font-weight: bold;">${rec.violations} lần</span></div>
        </div>

        <div class="score-banner">
            <div class="score-box">
                <h4>Phần I (Trắc nghiệm)</h4>
                <div class="val" style="color: #0284c7;">${rec.scoreR1}đ</div>
            </div>
            <div class="score-box">
                <h4>Phần II (Đúng/Sai)</h4>
                <div class="val" style="color: #d97706;">${rec.scoreR2}đ</div>
            </div>
            <div class="score-box">
                <h4>Phần III (Trả lời ngắn)</h4>
                <div class="val" style="color: #e11d48;">${rec.scoreR3}đ</div>
            </div>
            <div class="score-box" style="border-left: 2px solid #cbd5e1; padding-left: 20px;">
                <h4 style="color: #1e3a8a; font-weight: bold;">TỔNG ĐIỂM BÀI THI</h4>
                <div class="val" style="color: #1e3a8a; font-size: 24px;">${rec.score} / 10.0</div>
            </div>
        </div>

        ${r1Html ? `
            <div class="sec-title">Phần I: Câu hỏi Trắc nghiệm 4 lựa chọn (0.25đ / câu)</div>
            <table>
                <thead>
                    <tr><th style="width: 60px;">Câu</th><th>Nội dung câu hỏi</th><th style="width: 140px;">Phương án đã chọn</th><th style="width: 140px;">Đáp án đúng</th><th style="width: 70px;">Điểm</th></tr>
                </thead>
                <tbody>${r1Html}</tbody>
            </table>
        ` : ''}

        ${r2Html ? `
            <div class="sec-title">Phần II: Câu trắc nghiệm Đúng / Sai (Tối đa 1.00đ / câu)</div>
            <table>
                <thead>
                    <tr><th style="width: 60px;">Câu</th><th colspan="3">Chi tiết các mệnh đề (a, b, c, d) & Lựa chọn của thí sinh</th><th style="width: 70px;">Điểm</th></tr>
                </thead>
                <tbody>${r2Html}</tbody>
            </table>
        ` : ''}

        ${r3Html ? `
            <div class="sec-title">Phần III: Câu trắc nghiệm Trả lời ngắn (0.50đ / câu)</div>
            <table>
                <thead>
                    <tr><th style="width: 60px;">Câu</th><th>Nội dung câu hỏi</th><th style="width: 140px;">Kết quả thí sinh nhập</th><th style="width: 140px;">Đáp án chuẩn</th><th style="width: 70px;">Điểm</th></tr>
                </thead>
                <tbody>${r3Html}</tbody>
            </table>
        ` : ''}

        <div style="margin-top: 30px; display: flex; justify-content: space-between; text-align: center;">
            <div>
                <b>HỌC SINH KÝ XÁC NHẬN</b><br>
                <span style="font-size: 11px; color: #64748b;">(Ký và ghi rõ họ tên)</span>
            </div>
            <div>
                <b>GIÁO VIÊN BỘ MÔN</b><br>
                <span style="font-size: 11px; color: #64748b;">(Xác nhận kết quả)</span>
            </div>
        </div>
    </body>
    </html>
    `;

    printWin.document.write(docHtml);
    printWin.document.close();
}

/**
 * Open Student Exam History Modal
 */
function openStudentExamHistoryModal() {
    let modal = document.getElementById('student-history-modal');
    if (!modal) return;
    renderStudentHistoryList();
    modal.classList.remove('hidden');
}

function closeStudentExamHistoryModal() {
    let modal = document.getElementById('student-history-modal');
    if (modal) modal.classList.add('hidden');
}

function renderStudentHistoryList() {
    let container = document.getElementById('student-history-body');
    if (!container) return;

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('math_tbs_student_submissions') || '[]');
    } catch(e){}

    if (history.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div class="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <h4 class="font-black text-slate-700 text-base mb-1">Chưa có lịch sử làm bài nào được lưu</h4>
                <p class="text-xs text-slate-500">Mỗi khi bạn nộp một bài thi hoặc bài luyện tập, kết quả chi tiết sẽ tự động được lưu an toàn tại đây để trích xuất.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map((sub, idx) => `
        <div class="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-300 transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 font-mono font-black text-xs rounded-lg">Mã: ${sub.examCode || 'TBS'}</span>
                    <span class="px-2.5 py-0.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg">${sub.examMode || 'Bài thi'}</span>
                    <span class="text-[11px] text-slate-400 font-medium"><i class="fa-solid fa-clock mr-1"></i>${sub.submittedAt || ''}</span>
                </div>
                <h4 class="font-black text-slate-800 text-sm md:text-base">${sub.examTitle || 'Đề thi Toán'}</h4>
                <div class="text-xs text-slate-500 font-medium">
                    Thí sinh: <b>${sub.studentName}</b> (${sub.studentClass}) 
                    ${sub.violations > 0 ? `• <span class="text-rose-600 font-bold">Vi phạm: ${sub.violations} lần</span>` : ''}
                </div>
            </div>

            <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div class="text-right">
                    <div class="text-2xl font-black text-indigo-950 font-display">${sub.score} <span class="text-xs font-bold text-slate-400">/ 10đ</span></div>
                    <div class="text-[10px] text-slate-500 font-bold">I:${sub.scoreR1}đ | II:${sub.scoreR2}đ | III:${sub.scoreR3}đ</div>
                </div>
                <div class="flex flex-col gap-1.5">
                    <button onclick="loadPastSubmissionToReview(${idx})" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs btn-3d" title="Xem lại bài làm này">
                        <i class="fa-solid fa-file-signature mr-1"></i> Xem lại
                    </button>
                    <button onclick="downloadHistoryJSON(${idx})" class="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl font-bold text-xs" title="Tải JSON">
                        <i class="fa-solid fa-download mr-1"></i> Tải JSON
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadPastSubmissionToReview(historyIndex) {
    try {
        let history = JSON.parse(localStorage.getItem('math_tbs_student_submissions') || '[]');
        let sub = history[historyIndex];
        if (!sub) return;
        
        state.lastSubmission = sub;
        state.userChoices = sub.userChoices || {};
        state.answeredQuestions = sub.answeredQuestions || [];
        state.score = sub.score;
        state.scoreR1 = sub.scoreR1;
        state.scoreR2 = sub.scoreR2;
        state.scoreR3 = sub.scoreR3;
        state.isSubmitted = true;
        
        closeStudentExamHistoryModal();
        renderDashboard();
        showToast("Đã tải lại kết quả bài thi để xem chi tiết!");
    } catch(e) {
        console.warn("Lỗi load submission:", e);
    }
}

function downloadHistoryJSON(historyIndex) {
    try {
        let history = JSON.parse(localStorage.getItem('math_tbs_student_submissions') || '[]');
        let sub = history[historyIndex];
        if (!sub) return;
        let filename = `KetQua_${(sub.studentName || 'HocSinh').replace(/[^a-zA-Z0-9_]/g, '_')}_${sub.examCode || 'TBS'}.json`;
        let blob = new Blob([JSON.stringify(sub, null, 2)], { type: 'application/json;charset=utf-8' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    } catch(e){}
}

function clearStudentExamHistory() {
    if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi đã lưu trên trình duyệt này?")) return;
    localStorage.removeItem('math_tbs_student_submissions');
    renderStudentHistoryList();
    showToast("Đã xóa lịch sử làm bài trên máy này!");
}

window.addEventListener('beforeunload', function (e) {
    if (state.currentPlayCode && !document.getElementById('result-modal')) {
        e.preventDefault(); e.returnValue = '';
    }
});

document.addEventListener('click', (e) => {
    let m = document.getElementById('persistent-dropdown-menu');
    if(m && !m.classList.contains('hidden') && !e.target.closest('#persistent-dropdown-menu') && !e.target.closest('#floating-menu-btn') && !e.target.closest('#header-menu-btn')) {
        m.classList.add('hidden');
    }
});

// ==========================================
// STUDENT THEORY SCAFFOLDING & MODAL ENGINE (3 PHẦN CHUẨN GDPT 2018)
// ==========================================

let _studentTheoryActiveTab = 'core';

function openStudentTheoryModal(initialTab) {
    let modal = document.getElementById('student-theory-modal');
    if (!modal) return;
    
    if (initialTab) {
        _studentTheoryActiveTab = initialTab;
    }
    
    renderStudentTheoryModalContent();
    modal.classList.remove('hidden');
}

function switchStudentTheoryTab(tabKey) {
    _studentTheoryActiveTab = tabKey;
    renderStudentTheoryModalContent();
    if (typeof playSound === 'function') playSound('click');
}

function toggleStudentAppSolution(idx) {
    let solEl = document.getElementById(`student-app-sol-${idx}`);
    let btnEl = document.getElementById(`student-app-btn-${idx}`);
    if (!solEl) return;
    
    let isHidden = solEl.classList.contains('hidden');
    solEl.classList.toggle('hidden', !isHidden);
    if (btnEl) {
        btnEl.innerHTML = isHidden 
            ? '<i class="fa-solid fa-eye-slash text-amber-500"></i> Ẩn Lời Giải' 
            : '<i class="fa-solid fa-eye text-emerald-600"></i> Xem Lời Giải';
    }
    if (isHidden) {
        triggerMathJax(solEl);
    }
}

function startOrContinueExamFromTheory() {
    closeStudentTheoryModal();
    if (typeof playSound === 'function') playSound('click');
    
    // If student is in lobby, start Round 1 or scroll to exam sections
    if (typeof state !== 'undefined') {
        if (!state.currentRound) {
            if (typeof selectRound === 'function') {
                selectRound('round1');
            }
        }
    }
}

function toggleStudentPracticeHint(idx) {
    let el = document.getElementById(`student-practice-hint-${idx}`);
    let btn = document.getElementById(`student-practice-btn-${idx}`);
    if (!el) return;
    let isHidden = el.classList.contains('hidden');
    el.classList.toggle('hidden', !isHidden);
    if (btn) {
        btn.innerHTML = isHidden 
            ? '<i class="fa-solid fa-eye-slash text-amber-500"></i> Ẩn Gợi Ý' 
            : '<i class="fa-solid fa-lightbulb text-amber-500"></i> Xem Gợi Ý & Đáp Số';
    }
}

function renderStudentTheoryModalContent() {
    let th = GAME_DATA?.theory || {};
    let title = th.title || "Lý Thuyết & Công Thức Cốt Lõi";
    let summary = th.summary || "";
    let sections = Array.isArray(th.sections) ? th.sections : [];
    let formulas = Array.isArray(th.formulas) ? th.formulas : (th.formulas ? [th.formulas] : []);
    let methods = th.methods || "";
    let traps = th.traps || "";
    let examples = Array.isArray(th.examples) ? th.examples : [];
    let applications = Array.isArray(th.applications) ? th.applications : [];
    let practiceExercises = Array.isArray(th.practiceExercises) ? th.practiceExercises : [];
    let st = th.style || { align: 'left', fontSize: 'base', theme: 'teal', cardStyle: 'modern' };

    let alignCls = st.align === 'center' ? 'theory-align-center' : (st.align === 'justify' ? 'theory-align-justify' : 'theory-align-left');
    let fontCls = st.fontSize === 'sm' ? 'theory-font-sm' : (st.fontSize === 'lg' ? 'theory-font-lg' : (st.fontSize === 'xl' ? 'theory-font-xl' : 'theory-font-base'));
    let cardCls = st.cardStyle === 'elevation' ? 'theory-card-elevation' : (st.cardStyle === 'glass' ? 'theory-card-glass' : (st.cardStyle === 'minimal' ? 'theory-card-minimal' : 'theory-card-modern'));
    let themeCardCls = `theme-${st.theme || 'teal'}-card`;
    let themeAccentCls = `theme-${st.theme || 'teal'}-accent`;

    let titleEl = document.getElementById('theory-modal-title');
    if (titleEl) titleEl.innerText = title;

    let bodyEl = document.getElementById('theory-modal-body');
    if (!bodyEl) return;

    let hasCore = summary || formulas.length > 0 || methods || traps;
    let hasSections = sections.length > 0 || examples.length > 0;
    let hasApps = applications.length > 0;
    let hasPractice = practiceExercises.length > 0;

    if (!hasCore && !hasSections && !hasApps && !hasPractice) {
        bodyEl.innerHTML = `
            <div class="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div class="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                    <i class="fa-solid fa-book-open"></i>
                </div>
                <h4 class="font-black text-slate-700 text-base mb-1">Chưa có dữ liệu sổ tay lý thuyết riêng cho đề này</h4>
                <p class="text-xs text-slate-500">Giáo viên chưa đính kèm tóm tắt chuyên đề. Bạn hãy tự tin vận dụng kiến thức đã học để hoàn thành tốt bài thi nhé!</p>
            </div>
        `;
        return;
    }

    // Tab Navigation Header (4 Tabs)
    let navHtml = `
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-4 overflow-x-auto text-xs shrink-0">
            <button onclick="switchStudentTheoryTab('core')" class="flex-1 py-2 px-3 rounded-xl font-black transition flex items-center justify-center gap-1.5 whitespace-nowrap ${_studentTheoryActiveTab === 'core' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'}">
                <i class="fa-solid fa-bolt ${_studentTheoryActiveTab === 'core' ? 'text-amber-300' : 'text-indigo-500'}"></i> 1. Tóm Tắt & Công Thức
            </button>
            <button onclick="switchStudentTheoryTab('examples')" class="flex-1 py-2 px-3 rounded-xl font-black transition flex items-center justify-center gap-1.5 whitespace-nowrap ${_studentTheoryActiveTab === 'examples' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'}">
                <i class="fa-solid fa-book-bookmark ${_studentTheoryActiveTab === 'examples' ? 'text-amber-300' : 'text-teal-500'}"></i> 2. Lý Thuyết & Ví Dụ ${hasSections ? `(${sections.length || examples.length})` : ''}
            </button>
            <button onclick="switchStudentTheoryTab('applications')" class="flex-1 py-2 px-3 rounded-xl font-black transition flex items-center justify-center gap-1.5 whitespace-nowrap ${_studentTheoryActiveTab === 'applications' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'}">
                <i class="fa-solid fa-earth-americas ${_studentTheoryActiveTab === 'applications' ? 'text-emerald-300' : 'text-emerald-500'}"></i> 3. Áp Dụng Thực Tế ${hasApps ? `(${applications.length})` : ''}
            </button>
            <button onclick="switchStudentTheoryTab('practice')" class="flex-1 py-2 px-3 rounded-xl font-black transition flex items-center justify-center gap-1.5 whitespace-nowrap ${_studentTheoryActiveTab === 'practice' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'}">
                <i class="fa-solid fa-graduation-cap ${_studentTheoryActiveTab === 'practice' ? 'text-amber-300' : 'text-amber-500'}"></i> 4. Bài Tự Luyện ${hasPractice ? `(${practiceExercises.length})` : ''}
            </button>
        </div>
    `;

    let contentHtml = '';

    if (_studentTheoryActiveTab === 'core') {
        contentHtml = `
            <div class="space-y-4 fade-in">
                ${summary ? `
                    <div class="${cardCls} ${themeCardCls} p-4 md:p-5 border">
                        <h4 class="font-black text-sm md:text-base mb-2 flex items-center gap-2 uppercase tracking-wide">
                            <i class="fa-solid fa-bookmark text-teal-600"></i> Bức Tranh Tổng Quan & Định Lý Then Chốt
                        </h4>
                        <div class="prose-math ${alignCls} ${fontCls} text-slate-800 leading-relaxed font-medium">
                            ${parseMarkdownSafe(summary, false)}
                        </div>
                    </div>
                ` : ''}

                ${formulas.length > 0 ? `
                    <div class="${cardCls} bg-white p-4 md:p-5 border border-slate-200 shadow-2xs">
                        <h4 class="font-black text-slate-900 text-sm md:text-base mb-3 flex items-center gap-2 uppercase tracking-wide">
                            <i class="fa-solid fa-square-root-variable text-indigo-600"></i> Bảng Công Thức Trọng Tâm (${formulas.length})
                        </h4>
                        <div class="space-y-2">
                            ${formulas.map(f => `
                                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-center text-xs md:text-sm math-scroll overflow-x-auto shadow-2xs">
                                    ${parseMarkdownSafe(f, false)}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${methods ? `
                    <div class="${cardCls} bg-white p-4 md:p-5 border border-slate-200 shadow-2xs">
                        <h4 class="font-black ${themeAccentCls} text-sm md:text-base mb-2 flex items-center gap-2 uppercase tracking-wide">
                            <i class="fa-solid fa-list-check"></i> Sơ Đồ Thuật Toán & Phương Pháp Giải Theo Bước
                        </h4>
                        <div class="prose-math ${alignCls} ${fontCls} text-slate-800 leading-relaxed font-medium">
                            ${parseMarkdownSafe(methods, false)}
                        </div>
                    </div>
                ` : ''}

                ${traps ? `
                    <div class="${cardCls} bg-rose-50 p-4 md:p-5 border border-rose-200">
                        <h4 class="font-black text-rose-900 text-sm md:text-base mb-2 flex items-center gap-2 uppercase tracking-wide">
                            <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> Cảnh Báo Bẫy Sai Lầm & Lưu Ý Phòng Thi
                        </h4>
                        <div class="prose-math ${alignCls} ${fontCls} text-rose-950 leading-relaxed font-medium">
                            ${parseMarkdownSafe(traps, false)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    } else if (_studentTheoryActiveTab === 'examples') {
        if (!hasSections) {
            contentHtml = `
                <div class="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p class="text-xs text-slate-500 font-medium">Chưa có danh sách lý thuyết chi tiết & ví dụ mẫu riêng cho chủ đề này.</p>
                </div>`;
        } else {
            contentHtml = `
                <div class="space-y-4 fade-in">
                    ${sections.length > 0 ? sections.map((sec, i) => `
                        <div class="${cardCls} p-4 md:p-5 bg-white border border-teal-200 shadow-2xs space-y-3">
                            <div class="flex items-center justify-between gap-2 border-b border-teal-100 pb-2">
                                <span class="font-black text-xs md:text-sm text-teal-900 uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-book-bookmark text-teal-600"></i> ${sec.title || `Mục ${i + 1}`}
                                </span>
                                <span class="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">Mục #${i+1}</span>
                            </div>
                            <div class="prose-math text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                                ${parseMarkdownSafe(sec.content || '', false)}
                            </div>
                            ${sec.example ? `
                            <div class="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                                <div class="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                                    <i class="fa-solid fa-lightbulb text-amber-500"></i> Ví dụ áp dụng ngay:
                                </div>
                                <div class="prose-math text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-indigo-100 font-medium">
                                    ${parseMarkdownSafe(sec.example.question || '', false)}
                                </div>
                                <div class="prose-math text-xs text-indigo-950 bg-indigo-100/50 p-3 rounded-lg border border-indigo-200">
                                    ${parseMarkdownSafe(sec.example.solution || '', false)}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    `).join('') : ''}

                    ${examples.length > 0 ? examples.map((ex, i) => `
                        <div class="${cardCls} p-4 md:p-5 bg-white border border-indigo-200 shadow-2xs space-y-3">
                            <div class="flex items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                                <span class="font-black text-xs md:text-sm text-indigo-900 uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-lightbulb text-amber-500"></i> ${ex.typeName || `Ví Dụ Mẫu ${i + 1}`}
                                </span>
                                <span class="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Mẫu #${i+1}</span>
                            </div>
                            <div>
                                <div class="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Đề bài:</div>
                                <div class="prose-math text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                                    ${parseMarkdownSafe(ex.question || '', false)}
                                </div>
                            </div>
                            <div>
                                <div class="text-[11px] font-bold text-indigo-800 mb-1 uppercase tracking-wider flex items-center gap-1">
                                    <i class="fa-solid fa-file-signature text-indigo-600"></i> Lời giải chi tiết:
                                </div>
                                <div class="prose-math text-xs text-indigo-950 bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 leading-relaxed">
                                    ${parseMarkdownSafe(ex.solution || '', false)}
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            `;
        }
    } else if (_studentTheoryActiveTab === 'applications') {
        if (!hasApps) {
            contentHtml = `
                <div class="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p class="text-xs text-slate-500 font-medium">Chưa có bài toán áp dụng thực tế riêng cho chủ đề này.</p>
                </div>`;
        } else {
            contentHtml = `
                <div class="space-y-4 fade-in">
                    <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                        <i class="fa-solid fa-circle-info text-emerald-600 text-sm shrink-0"></i>
                        <span><strong>Mẹo luyện tập:</strong> Hãy đọc đề bài và tự nháp lời giải trước, sau đó bấm <strong>"Xem Lời Giải"</strong> để so sánh kết quả!</span>
                    </div>
                    ${applications.map((app, i) => `
                        <div class="${cardCls} p-4 md:p-5 bg-white border border-emerald-200 shadow-2xs space-y-3">
                            <div class="flex items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                                <span class="font-black text-xs md:text-sm text-emerald-900 uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-earth-americas text-emerald-600"></i> ${app.title || `Bài Toán Thực Tế ${i + 1}`}
                                </span>
                                <button id="student-app-btn-${i}" onclick="toggleStudentAppSolution(${i})" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 transition flex items-center gap-1.5 shadow-2xs btn-3d">
                                    <i class="fa-solid fa-eye text-emerald-600"></i> Xem Lời Giải
                                </button>
                            </div>
                            <div>
                                <div class="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tình huống thực tiễn:</div>
                                <div class="prose-math text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                                    ${parseMarkdownSafe(app.question || '', false)}
                                </div>
                            </div>
                            <div id="student-app-sol-${i}" class="hidden space-y-1">
                                <div class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                    <i class="fa-solid fa-check-double text-emerald-600"></i> Phương pháp giải & Đáp án:
                                </div>
                                <div class="prose-math text-xs text-emerald-950 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 leading-relaxed">
                                    ${parseMarkdownSafe(app.solution || '', false)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else if (_studentTheoryActiveTab === 'practice') {
        if (!hasPractice) {
            contentHtml = `
                <div class="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p class="text-xs text-slate-500 font-medium">Chưa có bài tập tự luyện riêng cho chủ đề này.</p>
                </div>`;
        } else {
            contentHtml = `
                <div class="space-y-4 fade-in">
                    <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
                        <i class="fa-solid fa-graduation-cap text-amber-600 text-sm shrink-0"></i>
                        <span><strong>Tự luyện tư duy:</strong> Hãy làm bài ra nháp trước khi bấm <strong>"Xem Gợi Ý & Đáp Số"</strong> để rèn luyện kỹ năng giải toán!</span>
                    </div>
                    ${practiceExercises.map((pr, i) => `
                        <div class="${cardCls} p-4 md:p-5 bg-white border border-amber-300 shadow-2xs space-y-3">
                            <div class="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-black text-xs md:text-sm text-amber-950 uppercase flex items-center gap-1.5">
                                        <i class="fa-solid fa-pen-to-square text-amber-600"></i> Bài Tự Luyện ${i + 1}
                                    </span>
                                    <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200">${pr.level || 'Vận dụng'}</span>
                                </div>
                                <button id="student-practice-btn-${i}" onclick="toggleStudentPracticeHint(${i})" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition flex items-center gap-1.5 shadow-2xs btn-3d">
                                    <i class="fa-solid fa-lightbulb text-amber-600"></i> Xem Gợi Ý & Đáp Số
                                </button>
                            </div>
                            <div>
                                <div class="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Đề bài câu hỏi:</div>
                                <div class="prose-math text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                                    ${parseMarkdownSafe(pr.question || '', false)}
                                </div>
                            </div>
                            <div id="student-practice-hint-${i}" class="hidden space-y-2 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200">
                                ${pr.shortAnswer ? `
                                <div class="text-xs font-black text-amber-950 flex items-center gap-1">
                                    <span>🎯 Đáp số:</span>
                                    <span class="prose-math">${parseMarkdownSafe(pr.shortAnswer, false)}</span>
                                </div>` : ''}
                                ${pr.hint ? `
                                <div class="prose-math text-xs text-slate-800 border-t border-amber-200 pt-2 leading-relaxed">
                                    ${parseMarkdownSafe(pr.hint, false)}
                                </div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    bodyEl.innerHTML = `
        ${navHtml}
        ${contentHtml}
    `;

    triggerMathJax(bodyEl);
}

function closeStudentTheoryModal() {
    let modal = document.getElementById('student-theory-modal');
    if (modal) modal.classList.add('hidden');
}



// ==================== PHASE 5: BILINGUAL GAMIFICATION & CELEBRATION ====================
function triggerBilingualVictory(score, totalMax) {
    let pct = totalMax > 0 ? (score / totalMax) * 100 : 0;
    let title = "CONGRATULATION! / CHÚC MỪNG!";
    let msg = "";

    if (pct >= 90) {
        msg = "🏆 Outstanding Math Wizard! (Xuất sắc Kiện tướng Toán học!)";
    } else if (pct >= 75) {
        msg = "🌟 Great Job! CLIL Scholar (Giỏi - Học sinh Song ngữ xuất sắc!)";
    } else if (pct >= 50) {
        msg = "👍 Good Effort! Keep progressing daily! (Khá - Tiến bộ mỗi ngày!)";
    } else {
        msg = "💪 Practice makes perfect! (Cần cù bù thông minh, tiếp tục cố gắng!)";
    }

    if (typeof showToast === 'function') showToast(msg, false);
}
window.triggerBilingualVictory = triggerBilingualVictory;


// ==================== BILINGUAL LANGUAGE SWITCHER ENGINE ====================
function setStudentLanguage(lang) {
    window.APP_LANG = lang;
    localStorage.setItem('app_lang', lang);
    updateLanguageButtonsUI();
    
    if (state.activeGameMode === 'millionaire') {
        renderMillionaireScreen();
    } else if (state.activeGameMode === 'speedrun') {
        renderSpeedRunQuestion();
    } else if (state.activeGameMode === 'bossrush') {
        renderBossRushScreen();
    } else if (state.activeGameMode === 'cardflip') {
        renderCardFlipScreen();
    } else if (state.currentQuestion) {
        openQuestion(state.currentQuestion.id);
    } else if (state.currentRound) {
        selectRound(state.currentRound);
    } else {
        renderDashboard();
    }
    
    let label = (lang === 'en' ? 'English (CLIL)' : (lang === 'bilingual' ? 'Song ngữ / Bilingual' : 'Tiếng Việt'));
    if (typeof showToast === 'function') showToast("🌐 Đã chuyển ngôn ngữ: " + label);
}
window.setStudentLanguage = setStudentLanguage;

function updateLanguageButtonsUI() {
    let current = window.APP_LANG || localStorage.getItem('app_lang') || 'vi';
    let btnVi = document.getElementById('lang-btn-vi');
    let btnEn = document.getElementById('lang-btn-en');
    let btnBi = document.getElementById('lang-btn-bilingual');
    
    const activeCls = "px-2 py-1 rounded-lg text-xs font-black transition bg-emerald-500 text-white shadow-2xs";
    const inactiveCls = "px-2 py-1 rounded-lg text-xs font-black transition text-slate-600 hover:bg-slate-100 bg-transparent";
    
    if (btnVi) btnVi.className = (current === 'vi' ? activeCls : inactiveCls);
    if (btnEn) btnEn.className = (current === 'en' ? activeCls : inactiveCls);
    if (btnBi) btnBi.className = (current === 'bilingual' ? activeCls : inactiveCls);
}
window.updateLanguageButtonsUI = updateLanguageButtonsUI;


// ==================== ARENA GAMIFICATION SUITE (5 GAME MODES) ====================

// --- GAME 1: AI LÀ TRIỆU PHÚ TOÁN HỌC (PRO ARENA) ---
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
        return `
            <div class="px-3 py-1 rounded-xl text-[11px] flex justify-between items-center transition-all duration-300 border ${itemCls}">
                <span class="font-mono font-bold w-6">${tier.level}</span>
                <span class="font-black font-display tracking-tight">${tier.prize} đ</span>
                ${tier.isMilestone ? '<i class="fa-solid fa-crown text-amber-400 text-[10px]"></i>' : (isPassed ? '<i class="fa-solid fa-check text-white text-[10px]"></i>' : '<span class="w-3"></span>')}
            </div>
        `;
    }).join('');

    let progressPercent = Math.round(((millionaireState.currentIndex + 1) / 15) * 100);

    document.getElementById('app-content').innerHTML = `
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
                            <div class="text-base font-black text-white font-display">CÂU HỎI SỐ ${millionaireState.currentIndex + 1} / 15</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 relative z-10">
                        <div class="px-3.5 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-400/50 rounded-2xl font-black text-xs shadow-inner">
                            Mốc: <span class="font-display font-black">${currLevel ? currLevel.prize : '0'} đ</span>
                        </div>
                        <button onclick="renderDashboard(); playSound('click');" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/10">
                            <i class="fa-solid fa-house mr-1"></i> Rời Game
                        </button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-indigo-900/60 p-0.5">
                    <div class="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 h-full rounded-full transition-all duration-500 shadow-xs" style="width: ${progressPercent}%"></div>
                </div>

                <!-- 4 Lifelines Bar -->
                <div class="bg-white/95 backdrop-blur p-3 rounded-2xl border-2 border-indigo-200/80 shadow-md flex items-center justify-around gap-2">
                    <button onclick="useMillionaireLifeline('fifty')" id="m-ll-fifty" ${millionaireState.lifelines.fifty ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 ${millionaireState.lifelines.fifty ? 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-scale-balanced text-sm"></i> <span>50:50</span>
                    </button>
                    <button onclick="useMillionaireLifeline('freeze')" id="m-ll-freeze" ${millionaireState.lifelines.freeze ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 ${millionaireState.lifelines.freeze ? 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-snowflake text-sm"></i> <span>Đóng Băng</span>
                    </button>
                    <button onclick="useMillionaireLifeline('audience')" id="m-ll-audience" ${millionaireState.lifelines.audience ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 ${millionaireState.lifelines.audience ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-users text-sm"></i> <span>Khán Giả AI</span>
                    </button>
                    <button onclick="useMillionaireLifeline('swap')" id="m-ll-swap" ${millionaireState.lifelines.swap ? '' : 'disabled'} class="flex-1 py-2 px-2.5 rounded-xl border-2 ${millionaireState.lifelines.swap ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'} font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs btn-3d">
                        <i class="fa-solid fa-rotate text-sm"></i> <span>Đổi Câu</span>
                    </button>
                </div>

                <!-- Glowing Question Box -->
                <div class="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-2xl border-4 border-amber-400/80 text-center relative overflow-hidden min-h-[170px] flex items-center justify-center">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none"></div>
                    <div class="relative z-10 text-base md:text-xl font-bold leading-relaxed prose-math text-white">
                        ${qContentHtml}
                    </div>
                </div>

                <!-- 4 Diamond Choice Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    ${opts.map((opt, i) => `
                        <button onclick="handleMillionaireChoice(${opt.isCorrect}, this)" id="m-opt-btn-${i}" class="m-choice-btn p-4 md:p-5 rounded-2xl border-2 border-slate-200 text-slate-800 font-bold text-sm md:text-base text-left shadow-md flex items-center gap-3.5 group btn-3d">
                            <span class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 group-hover:bg-amber-400 group-hover:text-slate-950 text-indigo-700 font-black flex items-center justify-center shrink-0 transition text-sm shadow-2xs">
                                ${opt.letter}
                            </span>
                            <span class="prose-math leading-normal flex-1">${parseMarkdownSafe(stripOptionPrefix(opt.text))}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Right: Prize Ladder Sidebar -->
            <div class="bg-slate-950 p-3.5 rounded-3xl border-2 border-indigo-900/60 shadow-2xl flex flex-col gap-1.5">
                <div class="text-[11px] font-black uppercase text-amber-400 tracking-wider text-center border-b border-slate-800 pb-2.5 mb-1 flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-stairs text-amber-400"></i> THÁP TIỀN THƯỞNG
                </div>
                ${ladderHtml}
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
    `;
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
            
            chartEl.innerHTML = ['A', 'B', 'C', 'D'].map(L => `
                <div class="flex items-center gap-2 text-xs font-bold">
                    <span class="w-6 text-slate-700 font-black">${L}:</span>
                    <div class="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden border border-slate-200">
                        <div class="bg-gradient-to-r from-amber-500 to-indigo-600 h-full rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-black" style="width: ${probs[L]}%">${probs[L]}%</div>
                    </div>
                </div>
            `).join('');
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
    document.getElementById('app-content').innerHTML = `
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
    `;
}

function handleMillionaireGameOver() {
    let safePrize = "0";
    if (millionaireState.currentIndex >= 10) safePrize = "22.000.000";
    else if (millionaireState.currentIndex >= 5) safePrize = "2.000.000";
    
    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-8 rounded-3xl max-w-md w-full text-center fade-in bg-white/95 shadow-2xl border-t-4 border-rose-500">
            <div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner border border-rose-200">
                <i class="fa-solid fa-heart-crack"></i>
            </div>
            <h2 class="text-xl font-black text-slate-800 mb-1 uppercase tracking-wide">RẤT TIẾC! CÂU TRẢ LỜI CHƯA ĐÚNG</h2>
            <p class="text-xs text-slate-500 mb-4 font-medium">Bạn đã dừng chân tại Câu số <b>${millionaireState.currentIndex + 1}</b>.</p>
            <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 mb-5">
                <span class="text-xs font-bold text-slate-500 uppercase">Tiền thưởng mốc an toàn đạt được:</span>
                <div class="text-2xl font-black text-amber-600 font-display mt-0.5">${safePrize} đ</div>
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
    `;
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

    document.getElementById('app-content').innerHTML = `
        <div class="w-full max-w-3xl fade-in flex flex-col gap-4">
            <!-- HUD Cyberpunk Header -->
            <div class="bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 p-4 rounded-3xl text-white shadow-2xl flex items-center justify-between border-2 border-amber-300/40 relative overflow-hidden">
                <div class="flex items-center gap-3 relative z-10">
                    <div class="w-12 h-12 bg-black/30 rounded-2xl backdrop-blur flex items-center justify-center text-2xl font-black shadow-inner border border-white/20">
                        ⚡
                    </div>
                    <div>
                        <div class="text-[10px] font-black uppercase tracking-wider text-amber-200">ĐUA TỐC ĐỘ • 60S TIME ATTACK</div>
                        <div class="text-2xl font-black font-display tracking-tight">ĐIỂM: ${speedRunState.score}</div>
                    </div>
                </div>

                <div class="flex items-center gap-2.5 relative z-10">
                    <div class="px-4 py-2 bg-slate-950/80 rounded-2xl border border-rose-400/50 flex items-center gap-2 shadow-inner">
                        <i class="fa-solid fa-fire text-rose-400 animate-pulse"></i>
                        <span id="sr-timer-disp" class="font-mono font-black text-2xl text-rose-400 speedrun-timer-glow">${speedRunState.timer}s</span>
                    </div>
                    <div class="px-3.5 py-2 bg-amber-400 text-slate-950 rounded-2xl font-black text-xs combo-pop-badge shadow-md">
                        COMBO x${mult}
                    </div>
                    <button onclick="clearInterval(speedRunState.intervalId); renderDashboard(); playSound('click');" class="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">
                        Thoát
                    </button>
                </div>
            </div>

            <!-- Question Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-slate-200 text-center relative overflow-hidden">
                <div class="text-base md:text-lg font-bold leading-relaxed prose-math text-slate-800">
                    ${qContentHtml}
                </div>
            </div>

            <!-- Choices -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                ${opts.map((opt, i) => `
                    <button onclick="handleSpeedRunAnswer(${opt.isCorrect})" class="p-4 rounded-2xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-500 font-bold text-slate-800 text-left transition shadow-sm flex items-center gap-3.5 btn-3d group">
                        <span class="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white font-black text-xs flex items-center justify-center transition shrink-0 shadow-2xs">
                            ${opt.letter}
                        </span>
                        <span class="prose-math text-sm">${parseMarkdownSafe(stripOptionPrefix(opt.text))}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
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
    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-8 rounded-3xl max-w-md w-full text-center fade-in bg-white/95 shadow-2xl border-t-4 border-amber-500">
            <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-rose-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-3 text-4xl shadow-xl shadow-rose-500/30 animate-pulse">
                ⚡
            </div>
            <h2 class="text-2xl font-black text-slate-800 mb-1 font-display uppercase">TỔNG KẾT ĐUA TỐC ĐỘ</h2>
            <p class="text-xs text-slate-500 font-bold mb-4">Bạn đã hoàn thành 60 giây nghẹt thở!</p>

            <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 my-4 grid grid-cols-2 gap-3 text-left shadow-inner">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Tổng điểm:</span>
                    <div class="text-2xl font-black text-indigo-600 font-display">${speedRunState.score}</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Max Combo:</span>
                    <div class="text-2xl font-black text-amber-500 font-display">x${speedRunState.maxStreak}</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Số câu đúng:</span>
                    <div class="text-lg font-black text-emerald-600">${speedRunState.correctCount} / ${speedRunState.totalCount}</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Độ chính xác:</span>
                    <div class="text-lg font-black text-sky-600">${acc}%</div>
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
    `;
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

    document.getElementById('app-content').innerHTML = `
        <div id="boss-arena-box" class="w-full max-w-4xl fade-in flex flex-col gap-4">
            <!-- Boss Arena RPG HUD -->
            <div class="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 p-5 rounded-3xl text-white shadow-2xl border-2 border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                    <div class="w-16 h-16 bg-purple-900/80 rounded-2xl border-2 border-purple-400 flex items-center justify-center text-4xl shadow-lg boss-avatar-pulse">
                        ${bossRushState.stage === 3 ? '🐉' : (bossRushState.stage === 2 ? '🛡️' : '👾')}
                    </div>
                    <div>
                        <div class="text-[11px] font-black uppercase tracking-wider text-purple-300">${bossRushState.bossName}</div>
                        <div class="w-48 sm:w-64 bg-slate-900 rounded-full h-5 overflow-hidden border border-purple-400/50 mt-1 p-0.5 shadow-inner">
                            <div class="boss-hp-bar h-full rounded-full transition-all duration-300" style="width: ${bossPercent}%"></div>
                        </div>
                        <span class="text-xs font-black text-amber-300 font-mono mt-0.5 block">${bossRushState.bossHp} / ${bossRushState.bossMaxHp} HP (${bossPercent}%)</span>
                    </div>
                </div>

                <div class="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur">
                    <div>
                        <span class="text-[10px] font-black uppercase text-rose-300 block tracking-wider">Mạng Thí Sinh:</span>
                        <div class="flex gap-1.5 mt-0.5">${heartsHtml}</div>
                    </div>
                    <button onclick="renderDashboard()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">Thoát</button>
                </div>
            </div>

            <!-- Question Card -->
            <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-slate-200 text-center">
                <div class="text-base md:text-lg font-bold leading-relaxed prose-math text-slate-800">
                    ${qContentHtml}
                </div>
            </div>

            <!-- Choices -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                ${opts.map((opt, i) => `
                    <button onclick="handleBossRushAnswer(${opt.isCorrect})" class="p-4 rounded-2xl bg-white hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-500 font-bold text-slate-800 text-left transition shadow-sm flex items-center gap-3.5 btn-3d group">
                        <span class="w-9 h-9 rounded-xl bg-purple-100 group-hover:bg-purple-600 group-hover:text-white font-black text-xs flex items-center justify-center transition shrink-0 shadow-2xs">
                            ${opt.letter}
                        </span>
                        <span class="prose-math text-sm">${parseMarkdownSafe(stripOptionPrefix(opt.text))}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
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
        document.getElementById('app-content').innerHTML = `
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
        `;
    } else {
        playSound('wrong');
        document.getElementById('app-content').innerHTML = `
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
        `;
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
    let gridHtml = cardFlipState.cards.map((c, i) => `
        <div onclick="handleCardFlip(${i})" class="card-3d-scene aspect-square select-none cursor-pointer">
            <div class="card-3d-object ${c.isFlipped ? 'is-flipped' : ''}">
                <!-- Front Face (When hidden) -->
                <div class="card-3d-face card-3d-front">
                    <div class="flex flex-col items-center justify-center gap-1.5">
                        <i class="fa-solid fa-brain text-2xl text-amber-300"></i>
                        <span class="text-[9px] font-black uppercase text-indigo-300 tracking-wider">TBS 3D</span>
                    </div>
                </div>
                <!-- Back Face (When flipped) -->
                <div class="card-3d-face card-3d-back ${c.isMatched ? 'card-3d-matched' : ''}">
                    <span class="text-xs font-black leading-tight prose-math">${parseMarkdownSafe(c.content)}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('app-content').innerHTML = `
        <div class="w-full max-w-3xl fade-in flex flex-col gap-4">
            <div class="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 rounded-3xl text-white shadow-xl flex items-center justify-between border-2 border-emerald-400/40">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md">
                        🃏
                    </div>
                    <div>
                        <div class="text-[10px] font-black uppercase text-emerald-300 tracking-wider">LẬT THẺ TRÍ NHỚ 3D • MEMORY MATCH</div>
                        <div class="text-sm font-black text-white">Ghép đúng: <span class="text-amber-400">${cardFlipState.matchedPairs} / ${cardFlipState.totalPairs}</span> Cặp • Lượt: ${cardFlipState.moves}</div>
                    </div>
                </div>
                <button onclick="renderDashboard()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">Thoát</button>
            </div>

            <div class="bg-white/95 backdrop-blur p-4 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-2xl grid grid-cols-3 sm:grid-cols-4 gap-3">
                ${gridHtml}
            </div>
        </div>
    `;
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
