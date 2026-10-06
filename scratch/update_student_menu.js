const fs = require('fs');
const path = require('path');

const studentHtmlPath = path.join(__dirname, '..', 'student.html');
let html = fs.readFileSync(studentHtmlPath, 'utf8');

const target = `<button onclick="renderDashboard(); toggleStudentMenu(event);" class="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-xl font-bold text-slate-600 transition border-b border-slate-100 text-xs">
            <i class="fa-solid fa-house w-5 text-indigo-500"></i> Bảng Tổng Quan
        </button>`;

const replacement = `<button onclick="renderDashboard(); toggleStudentMenu(event);" class="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-xl font-bold text-slate-600 transition border-b border-slate-100 text-xs">
            <i class="fa-solid fa-house w-5 text-indigo-500"></i> Bảng Tổng Quan
        </button>
        <button onclick="startMillionaireGame(); toggleStudentMenu(event);" class="w-full text-left px-4 py-2.5 hover:bg-amber-50 rounded-xl font-bold text-amber-800 transition border-b border-slate-100 text-xs flex items-center justify-between">
            <span><i class="fa-solid fa-gamepad w-5 text-amber-500"></i> Đấu Trường Games</span>
            <span class="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-black border border-amber-300">4 Games</span>
        </button>`;

const normalize = s => s.replace(/\\r\\n/g, '\\n');

if (normalize(html).includes(normalize(target))) {
    html = normalize(html).replace(normalize(target), replacement);
    fs.writeFileSync(studentHtmlPath, html, 'utf8');
    console.log('Successfully updated persistent-dropdown-menu in student.html!');
} else {
    console.error('Target not found in student.html');
}
