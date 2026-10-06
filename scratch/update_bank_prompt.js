const fs = require('fs');

let teacher = fs.readFileSync('js/teacher.js', 'utf8');

const visualInstructionFormal = `QUY CHUẨN TRÌNH BÀY & TRỰC QUAN HÓA TOÁN HỌC:
- Tất cả công thức toán học BẮT BUỘC đặt trong cặp dấu đô la $...$ (chuẩn LaTeX).
- ★ BẮT BUỘC VẼ BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHI CÂU HỎI CẦN HOẶC TRONG NGUỒN CÓ:
  + Bảng biến thiên: BẮT BUỘC nhúng khối mã LaTeX array MathJax:
    $$\\\\begin{array}{c|ccccc} x & -\\\\infty & & x_0 & & +\\\\infty \\\\\\\\ \\\\hline y' & & + & 0 & - & \\\\\\\\ \\\\hline y & & & y_{CĐ} & & \\\\\\\\ & & \\\\nearrow & & \\\\searrow & \\\\\\\\ & -\\\\infty & & & & -\\\\infty \\\\end{array}$$
  + Bảng số liệu / thống kê ghép nhóm: BẮT BUỘC nhúng bảng HTML table có viền rõ ràng:
    <table class="w-full max-w-md mx-auto my-2 border-collapse border border-slate-300 text-xs text-center"><tr class="bg-sky-100 font-bold"><th class="border border-slate-300 p-1">Nhóm</th><th class="border border-slate-300 p-1">Tần số</th></tr><tr><td class="border border-slate-300 p-1">[10; 20)</td><td class="border border-slate-300 p-1">15</td></tr></table>
  + Đồ thị Oxy & Hình học không gian 3D: BẮT BUỘC nhúng trực tiếp khối mã SVG vector:
    <svg class="mx-auto my-3 block max-w-full" viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg">...</svg>
    (Nét liền cho cạnh thấy, nét đứt stroke-dasharray="5,5" cho cạnh khuất đáy, nhãn đỉnh chữ in hoa rõ ràng).
- Chỉ trả về nội dung câu hỏi và đáp án theo đúng định dạng mẫu trên, không thêm trích dẫn nguồn hay văn bản chào hỏi.`;

const visualInstructionPractice = `QUY CHUẨN TRÌNH BÀY & TRỰC QUAN HÓA TOÁN HỌC:
- Tất cả công thức toán học BẮT BUỘC đặt trong cặp dấu đô la $...$ (chuẩn LaTeX).
- ★ BẮT BUỘC VẼ BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHI CÂU HỎI CẦN HOẶC TRONG NGUỒN CÓ:
  + Bảng biến thiên: Nhúng mã LaTeX array MathJax ($$\\\\begin{array}...\\\\end{array}$$).
  + Bảng dữ liệu / thống kê: Nhúng bảng HTML table (<table class="...">...</table>).
  + Đồ thị Oxy / Hình không gian: Nhúng mã vector SVG (<svg ...>...</svg>).
- Chỉ trả về nội dung đề thi và đáp án theo đúng định dạng mẫu trên, không giải thích dài dòng ở đầu hoặc cuối.`;

const oldFormalText = `QUY CHUẨN TRÌNH BÀY:
- Tất cả công thức toán học BẮT BUỘC đặt trong cặp dấu đô la $...$ (chuẩn LaTeX).
- Chỉ trả về nội dung câu hỏi và đáp án theo đúng định dạng mẫu trên, không thêm trích dẫn nguồn hay văn bản chào hỏi.`;

const oldPracticeText = `QUY CHUẨN TRÌNH BÀY:
- Tất cả công thức toán học BẮT BUỘC đặt trong cặp dấu đô la $...$ (chuẩn LaTeX).
- Chỉ trả về nội dung đề thi và đáp án theo đúng định dạng mẫu trên, không giải thích dài dòng ở đầu hoặc cuối.`;

if (teacher.includes(oldFormalText)) {
  teacher = teacher.replace(oldFormalText, visualInstructionFormal);
  console.log('Replaced oldFormalText in generateBankAiPrompt');
} else {
  console.warn('oldFormalText not found');
}

if (teacher.includes(oldPracticeText)) {
  teacher = teacher.replace(oldPracticeText, visualInstructionPractice);
  console.log('Replaced oldPracticeText in generateBankAiPrompt');
} else {
  console.warn('oldPracticeText not found');
}

fs.writeFileSync('js/teacher.js', teacher, 'utf8');
console.log('Updated teacher.js successfully. New size:', teacher.length);
