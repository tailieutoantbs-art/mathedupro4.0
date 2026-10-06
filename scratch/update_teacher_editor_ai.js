const fs = require('fs');
const path = require('path');

let teacherJsPath = path.join(__dirname, '..', 'js', 'teacher.js');
let teacherJs = fs.readFileSync(teacherJsPath, 'utf8');

// Chèn nút "AI Sinh Câu Tương Tự" vào toolbar của adminEditQ
if (!teacherJs.includes('AIExamStudio.openVariationModal')) {
    let targetActionButtons = `<button onclick="openFullQuestionPreviewModal('\${q.id}', '\${adminState.round}')" class="px-4 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider flex items-center gap-1.5" title="Xem trước câu hỏi, đáp án và lời giải chi tiết"><i class="fa-solid fa-expand text-amber-300"></i> Xem Trước Cả Câu</button>`;
    
    let replacementActionButtons = `
                        <button onclick="AIExamStudio.openVariationModal(adminState.round, (adminState.data[adminState.round] || []).findIndex(x => String(x.id) === String('\${q.id}')))" class="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider flex items-center gap-1.5" title="Tự động giữ nguyên cấu trúc toán học, đổi số liệu đẹp và sinh lời giải"><i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> AI Sinh Câu Tương Tự</button>
                        ${targetActionButtons}
    `.trim();

    teacherJs = teacherJs.replace(targetActionButtons, replacementActionButtons);
    fs.writeFileSync(teacherJsPath, teacherJs, 'utf8');
    console.log('Successfully injected AI Variation Generator button into adminEditQ in teacher.js!');
} else {
    console.log('Button already exists in teacher.js');
}
