/**
 * High School Math Dictionary Engine (Anh - Việt GDPT 2018 / Cambridge)
 * Dynamic Glossary Tooltip Engine for Bilingual Math Learning
 */

window.MATH_GLOSSARY_DB = [
    // --- ALGEBRA & CALCULUS ---
    { en: "Derivative", vi: "Đạo hàm", desc: "Tốc độ thay đổi của hàm số tại một điểm.", category: "Calculus" },
    { en: "Integral", vi: "Tích phân", desc: "Diện tích dưới đường cong đồ thị hàm số.", category: "Calculus" },
    { en: "Antiderivative", vi: "Nguyên hàm", desc: "Hàm số F(x) sao cho F'(x) = f(x).", category: "Calculus" },
    { en: "Asymptote", vi: "Tiệm cận", desc: "Đường thẳng mà đồ thị tiến dần tới nhưng không chạm.", category: "Calculus" },
    { en: "Horizontal Asymptote", vi: "Tiệm cận ngang", desc: "Tiệm cận song song hoặc trùng với trục hoành Ox.", category: "Calculus" },
    { en: "Vertical Asymptote", vi: "Tiệm cận đứng", desc: "Tiệm cận song song hoặc trùng với trục tung Oy.", category: "Calculus" },
    { en: "Inflection point", vi: "Điểm uốn", desc: "Điểm mà tại đó đồ thị đổi chiều lồi/lõm.", category: "Calculus" },
    { en: "Monotonicity", vi: "Tính đơn điệu", desc: "Tính chất đồng biến (tăng) hoặc nghịch biến (giảm).", category: "Calculus" },
    { en: "Maximum value", vi: "Giá trị lớn nhất (GTLN)", desc: "Giá trị lớn nhất của hàm số trên tập xác định.", category: "Calculus" },
    { en: "Minimum value", vi: "Giá trị nhỏ nhất (GTNN)", desc: "Giá trị nhỏ nhất của hàm số trên tập xác định.", category: "Calculus" },
    { en: "Logarithm", vi: "Lôgarit", desc: "Phép toán ngược của phép nâng lên lũy thừa.", category: "Algebra" },
    { en: "Exponent", vi: "Số mũ / Lũy thừa", desc: "Số lần nhân một số với chính nó.", category: "Algebra" },
    { en: "Domain", vi: "Tập xác định", desc: "Tập hợp tất cả các giá trị đầu vào x khả thi.", category: "Algebra" },
    { en: "Range", vi: "Tập giá trị", desc: "Tập hợp tất cả các giá trị đầu ra y hàm số đạt được.", category: "Algebra" },
    
    // --- GEOMETRY 3D (OXYZ) ---
    { en: "Sphere", vi: "Mặt cầu", desc: "Tập hợp các điểm cách đều tâm I một khoảng R trong không gian.", category: "Geometry 3D" },
    { en: "Radius", vi: "Bán kính", desc: "Khoảng cách từ tâm đến bất kỳ điểm nào trên đường tròn/mặt cầu.", category: "Geometry 3D" },
    { en: "Center", vi: "Tâm", desc: "Điểm gốc cách đều các điểm trên mặt cầu/đường tròn.", category: "Geometry 3D" },
    { en: "Vector", vi: "Véctơ", desc: "Đoạn thẳng có hướng trong không gian.", category: "Geometry 3D" },
    { en: "Normal vector", vi: "Véctơ pháp tuyến", desc: "Véctơ vuông góc với mặt phẳng.", category: "Geometry 3D" },
    { en: "Direction vector", vi: "Véctơ chỉ phương", desc: "Véctơ song song hoặc trùng với đường thẳng.", category: "Geometry 3D" },
    { en: "Plane", vi: "Mặt phẳng", desc: "Bề mặt phẳng 2D mở rộng vô tận trong không gian 3D.", category: "Geometry 3D" },

    // --- PROBABILITY & STATISTICS ---
    { en: "Probability", vi: "Xác suất", desc: "Khả năng xảy ra của một biến cố.", category: "Statistics" },
    { en: "Variance", vi: "Phương sai", desc: "Độ đo mức độ phân tán của dữ liệu so với giá trị trung bình.", category: "Statistics" },
    { en: "Standard deviation", vi: "Độ lệch chuẩn", desc: "Căn bậc hai của phương sai.", category: "Statistics" },
    { en: "Combination", vi: "Tổ hợp", desc: "Cách chọn k phần tử từ n phần tử không tính thứ tự.", category: "Combinatorics" },
    { en: "Permutation", vi: "Chỉnh hợp / Hoán vị", desc: "Cách chọn k phần tử từ n phần tử có tính thứ tự.", category: "Combinatorics" }
];

function lookupMathTerm(termEn) {
    if (!termEn) return null;
    const clean = termEn.trim().toLowerCase();
    return window.MATH_GLOSSARY_DB.find(x => x.en.toLowerCase() === clean || x.vi.toLowerCase() === clean);
}

function renderGlossaryTooltipHtml(termEn) {
    const item = lookupMathTerm(termEn);
    if (!item) return termEn;
    return `<span class="group relative inline-block cursor-help border-b border-dashed border-amber-500 font-bold text-indigo-600 hover:text-amber-600 transition">
        ${item.en}
        <span class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-56 rounded-xl bg-slate-900 p-2.5 text-xs text-white shadow-2xl group-hover:block z-50">
            <span class="block font-black text-amber-400 text-sm mb-0.5">${item.en} = ${item.vi}</span>
            <span class="block text-slate-300 text-[11px] leading-tight">${item.desc}</span>
            <span class="mt-1 block text-[9px] uppercase tracking-wider text-slate-400 font-bold">${item.category}</span>
        </span>
    </span>`;
}

window.lookupMathTerm = lookupMathTerm;
window.renderGlossaryTooltipHtml = renderGlossaryTooltipHtml;


function renderGlossaryTooltipsInText(text) {
    if (!text || !window.MATH_GLOSSARY_DB) return text;
    let result = text;
    window.MATH_GLOSSARY_DB.forEach(item => {
        try {
            const regex = new RegExp(`\\b(${item.en})\\b`, 'gi');
            result = result.replace(regex, (match) => {
                return `<span class="group relative inline-block cursor-help border-b-2 border-dashed border-amber-500 font-bold text-indigo-600 hover:text-amber-600 transition">
                    ${match}
                    <span class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-60 rounded-2xl bg-slate-900/95 p-3 text-xs text-white shadow-2xl group-hover:block z-50 text-left border border-slate-700 backdrop-blur-md">
                        <span class="block font-black text-amber-400 text-sm mb-0.5">${item.en} = ${item.vi}</span>
                        <span class="block text-slate-300 text-[11px] leading-tight mb-1">${item.desc}</span>
                        <span class="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] uppercase tracking-wider font-extrabold border border-amber-500/30">${item.category}</span>
                    </span>
                </span>`;
            });
        } catch(e) {}
    });
    return result;
}

function getBilingualQuestionHtml(q, langOverride) {
    let lang = langOverride || window.APP_LANG || 'vi';
    let viText = q.content_vi || q.text_vi || q.text || q.content || '';
    let enText = q.content_en || q.text_en || '';
    
    if (lang === 'en' && enText) {
        return `<div class="bilingual-q-en font-medium text-slate-900 leading-relaxed">${renderGlossaryTooltipsInText(enText)}</div>`;
    }
    if (lang === 'bilingual' && enText && viText && enText !== viText) {
        return `
            <div class="space-y-3 my-1">
                <div class="p-3.5 bg-indigo-50/80 rounded-2xl border-l-4 border-indigo-600 text-indigo-950 font-semibold text-sm shadow-2xs">
                    <div class="flex items-center gap-1.5 mb-1.5">
                        <span class="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">🇻🇳 TIẾNG VIỆT</span>
                    </div>
                    <div class="leading-relaxed">${viText}</div>
                </div>
                <div class="p-3.5 bg-sky-50/80 rounded-2xl border-l-4 border-sky-500 text-slate-900 font-medium text-sm shadow-2xs">
                    <div class="flex items-center gap-1.5 mb-1.5">
                        <span class="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-black uppercase tracking-wider">🇬🇧 ENGLISH (CLIL)</span>
                    </div>
                    <div class="leading-relaxed">${renderGlossaryTooltipsInText(enText)}</div>
                </div>
            </div>
        `;
    }
    return `<div class="text-slate-900 font-bold leading-relaxed">${viText}</div>`;
}

window.renderGlossaryTooltipsInText = renderGlossaryTooltipsInText;
window.getBilingualQuestionHtml = getBilingualQuestionHtml;


// ==================== PHASE 3: AI ASSISTANT & GLOSSARY MODALS ====================

function openMathGlossarySearchModal() {
    let modal = document.getElementById('math-glossary-search-modal');
    if (modal) {
        modal.classList.remove('hidden');
        performGlossarySearch('');
        setTimeout(() => document.getElementById('glossary-search-input')?.focus(), 100);
    }
}

function closeMathGlossarySearchModal() {
    let modal = document.getElementById('math-glossary-search-modal');
    if (modal) modal.classList.add('hidden');
}

function performGlossarySearch(query) {
    let q = (query || document.getElementById('glossary-search-input')?.value || '').trim().toLowerCase();
    let container = document.getElementById('glossary-search-results');
    if (!container) return;

    let filtered = window.MATH_GLOSSARY_DB || [];
    if (q) {
        filtered = filtered.filter(item => 
            item.en.toLowerCase().includes(q) || 
            item.vi.toLowerCase().includes(q) || 
            item.desc.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400 font-bold">
                <i class="fa-solid fa-ghost text-4xl mb-2 block opacity-40"></i>
                Không tìm thấy thuật ngữ nào phù hợp với "${query}"
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => `
        <div class="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-left space-y-1">
            <div class="flex items-center justify-between">
                <span class="font-black text-indigo-900 text-sm sm:text-base">${item.en}</span>
                <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">${item.category}</span>
            </div>
            <div class="font-bold text-emerald-600 text-xs sm:text-sm">🇻🇳 ${item.vi}</div>
            <div class="text-slate-600 text-xs leading-relaxed mt-1">${item.desc}</div>
        </div>
    `).join('');
}

function openStudentAiAssistantModal() {
    let modal = document.getElementById('ai-student-assistant-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    renderStudentAiAssistantContent('glossary');
}

function closeStudentAiAssistantModal() {
    let modal = document.getElementById('ai-student-assistant-modal');
    if (modal) modal.classList.add('hidden');
}

function renderStudentAiAssistantContent(tab) {
    let q = (typeof state !== 'undefined' && state.currentQuestion) ? state.currentQuestion : null;
    let area = document.getElementById('ai-assistant-tab-content');
    if (!area) return;

    let tabGlossaryBtn = document.getElementById('tab-ai-glossary');
    let tabHintBtn = document.getElementById('tab-ai-hint');

    if (tab === 'glossary') {
        if (tabGlossaryBtn) tabGlossaryBtn.className = "py-2.5 px-4 rounded-xl font-black text-xs transition bg-indigo-600 text-white shadow-md";
        if (tabHintBtn) tabHintBtn.className = "py-2.5 px-4 rounded-xl font-black text-xs transition bg-slate-100 text-slate-600 hover:bg-slate-200";

        if (!q) {
            area.innerHTML = `<div class="text-center py-6 text-slate-400 font-bold">Vui lòng chọn một câu hỏi để xem thuật ngữ liên quan!</div>`;
            return;
        }

        let qText = (q.content_en || q.text_en || q.text || q.content || '');
        let detected = (window.MATH_GLOSSARY_DB || []).filter(item => {
            const regex = new RegExp(`\\b(${item.en})\\b`, 'gi');
            return regex.test(qText);
        });

        if (detected.length === 0) {
            area.innerHTML = `
                <div class="text-center py-6 text-slate-500 font-medium">
                    <i class="fa-solid fa-book-open text-3xl mb-2 text-indigo-400 block"></i>
                    Không phát hiện thuật ngữ tiếng Anh nâng cao trong câu hỏi này. Bạn có thể mở <b>Từ điển Toán học đầy đủ</b> để tra cứu!
                    <button onclick="closeStudentAiAssistantModal(); openMathGlossarySearchModal();" class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md">
                        <i class="fa-solid fa-magnifying-glass mr-1"></i> Mở Từ Điển Đầy Đủ
                    </button>
                </div>
            `;
            return;
        }

        area.innerHTML = `
            <div class="space-y-2 text-left">
                <div class="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <i class="fa-solid fa-graduation-cap text-indigo-600"></i> Thuật ngữ phát hiện trong câu hỏi hiện tại:
                </div>
                ${detected.map(item => `
                    <div class="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-left">
                        <div class="font-black text-indigo-950 text-sm flex items-center justify-between">
                            <span>${item.en}</span>
                            <span class="text-emerald-700 font-bold text-xs">🇻🇳 ${item.vi}</span>
                        </div>
                        <div class="text-slate-600 text-xs mt-1">${item.desc}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'hint') {
        if (tabGlossaryBtn) tabGlossaryBtn.className = "py-2.5 px-4 rounded-xl font-black text-xs transition bg-slate-100 text-slate-600 hover:bg-slate-200";
        if (tabHintBtn) tabHintBtn.className = "py-2.5 px-4 rounded-xl font-black text-xs transition bg-indigo-600 text-white shadow-md";

        if (!q) {
            area.innerHTML = `<div class="text-center py-6 text-slate-400 font-bold">Vui lòng chọn một câu hỏi!</div>`;
            return;
        }

        let viText = q.content_vi || q.text_vi || q.text || q.content || '';
        let enText = q.content_en || q.text_en || '';

        area.innerHTML = `
            <div class="space-y-3 text-left">
                <div class="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold leading-relaxed flex items-start gap-2">
                    <i class="fa-solid fa-lightbulb text-amber-500 text-base shrink-0 mt-0.5"></i>
                    <div><b>Gợi ý tư duy làm bài (Math Hints):</b> Hãy chú ý các từ khóa toán học chính và công thức liên quan trước khi tính toán.</div>
                </div>

                ${enText ? `
                    <div class="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-slate-800 text-xs">
                        <div class="font-black text-sky-900 uppercase tracking-wider text-[10px] mb-1">🇬🇧 English Translation:</div>
                        <div>${enText}</div>
                    </div>
                ` : ''}

                <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-slate-800 text-xs">
                    <div class="font-black text-emerald-900 uppercase tracking-wider text-[10px] mb-1">🇻🇳 Nội dung Tiếng Việt:</div>
                    <div>${viText}</div>
                </div>
            </div>
        `;
    }
}

function toggleBilingualPresentationPanel() {
    if (typeof openMathGlossarySearchModal === 'function') {
        openMathGlossarySearchModal();
    }
}

window.openMathGlossarySearchModal = openMathGlossarySearchModal;
window.closeMathGlossarySearchModal = closeMathGlossarySearchModal;
window.performGlossarySearch = performGlossarySearch;
window.openStudentAiAssistantModal = openStudentAiAssistantModal;
window.closeStudentAiAssistantModal = closeStudentAiAssistantModal;
window.renderStudentAiAssistantContent = renderStudentAiAssistantContent;
window.toggleBilingualPresentationPanel = toggleBilingualPresentationPanel;
