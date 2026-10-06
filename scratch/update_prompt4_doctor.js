const fs = require('fs');

let teacher = fs.readFileSync('js/teacher.js', 'utf8');

const idxStart = teacher.indexOf('function aiFixSingleQuestion(roundKey, qId)');
const idxEnd = teacher.indexOf('function aiFixAllDetectedErrors()');

if (idxStart === -1 || idxEnd === -1) {
  console.error('Indices for aiFixSingleQuestion not found!');
  process.exit(1);
}

const newAiFixSingleQuestion = `function aiFixSingleQuestion(roundKey, qId) {
            let apiKey = getGeminiApiKey();
            if (!apiKey) return showToast("Vui lòng nhập Gemini API Key trong phần Nhập / AI!", true);

            let list = adminState.data[roundKey] || [];
            let q = list.find(x => String(x.id) === String(qId));
            if (!q) return showToast("Không tìm thấy câu hỏi!", true);

            let btn = document.getElementById(\`btn-ai-fix-q-\${qId}\`);
            let oldText = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Bác sĩ AI Đang Khám & Vá Lỗi...'; btn.disabled = true; }

            try {
                let promptText = \`Bạn là BÁC SĨ KHẢO THÍ TOÁN HỌC & CHUYÊN GIA KIỂM ĐỊNH ĐỀ THI THPT GDPT 2018 (CÔNG VĂN 7991/BGDĐT).

NHIỆM VỤ: Hãy phẫu thuật, kiểm định toán học và SỬA CHỮA TOÀN DIỆN câu hỏi Toán dưới đây để đạt độ CHUẨN XÁC 100% VỀ TOÁN HỌC, SƯ PHẠM VÀ TRỰC QUAN HÓA:

1. KIỂM ĐỊNH VÀ ĐỒNG BỘ ĐÁP ÁN VỚI LỜI GIẢI (ZERO CONFLICT):
   - Bạn BẮT BUỘC phải tự giải lại bài toán từng bước logic trong "explanation".
   - Nếu "answer" hoặc "isTrue" bị LỆCH với lời giải thực tế, BẮT BUỘC SỬA LẠI "answer" cho khớp 100% với lời giải!
   - 4 phương án A, B, C, D (nếu có) phải độc lập, không trùng lặp giá trị, các phương án sai phải là bẫy tư duy kinh điển hợp lý.

2. ★ BẮT BUỘC BỔ SUNG BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHÔNG GIAN NẾU THIẾU:
   - Nếu trong "text" có nhắc tới "bảng biến thiên" (hoặc câu hỏi khảo sát hàm số, cực trị, tiệm cận) mà CHƯA CÓ BẢNG BIẾN THIÊN:
     BẮT BUỘC TỰ ĐỘNG CHÈN MÃ LaTeX MathJax array BBT vào ngay trong "text":
     $$\\\\begin{array}{c|ccccc} x & -\\\\infty & ... & +\\\\infty \\\\\\\\ \\\\hline y' & ... \\\\\\\\ \\\\hline y & ... \\\\end{array}$$
   - Nếu trong "text" có nhắc tới "đồ thị" hoặc "hình vẽ" mà CHƯA CÓ HÌNH:
     BẮT BUỘC TỰ ĐỘNG CHÈN KHỐI MÃ SVG VECTOR Oxy (<svg viewBox="0 0 360 240" ...>...</svg>) vào ngay trong "text"!
   - Nếu là câu hỏi hình học (hình chóp, lăng trụ, nón, trụ, cầu...):
     BẮT BUỘC TỰ ĐỘNG CHÈN KHỐI MÃ SVG 3D VECTOR với cạnh thấy nét liền, cạnh khuất nét đứt vào "text"!
   - Nếu là câu hỏi Thống kê ghép nhóm:
     BẮT BUỘC chèn BẢNG SỐ LIỆU HTML table.

3. ĐỐI VỚI CÂU HỎI ĐÚNG / SAI (PHẦN II / round2):
   - Kiểm tra kỹ từng mệnh đề a, b, c, d trong "statements". Sửa lại giá trị "isTrue" (true/false) cho đúng tuyệt đối.
   - Bổ sung lời giải chi tiết cho từng ý a, b, c, d.

4. ĐỐI VỚI CÂU HỎI TRẢ LỜI NGẮN (PHẦN III / round3):
   - Chuẩn hóa "answer" về DUY NHẤT MỘT CON SỐ THỰC (ví dụ: "30", "-2.5"). Xóa bỏ đơn vị, chữ cái "x =" hay phân số "3/4" -> đổi thành số thập phân "0.75".

5. CHUẨN HÓA CÔNG THỨC LATEX & CHÍNH TẢ:
   - Bọc toàn bộ biểu thức, biến số, công thức trong cặp dấu $...$.
   - Sửa lỗi OCR dính chữ tiếng Việt, sửa lỗi thiếu dấu ngoặc.
   - Ký tự gạch chéo ngược \\ BẮT BUỘC escape thành \\\\ trong chuỗi JSON.

DỮ LIỆU CÂU HỎI CẦN BÁC SĨ AI KHÁM & SỬA:
Dạng thức: \${roundKey === 'round1' ? 'Trắc nghiệm 4 lựa chọn (Phần I)' : (roundKey === 'round2' ? 'Đúng / Sai 4 ý (Phần II)' : 'Trả lời ngắn (Phần III)')}
ID: \${q.id}
Text: \${JSON.stringify(q.text)}
Options: \${JSON.stringify(q.options || [])}
Answer: \${JSON.stringify(q.answer || '')}
Statements: \${JSON.stringify(q.statements || [])}
Explanation: \${JSON.stringify(q.explanation || '')}\`;

                let payload = {
                    systemInstruction: { parts: [{ text: "Bạn là Bác sĩ Khảo thí Toán học chuyên gia. Khám xét, thẩm định tính đúng đắn toán học, tự động bổ sung BBT/đồ thị nếu thiếu, và sửa lỗi toàn diện cho câu hỏi." }] },
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "OBJECT",
                            properties: {
                                text: { type: "STRING" },
                                options: { 
                                    type: "ARRAY", 
                                    items: { type: "STRING" } 
                                },
                                answer: { type: "STRING" },
                                statements: {
                                    type: "ARRAY",
                                    items: {
                                        type: "OBJECT",
                                        properties: {
                                            label: { type: "STRING" },
                                            text: { type: "STRING" },
                                            isTrue: { type: "BOOLEAN" },
                                            points: { type: "NUMBER" }
                                        },
                                        required: ["label", "text", "isTrue"]
                                    }
                                },
                                explanation: { type: "STRING" },
                                repairNotes: { type: "STRING" }
                            },
                            required: ["text", "explanation", "repairNotes"]
                        }
                    }
                };

                let data = await callGeminiApiEndpoint(payload, apiKey);
                let jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                let parsed = smartParseJSON(jsonStr);
                if (parsed && parsed.text) {
                    q.text = parsed.text;
                    if (Array.isArray(parsed.options) && parsed.options.length > 0) {
                        q.options = parsed.options;
                    }
                    if (parsed.answer !== undefined && parsed.answer !== null && String(parsed.answer).trim() !== '') {
                        q.answer = String(parsed.answer).trim();
                    }
                    if (Array.isArray(parsed.statements) && parsed.statements.length > 0) {
                        q.statements = parsed.statements;
                    }
                    if (parsed.explanation) {
                        q.explanation = parsed.explanation;
                    }
                    GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
                    let note = parsed.repairNotes ? \` [\${parsed.repairNotes}]\` : '';
                    showToast(\`✨ Bác sĩ AI đã thẩm định & sửa câu hỏi thành công!\${note}\`);
                    renderErrorFixUI(null, currentFixFilter, \`\${roundKey}_\${qId}\`);
                } else {
                    throw new Error("AI trả về định dạng không đúng!");
                }
            } catch (e) {
                showToast("Lỗi từ AI: " + e.message, true);
            } finally {
                if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
            }
        }

        `;

teacher = teacher.substring(0, idxStart) + newAiFixSingleQuestion + teacher.substring(idxEnd);
fs.writeFileSync('js/teacher.js', teacher, 'utf8');
console.log('Successfully updated aiFixSingleQuestion with Clinical Exam Doctor Engine! New size:', teacher.length);
