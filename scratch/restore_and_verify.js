const fs = require('fs');
const path = require('path');

const teacherJsPath = path.join(__dirname, '..', 'js', 'teacher.js');
let s = fs.readFileSync(teacherJsPath, 'utf8');

const idxStart = s.indexOf('function generateAiPrompt()');
const idxEnd = s.indexOf('function handleAiImageScanUpload');

console.log('idxStart:', idxStart, 'idxEnd:', idxEnd);

if (idxStart === -1 || idxEnd === -1) {
    console.error('Markers not found!');
    process.exit(1);
}

const part1 = s.substring(0, idxStart);
const part2 = s.substring(idxEnd);

// Safely constructed prompt without backtick collisions
const promptLines = [
    'Bạn là CHUYÊN GIA KHẢO THÍ HÀNG ĐẦU VÀ TÁC GIẢ ĐỀ THI TỐT NGHIỆP THPT MÔN TOÁN theo Chương trình GDPT 2018 (CÔNG VĂN 7991/BGDĐT của Bộ GD&ĐT).',
    '',
    'NHIỆM VỤ CỐT LÕI:',
    'Hãy biên soạn một BỘ ĐỀ THI TOÁN HỌC CHUẨN MỰC, TUYỆT ĐỐI CHÍNH XÁC VỀ MẶT TOÁN HỌC, KHÔNG ẢO GIÁC, ĐÁP ỨNG TIÊU CHUẨN ĐÁNH GIÁ NĂNG LỰC 2025.',
    'Trả về kết quả trong DUY NHẤT 1 KHỐI JSON HỢP LỆ theo schema bắt buộc bên dưới.',
    '',
    'THÔNG TIN ĐỀ THI:',
    '- KHỐI LỚP: Môn Toán Lớp " + grade + " (GDPT 2018)',
    '- CHUYÊN ĐỀ KIẾN THỨC: \\"" + safeTopic + "\\"',
    '- NGÔN NGỮ: " + (lang === "bilingual" ? "Song ngữ Việt - Anh (CLIL)" : (lang === "en" ? "Tiếng Anh (English)" : "Tiếng Việt")) + "" + bilingualInstructions,
    '',
    'CƠ CẤU SỐ LƯỢNG VÀ MỨC ĐỘ YÊU CẦU:',
    '" + reqStr + "',
    '',
    '══════════════════════════════════════════════════════════════════════════════',
    'QUY TẮC BẢO ĐẢM ĐỘ CHÍNH XÁC TOÁN HỌC TUYỆT ĐỐI (MATHEMATICAL RIGOR):',
    '══════════════════════════════════════════════════════════════════════════════',
    '1. CHUỖI SUY LUẬN NGẦM (CHAIN-OF-THOUGHT):',
    '   - Với MỌI câu hỏi, bạn phải tự giải bài toán theo từng bước toán học cụ thể trong "explanation" trước khi chốt đáp án.',
    '   - Lời giải phải rõ ràng: Công thức ➔ Biến đổi đại số/hình học ➔ Kết luận.',
    '   - Đáp án trong "answer" hoặc "isTrue" phải TUYỆT ĐỐI NHẤT QUÁN 100% với lời giải. Không được giải ra A mà đáp án lại ghi B!',
    '',
    '2. QUY CHUẨN CÔNG THỨC TOÁN LATEX:',
    '   - Toàn bộ công thức, biến số, biểu thức toán học BẮT BUỘC đặt trong cặp dấu $...$ (ví dụ: $f(x) = x^3 - 3x^2 + 2$, $x \\\\in [0; 3]$, $\\\\vec{a} = (1; -2; 3)$).',
    '   - Ký hiệu chuẩn: Dấu nhân là \\\\cdot, phân số là \\\\frac{a}{b}, căn là \\\\sqrt{x}, tích phân là \\\\int_{a}^{b} f(x)\\\\,dx.',
    '   - ĐẶC BIỆT LƯU Ý: Trong chuỗi JSON, ký tự gạch chéo ngược \\\\ PHẢI ĐƯỢC ESCAPE thành \\\\\\\\ (ví dụ: \\\\\\\\frac{1}{2}, \\\\\\\\in, \\\\\\\\mathbb{R}) để không gây lỗi SyntaxError khi parse!',
    '',
    '3. THIẾT KẾ CÁC PHẦN THEO CHUẨN BGD 2025:',
    '   ● PHẦN I (Trắc nghiệm 4 lựa chọn):',
    '     - Mỗi câu có 4 phương án A, B, C, D độc lập, không trùng lặp giá trị.',
    '     - 3 phương án sai phải là bẫy nhiễu sư phạm dựa trên SAI LẦM KINH ĐIỂN của học sinh (nhầm dấu, quên điều kiện xác định, nhầm đạo hàm với nguyên hàm).',
    '     - Trường "answer" ghi rõ nội dung phương án đúng hoặc ký tự chữ cái tương ứng.',
    '',
    '   ● PHẦN II (Trắc nghiệm Đúng / Sai):',
    '     - Mỗi câu hỏi là một TÌNH HUỐNG TOÁN HỌC HOÀN CHỈNH.',
    '     - 4 mệnh đề a, b, c, d phát triển liên hoàn từ nhận biết đến vận dụng:',
    '       * Ý a: Kiểm tra tập xác định, tính liên tục hoặc giá trị tại một điểm.',
    '       * Ý b: Kiểm tra biến đổi trung gian (đạo hàm, véc-tơ, nghiệm phương trình).',
    '       * Ý c: Khảo sát tính chất cốt lõi (cực trị, diện tích, thể tích, khoảng cách).',
    '       * Ý d: Bài toán mở rộng chứa tham số m hoặc tối ưu min/max thực tế.',
    '     - Mỗi mệnh đề có "isTrue": true/false và "explanation" giải thích rõ.',
    '',
    '   ● PHẦN III (Trả lời ngắn):',
    '     - Câu hỏi tính toán thực tế hoặc vận dụng cao đòi hỏi học sinh tự giải và điền số.',
    '     - BẮT BUỘC: Trường "answer" CHỈ LÀ MỘT CON SỐ DUY NHẤT (ví dụ: "4", "-12.5", "30").',
    '     - Tuyệt đối KHÔNG viết đơn vị, KHÔNG viết chữ cái, KHÔNG viết phân số "3/4" (phải đổi ra số thập phân "0.75" hoặc làm tròn theo yêu cầu đề bài).',
    '',
    '══════════════════════════════════════════════════════════════════════════════',
    'CẤU TRÚC JSON ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI MÃ JSON):',
    '══════════════════════════════════════════════════════════════════════════════',
    '```json',
    '{',
    '  "round1": [',
    '    {',
    '      "id": 1,',
    '      "text": "Câu 1. Cho hàm số $y = f(x)$ có đạo hàm $f\\'(x) = 3x^2 - 6x$. Số điểm cực trị của hàm số là",',
    '      "options": ["A. $0$", "B. $1$", "C. $2$", "D. $3$"],',
    '      "answer": "C. $2$",',
    '      "points": 0.25,',
    '      "topic": \\"" + safeTopic + "\\",',
    '      "level": "Nhận biết",',
    '      "explanation": "Ta có $f\\'(x) = 0 \\\\Leftrightarrow 3x(x - 2) = 0 \\\\Leftrightarrow x = 0$ hoặc $x = 2$. Do đó hàm số có 2 điểm cực trị. Chọn C."',
    '    }',
    '  ],',
    '  "round2": [',
    '    {',
    '      "id": 1,',
    '      "text": "Câu 1. Cho hàm số $f(x) = x^3 - 3x + 2$ có đồ thị $(C)$.",',
    '      "statements": [',
    '        { "label": "a", "text": "Hàm số đã cho đồng biến trên $(1; +\\\\infty)$.", "isTrue": true, "points": 0.1 },',
    '        { "label": "b", "text": "Đồ thị $(C)$ cắt trục hoành tại 3 điểm phân biệt.", "isTrue": false, "points": 0.25 },',
    '        { "label": "c", "text": "Điểm cực tiểu của $(C)$ là $M(1; 0)$.", "isTrue": true, "points": 0.5 },',
    '        { "label": "d", "text": "Phương trình $f(x) = m$ có 3 nghiệm phân biệt khi $0 < m < 4$.", "isTrue": true, "points": 1.0 }',
    '      ],',
    '      "topic": \\"" + safeTopic + "\\",',
    '      "level": "Thông hiểu - Vận dụng",',
    '      "explanation": "Ta có $f\\'(x) = 3x^2 - 3$. Điểm cực tiểu là $M(1; 0)$..."',
    '    }',
    '  ],',
    '  "round3": [',
    '    {',
    '      "id": 1,',
    '      "text": "Câu 1. Một doanh nghiệp sản xuất sản phẩm với lợi nhuận $P(x) = -2x^2 + 120x - 800$ (triệu đồng), trong đó $x$ là số lượng sản phẩm (nghìn sản phẩm). Doanh nghiệp cần sản xuất bao nhiêu nghìn sản phẩm để lợi nhuận tối đa?",',
    '      "answer": "30",',
    '      "points": 0.5,',
    '      "topic": \\"" + safeTopic + "\\",',
    '      "level": "Vận dụng",',
    '      "explanation": "Đỉnh parabol tại $x = -b/(2a) = 30$. Điền đáp án: 30."',
    '    }',
    '  ]',
    '}',
    '```'
].join('\\n');

const newFunctionBody = `function generateAiPrompt() {
    const formatNameMap = {
        'round1': 'Phần I: Trắc nghiệm 4 lựa chọn (A, B, C, D)',
        'round2': 'Phần II: Trắc nghiệm Đúng/Sai (4 mệnh đề a, b, c, d)',
        'round3': 'Phần III: Trắc nghiệm Trả lời ngắn (Đáp án là 1 con số)'
    };

    let grade = document.getElementById('ai-prompt-grade')?.value || (adminState?.meta?.grade || '12');
    let customTopic = document.getElementById('ai-prompt-topic-custom')?.value?.trim();
    let selectTopic = document.getElementById('ai-prompt-topic-select')?.value?.trim();
    let topic = customTopic || selectTopic || ('Toàn bộ chương trình môn Toán Lớp ' + grade);
    let safeTopic = topic.replace(/"/g, "'");
    
    let lang = document.getElementById('ai-prompt-lang')?.value || 'vi';

    let reqLines = aiStructure.map((r, i) => {
        let fmtName = formatNameMap[r.format || r.round] || 'Phần I: Trắc nghiệm 4 lựa chọn';
        let partLabel = 'YÊU CẦU ' + (i + 1);
        return '  + ' + partLabel + ' [' + fmtName + ']: ' + r.count + ' câu, Mức độ: ' + (r.level || 'Nhận biết');
    });

    let reqStr = reqLines.join('\\n');
    if (!reqStr) reqStr = '  + Biên soạn đề thi đầy đủ 3 Phần chuẩn Bộ GD&ĐT: Phần I (12 câu), Phần II (4 câu), Phần III (6 câu).';

    let promptTextarea = document.getElementById('ai-prompt-text');
    if (!promptTextarea) return;

    let bilingualInstructions = '';
    if (lang === 'bilingual') {
        bilingualInstructions = '\\n\\nYÊU CẦU SONG NGỮ (CLIL IN MATHEMATICS - VIETNAMESE & ENGLISH):\\n' +
            '1. Cung cấp song song cả Tiếng Việt và Tiếng Anh: content_vi, content_en, explanation_vi, explanation_en, options, keywords.';
    } else if (lang === 'en') {
        bilingualInstructions = '\\n\\nENGLISH ONLY REQUIREMENT:\\nAll questions, options, statements, and explanations MUST be written in formal High School Mathematical English.';
    }

    promptTextarea.value = "${promptLines.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}";
}

`;

const cleanCode = part1 + newFunctionBody + part2;
fs.writeFileSync(teacherJsPath, cleanCode, 'utf8');
console.log('Restored and cleanly replaced generateAiPrompt in teacher.js!');
