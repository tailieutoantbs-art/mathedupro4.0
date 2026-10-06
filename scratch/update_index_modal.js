const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetMarker = '<!-- Modal Bảng Vàng Vinh Dự với 3D Podium -->';
const endMarker = '<!-- Modal Tạo Mới / Reset Bảng Vàng -->';

const startIndex = html.indexOf(targetMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Target markers not found in index.html');
    process.exit(1);
}

const replacement = `<!-- Modal Bảng Vàng Vinh Dự 3D & Phân Tích Năng Lực (Giai Đoạn 4) -->
    <div id="leaderboard-modal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[9999] hidden flex items-center justify-center p-3 md:p-6 fade-in">
        <div class="bg-white p-4 md:p-6 rounded-3xl w-full max-w-5xl relative shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-4 border-amber-300 zoom-in flex flex-col max-h-[94vh]">
            <!-- Top Controls -->
            <div class="absolute top-4 right-4 flex items-center gap-2 z-20">
                <button onclick="refreshLeaderboardData()" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition shadow-sm border border-amber-200" title="Làm mới dữ liệu"><i id="btn-refresh-lb-icon" class="fa-solid fa-arrows-rotate text-base"></i></button>
                <button onclick="openLeaderboardResetModal()" class="px-3.5 h-10 flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition shadow-sm text-xs font-black btn-3d" title="Tạo mới / Reset Đợt Bảng Vàng"><i class="fa-solid fa-wand-magic-sparkles text-sm"></i> <span class="hidden sm:inline">RESET ĐỢT THI</span></button>
                <button onclick="document.getElementById('leaderboard-modal').classList.add('hidden')" class="text-slate-400 hover:text-rose-500 text-2xl w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 shrink-0 transition"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Header Section -->
            <div class="text-center shrink-0 border-b border-slate-100 pb-3 mb-2 relative overflow-hidden rounded-2xl pt-1">
                <div class="relative z-10">
                    <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-widest mb-1 shadow-xs border border-amber-200">
                        <i class="fa-solid fa-trophy text-amber-600 animate-bounce"></i> HALL OF FAME 3D
                    </div>
                    <h3 class="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-wider font-display bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">BẢNG VÀNG VINH DỰ & CHẨN ĐOÁN NĂNG LỰC</h3>
                    
                    <!-- Main Tab Switcher: Podium vs Analytics -->
                    <div class="flex justify-center gap-2 mt-2 mb-2">
                        <button id="btn-lb-tab-podium" onclick="switchLeaderboardTab('podium')" class="px-4 py-1.5 rounded-xl text-xs font-black bg-amber-500 text-white shadow-md transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-ranking-star"></i> Bảng Vàng 3D
                        </button>
                        <button id="btn-lb-tab-analytics" onclick="switchLeaderboardTab('analytics')" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-chart-pie"></i> Phân Tích Năng Lực
                        </button>
                    </div>

                    <!-- Filters Bar (Cycle, Time, Exam Code & Game Mode) -->
                    <div class="flex justify-center flex-wrap gap-1.5 items-center mt-1">
                        <!-- Code filter -->
                        <select id="leaderboard-code-filter" onchange="fetchLeaderboard(); playSound('click');" class="px-3 py-1 rounded-xl text-xs font-black bg-white text-slate-700 border-2 border-amber-300 outline-none shadow-sm cursor-pointer hover:border-amber-400 transition">
                            <option value="ALL">🎯 Tất cả Mã Đề</option>
                        </select>

                        <!-- Game Mode Selector (Giai đoạn 4) -->
                        <select id="leaderboard-mode-filter" onchange="setLeaderboardGameMode(this.value); playSound('click');" class="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border-2 border-emerald-300 outline-none shadow-sm cursor-pointer hover:border-emerald-400 transition">
                            <option value="ALL">🎮 Tất cả Chế độ</option>
                            <option value="standard">🎓 Đề Chuẩn 3 Phần</option>
                            <option value="millionaire">💰 Ai Là Triệu Phú</option>
                            <option value="speed">⚡ Đua Tốc Độ (60s)</option>
                            <option value="boss">🛡️ Vượt Ải Diệt Boss</option>
                            <option value="memory">🃏 Lật Thẻ Trí Nhớ</option>
                        </select>

                        <!-- Time filters -->
                        <button id="btn-lb-cycle" onclick="setLeaderboardFilter('cycle'); playSound('click');" class="px-3 py-1 rounded-xl text-xs font-black bg-amber-500 text-white shadow-md transition-all"><i class="fa-solid fa-fire mr-1"></i>Đợt này</button>
                        <button id="btn-lb-week" onclick="setLeaderboardFilter('week'); playSound('click');" class="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Tuần này</button>
                        <button id="btn-lb-month" onclick="setLeaderboardFilter('month'); playSound('click');" class="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Tháng này</button>
                        <button id="btn-lb-all" onclick="setLeaderboardFilter('all'); playSound('click');" class="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Tất cả</button>
                    </div>
                </div>
            </div>

            <!-- Content Panel: 3D Podium vs Analytics View -->
            <div class="flex-grow overflow-y-auto admin-scroll pr-1 relative bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 shadow-inner min-h-[360px]">
                <div id="leaderboard-loading" class="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center rounded-2xl"><i class="fa-solid fa-spinner fa-spin text-4xl text-amber-500 mb-2"></i><span class="font-bold text-slate-600 text-sm">Đang tải bảng vàng...</span></div>
                
                <!-- 1. PODIUM & RANKINGS VIEW -->
                <div id="leaderboard-podium-view">
                    <!-- 3D Podium Area -->
                    <div id="leaderboard-podium" class="mb-4 pt-3 pb-2"></div>
                    
                    <!-- Runner-ups List -->
                    <div id="leaderboard-list" class="space-y-2 pb-2"></div>
                </div>

                <!-- 2. LEARNING ANALYTICS & DIAGNOSTICS VIEW (GIAI ĐOẠN 4) -->
                <div id="leaderboard-analytics-view" class="hidden space-y-4">
                    <!-- Dynamic Analytics Rendered via portal.js -->
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Xuất Giấy Chứng Nhận Vinh Danh 3D (Honor Certificate Modal) -->
    <div id="honor-cert-modal" class="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-[10005] hidden flex items-center justify-center p-3 md:p-6 fade-in">
        <div class="bg-white p-5 md:p-6 rounded-3xl w-full max-w-2xl relative shadow-2xl border-4 border-amber-400 zoom-in flex flex-col items-center text-center">
            <button onclick="document.getElementById('honor-cert-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 transition"><i class="fa-solid fa-xmark"></i></button>
            
            <h3 class="text-xl md:text-2xl font-black text-amber-900 uppercase tracking-wide font-display mb-1 flex items-center gap-2">
                <i class="fa-solid fa-certificate text-amber-500"></i> GIẤY VINH DANH DANH DỰ 3D
            </h3>
            <p class="text-xs text-slate-500 font-bold mb-4">Chứng nhận thành tích xuất sắc tại Hệ sinh thái EduMath TBS</p>

            <!-- Certificate Canvas Preview -->
            <div class="w-full overflow-hidden rounded-2xl border-2 border-amber-200 shadow-xl bg-amber-50 flex items-center justify-center p-2 mb-4">
                <canvas id="honor-cert-canvas" width="800" height="560" class="w-full max-w-[640px] h-auto rounded-xl shadow-md"></canvas>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 w-full max-w-md">
                <button onclick="downloadHonorCertificate()" class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl shadow-lg transition text-sm btn-3d flex items-center justify-center gap-2">
                    <i class="fa-solid fa-download"></i> Tải Ảnh Chứng Nhận (.PNG)
                </button>
                <button onclick="document.getElementById('honor-cert-modal').classList.add('hidden')" class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-sm">
                    Đóng
                </button>
            </div>
        </div>
    </div>\n\n`;

html = html.substring(0, startIndex) + replacement + html.substring(endIndex);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html with Phase 4 Leaderboard & Analytics!');
