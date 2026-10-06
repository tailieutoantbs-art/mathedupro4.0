const fs = require('fs');
const path = require('path');

const teacherJsPath = path.join(__dirname, '..', 'js', 'teacher.js');
let teacherJs = fs.readFileSync(teacherJsPath, 'utf8');

// Target generateAiPrompt in teacher.js
const oldFunctionPattern = /function generateAiPrompt\(\) \{[\s\S]*?function handleAiImageScanUpload/;

const newGenerateAiPromptCode = `function generateAiPrompt() {
    const formatNameMap = {
        'round1': 'Phần I: Trắc nghiệm 4 lựa chọn (A, B, C, D)',
        'round2': 'Phần II: Trắc nghiệm Đúng/Sai (4 mệnh đề a, b, c, d)',
        'round3': 'Phần III: Trắc nghiệm Trả lời ngắn (Đáp án là 1 con số)'
    };

    let grade = document.getElementById('ai-prompt-grade')?.value || (adminState?.meta?.grade || '12');
    let customTopic = document.getElementById('ai-prompt-topic-custom')?.value?.trim();
    let selectTopic = document.getElementById('ai-prompt-topic-select')?.value?.trim();
    let topic = customTopic || selectTopic || \`Toàn bộ chương trình môn Toán Lớp \${grade}\`;
    let safeTopic = topic.replace(/"/g, "'");
    
    let lang = document.getElementById('ai-prompt-lang')?.value || 'vi';

    let reqLines = aiStructure.map((r, i) => {
        let fmtName = formatNameMap[r.format || r.round] || 'Phần I: Trắc nghiệm 4 lựa chọn';
        let partLabel = \`YÊU CẦU \${i + 1}\`;
        return \`  + \${partLabel} [\${fmtName}]: \${r.count} câu, Mức độ: \${r.level || 'Nhận biết'}\`;
    });

    let reqStr = reqLines.join('\\n');
    if (!reqStr) reqStr = "  + Biên soạn đề thi đầy đủ 3 Phần chuẩn Bộ GD&ĐT: Phần I (12 câu), Phần II (4 câu), Phần III (6 câu).";

    let promptTextarea = document.getElementById('ai-prompt-text');
    if (!promptTextarea) return;

    let bilingualInstructions = "";
    if (lang === 'bilingual') {
        bilingualInstructions = \`
YÊU CẦU SONG NGỮ (CLIL IN MATHEMATICS - VIETNAMESE & ENGLISH):
1. Mỗi câu hỏi và lời giải chi tiết BẮT BUỘC cung cấp song song cả Tiếng Việt và Tiếng Anh:
   - "content_vi": Nội dung câu hỏi Tiếng Việt.
   - "content_en": Academic mathematical English translation.
   - "explanation_vi": Lời giải chi tiết Tiếng Việt.
   - "explanation_en": Step-by-step rigorous English solution.
   - "options": Mảng phương án có song ngữ [{"key":"A", "vi":"...", "en":"..."}, ...]
   - "keywords": Thuật ngữ toán học [{"term_en":"...", "term_vi":"...", "desc":"..."}]\`;
    } else if (lang === 'en') {
        bilingualInstructions = \`
ENGLISH ONLY REQUIREMENT:
All questions, options, statements, and explanations MUST be written in formal High School Mathematical English.\`;
    }

    let isFormal = (window.aiPromptMode === 'formal');

    let promptContent = \`Bạn là CHUYÊN GIA KHẢO THÍ HÀNG ĐẦU VÀ TÁC GIẢ ĐỀ THI TỐT NGHIỆP THPT MÔN TOÁN theo Chương trình Giáo dục Phổ thông 2018 (Quy chuẩn CÔNG VĂN 7991/BGDĐT của Bộ GD&ĐT).

NHIỆM VỤ CỐT LÕI:
Hãy biên soạn một BỘ ĐỀ THI TOÁN HỌC CHUẨN MỰC, TUYỆT ĐỐI CHÍNH XÁC VỀ MẶT TOÁN HỌC, KHÔNG ẢO GIÁC, ĐÁP ỨNG TIÊU CHUẨN ĐÁNH GIÁ NĂNG LỰC 2025.
Trả về kết quả trong DUY NHẤT 1 KHỐI JSON HỢP LỆ (valid JSON block) theo schema ở cuối prompt.

THÔNG TIN ĐỀ THI:
- KHỐI LỚP: Môn Toán Lớp \${grade} (GDPT 2018)
- CHỦ ĐỀ / CHUYÊN ĐỀ KIẾN THỨC: "\${safeTopic}"
- NGÔN NGỮ: \${lang === 'bilingual' ? 'Song ngữ Việt - Anh (CLIL)' : (lang === 'en' ? 'Tiếng Anh (English)' : 'Tiếng Việt')}
\${bilingualInstructions}

CƠ CẤU SỐ LƯỢNG VÀ MỨC ĐỘ YÊU CẦU:
\${reqStr}

══════════════════════════════════════════════════════════════════════════════
QUY TẮC BẢO ĐẢM ĐỘ CHÍNH XÁC TOÁN HỌC TUYỆT ĐỐI (MATHEMATICAL RIGOR):
══════════════════════════════════════════════════════════════════════════════
1. CHUỖI SUY LUẬN NGẦM (CHAIN-OF-THOUGHT):
   - Với MỌI câu hỏi, bạn phải tự giải bài toán theo từng bước toán học cụ thể trước khi kết luận đáp án.
   - Lời giải "explanation" phải đầy đủ các bước: Công thức áp dụng ➔ Biến đổi đại số/hình học ➔ Kết luận.
   - Đáp án trong "answer" hoặc "isTrue" phải TUYỆT ĐỐI NHẤT QUÁN 100% với lời giải. Không được giải ra A mà đáp án lại ghi B!

2. QUY CHUẨN CÔNG THỨC TOÁN LATEX:
   - Toàn bộ công thức, biến số, biểu thức toán học BẮT BUỘC đặt trong dấu \`$\` (ví dụ: \`$f(x) = x^3 - 3x^2 + 2$\`, \`$x \\\\in [0; 3]$\`, \`$\\\\vec{a} = (1; -2; 3)$\`).
   - Ký hiệu chuẩn: Dấu nhân là \`\\\\cdot\`, phân số là \`\\\\frac{a}{b}\`, căn là \`\\\\sqrt{x}\`, tích phân là \`\\\\int_{a}^{b} f(x)\\\\,dx\`.
   - QUAN TRỌNG: Trong chuỗi JSON, ký tự gạch chéo ngược \`\\\\\` PHẢI ĐƯỢC ESCAPE thành \`\\\\\\\\\` (ví dụ: \`\\\\\\\\frac{1}{2}\`, \`\\\\\\\\in\`, \`\\\\\\\\mathbb{R}\`) để không gây lỗi JSON.parse!

3. THIẾT KẾ CÁC PHẦN THEO CHUẨN BGD 2025:
   ● PHẦN I (Trắc nghiệm 4 lựa chọn):
     - Mỗi câu có 4 phương án A, B, C, D độc lập, không trùng lặp giá trị.
     - 3 phương án nhiễu (sai) phải được thiết kế có ý đồ sư phạm dựa trên SAI LẦM KINH ĐIỂN của học sinh (nhầm dấu, quên điều kiện xác định, nhầm đạo hàm với nguyên hàm, nhầm hoành độ với tung độ).
     - Trường "answer" BẮT BUỘC ghi rõ nội dung của phương án đúng (hoặc ký tự "A", "B", "C", "D").

   ● PHẦN II (Trắc nghiệm Đúng / Sai):
     - Mỗi câu hỏi là một TÌNH HUỐNG TOÁN HỌC HOÀN CHỈNH (cho một hàm số, một khối đa diện hoặc một bài toán thực tế).
     - 4 ý a), b), c), d) phải phát triển liên hoàn từ nhận biết đến vận dụng:
       * Ý a): Kiểm tra tập xác định, tính liên tục hoặc giá trị tại một điểm.
       * Ý b): Kiểm tra biến đổi trung gian (đạo hàm, tọa độ véc-tơ, nghiệm phương trình).
       * Ý c): Khảo sát tính chất cốt lõi (cực trị, diện tích, thể tích, góc, khoảng cách).
       * Ý d): Bài toán nâng cao (chứa tham số m, bài toán tối ưu min/max thực tế, bất đẳng thức).
     - Mỗi mệnh đề có trường "isTrue": true/false và "explanation" giải thích rõ vì sao Đúng hoặc Sai.

   ● PHẦN III (Trả lời ngắn):
     - Câu hỏi tính toán thực tế hoặc nâng cao đòi hỏi học sinh tự giải và điền kết quả.
     - YÊU CẦU TỐI QUAN TRỌNG: Trường "answer" BẮT BUỘC CHỈ LÀ MỘT CON SỐ (ví dụ: "4", "-12.5", "0.25").
     - Tuyệt đối KHÔNG viết đơn vị (cm, m, độ), KHÔNG viết biểu thức chứa chữ cái (x, y, pi), KHÔNG viết phân số "3/4" (phải chuyển thành số thập phân "0.75" hoặc yêu cầu làm tròn đến chữ số thập phân cụ thể).

══════════════════════════════════════════════════════════════════════════════
CẤU TRÚC JSON ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI MÃ JSON):
══════════════════════════════════════════════════════════════════════════════
\\\`\\\`\\\`json
{
\${isFormal ? \`  "matrixData": [
    { "topic": "\${safeTopic}", "nb": 3, "th": 3, "vd": 2, "r1": 12, "r2": 4, "r3": 6 }
  ],
  "specData": [
    { "topic": "\${safeTopic}", "level": "Nhận biết - Thông hiểu - Vận dụng", "reqSkill": "Đánh giá theo chuẩn năng lực GDPT 2018", "questions": "Toàn bộ đề thi" }
  ],\` : ''}
  "round1": [
    {
      "id": 1,
      "text": "Câu 1. Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = 3x^2 - 6x$. Số điểm cực trị của hàm số là",
      "options": ["A. $0$", "B. $1$", "C. $2$", "D. $3$"],
      "answer": "C. $2$",
      "points": 0.25,
      "topic": "\${safeTopic}",
      "level": "Nhận biết",
      "explanation": "Ta có $f'(x) = 0 \\\\\\\\Leftrightarrow 3x(x - 2) = 0 \\\\\\\\Leftrightarrow x = 0$ hoặc $x = 2$. Vì $f'(x)$ đổi dấu qua cả 2 nghiệm đơn nên hàm số có 2 điểm cực trị. Chọn C."
    }
  ],
  "round2": [
    {
      "id": 1,
      "text": "Câu 1. Cho hàm số $f(x) = x^3 - 3x + 2$ có đồ thị là $(C)$.",
      "statements": [
        { "label": "a", "text": "Hàm số đã cho đồng biến trên khoảng $(1; +\\\\\\\\infty)$.", "isTrue": true, "points": 0.1 },
        { "label": "b", "text": "Đồ thị $(C)$ cắt trục hoành tại 3 điểm phân biệt.", "isTrue": false, "points": 0.25 },
        { "label": "c", "text": "Điểm cực tiểu của đồ thị $(C)$ là $M(1; 0)$.", "isTrue": true, "points": 0.5 },
        { "label": "d", "text": "Phương trình $f(x) = m$ có 3 nghiệm phân biệt khi và chỉ khi $0 < m < 4$.", "isTrue": true, "points": 1.0 }
      ],
      "topic": "\${safeTopic}",
      "level": "Thông hiểu - Vận dụng",
      "explanation": "Ta có $f'(x) = 3x^2 - 3 = 3(x^2 - 1)$. $f'(x) > 0 \\\\\\\\Leftrightarrow x \\\\\\\\in (-\\\\\\\\infty; -1) \\\\\\\\cup (1; +\\\\\\\\infty)$. Do đó ý a đúng. Phương trình $x^3 - 3x + 2 = 0 \\\\\\\\Leftrightarrow (x - 1)^2(x + 2) = 0$ chỉ có 2 nghiệm phân biệt là $x=1$ và $x=-2$, nên ý b sai..."
    }
  ],
  "round3": [
    {
      "id": 1,
      "text": "Câu 1. Một doanh nghiệp sản xuất một loại sản phẩm với hàm lợi nhuận $P(x) = -2x^2 + 120x - 800$ (triệu đồng), trong đó $x$ là số lượng sản phẩm sản xuất (đơn vị: nghìn sản phẩm). Doanh nghiệp cần sản xuất bao nhiêu nghìn sản phẩm để đạt lợi nhuận lớn nhất?",
      "answer": "30",
      "points": 0.5,
      "topic": "\${safeTopic}",
      "level": "Vận dụng",
      "explanation": "Hàm $P(x)$ là hàm bậc hai có $a = -2 < 0$ nên đạt giá trị lớn nhất tại đỉnh parabol $x = -\\\\\\\\frac{b}{2a} = -\\\\\\\\frac{120}{2(-2)} = 30$. Vậy doanh nghiệp cần sản xuất 30 nghìn sản phẩm. Điền đáp án: 30."
    }
  ]
}
\\\`\\\`\\\`\`;

    promptTextarea.value = promptContent;
}

function handleAiImageScanUpload`;

if (oldFunctionPattern.test(teacherJs)) {
    teacherJs = teacherJs.replace(oldFunctionPattern, newGenerateAiPromptCode);
    console.log('Successfully upgraded generateAiPrompt in teacher.js with pedagogical math rigor!');
} else {
    console.error('Could not match oldFunctionPattern for generateAiPrompt in teacher.js');
    process.exit(1);
}

// 2. Also enhance the API call generation system instruction in generateQuestionsViaAPI
const oldSystemInstructionPattern = /systemInstruction: \{ parts: \[\{ text: "Bạn là một chuyên gia kỹ nghệ cấu trúc đề thi trắc nghiệm Toán học THPT GDPT 2018[\s\S]*?stroke-dasharray='5,5' cho cạnh ẩn\." \}\] \}/;

const newSystemInstruction = `systemInstruction: { parts: [{ text: "BẠN LÀ CHUYÊN GIA KHẢO THÍ TOÁN HỌC CAO CẤP CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO (GDPT 2018).\\n\\nQUY TẮC CỐT LÕI:\\n1. ĐỘ CHÍNH XÁC TOÁN HỌC: Mọi câu hỏi phải được giải nháp từng bước trong explanation trước khi điền answer/isTrue. Đáp án và lời giải phải trùng khớp 100%, không được ảo giác.\\n2. QUY CHUẨN LATEX: Toàn bộ công thức kẹp trong $...$. Escape dấu gạch chéo \\\\\\\\frac, \\\\\\\\sqrt, \\\\\\\\int, \\\\\\\\vec chuẩn xác.\\n3. PHẦN I: 4 lựa chọn không trùng lặp, bẫy nhiễu xuất phát từ sai lầm điển hình của học sinh.\\n4. PHẦN II: Tình huống toán học sâu sắc, 4 mệnh đề a, b, c, d phát triển logic liên hoàn từ nhận biết đến vận dụng cao.\\n5. PHẦN III: Đáp án bắt buộc là MỘT CON SỐ duy nhất (ví dụ: '4', '-12.5', '30'). Tuyệt đối không chứa chữ cái, đơn vị đo, hoặc biểu thức." }] }`;

if (oldSystemInstructionPattern.test(teacherJs)) {
    teacherJs = teacherJs.replace(oldSystemInstructionPattern, newSystemInstruction);
    console.log('Successfully upgraded systemInstruction in generateQuestionsViaAPI!');
} else {
    console.log('System instruction pattern not matched directly, keeping existing or checking format.');
}

fs.writeFileSync(teacherJsPath, teacherJs, 'utf8');
console.log('Finished upgrading Prompt 1 in teacher.js!');
