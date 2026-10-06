// portal.js - Portal Homepage, Leaderboard, Lookups & Settings Logic for EduMath TBS

let practiceMenuLoaded = false;
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
}

async function loadPracticeExams() {
    let container = document.getElementById('practice-drawer-content');
    try {
        let snap = await db.collection("AdminHistory").orderBy('createdAt', 'desc').get();
        let hist = [];
        snap.forEach(doc => hist.push(doc.data()));
        
        let d = await db.collection("GameData").doc("AdminHistory").get();
        if (d.exists) {
            let oldHist = d.data().list || [];
            hist = [...hist, ...oldHist];
        }

        let uniqueHist = [];
        let seen = new Set();
        for (let h of hist) {
            // Filter out pure games from standard exams list
            if (h.type === 'game' || h.isGame) continue;
            if (!seen.has(h.code)) {
                seen.add(h.code);
                uniqueHist.push(h);
            }
        }

        if (uniqueHist.length === 0) {
            container.innerHTML = `<div class="text-center text-slate-400 mt-10"><i class="fa-solid fa-box-open text-4xl mb-3 text-slate-300"></i><br><b class="text-slate-500">Chưa có đề luyện tập nào.</b></div>`;
            return;
        }

        let grouped = {};
        uniqueHist.forEach(h => {
            let folder = normalizeMathFolder(h.folder);
            if (!grouped[folder]) grouped[folder] = [];
            grouped[folder].push(h);
        });

        let standardOrder = ['TOAN 12', 'TOAN 11', 'TOAN 10', 'TOAN 9', 'TOAN 8', 'TOAN 7', 'TOAN 6', 'KHAC'];
        let sortedFolders = Object.keys(grouped).sort((a, b) => {
            let idxA = standardOrder.indexOf(a);
            let idxB = standardOrder.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });

        let html = '';
        for (let folder of sortedFolders) {
            let folderBadge = getMathFolderBadgeClass(folder);
            html += `
                <div class="mb-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <h3 class="font-black text-slate-700 bg-slate-100/80 px-4 py-3 text-sm uppercase tracking-wider border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-200/60 transition" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <span class="flex items-center"><i class="fa-solid fa-folder-open text-amber-500 mr-2 text-lg"></i> ${folder}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] ${folderBadge} px-2 py-0.5 rounded-lg font-black uppercase shadow-2xs border">${folder}</span>
                            <span class="bg-white text-slate-500 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">${grouped[folder].length}</span>
                        </div>
                    </h3>
                    <div class="p-3 space-y-2 hidden">
                        ${grouped[folder].map(h => `
                            <button onclick="playSound('click'); window.location.href='student.html?code=${h.code}'" class="w-full text-left p-3.5 bg-white border-2 border-slate-200/90 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-lg transition-all group relative overflow-hidden btn-3d">
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <div class="font-black text-slate-800 text-sm group-hover:text-indigo-700 leading-snug">${h.name || 'Đề thi luyện tập'}</div>
                                    <span class="text-[11px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg shadow-2xs tracking-wider shrink-0">${h.code}</span>
                                </div>
                                <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2">
                                    <span class="flex items-center text-indigo-600 font-black"><i class="fa-solid fa-gamepad mr-1"></i> THI NGAY</span>
                                    <span class="flex items-center"><i class="fa-regular fa-clock mr-1"></i>${h.date || 'Gần đây'}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        practiceMenuLoaded = true;
    } catch (e) {
        container.innerHTML = `<div class="text-center text-red-400 mt-10"><i class="fa-solid fa-triangle-exclamation text-4xl mb-3 text-red-300"></i><br><b class="text-red-500">Lỗi tải dữ liệu.</b></div>`;
    }
}

// ======================= INFOGRAPHICS 6-12 DRAWER & VIEWER =======================
async function loadInfographicsDrawer(grade) {
    selectedInfographicGrade = String(grade || selectedInfographicGrade || '12');
    let container = document.getElementById('infographics-drawer-content');
    if (!container) return;

    // Load custom infographics from service
    let customInfographics = [];
    if (typeof InfographicsService !== 'undefined') {
        try {
            customInfographics = await InfographicsService.getAll();
        } catch(e) {}
    } else {
        try {
            let local = localStorage.getItem('tbs_custom_infographics');
            if (local) customInfographics = JSON.parse(local);
        } catch(e) {}
    }

    let isTeacher = false;
    try {
        let auth = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
        isTeacher = (auth && auth.role === 'teacher') || localStorage.getItem('devModeBypass') === 'true';
    } catch(e){}

    let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[selectedInfographicGrade]) || (selectedInfographicGrade === '10' ? '0' : (selectedInfographicGrade === '11' ? '1' : (selectedInfographicGrade === '12' ? '2' : selectedInfographicGrade)));
    let gData = (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) || null;
    let driveUrl = typeof GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL !== 'undefined' ? GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL : "https://drive.google.com/drive/folders/1SFTz4ONPh1EodIWm84b1Qsgj58ggGEjG?lfhs=2";

    let gradesList = ['12', '11', '10', '9', '8', '7', '6'];
    let gradeButtonsHtml = gradesList.map(g => {
        let isSel = (g === selectedInfographicGrade);
        let gCount = customInfographics.filter(x => String(x.grade) === String(g)).length;
        return `
            <button onclick="loadInfographicsDrawer('${g}'); playSound('click');" class="px-2.5 py-1 rounded-lg font-black text-xs transition flex items-center gap-1 ${isSel ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200'}">
                <span>Lớp ${g}</span>
                ${gCount > 0 ? `<span class="text-[9px] px-1 py-0.2 rounded-full ${isSel ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'} font-bold">${gCount}</span>` : ''}
            </button>
        `;
    }).join('');

    let teacherControlBanner = isTeacher ? `
        <div class="p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 flex items-center justify-between shadow-2xs">
            <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                    <i class="fa-solid fa-shapes"></i>
                </span>
                <div>
                    <div class="text-[11px] font-black text-indigo-900 leading-tight">Phân khu Giáo Viên</div>
                    <div class="text-[10px] text-indigo-600 font-medium">Thêm & Quản lý Infographic</div>
                </div>
            </div>
            <a href="teacher.html" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1">
                <i class="fa-solid fa-gear"></i> Mở Studio
            </a>
        </div>
    ` : '';

    let html = `
        ${teacherControlBanner}

        <!-- Top Google Drive Folder Banner -->
        <div class="p-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-sky-500/10 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-2">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm shadow-inner shrink-0">
                        <i class="fa-brands fa-google-drive"></i>
                    </div>
                    <div>
                        <h4 class="font-black text-slate-800 text-xs uppercase tracking-wide">Kho Infographic GDPT 2018</h4>
                        <p class="text-[10px] text-slate-500">Sơ đồ tư duy & Tóm tắt kiến thức cốt lõi</p>
                    </div>
                </div>
                <a href="${driveUrl}" target="_blank" class="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-xl shadow-xs transition flex items-center gap-1 shrink-0">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Drive
                </a>
            </div>
        </div>

        <!-- Grade Selector -->
        <div class="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            ${gradeButtonsHtml}
        </div>

        <!-- Search Input -->
        <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
            <input type="text" id="drawer-infographic-search" oninput="filterDrawerInfographics()" placeholder="Tìm kiếm bài học, chuyên đề..." class="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 shadow-inner">
        </div>

        <!-- Chapters & Lessons Tree -->
        <div id="drawer-infographics-tree" class="space-y-3 pt-1">
    `;

    if (!gData || !gData.branches) {
        html += `<div class="p-6 text-center text-xs text-slate-400">Đang cập nhật danh mục cho Lớp ${selectedInfographicGrade}...</div>`;
    } else {
        Object.keys(gData.branches).forEach(bKey => {
            let bData = gData.branches[bKey];
            let bIcon = bKey === 'D' ? 'fa-calculator text-indigo-600' : 'fa-shapes text-emerald-600';
            html += `
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div class="p-2.5 bg-slate-100/90 border-b border-slate-200 text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <i class="fa-solid ${bIcon}"></i>
                        <span>Phần: ${bData.name}</span>
                    </div>
                    <div class="p-2 space-y-2">
            `;
            Object.keys(bData.chapters).forEach(cKey => {
                let cData = bData.chapters[cKey];
                let chPrefix = `[${gCode}${bKey}${cKey}]`;
                let chTitle = `${chPrefix} Chương ${cKey}: ${cData.name}`;
                let lessonKeys = Object.keys(cData.lessons || {});

                html += `
                    <div class="bg-slate-50/80 rounded-xl border border-slate-200/80 p-2">
                        <div class="font-black text-[11px] text-slate-800 mb-1.5 flex items-center justify-between">
                            <span>${chTitle}</span>
                            <span class="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">${lessonKeys.length} bài</span>
                        </div>
                        <div class="space-y-1">
                `;
                lessonKeys.forEach(lKey => {
                    let lData = cData.lessons[lKey];
                    let lsCode = `[${gCode}${bKey}${cKey}?${lKey}]`;
                    let lsTitle = `Bài ${lKey}: ${lData.name}`;

                    // Match custom infographic
                    let customInfo = customInfographics.find(x => x.lessonCode === lsCode || (String(x.grade) === String(selectedInfographicGrade) && x.title && x.title.includes(lsTitle)));
                    let hasCustomImg = customInfo && customInfo.imageUrl;
                    let customInfoJson = customInfo ? encodeURIComponent(JSON.stringify(customInfo)) : '';

                    html += `
                        <button onclick="openInfographicViewer('${lsCode}', '${lsTitle.replace(/'/g, "\\'")}', '${(customInfo && customInfo.driveUrl) || driveUrl}', '${customInfoJson}')" class="drawer-infographic-item w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50/80 border ${hasCustomImg ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200/80'} hover:border-indigo-300 transition flex items-center justify-between group">
                            <div class="flex items-center gap-1.5 overflow-hidden pr-2">
                                <i class="fa-regular fa-image ${hasCustomImg ? 'text-indigo-600 font-black' : 'text-amber-500'} group-hover:scale-110 transition-transform text-xs shrink-0"></i>
                                <span class="text-[11px] font-bold text-slate-700 group-hover:text-indigo-800 truncate">${lsCode} ${lsTitle}</span>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                ${hasCustomImg ? `<span class="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-200">Ảnh HD</span>` : ''}
                                <span class="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition">Xem</span>
                            </div>
                        </button>
                    `;
                });
                html += `</div></div>`;
            });
            html += `</div></div>`;
        });
    }

    html += `</div>`;
    container.innerHTML = html;
}

function filterDrawerInfographics() {
    let q = removeVietnameseTones(document.getElementById('drawer-infographic-search')?.value || '').toLowerCase().trim();
    let items = document.querySelectorAll('.drawer-infographic-item');
    items.forEach(it => {
        let txt = removeVietnameseTones(it.innerText).toLowerCase();
        if (!q || txt.includes(q)) {
            it.classList.remove('hidden');
        } else {
            it.classList.add('hidden');
        }
    });
}

function openInfographicViewer(lessonCode, lessonTitle, driveUrl, customInfoEncoded) {
    let modal = document.getElementById('infographic-viewer-modal');
    let titleEl = document.getElementById('infographic-modal-title');
    let bodyEl = document.getElementById('infographic-modal-body');
    let driveBtn = document.getElementById('infographic-modal-drive-btn');

    // Automatically close the practice drawer and overlay so the modal is completely unobstructed
    let drawer = document.getElementById('practice-drawer');
    let overlay = document.getElementById('practice-drawer-overlay');
    if (drawer) drawer.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');

    let customInfo = null;
    if (customInfoEncoded) {
        try {
            customInfo = JSON.parse(decodeURIComponent(customInfoEncoded));
        } catch(e){}
    }

    if (titleEl) titleEl.innerText = `${lessonCode} ${lessonTitle}`;
    
    let targetDriveUrl = (customInfo && customInfo.driveUrl) || driveUrl || (typeof GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL !== 'undefined' ? GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL : '#');
    if (driveBtn) driveBtn.href = targetDriveUrl;

    if (bodyEl) {
        let rawImg = (customInfo && customInfo.imageUrl) || (customInfo && customInfo.driveUrl && !customInfo.driveUrl.includes('/folders/') ? customInfo.driveUrl : '');
        let imageUrl = rawImg ? (typeof InfographicsService !== 'undefined' ? InfographicsService.convertDriveUrl(rawImg) : rawImg) : '';
        let hasImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:image'));
        let summaryText = (customInfo && customInfo.summary) ? customInfo.summary : 'Bản tóm tắt Infographic & Sơ đồ tư duy cốt lõi chương trình GDPT 2018';

        if (hasImage) {
            bodyEl.innerHTML = `
                <div class="w-full flex flex-col items-center space-y-4 animate-scale-in">
                    <!-- Image Card with Zoom & Action Bar -->
                    <div class="w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl relative flex flex-col items-center justify-center p-2 group">
                        <div class="w-full max-h-[68vh] overflow-auto flex items-center justify-center p-1" id="infographic-img-container">
                            <img id="infographic-main-img" src="${imageUrl}" alt="${lessonTitle}" class="max-w-full max-h-[66vh] object-contain rounded-xl shadow-2xl transition-transform duration-200 cursor-zoom-in" onclick="window.open('${imageUrl}', '_blank')" title="Bấm để mở ảnh gốc ở tab mới">
                        </div>
                        
                        <!-- Floating Floating Action Controls -->
                        <div class="mt-2 w-full flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs">
                            <div class="flex items-center gap-1.5">
                                <button type="button" onclick="zoomInfographicImg(1.2)" class="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg font-bold transition flex items-center gap-1 border border-slate-700" title="Phóng to">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i> Phóng to
                                </button>
                                <button type="button" onclick="zoomInfographicImg(0.8)" class="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg font-bold transition flex items-center gap-1 border border-slate-700" title="Thu nhỏ">
                                    <i class="fa-solid fa-magnifying-glass-minus"></i> Thu nhỏ
                                </button>
                                <button type="button" onclick="resetInfographicZoom()" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition flex items-center gap-1 border border-slate-700" title="Về mặc định">
                                    <i class="fa-solid fa-rotate-left"></i> Chuẩn
                                </button>
                                <button type="button" onclick="toggleInfographicFullscreen()" id="infographic-toolbar-fullscreen-btn" class="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-amber-300 hover:text-white rounded-lg font-bold transition flex items-center gap-1 border border-slate-700" title="Chế độ toàn màn hình">
                                    <i class="fa-solid fa-expand" id="infographic-toolbar-fullscreen-icon"></i> <span id="infographic-toolbar-fullscreen-text">Toàn màn hình</span>
                                </button>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <a href="${imageUrl}" target="_blank" class="px-3 py-1 bg-white/15 hover:bg-white text-white hover:text-slate-900 rounded-lg font-bold transition flex items-center gap-1">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở tab mới
                                </a>
                                <a href="${imageUrl}" download="${lessonCode}-infographic.png" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-xs">
                                    <i class="fa-solid fa-download"></i> Tải ảnh về
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Summary / Key Formulas Note -->
                    ${customInfo && customInfo.summary ? `
                        <div class="w-full p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm text-left text-xs leading-relaxed space-y-1.5">
                            <div class="font-black text-indigo-900 uppercase flex items-center gap-2">
                                <i class="fa-solid fa-lightbulb text-amber-500 text-sm"></i> Ghi chú & Công thức trọng tâm bài học:
                            </div>
                            <div class="text-slate-700 whitespace-pre-line text-[13px] font-medium pl-6">${summaryText}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            bodyEl.innerHTML = `
                <div class="max-w-xl w-full bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-2xl text-center space-y-5 animate-scale-in my-auto">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
                        <i class="fa-solid fa-shapes"></i>
                    </div>
                    <div>
                        <span class="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs uppercase tracking-wider inline-block mb-2">${lessonCode}</span>
                        <h3 class="font-black text-slate-800 text-lg md:text-xl leading-tight">${lessonTitle}</h3>
                        <p class="text-xs text-slate-500 mt-2 font-medium">${summaryText}</p>
                    </div>

                    <div class="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-600 space-y-3">
                        <div class="flex items-center justify-center gap-2 text-indigo-700 font-bold">
                            <i class="fa-brands fa-google-drive text-amber-500 text-base"></i>
                            <span>Đã liên kết với Thư mục Google Drive Thầy Hùng TBS</span>
                        </div>
                        <p class="text-[11px] leading-relaxed text-slate-500">Infographic chuẩn độ phân giải cao (Full HD/4K) của bài học này đang được lưu trữ an toàn trên Google Drive.</p>
                    </div>

                    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <a href="${targetDriveUrl}" target="_blank" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs shadow-md transition btn-3d flex items-center gap-2">
                            <i class="fa-brands fa-google-drive text-base"></i> Xem Infographic Trên Google Drive
                        </a>
                    </div>
                </div>
            `;
        }
        bodyEl.scrollTop = 0;
    }

    resetInfographicZoom();
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.zIndex = '100050';
    }
}

let _currentInfographicZoom = 1;
function zoomInfographicImg(factor) {
    let img = document.getElementById('infographic-main-img');
    if (!img) return;
    _currentInfographicZoom = Math.max(0.5, Math.min(3.5, _currentInfographicZoom * factor));
    img.style.transform = `scale(${_currentInfographicZoom})`;
}

function resetInfographicZoom() {
    let img = document.getElementById('infographic-main-img');
    if (!img) return;
    _currentInfographicZoom = 1;
    img.style.transform = 'scale(1)';
}

function toggleInfographicFullscreen() {
    let modal = document.getElementById('infographic-viewer-modal');
    if (!modal) return;
    let modalBox = modal.querySelector('.bg-white') || modal;

    let isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

    if (!isFs) {
        let elem = modalBox || modal;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                // Fallback custom fullscreen style if browser blocks requestFullscreen
                modalBox.classList.toggle('infographic-fullscreen-mode');
                updateInfographicFullscreenUI();
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else {
            modalBox.classList.toggle('infographic-fullscreen-mode');
            updateInfographicFullscreenUI();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function updateInfographicFullscreenUI() {
    let isNativeFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    let modalBox = document.querySelector('#infographic-viewer-modal > div');
    let isClassFs = modalBox && modalBox.classList.contains('infographic-fullscreen-mode');
    let isFs = isNativeFs || isClassFs;

    let headerBtnIcon = document.querySelector('#infographic-modal-fullscreen-btn i');
    let headerBtnText = document.querySelector('#infographic-modal-fullscreen-btn span');
    let toolbarBtnIcon = document.getElementById('infographic-toolbar-fullscreen-icon');
    let toolbarBtnText = document.getElementById('infographic-toolbar-fullscreen-text');
    let mainImg = document.getElementById('infographic-main-img');
    let bodyEl = document.getElementById('infographic-modal-body');

    if (isFs) {
        if (headerBtnIcon) { headerBtnIcon.className = 'fa-solid fa-compress text-amber-300'; }
        if (headerBtnText) { headerBtnText.innerText = 'Thu nhỏ'; }
        if (toolbarBtnIcon) { toolbarBtnIcon.className = 'fa-solid fa-compress'; }
        if (toolbarBtnText) { toolbarBtnText.innerText = 'Thu nhỏ'; }
        if (modalBox) {
            modalBox.classList.add('h-screen', 'max-h-screen', 'w-screen', 'max-w-none', 'rounded-none', 'border-0');
        }
        if (bodyEl) {
            bodyEl.style.maxHeight = 'calc(100vh - 100px)';
        }
        if (mainImg) {
            mainImg.style.maxHeight = '80vh';
        }
    } else {
        if (headerBtnIcon) { headerBtnIcon.className = 'fa-solid fa-expand text-amber-300'; }
        if (headerBtnText) { headerBtnText.innerText = 'Toàn màn hình'; }
        if (toolbarBtnIcon) { toolbarBtnIcon.className = 'fa-solid fa-expand'; }
        if (toolbarBtnText) { toolbarBtnText.innerText = 'Toàn màn hình'; }
        if (modalBox) {
            modalBox.classList.remove('h-screen', 'max-h-screen', 'w-screen', 'max-w-none', 'rounded-none', 'border-0');
        }
        if (bodyEl) {
            bodyEl.style.maxHeight = 'calc(92vh - 110px)';
        }
        if (mainImg) {
            mainImg.style.maxHeight = '66vh';
        }
    }
}

document.addEventListener('fullscreenchange', updateInfographicFullscreenUI);
document.addEventListener('webkitfullscreenchange', updateInfographicFullscreenUI);
document.addEventListener('mozfullscreenchange', updateInfographicFullscreenUI);
document.addEventListener('MSFullscreenChange', updateInfographicFullscreenUI);

function closeInfographicViewer() {
    let isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    if (isFs && document.exitFullscreen) {
        try { document.exitFullscreen(); } catch(e){}
    }
    let modal = document.getElementById('infographic-viewer-modal');
    if (modal) modal.classList.add('hidden');
    let modalBox = document.querySelector('#infographic-viewer-modal > div');
    if (modalBox) modalBox.classList.remove('infographic-fullscreen-mode');
    resetInfographicZoom();
    updateInfographicFullscreenUI();
}

const DEFAULT_GLOBAL_LINKS = [
    { title: "Máy tính Desmos", url: "https://www.desmos.com/calculator", icon: "fa-solid fa-calculator" },
    { title: "PDF convert", url: "https://hotrohoctap.com/1ai/40pdf", icon: "fa-solid fa-file-pdf" },
    { title: "GDRhungtbs", url: "https://drive.google.com/drive/home", icon: "fa-solid fa-hard-drive" },
    { title: "GIẢI TOÁN", url: "https://gemini.google.com/gem/6d15b22593eb", icon: "fa-solid fa-robot" },
    { title: "TẠO NGÂN HÀNG", url: "https://mathtbsai.netlify.app/teacher", icon: "fa-solid fa-folder-plus" },
    { title: "LÀM KIỂM TRA", url: "https://mathtbsai.netlify.app/student", icon: "fa-solid fa-pen-to-square" },
    { title: "Chuyển đổi Markdown", url: "https://dayhoc.id.vn/1chd/4markdown.html", icon: "fa-solid fa-file-code" },
    { title: "TRỢ LÍ GA THPT", url: "https://gemini.google.com/gem/4bb8fbceb873", icon: "fa-solid fa-wand-magic-sparkles" },
    { title: "GIẢI ĐỀ THPT", url: "https://gemini.google.com/gem/12vf68g60eb", icon: "fa-solid fa-graduation-cap" }
];

let state = {
    currentUser: null,
    authorizedEmails: (() => {
        try {
            let localAuths = localStorage.getItem('tbs_authorized_teachers');
            if (localAuths) {
                let parsed = JSON.parse(localAuths);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch(e) {}
        return [typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com'];
    })(),
    allResultsData: []
};

let savedLinks = (() => {
    try {
        let localLinks = localStorage.getItem('tbs_links');
        if (localLinks) {
            let parsed = JSON.parse(localLinks);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    return [...DEFAULT_GLOBAL_LINKS];
})();

let portalActiveTab = 'student';

function applyHamburgerMenuVisibility() {
    let show = localStorage.getItem('showHamburgerMenu') !== 'false';
    let btn = document.getElementById('btn-hamburger-menu');
    if (btn) {
        if (show) {
            btn.classList.remove('hidden');
            btn.style.display = '';
        } else {
            btn.classList.add('hidden');
            btn.style.display = 'none';
        }
    }
}

function updateHeaderUserInfo() {
    let auth = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
    let mainNav = document.querySelector('#main-header nav');
    let hamBtn = document.getElementById('btn-hamburger-menu');
    let userInfo = document.getElementById('user-info-display');
    let whiteboardBtn = document.querySelector('button[title*="Bảng Phụ"], button[onclick*="whiteboard-modal"]');

    // Main navigation and header tools should always remain accessible
    if (mainNav) mainNav.classList.remove('hidden');
    applyHamburgerMenuVisibility();
    if (whiteboardBtn) whiteboardBtn.classList.remove('hidden');

    if (!auth) {
        if (userInfo) {
            userInfo.classList.add('hidden');
            userInfo.classList.remove('flex');
        }
        return;
    }

    if (userInfo) {
        userInfo.classList.remove('hidden');
        userInfo.classList.add('flex');
        
        let avatar = document.getElementById('user-avatar');
        let userEmail = document.getElementById('user-email');
        
        if (auth.role === 'student') {
            if (avatar) {
                avatar.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23059669"><path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z"/></svg>`;
                avatar.classList.remove('hidden');
            }
            if (userEmail) {
                userEmail.innerHTML = `<span class="text-emerald-700 font-black">${auth.name || auth.id}</span> <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">${auth.cls || 'HS'}</span>`;
            }
        } else {
            if (avatar) {
                if (auth.photoURL) avatar.src = auth.photoURL;
                else avatar.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234f46e5"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>`;
                avatar.classList.remove('hidden');
            }
            if (userEmail) {
                userEmail.innerHTML = `<span class="text-indigo-700 font-black">${auth.name || 'Giáo viên'}</span> <span class="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-md font-bold">Admin</span>`;
            }
        }
    }
}

function switchPortalLoginTab(tab) {
    portalActiveTab = tab;
    renderPortalLoginScreen();
}

function renderPortalLoginScreen() {
    updateHeaderUserInfo();

    let isStudentTab = (portalActiveTab === 'student');

    let studentFormHtml = `
        <form onsubmit="event.preventDefault(); submitStudentPortalLogin();" class="space-y-4">
            <div class="text-left">
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    <i class="fa-solid fa-id-card text-emerald-600 mr-1"></i> Mã Định Danh Học Sinh (ID):
                </label>
                <div class="relative">
                    <input type="text" id="portal-student-id" placeholder="VD: 1201, 1005..." autofocus class="w-full px-4 py-3.5 border-2 border-emerald-300 rounded-2xl outline-none focus:border-emerald-500 font-black text-emerald-950 uppercase tracking-wider text-base bg-white shadow-inner transition" required>
                </div>
            </div>

            <div class="text-left">
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    <i class="fa-solid fa-key text-emerald-600 mr-1"></i> Mật Khẩu Cá Nhân:
                </label>
                <div class="relative">
                    <input type="password" id="portal-student-password" placeholder="Nhập mật khẩu..." class="w-full px-4 py-3.5 border-2 border-emerald-300 rounded-2xl outline-none focus:border-emerald-500 font-bold text-slate-800 text-base bg-white shadow-inner transition" required>
                    <button type="button" onclick="togglePasswordVisibility('portal-student-password')" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-base">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
                <p class="text-[11px] text-slate-400 mt-1 italic">Mật khẩu mặc định: <b class="text-emerald-700 font-mono">hungtbs</b> (nếu chưa đổi mật khẩu)</p>
            </div>

            <button type="submit" id="btn-portal-student-submit" class="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg transition text-base btn-3d uppercase tracking-wider flex items-center justify-center gap-2 mt-2">
                <i class="fa-solid fa-right-to-bracket"></i> ĐĂNG NHẬP HỌC SINH
            </button>
        </form>
    `;

    let teacherFormHtml = `
        <div class="space-y-4">
            <form onsubmit="event.preventDefault(); submitTeacherPortalPin();" class="space-y-4">
                <div class="text-left">
                    <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        <i class="fa-solid fa-shield-halved text-indigo-600 mr-1"></i> Mã PIN Quản Trị Giáo Viên:
                    </label>
                    <input type="password" id="portal-teacher-pin" placeholder="••••••" autofocus class="w-full px-4 py-3.5 border-2 border-indigo-300 rounded-2xl outline-none focus:border-indigo-500 font-black text-center text-xl tracking-widest text-indigo-950 bg-white shadow-inner transition" required>
                    <p class="text-[11px] text-slate-400 mt-1 italic text-center">Dành riêng cho Giáo viên & Quản trị viên Khảo thí TBS</p>
                </div>

                <button type="submit" id="btn-portal-teacher-pin" class="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-lg transition text-base btn-3d uppercase tracking-wider flex items-center justify-center gap-2">
                    <i class="fa-solid fa-key"></i> XÁC THỰC BẰNG MÃ PIN
                </button>
            </form>

            <div class="relative my-4">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
                <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-3 font-bold text-slate-400">hoặc</span></div>
            </div>

            <button onclick="loginWithGoogle()" class="w-full py-3 bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl font-black text-slate-700 shadow-sm flex items-center justify-center gap-3 transition hover:bg-indigo-50 text-xs">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-4 h-4"> Đăng Nhập Bằng Google (OAuth)
            </button>
        </div>
    `;

    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-6 sm:p-8 rounded-3xl w-full max-w-lg mx-auto text-center fade-in border-t-4 border-indigo-600 shadow-2xl relative overflow-hidden my-6">
            <button onclick="renderPortal(); playSound('click');" class="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black transition">
                <i class="fa-solid fa-xmark"></i>
            </button>
            
            <div class="mb-6">
                <h2 class="text-2xl font-black text-slate-800 uppercase tracking-wide">ĐĂNG NHẬP HỆ THỐNG</h2>
                <p class="text-xs text-slate-500 mt-1">Hệ sinh thái Khảo thí & Học tập Toán học & CNTT</p>
            </div>

            <!-- Tab Switcher -->
            <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200">
                <button onclick="switchPortalLoginTab('student')" class="py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${isStudentTab ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}">
                    <i class="fa-solid fa-graduation-cap"></i> HỌC SINH
                </button>
                <button onclick="switchPortalLoginTab('teacher')" class="py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${!isStudentTab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}">
                    <i class="fa-solid fa-user-gear"></i> GIÁO VIÊN
                </button>
            </div>

            ${isStudentTab ? studentFormHtml : teacherFormHtml}
        </div>
    `;
}

function togglePasswordVisibility(inputId) {
    let inp = document.getElementById(inputId);
    if (!inp) return;
    inp.type = inp.type === 'password' ? 'text' : 'password';
}

async function submitStudentPortalLogin() {
    let idInput = document.getElementById('portal-student-id');
    let pwInput = document.getElementById('portal-student-password');
    let btn = document.getElementById('btn-portal-student-submit');
    
    let sId = idInput ? idInput.value.trim() : '';
    let pw = pwInput ? pwInput.value.trim() : '';
    
    if (!sId) return showToast("Vui lòng nhập Mã Định Danh (ID)!", true);
    if (!pw) return showToast("Vui lòng nhập Mật khẩu!", true);
    
    let oldText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> ĐANG KIỂM TRA...';
        btn.disabled = true;
    }
    
    try {
        let studentData = null;
        if (typeof db !== 'undefined') {
            try {
                let doc = await db.collection("Students").doc(sId).get();
                if (doc.exists) {
                    studentData = doc.data();
                } else {
                    let qSnap = await db.collection("Students").where("id", "==", sId).get();
                    if (!qSnap.empty) {
                        studentData = qSnap.docs[0].data();
                    } else {
                        let qSnapUpper = await db.collection("Students").where("id", "==", sId.toUpperCase()).get();
                        if (!qSnapUpper.empty) studentData = qSnapUpper.docs[0].data();
                    }
                }
            } catch(dbErr) {
                console.warn("Firestore query note:", dbErr);
            }
        }
        
        if (!studentData) {
            try {
                let cached = localStorage.getItem('tbs_students_cache');
                if (cached) {
                    let list = JSON.parse(cached);
                    studentData = list.find(s => String(s.id).toLowerCase() === sId.toLowerCase());
                }
            } catch(e){}
        }
        
        if (!studentData) {
            throw new Error(`Không tìm thấy Học sinh có mã "${sId}". Vui lòng kiểm tra lại!`);
        }
        
        let correctPw = studentData.password || 'hungtbs';
        if (pw !== correctPw) {
            throw new Error("Mật khẩu học sinh không chính xác! (Mặc định: hungtbs)");
        }
        
        saveAuthUser({
            role: 'student',
            id: studentData.id || sId,
            name: studentData.name || sId,
            cls: studentData.cls || studentData.class || 'Học sinh',
            loggedAt: Date.now()
        });
        
        showToast(`Đăng nhập thành công! Xin chào ${studentData.name || sId}`);
        renderPortal();
    } catch(e) {
        showToast(e.message, true);
    } finally {
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    }
}

async function submitTeacherPortalPin() {
    let pinInput = document.getElementById('portal-teacher-pin');
    let btn = document.getElementById('btn-portal-teacher-pin');
    let pin = pinInput ? pinInput.value.trim() : '';
    
    if (!pin) return showToast("Vui lòng nhập Mã PIN Quản Trị Giáo Viên!", true);
    
    let oldText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> ĐANG XÁC THỰC...';
        btn.disabled = true;
    }
    
    try {
        let isOk = false;
        if (typeof verifyTeacherPinHash === 'function') {
            isOk = await verifyTeacherPinHash(pin);
        } else {
            const clean = pin.toLowerCase().replace(/\s+/g, '');
            isOk = ['tbs2025', 'tbs@gv2026', 'tbsmath', 'admin', '123456'].includes(clean);
        }
        
        if (!isOk) {
            throw new Error("Mã PIN Giáo viên không chính xác!");
        }
        
        saveAuthUser({
            role: 'teacher',
            email: typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com',
            name: 'Giáo viên TBS',
            loggedAt: Date.now()
        });
        
        showToast("Xác thực Giáo viên thành công! Đang mở Studio...");
        setTimeout(() => {
            window.location.href = 'teacher.html';
        }, 400);
    } catch(e) {
        showToast(e.message, true);
    } finally {
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    }
}

async function loginWithGoogle() {
    try {
        if (!window.firebase || !firebase.auth) throw new Error("Dịch vụ Firebase Auth chưa sẵn sàng");
        let provider = new firebase.auth.GoogleAuthProvider();
        let res = await firebase.auth().signInWithPopup(provider);
        let user = res.user;
        if (user && user.email) {
            let cleanEmail = user.email.toLowerCase().trim();
            let superClean = (typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com').toLowerCase().trim();
            
            // Check authorized list
            let authorizedList = [superClean];
            if (typeof state !== 'undefined' && Array.isArray(state.authorizedEmails)) {
                authorizedList = [...state.authorizedEmails.map(e => (e || '').toLowerCase().trim())];
            }
            if (!authorizedList.includes(superClean)) authorizedList.push(superClean);

            if (typeof db !== 'undefined' && db) {
                try {
                    let authDoc = await db.collection("GameData").doc("AuthorizedTeachers").get();
                    if (authDoc.exists && Array.isArray(authDoc.data().list)) {
                        authorizedList = authDoc.data().list.map(e => (e || '').toLowerCase().trim());
                        if (!authorizedList.includes(superClean)) authorizedList.push(superClean);
                    }
                } catch(e) {}
            }

            if (!authorizedList.includes(cleanEmail)) {
                if (firebase.auth().currentUser) firebase.auth().signOut().catch(()=>{});
                return showToast(`Email ${user.email} chưa được cấp quyền Quản trị viên/Giáo viên! Vui lòng liên hệ Admin (${SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com'}).`, true);
            }

            saveAuthUser({
                role: 'teacher',
                email: user.email,
                name: user.displayName || (cleanEmail === superClean ? 'Super Admin' : 'Giáo viên TBS'),
                photoURL: user.photoURL,
                loggedAt: Date.now()
            });
            showToast("Đăng nhập Google thành công! Đang mở Studio...");
            setTimeout(() => {
                window.location.href = 'teacher.html';
            }, 400);
        }
    } catch(e) {
        showToast("Đăng nhập Google: " + (e.message || "Vui lòng sử dụng mã PIN Giáo viên."), true);
    }
}

function openTeacherLoginModal() {
    let modal = document.getElementById('teacher-login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeTeacherLoginModal() {
    let modal = document.getElementById('teacher-login-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function loginWithPin() {
    let pinInput = document.getElementById('teacher-login-pin');
    if (!pinInput) return;
    let pin = pinInput.value.trim();
    if (!pin) return showToast("Vui lòng nhập mã PIN!", true);
    let portalTeacherPin = document.getElementById('portal-teacher-pin');
    if (portalTeacherPin) portalTeacherPin.value = pin;
    submitTeacherPortalPin();
}

function logoutPortal() {
    if (typeof clearAuthUser === 'function') clearAuthUser();
    if (typeof state !== 'undefined') state.currentUser = null;
    showToast("Đã đăng xuất tài khoản!");
    renderPortal();
}

function openPortalChangePasswordModal() {
    let auth = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
    if (!auth || auth.role !== 'student') {
        return showToast("Chức năng đổi mật khẩu chỉ áp dụng cho tài khoản Học sinh!", true);
    }
    
    let modal = document.getElementById('portal-change-pw-modal');
    if (!modal) return;
    
    let nameEl = document.getElementById('portal-change-pw-name');
    let idEl = document.getElementById('portal-change-pw-id');
    if (nameEl) nameEl.innerText = auth.name || auth.id;
    if (idEl) idEl.innerText = auth.id;
    
    let curInp = document.getElementById('portal-curr-password');
    let newInp = document.getElementById('portal-new-password');
    let cfmInp = document.getElementById('portal-new-password-confirm');
    if (curInp) curInp.value = '';
    if (newInp) newInp.value = '';
    if (cfmInp) cfmInp.value = '';
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePortalChangePasswordModal() {
    let modal = document.getElementById('portal-change-pw-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

async function submitPortalChangePassword() {
    let auth = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
    if (!auth || auth.role !== 'student') {
        return showToast("Vui lòng đăng nhập tài khoản Học sinh để đổi mật khẩu!", true);
    }
    
    let curPw = document.getElementById('portal-curr-password')?.value.trim();
    let newPw = document.getElementById('portal-new-password')?.value.trim();
    let cfmPw = document.getElementById('portal-new-password-confirm')?.value.trim();
    
    if (!curPw) return showToast("Vui lòng nhập Mật khẩu hiện tại!", true);
    if (!newPw) return showToast("Vui lòng nhập Mật khẩu mới!", true);
    if (newPw.length < 3) return showToast("Mật khẩu mới phải có tối thiểu 3 ký tự!", true);
    if (newPw !== cfmPw) return showToast("Xác nhận mật khẩu mới không trùng khớp!", true);
    
    let btn = document.getElementById('btn-submit-portal-change-pw');
    let oldText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Đang lưu...';
        btn.disabled = true;
    }
    
    try {
        if (typeof db === 'undefined') throw new Error("Không thể kết nối cơ sở dữ liệu");
        
        let docSnap = await db.collection("Students").doc(auth.id).get();
        if (!docSnap.exists) {
            let q = await db.collection("Students").where("id", "==", auth.id).get();
            if (q.empty) throw new Error("Không tìm thấy hồ sơ học sinh trên hệ thống!");
            docSnap = q.docs[0];
        }
        
        let currentActualPw = docSnap.data().password || 'hungtbs';
        if (curPw !== currentActualPw) {
            throw new Error("Mật khẩu hiện tại không chính xác!");
        }
        
        await docSnap.ref.update({
            password: newPw,
            updatedAt: new Date().toISOString()
        });
        
        showToast("Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.");
        closePortalChangePasswordModal();
    } catch(e) {
        showToast("Lỗi đổi mật khẩu: " + e.message, true);
    } finally {
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    }
}

window.togglePasswordVisibility = togglePasswordVisibility;
window.submitStudentPortalLogin = submitStudentPortalLogin;
window.submitTeacherPortalPin = submitTeacherPortalPin;
window.loginWithGoogle = loginWithGoogle;
window.loginWithPin = loginWithPin;
window.openTeacherLoginModal = openTeacherLoginModal;
window.closeTeacherLoginModal = closeTeacherLoginModal;
window.logoutPortal = logoutPortal;
window.openPortalChangePasswordModal = openPortalChangePasswordModal;
window.closePortalChangePasswordModal = closePortalChangePasswordModal;
window.submitPortalChangePassword = submitPortalChangePassword;

// ======================= NAVIGATION & APP INITIALIZATION =======================
let currentPortalTab = 'home';


function closeAllActiveModals() {
    const modalIds = [
        'board-edit-modal', 
        'links-edit-modal', 
        'lookup-modal', 
        'leaderboard-modal', 
        'hero-banner-modal', 
        'portal-change-pw-modal',
        'whiteboard-modal',
        'practice-menu'
    ];
    modalIds.forEach(id => {
        let el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    });
}

function navTo(tab) {
    if (!tab) tab = 'home';
    currentPortalTab = tab;
    closeAllActiveModals();
    
    // Config styling for tabs matching the user design
    const tabConfigs = {
        'board': {
            activeBtn: "relative px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-amber-600 bg-white shadow-sm border border-amber-300 ring-2 ring-amber-500/20 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center cursor-pointer",
            activeSub: "text-[9px] font-bold text-amber-500 block leading-none",
            inactiveBtn: "relative px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-slate-600 hover:text-amber-600 hover:bg-amber-50/70 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center border border-transparent cursor-pointer",
            inactiveSub: "text-[9px] font-bold text-slate-400 block leading-none"
        },
        'home': {
            activeBtn: "px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-indigo-600 bg-white shadow-sm border border-indigo-400 ring-2 ring-indigo-500/20 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center cursor-pointer",
            activeSub: "text-[9px] font-bold text-indigo-500 block leading-none",
            inactiveBtn: "px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center border border-transparent cursor-pointer",
            inactiveSub: "text-[9px] font-bold text-slate-400 block leading-none"
        },
        'links': {
            activeBtn: "px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-sky-600 bg-white shadow-sm border border-sky-400 ring-2 ring-sky-500/20 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center cursor-pointer",
            activeSub: "text-[9px] font-bold text-sky-500 block leading-none",
            inactiveBtn: "px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-slate-600 hover:text-sky-600 hover:bg-sky-50/70 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center border border-transparent cursor-pointer",
            inactiveSub: "text-[9px] font-bold text-slate-400 block leading-none"
        },
        'guide': {
            activeBtn: "px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-emerald-600 bg-white shadow-sm border border-emerald-400 ring-2 ring-emerald-500/20 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center cursor-pointer",
            activeSub: "text-[9px] font-bold text-emerald-500 block leading-none",
            inactiveBtn: "px-3 sm:px-4 py-2 text-xs md:text-sm rounded-xl font-black text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 text-center border border-transparent cursor-pointer",
            inactiveSub: "text-[9px] font-bold text-slate-400 block leading-none"
        }
    };

    ['board', 'home', 'links', 'guide'].forEach(t => {
        let btn = document.getElementById('nav-' + t);
        if (!btn) return;
        let sub = btn.querySelector('.nav-sub-label') || (btn.lastElementChild && btn.lastElementChild.tagName === 'SPAN' ? btn.lastElementChild : null);
        let cfg = tabConfigs[t];
        if (t === tab) {
            btn.className = cfg.activeBtn;
            if (sub) sub.className = "nav-sub-label " + cfg.activeSub;
        } else {
            btn.className = cfg.inactiveBtn;
            if (sub) sub.className = "nav-sub-label " + cfg.inactiveSub;
        }
    });

    // Content router: render corresponding view
    try {
        if (tab === 'home') {
            renderPortal();
        } else if (tab === 'board') {
            renderBoard();
        } else if (tab === 'links') {
            renderLinks();
        } else if (tab === 'guide') {
            renderGuide();
        }
    } catch(err) {
        console.error("Router error for tab " + tab + ":", err);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navTo = navTo;
window.renderPortal = renderPortal;

function initApp() {
    navTo('home');
    loadHeroBannerFromStorage();
}

// ======================= FULLSCREEN CONTROLS =======================
function toggleAppFullscreen() {
    try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            let elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
            if (typeof showToast === 'function') showToast("Đã bật chế độ Toàn màn hình (Fullscreen)");
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            if (typeof showToast === 'function') showToast("Đã thoát chế độ Toàn màn hình");
        }
    } catch(e) {
        console.warn("Fullscreen toggle error:", e);
    }
    updateFullscreenIcons();
}
window.toggleAppFullscreen = toggleAppFullscreen;

function updateFullscreenIcons() {
    let isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    document.querySelectorAll('.btn-toggle-fullscreen i').forEach(icon => {
        if (isFs) {
            icon.className = 'fa-solid fa-compress text-base text-indigo-600';
        } else {
            icon.className = 'fa-solid fa-expand text-base';
        }
    });
}
document.addEventListener('fullscreenchange', updateFullscreenIcons);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);

// ======================= 16:9 HERO BANNER CONTROLS =======================
const DEFAULT_HERO_BANNER = 'banner.png';
let currentHeroBannerSrc = localStorage.getItem('tbs_hero_banner_16_9') || DEFAULT_HERO_BANNER;
let tempBannerDataUrl = null;

function getHeroBannerSrc() {
    return currentHeroBannerSrc;
}

async function loadHeroBannerFromStorage() {
    let local = localStorage.getItem('tbs_hero_banner_16_9');
    if (local) {
        currentHeroBannerSrc = local;
        let img = document.getElementById('tbs-hero-banner-img');
        if (img) img.src = currentHeroBannerSrc;
    }
    
    // Check Firestore for synced banner
    if (typeof db !== 'undefined') {
        try {
            let snap = await db.collection("GameData").doc("HeroBanner").get();
            if (snap.exists && snap.data().imageUrl) {
                currentHeroBannerSrc = snap.data().imageUrl;
                localStorage.setItem('tbs_hero_banner_16_9', currentHeroBannerSrc);
                let img = document.getElementById('tbs-hero-banner-img');
                if (img) img.src = currentHeroBannerSrc;
            }
        } catch(e){}
    }
}

function openHeroBannerModal() {
    let modal = document.getElementById('hero-banner-modal');
    if (!modal) return;
    let prev = document.getElementById('hero-banner-preview-img');
    let urlInput = document.getElementById('hero-banner-url-input');
    let fileInput = document.getElementById('hero-banner-file-input');
    
    let cur = getHeroBannerSrc();
    if (prev) prev.src = cur;
    if (urlInput) urlInput.value = (cur.startsWith('data:') || cur === DEFAULT_HERO_BANNER) ? '' : cur;
    if (fileInput) fileInput.value = '';
    tempBannerDataUrl = null;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
window.openHeroBannerModal = openHeroBannerModal;

function closeHeroBannerModal() {
    let modal = document.getElementById('hero-banner-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    tempBannerDataUrl = null;
}
window.closeHeroBannerModal = closeHeroBannerModal;

function previewHeroBannerFile(e) {
    let file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        return showToast("Vui lòng chọn file hình ảnh (JPG, PNG, WebP)!", true);
    }
    let reader = new FileReader();
    reader.onload = function(evt) {
        tempBannerDataUrl = evt.target.result;
        let prev = document.getElementById('hero-banner-preview-img');
        if (prev) prev.src = tempBannerDataUrl;
    };
    reader.readAsDataURL(file);
}
window.previewHeroBannerFile = previewHeroBannerFile;

function previewHeroBannerUrl(url) {
    if (!url) return;
    tempBannerDataUrl = url.trim();
    let prev = document.getElementById('hero-banner-preview-img');
    if (prev) prev.src = tempBannerDataUrl;
}
window.previewHeroBannerUrl = previewHeroBannerUrl;

async function saveHeroBanner() {
    let chosenSrc = tempBannerDataUrl || document.getElementById('hero-banner-url-input')?.value.trim();
    if (!chosenSrc) {
        return showToast("Vui lòng chọn ảnh từ máy hoặc nhập liên kết ảnh!", true);
    }

    let btn = document.getElementById('btn-save-hero-banner');
    let oldText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Đang lưu...';
        btn.disabled = true;
    }

    try {
        currentHeroBannerSrc = chosenSrc;
        localStorage.setItem('tbs_hero_banner_16_9', chosenSrc);
        
        let mainImg = document.getElementById('tbs-hero-banner-img');
        if (mainImg) mainImg.src = chosenSrc;
        
        if (typeof db !== 'undefined') {
            try {
                await db.collection("GameData").doc("HeroBanner").set({
                    imageUrl: chosenSrc,
                    updatedAt: new Date().toISOString()
                });
            } catch(fe){}
        }

        showToast("Đã cập nhật ảnh Banner 16:9 thành công!");
        closeHeroBannerModal();
    } catch(e) {
        showToast("Lỗi lưu banner: " + e.message, true);
    } finally {
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
    }
}
window.saveHeroBanner = saveHeroBanner;

function resetHeroBannerDefault() {
    if (confirm("Khôi phục về ảnh Banner mặc định?")) {
        currentHeroBannerSrc = DEFAULT_HERO_BANNER;
        localStorage.removeItem('tbs_hero_banner_16_9');
        let prev = document.getElementById('hero-banner-preview-img');
        if (prev) prev.src = DEFAULT_HERO_BANNER;
        let mainImg = document.getElementById('tbs-hero-banner-img');
        if (mainImg) mainImg.src = DEFAULT_HERO_BANNER;
        showToast("Đã khôi phục ảnh Banner mặc định!");
        closeHeroBannerModal();
    }
}
window.resetHeroBannerDefault = resetHeroBannerDefault;

// ======================= PORTAL MAIN VIEW RENDERER =======================
function renderPortal() {
    updateHeaderUserInfo();

    let isTeacher = false;
    try {
        let auth = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
        isTeacher = (auth && auth.role === 'teacher') || localStorage.getItem('devModeBypass') === 'true';
    } catch(e){}

    let teacherBlock = isTeacher ? `
        <button onclick="window.location.href='teacher.html'; playSound('click');" class="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-2xl font-black shadow-xl border-b-4 border-indigo-950 transition text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:translate-y-0.5">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> ${t('teacherDashboardBtn')}
        </button>
    ` : `
        <button onclick="renderPortalLoginScreen(); playSound('click');" class="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-2xl font-black shadow-xl border-b-4 border-indigo-950 transition text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:translate-y-0.5">
            <i class="fa-solid fa-right-to-bracket"></i> ${t('teacherLoginBtn')}
        </button>
    `;

    let appContent = document.getElementById('app-content');
    if (!appContent) return;

    let curLang = window.APP_LANG || 'vi';

    appContent.innerHTML = `
        <div class="w-full max-w-6xl mx-auto space-y-6 fade-in text-left my-2 px-2 sm:px-4">
            
            <!-- 1. TOP BILINGUAL CLIL HEADER NAVIGATION BAR -->
            <div class="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border-2 border-indigo-100 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.12)] flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden">
                <div class="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex items-center gap-3 relative z-10">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-center text-2xl shadow-lg border-b-4 border-indigo-950 shrink-0">
                        <i class="fa-solid fa-square-root-variable text-amber-300"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-sm sm:text-base font-black text-indigo-950 uppercase tracking-wide">TBS MATH & IT ECOSYSTEM</h2>
                            <span class="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">v3.0 CLIL</span>
                        </div>
                        <p class="text-slate-500 text-xs font-semibold">Chương Trình GDPT 2018 • Tiếng Anh Ngôn Ngữ Thứ 2</p>
                    </div>
                </div>

                <!-- 3D LANGUAGE SWITCHER SELECTOR -->
                <div class="flex items-center gap-2 relative z-10 shrink-0">
                    <span class="text-xs font-black text-slate-600 hidden sm:inline"><i class="fa-solid fa-globe text-indigo-600 mr-1"></i>Ngôn Ngữ:</span>
                    <div class="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/90 shadow-inner">
                        <button onclick="setAppLanguage('vi')" class="px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 ${curLang === 'vi' ? 'bg-emerald-500 text-white shadow-md border-b-2 border-emerald-700' : 'text-slate-600 hover:bg-white'}">
                            <span>🇻🇳</span> <span>Việt</span>
                        </button>
                        <button onclick="setAppLanguage('en')" class="px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 ${curLang === 'en' ? 'bg-indigo-600 text-white shadow-md border-b-2 border-indigo-900' : 'text-slate-600 hover:bg-white'}">
                            <span>🇬🇧</span> <span>English</span>
                        </button>
                        <button onclick="setAppLanguage('bilingual')" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 ${curLang === 'bilingual' ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 shadow-md border-b-2 border-amber-700' : 'text-slate-600 hover:bg-white'}">
                            <span>🌐</span> <span>Song ngữ (CLIL)</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 2. 16:9 HERO BANNER CONTAINER (Replaces text block) -->
            <div id="tbs-hero-banner-container" class="relative w-full aspect-[16/9] max-h-[420px] rounded-3xl overflow-hidden shadow-[0_15px_35px_-5px_rgba(79,70,229,0.18)] border-2 border-indigo-200/90 group bg-slate-900 transition-all">
                <img id="tbs-hero-banner-img" src="${getHeroBannerSrc()}" alt="Banner TBS 16:9" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onerror="this.onerror=null; this.src='banner.png';">
                
                <!-- Bottom Dark Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
                
                <!-- Floating Quick Action Button for 16:9 Banner Customization -->
                <div class="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 flex items-center gap-2">
                    <button onclick="openHeroBannerModal(); playSound('click');" class="px-4 py-2.5 bg-white/95 hover:bg-white text-indigo-950 hover:text-indigo-600 rounded-2xl font-black text-xs sm:text-sm shadow-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/80 hover:scale-105 btn-3d" title="Cập nhật ảnh Banner 16:9">
                        <i class="fa-solid fa-camera text-indigo-600 text-sm"></i>
                        <span>Cập nhật ảnh 16:9</span>
                    </button>
                </div>
            </div>

            <!-- 3. ECOSYSTEM STAT HIGHLIGHTS BAR -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div class="p-3.5 sm:p-4 bg-white/90 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                        <i class="fa-solid fa-cubes"></i>
                    </div>
                    <div>
                        <div class="font-black text-slate-900 text-sm sm:text-base">50.000+</div>
                        <div class="text-[11px] text-slate-500 font-bold">Câu hỏi GDPT 2018</div>
                    </div>
                </div>

                <div class="p-3.5 sm:p-4 bg-white/90 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <div class="font-black text-slate-900 text-sm sm:text-base">AI Gemini 2.5</div>
                        <div class="text-[11px] text-slate-500 font-bold">Sinh đề & Lời giải</div>
                    </div>
                </div>

                <div class="p-3.5 sm:p-4 bg-white/90 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                        <i class="fa-solid fa-language"></i>
                    </div>
                    <div>
                        <div class="font-black text-slate-900 text-sm sm:text-base">Song Ngữ CLIL</div>
                        <div class="text-[11px] text-slate-500 font-bold">Tra từ điển & Trình chiếu</div>
                    </div>
                </div>

                <div class="p-3.5 sm:p-4 bg-white/90 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                        <div class="font-black text-slate-900 text-sm sm:text-base">Bảng Vàng 3D</div>
                        <div class="text-[11px] text-slate-500 font-bold">Đấu trường Khảo thí</div>
                    </div>
                </div>
            </div>

            <!-- 4. MASTER 4 PILLAR 3D CARDS GRID -->
            <div class="text-center my-2">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-display font-black text-slate-900 uppercase tracking-wide">
                    ${t('appName')}
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">${t('subTitle')}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-left">
                
                <!-- Pillar 1: BIÊN SOẠN -->
                <div class="pillar-card-1 p-6 rounded-3xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.18)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="absolute -right-6 -top-6 text-indigo-500/10 text-9xl transition-transform group-hover:scale-110 group-hover:rotate-6 pointer-events-none"><i class="fa-solid fa-pen-ruler"></i></div>
                    
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl shadow-lg border-b-4 border-indigo-950">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </div>
                            <span class="pillar-badge-1 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <i class="fa-solid fa-layer-group text-amber-300"></i> TRỤ CỘT 1
                            </span>
                        </div>
                        
                        <h3 class="text-xl font-black text-indigo-950 font-display flex items-center gap-2">
                            <span>${t('pillar1Title')}</span>
                            <span class="text-xs font-bold text-indigo-600 uppercase">${t('pillar1Sub')}</span>
                        </h3>
                        <p class="text-indigo-950/80 font-semibold mb-4 text-xs sm:text-sm leading-relaxed mt-1">
                            ${t('pillar1Desc')}
                        </p>
                    </div>

                    <div class="relative z-10 space-y-2.5 mt-2">
                        <div id="home-teacher-login-container">
                            ${teacherBlock}
                        </div>
                        <div class="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-100">
                            <button onclick="window.location.href='teacher.html'; playSound('click');" class="p-2.5 bg-white hover:bg-indigo-50 text-indigo-800 rounded-xl font-bold text-xs border border-indigo-200 border-b-4 border-b-indigo-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-database text-indigo-600"></i> ${t('pillar1Btn1')}
                            </button>
                            <button onclick="navTo('links'); playSound('click');" class="p-2.5 bg-white hover:bg-indigo-50 text-indigo-800 rounded-xl font-bold text-xs border border-indigo-200 border-b-4 border-b-indigo-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-folder-open text-indigo-600"></i> ${t('pillar1Btn2')}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pillar 2: TRÌNH CHIẾU -->
                <div class="pillar-card-2 p-6 rounded-3xl shadow-[0_15px_30px_-5px_rgba(147,51,234,0.18)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="absolute -right-6 -top-6 text-purple-500/10 text-9xl transition-transform group-hover:scale-110 group-hover:rotate-6 pointer-events-none"><i class="fa-solid fa-display"></i></div>
                    
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg border-b-4 border-purple-950">
                                <i class="fa-solid fa-chalkboard-user"></i>
                            </div>
                            <span class="pillar-badge-2 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <i class="fa-solid fa-layer-group text-amber-300"></i> TRỤ CỘT 2
                            </span>
                        </div>
                        
                        <h3 class="text-xl font-black text-purple-950 font-display flex items-center gap-2">
                            <span>${t('pillar2Title')}</span>
                            <span class="text-xs font-bold text-purple-600 uppercase">${t('pillar2Sub')}</span>
                        </h3>
                        <p class="text-purple-950/80 font-semibold mb-4 text-xs sm:text-sm leading-relaxed mt-1">
                            ${t('pillar2Desc')}
                        </p>
                    </div>

                    <div class="relative z-10 space-y-2.5 mt-2">
                        <button onclick="document.getElementById('whiteboard-modal').classList.remove('hidden'); playSound('click');" class="pillar-btn-2 w-full py-3.5 text-white rounded-2xl font-black shadow-lg transition text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:translate-y-0.5 btn-3d">
                            <i class="fa-solid fa-chalkboard"></i> ${t('pillar2MainBtn')}
                        </button>
                        <div class="grid grid-cols-2 gap-2 pt-1 border-t border-purple-100">
                            <button onclick="window.open('bang_trang.html', '_blank'); playSound('click');" class="p-2.5 bg-white hover:bg-purple-50 text-purple-900 rounded-xl font-bold text-xs border border-purple-200 border-b-4 border-b-purple-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-up-right-from-square text-purple-600"></i> ${t('pillar2Btn1')}
                            </button>
                            <button onclick="navTo('links'); playSound('click');" class="p-2.5 bg-white hover:bg-purple-50 text-purple-900 rounded-xl font-bold text-xs border border-purple-200 border-b-4 border-b-purple-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-chart-line text-purple-600"></i> ${t('pillar2Btn2')}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pillar 3: ÔN LUYỆN -->
                <div class="pillar-card-3 p-6 rounded-3xl shadow-[0_15px_30px_-5px_rgba(14,165,233,0.18)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="absolute -right-6 -top-6 text-sky-500/10 text-9xl transition-transform group-hover:scale-110 group-hover:rotate-6 pointer-events-none"><i class="fa-solid fa-book-open-reader"></i></div>
                    
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-13 h-13 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 text-white flex items-center justify-center text-2xl shadow-lg border-b-4 border-sky-950">
                                <i class="fa-solid fa-book-bookmark"></i>
                            </div>
                            <span class="pillar-badge-3 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <i class="fa-solid fa-layer-group text-amber-300"></i> TRỤ CỘT 3
                            </span>
                        </div>
                        
                        <h3 class="text-xl font-black text-sky-950 font-display flex items-center gap-2">
                            <span>${t('pillar3Title')}</span>
                            <span class="text-xs font-bold text-sky-600 uppercase">${t('pillar3Sub')}</span>
                        </h3>
                        <p class="text-sky-950/80 font-semibold mb-4 text-xs sm:text-sm leading-relaxed mt-1">
                            ${t('pillar3Desc')}
                        </p>
                    </div>

                    <div class="relative z-10 space-y-2.5 mt-2">
                        <button onclick="togglePracticeMenu(event); playSound('click');" class="pillar-btn-3 w-full py-3.5 text-white rounded-2xl font-black shadow-lg transition text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:translate-y-0.5 btn-3d">
                            <i class="fa-solid fa-bars-staggered"></i> ${t('pillar3MainBtn')}
                        </button>
                        <div class="grid grid-cols-2 gap-2 pt-1 border-t border-sky-100">
                            <button onclick="navTo('board'); playSound('click');" class="p-2.5 bg-white hover:bg-sky-50 text-sky-800 rounded-xl font-bold text-xs border border-sky-200 border-b-4 border-b-sky-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-fire text-amber-500"></i> ${t('pillar3Btn1')}
                            </button>
                            <button onclick="navTo('guide'); playSound('click');" class="p-2.5 bg-white hover:bg-sky-50 text-sky-800 rounded-xl font-bold text-xs border border-sky-200 border-b-4 border-b-sky-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-circle-question text-sky-600"></i> ${t('pillar3Btn2')}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pillar 4: KIỂM TRA ĐÁNH GIÁ -->
                <div class="pillar-card-4 p-6 rounded-3xl shadow-[0_15px_30px_-5px_rgba(16,185,129,0.18)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="absolute -right-6 -top-6 text-emerald-500/10 text-9xl transition-transform group-hover:scale-110 group-hover:rotate-6 pointer-events-none"><i class="fa-solid fa-award"></i></div>
                    
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl shadow-lg border-b-4 border-emerald-950">
                                <i class="fa-solid fa-gamepad"></i>
                            </div>
                            <span class="pillar-badge-4 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <i class="fa-solid fa-layer-group text-amber-300"></i> TRỤ CỘT 4
                            </span>
                        </div>
                        
                        <h3 class="text-xl font-black text-emerald-950 font-display flex items-center gap-2">
                            <span>${t('pillar4Title')}</span>
                            <span class="text-xs font-bold text-emerald-600 uppercase">${t('pillar4Sub')}</span>
                        </h3>
                        <p class="text-emerald-950/80 font-semibold mb-3 text-xs sm:text-sm leading-relaxed mt-1">
                            ${t('pillar4Desc')}
                        </p>
                    </div>

                    <div class="relative z-10 space-y-2.5 mt-1">
                        <!-- Exam PIN Input -->
                        <div class="flex gap-2">
                            <input type="text" id="play-code-input" class="w-full p-2.5 sm:p-3 border-2 border-emerald-300 border-b-4 border-b-emerald-400 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none font-black text-center text-xl sm:text-2xl tracking-widest text-emerald-950 uppercase shadow-inner bg-white placeholder:text-emerald-300 transition" placeholder="${t('pillar4Placeholder')}" maxlength="6" onkeypress="if(event.key === 'Enter') handlePlayCode()">
                            <button id="btn-play-code" onclick="handlePlayCode()" class="pillar-btn-4 px-4 sm:px-6 py-2.5 text-white rounded-2xl font-black shadow-lg transition text-xs sm:text-sm uppercase tracking-wider shrink-0 flex items-center justify-center gap-1.5 active:translate-y-0.5 btn-3d" title="Vào thi ngay / Start Exam">
                                <i class="fa-solid fa-play"></i> <span class="hidden sm:inline">${t('pillar4StartBtn')}</span>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-100">
                            <button onclick="openLookupModal(); playSound('click');" class="p-2.5 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 border-b-4 border-b-emerald-400 shadow-sm flex items-center justify-center gap-1.5 transition active:translate-y-0.5">
                                <i class="fa-solid fa-magnifying-glass text-emerald-600"></i> ${t('pillar4Btn1')}
                            </button>
                            <button onclick="openLeaderboardModal(); playSound('click');" class="p-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md border border-amber-300 border-b-4 border-b-amber-700 rounded-xl flex items-center justify-center gap-1.5 transition active:translate-y-0.5 btn-3d">
                                <i class="fa-solid fa-trophy"></i> ${t('pillar4Btn2')}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    `;
}


async function handlePlayCode() {
    let code = document.getElementById('play-code-input')?.value.trim().toUpperCase(); 
    if(!code) return showToast("Nhập mã đề thi!", true);
    
    let btn = document.getElementById('btn-play-code');
    if (btn) {
        btn.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i> ĐANG KIỂM TRA...'; 
        btn.disabled=true;
    }
    
    try {
        let getPromise = db.collection("SharedGames").doc(code).get();
        let timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Kết nối quá thời gian. Đang chuyển thẳng sang bài thi...")), 5000)
        );
        
        let snap = await Promise.race([getPromise, timeoutPromise]); 
        if(!snap.exists) throw new Error("Mã đề thi sai hoặc đã bị xóa!");
        
        let settings = snap.data().settings || {};
        if(settings.openTime && new Date() < new Date(settings.openTime)) throw new Error("Chưa đến giờ mở đề thi này!");
        if(settings.closeTime && new Date() > new Date(settings.closeTime)) throw new Error("Đề thi này đã đóng!");
        
        showToast("Mã hợp lệ, đang chuyển hướng...");
        setTimeout(() => {
            window.location.href = `student.html?code=${code}`;
        }, 500);

    } catch(e) { 
        if (e.message && e.message.includes("quá thời gian")) {
            showToast("Đang chuyển sang bài thi...", false);
            setTimeout(() => {
                window.location.href = `student.html?code=${code}`;
            }, 500);
        } else {
            showToast(e.message, true); 
            if (btn) {
                btn.innerHTML='<i class="fa-solid fa-play mr-2"></i> VÀO THI NGAY'; 
                btn.disabled=false; 
            }
        }
    }
}

function openLookupModal() { document.getElementById('lookup-modal').classList.remove('hidden'); }
function closeLookupModal() { document.getElementById('lookup-modal').classList.add('hidden'); }

let currentLookupScope = 'personal';
function setLookupScope(scope) {
    currentLookupScope = scope;
    let btns = ['personal', 'class', 'grade', 'school'];
    btns.forEach(b => {
        let el = document.getElementById('btn-scope-' + b);
        if(b === scope) { el.classList.add('bg-amber-500', 'text-white', 'shadow'); el.classList.remove('bg-slate-100', 'text-slate-600'); }
        else { el.classList.remove('bg-amber-500', 'text-white', 'shadow'); el.classList.add('bg-slate-100', 'text-slate-600'); }
    });
    let inp = document.getElementById('lookup-input');
    let cont = document.getElementById('lookup-input-container');
    cont.classList.remove('hidden');
    if(scope === 'personal') { inp.placeholder = "Nhập ID học sinh..."; inp.value = ""; }
    else if(scope === 'class') { inp.placeholder = "Nhập Tên Lớp (vd: 12A1)..."; inp.value = ""; }
    else if(scope === 'grade') { inp.placeholder = "Nhập Khối (vd: 12)..."; inp.value = ""; }
    else if(scope === 'school') { cont.classList.add('hidden'); }
}

async function performLookup() {
    let val = document.getElementById('lookup-input').value.trim();
    if(currentLookupScope !== 'school' && !val) return showToast("Vui lòng nhập thông tin tra cứu!", true);
    let btn = document.getElementById('btn-lookup'); 
    let oldHtml = btn ? btn.innerHTML : ''; 
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang tìm...'; 
        btn.disabled = true;
    }
    try {
        let fetchPromise = fetch(GOOGLE_WEB_APP_URL + "?action=getResults&t=" + Date.now());
        let timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Kết nối máy chủ tra cứu quá thời gian (Timeout). Vui lòng thử lại!")), 8000)
        );
        let res = await Promise.race([fetchPromise, timeoutPromise]); 
        if (!res.ok) throw new Error("Lỗi phản hồi máy chủ Google Sheets (" + res.status + ")");
        let textData = await res.text();
        let allResults = JSON.parse(textData); 
        let filtered = [];
        if(currentLookupScope === 'personal') { filtered = allResults.filter(r => String(r.id || '').trim().toLowerCase() === val.toLowerCase()); }
        else if(currentLookupScope === 'class') { filtered = allResults.filter(r => String(r.cls || r.class || '').trim().toLowerCase() === val.toLowerCase()); }
        else if(currentLookupScope === 'grade') { filtered = allResults.filter(r => String(r.khoi || r.grade || '').trim() === val); }
        else if(currentLookupScope === 'school') { filtered = allResults; }
        
        if (filtered.length === 0) { showToast("Không tìm thấy kết quả nào!", true); } 
        else { closeLookupModal(); renderGroupResultsModal(filtered, currentLookupScope, val); }
    } catch(e) { 
        showToast("Lỗi tra cứu: " + e.message, true); 
    } finally { 
        if (btn) {
            btn.innerHTML = oldHtml; 
            btn.disabled = false; 
        }
    }
}

function extractPartScore(r, partNum) {
    if (!r) return '-';
    let val = undefined;
    if (partNum === 1) val = r.scoreR1 ?? r.score1 ?? r.r1 ?? r.R1 ?? r.ScoreR1 ?? r.Score1 ?? r["Phần 1"] ?? r["Phần I"] ?? r["phan1"];
    else if (partNum === 2) val = r.scoreR2 ?? r.score2 ?? r.r2 ?? r.R2 ?? r.ScoreR2 ?? r.Score2 ?? r["Phần 2"] ?? r["Phần II"] ?? r["phan2"];
    else if (partNum === 3) val = r.scoreR3 ?? r.score3 ?? r.r3 ?? r.R3 ?? r.ScoreR3 ?? r.Score3 ?? r["Phần 3"] ?? r["Phần III"] ?? r["phan3"];

    if (val === undefined || val === null || String(val).trim() === '') {
        for (let k in r) {
            let norm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (partNum === 1 && (norm === 'scorer1' || norm === 'r1' || norm === 'phan1' || norm === 'phani' || norm === 'score1')) return r[k];
            if (partNum === 2 && (norm === 'scorer2' || norm === 'r2' || norm === 'phan2' || norm === 'phanii' || norm === 'score2')) return r[k];
            if (partNum === 3 && (norm === 'scorer3' || norm === 'r3' || norm === 'phan3' || norm === 'phaniii' || norm === 'score3')) return r[k];
        }
    }
    return (val !== undefined && val !== null && String(val).trim() !== '') ? val : '-';
}

let currentGroupResultsData = [];
let currentGroupTitle = '';
function renderGroupResultsModal(rawResults, scope, val) { 
    let title = '';
    if(scope === 'personal') title = `Học sinh: ${rawResults[0].name !== 'Khách' && rawResults[0].name ? rawResults[0].name : 'ID ' + val}`;
    else if(scope === 'class') title = `Kết quả Lớp: ${val}`;
    else if(scope === 'grade') title = `Kết quả Khối: ${val}`;
    else if(scope === 'school') title = `Kết quả Toàn trường`;
    
    document.getElementById('personal-results-name').innerText = title;
    currentGroupTitle = title;
    let isPersonal = (scope === 'personal');
    
    let groupedData = {};
    rawResults.forEach(r => {
        let code = String(r.code).trim().toUpperCase(); 
        let sId = String(r.id || '').trim().toLowerCase();
        let key = isPersonal ? code : `${sId}_${String(r.name || '').trim().toLowerCase()}_${code}`;
        
        let currentScore = Number(r.score) || 0;
        let sR1 = extractPartScore(r, 1);
        let sR2 = extractPartScore(r, 2);
        let sR3 = extractPartScore(r, 3);
        let rViolations = Number(r.violations) || 0;

        if (!groupedData[key]) { 
            groupedData[key] = { 
                ...r, 
                attempts: 1, 
                maxScore: currentScore,
                violations: rViolations,
                scoreR1: sR1,
                scoreR2: sR2,
                scoreR3: sR3
            }; 
        } else { 
            groupedData[key].attempts += 1; 
            groupedData[key].violations = Math.max(groupedData[key].violations || 0, rViolations);
            if (currentScore >= groupedData[key].maxScore) { 
                groupedData[key].maxScore = currentScore; 
                groupedData[key].scoreR1 = sR1; 
                groupedData[key].scoreR2 = sR2; 
                groupedData[key].scoreR3 = sR3; 
                groupedData[key].date = r.date; 
            } else {
                if (groupedData[key].scoreR1 === '-' && sR1 !== '-') groupedData[key].scoreR1 = sR1;
                if (groupedData[key].scoreR2 === '-' && sR2 !== '-') groupedData[key].scoreR2 = sR2;
                if (groupedData[key].scoreR3 === '-' && sR3 !== '-') groupedData[key].scoreR3 = sR3;
            }
        }
    });
    let finalResults = Object.values(groupedData);
    finalResults.sort((a,b) => b.maxScore - a.maxScore);
    currentGroupResultsData = finalResults;
    
    let thHtml = '';
    if(isPersonal) {
        thHtml = `<th class="p-4 text-center">Ngày Thi</th><th class="p-4 text-center">Mã Đề</th><th class="p-4 text-center">Số Lần Làm</th><th class="p-4 text-center text-rose-300">Vi Phạm</th>`;
    } else {
        thHtml = `<th class="p-4 text-left">Họ Tên</th><th class="p-4 text-center">Lớp</th><th class="p-4 text-center">Mã Đề</th><th class="p-4 text-center">Số Lần Làm</th><th class="p-4 text-center text-rose-300">Vi Phạm</th>`;
    }
    
    document.getElementById('personal-results-thead').innerHTML = `<tr class="bg-gradient-to-r from-slate-800 to-slate-700 text-white font-bold text-[10px] md:text-xs uppercase tracking-wider sticky top-0 shadow-md z-10">${thHtml}<th class="p-4 text-center text-sky-300">Phần 1</th><th class="p-4 text-center text-amber-300">Phần 2</th><th class="p-4 text-center text-red-300">Phần 3</th><th class="p-4 text-center text-emerald-300">Tổng</th></tr>`;

    document.getElementById('personal-results-tbody').innerHTML = finalResults.map((r) => {
        let tdHtml = '';
        if(isPersonal) {
            tdHtml = `<td class="p-3 text-center text-slate-600">${r.date || '-'}</td><td class="p-3 text-center font-bold text-indigo-600 bg-indigo-50/50">${r.code}</td><td class="p-3 text-center font-bold text-rose-500">${r.attempts} lần</td><td class="p-3 text-center font-bold ${r.violations > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}">${r.violations > 0 ? r.violations + ' lần' : '0'}</td>`;
        } else {
            tdHtml = `<td class="p-3 text-left font-bold text-slate-700 whitespace-nowrap">${r.name || r.id}</td><td class="p-3 text-center font-bold text-slate-500">${r.cls || r.class || '-'}</td><td class="p-3 text-center font-bold text-indigo-600 bg-indigo-50/50">${r.code}</td><td class="p-3 text-center font-bold text-rose-500">${r.attempts} lần</td><td class="p-3 text-center font-bold ${r.violations > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}">${r.violations > 0 ? r.violations + ' lần' : '0'}</td>`;
        }
        return `<tr class="text-sm border-t hover:bg-slate-50 transition">${tdHtml}<td class="p-3 text-center text-sky-600 font-bold">${r.scoreR1}</td><td class="p-3 text-center text-amber-600 font-bold">${r.scoreR2}</td><td class="p-3 text-center text-red-600 font-bold">${r.scoreR3}</td><td class="p-3 text-center font-black text-xl text-emerald-600 bg-emerald-50/50">${r.maxScore}</td></tr>`;
    }).join(''); 
    document.getElementById('personal-results-modal').classList.remove('hidden'); 
}

function exportGroupCSV() {
    if(currentGroupResultsData.length === 0) return;
    let isPersonal = (currentLookupScope === 'personal');

    let totalCount = currentGroupResultsData.length;
    let scores = currentGroupResultsData.map(r => Number(r.maxScore || 0)).filter(s => !isNaN(s));
    let avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
    let maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    let minScore = scores.length > 0 ? Math.min(...scores) : 0;

    let csvContent = "\uFEFF";
    csvContent += `=== BÁO CÁO THỐNG KÊ TRA CỨU (${currentGroupTitle}) ===\n`;
    csvContent += `Ngày xuất báo cáo: "${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}"\n`;
    csvContent += `Tổng số lượt thi: ${totalCount}\n`;
    csvContent += `Điểm trung bình: ${avgScore}\n`;
    csvContent += `Điểm cao nhất: ${maxScore}\n`;
    csvContent += `Điểm thấp nhất: ${minScore}\n\n`;

    if(isPersonal) {
        csvContent += "STT,Ngày Thi,Mã Đề,Số Lần Làm,Số Lần Vi Phạm,Phần 1,Phần 2,Phần 3,Tổng Điểm,Xếp Loại\n";
        currentGroupResultsData.forEach((r, idx) => {
            let r1 = r.scoreR1 !== undefined ? r.scoreR1 : '-'; let r2 = r.scoreR2 !== undefined ? r.scoreR2 : '-'; let r3 = r.scoreR3 !== undefined ? r.scoreR3 : '-';
            let s = Number(r.maxScore || 0);
            let rank = "Yếu";
            if (s >= 9.0) rank = "Xuất sắc";
            else if (s >= 8.0) rank = "Giỏi";
            else if (s >= 6.5) rank = "Khá";
            else if (s >= 5.0) rank = "Trung bình";

            csvContent += `"${idx + 1}","${r.date || '-'}","${r.code}","${r.attempts}","${r.violations || 0}","${r1}","${r2}","${r3}","${r.maxScore}","${rank}"\n`;
        });
    } else {
        csvContent += "STT,Họ Tên,Lớp,Mã Đề,Ngày Thi,Số Lần Làm,Số Lần Vi Phạm,Phần 1,Phần 2,Phần 3,Tổng Điểm,Xếp Loại\n";
        currentGroupResultsData.forEach((r, idx) => {
            let r1 = r.scoreR1 !== undefined ? r.scoreR1 : '-'; let r2 = r.scoreR2 !== undefined ? r.scoreR2 : '-'; let r3 = r.scoreR3 !== undefined ? r.scoreR3 : '-';
            let escName = (r.name || r.id || '').replace(/"/g, '""');
            let escCls = (r.cls || r.class || '-').replace(/"/g, '""');
            let s = Number(r.maxScore || 0);
            let rank = "Yếu";
            if (s >= 9.0) rank = "Xuất sắc";
            else if (s >= 8.0) rank = "Giỏi";
            else if (s >= 6.5) rank = "Khá";
            else if (s >= 5.0) rank = "Trung bình";

            csvContent += `"${idx + 1}","${escName}","${escCls}","${r.code}","${r.date || '-'}","${r.attempts}","${r.violations || 0}","${r1}","${r2}","${r3}","${r.maxScore}","${rank}"\n`;
        });
    }
    
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `BaoCaoThongKe_${currentGroupTitle.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Đã xuất file thống kê thành công!");
    }
}

let currentLbFilter = 'cycle';
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
        let title = leaderboardConfig.cycleTitle ? `"${leaderboardConfig.cycleTitle}"` : "Đợt hiện tại";
        let dateStr = leaderboardConfig.resetDateStr || (parseVietnameseDateTime(leaderboardConfig.resetAt) ? parseVietnameseDateTime(leaderboardConfig.resetAt).toLocaleString('vi-VN') : leaderboardConfig.resetAt);
        textEl.innerHTML = `<span class="text-amber-700 font-bold">${title}</span> <span class="text-slate-500 font-medium">(Bắt đầu: ${dateStr})</span>`;
        if (btnCycle) btnCycle.classList.remove('hidden');
    } else {
        textEl.innerHTML = `<span class="text-slate-500 font-medium">Toàn thời gian (Chưa đặt mốc tạo mới)</span>`;
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
            let opts = `<option value="ALL">🎯 Tất cả Mã Đề (${allCodes.length})</option>` + allCodes.map(c => `<option value="${c}" ${c === selectedCodeFilter ? 'selected' : ''}>📌 Mã Đề: ${c}</option>`).join('');
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
                    sId = clsStr ? `${clsStr.toLowerCase()}_${nameStr.toLowerCase()}` : nameStr.toLowerCase();
                } else {
                    sId = `guest_${r.date || ''}_${r.code || ''}_${Math.random()}`;
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
            list.innerHTML = `
                <div class="text-center py-12 text-slate-500 font-bold">
                    <i class="fa-solid fa-ghost text-5xl mb-3 opacity-30 block text-amber-500"></i>
                    Chưa có dữ liệu xếp hạng ${filterName}
                    <div class="text-xs text-slate-400 font-normal mt-1">Các bài thi nộp thành công sẽ tự động xuất hiện tại đây</div>
                </div>`;
            return;
        }
        
        let sorted = uniqueData.sort((a,b) => b.score - a.score).slice(0, 10);
        
        // Render 3D Podium for Top 1, 2, 3
        if (podiumEl) {
            let top1 = sorted[0];
            let top2 = sorted[1];
            let top3 = sorted[2];

            let htmlPodium = `
                <div class="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto mb-4 px-2">
                    <!-- Rank 2: Silver (Left) -->
                    <div class="podium-stand flex flex-col items-center text-center">
                        ${top2 ? `
                            <div class="mb-2 flex flex-col items-center">
                                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 p-0.5 shadow-md flex items-center justify-center relative cursor-pointer group" onclick="openHonorCertificate('${escapeHtml(top2.name||'Học sinh')}', ${top2.score}, 2, '${escapeHtml(top2.cls||'')}', '${escapeHtml(top2.code||'')}')" title="Nhấn để xem & xuất Giấy Vinh Danh 3D">
                                    <div class="w-full h-full rounded-2xl bg-white flex items-center justify-center font-black text-slate-700 text-sm sm:text-base uppercase group-hover:scale-105 transition">
                                        ${(top2.name || 'HS').charAt(0)}
                                    </div>
                                    <div class="absolute -bottom-2 -right-1 bg-slate-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">2</div>
                                </div>
                                <div class="font-bold text-xs sm:text-sm text-slate-800 truncate max-w-[90px] sm:max-w-[120px] mt-2">${top2.name || 'ID ' + top2.id}</div>
                                <div class="font-black text-xs sm:text-sm text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 mt-0.5">${top2.score}đ <span class="text-[9px] font-mono font-bold text-slate-500 ml-0.5">(${top2.code || '-'})</span></div>
                                <button onclick="openHonorCertificate('${escapeHtml(top2.name||'Học sinh')}', ${top2.score}, 2, '${escapeHtml(top2.cls||'')}', '${escapeHtml(top2.code||'')}')" class="text-[10px] text-slate-500 hover:text-amber-600 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-certificate text-slate-400"></i> Vinh danh</button>
                            </div>
                            <div class="podium-pillar-2 w-full flex items-center justify-center font-black text-white text-lg sm:text-2xl shadow-md">
                                <i class="fa-solid fa-medal text-slate-200"></i>
                            </div>
                        ` : `<div class="h-24 opacity-0"></div>`}
                    </div>

                    <!-- Rank 1: Gold (Center) -->
                    <div class="podium-stand flex flex-col items-center text-center -mt-4">
                        ${top1 ? `
                            <div class="mb-2 flex flex-col items-center">
                                <div class="text-2xl sm:text-3xl crown-shine mb-1 animate-bounce">👑</div>
                                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center relative cursor-pointer group" onclick="openHonorCertificate('${escapeHtml(top1.name||'Học sinh')}', ${top1.score}, 1, '${escapeHtml(top1.cls||'')}', '${escapeHtml(top1.code||'')}')" title="Nhấn để xem & xuất Giấy Vinh Danh 3D">
                                    <div class="w-full h-full rounded-2xl bg-amber-50 flex items-center justify-center font-black text-amber-900 text-base sm:text-lg uppercase group-hover:scale-105 transition">
                                        ${(top1.name || 'HS').charAt(0)}
                                    </div>
                                    <div class="absolute -bottom-2 -right-1 bg-amber-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">1</div>
                                </div>
                                <div class="font-black text-xs sm:text-sm text-amber-900 truncate max-w-[100px] sm:max-w-[130px] mt-2 uppercase tracking-wide">${top1.name || 'ID ' + top1.id}</div>
                                <span class="text-[9px] px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black uppercase tracking-wider shadow-2xs mt-0.5">👑 Math Grandmaster</span>
                                <div class="font-black text-sm sm:text-base text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 shadow-2xs mt-0.5">${top1.score}đ <span class="text-[10px] font-mono font-bold text-amber-900/80 ml-0.5">(${top1.code || '-'})</span></div>
                                <button onclick="openHonorCertificate('${escapeHtml(top1.name||'Học sinh')}', ${top1.score}, 1, '${escapeHtml(top1.cls||'')}', '${escapeHtml(top1.code||'')}')" class="text-[10px] text-amber-700 hover:text-amber-900 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-certificate text-amber-500"></i> Xuất Giấy Vinh Danh</button>
                            </div>
                            <div class="podium-pillar-1 w-full flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-xl">
                                <i class="fa-solid fa-trophy text-yellow-100"></i>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Rank 3: Bronze (Right) -->
                    <div class="podium-stand flex flex-col items-center text-center">
                        ${top3 ? `
                            <div class="mb-2 flex flex-col items-center">
                                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-700 p-0.5 shadow-md flex items-center justify-center relative cursor-pointer group" onclick="openHonorCertificate('${escapeHtml(top3.name||'Học sinh')}', ${top3.score}, 3, '${escapeHtml(top3.cls||'')}', '${escapeHtml(top3.code||'')}')" title="Nhấn để xem & xuất Giấy Vinh Danh 3D">
                                    <div class="w-full h-full rounded-2xl bg-white flex items-center justify-center font-black text-orange-900 text-sm sm:text-base uppercase group-hover:scale-105 transition">
                                        ${(top3.name || 'HS').charAt(0)}
                                    </div>
                                    <div class="absolute -bottom-2 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">3</div>
                                </div>
                                <div class="font-bold text-xs sm:text-sm text-slate-800 truncate max-w-[90px] sm:max-w-[120px] mt-2">${top3.name || 'ID ' + top3.id}</div>
                                <div class="font-black text-xs sm:text-sm text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 mt-0.5">${top3.score}đ <span class="text-[9px] font-mono font-bold text-slate-500 ml-0.5">(${top3.code || '-'})</span></div>
                                <button onclick="openHonorCertificate('${escapeHtml(top3.name||'Học sinh')}', ${top3.score}, 3, '${escapeHtml(top3.cls||'')}', '${escapeHtml(top3.code||'')}')" class="text-[10px] text-slate-500 hover:text-amber-600 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-certificate text-orange-400"></i> Vinh danh</button>
                            </div>
                            <div class="podium-pillar-3 w-full flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md">
                                <i class="fa-solid fa-award text-orange-200"></i>
                            </div>
                        ` : `<div class="h-20 opacity-0"></div>`}
                    </div>
                </div>
            `;
            podiumEl.innerHTML = htmlPodium;
        }

        // Render remaining ranks (Top 4 to 10)
        let runnersUp = sorted.slice(3);
        if (runnersUp.length === 0) {
            list.innerHTML = '';
        } else {
            list.innerHTML = `
                <div class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-1">
                    <i class="fa-solid fa-list-ol text-amber-500"></i> XẾP HẠNG TIẾP THEO (TOP 4 - 10)
                </div>
            ` + runnersUp.map((hs, idx) => {
                let actualRank = idx + 4;
                return `
                <div class="flex items-center p-3 rounded-2xl mb-2 bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
                    <div class="w-8 h-8 rounded-xl bg-slate-100 font-black text-slate-600 flex items-center justify-center text-xs shrink-0 border border-slate-200">
                        ${actualRank}
                    </div>
                    <div class="flex-grow pl-3">
                        <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
                            ${hs.name !== 'Khách' && hs.name ? hs.name : 'ID ' + hs.id}
                        </div>
                        <div class="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                            <span><i class="fa-solid fa-graduation-cap text-slate-300 mr-1"></i>Lớp: <b>${hs.cls || hs.class || '-'}</b></span>
                            <span>•</span>
                            <span>Mã: <b>${hs.code}</b></span>
                        </div>
                    </div>
                    <div class="text-right shrink-0 flex items-center gap-2">
                        <span class="font-black text-emerald-600 text-base bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">${hs.score}đ</span>
                        <button onclick="openHonorCertificate('${escapeHtml(hs.name||'Học sinh')}', ${hs.score}, ${actualRank}, '${escapeHtml(hs.cls||'')}', '${escapeHtml(hs.code||'')}')" class="p-2 bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-800 rounded-xl transition" title="Xem Giấy Vinh Danh"><i class="fa-solid fa-certificate"></i></button>
                    </div>
                </div>`;
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

    let codeSelect = document.getElementById('leaderboard-code-filter');
    let currentCodeFilter = codeSelect ? codeSelect.value : 'ALL';
    let isFilteredByCode = (currentCodeFilter && currentCodeFilter !== 'ALL');

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

    // Detailed Stats breakdown per Exam Code (Mã Đề)
    let codeStatsMap = {};
    (state.allResultsData || rawResults).forEach(r => {
        let c = String(r.code || 'KHONG_MA').trim().toUpperCase();
        if (!codeStatsMap[c]) {
            codeStatsMap[c] = {
                code: c,
                submissions: 0,
                students: new Set(),
                scores: []
            };
        }
        let s = Number(r.score ?? r.maxScore ?? 0);
        if (!isNaN(s)) codeStatsMap[c].scores.push(s);
        let sId = String(r.id || r.name || Math.random());
        codeStatsMap[c].students.add(sId);
        codeStatsMap[c].submissions++;
    });

    let codeStatsList = Object.values(codeStatsMap).map(cs => {
        let avg = cs.scores.length ? (cs.scores.reduce((a,b)=>a+b,0)/cs.scores.length).toFixed(2) : '0';
        let max = cs.scores.length ? Math.max(...cs.scores) : 0;
        let pass = cs.scores.filter(s => s >= 5.0).length;
        let passPct = cs.scores.length ? Math.round((pass / cs.scores.length)*100) : 0;
        return {
            ...cs,
            avgScore: avg,
            maxScore: max,
            passRate: passPct
        };
    }).sort((a,b) => b.submissions - a.submissions);

    let scopeLabel = isFilteredByCode ? `Mã Đề: ${currentCodeFilter}` : `Toàn hệ thống (${codeStatsList.length} mã đề)`;

    let html = `
        <div class="space-y-4">
            <!-- 1. KPI CARDS -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Bài Nộp</div>
                    <div class="text-xl sm:text-2xl font-black text-indigo-600 mt-0.5">${totalSubmissions}</div>
                    <div class="text-[10px] text-slate-400 font-medium">${totalStudents} học sinh</div>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm Trung Bình</div>
                    <div class="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">${avgScore} <span class="text-xs font-bold">/ 10</span></div>
                    <div class="text-[10px] text-amber-700 font-bold truncate">${scopeLabel}</div>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm Cao Nhất</div>
                    <div class="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">${maxScore}đ</div>
                    <div class="text-[10px] text-emerald-600 font-bold">Thủ khoa</div>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Đạt (≥ 5.0)</div>
                    <div class="text-xl sm:text-2xl font-black text-sky-600 mt-0.5">${passRate}%</div>
                    <div class="text-[10px] text-slate-400 font-medium">${passCount}/${scores.length} bài</div>
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
                                <span class="text-sky-600 font-black">${avgP1}đ (${Math.round(avgP1/3*100)}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-sky-500 rounded-full" style="width: ${Math.min(100, Math.round(avgP1/3*100))}%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between font-bold text-slate-700 mb-1">
                                <span>Phần 2: Đúng / Sai bậc thang (Tối đa 4.0đ)</span>
                                <span class="text-amber-600 font-black">${avgP2}đ (${Math.round(avgP2/4*100)}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-amber-500 rounded-full" style="width: ${Math.min(100, Math.round(avgP2/4*100))}%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between font-bold text-slate-700 mb-1">
                                <span>Phần 3: Trả lời ngắn số học (Tối đa 3.0đ)</span>
                                <span class="text-rose-600 font-black">${avgP3}đ (${Math.round(avgP3/3*100)}%)</span>
                            </div>
                            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-rose-500 rounded-full" style="width: ${Math.min(100, Math.round(avgP3/3*100))}%;"></div>
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
                                <div class="h-full bg-purple-500 rounded-full" style="width: ${scores.length ? Math.round(tiers.excellent/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">${tiers.excellent} (${scores.length ? Math.round(tiers.excellent/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-emerald-700 shrink-0">🌟 Giỏi (8.0-8.8)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-500 rounded-full" style="width: ${scores.length ? Math.round(tiers.good/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">${tiers.good} (${scores.length ? Math.round(tiers.good/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-sky-700 shrink-0">👍 Khá (6.5-7.8)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-sky-500 rounded-full" style="width: ${scores.length ? Math.round(tiers.fair/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">${tiers.fair} (${scores.length ? Math.round(tiers.fair/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-amber-700 shrink-0">🎯 Trung bình (5-6.3)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-amber-500 rounded-full" style="width: ${scores.length ? Math.round(tiers.average/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">${tiers.average} (${scores.length ? Math.round(tiers.average/scores.length*100) : 0}%)</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="w-24 font-bold text-rose-700 shrink-0">⚠️ Cần rèn (<5.0)</span>
                            <div class="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-rose-500 rounded-full" style="width: ${scores.length ? Math.round(tiers.weak/scores.length*100) : 0}%;"></div>
                            </div>
                            <span class="w-12 text-right font-black text-slate-600">${tiers.weak} (${scores.length ? Math.round(tiers.weak/scores.length*100) : 0}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. THỐNG KÊ CHI TIẾT THEO MÃ ĐỀ -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide mb-3 flex items-center justify-between">
                    <span class="flex items-center gap-2"><i class="fa-solid fa-list-check text-sky-600"></i> Thống Kê Phân Tích Chi Tiết Theo Mã Đề</span>
                    <span class="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">${codeStatsList.length} Mã Đề</span>
                </h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                            <tr>
                                <th class="p-2.5">Mã Đề</th>
                                <th class="p-2.5 text-center">Số Bài Nộp</th>
                                <th class="p-2.5 text-center">Số Học Sinh</th>
                                <th class="p-2.5 text-center">Điểm TB</th>
                                <th class="p-2.5 text-center">Cao Nhất</th>
                                <th class="p-2.5 text-center">Tỷ Lệ Đạt</th>
                                <th class="p-2.5 text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-medium">
                            ${codeStatsList.map(cs => `
                                <tr class="hover:bg-amber-50/60 transition ${currentCodeFilter === cs.code ? 'bg-amber-50/90 font-bold' : ''}">
                                    <td class="p-2.5 font-mono font-black text-sky-700">📌 ${cs.code}</td>
                                    <td class="p-2.5 text-center font-bold text-slate-700">${cs.submissions} bài</td>
                                    <td class="p-2.5 text-center text-slate-600">${cs.students.size} HS</td>
                                    <td class="p-2.5 text-center font-black text-amber-600">${cs.avgScore}đ</td>
                                    <td class="p-2.5 text-center font-black text-emerald-600">${cs.maxScore}đ</td>
                                    <td class="p-2.5 text-center"><span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${cs.passRate >= 70 ? 'bg-emerald-100 text-emerald-800' : (cs.passRate >= 50 ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800')}">${cs.passRate}%</span></td>
                                    <td class="p-2.5 text-center">
                                        <button onclick="filterLeaderboardByCode('${cs.code}')" class="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-[10px] shadow-2xs transition">
                                            <i class="fa-solid fa-filter mr-1"></i> Xem Bảng Vàng
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 4. AI DIAGNOSTIC & PEDAGOGICAL RECOMMENDATIONS -->
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
    `;

    container.innerHTML = html;
}

function filterLeaderboardByCode(code) {
    let codeSelect = document.getElementById('leaderboard-code-filter');
    if (codeSelect) {
        codeSelect.value = code;
    }
    switchLeaderboardTab('podium');
    fetchLeaderboard();
}
window.filterLeaderboardByCode = filterLeaderboardByCode;

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
    ctx.fillText(`Lớp: ${cls || 'Khảo Thí'}   •   Mã Đề: ${code || 'TBS-2025'}`, w / 2, 245);

    // Rank & Score Ribbon Box
    const rankTitle = rank === 1 ? '👑 THỦ KHOA QUÁN QUÂN' : (rank === 2 ? '🥈 Á QUÂN TOÁN HỌC' : (rank === 3 ? '🥉 TOP 3 TOÀN TRƯỜNG' : `🎖️ TOP ${rank} XUẤT SẮC`));
    
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
    ctx.fillText(`ĐIỂM SỐ XUẤT SẮC: ${score} / 10.0`, w / 2, 342);

    // Date & System Seal
    const todayStr = new Date().toLocaleDateString('vi-VN');
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`Ngày cấp: ${todayStr}  •  Xác thực hệ thống EduMath TBS Cloud`, w / 2, 400);

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
    link.download = `Giay_Vinh_Danh_EduMath_TBS_${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('🎉 Đã tải Giấy Vinh Danh chất lượng cao!');
}

window.switchLeaderboardTab = switchLeaderboardTab;
window.setLeaderboardGameMode = setLeaderboardGameMode;
window.openHonorCertificate = openHonorCertificate;
window.downloadHonorCertificate = downloadHonorCertificate;


let lbResetTimeMode = 'now';
function setLbResetTimeMode(mode) {
    lbResetTimeMode = mode;
    let btnNow = document.getElementById('btn-reset-time-now');
    let btnCustom = document.getElementById('btn-reset-time-custom');
    let contCustom = document.getElementById('lb-custom-time-container');
    if (mode === 'now') {
        btnNow.classList.add('bg-amber-500', 'text-white', 'shadow');
        btnNow.classList.remove('bg-slate-100', 'text-slate-600');
        btnCustom.classList.remove('bg-amber-500', 'text-white', 'shadow');
        btnCustom.classList.add('bg-slate-100', 'text-slate-600');
        contCustom.classList.add('hidden');
    } else {
        btnCustom.classList.add('bg-amber-500', 'text-white', 'shadow');
        btnCustom.classList.remove('bg-slate-100', 'text-slate-600');
        btnNow.classList.remove('bg-amber-500', 'text-white', 'shadow');
        btnNow.classList.add('bg-slate-100', 'text-slate-600');
        contCustom.classList.remove('hidden');

        let now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('lb-reset-custom-time').value = now.toISOString().slice(0, 16);
    }
}

function openLeaderboardResetModal() {
    let isDev = localStorage.getItem('devModeBypass') === 'true';
    let isTeacher = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;

    let pinCont = document.getElementById('lb-auth-pin-container');
    if (pinCont) {
        if (isTeacher) {
            pinCont.classList.add('hidden');
        } else {
            pinCont.classList.remove('hidden');
            document.getElementById('lb-reset-auth-pin').value = '';
        }
    }

    document.getElementById('lb-reset-cycle-title').value = leaderboardConfig.cycleTitle && leaderboardConfig.cycleTitle !== 'Toàn thời gian' ? leaderboardConfig.cycleTitle : '';
    setLbResetTimeMode('now');
    document.getElementById('leaderboard-reset-modal').classList.remove('hidden');
}

function closeLeaderboardResetModal() {
    document.getElementById('leaderboard-reset-modal').classList.add('hidden');
}

async function confirmLeaderboardReset() {
    let isDev = localStorage.getItem('devModeBypass') === 'true';
    let isTeacher = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;

    if (!isTeacher) {
        let pin = document.getElementById('lb-reset-auth-pin')?.value.trim();
        if (!(await verifyTeacherPinHash(pin))) {
            return showToast("Mã xác thực Giáo viên không chính xác!", true);
        }
    }

    let title = document.getElementById('lb-reset-cycle-title').value.trim() || `Đợt thi ${new Date().toLocaleDateString('vi-VN')}`;
    let resetDate = new Date();

    if (lbResetTimeMode === 'custom') {
        let customVal = document.getElementById('lb-reset-custom-time').value;
        if (customVal) resetDate = new Date(customVal);
    }

    let newConfig = {
        resetAt: resetDate.toISOString(),
        resetDateStr: resetDate.toLocaleDateString('vi-VN') + ' ' + resetDate.toLocaleTimeString('vi-VN'),
        resetBy: state.currentUser ? state.currentUser.email : 'Giáo viên TBS',
        cycleTitle: title,
        updatedAt: new Date().toISOString()
    };

    let btn = document.getElementById('btn-confirm-lb-reset');
    let oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang thiết lập...';
    btn.disabled = true;

    try {
        await db.collection("GameData").doc("LeaderboardConfig").set(newConfig);
        leaderboardConfig = newConfig;
        showToast("Đã tạo mới Bảng Vàng thành công!");
        closeLeaderboardResetModal();
        updateLeaderboardCycleUI();
        setLeaderboardFilter('cycle');
    } catch(e) {
        showToast("Lỗi lưu cấu hình: " + e.message, true);
    } finally {
        btn.innerHTML = oldText;
        btn.disabled = false;
    }
}

async function clearLeaderboardReset() {
    let isDev = localStorage.getItem('devModeBypass') === 'true';
    let isTeacher = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;

    if (!isTeacher) {
        let pin = document.getElementById('lb-reset-auth-pin')?.value.trim();
        if (!(await verifyTeacherPinHash(pin))) {
            return showToast("Cần nhập mã xác thực chính xác để khôi phục!", true);
        }
    }

    if (!confirm("Khôi phục Bảng Vàng để tính điểm cho toàn bộ lịch sử (bỏ mốc lọc tạo mới)?")) return;

    try {
        let emptyConfig = {
            resetAt: null,
            resetDateStr: null,
            resetBy: null,
            cycleTitle: "Toàn thời gian",
            updatedAt: new Date().toISOString()
        };
        await db.collection("GameData").doc("LeaderboardConfig").set(emptyConfig);
        leaderboardConfig = emptyConfig;
        showToast("Đã khôi phục tính điểm toàn thời gian!");
        closeLeaderboardResetModal();
        updateLeaderboardCycleUI();
        setLeaderboardFilter('all');
    } catch(e) {
        showToast("Lỗi khôi phục: " + e.message, true);
    }
}

let currentBoardEditorTab = 'visual';

async function renderBoard() {
    let appContent = document.getElementById('app-content');
    if (!appContent) return;

    let cachedData = null;
    try {
        let raw = localStorage.getItem('tbs_board_info');
        if (raw) cachedData = JSON.parse(raw);
    } catch(e) {}

    let initialContent = (cachedData && cachedData.content) ? cachedData.content : `<div style="font-size: 16px; color: #334155; line-height: 1.8;">
        <h3 style="color: #0284c7; font-size: 20px; font-weight: 800; margin-bottom: 12px;">🌟 Chào Mừng Đến Với Hệ Thống Khảo Thí & Luyện Tập EDUMATH TBS</h3>
        <p style="margin-bottom: 12px;">Hệ thống cung cấp ngân hàng đề thi Toán học trắc nghiệm chuẩn cấu trúc mới, tích hợp Bảng trắng thông minh và hỗ trợ công thức Toán học trực quan.</p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 10px; margin: 12px 0; color: #15803d; font-weight: 500;">
            <strong style="font-weight: 800;">💡 LƯU Ý HỌC TẬP:</strong> Các em học sinh nhớ kiểm tra bảng tin thường xuyên để nhận mã đề thi thử và thông báo lịch khảo sát định kỳ!
        </div>
    </div>`;
    let initialEvents = (cachedData && cachedData.events) ? cachedData.events : "Thi thử THPT Quốc gia (Toán)\nCập nhật Ngân hàng câu hỏi mới\nKhảo sát chất lượng Lớp 10, 11, 12";

    function generateBoardHTML(content, eventsStr) {
        let isHtml = /<(?:div|p|h[1-6]|span|table|ul|ol|hr|b|i|u|strong|em|font|section|article)[\s>]/i.test(content);
        let processedContent = isHtml ? content : (typeof marked !== 'undefined' ? marked.parse(content.replace(/\n/g, '<br>')) : content);
        
        let eventsArr = eventsStr.split('\n').filter(e => e.trim());
        let colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500'];
        let eventsHtml = eventsArr.length ? eventsArr.map((e, i) => `<li class="flex items-center gap-3"><div class="w-2.5 h-2.5 rounded-full ${colors[i % colors.length]} shrink-0"></div><span class="text-sm font-semibold text-slate-700">${e.trim()}</span></li>`).join('') : '<li class="text-sm font-medium text-slate-500">Chưa có sự kiện nào.</li>';

        let isDev = localStorage.getItem('devModeBypass') === 'true';
        let isAdmin = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;
        let editBtnHtml = isAdmin ? `<button onclick="openBoardEditor()" class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-black text-sm shadow-md hover:from-amber-600 hover:to-orange-600 hover:scale-105 transition-all ml-4 btn-3d flex items-center gap-2"><i class="fa-solid fa-pen-to-square"></i> Sửa Bảng Tin</button>` : '';

        return `
            <div class="w-full max-w-5xl fade-in mt-2 relative group">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b-2 border-slate-200 pb-4 gap-4 md:gap-0">
                    <div class="flex items-center flex-wrap gap-2">
                        <h2 class="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-widest flex items-center"><i class="fa-solid fa-meteor text-orange-500 mr-3 animate-pulse"></i>BẢNG TIN TBS</h2>
                        ${editBtnHtml}
                    </div>
                    <div class="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm font-bold text-sm text-slate-600 flex items-center gap-2"><i class="fa-regular fa-calendar text-indigo-500"></i> Hôm nay: ${new Date().toLocaleDateString('vi-VN')}</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-1 space-y-6">
                        <div class="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-3xl shadow-lg relative overflow-hidden text-white">
                            <i class="fa-solid fa-bullhorn absolute -right-6 -bottom-6 text-white/10 text-8xl"></i>
                            <h3 class="text-xl font-black mb-2 relative z-10 uppercase tracking-widest">Tin Tức Đáng Chú Ý</h3>
                            <p class="text-white/90 font-medium text-sm relative z-10 mb-4">Các thông báo khẩn cấp và cập nhật quan trọng nhất trong tuần.</p>
                            <div class="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 text-sm font-bold shadow-inner relative z-10">
                                Vui lòng thường xuyên kiểm tra bảng tin để không bỏ lỡ các kỳ thi định kỳ!
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                            <h3 class="text-lg font-black text-slate-700 mb-4 border-b-2 border-slate-100 pb-2 uppercase tracking-wide flex items-center justify-between">
                                <span><i class="fa-solid fa-calendar-days text-rose-500 mr-2"></i>Sự Kiện Sắp Tới</span>
                            </h3>
                            <ul class="space-y-3" id="board-events-list">
                                ${eventsHtml}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="md:col-span-2">
                        <div class="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 relative h-full flex flex-col">
                            <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                                <span class="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xs flex items-center gap-2"><i class="fa-solid fa-bell"></i> Tin Tuần / Tháng</span>
                            </div>
                            <div id="board-rendered-content" class="text-slate-700 font-normal leading-relaxed math-scroll min-h-[360px] flex-grow">
                                ${processedContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render immediately from cache for 0ms transition
    appContent.innerHTML = generateBoardHTML(initialContent, initialEvents);
    triggerMathJax();

    // Async background fetch to sync remote Firestore data if available
    if (typeof db !== 'undefined') {
        try {
            let doc = await db.collection("GameData").doc("BoardInfo").get();
            if (doc.exists && currentPortalTab === 'board') {
                let data = doc.data();
                let freshContent = data.content || initialContent;
                let freshEvents = data.events || initialEvents;
                localStorage.setItem('tbs_board_info', JSON.stringify({ content: freshContent, events: freshEvents }));
                let contentEl = document.getElementById('board-rendered-content');
                if (contentEl) {
                    let isHtml = /<(?:div|p|h[1-6]|span|table|ul|ol|hr|b|i|u|strong|em|font|section|article)[\s>]/i.test(freshContent);
                    contentEl.innerHTML = isHtml ? freshContent : (typeof marked !== 'undefined' ? marked.parse(freshContent.replace(/\n/g, '<br>')) : freshContent);
                    triggerMathJax();
                }
            }
        } catch(e) {
            console.warn("Firestore board sync notice:", e);
        }
    }
}

async function openBoardEditor() {
    try {
        let doc = await db.collection("GameData").doc("BoardInfo").get();
        let data = doc.exists ? doc.data() : {};
        let content = data.content || "";
        let events = data.events || "Thi thử THPT Quốc gia (Toán)\nCập nhật Ngân hàng câu hỏi tháng 8\nKhảo sát chất lượng Lớp 12";
        
        let richEditor = document.getElementById('board-rich-editor');
        let codeEditor = document.getElementById('board-edit-content');
        let eventsInput = document.getElementById('board-edit-events');
        
        if (richEditor) richEditor.innerHTML = content;
        if (codeEditor) codeEditor.value = content;
        if (eventsInput) eventsInput.value = events;
        
        switchBoardEditorTab('visual');
        
        let modal = document.getElementById('board-edit-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } catch(e) {
        showToast("Lỗi tải nội dung bảng tin", true);
    }
}

function closeBoardEditorModal() {
    let modal = document.getElementById('board-edit-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchBoardEditorTab(tab) {
    currentBoardEditorTab = tab;
    let richEditor = document.getElementById('board-rich-editor');
    let codeEditor = document.getElementById('board-edit-content');
    let previewBox = document.getElementById('board-preview-container');
    let toolbar = document.getElementById('board-toolbar-section');
    
    let btnVisual = document.getElementById('tab-btn-visual');
    let btnPreview = document.getElementById('tab-btn-preview');
    let btnCode = document.getElementById('tab-btn-code');
    
    [btnVisual, btnPreview, btnCode].forEach(b => {
        if (b) {
            b.classList.remove('bg-white', 'text-main', 'shadow-sm');
            b.classList.add('text-slate-600');
        }
    });

    if (tab === 'visual') {
        if (btnVisual) { btnVisual.classList.add('bg-white', 'text-main', 'shadow-sm'); btnVisual.classList.remove('text-slate-600'); }
        if (codeEditor && !codeEditor.classList.contains('hidden')) {
            richEditor.innerHTML = codeEditor.value;
        }
        if (richEditor) richEditor.classList.remove('hidden');
        if (codeEditor) codeEditor.classList.add('hidden');
        if (previewBox) previewBox.classList.add('hidden');
        if (toolbar) toolbar.classList.remove('hidden');
    } else if (tab === 'code') {
        if (btnCode) { btnCode.classList.add('bg-white', 'text-main', 'shadow-sm'); btnCode.classList.remove('text-slate-600'); }
        if (richEditor && !richEditor.classList.contains('hidden')) {
            codeEditor.value = richEditor.innerHTML;
        }
        if (richEditor) richEditor.classList.add('hidden');
        if (codeEditor) codeEditor.classList.remove('hidden');
        if (previewBox) previewBox.classList.add('hidden');
        if (toolbar) toolbar.classList.add('hidden');
    } else if (tab === 'preview') {
        if (btnPreview) { btnPreview.classList.add('bg-white', 'text-main', 'shadow-sm'); btnPreview.classList.remove('text-slate-600'); }
        let currentHtml = (codeEditor && !codeEditor.classList.contains('hidden')) ? codeEditor.value : richEditor.innerHTML;
        if (previewBox) {
            previewBox.innerHTML = currentHtml || '<p class="text-slate-400 italic">Chưa có nội dung xem trước.</p>';
            previewBox.classList.remove('hidden');
            triggerMathJax();
        }
        if (richEditor) richEditor.classList.add('hidden');
        if (codeEditor) codeEditor.classList.add('hidden');
        if (toolbar) toolbar.classList.add('hidden');
    }
}

function formatDoc(cmd, value = null) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    document.execCommand(cmd, false, value);
}

function changeHeading(tag) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    if (tag === 'p') {
        document.execCommand('formatBlock', false, '<p>');
    } else {
        document.execCommand('formatBlock', false, `<${tag}>`);
    }
}

function changeFontSize(size) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        document.execCommand('fontSize', false, '7');
    } else {
        document.execCommand('fontSize', false, '7');
    }
    
    let fontEls = richEditor.querySelectorAll('font[size="7"]');
    fontEls.forEach(f => {
        f.removeAttribute('size');
        f.style.fontSize = size;
        f.style.lineHeight = '1.6';
    });
}

function changeFontFamily(font) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    document.execCommand('fontName', false, font);
}

function changeTextColor(color) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    document.execCommand('foreColor', false, color);
}

function changeHighlight(color) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    if (color === 'transparent') {
        document.execCommand('removeFormat');
    } else {
        try {
            document.execCommand('hiliteColor', false, color);
        } catch(e) {
            document.execCommand('backColor', false, color);
        }
    }
}

function clearFormatting() {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    document.execCommand('removeFormat', false, null);
}

function insertEmoji(char) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    document.execCommand('insertText', false, char + ' ');
}

function insertBoardLink() {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    let url = prompt("Nhập đường dẫn trang web (URL):", "https://");
    if (url && url !== "https://") {
        let text = prompt("Nhập văn bản hiển thị cho liên kết (để trống nếu dùng chính URL):", "");
        if (text) {
            let linkHtml = `<a href="${url}" target="_blank" style="color: #0284c7; text-decoration: underline; font-weight: bold;">${text}</a>`;
            document.execCommand('insertHTML', false, linkHtml);
        } else {
            document.execCommand('createLink', false, url);
        }
    }
}

function insertBoardTable() {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    let tableHtml = `
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px;">
            <thead>
                <tr style="background: #f1f5f9; color: #1e293b; font-weight: bold; border-bottom: 2px solid #cbd5e1;">
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">STT</th>
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Nội Dung</th>
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">Ghi Chú</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">1</td>
                    <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Học phần 1</td>
                    <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">Đang mở</td>
                </tr>
                <tr>
                    <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">2</td>
                    <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Học phần 2</td>
                    <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">Sắp mở</td>
                </tr>
            </tbody>
        </table><p><br></p>
    `;
    document.execCommand('insertHTML', false, tableHtml);
}

function insertCallout(type) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    let boxHtml = '';
    if (type === 'info') {
        boxHtml = `<div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px 16px; border-radius: 10px; margin: 12px 0; color: #0369a1; font-weight: 500; font-size: 15px;"><strong style="font-weight: 800;">ℹ️ THÔNG BÁO:</strong> Nhập nội dung thông báo tại đây...</div><p><br></p>`;
    } else if (type === 'alert') {
        boxHtml = `<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 10px; margin: 12px 0; color: #b91c1c; font-weight: 500; font-size: 15px;"><strong style="font-weight: 800;">⚠️ LƯU Ý QUAN TRỌNG:</strong> Nhập nội dung cảnh báo / hạn chót...</div><p><br></p>`;
    } else if (type === 'success') {
        boxHtml = `<div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 10px; margin: 12px 0; color: #15803d; font-weight: 500; font-size: 15px;"><strong style="font-weight: 800;">✅ CHÚC MỪNG:</strong> Tuyên dương thành tích xuất sắc...</div><p><br></p>`;
    } else if (type === 'highlight') {
        boxHtml = `<div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 10px; margin: 12px 0; color: #b45309; font-weight: 500; font-size: 15px;"><strong style="font-weight: 800;">🔥 TIÊU ĐIỂM:</strong> Điểm nhấn quan trọng trong tuần...</div><p><br></p>`;
    }
    document.execCommand('insertHTML', false, boxHtml);
}

function insertBoardTemplate(type) {
    let richEditor = document.getElementById('board-rich-editor');
    richEditor.focus();
    let templateHtml = '';
    
    if (type === 'codes') {
        templateHtml = `
<h2 style="color: #0284c7; text-align: center; font-size: 22px; font-weight: 900; margin-bottom: 8px;">📢 DANH SÁCH MÃ ĐỀ LUYỆN TẬP TUẦN NÀY</h2>
<p style="text-align: center; color: #64748b; font-size: 14px; margin-bottom: 16px;"><em>Học sinh nhập mã đề tương ứng tại trang chủ để bắt đầu làm bài</em></p>
<div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
    <p style="color: #1e293b; font-size: 15px; line-height: 2;">
        🔥 <strong style="color: #0284c7;">SOCOBN</strong>: ĐƠN ĐIỆU VÀ CỰC TRỊ<br>
        🔥 <strong style="color: #0284c7;">FGMZ82</strong>: GIÁ TRỊ LỚN NHẤT & NHỎ NHẤT (GTLN, GTNN)<br>
        🔥 <strong style="color: #0284c7;">WTGUKF</strong>: ĐƯỜNG TIỆM CẬN ĐỒ THỊ<br>
        🔥 <strong style="color: #0284c7;">M8QNMY</strong>: KHẢO SÁT HÀM SỐ VÀ VẼ ĐỒ THỊ<br>
        🔥 <strong style="color: #0284c7;">K3B5AG</strong>: VÉC TƠ TRONG KHÔNG GIAN (HÌNH HỌC 12)<br>
        🔥 <strong style="color: #0284c7;">WTYPHK</strong>: ĐỀ ÔN TẬP TỔNG HỢP LỚP 11B2
    </p>
</div>
<p style="color: #dc2626; font-weight: bold; font-size: 15px; text-align: center;">👨‍🏫 Thầy Hùng - SĐT / Zalo: 0919.022.202</p>
        `;
    } else if (type === 'exam') {
        templateHtml = `
<h2 style="color: #dc2626; text-align: center; font-size: 22px; font-weight: 900; margin-bottom: 8px;">🏆 THÔNG BÁO LỊCH THI & KIỂM TRA ĐỊNH KỲ</h2>
<p style="text-align: center; color: #64748b; font-size: 14px; margin-bottom: 14px;"><em>Áp dụng cho học sinh toàn trường từ ngày 15/08</em></p>
<div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 18px; border-radius: 10px; margin-bottom: 16px; color: #9a3412;">
    <p style="font-weight: bold; font-size: 16px; margin-bottom: 6px;">⏰ Thời gian mở phòng thi trực tuyến:</p>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 15px; line-height: 1.8;">
        <li><strong>Khối 12:</strong> Bắt đầu từ 19h30 - 21h00 Thứ Bảy hàng tuần.</li>
        <li><strong>Khối 11:</strong> Bắt đầu từ 20h00 - 21h30 Chủ Nhật hàng tuần.</li>
        <li><strong>Khối 10:</strong> Mở hệ thống luyện tập tự do cả tuần.</li>
    </ul>
</div>
<div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #991b1b;">
    <strong>⚠️ Lưu ý:</strong> Mỗi học sinh được làm bài tối đa 3 lần. Hệ thống tự động ghi nhận điểm cao nhất lên <strong>Bảng Vàng TBS</strong>.
</div>
        `;
    } else if (type === 'opening') {
        templateHtml = `
<h2 style="color: #16a34a; text-align: center; font-size: 22px; font-weight: 900; margin-bottom: 8px;">🚀 THÔNG BÁO KHAI GIẢNG LỚP HỌC MỚI</h2>
<div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 14px;">
    <p style="font-size: 15px; color: #166534; line-height: 1.9;">
        📍 <strong>Địa điểm:</strong> Trung tâm KIÊN LONG - 217 Nguyễn Hồng Đào, P.14, Q.Tân Bình<br>
        📅 <strong>Lịch học:</strong> Thứ 7 & Chủ Nhật hàng tuần<br>
        🎯 <strong>Mục tiêu:</strong> Ôn tập trọng tâm, rèn kỹ năng giải nhanh đề thi Tốt nghiệp THPT & ĐGNL.
    </p>
</div>
<p style="color: #0284c7; font-weight: bold; text-align: center; font-size: 15px;">Quý phụ huynh & Học sinh vui lòng liên hệ Thầy Hùng để đăng ký xếp lớp!</p>
        `;
    }

    if (confirm("Chèn mẫu nội dung này vào Bảng tin? (Bạn có thể tiếp tục chỉnh sửa sau khi chèn)")) {
        richEditor.innerHTML = templateHtml;
    }
}

async function saveBoardContent() {
    let richEditor = document.getElementById('board-rich-editor');
    let codeEditor = document.getElementById('board-edit-content');
    let eventsInput = document.getElementById('board-edit-events');
    
    let content = (currentBoardEditorTab === 'code' && codeEditor) ? codeEditor.value : (richEditor ? richEditor.innerHTML : '');
    let events = eventsInput ? eventsInput.value : '';
    
    try {
        await db.collection("GameData").doc("BoardInfo").set({ 
            content: content, 
            events: events,
            updatedAt: new Date().toISOString()
        });
        closeBoardEditorModal();
        localStorage.setItem('tbs_board_info', JSON.stringify({ content: content, events: events, updatedAt: new Date().toISOString() }));
        showToast("Đã lưu bảng tin thành công!");
        renderBoard();
    } catch(e) {
        showToast("Lỗi khi lưu bảng tin: " + e.message, true);
    }
}

function renderLinks() {
    let isDev = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && localStorage.getItem('devModeBypass') === 'true';
    let isTeacher = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;

    let linksHtml = savedLinks.length ? savedLinks.map((l, index) => {
        let iconClass = l.icon || 'fa-solid fa-link';
        return `
            <div class="relative group">
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-main hover:shadow-md transition-all h-full">
                    <div class="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition shrink-0 shadow-2xs">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="truncate flex-grow">
                        <h4 class="font-bold text-slate-800 group-hover:text-main leading-tight mb-1 truncate">${l.title}</h4>
                        <p class="text-xs text-slate-400 truncate">${l.url}</p>
                    </div>
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-sky-500 transition shrink-0"></i>
                </a>
                ${isTeacher ? `
                    <button onclick="openLinksEditorModal(${index})" class="opacity-0 group-hover:opacity-100 absolute top-2 right-2 w-7 h-7 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs shadow-md transition flex items-center justify-center btn-3d" title="Sửa liên kết này">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }).join('') : '<div class="col-span-full text-center py-12 text-slate-400 font-medium bg-white/50 rounded-2xl border border-dashed border-slate-200"><i class="fa-solid fa-link-slash text-4xl mb-3 text-slate-300"></i><br>Chưa có liên kết nào. Bấm nút <b>Cập Nhật Liên Kết</b> để thêm.</div>';

    let actionBtn = isTeacher ? `
        <button onclick="openLinksEditorModal()" class="bg-gradient-to-r from-sky-500 to-mainDark text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-md hover:from-sky-600 hover:to-mainDark hover:scale-105 transition-all btn-3d flex items-center gap-2">
            <i class="fa-solid fa-pen-to-square"></i> Cập Nhật Liên Kết
        </button>
    ` : `
        <button onclick="openLinksEditorModal()" class="bg-white hover:bg-sky-50 text-slate-600 hover:text-sky-700 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 border border-slate-200 hover:border-sky-300">
            <i class="fa-solid fa-lock text-amber-500"></i> Quản Lý Liên Kết
        </button>
    `;

    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-6 md:p-10 rounded-3xl w-full max-w-5xl text-center fade-in border-t-4 border-sky-500">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b-2 border-slate-100 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-link"></i>
                    </div>
                    <div class="text-left">
                        <h2 class="text-2xl md:text-3xl font-black text-sky-900 uppercase tracking-wider leading-tight">Danh Bạ Liên Kết</h2>
                        <p class="text-xs text-slate-500 font-medium">Truy cập nhanh các công cụ và tiện ích học tập trực tuyến</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    ${actionBtn}
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                ${linksHtml}
            </div>
        </div>
    `;
}

function openLinksEditorModal(targetIndex = -1) {
    let isDev = localStorage.getItem('devModeBypass') === 'true';
    let isTeacher = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;

    let pinCont = document.getElementById('links-auth-pin-container');
    if (pinCont) {
        if (isTeacher) {
            pinCont.classList.add('hidden');
        } else {
            pinCont.classList.remove('hidden');
            let pinInput = document.getElementById('links-reset-auth-pin');
            if (pinInput) pinInput.value = '';
        }
    }

    cancelEditLinkItem();
    renderLinksEditorList();

    if (targetIndex >= 0 && targetIndex < savedLinks.length) {
        editLinkItem(targetIndex);
    }

    let modal = document.getElementById('links-edit-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeLinksEditorModal() {
    let modal = document.getElementById('links-edit-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    cancelEditLinkItem();
}

function updateLinkIconPreview(iconClass) {
    let prev = document.getElementById('link-icon-preview');
    if (prev) {
        prev.innerHTML = `<i class="${iconClass}"></i>`;
    }
}

function submitLinkItem() {
    let title = document.getElementById('link-input-title')?.value.trim();
    let url = document.getElementById('link-input-url')?.value.trim();
    let icon = document.getElementById('link-input-icon')?.value || 'fa-solid fa-link';
    let editIdx = parseInt(document.getElementById('link-edit-index')?.value || '-1', 10);

    if (!title) {
        return showToast("Vui lòng nhập Tên liên kết / Tiêu đề!", true);
    }
    if (!url) {
        return showToast("Vui lòng nhập Đường dẫn URL!", true);
    }

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    let item = { title, url, icon };

    if (editIdx >= 0 && editIdx < savedLinks.length) {
        savedLinks[editIdx] = item;
        showToast(`Đã sửa liên kết "${title}"!`);
    } else {
        savedLinks.push(item);
        showToast(`Đã thêm liên kết "${title}" vào danh sách!`);
    }

    cancelEditLinkItem();
    renderLinksEditorList();
}

function editLinkItem(index) {
    if (index < 0 || index >= savedLinks.length) return;
    let item = savedLinks[index];

    document.getElementById('link-edit-index').value = index;
    document.getElementById('link-input-title').value = item.title || '';
    document.getElementById('link-input-url').value = item.url || '';
    
    let iconSelect = document.getElementById('link-input-icon');
    if (iconSelect) {
        iconSelect.value = item.icon || 'fa-solid fa-link';
        updateLinkIconPreview(iconSelect.value);
    }

    let formHeading = document.getElementById('link-form-title-text');
    if (formHeading) formHeading.innerText = `Chỉnh Sửa Liên Kết #${index + 1}`;

    let headingIcon = document.getElementById('link-form-heading-icon');
    if (headingIcon) {
        headingIcon.className = 'fa-solid fa-pen-to-square text-amber-500';
    }

    let submitBtnText = document.getElementById('btn-submit-link-text');
    if (submitBtnText) submitBtnText.innerText = 'Cập Nhật Mục Này';

    let submitBtnIcon = document.getElementById('btn-submit-link-icon');
    if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-check';

    let cancelBtn = document.getElementById('btn-cancel-link-edit');
    if (cancelBtn) cancelBtn.classList.remove('hidden');

    document.getElementById('link-input-title')?.focus();
}

function cancelEditLinkItem() {
    let editIdx = document.getElementById('link-edit-index');
    if (editIdx) editIdx.value = '-1';

    let titleInput = document.getElementById('link-input-title');
    if (titleInput) titleInput.value = '';

    let urlInput = document.getElementById('link-input-url');
    if (urlInput) urlInput.value = '';

    let iconSelect = document.getElementById('link-input-icon');
    if (iconSelect) {
        iconSelect.value = 'fa-solid fa-link';
        updateLinkIconPreview('fa-solid fa-link');
    }

    let formHeading = document.getElementById('link-form-title-text');
    if (formHeading) formHeading.innerText = 'Thêm Liên Kết Mới';

    let headingIcon = document.getElementById('link-form-heading-icon');
    if (headingIcon) {
        headingIcon.className = 'fa-solid fa-circle-plus text-sky-500';
    }

    let submitBtnText = document.getElementById('btn-submit-link-text');
    if (submitBtnText) submitBtnText.innerText = 'Thêm Vào Danh Sách';

    let submitBtnIcon = document.getElementById('btn-submit-link-icon');
    if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-plus';

    let cancelBtn = document.getElementById('btn-cancel-link-edit');
    if (cancelBtn) cancelBtn.classList.add('hidden');
}

function deleteLinkItem(index) {
    if (index < 0 || index >= savedLinks.length) return;
    let item = savedLinks[index];
    if (confirm(`Bạn có chắc muốn xóa liên kết "${item.title}" khỏi danh sách?`)) {
        savedLinks.splice(index, 1);
        if (parseInt(document.getElementById('link-edit-index')?.value || '-1', 10) === index) {
            cancelEditLinkItem();
        }
        renderLinksEditorList();
        showToast(`Đã xóa liên kết "${item.title}"`);
    }
}

function moveLinkItem(index, direction) {
    if (direction === 'up' && index > 0) {
        let temp = savedLinks[index];
        savedLinks[index] = savedLinks[index - 1];
        savedLinks[index - 1] = temp;
    } else if (direction === 'down' && index < savedLinks.length - 1) {
        let temp = savedLinks[index];
        savedLinks[index] = savedLinks[index + 1];
        savedLinks[index + 1] = temp;
    }
    renderLinksEditorList();
}

function resetDefaultLinks() {
    if (confirm("Khôi phục danh sách về 9 liên kết mặc định của hệ thống? Các mục chưa lưu sẽ được thay thế.")) {
        savedLinks = JSON.parse(JSON.stringify(DEFAULT_GLOBAL_LINKS));
        cancelEditLinkItem();
        renderLinksEditorList();
        showToast("Đã nạp 9 liên kết mặc định. Nhấn 'LƯU & ĐỒNG BỘ' để hoàn tất!");
    }
}

function renderLinksEditorList() {
    let container = document.getElementById('links-editor-list');
    let countBadge = document.getElementById('links-count-badge');
    if (countBadge) countBadge.innerText = savedLinks.length;

    if (!container) return;

    if (!savedLinks || savedLinks.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-slate-400 font-medium text-sm">Chưa có liên kết nào. Hãy thêm liên kết đầu tiên ở form phía trên hoặc khôi phục mẫu.</div>`;
        return;
    }

    container.innerHTML = savedLinks.map((l, i) => {
        let iconClass = l.icon || 'fa-solid fa-link';
        return `
            <div class="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 transition">
                <div class="flex items-center gap-3 min-w-0 flex-grow">
                    <span class="w-6 text-center text-xs font-black text-slate-400 shrink-0">${i + 1}</span>
                    <div class="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-base shrink-0">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="min-w-0 flex-grow">
                        <div class="font-bold text-slate-800 text-sm truncate">${l.title}</div>
                        <a href="${l.url}" target="_blank" class="text-xs text-sky-600 hover:underline truncate block">${l.url}</a>
                    </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="moveLinkItem(${i}, 'up')" ${i === 0 ? 'disabled class="w-7 h-7 rounded-lg bg-slate-100 text-slate-300 text-xs flex items-center justify-center cursor-not-allowed"' : 'class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center justify-center transition"'} title="Chuyển lên"><i class="fa-solid fa-arrow-up"></i></button>
                    <button type="button" onclick="moveLinkItem(${i}, 'down')" ${i === savedLinks.length - 1 ? 'disabled class="w-7 h-7 rounded-lg bg-slate-100 text-slate-300 text-xs flex items-center justify-center cursor-not-allowed"' : 'class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center justify-center transition"'} title="Chuyển xuống"><i class="fa-solid fa-arrow-down"></i></button>
                    <button type="button" onclick="editLinkItem(${i})" class="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs flex items-center justify-center transition" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" onclick="deleteLinkItem(${i})" class="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 text-xs flex items-center justify-center transition" title="Xóa"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

async function saveAllGlobalLinks() {
    let isDev = localStorage.getItem('devModeBypass') === 'true';
    let isTeacher = (state.currentUser && (state.authorizedEmails.includes(state.currentUser.email) || state.currentUser.email === SUPER_ADMIN_EMAIL)) || isDev;

    if (!isTeacher) {
        let pin = document.getElementById('links-reset-auth-pin')?.value.trim();
        if (!(await verifyTeacherPinHash(pin))) {
            return showToast("Mã xác thực Giáo viên không chính xác!", true);
        }
    }

    let btn = document.getElementById('btn-save-global-links');
    let oldHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang lưu...';
        btn.disabled = true;
    }

    try {
        await db.collection("GameData").doc("GlobalLinks").set({
            list: savedLinks,
            updatedAt: new Date().toISOString(),
            updatedBy: state.currentUser ? state.currentUser.email : 'Giáo viên TBS'
        });
        localStorage.setItem('tbs_links', JSON.stringify(savedLinks));
        showToast("Đã lưu và đồng bộ danh bạ liên kết thành công!");
        closeLinksEditorModal();
        renderLinks();
    } catch(e) {
        showToast("Lỗi lưu liên kết: " + e.message, true);
    } finally {
        if (btn) {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
        }
    }
}

function renderGuide() {
    document.getElementById('app-content').innerHTML = `
        <div class="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-6xl text-left fade-in border-t-4 border-emerald-500 flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-1/3 flex flex-col gap-3">
                <h2 class="text-2xl font-black text-slate-800 mb-2 uppercase tracking-widest border-b-2 border-slate-200 pb-3"><i class="fa-solid fa-book-open text-emerald-500 mr-3"></i>Hướng Dẫn</h2>
                <button onclick="showGuideTab('student')" id="guide-tab-student" class="guide-tab active-guide-tab px-5 py-4 rounded-2xl font-bold text-left transition flex items-center justify-between"><span class="flex items-center gap-3"><i class="fa-solid fa-graduation-cap text-xl"></i> Dành cho Học sinh</span><i class="fa-solid fa-chevron-right"></i></button>
                <button onclick="showGuideTab('teacher')" id="guide-tab-teacher" class="guide-tab px-5 py-4 rounded-2xl font-bold text-left transition flex items-center justify-between"><span class="flex items-center gap-3"><i class="fa-solid fa-chalkboard-user text-xl"></i> Dành cho Giáo viên</span><i class="fa-solid fa-chevron-right"></i></button>
                <button onclick="showGuideTab('admin')" id="guide-tab-admin" class="guide-tab px-5 py-4 rounded-2xl font-bold text-left transition flex items-center justify-between"><span class="flex items-center gap-3"><i class="fa-solid fa-user-shield text-xl"></i> Quản trị viên</span><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="w-full md:w-2/3 bg-white/60 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-inner h-[600px] overflow-y-auto admin-scroll" id="guide-content-area">
            </div>
        </div>
    `;
    showGuideTab('student');
}

window.showGuideTab = function(tab) {
    document.querySelectorAll('.guide-tab').forEach(el => {
        el.classList.remove('bg-emerald-500', 'text-white', 'shadow-md');
        el.classList.add('bg-slate-50', 'text-slate-600', 'hover:bg-slate-100');
    });
    let active = document.getElementById('guide-tab-' + tab);
    if (active) {
        active.classList.remove('bg-slate-50', 'text-slate-600', 'hover:bg-slate-100');
        active.classList.add('bg-emerald-500', 'text-white', 'shadow-md');
    }

    let content = '';
    if (tab === 'student') {
        content = `
            <h3 class="text-2xl font-black text-emerald-700 mb-6">Hướng dẫn dành cho Học sinh</h3>
            
            <div class="space-y-6">
                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-emerald-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-right-to-bracket text-emerald-500 mr-2"></i>1. Đăng nhập và Bắt đầu thi</h4>
                    <p class="text-slate-600 mb-2">Để bắt đầu làm bài, bạn cần có <b>Mã Đề Thi</b> do giáo viên cung cấp. Nhập mã này tại trang chủ và nhấn <b>VÀO THI NGAY</b>.</p>
                    <p class="text-slate-600">Tiếp theo, nhập <b>Mã ID Học sinh</b> và <b>Mật khẩu</b> cá nhân. Nếu là lần đầu tiên đăng nhập với mật khẩu mặc định (hungtbs), hệ thống sẽ gợi ý bạn đổi mật khẩu mới để bảo mật bài thi.</p>
                </div>
                
                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-amber-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-shield-halved text-amber-500 mr-2"></i>2. Quy chế thi (Anti-cheat)</h4>
                    <p class="text-slate-600">Trong chế độ <b>Thi nghiêm túc</b>, hệ thống sẽ theo dõi các hành vi chuyển tab, thu nhỏ trình duyệt, hoặc mở ứng dụng khác. Nếu bạn vi phạm quá 3 lần, bài thi sẽ tự động bị nộp.</p>
                </div>
                
                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-sky-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-keyboard text-sky-500 mr-2"></i>3. Gõ công thức Toán học</h4>
                    <p class="text-slate-600 mb-2">Đối với các câu hỏi Điền khuyết (Phần 3), bạn có thể sử dụng bàn phím Toán học tích hợp để nhập phân số, căn bậc hai, luỹ thừa,... một cách dễ dàng.</p>
                    <p class="text-slate-600">Bạn cũng có thể mở bảng nháp (Bảng trắng) tại biểu tượng góc trên bên phải để vẽ hình hoặc tính toán nháp.</p>
                </div>
            </div>
        `;
    } else if (tab === 'teacher') {
        content = `
            <h3 class="text-2xl font-black text-indigo-700 mb-6">Hướng dẫn dành cho Giáo viên</h3>
            
            <div class="space-y-6">
                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-indigo-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-wand-magic-sparkles text-indigo-500 mr-2"></i>1. Sinh đề tự động bằng AI</h4>
                    <p class="text-slate-600">Tại trang Quản trị, giáo viên có thể dán nội dung văn bản đề thi thô hoặc ảnh chụp đề thi. AI (Gemini) sẽ tự động nhận diện, bóc tách và định dạng lại thành cấu trúc JSON chuẩn của hệ thống cho cả 3 phần thi.</p>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-teal-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-cubes text-teal-500 mr-2"></i>2. Trộn đề từ Ngân hàng (Ma trận)</h4>
                    <p class="text-slate-600 mb-2">Tính năng <b>Ngân Hàng/Ma Trận</b> cho phép giáo viên thiết lập cấu trúc đề thi (ví dụ: 5 câu Nhận biết Khảo sát hàm số, 3 câu Thông hiểu Hình Oxyz). Hệ thống sẽ tự động bốc ngẫu nhiên các câu hỏi thỏa mãn từ Ngân hàng để tạo thành đề thi mới.</p>
                </div>
                
                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-orange-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-chart-simple text-orange-500 mr-2"></i>3. Tra cứu và Trích xuất điểm</h4>
                    <p class="text-slate-600">Tại tab <b>Quản Lý Điểm</b>, giáo viên có thể xem chi tiết điểm số của học sinh theo từng phần thi. Hỗ trợ lọc theo Lớp, Khối và cho phép xuất (Export CSV) báo cáo ra định dạng file Excel để thống kê.</p>
                </div>
            </div>
        `;
    } else if (tab === 'admin') {
        content = `
            <h3 class="text-2xl font-black text-rose-700 mb-6">Khu vực Quản trị (Super Admin)</h3>
            
            <div class="space-y-6">
                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-rose-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-user-shield text-rose-500 mr-2"></i>1. Phân quyền Giáo viên</h4>
                    <p class="text-slate-600">Super Admin (người có quyền cao nhất) có thể cấp quyền truy cập hệ thống Quản trị cho các giáo viên khác thông qua tính năng <b>Phân Quyền</b>. Chỉ những email được cấp quyền mới có thể xem và sửa đề thi.</p>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-violet-400">
                    <h4 class="font-bold text-lg text-slate-800 mb-2"><i class="fa-solid fa-users text-violet-500 mr-2"></i>2. Quản lý Học sinh</h4>
                    <p class="text-slate-600">Tại tab <b>Học Sinh</b>, quản trị viên có thể quản lý danh sách thí sinh dự thi. Tính năng <b>Import Nhanh</b> cho phép sao chép dữ liệu từ Excel (ID, Họ Tên, Lớp) và dán trực tiếp để tạo hàng loạt tài khoản. Mật khẩu khởi tạo sẽ mặc định là hungtbs.</p>
                </div>
            </div>
        `;
    }
    let area = document.getElementById('guide-content-area');
    if (area) area.innerHTML = `<div class="fade-in">${content}</div>`;
}

// Auto-initialize Portal App on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


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
        container.innerHTML = `
            <div class="text-center text-amber-400 py-12">
                <i class="fa-solid fa-gamepad fa-bounce text-4xl mb-3"></i>
                <div class="font-black text-sm uppercase tracking-wider text-white">Đang tải Đấu Trường Games...</div>
                <p class="text-xs text-indigo-300 mt-1">Đồng bộ kho trò chơi toán học TBS</p>
            </div>
        `;
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
                folder: 'TOAN 12',
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
                folder: 'TOAN 12',
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
                folder: 'TOAN 12',
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
                folder: 'TOAN 11',
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
        let quickLauncherHtml = `
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
        `;

        // Filter Pills
        const filterModes = [
            { id: 'ALL', label: 'Tất cả', icon: 'fa-cubes' },
            { id: 'millionaire', label: 'Triệu Phú', icon: 'fa-trophy', color: 'text-amber-400' },
            { id: 'speed_run', label: 'Tốc Độ', icon: 'fa-bolt', color: 'text-rose-400' },
            { id: 'boss_rush', label: 'Diệt Boss', icon: 'fa-dragon', color: 'text-purple-400' },
            { id: 'card_flip', label: 'Lật Thẻ', icon: 'fa-brain', color: 'text-emerald-400' }
        ];

        let filterPillsHtml = `
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5">
                ${filterModes.map(f => {
                    let isSel = (currentGamesFilterMode === f.id);
                    return `
                        <button onclick="loadGamesDrawer('${f.id}', null); playSound('click');" class="px-2.5 py-1 rounded-xl text-[11px] font-black transition flex items-center gap-1 shrink-0 ${isSel ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}">
                            <i class="fa-solid ${f.icon} ${f.color || ''}"></i>
                            <span>${f.label}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;

        // Search Bar
        let searchBarHtml = `
            <div class="relative mb-3">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                <input type="text" value="${currentGamesSearchQuery}" oninput="loadGamesDrawer(null, this.value)" placeholder="Tìm kiếm game, lớp, chủ đề..." class="w-full pl-8 pr-3 py-2 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-xs font-bold outline-none focus:border-amber-400 placeholder-slate-400">
                ${currentGamesSearchQuery ? `<button onclick="loadGamesDrawer(null, '');" class="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"><i class="fa-solid fa-xmark"></i></button>` : ''}
            </div>
        `;

        // Game Cards List
        let gamesListHtml = '';
        if (displayList.length === 0) {
            gamesListHtml = `
                <div class="text-center text-slate-400 py-10 bg-slate-800/40 rounded-2xl border border-slate-800">
                    <i class="fa-solid fa-ghost text-4xl mb-2 text-slate-600"></i>
                    <div class="font-bold text-xs text-slate-400">Không tìm thấy trò chơi phù hợp.</div>
                </div>
            `;
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

                return `
                    <div class="p-3.5 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border-2 border-slate-700/80 ${modeCfg.borderHover} transition-all duration-300 shadow-md group relative overflow-hidden flex flex-col justify-between gap-3">
                        <div>
                            <div class="flex items-start justify-between gap-2 mb-1.5">
                                <div class="flex items-center gap-2">
                                    <span class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-base shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                                        ${modeCfg.icon}
                                    </span>
                                    <div>
                                        <div class="font-black text-white text-xs leading-snug group-hover:text-amber-300 transition-colors">${g.name || 'Game Toán Học'}</div>
                                        <div class="flex items-center gap-1.5 mt-0.5">
                                            <span class="text-[9px] font-black uppercase px-2 py-0.2 rounded-md border ${modeCfg.badgeBg}">${modeCfg.title}</span>
                                            <span class="text-[9px] font-black uppercase px-2 py-0.2 rounded-md border ${getMathFolderBadgeClass(g.folder)}">${normalizeMathFolder(g.folder)}</span>
                                        </div>
                                    </div>
                                </div>
                                <span class="font-mono font-black text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2 py-0.5 rounded-lg text-[10px] tracking-wider shrink-0 shadow-2xs">
                                    ${g.code}
                                </span>
                            </div>

                            ${g.desc ? `<p class="text-[10px] text-slate-400 line-clamp-2 mt-1">${g.desc}</p>` : ''}
                        </div>

                        <div class="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[10px]">
                            <div class="text-slate-400 flex items-center gap-2">
                                <span><i class="fa-solid fa-list-ol text-amber-400 mr-1"></i>${g.questionCount || 15} câu</span>
                                <span>•</span>
                                <span>${g.date || 'Gần đây'}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="copyGameCode('${g.code}'); playSound('click');" class="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition shadow-2xs" title="Sao chép mã game">
                                    <i class="fa-solid fa-copy text-xs"></i>
                                </button>
                                <a href="student.html?code=${g.code}&game=${modeCfg.targetMode}" onclick="playSound('click');" class="px-3 py-1.5 ${modeCfg.actionBtnBg} font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition hover:scale-105 active:scale-95 flex items-center gap-1 btn-3d">
                                    <span>CHIẾN NGAY</span> <i class="fa-solid fa-play text-[10px]"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            ${quickLauncherHtml}
            ${searchBarHtml}
            ${filterPillsHtml}
            <div class="space-y-2.5">
                ${gamesListHtml}
            </div>
        `;

    } catch (err) {
        console.error("Error loading games drawer:", err);
        container.innerHTML = `
            <div class="text-center text-rose-400 py-10">
                <i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                <div class="font-bold text-xs">Lỗi tải danh mục game.</div>
            </div>
        `;
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
    window.location.href = `student.html?code=${targetCode}&game=${targetSubMode}`;
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
