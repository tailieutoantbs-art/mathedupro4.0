const fs = require('fs');
const path = require('path');

// 1. Cập nhật teacher.html
let teacherPath = path.join(__dirname, '..', 'teacher.html');
let teacherHtml = fs.readFileSync(teacherPath, 'utf8');

// Thêm script ai-exam-studio.js nếu chưa có
if (!teacherHtml.includes('ai-exam-studio.js')) {
    teacherHtml = teacherHtml.replace(
        '<script src="js/teacher.js',
        '<script src="js/ai-exam-studio.js?v=3.0.0"></script>\n    <script src="js/teacher.js'
    );
}

// Thêm nút AI Vision OCR & AI Auto-Fix vào toolbar
if (!teacherHtml.includes('AIExamStudio.openVisionScanModal')) {
    let targetToolbarBtn = `<button onclick="openImportModal()" class="px-4 py-2 bg-mainLight text-mainDark font-bold rounded-xl hover:bg-main hover:text-white transition shadow-sm btn-3d whitespace-nowrap"><i class="fa-solid fa-file-import mr-1"></i> Nhập / AI</button>`;
    let replacementToolbarBtns = `
                    <button onclick="AIExamStudio.openVisionScanModal()" class="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black rounded-xl hover:from-sky-700 hover:to-indigo-700 transition shadow-sm btn-3d whitespace-nowrap flex items-center gap-1.5" title="Quét đề thi từ ảnh chụp hoặc kéo thả ảnh">
                        <i class="fa-solid fa-camera-viewfinder text-amber-300"></i> Quét OCR Vision
                    </button>
                    <button onclick="AIExamStudio.autoFixAllIssues()" class="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl hover:from-purple-700 hover:to-indigo-700 transition shadow-sm btn-3d whitespace-nowrap flex items-center gap-1.5" title="Tự động kiểm tra cú pháp LaTeX, trùng đáp án và bổ sung lời giải">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> AI Auto-Fix
                    </button>
                    ${targetToolbarBtn}
    `.trim();

    teacherHtml = teacherHtml.replace(targetToolbarBtn, replacementToolbarBtns);
}

fs.writeFileSync(teacherPath, teacherHtml, 'utf8');
console.log('Successfully updated teacher.html with AI Exam Studio buttons & script!');

// 2. Cập nhật index.html nếu chưa có ai-exam-studio.js
let indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('ai-exam-studio.js')) {
    indexHtml = indexHtml.replace(
        '<script src="js/portal.js',
        '<script src="js/ai-exam-studio.js?v=3.0.0"></script>\n    <script src="js/portal.js'
    );
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log('Successfully added ai-exam-studio.js to index.html!');
}
