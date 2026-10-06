const fs = require('fs');

const teacherContent = fs.readFileSync('js/teacher.js', 'utf8');
const template1 = fs.readFileSync('scratch/prompt1_template.txt', 'utf8');
const template2 = fs.readFileSync('scratch/prompt2_template.txt', 'utf8');

const idxSetMode = teacherContent.indexOf('function setAiPromptMode');
const idxEnd = teacherContent.indexOf('function handleAiImageScanUpload');

console.log('idxSetMode:', idxSetMode, 'idxEnd:', idxEnd);

if (idxSetMode === -1 || idxEnd === -1) {
  console.error('Indices not found!');
  process.exit(1);
}

const replacement = `function setAiPromptMode(mode) {
    window.aiPromptMode = mode;
    let btnFormal = document.getElementById('btn-ai-mode-formal');
    let btnPractice = document.getElementById('btn-ai-mode-practice');
    let btnGame = document.getElementById('btn-ai-mode-game');
    let modeLabel = document.getElementById('ai-prompt-mode-label');
    let modeDesc = document.getElementById('ai-mode-desc');
    let gameContainer = document.getElementById('ai-game-type-container');

    const inactiveCls = "py-2 px-1 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1 transition text-center";
    if (btnFormal) btnFormal.className = inactiveCls;
    if (btnPractice) btnPractice.className = inactiveCls;
    if (btnGame) btnGame.className = inactiveCls;

    if (mode === 'formal') {
        if (btnFormal) btnFormal.className = "py-2 px-1 rounded-xl border border-purple-500 bg-purple-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center";
        if (modeLabel) {
            modeLabel.className = "text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold";
            modeLabel.textContent = "Chuẩn CV 7991";
        }
        if (modeDesc) {
            modeDesc.innerHTML = '🎓 <b>Thi nghiêm túc</b>: Sinh đầy đủ Ma trận, Bảng đặc tả, Đề thi 3 phần (kèm metadata mức độ), Đáp án & Lời giải chi tiết theo CV 7991.';
        }
        if (gameContainer) gameContainer.classList.add('hidden');
    } else if (mode === 'game') {
        if (btnGame) btnGame.className = "py-2 px-1 rounded-xl border border-emerald-500 bg-emerald-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center";
        if (modeLabel) {
            modeLabel.className = "text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold";
            modeLabel.textContent = "🎮 Đấu Trường Games";
        }
        if (modeDesc) {
            modeDesc.innerHTML = '🎮 <b>Đấu Trường Games Toán Học</b>: Thiết kế 15 câu trắc nghiệm leo thang 3 chặng, tính nhẩm phản xạ, diệt Boss RPG và lật thẻ 3D, kèm gợi ý 50:50 và trực quan hóa BBT/Đồ thị.';
        }
        if (gameContainer) gameContainer.classList.remove('hidden');
    } else {
        if (btnPractice) btnPractice.className = "py-2 px-1 rounded-xl border border-amber-500 bg-amber-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center";
        if (modeLabel) {
            modeLabel.className = "text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold";
            modeLabel.textContent = "Luyện tập (Nhanh)";
        }
        if (modeDesc) {
            modeDesc.innerHTML = '⚡ <b>Luyện tập (Nhanh)</b>: Sinh nhanh câu hỏi trắc nghiệm kèm giải thích ngắn gọn, tối ưu tốc độ và không yêu cầu lập Ma trận / Bảng đặc tả phức tạp.';
        }
        if (gameContainer) gameContainer.classList.add('hidden');
    }

    if (typeof generateAiPrompt === 'function') {
        generateAiPrompt();
    }
}
window.setAiPromptMode = setAiPromptMode;

function generateAiPrompt() {
    try {
        let grade = document.getElementById('ai-prompt-grade')?.value || '12';
        let lang = document.getElementById('ai-prompt-lang')?.value || 'vi';
        let mode = window.aiPromptMode || 'formal';

        // Lấy chủ đề đã chọn
        let topicList = [];
        if (Array.isArray(window.selectedAiTopics) && window.selectedAiTopics.length > 0) {
            topicList = [...window.selectedAiTopics];
        }
        let customTopic = document.getElementById('ai-prompt-topic-custom')?.value?.trim();
        if (customTopic) {
            topicList.push(customTopic);
        }
        if (topicList.length === 0) {
            let selectTopic = document.getElementById('ai-prompt-topic-select')?.value?.trim();
            if (selectTopic) topicList.push(selectTopic);
        }
        let finalTopic = topicList.length > 0 ? topicList.join('; ') : ("Chương trình môn Toán Lớp " + grade + " (GDPT 2018)");

        // Ngôn ngữ
        let langDesc = "Tiếng Việt chuẩn mực sư phạm toán học";
        let bilingualInstructions = "";
        if (lang === 'en') {
            langDesc = "Tiếng Anh (English - High School Math Terminology)";
        } else if (lang === 'bi') {
            langDesc = "Song ngữ Việt - Anh (Bilingual Vietnamese - English)";
            bilingualInstructions = "\\n- YÊU CẦU SONG NGỮ BẮT BUỘC: Mỗi câu hỏi, từng phương án lựa chọn và lời giải chi tiết đều phải có 2 dòng song song: Dòng 1 tiếng Việt, Dòng 2 tiếng Anh (in nghiêng hoặc mở ngoặc).";
        }

        // Tài liệu nguồn (nếu giáo viên dán văn bản / scan tài liệu)
        let sourceText = document.getElementById('ai-source-text')?.value?.trim();
        let sourceBlock = "";
        if (sourceText) {
            sourceBlock = \`\\n══════════════════════════════════════════════════════════════════════════════\\nTÀI LIỆU NGUỒN CUNG CẤP TỪ GIÁO VIÊN (BÁM SÁT ĐỂ BIÊN SOẠN):\\n══════════════════════════════════════════════════════════════════════════════\\n\` + sourceText + \`\\n\`;
        }

        let finalPrompt = "";

        if (mode === 'game') {
            // PROMPT 2: ĐẤU TRƯỜNG GAMES TOÁN HỌC
            let gameType = document.getElementById('ai-game-type-select')?.value || 'all';
            let gameTargetDesc = "Đấu trường Game Toán học tổng hợp (Chơi tốt cả 4 Game)";
            let gameSpecificRules = "";

            if (gameType === 'millionaire') {
                gameTargetDesc = "Đấu trường Ai Là Triệu Phú (15 Mốc bậc thang thưởng)";
                gameSpecificRules = \`★ YÊU CẦU CHUYÊN BIỆT CHO AI LÀ TRIỆU PHÚ:
- Đúng 15 câu hỏi leo thang độ khó qua 3 chặng mốc an toàn:
  + Chặng 1 (Câu 1-5, Mốc 5): Nhận biết công thức cơ bản, tính nhẩm nhanh.
  + Chặng 2 (Câu 6-10, Mốc 10): Thông hiểu, đọc đồ thị & BBT, giải bài toán 1-2 bước.
  + Chặng 3 (Câu 11-15, Mốc 15 Triệu Phú): Vận dụng cao, tham số m, cực trị hàm hợp, hình không gian phân loại sắc bén.
- BẮT BUỘC có trường "hint": Lời gợi ý chiến thuật sắc sảo kích hoạt trợ giúp 50:50 hoặc hỏi ý kiến khán giả.\`;
            } else if (gameType === 'speedrun') {
                gameTargetDesc = "Đấu trường Đua Tốc Độ 60s (Lightning Speedrun)";
                gameSpecificRules = \`★ YÊU CẦU CHUYÊN BIỆT CHO ĐUA TỐC ĐỘ 60S:
- 15 câu hỏi phản xạ tính nhẩm nhanh, học sinh quyết định trong 5-10 giây!
- Tuyệt đối KHÔNG ra đề tính toán cồng kềnh mất nhiều phút.
- Trọng tâm: Đọc nhanh khoảng đồng biến từ bảng biến thiên (nhìn dấu + của y'), đọc giao điểm đồ thị với trục hoành, đạo hàm cơ bản, giá trị lượng giác/mũ/logarit số đẹp, tọa độ tâm mặt cầu/trung điểm.\`;
            } else if (gameType === 'boss') {
                gameTargetDesc = "Đấu trường Vượt Ải Diệt Boss 3 HP (RPG Boss Battle)";
                gameSpecificRules = \`★ YÊU CẦU CHUYÊN BIỆT CHO VƯỢT ẢI DIỆT BOSS:
- 15 câu hỏi thiết kế theo 3 ải chiến đấu RPG:
  + Ải 1 (Câu 1-5): Đối đầu Tiểu Quái Ma Trận (Nhận biết định nghĩa & công thức).
  + Ải 2 (Câu 6-10): Đối đầu Hộ Vệ Cổ Đại (Thông hiểu & Vận dụng trung bình, biến đổi 2 bước).
  + Ải 3 (Câu 11-15): Đối đầu Hắc Long Bất Diệt (Vận dụng cao, bài toán thực tế và hình học không gian thử thách cao độ).\`;
            } else if (gameType === 'cardflip') {
                gameTargetDesc = "Đấu trường Lật Thẻ 3D Trí Nhớ (Memory Match Cards)";
                gameSpecificRules = \`★ YÊU CẦU CHUYÊN BIỆT CHO LẬT THẺ 3D:
- Câu hỏi và đáp án mang tính ghép đôi đối ứng kinh điển:
  + Đề bài (Thẻ A): Một công thức, biểu thức nguyên hàm/đạo hàm, hoặc tên hình học.
  + Đáp án đúng (Thẻ B): Kết quả rút gọn, tên gọi hoặc tính chất tương ứng.
  + Ví dụ: $\\\\int \\\\frac{1}{x} dx$ ghép đôi với $\\\\ln|x| + C$; Đồ thị Parabol $y = x^2 - 4x$ ghép đôi với Điểm cực tiểu $(2; -4)$.\`;
            } else {
                gameTargetDesc = "Đấu trường Tổng Hợp (Vận hành tối ưu trên cả 4 Game)";
                gameSpecificRules = \`★ YÊU CẦU CHUYÊN BIỆT ĐA NĂNG CHO CẢ 4 GAME:
- 15 câu hỏi trắc nghiệm 4 lựa chọn chuẩn mực với độ dốc khó tăng dần (Câu 1-5 dễ, 6-10 trung bình, 11-15 nâng cao).
- Câu 1-5 thiết kế phản xạ nhanh (hỗ trợ Speedrun), toàn bộ 15 câu phục vụ Triệu Phú và Diệt Boss, trường text và answer cô đọng hỗ trợ Lật thẻ 3D.\`;
            }

            let rawTmpl2 = ${JSON.stringify(template2)};
            finalPrompt = rawTmpl2
                .replace(/\\{\\{GRADE\\}\\}/g, grade)
                .replace(/\\{\\{TOPIC\\}\\}/g, finalTopic)
                .replace(/\\{\\{GAME_TARGET_DESC\\}\\}/g, gameTargetDesc)
                .replace(/\\{\\{GAME_SPECIFIC_RULES\\}\\}/g, gameSpecificRules)
                .replace(/\\{\\{LANG_DESC\\}\\}/g, langDesc)
                .replace(/\\{\\{BILINGUAL_INSTRUCTIONS\\}\\}/g, bilingualInstructions);
        } else {
            // PROMPT 1: THI CHUẨN GDPT 2018 (3 PHẦN & CV 7991)
            let reqStr = "";
            if (Array.isArray(window.aiStructure) && window.aiStructure.length > 0) {
                let p1 = 0, p2 = 0, p3 = 0;
                let lines = [];
                window.aiStructure.forEach((r, idx) => {
                    let f = r.format || r.round || 'round1';
                    let lvl = r.level || 'Nhận biết';
                    let count = parseInt(r.count) || 1;
                    let fTitle = (f === 'round1') ? "Trắc nghiệm 4 lựa chọn (Phần I)" : ((f === 'round2') ? "Trắc nghiệm Đúng/Sai 4 ý (Phần II)" : "Trả lời ngắn (Phần III)");
                    lines.push(\`- Lệnh \${idx + 1}: \${count} câu \${fTitle} [Mức độ: \${lvl}]\`);
                    if (f === 'round1') p1 += count;
                    else if (f === 'round2') p2 += count;
                    else if (f === 'round3') p3 += count;
                });
                reqStr = lines.join('\\n') + \`\\n=> TỔNG CỘNG: \${p1} câu Phần I (round1), \${p2} câu Phần II (round2), \${p3} câu Phần III (round3).\`;
            } else {
                reqStr = "- PHẦN I: 12 câu Trắc nghiệm 4 lựa chọn (4 phương án A, B, C, D)\\n- PHẦN II: 4 câu Trắc nghiệm Đúng/Sai (mỗi câu gồm 4 ý mệnh đề a, b, c, d)\\n- PHẦN III: 6 câu Trả lời ngắn (điền đáp số là một số thực duy nhất)";
            }

            let rawTmpl1 = ${JSON.stringify(template1)};
            finalPrompt = rawTmpl1
                .replace(/\\{\\{GRADE\\}\\}/g, grade)
                .replace(/\\{\\{TOPIC\\}\\}/g, finalTopic)
                .replace(/\\{\\{LANG_DESC\\}\\}/g, langDesc)
                .replace(/\\{\\{BILINGUAL_INSTRUCTIONS\\}\\}/g, bilingualInstructions)
                .replace(/\\{\\{REQ_STR\\}\\}/g, reqStr);
        }

        if (sourceBlock) {
            finalPrompt += sourceBlock;
        }

        let outArea = document.getElementById('ai-prompt-text') || document.getElementById('ai-prompt-input');
        if (outArea) {
            outArea.value = finalPrompt;
        }
        return finalPrompt;
    } catch (err) {
        console.error("Lỗi sinh AI prompt:", err);
    }
}

`;

const updatedTeacher = teacherContent.substring(0, idxSetMode) + replacement + teacherContent.substring(idxEnd);
fs.writeFileSync('js/teacher.js', updatedTeacher, 'utf8');
console.log('Successfully updated teacher.js with both Prompt 1 and Prompt 2 engines! New size:', updatedTeacher.length);
