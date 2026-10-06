const fs = require('fs');
const path = require('path');

// 1. Update teacher.html
const teacherHtmlPath = path.join(__dirname, '..', 'teacher.html');
let teacherHtml = fs.readFileSync(teacherHtmlPath, 'utf8');

const exportTargetUiHtml = `                <!-- Mục đích xuất bản: Đề Thi vs Game Đấu Trường -->
                <div class="mb-3 p-3 bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 rounded-2xl border-2 border-indigo-200">
                    <label class="text-xs font-black text-indigo-900 uppercase flex items-center justify-between mb-2">
                        <span><i class="fa-solid fa-shapes mr-1.5 text-indigo-600"></i> Mục đích xuất bản lên Cloud:</span>
                        <span id="export-publish-target-badge" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">Kho Đề Thi</span>
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center gap-2 p-2 bg-white rounded-xl border-2 border-indigo-300 cursor-pointer hover:border-indigo-500 transition shadow-2xs">
                            <input type="radio" name="exportPublishTarget" value="exam" checked onchange="updatePublishTargetUI(this.value)" class="w-4 h-4 text-indigo-600">
                            <div class="text-left leading-tight">
                                <b class="text-xs text-indigo-950 block">📄 Đề Thi Chuẩn</b>
                                <span class="text-[10px] text-slate-500">Lưu vào Tab Đề Thi</span>
                            </div>
                        </label>
                        <label class="flex items-center gap-2 p-2 bg-white rounded-xl border-2 border-amber-300 cursor-pointer hover:border-amber-500 transition shadow-2xs">
                            <input type="radio" name="exportPublishTarget" value="game" onchange="updatePublishTargetUI(this.value)" class="w-4 h-4 text-amber-600">
                            <div class="text-left leading-tight">
                                <b class="text-xs text-amber-900 block">🎮 Game Đấu Trường</b>
                                <span class="text-[10px] text-amber-600 font-bold">Lưu vào Tab Games</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">`;

const oldTargetInTeacherHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">`;

if (teacherHtml.includes(oldTargetInTeacherHtml) && !teacherHtml.includes('name="exportPublishTarget"')) {
    teacherHtml = teacherHtml.replace(oldTargetInTeacherHtml, exportTargetUiHtml);
    fs.writeFileSync(teacherHtmlPath, teacherHtml, 'utf8');
    console.log('Successfully updated teacher.html with export target switcher!');
} else {
    console.log('exportPublishTarget already exists or target pattern not found in teacher.html');
}

// 2. Update teacher.js
const teacherJsPath = path.join(__dirname, '..', 'js', 'teacher.js');
let teacherJs = fs.readFileSync(teacherJsPath, 'utf8');

// Replace exportGame online metadata logic
const oldExportMetadataPattern = /let settings = \{ examMode: examModeValOnline, experienceMode: expModeOnline[\s\S]*?await db\.collection\("AdminHistory"\)\.doc\(code\)\.set\(metadata\);/;

const newExportMetadataCode = `let publishTarget = document.querySelector('input[name="exportPublishTarget"]:checked')?.value || (expModeOnline.startsWith('game_') ? 'game' : 'exam');
                let isGame = (publishTarget === 'game' || expModeOnline.startsWith('game_'));
                let totalQ = (GAME_DATA.round1?.length || 0) + (GAME_DATA.round2?.length || 0) + (GAME_DATA.round3?.length || 0);

                let settings = { 
                    examMode: examModeValOnline, 
                    experienceMode: expModeOnline, 
                    defaultLanguage: defaultLangOnline, 
                    name: name, 
                    folder: document.getElementById('export-exam-folder').value.trim() || 'Chung', 
                    timeLimit: parseInt(document.getElementById('export-time-limit').value) || 60, 
                    password: document.getElementById('export-exam-password').value.trim(), 
                    openTime: document.getElementById('export-open-time').value ? new Date(document.getElementById('export-open-time').value).toISOString() : null, 
                    closeTime: document.getElementById('export-close-time').value ? new Date(document.getElementById('export-close-time').value).toISOString() : null, 
                    author: userEmail,
                    isGame: isGame,
                    gameMode: isGame ? expModeOnline : null
                };
                await db.collection("SharedGames").doc(code).set({ data: GAME_DATA, settings: settings, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                
                let metadata = { 
                    code: code, 
                    name: name, 
                    folder: settings.folder, 
                    author: userEmail, 
                    date: new Date().toLocaleDateString('vi-VN'), 
                    createdAt: Date.now(),
                    isGame: isGame,
                    type: isGame ? 'game' : 'exam',
                    gameMode: isGame ? expModeOnline : 'practice',
                    questionCount: totalQ
                };
                await db.collection("AdminHistory").doc(code).set(metadata);
                if (isGame) {
                    try {
                        await db.collection("GamesHistory").doc(code).set(metadata);
                        let ghDoc = await db.collection("GameData").doc("GamesHistory").get();
                        let gList = (ghDoc.exists && ghDoc.data().list) ? ghDoc.data().list : [];
                        gList = gList.filter(g => g.code !== code);
                        gList.unshift(metadata);
                        await db.collection("GameData").doc("GamesHistory").set({ list: gList });
                    } catch(e){}
                    try {
                        let localGames = JSON.parse(localStorage.getItem('tbs_saved_games') || '[]');
                        localGames = localGames.filter(g => g.code !== code);
                        localGames.unshift(metadata);
                        localStorage.setItem('tbs_saved_games', JSON.stringify(localGames));
                    } catch(e){}
                }`;

if (oldExportMetadataPattern.test(teacherJs)) {
    teacherJs = teacherJs.replace(oldExportMetadataPattern, newExportMetadataCode);
    console.log('Successfully updated teacher.js exportGame with Game saving!');
} else {
    console.error('Could not find export metadata pattern in teacher.js');
}

// Add updatePublishTargetUI helper in teacher.js if not present
if (!teacherJs.includes('function updatePublishTargetUI(')) {
    const helperCode = `
function updatePublishTargetUI(val) {
    let badge = document.getElementById('export-publish-target-badge');
    let expSel = document.getElementById('export-experience-mode');
    let nameInput = document.getElementById('export-exam-name');
    if (val === 'game') {
        if (badge) {
            badge.innerText = 'Kho Games Hamburger';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-2xs';
        }
        if (expSel && (expSel.value === 'exam' || expSel.value === 'practice_all')) {
            expSel.value = 'game_millionaire';
        }
        if (nameInput && !nameInput.value) {
            nameInput.placeholder = 'Ví dụ: Đấu Trường Triệu Phú - Khảo Sát Hàm Số...';
        }
    } else {
        if (badge) {
            badge.innerText = 'Kho Đề Thi';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs';
        }
        if (nameInput && !nameInput.value) {
            nameInput.placeholder = 'Ví dụ: Kiểm tra học kỳ I...';
        }
    }
}
window.updatePublishTargetUI = updatePublishTargetUI;
`;
    teacherJs += helperCode;
    console.log('Appended updatePublishTargetUI to teacher.js');
}

fs.writeFileSync(teacherJsPath, teacherJs, 'utf8');
console.log('Finished updating teacher.js!');
