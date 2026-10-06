const fs = require('fs');

let html = fs.readFileSync('teacher.html', 'utf8');

const target = `<div class="grid grid-cols-2 gap-2 text-xs font-bold">
                                    <button type="button" id="btn-ai-mode-formal" onclick="setAiPromptMode('formal')" class="py-2 px-2.5 rounded-xl border border-purple-500 bg-purple-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition">
                                        <i class="fa-solid fa-graduation-cap"></i> Thi nghiêm túc (7991)
                                    </button>
                                    <button type="button" id="btn-ai-mode-practice" onclick="setAiPromptMode('practice')" class="py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1.5 transition">
                                        <i class="fa-solid fa-pen-ruler text-amber-500"></i> Luyện tập (Nhanh)
                                    </button>
                                </div>
                                <p id="ai-mode-desc" class="text-[11px] text-slate-500 mt-2 font-medium">🎓 <b>Thi nghiêm túc</b>: Sinh đầy đủ Ma trận, Bảng đặc tả, Đề thi 3 phần (kèm metadata mức độ), Đáp án & Lời giải chi tiết theo CV 7991.</p>`;

const replacement = `<div class="grid grid-cols-3 gap-2 text-xs font-bold">
                                    <button type="button" id="btn-ai-mode-formal" onclick="setAiPromptMode('formal')" class="py-2 px-1 rounded-xl border border-purple-500 bg-purple-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center">
                                        <i class="fa-solid fa-graduation-cap"></i> <span>Chuẩn 7991</span>
                                    </button>
                                    <button type="button" id="btn-ai-mode-practice" onclick="setAiPromptMode('practice')" class="py-2 px-1 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1 transition text-center">
                                        <i class="fa-solid fa-pen-ruler text-amber-500"></i> <span>Luyện tập</span>
                                    </button>
                                    <button type="button" id="btn-ai-mode-game" onclick="setAiPromptMode('game')" class="py-2 px-1 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1 transition text-center">
                                        <i class="fa-solid fa-gamepad text-emerald-500"></i> <span>Đấu Trường</span>
                                    </button>
                                </div>
                                <div id="ai-game-type-container" class="mt-2.5 p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 hidden">
                                    <label class="text-[11px] font-black text-emerald-900 block mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-trophy text-amber-500"></i> Chọn Thể Loại Game Muốn Sinh:
                                    </label>
                                    <select id="ai-game-type-select" onchange="generateAiPrompt()" class="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 shadow-2xs cursor-pointer">
                                        <option value="all">🌟 Tối ưu Toàn diện (Chơi hoàn hảo cả 4 Game)</option>
                                        <option value="millionaire">🏆 Ai Là Triệu Phú (15 Mốc leo thang, kèm gợi ý 50:50)</option>
                                        <option value="speedrun">⚡ Đua Tốc Độ 60s (Nhẩm nhanh 5-10s, đọc BBT & Đồ thị thần tốc)</option>
                                        <option value="boss">⚔️ Vượt Ải Diệt Boss (3 Ải RPG: Tiểu quái ➔ Hộ vệ ➔ Hắc long)</option>
                                        <option value="cardflip">🃏 Lật Thẻ 3D Trí Nhớ (Cặp công thức & kết quả)</option>
                                    </select>
                                </div>
                                <p id="ai-mode-desc" class="text-[11px] text-slate-500 mt-2 font-medium">🎓 <b>Thi nghiêm túc</b>: Sinh đầy đủ Ma trận, Bảng đặc tả, Đề thi 3 phần (kèm metadata mức độ), Đáp án & Lời giải chi tiết theo CV 7991.</p>`;

// Normalize newlines for matching
const normHtml = html.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');

if (normHtml.includes(normTarget)) {
  const updated = normHtml.replace(normTarget, replacement);
  fs.writeFileSync('teacher.html', updated, 'utf8');
  console.log('Successfully updated teacher.html with Game Mode buttons!');
} else {
  console.error('Target not found in teacher.html');
}
