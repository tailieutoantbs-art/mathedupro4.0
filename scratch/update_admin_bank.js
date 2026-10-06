const fs = require('fs');
const path = require('path');

const teacherJsPath = path.join(__dirname, '..', 'js', 'teacher.js');
let teacherJs = fs.readFileSync(teacherJsPath, 'utf8');

const targetSnippet = `        async function renderAdminBank(contentArea, filterFolder = 'ALL', skipFetch = false) { 
            if (!contentArea) contentArea = document.getElementById('admin-content-area'); 
            currentBankFolderFilter = filterFolder;
            if (!skipFetch && (filterFolder === 'ALL' || currentAdminBankData.length === 0)) { 
                contentArea.innerHTML = '<div class="flex items-center justify-center h-full text-sky-500 font-bold text-xl"><i class="fa-solid fa-spinner fa-spin mr-3 text-4xl"></i> Đang tải kho đề Cloud...</div>'; 
                try { 
                    let snap = await db.collection("AdminHistory").orderBy('createdAt', 'desc').get(); 
                    let newHist = []; 
                    snap.forEach(doc => newHist.push(doc.data())); 
                    let d = await db.collection("GameData").doc("AdminHistory").get(); 
                    let oldHist = d.exists ? d.data().list : []; 
                    let allHist = [...newHist, ...oldHist]; 
                    let uniqueHist = []; 
                    let seen = new Set(); 
                    for (let h of allHist) { 
                        if(!seen.has(h.code)) { 
                            seen.add(h.code); 
                            uniqueHist.push(h); 
                        } 
                    } 
                    currentAdminBankData = uniqueHist; 
                } catch(e) { 
                    currentAdminBankData = JSON.parse(localStorage.getItem('math12ExportHistory')||'[]'); 
                } 
            } 
            if(currentAdminBankData.length === 0) { 
                contentArea.innerHTML = \`<div class="text-center text-slate-400 mt-20 font-bold text-lg"><i class="fa-solid fa-cloud-arrow-down text-5xl mb-4"></i><br>Hệ thống Cloud chưa có đề lưu trữ.</div>\`; 
                return; 
            } 
            let folders = [...new Set(currentAdminBankData.map(h => h.folder || 'Chung'))]; 
            let filterHtml = \`<select onchange="renderAdminBank(null, this.value)" class="ml-4 p-2 border-2 border-sky-200 rounded-xl text-sm bg-white font-black text-sky-700 outline-none shadow-sm"><option value="ALL">Tất Cả Danh Mục</option>\` + folders.map(f => \`<option value="\${f}" \${f === filterFolder ? 'selected' : ''}>\${f}</option>\`).join('') + \`</select>\`; 
            let filteredData = filterFolder === 'ALL' ? currentAdminBankData : currentAdminBankData.filter(h => (h.folder || 'Chung') === filterFolder); 
            let isSuperGlobal = isCurrentUserSuperAdmin(); 
            let allSelected = filteredData.length > 0 && filteredData.every(h => selectedExamCodes.has(h.code));`;

const newAdminBankCode = `        let currentBankTypeFilter = 'ALL'; // 'ALL', 'EXAMS', 'GAMES'

        async function renderAdminBank(contentArea, filterFolder = 'ALL', skipFetch = false, filterType = null) { 
            if (!contentArea) contentArea = document.getElementById('admin-content-area'); 
            currentBankFolderFilter = filterFolder;
            if (filterType !== null) currentBankTypeFilter = filterType;

            if (!skipFetch && (filterFolder === 'ALL' || currentAdminBankData.length === 0)) { 
                contentArea.innerHTML = '<div class="flex items-center justify-center h-full text-sky-500 font-bold text-xl"><i class="fa-solid fa-spinner fa-spin mr-3 text-4xl"></i> Đang tải kho đề & game Cloud...</div>'; 
                try { 
                    let snap = await db.collection("AdminHistory").orderBy('createdAt', 'desc').get(); 
                    let newHist = []; 
                    snap.forEach(doc => newHist.push(doc.data())); 
                    let d = await db.collection("GameData").doc("AdminHistory").get(); 
                    let oldHist = d.exists ? d.data().list : []; 

                    // Also fetch GamesHistory
                    let gamesHist = [];
                    try {
                        let gSnap = await db.collection("GamesHistory").orderBy('createdAt', 'desc').get();
                        gSnap.forEach(doc => gamesHist.push(doc.data()));
                        let gDoc = await db.collection("GameData").doc("GamesHistory").get();
                        if (gDoc.exists && gDoc.data().list) gamesHist.push(...gDoc.data().list);
                    } catch(e){}

                    let allHist = [...gamesHist, ...newHist, ...oldHist]; 
                    let uniqueHist = []; 
                    let seen = new Set(); 
                    for (let h of allHist) { 
                        if(!seen.has(h.code)) { 
                            seen.add(h.code); 
                            uniqueHist.push(h); 
                        } 
                    } 
                    currentAdminBankData = uniqueHist; 
                } catch(e) { 
                    currentAdminBankData = JSON.parse(localStorage.getItem('math12ExportHistory')||'[]'); 
                } 
            } 
            if(currentAdminBankData.length === 0) { 
                contentArea.innerHTML = \`<div class="text-center text-slate-400 mt-20 font-bold text-lg"><i class="fa-solid fa-cloud-arrow-down text-5xl mb-4"></i><br>Hệ thống Cloud chưa có đề hoặc game lưu trữ.</div>\`; 
                return; 
            } 
            let folders = [...new Set(currentAdminBankData.map(h => h.folder || 'Chung'))]; 
            let filterHtml = \`<select onchange="renderAdminBank(null, this.value, true)" class="ml-2 p-2 border-2 border-sky-200 rounded-xl text-xs bg-white font-black text-sky-700 outline-none shadow-sm"><option value="ALL">Tất Cả Thư Mục</option>\` + folders.map(f => \`<option value="\${f}" \${f === filterFolder ? 'selected' : ''}>\${f}</option>\`).join('') + \`</select>\`; 
            
            let filteredData = currentAdminBankData.filter(h => {
                if (filterFolder !== 'ALL' && (h.folder || 'Chung') !== filterFolder) return false;
                let isGameItem = (h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_')));
                if (currentBankTypeFilter === 'EXAMS' && isGameItem) return false;
                if (currentBankTypeFilter === 'GAMES' && !isGameItem) return false;
                return true;
            });

            let totalExamsCount = currentAdminBankData.filter(h => !(h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_')))).length;
            let totalGamesCount = currentAdminBankData.filter(h => (h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_')))).length;

            let isSuperGlobal = isCurrentUserSuperAdmin(); 
            let allSelected = filteredData.length > 0 && filteredData.every(h => selectedExamCodes.has(h.code));`;

// Normalize and replace
const normalize = s => s.replace(/\\r\\n/g, '\\n');
if (normalize(teacherJs).includes(normalize(targetSnippet))) {
    teacherJs = normalize(teacherJs).replace(normalize(targetSnippet), newAdminBankCode);
    console.log('Replaced admin bank filter logic in teacher.js');
} else {
    console.error('Target snippet for renderAdminBank not matched directly in teacher.js');
}

// Now replace individual item rendering in renderAdminBank to show game badges and quick launch button
const oldBankItemCode = `                    <div class="flex items-center gap-4">
                        <span class="font-black text-2xl text-slate-700 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-200 shadow-inner tracking-widest">\${h.code}</span>
                        <div class="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300">`;

const newBankItemCode = `                    <div class="flex items-center gap-4">
                        \${(h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_'))) 
                            ? \`<span class="text-[11px] font-black uppercase px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 border border-amber-300 shadow-2xs flex items-center gap-1"><i class="fa-solid fa-gamepad"></i> GAME</span>\` 
                            : \`<span class="text-[11px] font-black uppercase px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs flex items-center gap-1"><i class="fa-solid fa-file-lines"></i> ĐỀ THI</span>\`}
                        <span class="font-black text-2xl text-slate-700 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-200 shadow-inner tracking-widest">\${h.code}</span>
                        <div class="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300">
                            <a href="student.html?code=\${h.code}\${(h.type==='game'||h.isGame)?'&game='+(h.gameMode||'millionaire'):''}" target="_blank" class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm transition btn-3d flex items-center justify-center" title="Chạy Thử"><i class="fa-solid fa-play"></i></a>`;

if (normalize(teacherJs).includes(normalize(oldBankItemCode))) {
    teacherJs = normalize(teacherJs).replace(normalize(oldBankItemCode), newBankItemCode);
    console.log('Replaced bank item code in teacher.js');
}

// Add the filter buttons UI in admin content area
const oldHeaderInBank = `<h3 class="font-black text-2xl text-slate-800 uppercase tracking-widest flex items-center"><i class="fa-solid fa-cloud-arrow-down text-sky-500 mr-2"></i> Kho Lưu Trữ Đám Mây \${filterHtml}</h3>`;
const newHeaderInBank = `<div class="flex flex-col gap-2">
                            <div class="flex items-center flex-wrap gap-2">
                                <h3 class="font-black text-2xl text-slate-800 uppercase tracking-widest flex items-center"><i class="fa-solid fa-cloud-arrow-down text-sky-500 mr-2"></i> Kho Cloud \${filterHtml}</h3>
                            </div>
                            <div class="flex items-center gap-2 mt-1">
                                <button onclick="renderAdminBank(null, currentBankFolderFilter, true, 'ALL')" class="px-3 py-1 rounded-xl text-xs font-black transition \${currentBankTypeFilter==='ALL'?'bg-indigo-600 text-white shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    Tất cả (\${currentAdminBankData.length})
                                </button>
                                <button onclick="renderAdminBank(null, currentBankFolderFilter, true, 'EXAMS')" class="px-3 py-1 rounded-xl text-xs font-black transition \${currentBankTypeFilter==='EXAMS'?'bg-sky-600 text-white shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    📄 Đề Thi (\${totalExamsCount})
                                </button>
                                <button onclick="renderAdminBank(null, currentBankFolderFilter, true, 'GAMES')" class="px-3 py-1 rounded-xl text-xs font-black transition \${currentBankTypeFilter==='GAMES'?'bg-amber-500 text-slate-950 shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    🎮 Games (\${totalGamesCount})
                                </button>
                            </div>
                        </div>`;

if (normalize(teacherJs).includes(normalize(oldHeaderInBank))) {
    teacherJs = normalize(teacherJs).replace(normalize(oldHeaderInBank), newHeaderInBank);
    console.log('Replaced bank header in teacher.js');
}

fs.writeFileSync(teacherJsPath, teacherJs, 'utf8');
console.log('Successfully saved teacher.js updates for admin bank!');
