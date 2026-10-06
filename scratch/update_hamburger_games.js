const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace the practice drawer in index.html
const oldDrawerPattern = /<!-- Off-canvas drawer for Practice Exams & Infographics -->[\s\S]*?<!-- Tab 2: Infographics Content -->[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newDrawerHtml = `<!-- Off-canvas drawer for Practice Exams, Math Games & Infographics -->
    <div id="practice-drawer-overlay" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[10010] hidden transition-opacity" onclick="togglePracticeMenu(event)"></div>
    <div id="practice-drawer" class="fixed top-0 left-0 h-full w-[430px] max-w-[94vw] bg-white z-[10011] shadow-2xl transform -translate-x-full transition-transform duration-300 ease-in-out flex flex-col">
        <!-- Drawer Header with 3 Tabs -->
        <div class="p-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/90 via-amber-50/50 to-white shrink-0">
            <div class="flex items-center gap-1 p-1 bg-white/95 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto max-w-[340px] sm:max-w-none">
                <button id="drawer-tab-exams" onclick="switchDrawerTab('exams'); playSound('click');" class="px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-xs shrink-0">
                    <i class="fa-solid fa-book-journal-whills text-[11px]"></i> <span>Đề Thi</span>
                </button>
                <button id="drawer-tab-games" onclick="switchDrawerTab('games'); playSound('click');" class="px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 shrink-0 relative">
                    <i class="fa-solid fa-gamepad text-amber-500 text-[12px]"></i> <span>Games Toán</span>
                    <span class="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse shadow-2xs">HOT</span>
                </button>
                <button id="drawer-tab-infographics" onclick="switchDrawerTab('infographics'); playSound('click');" class="px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 shrink-0">
                    <i class="fa-solid fa-layer-group text-sky-500 text-[11px]"></i> <span>Infographic</span>
                </button>
            </div>
            <button onclick="togglePracticeMenu(event)" class="text-slate-400 hover:text-rose-500 transition w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-200"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
        
        <!-- Tab 1: Practice Exams Content -->
        <div id="practice-drawer-content" class="flex-grow overflow-y-auto admin-scroll p-3.5 space-y-3.5 bg-slate-50">
            <div class="text-center text-slate-400 mt-10"><i class="fa-solid fa-spinner fa-spin text-3xl mb-2 text-indigo-500"></i><br><b class="text-slate-500 text-xs">Đang tải danh sách đề thi...</b></div>
        </div>

        <!-- Tab 2: Math Games Arena Content (Tách riêng) -->
        <div id="games-drawer-content" class="flex-grow overflow-y-auto admin-scroll p-3.5 space-y-3.5 bg-slate-900 hidden">
            <!-- Rendered dynamically by portal.js -->
        </div>

        <!-- Tab 3: Infographics Content -->
        <div id="infographics-drawer-content" class="flex-grow overflow-y-auto admin-scroll p-3.5 space-y-3 bg-slate-50 hidden">
            <!-- Rendered by portal.js -->
        </div>
    </div>`;

if (oldDrawerPattern.test(indexHtml)) {
    indexHtml = indexHtml.replace(oldDrawerPattern, newDrawerHtml);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log('Successfully updated index.html drawer!');
} else {
    console.error('Drawer pattern not matched in index.html');
}
