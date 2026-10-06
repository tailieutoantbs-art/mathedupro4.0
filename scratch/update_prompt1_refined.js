const fs = require('fs');

const teacherContent = fs.readFileSync('js/teacher.js', 'utf8');
const templateText = fs.readFileSync('scratch/prompt1_template.txt', 'utf8');

const idxStart = teacherContent.indexOf('function generateAiPrompt()');
const idxEnd = teacherContent.indexOf('function handleAiImageScanUpload');

if (idxStart === -1 || idxEnd === -1) {
  console.error('Indices not found!');
  process.exit(1);
}

const newFunction = `function generateAiPrompt() {
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

        // Cơ cấu số lượng và mức độ từ aiStructure
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

        // Tài liệu nguồn (nếu giáo viên dán văn bản / scan tài liệu)
        let sourceText = document.getElementById('ai-source-text')?.value?.trim();
        let sourceBlock = "";
        if (sourceText) {
            sourceBlock = \`\\n══════════════════════════════════════════════════════════════════════════════\\nTÀI LIỆU NGUỒN CUNG CẤP TỪ GIÁO VIÊN (BÁM SÁT ĐỂ BIÊN SOẠN):\\n══════════════════════════════════════════════════════════════════════════════\\n\` + sourceText + \`\\n\`;
        }

        let rawTemplate = ${JSON.stringify(templateText)};

        let finalPrompt = rawTemplate
            .replace(/\\{\\{GRADE\\}\\}/g, grade)
            .replace(/\\{\\{TOPIC\\}\\}/g, finalTopic)
            .replace(/\\{\\{LANG_DESC\\}\\}/g, langDesc)
            .replace(/\\{\\{BILINGUAL_INSTRUCTIONS\\}\\}/g, bilingualInstructions)
            .replace(/\\{\\{REQ_STR\\}\\}/g, reqStr);

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

const updated = teacherContent.substring(0, idxStart) + newFunction + teacherContent.substring(idxEnd);
fs.writeFileSync('js/teacher.js', updated, 'utf8');
console.log('Successfully updated teacher.js. Size:', updated.length);
