// js/ai-exam-studio.js - AI Exam Generator & Optimization Studio for EduMath TBS v3.0

const AIExamStudio = {
    currentVariations: [],
    currentSourceQuestion: null,
    currentRoundType: 'round1',
    currentQuestionIndex: 0,
    inspectResults: null,
    currentOcrImageBase64: null,
    ocrExtractedData: null,

    /**
     * Mở modal sinh 3 câu tương tự cho câu hỏi hiện tại
     */
    async openVariationModal(roundType, qIndex) {
        let qList = adminState?.data?.[roundType];
        if (!qList || !qList[qIndex]) {
            if (typeof showToast === 'function') showToast("Không tìm thấy dữ liệu câu hỏi!", true);
            return;
        }

        this.currentRoundType = roundType;
        this.currentQuestionIndex = qIndex;
        this.currentSourceQuestion = JSON.parse(JSON.stringify(qList[qIndex]));
        this.currentVariations = [];

        let modal = document.getElementById('ai-variation-modal');
        if (!modal) {
            this.createVariationModalDOM();
            modal = document.getElementById('ai-variation-modal');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Render câu hỏi gốc
        this.renderSourceQuestionPreview();
        
        // Tự động kích hoạt AI sinh biến thể
        await this.generateVariations();
    },

    closeVariationModal() {
        let modal = document.getElementById('ai-variation-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    createVariationModalDOM() {
        let div = document.createElement('div');
        div.id = 'ai-variation-modal';
        div.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[10002] hidden items-center justify-center p-2 sm:p-4';
        div.innerHTML = `
            <div class="bg-white rounded-3xl w-full max-w-5xl relative shadow-2xl zoom-in border-4 border-indigo-200 flex flex-col max-h-[94vh] overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-sky-50 to-purple-50 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
                            <i class="fa-solid fa-wand-magic-sparkles animate-pulse"></i>
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                AI Sinh Câu Hỏi Tương Tự
                                <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black border border-indigo-200">Gemini Engine</span>
                            </h3>
                            <p class="text-xs text-slate-500 font-semibold">Tự động giữ nguyên cấu trúc toán học, đổi số liệu đẹp và sinh lời giải chuẩn LaTeX</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="AIExamStudio.generateVariations()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition btn-3d flex items-center gap-1.5">
                            <i class="fa-solid fa-rotate"></i> <span>Sinh Lại</span>
                        </button>
                        <button onclick="AIExamStudio.closeVariationModal()" class="w-9 h-9 text-slate-400 hover:text-rose-500 text-2xl rounded-full hover:bg-white flex items-center justify-center transition">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- Body (Split Source vs AI Variations) -->
                <div class="flex-grow overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 admin-scroll">
                    <!-- Source Question (Col 4) -->
                    <div class="lg:col-span-4 bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 flex flex-col">
                        <div class="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                            <i class="fa-solid fa-file-lines text-indigo-500"></i> Câu Hỏi Gốc (Hiện Tại)
                        </div>
                        <div id="ai-var-source-preview" class="flex-grow text-xs text-slate-700 space-y-2 overflow-y-auto admin-scroll">
                            <!-- Injected by JS -->
                        </div>
                    </div>

                    <!-- AI Generated Variations (Col 8) -->
                    <div class="lg:col-span-8 flex flex-col space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-sparkles text-amber-500"></i> 3 Biến Thể Đề Xuất
                            </div>
                            <span id="ai-var-status" class="text-xs font-bold text-indigo-600">Đang chuẩn bị...</span>
                        </div>

                        <div id="ai-var-list-container" class="space-y-4">
                            <!-- Injected by JS -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    },

    renderSourceQuestionPreview() {
        let container = document.getElementById('ai-var-source-preview');
        if (!container || !this.currentSourceQuestion) return;

        let q = this.currentSourceQuestion;
        let round = this.currentRoundType;
        let html = `<div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">`;
        html += `<div class="font-bold text-slate-800 text-sm leading-relaxed">${q.text || 'Chưa có nội dung câu hỏi'}</div>`;

        if (round === 'round1' && Array.isArray(q.options)) {
            html += `<div class="space-y-1.5 pt-2">`;
            ['A', 'B', 'C', 'D'].forEach((lbl, idx) => {
                let opt = q.options[idx] || '';
                let isAns = String(q.answer).toUpperCase() === lbl || String(q.answer).trim() === String(opt).trim();
                html += `
                    <div class="p-2 rounded-lg text-xs font-medium flex items-start gap-2 ${isAns ? 'bg-emerald-50 border border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border border-slate-100'}">
                        <span class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 font-bold ${isAns ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">${lbl}</span>
                        <div class="flex-grow">${opt}</div>
                    </div>
                `;
            });
            html += `</div>`;
        } else if (round === 'round2' && Array.isArray(q.statements)) {
            html += `<div class="space-y-1.5 pt-2">`;
            q.statements.forEach((st, idx) => {
                let lbl = st.label || ['a', 'b', 'c', 'd'][idx];
                html += `
                    <div class="p-2 rounded-lg text-xs bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="font-bold uppercase text-slate-700">${lbl})</span>
                            <span>${st.text || ''}</span>
                        </div>
                        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${st.isTrue ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">${st.isTrue ? 'Đúng' : 'Sai'}</span>
                    </div>
                `;
            });
            html += `</div>`;
        } else if (round === 'round3') {
            html += `<div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mt-2">
                Đáp án: <span class="font-black text-sm">${q.answer || 'Chưa đặt'}</span>
            </div>`;
        }

        if (q.explanation) {
            html += `<div class="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs mt-2">
                <span class="font-bold block mb-1 text-[11px] uppercase tracking-wider text-indigo-700">Lời giải chi tiết:</span>
                <div class="text-[11px] leading-relaxed">${q.explanation}</div>
            </div>`;
        }

        html += `</div>`;
        container.innerHTML = html;

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([container]).catch(console.warn);
        }
    },

    /**
     * Gọi Gemini API để sinh 3 câu hỏi biến thể
     */
    async generateVariations() {
        let statusEl = document.getElementById('ai-var-status');
        let listContainer = document.getElementById('ai-var-list-container');
        if (!listContainer) return;

        if (statusEl) statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> AI đang tính toán 3 biến thể...`;
        listContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 space-y-3">
                <i class="fa-solid fa-wand-magic-sparkles text-3xl text-indigo-500 animate-bounce"></i>
                <div class="font-bold text-sm text-slate-600">AI đang thiết kế 3 biến thể câu hỏi tương tự...</div>
                <div class="text-xs text-slate-400">Đổi số liệu, giữ nguyên tính toán nghiệm đẹp và sinh lời giải từng bước</div>
            </div>
        `;

        let q = this.currentSourceQuestion;
        let round = this.currentRoundType;

        let prompt = `Bạn là chuyên gia khảo thí Toán học THPT GDPT 2018.
Nhiệm vụ: Hãy sinh đúng 3 BIẾN THỂ TƯƠNG TỰ từ câu hỏi gốc được cung cấp dưới đây.
YÊU CẦU:
1. Giữ nguyên dạng toán, phương pháp tư duy và độ khó tương đương câu gốc.
2. Đổi số liệu thông minh để nghiệm đẹp, dễ tính toán, không bị số quá cồng kềnh.
3. Sinh đầy đủ công thức chuẩn LaTeX (đặt trong dấu $...$ hoặc $$...$$).
4. Tính toán chính xác 100% đáp án và viết Lời giải chi tiết từng bước.
5. Trả về đúng 1 khối JSON chứa mảng "variations" gồm 3 đối tượng theo đúng định dạng:

CÂU HỎI GỐC DẠNG ${round.toUpperCase()}:
${JSON.stringify(q, null, 2)}
`;

        try {
            let apiKey = (typeof getGeminiApiKey === 'function') ? getGeminiApiKey() : localStorage.getItem('gemini_api_key');
            let responseSchema = {
                type: "OBJECT",
                properties: {
                    variations: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                text: { type: "STRING" },
                                options: { type: "ARRAY", items: { type: "STRING" } },
                                statements: {
                                    type: "ARRAY",
                                    items: {
                                        type: "OBJECT",
                                        properties: {
                                            label: { type: "STRING" },
                                            text: { type: "STRING" },
                                            isTrue: { type: "BOOLEAN" }
                                        },
                                        required: ["label", "text", "isTrue"]
                                    }
                                },
                                answer: { type: "STRING" },
                                explanation: { type: "STRING" },
                                level: { type: "STRING" },
                                topic: { type: "STRING" }
                            },
                            required: ["text", "explanation"]
                        }
                    }
                },
                required: ["variations"]
            };

            let payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            };

            let data;
            if (typeof callGeminiApiEndpoint === 'function') {
                data = await callGeminiApiEndpoint(payload, apiKey);
            } else {
                throw new Error("Không tìm thấy hàm callGeminiApiEndpoint");
            }

            let jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            let parsed = JSON.parse(jsonStr);
            if (!parsed || !Array.isArray(parsed.variations) || parsed.variations.length === 0) {
                throw new Error("AI không trả về danh sách biến thể hợp lệ!");
            }

            this.currentVariations = parsed.variations;
            if (statusEl) statusEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> Đã tạo thành công 3 biến thể!`;
            this.renderVariationsList();

        } catch (err) {
            console.warn("AI Generation fallback to local variation generator:", err);
            this.currentVariations = this.generateLocalVariationsFallback(q, round);
            if (statusEl) statusEl.innerHTML = `<span class="text-amber-600 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Đã tạo 3 biến thể dự phòng!</span>`;
            this.renderVariationsList();
        }
    },

    /**
     * Render danh sách 3 biến thể kèm nút Chọn thay thế / Chèn mới
     */
    renderVariationsList() {
        let container = document.getElementById('ai-var-list-container');
        if (!container || !this.currentVariations) return;

        let round = this.currentRoundType;
        let html = '';

        this.currentVariations.forEach((varQ, idx) => {
            html += `
                <div class="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 hover:border-indigo-400 transition shadow-sm space-y-3 relative group">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center shadow-xs">#${idx + 1}</span>
                            <span class="text-xs font-black text-slate-800 uppercase tracking-wide">Biến Thể ${idx + 1}</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">${varQ.level || 'Thông hiểu'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="AIExamStudio.applyVariation(${idx}, 'replace')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition btn-3d flex items-center gap-1">
                                <i class="fa-solid fa-check"></i> Thay thế câu hiện tại
                            </button>
                            <button onclick="AIExamStudio.applyVariation(${idx}, 'append')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition btn-3d flex items-center gap-1">
                                <i class="fa-solid fa-plus"></i> Thêm vào cuối đề
                            </button>
                        </div>
                    </div>

                    <div class="text-sm font-bold text-slate-800 leading-relaxed">${varQ.text}</div>
            `;

            if (round === 'round1' && Array.isArray(varQ.options)) {
                html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">`;
                ['A', 'B', 'C', 'D'].forEach((lbl, oIdx) => {
                    let opt = varQ.options[oIdx] || '';
                    let isAns = String(varQ.answer).toUpperCase() === lbl || String(varQ.answer).trim() === String(opt).trim();
                    html += `
                        <div class="p-2 rounded-xl text-xs font-semibold flex items-start gap-2 ${isAns ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border border-slate-200'}">
                            <span class="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${isAns ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">${lbl}</span>
                            <div class="flex-grow">${opt}</div>
                        </div>
                    `;
                });
                html += `</div>`;
            } else if (round === 'round2' && Array.isArray(varQ.statements)) {
                html += `<div class="space-y-1.5 pt-1">`;
                varQ.statements.forEach((st, sIdx) => {
                    let lbl = st.label || ['a', 'b', 'c', 'd'][sIdx];
                    html += `
                        <div class="p-2 rounded-xl text-xs bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="font-black uppercase text-indigo-700">${lbl})</span>
                                <span>${st.text || ''}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${st.isTrue ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">${st.isTrue ? 'Đúng' : 'Sai'}</span>
                        </div>
                    `;
                });
                html += `</div>`;
            } else if (round === 'round3') {
                html += `
                    <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                        Đáp án số: <span class="font-black text-sm">${varQ.answer || ''}</span>
                    </div>
                `;
            }

            if (varQ.explanation) {
                html += `
                    <div class="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs">
                        <div class="font-bold uppercase tracking-wider text-[10px] text-indigo-700 mb-1 flex items-center gap-1">
                            <i class="fa-solid fa-lightbulb text-amber-500"></i> Hướng dẫn giải chi tiết:
                        </div>
                        <div class="text-xs leading-relaxed">${varQ.explanation}</div>
                    </div>
                `;
            }

            html += `</div>`;
        });

        container.innerHTML = html;

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([container]).catch(console.warn);
        }
    },

    /**
     * Áp dụng biến thể vào bộ đề
     */
    applyVariation(varIndex, mode = 'replace') {
        let varQ = this.currentVariations?.[varIndex];
        if (!varQ) return;

        let round = this.currentRoundType;
        if (!adminState.data[round]) adminState.data[round] = [];

        let newQ = {
            id: varQ.id || (Date.now() + Math.floor(Math.random() * 1000)),
            text: varQ.text || '',
            level: varQ.level || 'Thông hiểu',
            topic: varQ.topic || (this.currentSourceQuestion?.topic || 'Chung'),
            explanation: varQ.explanation || ''
        };

        if (round === 'round1') {
            newQ.options = Array.isArray(varQ.options) ? varQ.options : ['A', 'B', 'C', 'D'];
            newQ.answer = varQ.answer || 'A';
            newQ.points = 0.25;
        } else if (round === 'round2') {
            newQ.statements = Array.isArray(varQ.statements) ? varQ.statements : [
                { label: 'a', text: '', isTrue: true },
                { label: 'b', text: '', isTrue: false },
                { label: 'c', text: '', isTrue: true },
                { label: 'd', text: '', isTrue: false }
            ];
            newQ.points = 1.0;
        } else if (round === 'round3') {
            newQ.answer = String(varQ.answer || '').trim();
            newQ.points = 0.5;
        }

        if (mode === 'replace') {
            adminState.data[round][this.currentQuestionIndex] = newQ;
            if (typeof showToast === 'function') showToast(`Đã thay thế thành công Câu ${this.currentQuestionIndex + 1}!`);
        } else {
            adminState.data[round].push(newQ);
            if (typeof showToast === 'function') showToast(`Đã thêm biến thể mới vào cuối ${round.toUpperCase()}!`);
        }

        GAME_DATA = JSON.parse(JSON.stringify(adminState.data));
        this.closeVariationModal();

        if (typeof renderAdminUI === 'function') {
            renderAdminUI();
        }
    },

    /**
     * Bộ sinh biến thể cục bộ thông minh (Offline Fallback)
     */
    generateLocalVariationsFallback(q, round) {
        let vars = [];
        let baseText = q.text || 'Cho hàm số $y = f(x)$';

        for (let i = 1; i <= 3; i++) {
            let factor = i + 1;
            let newText = baseText.replace(/(\d+)/g, (match) => {
                let n = parseInt(match, 10);
                return isNaN(n) ? match : (n * factor);
            });

            let v = {
                text: `${newText} (Biến thể số liệu #${i})`,
                level: q.level || 'Thông hiểu',
                topic: q.topic || 'Toán học',
                explanation: `Biến thể số liệu dạng tương tự với hệ số nhân ${factor}. Áp dụng định lý và tính toán theo các bước tương tự câu gốc.`
            };

            if (round === 'round1') {
                v.options = (q.options || ['A', 'B', 'C', 'D']).map((opt, idx) => {
                    return opt.replace(/(\d+)/g, m => (parseInt(m, 10) * factor) || m);
                });
                v.answer = q.answer || 'A';
            } else if (round === 'round2') {
                v.statements = (q.statements || []).map(st => ({
                    label: st.label,
                    text: (st.text || '').replace(/(\d+)/g, m => (parseInt(m, 10) * factor) || m),
                    isTrue: st.isTrue
                }));
            } else if (round === 'round3') {
                v.answer = String((parseFloat(q.answer) || 1) * factor);
            }

            vars.push(v);
        }

        return vars;
    },

    /**
     * Mở modal OCR Vision Scanner
     */
    openVisionScanModal() {
        let modal = document.getElementById('ai-ocr-modal');
        if (!modal) {
            this.createOcrModalDOM();
            modal = document.getElementById('ai-ocr-modal');
        }
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeVisionScanModal() {
        let modal = document.getElementById('ai-ocr-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    createOcrModalDOM() {
        let div = document.createElement('div');
        div.id = 'ai-ocr-modal';
        div.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[10002] hidden items-center justify-center p-2 sm:p-4';
        div.innerHTML = `
            <div class="bg-white rounded-3xl w-full max-w-5xl relative shadow-2xl zoom-in border-4 border-sky-200 flex flex-col max-h-[94vh] overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl shadow-md">
                            <i class="fa-solid fa-camera-viewfinder"></i>
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                Math OCR & Vision Scanner
                                <span class="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black border border-sky-200">AI Vision 3.0</span>
                            </h3>
                            <p class="text-xs text-slate-500 font-semibold">Tự động nhận diện công thức LaTeX, bảng biến thiên và trích xuất đề thi từ ảnh chụp</p>
                        </div>
                    </div>
                    <button onclick="AIExamStudio.closeVisionScanModal()" class="w-9 h-9 text-slate-400 hover:text-rose-500 text-2xl rounded-full hover:bg-white flex items-center justify-center transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Body -->
                <div class="flex-grow overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 admin-scroll">
                    <!-- Dropzone & Preview (Col 5) -->
                    <div class="lg:col-span-5 flex flex-col space-y-3">
                        <div id="ocr-dropzone" class="border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition relative min-h-[220px]">
                            <input type="file" id="ocr-file-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" onchange="AIExamStudio.handleOcrFileUpload(event)">
                            <div id="ocr-drop-prompt" class="space-y-2">
                                <i class="fa-solid fa-cloud-arrow-up text-4xl text-sky-500"></i>
                                <div class="font-black text-slate-700 text-sm">Kéo thả ảnh đề thi hoặc Click chọn ảnh</div>
                                <div class="text-[11px] font-semibold text-slate-400">Hỗ trợ PNG, JPG, JPEG hoặc dán từ Clipboard (Ctrl + V)</div>
                            </div>
                            <img id="ocr-image-preview" class="max-h-[260px] rounded-xl object-contain hidden shadow-sm border border-slate-200">
                        </div>

                        <div class="flex items-center gap-2">
                            <button onclick="AIExamStudio.startOcrScan()" id="btn-start-ocr" class="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition btn-3d flex items-center justify-center gap-2">
                                <i class="fa-solid fa-bolt"></i> Trích Xuất Bằng AI Vision
                            </button>
                        </div>
                    </div>

                    <!-- OCR Results Preview (Col 7) -->
                    <div class="lg:col-span-7 flex flex-col space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-code-compare text-indigo-500"></i> Kết Quả Nhận Diện & Preview MathJax
                            </span>
                            <button onclick="AIExamStudio.importOcrToExam()" id="btn-import-ocr" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition btn-3d hidden flex items-center gap-1.5">
                                <i class="fa-solid fa-file-import"></i> Nạp Vào Đề Thi
                            </button>
                        </div>

                        <div id="ocr-result-container" class="flex-grow bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 text-xs text-slate-700 overflow-y-auto admin-scroll min-h-[300px] flex items-center justify-center text-slate-400 font-bold">
                            Chưa có ảnh nào được trích xuất. Vui lòng tải ảnh đề thi lên!
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        // Add Clipboard Paste Listener
        window.addEventListener('paste', (e) => {
            let modal = document.getElementById('ai-ocr-modal');
            if (!modal || modal.classList.contains('hidden')) return;

            let items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    let blob = item.getAsFile();
                    AIExamStudio.loadOcrImageBlob(blob);
                    break;
                }
            }
        });
    },

    loadOcrImageBlob(blob) {
        if (!blob) return;
        let reader = new FileReader();
        reader.onload = (e) => {
            this.currentOcrImageBase64 = e.target.result.split(',')[1];
            let preview = document.getElementById('ocr-image-preview');
            let prompt = document.getElementById('ocr-drop-prompt');
            if (preview && prompt) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                prompt.classList.add('hidden');
            }
            if (typeof showToast === 'function') showToast("Đã nhận ảnh thành công!");
        };
        reader.readAsDataURL(blob);
    },

    handleOcrFileUpload(event) {
        let file = event.target.files[0];
        if (file) this.loadOcrImageBlob(file);
    },

    async startOcrScan() {
        if (!this.currentOcrImageBase64) {
            if (typeof showToast === 'function') showToast("Vui lòng tải hoặc dán ảnh trước khi quét!", true);
            return;
        }

        let btn = document.getElementById('btn-start-ocr');
        let oldHtml = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> AI đang bóc tách hình ảnh...`;
        btn.disabled = true;

        let resultContainer = document.getElementById('ocr-result-container');
        resultContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8 space-y-2 text-indigo-600">
                <i class="fa-solid fa-sparkles text-3xl animate-spin"></i>
                <div class="font-bold text-sm">Đang trích xuất công thức LaTeX và phân loại câu hỏi...</div>
            </div>
        `;

        try {
            let apiKey = (typeof getGeminiApiKey === 'function') ? getGeminiApiKey() : localStorage.getItem('gemini_api_key');
            let prompt = `Bạn là hệ thống Math OCR chuyên gia xử lý đề thi Toán THPT Việt Nam.
Hãy đọc kỹ hình ảnh được đính kèm và trích xuất tất cả các câu hỏi toán học có trong ảnh:
1. Nhận diện chính xác 100% công thức toán học và đưa về chuẩn LaTeX (dấu $...$).
2. Nếu có bảng biến thiên hoặc hình vẽ, hãy mô tả hoặc xuất mã LaTeX thích hợp.
3. Tự động phân loại câu hỏi vào đúng 3 Phần:
   - "round1": Trắc nghiệm 4 lựa chọn (options: [A, B, C, D], answer: 'A'|'B'|'C'|'D').
   - "round2": Trắc nghiệm Đúng/Sai (statements: [{label: 'a', text: '...', isTrue: true|false}]).
   - "round3": Trả lời ngắn (answer: string).
4. Trả về đúng 1 khối JSON chứa { "round1": [...], "round2": [...], "round3": [...] }.`;

            let payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: "image/jpeg", data: this.currentOcrImageBase64 } }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            };

            let data = await callGeminiApiEndpoint(payload, apiKey);
            let jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            let parsed = JSON.parse(jsonStr);

            this.ocrExtractedData = parsed;
            this.renderOcrResultPreview(parsed);

            let importBtn = document.getElementById('btn-import-ocr');
            if (importBtn) importBtn.classList.remove('hidden');

            if (typeof showToast === 'function') showToast("Đã trích xuất đề thi từ ảnh thành công!");
        } catch (e) {
            resultContainer.innerHTML = `<div class="text-rose-500 font-bold p-4 text-center">Lỗi xử lý OCR: ${e.message}</div>`;
            if (typeof showToast === 'function') showToast("Lỗi OCR: " + e.message, true);
        } finally {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
        }
    },

    renderOcrResultPreview(data) {
        let container = document.getElementById('ocr-result-container');
        if (!container) return;

        let r1 = data.round1 || [];
        let r2 = data.round2 || [];
        let r3 = data.round3 || [];
        let total = r1.length + r2.length + r3.length;

        if (total === 0) {
            container.innerHTML = `<div class="p-4 text-amber-600 font-bold text-center">Không tìm thấy câu hỏi nào trong ảnh!</div>`;
            return;
        }

        let html = `<div class="space-y-4 w-full">`;
        html += `<div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between">
            <span>Tìm thấy <b>${total}</b> câu hỏi (${r1.length} TN4LC, ${r2.length} Đúng/Sai, ${r3.length} TLN)</span>
            <span class="text-xs bg-emerald-200 px-2 py-0.5 rounded-md">OCR Ready</span>
        </div>`;

        if (r1.length > 0) {
            html += `<div class="font-black text-xs uppercase text-slate-600">Phần I: Trắc Nghiệm (${r1.length} câu)</div>`;
            r1.forEach((q, i) => {
                html += `
                    <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div class="font-bold text-slate-800"><b>Câu ${i+1}:</b> ${q.text}</div>
                        <div class="grid grid-cols-2 gap-1 text-[11px]">
                            ${(q.options || []).map((o, idx) => `<div><b>${['A','B','C','D'][idx]}.</b> ${o}</div>`).join('')}
                        </div>
                    </div>
                `;
            });
        }

        if (r2.length > 0) {
            html += `<div class="font-black text-xs uppercase text-slate-600 pt-2">Phần II: Đúng/Sai (${r2.length} câu)</div>`;
            r2.forEach((q, i) => {
                html += `
                    <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div class="font-bold text-slate-800"><b>Câu ${i+1}:</b> ${q.text}</div>
                        <div class="space-y-1 text-[11px]">
                            ${(q.statements || []).map(st => `<div><b>${st.label})</b> ${st.text} <i>(${st.isTrue ? 'Đúng' : 'Sai'})</i></div>`).join('')}
                        </div>
                    </div>
                `;
            });
        }

        if (r3.length > 0) {
            html += `<div class="font-black text-xs uppercase text-slate-600 pt-2">Phần III: Trả Lời Ngắn (${r3.length} câu)</div>`;
            r3.forEach((q, i) => {
                html += `
                    <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div class="font-bold text-slate-800"><b>Câu ${i+1}:</b> ${q.text}</div>
                        <div class="text-[11px] font-bold text-amber-700">Đáp án: ${q.answer || ''}</div>
                    </div>
                `;
            });
        }

        html += `</div>`;
        container.innerHTML = html;

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([container]).catch(console.warn);
        }
    },

    importOcrToExam() {
        if (!this.ocrExtractedData) return;
        let data = this.ocrExtractedData;

        if (!adminState.data) adminState.data = { round1: [], round2: [], round3: [] };

        ['round1', 'round2', 'round3'].forEach(r => {
            if (Array.isArray(data[r])) {
                if (!adminState.data[r]) adminState.data[r] = [];
                data[r].forEach(q => {
                    q.id = Date.now() + Math.floor(Math.random() * 10000);
                    adminState.data[r].push(q);
                });
            }
        });

        GAME_DATA = JSON.parse(JSON.stringify(adminState.data));
        this.closeVisionScanModal();

        if (typeof showToast === 'function') showToast("Đã nạp toàn bộ câu hỏi OCR vào Đề thi thành công!");
        if (typeof renderAdminUI === 'function') renderAdminUI();
    },

    /**
     * AI Exam Inspector & Auto-Fixer: Kiểm tra và sửa lỗi toàn bộ đề
     */
    inspectExam() {
        let issues = [];
        let data = adminState?.data || GAME_DATA;
        if (!data) return issues;

        ['round1', 'round2', 'round3'].forEach(r => {
            let list = data[r] || [];
            list.forEach((q, idx) => {
                let qNum = idx + 1;
                let prefix = `[${r.toUpperCase()} - Câu ${qNum}]`;

                // 1. Kiểm tra text rỗng
                if (!q.text || !q.text.trim()) {
                    issues.push({ round: r, index: idx, type: 'empty_text', msg: `${prefix} Nội dung câu hỏi đang bị rỗng.` });
                }

                // 2. Kiểm tra đóng mở dấu LaTeX
                let dollarCount = (q.text.match(/\$/g) || []).length;
                if (dollarCount % 2 !== 0) {
                    issues.push({ round: r, index: idx, type: 'latex_unclosed', msg: `${prefix} Thiếu dấu đóng/mở công thức LaTeX ($).` });
                }

                // 3. Kiểm tra trắc nghiệm 4 lựa chọn
                if (r === 'round1') {
                    if (!q.options || q.options.length < 4) {
                        issues.push({ round: r, index: idx, type: 'missing_options', msg: `${prefix} Chưa đủ 4 phương án lựa chọn A, B, C, D.` });
                    }
                    if (!q.answer) {
                        issues.push({ round: r, index: idx, type: 'missing_answer', msg: `${prefix} Chưa chọn đáp án đúng.` });
                    }
                }

                // 4. Kiểm tra Đúng/Sai 4 ý
                if (r === 'round2') {
                    if (!q.statements || q.statements.length < 4) {
                        issues.push({ round: r, index: idx, type: 'missing_statements', msg: `${prefix} Chưa đủ 4 ý a), b), c), d).` });
                    }
                }

                // 5. Kiểm tra Trả lời ngắn
                if (r === 'round3') {
                    if (!q.answer || !String(q.answer).trim()) {
                        issues.push({ round: r, index: idx, type: 'missing_answer', msg: `${prefix} Chưa điền đáp số cho câu trả lời ngắn.` });
                    }
                }

                // 6. Kiểm tra lời giải chi tiết
                if (!q.explanation || !q.explanation.trim()) {
                    issues.push({ round: r, index: idx, type: 'missing_explanation', msg: `${prefix} Chưa có hướng dẫn giải chi tiết.` });
                }
            });
        });

        this.inspectResults = issues;
        return issues;
    },

    /**
     * Tự động sửa toàn bộ lỗi bằng AI
     */
    async autoFixAllIssues() {
        let issues = this.inspectExam();
        if (issues.length === 0) {
            if (typeof showToast === 'function') showToast("Đề thi hoàn hảo! Không phát hiện lỗi nào.");
            return;
        }

        if (typeof showToast === 'function') showToast(`Đang sửa tự động ${issues.length} lỗi...`);

        let data = adminState?.data || GAME_DATA;
        let apiKey = (typeof getGeminiApiKey === 'function') ? getGeminiApiKey() : localStorage.getItem('gemini_api_key');

        let prompt = `Bạn là chuyên gia thẩm định và sửa lỗi đề thi Toán học THPT.
Hãy kiểm tra, chuẩn hóa và sửa chữa toàn bộ các lỗi cú pháp LaTeX, bổ sung đáp án hoặc lời giải chi tiết còn thiếu trong bộ đề thi dưới đây:
${JSON.stringify(data, null, 2)}

YÊU CẦU:
1. Chuẩn hóa tất cả các công thức LaTeX bị thiếu dấu $.
2. Đảm bảo phần 1 đủ 4 phương án A, B, C, D và có đáp án đúng.
3. Đảm bảo phần 2 đủ 4 ý a, b, c, d có cờ isTrue (true/false).
4. Bổ sung lời giải chi tiết (explanation) từng bước cho tất cả các câu chưa có.
5. Trả về đúng 1 khối JSON nguyên vẹn cấu trúc { "round1": [...], "round2": [...], "round3": [...] }.`;

        try {
            let payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            };

            let res = await callGeminiApiEndpoint(payload, apiKey);
            let jsonStr = res.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            let fixedData = JSON.parse(jsonStr);

            if (fixedData && (fixedData.round1 || fixedData.round2 || fixedData.round3)) {
                adminState.data = fixedData;
                GAME_DATA = JSON.parse(JSON.stringify(adminState.data));
                if (typeof showToast === 'function') showToast("AI đã tự động sửa và chuẩn hóa toàn bộ đề thi thành công!");
                if (typeof renderAdminUI === 'function') renderAdminUI();
            }
        } catch (e) {
            if (typeof showToast === 'function') showToast("Lỗi Auto-Fix: " + e.message, true);
        }
    }
};

window.AIExamStudio = AIExamStudio;
