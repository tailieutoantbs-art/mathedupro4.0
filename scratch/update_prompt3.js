const fs = require('fs');

let teacher = fs.readFileSync('js/teacher.js', 'utf8');
const tmpl3 = fs.readFileSync('scratch/prompt3_template.txt', 'utf8');

// 1. Update updateTheoryLivePreview to include Mindmap rendering
const targetHeader = `<!-- Header / Tiêu đề & Bức tranh tổng quan -->
                <div class="\${cardCls} \${themeCardCls} p-5 mb-4 border transition-all">
                    <h3 class="font-black text-base md:text-lg mb-1.5 font-display uppercase tracking-wide flex items-center gap-2">
                        <i class="fa-solid fa-bookmark"></i> \${t.title || 'Tiêu đề lý thuyết...'}
                    </h3>
                    <div class="prose-math \${alignCls} \${fontCls} leading-relaxed">
                        \${parseMarkdownSafe(t.summary || '*Chưa có phần tóm tắt khái niệm...*', false)}
                    </div>
                </div>`;

const mindmapSnippet = `
                <!-- Mindmap & Infographic Overview (if available) -->
                \${t.mindmap && Array.isArray(t.mindmap.branches) && t.mindmap.branches.length > 0 ? \`
                <div class="\${cardCls} p-5 mb-4 border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-purple-50/60 shadow-2xs">
                    <div class="font-black text-xs md:text-sm uppercase tracking-wider text-indigo-950 mb-3.5 flex items-center justify-between pb-2 border-b border-indigo-100">
                        <span class="flex items-center gap-2">
                            <i class="fa-solid fa-sitemap text-indigo-600 text-sm"></i>
                            <span>Sơ Đồ Tư Duy & Bức Tranh Tổng Thể: \${t.mindmap.root || t.title || 'Toán Học'}</span>
                        </span>
                        <span class="text-[10px] bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs">Infographic</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        \${t.mindmap.branches.map(b => \`
                            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 transition hover:shadow-xs" style="border-top: 3.5px solid \${b.color || '#3b82f6'}">
                                <div class="font-black text-xs flex items-center gap-1.5" style="color: \${b.color || '#1e293b'}">
                                    <i class="fa-solid \${b.icon || 'fa-circle-dot'} text-xs"></i>
                                    <span>\${b.name || 'Nhánh kiến thức'}</span>
                                </div>
                                <ul class="text-[11px] text-slate-700 space-y-1 pl-1 font-medium leading-relaxed">
                                    \${(b.subBranches || []).map(sb => \`<li class="flex items-start gap-1"><span class="text-indigo-400 font-bold">•</span><span class="prose-math">\${parseMarkdownSafe(sb, false)}</span></li>\`).join('')}
                                </ul>
                            </div>
                        \`).join('')}
                    </div>
                </div>\` : ''}
`;

if (teacher.includes(targetHeader)) {
  teacher = teacher.replace(targetHeader, targetHeader + mindmapSnippet);
  console.log('Successfully added Mindmap rendering to updateTheoryLivePreview!');
} else {
  console.warn('targetHeader not found in teacher.js');
}

// 2. Update generateTheoryAiPromptText
const idxFnStart = teacher.indexOf('function generateTheoryAiPromptText()');
const idxFnEnd = teacher.indexOf('function parseAndRepairTheoryJson');

if (idxFnStart === -1 || idxFnEnd === -1) {
  console.error('generateTheoryAiPromptText indices not found!');
  process.exit(1);
}

const newGenerateTheoryFn = `function generateTheoryAiPromptText() {
            let topic = document.getElementById('ai-theory-topic')?.value.trim() || 'Cực trị hàm số & Bài toán tối ưu Toán 12';
            let grade = document.getElementById('ai-theory-grade')?.value || '12';
            let extra = document.getElementById('ai-theory-extra')?.value.trim() || '';

            let rawTmpl3 = ${JSON.stringify(tmpl3)};

            let prompt = rawTmpl3
                .replace(/\\{\\{GRADE\\}\\}/g, grade)
                .replace(/\\{\\{TOPIC\\}\\}/g, topic);

            if (extra) {
                prompt += \`\\n══════════════════════════════════════════════════════════════════════════════\\nYÊU CẦU BỔ SUNG TỪ GIÁO VIÊN:\\n══════════════════════════════════════════════════════════════════════════════\\n\${extra}\\n\`;
            }

            let resEl = document.getElementById('ai-theory-prompt-result');
            if (resEl) {
                resEl.value = prompt;
            }
            return prompt;
        }

        `;

teacher = teacher.substring(0, idxFnStart) + newGenerateTheoryFn + teacher.substring(idxFnEnd);
fs.writeFileSync('js/teacher.js', teacher, 'utf8');
console.log('Successfully updated teacher.js with Prompt 3! New size:', teacher.length);
