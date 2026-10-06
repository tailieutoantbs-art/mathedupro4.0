        // CONFIG & FIREBASE INIT (Moved to config.js) 

        const DEFAULT_GAME_DATA = { 
            round1: [ { id: 1, text: "Trong không gian $Oxyz$, cho mặt phẳng $(P)$...", image: "", options: ["Phương án A", "Phương án B", "Phương án C", "Phương án D"], answer: "Phương án A", points: 10, explanation: "" } ], 
            round2: [ { id: 1, text: "Cho hình lập phương $ABCD$...", image: "", statements: [ { label: "a", text: "Ý a", isTrue: true, points: 10 }, { label: "b", text: "Ý b", isTrue: false, points: 10 }, { label: "c", text: "Ý c", isTrue: true, points: 10 }, { label: "d", text: "Ý d", isTrue: false, points: 10 } ], explanation: "" } ], 
            round3: [ { id: 1, text: "Nghiệm của phương trình $\\log_3(5x)=2$ là", image: "", answer: "1", points: 15, explanation: "" } ],
            theory: {
                title: "Tóm tắt Lý thuyết & Công thức trọng tâm",
                summary: "Nắm vững các khái niệm định nghĩa, định lý và công thức cốt lõi trước khi làm bài thi.",
                sections: [
                    {
                        id: 1,
                        title: "1. Khái niệm & Định lý then chốt",
                        content: "Nắm vững định nghĩa bản chất, tập xác định và các tính chất cơ bản.",
                        example: {
                            question: "Ví dụ áp dụng ngay: Cho hàm số $y = f(x)$ liên tục trên $\\mathbb{R}$...",
                            solution: "**Lời giải chi tiết:**\n- Bước 1: Xét điều kiện xác định.\n- Bước 2: Biến đổi và kết luận."
                        }
                    }
                ],
                formulas: ["$$(a+b)^2 = a^2 + 2ab + b^2$$", "$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$$"],
                methods: "1. Đọc kỹ đề bài và xác định dạng toán.\n2. Áp dụng công thức giải nhanh hoặc thiết lập hệ phương trình.\n3. Kiểm tra điều kiện xác định và đối chiếu kết quả.",
                traps: "Chú ý điều kiện có nghĩa của biểu thức dưới căn bậc chẵn, mẫu số khác 0 và cơ số logarit.",
                examples: [],
                applications: [],
                practiceExercises: [
                    {
                        id: 1,
                        level: "Vận dụng",
                        question: "Bài tự luyện 1: Tìm nghiệm của phương trình $2^{2x} - 3 \\cdot 2^x + 2 = 0$.",
                        shortAnswer: "$x = 0$ hoặc $x = 1$",
                        hint: "**Phương pháp giải:** Đặt $t = 2^x > 0$, phương trình trở thành $t^2 - 3t + 2 = 0 \\Leftrightarrow t = 1$ hoặc $t = 2$. Do đó $x = 0$ hoặc $x = 1$."
                    }
                ],
                rawMarkdown: "",
                style: { align: "left", fontSize: "base", theme: "teal", cardStyle: "modern" }
            },
            lectures: [
                {
                    id: 1,
                    title: "Đơn vị kiến thức 1: Kiến thức nền tảng",
                    content: "### 📌 Trọng tâm bài học\n- Khái niệm và tính chất cơ bản.\n- Biểu diễn hình học và mô hình toán học tương ứng.",
                    teacherNote: "Nhắc học sinh quan sát đồ thị và ghi nhớ dạng bảng biến thiên.",
                    steps: [
                        "Bước 1: Thiết lập giả thiết và tìm tập xác định $D$.",
                        "Bước 2: Tính đạo hàm $y'$ và tìm nghiệm $y' = 0$.",
                        "Bước 3: Lập bảng biến thiên và kết luận tính đơn điệu / cực trị."
                    ]
                }
            ],
            lecturesStyle: { align: "left", fontSize: "xl", theme: "teal", cardStyle: "modern", animation: "fade" }
        };

        function removeVietnameseTones(str) {
            if (!str || typeof str !== 'string') return '';
            return str.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d").replace(/Đ/g, "D");
        }

        function stripJsonComments(str) {
            if (!str) return '';
            str = str.replace(/\/\*[\s\S]*?\*\//g, '');
            let inString = false;
            let esc = false;
            let out = '';
            for (let i = 0; i < str.length; i++) {
                let char = str[i];
                if (char === '"' && !esc) {
                    inString = !inString;
                    out += char;
                } else if (!inString && char === '/' && str[i + 1] === '/') {
                    while (i < str.length && str[i] !== '\n' && str[i] !== '\r') {
                        i++;
                    }
                    if (i < str.length) out += str[i];
                } else {
                    if (char === '\\' && inString) esc = !esc;
                    else esc = false;
                    out += char;
                }
            }
            return out;
        }

        function extractBestJsonString(rawStr) {
            if (!rawStr || typeof rawStr !== 'string') return null;
            let str = rawStr.trim();
            str = str.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
            let matches = [];
            let match;
            while ((match = codeBlockRegex.exec(str)) !== null) {
                if (match[1] && match[1].trim()) matches.push(match[1].trim());
            }

            if (matches.length > 0) {
                let best = matches.find(m => m.includes('{') && (m.includes('round') || m.includes('phan') || m.includes('options') || m.includes('statements') || m.includes('dethi')));
                if (!best) best = matches.find(m => m.includes('{') && m.includes('}'));
                if (best) str = best;
                else str = matches[0];
            }

            const firstBrace = str.indexOf('{');
            const firstBracket = str.indexOf('[');
            let startIdx = -1;
            let endIdx = -1;

            if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
                startIdx = firstBrace;
                endIdx = str.lastIndexOf('}');
            } else if (firstBracket !== -1) {
                startIdx = firstBracket;
                endIdx = str.lastIndexOf(']');
            }

            if (startIdx !== -1 && endIdx > startIdx) {
                str = str.substring(startIdx, endIdx + 1);
            }
            return str;
        }

        function normalizeExamDataKeys(obj) {
            if (!obj) return { round1: [], round2: [], round3: [] };

            const isMatrixOrMetaKey = (cleanK) => {
                return ['matran', 'matrix', 'matrixdata', 'bandacta', 'specdata', 'dacta', 'bangdapan', 'dapan', 'answerkey', 'huongdancham', 'loigiai'].some(k => cleanK.includes(k));
            };

            const classifyQuestion = (q) => {
                if (!q || typeof q !== 'object') return null;
                if (q.nb !== undefined && q.th !== undefined && !q.text && !q.question && !q.content && !q.noidung) return null;
                if (q.reqSkill !== undefined && q.questions !== undefined && !q.text && !q.question && !q.content && !q.noidung) return null;

                let rVal = String(q.round || q.part || q.phan || q.type || q.roundType || '').toLowerCase();
                rVal = removeVietnameseTones(rVal).replace(/[^a-z0-9]/g, '');
                if (['1', 'round1', 'part1', 'phan1', 'phani', 'tracnghiem', 'mc', 'p1'].some(k => rVal.includes(k))) return 'round1';
                if (['2', 'round2', 'part2', 'phan2', 'phanii', 'dungsai', 'tf', 'p2'].some(k => rVal.includes(k))) return 'round2';
                if (['3', 'round3', 'part3', 'phan3', 'phaniii', 'traloingan', 'sa', 'p3'].some(k => rVal.includes(k))) return 'round3';

                if (Array.isArray(q.statements) || q.isTrue !== undefined || q.y_a || q.yA || q.statement_a) return 'round2';
                if (Array.isArray(q.options) || (q.optionA && q.optionB) || (q.a && q.b && q.c && q.d)) return 'round1';
                if (q.answer !== undefined || q.dapan !== undefined || q.correct !== undefined) return 'round3';
                return 'round1';
            };

            let res = { round1: [], round2: [], round3: [] };

            if (Array.isArray(obj)) {
                obj.forEach(q => {
                    let cat = classifyQuestion(q);
                    if (cat) res[cat].push(q);
                });
                return res;
            }

            if (typeof obj !== 'object') return res;

            for (let subKey of ['dethi', 'exam', 'questions', 'data', 'content', 'phan3', 'phan3_dethi', 'de_thi', 'payload', 'items', 'list']) {
                if (obj[subKey] && typeof obj[subKey] === 'object') {
                    if (Array.isArray(obj[subKey])) {
                        obj[subKey].forEach(q => {
                            let cat = classifyQuestion(q);
                            if (cat) res[cat].push(q);
                        });
                    } else {
                        let subRes = normalizeExamDataKeys(obj[subKey]);
                        if (subRes.round1?.length || subRes.round2?.length || subRes.round3?.length) {
                            res.round1.push(...(subRes.round1 || []));
                            res.round2.push(...(subRes.round2 || []));
                            res.round3.push(...(subRes.round3 || []));
                        }
                    }
                }
            }

            for (let k of Object.keys(obj)) {
                let cleanK = removeVietnameseTones(k).toLowerCase().replace(/[^a-z0-9]/g, '');
                if (isMatrixOrMetaKey(cleanK)) continue;

                let val = obj[k];
                if (Array.isArray(val)) {
                    if (['round1', 'part1', 'phan1', 'phani', 'tracnghiem', 'mc', 'p1'].some(t => cleanK.includes(t))) {
                        res.round1.push(...val);
                    } else if (['round2', 'part2', 'phan2', 'phanii', 'dungsai', 'tf', 'p2'].some(t => cleanK.includes(t))) {
                        res.round2.push(...val);
                    } else if (['round3', 'part3', 'phan3', 'phaniii', 'traloingan', 'sa', 'p3'].some(t => cleanK.includes(t))) {
                        res.round3.push(...val);
                    } else {
                        val.forEach(q => {
                            let cat = classifyQuestion(q);
                            if (cat) res[cat].push(q);
                        });
                    }
                }
            }

            if (res.round1.length === 0 && Array.isArray(obj.round1)) res.round1 = obj.round1;
            if (res.round2.length === 0 && Array.isArray(obj.round2)) res.round2 = obj.round2;
            if (res.round3.length === 0 && Array.isArray(obj.round3)) res.round3 = obj.round3;
            if (obj.matrixData) res.matrixData = obj.matrixData;
            if (obj.specData) res.specData = obj.specData;
            if (obj.theory) res.theory = obj.theory;
            if (obj.lectures) res.lectures = obj.lectures;

            return res;
        }

        function smartParseJSON(rawStr) {
            if (!rawStr || typeof rawStr !== 'string') return null;
            let str = extractBestJsonString(rawStr);
            if (!str) return null;

            str = stripJsonComments(str);
            const cleanJsonStr = (s) => s.replace(/,\s*([\]}])/g, '$1');

            const tryParse = (s) => {
                let cleaned = cleanJsonStr(s);
                return JSON.parse(cleaned);
            };

            try {
                let obj = tryParse(str);
                return normalizeExamDataKeys(obj);
            } catch (e) {
                try {
                    let repaired = str.replace(/\\(?:([^"\\/bfnrtu])|u(?![0-9a-fA-F]{4}))/g, (match, p1) => {
                        return p1 ? '\\\\' + p1 : '\\\\';
                    });
                    let obj = tryParse(repaired);
                    return normalizeExamDataKeys(obj);
                } catch (e2) {
                    try {
                        let linesFixed = str.replace(/(?<=:\s*"[^"]*)\r?\n(?=[^"]*")/g, '\\n');
                        let repaired = linesFixed.replace(/\\(?:([^"\\/bfnrtu])|u(?![0-9a-fA-F]{4}))/g, (match, p1) => {
                            return p1 ? '\\\\' + p1 : '\\\\';
                        });
                        let obj = tryParse(repaired);
                        return normalizeExamDataKeys(obj);
                    } catch (e3) {
                        throw new Error("Không thể đọc chuỗi JSON. Vui lòng kiểm tra cú pháp hoặc dán trực tiếp khối code từ AI!");
                    }
                }
            }
        }

        function sanitizeGameData(data) { 
            if (!data) return JSON.parse(JSON.stringify(DEFAULT_GAME_DATA)); 
            const ensureArr = (obj) => { 
                if (!obj) return []; 
                return Array.isArray(obj) ? obj.filter(item => item != null) : Object.values(obj).filter(item => item != null); 
            }; 
            
            let r1 = ensureArr(data.round1).map((q, idx) => {
                let text = q.text || q.question || q.noidung || q.content || "";
                let options = Array.isArray(q.options) ? q.options : [q.optionA || q.a || "", q.optionB || q.b || "", q.optionC || q.c || "", q.optionD || q.d || ""].filter(Boolean);
                if (options.length === 0) options = ["A", "B", "C", "D"];
                let answer = q.answer || q.correct || q.dapan || "";
                return {
                    id: idx + 1,
                    text: String(text),
                    image: String(q.image || q.img || ""),
                    options: options.map(String),
                    answer: String(answer),
                    points: q.points !== undefined ? parseFloat(q.points) || 10 : 10,
                    explanation: String(q.explanation || q.loigiai || q.huongdan || ""),
                    theoryHint: String(q.theoryHint || q.hint || ""),
                    topic: String(q.topic || q.chuDe || q.chapter || ""),
                    chapterId: String(q.chapterId || ""),
                    level: String(q.level || q.mucDo || "Nhận biết"),
                    reqSkill: String(q.reqSkill || q.yeuCauCanDat || ""),
                    idCode: String(q.idCode || q.id_code || q.mathId || "")
                };
            });

            let r2 = ensureArr(data.round2).map((q, idx) => {
                let text = q.text || q.question || q.noidung || q.content || "";
                let rawStmts = Array.isArray(q.statements) ? q.statements : [];
                if (rawStmts.length === 0) {
                    ['a', 'b', 'c', 'd'].forEach(lbl => {
                        if (q['y_' + lbl] || q['y' + lbl] || q['statement_' + lbl]) {
                            let st = q['y_' + lbl] || q['y' + lbl] || q['statement_' + lbl];
                            rawStmts.push(typeof st === 'object' ? st : { label: lbl, text: String(st), isTrue: true });
                        }
                    });
                }
                let labels = ['a', 'b', 'c', 'd'];
                let statements = rawStmts.map((s, sIdx) => {
                    let sText = typeof s === 'string' ? s : (s.text || s.content || s.noidung || "");
                    let isTrueVal = false;
                    if (typeof s === 'object') {
                        if (typeof s.isTrue === 'boolean') isTrueVal = s.isTrue;
                        else if (typeof s.isTrue === 'string') {
                            let lowerT = s.isTrue.toLowerCase().trim();
                            isTrueVal = ['true', 'đúng', 'dung', 't', '1'].includes(lowerT);
                        } else if (s.isTrue === 1 || s.is_true === true) isTrueVal = true;
                    }
                    return {
                        label: labels[sIdx] || String(s.label || sIdx + 1),
                        text: String(sText),
                        isTrue: isTrueVal,
                        points: s.points !== undefined ? parseFloat(s.points) || 10 : 10
                    };
                });

                return {
                    id: idx + 1,
                    text: String(text),
                    image: String(q.image || q.img || ""),
                    statements: statements,
                    explanation: String(q.explanation || q.loigiai || q.huongdan || ""),
                    theoryHint: String(q.theoryHint || q.hint || ""),
                    topic: String(q.topic || q.chuDe || q.chapter || ""),
                    chapterId: String(q.chapterId || ""),
                    level: String(q.level || q.mucDo || "Thông hiểu"),
                    reqSkill: String(q.reqSkill || q.yeuCauCanDat || ""),
                    idCode: String(q.idCode || q.id_code || q.mathId || "")
                };
            });

            let r3 = ensureArr(data.round3).map((q, idx) => {
                let text = q.text || q.question || q.noidung || q.content || "";
                let answer = q.answer || q.dapan || q.correct || "";
                return {
                    id: idx + 1,
                    text: String(text),
                    image: String(q.image || q.img || ""),
                    answer: String(answer),
                    points: q.points !== undefined ? parseFloat(q.points) || 15 : 15,
                    explanation: String(q.explanation || q.loigiai || q.huongdan || ""),
                    theoryHint: String(q.theoryHint || q.hint || ""),
                    topic: String(q.topic || q.chuDe || q.chapter || ""),
                    chapterId: String(q.chapterId || ""),
                    level: String(q.level || q.mucDo || "Vận dụng"),
                    reqSkill: String(q.reqSkill || q.yeuCauCanDat || ""),
                    idCode: String(q.idCode || q.id_code || q.mathId || "")
                };
            });

            let theory = data.theory ? {
                title: String(data.theory.title || "Tóm tắt Lý thuyết & Công thức trọng tâm"),
                summary: String(data.theory.summary || ""),
                sections: Array.isArray(data.theory.sections) ? data.theory.sections.map((sec, sIdx) => ({
                    id: sec.id || sIdx + 1,
                    title: String(sec.title || `Mục ${sIdx + 1}`),
                    content: String(sec.content || ""),
                    example: sec.example ? {
                        question: String(sec.example.question || ""),
                        solution: String(sec.example.solution || "")
                    } : null
                })) : [],
                formulas: Array.isArray(data.theory.formulas) ? data.theory.formulas.map(String) : [],
                methods: String(data.theory.methods || ""),
                traps: String(data.theory.traps || ""),
                examples: Array.isArray(data.theory.examples) ? data.theory.examples.map(ex => ({
                    typeName: String(ex.typeName || ""),
                    question: String(ex.question || ""),
                    solution: String(ex.solution || "")
                })) : [],
                applications: Array.isArray(data.theory.applications) ? data.theory.applications.map(app => ({
                    title: String(app.title || ""),
                    question: String(app.question || ""),
                    solution: String(app.solution || "")
                })) : [],
                practiceExercises: Array.isArray(data.theory.practiceExercises) ? data.theory.practiceExercises.map((pr, pIdx) => ({
                    id: pr.id || pIdx + 1,
                    level: String(pr.level || "Vận dụng"),
                    question: String(pr.question || ""),
                    shortAnswer: String(pr.shortAnswer || pr.answer || ""),
                    hint: String(pr.hint || pr.solution || pr.explanation || "")
                })) : [],
                rawMarkdown: String(data.theory.rawMarkdown || data.theory.content || ""),
                style: data.theory.style ? {
                    align: String(data.theory.style.align || "left"),
                    fontSize: String(data.theory.style.fontSize || "base"),
                    theme: String(data.theory.style.theme || "teal"),
                    cardStyle: String(data.theory.style.cardStyle || "modern")
                } : { align: "left", fontSize: "base", theme: "teal", cardStyle: "modern" }
            } : (DEFAULT_GAME_DATA.theory ? JSON.parse(JSON.stringify(DEFAULT_GAME_DATA.theory)) : { title: "", summary: "", sections: [], formulas: [], methods: "", traps: "", examples: [], applications: [], practiceExercises: [], rawMarkdown: "", style: { align: "left", fontSize: "base", theme: "teal", cardStyle: "modern" } });

            let lectures = Array.isArray(data.lectures) ? data.lectures.map((l, idx) => ({
                id: idx + 1,
                title: String(l.title || `Đơn vị kiến thức ${idx + 1}`),
                content: String(l.content || ""),
                teacherNote: String(l.teacherNote || ""),
                steps: Array.isArray(l.steps) ? l.steps.map(String) : []
            })) : (DEFAULT_GAME_DATA.lectures ? JSON.parse(JSON.stringify(DEFAULT_GAME_DATA.lectures)) : []);

            let lecturesStyle = data.lecturesStyle ? {
                align: String(data.lecturesStyle.align || "left"),
                fontSize: String(data.lecturesStyle.fontSize || "xl"),
                theme: String(data.lecturesStyle.theme || "teal"),
                cardStyle: String(data.lecturesStyle.cardStyle || "modern"),
                animation: String(data.lecturesStyle.animation || "fade")
            } : (DEFAULT_GAME_DATA.lecturesStyle ? JSON.parse(JSON.stringify(DEFAULT_GAME_DATA.lecturesStyle)) : { align: "left", fontSize: "xl", theme: "teal", cardStyle: "modern", animation: "fade" });

            let matrixData = Array.isArray(data.matrixData) ? data.matrixData : (Array.isArray(data.matrix) ? data.matrix : null);
            let specData = Array.isArray(data.specData) ? data.specData : (Array.isArray(data.specifications) ? data.specifications : null);

            return { 
                round1: r1, 
                round2: r2, 
                round3: r3, 
                theory: theory, 
                lectures: lectures, 
                lecturesStyle: lecturesStyle,
                matrixData: matrixData,
                specData: specData
            }; 
        }

        let GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(DEFAULT_GAME_DATA)));
        let state = { 
            currentUser: null, 
            authorizedEmails: (() => {
                try {
                    let localAuths = localStorage.getItem('tbs_authorized_teachers');
                    if (localAuths) {
                        let parsed = JSON.parse(localAuths);
                        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                    }
                } catch(e) {}
                return [typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com'];
            })(), 
            isTeacher: false, 
            numTeams: 4, 
            teams: [], 
            currentRound: null, 
            currentQuestion: null, 
            currentTeamIndex: 0, 
            answeredQuestions: [], 
            userChoices: {}, 
            shuffledOptions: {} 
        };
        let adminState = { round: 'round1', editingQ: null, data: null, loadedCode: null, loadedSettings: { examMode: 'practice' } };
        let currentAdminBankData = []; let globalQuestionBank = []; let matrixRows = [];
        let currentLectureSlideIdx = 0; let currentLectureStepIdx = 0; let activeTheorySubTab = 'theory';
        
        let aiStructure = [ 
            { part: 'PHẦN I', round: 'round1', format: 'round1', count: 12, level: 'Nhận biết' }, 
            { part: 'PHẦN II', round: 'round2', format: 'round2', count: 4, level: 'Thông hiểu' }, 
            { part: 'PHẦN III', round: 'round3', format: 'round3', count: 6, level: 'Vận dụng' } 
        ];

        function initAuthorizedTeachersListener() {
            if (typeof db === 'undefined' || !db) return;
            try {
                db.collection("GameData").doc("AuthorizedTeachers").onSnapshot(authDoc => {
                    if (authDoc && authDoc.exists && Array.isArray(authDoc.data().list)) {
                        state.authorizedEmails = authDoc.data().list;
                        let superAdminClean = (SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com').toLowerCase().trim();
                        if (!state.authorizedEmails.map(e => (e || '').toLowerCase().trim()).includes(superAdminClean)) {
                            state.authorizedEmails.push(SUPER_ADMIN_EMAIL);
                        }
                        localStorage.setItem('tbs_authorized_teachers', JSON.stringify(state.authorizedEmails));
                        if (typeof adminState !== 'undefined' && adminState && adminState.round === 'teachers') {
                            let area = document.getElementById('admin-content-area');
                            if (area) renderTeacherManagement(area);
                        }
                    }
                }, err => {
                    console.warn("Lỗi đồng bộ AuthorizedTeachers:", err);
                });
            } catch(e) {}
        }

        function isCurrentUserSuperAdmin() {
            let superClean = (typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com').toLowerCase().trim();
            let curEmail = '';
            if (state && state.currentUser && state.currentUser.email) {
                curEmail = state.currentUser.email.toLowerCase().trim();
            } else if (typeof getCurrentAuthUser === 'function') {
                let sess = getCurrentAuthUser();
                if (sess && sess.email) curEmail = sess.email.toLowerCase().trim();
            } else if (typeof firebase !== 'undefined' && firebase && firebase.auth && firebase.auth().currentUser) {
                curEmail = (firebase.auth().currentUser.email || '').toLowerCase().trim();
            }
            return curEmail === superClean;
        }

        function isCurrentUserAuthorizedTeacher() {
            if (isCurrentUserSuperAdmin()) return true;
            let curEmail = '';
            if (state && state.currentUser && state.currentUser.email) {
                curEmail = state.currentUser.email.toLowerCase().trim();
            } else if (typeof getCurrentAuthUser === 'function') {
                let sess = getCurrentAuthUser();
                if (sess && sess.email) curEmail = sess.email.toLowerCase().trim();
            } else if (typeof firebase !== 'undefined' && firebase && firebase.auth && firebase.auth().currentUser) {
                curEmail = (firebase.auth().currentUser.email || '').toLowerCase().trim();
            }
            if (!curEmail) return false;
            let list = (state.authorizedEmails || []).map(e => (e || '').toLowerCase().trim());
            return list.includes(curEmail);
        }

        // ======================= GEMINI API HELPERS =======================
        const GEMINI_MODELS = [
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-2.5-pro',
            'gemini-1.5-pro',
            'gemini-1.5-pro-latest'
        ];

        function getGeminiApiKey() {
            let key = document.getElementById('ai-theory-gemini-key')?.value?.trim() || 
                      localStorage.getItem('gemini_api_key') || 
                      document.getElementById('gemini-api-key')?.value?.trim();
            if (key && (key === "AIzaSyAyL8ezUs1OuxTYBD6PATYk-WpBxOqMGj8" || (typeof firebaseConfig !== 'undefined' && key === firebaseConfig.apiKey))) {
                localStorage.removeItem('gemini_api_key');
                if (document.getElementById('ai-theory-gemini-key')) document.getElementById('ai-theory-gemini-key').value = '';
                if (document.getElementById('gemini-api-key')) document.getElementById('gemini-api-key').value = '';
                return '';
            }
            return key || '';
        }

        async function callGeminiApiEndpoint(payload, customApiKey = null) {
            let apiKey = (customApiKey || getGeminiApiKey())?.trim();
            if (!apiKey) {
                throw new Error("Vui lòng nhập Gemini API Key (lấy miễn phí tại https://aistudio.google.com/app/apikey)!");
            }
            localStorage.setItem('gemini_api_key', apiKey);
            if (document.getElementById('gemini-api-key')) document.getElementById('gemini-api-key').value = apiKey;
            if (document.getElementById('ai-theory-gemini-key')) document.getElementById('ai-theory-gemini-key').value = apiKey;

            let lastErr = null;
            for (let m of GEMINI_MODELS) {
                try {
                    let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'x-goog-api-key': apiKey
                        },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        return await res.json();
                    }
                    let errData = await res.json().catch(() => ({}));
                    lastErr = errData.error?.message || `HTTP ${res.status}`;
                } catch(e) {
                    lastErr = e.message;
                }
            }

            if (lastErr && (lastErr.includes("not found") || lastErr.includes("API_KEY_INVALID") || lastErr.includes("404") || lastErr.includes("400"))) {
                throw new Error(`API Key không hợp lệ hoặc chưa kích hoạt Gemini API. Vui lòng lấy API Key từ Google AI Studio (https://aistudio.google.com/app/apikey). Chi tiết: ${lastErr}`);
            }
            throw new Error(lastErr || "Không thể kết nối Gemini API");
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedKey = getGeminiApiKey();
            if(savedKey && document.getElementById('gemini-api-key')) {
                document.getElementById('gemini-api-key').value = savedKey;
            }
            if(savedKey && document.getElementById('ai-theory-gemini-key')) {
                document.getElementById('ai-theory-gemini-key').value = savedKey;
            }
        });

        let authChecked = false;
        let isTeacherAppInitialized = false;
        async function initTeacherApp() {
            let contentEl = document.getElementById('app-content');
            if (!contentEl) return;
            if (isTeacherAppInitialized) return;
            isTeacherAppInitialized = true;

            initAuthorizedTeachersListener();

            let superAdminClean = (SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com').toLowerCase().trim();
            if (!state.authorizedEmails.map(e => (e || '').toLowerCase().trim()).includes(superAdminClean)) {
                state.authorizedEmails.push(SUPER_ADMIN_EMAIL);
            }

            // 1. Check if user previously authenticated as Teacher
            let authSession = typeof getCurrentAuthUser === 'function' ? getCurrentAuthUser() : null;
            if ((authSession && authSession.role === 'teacher') || localStorage.getItem('devModeBypass') === 'true') {
                authChecked = true;
                let sessionEmail = (authSession && authSession.email) || SUPER_ADMIN_EMAIL;
                state.currentUser = { email: sessionEmail, photoURL: (authSession && authSession.photoURL) || '' };
                state.isTeacher = true;
                
                let isSuper = isCurrentUserSuperAdmin();
                let avatar = document.getElementById('user-avatar');
                if (avatar) {
                    if (authSession && authSession.photoURL) {
                        avatar.src = authSession.photoURL;
                        avatar.classList.remove('hidden');
                    } else {
                        avatar.classList.add('hidden');
                    }
                }
                let uEmail = document.getElementById('user-email');
                if (uEmail) {
                    uEmail.innerText = isSuper 
                        ? `Super Admin (${SUPER_ADMIN_EMAIL})` 
                        : `Giáo viên (${sessionEmail})`;
                }
                
                renderTeacherSetupScreen();
                return;
            }

            // If logged in as student, block access
            if (authSession && authSession.role === 'student') {
                authChecked = true;
                showTeacherLoginPrompt(`Bạn đang đăng nhập bằng tài khoản Học sinh (${authSession.name || authSession.id}). Vui lòng đăng nhập quyền Giáo viên để truy cập Studio.`);
                return;
            }

            // 2. In local file mode (file://) or offline, immediately show PIN prompt (0ms delay)
            if (window.location.protocol === 'file:' || typeof firebase === 'undefined' || !firebase || !firebase.auth) {
                authChecked = true;
                showTeacherLoginPrompt();
                return;
            }

            // 3. Fallback timeout for web mode
            let authTimeout = setTimeout(() => {
                if (!authChecked) {
                    authChecked = true;
                    if (!state.isTeacher && localStorage.getItem('devModeBypass') !== 'true') {
                        showTeacherLoginPrompt();
                    }
                }
            }, 1800);

            // 4. Handle Firebase Auth on Web
            try {
                firebase.auth().onAuthStateChanged(async user => {
                    authChecked = true;
                    clearTimeout(authTimeout);
                    if (state.isTeacher || localStorage.getItem('devModeBypass') === 'true') {
                        return; // Teacher already authenticated via PIN or session, do not disrupt!
                    }
                    if (user && user.email) {
                        state.currentUser = user;
                        let avatar = document.getElementById('user-avatar');
                        if (avatar && user.photoURL) { 
                            avatar.src = user.photoURL; 
                            avatar.classList.remove('hidden'); 
                        }
                        let uEmail = document.getElementById('user-email');
                        if (uEmail) uEmail.innerText = user.email;
                        
                        // Load AuthorizedTeachers from Firestore asynchronously
                        if (typeof db !== 'undefined' && db) {
                            try {
                                let fetchAuthDoc = db.collection("GameData").doc("AuthorizedTeachers").get();
                                let timeoutDoc = new Promise(resolve => setTimeout(() => resolve(null), 1200));
                                let authDoc = await Promise.race([fetchAuthDoc, timeoutDoc]);
                                if (authDoc && authDoc.exists && Array.isArray(authDoc.data().list)) {
                                    state.authorizedEmails = authDoc.data().list;
                                    if (!state.authorizedEmails.map(e => (e || '').toLowerCase().trim()).includes(superAdminClean)) {
                                        state.authorizedEmails.push(SUPER_ADMIN_EMAIL);
                                    }
                                }
                            } catch(e) {}
                        }

                        let cleanEmail = user.email.toLowerCase().trim();
                        let isAuth = state.authorizedEmails.map(e => (e || '').toLowerCase().trim()).includes(cleanEmail);

                        if (isAuth) {
                            state.isTeacher = true;
                            renderTeacherSetupScreen();
                        } else {
                            let contentEl = document.getElementById('app-content');
                            if (contentEl) {
                                contentEl.innerHTML = `
                                    <div class="text-center mt-20 p-6 glass-panel max-w-md mx-auto rounded-3xl shadow-lg border border-red-200">
                                        <i class="fa-solid fa-lock text-5xl text-rose-500 mb-4"></i>
                                        <h2 class="text-2xl font-black text-rose-600">Từ Chối Quyền Truy Cập</h2>
                                        <p class="text-slate-500 font-bold mt-2 text-sm">Email <b>${user.email}</b> chưa được cấp quyền Quản trị viên.<br>(Admin mặc định: ${SUPER_ADMIN_EMAIL})</p>
                                        <div class="mt-4 flex flex-col gap-2">
                                            <button onclick="showTeacherLoginPrompt(true)" class="px-4 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm btn-3d shadow-md">
                                                <i class="fa-solid fa-key mr-1"></i> Nhập Mã PIN Admin
                                            </button>
                                            <button onclick="firebase.auth().signOut().then(() => location.reload())" class="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-300 transition">
                                                Đăng xuất tài khoản này
                                            </button>
                                        </div>
                                    </div>`;
                            }
                        }
                    } else {
                        if (!state.isTeacher && localStorage.getItem('devModeBypass') !== 'true') {
                            showTeacherLoginPrompt();
                        }
                    }
                });
            } catch(e) {
                authChecked = true;
                clearTimeout(authTimeout);
                if (!state.isTeacher && localStorage.getItem('devModeBypass') !== 'true') {
                    showTeacherLoginPrompt();
                }
            }
        }

        function showTeacherLoginPrompt(msg, force = false) {
            if (!force && (state.isTeacher || localStorage.getItem('devModeBypass') === 'true')) {
                return;
            }

            let contentEl = document.getElementById('app-content');
            if (!contentEl) return;
            
            contentEl.classList.remove('hidden');
            let adminModal = document.getElementById('admin-modal');
            if (adminModal) {
                adminModal.classList.add('hidden');
                adminModal.classList.remove('flex');
            }
            let logoutBtn = document.getElementById('btn-teacher-logout');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            
            let uEmail = document.getElementById('user-email');
            if (uEmail) uEmail.innerText = 'Chưa xác thực Admin';

            const displayMsg = (typeof msg === 'string' && msg) ? msg : `Nhập mã PIN Admin (Mặc định: <code class="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-mono font-bold">tbs2025</code> hoặc <code class="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-mono font-bold">Tbs@gv2026</code>) hoặc Đăng nhập Google Admin.`;

            contentEl.innerHTML = `
                <div class="glass-panel p-8 md:p-10 max-w-md w-full mx-auto rounded-3xl shadow-2xl border-t-4 border-sky-500 text-center relative zoom-in my-8">
                    <div class="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <h2 class="text-2xl font-black text-slate-800 uppercase tracking-wide mb-1">Xác Thực Quản Trị Viên</h2>
                    <p class="text-xs font-bold text-slate-500 mb-6">${displayMsg}</p>
                    
                    <form onsubmit="event.preventDefault(); loginTeacherWithPinDirect();" class="space-y-4">
                        <div class="text-left">
                            <label class="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Mã PIN Admin:</label>
                            <div class="relative">
                                <input type="password" id="teacher-direct-pin" placeholder="Nhập mã: tbs2025 hoặc Tbs@gv2026" autofocus class="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500 font-bold text-slate-800 transition shadow-sm text-center tracking-widest text-lg">
                                <button type="button" onclick="const p=document.getElementById('teacher-direct-pin'); p.type=p.type==='password'?'text':'password'; this.querySelector('i').classList.toggle('fa-eye'); this.querySelector('i').classList.toggle('fa-eye-slash');" class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 text-lg transition" title="Ẩn/hiện mật khẩu">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit" id="btn-submit-teacher-pin" class="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl shadow-md transition btn-3d uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                            <i class="fa-solid fa-key"></i> Xác Nhận PIN Admin
                        </button>
                    </form>

                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
                        <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-3 font-bold text-slate-400">hoặc</span></div>
                    </div>

                    <div class="space-y-2">
                        <button type="button" onclick="document.getElementById('teacher-direct-pin').value='tbs2025'; loginTeacherWithPinDirect();" class="w-full py-2.5 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 hover:from-sky-100 hover:to-indigo-100 text-sky-800 font-black rounded-xl border border-sky-200 shadow-sm transition text-xs flex items-center justify-center gap-2 btn-3d">
                            <i class="fa-solid fa-bolt text-amber-500 text-sm"></i> Vào Nhanh Studio (1-Click Admin)
                        </button>
                        <button onclick="loginWithGoogleTeacherDirect()" class="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition text-xs flex items-center justify-center gap-2">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-4 h-4"> Đăng nhập Google Admin
                        </button>
                        <button onclick="window.location.href='index.html'" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition text-xs flex items-center justify-center gap-2">
                            <i class="fa-solid fa-house"></i> Về Trang chủ Portal
                        </button>
                    </div>
                </div>
            `;
            let pinInput = document.getElementById('teacher-direct-pin');
            if (pinInput) pinInput.focus();
        }

        async function loginTeacherWithPinDirect() {
            let input = document.getElementById('teacher-direct-pin');
            let pin = input ? input.value.trim() : '';
            if (!pin) {
                showToast("Vui lòng nhập mã PIN Admin (Mặc định: tbs2025)", true);
                return;
            }

            const cleanLower = pin.toLowerCase().replace(/\s+/g, '');
            const validDirect = ['tbs2025', 'tbs@gv2026', 'tbsmath', 'tbs2026', 'admin', '123456', 'gv2025', 'gv2026', 'tbs'];
            let isOk = validDirect.includes(cleanLower) || pin === 'Tbs@gv2026' || pin === 'tbs2025' || pin === 'tbsmath';

            if (!isOk && typeof verifyTeacherPinHash === 'function') {
                try {
                    isOk = await verifyTeacherPinHash(pin);
                } catch(e) {
                    console.warn("verifyTeacherPinHash error:", e);
                }
            }

            if (isOk) {
                try {
                    localStorage.removeItem('tbs_teacher_pin_lock');
                    localStorage.removeItem('tbs_teacher_pin_attempts');
                    localStorage.setItem('devModeBypass', 'true');
                    localStorage.setItem('tbs_auth_session', JSON.stringify({
                        role: 'teacher',
                        email: SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com',
                        name: 'Quản trị viên (PIN)'
                    }));
                } catch(e) {}

                if (typeof saveAuthUser === 'function') {
                    saveAuthUser({
                        role: 'teacher',
                        email: SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com',
                        name: 'Quản trị viên (PIN)'
                    });
                }

                state.currentUser = { email: SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com', photoURL: '' };
                state.authorizedEmails = [SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com'];
                state.isTeacher = true;
                
                let avatar = document.getElementById('user-avatar');
                if (avatar) {
                    if (state.currentUser && state.currentUser.photoURL) {
                        avatar.src = state.currentUser.photoURL;
                        avatar.classList.remove('hidden');
                    } else {
                        avatar.classList.add('hidden');
                    }
                }
                let uEmail = document.getElementById('user-email');
                if (uEmail) uEmail.innerText = `Quản trị viên (${SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com'})`;
                
                showToast("Xác thực Admin thành công! Mở Studio...");
                renderTeacherSetupScreen();
            } else {
                showToast("Mã PIN Admin không đúng! (Mặc định: tbs2025)", true);
            }
        }

        async function loginWithGoogleTeacherDirect() {
            try {
                if (!window.firebase || !firebase.auth) throw new Error("Firebase Auth chưa sẵn sàng");
                let provider = new firebase.auth.GoogleAuthProvider();
                await firebase.auth().signInWithPopup(provider);
                showToast("Đăng nhập Google thành công!");
            } catch(e) {
                showToast("Google Auth chưa sẵn sàng trên tên miền này. Vui lòng dùng mã PIN Admin tbs2025.", true);
            }
        }

        function logoutTeacher() {
            if (typeof clearAuthUser === 'function') clearAuthUser();
            localStorage.removeItem('devModeBypass');
            localStorage.removeItem('tbs_auth_session');
            state.isTeacher = false;
            state.currentUser = null;
            
            let avatar = document.getElementById('user-avatar');
            if (avatar) avatar.classList.add('hidden');
            
            let logoutBtn = document.getElementById('btn-teacher-logout');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            
            let adminModal = document.getElementById('admin-modal');
            if (adminModal) {
                adminModal.classList.add('hidden');
                adminModal.classList.remove('flex');
            }
            
            if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
                firebase.auth().signOut().then(() => {
                    showToast("Đã đăng xuất Admin!");
                    showTeacherLoginPrompt("Đã đăng xuất. Vui lòng đăng nhập lại.", true);
                }).catch(() => {
                    showTeacherLoginPrompt(null, true);
                });
            } else {
                showToast("Đã đăng xuất Admin!");
                showTeacherLoginPrompt("Đã đăng xuất. Vui lòng đăng nhập lại.", true);
            }
        }

        window.loginTeacherWithPinDirect = loginTeacherWithPinDirect;
        window.loginWithGoogleTeacherDirect = loginWithGoogleTeacherDirect;
        window.logoutTeacher = logoutTeacher;
        window.renderTeacherSetupScreen = renderTeacherSetupScreen;
        window.showTeacherLoginPrompt = showTeacherLoginPrompt;
        window.initTeacherApp = initTeacherApp;

        try { initTeacherApp(); } catch(e) {}
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initTeacherApp();
        } else {
            document.addEventListener('DOMContentLoaded', initTeacherApp);
            window.addEventListener('load', initTeacherApp);
        }
        setTimeout(initTeacherApp, 150);

        // showToast, playSound, triggerMathJax, triggerConfetti are moved to config.js

        function renderTeacherSetupScreen() {
            document.getElementById('scoreboard').classList.add('hidden');
            document.getElementById('app-content').classList.add('hidden');
            let adminModal = document.getElementById('admin-modal');
            adminModal.classList.remove('hidden');
            adminModal.classList.add('flex');

            let logoutBtn = document.getElementById('btn-teacher-logout');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            
            if (!adminState.data) {
                adminState.data = JSON.parse(JSON.stringify(GAME_DATA));
            }
            if (!adminState.round) {
                adminSetTab('round1');
            } else {
                renderAdminUI();
            }
            updateGlobalModeDisplay();
        }

        function renderPresentationSetup(container) {
            let tHtml = Array.from({length:state.numTeams},(_,i)=>`<div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm transition hover:border-sky-300"><div class="w-10 h-10 rounded-lg bg-main text-white flex justify-center items-center font-black text-lg shadow-sm">${i+1}</div><input type="text" id="team-name-${i+1}" placeholder="Đội ${i+1}" value="Đội ${i+1}" class="bg-transparent font-bold outline-none text-sm text-slate-700 flex-grow"></div>`).join('');
            let h = JSON.parse(localStorage.getItem('math12ExportHistory')||'[]');
            let hHtml = h.length ? `<div class="mt-4 border-t border-slate-200 pt-3 text-left"><h3 class="font-bold text-slate-500 mb-2 text-xs uppercase tracking-wider">Mã đề gần đây:</h3><div class="flex flex-wrap gap-2">${h.slice(0,5).map(x=>`<button onclick="loadTeacherCode('${x.code}')" class="px-3 py-1.5 border border-sky-100 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold shadow-2xs btn-3d hover:bg-sky-600 hover:text-white transition">${x.code}</button>`).join('')}</div></div>` : '';
            
            let lecturesCount = (GAME_DATA && GAME_DATA.lectures) ? GAME_DATA.lectures.length : 0;
            let theoryTitle = (GAME_DATA && GAME_DATA.theory && GAME_DATA.theory.title) ? GAME_DATA.theory.title : 'Chưa có tiêu đề lý thuyết';

            container.innerHTML = `
                <div class="w-full h-full flex flex-col p-4 md:p-8 bg-slate-50 admin-scroll overflow-y-auto rounded-[1.5rem]">
                    <div class="max-w-6xl w-full mx-auto space-y-6">
                        
                        <!-- Header Banner -->
                        <div class="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 class="text-2xl md:text-3xl font-black uppercase tracking-wider flex items-center gap-3">
                                    <i class="fa-solid fa-chalkboard-user text-amber-300"></i> Trung Tâm Trình Chiếu Lớp Học
                                </h2>
                                <p class="text-sky-100 text-xs md:text-sm font-medium mt-1">Lựa chọn chế độ Giảng dạy Bài giảng, Đấu trường Khảo thí hoặc Mở Bảng trắng Tương tác.</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <button onclick="openWhiteboardWindow()" class="px-5 py-3 bg-white/15 hover:bg-white text-white hover:text-slate-800 border-2 border-white/40 font-black rounded-2xl text-xs md:text-sm transition backdrop-blur-md btn-3d flex items-center gap-2">
                                    <i class="fa-solid fa-pen-ruler text-amber-300 text-base"></i> Mở Bảng Trắng TBS
                                </button>
                            </div>
                        </div>

                        <!-- 3 Presentation Channels -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            <!-- Channel 1: Lecture Presentation Mode -->
                            <div class="bg-white p-6 md:p-8 rounded-3xl border-2 border-teal-200 shadow-md flex flex-col justify-between hover:border-teal-400 transition">
                                <div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black uppercase tracking-wider border border-teal-200">
                                            <i class="fa-solid fa-book-open mr-1"></i> Bài Giảng Đơn Vị Kiến Thức
                                        </span>
                                        <span class="text-xs font-bold text-slate-400">${lecturesCount} Slide bài giảng</span>
                                    </div>
                                    <h3 class="text-xl font-black text-slate-800 mb-2">${theoryTitle}</h3>
                                    <p class="text-xs text-slate-500 mb-6 font-medium leading-relaxed">Trình chiếu bài giảng lý thuyết theo thẻ bước (Step-by-step reveal), công thức LaTeX phóng to, hình ảnh minh họa và hỗ trợ kết nối ghi chú bảng trắng.</p>
                                    
                                    <div class="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 mb-6 space-y-2">
                                        <div class="text-xs font-bold text-teal-900 flex items-center justify-between">
                                            <span><i class="fa-solid fa-list-check mr-1.5 text-teal-600"></i> Nội dung slide:</span>
                                            <button onclick="adminSetTab('theory')" class="text-teal-700 hover:underline font-black">Chỉnh sửa trong Studio &rarr;</button>
                                        </div>
                                        <div class="text-[11px] text-teal-700 font-semibold truncate">
                                            ${lecturesCount > 0 ? (GAME_DATA.lectures.map((l, i) => `${i+1}. ${l.title}`).join(' • ')) : 'Chưa có slide nào. Nhấn chỉnh sửa để thêm slide!'}
                                        </div>
                                    </div>
                                </div>

                                <button onclick="startLecturePresentation(0)" class="w-full py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black rounded-2xl shadow-lg btn-3d uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-play text-amber-200 text-base"></i> Bắt đầu Trình chiếu Bài Giảng
                                </button>
                            </div>

                            <!-- Channel 2: Quiz Arena Battle Mode -->
                            <div class="bg-white p-6 md:p-8 rounded-3xl border-2 border-indigo-200 shadow-md flex flex-col justify-between hover:border-indigo-400 transition">
                                <div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider border border-indigo-200">
                                            <i class="fa-solid fa-gamepad mr-1"></i> Đấu Trường Thi Đua Khảo Thí
                                        </span>
                                        <span class="text-xs font-bold text-slate-400">Đề thi 3 Phần</span>
                                    </div>
                                    <h3 class="text-xl font-black text-slate-800 mb-2">Trình Chiếu Đề & Chấm Điểm Đội Thi</h3>
                                    
                                    <div class="flex gap-2 mb-4">
                                        <input type="text" id="t-manual-code" placeholder="Nhập mã đề từ đám mây..." class="flex-grow p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-center font-bold tracking-widest uppercase text-sm shadow-inner bg-slate-50">
                                        <button onclick="loadTeacherCode(document.getElementById('t-manual-code').value)" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition shadow-sm btn-3d uppercase text-xs">Tải đề</button>
                                    </div>
                                    ${hHtml}

                                    <div class="mt-4 pt-4 border-t border-slate-100">
                                        <div class="flex items-center justify-between mb-3">
                                            <label class="font-bold text-xs text-slate-500 uppercase tracking-wider">Số lượng Đội thi đấu:</label>
                                            <div class="flex gap-2">${[2,3,4].map(n=>`<button onclick="state.numTeams=${n}; renderAdminUI();" class="px-3 py-1 border-2 rounded-xl font-bold text-xs transition btn-3d ${state.numTeams===n?'bg-indigo-600 border-indigo-600 text-white shadow-sm':'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}">${n} Đội</button>`).join('')}</div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2 mb-4 max-h-[110px] overflow-y-auto admin-scroll pr-1">${tHtml}</div>
                                    </div>
                                </div>

                                <button onclick="startTeamGame()" class="w-full py-4 bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 hover:brightness-110 text-white font-black rounded-2xl shadow-lg btn-3d uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-play text-amber-200 text-base"></i> Kích hoạt Đấu Trường Đề Thi
                                </button>
                            </div>

                        </div>
                    </div>
                </div>`;
        }

        function openWhiteboardWindow() {
            window.open('bang_trang.html', '_blank');
        }

        async function loadTeacherCode(code) { if(!code) return; code = code.trim().toUpperCase(); document.getElementById('app-content').innerHTML=`<div class="mt-32 text-center text-sky-500 font-bold"><i class="fa-solid fa-spinner fa-spin text-5xl mb-4"></i><br>Đang tải...</div>`; try { let s = await db.collection("SharedGames").doc(code).get(); if(!s.exists) throw new Error("Mã đề không tồn tại!"); GAME_DATA = sanitizeGameData(s.data().data); adminState.loadedSettings = s.data().settings || { examMode: 'practice' }; showToast("Đã tải xong mã: " + code); renderTeacherSetupScreen(); } catch(e) { showToast(e.message, true); renderTeacherSetupScreen(); } }

        
        function toggleQuestionDrawer() {
            let d = document.getElementById('presentation-qlist-drawer');
            if (d) {
                d.classList.toggle('hidden');
                if (!d.classList.contains('hidden')) {
                    renderDrawerQuestionGrid(state.currentRound || 'round1');
                }
            }
        }

        function switchDrawerRound(rId) {
            state.currentRound = rId;
            renderDrawerQuestionGrid(rId);
        }

        function renderDrawerQuestionGrid(rId) {
            ['round1', 'round2', 'round3'].forEach(r => {
                let btn = document.getElementById(`drawer-tab-${r}`);
                if (btn) {
                    if (r === rId) {
                        btn.className = "flex-1 py-2 rounded-xl text-xs font-black transition text-center bg-sky-600 text-white border-sky-600 shadow-sm";
                    } else {
                        btn.className = "flex-1 py-2 rounded-xl text-xs font-black transition text-center bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100";
                    }
                }
            });

            let container = document.getElementById('drawer-qgrid-container');
            if (!container) return;

            let questions = (GAME_DATA && GAME_DATA[rId]) ? GAME_DATA[rId] : [];
            if (questions.length === 0) {
                container.innerHTML = `<div class="col-span-4 text-center py-8 text-xs font-bold text-slate-400">Không có câu hỏi nào trong phần này</div>`;
                return;
            }

            container.innerHTML = questions.map((q, idx) => {
                let isAns = rId === 'round2' 
                    ? (q.statements?.every((_, sIdx) => state.answeredQuestions.includes(`round2_${q.id}_${sIdx}`)))
                    : state.answeredQuestions.includes(`${rId}_${q.id}`);
                let isCurrent = state.currentQuestion && String(state.currentQuestion.id) === String(q.id) && state.currentRound === rId;

                let cls = isCurrent 
                    ? 'bg-sky-600 text-white ring-4 ring-sky-200 font-black scale-105 z-10 shadow-md border-2 border-white' 
                    : (isAns 
                        ? 'bg-slate-100 text-slate-300 font-bold border border-slate-200 opacity-60' 
                        : 'bg-white text-sky-700 font-black hover:bg-sky-500 hover:text-white border border-sky-300 shadow-xs');

                return `<button onclick="openQuestion('${q.id}'); toggleQuestionDrawer();" class="aspect-square rounded-xl text-base transition-all flex items-center justify-center ${cls}" title="Câu số ${idx + 1}">${idx + 1}</button>`;
            }).join('');
        }

        function renderPresentationQuickNav() {
            if (!state.teams || state.teams.length === 0) return '';
            
            let rounds = [
                { id: 'round1', name: 'Phần I (Trắc nghiệm)', icon: 'fa-list-check', activeCls: 'bg-sky-600 text-white font-black shadow-md border-sky-400' },
                { id: 'round2', name: 'Phần II (Đúng/Sai)', icon: 'fa-check-double', activeCls: 'bg-amber-500 text-white font-black shadow-md border-amber-400' },
                { id: 'round3', name: 'Phần III (Trả lời ngắn)', icon: 'fa-keyboard', activeCls: 'bg-rose-600 text-white font-black shadow-md border-rose-400' }
            ];
            
            let currentR = state.currentRound || 'round1';
            let questions = (GAME_DATA && GAME_DATA[currentR]) ? GAME_DATA[currentR] : [];
            
            let roundBtns = rounds.map(r => {
                let isActive = r.id === currentR;
                let cls = isActive 
                    ? r.activeCls 
                    : 'bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 shadow-xs';
                return `<button onclick="selectRound('${r.id}')" class="px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${cls}">
                    <i class="fa-solid ${r.icon}"></i> <span>${r.name}</span>
                </button>`;
            }).join('');
            
            let qBtns = questions.map((q, idx) => {
                let isAns = currentR === 'round2' 
                    ? (q.statements?.every((_, sIdx) => state.answeredQuestions.includes(`round2_${q.id}_${sIdx}`)))
                    : state.answeredQuestions.includes(`${currentR}_${q.id}`);
                let isCurrent = state.currentQuestion && String(state.currentQuestion.id) === String(q.id);
                
                let cls = isCurrent 
                    ? 'bg-sky-600 text-white ring-4 ring-sky-200 font-black scale-110 z-10 shadow-md border-2 border-white' 
                    : (isAns 
                        ? 'bg-slate-200 text-slate-400 font-bold border border-slate-300' 
                        : 'bg-white text-sky-700 font-extrabold hover:bg-sky-500 hover:text-white border border-sky-200 shadow-xs');
                        
                return `<button onclick="openQuestion('${q.id}')" class="w-8 h-8 rounded-lg text-xs transition-all flex items-center justify-center shrink-0 ${cls}" title="Câu số ${idx + 1}">${idx + 1}</button>`;
            }).join('');
            
            let isScoreboardHidden = document.getElementById('scoreboard')?.classList.contains('hidden');
            let toggleScoreboardText = isScoreboardHidden ? '👁️ Hiện Bảng Điểm' : '🙈 Ẩn Bảng Điểm';

            return `
            <div class="w-full max-w-6xl mb-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border-2 border-sky-200 shadow-lg flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30">
                <div class="flex items-center gap-2 flex-wrap">
                    ${roundBtns}
                </div>
                <div class="flex items-center gap-1.5 overflow-x-auto admin-scroll max-w-full py-1 px-1">
                    <span class="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1 shrink-0"><i class="fa-solid fa-circle-question text-sky-500"></i> Câu:</span>
                    ${qBtns}
                </div>
                <div class="flex items-center gap-1.5 flex-wrap">
                    <!-- Quick Font Zoom Controls for Projection -->
                    <div class="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                        <button onclick="changeAppFontSize(-1)" title="Thu nhỏ chữ (A-)" class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center text-xs font-black text-slate-700 transition">A-</button>
                        <span class="text-[10px] font-black text-sky-700 px-1 font-scale-display">100%</span>
                        <button onclick="changeAppFontSize(1)" title="Phóng to chữ (A+)" class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center text-xs font-black text-slate-700 transition">A+</button>
                    </div>

                    <button onclick="toggleAppDarkMode()" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 flex items-center gap-1 btn-3d" title="Chế độ Tối / Chiếu TV">
                        <i class="dark-mode-icon fa-solid fa-moon text-indigo-600"></i>
                    </button>

                    <button onclick="openDisplayCustomizerModal()" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 flex items-center gap-1 btn-3d" title="Tùy biến hiển thị & Cỡ chữ">
                        <i class="fa-solid fa-sliders text-sky-600"></i>
                    </button>

                    <button onclick="startLecturePresentation(0)" class="px-3 py-1.5 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-xs border border-teal-200" title="Trình chiếu Slide Bài Giảng">
                        <i class="fa-solid fa-book-open"></i> Bài Giảng
                    </button>
                    <button onclick="openWhiteboardWindow()" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-xs border border-purple-200" title="Mở Bảng Trắng TBS">
                        <i class="fa-solid fa-pen-ruler"></i> Bảng Trắng
                    </button>
                    <button onclick="toggleScoreboardVisibility()" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-xs border border-amber-200">
                        ${toggleScoreboardText}
                    </button>
                    <button onclick="renderDashboard()" class="px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-xs border border-slate-200">
                        <i class="fa-solid fa-grip text-sky-600"></i> Menu
                    </button>
                    <button onclick="renderTeacherSetupScreen()" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-xs border border-rose-200">
                        <i class="fa-solid fa-power-off"></i> Thoát
                    </button>
                </div>
            </div>`;
        }

        function toggleScoreboardVisibility() {
            let sb = document.getElementById('scoreboard');
            if (sb) sb.classList.toggle('hidden');
            if (state.currentQuestion) openQuestion(state.currentQuestion.id);
            else if (state.currentRound) selectRound(state.currentRound);
            else renderDashboard();
        }

        function startLecturePresentation(slideIdx = 0) {
            if (typeof saveTheoryInputsLive === 'function') {
                saveTheoryInputsLive();
            }
            if (typeof adminState !== 'undefined' && adminState.data) {
                if (adminState.data.theory) GAME_DATA.theory = JSON.parse(JSON.stringify(adminState.data.theory));
                if (adminState.data.lectures) GAME_DATA.lectures = JSON.parse(JSON.stringify(adminState.data.lectures));
                if (adminState.data.lecturesStyle) GAME_DATA.lecturesStyle = JSON.parse(JSON.stringify(adminState.data.lecturesStyle));
            }
            currentLectureSlideIdx = slideIdx;
            currentLectureStepIdx = 0;
            document.getElementById('admin-modal')?.classList.add('hidden');
            document.getElementById('admin-modal')?.classList.remove('flex');
            document.getElementById('app-content')?.classList.remove('hidden');
            document.getElementById('scoreboard')?.classList.add('hidden');
            renderLecturePresentation(currentLectureSlideIdx, currentLectureStepIdx);
        }

        function renderLecturePresentation(slideIdx = 0, stepIdx = 0) {
            let lectures = (GAME_DATA && GAME_DATA.lectures && GAME_DATA.lectures.length) ? GAME_DATA.lectures : [];
            if (lectures.length === 0) {
                let t = GAME_DATA.theory || {};
                lectures = [{
                    id: 1,
                    title: t.title || "Tóm tắt Lý thuyết",
                    content: (t.summary ? `### 📌 Trọng tâm khái niệm\n${t.summary}\n\n` : '') + 
                             (t.formulas && t.formulas.length ? `**Công thức trọng tâm:**\n${t.formulas.join('\n\n')}\n\n` : '') +
                             (t.methods ? `**Phương pháp giải:**\n${t.methods}` : ''),
                    teacherNote: t.traps ? `Lưu ý bẫy sai lầm: ${t.traps}` : '',
                    steps: t.formulas || []
                }];
            }
            
            if (slideIdx < 0) slideIdx = 0;
            if (slideIdx >= lectures.length) slideIdx = lectures.length - 1;
            currentLectureSlideIdx = slideIdx;
            
            let slide = lectures[slideIdx] || { title: "Chưa có nội dung", content: "", steps: [] };
            let totalSlides = lectures.length;
            let steps = slide.steps || [];
            let totalSteps = steps.length;
            if (stepIdx > totalSteps) stepIdx = totalSteps;
            currentLectureStepIdx = stepIdx;
            
            let prevSlide = slideIdx > 0 ? slideIdx - 1 : null;
            let nextSlide = slideIdx < totalSlides - 1 ? slideIdx + 1 : null;

            let lStyle = GAME_DATA.lecturesStyle || { align: 'left', fontSize: 'xl', theme: 'teal', cardStyle: 'modern', animation: 'fade' };
            let alignCls = lStyle.align === 'center' ? 'theory-align-center' : (lStyle.align === 'justify' ? 'theory-align-justify' : 'theory-align-left');
            let fontCls = lStyle.fontSize === '2xl' ? 'theory-font-2xl' : (lStyle.fontSize === 'lg' ? 'theory-font-lg' : (lStyle.fontSize === 'base' ? 'theory-font-base' : 'theory-font-xl'));
            let animCls = lStyle.animation === 'slide' ? 'slide-anim-slide' : (lStyle.animation === 'zoom' ? 'slide-anim-zoom' : 'slide-anim-fade');
            let themeCardCls = `theme-${lStyle.theme || 'teal'}-card`;
            let themeBadgeCls = `theme-${lStyle.theme || 'teal'}-badge`;
            let themeAccentCls = `theme-${lStyle.theme || 'teal'}-accent`;
            let cardCls = lStyle.cardStyle === 'elevation' ? 'theory-card-elevation' : (lStyle.cardStyle === 'glass' ? 'theory-card-glass' : (lStyle.cardStyle === 'minimal' ? 'theory-card-minimal' : 'theory-card-modern'));

            let slideNavBtns = lectures.map((l, i) => {
                let isCurr = i === slideIdx;
                let cls = isCurr 
                    ? `${themeBadgeCls} font-black shadow-md scale-105 border-2 border-white` 
                    : 'bg-white text-slate-800 font-bold border border-slate-300 hover:bg-teal-50 hover:text-teal-800';
                return `<button onclick="renderLecturePresentation(${i}, 0)" class="px-3 py-1.5 rounded-xl text-xs transition-all shrink-0 btn-3d ${cls}" title="${l.title}">
                    ${i + 1}. ${l.title.length > 20 ? l.title.substring(0, 20) + '...' : l.title}
                </button>`;
            }).join('');

            let stepsHtml = '';
            if (steps.length > 0) {
                stepsHtml = `
                <div class="mt-8 pt-6 border-t-2 border-slate-200">
                    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div class="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-stairs ${themeAccentCls}"></i> Các bước suy luận / Phân tích bài toán:
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="revealAllLectureSteps(${slideIdx})" class="px-3 py-1 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition btn-3d border border-slate-200">
                                <i class="fa-solid fa-eye mr-1"></i> Hiện tất cả bước
                            </button>
                            <button onclick="resetLectureSteps(${slideIdx})" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition btn-3d border border-slate-200">
                                <i class="fa-solid fa-rotate-left mr-1"></i> Ẩn lại từ đầu
                            </button>
                        </div>
                    </div>
                    <div class="space-y-3">
                        ${steps.map((st, sIdx) => {
                            let isRevealed = sIdx < currentLectureStepIdx || currentLectureStepIdx === totalSteps;
                            return `
                            <div class="p-4 rounded-2xl border-2 transition-all duration-300 ${isRevealed ? `${themeCardCls} shadow-sm animate-fade-in` : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 opacity-60'}">
                                <div class="flex items-start gap-3">
                                    <span class="w-8 h-8 rounded-xl ${isRevealed ? `${themeBadgeCls} shadow-sm` : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-black text-sm shrink-0 mt-0.5">${sIdx + 1}</span>
                                    <div class="flex-grow font-bold ${fontCls} leading-relaxed math-scroll prose-math">
                                        ${isRevealed ? parseMarkdownSafe(st, false) : `<span class="italic text-sm text-slate-400 font-normal">Nhấn "Hiện Bước Kế Tiếp" để mở bước ${sIdx + 1}...</span>`}
                                    </div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>`;
            }

            let teacherNoteHtml = slide.teacherNote ? `
                <div id="lecture-teacher-note" class="hidden mt-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 shadow-sm text-sm font-medium leading-relaxed animate-fade-in">
                    <div class="font-black text-amber-900 uppercase text-xs mb-1.5 flex items-center gap-1.5">
                        <i class="fa-solid fa-lightbulb text-amber-600"></i> Ghi chú & Lời nhắc Sư phạm cho Giáo viên:
                    </div>
                    <div class="prose-math">
                        ${parseMarkdownSafe(slide.teacherNote, false)}
                    </div>
                </div>` : '';

            let html = `
            <div class="w-full max-w-6xl ${animCls} flex flex-col pb-8 mx-auto mt-2">
                
                <!-- Top Lecture Presentation Bar -->
                <div class="w-full mb-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-slate-200 shadow-lg flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30">
                    <div class="flex items-center gap-2 overflow-x-auto admin-scroll max-w-full py-1">
                        <span class="text-xs font-black text-slate-800 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                            <i class="fa-solid fa-book-open text-teal-600"></i> Slide:
                        </span>
                        ${slideNavBtns}
                    </div>
                    
                    <div class="flex items-center gap-2 shrink-0">
                        <!-- Quick Font Zoom Controls -->
                        <div class="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                            <button onclick="changeAppFontSize(-1)" title="Thu nhỏ chữ (A-)" class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center text-xs font-black text-slate-700 transition">A-</button>
                            <span class="text-[10px] font-black text-teal-700 px-1 font-scale-display">100%</span>
                            <button onclick="changeAppFontSize(1)" title="Phóng to chữ (A+)" class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center text-xs font-black text-slate-700 transition">A+</button>
                        </div>

                        <button onclick="toggleAppDarkMode()" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 flex items-center gap-1 btn-3d" title="Chế độ Tối / Chiếu TV">
                            <i class="dark-mode-icon fa-solid fa-moon text-indigo-600"></i>
                        </button>

                        <button onclick="openDisplayCustomizerModal()" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 flex items-center gap-1 btn-3d" title="Tùy biến hiển thị & Cỡ chữ">
                            <i class="fa-solid fa-sliders text-teal-600"></i>
                        </button>

                        ${slide.teacherNote ? `
                        <button onclick="document.getElementById('lecture-teacher-note')?.classList.toggle('hidden'); playSound('click');" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs transition border border-amber-200 flex items-center gap-1 btn-3d" title="Hiện/ẩn ghi chú giảng viên">
                            <i class="fa-solid fa-chalkboard-user text-amber-600"></i> Ghi chú
                        </button>` : ''}
                        
                        <button onclick="openWhiteboardWindow()" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-bold rounded-xl text-xs transition border border-purple-200 flex items-center gap-1 btn-3d" title="Mở Bảng Trắng TBS">
                            <i class="fa-solid fa-pen-ruler"></i> Bảng Trắng
                        </button>

                        <button onclick="renderTeacherSetupScreen()" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold rounded-xl text-xs transition border border-rose-200 flex items-center gap-1 btn-3d">
                            <i class="fa-solid fa-power-off"></i> Về Studio
                        </button>
                    </div>
                </div>

                <!-- Slide Presentation Canvas -->
                <div class="bg-white p-8 md:p-12 ${cardCls} shadow-2xl relative overflow-hidden">
                    
                    <div class="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-6">
                        <div class="flex items-center gap-3">
                            <span class="w-12 h-12 rounded-2xl ${themeBadgeCls} flex items-center justify-center font-black text-xl shadow-md">
                                ${slideIdx + 1}
                            </span>
                            <h2 class="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-wide font-display">
                                ${slide.title}
                            </h2>
                        </div>
                        <span class="text-xs font-black uppercase ${themeAccentCls} bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
                            Slide ${slideIdx + 1} / ${totalSlides}
                        </span>
                    </div>

                    <!-- Slide Main Content -->
                    <div class="${fontCls} ${alignCls} font-bold leading-relaxed text-slate-800 math-scroll space-y-4 prose-math">
                        ${parseMarkdownSafe(slide.content || "", false)}
                    </div>

                    ${teacherNoteHtml}
                    ${stepsHtml}

                    <!-- Slide Navigation & Step Control Bar -->
                    <div class="flex justify-between items-center mt-12 pt-6 border-t-2 border-slate-100 flex-wrap gap-4">
                        <button ${prevSlide !== null ? `onclick="renderLecturePresentation(${prevSlide}, 0)"` : 'disabled'} class="px-8 py-4 rounded-2xl font-black text-base uppercase tracking-wider transition btn-3d ${prevSlide !== null ? 'bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white shadow-md border-2 border-slate-200' : 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed border-2 border-transparent'}">
                            <i class="fa-solid fa-arrow-left mr-2"></i> Slide Trước
                        </button>

                        <div class="flex items-center gap-3">
                            ${steps.length > 0 && currentLectureStepIdx < totalSteps ? `
                            <button onclick="nextLectureStep(${slideIdx})" class="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-2xl text-base uppercase tracking-wider shadow-lg btn-3d flex items-center gap-2">
                                <i class="fa-solid fa-shoe-prints text-amber-200"></i> Hiện Bước Kế Tiếp (${currentLectureStepIdx + 1}/${totalSteps})
                            </button>` : ''}
                        </div>

                        <button ${nextSlide !== null ? `onclick="renderLecturePresentation(${nextSlide}, 0)"` : 'disabled'} class="px-8 py-4 rounded-2xl font-black text-base uppercase tracking-wider transition btn-3d ${nextSlide !== null ? `${themeBadgeCls} shadow-md` : 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed border-2 border-transparent'}">
                            Slide Kế Tiếp <i class="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    </div>

                </div>
            </div>`;

            let appEl = document.getElementById('app-content');
            if (appEl) {
                appEl.innerHTML = html;
                triggerMathJax(appEl);
            }
        }

        function nextLectureStep(slideIdx) {
            let lectures = (GAME_DATA && GAME_DATA.lectures) ? GAME_DATA.lectures : [];
            let slide = lectures[slideIdx];
            let totalSteps = (slide && slide.steps) ? slide.steps.length : 0;
            if (currentLectureStepIdx < totalSteps) {
                currentLectureStepIdx++;
                playSound('streak');
                renderLecturePresentation(slideIdx, currentLectureStepIdx);
            }
        }

        function revealAllLectureSteps(slideIdx) {
            let lectures = (GAME_DATA && GAME_DATA.lectures) ? GAME_DATA.lectures : [];
            let slide = lectures[slideIdx];
            currentLectureStepIdx = (slide && slide.steps) ? slide.steps.length : 0;
            playSound('powerup');
            renderLecturePresentation(slideIdx, currentLectureStepIdx);
        }

        function resetLectureSteps(slideIdx) {
            currentLectureStepIdx = 0;
            playSound('click');
            renderLecturePresentation(slideIdx, 0);
        }

        function startTeamGame() { 
            state.teams = []; state.answeredQuestions = []; state.userChoices = {}; 
            for(let i=1; i<=state.numTeams; i++) { 
                let el = document.getElementById(`team-name-${i}`); 
                state.teams.push({ id: i, name: (el?el.value:'') || `Đội ${i}`, score: 0 }); 
            } 
            let teacherTeam = { id: 'teacher', name: 'Giáo Viên', isTeacher: true };
            Object.defineProperty(teacherTeam, 'score', { get: function() { return 0; }, set: function(v) {} });
            state.teams.push(teacherTeam);
            state.currentTeamIndex = state.teams.length - 1; 
            document.getElementById('admin-modal').classList.add('hidden'); document.getElementById('admin-modal').classList.remove('flex'); document.getElementById('app-content').classList.remove('hidden'); document.getElementById('scoreboard').classList.remove('hidden'); 
            renderScoreboard(); 
            if (GAME_DATA && GAME_DATA.round1 && GAME_DATA.round1.length > 0) {
                state.currentRound = 'round1';
                openQuestion(GAME_DATA.round1[0].id);
            } else {
                renderDashboard();
            }
        }
        
        function renderDashboard() {
            state.currentRound = null; state.currentQuestion = null;
            let quickNav = renderPresentationQuickNav();
            document.getElementById('app-content').innerHTML = `
            <div class="w-full max-w-6xl fade-in text-center mt-2 flex flex-col items-center">
                ${quickNav}
                <h2 onclick="this.classList.toggle('opacity-0')" class="text-3xl font-black my-6 text-sky-950 drop-shadow-sm uppercase tracking-widest cursor-pointer transition-opacity duration-300 select-none bg-white/80 px-8 py-3 rounded-full border-2 border-sky-200 shadow-md" title="Bấm để ẩn/hiện tiêu đề">
                    <i class="fa-solid fa-tv mr-3 text-sky-600"></i>MÀN HÌNH CHÍNH TRÌNH CHIẾU
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <div onclick="selectRound('round1')" class="glass-panel p-10 rounded-[2.5rem] cursor-pointer hover:-translate-y-2 border-b-8 border-b-sky-500 bg-white shadow-xl btn-3d group">
                        <div class="w-20 h-20 bg-sky-100 text-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner group-hover:scale-110 transition"><i class="fa-solid fa-list-check"></i></div>
                        <h3 class="text-2xl font-black text-sky-700 uppercase tracking-wide mb-2">Phần I: Trắc Nghiệm</h3>
                        <p class="text-xs font-bold text-slate-500">4 phương án A, B, C, D (10 điểm / câu)</p>
                    </div>
                    <div onclick="selectRound('round2')" class="glass-panel p-10 rounded-[2.5rem] cursor-pointer hover:-translate-y-2 border-b-8 border-b-amber-500 bg-white shadow-xl btn-3d group">
                        <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner group-hover:scale-110 transition"><i class="fa-solid fa-check-double"></i></div>
                        <h3 class="text-2xl font-black text-amber-700 uppercase tracking-wide mb-2">Phần II: Đúng / Sai</h3>
                        <p class="text-xs font-bold text-slate-500">4 ý lựa chọn Đ/S độc lập chuẩn 2025</p>
                    </div>
                    <div onclick="selectRound('round3')" class="glass-panel p-10 rounded-[2.5rem] cursor-pointer hover:-translate-y-2 border-b-8 border-b-rose-500 bg-white shadow-xl btn-3d group">
                        <div class="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner group-hover:scale-110 transition"><i class="fa-solid fa-keyboard"></i></div>
                        <h3 class="text-2xl font-black text-rose-700 uppercase tracking-wide mb-2">Phần III: Trả Lời Ngắn</h3>
                        <p class="text-xs font-bold text-slate-500">Điền số/công thức đáp án (15 điểm / câu)</p>
                    </div>
                </div>
                <button onclick="renderTeacherSetupScreen()" class="mt-10 px-8 py-3.5 bg-slate-800 text-white font-black rounded-2xl shadow-lg hover:bg-slate-900 transition uppercase tracking-wider btn-3d text-sm"><i class="fa-solid fa-power-off mr-2"></i>Dừng trình chiếu & Về Studio</button>
            </div>`; 
            triggerMathJax();
        }

        function selectRound(rId) {
            state.currentRound = rId;
            let quickNav = renderPresentationQuickNav();
            let btns = (GAME_DATA[rId]||[]).map((q, index) => {
                let isAns = (rId==='round1'||rId==='round3') ? state.answeredQuestions.includes(`${rId}_${q.id}`) : q.statements?.every((_,i)=>state.answeredQuestions.includes(`round2_${q.id}_${i}`));
                return `<button onclick="openQuestion('${q.id}')" class="glass-panel aspect-square rounded-[1.5rem] font-black text-3xl border-2 transition btn-3d flex items-center justify-center shadow-lg ${isAns?'bg-slate-100 text-slate-300 opacity-60 border-slate-200 shadow-none':'text-sky-700 bg-white border-sky-300 hover:bg-sky-600 hover:text-white hover:border-sky-600 hover:scale-110'}">${index + 1}</button>`;
            }).join('');
            
            document.getElementById('app-content').innerHTML = `
                <div class="w-full max-w-6xl fade-in mt-2 flex flex-col items-center">
                    ${quickNav}
                    <div class="w-full grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 p-8 bg-white/90 rounded-[2.5rem] border-2 border-sky-100 shadow-2xl backdrop-blur-md">${btns}</div>
                </div>`;
            triggerMathJax();
        }

        function openQuestion(qId) {
            let currentRoundData = GAME_DATA[state.currentRound] || [];
            let currentIndex = currentRoundData.findIndex(x => String(x.id) === String(qId));
            if(currentIndex === -1) return;
            
            let q = currentRoundData[currentIndex];
            state.currentQuestion = q;
            
            let prevId = currentIndex > 0 ? currentRoundData[currentIndex - 1].id : null;
            let nextId = currentIndex < currentRoundData.length - 1 ? currentRoundData[currentIndex + 1].id : null;
            let totalQs = currentRoundData.length;

            let isAnsAll = (state.currentRound==='round1'||state.currentRound==='round3') ? state.answeredQuestions.includes(`${state.currentRound}_${q.id}`) : q.statements?.every((_,i)=>state.answeredQuestions.includes(`round2_${q.id}_${i}`));

            let roundNames = { round1: 'Phần I: Trắc nghiệm', round2: 'Phần II: Đúng/Sai', round3: 'Phần III: Trả lời ngắn' };
            
            let html = `
                <div class="w-full max-w-6xl fade-in flex flex-col pb-6 mx-auto">
                    <!-- Top Presentation Bar with Hamburger Button & Maximized Question Space -->
                    <div class="flex justify-between items-center mb-4 gap-3">
                        <button onclick="toggleQuestionDrawer()" class="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black rounded-xl text-xs md:text-sm uppercase shadow-md hover:scale-105 transition flex items-center gap-2 btn-3d">
                            <i class="fa-solid fa-bars text-base"></i>
                            <span>Danh Sách Câu Hỏi</span>
                        </button>
                        
                        <div class="flex items-center gap-2">
                            <span class="px-5 py-1.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white rounded-full font-black text-sm md:text-base uppercase shadow-md tracking-wider border border-white">
                                CÂU HỎI SỐ ${q.id}
                            </span>
                            <span class="text-sky-700 font-extrabold text-xs uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-200 hidden sm:inline-block">
                                ${roundNames[state.currentRound]||''}
                            </span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <span class="text-slate-500 font-extrabold text-xs uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs hidden sm:inline-block">
                                Câu ${currentIndex + 1} / ${totalQs}
                            </span>
                            <button onclick="renderDashboard()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 shadow-xs" title="Về Màn hình chính">
                                <i class="fa-solid fa-grip text-sky-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Maximized Question Content Box -->
                    <div class="question-text prose-math bg-white p-8 md:p-12 rounded-[2.5rem] border-4 border-sky-200 shadow-2xl text-2xl md:text-3xl font-bold leading-relaxed mb-6 math-scroll text-slate-900 selection:bg-sky-200">
                        ${parseMarkdownSafe(q.text||"")}
                        ${q.image ? `<img src="${q.image}" class="max-h-[500px] mx-auto mt-8 rounded-3xl shadow-2xl border-4 border-slate-100 object-contain">` : ''}
                    </div>`;

            if (state.currentRound === 'round1') {
                let qK = `round1_${q.id}`; let isAns = state.answeredQuestions.includes(qK);
                if (!state.shuffledOptions[qK]) { state.shuffledOptions[qK] = (q.options||[]).map(o => ({ text: o, isCorrect: String(o).trim().toLowerCase() === String(q.answer||'').trim().toLowerCase() })); state.shuffledOptions[qK].sort(()=>Math.random()-0.5); }
                
                html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-8">` + state.shuffledOptions[qK].map((opt, i) => {
                    let cls = isAns ? (opt.isCorrect ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-emerald-400 shadow-2xl scale-[1.03] ring-4 ring-emerald-200 z-10" : "bg-slate-50 text-slate-400 opacity-50 pointer-events-none border-slate-200") : "bg-white border-sky-100 hover:border-sky-400 cursor-pointer hover:shadow-xl btn-3d text-blue-950";
                    return `<div onclick="checkAnswer(${opt.isCorrect}, '${q.id}')" class="p-8 border-[4px] rounded-3xl flex items-center gap-6 font-bold text-2xl transition-all duration-500 ${cls}">
                                <span class="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl shrink-0 shadow-inner ${isAns&&opt.isCorrect?'bg-white/20 text-white':'bg-sky-50 text-sky-600'}">${['A','B','C','D'][i]}</span>
                                <div class="math-scroll">${parseMarkdownSafe(opt.text||"", true)}</div>
                            </div>`;
                }).join('') + `</div>`;
            } else if (state.currentRound === 'round2') {
                html += `<div class="flex flex-col gap-6">` + (q.statements||[]).map((s, i) => {
                    let qK = `round2_${q.id}_${i}`; let isA = state.answeredQuestions.includes(qK); let isTrueVal = s.isTrue === true || s.isTrue === 'true';
                    let displayBox = isA ? `<div class="px-8 py-4 rounded-2xl text-2xl font-black text-white shadow-lg tracking-widest uppercase ${s.isTrue?'bg-gradient-to-r from-emerald-400 to-emerald-600 ring-4 ring-emerald-100':'bg-gradient-to-r from-rose-400 to-rose-600 ring-4 ring-rose-100'}">${s.isTrue?'ĐÚNG':'SAI'}</div>` : `<div class="flex gap-4"><button onclick="checkTF(${isTrueVal}, '${q.id}', ${i})" class="px-8 py-4 bg-slate-50 border-2 border-slate-200 shadow-sm hover:bg-main hover:text-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 rounded-2xl font-black text-xl transition-all btn-3d tracking-widest text-slate-600">ĐÚNG</button><button onclick="checkTF(${!isTrueVal}, '${q.id}', ${i})" class="px-8 py-4 bg-slate-50 border-2 border-slate-200 shadow-sm hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-xl hover:-translate-y-1 rounded-2xl font-black text-xl transition-all btn-3d tracking-widest text-slate-600">SAI</button></div>`;
                    
                    return `<div class="bg-white p-8 rounded-[2rem] border-[3px] border-sky-50 flex items-center justify-between gap-8 shadow-md hover:shadow-lg transition-all duration-300">
                                <div class="font-bold text-3xl math-scroll text-blue-950 leading-relaxed">
                                    <span class="text-white bg-gradient-to-br from-sky-400 to-blue-500 w-14 h-14 inline-flex items-center justify-center rounded-xl shadow-md mr-5 text-2xl font-black uppercase">${s.label}</span> 
                                    ${parseMarkdownSafe(s.text||"", true)}
                                </div>
                                ${displayBox}
                            </div>`;
                }).join('') + `</div>`;
            } else if (state.currentRound === 'round3') {
                let qK = `round3_${q.id}`; let isA = state.answeredQuestions.includes(qK);
                let showBox = isA ? `<div class="p-10 bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-amber-200 rounded-[2.5rem] font-black text-center text-white text-4xl shadow-2xl uppercase tracking-widest transform scale-105 transition-all">ĐÁP ÁN CHUẨN: <span class="bg-white px-8 py-3 rounded-2xl shadow-md text-amber-600 ml-5 block mt-6 md:inline-block md:mt-0">${q.answer}</span></div>` : `<div class="flex flex-col gap-4 max-w-3xl mx-auto">
                    <button onclick="checkRound3(true, '${q.id}')" class="w-full py-6 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black text-2xl rounded-[2rem] uppercase shadow-xl btn-3d tracking-widest hover:shadow-2xl transition-all border-2 border-white"><i class="fa-solid fa-check mr-4 text-3xl"></i> ĐỘI TRẢ LỜI ĐÚNG (+ ĐIỂM)</button>
                    <button onclick="checkRound3(false, '${q.id}')" class="w-full py-6 bg-gradient-to-r from-rose-400 to-rose-600 text-white font-black text-2xl rounded-[2rem] uppercase shadow-xl btn-3d tracking-widest hover:shadow-2xl transition-all border-2 border-white"><i class="fa-solid fa-xmark mr-4 text-3xl"></i> ĐỘI TRẢ LỜI SAI</button>
                    <button onclick="state.answeredQuestions.push('${qK}'); openQuestion('${q.id}'); playSound('powerup'); triggerConfetti();" class="w-full mt-4 py-4 bg-slate-200 text-slate-500 font-bold text-xl rounded-[2rem] uppercase shadow-sm btn-3d hover:bg-slate-300 transition-all border-2 border-white"><i class="fa-solid fa-eye mr-2 text-2xl"></i> Bỏ qua & Hiển thị đáp án</button>
                </div>`; 
                html += `<div class="mt-8">${showBox}</div>`;
            }

            let explHtml = q.explanation ? `<div class="mt-10 ${isAnsAll?'':'hidden'}">
                <button onclick="document.getElementById('sol-${q.id}').classList.toggle('hidden'); triggerMathJax();" class="px-8 py-5 bg-gradient-to-r from-amber-100 to-amber-200 font-black rounded-3xl text-amber-800 border-4 border-white hover:brightness-105 transition-all w-full text-left shadow-lg btn-3d text-2xl tracking-wider uppercase ring-2 ring-amber-300"><i class="fa-solid fa-lightbulb text-amber-500 mr-4 text-3xl drop-shadow-sm"></i> Lời giải chi tiết</button>
                <div id="sol-${q.id}" class="hidden mt-6 p-10 bg-amber-50/50 border-4 border-amber-100 rounded-[2.5rem] math-scroll text-2xl shadow-inner leading-relaxed text-blue-950 font-medium explanation-box">${formatExplanation(q.explanation)}</div>
            </div>` : '';

            
            html += `
                <div class="flex justify-between items-center mt-14 pt-8 border-t-[4px] border-slate-100">
                    <button ${prevId ? `onclick="openQuestion('${prevId}')"` : 'disabled'} id="btn-prev-q" class="px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-wider transition-all btn-3d ${prevId ? 'bg-sky-100 text-sky-700 hover:bg-sky-600 hover:text-white shadow-md border-2 border-sky-200' : 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed border-2 border-transparent'}"><i class="fa-solid fa-arrow-left mr-3"></i> Câu Trước</button>
                    <span class="font-black text-slate-400 uppercase tracking-widest hidden md:block text-2xl">Câu ${currentIndex + 1} / ${totalQs}</span>
                    <button ${nextId ? `onclick="openQuestion('${nextId}')"` : 'disabled'} id="btn-next-q" class="px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-wider transition-all btn-3d ${nextId ? 'bg-sky-100 text-sky-700 hover:bg-sky-600 hover:text-white shadow-md border-2 border-sky-200' : 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed border-2 border-transparent'}">Câu Tiếp <i class="fa-solid fa-arrow-right ml-3"></i></button>
                </div>
            `;
            
            document.getElementById('app-content').innerHTML = html + explHtml + `</div>`; triggerMathJax();
        }

        function checkAnswer(isC, qId) { 
            let qK = `round1_${qId}`; if(state.answeredQuestions.includes(qK)) return; state.answeredQuestions.push(qK); 
            let pts = GAME_DATA.round1.find(x => String(x.id) === String(qId))?.points !== undefined ? parseFloat(GAME_DATA.round1.find(x => String(x.id) === String(qId)).points) : 10;
            if(isC) { playSound('correct'); state.teams[state.currentTeamIndex].score += pts; state.teams[state.currentTeamIndex].score = Math.round(state.teams[state.currentTeamIndex].score * 100) / 100; showFloatingPoints(pts); } else { playSound('wrong'); } 
            renderScoreboard(); openQuestion(qId); 
        }

        function checkRound3(isC, qId) {
            let qK = `round3_${qId}`; if(state.answeredQuestions.includes(qK)) return;
            let pts = GAME_DATA.round3.find(x => String(x.id) === String(qId))?.points !== undefined ? parseFloat(GAME_DATA.round3.find(x => String(x.id) === String(qId)).points) : 15;
            if (isC) {
                state.answeredQuestions.push(qK); // Only lock if correct (or we can lock anyway)
                playSound('correct'); 
                triggerConfetti();
                state.teams[state.currentTeamIndex].score += pts; 
                state.teams[state.currentTeamIndex].score = Math.round(state.teams[state.currentTeamIndex].score * 100) / 100; 
                showFloatingPoints(pts);
                renderScoreboard(); openQuestion(qId);
            } else {
                playSound('wrong');
                // Don't lock question so another team can try.
            }
        }

        function checkTF(isC, qId, i) { 
            let qK = `round2_${qId}_${i}`; if(state.answeredQuestions.includes(qK)) return; state.answeredQuestions.push(qK); 
            
            let isExam = adminState.loadedSettings && adminState.loadedSettings.examMode === 'exam';
            state.userChoices[qK] = { userChoice: isC, isCorrect: isC }; 
            
            let qData = GAME_DATA.round2.find(x => String(x.id) === String(qId));
            let maxStmtPts = qData?.statements[i]?.points !== undefined ? parseFloat(qData.statements[i].points) : 10;

            if (!isExam) {
                let penalty = Math.round((maxStmtPts / 2) * 100) / 100; 
                if(isC) { playSound('correct'); state.teams[state.currentTeamIndex].score += maxStmtPts; showFloatingPoints(maxStmtPts); } 
                else { playSound('wrong'); state.teams[state.currentTeamIndex].score -= penalty; showFloatingPoints(`-${penalty}`, true); }
                state.teams[state.currentTeamIndex].score = Math.round(state.teams[state.currentTeamIndex].score * 100) / 100;
            } else {
                if(isC) playSound('correct'); else playSound('wrong');
                let answeredCount = 0; let correctCount = 0; let totalMaxPtsForQuestion = 0; 
                
                for(let j=0; j<4; j++) {
                    let k = `round2_${qId}_${j}`;
                    totalMaxPtsForQuestion += qData?.statements[j]?.points !== undefined ? parseFloat(qData.statements[j].points) : 10;
                    if(state.answeredQuestions.includes(k)) {
                        answeredCount++;
                        if(state.userChoices[k].isCorrect) correctCount++;
                    }
                }
                
                if (answeredCount === 4) {
                    let baseScore = totalMaxPtsForQuestion; // Total points for the whole question (sum of 4 statements)
                    let earnedPts = 0;
                    if (correctCount === 1) earnedPts = baseScore * 0.1;
                    else if (correctCount === 2) earnedPts = baseScore * 0.25;
                    else if (correctCount === 3) earnedPts = baseScore * 0.5;
                    else if (correctCount === 4) earnedPts = baseScore * 1.0;
                    
                    // Format score to 2 decimal places to avoid floating point issues
                    earnedPts = Math.round(earnedPts * 100) / 100;
                    state.teams[state.currentTeamIndex].score += earnedPts;
                    state.teams[state.currentTeamIndex].score = Math.round(state.teams[state.currentTeamIndex].score * 100) / 100;
                    showFloatingPoints(earnedPts);
                }
            }
            renderScoreboard(); openQuestion(qId); 
        }

        function showFloatingPoints(pts, isN=false) { let el = document.createElement('div'); el.className = `fixed pointer-events-none z-[9999] text-7xl font-black ${isN?'text-rose-500':'text-emerald-500'} drop-shadow-2xl`; el.innerHTML = isN?pts:`+${pts}`; el.style.left='50%'; el.style.top='35%'; document.body.appendChild(el); setTimeout(()=>el.remove(),1500); }
        
        function renderScoreboard() { 
            let cols = state.teams.length;
            document.getElementById('teams-container').className = `flex-grow flex items-center justify-center gap-2.5 overflow-x-auto py-0.5 max-w-5xl mx-auto`;
            let colors = [
                {bg: 'bg-gradient-to-r from-red-500 to-rose-600', text: 'text-white', ring: 'ring-amber-300 ring-4', border: 'border-red-400'},
                {bg: 'bg-gradient-to-r from-blue-500 to-indigo-600', text: 'text-white', ring: 'ring-amber-300 ring-4', border: 'border-blue-400'},
                {bg: 'bg-gradient-to-r from-emerald-500 to-teal-600', text: 'text-white', ring: 'ring-amber-300 ring-4', border: 'border-emerald-400'},
                {bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-white', ring: 'ring-sky-300 ring-4', border: 'border-amber-300'},
                {bg: 'bg-gradient-to-r from-purple-500 to-violet-600', text: 'text-white', ring: 'ring-amber-300 ring-4', border: 'border-purple-400'}
            ];
            document.getElementById('teams-container').innerHTML = state.teams.map((t, i) => { 
                let c = t.isTeacher ? {bg: 'bg-gradient-to-r from-slate-700 to-slate-900', text: 'text-white', ring: 'ring-amber-300 ring-4', border: 'border-slate-600'} : colors[i % colors.length];
                let activeClass = (state.currentTeamIndex === i) ? `${c.ring} scale-105 ${c.bg} shadow-lg z-20 border-2 border-amber-300 brightness-105` : `opacity-90 ${c.bg} border ${c.border} scale-95 shadow-sm hover:opacity-100 hover:scale-100`; 
                let scoreHtml = t.isTeacher ? `<span class="text-xs text-amber-300 font-black"><i class="fa-solid fa-user-tie mr-1"></i> GV</span>` : `<span class="text-base md:text-lg font-black text-white drop-shadow-md ml-1.5">${t.score}đ</span>`;
                return `<div onclick="state.currentTeamIndex=${i}; renderScoreboard();" class="relative px-3.5 py-1.5 rounded-xl cursor-pointer transition-all duration-300 ${activeClass} flex items-center justify-between gap-2 shrink-0 h-9">
                    ${!t.isTeacher ? `<button onclick="event.stopPropagation(); editTeamScore(${i})" class="w-4 h-4 bg-black/40 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-70 group-hover:opacity-100" title="Sửa điểm"><i class="fa-solid fa-pen text-[8px]"></i></button>` : ''}
                    <span class="text-xs font-black text-white uppercase tracking-wider truncate max-w-[90px]">${t.name}:</span>
                    ${scoreHtml}
                </div>`; 
            }).join(''); 
        }

        function toggleBGM() {
            let audio = document.getElementById('audio-bgm');
            let btn = document.getElementById('btn-bgm-toggle');
            if (audio.paused) {
                audio.play();
                btn.classList.remove('from-amber-500', 'to-orange-600');
                btn.classList.add('from-emerald-500', 'to-green-600');
                btn.querySelector('i').classList.add('fa-beat');
            } else {
                audio.pause();
                btn.classList.add('from-amber-500', 'to-orange-600');
                btn.classList.remove('from-emerald-500', 'to-green-600');
                btn.querySelector('i').classList.remove('fa-beat');
            }
        }

        function editTeamScore(idx) {
            let current = state.teams[idx].score;
            let newScore = prompt(`Nhập điểm mới cho ${state.teams[idx].name}:`, current);
            if (newScore !== null) {
                let parsed = parseFloat(newScore);
                if (!isNaN(parsed)) {
                    state.teams[idx].score = Math.round(parsed * 100) / 100;
                    renderScoreboard();
                    playSound('powerup');
                } else {
                    alert("Điểm không hợp lệ! Vui lòng nhập một số.");
                }
            }
        }

        function pickRandomTeam() { let btn = document.getElementById('btn-random-picker'); let icon = btn.querySelector('i'); if(btn.disabled) return; btn.disabled = true; icon.classList.add('fa-spin'); playSound('powerup'); let rolls=0; let int=setInterval(()=>{ let rIdx = Math.floor(Math.random() * state.teams.length); let teamDivs = document.getElementById('teams-container').children; for(let i=0; i<teamDivs.length; i++) teamDivs[i].classList.remove('ring-8','scale-110','bg-sky-50','shadow-2xl','z-20'); if(teamDivs[rIdx]) teamDivs[rIdx].classList.add('ring-8','scale-110','bg-sky-50','shadow-2xl','z-20'); rolls++; if(rolls>=20) { clearInterval(int); icon.classList.remove('fa-spin'); btn.disabled=false; triggerConfetti(); state.currentTeamIndex = rIdx; renderScoreboard(); } }, 100); }

        function openAdmin() { adminState.data = JSON.parse(JSON.stringify(GAME_DATA)); document.getElementById('admin-modal').classList.remove('hidden'); document.getElementById('admin-modal').classList.add('flex'); document.getElementById('app-content').classList.add('hidden'); adminSetTab('round1'); updateGlobalModeDisplay(); initHamburgerMenuSetting(); }
        function closeAdmin() { adminState.editingQ = null; renderAdminUI(); }
        
        function changeGlobalMode(mode) {
            if(!adminState.loadedSettings) adminState.loadedSettings = {};
            adminState.loadedSettings.examMode = mode;
            showToast(mode === 'exam' ? "Đã chuyển sang chấm thi THPT Quốc Gia!" : "Đã chuyển sang chấm Luyện tập tùy chỉnh!");
            renderAdminList(); 
            if(adminState.editingQ) adminEditQ(adminState.editingQ.id); 
        }
        function updateGlobalModeDisplay() {
            let el = document.getElementById('global-exam-mode');
            if(el && adminState.loadedSettings) el.value = adminState.loadedSettings.examMode || 'practice';
        }

        function initHamburgerMenuSetting() {
            let el = document.getElementById('toggle-hamburger-menu-setting');
            let val = localStorage.getItem('showHamburgerMenu') !== 'false' ? 'true' : 'false';
            if (el) el.value = val;
            try {
                if (window.db) {
                    db.collection("GameData").doc("SystemSettings").get().then(doc => {
                        if (doc.exists && doc.data().showHamburgerMenu !== undefined) {
                            let cloudVal = doc.data().showHamburgerMenu ? 'true' : 'false';
                            localStorage.setItem('showHamburgerMenu', cloudVal);
                            if (el) el.value = cloudVal;
                        }
                    }).catch(e=>{});
                }
            } catch(e){}
        }

        async function changeHamburgerMenuSetting(val) {
            let isShow = val === 'true';
            localStorage.setItem('showHamburgerMenu', isShow ? 'true' : 'false');
            showToast(isShow ? "Đã BẬT hiển thị Menu Hamburger ngoài giao diện chính!" : "Đã ẨN Menu Hamburger ngoài giao diện chính!");
            try {
                if (window.db) {
                    await db.collection("GameData").doc("SystemSettings").set({ showHamburgerMenu: isShow }, { merge: true });
                }
            } catch(e){}
        }

        function adminSetTab(t) { 
            if (adminState.round === 'json' && t !== 'json') { 
                let editorEl = document.getElementById('admin-json-editor');
                if (editorEl && editorEl.value.trim()) {
                    try { 
                        let parsed = smartParseJSON(editorEl.value);
                        if (parsed) {
                            adminState.data = sanitizeGameData(parsed);
                            GAME_DATA = JSON.parse(JSON.stringify(adminState.data));
                        }
                    } catch(e) { 
                        showToast("Lỗi JSON: " + (e.message || "Định dạng không hợp lệ"), true); 
                        return; 
                    } 
                }
            } 
            adminState.round = t; 
            adminState.editingQ = null; 
            renderAdminUI(); 
        }

        function renderAdminUI() {
            let updateBtn = document.getElementById('btn-update-loaded-exam');
            if (adminState.loadedCode) { updateBtn.classList.remove('hidden'); document.getElementById('loaded-code-display').innerText = adminState.loadedCode; } else { updateBtn.classList.add('hidden'); }
            ['round1', 'round2', 'round3', 'theory', 'infographics', 'json', 'fix_errors', 'bank', 'qbank', 'results', 'students', 'teachers', 'presentation'].forEach(r => { 
                let b = document.getElementById(`tab-${r}`); if(!b) return;
                if(r === adminState.round) {
                    if(r==='qbank') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-mainDark text-white ml-auto shadow-md";
                    else if(r==='bank') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-sky-600 text-white shadow-md";
                    else if(r==='results') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-amber-600 text-white shadow-md";
                    else if(r==='students') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-mainDark text-white shadow-md";
                    else if(r==='teachers') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-rose-600 text-white shadow-md";
                    else if(r==='json') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-slate-600 text-white shadow-md";
                    else if(r==='fix_errors') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-purple-600 text-white shadow-md";
                    else if(r==='presentation') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-mainDark text-white shadow-md ml-2";
                    else if(r==='theory') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-teal-700 text-white shadow-md border-2 border-teal-800";
                    else if(r==='infographics') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-indigo-700 text-white shadow-md border-2 border-indigo-800";
                    else b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-sky-600 text-white shadow-md";
                } else {
                    if(r==='qbank') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-emerald-50 text-mainDark border border-mainLight ml-auto hover:bg-main hover:text-white transition";
                    else if(r==='bank') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-600 hover:text-white transition";
                    else if(r==='results') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-500 hover:text-white transition";
                    else if(r==='students') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-mainLight text-mainDark border border-mainLight hover:bg-main hover:text-white transition";
                    else if(r==='teachers') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition";
                    else if(r==='json') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200 transition";
                    else if(r==='fix_errors') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-600 hover:text-white transition";
                    else if(r==='presentation') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-mainLight text-main border border-mainLight ml-2 hover:bg-main hover:text-white transition";
                    else if(r==='theory') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-600 hover:text-white transition";
                    else if(r==='infographics') b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition";
                    else b.className = "px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
                }
            });
            let area = document.getElementById('admin-content-area');
            if(adminState.round === 'json') { area.innerHTML = `<textarea id="admin-json-editor" class="w-full h-full p-6 font-mono text-base outline-none resize-none bg-white shadow-inner">${JSON.stringify(adminState.data, null, 4)}</textarea>`; return; }
            if(adminState.round === 'fix_errors') { renderErrorFixUI(area); return; }
            if(adminState.round === 'bank') { renderAdminBank(area); return; }
            if(adminState.round === 'results') { renderStudentResults(area); return; }
            if(adminState.round === 'qbank') { renderQuestionBankSheet(area); return; }
            if(adminState.round === 'presentation') { renderPresentationSetup(area); return; }
            if(adminState.round === 'theory') { renderTheoryStudio(area); return; }
            if(adminState.round === 'infographics') { renderInfographicManagement(area); return; }
            if(adminState.round === 'students') { renderStudentManagement(area); return; }
            if(adminState.round === 'teachers') { renderTeacherManagement(area); return; }

            area.innerHTML = `<div class="flex h-full w-full bg-white"><div class="w-1/4 lg:w-1/5 border-r-2 border-slate-100 overflow-y-auto p-5 flex flex-col gap-3 bg-slate-50 admin-scroll" id="admin-list"></div><div class="w-3/4 lg:w-4/5 overflow-y-auto p-8 bg-white admin-scroll" id="admin-editor"><div class="flex items-center justify-center h-full text-slate-400 font-bold text-lg"><i class="fa-solid fa-arrow-pointer mr-3 text-2xl"></i> Chọn câu hỏi bên trái để biên tập chi tiết</div></div></div>`;
            renderAdminList(); 
        }

        const GDPT2018_THEORY_SAMPLES = {
            cuc_tri: {
                title: "Cực trị của Hàm số & Phương pháp Giải",
                summary: "Điểm cực trị của hàm số $y = f(x)$ là điểm mà tại đó đạo hàm $f'(x)$ đổi dấu (từ dương sang âm là cực đại, từ âm sang dương là cực tiểu).",
                formulas: [
                    "$$f'(x_0) = 0 \\quad \\text{và } f''(x_0) < 0 \\implies x_0 \\text{ là điểm Cực Đại}$$",
                    "$$f'(x_0) = 0 \\quad \\text{và } f''(x_0) > 0 \\implies x_0 \\text{ là điểm Cực Tiểu}$$",
                    "$$\\text{Hàm bậc 3 } y = ax^3 + bx^2 + cx + d \\text{ có 2 cực trị } \\iff b^2 - 3ac > 0$$"
                ],
                methods: "1. Tìm tập xác định $D$ của hàm số.\n2. Tính đạo hàm $y' = f'(x)$, giải phương trình $f'(x) = 0$ tìm các nghiệm $x_i \\in D$.\n3. Lập bảng biến thiên hoặc xét dấu của đạo hàm cấp hai $y''$.\n4. Kết luận điểm cực đại, cực tiểu và giá trị cực trị tương ứng.",
                traps: "Lưu ý phân biệt: 'Điểm cực trị của hàm số' ($x$), 'Giá trị cực trị' ($y$), và 'Điểm cực trị của đồ thị hàm số' ($M(x; y)$). Không áp dụng quy tắc $y''$ khi $y''(x_0) = 0$.",
                examples: [
                    {
                        typeName: "Dạng 1: Tìm điểm cực trị từ hàm số đa thức",
                        question: "Tìm các điểm cực trị của hàm số $y = x^3 - 3x^2 + 2$.",
                        analysis: "Tính $y'$, giải $y' = 0$ tìm nghiệm và lập bảng xét dấu để kết luận điểm cực đại, cực tiểu.",
                        solution: "**Lời giải:**\n- Tập xác định: $D = \\mathbb{R}$.\n- Đạo hàm: $y' = 3x^2 - 6x = 3x(x - 2)$. Cho $y' = 0 \\iff x = 0$ hoặc $x = 2$.\n- Dấu đạo hàm: $y'$ đổi dấu từ $+$ sang $-$ qua $x = 0$ (Cực đại), từ $-$ sang $+$ qua $x = 2$ (Cực tiểu).\n- Kết luận: Điểm cực đại là $x = 0$ ($y_{\\text{CĐ}} = 2$), điểm cực tiểu là $x = 2$ ($y_{\\text{CT}} = -2$)."
                    }
                ],
                applications: [
                    {
                        title: "Bài toán thực tế 1: Tối ưu hóa lợi nhuận kinh doanh",
                        question: "Một xưởng sản xuất bán sản phẩm với giá $p(x) = 120 - 0.5x$ (nghìn đồng/sản phẩm) và hàm chi phí $C(x) = 20x + 500$ (nghìn đồng). Tìm mức sản lượng $x$ để lợi nhuận thu được là lớn nhất.",
                        solution: "**Phương pháp giải & Lời giải:**\n1. Doanh thu: $R(x) = x \\cdot p(x) = 120x - 0.5x^2$.\n2. Lợi nhuận: $L(x) = R(x) - C(x) = -0.5x^2 + 100x - 500$.\n3. Tìm cực đại: $L'(x) = -x + 100 = 0 \\iff x = 100$.\nVì $L''(x) = -1 < 0$ nên hàm số đạt cực đại tại $x = 100$.\n- **Đáp số:** Sản xuất 100 sản phẩm thì lợi nhuận đạt cực đại là 4.500 nghìn đồng (4,5 triệu đồng)."
                    }
                ]
            },
            tiem_can: {
                title: "Đường Tiệm cận của Đồ thị Hàm số",
                summary: "Tiệm cận đứng (TCĐ), Tiệm cận ngang (TCN) và Tiệm cận xiên (TCX) phản ánh hành vi tiệm cận của đồ thị hàm số khi $x \\to x_0$ hoặc $x \\to \\pm\\infty$.",
                formulas: [
                    "$$\\lim_{x \\to x_0^{\\pm}} f(x) = \\pm\\infty \\implies x = x_0 \\text{ là Tiệm Cận Đứng}$$",
                    "$$\\lim_{x \\to \\pm\\infty} f(x) = y_0 \\implies y = y_0 \\text{ là Tiệm Cận Ngang}$$",
                    "$$y = ax + b \\quad (a = \\lim_{x \\to \\infty} \\frac{f(x)}{x}, \\; b = \\lim_{x \\to \\infty} [f(x) - ax]) \\implies \\text{Tiệm Cận Xiên}$$"
                ],
                methods: "1. Với hàm phân thức $y = \\frac{P(x)}{Q(x)}$: Nghiệm của $Q(x)=0$ không là nghiệm của $P(x)$ cho TCĐ $x = x_i$.\n2. Bậc tử = Bậc mẫu $\\implies$ TCN $y = \\frac{a_n}{b_n}$. Bậc tử < Bậc mẫu $\\implies$ TCN $y = 0$.\n3. Bậc tử lớn hơn bậc mẫu 1 bậc $\\implies$ Chia đa thức tìm TCX $y = ax + b$.",
                traps: "Quên triệt tiêu nhân tử chung giữa tử và mẫu trước khi kết luận số đường tiệm cận đứng.",
                examples: [
                    {
                        typeName: "Dạng 1: Tìm tiệm cận của hàm phân thức bậc 1 trên bậc 1",
                        question: "Tìm các đường tiệm cận của đồ thị hàm số $y = \\frac{2x - 1}{x + 1}$.",
                        analysis: "Xét giới hạn khi $x \\to -1^{\\pm}$ để tìm TCĐ và giới hạn khi $x \\to \\pm\\infty$ để tìm TCN.",
                        solution: "**Lời giải:**\n- $\\lim_{x \\to (-1)^+} \\frac{2x-1}{x+1} = -\\infty \\implies$ Đường thẳng $x = -1$ là tiệm cận đứng.\n- $\\lim_{x \\to \\pm\\infty} \\frac{2x-1}{x+1} = 2 \\implies$ Đường thẳng $y = 2$ là tiệm cận ngang."
                    }
                ],
                applications: [
                    {
                        title: "Bài toán thực tế 1: Nồng độ thuốc trong máu theo thời gian",
                        question: "Nồng độ một loại thuốc trong máu của bệnh nhân sau $t$ giờ tiêm được mô hình bởi $C(t) = \\frac{3t}{t^2 + 4}$ (mg/l). Khảo sát xu hướng nồng độ thuốc khi thời gian $t$ kéo dài vô hạn.",
                        solution: "**Phương pháp giải & Lời giải:**\n- Ta xét giới hạn khi $t \\to +\\infty$:\n$$\\lim_{t \\to +\\infty} C(t) = \\lim_{t \\to +\\infty} \\frac{3t}{t^2 + 4} = 0$$\n- **Ý nghĩa thực tế:** Đồ thị nhận trục hoành $C = 0$ làm tiệm cận ngang, nghĩa là sau thời gian dài lượng thuốc trong máu sẽ bị đào thải hoàn toàn về mức 0."
                    }
                ]
            },
            hinh_oxxyz: {
                title: "Hình học Tọa độ Oxyz & Mặt phẳng, Mặt cầu",
                summary: "Hệ tọa độ $Oxyz$ với 3 trục đôi một vuông góc. Các đối tượng cơ bản gồm Điểm, Vectơ, Mặt phẳng, Đường thẳng và Mặt cầu.",
                formulas: [
                    "$$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$$",
                    "$$\\text{Mặt phẳng } (P): A(x-x_0) + B(y-y_0) + C(z-z_0) = 0 \\quad (\\vec{n}=(A;B;C))$$",
                    "$$\\text{Khoảng cách: } d(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$",
                    "$$\\text{Mặt cầu: } (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$$"
                ],
                methods: "1. Tìm vectơ pháp tuyến $\\vec{n} = [\\vec{u}, \\vec{v}]$ từ tích có hướng của 2 vectơ chỉ phương.\n2. Lập phương trình chính tắc/tổng quát.\n3. Dùng công thức khoảng cách để xét vị trí tương đối giữa mặt phẳng và mặt cầu.",
                traps: "Nhầm lẫn giữa Vectơ pháp tuyến của mặt phẳng và Vectơ chỉ phương của đường thẳng vuông góc.",
                examples: [
                    {
                        typeName: "Dạng 1: Viết phương trình mặt phẳng đi qua 1 điểm và có VTPT",
                        question: "Viết phương trình mặt phẳng $(P)$ đi qua $A(1; -2; 3)$ và vuông góc với vectơ $\\vec{n} = (2; 1; -4)$.",
                        analysis: "Áp dụng công thức tổng quát $(P): A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$.",
                        solution: "**Lời giải:**\nPhương trình mặt phẳng $(P)$ là:\n$2(x - 1) + 1(y + 2) - 4(z - 3) = 0 \\iff 2x + y - 4z + 12 = 0$."
                    }
                ],
                applications: [
                    {
                        title: "Bài toán thực tế 1: Định vị vùng phủ sóng trạm phát sóng 5G",
                        question: "Một trạm phát sóng 5G được đặt tại vị trí $O(0;0;0)$ trên mặt đất, có bán kính phủ sóng hiệu quả là $R = 5\\text{ km}$. Một flycam bay dọc theo đường thẳng nối hai điểm $A(1; 2; 6)$ và $B(4; 5; 3)$. Hỏi flycam có đi qua vùng phủ sóng của trạm không?",
                        solution: "**Phương pháp giải & Lời giải:**\n1. Vùng phủ sóng là khối cầu $(S): x^2 + y^2 + z^2 \\le 25$.\n2. Phương trình đường thẳng $AB$: $\\vec{AB} = (3; 3; -3) = 3(1; 1; -1)$. Điểm $M \\in AB \\implies M(1+t; 2+t; 6-t)$.\n3. Khoảng cách ngắn nhất từ $O$ đến $AB$:\n$OM^2 = (1+t)^2 + (2+t)^2 + (6-t)^2 = 3t^2 - 6t + 41 = 3(t-1)^2 + 38 \\ge 38$.\nSuy ra $d(O, AB) = \\sqrt{38} \\approx 6.16\\text{ km} > 5\\text{ km}$.\n- **Đáp số:** Flycam luôn bay ngoài vùng phủ sóng."
                    }
                ]
            },
            mu_logarit: {
                title: "Mũ & Logarit: Công thức & Phương trình",
                summary: "Hàm số mũ $y = a^x$ và hàm số logarit $y = \\log_a x$ ($a > 0, a \\neq 1$).",
                formulas: [
                    "$$\\log_a (xy) = \\log_a x + \\log_a y \\quad (x, y > 0)$$",
                    "$$\\log_a (x^\\alpha) = \\alpha \\log_a x \\quad (x > 0)$$",
                    "$$a^{\\log_a b} = b, \\quad \\log_a b = \\frac{\\ln b}{\\ln a}$$",
                    "$$a^x = b \\iff x = \\log_a b \\quad (b > 0)$$"
                ],
                methods: "1. Đặt điều kiện có nghĩa: Biểu thức dưới dấu logarit $> 0$, cơ số $> 0, \\neq 1$.\n2. Phương pháp đưa về cùng cơ số hoặc đặt ẩn phụ $t = a^x$ ($t > 0$) / $t = \\log_a x$.\n3. Phương pháp logarit hóa hai vế hoặc dùng tính đơn điệu hàm số.",
                traps: "Quên đặt điều kiện xác định trước khi giải phương trình logarit, dẫn đến nhận nghiệm ngoại lai.",
                examples: [
                    {
                        typeName: "Dạng 1: Giải phương trình logarit cơ bản",
                        question: "Giải phương trình $\\log_2 (x - 1) + \\log_2 (x + 1) = 3$.",
                        analysis: "Đặt điều kiện $x > 1$, sau đó dùng công thức cộng logarit $\\log_2((x-1)(x+1)) = 3$.",
                        solution: "**Lời giải:**\n- Điều kiện: $\\begin{cases} x - 1 > 0 \\\\ x + 1 > 0 \\end{cases} \\iff x > 1$.\n- Phương trình $\\iff \\log_2(x^2 - 1) = 3 \\iff x^2 - 1 = 2^3 = 8 \\iff x^2 = 9 \\iff x = \\pm 3$.\n- Đối chiếu điều kiện $x > 1$, ta nhận nghiệm $x = 3$."
                    }
                ],
                applications: [
                    {
                        title: "Bài toán thực tế 1: Tăng trưởng tiền gửi lãi kép liên tục",
                        question: "Một người gửi 100 triệu đồng vào ngân hàng với lãi suất $7\\%/\\text{năm}$ theo hình thức lãi kép liên tục $A = P \\cdot e^{rt}$. Sau bao nhiêu năm số tiền tích lũy tăng gấp đôi?",
                        solution: "**Phương pháp giải & Lời giải:**\n1. Ta có $2P = P \\cdot e^{0.07t} \\iff e^{0.07t} = 2$.\n2. Lấy logarit tự nhiên 2 vế: $0.07t = \\ln 2 \\implies t = \\frac{\\ln 2}{0.07} \\approx 9.9\\text{ năm}$.\n- **Đáp số:** Sau khoảng 10 năm số tiền sẽ tăng gấp đôi."
                    }
                ]
            },
            nguyen_ham_tich_phan: {
                title: "Nguyên hàm, Tích phân & Ứng dụng",
                summary: "Nguyên hàm là phép toán ngược của đạo hàm. Tích phân Newton-Leibniz: $\\int_a^b f(x)dx = F(b) - F(a)$.",
                formulas: [
                    "$$\\int x^\\alpha dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C \\quad (\\alpha \\neq -1)$$",
                    "$$\\int \\frac{1}{x} dx = \\ln|x| + C, \\quad \\int e^{ax+b} dx = \\frac{1}{a} e^{ax+b} + C$$",
                    "$$\\int u dv = uv - \\int v du \\quad (\\text{Từng phần})$$",
                    "$$S = \\int_a^b |f(x) - g(x)| dx, \\quad V = \\pi \\int_a^b [f(x)]^2 dx$$"
                ],
                methods: "1. Đổi biến số dạng 1: Đặt $t = u(x) \\implies dt = u'(x)dx$.\n2. Từng phần: Thứ tự ưu tiên đặt $u$: 'Nhất log - Nhì đa - Tam lượng - Tứ mũ'.\n3. Ứng dụng diện tích/thể tích: Xác định hoành độ giao điểm rồi tích phân.",
                traps: "Quên đổi cận khi đổi biến số ở bài toán tích phân xác định.",
                examples: [
                    {
                        typeName: "Dạng 1: Tính diện tích hình phẳng giới hạn bởi 2 parabol",
                        question: "Tính diện tích hình phẳng giới hạn bởi đồ thị $y = x^2$ và $y = 2x - x^2$.",
                        analysis: "Tìm hoành độ giao điểm rồi áp dụng công thức $S = \\int_{x_1}^{x_2} |f(x) - g(x)|dx$.",
                        solution: "**Lời giải:**\n- Hoành độ giao điểm: $x^2 = 2x - x^2 \\iff 2x^2 - 2x = 0 \\iff x = 0$ hoặc $x = 1$.\n- Diện tích: $S = \\int_0^1 |(2x - x^2) - x^2| dx = \\int_0^1 (2x - 2x^2) dx = \\left[ x^2 - \\frac{2x^3}{3} \\right]_0^1 = 1 - \\frac{2}{3} = \\frac{1}{3}$ (đvdt)."
                    }
                ],
                applications: [
                    {
                        title: "Bài toán thực tế 1: Tính quãng đường di chuyển của ô tô",
                        question: "Một ô tô đang chạy với vận tốc $v_0 = 20\\text{ m/s}$ thì người lái đạp phanh. Từ thời điểm đó, ô tô chuyển động chậm dần đều với vận tốc $v(t) = -4t + 20$ (m/s). Tính quãng đường ô tô đi được từ lúc đạp phanh đến khi dừng hẳn.",
                        solution: "**Phương pháp giải & Lời giải:**\n1. Thời điểm xe dừng hẳn: $v(t) = 0 \\iff -4t + 20 = 0 \\iff t = 5\\text{ giây}$.\n2. Quãng đường đi được: $s = \\int_0^5 v(t)dt = \\int_0^5 (-4t + 20)dt = \\left[ -2t^2 + 20t \\right]_0^5 = -50 + 100 = 50\\text{ m}$.\n- **Đáp số:** Ô tô di chuyển thêm $50\\text{ m}$ trước khi dừng lại."
                    }
                ]
            },
            xac_suat_12: {
                title: "Xác suất có Điều kiện & Công thức Bayes (GDPT 2018)",
                summary: "Xác suất của biến cố $A$ khi biết biến cố $B$ đã xảy ra: $P(A|B) = \\frac{P(AB)}{P(B)}$.",
                formulas: [
                    "$$P(A|B) = \\frac{P(AB)}{P(B)} \\quad (P(B) > 0)$$",
                    "$$P(AB) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)$$",
                    "$$P(B) = P(A_1)P(B|A_1) + P(A_2)P(B|A_2) + \\dots + P(A_n)P(B|A_n) \\quad (\\text{Toàn phần})$$",
                    "$$P(A_i|B) = \\frac{P(A_i)P(B|A_i)}{P(B)} \\quad (\\text{Công thức Bayes})$$"
                ],
                methods: "1. Vẽ sơ đồ hình cây (Tree diagram) phân nhánh các trường hợp.\n2. Xác định biến cố điều kiện và tính xác suất từng nhánh.\n3. Áp dụng công thức nhân xác suất và công thức Bayes để suy ra xác suất hậu nghiệm.",
                traps: "Nhầm lẫn giữa biến cố giao $P(AB)$ và xác suất có điều kiện $P(A|B)$.",
                examples: [
                    {
                        typeName: "Dạng 1: Áp dụng trực tiếp công thức xác suất có điều kiện",
                        question: "Gieo 2 con xúc xắc cân đối. Tính xác suất để tổng số chấm bằng 8, biết rằng con xúc xắc thứ nhất xuất hiện mặt chẵn.",
                        analysis: "Gọi biến cố $A$: 'Tổng số chấm bằng 8', $B$: 'Con xúc xắc 1 ra mặt chẵn'. Áp dụng $P(A|B) = \\frac{n(AB)}{n(B)}$.",
                        solution: "**Lời giải:**\n- $B = \\{(2;y), (4;y), (6;y)\\} \\implies n(B) = 3 \\times 6 = 18$.\n- Các cặp thuộc $AB$ (tổng bằng 8 và xúc xắc 1 chẵn): $(2;6), (4;4), (6;2) \\implies n(AB) = 3$.\n- Xác suất: $P(A|B) = \\frac{3}{18} = \\frac{1}{6}$."
                    }
                ],
                applications: [
                    {
                        title: "Bài toán thực tế 1: Độ tin cậy của xét nghiệm y tế (Công thức Bayes)",
                        question: "Tỉ lệ mắc bệnh X trong cộng đồng là $1\\%$. Một bộ kit xét nghiệm có độ nhạy (xác suất dương tính khi có bệnh) là $95\\%$, và độ đặc hiệu (xác suất âm tính khi không bệnh) là $90\\%$. Một người xét nghiệm cho kết quả dương tính, tính xác suất thực sự người đó bị bệnh.",
                        solution: "**Phương pháp giải & Lời giải:**\n1. Gọi $B$: 'Người bị bệnh' $\\implies P(B) = 0.01, P(\\overline{B}) = 0.99$.\n2. Gọi $T$: 'Xét nghiệm Dương tính'.\n- $P(T|B) = 0.95$, $P(T|\\overline{B}) = 1 - 0.90 = 0.10$.\n3. Xác suất toàn phần: $P(T) = P(B)P(T|B) + P(\\overline{B})P(T|\\overline{B}) = 0.01 \\times 0.95 + 0.99 \\times 0.10 = 0.1085$.\n4. Công thức Bayes:\n$$P(B|T) = \\frac{P(B)P(T|B)}{P(T)} = \\frac{0.01 \\times 0.95}{0.1085} \\approx 0.0876 \\; (8.76\\%$$\n- **Ý nghĩa:** Dù test dương tính nhưng khả năng thực sự có bệnh chỉ khoảng $8.76\\%$ do căn bệnh này rất hiếm trong cộng đồng."
                    }
                ]
            }
        };

        function insertMathSymbol(targetId, before, after = '') {
            let el = document.getElementById(targetId);
            if (!el) return;
            el.focus();
            let start = el.selectionStart !== undefined ? el.selectionStart : el.value.length;
            let end = el.selectionEnd !== undefined ? el.selectionEnd : el.value.length;
            let val = el.value;
            let selectedText = val.substring(start, end);
            let insertText = before + selectedText + after;
            el.value = val.substring(0, start) + insertText + val.substring(end);
            el.selectionStart = start + before.length;
            el.selectionEnd = start + before.length + selectedText.length;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        function openTheoryGuideModal(section = 'all') {
            let guideContent = '';
            if (section === 'formulas') {
                guideContent = `
                    <div class="space-y-3">
                        <h4 class="font-black text-teal-900 text-sm uppercase">📐 Hướng Dẫn Soạn Bảng Công Thức Bỏ Túi (LaTeX)</h4>
                        <p class="text-xs text-slate-600 leading-relaxed">Mỗi ô công thức nên chứa 1 công thức cốt lõi bọc trong dấu <code>$$...$$</code> (dạng khối lớn) hoặc <code>$...$</code> (dạng nội dòng).</p>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-800">
                            <div>• Phân số: <code>$$\\frac{-b \\pm \\sqrt{\\Delta}}{2a}$$</code></div>
                            <div>• Tích phân: <code>$$\\int_{a}^{b} f(x)dx = F(b) - F(a)$$</code></div>
                            <div>• Véc-tơ Oxyz: <code>$$\\vec{u} = (x; y; z) \\implies |\\vec{u}| = \\sqrt{x^2+y^2+z^2}$$</code></div>
                            <div>• Hệ phương trình: <code>$$\\begin{cases} x+y=5 \\\\ 2x-y=1 \\end{cases}$$</code></div>
                        </div>
                    </div>`;
            } else if (section === 'methods') {
                guideContent = `
                    <div class="space-y-3">
                        <h4 class="font-black text-teal-900 text-sm uppercase">🛠️ Hướng Dẫn Soạn Phương Pháp Giải Theo Bước</h4>
                        <p class="text-xs text-slate-600 leading-relaxed">Nên viết theo cấu trúc thuật toán 3-4 bước rõ ràng. Hỗ trợ đầy đủ định dạng Markdown (in đậm <code>**...**</code>, highlight <code>==...==</code>, gạch đầu dòng <code>- </code> hoặc <code>1. </code>, <code>2. </code>).</p>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1 text-slate-800">
                            <div>**Bước 1:** Tìm tập xác định $D$ và tính đạo hàm $y'$.</div>
                            <div>**Bước 2:** Giải phương trình $y' = 0$ tìm các điểm dừng $x_1, x_2$.</div>
                            <div>**Bước 3:** Lập bảng biến thiên và kết luận cực trị.</div>
                        </div>
                    </div>`;
            } else if (section === 'traps') {
                guideContent = `
                    <div class="space-y-3">
                        <h4 class="font-black text-rose-900 text-sm uppercase">⚠️ Hướng Dẫn Soạn Bẫy & Lưu Ý Học Sinh</h4>
                        <p class="text-xs text-slate-600 leading-relaxed">Ghi rõ các sai lầm kinh điển học sinh hay mắc trong phòng thi để hệ thống tự động bôi đỏ cảnh báo.</p>
                        <div class="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                            <div>• Quên kiểm tra điều kiện xác định của mẫu số hoặc biểu thức dưới căn.</div>
                            <div>• Nhầm lẫn giữa dấu tương đương $\\Leftrightarrow$ và dấu suy ra $\\Rightarrow$.</div>
                            <div>• Quên đổi cận khi thực hiện phương pháp đổi biến số trong tích phân.</div>
                        </div>
                    </div>`;
            } else {
                guideContent = `
                    <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
                        <div class="p-3 bg-teal-50 rounded-xl border border-teal-200">
                            <span class="font-black text-teal-900 uppercase block mb-1">📖 1. Sổ Tay Lý Thuyết Trọng Tâm:</span>
                            Là bản tóm tắt nhanh được đính kèm vào đề thi để học sinh tra cứu khi luyện tập. Gồm 4 phần: Khái niệm định nghĩa, Bảng công thức LaTeX, Phương pháp giải thuật toán và Cảnh báo bẫy sai lầm.
                        </div>
                        <div class="p-3 bg-sky-50 rounded-xl border border-sky-200">
                            <span class="font-black text-sky-900 uppercase block mb-1">🎬 2. Slide Bài Giảng Tương Tác:</span>
                            Thiết kế theo phương pháp Micro-Learning (học vi mô). Mỗi slide truyền tải 1 nội dung và có thể phân giải các bước suy luận để bấm "Hiện Bước Kế Tiếp" cho học sinh tư duy từng bước.
                        </div>
                    </div>`;
            }

            let modalHtml = `
            <div id="theory-guide-modal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[10003] flex items-center justify-center p-4 animate-fade-in text-slate-800">
                <div class="bg-white p-6 rounded-3xl w-full max-w-xl relative shadow-2xl zoom-in border-4 border-teal-300">
                    <div class="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
                        <h3 class="text-base font-black text-teal-900 uppercase flex items-center gap-2"><i class="fa-solid fa-circle-question text-teal-600"></i> Hướng Dẫn Soạn Thảo Chi Tiết</h3>
                        <button onclick="document.getElementById('theory-guide-modal')?.remove()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500 text-sm transition"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div>${guideContent}</div>
                    <div class="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                        <button onclick="document.getElementById('theory-guide-modal')?.remove()" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition btn-3d">Đã Hiểu</button>
                    </div>
                </div>
            </div>`;
            document.getElementById('theory-guide-modal')?.remove();
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        // =========================================================================
        // LOGIC CHỦ ĐỀ & DANH MỤC TÙY CHỌN CHO STUDIO LÝ THUYẾT & BÀI GIẢNG (THEORY TAXONOMY)
        // =========================================================================
        window.selectedTheoryTopics = window.selectedTheoryTopics || [];

        function toggleTheoryTopicDropdown(forceState) {
            let menu = document.getElementById('theory-topic-dropdown-menu');
            let arrow = document.getElementById('theory-topic-arrow');
            if (!menu) return;
            let willShow = (forceState !== undefined) ? forceState : menu.classList.contains('hidden');
            menu.classList.toggle('hidden', !willShow);
            if (arrow) {
                arrow.style.transform = willShow ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            if (willShow) {
                let searchInput = document.getElementById('theory-topic-search-input');
                if (searchInput) setTimeout(() => searchInput.focus(), 100);
            }
        }

        function populateTheoryTopicOptions(grade) {
            let checklist = document.getElementById('theory-topic-checklist');
            grade = String(grade || document.getElementById('ai-theory-grade')?.value || (adminState?.meta?.grade || '12'));
            let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[grade]) || grade;

            if (!checklist) return;
            let html = '';

            // Section 1: Đề Mẫu & Khung Đề Định Kỳ
            html += `
                <div class="mb-3 bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                    <div class="text-[11px] font-black text-teal-900 uppercase mb-2 flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-solid fa-star text-amber-500"></i>
                            <span>Khung Đề Thi Mẫu & Trọng Tâm Lớp ${grade}</span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400 font-normal">
                            <button type="button" onclick="toggleAllTheoryTopicGroups(true)" class="hover:text-teal-700 underline font-semibold">Mở tất cả</button>
                            <span>•</span>
                            <button type="button" onclick="toggleAllTheoryTopicGroups(false)" class="hover:text-teal-700 underline font-semibold">Thu gọn</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        <label class="theory-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="theory-topic-chk rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 shrink-0" value="Toàn bộ chương trình môn Toán Lớp ${grade}" onchange="onTheoryTopicCheckboxChange(this)">
                            <span class="font-bold text-[11px] text-slate-800 leading-snug">[TỔNG HỢP] Toàn bộ Toán ${grade}</span>
                        </label>
                        <label class="theory-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="theory-topic-chk rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 shrink-0" value="Kiến thức trọng tâm Học kỳ 1 môn Toán Lớp ${grade}" onchange="onTheoryTopicCheckboxChange(this)">
                            <span class="font-semibold text-[11px] text-slate-700 leading-snug">Trọng tâm Học kỳ 1 (Lớp ${grade})</span>
                        </label>
                        <label class="theory-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="theory-topic-chk rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 shrink-0" value="Kiến thức trọng tâm Học kỳ 2 môn Toán Lớp ${grade}" onchange="onTheoryTopicCheckboxChange(this)">
                            <span class="font-semibold text-[11px] text-slate-700 leading-snug">Trọng tâm Học kỳ 2 (Lớp ${grade})</span>
                        </label>
                        ${grade === '12' ? `
                        <label class="theory-topic-item flex items-center gap-2 p-2 rounded-lg bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200 cursor-pointer transition select-none text-purple-900 md:col-span-2">
                            <input type="checkbox" class="theory-topic-chk rounded border-purple-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 shrink-0" value="Chuyên đề Tổng ôn Tốt nghiệp THPT Môn Toán (Cấu trúc BGD 2025)" onchange="onTheoryTopicCheckboxChange(this)">
                            <span class="font-bold text-[11px] leading-snug">🎓 [TỐT NGHIỆP THPT] Tổng ôn Lý thuyết & Công thức Toán 12 (Chuẩn BGD 2025)</span>
                        </label>
                        ` : ''}
                        ${grade === '9' ? `
                        <label class="theory-topic-item flex items-center gap-2 p-2 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 cursor-pointer transition select-none text-indigo-900 md:col-span-2">
                            <input type="checkbox" class="theory-topic-chk rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 shrink-0" value="Chuyên đề Ôn thi Tuyển sinh vào Lớp 10 Môn Toán" onchange="onTheoryTopicCheckboxChange(this)">
                            <span class="font-bold text-[11px] leading-snug">🎯 [TUYỂN SINH 10] Bí kíp Công thức & Phương pháp giải Toán 9 vào 10</span>
                        </label>
                        ` : ''}
                    </div>
                </div>
            `;

            // Section 2: Danh sách Chương, Bài học & Dạng bài chi tiết theo Math ID Taxonomy
            if (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) {
                let gTax = window.MATH_ID_TAXONOMY[gCode];
                Object.keys(gTax.branches).forEach(bKey => {
                    let bData = gTax.branches[bKey];
                    let branchIcon = bKey === 'D' ? 'fa-calculator text-teal-600' : 'fa-shapes text-emerald-600';
                    html += `
                        <div class="mb-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <div class="text-[11px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5 pb-1.5 border-b border-slate-100">
                                <i class="fa-solid ${branchIcon}"></i>
                                <span>Phần: ${bData.name}</span>
                            </div>
                    `;
                    Object.keys(bData.chapters).forEach(cKey => {
                        let cData = bData.chapters[cKey];
                        let chPrefix = `[${gCode}${bKey}${cKey}]`;
                        let chVal = `${chPrefix} ${cData.name}`;
                        let chId = `theory_ch_${gCode}_${bKey}_${cKey}`;
                        let lessonKeys = Object.keys(cData.lessons || {});
                        
                        html += `
                            <div class="theory-topic-group mb-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/90" id="box_${chId}">
                                <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
                                    <label class="theory-topic-item flex items-center gap-2 flex-grow cursor-pointer select-none">
                                        <input type="checkbox" class="theory-topic-chk theory-chapter-chk rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 shrink-0" data-chapter="${chId}" value="${chVal}" onchange="onTheoryChapterCheckboxChange('${chId}', this)">
                                        <span class="font-black text-[11px] text-teal-950">${chPrefix} Chương ${cKey}: ${cData.name}</span>
                                    </label>
                                    <button type="button" onclick="toggleTheoryChapterExpand('${chId}')" class="text-slate-400 hover:text-teal-700 px-1 py-0.5 rounded text-[11px] transition" title="Mở rộng/Thu gọn">
                                        <i class="fa-solid fa-chevron-down transition-transform" id="arrow_${chId}"></i>
                                    </button>
                                </div>
                                <div class="mt-1 space-y-2" id="group_${chId}">
                        `;

                        lessonKeys.forEach(lKey => {
                            let lData = cData.lessons[lKey];
                            let lsPrefix = `[${gCode}${bKey}${cKey}?${lKey}]`;
                            let lsVal = `${lsPrefix} ${lData.name}`;
                            let lsId = `theory_ls_${gCode}_${bKey}_${cKey}_${lKey}`;
                            let typeKeys = Object.keys(lData.types || {});

                            html += `
                                <div class="bg-white rounded-lg p-2 border border-slate-200/70 shadow-2xs" id="box_${lsId}">
                                    <div class="flex items-center justify-between">
                                        <label class="theory-topic-item flex items-center gap-2 flex-grow cursor-pointer select-none text-slate-800">
                                            <input type="checkbox" class="theory-topic-chk theory-lesson-chk rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 shrink-0" data-parent-chapter="${chId}" data-lesson="${lsId}" value="${lsVal}" onchange="onTheoryLessonCheckboxChange('${chId}', '${lsId}', this)">
                                            <span class="text-[11px] font-bold text-slate-800 leading-snug">Bài ${lKey}: ${lData.name}</span>
                                        </label>
                                        ${typeKeys.length > 0 ? `
                                        <button type="button" onclick="toggleTheoryLessonExpand('${lsId}')" class="text-[10px] text-slate-500 hover:text-teal-700 px-1.5 py-0.5 rounded bg-slate-50 hover:bg-teal-50 border border-slate-200/60 flex items-center gap-1 transition shrink-0 ml-1">
                                            <span>${typeKeys.length} dạng</span>
                                            <i class="fa-solid fa-chevron-down text-[9px] transition-transform" id="arrow_${lsId}"></i>
                                        </button>
                                        ` : ''}
                                    </div>
                                    ${typeKeys.length > 0 ? `
                                    <div class="mt-1.5 pt-1.5 border-t border-dashed border-slate-100 pl-4 space-y-1" id="group_${lsId}">
                                    ` : ''}
                            `;

                            typeKeys.forEach(tKey => {
                                let tName = lData.types[tKey];
                                let tpCode = `[${gCode}${bKey}${cKey}?${lKey}-${tKey}]`;
                                let tpVal = `${tpCode} ${tName}`;
                                html += `
                                    <label class="theory-topic-item flex items-center gap-2 py-0.5 px-1 rounded hover:bg-teal-50/80 cursor-pointer select-none text-slate-600 transition">
                                        <input type="checkbox" class="theory-topic-chk theory-type-chk rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3 h-3 shrink-0" data-parent-chapter="${chId}" data-parent-lesson="${lsId}" value="${tpVal}" onchange="onTheoryTypeCheckboxChange('${chId}', '${lsId}', this)">
                                        <span class="font-mono text-[9.5px] px-1 py-0.2 bg-teal-50 text-teal-800 rounded border border-teal-200/80 font-bold shrink-0">${tpCode}</span>
                                        <span class="text-[10.5px] font-medium leading-snug">${tName}</span>
                                    </label>
                                `;
                            });

                            if (typeKeys.length > 0) {
                                html += `</div>`;
                            }
                            html += `</div>`;
                        });

                        html += `
                                </div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                });
            }

            checklist.innerHTML = html;
            updateTheoryTopicSummaryUI();
        }

        function toggleTheoryChapterExpand(chId) {
            let grp = document.getElementById(`group_${chId}`);
            let arrow = document.getElementById(`arrow_${chId}`);
            if (grp) grp.classList.toggle('hidden');
            if (arrow) arrow.style.transform = (grp && grp.classList.contains('hidden')) ? 'rotate(-90deg)' : 'rotate(0deg)';
        }

        function toggleTheoryLessonExpand(lsId) {
            let grp = document.getElementById(`group_${lsId}`);
            let arrow = document.getElementById(`arrow_${lsId}`);
            if (grp) grp.classList.toggle('hidden');
            if (arrow) arrow.style.transform = (grp && grp.classList.contains('hidden')) ? 'rotate(-90deg)' : 'rotate(0deg)';
        }

        function toggleAllTheoryTopicGroups(expand) {
            document.querySelectorAll('[id^="group_theory_ch_"], [id^="group_theory_ls_"]').forEach(el => {
                el.classList.toggle('hidden', !expand);
            });
            document.querySelectorAll('[id^="arrow_theory_ch_"], [id^="arrow_theory_ls_"]').forEach(el => {
                el.style.transform = expand ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
        }

        function onTheoryGradeChange(grade) {
            window.selectedTheoryTopics = [];
            populateTheoryTopicOptions(grade);
            let topicInput = document.getElementById('ai-theory-topic');
            if (topicInput) topicInput.value = '';
            let targetFolder = getMathFolderFromGrade(grade);
            let folderInput = document.getElementById('ai-theory-folder');
            if (folderInput) folderInput.value = targetFolder;
            let badge = document.getElementById('theory-folder-badge');
            if (badge) badge.innerText = targetFolder;
            generateTheoryAiPromptText();
        }

        function onTheoryTopicCheckboxChange(chk) {
            if (!chk) return;
            let val = chk.value;
            if (chk.checked) {
                if (!window.selectedTheoryTopics.includes(val)) window.selectedTheoryTopics.push(val);
            } else {
                window.selectedTheoryTopics = window.selectedTheoryTopics.filter(v => v !== val);
            }
            syncTheoryTopicToInputs();
        }

        function onTheoryChapterCheckboxChange(chId, chk) {
            if (!chk) return;
            let isChecked = chk.checked;
            let val = chk.value;
            if (isChecked) {
                if (!window.selectedTheoryTopics.includes(val)) window.selectedTheoryTopics.push(val);
            } else {
                window.selectedTheoryTopics = window.selectedTheoryTopics.filter(v => v !== val);
            }
            let childChks = document.querySelectorAll(`input[data-parent-chapter="${chId}"]`);
            childChks.forEach(c => {
                c.checked = isChecked;
                let cVal = c.value;
                if (isChecked) {
                    if (!window.selectedTheoryTopics.includes(cVal)) window.selectedTheoryTopics.push(cVal);
                } else {
                    window.selectedTheoryTopics = window.selectedTheoryTopics.filter(v => v !== cVal);
                }
            });
            syncTheoryTopicToInputs();
        }

        function onTheoryLessonCheckboxChange(chId, lsId, chk) {
            if (!chk) return;
            let isChecked = chk.checked;
            let val = chk.value;
            if (isChecked) {
                if (!window.selectedTheoryTopics.includes(val)) window.selectedTheoryTopics.push(val);
            } else {
                window.selectedTheoryTopics = window.selectedTheoryTopics.filter(v => v !== val);
            }
            let typeChks = document.querySelectorAll(`input[data-parent-lesson="${lsId}"]`);
            typeChks.forEach(c => {
                c.checked = isChecked;
                let cVal = c.value;
                if (isChecked) {
                    if (!window.selectedTheoryTopics.includes(cVal)) window.selectedTheoryTopics.push(cVal);
                } else {
                    window.selectedTheoryTopics = window.selectedTheoryTopics.filter(v => v !== cVal);
                }
            });
            syncTheoryTopicToInputs();
        }

        function onTheoryTypeCheckboxChange(chId, lsId, chk) {
            if (!chk) return;
            let val = chk.value;
            if (chk.checked) {
                if (!window.selectedTheoryTopics.includes(val)) window.selectedTheoryTopics.push(val);
            } else {
                window.selectedTheoryTopics = window.selectedTheoryTopics.filter(v => v !== val);
            }
            syncTheoryTopicToInputs();
        }

        function syncTheoryTopicToInputs() {
            let topicInput = document.getElementById('ai-theory-topic');
            if (topicInput) {
                if (window.selectedTheoryTopics.length > 0) {
                    topicInput.value = window.selectedTheoryTopics.join('; ');
                }
            }
            updateTheoryTopicSummaryUI();
            generateTheoryAiPromptText();
        }

        function updateTheoryTopicSummaryUI() {
            let badge = document.getElementById('theory-topic-selected-badge');
            let summaryText = document.getElementById('theory-topic-summary-text');
            let count = window.selectedTheoryTopics ? window.selectedTheoryTopics.length : 0;
            if (badge) {
                badge.innerText = `${count} đã chọn`;
                badge.classList.toggle('hidden', count === 0);
            }
            if (summaryText) {
                if (count === 0) {
                    summaryText.innerText = "Chọn từ cây chương trình & dạng bài chuẩn...";
                    summaryText.className = "text-slate-400 font-medium truncate";
                } else {
                    summaryText.innerText = window.selectedTheoryTopics.slice(0, 2).join(', ') + (count > 2 ? ` (+${count - 2} mục khác)` : '');
                    summaryText.className = "text-teal-900 font-bold truncate";
                }
            }
        }

        function filterTheoryTopicChecklist(keyword) {
            let kw = (keyword || '').trim().toLowerCase();
            let items = document.querySelectorAll('.theory-topic-item');
            items.forEach(it => {
                let text = it.innerText.toLowerCase();
                let isMatch = !kw || text.includes(kw);
                it.style.display = isMatch ? '' : 'none';
            });
            if (kw) {
                toggleAllTheoryTopicGroups(true);
            }
        }

        function clearTheoryTopicSelections() {
            window.selectedTheoryTopics = [];
            document.querySelectorAll('.theory-topic-chk').forEach(c => c.checked = false);
            syncTheoryTopicToInputs();
            showToast("Đã xóa các lựa chọn chủ đề.");
        }

        function renderTheoryStudio(container) {
            if (!adminState.data) adminState.data = JSON.parse(JSON.stringify(GAME_DATA));
            if (!adminState.data.theory) adminState.data.theory = JSON.parse(JSON.stringify(DEFAULT_GAME_DATA.theory || {}));
            if (!adminState.data.lectures) adminState.data.lectures = JSON.parse(JSON.stringify(DEFAULT_GAME_DATA.lectures || []));
            if (!adminState.data.theory.style) adminState.data.theory.style = { align: 'left', fontSize: 'base', theme: 'teal', cardStyle: 'modern' };
            if (!adminState.data.lecturesStyle) adminState.data.lecturesStyle = { align: 'left', fontSize: 'xl', theme: 'teal', cardStyle: 'modern', animation: 'fade' };

            let theory = adminState.data.theory;
            let lectures = adminState.data.lectures;
            let tStyle = theory.style || {};
            let lStyle = adminState.data.lecturesStyle || {};

            let subTabs = [
                { id: 'theory', name: 'Sổ Tay Lý Thuyết Trọng Tâm', icon: 'fa-book' },
                { id: 'lectures', name: `Slide Bài Giảng (${lectures.length})`, icon: 'fa-chalkboard-user' },
                { id: 'drive', name: 'Kho Cloud Supabase & Drive', icon: 'fa-cloud' },
                { id: 'ai', name: 'Trợ Lý AI Sinh Tự Động (Chuẩn 3 Phần)', icon: 'fa-robot' },
                { id: 'samples', name: 'Kho Mẫu GDPT 2018', icon: 'fa-layer-group' },
                { id: 'style', name: 'Quản Trị Cân Chỉnh & Màu Sắc', icon: 'fa-palette' },
                { id: 'guide', name: 'Hướng Dẫn Soạn Thảo', icon: 'fa-circle-question' }
            ];

            let navHtml = subTabs.map(t => {
                let isAct = (activeTheorySubTab === t.id);
                let cls = isAct 
                    ? 'theory-tab-btn active bg-teal-700 text-white shadow-md border-2 border-teal-800 scale-105' 
                    : 'theory-tab-btn bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-800 border-2 border-slate-200';
                return `<button onclick="activeTheorySubTab='${t.id}'; renderTheoryStudio(document.getElementById('admin-content-area'));" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 btn-3d ${cls}">
                    <i class="fa-solid ${t.icon}"></i> <span>${t.name}</span>
                </button>`;
            }).join('');

            let bodyContent = '';

            if (activeTheorySubTab === 'theory') {
                let sectionsList = (theory.sections || []).map((sec, idx) => `
                    <div class="p-4 bg-slate-50 rounded-2xl border border-teal-200 space-y-2.5 relative group">
                        <div class="flex justify-between items-center">
                            <span class="font-black text-xs text-teal-900 uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-bookmark text-teal-600"></i> Mục ${idx + 1}:
                            </span>
                            <button onclick="removeTheorySection(${idx})" class="text-rose-500 hover:text-rose-700 text-xs font-bold" title="Xóa mục này"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                        </div>
                        <input type="text" id="theory-sec-title-${idx}" value="${String(sec.title||'').replace(/"/g, '&quot;')}" oninput="saveTheoryInputsLive()" placeholder="Tiêu đề mục (Ví dụ: 1.1 Khái niệm & Định lý)" class="w-full p-2 text-xs font-bold border border-slate-300 rounded-lg bg-white">
                        <textarea id="theory-sec-content-${idx}" oninput="saveTheoryInputsLive()" rows="3" placeholder="Nội dung lý thuyết trọng tâm, định lý, công thức $...$" class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white leading-relaxed">${sec.content||''}</textarea>
                        
                        <div class="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2">
                            <div class="text-[11px] font-black text-indigo-900 flex items-center gap-1">
                                <i class="fa-solid fa-lightbulb text-amber-500"></i> Ví dụ minh họa áp dụng ngay cho mục ${idx + 1}:
                            </div>
                            <textarea id="theory-sec-ex-q-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Đề bài ví dụ áp dụng trực tiếp..." class="w-full p-2 text-xs border border-indigo-200 rounded-lg bg-white">${(sec.example && sec.example.question) || ''}</textarea>
                            <textarea id="theory-sec-ex-sol-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Lời giải chi tiết từng bước..." class="w-full p-2 text-xs border border-indigo-200 rounded-lg bg-white">${(sec.example && sec.example.solution) || ''}</textarea>
                        </div>
                    </div>
                `).join('');

                let formulasList = (theory.formulas || []).map((f, idx) => `
                    <div class="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center font-black text-xs shrink-0 border border-teal-200">${idx + 1}</span>
                        <input type="text" id="theory-formula-${idx}" value="${String(f).replace(/"/g, '&quot;')}" oninput="saveTheoryInputsLive()" placeholder="Ví dụ: $$\\frac{-b \\pm \\sqrt{\\Delta}}{2a}$$" class="flex-grow p-2 text-xs font-mono font-bold bg-white text-slate-800 border border-slate-300 rounded-lg outline-none focus:border-teal-500 shadow-inner">
                        <button onclick="openMathModal('theory-formula-${idx}')" class="px-2.5 py-1.5 bg-teal-50 border border-teal-200 hover:bg-teal-600 hover:text-white text-teal-700 text-xs font-bold rounded-lg transition shadow-xs" title="Gõ phím toán"><i class="fa-solid fa-calculator"></i></button>
                        <button onclick="removeTheoryFormula(${idx})" class="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-600 flex items-center justify-center text-xs transition shadow-xs" title="Xóa công thức"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `).join('');

                let examplesList = (theory.examples || []).map((ex, idx) => `
                    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative group">
                        <div class="flex justify-between items-center">
                            <span class="font-black text-xs text-teal-900 uppercase">Ví dụ phân dạng ${idx + 1}:</span>
                            <button onclick="removeTheoryExample(${idx})" class="text-rose-500 hover:text-rose-700 text-xs font-bold" title="Xóa ví dụ này"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                        </div>
                        <input type="text" id="theory-example-type-${idx}" value="${String(ex.typeName||'').replace(/"/g, '&quot;')}" oninput="saveTheoryInputsLive()" placeholder="Tên dạng bài (Ví dụ: Dạng 1 - Tìm điểm cực trị)" class="w-full p-2 text-xs font-bold border border-slate-300 rounded-lg bg-white">
                        <textarea id="theory-example-q-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Đề bài ví dụ..." class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white">${ex.question||''}</textarea>
                        <textarea id="theory-example-sol-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Lời giải chi tiết từng bước..." class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white">${ex.solution||''}</textarea>
                    </div>
                `).join('');

                let applicationsList = (theory.applications || []).map((app, idx) => `
                    <div class="p-3.5 bg-slate-50 rounded-2xl border border-emerald-200 space-y-2 relative group">
                        <div class="flex justify-between items-center">
                            <span class="font-black text-xs text-emerald-900 uppercase">Bài toán thực tế ${idx + 1}:</span>
                            <button onclick="removeTheoryApplication(${idx})" class="text-rose-500 hover:text-rose-700 text-xs font-bold" title="Xóa bài này"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                        </div>
                        <input type="text" id="theory-app-title-${idx}" value="${String(app.title||'').replace(/"/g, '&quot;')}" oninput="saveTheoryInputsLive()" placeholder="Tiêu đề tình huống thực tế..." class="w-full p-2 text-xs font-bold border border-slate-300 rounded-lg bg-white">
                        <textarea id="theory-app-q-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Đề bài thực tế..." class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white">${app.question||''}</textarea>
                        <textarea id="theory-app-sol-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Bài giải (được ẩn/hiện tùy chọn khi học sinh học)..." class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white">${app.solution||''}</textarea>
                    </div>
                `).join('');

                let practiceList = (theory.practiceExercises || []).map((pr, idx) => `
                    <div class="p-4 bg-slate-50 rounded-2xl border border-amber-200 space-y-2.5 relative group">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="font-black text-xs text-amber-900 uppercase flex items-center gap-1.5">
                                    <i class="fa-solid fa-pen-to-square text-amber-600"></i> Bài tự luyện ${idx + 1}:
                                </span>
                                <select id="theory-practice-lvl-${idx}" onchange="saveTheoryInputsLive()" class="text-[11px] font-bold p-1 bg-white border border-slate-300 rounded-lg text-slate-700">
                                    <option value="Nhận biết" ${pr.level === 'Nhận biết' ? 'selected' : ''}>Nhận biết</option>
                                    <option value="Thông hiểu" ${pr.level === 'Thông hiểu' ? 'selected' : ''}>Thông hiểu</option>
                                    <option value="Vận dụng" ${pr.level === 'Vận dụng' ? 'selected' : ''}>Vận dụng</option>
                                    <option value="Vận dụng cao" ${pr.level === 'Vận dụng cao' ? 'selected' : ''}>Vận dụng cao</option>
                                </select>
                            </div>
                            <button onclick="removeTheoryPracticeExercise(${idx})" class="text-rose-500 hover:text-rose-700 text-xs font-bold" title="Xóa bài này"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                        </div>
                        <textarea id="theory-practice-q-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Đề bài câu hỏi tự luyện..." class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white leading-relaxed">${pr.question||''}</textarea>
                        <input type="text" id="theory-practice-ans-${idx}" value="${String(pr.shortAnswer||'').replace(/"/g, '&quot;')}" oninput="saveTheoryInputsLive()" placeholder="Đáp số ngắn gọn (Ví dụ: $x = 2$ hoặc $m \\in (1; 3)$)" class="w-full p-2 text-xs font-bold border border-slate-300 rounded-lg bg-white">
                        <textarea id="theory-practice-hint-${idx}" oninput="saveTheoryInputsLive()" rows="2" placeholder="Hướng dẫn giải / Gợi ý phương pháp chi tiết..." class="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white leading-relaxed">${pr.hint||''}</textarea>
                    </div>
                `).join('');

                bodyContent = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-6 overflow-y-auto admin-scroll">
                    <!-- Left Column: Form Editor -->
                    <div class="space-y-5">
                        
                        <!-- Section 1: Title & Lesson Selector -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-heading text-teal-600"></i> Tiêu đề Sổ tay / Chuyên đề:
                                </label>
                                <div class="flex items-center gap-1.5">
                                    <button onclick="openTheoryLessonSelectModal()" class="text-[11px] bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 font-bold px-2.5 py-1 rounded-lg border border-teal-300 transition flex items-center gap-1 shadow-2xs">
                                        <i class="fa-solid fa-list-check text-teal-600"></i> Chọn Bài Từ Danh Mục
                                    </button>
                                    <button onclick="openMathModal('edit-theory-title')" class="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-300 transition"><i class="fa-solid fa-calculator mr-1"></i> Phím Toán</button>
                                </div>
                            </div>
                            <input type="text" id="edit-theory-title" value="${String(theory.title||'').replace(/"/g, '&quot;')}" oninput="saveTheoryInputsLive()" placeholder="Ví dụ: Cực trị của hàm số & Bài toán tối ưu thực tế" class="w-full p-3 border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner">
                        </div>

                        <!-- Section 2: Summary -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2.5">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-align-left text-teal-600"></i> 1. Tóm tắt Khái niệm & Bức tranh tổng quan:
                                </label>
                                <div class="flex items-center gap-1 flex-wrap">
                                    <button onclick="insertMathSymbol('edit-theory-summary', '**', '**')" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200">**B**</button>
                                    <button onclick="insertMathSymbol('edit-theory-summary', '==', '==')" class="px-2 py-0.5 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200">==M==</button>
                                    <button onclick="insertMathSymbol('edit-theory-summary', '$', '$')" class="px-2 py-0.5 text-[10px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded border border-teal-200">$x$</button>
                                    <button onclick="openMathModal('edit-theory-summary')" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200"><i class="fa-solid fa-calculator"></i></button>
                                </div>
                            </div>
                            <textarea id="edit-theory-summary" oninput="saveTheoryInputsLive()" rows="3" placeholder="Định nghĩa cốt lõi, điều kiện tồn tại, tính chất then chốt..." class="w-full p-3.5 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner leading-relaxed">${theory.summary||''}</textarea>
                        </div>

                        <!-- Section 3: Detailed Theory Sections with Example for each -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-teal-200 shadow-sm space-y-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-book-bookmark text-teal-600"></i> 2. Các Mục Lý Thuyết Kèm Ví Dụ Từng Phần (${(theory.sections||[]).length}):
                                </label>
                                <button onclick="addTheorySection()" class="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-lg transition btn-3d shadow-xs"><i class="fa-solid fa-plus mr-1"></i> Thêm Mục Lý Thuyết & Ví Dụ</button>
                            </div>
                            <div class="space-y-3 max-h-[360px] overflow-y-auto admin-scroll pr-1">
                                ${sectionsList || '<div class="text-xs text-slate-400 italic py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Chưa có mục lý thuyết chuyên sâu nào. Nhấn "+ Thêm Mục Lý Thuyết & Ví Dụ" để soạn.</div>'}
                            </div>
                        </div>

                        <!-- Section 4: Formulas -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-square-root-variable text-teal-600"></i> 3. Bảng Công Thức Bỏ Túi (LaTeX):
                                </label>
                                <button onclick="addTheoryFormula()" class="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-lg transition btn-3d shadow-xs"><i class="fa-solid fa-plus mr-1"></i> Thêm Công Thức</button>
                            </div>
                            <div class="space-y-2 max-h-[180px] overflow-y-auto admin-scroll pr-1">
                                ${formulasList || '<div class="text-xs text-slate-400 italic py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Chưa có công thức nào.</div>'}
                            </div>
                        </div>

                        <!-- Section 5: Methods -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2.5">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-list-ol text-teal-600"></i> 4. Phương Pháp Giải Toán Theo Bước (Thuật toán):
                                </label>
                                <div class="flex items-center gap-1">
                                    <button onclick="insertMathSymbol('edit-theory-methods', '**Bước 1:** ')" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200">+ B1</button>
                                    <button onclick="insertMathSymbol('edit-theory-methods', '**Bước 2:** ')" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200">+ B2</button>
                                </div>
                            </div>
                            <textarea id="edit-theory-methods" oninput="saveTheoryInputsLive()" rows="3" placeholder="**Bước 1:** Xác định dạng toán...&#10;**Bước 2:** Biến đổi phương trình..." class="w-full p-3.5 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner leading-relaxed">${theory.methods||''}</textarea>
                        </div>

                        <!-- Section 6: Traps & Cautions -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-rose-200 shadow-sm space-y-2.5 bg-rose-50/20">
                            <label class="font-black text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> 5. Bẫy Sai Lầm & Lưu Ý Phòng Thi:
                            </label>
                            <textarea id="edit-theory-traps" oninput="saveTheoryInputsLive()" rows="2" placeholder="Chú ý điều kiện xác định, dấu bằng xảy ra..." class="w-full p-3.5 border-2 border-rose-200 rounded-xl text-xs font-medium text-rose-950 outline-none focus:border-rose-400 shadow-inner bg-white leading-relaxed">${theory.traps||''}</textarea>
                        </div>

                        <!-- Section 7: Examples by Type (if any) -->
                        ${(theory.examples && theory.examples.length > 0) ? `
                        <div class="bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-lightbulb text-indigo-600"></i> Ví Dụ Phân Dạng Bổ Sung (${(theory.examples||[]).length}):
                                </label>
                                <button onclick="addTheoryExample()" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg transition btn-3d shadow-xs"><i class="fa-solid fa-plus mr-1"></i> Thêm Ví Dụ</button>
                            </div>
                            <div class="space-y-3 max-h-[260px] overflow-y-auto admin-scroll pr-1">
                                ${examplesList}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Section 8: Real-world Applications (with toggle solution) -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-earth-americas text-emerald-600"></i> 6. Áp Dụng Thực Tế & Mô Hình Hóa (${(theory.applications||[]).length}):
                                </label>
                                <button onclick="addTheoryApplication()" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition btn-3d shadow-xs"><i class="fa-solid fa-plus mr-1"></i> Thêm Bài Thực Tế</button>
                            </div>
                            <div class="space-y-3 max-h-[260px] overflow-y-auto admin-scroll pr-1">
                                ${applicationsList || '<div class="text-xs text-slate-400 italic py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Chưa có bài toán áp dụng thực tế nào.</div>'}
                            </div>
                        </div>

                        <!-- Section 9: Part 4 Practice Exercises -->
                        <div class="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3 bg-amber-50/10">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <label class="font-black text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-graduation-cap text-amber-600"></i> 7. Phần 4: Hệ Thống Bài Tập Tự Luyện (${(theory.practiceExercises||[]).length}):
                                </label>
                                <button onclick="addTheoryPracticeExercise()" class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-lg transition btn-3d shadow-xs"><i class="fa-solid fa-plus mr-1"></i> Thêm Bài Tự Luyện</button>
                            </div>
                            <div class="space-y-3 max-h-[320px] overflow-y-auto admin-scroll pr-1">
                                ${practiceList || '<div class="text-xs text-slate-400 italic py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Chưa có bài tập tự luyện nào. Nhấn "+ Thêm Bài Tự Luyện" để bổ sung.</div>'}
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Live Rendered Preview -->
                    <div class="bg-white p-6 rounded-3xl border-2 border-teal-300 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between border-b pb-3 mb-4">
                                <span class="font-black text-xs uppercase tracking-wider text-teal-900 flex items-center gap-2">
                                    <i class="fa-solid fa-eye text-teal-600"></i> Xem Trước Sổ Tay Thời Gian Thực (Giao diện Học sinh)
                                </span>
                                <span class="text-[10px] bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-black">Live LaTeX MathJax</span>
                            </div>
                            <div id="theory-live-preview" class="space-y-4 max-h-[60vh] overflow-y-auto admin-scroll pr-2">
                                <!-- Rendered dynamically -->
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t flex flex-wrap gap-3">
                            <button onclick="saveTheoryToExamData()" class="flex-1 min-w-[200px] py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition btn-3d uppercase tracking-wider flex items-center justify-center gap-2">
                                <i class="fa-solid fa-floppy-disk"></i> Lưu Sổ Tay Lý Thuyết Vào Đề
                            </button>
                            <button onclick="saveTheoryToGoogleDrive(false)" class="py-3 px-5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md transition btn-3d uppercase tracking-wider flex items-center justify-center gap-2">
                                <i class="fa-brands fa-google-drive text-amber-300"></i> Lưu Google Drive
                            </button>
                        </div>
                    </div>
                </div>`;
            } else if (activeTheorySubTab === 'lectures') {
                let slidesList = lectures.map((l, i) => `
                    <div class="p-4 bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-500 shadow-sm transition flex flex-col justify-between gap-3 group">
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <span class="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-xs shadow-2xs">${i + 1}</span>
                                <div class="flex items-center gap-1.5">
                                    <button onclick="startLecturePresentation(${i})" class="px-2.5 py-1 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 border border-teal-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs" title="Chiếu slide này"><i class="fa-solid fa-play text-[10px]"></i> Chiếu</button>
                                    <button onclick="deleteLectureSlide(${i})" class="w-7 h-7 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center justify-center shadow-xs" title="Xóa slide"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
                                </div>
                            </div>
                            <h4 class="font-black text-slate-800 text-sm mb-1">${l.title}</h4>
                            <p class="text-xs text-slate-600 truncate leading-relaxed font-medium">${(l.content||'').replace(/[#*`$]/g, '')}</p>
                        </div>
                        <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-teal-800 font-bold">
                            <span class="bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-lg border border-teal-100">${(l.steps||[]).length} bước phân giải</span>
                            <button onclick="editLectureSlideModal(${i})" class="text-teal-700 hover:text-teal-900 hover:underline font-black flex items-center gap-1">Biên tập chi tiết <i class="fa-solid fa-arrow-right text-[10px]"></i></button>
                        </div>
                    </div>
                `).join('');

                bodyContent = `
                <div class="p-6 h-full flex flex-col justify-between overflow-y-auto admin-scroll">
                    <div>
                        <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
                            <div>
                                <h3 class="text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                    <i class="fa-solid fa-chalkboard-user text-teal-600"></i> Danh Sách Slide Bài Giảng Tương Tác
                                </h3>
                                <p class="text-xs text-slate-500 font-medium">Mỗi slide tương ứng với một đơn vị kiến thức nhỏ (Micro-Learning), hỗ trợ hiện từng bước suy luận khi bấm chiếu.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="addNewLectureSlide()" class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow-md transition btn-3d uppercase flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Thêm Slide Mới</button>
                                <button onclick="startLecturePresentation(0)" class="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-black rounded-xl shadow-md transition btn-3d uppercase flex items-center gap-1.5"><i class="fa-solid fa-play"></i> Trình Chiếu Toàn Bộ</button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${slidesList || '<div class="col-span-3 text-center py-12 text-slate-400 text-xs font-bold bg-white rounded-2xl border-2 border-dashed border-slate-200">Chưa có slide bài giảng nào. Hãy nhấn "Thêm Slide Mới" hoặc dùng AI sinh tự động.</div>'}
                        </div>
                    </div>
                </div>`;
            } else if (activeTheorySubTab === 'ai') {
                let curGrade = String(adminState?.meta?.grade || '12');
                let curFolder = normalizeMathFolder((theory && theory.folder) || (adminState?.data?.theory && adminState.data.theory.folder) || getMathFolderFromGrade(curGrade));
                bodyContent = `
                <div class="p-6 h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto admin-scroll">
                    <!-- Column 1: Config & Standardized Topic Selector -->
                    <div class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                        <div class="space-y-3.5">
                            <div class="flex items-center gap-2 text-teal-800 font-black text-sm uppercase">
                                <i class="fa-solid fa-wand-magic-sparkles text-amber-500 text-base"></i> Bước 1: Chọn Chủ Đề Chuẩn (Math ID / CV 7991)
                            </div>
                            
                            <!-- Grade Selector -->
                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Khối lớp & Chương trình:</label>
                                <select id="ai-theory-grade" onchange="onTheoryGradeChange(this.value)" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-teal-500">
                                    <option value="12" ${curGrade==='12'?'selected':''}>Lớp 12 - Chương trình GDPT 2018 (Cấu trúc 2025)</option>
                                    <option value="11" ${curGrade==='11'?'selected':''}>Lớp 11 - Chương trình GDPT 2018</option>
                                    <option value="10" ${curGrade==='10'?'selected':''}>Lớp 10 - Chương trình GDPT 2018</option>
                                    <option value="9" ${curGrade==='9'?'selected':''}>Lớp 9 - Chương trình GDPT 2018</option>
                                    <option value="8" ${curGrade==='8'?'selected':''}>Lớp 8 - Chương trình GDPT 2018</option>
                                    <option value="7" ${curGrade==='7'?'selected':''}>Lớp 7 - Chương trình GDPT 2018</option>
                                    <option value="6" ${curGrade==='6'?'selected':''}>Lớp 6 - Chương trình GDPT 2018</option>
                                </select>
                            </div>

                            <!-- Folder Selector -->
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <label class="block font-bold text-xs text-slate-700 uppercase flex items-center gap-1"><i class="fa-solid fa-folder-open text-teal-600"></i> Thư mục lưu bài giảng:</label>
                                    <span id="theory-folder-badge" class="text-[9px] bg-teal-100 text-teal-900 font-black px-2 py-0.5 rounded-full border border-teal-200">${curFolder}</span>
                                </div>
                                <select id="ai-theory-folder" onchange="document.getElementById('theory-folder-badge').innerText = this.value;" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-800 bg-slate-50 outline-none focus:border-teal-500">
                                    <option value="TOAN 12" ${curFolder==='TOAN 12'?'selected':''}>📁 TOAN 12 (Toán Lớp 12)</option>
                                    <option value="TOAN 11" ${curFolder==='TOAN 11'?'selected':''}>📁 TOAN 11 (Toán Lớp 11)</option>
                                    <option value="TOAN 10" ${curFolder==='TOAN 10'?'selected':''}>📁 TOAN 10 (Toán Lớp 10)</option>
                                    <option value="TOAN 9" ${curFolder==='TOAN 9'?'selected':''}>📁 TOAN 9 (Toán Lớp 9)</option>
                                    <option value="TOAN 8" ${curFolder==='TOAN 8'?'selected':''}>📁 TOAN 8 (Toán Lớp 8)</option>
                                    <option value="TOAN 7" ${curFolder==='TOAN 7'?'selected':''}>📁 TOAN 7 (Toán Lớp 7)</option>
                                    <option value="TOAN 6" ${curFolder==='TOAN 6'?'selected':''}>📁 TOAN 6 (Toán Lớp 6)</option>
                                    <option value="KHAC" ${curFolder==='KHAC'?'selected':''}>📂 KHAC (Nội dung ngoài / Khác)</option>
                                </select>
                            </div>

                            <!-- Dropdown Treeview Checklist matching prompt generator / 7991 -->
                            <div class="relative">
                                <div class="flex items-center justify-between mb-1">
                                    <label class="block font-bold text-xs text-slate-700 uppercase">Danh sách bài học & Dạng kiến thức:</label>
                                    <span id="theory-topic-selected-badge" class="hidden text-[10px] bg-teal-100 text-teal-900 border border-teal-300 font-bold px-2 py-0.2 rounded-full">0 đã chọn</span>
                                </div>
                                <div onclick="toggleTheoryTopicDropdown()" class="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl cursor-pointer flex items-center justify-between transition shadow-inner">
                                    <div class="flex items-center gap-2 overflow-hidden">
                                        <i class="fa-solid fa-list-check text-teal-600 shrink-0"></i>
                                        <span id="theory-topic-summary-text" class="text-xs text-slate-500 font-bold truncate">Chọn từ cây chương trình & dạng bài...</span>
                                    </div>
                                    <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform" id="theory-topic-arrow"></i>
                                </div>

                                <!-- Dropdown Container -->
                                <div id="theory-topic-dropdown-menu" class="hidden absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border-2 border-teal-400 z-50 p-3 max-h-[340px] flex flex-col zoom-in">
                                    <div class="relative mb-2 shrink-0">
                                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                        <input type="text" id="theory-topic-search-input" oninput="filterTheoryTopicChecklist(this.value)" placeholder="Tìm kiếm chương, bài, dạng bài..." class="w-full pl-8 pr-8 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-teal-500 bg-slate-50">
                                        <button onclick="clearTheoryTopicSelections()" class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-rose-500" title="Bỏ chọn tất cả"><i class="fa-solid fa-rotate-left"></i></button>
                                    </div>
                                    <div id="theory-topic-checklist" class="overflow-y-auto flex-grow admin-scroll space-y-2 pr-1 text-xs">
                                        <!-- Injected via populateTheoryTopicOptions -->
                                    </div>
                                    <div class="pt-2 mt-2 border-t border-slate-100 flex justify-end shrink-0">
                                        <button onclick="toggleTheoryTopicDropdown(false)" class="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition btn-3d">Đóng Menu</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Manual Custom Topic Input -->
                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Chủ đề chi tiết (hoặc tự nhập tùy biến):</label>
                                <input type="text" id="ai-theory-topic" oninput="generateTheoryAiPromptText()" placeholder="Ví dụ: Cực trị hàm số Toán 12" value="${theory.title||''}" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner">
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Yêu cầu bổ sung (nếu có):</label>
                                <textarea id="ai-theory-extra" oninput="generateTheoryAiPromptText()" rows="2" placeholder="Nhấn mạnh dạng bài tối ưu, phương pháp giải nhanh hoặc lưu ý bẫy..." class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner"></textarea>
                            </div>

                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <label class="font-bold text-xs text-sky-900 uppercase">Gemini API Key (Tùy chọn):</label>
                                    <span class="text-[10px] text-teal-700 font-bold">Lưu tự động</span>
                                </div>
                                <div class="relative">
                                    <input type="password" id="ai-theory-gemini-key" placeholder="Dán Gemini API Key..." value="${localStorage.getItem('gemini_api_key') || ''}" onchange="localStorage.setItem('gemini_api_key', this.value.trim()); if(document.getElementById('gemini-api-key')) document.getElementById('gemini-api-key').value=this.value.trim(); showToast('Đã lưu API Key!');" class="w-full p-2.5 pr-9 border-2 border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner">
                                    <button type="button" onclick="let inp=document.getElementById('ai-theory-gemini-key'); inp.type = inp.type==='password'?'text':'password';" class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"><i class="fa-solid fa-eye"></i></button>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2 pt-2 border-t border-slate-100">
                            <button id="btn-generate-theory-api" onclick="generateTheoryWithGeminiApi()" class="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider btn-3d shadow-md flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-bolt text-amber-300"></i> Sinh Tự Động 1-Click (Dùng API Key)
                            </button>
                            <button onclick="generateTheoryAiPromptText()" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-wider btn-3d flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-terminal text-teal-300"></i> Tạo Câu Lệnh Prompt Chuẩn 3 Phần
                            </button>
                        </div>
                    </div>

                    <!-- Column 2: Prompt Result -->
                    <div class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                        <div class="flex-grow flex flex-col">
                            <div class="flex justify-between items-center mb-2">
                                <label class="font-black text-xs text-teal-900 uppercase flex items-center gap-1">
                                    <i class="fa-solid fa-code text-teal-600"></i> Bước 2: Câu Lệnh Prompt
                                </label>
                                <button onclick="navigator.clipboard.writeText(document.getElementById('ai-theory-prompt-result').value); showToast('Đã sao chép prompt!');" class="px-2.5 py-1 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 border border-teal-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs">
                                    <i class="fa-solid fa-copy"></i> Copy Prompt
                                </button>
                            </div>
                            <textarea id="ai-theory-prompt-result" readonly class="w-full flex-grow p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[11px] font-mono outline-none resize-none leading-relaxed text-slate-800 min-h-[220px] shadow-inner"></textarea>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.open('https://gemini.google.com/', '_blank')" class="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl uppercase btn-3d flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Web Gemini AI (Miễn phí)
                            </button>
                        </div>
                    </div>

                    <!-- Column 3: Paste & Import Response -->
                    <div class="bg-white p-6 rounded-3xl border-2 border-teal-300 shadow-sm flex flex-col justify-between gap-4">
                        <div class="flex-grow flex flex-col">
                            <div class="flex justify-between items-center mb-2">
                                <label class="font-black text-xs text-teal-900 uppercase flex items-center gap-1">
                                    <i class="fa-solid fa-download text-teal-600"></i> Bước 3: Dán Kết Quả Từ AI
                                </label>
                                <button onclick="document.getElementById('ai-theory-paste-input').value = '';" class="text-[10px] text-slate-400 hover:text-rose-500 font-bold">
                                    <i class="fa-solid fa-trash-can"></i> Xóa
                                </button>
                            </div>
                            <p class="text-[11px] text-slate-500 mb-2 font-medium">Copy toàn bộ câu trả lời từ Gemini/ChatGPT và dán vào ô bên dưới:</p>
                            <textarea id="ai-theory-paste-input" placeholder="Dán nội dung JSON hoặc văn bản AI trả về vào đây..." class="w-full flex-grow p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[11px] font-mono outline-none resize-none leading-relaxed text-slate-800 min-h-[220px] shadow-inner focus:border-teal-500"></textarea>
                        </div>
                        <div class="space-y-2">
                            <button onclick="applyImportedTheoryData(document.getElementById('ai-theory-paste-input')?.value)" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl uppercase btn-3d shadow-md flex items-center justify-center gap-2 tracking-wider">
                                <i class="fa-solid fa-file-import text-amber-300 text-sm"></i> Nạp Vào Sổ Tay & Slide (1-Click)
                            </button>
                        </div>
                    </div>
                </div>`;
                
                setTimeout(() => {
                    populateTheoryTopicOptions(curGrade);
                    generateTheoryAiPromptText();
                }, 50);
            } else if (activeTheorySubTab === 'samples') {
                let sampleCards = Object.keys(GDPT2018_THEORY_SAMPLES).map(k => {
                    let s = GDPT2018_THEORY_SAMPLES[k];
                    return `
                    <div class="p-5 bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-500 shadow-sm transition flex flex-col justify-between gap-4">
                        <div>
                            <span class="px-2.5 py-1 bg-teal-100 text-teal-900 text-[10px] font-black rounded-lg border border-teal-200 uppercase tracking-wider inline-block mb-2">GDPT 2018</span>
                            <h4 class="font-black text-slate-800 text-sm mb-1.5">${s.title}</h4>
                            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">${s.summary}</p>
                            <div class="mt-2 flex items-center gap-2 text-[10px] text-teal-700 font-bold">
                                <span><i class="fa-solid fa-lightbulb text-amber-500"></i> ${(s.examples||[]).length} ví dụ</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-earth-americas text-emerald-500"></i> ${(s.applications||[]).length} bài thực tế</span>
                            </div>
                        </div>
                        <button onclick="applySampleTheoryToExam('${k}')" class="w-full py-2.5 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 font-black text-xs rounded-xl transition border border-teal-300 btn-3d uppercase flex items-center justify-center gap-1.5 shadow-xs">
                            <i class="fa-solid fa-download"></i> Nạp Mẫu Này Vào Đề
                        </button>
                    </div>`;
                }).join('');

                bodyContent = `
                <div class="p-6 h-full flex flex-col justify-between overflow-y-auto admin-scroll">
                    <div>
                        <div class="mb-6">
                            <h3 class="text-lg font-black text-slate-800 uppercase tracking-wide">Kho Sổ Tay Lý Thuyết Mẫu Chuẩn GDPT 2018</h3>
                            <p class="text-xs text-slate-500 font-medium">Bấm "Nạp Mẫu Này Vào Đề" để áp dụng ngay bộ công thức, ví dụ phân dạng và bài toán thực tế chuẩn mực.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${sampleCards}
                        </div>
                    </div>
                </div>`;
            } else if (activeTheorySubTab === 'drive') {
                let localHistory = [];
                try {
                    localHistory = JSON.parse(localStorage.getItem('math_theory_drive_history') || '[]');
                } catch(e) {
                    localHistory = [];
                }

                let historyRows = localHistory.map((item, idx) => {
                    let fCount = (item.theory && item.theory.formulas) ? item.theory.formulas.length : 0;
                    let lCount = Array.isArray(item.lectures) ? item.lectures.length : 0;
                    return `
                    <tr class="border-b border-slate-100 hover:bg-teal-50/40 transition text-xs">
                        <td class="p-3 text-slate-500 font-mono font-bold">${idx + 1}</td>
                        <td class="p-3">
                            <div class="font-black text-slate-800 text-xs">${item.topic || 'Không có tiêu đề'}</div>
                            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${item.id || ('local_' + idx)}</div>
                        </td>
                        <td class="p-3 text-slate-500 font-medium">${item.dateFormatted || item.date || '-'}</td>
                        <td class="p-3 text-center"><span class="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-black">${fCount} CT</span></td>
                        <td class="p-3 text-center"><span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black">${lCount} Slide</span></td>
                        <td class="p-3 text-right">
                            <div class="flex items-center justify-end gap-1.5 flex-wrap">
                                <button onclick="restoreTheoryFromDriveHistory(${idx})" class="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition btn-3d shadow-xs text-[11px] flex items-center gap-1" title="Nạp lại vào giao diện">
                                    <i class="fa-solid fa-file-import"></i> Nạp Lại
                                </button>
                                <button onclick="downloadTheoryDriveJson(${idx})" class="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-[11px]" title="Tải file JSON">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button onclick="deleteTheoryFromDriveHistory(${idx})" class="px-2 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold rounded-xl transition text-[11px]" title="Xóa khỏi lịch sử">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
                }).join('');

                bodyContent = `
                <div class="p-6 h-full flex flex-col gap-6 overflow-y-auto admin-scroll">
                    <!-- Top Actions Bar -->
                    <div class="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h3 class="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                <i class="fa-solid fa-cloud text-teal-600"></i> Quản Trị Kho Lưu Trữ Đám Mây & Lịch Sử Bản Lưu
                            </h3>
                            <p class="text-xs text-slate-500 font-medium mt-0.5">Hỗ trợ sao lưu đa tầng: Supabase Cloud Database, Thư mục Google Drive và Bộ nhớ trình duyệt.</p>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <button onclick="saveTheoryToGoogleDrive(false)" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition btn-3d uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-cloud-arrow-up text-amber-300"></i> Lưu Lên Supabase Cloud
                            </button>
                            <button onclick="downloadTheoryDriveJson()" class="px-3.5 py-2 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 border border-sky-300 font-black text-xs rounded-xl transition btn-3d uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-file-code"></i> Tải File JSON
                            </button>
                            <button onclick="downloadTheoryDriveMarkdown()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-700 hover:text-white text-slate-700 border border-slate-300 font-black text-xs rounded-xl transition btn-3d uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-file-lines"></i> Xuất Markdown
                            </button>
                            <label class="px-3.5 py-2 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-300 font-black text-xs rounded-xl transition btn-3d uppercase flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-upload"></i> Nhập File JSON
                                <input type="file" id="import-theory-json-input" accept=".json" onchange="importTheoryFromDriveJsonFile(event)" class="hidden">
                            </label>
                        </div>
                    </div>

                    <!-- Panel 1: Supabase Cloud Database Archives -->
                    <div class="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                            <div class="flex items-center gap-2">
                                <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs border border-emerald-300">
                                    <i class="fa-solid fa-database"></i>
                                </span>
                                <div>
                                    <h4 class="font-black text-sm text-slate-800 uppercase tracking-wide">1. Dữ Liệu Đồng Bộ Trên Supabase Cloud</h4>
                                    <p class="text-[11px] text-slate-500 font-medium">Bảng lưu trữ vĩnh viễn trên Cloud, truy cập và đồng bộ từ mọi thiết bị giảng dạy.</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <select onchange="filterSupabaseTheoryByFolder(this.value)" class="p-1.5 text-xs font-black border border-slate-200 rounded-xl outline-none focus:border-teal-500 bg-slate-50 text-teal-900 cursor-pointer shadow-2xs">
                                    <option value="ALL">📁 Tất Cả Thư Mục</option>
                                    <option value="TOAN 12">TOAN 12</option>
                                    <option value="TOAN 11">TOAN 11</option>
                                    <option value="TOAN 10">TOAN 10</option>
                                    <option value="TOAN 9">TOAN 9</option>
                                    <option value="TOAN 8">TOAN 8</option>
                                    <option value="TOAN 7">TOAN 7</option>
                                    <option value="TOAN 6">TOAN 6</option>
                                    <option value="KHAC">KHAC</option>
                                </select>
                                <div class="relative">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input type="text" oninput="filterSupabaseTheoryTable(this.value)" placeholder="Tìm bài giảng Supabase..." class="pl-8 pr-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-teal-500 bg-slate-50">
                                </div>
                                <button onclick="loadSupabaseTheoryTable()" class="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 flex items-center gap-1">
                                    <i class="fa-solid fa-rotate"></i> Tải Lại
                                </button>
                            </div>
                        </div>

                        <div id="supabase-theory-table-container" class="overflow-x-auto">
                            <div class="flex items-center justify-center py-8 text-teal-700 font-bold text-xs gap-2">
                                <i class="fa-solid fa-spinner fa-spin text-lg"></i> Đang tải danh sách từ Supabase Cloud...
                            </div>
                        </div>
                    </div>

                    <!-- Panel 2: Browser Local Storage / Drive History -->
                    <div class="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                            <div class="flex items-center gap-2">
                                <span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-xs border border-sky-300">
                                    <i class="fa-solid fa-laptop"></i>
                                </span>
                                <div>
                                    <h4 class="font-black text-sm text-slate-800 uppercase tracking-wide">2. Lịch Sử Bản Lưu Trình Duyệt Máy Này (${localHistory.length} bản ghi)</h4>
                                    <p class="text-[11px] text-slate-500 font-medium">Bản nháp tự động lưu trên bộ nhớ máy tính để phòng ngừa mất mạng hoặc đóng tab đột ngột.</p>
                                </div>
                            </div>
                            <button onclick="clearTheoryDriveHistory()" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold rounded-xl text-xs transition border border-rose-200 flex items-center gap-1">
                                <i class="fa-solid fa-trash-can"></i> Xóa Toàn Bộ Lịch Sử
                            </button>
                        </div>

                        <div class="overflow-x-auto">
                            ${localHistory.length > 0 ? `
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-100 text-slate-700 text-xs uppercase font-black border-b border-slate-200">
                                        <th class="p-3 w-12">#</th>
                                        <th class="p-3">Chủ Đề & ID</th>
                                        <th class="p-3">Thời Gian Lưu</th>
                                        <th class="p-3 text-center">Công Thức</th>
                                        <th class="p-3 text-center">Slide</th>
                                        <th class="p-3 text-right">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>${historyRows}</tbody>
                            </table>` : `
                            <div class="text-center py-8 text-slate-400 text-xs italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                Chưa có bản lưu nào trong bộ nhớ máy. Khi Thầy/Cô nhấn "Lưu Thay Đổi" hoặc "Lưu Google Drive", hệ thống sẽ tự động sao lưu tại đây.
                            </div>`}
                        </div>
                    </div>
                </div>`;
                
                setTimeout(() => {
                    loadSupabaseTheoryTable();
                }, 50);
            } else if (activeTheorySubTab === 'style') {
                let t = adminState.data.theory || {};
                let st = t.style || { align: 'left', fontSize: 'base', theme: 'teal', cardStyle: 'modern' };
                let ls = adminState.data.lecturesStyle || { align: 'left', fontSize: 'xl', theme: 'teal', cardStyle: 'modern', animation: 'fade' };

                bodyContent = `
                <div class="p-6 h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto admin-scroll">
                    <!-- Left: Theory Styling -->
                    <div class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
                        <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span class="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm border border-teal-300">
                                <i class="fa-solid fa-book"></i>
                            </span>
                            <div>
                                <h3 class="font-black text-sm text-slate-800 uppercase tracking-wide">Cài Đặt Hiển Thị Sổ Tay Lý Thuyết</h3>
                                <p class="text-[11px] text-slate-500 font-medium">Áp dụng cho giao diện xem Sổ tay của Học sinh & Giáo viên</p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Căn lề văn bản:</label>
                                <select id="theory-style-align" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-teal-500">
                                    <option value="left" ${st.align==='left'?'selected':''}>Căn lề trái (Mặc định chuẩn)</option>
                                    <option value="justify" ${st.align==='justify'?'selected':''}>Căn đều hai bên (Justify cân đối)</option>
                                    <option value="center" ${st.align==='center'?'selected':''}>Căn giữa (Center)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Cỡ chữ văn bản:</label>
                                <select id="theory-style-font" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-teal-500">
                                    <option value="sm" ${st.fontSize==='sm'?'selected':''}>Nhỏ gọn (13px)</option>
                                    <option value="base" ${st.fontSize==='base'?'selected':''}>Tiêu chuẩn (15px - Dễ đọc)</option>
                                    <option value="lg" ${st.fontSize==='lg'?'selected':''}>Lớn (17px - Phù hợp máy tính bảng)</option>
                                    <option value="xl" ${st.fontSize==='xl'?'selected':''}>Rất lớn (19px - Phù hợp màn chiếu TV)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Bảng màu chủ đạo (Theme Palette):</label>
                                <select id="theory-style-theme" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-teal-500">
                                    <option value="teal" ${st.theme==='teal'?'selected':''}>Xanh Ngọc Bích (Teal - Chuẩn Toán học)</option>
                                    <option value="indigo" ${st.theme==='indigo'?'selected':''}>Xanh Dương Indigo (Hiện đại)</option>
                                    <option value="emerald" ${st.theme==='emerald'?'selected':''}>Xanh Lục Bảo (Emerald tươi mát)</option>
                                    <option value="amber" ${st.theme==='amber'?'selected':''}>Vàng Hổ Phách (Amber ấm áp)</option>
                                    <option value="rose" ${st.theme==='rose'?'selected':''}>Hồng Đào Rose (Trang nhã)</option>
                                    <option value="slate" ${st.theme==='slate'?'selected':''}>Đen Xám Tối Giản (Minimal Slate)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Kiểu khung thẻ (Card Style):</label>
                                <select id="theory-style-card" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-teal-500">
                                    <option value="modern" ${st.cardStyle==='modern'?'selected':''}>Hiện đại bo góc mềm (Modern rounded-2xl)</option>
                                    <option value="elevation" ${st.cardStyle==='elevation'?'selected':''}>Đổ bóng 3D nổi bật (Elevation Shadow)</option>
                                    <option value="glass" ${st.cardStyle==='glass'?'selected':''}>Kính mờ xuyên thấu (Glassmorphism)</option>
                                    <option value="minimal" ${st.cardStyle==='minimal'?'selected':''}>Đường viền tối giản (Minimal Border)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Slide Presentation Styling -->
                    <div class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
                        <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm border border-indigo-300">
                                <i class="fa-solid fa-chalkboard-user"></i>
                            </span>
                            <div>
                                <h3 class="font-black text-sm text-slate-800 uppercase tracking-wide">Cài Đặt Trình Chiếu Slide Bài Giảng</h3>
                                <p class="text-[11px] text-slate-500 font-medium">Tối ưu trải nghiệm khi chiếu trên màn hình TV lớp học hoặc máy chiếu</p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Căn lề nội dung slide:</label>
                                <select id="lecture-style-align" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-indigo-500">
                                    <option value="left" ${ls.align==='left'?'selected':''}>Căn lề trái (Dễ theo dõi từng bước)</option>
                                    <option value="center" ${ls.align==='center'?'selected':''}>Căn giữa (Tâm điểm thị giác)</option>
                                    <option value="justify" ${ls.align==='justify'?'selected':''}>Căn đều hai bên</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Cỡ chữ slide trình chiếu:</label>
                                <select id="lecture-style-font" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-indigo-500">
                                    <option value="lg" ${ls.fontSize==='lg'?'selected':''}>Lớn (18px - Màn hình Laptop)</option>
                                    <option value="xl" ${ls.fontSize==='xl'?'selected':''}>Rất lớn (22px - Khuyên dùng lớp học)</option>
                                    <option value="2xl" ${ls.fontSize==='2xl'?'selected':''}>Siêu lớn (26px - Hội trường / TV cỡ lớn)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Bảng màu slide (Theme):</label>
                                <select id="lecture-style-theme" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-indigo-500">
                                    <option value="teal" ${ls.theme==='teal'?'selected':''}>Xanh Ngọc Bích (Teal)</option>
                                    <option value="indigo" ${ls.theme==='indigo'?'selected':''}>Xanh Dương Indigo</option>
                                    <option value="emerald" ${ls.theme==='emerald'?'selected':''}>Xanh Lục Bảo (Emerald)</option>
                                    <option value="amber" ${ls.theme==='amber'?'selected':''}>Vàng Hổ Phách (Amber)</option>
                                    <option value="rose" ${ls.theme==='rose'?'selected':''}>Hồng Đào Rose</option>
                                    <option value="slate" ${ls.theme==='slate'?'selected':''}>Đen Xám Tối Giản</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Hiệu ứng chuyển slide (Transition Animation):</label>
                                <select id="lecture-style-anim" class="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-indigo-500">
                                    <option value="fade" ${ls.animation==='fade'?'selected':''}>Mờ dần mềm mại (Fade In - Mặc định)</option>
                                    <option value="slide" ${ls.animation==='slide'?'selected':''}>Trượt ngang (Slide Transition)</option>
                                    <option value="zoom" ${ls.animation==='zoom'?'selected':''}>Thu phóng tiêu điểm (Zoom In)</option>
                                </select>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-100 flex gap-3">
                            <button onclick="saveTheoryStyleSettings()" class="w-full py-3.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl uppercase btn-3d shadow-md flex items-center justify-center gap-2">
                                <i class="fa-solid fa-floppy-disk"></i> Lưu Cấu Hình Cân Chỉnh & Màu Sắc
                            </button>
                        </div>
                    </div>
                </div>`;
            } else if (activeTheorySubTab === 'guide') {
                bodyContent = `
                <div class="p-6 h-full overflow-y-auto admin-scroll max-w-5xl mx-auto space-y-6">
                    <div class="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-8 rounded-3xl text-white shadow-xl">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl text-amber-300">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </span>
                            <h2 class="text-xl md:text-2xl font-black uppercase tracking-wider">Hướng Dẫn Sử Dụng Studio Lý Thuyết & Bài Giảng TBS</h2>
                        </div>
                        <p class="text-teal-100 text-xs md:text-sm font-medium leading-relaxed">Bộ công cụ sư phạm toàn diện giúp Thầy/Cô biên soạn nhanh Sổ tay Lý thuyết 3 phần chuẩn GDPT 2018 và hệ thống Slide Bài giảng Micro-learning tương tác thông minh.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <!-- Card 1: 3-Part Structure -->
                        <div class="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-sm space-y-3">
                            <div class="flex items-center gap-2.5 text-teal-800 font-black text-sm uppercase">
                                <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">1</span>
                                Cấu Trúc Sổ Tay 3 Phần Chuẩn GDPT 2018
                            </div>
                            <ul class="text-xs text-slate-600 space-y-2 font-medium leading-relaxed list-disc list-inside">
                                <li><b>Phần 1: Cốt lõi kiến thức:</b> Tóm tắt khái niệm, định lý, bảng công thức LaTeX bỏ túi, phương pháp giải theo bước và bẫy sai lầm cần tránh.</li>
                                <li><b>Phần 2: Ví dụ phân dạng:</b> Mỗi dạng bài gồm tiêu đề dạng, đề bài và lời giải chi tiết từng bước.</li>
                                <li><b>Phần 3: Bài toán thực tế:</b> Bài toán ứng dụng thực tiễn tích hợp nút bật/tắt xem lời giải để học sinh tự rèn luyện trước.</li>
                            </ul>
                        </div>

                        <!-- Card 2: Interactive Slides -->
                        <div class="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-3">
                            <div class="flex items-center gap-2.5 text-indigo-800 font-black text-sm uppercase">
                                <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black">2</span>
                                Slide Bài Giảng & Phân Giải Theo Bước
                            </div>
                            <ul class="text-xs text-slate-600 space-y-2 font-medium leading-relaxed list-disc list-inside">
                                <li><b>Micro-learning:</b> Mỗi slide tập trung vào một đơn vị kiến thức nhỏ, hỗ trợ định dạng Markdown và công thức LaTeX toán học chuẩn mực.</li>
                                <li><b>Step-by-step reveal:</b> Khi bấm "Hiện Bước Kế Tiếp", từng dòng biến đổi hoặc phân tích sẽ xuất hiện tuần tự giúp thu hút học sinh.</li>
                                <li><b>Ghi chú sư phạm:</b> Lời nhắc bí mật dành riêng cho giáo viên khi đứng lớp giảng dạy.</li>
                            </ul>
                        </div>

                        <!-- Card 3: Cloud & Google Drive -->
                        <div class="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-3">
                            <div class="flex items-center gap-2.5 text-emerald-800 font-black text-sm uppercase">
                                <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
                                Lưu Trữ Đám Mây & Lịch Sử Bản Lưu
                            </div>
                            <ul class="text-xs text-slate-600 space-y-2 font-medium leading-relaxed list-disc list-inside">
                                <li><b>Supabase Cloud Database:</b> Tự động lưu trữ bài giảng vĩnh viễn trên đám mây, nạp lại bất cứ lúc nào trên mọi thiết bị.</li>
                                <li><b>Xuất File JSON & Markdown:</b> Dễ dàng tải file tài liệu về máy tính để in ấn hoặc nạp vào các hệ thống LMS khác.</li>
                                <li><b>Local Storage:</b> Tự động lưu bản nháp dự phòng ngay trên trình duyệt máy tính của Thầy/Cô.</li>
                            </ul>
                        </div>

                        <!-- Card 4: Keyboard Shortcuts -->
                        <div class="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-3">
                            <div class="flex items-center gap-2.5 text-amber-900 font-black text-sm uppercase">
                                <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-black">4</span>
                                Phím Tắt Khi Trình Chiếu Bài Giảng
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-1">
                                <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <span>Mũi tên Phải / D / Space:</span>
                                    <span class="font-mono bg-white px-2 py-0.5 rounded border border-slate-300">Hiện bước / Sang slide</span>
                                </div>
                                <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <span>Mũi tên Trái / A:</span>
                                    <span class="font-mono bg-white px-2 py-0.5 rounded border border-slate-300">Về slide trước</span>
                                </div>
                                <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <span>Phím W hoặc B:</span>
                                    <span class="font-mono bg-white px-2 py-0.5 rounded border border-slate-300">Mở Bảng Trắng TBS</span>
                                </div>
                                <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <span>Phím Esc:</span>
                                    <span class="font-mono bg-white px-2 py-0.5 rounded border border-slate-300">Thoát về Studio</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }

            container.innerHTML = `
                <div class="h-full flex flex-col bg-slate-100 overflow-hidden">
                    <!-- Top Sub-Nav -->
                    <div class="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                        <div class="flex items-center gap-2 overflow-x-auto admin-scroll py-1">
                            ${navHtml}
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="saveTheoryToGoogleDrive(false)" class="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-sm transition btn-3d uppercase flex items-center gap-1.5" title="Đồng bộ lưu trữ vào Thư mục Google Drive & Supabase Cloud">
                                <i class="fa-brands fa-google-drive text-amber-300"></i> Lưu Drive / Cloud
                            </button>
                            <button onclick="openGoogleDriveTheoryFolder()" class="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm transition btn-3d uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Drive
                            </button>
                            <button onclick="saveTheoryToExamData()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-sm transition btn-3d uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-check"></i> Lưu Thay Đổi
                            </button>
                        </div>
                    </div>

                    <!-- Main Tab Content Area -->
                    <div class="flex-grow overflow-hidden bg-slate-50">
                        ${bodyContent}
                    </div>
                </div>
            `;

            if (activeTheorySubTab === 'theory') {
                updateTheoryLivePreview();
            }
        }

        function saveTheoryToExamData() {
            saveTheoryInputsLive();
            if (adminState.data) {
                if (adminState.data.theory) GAME_DATA.theory = JSON.parse(JSON.stringify(adminState.data.theory));
                if (adminState.data.lectures) GAME_DATA.lectures = JSON.parse(JSON.stringify(adminState.data.lectures));
                if (adminState.data.lecturesStyle) GAME_DATA.lecturesStyle = JSON.parse(JSON.stringify(adminState.data.lecturesStyle));
            }
            saveTheoryToGoogleDrive(false);
            showToast("✅ Đã lưu Sổ tay Lý thuyết & Slide Bài giảng vào bộ đề thành công!");
        }

        function applySampleTheoryToExam(sampleKey) {
            let s = GDPT2018_THEORY_SAMPLES[sampleKey];
            if (!s) return showToast("Không tìm thấy mẫu dữ liệu!", true);
            
            showConfirmModal("Nạp Mẫu Lý Thuyết", `Áp dụng chuyên đề "${s.title}" vào sổ tay & tạo slide bài giảng tương ứng?`, () => {
                if (!adminState.data.theory) adminState.data.theory = {};
                let curStyle = adminState.data.theory.style || { align: 'left', fontSize: 'base', theme: 'teal', cardStyle: 'modern' };
                
                adminState.data.theory = {
                    title: s.title,
                    summary: s.summary || '',
                    formulas: Array.isArray(s.formulas) ? [...s.formulas] : [],
                    methods: s.methods || '',
                    traps: s.traps || '',
                    examples: Array.isArray(s.examples) ? JSON.parse(JSON.stringify(s.examples)) : [],
                    applications: Array.isArray(s.applications) ? JSON.parse(JSON.stringify(s.applications)) : [],
                    style: curStyle
                };
                
                let slides = [];
                slides.push({
                    id: 1,
                    title: `1. Trọng tâm: ${s.title}`,
                    content: `### 📌 Khái niệm then chốt\n${s.summary || ''}`,
                    teacherNote: s.traps ? `Lưu ý bẫy sai lầm: ${s.traps}` : '',
                    steps: (s.formulas || []).length > 0 ? s.formulas.map((f, idx) => `Công thức ${idx + 1}: ${f}`) : ["Bước 1: Nắm vững khái niệm", "Bước 2: Vận dụng công thức"]
                });
                
                if (s.methods) {
                    slides.push({
                        id: 2,
                        title: `2. Phương pháp giải bài toán`,
                        content: `### 🛠️ Thuật toán & Phương pháp\n${s.methods}`,
                        teacherNote: "Hướng dẫn học sinh các bước biến đổi chi tiết.",
                        steps: s.methods.split('\n').filter(Boolean)
                    });
                }
                
                if (s.examples && s.examples.length > 0) {
                    s.examples.forEach((ex, exIdx) => {
                        slides.push({
                            id: slides.length + 1,
                            title: `3.${exIdx + 1}. Ví dụ: ${ex.typeName || `Dạng ${exIdx + 1}`}`,
                            content: `**Đề bài:**\n${ex.question || ''}`,
                            teacherNote: ex.analysis || "Cho học sinh thời gian suy nghĩ và nháp trước.",
                            steps: ex.solution ? ex.solution.split('\n').filter(l => l.trim().length > 0) : ["Bước 1: Phân tích giả thiết", "Bước 2: Thực hiện lời giải"]
                        });
                    });
                }
                
                if (s.applications && s.applications.length > 0) {
                    s.applications.forEach((app, appIdx) => {
                        slides.push({
                            id: slides.length + 1,
                            title: `4.${appIdx + 1}. Thực tế: ${app.title || `Tình huống ${appIdx + 1}`}`,
                            content: `**Bài toán thực tế:**\n${app.question || ''}`,
                            teacherNote: "Gợi ý đưa mô hình thực tế về hàm số hoặc phương trình toán học.",
                            steps: app.solution ? app.solution.split('\n').filter(l => l.trim().length > 0) : ["Bước 1: Mô hình hóa toán học", "Bước 2: Giải và kết luận thực tế"]
                        });
                    });
                }
                
                adminState.data.lectures = slides;
                GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
                saveTheoryToGoogleDrive(true);
                
                showToast(`🎉 Đã nạp mẫu "${s.title}" và tạo ${slides.length} slide bài giảng!`);
                activeTheorySubTab = 'theory';
                renderTheoryStudio(document.getElementById('admin-content-area'));
            });
        }

        function saveTheoryStyleSettings() {
            if (!adminState.data.theory) adminState.data.theory = {};
            if (!adminState.data.theory.style) adminState.data.theory.style = {};
            if (!adminState.data.lecturesStyle) adminState.data.lecturesStyle = {};
            
            adminState.data.theory.style = {
                align: document.getElementById('theory-style-align')?.value || 'left',
                fontSize: document.getElementById('theory-style-font')?.value || 'base',
                theme: document.getElementById('theory-style-theme')?.value || 'teal',
                cardStyle: document.getElementById('theory-style-card')?.value || 'modern'
            };
            
            adminState.data.lecturesStyle = {
                align: document.getElementById('lecture-style-align')?.value || 'left',
                fontSize: document.getElementById('lecture-style-font')?.value || 'xl',
                theme: document.getElementById('lecture-style-theme')?.value || 'teal',
                cardStyle: document.getElementById('lecture-style-card')?.value || 'modern',
                animation: document.getElementById('lecture-style-anim')?.value || 'fade'
            };
            
            GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
            saveTheoryToGoogleDrive(true);
            showToast("✅ Đã lưu cấu hình cân chỉnh & màu sắc thành công!");
        }

        function addTheorySection() {
            if (!adminState.data.theory) adminState.data.theory = {};
            if (!adminState.data.theory.sections) adminState.data.theory.sections = [];
            let nextNum = adminState.data.theory.sections.length + 1;
            adminState.data.theory.sections.push({
                id: nextNum,
                title: `${nextNum}. Tên phần kiến thức ${nextNum}`,
                content: "Nội dung lý thuyết trọng tâm, định nghĩa, định lý...",
                example: {
                    question: "Đề bài ví dụ áp dụng trực tiếp cho phần này...",
                    solution: "**Lời giải chi tiết:**\n- Bước 1: ...\n- Bước 2: ..."
                }
            });
            renderTheoryStudio(document.getElementById('admin-content-area'));
        }

        function removeTheorySection(idx) {
            if (adminState.data.theory && adminState.data.theory.sections) {
                adminState.data.theory.sections.splice(idx, 1);
                renderTheoryStudio(document.getElementById('admin-content-area'));
            }
        }

        function addTheoryPracticeExercise() {
            if (!adminState.data.theory) adminState.data.theory = {};
            if (!adminState.data.theory.practiceExercises) adminState.data.theory.practiceExercises = [];
            let nextNum = adminState.data.theory.practiceExercises.length + 1;
            adminState.data.theory.practiceExercises.push({
                id: nextNum,
                level: "Vận dụng",
                question: `Bài tự luyện ${nextNum}: Đề bài câu hỏi...`,
                shortAnswer: "Đáp số: ...",
                hint: "**Hướng dẫn giải:**\n- Bước 1: ...\n- Bước 2: ..."
            });
            renderTheoryStudio(document.getElementById('admin-content-area'));
        }

        function removeTheoryPracticeExercise(idx) {
            if (adminState.data.theory && adminState.data.theory.practiceExercises) {
                adminState.data.theory.practiceExercises.splice(idx, 1);
                renderTheoryStudio(document.getElementById('admin-content-area'));
            }
        }

        function toggleTheoryPreviewPracticeHint(idx) {
            let el = document.getElementById(`theory-preview-practice-hint-${idx}`);
            let btn = document.getElementById(`theory-preview-practice-btn-${idx}`);
            if (!el) return;
            let isHidden = el.classList.contains('hidden');
            el.classList.toggle('hidden', !isHidden);
            if (btn) {
                btn.innerHTML = isHidden 
                    ? '<i class="fa-solid fa-eye-slash text-amber-500"></i> Ẩn Gợi Ý' 
                    : '<i class="fa-solid fa-lightbulb text-amber-500"></i> Xem Gợi Ý & Đáp Số';
            }
        }

        // ================= LESSON SELECTOR MODAL FOR THEORY =================
        function openTheoryLessonSelectModal() {
            let modal = document.getElementById('theory-lesson-select-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'theory-lesson-select-modal';
                modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4';
                document.body.appendChild(modal);
            }
            let curGrade = document.getElementById('ai-theory-grade')?.value || (adminState?.meta?.grade || '12');
            
            modal.innerHTML = `
                <div class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-teal-300 flex flex-col max-h-[85vh] animate-scale-in">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-lg font-black shadow-inner">
                                <i class="fa-solid fa-book-open-reader"></i>
                            </div>
                            <div>
                                <h3 class="font-black text-slate-800 text-base">Chọn Bài Học Từ Chương Trình GDPT 2018</h3>
                                <p class="text-xs text-slate-500">Chọn bài học để tự động gắn tiêu đề và mã định danh tra cứu</p>
                            </div>
                        </div>
                        <button onclick="closeTheoryLessonSelectModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center transition">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Search & Grade Filter -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                        <select id="modal-theory-grade-filter" onchange="renderTheoryLessonsInModalList(this.value)" class="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-teal-500">
                            <option value="12" ${curGrade === '12' ? 'selected' : ''}>Toán Lớp 12</option>
                            <option value="11" ${curGrade === '11' ? 'selected' : ''}>Toán Lớp 11</option>
                            <option value="10" ${curGrade === '10' ? 'selected' : ''}>Toán Lớp 10</option>
                            <option value="9" ${curGrade === '9' ? 'selected' : ''}>Toán Lớp 9</option>
                            <option value="8" ${curGrade === '8' ? 'selected' : ''}>Toán Lớp 8</option>
                            <option value="7" ${curGrade === '7' ? 'selected' : ''}>Toán Lớp 7</option>
                            <option value="6" ${curGrade === '6' ? 'selected' : ''}>Toán Lớp 6</option>
                        </select>
                        <div class="md:col-span-2 relative">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                            <input type="text" id="modal-theory-lesson-search" oninput="searchTheoryLessonsInModal()" placeholder="Tìm kiếm chương, bài học hoặc dạng toán..." class="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-teal-500 shadow-inner">
                        </div>
                    </div>

                    <!-- List Container -->
                    <div id="modal-theory-lessons-container" class="flex-grow overflow-y-auto admin-scroll space-y-3 pr-1">
                        <!-- Populated dynamically -->
                    </div>

                    <div class="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                        <button onclick="closeTheoryLessonSelectModal()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                            Đóng
                        </button>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            renderTheoryLessonsInModalList(curGrade);
        }

        function closeTheoryLessonSelectModal() {
            let modal = document.getElementById('theory-lesson-select-modal');
            if (modal) modal.classList.add('hidden');
        }

        function selectTheoryLessonFromModal(val) {
            let input = document.getElementById('edit-theory-title');
            if (input) {
                input.value = val;
                saveTheoryInputsLive();
            }
            let aiTopic = document.getElementById('ai-theory-topic');
            if (aiTopic) {
                aiTopic.value = val;
            }
            showToast(`✅ Đã chọn bài: ${val}`);
            closeTheoryLessonSelectModal();
        }

        function renderTheoryLessonsInModalList(grade) {
            let container = document.getElementById('modal-theory-lessons-container');
            if (!container) return;
            let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[grade]) || (grade === '10' ? '0' : (grade === '11' ? '1' : (grade === '12' ? '2' : grade)));
            let gData = (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) || null;
            
            if (!gData || !gData.branches) {
                container.innerHTML = '<div class="p-6 text-center text-xs text-slate-400">Không tìm thấy dữ liệu cây bài học cho lớp này.</div>';
                return;
            }

            let html = '';
            Object.keys(gData.branches).forEach(bKey => {
                let bData = gData.branches[bKey];
                let branchIcon = bKey === 'D' ? 'fa-calculator text-teal-600' : 'fa-shapes text-emerald-600';
                html += `
                    <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <div class="text-xs font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5 pb-1.5 border-b border-slate-200">
                            <i class="fa-solid ${branchIcon}"></i>
                            <span>Phần: ${bData.name}</span>
                        </div>
                `;
                Object.keys(bData.chapters).forEach(cKey => {
                    let cData = bData.chapters[cKey];
                    let chPrefix = `[${gCode}${bKey}${cKey}]`;
                    let chVal = `${chPrefix} Chương ${cKey}: ${cData.name}`;
                    html += `
                        <div class="mb-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div class="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100">
                                <span class="text-xs font-black text-teal-950">${chVal}</span>
                                <button onclick="selectTheoryLessonFromModal('${chVal.replace(/'/g, "\\'")}')" class="px-2 py-0.5 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 text-[10px] font-bold rounded border border-teal-200 transition">Chọn Chương</button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-1.5">
                    `;
                    Object.keys(cData.lessons || {}).forEach(lKey => {
                        let lData = cData.lessons[lKey];
                        let lsPrefix = `[${gCode}${bKey}${cKey}?${lKey}]`;
                        let lsVal = `${lsPrefix} Bài ${lKey}: ${lData.name}`;
                        html += `
                            <button onclick="selectTheoryLessonFromModal('${lsVal.replace(/'/g, "\\'")}')" class="text-left p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition text-slate-800 group flex items-start gap-1.5">
                                <i class="fa-solid fa-file-lines text-teal-600 mt-0.5 text-xs group-hover:scale-110 transition-transform"></i>
                                <span class="text-[11px] font-bold leading-snug">${lsVal}</span>
                            </button>
                        `;
                    });
                    html += `
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            });

            container.innerHTML = html;
        }

        function searchTheoryLessonsInModal() {
            let q = removeVietnameseTones(document.getElementById('modal-theory-lesson-search')?.value || '').toLowerCase().trim();
            let buttons = document.querySelectorAll('#modal-theory-lessons-container button');
            buttons.forEach(btn => {
                let txt = removeVietnameseTones(btn.innerText).toLowerCase();
                if (!q || txt.includes(q)) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            });
        }

        function addTheoryExample() {
            if (!adminState.data.theory) adminState.data.theory = {};
            if (!adminState.data.theory.examples) adminState.data.theory.examples = [];
            adminState.data.theory.examples.push({
                typeName: `Dạng ${adminState.data.theory.examples.length + 1}: Dạng bài mới`,
                question: "Đề bài ví dụ mẫu...",
                analysis: "Phân tích hướng giải...",
                solution: "**Lời giải:**\nThực hiện các bước biến đổi..."
            });
            renderTheoryStudio(document.getElementById('admin-content-area'));
        }

        function removeTheoryExample(idx) {
            if (adminState.data.theory && adminState.data.theory.examples) {
                adminState.data.theory.examples.splice(idx, 1);
                renderTheoryStudio(document.getElementById('admin-content-area'));
            }
        }

        function addTheoryApplication() {
            if (!adminState.data.theory) adminState.data.theory = {};
            if (!adminState.data.theory.applications) adminState.data.theory.applications = [];
            adminState.data.theory.applications.push({
                title: `Bài toán thực tế ${adminState.data.theory.applications.length + 1}`,
                question: "Nội dung bài toán ứng dụng thực tế trong đời sống / kinh tế / kỹ thuật...",
                solution: "**Phương pháp giải & Lời giải:**\n1. Mô hình hóa bài toán...\n2. Tính toán và kết luận."
            });
            renderTheoryStudio(document.getElementById('admin-content-area'));
        }

        function removeTheoryApplication(idx) {
            if (adminState.data.theory && adminState.data.theory.applications) {
                adminState.data.theory.applications.splice(idx, 1);
                renderTheoryStudio(document.getElementById('admin-content-area'));
            }
        }

        function toggleTheoryPreviewSolution(idx) {
            let el = document.getElementById(`theory-preview-app-sol-${idx}`);
            let btn = document.getElementById(`theory-preview-app-btn-${idx}`);
            if (!el) return;
            let isHidden = el.classList.contains('hidden');
            el.classList.toggle('hidden', !isHidden);
            if (btn) {
                btn.innerHTML = isHidden 
                    ? '<i class="fa-solid fa-eye-slash text-amber-500"></i> Ẩn Lời Giải' 
                    : '<i class="fa-solid fa-eye text-emerald-600"></i> Xem Lời Giải';
            }
        }

        function saveTheoryInputsLive() {
            if (!adminState.data.theory) adminState.data.theory = {};
            let t = adminState.data.theory;
            t.title = document.getElementById('edit-theory-title')?.value || '';
            t.summary = document.getElementById('edit-theory-summary')?.value || '';
            t.methods = document.getElementById('edit-theory-methods')?.value || '';
            t.traps = document.getElementById('edit-theory-traps')?.value || '';
            
            // Formulas
            let formulas = [];
            (t.formulas || []).forEach((_, idx) => {
                let el = document.getElementById(`theory-formula-${idx}`);
                if (el) formulas.push(el.value);
            });
            t.formulas = formulas;

            // Sections with Example per section
            let sections = [];
            (t.sections || []).forEach((_, idx) => {
                let sTitle = document.getElementById(`theory-sec-title-${idx}`)?.value || '';
                let sContent = document.getElementById(`theory-sec-content-${idx}`)?.value || '';
                let exQ = document.getElementById(`theory-sec-ex-q-${idx}`)?.value || '';
                let exSol = document.getElementById(`theory-sec-ex-sol-${idx}`)?.value || '';
                sections.push({
                    id: idx + 1,
                    title: sTitle,
                    content: sContent,
                    example: (exQ || exSol) ? { question: exQ, solution: exSol } : null
                });
            });
            t.sections = sections;

            // Examples by type (compat)
            let examples = [];
            (t.examples || []).forEach((_, idx) => {
                let tp = document.getElementById(`theory-example-type-${idx}`)?.value || '';
                let q = document.getElementById(`theory-example-q-${idx}`)?.value || '';
                let sol = document.getElementById(`theory-example-sol-${idx}`)?.value || '';
                examples.push({ typeName: tp, question: q, solution: sol });
            });
            t.examples = examples;

            // Applications
            let applications = [];
            (t.applications || []).forEach((_, idx) => {
                let title = document.getElementById(`theory-app-title-${idx}`)?.value || '';
                let q = document.getElementById(`theory-app-q-${idx}`)?.value || '';
                let sol = document.getElementById(`theory-app-sol-${idx}`)?.value || '';
                applications.push({ title: title, question: q, solution: sol });
            });
            t.applications = applications;

            // Part 4 Practice Exercises
            let practiceExercises = [];
            (t.practiceExercises || []).forEach((_, idx) => {
                let lvl = document.getElementById(`theory-practice-lvl-${idx}`)?.value || 'Vận dụng';
                let q = document.getElementById(`theory-practice-q-${idx}`)?.value || '';
                let ans = document.getElementById(`theory-practice-ans-${idx}`)?.value || '';
                let hint = document.getElementById(`theory-practice-hint-${idx}`)?.value || '';
                practiceExercises.push({
                    id: idx + 1,
                    level: lvl,
                    question: q,
                    shortAnswer: ans,
                    hint: hint
                });
            });
            t.practiceExercises = practiceExercises;

            updateTheoryLivePreview();
        }

        function updateTheoryLivePreview() {
            let container = document.getElementById('theory-live-preview');
            if (!container) return;
            let t = adminState.data.theory || {};
            let st = t.style || { align: 'left', fontSize: 'base', theme: 'teal', cardStyle: 'modern' };

            let alignCls = st.align === 'center' ? 'theory-align-center' : (st.align === 'justify' ? 'theory-align-justify' : 'theory-align-left');
            let fontCls = st.fontSize === 'sm' ? 'theory-font-sm' : (st.fontSize === 'lg' ? 'theory-font-lg' : (st.fontSize === 'xl' ? 'theory-font-xl' : 'theory-font-base'));
            let cardCls = st.cardStyle === 'elevation' ? 'theory-card-elevation' : (st.cardStyle === 'glass' ? 'theory-card-glass' : (st.cardStyle === 'minimal' ? 'theory-card-minimal' : 'theory-card-modern'));
            let themeCardCls = `theme-${st.theme || 'teal'}-card`;
            let themeAccentCls = `theme-${st.theme || 'teal'}-accent`;

            let html = `
                <!-- Header / Tiêu đề & Bức tranh tổng quan -->
                <div class="${cardCls} ${themeCardCls} p-5 mb-4 border transition-all">
                    <h3 class="font-black text-base md:text-lg mb-1.5 font-display uppercase tracking-wide flex items-center gap-2">
                        <i class="fa-solid fa-bookmark"></i> ${t.title || 'Tiêu đề lý thuyết...'}
                    </h3>
                    <div class="prose-math ${alignCls} ${fontCls} leading-relaxed">
                        ${parseMarkdownSafe(t.summary || '*Chưa có phần tóm tắt khái niệm...*', false)}
                    </div>
                </div>
                <!-- Mindmap & Infographic Overview (if available) -->
                ${t.mindmap && Array.isArray(t.mindmap.branches) && t.mindmap.branches.length > 0 ? `
                <div class="${cardCls} p-5 mb-4 border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-purple-50/60 shadow-2xs">
                    <div class="font-black text-xs md:text-sm uppercase tracking-wider text-indigo-950 mb-3.5 flex items-center justify-between pb-2 border-b border-indigo-100">
                        <span class="flex items-center gap-2">
                            <i class="fa-solid fa-sitemap text-indigo-600 text-sm"></i>
                            <span>Sơ Đồ Tư Duy & Bức Tranh Tổng Thể: ${t.mindmap.root || t.title || 'Toán Học'}</span>
                        </span>
                        <span class="text-[10px] bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs">Infographic</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        ${t.mindmap.branches.map(b => `
                            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 transition hover:shadow-xs" style="border-top: 3.5px solid ${b.color || '#3b82f6'}">
                                <div class="font-black text-xs flex items-center gap-1.5" style="color: ${b.color || '#1e293b'}">
                                    <i class="fa-solid ${b.icon || 'fa-circle-dot'} text-xs"></i>
                                    <span>${b.name || 'Nhánh kiến thức'}</span>
                                </div>
                                <ul class="text-[11px] text-slate-700 space-y-1 pl-1 font-medium leading-relaxed">
                                    ${(b.subBranches || []).map(sb => `<li class="flex items-start gap-1"><span class="text-indigo-400 font-bold">•</span><span class="prose-math">${parseMarkdownSafe(sb, false)}</span></li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}

            `;

            // 1. Sections with examples
            if (t.sections && t.sections.length > 0) {
                html += `
                <div class="mb-4 space-y-3">
                    <span class="font-black text-xs uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-book-bookmark text-teal-600"></i> Kiến thức trọng tâm & Ví dụ từng phần (${t.sections.length} mục):
                    </span>
                    ${t.sections.map((sec, i) => `
                        <div class="${cardCls} p-4 bg-white border border-teal-200 shadow-2xs space-y-2.5">
                            <div class="font-black text-xs md:text-sm text-teal-950 flex items-center gap-1.5">
                                <span class="w-5 h-5 rounded bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">${i+1}</span>
                                <span>${sec.title || `Mục ${i+1}`}</span>
                            </div>
                            <div class="prose-math text-xs text-slate-800 leading-relaxed font-medium bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                                ${parseMarkdownSafe(sec.content||'', false)}
                            </div>
                            ${sec.example ? `
                            <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                                <div class="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                                    <i class="fa-solid fa-lightbulb text-amber-500"></i> Ví dụ minh họa áp dụng ngay:
                                </div>
                                <div class="prose-math text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-indigo-100">
                                    ${parseMarkdownSafe(sec.example.question||'', false)}
                                </div>
                                <div class="prose-math text-xs text-indigo-950 bg-indigo-100/50 p-2.5 rounded-lg border border-indigo-200">
                                    ${parseMarkdownSafe(sec.example.solution||'', false)}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>`;
            }

            // 2. Formulas
            if (t.formulas && t.formulas.length > 0) {
                html += `
                <div class="mb-4">
                    <span class="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                        <i class="fa-solid fa-bolt text-amber-500"></i> Bảng công thức trọng tâm (${t.formulas.length} công thức):
                    </span>
                    <div class="space-y-2.5">
                        ${t.formulas.map((f) => `
                            <div class="${cardCls} p-3.5 bg-white border border-slate-200 text-slate-900 shadow-2xs font-bold text-center text-sm md:text-base math-scroll overflow-x-auto">
                                ${parseMarkdownSafe(f, false)}
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            // 3. Methods
            if (t.methods) {
                html += `
                <div class="mb-4 ${cardCls} p-5 bg-white border border-slate-200 shadow-2xs">
                    <span class="font-black text-xs uppercase tracking-wider ${themeAccentCls} flex items-center gap-1.5 mb-2">
                        <i class="fa-solid fa-list-check"></i> Phương pháp giải toán theo bước:
                    </span>
                    <div class="prose-math ${alignCls} ${fontCls} text-slate-800 leading-relaxed">
                        ${parseMarkdownSafe(t.methods, false)}
                    </div>
                </div>`;
            }

            // 4. Traps
            if (t.traps) {
                html += `
                <div class="mb-4 ${cardCls} p-5 bg-rose-50 border border-rose-200">
                    <span class="font-black text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
                        <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> Bẫy & Sai lầm cần tránh:
                    </span>
                    <div class="prose-math ${alignCls} ${fontCls} text-rose-950 leading-relaxed font-medium">
                        ${parseMarkdownSafe(t.traps, false)}
                    </div>
                </div>`;
            }

            // 5. Additional Examples by Type (if any)
            if (t.examples && t.examples.length > 0) {
                html += `
                <div class="mb-4 space-y-3">
                    <span class="font-black text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-lightbulb text-indigo-600"></i> Ví dụ minh họa phân dạng (${t.examples.length} ví dụ):
                    </span>
                    ${t.examples.map((ex, i) => `
                        <div class="${cardCls} p-4 bg-white border border-indigo-200 shadow-2xs space-y-2">
                            <div class="font-black text-xs text-indigo-950">${ex.typeName || `Ví dụ ${i+1}`}</div>
                            <div class="prose-math text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">${parseMarkdownSafe(ex.question||'', false)}</div>
                            <div class="prose-math text-xs text-indigo-950 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">${parseMarkdownSafe(ex.solution||'', false)}</div>
                        </div>
                    `).join('')}
                </div>`;
            }

            // 6. Real-world Applications with Show/Hide Solution
            if (t.applications && t.applications.length > 0) {
                html += `
                <div class="mb-4 space-y-3">
                    <span class="font-black text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-earth-americas text-emerald-600"></i> Áp dụng thực tế (${t.applications.length} bài toán):
                    </span>
                    ${t.applications.map((app, i) => `
                        <div class="${cardCls} p-4 bg-white border border-emerald-200 shadow-2xs space-y-2.5">
                            <div class="flex justify-between items-center">
                                <span class="font-black text-xs text-emerald-950">${app.title || `Bài toán thực tế ${i+1}`}</span>
                                <button id="theory-preview-app-btn-${i}" onclick="toggleTheoryPreviewSolution(${i})" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1 shadow-2xs">
                                    <i class="fa-solid fa-eye text-emerald-600"></i> Xem Lời Giải
                                </button>
                            </div>
                            <div class="prose-math text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">${parseMarkdownSafe(app.question||'', false)}</div>
                            <div id="theory-preview-app-sol-${i}" class="hidden prose-math text-xs text-emerald-950 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 mt-2">
                                ${parseMarkdownSafe(app.solution||'', false)}
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            }

            // 7. Part 4 Practice Exercises with Toggle Hint
            if (t.practiceExercises && t.practiceExercises.length > 0) {
                html += `
                <div class="mb-4 space-y-3">
                    <span class="font-black text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-graduation-cap text-amber-600"></i> Phần 4: Bài tập tự luyện (${t.practiceExercises.length} bài):
                    </span>
                    ${t.practiceExercises.map((pr, i) => `
                        <div class="${cardCls} p-4 bg-white border border-amber-300 shadow-2xs space-y-2.5">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-1.5">
                                    <span class="font-black text-xs text-amber-950">Bài tự luyện ${i+1}</span>
                                    <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200">${pr.level || 'Vận dụng'}</span>
                                </div>
                                <button id="theory-preview-practice-btn-${i}" onclick="toggleTheoryPreviewPracticeHint(${i})" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 text-[11px] font-bold rounded-lg border border-amber-300 transition flex items-center gap-1 shadow-2xs">
                                    <i class="fa-solid fa-lightbulb text-amber-600"></i> Xem Gợi Ý & Đáp Số
                                </button>
                            </div>
                            <div class="prose-math text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">${parseMarkdownSafe(pr.question||'', false)}</div>
                            <div id="theory-preview-practice-hint-${i}" class="hidden space-y-2 bg-amber-50/80 p-3 rounded-lg border border-amber-200 mt-2">
                                ${pr.shortAnswer ? `
                                <div class="text-xs font-black text-amber-950 flex items-center gap-1">
                                    <span>🎯 Đáp số:</span>
                                    <span class="prose-math">${parseMarkdownSafe(pr.shortAnswer, false)}</span>
                                </div>` : ''}
                                ${pr.hint ? `
                                <div class="prose-math text-xs text-slate-800 border-t border-amber-200 pt-1.5">
                                    ${parseMarkdownSafe(pr.hint, false)}
                                </div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            }

            container.innerHTML = html;
            triggerMathJax(container);
        }

        function generateTheoryAiPromptText() {
            let topic = document.getElementById('ai-theory-topic')?.value.trim() || 'Cực trị hàm số & Bài toán tối ưu Toán 12';
            let grade = document.getElementById('ai-theory-grade')?.value || '12';
            let extra = document.getElementById('ai-theory-extra')?.value.trim() || '';

            let rawTmpl3 = "Bạn là CHUYÊN GIA SƯ PHẠM TOÁN HỌC, TÁC GIẢ SÁCH GIÁO KHOA CHƯƠNG TRÌNH GDPT 2018 VÀ CHUYÊN GIA THIẾT KẾ INFOGRAPHIC GIÁO DỤC HÀNG ĐẦU.\n\nNHIỆM VỤ CỐT LÕI:\nHãy biên soạn một BỘ BÀI GIẢNG LÝ THUYẾT CHUYÊN SÂU KÈM SƠ ĐỒ TƯ DUY (MINDMAP) VÀ INFOGRAPHIC TÓM TẮT CHO CHỦ ĐỀ: \"{{TOPIC}}\" (MÔN TOÁN LỚP {{GRADE}}).\n\nYÊU CẦU ĐẶC BIỆT VỀ MẶT SƯ PHẠM VÀ TRỰC QUAN HÓA:\n1. BẢN CHẤT TOÁN HỌC & ĐỘ CHÍNH XÁC TUYỆT ĐỐI (MATHEMATICAL RIGOR):\n   - Mọi định lý, công thức, điều kiện xác định phải chuẩn mực 100% theo Chương trình GDPT 2018 (sách Kết nối tri thức, Chân trời sáng tạo, Cánh diều).\n   - Giải thích rõ bản chất hình học / đại số, tránh liệt kê công thức khô khan.\n   - Mọi công thức LaTeX PHẢI escape dấu gạch chéo ngược kép trong JSON (ví dụ: \\\\\\\\frac{a}{b}, \\\\\\\\sqrt{x}, \\\\\\\\vec{u}, \\\\\\\\int_{a}^{b} f(x)\\\\,dx).\n\n2. ★ BẮT BUỘC VẼ BẢNG, BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHÔNG GIAN (VISUAL GRAPHICS):\n   - Nếu bài học về Hàm số (Cực trị, Đơn điệu, Tiệm cận, Khảo sát hàm số): BẮT BUỘC trong phần lý thuyết hoặc ví dụ minh họa phải có BẢNG BIẾN THIÊN dạng LaTeX array MathJax:\n     $$\\\\begin{array}{c|ccccc} x & -\\\\infty & & x_0 & & +\\\\infty \\\\\\\\ \\\\hline y' & & + & 0 & - & \\\\\\\\ \\\\hline y & & & y_{CĐ} & & \\\\\\\\ & & \\\\nearrow & & \\\\searrow & \\\\\\\\ & -\\\\infty & & & & -\\\\infty \\\\end{array}$$\n     và ĐỒ THỊ MINH HỌA dạng vector SVG (<svg viewBox=\"0 0 360 240\" ...>...</svg>).\n   - Nếu bài học về Hình học (Khối đa diện, Chóp, Lăng trụ, Tròn xoay, Oxyz): BẮT BUỘC có HÌNH VẼ SVG 3D (<svg ...>...</svg>) với cạnh thấy nét liền, cạnh khuất nét đứt rõ ràng.\n   - Nếu bài học về Thống kê / Xác suất: BẮT BUỘC có BẢNG SỐ LIỆU GHÉP NHÓM HTML table có đường viền gọn đẹp.\n\n3. SƠ ĐỒ TƯ DUY PHÂN NHÁNH (MINDMAP ARCHITECTURE):\n   - Cung cấp cấu trúc \"mindmap\" trực quan để học sinh nhìn là hiểu ngay bức tranh toàn cảnh:\n     + \"root\": Chủ đề trung tâm\n     + \"branches\": 3 - 5 nhánh chính phân chia mạch kiến thức (Khái niệm ➔ Tính chất & Bảng biến thiên ➔ Công thức ➔ Bẫy sai lầm ➔ Ứng dụng).\n     + Mỗi nhánh có \"color\", \"icon\" và \"subBranches\" (các ý rút gọn, công thức then chốt).\n\nCẤU TRÚC JSON ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI JSON HỢP LỆ):\n```json\n{\n  \"theory\": {\n    \"title\": \"{{TOPIC}}\",\n    \"summary\": \"Tóm tắt ngắn gọn khái niệm cốt lõi và bức tranh tổng quan bài học (2-3 câu súc tích).\",\n    \"mindmap\": {\n      \"root\": \"{{TOPIC}}\",\n      \"branches\": [\n        {\n          \"name\": \"1. Khái Niệm & Định Lý\",\n          \"color\": \"#3b82f6\",\n          \"icon\": \"fa-book-open\",\n          \"subBranches\": [\n            \"Định nghĩa chuẩn xác...\",\n            \"Điều kiện cần và đủ...\"\n          ]\n        },\n        {\n          \"name\": \"2. Bảng Biến Thiên & Đồ Thị\",\n          \"color\": \"#10b981\",\n          \"icon\": \"fa-chart-line\",\n          \"subBranches\": [\n            \"Quy tắc xét dấu đạo hàm...\",\n            \"Dạng đồ thị chuẩn...\"\n          ]\n        },\n        {\n          \"name\": \"3. Công Thức & Kỹ Thuật Giải Nhanh\",\n          \"color\": \"#f59e0b\",\n          \"icon\": \"fa-bolt\",\n          \"subBranches\": [\n            \"Công thức tính nhanh...\",\n            \"Kỹ thuật Casio hỗ trợ...\"\n          ]\n        },\n        {\n          \"name\": \"4. Bẫy Phòng Thi & Sai Lầm\",\n          \"color\": \"#ef4444\",\n          \"icon\": \"fa-triangle-exclamation\",\n          \"subBranches\": [\n            \"Quên điều kiện xác định...\",\n            \"Nhầm lẫn điểm cực trị với giá trị cực trị...\"\n          ]\n        }\n      ]\n    },\n    \"sections\": [\n      {\n        \"id\": 1,\n        \"title\": \"1. Khái niệm & Định lý then chốt\",\n        \"content\": \"Giải thích chi tiết bản chất lý thuyết, có công thức LaTeX $...$ và bảng biến thiên hoặc đồ thị minh họa trực quan nếu bài học cần.\",\n        \"example\": {\n          \"question\": \"Ví dụ áp dụng ngay cho mục 1...\",\n          \"solution\": \"**Lời giải chi tiết:**\\\\nBước 1: ...\\\\nBước 2: ...\"\n        }\n      }\n    ],\n    \"formulas\": [\n      \"$$\\\\\\\\int x^n dx = \\\\\\\\frac{x^{n+1}}{n+1} + C \\\\quad (n \\\\\\\\neq -1)$$\",\n      \"$$\\\\\\\\vec{u} \\\\\\\\cdot \\\\\\\\vec{v} = |\\\\\\\\vec{u}| |\\\\\\\\vec{v}| \\\\\\\\cos(\\\\\\\\vec{u}, \\\\\\\\vec{v})$$\"\n    ],\n    \"methods\": \"**Bước 1:** Nhận dạng dạng toán...\\\\n**Bước 2:** Thiết lập công thức biến đổi...\\\\n**Bước 3:** Kiểm tra điều kiện và kết luận.\",\n    \"traps\": \"Lưu ý điều kiện xác định, dấu bằng xảy ra, các trường hợp mẫu bằng 0 hoặc nghiệm bội chẵn...\",\n    \"applications\": [\n      {\n        \"title\": \"Bài toán thực tế: Mô hình tối ưu hóa...\",\n        \"question\": \"Đề bài ứng dụng thực tiễn đời sống...\",\n        \"solution\": \"**Lời giải & Mô hình:**\\\\n1. Gọi ẩn và đặt điều kiện...\\\\n2. Thiết lập hàm số...\\\\n3. Khảo sát và kết luận.\"\n      }\n    ],\n    \"practiceExercises\": [\n      {\n        \"id\": 1,\n        \"level\": \"Thông hiểu\",\n        \"question\": \"Đề bài câu hỏi tự luyện 1...\",\n        \"shortAnswer\": \"Đáp số: $x = 2$\",\n        \"hint\": \"**Phương pháp giải:** Áp dụng định nghĩa...\"\n      },\n      {\n        \"id\": 2,\n        \"level\": \"Vận dụng\",\n        \"question\": \"Đề bài câu hỏi tự luyện 2...\",\n        \"shortAnswer\": \"Đáp số: $m \\\\\\\\in (1; 3)$\",\n        \"hint\": \"**Phương pháp giải:** Lập bảng biến thiên...\"\n      }\n    ]\n  },\n  \"lectures\": [\n    {\n      \"id\": 1,\n      \"title\": \"1. Khái Niệm & Ví Dụ Áp Dụng\",\n      \"content\": \"Trình bày lý thuyết trọng tâm...\",\n      \"teacherNote\": \"Hướng dẫn học sinh quan sát đồ thị và bảng biến thiên...\",\n      \"steps\": [\"Bước 1: Giới thiệu định nghĩa...\", \"Bước 2: Thực hiện ví dụ minh họa...\"]\n    },\n    {\n      \"id\": 2,\n      \"title\": \"2. Bảng Công Thức & Sơ Đồ Thuật Toán\",\n      \"content\": \"Hệ thống công thức then chốt...\",\n      \"teacherNote\": \"Nhắc học sinh ghi chép công thức đóng khung và cảnh báo bẫy sai lầm.\",\n      \"steps\": [\"Phân tích thuật toán giải...\", \"Cảnh báo bẫy phòng thi...\"]\n    },\n    {\n      \"id\": 3,\n      \"title\": \"3. Bài Tập Tự Luyện & Vận Dụng Thực Tế\",\n      \"content\": \"Học sinh tự giải bài tập tự luyện và bài toán thực tế...\",\n      \"teacherNote\": \"Cho học sinh thời gian suy nghĩ trước khi mở gợi ý và đáp số.\",\n      \"steps\": [\"Giao bài tự luyện...\", \"Mở đáp số và phân tích phương pháp...\"]\n    }\n  ]\n}\n```\n";

            let prompt = rawTmpl3
                .replace(/\{\{GRADE\}\}/g, grade)
                .replace(/\{\{TOPIC\}\}/g, topic);

            if (extra) {
                prompt += `\n══════════════════════════════════════════════════════════════════════════════\nYÊU CẦU BỔ SUNG TỪ GIÁO VIÊN:\n══════════════════════════════════════════════════════════════════════════════\n${extra}\n`;
            }

            let resEl = document.getElementById('ai-theory-prompt-result');
            if (resEl) {
                resEl.value = prompt;
            }
            return prompt;
        }

        function parseAndRepairTheoryJson(rawInput) {
            if (!rawInput || !String(rawInput).trim()) {
                throw new Error("Dữ liệu trống, vui lòng nhập hoặc dán nội dung.");
            }
            let text = String(rawInput).trim();

            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
            let match = codeBlockRegex.exec(text);
            if (match && match[1]) {
                text = match[1].trim();
            } else {
                let firstBrace = text.indexOf('{');
                let lastBrace = text.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    text = text.substring(firstBrace, lastBrace + 1);
                }
            }

            const cleanTrailingCommas = (s) => s.replace(/,\s*([\]}])/g, '$1');

            // Attempt 1: Direct JSON.parse
            try {
                let obj = JSON.parse(cleanTrailingCommas(text));
                if (obj && typeof obj === 'object') return obj;
            } catch (e1) {}

            // Attempt 2: Fix unescaped LaTeX backslashes
            try {
                let repaired = text.replace(/\\(?:([^"\\/bfnrtu])|u(?![0-9a-fA-F]{4}))/g, (m, p1) => {
                    return p1 ? '\\\\' + p1 : '\\\\';
                });
                repaired = cleanTrailingCommas(repaired);
                let obj = JSON.parse(repaired);
                if (obj && typeof obj === 'object') return obj;
            } catch (e2) {}

            // Attempt 3: Aggressive string literal repair
            try {
                let fixedQuotes = text.replace(/"((?:\\.|[^"\\])*)"/g, (m, content) => {
                    let fixedContent = content
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/\t/g, '\\t');
                    fixedContent = fixedContent.replace(/\\(?:([^"\\/bfnrtu])|u(?![0-9a-fA-F]{4}))/g, '\\\\$1');
                    return '"' + fixedContent + '"';
                });
                fixedQuotes = cleanTrailingCommas(fixedQuotes);
                let obj = JSON.parse(fixedQuotes);
                if (obj && typeof obj === 'object') return obj;
            } catch (e3) {}

            throw new Error("Không thể phân tích dữ liệu JSON. Vui lòng kiểm tra lại nội dung đã dán!");
        }

        function applyImportedTheoryData(rawInput) {
            if (!rawInput || !String(rawInput).trim()) {
                showToast("Vui lòng dán nội dung kết quả từ AI vào ô trước khi nạp!", true);
                return;
            }

            try {
                let parsed = parseAndRepairTheoryJson(rawInput);
                let newTheory = parsed.theory || (parsed.formulas || parsed.summary || parsed.sections ? parsed : null);
                let newLectures = parsed.lectures || (Array.isArray(parsed) ? parsed : null);

                if (!newTheory && !newLectures) {
                    throw new Error("Không tìm thấy cấu trúc 'theory' hoặc 'lectures' trong dữ liệu đã dán!");
                }

                if (newTheory) {
                    if (!adminState.data.theory) adminState.data.theory = {};
                    let curStyle = (adminState.data.theory && adminState.data.theory.style) ? adminState.data.theory.style : { align: 'left', fontSize: 'base', theme: 'teal', cardStyle: 'modern' };
                    
                    adminState.data.theory = {
                        title: String(newTheory.title || "Tóm tắt Lý thuyết & Công thức trọng tâm"),
                        summary: String(newTheory.summary || ""),
                        sections: Array.isArray(newTheory.sections) ? newTheory.sections.map((sec, sIdx) => ({
                            id: sec.id || sIdx + 1,
                            title: String(sec.title || `Mục ${sIdx + 1}`),
                            content: String(sec.content || ""),
                            example: sec.example ? {
                                question: String(sec.example.question || ""),
                                solution: String(sec.example.solution || "")
                            } : null
                        })) : [],
                        formulas: Array.isArray(newTheory.formulas) ? newTheory.formulas.map(String) : [],
                        methods: String(newTheory.methods || ""),
                        traps: String(newTheory.traps || ""),
                        examples: Array.isArray(newTheory.examples) ? newTheory.examples : [],
                        applications: Array.isArray(newTheory.applications) ? newTheory.applications : [],
                        practiceExercises: Array.isArray(newTheory.practiceExercises) ? newTheory.practiceExercises.map((pr, pIdx) => ({
                            id: pr.id || pIdx + 1,
                            level: String(pr.level || "Vận dụng"),
                            question: String(pr.question || ""),
                            shortAnswer: String(pr.shortAnswer || pr.answer || ""),
                            hint: String(pr.hint || pr.solution || pr.explanation || "")
                        })) : [],
                        style: curStyle
                    };
                }

                if (newLectures && Array.isArray(newLectures)) {
                    adminState.data.lectures = newLectures.map((l, idx) => ({
                        id: Number(l.id || idx + 1),
                        title: String(l.title || `Slide ${idx + 1}`),
                        content: String(l.content || ""),
                        teacherNote: String(l.teacherNote || l.note || ""),
                        steps: Array.isArray(l.steps) ? l.steps.map(String) : (typeof l.steps === 'string' ? l.steps.split('\n').filter(Boolean) : [])
                    }));
                }

                GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
                saveTheoryToGoogleDrive(true);

                showToast("🎉 Nạp dữ liệu Sổ tay Chuyên Sâu 4 Phần & Slide từ AI thành công!");
                activeTheorySubTab = 'theory';
                renderTheoryStudio(document.getElementById('admin-content-area'));
            } catch (err) {
                console.error("Lỗi nạp dữ liệu AI:", err);
                showToast("❌ Lỗi định dạng: " + (err.message || "Vui lòng kiểm tra lại nội dung dán."), true);
            }
        }

        async function generateTheoryWithGeminiApi() {
            let topic = document.getElementById('ai-theory-topic')?.value.trim() || 'Cực trị hàm số & Bài toán thực tế Toán 12';
            let grade = document.getElementById('ai-theory-grade')?.value || '12';
            let extra = document.getElementById('ai-theory-extra')?.value.trim() || '';

            let apiKey = getGeminiApiKey();
            if (!apiKey) {
                showToast("⚠️ Vui lòng nhập Gemini API Key hoặc dùng tính năng 'Tạo Prompt' miễn phí!", true);
                return;
            }

            let btn = document.getElementById('btn-generate-theory-api');
            let origText = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-amber-300 mr-1"></i> AI Đang Soạn 3 Phần...';
            }

            generateTheoryAiPromptText();
            let prompt = document.getElementById('ai-theory-prompt-result')?.value || '';

            try {
                let data = await callGeminiApiEndpoint({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                }, apiKey);

                let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!generatedText) throw new Error("AI không trả về kết quả.");

                let pasteArea = document.getElementById('ai-theory-paste-input');
                if (pasteArea) pasteArea.value = generatedText;

                applyImportedTheoryData(generatedText);
            } catch (err) {
                console.error("Lỗi gọi Gemini API:", err);
                showToast("❌ " + err.message, true);
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = origText;
                }
            }
        }

        // ======================= SUPABASE CLOUD & GOOGLE DRIVE STORAGE =======================
        let _cachedSupabaseTheoryList = [];

        function openGoogleDriveTheoryFolder() {
            const url = typeof GOOGLE_DRIVE_THEORY_FOLDER_URL !== 'undefined' 
                ? GOOGLE_DRIVE_THEORY_FOLDER_URL 
                : "https://drive.google.com/drive/folders/1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ?lfhs=2";
            window.open(url, '_blank');
        }

        async function loadSupabaseTheoryTable() {
            const container = document.getElementById('supabase-theory-table-container');
            if (!container) return;
            container.innerHTML = `
                <div class="flex items-center justify-center py-10 text-teal-700 font-bold text-xs gap-2">
                    <i class="fa-solid fa-spinner fa-spin text-lg"></i> Đang tải dữ liệu từ Supabase Cloud...
                </div>`;
            try {
                if (typeof SupabaseTheoryService === 'undefined') {
                    throw new Error("SupabaseTheoryService chưa được khởi tạo!");
                }
                const list = await SupabaseTheoryService.getAll();
                _cachedSupabaseTheoryList = Array.isArray(list) ? list : [];
                renderSupabaseTheoryTableRows(_cachedSupabaseTheoryList);
            } catch(e) {
                console.warn("Supabase fetch error:", e);
                container.innerHTML = `
                    <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-2">
                        <div class="font-black flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Chưa thể tải dữ liệu từ Supabase</div>
                        <p>Nguyên nhân có thể do chưa tạo bảng <code>theory_archives</code> trên Supabase Dashboard hoặc chưa mở RLS: <em>${e.message || e}</em></p>
                        <div class="pt-1 flex gap-2">
                            <button onclick="loadSupabaseTheoryTable()" class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px]"><i class="fa-solid fa-rotate mr-1"></i> Thử lại</button>
                        </div>
                    </div>`;
            }
        }

        let currentSupabaseTheoryFolderFilter = 'ALL';
        let currentSupabaseTheorySearchQuery = '';

        function filterSupabaseTheoryByFolder(folder) {
            currentSupabaseTheoryFolderFilter = folder || 'ALL';
            applySupabaseTheoryFilters();
        }

        function filterSupabaseTheoryTable(query) {
            currentSupabaseTheorySearchQuery = (query || '').trim().toLowerCase();
            applySupabaseTheoryFilters();
        }

        function applySupabaseTheoryFilters() {
            if (!_cachedSupabaseTheoryList) return;
            const q = currentSupabaseTheorySearchQuery;
            const f = currentSupabaseTheoryFolderFilter;
            const filtered = _cachedSupabaseTheoryList.filter(item => {
                let itemFolder = normalizeMathFolder(item.folder || item.folder_id || (item.theory && item.theory.folder) || (item.topic ? getMathFolderFromGrade(item.topic) : 'KHAC'));
                if (f !== 'ALL' && itemFolder !== f) return false;
                if (!q) return true;
                const topic = (item.topic || '').toLowerCase();
                const id = (item.id || '').toLowerCase();
                const date = (item.date_formatted || '').toLowerCase();
                return topic.includes(q) || id.includes(q) || date.includes(q) || itemFolder.toLowerCase().includes(q);
            });
            renderSupabaseTheoryTableRows(filtered);
        }

        function renderSupabaseTheoryTableRows(list) {
            const container = document.getElementById('supabase-theory-table-container');
            if (!container) return;
            if (!list || list.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-10 text-slate-400 text-xs italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        Chưa có bản lưu lý thuyết nào phù hợp trên Supabase Cloud.
                    </div>`;
                return;
            }

            const rowsHtml = list.map((item, idx) => {
                const fCount = (item.theory && item.theory.formulas) ? item.theory.formulas.length : 0;
                const lCount = Array.isArray(item.lectures) ? item.lectures.length : 0;
                const safeId = String(item.id).replace(/'/g, "\\'");
                const dateStr = item.date_formatted || (item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : '-');
                const folderName = normalizeMathFolder(item.folder || item.folder_id || (item.theory && item.theory.folder) || (item.topic ? getMathFolderFromGrade(item.topic) : 'KHAC'));
                const badgeCls = getMathFolderBadgeClass(folderName);
                return `
                    <tr class="border-b border-slate-100 hover:bg-emerald-50/40 transition text-xs">
                        <td class="p-3 text-slate-500 font-mono font-bold">${idx + 1}</td>
                        <td class="p-3">
                            <div class="font-black text-slate-800 text-xs">${item.topic || 'Không có tiêu đề'}</div>
                            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${item.id}</div>
                        </td>
                        <td class="p-3 text-center">
                            <span class="px-2.5 py-0.5 rounded-lg ${badgeCls} font-black text-[10px] border shadow-2xs">${folderName}</span>
                        </td>
                        <td class="p-3 text-slate-500 font-medium">${dateStr}</td>
                        <td class="p-3 text-center"><span class="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-black">${fCount} CT</span></td>
                        <td class="p-3 text-center"><span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black">${lCount} Slide</span></td>
                        <td class="p-3 text-right">
                            <div class="flex items-center justify-end gap-1.5 flex-wrap">
                                <button onclick="loadTheoryFromSupabase('${safeId}')" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition btn-3d shadow-xs text-[11px] flex items-center gap-1" title="Tải vào soạn thảo">
                                    <i class="fa-solid fa-file-import"></i> Nạp Lại
                                </button>
                                <button onclick="updateTheoryOnSupabase('${safeId}')" class="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition btn-3d shadow-xs text-[11px] flex items-center gap-1" title="Ghi đè bản đang soạn lên mã này">
                                    <i class="fa-solid fa-floppy-disk"></i> Ghi Đè
                                </button>
                                <button onclick="downloadSupabaseTheoryJson('${safeId}')" class="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-[11px]" title="Tải JSON">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button onclick="deleteTheoryFromSupabase('${safeId}')" class="px-2 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold rounded-xl transition text-[11px]" title="Xóa khỏi Supabase">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
            }).join('');

            container.innerHTML = `
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-100 text-slate-700 text-xs uppercase font-black border-b border-slate-200">
                            <th class="p-3 w-12">#</th>
                            <th class="p-3">Chủ Đề & ID Supabase</th>
                            <th class="p-3 text-center">Thư Mục</th>
                            <th class="p-3">Thời Gian Lưu</th>
                            <th class="p-3 text-center">Công Thức</th>
                            <th class="p-3 text-center">Slide</th>
                            <th class="p-3 text-right">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>${rowsHtml}</tbody>
                </table>`;
        }

        async function loadTheoryFromSupabase(id) {
            let item = _cachedSupabaseTheoryList.find(x => String(x.id) === String(id));
            if (!item && typeof SupabaseTheoryService !== 'undefined') {
                try {
                    item = await SupabaseTheoryService.getById(id);
                } catch(e) {}
            }
            if (!item) return showToast("Không tìm thấy bản ghi trên Supabase!", true);

            showConfirmModal("Nạp Lại Từ Supabase", `Khôi phục Sổ tay & Bài giảng: "${item.topic || 'Bản lưu'}" vào giao diện soạn thảo?`, () => {
                if (item.theory) {
                    adminState.data.theory = JSON.parse(JSON.stringify(item.theory));
                    adminState.data.theory.folder = item.folder || item.theory.folder || 'KHAC';
                }
                if (item.lectures) adminState.data.lectures = JSON.parse(JSON.stringify(item.lectures));
                if (item.lectures_style) adminState.data.lecturesStyle = JSON.parse(JSON.stringify(item.lectures_style));
                else if (item.lecturesStyle) adminState.data.lecturesStyle = JSON.parse(JSON.stringify(item.lecturesStyle));
                
                let curG = item.grade || (item.theory && item.theory.grade) || (item.folder ? item.folder.replace(/[^0-9]/g, '') : '12');
                if (!adminState.meta) adminState.meta = {};
                adminState.meta.grade = curG;

                GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
                showToast("Đã nạp bài giảng từ Supabase Cloud thành công!");
                activeTheorySubTab = 'theory';
                renderTheoryStudio(document.getElementById('admin-content-area'));
            });
        }

        async function updateTheoryOnSupabase(id) {
            saveTheoryInputsLive();
            let theoryData = adminState.data.theory || {};
            let lecturesData = adminState.data.lectures || [];
            let lecturesStyle = adminState.data.lecturesStyle || {};

            let curTheoryGrade = document.getElementById('ai-theory-grade')?.value || (adminState?.meta?.grade || '12');
            let curTheoryFolder = document.getElementById('ai-theory-folder')?.value || getMathFolderFromGrade(curTheoryGrade);
            curTheoryFolder = normalizeMathFolder(curTheoryFolder);

            theoryData.folder = curTheoryFolder;
            theoryData.grade = curTheoryGrade;

            let record = {
                id: id,
                topic: theoryData.title || "Lý thuyết & Bài giảng Toán TBS",
                folder: curTheoryFolder,
                folderId: curTheoryFolder,
                grade: curTheoryGrade,
                timestamp: new Date().toISOString(),
                dateFormatted: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
                theory: theoryData,
                lectures: lecturesData,
                lecturesStyle: lecturesStyle
            };

            showConfirmModal("Ghi Đè Cập Nhật Supabase", `Bạn có chắc muốn ghi đè nội dung đang soạn lên bản ghi "${record.topic}" trên Supabase?`, async () => {
                try {
                    if (typeof SupabaseTheoryService !== 'undefined') {
                        await SupabaseTheoryService.save(record);
                        showToast("Đã cập nhật đè lên Supabase Cloud thành công!");
                        loadSupabaseTheoryTable();
                    }
                } catch(e) {
                    showToast("Lỗi cập nhật: " + (e.message || e), true);
                }
            });
        }

        async function deleteTheoryFromSupabase(id) {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa tài liệu Supabase Cloud!", true);
            }
            let item = _cachedSupabaseTheoryList.find(x => String(x.id) === String(id));
            let topic = item ? item.topic : id;
            showConfirmModal("Xóa Khỏi Supabase", `Bạn có chắc chắn muốn xóa bản ghi "${topic}" khỏi Supabase Cloud?`, async () => {
                try {
                    if (typeof SupabaseTheoryService !== 'undefined') {
                        await SupabaseTheoryService.delete(id);
                        showToast("Đã xóa bản ghi khỏi Supabase Cloud!");
                        loadSupabaseTheoryTable();
                    }
                } catch(e) {
                    showToast("Lỗi xóa: " + (e.message || e), true);
                }
            });
        }

        function downloadSupabaseTheoryJson(id) {
            let item = _cachedSupabaseTheoryList.find(x => String(x.id) === String(id));
            if (!item) return;
            let filename = (item.topic || 'LyThuyet_BaiGiang').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_') + '_Supabase.json';
            let blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            showToast("Đã xuất file JSON từ Supabase!");
        }

        async function saveTheoryToGoogleDrive(silent = false) {
            saveTheoryInputsLive();
            let theoryData = adminState.data.theory || {};
            let lecturesData = adminState.data.lectures || [];
            let lecturesStyle = adminState.data.lecturesStyle || {};

            let curTheoryGrade = document.getElementById('ai-theory-grade')?.value || (adminState?.meta?.grade || '12');
            let curTheoryFolder = document.getElementById('ai-theory-folder')?.value || getMathFolderFromGrade(curTheoryGrade);
            curTheoryFolder = normalizeMathFolder(curTheoryFolder);

            theoryData.folder = curTheoryFolder;
            theoryData.grade = curTheoryGrade;

            let record = {
                id: "theory_" + Date.now(),
                topic: theoryData.title || "Lý thuyết & Bài giảng Toán TBS",
                folder: curTheoryFolder,
                folderId: curTheoryFolder,
                grade: curTheoryGrade,
                folderUrl: typeof GOOGLE_DRIVE_THEORY_FOLDER_URL !== 'undefined' ? GOOGLE_DRIVE_THEORY_FOLDER_URL : "https://drive.google.com/drive/folders/1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ?lfhs=2",
                timestamp: new Date().toISOString(),
                dateFormatted: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
                theory: theoryData,
                lectures: lecturesData,
                lecturesStyle: lecturesStyle
            };

            // 1. Save to Supabase Cloud Database (Primary Storage for Theory & Lectures)
            let supabaseOk = false;
            try {
                if (typeof SupabaseTheoryService !== 'undefined') {
                    await SupabaseTheoryService.save(record);
                    supabaseOk = true;
                }
            } catch(e) {
                console.warn("Supabase save warning:", e);
            }

            // 2. Save to local storage history
            try {
                let history = JSON.parse(localStorage.getItem('math_theory_drive_history') || '[]');
                history.unshift(record);
                if (history.length > 50) history = history.slice(0, 50);
                localStorage.setItem('math_theory_drive_history', JSON.stringify(history));
            } catch(e) {
                console.warn("Lỗi lưu local history:", e);
            }

            // 3. Dispatch to Google Apps Script / Google Drive endpoint if available
            try {
                if (typeof GOOGLE_WEB_APP_URL !== 'undefined') {
                    let payload = {
                        action: "saveTheory",
                        folderId: record.folderId,
                        topic: record.topic,
                        data: {
                            theory: theoryData,
                            lectures: lecturesData,
                            lecturesStyle: lecturesStyle
                        },
                        timestamp: record.timestamp,
                        date: record.dateFormatted
                    };
                    fetch(GOOGLE_WEB_APP_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(payload)
                    }).catch(e => console.warn("Google Apps Script dispatch:", e));
                }
            } catch(e) {}

            // 4. Save to Firebase Firestore as secondary backup if connected
            try {
                if (typeof db !== 'undefined' && db) {
                    await db.collection("TheoryArchives").doc(record.id).set(record);
                }
            } catch(e) {}

            if (!silent) {
                if (supabaseOk) {
                    showToast("☁️ Đã lưu trữ Sổ tay & Bài giảng lên Supabase Cloud thành công!");
                } else {
                    showToast("☁️ Đã lưu trữ Sổ tay & Bài giảng lên Cloud & Drive thành công!");
                }
                if (activeTheorySubTab === 'drive') {
                    renderTheoryStudio(document.getElementById('admin-content-area'));
                }
            }
        }

        function downloadTheoryDriveJson(historyIdx = null) {
            let dataToExport;
            if (historyIdx !== null) {
                let history = JSON.parse(localStorage.getItem('math_theory_drive_history') || '[]');
                dataToExport = history[historyIdx];
            } else {
                saveTheoryInputsLive();
                dataToExport = {
                    topic: adminState.data.theory?.title || "LyThuyet_BaiGiang",
                    folderId: typeof GOOGLE_DRIVE_THEORY_FOLDER_ID !== 'undefined' ? GOOGLE_DRIVE_THEORY_FOLDER_ID : "1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ",
                    timestamp: new Date().toISOString(),
                    theory: adminState.data.theory || {},
                    lectures: adminState.data.lectures || [],
                    lecturesStyle: adminState.data.lecturesStyle || {}
                };
            }

            if (!dataToExport) return;
            let filename = (dataToExport.topic || 'LyThuyet_BaiGiang').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_') + '_GoogleDrive.json';
            let blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            showToast("Đã xuất file JSON chuẩn Google Drive!");
        }

        function downloadTheoryDriveMarkdown() {
            saveTheoryInputsLive();
            let t = adminState.data.theory || {};
            let lectures = adminState.data.lectures || [];

            let md = `# 📘 ${t.title || 'SỔ TAY LÝ THUYẾT & BÀI GIẢNG TOÁN HỌC'}\n\n`;
            md += `> **Lưu trữ Google Drive Folder:** 1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ\n`;
            md += `> **Thời gian tạo:** ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}\n\n`;
            md += `---\n\n`;
            md += `## I. TÓM TẮT KHÁI NIỆM & ĐỊNH LÝ TRỌNG TÂM\n\n${t.summary || ''}\n\n`;
            
            if (t.formulas && t.formulas.length > 0) {
                md += `## II. BẢNG CÔNG THỨC BỎ TÚI CỐT LÕI\n\n`;
                t.formulas.forEach((f, i) => {
                    md += `${i + 1}. ${f}\n\n`;
                });
            }

            if (t.methods) {
                md += `## III. PHƯƠNG PHÁP GIẢI TOÁN THEO BƯỚC\n\n${t.methods}\n\n`;
            }

            if (t.traps) {
                md += `## IV. BẪY SAI LẦM & LƯU Ý KHI LÀM BÀI\n\n⚠️ ${t.traps}\n\n`;
            }

            if (lectures.length > 0) {
                md += `---\n\n# 🖥️ HỆ THỐNG SLIDE BÀI GIẢNG TƯƠNG TÁC (${lectures.length} Slide)\n\n`;
                lectures.forEach((l, i) => {
                    md += `### Slide ${i + 1}: ${l.title}\n\n`;
                    md += `${l.content}\n\n`;
                    if (l.steps && l.steps.length > 0) {
                        md += `**Các bước phân giải suy luận:**\n`;
                        l.steps.forEach((st, sIdx) => {
                            md += `- **Bước ${sIdx + 1}:** ${st}\n`;
                        });
                        md += `\n`;
                    }
                    if (l.teacherNote) {
                        md += `*💡 Ghi chú sư phạm: ${l.teacherNote}*\n\n`;
                    }
                    md += `---\n\n`;
                });
            }

            let filename = (t.title || 'LyThuyet_BaiGiang').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_') + '_TaiLieu.md';
            let blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            showToast("Đã xuất file Markdown tài liệu bài giảng!");
        }

        function restoreTheoryFromDriveHistory(idx) {
            let history = JSON.parse(localStorage.getItem('math_theory_drive_history') || '[]');
            let item = history[idx];
            if (!item) return;

            showConfirmModal("Nạp Lại Bản Lưu Drive", `Khôi phục Sổ tay & Bài giảng: "${item.topic || 'Bản lưu'}" vào giao diện soạn thảo?`, () => {
                if (item.theory) adminState.data.theory = JSON.parse(JSON.stringify(item.theory));
                if (item.lectures) adminState.data.lectures = JSON.parse(JSON.stringify(item.lectures));
                if (item.lecturesStyle) adminState.data.lecturesStyle = JSON.parse(JSON.stringify(item.lecturesStyle));
                
                GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
                showToast("Đã khôi phục dữ liệu từ bản lưu Google Drive!");
                activeTheorySubTab = 'theory';
                renderTheoryStudio(document.getElementById('admin-content-area'));
            });
        }

        function deleteTheoryFromDriveHistory(idx) {
            let history = JSON.parse(localStorage.getItem('math_theory_drive_history') || '[]');
            history.splice(idx, 1);
            localStorage.setItem('math_theory_drive_history', JSON.stringify(history));
            showToast("Đã xóa bản lưu khỏi lịch sử.");
            renderTheoryStudio(document.getElementById('admin-content-area'));
        }

        function clearTheoryDriveHistory() {
            showConfirmModal("Xóa Lịch Sử Lưu Trữ", "Bạn có chắc chắn muốn xóa toàn bộ lịch sử lưu trữ Sổ tay trên máy?", () => {
                localStorage.removeItem('math_theory_drive_history');
                showToast("Đã xóa sạch lịch sử lưu trữ!");
                renderTheoryStudio(document.getElementById('admin-content-area'));
            });
        }

        function importTheoryFromDriveJsonFile(event) {
            let file = event.target.files?.[0];
            if (!file) return;

            let reader = new FileReader();
            reader.onload = function(e) {
                try {
                    let content = e.target.result;
                    applyImportedTheoryData(content);
                } catch(err) {
                    showToast("Lỗi đọc file JSON: " + err.message, true);
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        function addNewLectureSlide() {
            if (!adminState.data.lectures) adminState.data.lectures = [];
            let newId = adminState.data.lectures.length + 1;
            adminState.data.lectures.push({
                id: newId,
                title: `Đơn vị kiến thức ${newId}: Nội dung mới`,
                content: "### 📌 Tiêu đề nội dung\nNhập diễn giải lý thuyết hoặc công thức toán học $...$ tại đây.",
                teacherNote: "Ghi chú dành riêng cho giáo viên khi trình chiếu.",
                steps: [
                    "Bước 1: Thiết lập phương trình hoặc giả thiết.",
                    "Bước 2: Biến đổi và áp dụng công thức."
                ]
            });
            renderTheoryStudio(document.getElementById('admin-content-area'));
            showToast("Đã thêm slide bài giảng mới!");
        }

        function deleteLectureSlide(idx) {
            if (adminState.data.lectures && adminState.data.lectures[idx]) {
                adminState.data.lectures.splice(idx, 1);
                adminState.data.lectures.forEach((l, i) => l.id = i + 1);
                renderTheoryStudio(document.getElementById('admin-content-area'));
                showToast("Đã xóa slide!");
            }
        }

        function editLectureSlideModal(idx) {
            let l = adminState.data.lectures[idx];
            if (!l) return;
            let stepsStr = (l.steps || []).join('\n');
            
            let modalHtml = `
            <div id="lecture-edit-modal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[10002] flex items-center justify-center p-3 md:p-6 animate-fade-in text-slate-800">
                <div class="bg-white p-6 rounded-3xl w-full max-w-5xl relative shadow-2xl zoom-in border-4 border-teal-300 max-h-[92vh] flex flex-col justify-between">
                    <div class="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shadow-xs">${idx + 1}</span>
                            <h3 class="text-lg md:text-xl font-black text-teal-900 uppercase">Biên Tập & Xem Trước Slide ${idx + 1}</h3>
                        </div>
                        <button onclick="document.getElementById('lecture-edit-modal')?.remove()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500 text-sm transition"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <!-- 2-Column Split: Left Editor, Right Live Preview -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto admin-scroll pr-1 flex-grow mb-4">
                        <!-- Left: Form Controls -->
                        <div class="space-y-4">
                            <div>
                                <label class="block font-bold text-xs text-slate-700 uppercase mb-1">Tiêu đề Slide:</label>
                                <input type="text" id="modal-lecture-title" value="${String(l.title||'').replace(/"/g, '&quot;')}" oninput="updateModalSlideLivePreview()" class="w-full p-3 border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-800 bg-white outline-none focus:border-teal-500 shadow-inner">
                            </div>

                            <div>
                                <div class="flex justify-between items-center mb-1 flex-wrap gap-1">
                                    <label class="block font-bold text-xs text-slate-700 uppercase">Nội dung Slide (Markdown & LaTeX $...$):</label>
                                    <div class="flex items-center gap-1">
                                        <button onclick="insertMathSymbol('modal-lecture-content', '### ')" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200"># H3</button>
                                        <button onclick="insertMathSymbol('modal-lecture-content', '**', '**')" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-100 text-slate-700 rounded border border-slate-200">**B**</button>
                                        <button onclick="insertMathSymbol('modal-lecture-content', '==', '==')" class="px-2 py-0.5 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200">==M==</button>
                                        <button onclick="insertMathSymbol('modal-lecture-content', '$', '$')" class="px-2 py-0.5 text-[10px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded border border-teal-200">$x$</button>
                                        <button onclick="openMathModal('modal-lecture-content')" class="text-xs text-teal-700 hover:text-teal-900 font-bold px-2 py-0.5 bg-teal-50 rounded border border-teal-200"><i class="fa-solid fa-calculator"></i> Phím Toán</button>
                                    </div>
                                </div>
                                <textarea id="modal-lecture-content" oninput="updateModalSlideLivePreview()" rows="5" class="w-full p-3.5 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white outline-none focus:border-teal-500 leading-relaxed shadow-inner">${l.content||''}</textarea>
                            </div>

                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <label class="block font-bold text-xs text-slate-700 uppercase">Các bước phân giải suy luận (Mỗi bước 1 dòng):</label>
                                    <button onclick="insertMathSymbol('modal-lecture-steps', 'Bước ' + (document.getElementById('modal-lecture-steps').value.split('\\n').filter(Boolean).length + 1) + ': ')" class="px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 rounded border border-teal-200">+ Thêm bước</button>
                                </div>
                                <textarea id="modal-lecture-steps" oninput="updateModalSlideLivePreview()" rows="4" placeholder="Bước 1: ...&#10;Bước 2: ...&#10;Bước 3: ..." class="w-full p-3.5 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white outline-none focus:border-teal-500 leading-relaxed font-mono shadow-inner">${stepsStr}</textarea>
                            </div>

                            <div>
                                <label class="block font-bold text-xs text-amber-900 uppercase mb-1">Ghi chú Sư phạm cho Giáo viên khi giảng:</label>
                                <input type="text" id="modal-lecture-note" value="${String(l.teacherNote||'').replace(/"/g, '&quot;')}" oninput="updateModalSlideLivePreview()" class="w-full p-3 border-2 border-amber-200 rounded-xl text-xs font-bold text-amber-950 bg-amber-50/50 outline-none focus:border-amber-400 shadow-inner">
                            </div>
                        </div>

                        <!-- Right: Live Preview Box -->
                        <div class="bg-slate-50 p-5 rounded-2xl border-2 border-teal-200 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                                    <span class="text-xs font-black uppercase text-teal-900 flex items-center gap-1.5">
                                        <i class="fa-solid fa-tv text-teal-600"></i> Xem Trước Slide Trực Tiếp (Live Preview)
                                    </span>
                                    <span class="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">Trực quan 100%</span>
                                </div>
                                <div id="modal-slide-live-preview-box" class="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-h-[50vh] overflow-y-auto admin-scroll">
                                    <!-- Rendered dynamically -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-200 flex gap-3">
                        <button onclick="document.getElementById('lecture-edit-modal')?.remove()" class="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200">Hủy</button>
                        <button onclick="saveEditedLectureSlide(${idx})" class="flex-grow py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition btn-3d">Lưu Thay Đổi Slide</button>
                    </div>
                </div>
            </div>`;

            let prevModal = document.getElementById('lecture-edit-modal');
            if (prevModal) prevModal.remove();
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            updateModalSlideLivePreview();
        }

        function updateModalSlideLivePreview() {
            let container = document.getElementById('modal-slide-live-preview-box');
            if (!container) return;

            let title = document.getElementById('modal-lecture-title')?.value || 'Tiêu đề Slide...';
            let content = document.getElementById('modal-lecture-content')?.value || '*Chưa có nội dung slide...*';
            let note = document.getElementById('modal-lecture-note')?.value || '';
            let rawSteps = document.getElementById('modal-lecture-steps')?.value || '';
            let steps = rawSteps.split('\n').map(s => s.trim()).filter(Boolean);

            let html = `
                <div class="border-b pb-3 mb-3">
                    <h3 class="text-base md:text-lg font-black text-teal-950 uppercase font-display">${title}</h3>
                </div>
                <div class="prose-math text-xs md:text-sm leading-relaxed text-slate-800 math-scroll space-y-2">
                    ${parseMarkdownSafe(content, false)}
                </div>
            `;

            if (note) {
                html += `
                <div class="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium">
                    <div class="font-black text-amber-900 uppercase text-[10px] mb-1 flex items-center gap-1">
                        <i class="fa-solid fa-lightbulb text-amber-600"></i> Lời nhắc giáo viên:
                    </div>
                    ${parseMarkdownSafe(note, false)}
                </div>`;
            }

            if (steps.length > 0) {
                html += `
                <div class="mt-4 pt-3 border-t border-slate-200">
                    <span class="text-xs font-black text-teal-900 uppercase block mb-2">
                        <i class="fa-solid fa-stairs text-teal-600 mr-1"></i> Các bước suy luận (${steps.length} bước):
                    </span>
                    <div class="space-y-2">
                        ${steps.map((st, sIdx) => `
                            <div class="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs font-bold text-slate-800 flex items-start gap-2">
                                <span class="w-5 h-5 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">${sIdx + 1}</span>
                                <div class="flex-grow">${parseMarkdownSafe(st, false)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            container.innerHTML = html;
            triggerMathJax(container);
        }

        function saveEditedLectureSlide(idx) {
            let l = adminState.data.lectures[idx];
            if (!l) return;
            l.title = document.getElementById('modal-lecture-title')?.value || '';
            l.content = document.getElementById('modal-lecture-content')?.value || '';
            l.teacherNote = document.getElementById('modal-lecture-note')?.value || '';
            let rawSteps = document.getElementById('modal-lecture-steps')?.value || '';
            l.steps = rawSteps.split('\n').map(s => s.trim()).filter(Boolean);

            document.getElementById('lecture-edit-modal')?.remove();
            renderTheoryStudio(document.getElementById('admin-content-area'));
            showToast("Đã cập nhật slide thành công!");
        }


        function renderAdminList() {
            let container = document.getElementById('admin-list'); if(!container) return;
            let roundName = adminState.round === 'round1' ? 'P1: Trắc nghiệm' : (adminState.round === 'round2' ? 'P2: Đúng/Sai' : 'P3: Trả lời ngắn');
            let qList = adminState.data[adminState.round] || [];
            
            container.innerHTML = `
                <div class="border-b-2 border-slate-200 pb-3 mb-2">
                    <div class="font-black text-sky-800 text-xs uppercase mb-2 flex items-center justify-between">
                        <span><i class="fa-solid fa-list-ol mr-1 text-sky-500"></i> ${roundName}</span>
                        <span class="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-black">${qList.length} Câu</span>
                    </div>
                    <button onclick="openFullQuestionPreviewModal(adminState.editingQ ? adminState.editingQ.id : (adminState.data[adminState.round] && adminState.data[adminState.round][0] ? adminState.data[adminState.round][0].id : 1), adminState.round)" class="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition btn-3d flex items-center justify-center gap-1.5" title="Xem trước toàn bộ câu hỏi, đáp án và lời giải chi tiết">
                        <i class="fa-solid fa-eye text-amber-300"></i> Xem Trước Đề & Lời Giải
                    </button>
                </div>
            `;
            
            qList.forEach(q => { 
                let txt = q.text || q.question || "(Chưa có nội dung)"; let pTxt = txt.length > 35 ? txt.substring(0,35)+'...' : txt;
                let act = (adminState.editingQ && String(adminState.editingQ.id) === String(q.id)) ? 'border-sky-500 bg-sky-50 shadow-md scale-[1.02]' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-sky-300';
                
                let ptsDisplay = q.points !== undefined ? q.points : 10;
                if (adminState.round === 'round2') ptsDisplay = (q.statements || []).reduce((sum, s) => sum + (parseFloat(s.points) || 10), 0);
                else if (adminState.round === 'round3') ptsDisplay = q.points !== undefined ? parseFloat(q.points) : 15;

                let bankBadge = q.bankId ? `<span class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-indigo-200 truncate max-w-[90px]" title="Mã ID trong Ngân hàng: ${q.bankId}"><i class="fa-solid fa-database text-[8px] mr-0.5"></i>${q.bankId}</span>` : '';
                let mathIdBadge = (typeof window.formatMathIdBadge === 'function' && q.idCode) ? window.formatMathIdBadge(q.idCode) : (q.idCode ? `<span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-sky-200">${q.idCode}</span>` : '');

                container.innerHTML += `
                    <div onclick="adminEditQ('${q.id}')" class="p-3.5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${act} relative group">
                        <div class="font-black text-sky-700 mb-1.5 text-xs flex justify-between items-center">
                            <span class="flex items-center gap-1 flex-wrap">CÂU ${q.id} ${bankBadge} ${mathIdBadge}</span> 
                            <div class="flex items-center gap-1 shrink-0">
                                <button onclick="event.stopPropagation(); openFullQuestionPreviewModal('${q.id}', '${adminState.round}')" class="w-5 h-5 rounded-md bg-sky-100 hover:bg-sky-600 hover:text-white text-sky-700 flex items-center justify-center text-[10px] transition" title="Xem trước câu ${q.id}"><i class="fa-solid fa-eye"></i></button>
                                <span class="bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded text-[10px] shadow-xs uppercase font-black">${ptsDisplay}đ</span>
                            </div>
                        </div>
                        <div class="text-[11px] text-slate-500 font-semibold truncate leading-tight">${pTxt}</div>
                    </div>
                `;
            });
            container.innerHTML += `<button onclick="adminAddNewQ()" class="w-full mt-3 py-3.5 border-2 border-dashed text-sky-600 border-sky-300 font-black text-xs rounded-2xl hover:bg-sky-50 transition shadow-sm bg-white btn-3d tracking-wider"><i class="fa-solid fa-plus mr-1.5"></i> THÊM CÂU MỚI</button>`;
            triggerMathJax();
        }

        function adminAddNewQ() { let lst = adminState.data[adminState.round] || []; let newId = lst.length ? Math.max(...lst.map(q => q.id)) + 1 : 1; let newQ = { id: newId, text: "Nhập nội dung...", explanation: "" }; if (adminState.round === 'round1') { newQ.options = ["A", "B", "C", "D"]; newQ.answer = "A"; newQ.points = 10; } else if (adminState.round === 'round2') { newQ.statements = [{ label: "a", text: "Ý a", isTrue: true, points: 10 }, { label: "b", text: "Ý b", isTrue: false, points: 10 }, { label: "c", text: "Ý c", isTrue: true, points: 10 }, { label: "d", text: "Ý d", isTrue: false, points: 10 }]; } else { newQ.answer = "1"; newQ.points = 15; } lst.push(newQ); lst.forEach((x, i) => x.id = i + 1); renderAdminUI(); adminEditQ(newId); }
        function deleteExamCodeFromAdmin(qId) { showConfirmModal("Xóa Câu Hỏi", "Chắc chắn muốn xóa vĩnh viễn câu này khỏi hệ thống?", () => { let lst = adminState.data[adminState.round] || []; adminState.data[adminState.round] = lst.filter(q => String(q.id) !== String(qId)); adminState.data[adminState.round].forEach((q, i) => q.id = i + 1); adminState.editingQ = null; renderAdminUI(); showToast("Đã xóa!"); }); }

        function openMathIdPickerForEditor() {
            let curIdCode = document.getElementById('edit-q-idcode')?.value || (adminState.editingQ?.idCode || '');
            let initialGrade = '12';
            if (curIdCode && typeof window.parseMathId === 'function') {
                let p = window.parseMathId(curIdCode);
                if (p && p.grade) initialGrade = String(p.grade);
            }
            if (typeof window.openMathIdPickerModal === 'function') {
                window.openMathIdPickerModal(res => {
                    if (!res) return;
                    if (document.getElementById('edit-q-idcode')) document.getElementById('edit-q-idcode').value = res.idCode || '';
                    if (document.getElementById('edit-q-topic') && res.topic) document.getElementById('edit-q-topic').value = res.topic;
                    if (document.getElementById('edit-q-level') && res.level) document.getElementById('edit-q-level').value = res.level;
                    
                    let badgeContainer = document.getElementById('edit-q-id-preview-badge');
                    if (badgeContainer && typeof window.formatMathIdBadge === 'function') {
                        badgeContainer.innerHTML = window.formatMathIdBadge(res.idCode);
                    }
                    if (adminState.editingQ) {
                        adminState.editingQ.idCode = res.idCode;
                        adminState.editingQ.topic = res.topic;
                        adminState.editingQ.level = res.level;
                    }
                    updateQPreviewLive();
                }, initialGrade);
            }
        }

        function onMathIdCodeChanged(val) {
            let badgeContainer = document.getElementById('edit-q-id-preview-badge');
            if (badgeContainer && typeof window.formatMathIdBadge === 'function') {
                badgeContainer.innerHTML = window.formatMathIdBadge(val);
            }
            if (typeof window.parseMathId === 'function' && val) {
                let parsed = window.parseMathId(val);
                if (parsed && parsed.level) {
                    let lvlSelect = document.getElementById('edit-q-level');
                    if (lvlSelect) lvlSelect.value = parsed.level;
                }
            }
            updateQPreviewLive();
        }

        function onMathLevelChanged(lvlVal) {
            let idInput = document.getElementById('edit-q-idcode');
            if (idInput && idInput.value && typeof window.parseMathId === 'function') {
                let parsed = window.parseMathId(idInput.value);
                if (parsed && parsed.valid) {
                    let revMap = window.REVERSE_LEVEL_MAP || { 'Nhận biết': 'N', 'Thông hiểu': 'H', 'Vận dụng': 'V', 'Vận dụng cao': 'C' };
                    let newLvlCode = revMap[lvlVal] || 'H';
                    let g = parsed.gradeCode;
                    let b = parsed.branchCode;
                    let c = parsed.chapterCode;
                    let l = parsed.lessonCode;
                    let t = parsed.typeCode;
                    let newCode = `[${g}${b}${c}${newLvlCode}${l}-${t}]`;
                    idInput.value = newCode;
                    let badgeContainer = document.getElementById('edit-q-id-preview-badge');
                    if (badgeContainer && typeof window.formatMathIdBadge === 'function') {
                        badgeContainer.innerHTML = window.formatMathIdBadge(newCode);
                    }
                }
            }
            updateQPreviewLive();
        }

        function adminEditQ(qId) {
            if (adminState.editingQ && String(adminState.editingQ.id) !== String(qId) && document.getElementById('edit-q-text')) adminSaveCurrentQ(false, true); 
            adminState.editingQ = adminState.data[adminState.round].find(x => String(x.id) === String(qId)); let q = adminState.editingQ; renderAdminList(); 
            
            let isExam = adminState.loadedSettings?.examMode === 'exam';

            let roundBadgeTitle = adminState.round === 'round1' ? 'Trắc nghiệm 4LC' : (adminState.round === 'round2' ? 'Đúng / Sai' : 'Trả lời ngắn');

            let bankHeaderBadge = q.bankId ? `
                <button onclick="copyBankQuestionId('${q.bankId}')" class="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-xs font-black border border-indigo-200 transition shadow-2xs flex items-center gap-1.5" title="Bấm để sao chép mã ID Ngân hàng">
                    <i class="fa-regular fa-copy text-[10px] text-indigo-500"></i> ID: ${q.bankId}
                </button>` : '';

            let mathHeaderBadge = (typeof window.formatMathIdBadge === 'function' && q.idCode) ? `
                <div class="flex items-center gap-1.5">
                    ${window.formatMathIdBadge(q.idCode)}
                </div>` : '';

            let html = `
                <div class="flex flex-wrap justify-between items-center mb-6 border-b-2 border-slate-100 pb-4 gap-3">
                    <div class="flex items-center gap-3 flex-wrap">
                        <h3 class="font-black text-2xl text-sky-900 uppercase tracking-wide flex items-center">
                            <i class="fa-solid fa-pen-to-square mr-2.5 text-sky-500"></i>Biên tập Câu ${q.id}
                        </h3>
                        <span class="px-3 py-1 rounded-xl bg-sky-100 text-sky-700 text-xs font-black uppercase border border-sky-200">${roundBadgeTitle}</span>
                        ${bankHeaderBadge}
                        ${mathHeaderBadge}
                    </div>
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <button onclick="AIExamStudio.openVariationModal(adminState.round, (adminState.data[adminState.round] || []).findIndex(x => String(x.id) === String('${q.id}')))" class="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider flex items-center gap-1.5" title="Tự động giữ nguyên cấu trúc toán học, đổi số liệu đẹp và sinh lời giải"><i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> AI Sinh Câu Tương Tự</button>
                        <button onclick="openFullQuestionPreviewModal('${q.id}', '${adminState.round}')" class="px-4 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider flex items-center gap-1.5" title="Xem trước câu hỏi, đáp án và lời giải chi tiết"><i class="fa-solid fa-expand text-amber-300"></i> Xem Trước Cả Câu</button>
                        <button onclick="adminSaveCurrentQ(false)" class="px-5 py-2.5 bg-main text-white rounded-xl text-xs font-black shadow-md hover:bg-mainDark transition btn-3d uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-floppy-disk"></i> Lưu Cập Nhật</button>
                        <button onclick="deleteExamCodeFromAdmin('${q.id}')" class="px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-500 hover:text-white transition btn-3d shadow-sm uppercase flex items-center gap-1.5"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                    </div>
                </div>
            `;

            html += `
                <!-- Khung Mã Định Danh Toán GDPT 2018 & Mức độ nhận thức -->
                <div class="mb-6 bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-purple-50/50 p-5 rounded-[2rem] border-2 border-indigo-100 shadow-sm">
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm"><i class="fa-solid fa-sitemap"></i></span>
                            <div>
                                <h4 class="font-black text-xs text-indigo-950 uppercase tracking-wide">Mã Định Danh Toán GDPT 2018 & Mức Độ Nhận Thức</h4>
                                <p class="text-[11px] text-indigo-600 font-medium">Cấu trúc chuẩn: [Lớp][Phân môn][Chương][Mức độ][Bài]-[Dạng]</p>
                            </div>
                        </div>
                        <button type="button" onclick="openMathIdPickerForEditor()" class="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition btn-3d flex items-center gap-1.5">
                            <i class="fa-solid fa-tree text-amber-300"></i> Tra Cứu Cây Mã ID (Lớp 6 - 12)
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                        <div class="md:col-span-4">
                            <label class="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Mã ID Định Danh:</label>
                            <input type="text" id="edit-q-idcode" oninput="onMathIdCodeChanged(this.value)" value="${String(q.idCode || '')}" placeholder="VD: [2D1N1-1]" class="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl font-mono font-bold text-xs text-indigo-900 outline-none focus:border-indigo-500 shadow-inner">
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Mức Độ Nhận Thức:</label>
                            <select id="edit-q-level" onchange="onMathLevelChanged(this.value)" class="w-full py-2 px-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 outline-none focus:border-indigo-500 shadow-inner">
                                <option value="Nhận biết" ${q.level === 'Nhận biết' ? 'selected' : ''}>Nhận biết (N)</option>
                                <option value="Thông hiểu" ${(!q.level || q.level === 'Thông hiểu') ? 'selected' : ''}>Thông hiểu (H)</option>
                                <option value="Vận dụng" ${q.level === 'Vận dụng' ? 'selected' : ''}>Vận dụng (V)</option>
                                <option value="Vận dụng cao" ${q.level === 'Vận dụng cao' ? 'selected' : ''}>Vận dụng cao (C)</option>
                            </select>
                        </div>
                        <div class="md:col-span-5">
                            <label class="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Chủ Đề / Dạng Toán:</label>
                            <input type="text" id="edit-q-topic" value="${String(q.topic || '')}" placeholder="VD: Đơn điệu của hàm số" class="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-800 outline-none focus:border-indigo-500 shadow-inner">
                        </div>
                    </div>
                    <div id="edit-q-id-preview-badge" class="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                        ${(typeof window.formatMathIdBadge === 'function' && q.idCode) ? window.formatMathIdBadge(q.idCode) : ''}
                    </div>
                </div>
            `;
            
            html += `<div class="mb-8 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <label class="font-black text-sm text-slate-700 uppercase tracking-widest">Nội dung câu hỏi (Bọc biểu thức Toán bằng $...$):</label>
                    <div class="flex gap-2 flex-wrap">
                        <button onclick="openSvgHelperModal('edit-q-text')" class="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow-sm border border-amber-300 hover:brightness-110 transition btn-3d"><i class="fa-solid fa-chart-line mr-1"></i> Chèn Đồ Thị & BBT SVG</button>
                        <button onclick="toggleQPreview()" id="btn-toggle-q-preview" class="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition border border-emerald-200 shadow-sm btn-3d flex items-center gap-1.5"><i class="fa-solid fa-eye"></i> <span id="q-preview-btn-text">Xem trước Cả Câu (Live)</span></button>
                        <button onclick="openMathModal('edit-q-text')" class="px-3.5 py-1.5 bg-sky-50 text-sky-600 rounded-xl text-xs font-black hover:bg-sky-600 hover:text-white transition border border-sky-100 shadow-sm btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Gõ Toán Học</button>
                    </div>
                </div>
                <textarea id="edit-q-text" oninput="updateQPreviewLive()" class="w-full p-5 border-2 border-slate-200 rounded-2xl outline-none focus:border-sky-500 shadow-inner text-lg font-medium text-slate-800 transition leading-relaxed" rows="4">${String(q.text||'')}</textarea>
                
                <!-- Khung Xem Trước Toàn Bộ Câu Hỏi Trực Tiếp (Live Full Preview) -->
                <div id="q-preview-container" class="mt-5 p-5 bg-gradient-to-b from-sky-50/60 to-slate-50 border-2 border-dashed border-sky-300 rounded-2xl hidden">
                    <div class="text-xs font-black text-sky-900 uppercase tracking-widest mb-3 flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-sky-200">
                        <span class="flex items-center text-sky-800"><i class="fa-solid fa-wand-magic-sparkles text-sky-600 mr-2"></i> Xem Trước Toàn Bộ Câu (Đề bài, Đáp án & Lời giải):</span>
                        <div class="flex items-center gap-2">
                            <button id="btn-ai-draw-q-preview" onclick="aiRegenerateSvgForCurrentQ('edit-q-text', 'q-preview-content')" class="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-[11px] font-black shadow-xs hover:brightness-110 transition btn-3d uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> AI Vẽ SVG</button>
                            <button onclick="openFullQuestionPreviewModal('${q.id}', '${adminState.round}')" class="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-black transition shadow-xs flex items-center gap-1"><i class="fa-solid fa-expand"></i> Phóng To</button>
                        </div>
                    </div>
                    <div id="q-preview-content" class="w-full"></div>
                </div>
            </div>`;
            
            html += `<div class="mb-8 bg-sky-50/50 p-6 rounded-[2rem] border-2 border-sky-100 shadow-sm"><label class="block font-black mb-4 text-sm text-sky-800 uppercase tracking-widest"><i class="fa-solid fa-image mr-2"></i> Hình Ảnh Đính Kèm (Không bắt buộc):</label><div class="flex flex-col lg:flex-row gap-5 items-center"><div id="image-paste-zone" tabindex="0" class="flex-grow w-full min-h-[140px] border-[3px] border-dashed border-sky-300 bg-white rounded-2xl flex items-center justify-center cursor-text outline-none focus:border-sky-500 relative transition hover:bg-sky-50"><div id="image-preview" class="pointer-events-none text-center p-4">${q.image ? `<img src="${q.image}" class="max-h-[160px] rounded-xl object-contain mx-auto shadow-sm border border-slate-100">` : `<i class="fa-solid fa-paste text-5xl text-sky-200 mb-3"></i><div class="text-sm text-slate-500 font-bold">Click vào đây và nhấn Ctrl+V để dán ảnh</div>`}</div></div><div class="flex lg:flex-col gap-3 shrink-0 w-full lg:w-48"><button onclick="openCropModal()" class="flex-1 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-black py-3.5 px-4 rounded-xl text-sm text-center transition btn-3d shadow-sm uppercase"><i class="fa-solid fa-crop-simple mr-2"></i> Cắt Ảnh 1-Click</button><label class="flex-1 cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-black py-3.5 px-4 rounded-xl text-sm text-center transition btn-3d shadow-sm uppercase"><i class="fa-solid fa-cloud-arrow-up mr-2"></i> Tải File Lên<input type="file" id="image-upload" class="hidden" accept="image/*" onchange="handleFileUpload(event)"></label><button onclick="clearPastedImage()" class="flex-1 bg-white border-2 border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-rose-500 font-black py-3.5 px-4 rounded-xl text-sm transition btn-3d shadow-sm uppercase"><i class="fa-solid fa-trash-can mr-2"></i> Gỡ Bỏ Ảnh</button></div></div></div>`;

            if (adminState.round === 'round1') {
                html += `<div class="mb-8 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm"><label class="block font-black mb-5 text-sm text-slate-700 uppercase tracking-widest">Các phương án lựa chọn:</label><div class="grid grid-cols-1 md:grid-cols-2 gap-5">`; 
                (q.options || ["","","",""]).forEach((opt, idx) => { html += `<div class="bg-slate-50 p-4 rounded-2xl border border-slate-200"><div class="flex justify-between items-center mb-3"><label class="font-black text-[11px] text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">Phương án ${['A','B','C','D'][idx]}</label><button onclick="openMathModal('edit-q-opt-${idx}')" class="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:border-sky-300 font-bold shadow-sm transition btn-3d"><i class="fa-solid fa-calculator"></i> Phím Toán</button></div><input type="text" id="edit-q-opt-${idx}" oninput="updateQPreviewLive()" value="${String(opt||'').replace(/"/g, '&quot;')}" class="w-full p-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-400 text-base bg-white shadow-inner font-medium text-slate-800"></div>`; });
                
                let ptsHtml = `<label class="font-black text-sm text-amber-800 uppercase tracking-widest block mb-3 text-center">Điểm câu này:</label><input type="number" id="edit-q-points" oninput="updateQPreviewLive()" value="${q.points !== undefined ? q.points : 10}" step="0.1" class="w-full p-4 border-2 border-amber-300 rounded-xl bg-white outline-none focus:border-amber-500 font-black text-3xl text-center text-amber-600 shadow-inner">`;

                html += `</div></div><div class="mb-8 flex flex-col md:flex-row gap-5"><div class="flex-grow bg-emerald-50 p-6 rounded-[2rem] border-2 border-mainLight shadow-sm"><div class="flex justify-between items-center mb-3"><label class="font-black text-sm text-emerald-800 uppercase tracking-widest">Đáp án đúng chính xác:</label><button onclick="openMathModal('edit-q-ans')" class="text-[10px] bg-white border border-mainLight px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-mainDark hover:text-white font-bold shadow-sm transition btn-3d"><i class="fa-solid fa-calculator"></i> Toán</button></div><p class="text-xs text-emerald-600 mb-3 font-semibold">Nhập A, B, C, D hoặc nội dung text của phương án đúng.</p><input type="text" id="edit-q-ans" oninput="updateQPreviewLive()" value="${String(q.answer||'').replace(/"/g, '&quot;')}" class="w-full p-4 border-2 border-emerald-300 rounded-xl bg-white outline-none focus:border-emerald-500 font-black text-lg text-emerald-800 shadow-inner"></div><div class="w-full md:w-1/3 bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 shadow-sm flex flex-col justify-center">${ptsHtml}</div></div>`;
            } else if (adminState.round === 'round2') {
                html += `<div class="mb-8 space-y-5">`;
                (q.statements || []).forEach((stmt, idx) => { 
                    let ptsHtml = `<div class="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 px-3 py-2 rounded-xl shadow-sm"><label class="text-xs font-black text-amber-800 uppercase tracking-wider">Điểm/ý:</label><input type="number" step="0.1" id="edit-q-stmt-pts-${idx}" oninput="updateQPreviewLive()" value="${stmt.points !== undefined ? stmt.points : 10}" class="w-16 p-1 border-b-2 border-amber-300 rounded-none text-center text-lg font-black outline-none bg-transparent text-amber-800"></div>`;
                    
                    html += `
                    <div class="p-6 border-2 border-slate-200 rounded-[2rem] bg-white shadow-sm hover:border-sky-300 transition">
                        <div class="flex flex-wrap items-center justify-between mb-4 gap-4">
                            <div class="flex items-center gap-3">
                                <label class="font-black text-base text-white bg-sky-600 w-10 h-10 flex items-center justify-center rounded-xl uppercase shadow-md">${stmt.label}</label>
                                <button onclick="openMathModal('edit-q-stmt-txt-${idx}')" class="text-[11px] bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-200 font-bold shadow-sm transition btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Gõ Toán</button>
                            </div>
                            <div class="flex items-center gap-4">
                                ${ptsHtml}
                                <select id="edit-q-stmt-val-${idx}" onchange="this.className=this.value==='true'?'p-3 border-2 rounded-xl text-sm font-black outline-none transition cursor-pointer shadow-sm uppercase tracking-wider border-emerald-400 text-emerald-800 bg-emerald-50':'p-3 border-2 rounded-xl text-sm font-black outline-none transition cursor-pointer shadow-sm uppercase tracking-wider border-rose-400 text-rose-800 bg-rose-50'; updateQPreviewLive();" class="p-3 border-2 rounded-xl text-sm font-black outline-none transition cursor-pointer shadow-sm uppercase tracking-wider ${stmt.isTrue ? 'border-emerald-400 text-emerald-800 bg-emerald-50' : 'border-rose-400 text-rose-800 bg-rose-50'}">
                                    <option value="true" ${stmt.isTrue ? 'selected' : ''}>Mệnh đề ĐÚNG</option>
                                    <option value="false" ${!stmt.isTrue ? 'selected' : ''}>Mệnh đề SAI</option>
                                </select>
                            </div>
                        </div>
                        <textarea id="edit-q-stmt-txt-${idx}" oninput="updateQPreviewLive()" class="w-full p-4 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 text-lg font-medium shadow-inner bg-slate-50 transition" rows="2">${String(stmt.text||'')}</textarea>
                    </div>`; 
                });
                html += `</div>`;
            } else if (adminState.round === 'round3') { 
                let ptsHtml = `<label class="font-black text-sm text-amber-800 uppercase tracking-widest block mb-4 text-center">Điểm câu này:</label><input type="number" step="0.1" id="edit-q-points" oninput="updateQPreviewLive()" value="${q.points !== undefined ? q.points : 15}" class="w-full p-5 border-2 border-amber-300 rounded-2xl bg-white outline-none focus:border-amber-500 font-black text-3xl text-center text-amber-600 shadow-inner">`;

                html += `
                <div class="mb-8 flex flex-col md:flex-row gap-5">
                    <div class="flex-grow bg-emerald-50 p-6 rounded-[2rem] border-2 border-mainLight shadow-sm">
                        <div class="flex justify-between items-center mb-4">
                            <label class="font-black text-sm text-emerald-800 uppercase tracking-widest">Đáp án số (Ví dụ: 3/4 hoặc 5):</label>
                            <button onclick="openMathModal('edit-q-ans')" class="text-[10px] bg-white border border-mainLight px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-mainDark hover:text-white font-bold shadow-sm transition btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Phím Toán</button>
                        </div>
                        <input type="text" id="edit-q-ans" oninput="updateQPreviewLive()" value="${String(q.answer||'').replace(/"/g, '&quot;')}" class="w-full p-5 border-2 border-emerald-300 rounded-2xl bg-white font-black text-3xl text-center text-mainDark outline-none focus:border-emerald-500 shadow-inner tracking-widest">
                    </div>
                    <div class="w-full md:w-1/3 bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 shadow-sm flex flex-col justify-center">${ptsHtml}</div>
                </div>`; 
            }

            html += `
                <div class="bg-sky-50 p-6 md:p-8 rounded-[2rem] border-2 border-sky-100 shadow-sm">
                    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <label class="block font-black text-sm text-sky-900 uppercase tracking-widest"><i class="fa-solid fa-lightbulb text-amber-500 mr-2 text-lg"></i> Lời giải chi tiết (Hướng dẫn):</label>
                        <div class="flex gap-2">
                            <button onclick="openSvgHelperModal('edit-q-explanation')" class="text-[10px] bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-800 hover:bg-amber-500 hover:text-white font-bold shadow-sm transition btn-3d"><i class="fa-solid fa-chart-line mr-1"></i> Đồ Thị / BBT SVG</button>
                            <button onclick="openMathModal('edit-q-explanation')" class="text-[10px] bg-white border border-sky-200 px-3 py-1.5 rounded-lg text-sky-700 hover:bg-sky-600 hover:text-white font-bold shadow-sm transition btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Gõ Toán</button>
                        </div>
                    </div>
                    <textarea id="edit-q-explanation" oninput="updateQPreviewLive()" class="w-full p-5 border-2 border-sky-200 rounded-2xl focus:border-sky-500 outline-none shadow-inner bg-white text-lg font-medium transition" rows="4">${String(q.explanation || '')}</textarea>
                </div>
            `; 
            document.getElementById('admin-editor').innerHTML = html; triggerMathJax(); setupImagePasteZone();
        }

        function adminSaveCurrentQ(closeAfter = false, isSilent = false) {
            if (!adminState.editingQ) { if (closeAfter) closeAdmin(); return; }
            let q = adminState.editingQ;
            q.text = document.getElementById('edit-q-text').value; q.explanation = document.getElementById('edit-q-explanation').value;
            
            q.idCode = document.getElementById('edit-q-idcode')?.value?.trim() || '';
            q.level = document.getElementById('edit-q-level')?.value || 'Thông hiểu';
            q.topic = document.getElementById('edit-q-topic')?.value?.trim() || '';

            if (adminState.round === 'round1') {
                q.options = [0, 1, 2, 3].map(i => document.getElementById(`edit-q-opt-${i}`).value);
                let inputAns = document.getElementById('edit-q-ans').value.trim();
                let upperAns = inputAns.toUpperCase();
                if (['A', 'B', 'C', 'D'].includes(upperAns)) { let idx = ['A', 'B', 'C', 'D'].indexOf(upperAns); q.answer = q.options[idx].trim(); } else { q.answer = inputAns; }
                q.points = parseFloat(document.getElementById('edit-q-points').value) || 10;
            } else if (adminState.round === 'round2') {
                q.statements.forEach((stmt, idx) => { stmt.text = document.getElementById(`edit-q-stmt-txt-${idx}`).value; stmt.isTrue = document.getElementById(`edit-q-stmt-val-${idx}`).value === 'true'; stmt.points = parseFloat(document.getElementById(`edit-q-stmt-pts-${idx}`).value) || 10; });
            } else if (adminState.round === 'round3') { q.answer = document.getElementById('edit-q-ans').value.trim(); q.points = parseFloat(document.getElementById('edit-q-points').value) || 15; }
            
            let imgPreview = document.getElementById('image-preview')?.querySelector('img');
            q.image = (imgPreview && imgPreview.src && !imgPreview.src.includes('fa-paste')) ? imgPreview.src : "";

            GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
            if (!isSilent) { showToast("Đã lưu Cập Nhật Câu Hỏi!"); renderAdminList(); }
            if (closeAfter) closeAdmin();
        }

        function setupImagePasteZone() { let zone = document.getElementById('image-paste-zone'); if(!zone) return; zone.addEventListener('paste', async (e) => { e.preventDefault(); let items = (e.clipboardData || e.originalEvent.clipboardData).items; for (let index in items) { if (items[index].kind === 'file' && items[index].type.startsWith('image/')) { document.getElementById('image-preview').innerHTML = `<i class="fa-solid fa-spinner fa-spin text-4xl text-sky-500"></i>`; let url = await processImageFile(items[index].getAsFile()); if(url) { document.getElementById('image-preview').innerHTML = `<img src="${url}" class="max-h-[160px] rounded-xl object-contain mx-auto shadow-sm border border-slate-100">`; if(adminState.editingQ) adminState.editingQ.image = url; updateQPreviewLive(); } else clearPastedImage(); } } }); }
        async function handleFileUpload(e) { let file = e.target.files[0]; if(!file) return; document.getElementById('image-preview').innerHTML = `<i class="fa-solid fa-spinner fa-spin text-4xl text-sky-500"></i>`; let url = await processImageFile(file); if(url) { document.getElementById('image-preview').innerHTML = `<img src="${url}" class="max-h-[160px] rounded-xl object-contain mx-auto shadow-sm border border-slate-100">`; if(adminState.editingQ) adminState.editingQ.image = url; updateQPreviewLive(); } else clearPastedImage(); }
        function clearPastedImage() { document.getElementById('image-preview').innerHTML = `<i class="fa-solid fa-paste text-5xl text-sky-200 mb-3"></i><div class="text-sm text-slate-500 font-bold">Click vào đây và nhấn Ctrl+V để dán ảnh</div>`; if(adminState.editingQ) adminState.editingQ.image = ""; document.getElementById('image-upload').value = ""; updateQPreviewLive(); }
        async function processImageFile(file) { 
            if (!file) return null;
            try {
                let webpUrl = await compressImageToWebP(file, 800, 0.85);
                showToast("Đã nén & xử lý ảnh thành công (~5-15KB)!");
                return webpUrl;
            } catch(e) {
                showToast("Không thể xử lý file ảnh!", true);
                return null;
            }
        }

        function compressImageToWebP(file, maxWidth = 800, quality = 0.85) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let img = new Image();
                    img.onload = () => {
                        let canvas = document.createElement('canvas');
                        let w = img.width, h = img.height;
                        if (w > maxWidth) {
                            h = Math.round((h * maxWidth) / w);
                            w = maxWidth;
                        }
                        canvas.width = w;
                        canvas.height = h;
                        let ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, w, h);
                        ctx.drawImage(img, 0, 0, w, h);
                        let webpData = canvas.toDataURL('image/webp', quality);
                        resolve(webpData);
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
        
        // =========================================================================
        // HỆ THỐNG XEM TRƯỚC TOÀN DIỆN CÂU HỎI (ĐỀ BÀI, ĐÁP ÁN & LỜI GIẢI CHI TIẾT)
        // =========================================================================
        function buildFullQuestionPreviewHTML(qData, roundType = 'round1', showSolution = true) {
            if (!qData) return '<div class="text-slate-400 italic p-8 text-center bg-white rounded-2xl border border-slate-200">Không có dữ liệu câu hỏi để xem trước.</div>';
            
            let roundTitle = 'Phần I: Câu hỏi Trắc nghiệm (4 lựa chọn)';
            let badgeColor = 'bg-sky-100 text-sky-700 border-sky-200';
            if (roundType === 'round2') {
                roundTitle = 'Phần II: Câu hỏi Đúng / Sai';
                badgeColor = 'bg-purple-100 text-purple-700 border-purple-200';
            } else if (roundType === 'round3') {
                roundTitle = 'Phần III: Câu hỏi Trả lời ngắn';
                badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
            }

            let qText = qData.text || qData.question || '<span class="italic text-slate-400">(Chưa nhập nội dung câu hỏi)</span>';
            let renderedText = parseMarkdownSafe(qText);

            let ptsDisplay = qData.points !== undefined ? qData.points : (roundType === 'round3' ? 15 : 10);
            if (roundType === 'round2' && qData.statements) {
                ptsDisplay = qData.statements.reduce((sum, s) => sum + (parseFloat(s.points) || 10), 0);
            }

            let mathIdBadge = (typeof window.formatMathIdBadge === 'function' && qData.idCode) ? window.formatMathIdBadge(qData.idCode) : (qData.idCode ? `<span class="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-lg text-xs font-mono font-bold border border-sky-200">${qData.idCode}</span>` : '');

            let html = `
            <div class="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden text-slate-800 transition-all">
                <!-- Header câu hỏi -->
                <div class="px-5 py-4 bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white font-black text-base flex items-center justify-center shadow-sm">
                            ${qData.id || 1}
                        </span>
                        <div class="flex flex-col">
                            <span class="font-black text-base text-slate-800 uppercase tracking-wide leading-tight flex items-center gap-2 flex-wrap">
                                CÂU ${qData.id || 1}
                                ${mathIdBadge}
                            </span>
                            <span class="text-[11px] font-bold text-slate-500">
                                ${roundTitle} ${qData.topic ? `&bull; <span class="text-indigo-600">${qData.topic}</span>` : ''}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5">
                            <i class="fa-solid fa-award text-amber-500"></i> ${ptsDisplay} Điểm
                        </span>
                    </div>
                </div>

                <!-- Nội dung đề bài & Hình ảnh -->
                <div class="p-5 md:p-7 space-y-5">
                    <div class="text-base md:text-lg font-semibold text-slate-800 leading-relaxed math-scroll">
                        ${renderedText}
                    </div>

                    ${qData.image ? `
                        <div class="my-4 flex justify-center">
                            <div class="p-2 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-xs max-w-full">
                                <img src="${qData.image}" alt="Hình câu hỏi ${qData.id}" class="max-h-80 rounded-xl object-contain mx-auto shadow-sm">
                            </div>
                        </div>
                    ` : ''}

                    <!-- Phần hiển thị Đáp án / Phương án -->
                    <div class="pt-2">
            `;

            if (roundType === 'round1') {
                let options = qData.options || ['', '', '', ''];
                let rawAns = String(qData.answer || '').trim();
                let correctLetter = '';
                if (['A', 'B', 'C', 'D'].includes(rawAns.toUpperCase())) {
                    correctLetter = rawAns.toUpperCase();
                } else {
                    let idx = options.findIndex(o => stripOptionPrefix(o).trim() === stripOptionPrefix(rawAns).trim());
                    if (idx !== -1) correctLetter = ['A', 'B', 'C', 'D'][idx];
                }

                html += `
                    <div class="mb-2">
                        <div class="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <i class="fa-solid fa-list-check text-sky-500"></i> Các phương án lựa chọn:
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                `;
                const letters = ['A', 'B', 'C', 'D'];
                options.forEach((opt, idx) => {
                    let letter = letters[idx];
                    let isCorrect = (correctLetter === letter) || (stripOptionPrefix(opt).trim() === stripOptionPrefix(rawAns).trim() && rawAns !== '');
                    let optClean = stripOptionPrefix(opt);
                    let renderedOpt = parseMarkdownSafe(optClean, true);

                    html += `
                        <div class="p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${isCorrect ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-400/30 shadow-sm' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'}">
                            <span class="w-8 h-8 rounded-xl shrink-0 font-black text-sm flex items-center justify-center ${isCorrect ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'}">
                                ${letter}
                            </span>
                            <div class="flex-grow text-sm md:text-base font-semibold text-slate-800 leading-snug math-scroll pt-1">
                                ${renderedOpt || '<span class="text-slate-400 italic font-normal">Trống</span>'}
                            </div>
                            ${isCorrect ? `
                                <span class="shrink-0 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                    <i class="fa-solid fa-circle-check"></i> Đáp án đúng
                                </span>
                            ` : ''}
                        </div>
                    `;
                });
                html += `</div></div>`;
            } else if (roundType === 'round2') {
                let stmts = qData.statements || [];
                html += `
                    <div class="mb-2">
                        <div class="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <i class="fa-solid fa-list-check text-purple-500"></i> Các mệnh đề Đúng / Sai:
                        </div>
                        <div class="space-y-3">
                `;
                stmts.forEach((st) => {
                    let isTrue = st.isTrue === true || String(st.isTrue) === 'true';
                    let renderedStmt = parseMarkdownSafe(st.text, true);
                    html += `
                        <div class="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition shadow-xs">
                            <div class="flex items-start gap-3 flex-grow">
                                <span class="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm shrink-0 flex items-center justify-center shadow-xs uppercase">
                                    ${st.label || 'a'}
                                </span>
                                <div class="text-sm md:text-base font-semibold text-slate-800 math-scroll pt-1">
                                    ${renderedStmt || '<span class="text-slate-400 italic font-normal">Trống</span>'}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <span class="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border flex items-center gap-1.5 ${isTrue ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}">
                                    <i class="fa-solid ${isTrue ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'}"></i>
                                    ${isTrue ? 'Mệnh đề ĐÚNG' : 'Mệnh đề SAI'}
                                </span>
                                <span class="text-xs font-bold text-slate-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                                    ${st.points !== undefined ? st.points : 10}đ
                                </span>
                            </div>
                        </div>
                    `;
                });
                html += `</div></div>`;
            } else if (roundType === 'round3') {
                let rawAns = String(qData.answer || '').trim();
                html += `
                    <div class="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between flex-wrap gap-4 mb-2 shadow-xs">
                        <div class="flex items-center gap-3">
                            <span class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                                <i class="fa-solid fa-key"></i>
                            </span>
                            <div>
                                <span class="font-black text-sm text-emerald-900 uppercase tracking-wide block">Đáp án điền khuyết chính xác:</span>
                                <span class="text-xs text-emerald-700 font-medium">Học sinh nhập đúng giá trị này để được điểm</span>
                            </div>
                        </div>
                        <div class="font-black text-2xl text-emerald-800 bg-white px-6 py-2.5 rounded-2xl border-2 border-emerald-400 shadow-inner font-mono tracking-wider">
                            ${rawAns ? `$${rawAns}$` : '<span class="text-slate-400 italic text-sm">Chưa có đáp án</span>'}
                        </div>
                    </div>
                `;
            }

            // Lời giải chi tiết
            if (showSolution) {
                let expl = String(qData.explanation || '').trim();
                let renderedExpl = expl ? formatExplanation(expl) : '';

                html += `
                    <div class="mt-6 pt-6 border-t-2 border-dashed border-slate-200">
                        <div class="bg-gradient-to-br from-amber-50/95 via-amber-50/60 to-orange-50/40 p-5 md:p-6 rounded-3xl border-2 border-amber-300/80 shadow-xs">
                            <div class="flex items-center justify-between mb-3.5 flex-wrap gap-2 pb-2.5 border-b border-amber-200/80">
                                <div class="font-black text-sm text-amber-900 uppercase tracking-wider flex items-center gap-2">
                                    <span class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
                                        <i class="fa-solid fa-lightbulb"></i>
                                    </span>
                                    Hướng Dẫn Giải Chi Tiết
                                </div>
                                <span class="text-[11px] font-black text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                                    <i class="fa-solid fa-circle-check text-amber-600"></i> Lời giải giáo viên
                                </span>
                            </div>
                            <div class="text-sm md:text-base text-slate-800 leading-relaxed math-scroll font-medium">
                                ${renderedExpl || '<div class="text-amber-800/70 italic text-xs py-3"><i class="fa-solid fa-circle-info mr-1"></i> Chưa có lời giải chi tiết cho câu hỏi này. Thầy/Cô có thể bổ sung hướng dẫn giải ở khung bên trên.</div>'}
                            </div>
                        </div>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            </div>
            `;

            return html;
        }

        function getLiveEditingQuestionData() {
            if (!adminState.editingQ) return null;
            let q = JSON.parse(JSON.stringify(adminState.editingQ));
            
            let textEl = document.getElementById('edit-q-text');
            if (textEl) q.text = textEl.value;
            
            let explEl = document.getElementById('edit-q-explanation');
            if (explEl) q.explanation = explEl.value;
            
            let imgPreview = document.getElementById('image-preview')?.querySelector('img');
            q.image = (imgPreview && imgPreview.src && !imgPreview.src.includes('fa-paste')) ? imgPreview.src : (q.image || '');

            if (adminState.round === 'round1') {
                q.options = [0, 1, 2, 3].map(i => {
                    let el = document.getElementById(`edit-q-opt-${i}`);
                    return el ? el.value : (q.options ? q.options[i] : '');
                });
                let ansEl = document.getElementById('edit-q-ans');
                if (ansEl) q.answer = ansEl.value;
                let ptsEl = document.getElementById('edit-q-points');
                if (ptsEl) q.points = parseFloat(ptsEl.value) || 10;
            } else if (adminState.round === 'round2') {
                if (q.statements) {
                    q.statements.forEach((stmt, idx) => {
                        let txtEl = document.getElementById(`edit-q-stmt-txt-${idx}`);
                        if (txtEl) stmt.text = txtEl.value;
                        let valEl = document.getElementById(`edit-q-stmt-val-${idx}`);
                        if (valEl) stmt.isTrue = valEl.value === 'true';
                        let ptsEl = document.getElementById(`edit-q-stmt-pts-${idx}`);
                        if (ptsEl) stmt.points = parseFloat(ptsEl.value) || 10;
                    });
                }
            } else if (adminState.round === 'round3') {
                let ansEl = document.getElementById('edit-q-ans');
                if (ansEl) q.answer = ansEl.value;
                let ptsEl = document.getElementById('edit-q-points');
                if (ptsEl) q.points = parseFloat(ptsEl.value) || 15;
            }
            return q;
        }

        let previewDebounceTimer = null;
        function updateQPreviewLive() {
            let container = document.getElementById('q-preview-container');
            let contentEl = document.getElementById('q-preview-content');
            if (!container || !contentEl || container.classList.contains('hidden')) return;

            clearTimeout(previewDebounceTimer);
            previewDebounceTimer = setTimeout(() => {
                let liveQ = getLiveEditingQuestionData();
                if (liveQ) {
                    contentEl.innerHTML = buildFullQuestionPreviewHTML(liveQ, adminState.round, true);
                    triggerMathJax();
                }
            }, 250);
        }

        function toggleQPreview() {
            let container = document.getElementById('q-preview-container');
            let btnText = document.getElementById('q-preview-btn-text');
            if (!container) return;
            if (container.classList.contains('hidden')) {
                container.classList.remove('hidden');
                if (btnText) btnText.innerText = 'Ẩn Xem Trước';
                updateQPreviewLive();
            } else {
                container.classList.add('hidden');
                if (btnText) btnText.innerText = 'Xem trước Cả Câu (Live)';
            }
        }

        // Modal Xem Trước Toàn Màn Hình
        let currentPreviewQId = 1;
        let currentPreviewRound = 'round1';
        let previewShowSolution = true;

        function openFullQuestionPreviewModal(qId = null, round = null) {
            if (round) currentPreviewRound = round;
            else if (adminState.round && ['round1', 'round2', 'round3'].includes(adminState.round)) currentPreviewRound = adminState.round;
            
            let qList = adminState.data[currentPreviewRound] || [];
            if (qList.length === 0) {
                showToast("Phần này chưa có câu hỏi nào!", true);
                return;
            }

            if (qId !== null && qId !== undefined) currentPreviewQId = parseInt(qId) || 1;
            else if (adminState.editingQ) currentPreviewQId = parseInt(adminState.editingQ.id) || 1;
            else currentPreviewQId = 1;

            // Update Round Tabs UI in Modal
            ['round1', 'round2', 'round3'].forEach(r => {
                let btn = document.getElementById(`prev-tab-${r}`);
                if (!btn) return;
                if (r === currentPreviewRound) {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-black bg-sky-600 text-white shadow-sm";
                } else {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-100 transition";
                }
            });

            // Update Dropdown selector
            let selectEl = document.getElementById('preview-q-select');
            if (selectEl) {
                selectEl.innerHTML = qList.map(q => `<option value="${q.id}" ${parseInt(q.id) === currentPreviewQId ? 'selected' : ''}>Câu ${q.id} / ${qList.length}</option>`).join('');
            }

            // Update Prev/Next button states
            let curIdx = qList.findIndex(q => parseInt(q.id) === currentPreviewQId);
            if (curIdx === -1) { curIdx = 0; currentPreviewQId = parseInt(qList[0].id) || 1; }
            
            let prevBtn = document.getElementById('btn-prev-q-modal');
            let nextBtn = document.getElementById('btn-next-q-modal');
            if (prevBtn) prevBtn.disabled = curIdx <= 0;
            if (nextBtn) nextBtn.disabled = curIdx >= qList.length - 1;

            // Target question
            let targetQ = qList[curIdx];
            // If viewing currently editing question, merge live form values
            if (adminState.editingQ && String(adminState.editingQ.id) === String(targetQ.id) && adminState.round === currentPreviewRound && document.getElementById('edit-q-text')) {
                targetQ = getLiveEditingQuestionData() || targetQ;
            }

            let bodyEl = document.getElementById('preview-modal-body');
            if (bodyEl) {
                bodyEl.innerHTML = buildFullQuestionPreviewHTML(targetQ, currentPreviewRound, previewShowSolution);
                triggerMathJax();
            }

            document.getElementById('preview-full-question-modal').classList.remove('hidden');
        }

        function closeFullQuestionPreviewModal() {
            document.getElementById('preview-full-question-modal').classList.add('hidden');
        }

        function navigatePreviewQuestion(offset) {
            let qList = adminState.data[currentPreviewRound] || [];
            if (qList.length === 0) return;
            let curIdx = qList.findIndex(q => parseInt(q.id) === currentPreviewQId);
            if (curIdx === -1) curIdx = 0;
            let newIdx = curIdx + offset;
            if (newIdx >= 0 && newIdx < qList.length) {
                openFullQuestionPreviewModal(qList[newIdx].id, currentPreviewRound);
            }
        }

        function switchPreviewRound(round) {
            currentPreviewRound = round;
            let qList = adminState.data[currentPreviewRound] || [];
            let targetId = qList.length > 0 ? qList[0].id : 1;
            openFullQuestionPreviewModal(targetId, currentPreviewRound);
        }

        function togglePreviewSolution(show) {
            previewShowSolution = show;
            openFullQuestionPreviewModal(currentPreviewQId, currentPreviewRound);
        }

        function copyPreviewQuestionText() {
            let qList = adminState.data[currentPreviewRound] || [];
            let targetQ = qList.find(q => parseInt(q.id) === currentPreviewQId);
            if (!targetQ) return showToast("Không tìm thấy câu hỏi!", true);

            let txt = `=== CÂU ${targetQ.id} [${currentPreviewRound.toUpperCase()}] ===\n`;
            txt += `Đề bài: ${targetQ.text || ''}\n\n`;
            
            if (currentPreviewRound === 'round1') {
                (targetQ.options || []).forEach((opt, idx) => {
                    txt += `${['A','B','C','D'][idx]}. ${opt}\n`;
                });
                txt += `\nĐáp án đúng: ${targetQ.answer || ''}\n`;
            } else if (currentPreviewRound === 'round2') {
                (targetQ.statements || []).forEach(st => {
                    txt += `${st.label}) ${st.text} => [${st.isTrue ? 'ĐÚNG' : 'SAI'}]\n`;
                });
            } else if (currentPreviewRound === 'round3') {
                txt += `Đáp án điền khuyết: ${targetQ.answer || ''}\n`;
            }

            if (targetQ.explanation) {
                txt += `\nLời giải chi tiết:\n${targetQ.explanation}\n`;
            }

            navigator.clipboard.writeText(txt).then(() => {
                showToast("Đã sao chép nội dung câu hỏi!");
            }).catch(() => {
                showToast("Không thể sao chép tự động!", true);
            });
        }

        let currentMathTargetId = '';
        function openMathModal(targetId) { currentMathTargetId = targetId; document.getElementById('math-editor').value = document.getElementById(targetId).value || ""; document.getElementById('mathlive-modal').classList.remove('hidden'); setTimeout(() => document.getElementById('math-editor').focus(), 100); }
        function closeMathModal() { document.getElementById('mathlive-modal').classList.add('hidden'); currentMathTargetId = ''; }
        function insertMathToTarget() { if (!currentMathTargetId) return closeMathModal(); let tex = document.getElementById('math-editor').value; let target = document.getElementById(currentMathTargetId); if (target) { let start = target.selectionStart; target.value = target.value.substring(0, start) + tex + target.value.substring(target.selectionEnd); target.focus(); target.selectionStart = target.selectionEnd = start + tex.length; } closeMathModal(); }

        let currentSvgTargetId = 'edit-q-text';
        function openSvgHelperModal(targetId) {
            if (typeof openMathGraphStudio === 'function') {
                openMathGraphStudio(targetId);
            } else {
                let modal = document.getElementById('math-studio-modal') || document.getElementById('svg-helper-modal');
                if (modal) modal.classList.remove('hidden');
            }
        }
        function closeSvgHelperModal() {
            if (typeof closeMathStudio === 'function') {
                closeMathStudio();
            } else {
                let modal = document.getElementById('math-studio-modal') || document.getElementById('svg-helper-modal');
                if (modal) modal.classList.add('hidden');
            }
        }
        function insertSvgTemplate(type) {
            let content = '';
            if (type === 'bbt_bac3') {
                content = `\n$$\\begin{array}{c|ccccc} x & -\\infty & & x_1 & & x_2 & & +\\infty \\\\ \\hline y' & & + & 0 & - & 0 & + & \\\\ \\hline y & & \\nearrow & y_1 & & & \\nearrow & y_2 \\\\ & -\\infty & & & \\searrow & -\\infty & & \\end{array}$$\n`;
            } else if (type === 'bbt_nhatbien') {
                content = `\n$$\\begin{array}{c|ccccc} x & -\\infty & & x_0 & & +\\infty \\\\ \\hline y' & & + & || & + & \\\\ \\hline y & & \\nearrow & || & \\nearrow & \\\\ & y_{tc} & & || & y_{tc} & \\end{array}$$\n`;
            } else if (type === 'graph_bac3') {
                content = `\n<svg class="mx-auto my-3 max-w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f8fafc" rx="12"/><line x1="40" y1="150" x2="360" y2="150" stroke="#334155" stroke-width="2"/><polygon points="360,145 370,150 360,155" fill="#334155"/><text x="365" y="140" font-weight="bold" font-size="14" fill="#334155">x</text><line x1="200" y1="270" x2="200" y2="30" stroke="#334155" stroke-width="2"/><polygon points="195,30 200,20 205,30" fill="#334155"/><text x="210" y="25" font-weight="bold" font-size="14" fill="#334155">y</text><text x="185" y="168" font-weight="bold" font-size="13" fill="#334155">O</text><path d="M 60,240 C 130,40 170,40 200,150 C 230,260 270,260 340,60" fill="none" stroke="#2563eb" stroke-width="3"/></svg>\n`;
            } else if (type === 'graph_parabol') {
                content = `\n<svg class="mx-auto my-3 max-w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f8fafc" rx="12"/><line x1="40" y1="220" x2="360" y2="220" stroke="#334155" stroke-width="2"/><polygon points="360,215 370,220 360,225" fill="#334155"/><text x="365" y="210" font-weight="bold" font-size="14" fill="#334155">x</text><line x1="200" y1="270" x2="200" y2="30" stroke="#334155" stroke-width="2"/><polygon points="195,30 200,20 205,30" fill="#334155"/><text x="210" y="25" font-weight="bold" font-size="14" fill="#334155">y</text><text x="185" y="238" font-weight="bold" font-size="13" fill="#334155">O</text><path d="M 80,60 Q 200,260 320,60" fill="none" stroke="#059669" stroke-width="3"/></svg>\n`;
            } else if (type === 'geo_pyramid') {
                content = `\n<svg class="mx-auto my-3 max-w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f8fafc" rx="12"/><line x1="200" y1="40" x2="80" y2="220" stroke="#1e293b" stroke-width="2"/><line x1="200" y1="40" x2="240" y2="250" stroke="#1e293b" stroke-width="2"/><line x1="200" y1="40" x2="340" y2="200" stroke="#1e293b" stroke-width="2"/><line x1="80" y1="220" x2="240" y2="250" stroke="#1e293b" stroke-width="2"/><line x1="240" y1="250" x2="340" y2="200" stroke="#1e293b" stroke-width="2"/><line x1="80" y1="220" x2="340" y2="200" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5"/><line x1="200" y1="40" x2="200" y2="225" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5"/><text x="195" y="30" font-weight="bold" font-size="14" fill="#1e293b">S</text><text x="65" y="230" font-weight="bold" font-size="14" fill="#1e293b">A</text><text x="240" y="270" font-weight="bold" font-size="14" fill="#1e293b">B</text><text x="350" y="205" font-weight="bold" font-size="14" fill="#1e293b">C</text><text x="195" y="240" font-weight="bold" font-size="14" fill="#1e293b">O</text></svg>\n`;
            } else if (type === 'geo_prism') {
                content = `\n<svg class="mx-auto my-3 max-w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f8fafc" rx="12"/><line x1="100" y1="60" x2="220" y2="60" stroke="#1e293b" stroke-width="2"/><line x1="220" y1="60" x2="300" y2="100" stroke="#1e293b" stroke-width="2"/><line x1="100" y1="60" x2="300" y2="100" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5"/><line x1="100" y1="60" x2="100" y2="200" stroke="#1e293b" stroke-width="2"/><line x1="220" y1="60" x2="220" y2="200" stroke="#1e293b" stroke-width="2"/><line x1="300" y1="100" x2="300" y2="240" stroke="#1e293b" stroke-width="2"/><line x1="100" y1="200" x2="220" y2="200" stroke="#1e293b" stroke-width="2"/><line x1="220" y1="200" x2="300" y2="240" stroke="#1e293b" stroke-width="2"/><line x1="100" y1="200" x2="300" y2="240" stroke="#1e293b" stroke-width="2"/><text x="90" y="55" font-weight="bold" font-size="14" fill="#1e293b">A'</text><text x="220" y="50" font-weight="bold" font-size="14" fill="#1e293b">B'</text><text x="310" y="95" font-weight="bold" font-size="14" fill="#1e293b">C'</text><text x="90" y="215" font-weight="bold" font-size="14" fill="#1e293b">A</text><text x="220" y="215" font-weight="bold" font-size="14" fill="#1e293b">B</text><text x="310" y="255" font-weight="bold" font-size="14" fill="#1e293b">C</text></svg>\n`;
            } else if (type === 'graph_phanthuc_bac2_1') {
                content = `\n<svg class="mx-auto my-3 max-w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f8fafc" rx="12"/><line x1="30" y1="180" x2="370" y2="180" stroke="#334155" stroke-width="2"/><polygon points="370,175 380,180 370,185" fill="#334155"/><text x="375" y="170" font-weight="bold" font-size="14" fill="#334155">x</text><line x1="180" y1="270" x2="180" y2="30" stroke="#334155" stroke-width="2"/><polygon points="175,30 180,20 185,30" fill="#334155"/><text x="190" y="25" font-weight="bold" font-size="14" fill="#334155">y</text><text x="165" y="198" font-weight="bold" font-size="13" fill="#334155">O</text><line x1="220" y1="270" x2="220" y2="30" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,5"/><text x="225" y="265" font-weight="bold" font-size="12" fill="#dc2626">x = 1</text><line x1="40" y1="320" x2="320" y2="40" stroke="#059669" stroke-width="2" stroke-dasharray="5,5"/><text x="310" y="35" font-weight="bold" font-size="13" fill="#059669">y = x</text><path d="M 228 35 Q 240 100 260 100 T 360 40" fill="none" stroke="#1e40af" stroke-width="3"/><path d="M 40 300 Q 120 220 180 220 T 212 265" fill="none" stroke="#1e40af" stroke-width="3"/></svg>\n`;
            } else if (type === 'bbt_phanthuc_bac2_1') {
                content = `\n$$\\begin{array}{c|ccccccc} x & -\\infty & & 0 & & 1 & & 2 & & +\\infty \\\\ \\hline y' & & + & 0 & - & || & - & 0 & + & \\\\ \\hline y & & \\nearrow & -1 & & || & & & +\\infty & \\nearrow \\\\ & -\\infty & & & \\searrow & || & -\\infty & & 3 & \\end{array}$$\n`;
            }

            let target = document.getElementById(currentSvgTargetId);
            if (target) {
                let start = target.selectionStart || target.value.length;
                target.value = target.value.substring(0, start) + content + target.value.substring(target.selectionEnd || target.value.length);
                target.focus();
                if (typeof updateQPreviewLive === 'function') updateQPreviewLive();
                showToast("Đã chèn mẫu SVG / BBT vào câu hỏi!");
            }
            closeSvgHelperModal();
        }

        async function aiRegenerateSvgForCurrentQ(textElementId, previewElementId) {
            let apiKey = getGeminiApiKey();
            if (!apiKey) return showToast("Vui lòng nhập Gemini API Key trong phần Nhập / AI!", true);

            let textEl = document.getElementById(textElementId);
            if (!textEl || !textEl.value.trim()) return showToast("Nội dung câu hỏi rỗng!", true);

            let btn = event ? event.currentTarget : null;
            let oldBtnHtml = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> AI Đang Vẽ Đồ Thị...';
            }

            try {
                let promptText = `Bạn là HỌA SĨ TOÁN HỌC & CHUYÊN GIA ĐỒ HỌA VECTOR SVG TOÁN THPT GDPT 2018.
Nhiệm vụ: Hãy phân tích kỹ câu hỏi Toán sau để xác định hình vẽ cần tạo:
- Loại 1: ĐỒ THỊ HÀM SỐ HỆ TRỤC Oxy (Bậc 3, bậc 4 trùng phương, phân thức, bậc 2, tương giao).
- Loại 2: HÌNH HỌC KHÔNG GIAN 3D & Oxyz (Hình chóp S.ABCD/S.ABC, lăng trụ, hình hộp, hình nón, trụ, cầu, Oxyz).
- Loại 3: BẢNG BIẾN THIÊN hàm số.

YÊU CẦU MÃ SVG VECTOR CHUẨN XÁC 100% HÌNH HỌC & TOÁN HỌC:
1. Trả về DUY NHẤT 1 khối mã SVG đặt trong thẻ <svg class="mx-auto my-3 block max-w-full" viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg">...</svg>.
2. NẾU LÀ ĐỒ THỊ Oxy:
   - Gốc tọa độ O(190, 150), trục hoành Ox, trục tung Oy có mũi tên nhọn và nhãn O, x, y.
   - Các đường tiệm cận đứng / ngang / xiên: nét đứt stroke="#dc2626" stroke-dasharray="4,4".
   - Nhánh đồ thị: <path d="..." fill="none" stroke="#2563eb" stroke-width="2.5"/> uốn mượt đi qua đúng điểm cực trị và tọa độ đặc biệt.
3. NẾU LÀ HÌNH HỌC KHÔNG GIAN 3D:
   - Cạnh nhìn thấy: nét liền rõ nét stroke="#1e293b" stroke-width="2".
   - Cạnh khuất / cạnh đáy ẩn: nét đứt xám stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5".
   - Đường cao ẩn hạ từ đỉnh: nét đứt đỏ stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,4".
   - Nhãn đỉnh (S, A, B, C, D, H...): hiển thị bằng thẻ <text> đậm nét đúng tọa độ đỉnh.
4. NẾU LÀ BẢNG BIẾN THIÊN:
   - Vẽ khung chữ nhật phân hàng x, y', y; mũi tên tăng giảm uốn lượn trực quan.

NỘI DUNG CÂU HỎI:
${textEl.value}`;

                let payload = {
                    systemInstruction: { parts: [{ text: "Bạn là chuyên gia đồ họa toán học THPT. Sinh mã SVG đồ thị chuẩn xác 100% hình học và toán học." }] },
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "OBJECT",
                            properties: {
                                svg: { type: "STRING" }
                            },
                            required: ["svg"]
                        }
                    }
                };

                let data = await callGeminiApiEndpoint(payload, apiKey);
                let jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                let parsed = smartParseJSON(jsonStr);
                if (parsed && parsed.svg) {
                    let svgCode = parsed.svg.trim();
                    if (textEl.value.includes('<svg') && textEl.value.includes('</svg>')) {
                        textEl.value = textEl.value.replace(/<svg[\s\S]*?<\/svg>/gi, svgCode);
                    } else if (textEl.value.includes('$$\\begin{array}') && textEl.value.includes('\\end{array}$$')) {
                        textEl.value = textEl.value.replace(/\$\$\\begin\{array\}[\s\S]*?\\end\{array\}\$\$/gi, svgCode);
                    } else {
                        textEl.value += `\n${svgCode}\n`;
                    }

                    if (typeof updateQPreviewLive === 'function') {
                        updateQPreviewLive(textElementId, previewElementId);
                    }
                    showToast("✨ AI đã vẽ lại đồ thị/BBT SVG chuẩn xác!");
                } else {
                    throw new Error("AI không trả về mã SVG hợp lệ.");
                }
            } catch (err) {
                showToast("Lỗi AI: " + err.message, true);
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = oldBtnHtml;
                }
            }
        }

        function onExportFolderSelectChange(val) {
            let customInput = document.getElementById('export-exam-folder-custom');
            let badge = document.getElementById('export-folder-badge');
            if (val === '__custom__') {
                if (customInput) {
                    customInput.classList.remove('hidden');
                    customInput.focus();
                }
                if (badge) badge.innerText = customInput?.value.trim() || 'TÙY BIẾN';
            } else {
                if (customInput) customInput.classList.add('hidden');
                if (badge) badge.innerText = val;
            }
        }

        function onExportFolderCustomInput(val) {
            let badge = document.getElementById('export-folder-badge');
            if (badge) badge.innerText = val.trim() || 'TÙY BIẾN';
        }

        function getExportExamFolderValue() {
            let sel = document.getElementById('export-exam-folder');
            if (!sel) return 'TOAN 12';
            if (sel.tagName === 'SELECT') {
                if (sel.value === '__custom__') {
                    return document.getElementById('export-exam-folder-custom')?.value.trim() || 'KHAC';
                }
                return sel.value || 'TOAN 12';
            }
            return sel.value ? sel.value.trim() : 'TOAN 12';
        }

        function setExportExamFolderValue(folder) {
            let sel = document.getElementById('export-exam-folder');
            let customInp = document.getElementById('export-exam-folder-custom');
            let badge = document.getElementById('export-folder-badge');
            if (!sel) return;
            let norm = normalizeMathFolder(folder);
            if (sel.tagName === 'SELECT') {
                let hasOpt = Array.from(sel.options).some(o => o.value === norm);
                if (hasOpt) {
                    sel.value = norm;
                    if (customInp) customInp.classList.add('hidden');
                    if (badge) badge.innerText = norm;
                } else if (folder) {
                    sel.value = '__custom__';
                    if (customInp) {
                        customInp.value = folder;
                        customInp.classList.remove('hidden');
                    }
                    if (badge) badge.innerText = folder;
                }
            } else {
                sel.value = norm;
                if (badge) badge.innerText = norm;
            }
        }

        function onEditInfoFolderSelectChange(val) {
            let inp = document.getElementById('edit-info-folder');
            let badge = document.getElementById('edit-info-folder-badge');
            if (val === '__custom__') {
                if (inp) {
                    inp.focus();
                    if (badge) badge.innerText = inp.value.trim() || 'TÙY BIẾN';
                }
            } else {
                if (inp) inp.value = val;
                if (badge) badge.innerText = val;
            }
        }

        function onEditInfoFolderCustomInput(val) {
            let badge = document.getElementById('edit-info-folder-badge');
            let sel = document.getElementById('edit-info-folder-select');
            let norm = normalizeMathFolder(val);
            if (badge) badge.innerText = norm;
            if (sel) {
                let hasOpt = Array.from(sel.options).some(o => o.value === norm);
                if (hasOpt) sel.value = norm;
                else sel.value = '__custom__';
            }
        }

        function setEditInfoFolderQuick(folder) {
            let inp = document.getElementById('edit-info-folder');
            let sel = document.getElementById('edit-info-folder-select');
            let badge = document.getElementById('edit-info-folder-badge');
            let norm = normalizeMathFolder(folder);
            if (inp) inp.value = norm;
            if (sel) {
                let hasOpt = Array.from(sel.options).some(o => o.value === norm);
                if (hasOpt) sel.value = norm;
                else sel.value = '__custom__';
            }
            if (badge) badge.innerText = norm;
        }

        window.onExportFolderSelectChange = onExportFolderSelectChange;
        window.onExportFolderCustomInput = onExportFolderCustomInput;
        window.getExportExamFolderValue = getExportExamFolderValue;
        window.setExportExamFolderValue = setExportExamFolderValue;
        window.onEditInfoFolderSelectChange = onEditInfoFolderSelectChange;
        window.onEditInfoFolderCustomInput = onEditInfoFolderCustomInput;
        window.setEditInfoFolderQuick = setEditInfoFolderQuick;

        function openExportModal() {
            if (adminState.loadedSettings) {
                let expEl = document.getElementById('export-experience-mode');
                if (expEl && adminState.loadedSettings.experienceMode) expEl.value = adminState.loadedSettings.experienceMode;
                let langEl = document.getElementById('export-default-lang');
                if (langEl && adminState.loadedSettings.defaultLanguage) langEl.value = adminState.loadedSettings.defaultLanguage;
                if (adminState.loadedSettings.folder) {
                    setExportExamFolderValue(adminState.loadedSettings.folder);
                }
            }
            if (!adminState.loadedSettings || !adminState.loadedSettings.folder) {
                let curGrade = adminState?.meta?.grade || document.getElementById('ai-prompt-grade')?.value || '12';
                setExportExamFolderValue(getMathFolderFromGrade(curGrade));
            } 
            document.getElementById('export-modal').classList.remove('hidden'); 
            if (adminState.loadedCode) {
                document.getElementById('export-overwrite-container').classList.remove('hidden');
            } else {
                document.getElementById('export-overwrite-container').classList.add('hidden');
            }
        }
        function closeExportModal() { document.getElementById('export-modal').classList.add('hidden'); }
        function exportWordLocal() {
            let html = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Äá» Thi ToĂ¡n & Tin</title></head><body style='font-family: \"Times New Roman\", serif; font-size: 12pt;'><h2 style='text-align:center;'>Äá»€ KIá»‚M TRA</h2><hr/>";
            if(GAME_DATA.round1.length) { html += "<h3>PHáº¦N 1: TRáº®C NGHIá»†M</h3>"; GAME_DATA.round1.forEach((q,i) => { html += `<p><b>CĂ¢u ${i+1}:</b> ${q.text}</p>`; if(q.options) { html += `<p>A. ${q.options[0]} &nbsp; B. ${q.options[1]} &nbsp; C. ${q.options[2]} &nbsp; D. ${q.options[3]}</p>`; } }); }
            if(GAME_DATA.round2.length) { html += "<h3>PHáº¦N 2: ÄĂNG SAI</h3>"; GAME_DATA.round2.forEach((q,i) => { html += `<p><b>CĂ¢u ${i+1}:</b> ${q.text}</p>`; if(q.statements) q.statements.forEach(s => { html += `<p style='margin-left: 20px;'><b>${s.label})</b> ${s.text}</p>`; }); }); }
            if(GAME_DATA.round3.length) { html += "<h3>PHáº¦N 3: TRáº¢ Lá»œI NGáº®N</h3>"; GAME_DATA.round3.forEach((q,i) => { html += `<p><b>CĂ¢u ${i+1}:</b> ${q.text}</p>`; }); }
            html += "</body></html>";
            let link = document.createElement("a"); link.href = URL.createObjectURL(new Blob(['\ufeff', html], { type: 'application/msword' })); link.download = "DeThi_TBS.doc"; link.click();
        }
        function exportJsonDataLocal() { let a = document.createElement('a'); a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(GAME_DATA,null,2)); a.download = "DeThi_TBS.json"; a.click(); }

        async function exportOfflineGameHTML() {
            let name = document.getElementById('export-exam-name').value.trim() || 'Đề Thi Offline';
            let folder = getExportExamFolderValue();
            let timeLimit = parseInt(document.getElementById('export-time-limit').value) || 60;
            let expMode = document.getElementById('export-experience-mode')?.value || 'practice_all';
            let defaultLang = document.getElementById('export-default-lang')?.value || 'vi';
            let mode = (expMode === 'exam') ? 'exam' : 'practice';

            GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));

            let offlineBundle = {
                code: "OFFLINE-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
                data: GAME_DATA,
                settings: {
                    name: name,
                    folder: folder,
                    timeLimit: timeLimit,
                    examMode: mode,
                    experienceMode: expMode,
                    defaultLanguage: defaultLang,
                    offlineMode: true
                }
            };

            let scriptTag = `<script>window.OFFLINE_GAME_DATA = ${JSON.stringify(offlineBundle)};<\/script>`;

            let templateHtml = '';
            try {
                let res = await fetch('student.html');
                if (res.ok) {
                    templateHtml = await res.text();
                }
            } catch(e) {}

            let finalHtml = '';
            if (templateHtml && templateHtml.includes('<head>')) {
                finalHtml = templateHtml.replace('<head>', '<head>\n    ' + scriptTag);
            } else {
                showToast("Lỗi đọc template student.html!", true);
                return;
            }

            let blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            let safeName = name.replace(/[^a-zA-Z0-9_\-áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]/g, '_');
            link.download = `Game_Offline_${safeName}.html`;
            link.click();
            showToast("Đã xuất File Game Offline (HTML) thành công!");
        }
        
        async function exportJsonDataOnline() {
            let name = document.getElementById('export-exam-name').value.trim(); if(!name) return showToast("Nháº­p TĂªn Ä‘á» thi!", true);
            let btn = document.getElementById('btn-export-online'); let oldH = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Xá»¬ LĂ...'; btn.disabled = true;
            GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
            try {
                let code = Math.random().toString(36).substring(2, 8).toUpperCase();
                let isOverwrite = adminState.loadedCode && document.querySelector('input[name="exportOption"]:checked')?.value === 'overwrite';
                if (isOverwrite) {
                    code = adminState.loadedCode;
                }
                let userEmail = state.currentUser ? state.currentUser.email : 'Unknown';
                let expModeOnline = document.getElementById('export-experience-mode')?.value || 'practice_all';
                let defaultLangOnline = document.getElementById('export-default-lang')?.value || 'vi';
                let examModeValOnline = (expModeOnline === 'exam') ? 'exam' : 'practice';
                let publishTarget = document.querySelector('input[name="exportPublishTarget"]:checked')?.value || (expModeOnline.startsWith('game_') ? 'game' : 'exam');
                let isGame = (publishTarget === 'game' || expModeOnline.startsWith('game_'));
                let totalQ = (GAME_DATA.round1?.length || 0) + (GAME_DATA.round2?.length || 0) + (GAME_DATA.round3?.length || 0);

                let settings = { 
                    examMode: examModeValOnline, 
                    experienceMode: expModeOnline, 
                    defaultLanguage: defaultLangOnline, 
                    name: name, 
                    folder: getExportExamFolderValue(), 
                    timeLimit: parseInt(document.getElementById('export-time-limit').value) || 60, 
                    password: document.getElementById('export-exam-password').value.trim(), 
                    openTime: document.getElementById('export-open-time').value ? new Date(document.getElementById('export-open-time').value).toISOString() : null, 
                    closeTime: document.getElementById('export-close-time').value ? new Date(document.getElementById('export-close-time').value).toISOString() : null, 
                    author: userEmail,
                    isGame: isGame,
                    gameMode: isGame ? expModeOnline : null
                };
                await db.collection("SharedGames").doc(code).set({ data: GAME_DATA, settings: settings, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                
                let metadata = { 
                    code: code, 
                    name: name, 
                    folder: settings.folder, 
                    author: userEmail, 
                    date: new Date().toLocaleDateString('vi-VN'), 
                    createdAt: Date.now(),
                    isGame: isGame,
                    type: isGame ? 'game' : 'exam',
                    gameMode: isGame ? expModeOnline : 'practice',
                    questionCount: totalQ
                };
                await db.collection("AdminHistory").doc(code).set(metadata);
                if (isGame) {
                    try {
                        await db.collection("GamesHistory").doc(code).set(metadata);
                        let ghDoc = await db.collection("GameData").doc("GamesHistory").get();
                        let gList = (ghDoc.exists && ghDoc.data().list) ? ghDoc.data().list : [];
                        gList = gList.filter(g => g.code !== code);
                        gList.unshift(metadata);
                        await db.collection("GameData").doc("GamesHistory").set({ list: gList });
                    } catch(e){}
                    try {
                        let localGames = JSON.parse(localStorage.getItem('tbs_saved_games') || '[]');
                        localGames = localGames.filter(g => g.code !== code);
                        localGames.unshift(metadata);
                        localStorage.setItem('tbs_saved_games', JSON.stringify(localGames));
                    } catch(e){}
                }
                
                document.getElementById('export-link-input').value = code; document.getElementById('export-link-container').classList.remove('hidden'); showToast("Ä Ă£ Ä‘á»“ng bá»™ lĂªn cÆ¡ sá»Ÿ dá»¯ liá»‡u!");
            } catch (error) { showToast("Lá»—i: " + error.message, true); } finally { btn.innerHTML = oldH; btn.disabled = false; }
        }
        function copyExportLink(btn) { document.getElementById("export-link-input").select(); document.execCommand("copy"); showToast("Đã chép mã vào khay nhớ tạm!"); }

        // --- OFFICIAL DISPATCH 7991 EXPORT & LIVE PREVIEW SYSTEM ---
        function openCV7991ExportModal() {
            let modal = document.getElementById('export-cv7991-modal');
            if (!modal) return;
            modal.classList.remove('hidden');

            let examNameInput = document.getElementById('export-exam-name');
            if (examNameInput && examNameInput.value.trim()) {
                document.getElementById('cv7991-title').value = examNameInput.value.trim();
            }

            let loadedCode = adminState.loadedCode || Math.floor(100 + Math.random() * 900).toString();
            document.getElementById('cv7991-code').value = loadedCode;

            updateCV7991Preview();
        }

        function closeCV7991ExportModal() {
            let modal = document.getElementById('export-cv7991-modal');
            if (modal) modal.classList.add('hidden');
        }

        function applyCV7991Preset(mode) {
            let btnFormal = document.getElementById('cv7991-preset-formal');
            let btnPractice = document.getElementById('cv7991-preset-practice');

            let incMatrix = document.getElementById('cv7991-inc-matrix');
            let incSpec = document.getElementById('cv7991-inc-spec');
            let incExam = document.getElementById('cv7991-inc-exam');
            let incAnswers = document.getElementById('cv7991-inc-answers');
            let titleInput = document.getElementById('cv7991-title');

            if (mode === 'formal') {
                if (btnFormal) btnFormal.className = "py-2 px-2.5 rounded-xl border border-purple-500 bg-purple-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition font-bold text-xs";
                if (btnPractice) btnPractice.className = "py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1.5 transition font-bold text-xs";

                if (incMatrix) incMatrix.checked = true;
                if (incSpec) incSpec.checked = true;
                if (incExam) incExam.checked = true;
                if (incAnswers) incAnswers.checked = true;

                if (titleInput && (!titleInput.value || titleInput.value.includes('LUYỆN TẬP') || titleInput.value.includes('ÔN TẬP'))) {
                    titleInput.value = 'ĐỀ KIỂM TRA ĐỊNH KÌ NH 2026-2027';
                }
            } else {
                if (btnPractice) btnPractice.className = "py-2 px-2.5 rounded-xl border border-amber-500 bg-amber-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition font-bold text-xs";
                if (btnFormal) btnFormal.className = "py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1.5 transition font-bold text-xs";

                if (incMatrix) incMatrix.checked = false;
                if (incSpec) incSpec.checked = false;
                if (incExam) incExam.checked = true;
                if (incAnswers) incAnswers.checked = true;

                if (titleInput && (!titleInput.value || titleInput.value.includes('ĐỊNH KÌ'))) {
                    let subj = document.getElementById('cv7991-subject')?.value.toUpperCase() || 'TOÁN';
                    titleInput.value = `ĐỀ ÔN TẬP & LUYỆN TẬP MÔN ${subj}`;
                }
            }

            updateCV7991Preview();
        }

        function setCV7991Align(align) {
            let input = document.getElementById('cv7991-text-align');
            if (input) input.value = align;

            let label = document.getElementById('cv7991-align-label');
            const labelMap = {
                'justify': 'canh đều 2 bên',
                'left': 'canh trái',
                'center': 'canh giữa',
                'right': 'canh phải'
            };
            if (label) label.textContent = labelMap[align] || align;

            ['justify', 'left', 'center', 'right'].forEach(a => {
                let btn = document.getElementById(`cv7991-align-btn-${a}`);
                if (btn) {
                    if (a === align) {
                        btn.className = "py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center bg-sky-600 text-white shadow-xs";
                    } else {
                        btn.className = "py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center text-slate-600 hover:bg-slate-100";
                    }
                }
            });

            updateCV7991Preview();
        }

        let cv7991PreviewTimer = null;
        function debouncedUpdateCV7991Preview(delay = 120) {
            if (cv7991PreviewTimer) clearTimeout(cv7991PreviewTimer);
            cv7991PreviewTimer = setTimeout(() => {
                updateCV7991Preview();
            }, delay);
        }

        function updateCV7991Preview() {
            let container = document.getElementById('cv7991-preview-container');
            if (!container) return;

            let meta = getCV7991Meta();
            let marginTop = meta.marginTop;
            let marginBottom = meta.marginBottom;
            let marginLeft = meta.marginLeft;
            let marginRight = meta.marginRight;
            let fontSize = meta.fontSize;
            let textAlign = meta.textAlign;
            let lineHeight = meta.lineHeight;

            // Tạo khung đo ẩn để đếm chiều cao chính xác
            let measurer = document.getElementById('cv7991-measure-wrapper');
            if (!measurer) {
                measurer = document.createElement('div');
                measurer.id = 'cv7991-measure-wrapper';
                measurer.style.cssText = 'position: absolute; left: -9999px; top: 0; width: 210mm; visibility: hidden; pointer-events: none; z-index: -999;';
                document.body.appendChild(measurer);
            }

            measurer.style.width = '210mm';
            measurer.style.fontSize = `${fontSize}pt`;
            measurer.style.lineHeight = `${lineHeight}`;
            measurer.style.textAlign = textAlign;
            measurer.style.fontFamily = "'Times New Roman', Times, serif";
            measurer.style.boxSizing = 'border-box';

            measurer.innerHTML = `
                <div id="cv7991-mm-unit" style="height: 100mm; width: 100mm; position: absolute; left: -9999px;"></div>
                <div id="cv7991-measure-content" style="width: 100%; padding: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm; box-sizing: border-box; font-size: ${fontSize}pt; line-height: ${lineHeight}; text-align: ${textAlign}; font-family: 'Times New Roman', Times, serif;">
                    ${generateCV7991HTML('03')}
                </div>
            `;

            let executePagination = () => {
                let measureContent = document.getElementById('cv7991-measure-content');
                let mmUnit = document.getElementById('cv7991-mm-unit');
                if (!measureContent) return;

                // Tính tỷ lệ px/mm chính xác trên màn hình của người dùng
                let pxPerMm = mmUnit ? (mmUnit.getBoundingClientRect().height / 100) : 3.779527559;
                
                // Chiều cao khả dụng chính xác trong 1 trang A4 (297mm)
                // Khoảng cách bên trong padding = (297 - marginTop - marginBottom) * pxPerMm
                // Trừ đi chân trang (~32px) để không bị đẩy tràn
                let footerHeightPx = 32;
                let printableHeightPx = Math.max(120, ((297 - marginTop - marginBottom) * pxPerMm) - footerHeightPx);

                let blocks = Array.from(measureContent.querySelectorAll('[data-cv7991-block="true"]'));

                let pages = [];
                let currentPageBlocks = [];
                let currentHeight = 0;

                let examStartPageIndex = -1;
                let examEndPageIndex = -1;

                for (let i = 0; i < blocks.length; i++) {
                    let block = blocks[i];
                    let blockStyle = window.getComputedStyle(block);
                    let marginY = (parseFloat(blockStyle.marginTop) || 0) + (parseFloat(blockStyle.marginBottom) || 0);
                    let blockHeight = block.offsetHeight + marginY;

                    let section = block.getAttribute('data-section');
                    let breakBefore = block.getAttribute('data-break-before') === 'true';
                    let breakAfter = block.getAttribute('data-break-after') === 'true';
                    let isHeader = block.getAttribute('data-is-header') === 'true';

                    let needNewPage = false;
                    if (breakBefore && currentPageBlocks.length > 0) {
                        needNewPage = true;
                    } else if (isHeader && i + 1 < blocks.length) {
                        // Chống mồ côi tiêu đề: Nếu Tiêu đề + Khối kế tiếp vượt quá chiều cao trang thì ngắt trang cùng nhau
                        let nextBlock = blocks[i + 1];
                        let nextStyle = window.getComputedStyle(nextBlock);
                        let nextMarginY = (parseFloat(nextStyle.marginTop) || 0) + (parseFloat(nextStyle.marginBottom) || 0);
                        let nextHeight = nextBlock.offsetHeight + nextMarginY;

                        if (currentHeight + blockHeight + nextHeight > printableHeightPx && currentPageBlocks.length > 0) {
                            needNewPage = true;
                        }
                    } else if (currentHeight + blockHeight > printableHeightPx && currentPageBlocks.length > 0) {
                        needNewPage = true;
                    }

                    if (needNewPage) {
                        pages.push(currentPageBlocks);
                        currentPageBlocks = [];
                        currentHeight = 0;
                    }

                    currentPageBlocks.push(block);
                    currentHeight += blockHeight;

                    let currentWorkingPageIndex = pages.length;
                    if (section === 'exam') {
                        if (examStartPageIndex === -1) examStartPageIndex = currentWorkingPageIndex;
                        examEndPageIndex = currentWorkingPageIndex;
                    }

                    if (breakAfter && i + 1 < blocks.length) {
                        pages.push(currentPageBlocks);
                        currentPageBlocks = [];
                        currentHeight = 0;
                    }
                }

                if (currentPageBlocks.length > 0) {
                    pages.push(currentPageBlocks);
                }

                let totalPages = pages.length || 1;
                let examPagesCount = (examStartPageIndex !== -1 && examEndPageIndex !== -1) ? (examEndPageIndex - examStartPageIndex + 1) : totalPages;
                let examPagesText = String(examPagesCount).padStart(2, '0');

                // Cập nhật badge hiển thị trên thanh công cụ
                let badge = document.getElementById('cv7991-page-badge');
                if (badge) {
                    badge.innerHTML = `<i class="fa-solid fa-file-lines mr-1"></i> Tổng số: <b>${totalPages}</b> trang A4 ${meta.incExam ? `(Phần đề thi: <b>${examPagesCount}</b> trang)` : ''}`;
                }

                // Xuất danh sách trang A4 visual
                let pagesHTML = pages.map((pageBlockEls, pIdx) => {
                    let innerHTML = pageBlockEls.map(el => {
                        let html = el.outerHTML;
                        if (el.getAttribute('data-section') === 'exam' && html.includes('(Đề gồm')) {
                            html = html.replace(/\(Đề gồm\s+\d+\s+trang\)/g, `(Đề gồm ${examPagesText} trang)`);
                        }
                        return html;
                    }).join('');

                    return `
                    <div class="cv7991-a4-page bg-white text-slate-900 shadow-2xl rounded-sm box-border relative flex flex-col justify-between transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]"
                         style="width: 210mm; min-height: 297mm; max-height: 297mm; height: 297mm; padding: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm; font-family: 'Times New Roman', Times, serif; font-size: ${fontSize}pt; line-height: ${lineHeight}; text-align: ${textAlign}; text-justify: inter-word; box-sizing: border-box; page-break-after: always; break-after: page; overflow: hidden; position: relative;">
                        <!-- Thân trang -->
                        <div class="cv7991-page-body flex-1 overflow-hidden" style="font-size: ${fontSize}pt; font-family: 'Times New Roman', Times, serif; line-height: ${lineHeight}; text-align: ${textAlign}; text-justify: inter-word;">
                            ${innerHTML}
                        </div>
                        <!-- Chân trang A4 -->
                        <div class="cv7991-page-footer pt-2 mt-auto border-t border-slate-300 text-[11px] text-slate-500 font-sans flex items-center justify-between select-none shrink-0" style="font-family: Arial, sans-serif; height: 26px; line-height: 1;">
                            <span class="font-medium text-slate-400">Công văn 7991/BGDĐT • Mã đề: <b class="text-purple-700">${meta.code}</b></span>
                            <span class="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs text-[10px]">
                                Trang ${pIdx + 1} / ${totalPages}
                            </span>
                        </div>
                    </div>`;
                }).join('');

                container.innerHTML = pagesHTML;
            };

            // Biên dịch công thức toán MathJax TRƯỚC KHI phân trang
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([measurer]).then(() => {
                    setTimeout(executePagination, 30);
                }).catch(() => {
                    executePagination();
                });
            } else {
                executePagination();
            }
        }

        function getCV7991Meta() {
            return {
                school1: document.getElementById('cv7991-school1')?.value.trim() || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO TP. HỒ CHÍ MINH',
                school2: document.getElementById('cv7991-school2')?.value.trim() || 'Trường TH - THCS - THPT Thanh Bình',
                title: document.getElementById('cv7991-title')?.value.trim() || 'ĐỀ KIỂM TRA ĐỊNH KÌ NH 2026-2027',
                subject: document.getElementById('cv7991-subject')?.value.trim() || 'Toán',
                grade: document.getElementById('cv7991-grade')?.value.trim() || '12',
                date: document.getElementById('cv7991-date')?.value.trim() || '13/09/2026',
                duration: document.getElementById('cv7991-duration')?.value.trim() || '90 phút',
                code: document.getElementById('cv7991-code')?.value.trim() || '101',
                numCodes: parseInt(document.getElementById('cv7991-num-codes')?.value) || 1,
                shuffleOptions: document.getElementById('cv7991-shuffle-options')?.checked !== false,
                incAnswerMatrix: document.getElementById('cv7991-inc-answer-matrix')?.checked !== false,
                marginTop: parseFloat(document.getElementById('cv7991-margin-top')?.value) || 20,
                marginBottom: parseFloat(document.getElementById('cv7991-margin-bottom')?.value) || 20,
                marginLeft: parseFloat(document.getElementById('cv7991-margin-left')?.value) || 30,
                marginRight: parseFloat(document.getElementById('cv7991-margin-right')?.value) || 15,
                fontSize: parseFloat(document.getElementById('cv7991-fontsize')?.value) || 13,
                textAlign: document.getElementById('cv7991-text-align')?.value || 'justify',
                lineHeight: parseFloat(document.getElementById('cv7991-linespacing')?.value) || 1.35,
                spacingMode: document.getElementById('cv7991-spacing-mode')?.value || 'normal',
                optionsLayout: document.getElementById('cv7991-options-layout')?.value || 'auto',
                incMatrix: document.getElementById('cv7991-inc-matrix')?.checked,
                incSpec: document.getElementById('cv7991-inc-spec')?.checked,
                incExam: document.getElementById('cv7991-inc-exam')?.checked,
                incAnswers: document.getElementById('cv7991-inc-answers')?.checked,
                breakAfterMatrix: document.getElementById('cv7991-break-after-matrix')?.checked !== false,
                breakAfterSpec: document.getElementById('cv7991-break-after-spec')?.checked !== false,
                breakAfterExam: document.getElementById('cv7991-break-after-exam')?.checked !== false,
                breakBeforeExplain: document.getElementById('cv7991-break-before-explain')?.checked !== false,
                breakExamParts: document.getElementById('cv7991-break-exam-parts')?.checked === true
            };
        }

        // --- OFFICIAL DISPATCH 7991 EXPORT & LIVE PREVIEW SYSTEM ---
        window.cv7991QuestionOverrides = window.cv7991QuestionOverrides || {};

        function openCV7991MatrixEditorModal() {
            let modal = document.getElementById('cv7991-matrix-editor-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            renderCV7991MatrixEditor();
        }

        function closeCV7991MatrixEditorModal() {
            let modal = document.getElementById('cv7991-matrix-editor-modal');
            if (modal) modal.classList.add('hidden');
        }

        function renderCV7991MatrixEditor() {
            let container = document.getElementById('cv7991-matrix-editor-body');
            if (!container) return;

            let meta = getCV7991Meta();
            let data = adminState.data || GAME_DATA || { round1: [], round2: [], round3: [] };
            let analysis = analyzeExamQuestionsCV7991(data, meta.subject, meta.grade);
            let classified = analysis.classifiedQuestions || { round1: [], round2: [], round3: [] };
            let allChapters = analysis.allChapters || (window.MATH_CURRICULUM_KNTT && window.MATH_CURRICULUM_KNTT[meta.grade]?.chapters) || [];

            let buildRoundHTML = (roundKey, roundTitle, items) => {
                if (!items || items.length === 0) return '';
                let rows = items.map((item, idx) => {
                    let q = item.q || {};
                    let qNum = item.qNum || (idx + 1);
                    let qKey = `${roundKey}_${idx}`;
                    let curLevel = item.level || 'Thông hiểu';
                    let curChapterId = item.chapterId || (allChapters[0]?.id || 'c1');

                    let snippet = String(q.text || '').replace(/<[^>]*>/g, '').trim();
                    if (snippet.length > 70) snippet = snippet.substring(0, 70) + '...';

                    let chapterOptions = allChapters.map(ch => `
                        <option value="${ch.id}" ${ch.id === curChapterId ? 'selected' : ''}>${ch.name}</option>
                    `).join('');

                    return `
                    <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
                        <td class="p-2.5 font-bold text-center text-slate-600">${qNum}</td>
                        <td class="p-2.5 max-w-[280px]">
                            <div class="font-medium text-slate-800 truncate" title="${String(q.text || '').replace(/"/g, '&quot;')}">${snippet || '<i>(Không có nội dung)</i>'}</div>
                        </td>
                        <td class="p-2.5">
                            <select onchange="updateCV7991QuestionOverride('${qKey}', 'chapterId', this.value)" class="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white outline-none focus:border-indigo-500">
                                ${chapterOptions || `<option value="${curChapterId}">Chủ đề mặc định</option>`}
                            </select>
                        </td>
                        <td class="p-2.5 text-center">
                            <select onchange="updateCV7991QuestionOverride('${qKey}', 'level', this.value)" class="p-1.5 border border-slate-200 rounded-lg text-xs font-bold ${curLevel === 'Nhận biết' ? 'text-emerald-700 bg-emerald-50' : curLevel === 'Thông hiểu' ? 'text-blue-700 bg-blue-50' : 'text-rose-700 bg-rose-50'} outline-none focus:border-indigo-500">
                                <option value="Nhận biết" ${curLevel === 'Nhận biết' ? 'selected' : ''}>Nhận biết</option>
                                <option value="Thông hiểu" ${curLevel === 'Thông hiểu' ? 'selected' : ''}>Thông hiểu</option>
                                <option value="Vận dụng" ${curLevel === 'Vận dụng' ? 'selected' : ''}>Vận dụng</option>
                            </select>
                        </td>
                    </tr>`;
                }).join('');

                return `
                <div class="mb-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div class="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                        <span class="font-black text-xs uppercase text-slate-800">${roundTitle} (${items.length} câu)</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                                    <th class="p-2 text-center w-12">Câu</th>
                                    <th class="p-2">Trích đoạn câu hỏi</th>
                                    <th class="p-2 w-64">Chương / Chủ đề</th>
                                    <th class="p-2 text-center w-36">Mức độ nhận thức</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>`;
            };

            let html = `
            <div class="space-y-4">
                ${buildRoundHTML('round1', 'Phần I: Câu hỏi trắc nghiệm 4 lựa chọn', classified.round1)}
                ${buildRoundHTML('round2', 'Phần II: Câu hỏi trắc nghiệm Đúng/Sai', classified.round2)}
                ${buildRoundHTML('round3', 'Phần III: Câu hỏi trắc nghiệm Trả lời ngắn', classified.round3)}
            </div>`;

            container.innerHTML = html;
        }

        function updateCV7991QuestionOverride(qKey, field, val) {
            window.cv7991QuestionOverrides[qKey] = window.cv7991QuestionOverrides[qKey] || {};
            window.cv7991QuestionOverrides[qKey][field] = val;
            updateCV7991Preview();
            renderCV7991MatrixEditor();
        }

        function applyCV7991DistributionPreset(presetType) {
            let data = adminState.data || GAME_DATA || { round1: [], round2: [], round3: [] };
            let r1 = data.round1 || [];
            let r2 = data.round2 || [];
            let r3 = data.round3 || [];

            if (presetType === 'reset') {
                window.cv7991QuestionOverrides = {};
            } else if (presetType === '40-30-30') {
                // 40% Nhận biết, 30% Thông hiểu, 30% Vận dụng
                r1.forEach((_, idx) => {
                    let lvl = idx < 6 ? 'Nhận biết' : idx < 10 ? 'Thông hiểu' : 'Vận dụng';
                    window.cv7991QuestionOverrides[`round1_${idx}`] = window.cv7991QuestionOverrides[`round1_${idx}`] || {};
                    window.cv7991QuestionOverrides[`round1_${idx}`].level = lvl;
                });
                r2.forEach((_, idx) => {
                    let lvl = idx < 2 ? 'Thông hiểu' : 'Vận dụng';
                    window.cv7991QuestionOverrides[`round2_${idx}`] = window.cv7991QuestionOverrides[`round2_${idx}`] || {};
                    window.cv7991QuestionOverrides[`round2_${idx}`].level = lvl;
                });
                r3.forEach((_, idx) => {
                    let lvl = idx < 2 ? 'Thông hiểu' : 'Vận dụng';
                    window.cv7991QuestionOverrides[`round3_${idx}`] = window.cv7991QuestionOverrides[`round3_${idx}`] || {};
                    window.cv7991QuestionOverrides[`round3_${idx}`].level = lvl;
                });
            } else if (presetType === '30-40-30') {
                // 30% Nhận biết, 40% Thông hiểu, 30% Vận dụng
                r1.forEach((_, idx) => {
                    let lvl = idx < 4 ? 'Nhận biết' : idx < 9 ? 'Thông hiểu' : 'Vận dụng';
                    window.cv7991QuestionOverrides[`round1_${idx}`] = window.cv7991QuestionOverrides[`round1_${idx}`] || {};
                    window.cv7991QuestionOverrides[`round1_${idx}`].level = lvl;
                });
                r2.forEach((_, idx) => {
                    let lvl = idx < 2 ? 'Thông hiểu' : 'Vận dụng';
                    window.cv7991QuestionOverrides[`round2_${idx}`] = window.cv7991QuestionOverrides[`round2_${idx}`] || {};
                    window.cv7991QuestionOverrides[`round2_${idx}`].level = lvl;
                });
                r3.forEach((_, idx) => {
                    window.cv7991QuestionOverrides[`round3_${idx}`] = window.cv7991QuestionOverrides[`round3_${idx}`] || {};
                    window.cv7991QuestionOverrides[`round3_${idx}`].level = 'Vận dụng';
                });
            }

            updateCV7991Preview();
            renderCV7991MatrixEditor();
            showToast("Đã áp dụng tỉ lệ phân bố ma trận thành công!");
        }

        function analyzeExamQuestionsCV7991(data, subjectStr = '', gradeStr = '12') {
            let r1 = data.round1 || [];
            let r2 = data.round2 || [];
            let r3 = data.round3 || [];
            let totalQCount = r1.length + r2.length + r3.length;

            let cleanSubject = removeVietnameseTones(subjectStr).toLowerCase();

            // Nếu là môn Toán và có sẵn Module Khung Chương Trình KNTT
            if (typeof window.interpolateMathCV7991 === 'function' && (cleanSubject.includes('toan') || cleanSubject === '')) {
                let interpolated = window.interpolateMathCV7991(data, gradeStr, subjectStr, window.cv7991QuestionOverrides);
                return {
                    topicList: interpolated.activeChapters,
                    classifiedQuestions: interpolated.classifiedQuestions,
                    allChapters: interpolated.allChapters,
                    totalQCount: interpolated.totalQ
                };
            }

            function detectQuestionTopic(q, defaultIdx, roundType, qIndex) {
                let qKey = `${roundType}_${qIndex}`;
                if (window.cv7991QuestionOverrides[qKey]?.chapterId) {
                    return window.cv7991QuestionOverrides[qKey].chapterId;
                }
                if (q.topic || q.chuDe || q.category || q.chapter) {
                    return q.topic || q.chuDe || q.category || q.chapter;
                }

                let txt = removeVietnameseTones(String(q.text || '') + ' ' + String(q.explanation || '')).toLowerCase();

                // 1. Môn Toán
                if (cleanSubject.includes('toan') || cleanSubject === '') {
                    if (txt.includes('dao ham') || txt.includes('bien thien') || txt.includes('cuc tri') || txt.includes('tiem can') || txt.includes('do thi') || txt.includes('khao sat') || txt.includes('gtnn') || txt.includes('gtln')) {
                        return 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số';
                    }
                    if (txt.includes('nguyen ham') || txt.includes('tich phan') || txt.includes('dientich') || txt.includes('tron xoay')) {
                        return 'Nguyên hàm - Tích phân và ứng dụng';
                    }
                    if (txt.includes('mu') || txt.includes('logarit') || txt.includes('log') || txt.includes('luy thua')) {
                        return 'Hàm số mũ và Hàm số lôgarit';
                    }
                    if (txt.includes('oxyz') || txt.includes('mat phang') || txt.includes('duong thang') || txt.includes('mat cau') || txt.includes('toa do trong khong gian')) {
                        return 'Hệ tọa độ trong không gian Oxyz';
                    }
                    if (txt.includes('so phuc') || txt.includes('phan thuc') || txt.includes('phan ao') || txt.includes('modun') || txt.includes('mo dun')) {
                        return 'Số phức và các phép toán';
                    }
                    if (txt.includes('lang tru') || txt.includes('chop') || txt.includes('non') || txt.includes('tru') || txt.includes('cau') || txt.includes('khoi da dien')) {
                        return 'Hình học không gian & Khối đa diện';
                    }
                    if (txt.includes('xac suat') || txt.includes('to hop') || txt.includes('chinh hop') || txt.includes('hoan vi') || txt.includes('nhi thuc')) {
                        return 'Đại số tổ hợp & Xác suất';
                    }
                    if (txt.includes('day so') || txt.includes('cap so cong') || txt.includes('cap so nhan') || txt.includes('lim') || txt.includes('gioi han')) {
                        return 'Dãy số, Cấp số cộng và Cấp số nhân';
                    }
                    if (txt.includes('luong giac') || txt.includes('sin') || txt.includes('cos') || txt.includes('tan')) {
                        return 'Hàm số lượng giác và Phương trình lượng giác';
                    }
                    if (txt.includes('vector') || txt.includes('vecto') || txt.includes('tich vo huong')) {
                        return 'Vectơ và Hệ tọa độ trong mặt phẳng';
                    }
                    return 'Hàm số và Đại số tổng hợp';
                }

                // 2. Môn Vật lý
                if (cleanSubject.includes('ly') || cleanSubject.includes('vat ly')) {
                    if (txt.includes('dao dong') || txt.includes('con lac')) return 'Dao động cơ học';
                    if (txt.includes('song') || txt.includes('tan so') || txt.includes('buoc song')) return 'Sóng cơ và Sóng âm';
                    if (txt.includes('xoay chieu') || txt.includes('dien ap') || txt.includes('cuong do')) return 'Dòng điện xoay chiều';
                    if (txt.includes('quang hoc') || txt.includes('anh sang') || txt.includes('giao thoa')) return 'Sóng ánh sáng & Lượng tử ánh sáng';
                    if (txt.includes('hat nhan') || txt.includes('phong xa')) return 'Vật lý hạt nhân';
                    return 'Vật lý đại cương & Ứng dụng';
                }

                // 3. Môn Hóa học
                if (cleanSubject.includes('hoa')) {
                    if (txt.includes('ester') || txt.includes('lipit') || txt.includes('xa phong')) return 'Este - Lipit';
                    if (txt.includes('cacbohidrat') || txt.includes('glucozo') || txt.includes('saccarozo')) return 'Cacbohidrat';
                    if (txt.includes('amin') || txt.includes('amino axit') || txt.includes('peptit') || txt.includes('protein')) return 'Amin - Amino axit - Peptit';
                    if (txt.includes('polime') || txt.includes('nhua')) return 'Polime và Vật liệu polime';
                    if (txt.includes('kim loai') || txt.includes('dien phan') || txt.includes('an mon')) return 'Kim loại & Ăn mòn kim loại';
                    return 'Hóa học đại cương & Hữu cơ';
                }

                // 4. Môn Tiếng Anh
                if (cleanSubject.includes('anh') || cleanSubject.includes('english')) {
                    if (txt.includes('pronunciation') || txt.includes('stress')) return 'Phonetics & Stress';
                    if (txt.includes('grammar') || txt.includes('tense')) return 'Grammar & Vocabulary';
                    if (txt.includes('reading') || txt.includes('passage')) return 'Reading Comprehension';
                    if (txt.includes('rewrite') || txt.includes('meaning')) return 'Sentence Transformation';
                    return 'English Language Skills';
                }

                return `Chủ đề / Kiến thức tổng hợp ${defaultIdx + 1}`;
            }

            function detectQuestionLevel(q, roundType, qIndex) {
                let qKey = `${roundType}_${qIndex}`;
                if (window.cv7991QuestionOverrides[qKey]?.level) {
                    return window.cv7991QuestionOverrides[qKey].level;
                }
                if (q.level || q.mucDo || q.levelName) {
                    let l = removeVietnameseTones(String(q.level || q.mucDo || q.levelName)).toLowerCase();
                    if (l.includes('nhan') || l.includes('nbi') || l.includes('easy') || l.includes('1')) return 'Nhận biết';
                    if (l.includes('hieu') || l.includes('thie') || l.includes('medium') || l.includes('2')) return 'Thông hiểu';
                    if (l.includes('van') || l.includes('vd') || l.includes('hard') || l.includes('3')) return 'Vận dụng';
                }

                let txt = removeVietnameseTones(String(q.text || '')).toLowerCase();

                if (roundType === 'round1') {
                    if (txt.includes('cho') || txt.includes('biet') || txt.includes('la gi') || txt.includes('phuong trinh nao') || txt.includes('toa do')) {
                        return 'Nhận biết';
                    }
                    if (txt.includes('tim m') || txt.includes('co bao nhieu') || txt.includes('khang dinh nao')) {
                        return 'Thông hiểu';
                    }
                    return (q.id && q.id % 2 === 0) ? 'Thông hiểu' : 'Nhận biết';
                }

                if (roundType === 'round2') {
                    if (txt.includes('giai quyet') || txt.includes('thuc te') || txt.includes('lon nhat') || txt.includes('nho nhat') || txt.includes('toi da')) {
                        return 'Vận dụng';
                    }
                    return 'Thông hiểu';
                }

                if (roundType === 'round3') {
                    return 'Vận dụng';
                }

                return 'Thông hiểu';
            }

            let topicsMap = {};
            let classifiedQuestions = { round1: [], round2: [], round3: [] };

            let processQuestion = (q, roundType, qIndex) => {
                let topicName = detectQuestionTopic(q, Object.keys(topicsMap).length, roundType, qIndex);
                let levelName = detectQuestionLevel(q, roundType, qIndex);

                if (!topicsMap[topicName]) {
                    topicsMap[topicName] = {
                        name: topicName,
                        r1: [],
                        r2: [],
                        r3: [],
                        levels: { 'Nhận biết': 0, 'Thông hiểu': 0, 'Vận dụng': 0 }
                    };
                }

                let entry = topicsMap[topicName];
                entry.levels[levelName] = (entry.levels[levelName] || 0) + 1;

                let qInfo = { q, qNum: qIndex + 1, level: levelName, chapterId: topicName, chapterName: topicName };

                if (roundType === 'round1') {
                    entry.r1.push(qInfo);
                    classifiedQuestions.round1.push(qInfo);
                } else if (roundType === 'round2') {
                    entry.r2.push(qInfo);
                    classifiedQuestions.round2.push(qInfo);
                } else if (roundType === 'round3') {
                    entry.r3.push(qInfo);
                    classifiedQuestions.round3.push(qInfo);
                }
            };

            r1.forEach((q, idx) => processQuestion(q, 'round1', idx));
            r2.forEach((q, idx) => processQuestion(q, 'round2', idx));
            r3.forEach((q, idx) => processQuestion(q, 'round3', idx));

            return {
                topicList: Object.values(topicsMap),
                classifiedQuestions,
                allChapters: [],
                totalQCount
            };
        }

        function generateCV7991HTML(examPagesCountText = '03') {
            let meta = getCV7991Meta();
            let data = adminState.data || GAME_DATA || { round1: [], round2: [], round3: [] };
            let r1 = data.round1 || [];
            let r2 = data.round2 || [];
            let r3 = data.round3 || [];

            let analysis = analyzeExamQuestionsCV7991(data, meta.subject, meta.grade);
            let topicList = analysis.topicList;
            let totalQCount = analysis.totalQCount;

            let qMarginBottom = meta.spacingMode === 'compact' ? '7px' : meta.spacingMode === 'relaxed' ? '18px' : '11px';
            let stmtMargin = meta.spacingMode === 'compact' ? '1px 0' : meta.spacingMode === 'relaxed' ? '4px 0' : '2px 0';

            let renderPartIOptions = (opts) => {
                if (!opts || opts.length === 0) return '';
                let layout = meta.optionsLayout;
                let cols = 2;
                if (layout === '4-col') cols = 4;
                else if (layout === '2-col') cols = 2;
                else if (layout === '1-col') cols = 1;
                else {
                    let rawMax = Math.max(...opts.map(o => String(o || '').replace(/<[^>]*>/g, '').trim().length));
                    if (rawMax <= 18) cols = 4;
                    else if (rawMax <= 42) cols = 2;
                    else cols = 1;
                }

                let gridStyle = cols === 4 ? 'repeat(4, 1fr)' : cols === 2 ? 'repeat(2, 1fr)' : '1fr';
                return `
                <div style="display: grid; grid-template-columns: ${gridStyle}; gap: 3px 10px; margin-left: 15px; text-align: left;">
                    <div><b>A.</b> ${sanitizeMathText(opts[0] || '')}</div>
                    <div><b>B.</b> ${sanitizeMathText(opts[1] || '')}</div>
                    <div><b>C.</b> ${sanitizeMathText(opts[2] || '')}</div>
                    <div><b>D.</b> ${sanitizeMathText(opts[3] || '')}</div>
                </div>`;
            };

            let html = '';

            // 1. PART I: MA TRẬN ĐỀ THI
            if (meta.incMatrix) {
                let totalR1 = 0, totalR2 = 0, totalR3 = 0;
                let totalNB = 0, totalTH = 0, totalVD = 0;

                let matrixRows = topicList.map((tp, idx) => {
                    let nbCount = tp.levels['Nhận biết'] || 0;
                    let thCount = tp.levels['Thông hiểu'] || 0;
                    let vdCount = tp.levels['Vận dụng'] || 0;

                    let r1Count = tp.r1.length;
                    let r2Count = tp.r2.length;
                    let r3Count = tp.r3.length;
                    let rowTotal = r1Count + r2Count + r3Count;

                    totalNB += nbCount;
                    totalTH += thCount;
                    totalVD += vdCount;
                    totalR1 += r1Count;
                    totalR2 += r2Count;
                    totalR3 += r3Count;

                    let pct = totalQCount > 0 ? Math.round((rowTotal / totalQCount) * 100) : 0;

                    return `
                    <tr>
                        <td style="border: 1px solid black; text-align: center;">${idx + 1}</td>
                        <td style="border: 1px solid black; text-align: left; padding-left: 8px;"><b>${tp.name}</b></td>
                        <td style="border: 1px solid black; text-align: center;">${nbCount || '-'}</td>
                        <td style="border: 1px solid black; text-align: center;">${thCount || '-'}</td>
                        <td style="border: 1px solid black; text-align: center;">${vdCount || '-'}</td>
                        <td style="border: 1px solid black; text-align: center;">${r1Count || '-'}</td>
                        <td style="border: 1px solid black; text-align: center;">${r2Count || '-'}</td>
                        <td style="border: 1px solid black; text-align: center;">${r3Count || '-'}</td>
                        <td style="border: 1px solid black; text-align: center; font-weight: bold;">${rowTotal}</td>
                        <td style="border: 1px solid black; text-align: center; font-weight: bold;">${pct}%</td>
                    </tr>`;
                }).join('');

                let grandTotal = totalR1 + totalR2 + totalR3;

                html += `
                <div data-cv7991-block="true" data-section="matrix" ${meta.breakAfterMatrix ? 'data-break-after="true"' : ''} style="margin-bottom: 20px;">
                    <h2 style="text-align: center; font-weight: bold; font-size: 1.05em; text-transform: uppercase; margin-bottom: 12px;">PHẦN I: MA TRẬN ĐỀ THI ĐỊNH KỲ MÔN ${meta.subject.toUpperCase()} - KHỐI ${meta.grade}</h2>
                    <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 8px; font-size: 0.88em;" border="1" cellpadding="4" cellspacing="0">
                        <thead>
                            <tr style="background-color: #f3f4f6; font-weight: bold;">
                                <th style="border: 1px solid black;" rowspan="2">STT</th>
                                <th style="border: 1px solid black;" rowspan="2">Chủ đề / Nội dung kiến thức</th>
                                <th style="border: 1px solid black;" colspan="3">Mức độ đánh giá</th>
                                <th style="border: 1px solid black;" colspan="3">Số câu hỏi theo dạng</th>
                                <th style="border: 1px solid black;" rowspan="2">Tổng câu</th>
                                <th style="border: 1px solid black;" rowspan="2">Tỷ lệ %</th>
                            </tr>
                            <tr style="background-color: #f3f4f6; font-weight: bold;">
                                <th style="border: 1px solid black;">Nhận biết</th>
                                <th style="border: 1px solid black;">Thông hiểu</th>
                                <th style="border: 1px solid black;">Vận dụng</th>
                                <th style="border: 1px solid black;">T.Nghiệm</th>
                                <th style="border: 1px solid black;">Đúng/Sai</th>
                                <th style="border: 1px solid black;">T.Lời Ngắn</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${matrixRows}
                            <tr style="font-weight: bold; background-color: #f9fafb;">
                                <td style="border: 1px solid black;" colspan="2">TỔNG CỘNG</td>
                                <td style="border: 1px solid black; text-align: center;">${totalNB}</td>
                                <td style="border: 1px solid black; text-align: center;">${totalTH}</td>
                                <td style="border: 1px solid black; text-align: center;">${totalVD}</td>
                                <td style="border: 1px solid black; text-align: center;">${totalR1}</td>
                                <td style="border: 1px solid black; text-align: center;">${totalR2}</td>
                                <td style="border: 1px solid black; text-align: center;">${totalR3}</td>
                                <td style="border: 1px solid black; text-align: center;">${grandTotal}</td>
                                <td style="border: 1px solid black; text-align: center;">100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`;
            }

            // 2. PART II: BẢNG ĐẶC TẢ ĐỀ THI
            if (meta.incSpec) {
                let specRows = '';
                let specIndex = 1;

                topicList.forEach((tp) => {
                    ['Nhận biết', 'Thông hiểu', 'Vận dụng'].forEach((level) => {
                        let qR1 = tp.r1.filter(item => item.level === level);
                        let qR2 = tp.r2.filter(item => item.level === level);
                        let qR3 = tp.r3.filter(item => item.level === level);

                        if (qR1.length === 0 && qR2.length === 0 && qR3.length === 0) return;

                        let reqText = '';
                        if (tp.outcomes && tp.outcomes[level]) {
                            reqText = tp.outcomes[level];
                        } else {
                            if (level === 'Nhận biết') {
                                reqText = `Nhận biết được các khái niệm, công thức và thuộc tính cơ bản thuộc phần <i>${tp.name}</i>.`;
                            } else if (level === 'Thông hiểu') {
                                reqText = `Thông hiểu, giải thích và thực hiện được các phép toán, biến đổi liên quan đến <i>${tp.name}</i>.`;
                            } else {
                                reqText = `Vận dụng linh hoạt kiến thức, kỹ năng nâng cao về <i>${tp.name}</i> để giải quyết các bài toán thực tế và bài toán liên môn.`;
                            }
                        }

                        let qDescParts = [];
                        if (qR1.length > 0) {
                            let nums = qR1.map(x => `Câu ${x.qNum}`).join(', ');
                            qDescParts.push(`${nums} (${qR1.length} câu TN4LC)`);
                        }
                        if (qR2.length > 0) {
                            let nums = qR2.map(x => `Câu ${x.qNum}`).join(', ');
                            qDescParts.push(`${nums} (${qR2.length} câu Đúng/Sai)`);
                        }
                        if (qR3.length > 0) {
                            let nums = qR3.map(x => `Câu ${x.qNum}`).join(', ');
                            qDescParts.push(`${nums} (${qR3.length} câu TLN)`);
                        }

                        let qDesc = qDescParts.join('<br/>');

                        specRows += `
                        <tr>
                            <td style="border: 1px solid black; text-align: center;">${specIndex++}</td>
                            <td style="border: 1px solid black; text-align: left; padding-left: 6px;"><b>${tp.name}</b></td>
                            <td style="border: 1px solid black; text-align: center; font-weight: bold; color: ${level === 'Nhận biết' ? '#047857' : level === 'Thông hiểu' ? '#1d4ed8' : '#b91c1c'};">${level}</td>
                            <td style="border: 1px solid black; text-align: left; padding: 5px;">${reqText}</td>
                            <td style="border: 1px solid black; text-align: center; font-size: 0.85em; padding: 4px;">${qDesc}</td>
                        </tr>`;
                    });
                });

                html += `
                <div data-cv7991-block="true" data-section="spec" ${meta.breakAfterSpec ? 'data-break-after="true"' : ''} style="margin-bottom: 20px;">
                    <h2 style="text-align: center; font-weight: bold; font-size: 1.05em; text-transform: uppercase; margin-bottom: 12px;">PHẦN II: BẢNG ĐẶC TẢ ĐỀ THI ĐỊNH KỲ MÔN ${meta.subject.toUpperCase()} - KHỐI ${meta.grade}</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 0.88em;" border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr style="background-color: #f3f4f6; font-weight: bold; text-align: center;">
                                <th style="border: 1px solid black; width: 36px;">STT</th>
                                <th style="border: 1px solid black; width: 25%;">Nội dung kiến thức</th>
                                <th style="border: 1px solid black; width: 15%;">Mức độ đánh giá</th>
                                <th style="border: 1px solid black;">Yêu cầu cần đạt</th>
                                <th style="border: 1px solid black; width: 22%;">Số câu hỏi theo dạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${specRows}
                        </tbody>
                    </table>
                </div>`;
            }

            // 3. PART III: ĐỀ THI CHÍNH THỨC (HỖ TRỢ ĐA MÃ ĐỀ: 1 ĐẾN 12 MÃ ĐỀ)
            let generatedExamsList = [];
            if (meta.numCodes > 1 && typeof window.generateMultiExamCodes === 'function') {
                generatedExamsList = window.generateMultiExamCodes(data, meta.numCodes, meta.code, { shuffleOptionsPartI: meta.shuffleOptions });
            } else {
                generatedExamsList = [{ code: meta.code, data: data }];
            }

            if (meta.incExam) {
                generatedExamsList.forEach((examItem, eIdx) => {
                    let curCode = examItem.code;
                    let curData = examItem.data;
                    let curR1 = curData.round1 || [];
                    let curR2 = curData.round2 || [];
                    let curR3 = curData.round3 || [];

                    html += `
                    <div data-cv7991-block="true" data-section="exam" ${eIdx > 0 ? 'data-break-before="true"' : ''} style="margin-bottom: 16px;">
                        <table style="width: 100%; border: none; margin-bottom: 10px;">
                            <tr>
                                <td style="width: 50%; text-align: center; vertical-align: top; font-size: 0.95em; line-height: 1.25;">
                                    <b>${meta.school1}</b><br/>
                                    <b>${meta.school2}</b><br/>
                                    <span style="font-style: italic; font-size: 0.9em;">(Đề gồm ${examPagesCountText} trang)</span>
                                </td>
                                <td style="width: 50%; text-align: center; vertical-align: top; font-size: 0.95em; line-height: 1.25;">
                                    <b>${meta.title}</b><br/>
                                    <b>Môn: ${meta.subject}; &nbsp; Khối ${meta.grade}</b><br/>
                                    <b>Ngày kiểm tra: ${meta.date}</b><br/>
                                    <span style="font-style: italic; font-size: 0.9em;">Thời gian làm bài: ${meta.duration}, không kể thời gian phát đề</span>
                                </td>
                            </tr>
                        </table>

                        <div style="margin-top: 10px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 8px; font-size: 0.95em;">
                            Họ tên học sinh: ....................................................................... 
                            Số báo danh: ............................. 
                            <span style="border: 2px solid black; padding: 2px 8px; font-weight: bold; float: right;">Mã đề: ${curCode}</span>
                            <div style="clear: both;"></div>
                        </div>
                    </div>`;

                    // PHẦN I câu hỏi
                    if (curR1.length > 0) {
                        html += `
                        <div data-cv7991-block="true" data-section="exam" data-is-header="true" style="margin-bottom: 8px;">
                            <p style="font-weight: bold; margin-bottom: 6px; text-align: justify; text-justify: inter-word;">PHẦN I. Câu hỏi trắc nghiệm nhiều lựa chọn. Thí sinh trả lời từ câu 1 đến câu ${curR1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.</p>
                        </div>`;

                        curR1.forEach((q, idx) => {
                            html += `
                            <div data-cv7991-block="true" data-section="exam" data-is-question="true" style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
                                <p style="margin-bottom: 3px; text-align: ${meta.textAlign}; text-justify: inter-word;"><b>Câu ${idx + 1}:</b> ${sanitizeMathText(q.text)}</p>
                                ${q.options ? renderPartIOptions(q.options) : ''}
                            </div>`;
                        });
                    }

                    // PHẦN II câu hỏi
                    if (curR2.length > 0) {
                        html += `
                        <div data-cv7991-block="true" data-section="exam" data-is-header="true" ${meta.breakExamParts ? 'data-break-before="true"' : ''} style="margin-top: 12px; margin-bottom: 8px;">
                            <p style="font-weight: bold; margin-bottom: 6px; text-align: justify; text-justify: inter-word;">PHẦN II. Câu hỏi trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu ${curR2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.</p>
                        </div>`;

                        curR2.forEach((q, idx) => {
                            html += `
                            <div data-cv7991-block="true" data-section="exam" data-is-question="true" style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
                                <p style="margin-bottom: 3px; text-align: ${meta.textAlign}; text-justify: inter-word;"><b>Câu ${idx + 1}:</b> ${sanitizeMathText(q.text)}</p>
                                <div style="margin-left: 20px;">
                                    ${(q.statements || []).map(s => `
                                        <p style="margin: ${stmtMargin}; text-align: ${meta.textAlign}; text-justify: inter-word;"><b>${s.label})</b> ${sanitizeMathText(s.text)}</p>
                                    `).join('')}
                                </div>
                            </div>`;
                        });
                    }

                    // PHẦN III câu hỏi
                    if (curR3.length > 0) {
                        html += `
                        <div data-cv7991-block="true" data-section="exam" data-is-header="true" ${meta.breakExamParts ? 'data-break-before="true"' : ''} style="margin-top: 12px; margin-bottom: 8px;">
                            <p style="font-weight: bold; margin-bottom: 6px; text-align: justify; text-justify: inter-word;">PHẦN III. Câu hỏi trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu ${curR3.length}.</p>
                        </div>`;

                        curR3.forEach((q, idx) => {
                            html += `
                            <div data-cv7991-block="true" data-section="exam" data-is-question="true" style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
                                <p style="margin-bottom: 3px; text-align: ${meta.textAlign}; text-justify: inter-word;"><b>Câu ${idx + 1}:</b> ${sanitizeMathText(q.text)}</p>
                            </div>`;
                        });
                    }

                    // Hết đề
                    html += `
                    <div data-cv7991-block="true" data-section="exam" ${meta.breakAfterExam ? 'data-break-after="true"' : ''} style="text-align: center; font-weight: bold; margin-top: 15px; margin-bottom: 15px;">
                        -------------- HẾT (MÃ ĐỀ ${curCode}) --------------
                    </div>`;
                });
            }

            // 4. PART IV: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM
            if (meta.incAnswers) {
                let getR1ChoiceLabel = (q) => {
                    if (!q.options || !q.answer) return 'A';
                    let ansStr = String(q.answer).trim();
                    if (['A','B','C','D'].includes(ansStr.toUpperCase())) return ansStr.toUpperCase();
                    let idx = q.options.findIndex(opt => String(opt).trim() === ansStr);
                    return idx !== -1 ? ['A','B','C','D'][idx] : 'A';
                };

                html += `
                <div data-cv7991-block="true" data-section="answers" data-break-before="true" data-is-header="true" style="margin-top: 20px; margin-bottom: 12px;">
                    <h2 style="text-align: center; font-weight: bold; font-size: 1.05em; text-transform: uppercase;">PHẦN IV: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (MÃ ĐỀ ${meta.code})</h2>
                </div>`;

                if (r1.length > 0) {
                    html += `
                    <div data-cv7991-block="true" data-section="answers" style="margin-bottom: 15px;">
                        <p style="font-weight: bold; margin-bottom: 6px;">1. BẢNG ĐÁP ÁN PHẦN I (Trắc nghiệm 4 lựa chọn)</p>
                        <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 10px; font-size: 0.88em;" border="1" cellpadding="4">
                            <tr style="background-color: #f3f4f6; font-weight: bold;">
                                ${r1.map((_, i) => `<td style="border: 1px solid black;">Câu ${i+1}</td>`).join('')}
                            </tr>
                            <tr>
                                ${r1.map((q) => `<td style="border: 1px solid black; font-weight: bold; color: #1d4ed8;">${getR1ChoiceLabel(q)}</td>`).join('')}
                            </tr>
                        </table>
                    </div>`;
                }

                if (r2.length > 0) {
                    html += `
                    <div data-cv7991-block="true" data-section="answers" style="margin-bottom: 15px;">
                        <p style="font-weight: bold; margin-bottom: 6px;">2. BẢNG ĐÁP ÁN PHẦN II (Trắc nghiệm Đúng/Sai)</p>
                        <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 10px; font-size: 0.88em;" border="1" cellpadding="4">
                            <tr style="background-color: #f3f4f6; font-weight: bold;">
                                <td style="border: 1px solid black;">Câu</td>
                                <td style="border: 1px solid black;">Ý a)</td>
                                <td style="border: 1px solid black;">Ý b)</td>
                                <td style="border: 1px solid black;">Ý c)</td>
                                <td style="border: 1px solid black;">Ý d)</td>
                            </tr>
                            ${r2.map((q, idx) => `
                                <tr>
                                    <td style="border: 1px solid black; font-weight: bold;">Câu ${idx+1}</td>
                                    ${(q.statements || [{isTrue:true},{isTrue:false},{isTrue:true},{isTrue:false}]).map(s => `
                                        <td style="border: 1px solid black; font-weight: bold; color: ${s.isTrue ? '#047857' : '#b91c1c'};">${s.isTrue ? 'Đ' : 'S'}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </table>
                    </div>`;
                }

                if (r3.length > 0) {
                    html += `
                    <div data-cv7991-block="true" data-section="answers" style="margin-bottom: 15px;">
                        <p style="font-weight: bold; margin-bottom: 6px;">3. BẢNG ĐÁP ÁN PHẦN III (Trả lời ngắn)</p>
                        <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 10px; font-size: 0.88em;" border="1" cellpadding="4">
                            <tr style="background-color: #f3f4f6; font-weight: bold;">
                                ${r3.map((_, i) => `<td style="border: 1px solid black;">Câu ${i+1}</td>`).join('')}
                            </tr>
                            <tr>
                                ${r3.map((q) => `<td style="border: 1px solid black; font-weight: bold; color: #1d4ed8;">${sanitizeMathText(q.answer || '')}</td>`).join('')}
                            </tr>
                        </table>
                    </div>`;
                }

                let explanations = [...r1, ...r2, ...r3].filter(q => q.explanation);
                if (explanations.length > 0) {
                    html += `
                    <div data-cv7991-block="true" data-section="answers" data-is-header="true" style="margin-top: 12px; margin-bottom: 8px;">
                        <p style="font-weight: bold; margin-bottom: 8px;">4. HƯỚNG DẪN GIẢI CHI TIẾT</p>
                    </div>`;

                    [...r1, ...r2, ...r3].forEach((q, idx) => {
                        if (q.explanation) {
                            html += `
                            <div data-cv7991-block="true" data-section="answers" style="margin-bottom: ${qMarginBottom}; background-color: #f9fafb; padding: 7px 10px; border-left: 3px solid #6366f1; text-align: ${meta.textAlign}; text-justify: inter-word;">
                                <p style="font-weight: bold; color: #4338ca; margin-bottom: 2px;">Câu ${idx + 1}:</p>
                                <div>${sanitizeMathText(q.explanation)}</div>
                            </div>`;
                        }
                    });
                }
            }

            // 5. PART V: BẢNG MA TRẬN ĐÁP ÁN TỔNG HỢP CÁC MÃ ĐỀ (NẾU CHỌN XUẤT NHIỀU MÃ ĐỀ)
            if (meta.numCodes > 1 && meta.incAnswerMatrix && typeof window.generateMultiExamAnswerMatrixHTML === 'function') {
                html += window.generateMultiExamAnswerMatrixHTML(generatedExamsList);
            }

            return html;
        }

        function generateCV7991LaTeX() {
            let meta = getCV7991Meta();
            let data = adminState.data || GAME_DATA || { round1: [], round2: [], round3: [] };
            let r1 = data.round1 || [];
            let r2 = data.round2 || [];
            let r3 = data.round3 || [];

            let tex = `% --- MÃ NGUỒN LATEX XUẤT THEO CÔNG VĂN 7991 ---
\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{vietnam}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage[top=${meta.marginTop || 20}mm,bottom=${meta.marginBottom || 20}mm,left=${meta.marginLeft || 30}mm,right=${meta.marginRight || 15}mm]{geometry}
\\usepackage{array,longtable,multicol}
\\usepackage{enumitem}
\\usepackage{setspace}
\\setstretch{${meta.lineHeight || 1.35}}

\\begin{document}

% --- KHUNG TIÊU ĐỀ ĐỀ THI ---
\\noindent
\\begin{minipage}[t]{0.5\\textwidth}
\t\\centering
\t{\\small \\textbf{${meta.school1}}}\\\\
\t{\\small \\textbf{${meta.school2}}}\\\\[0.5cm]
\t\\textit{(Đề gồm \\pageref{trangcuoi}~trang)}
\\end{minipage}
\\begin{minipage}[t]{0.5\\textwidth}
\t\\centering
\t{\\small\\textbf{${meta.title}}}\\\\
\t\\textbf{Môn: ${meta.subject}; \\quad Khối ${meta.grade}}\\\\
\t\\textbf{Ngày kiểm tra: ${meta.date}}\\\\
\t{\\small\\textit{Thời gian làm bài: ${meta.duration}, không kể thời gian phát đề}}\\\\
\\end{minipage}

\\vspace{0.5cm}

\\noindent Họ tên học sinh: \\makebox[6.5cm]{\\dotfill} Số báo danh: \\makebox[3cm]{\\dotfill} \\boxed{\\textbf{Mã đề: ${meta.code}}}
\\vspace{0.5cm}

`;

            // PHẦN I
            if (r1.length > 0) {
                tex += `\\noindent\\textbf{PHẦN I. Câu hỏi trắc nghiệm nhiều lựa chọn. Thí sinh trả lời từ câu 1 đến câu ${r1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.}\n\\vspace{0.2cm}\n\n`;
                r1.forEach((q, idx) => {
                    tex += `\\noindent\\textbf{Câu ${idx + 1}:} ${q.text}\n`;
                    if (q.options && q.options.length >= 4) {
                        tex += `\\begin{multicols}{2}\n\\textbf{A.} ${q.options[0]} \\\\\n\\textbf{B.} ${q.options[1]} \\\\\n\\textbf{C.} ${q.options[2]} \\\\\n\\textbf{D.} ${q.options[3]}\n\\end{multicols}\n`;
                    }
                    tex += `\\vspace{0.2cm}\n\n`;
                });
            }

            // PHẦN II
            if (r2.length > 0) {
                tex += `\\noindent\\textbf{PHẦN II. Câu hỏi trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu ${r2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.}\n\\vspace{0.2cm}\n\n`;
                r2.forEach((q, idx) => {
                    tex += `\\noindent\\textbf{Câu ${idx + 1}:} ${q.text}\n`;
                    if (q.statements) {
                        tex += `\\begin{itemize}[leftmargin=20pt,itemsep=1pt]\n`;
                        q.statements.forEach(s => {
                            tex += `\\item[\\textbf{${s.label})}] ${s.text}\n`;
                        });
                        tex += `\\end{itemize}\n`;
                    }
                    tex += `\\vspace{0.2cm}\n\n`;
                });
            }

            // PHẦN III
            if (r3.length > 0) {
                tex += `\\noindent\\textbf{PHẦN III. Câu hỏi trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu ${r3.length}.}\n\\vspace{0.2cm}\n\n`;
                r3.forEach((q, idx) => {
                    tex += `\\noindent\\textbf{Câu ${idx + 1}:} ${q.text}\n\\vspace{0.2cm}\n\n`;
                });
            }

            tex += `\\centerline{\\textbf{-------------- HẾT --------------}}\n\\newpage\n\n`;

            // PHẦN IV: ĐÁP ÁN
            if (meta.incAnswers) {
                tex += `% --- PHẦN IV: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM ---\n`;
                tex += `\\centerline{\\Large\\textbf{PHẦN IV: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (MÃ ĐỀ ${meta.code})}}\n\\vspace{0.5cm}\n\n`;

                if (r1.length > 0) {
                    tex += `\\noindent\\textbf{1. BẢNG ĐÁP ÁN PHẦN I}\n\n`;
                    tex += `\\begin{table}[h]\n\\centering\n\\begin{tabular}{|` + r1.map(() => 'c|').join('') + `}\n\\hline\n`;
                    tex += r1.map((_, i) => `\\textbf{Câu ${i+1}}`).join(' & ') + ` \\\\\n\\hline\n`;
                    tex += r1.map(q => {
                        if (!q.options || !q.answer) return 'A';
                        let ansStr = String(q.answer).trim();
                        if (['A','B','C','D'].includes(ansStr.toUpperCase())) return ansStr.toUpperCase();
                        let idx = q.options.findIndex(opt => String(opt).trim() === ansStr);
                        return idx !== -1 ? ['A','B','C','D'][idx] : 'A';
                    }).join(' & ') + ` \\\\\n\\hline\n\\end{tabular}\n\\end{table}\n\n`;
                }
            }

            tex += `\\label{trangcuoi}\n\\end{document}`;
            return tex;
        }

        function exportCV7991PDF() {
            let container = document.getElementById('cv7991-preview-container');
            if (!container) return;
            let printWin = window.open('', '_blank');
            if (!printWin) return showToast("Vui lòng cho phép popup để in file PDF!", true);

            let meta = getCV7991Meta();
            printWin.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>DeThi_CV7991_MaDe_${meta.code}</title>
                    <meta charset="utf-8">
                    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"><\/script>
                    <style>
                        @page { size: A4 portrait; margin: 0; }
                        body { 
                            font-family: 'Times New Roman', serif; 
                            margin: 0; 
                            padding: 0; 
                            background: white; 
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                            text-align: ${meta.textAlign}; 
                            line-height: ${meta.lineHeight};
                        }
                        .cv7991-a4-page {
                            box-shadow: none !important;
                            margin-bottom: 0 !important;
                            border: none !important;
                            border-radius: 0 !important;
                            width: 210mm !important;
                            height: 297mm !important;
                            max-height: 297mm !important;
                            box-sizing: border-box !important;
                            page-break-after: always !important;
                            break-after: page !important;
                            overflow: hidden !important;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        ${container.innerHTML}
                    </div>
                    <script>
                        window.onload = function() {
                            if (window.MathJax && window.MathJax.typesetPromise) {
                                MathJax.typesetPromise().then(() => { setTimeout(() => { window.print(); }, 500); });
                            } else {
                                setTimeout(() => { window.print(); }, 1000);
                            }
                        };
                    <\/script>
                </body>
                </html>
            `);
            printWin.document.close();
        }

        function exportCV7991Word() {
            let meta = getCV7991Meta();
            let container = document.getElementById('cv7991-preview-container');
            if (!container) return;

            let html = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Đề thi Công văn 7991</title>
                <!--[if gte mso 9]>
                <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>100</w:Zoom>
                    <w:DoNotOptimizeForCustomXformatting/>
                </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    @page Section1 {
                        size: 210mm 297mm;
                        margin: ${meta.marginTop}mm ${meta.marginRight}mm ${meta.marginBottom}mm ${meta.marginLeft}mm;
                    }
                    div.Section1 { page: Section1; }
                    body { 
                        font-family: 'Times New Roman', serif; 
                        font-size: ${meta.fontSize}pt; 
                        line-height: ${meta.lineHeight};
                        text-align: ${meta.textAlign};
                    }
                    p { margin: 3pt 0; }
                    table { border-collapse: collapse; }
                </style>
            </head>
            <body>
                <div class="Section1">
                    ${container.innerHTML}
                </div>
            </body>
            </html>`;

            let blob = new Blob(['\ufeff', html], { type: 'application/msword' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `DeThi_CV7991_MaDe_${meta.code}.doc`;
            link.click();
            showToast("Đã xuất file Word chuẩn CV 7991!");
        }

        function exportCV7991LaTeXFile() {
            let meta = getCV7991Meta();
            let texCode = generateCV7991LaTeX();
            let blob = new Blob([texCode], { type: 'text/x-tex;charset=utf-8' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `DeThi_CV7991_MaDe_${meta.code}.tex`;
            link.click();
            showToast("Đã xuất file mã nguồn LaTeX (.tex) thành công!");
        }

        function openImportModal() { document.getElementById('import-modal').classList.remove('hidden'); switchImportTab('ai'); }
        function closeImportModal() { document.getElementById('import-modal').classList.add('hidden'); }
        function switchImportTab(tab) {
            document.getElementById('view-import-ai').classList.toggle('hidden', tab !== 'ai'); document.getElementById('view-import-paste').classList.toggle('hidden', tab !== 'paste');
            document.getElementById('tab-import-ai').className = tab === 'ai' ? "px-6 py-2.5 bg-main text-white rounded-xl shadow-md btn-3d transition" : "px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200 transition";
            document.getElementById('tab-import-paste').className = tab === 'paste' ? "px-6 py-2.5 bg-main text-white rounded-xl shadow-md btn-3d transition" : "px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200 transition";
            if(tab === 'ai') { 
                let gradeEl = document.getElementById('ai-prompt-grade');
                let curGrade = (adminState?.meta?.grade) || '12';
                if (gradeEl) {
                    gradeEl.value = curGrade;
                }
                populateAiTopicOptions(curGrade);
                renderAiRounds(); 
                generateAiPrompt(); 
            }
        }

        // ===============================================
        // LOGIC CHỦ ĐỀ, KHỐI LỚP & PROMPT AI (MULTI-CHECKBOX SELECTION)
        // ===============================================
        window.selectedAiTopics = window.selectedAiTopics || [];

        function toggleAiTopicDropdown(forceState) {
            let menu = document.getElementById('ai-topic-dropdown-menu');
            let arrow = document.getElementById('ai-topic-arrow');
            if (!menu) return;
            let willShow = (forceState !== undefined) ? forceState : menu.classList.contains('hidden');
            menu.classList.toggle('hidden', !willShow);
            if (arrow) {
                arrow.style.transform = willShow ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            if (willShow) {
                let searchInput = document.getElementById('ai-topic-search-input');
                if (searchInput) setTimeout(() => searchInput.focus(), 100);
            }
        }

        function populateAiTopicOptions(grade) {
            let checklist = document.getElementById('ai-topic-checklist');
            grade = String(grade || document.getElementById('ai-prompt-grade')?.value || (adminState?.meta?.grade || '12'));
            let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[grade]) || grade;

            // Toggle THPT preset button for Grade 12
            let btnThpt = document.getElementById('btn-preset-thpt');
            if (btnThpt) {
                btnThpt.classList.toggle('hidden', grade !== '12');
            }

            if (!checklist) return;

            let html = '';

            // Section 1: Đề Mẫu & Đề Định Kỳ
            html += `
                <div class="mb-3 bg-white p-3 rounded-xl border border-sky-100 shadow-2xs">
                    <div class="text-[11px] font-black text-sky-900 uppercase mb-2 flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-solid fa-star text-amber-500"></i>
                            <span>Khung Đề Thi Mẫu & Định Kỳ Chuẩn</span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400 font-normal">
                            <button type="button" onclick="toggleAllAiTopicGroups(true)" class="hover:text-sky-600 underline font-semibold">Mở tất cả dạng bài</button>
                            <span>•</span>
                            <button type="button" onclick="toggleAllAiTopicGroups(false)" class="hover:text-sky-600 underline font-semibold">Thu gọn</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="ai-topic-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" value="Toàn bộ chương trình môn Toán Lớp ${grade}" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-bold text-[11px] text-slate-800 leading-snug">[TỔNG HỢP] Toàn bộ Toán ${grade}</span>
                        </label>
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="ai-topic-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" value="Đề kiểm tra Giữa học kỳ 1 môn Toán Lớp ${grade}" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-semibold text-[11px] text-slate-700 leading-snug">Giữa học kỳ 1 (Lớp ${grade})</span>
                        </label>
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="ai-topic-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" value="Đề kiểm tra Cuối học kỳ 1 môn Toán Lớp ${grade}" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-semibold text-[11px] text-slate-700 leading-snug">Cuối học kỳ 1 (Lớp ${grade})</span>
                        </label>
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="ai-topic-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" value="Đề kiểm tra Giữa học kỳ 2 môn Toán Lớp ${grade}" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-semibold text-[11px] text-slate-700 leading-snug">Giữa học kỳ 2 (Lớp ${grade})</span>
                        </label>
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-100 cursor-pointer transition select-none text-slate-700">
                            <input type="checkbox" class="ai-topic-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" value="Đề kiểm tra Cuối học kỳ 2 môn Toán Lớp ${grade}" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-semibold text-[11px] text-slate-700 leading-snug">Cuối học kỳ 2 (Lớp ${grade})</span>
                        </label>
                        ${grade === '12' ? `
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200 cursor-pointer transition select-none text-purple-900 md:col-span-2">
                            <input type="checkbox" class="ai-topic-chk rounded border-purple-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 shrink-0" value="Đề thi thử Tốt nghiệp THPT môn Toán (Cấu trúc BGD 2025: 12 câu P1, 4 câu P2, 6 câu P3)" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-bold text-[11px] leading-snug">🎓 [ĐỀ THI] Đề thi thử Tốt nghiệp THPT 2025 (12 MCQ + 4 TF + 6 SA)</span>
                        </label>
                        ` : ''}
                        ${grade === '9' ? `
                        <label class="ai-topic-item flex items-center gap-2 p-2 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 cursor-pointer transition select-none text-indigo-900 md:col-span-2">
                            <input type="checkbox" class="ai-topic-chk rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 shrink-0" value="Đề thi tuyển sinh vào Lớp 10 môn Toán (Cấu trúc đề thi chính thức)" onchange="onAiTopicCheckboxChange(this)">
                            <span class="font-bold text-[11px] leading-snug">🎯 [TUYỂN SINH] Đề thi tuyển sinh vào Lớp 10 môn Toán (Toàn diện)</span>
                        </label>
                        ` : ''}
                    </div>
                </div>
            `;

            // Section 2: Chương, Bài học & Dạng bài chi tiết theo chuẩn Hệ thống Mã định danh
            if (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) {
                let gTax = window.MATH_ID_TAXONOMY[gCode];
                Object.keys(gTax.branches).forEach(bKey => {
                    let bData = gTax.branches[bKey];
                    let branchIcon = bKey === 'D' ? 'fa-calculator text-sky-500' : 'fa-shapes text-emerald-500';
                    html += `
                        <div class="mb-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <div class="text-[11px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5 pb-1.5 border-b border-slate-100">
                                <i class="fa-solid ${branchIcon}"></i>
                                <span>Phần: ${bData.name}</span>
                            </div>
                    `;
                    Object.keys(bData.chapters).forEach(cKey => {
                        let cData = bData.chapters[cKey];
                        let chPrefix = `[${gCode}${bKey}${cKey}]`;
                        let chVal = `${chPrefix} ${cData.name}`;
                        let chId = `ch_${gCode}_${bKey}_${cKey}`;
                        let lessonKeys = Object.keys(cData.lessons || {});
                        
                        html += `
                            <div class="ai-topic-group mb-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/90" id="box_${chId}">
                                <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
                                    <label class="ai-topic-item flex items-center gap-2 flex-grow cursor-pointer select-none">
                                        <input type="checkbox" class="ai-topic-chk ai-chapter-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" data-chapter="${chId}" value="${chVal}" onchange="onAiChapterCheckboxChange('${chId}', this)">
                                        <span class="font-black text-[11px] text-sky-950">${chPrefix} Chương ${cKey}: ${cData.name}</span>
                                    </label>
                                    <button type="button" onclick="toggleChapterExpand('${chId}')" class="text-slate-400 hover:text-sky-600 px-1 py-0.5 rounded text-[11px] transition" title="Mở rộng/Thu gọn">
                                        <i class="fa-solid fa-chevron-down transition-transform" id="arrow_${chId}"></i>
                                    </button>
                                </div>
                                <div class="mt-1 space-y-2" id="group_${chId}">
                        `;

                        lessonKeys.forEach(lKey => {
                            let lData = cData.lessons[lKey];
                            let lsPrefix = `[${gCode}${bKey}${cKey}?${lKey}]`;
                            let lsVal = `${lsPrefix} ${lData.name}`;
                            let lsId = `ls_${gCode}_${bKey}_${cKey}_${lKey}`;
                            let typeKeys = Object.keys(lData.types || {});

                            html += `
                                <div class="bg-white rounded-lg p-2 border border-slate-200/70 shadow-2xs" id="box_${lsId}">
                                    <div class="flex items-center justify-between">
                                        <label class="ai-topic-item flex items-center gap-2 flex-grow cursor-pointer select-none text-slate-800">
                                            <input type="checkbox" class="ai-topic-chk ai-lesson-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" data-parent-chapter="${chId}" data-lesson="${lsId}" value="${lsVal}" onchange="onAiLessonCheckboxChange('${chId}', '${lsId}', this)">
                                            <span class="text-[11px] font-bold text-slate-800 leading-snug">Bài ${lKey}: ${lData.name}</span>
                                        </label>
                                        ${typeKeys.length > 0 ? `
                                        <button type="button" onclick="toggleLessonExpand('${lsId}')" class="text-[10px] text-slate-500 hover:text-sky-600 px-1.5 py-0.5 rounded bg-slate-50 hover:bg-sky-50 border border-slate-200/60 flex items-center gap-1 transition shrink-0 ml-1">
                                            <span>${typeKeys.length} dạng</span>
                                            <i class="fa-solid fa-chevron-down text-[9px] transition-transform" id="arrow_${lsId}"></i>
                                        </button>
                                        ` : ''}
                                    </div>
                                    ${typeKeys.length > 0 ? `
                                    <div class="mt-1.5 pt-1.5 border-t border-dashed border-slate-100 pl-4 space-y-1" id="group_${lsId}">
                                    ` : ''}
                            `;

                            typeKeys.forEach(tKey => {
                                let tName = lData.types[tKey];
                                let tpCode = `[${gCode}${bKey}${cKey}?${lKey}-${tKey}]`;
                                let tpVal = `${tpCode} ${tName}`;
                                html += `
                                    <label class="ai-topic-item flex items-center gap-2 py-0.5 px-1 rounded hover:bg-sky-50/80 cursor-pointer select-none text-slate-600 transition">
                                        <input type="checkbox" class="ai-topic-chk ai-type-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3 h-3 shrink-0" data-parent-chapter="${chId}" data-parent-lesson="${lsId}" value="${tpVal}" onchange="onAiTypeCheckboxChange('${chId}', '${lsId}', this)">
                                        <span class="font-mono text-[9.5px] px-1 py-0.2 bg-slate-100 text-sky-700 rounded border border-slate-200/80 font-bold shrink-0">${tpCode}</span>
                                        <span class="text-[10.5px] font-medium leading-snug">${tName}</span>
                                    </label>
                                `;
                            });

                            if (typeKeys.length > 0) {
                                html += `</div>`;
                            }
                            html += `</div>`;
                        });

                        html += `
                                </div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                });
            } else if (window.MATH_CURRICULUM_KNTT && window.MATH_CURRICULUM_KNTT[grade]) {
                let gData = window.MATH_CURRICULUM_KNTT[grade];
                (gData.chapters || []).forEach((ch, cIdx) => {
                    let chVal = `Toán Lớp ${grade} - ${ch.name}`;
                    let chId = `ch_kntt_${cIdx}`;
                    html += `
                        <div class="ai-topic-group mb-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <label class="ai-topic-item flex items-center gap-2 cursor-pointer select-none pb-1.5 border-b border-slate-100">
                                <input type="checkbox" class="ai-topic-chk ai-chapter-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 shrink-0" data-chapter="${chId}" value="${chVal}" onchange="onAiChapterCheckboxChange('${chId}', this)">
                                <span class="font-black text-[11px] text-slate-800">📚 ${ch.name}</span>
                            </label>
                            <div class="mt-2 pl-2 space-y-1" id="group_${chId}">
                    `;
                    (ch.lessons || []).forEach(ls => {
                        let lsVal = `Toán Lớp ${grade} - ${ls}`;
                        html += `
                            <label class="ai-topic-item flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-sky-50 cursor-pointer select-none text-slate-700 transition">
                                <input type="checkbox" class="ai-topic-chk ai-lesson-chk rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3 h-3 shrink-0" data-parent-chapter="${chId}" value="${lsVal}" onchange="onAiTopicCheckboxChange(this)">
                                <span class="text-[11px] font-medium leading-snug">${ls}</span>
                            </label>
                        `;
                    });
                    html += `
                            </div>
                        </div>
                    `;
                });
            }

            checklist.innerHTML = html;
            updateAiTopicSummaryUI();
        }

        function onAiGradeChange(grade) {
            window.selectedAiTopics = [];
            populateAiTopicOptions(grade);
            let customInput = document.getElementById('ai-prompt-topic-custom');
            if (customInput) customInput.value = '';
            if (!adminState.meta) adminState.meta = {};
            adminState.meta.grade = grade;
            if (typeof setExportExamFolderValue === 'function') {
                setExportExamFolderValue(getMathFolderFromGrade(grade));
            }
            generateAiPrompt();
        }

        function onAiTopicCheckboxChange(chk) {
            if (!chk) return;
            let val = chk.value;
            if (chk.checked) {
                if (!window.selectedAiTopics.includes(val)) {
                    window.selectedAiTopics.push(val);
                }
            } else {
                window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== val);
            }
            syncAiTopicToCustomInput();
        }

        function onAiChapterCheckboxChange(chId, chk) {
            if (!chk) return;
            let isChecked = chk.checked;
            let val = chk.value;
            
            // Toggle chapter in array
            if (isChecked) {
                if (!window.selectedAiTopics.includes(val)) window.selectedAiTopics.push(val);
            } else {
                window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== val);
            }

            // Also check/uncheck all child lessons and child types in this chapter
            let childChks = document.querySelectorAll(`input[data-parent-chapter="${chId}"]`);
            childChks.forEach(c => {
                c.checked = isChecked;
                let cVal = c.value;
                if (isChecked) {
                    if (!window.selectedAiTopics.includes(cVal)) window.selectedAiTopics.push(cVal);
                } else {
                    window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== cVal);
                }
            });

            syncAiTopicToCustomInput();
        }

        function onAiLessonCheckboxChange(chId, lsId, chk) {
            if (!chk) return;
            let isChecked = chk.checked;
            let val = chk.value;

            // Toggle lesson in array
            if (isChecked) {
                if (!window.selectedAiTopics.includes(val)) window.selectedAiTopics.push(val);
            } else {
                window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== val);
            }

            // Check/uncheck child types under this lesson
            let childTypeChks = document.querySelectorAll(`input[data-parent-lesson="${lsId}"]`);
            childTypeChks.forEach(tchk => {
                tchk.checked = isChecked;
                let tval = tchk.value;
                if (isChecked) {
                    if (!window.selectedAiTopics.includes(tval)) window.selectedAiTopics.push(tval);
                } else {
                    window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== tval);
                }
            });

            // Update parent chapter checkbox state
            let parentChapterChk = document.querySelector(`input[data-chapter="${chId}"]`);
            if (parentChapterChk) {
                let allLessonsInCh = document.querySelectorAll(`input.ai-lesson-chk[data-parent-chapter="${chId}"]`);
                let allChecked = Array.from(allLessonsInCh).every(c => c.checked);
                if (allChecked && allLessonsInCh.length > 0) {
                    parentChapterChk.checked = true;
                    if (!window.selectedAiTopics.includes(parentChapterChk.value)) window.selectedAiTopics.push(parentChapterChk.value);
                } else {
                    parentChapterChk.checked = false;
                    window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== parentChapterChk.value);
                }
            }

            syncAiTopicToCustomInput();
        }

        function onAiTypeCheckboxChange(chId, lsId, chk) {
            if (!chk) return;
            let isChecked = chk.checked;
            let val = chk.value;

            // Toggle type in array
            if (isChecked) {
                if (!window.selectedAiTopics.includes(val)) window.selectedAiTopics.push(val);
            } else {
                window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== val);
            }

            // Check if all types of this lesson are checked -> check lesson
            let parentLessonChk = document.querySelector(`input[data-lesson="${lsId}"]`);
            if (parentLessonChk) {
                let allTypesInLs = document.querySelectorAll(`input[data-parent-lesson="${lsId}"]`);
                let allChecked = Array.from(allTypesInLs).every(c => c.checked);
                if (allChecked && allTypesInLs.length > 0) {
                    parentLessonChk.checked = true;
                    if (!window.selectedAiTopics.includes(parentLessonChk.value)) window.selectedAiTopics.push(parentLessonChk.value);
                } else {
                    parentLessonChk.checked = false;
                    window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== parentLessonChk.value);
                }
            }

            // Update parent chapter
            let parentChapterChk = document.querySelector(`input[data-chapter="${chId}"]`);
            if (parentChapterChk) {
                let allLessonsInCh = document.querySelectorAll(`input.ai-lesson-chk[data-parent-chapter="${chId}"]`);
                let allChecked = Array.from(allLessonsInCh).every(c => c.checked);
                if (allChecked && allLessonsInCh.length > 0) {
                    parentChapterChk.checked = true;
                    if (!window.selectedAiTopics.includes(parentChapterChk.value)) window.selectedAiTopics.push(parentChapterChk.value);
                } else {
                    parentChapterChk.checked = false;
                    window.selectedAiTopics = window.selectedAiTopics.filter(v => v !== parentChapterChk.value);
                }
            }

            syncAiTopicToCustomInput();
        }

        function toggleChapterExpand(chId) {
            let group = document.getElementById(`group_${chId}`);
            let arrow = document.getElementById(`arrow_${chId}`);
            if (!group) return;
            let isHidden = group.classList.contains('hidden');
            group.classList.toggle('hidden', !isHidden);
            if (arrow) arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        }

        function toggleLessonExpand(lsId) {
            let group = document.getElementById(`group_${lsId}`);
            let arrow = document.getElementById(`arrow_${lsId}`);
            if (!group) return;
            let isHidden = group.classList.contains('hidden');
            group.classList.toggle('hidden', !isHidden);
            if (arrow) arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
        }

        function toggleAllAiTopicGroups(expand) {
            document.querySelectorAll('[id^="group_ch_"], [id^="group_ls_"]').forEach(el => {
                el.classList.toggle('hidden', !expand);
            });
            document.querySelectorAll('[id^="arrow_ch_"], [id^="arrow_ls_"]').forEach(el => {
                el.style.transform = expand ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
        }

        function syncAiTopicToCustomInput() {
            let customInput = document.getElementById('ai-prompt-topic-custom');
            if (customInput) {
                if (window.selectedAiTopics.length === 0) {
                    customInput.value = '';
                } else if (window.selectedAiTopics.length === 1) {
                    customInput.value = window.selectedAiTopics[0];
                } else {
                    customInput.value = window.selectedAiTopics.join('; ');
                }
            }
            updateAiTopicSummaryUI();
            generateAiPrompt();
        }

        function updateAiTopicSummaryUI() {
            let count = window.selectedAiTopics ? window.selectedAiTopics.length : 0;
            let badge = document.getElementById('ai-topic-count-badge');
            let text = document.getElementById('ai-topic-dropdown-text');
            let summary = document.getElementById('ai-topic-selected-summary');

            if (badge) {
                badge.textContent = count;
                badge.classList.toggle('hidden', count === 0);
            }

            if (text) {
                if (count === 0) {
                    text.innerHTML = '<i class="fa-solid fa-list-check text-sky-600"></i> <span>Chọn chủ đề / bài học chi tiết theo SGK...</span>';
                } else if (count === 1) {
                    text.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i> <span class="truncate">${window.selectedAiTopics[0]}</span>`;
                } else {
                    text.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i> <span class="truncate">Đã chọn <b>${count}</b> chuyên đề/bài học/dạng bài</span>`;
                }
            }

            if (summary) {
                summary.textContent = count === 0 ? "Chưa chọn nội dung nào" : `Đã chọn ${count} chuyên đề / bài học / dạng bài`;
            }
        }

        function selectAiTopicPreset(preset) {
            let grade = String(document.getElementById('ai-prompt-grade')?.value || '12');
            let allChks = document.querySelectorAll('#ai-topic-checklist input[type="checkbox"]');
            window.selectedAiTopics = [];

            if (preset === 'all') {
                let val = `Toàn bộ chương trình môn Toán Lớp ${grade}`;
                window.selectedAiTopics = [val];
                allChks.forEach(chk => {
                    chk.checked = (chk.value === val);
                });
            } else if (preset === 'gk1') {
                let val = `Đề kiểm tra Giữa học kỳ 1 môn Toán Lớp ${grade}`;
                window.selectedAiTopics = [val];
                allChks.forEach(chk => { chk.checked = (chk.value === val); });
            } else if (preset === 'ck1') {
                let val = `Đề kiểm tra Cuối học kỳ 1 môn Toán Lớp ${grade}`;
                window.selectedAiTopics = [val];
                allChks.forEach(chk => { chk.checked = (chk.value === val); });
            } else if (preset === 'gk2') {
                let val = `Đề kiểm tra Giữa học kỳ 2 môn Toán Lớp ${grade}`;
                window.selectedAiTopics = [val];
                allChks.forEach(chk => { chk.checked = (chk.value === val); });
            } else if (preset === 'ck2') {
                let val = `Đề kiểm tra Cuối học kỳ 2 môn Toán Lớp ${grade}`;
                window.selectedAiTopics = [val];
                allChks.forEach(chk => { chk.checked = (chk.value === val); });
            } else if (preset === 'thpt') {
                let val = `Đề thi thử Tốt nghiệp THPT môn Toán (Cấu trúc BGD 2025: 12 câu P1, 4 câu P2, 6 câu P3)`;
                window.selectedAiTopics = [val];
                allChks.forEach(chk => { chk.checked = (chk.value === val); });
            }

            syncAiTopicToCustomInput();
        }

        function clearAllAiTopics() {
            window.selectedAiTopics = [];
            let allChks = document.querySelectorAll('#ai-topic-checklist input[type="checkbox"]');
            allChks.forEach(chk => { chk.checked = false; });
            syncAiTopicToCustomInput();
        }

        function filterAiTopicList(query) {
            query = removeVietnameseTones(query || '').toLowerCase().trim();
            let items = document.querySelectorAll('.ai-topic-item');
            let groups = document.querySelectorAll('.ai-topic-group');

            if (!query) {
                items.forEach(item => { item.style.display = 'flex'; });
                groups.forEach(group => { group.style.display = 'block'; });
                return;
            }

            items.forEach(item => {
                let text = removeVietnameseTones(item.textContent || '').toLowerCase();
                let match = text.includes(query);
                item.style.display = match ? 'flex' : 'none';
                if (match) {
                    let parentGroup = item.closest('.ai-topic-group');
                    if (parentGroup) parentGroup.style.display = 'block';
                    let parentContainer = item.parentElement;
                    if (parentContainer && parentContainer.classList.contains('hidden')) {
                        parentContainer.classList.remove('hidden');
                    }
                }
            });

            groups.forEach(group => {
                let visibleItems = group.querySelectorAll('.ai-topic-item:not([style*="display: none"])');
                group.style.display = visibleItems.length > 0 ? 'block' : 'none';
            });
        }

        window.toggleAiTopicDropdown = toggleAiTopicDropdown;
        window.populateAiTopicOptions = populateAiTopicOptions;
        window.onAiGradeChange = onAiGradeChange;
        window.onAiTopicCheckboxChange = onAiTopicCheckboxChange;
        window.onAiChapterCheckboxChange = onAiChapterCheckboxChange;
        window.onAiLessonCheckboxChange = onAiLessonCheckboxChange;
        window.onAiTypeCheckboxChange = onAiTypeCheckboxChange;
        window.toggleChapterExpand = toggleChapterExpand;
        window.toggleLessonExpand = toggleLessonExpand;
        window.toggleAllAiTopicGroups = toggleAllAiTopicGroups;
        window.selectAiTopicPreset = selectAiTopicPreset;
        window.clearAllAiTopics = clearAllAiTopics;
        window.filterAiTopicList = filterAiTopicList;

        function renderAiRounds() { 
            const container = document.getElementById('ai-rounds-container');
            if(!container) return;
            container.innerHTML = aiStructure.map((r, i) => {
                let formatVal = r.format || r.round || 'round1';
                let levelVal = r.level || 'Nhận biết';
                return `
                <div class="flex gap-2 items-center text-xs mb-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <b class="text-sky-600 font-black shrink-0 w-16 uppercase">LỆNH ${i+1}:</b>
                    <input type="number" min="1" max="50" title="Số câu" class="border-2 border-slate-200 p-1.5 rounded-lg w-14 text-center font-black text-slate-800 bg-white focus:border-sky-500 outline-none" value="${r.count}" onchange="aiStructure[${i}].count=parseInt(this.value)||1; generateAiPrompt();">
                    <select title="Dạng thức câu hỏi" class="border-2 border-slate-200 p-1.5 rounded-lg flex-grow font-bold text-slate-700 bg-white focus:border-sky-500 outline-none" onchange="aiStructure[${i}].format=this.value; aiStructure[${i}].round=this.value; generateAiPrompt();">
                        <option value="round1" ${formatVal === 'round1' ? 'selected' : ''}>Trắc nghiệm (4 LC)</option>
                        <option value="round2" ${formatVal === 'round2' ? 'selected' : ''}>Đúng/Sai (4 ý)</option>
                        <option value="round3" ${formatVal === 'round3' ? 'selected' : ''}>Trả lời ngắn</option>
                    </select>
                    <select title="Mức độ tư duy" class="border-2 border-slate-200 p-1.5 rounded-lg flex-grow font-bold text-slate-700 bg-white focus:border-sky-500 outline-none" onchange="aiStructure[${i}].level=this.value; generateAiPrompt();">
                        <option value="Nhận biết" ${levelVal === 'Nhận biết' ? 'selected' : ''}>Nhận biết</option>
                        <option value="Thông hiểu" ${levelVal === 'Thông hiểu' ? 'selected' : ''}>Thông hiểu</option>
                        <option value="Vận dụng" ${levelVal === 'Vận dụng' ? 'selected' : ''}>Vận dụng</option>
                        <option value="Vận dụng cao" ${levelVal === 'Vận dụng cao' ? 'selected' : ''}>Vận dụng cao</option>
                    </select>
                    <button onclick="removeAiRound(${i})" class="text-rose-500 p-2 hover:bg-rose-100 rounded-lg transition" title="Xóa lệnh này"><i class="fa-solid fa-trash-can text-sm"></i></button>
                </div>`;
            }).join('');
        }

        function removeAiRound(index) {
            if (aiStructure.length <= 1) return;
            aiStructure.splice(index, 1);
            renderAiRounds();
            generateAiPrompt();
        }

        function addAiRound() { 
            let idx = aiStructure.length;
            let defaultFormat = idx === 0 ? "round1" : idx === 1 ? "round2" : idx === 2 ? "round3" : "round1";
            let defaultCount = idx === 0 ? 12 : idx === 1 ? 4 : idx === 2 ? 6 : 1;
            let defaultLevel = idx === 0 ? "Nhận biết" : idx === 1 ? "Thông hiểu" : idx === 2 ? "Vận dụng" : "Nhận biết";
            aiStructure.push({ format: defaultFormat, round: defaultFormat, count: defaultCount, level: defaultLevel }); 
            renderAiRounds(); 
            generateAiPrompt(); 
        }

        window.aiPromptMode = window.aiPromptMode || 'formal';

        function setAiPromptMode(mode) {
    window.aiPromptMode = mode;
    let btnFormal = document.getElementById('btn-ai-mode-formal');
    let btnPractice = document.getElementById('btn-ai-mode-practice');
    let btnGame = document.getElementById('btn-ai-mode-game');
    let modeLabel = document.getElementById('ai-prompt-mode-label');
    let modeDesc = document.getElementById('ai-mode-desc');
    let gameContainer = document.getElementById('ai-game-type-container');

    const inactiveCls = "py-2 px-1 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-1 transition text-center";
    if (btnFormal) btnFormal.className = inactiveCls;
    if (btnPractice) btnPractice.className = inactiveCls;
    if (btnGame) btnGame.className = inactiveCls;

    if (mode === 'formal') {
        if (btnFormal) btnFormal.className = "py-2 px-1 rounded-xl border border-purple-500 bg-purple-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center";
        if (modeLabel) {
            modeLabel.className = "text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold";
            modeLabel.textContent = "Chuẩn CV 7991";
        }
        if (modeDesc) {
            modeDesc.innerHTML = '🎓 <b>Thi nghiêm túc</b>: Sinh đầy đủ Ma trận, Bảng đặc tả, Đề thi 3 phần (kèm metadata mức độ), Đáp án & Lời giải chi tiết theo CV 7991.';
        }
        if (gameContainer) gameContainer.classList.add('hidden');
    } else if (mode === 'game') {
        if (btnGame) btnGame.className = "py-2 px-1 rounded-xl border border-emerald-500 bg-emerald-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center";
        if (modeLabel) {
            modeLabel.className = "text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold";
            modeLabel.textContent = "🎮 Đấu Trường Games";
        }
        if (modeDesc) {
            modeDesc.innerHTML = '🎮 <b>Đấu Trường Games Toán Học</b>: Thiết kế 15 câu trắc nghiệm leo thang 3 chặng, tính nhẩm phản xạ, diệt Boss RPG và lật thẻ 3D, kèm gợi ý 50:50 và trực quan hóa BBT/Đồ thị.';
        }
        if (gameContainer) gameContainer.classList.remove('hidden');
    } else {
        if (btnPractice) btnPractice.className = "py-2 px-1 rounded-xl border border-amber-500 bg-amber-600 text-white shadow-xs flex items-center justify-center gap-1 transition text-center";
        if (modeLabel) {
            modeLabel.className = "text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold";
            modeLabel.textContent = "Luyện tập (Nhanh)";
        }
        if (modeDesc) {
            modeDesc.innerHTML = '⚡ <b>Luyện tập (Nhanh)</b>: Sinh nhanh câu hỏi trắc nghiệm kèm giải thích ngắn gọn, tối ưu tốc độ và không yêu cầu lập Ma trận / Bảng đặc tả phức tạp.';
        }
        if (gameContainer) gameContainer.classList.add('hidden');
    }

    if (typeof generateAiPrompt === 'function') {
        generateAiPrompt();
    }
}
window.setAiPromptMode = setAiPromptMode;

function generateAiPrompt() {
    try {
        let grade = document.getElementById('ai-prompt-grade')?.value || '12';
        let lang = document.getElementById('ai-prompt-lang')?.value || 'vi';
        let mode = window.aiPromptMode || 'formal';

        // Lấy chủ đề đã chọn
        let topicList = [];
        if (Array.isArray(window.selectedAiTopics) && window.selectedAiTopics.length > 0) {
            topicList = [...window.selectedAiTopics];
        }
        let customTopic = document.getElementById('ai-prompt-topic-custom')?.value?.trim();
        if (customTopic) {
            topicList.push(customTopic);
        }
        if (topicList.length === 0) {
            let selectTopic = document.getElementById('ai-prompt-topic-select')?.value?.trim();
            if (selectTopic) topicList.push(selectTopic);
        }
        let finalTopic = topicList.length > 0 ? topicList.join('; ') : ("Chương trình môn Toán Lớp " + grade + " (GDPT 2018)");

        // Ngôn ngữ
        let langDesc = "Tiếng Việt chuẩn mực sư phạm toán học";
        let bilingualInstructions = "";
        if (lang === 'en') {
            langDesc = "Tiếng Anh (English - High School Math Terminology)";
        } else if (lang === 'bi') {
            langDesc = "Song ngữ Việt - Anh (Bilingual Vietnamese - English)";
            bilingualInstructions = "\n- YÊU CẦU SONG NGỮ BẮT BUỘC: Mỗi câu hỏi, từng phương án lựa chọn và lời giải chi tiết đều phải có 2 dòng song song: Dòng 1 tiếng Việt, Dòng 2 tiếng Anh (in nghiêng hoặc mở ngoặc).";
        }

        // Tài liệu nguồn (nếu giáo viên dán văn bản / scan tài liệu)
        let sourceText = document.getElementById('ai-source-text')?.value?.trim();
        let sourceBlock = "";
        if (sourceText) {
            sourceBlock = `\n══════════════════════════════════════════════════════════════════════════════\nTÀI LIỆU NGUỒN CUNG CẤP TỪ GIÁO VIÊN (BÁM SÁT ĐỂ BIÊN SOẠN):\n══════════════════════════════════════════════════════════════════════════════\n` + sourceText + `\n`;
        }

        let finalPrompt = "";

        if (mode === 'game') {
            // PROMPT 2: ĐẤU TRƯỜNG GAMES TOÁN HỌC
            let gameType = document.getElementById('ai-game-type-select')?.value || 'all';
            let gameTargetDesc = "Đấu trường Game Toán học tổng hợp (Chơi tốt cả 4 Game)";
            let gameSpecificRules = "";

            if (gameType === 'millionaire') {
                gameTargetDesc = "Đấu trường Ai Là Triệu Phú (15 Mốc bậc thang thưởng)";
                gameSpecificRules = `★ YÊU CẦU CHUYÊN BIỆT CHO AI LÀ TRIỆU PHÚ:
- Đúng 15 câu hỏi leo thang độ khó qua 3 chặng mốc an toàn:
  + Chặng 1 (Câu 1-5, Mốc 5): Nhận biết công thức cơ bản, tính nhẩm nhanh.
  + Chặng 2 (Câu 6-10, Mốc 10): Thông hiểu, đọc đồ thị & BBT, giải bài toán 1-2 bước.
  + Chặng 3 (Câu 11-15, Mốc 15 Triệu Phú): Vận dụng cao, tham số m, cực trị hàm hợp, hình không gian phân loại sắc bén.
- BẮT BUỘC có trường "hint": Lời gợi ý chiến thuật sắc sảo kích hoạt trợ giúp 50:50 hoặc hỏi ý kiến khán giả.`;
            } else if (gameType === 'speedrun') {
                gameTargetDesc = "Đấu trường Đua Tốc Độ 60s (Lightning Speedrun)";
                gameSpecificRules = `★ YÊU CẦU CHUYÊN BIỆT CHO ĐUA TỐC ĐỘ 60S:
- 15 câu hỏi phản xạ tính nhẩm nhanh, học sinh quyết định trong 5-10 giây!
- Tuyệt đối KHÔNG ra đề tính toán cồng kềnh mất nhiều phút.
- Trọng tâm: Đọc nhanh khoảng đồng biến từ bảng biến thiên (nhìn dấu + của y'), đọc giao điểm đồ thị với trục hoành, đạo hàm cơ bản, giá trị lượng giác/mũ/logarit số đẹp, tọa độ tâm mặt cầu/trung điểm.`;
            } else if (gameType === 'boss') {
                gameTargetDesc = "Đấu trường Vượt Ải Diệt Boss 3 HP (RPG Boss Battle)";
                gameSpecificRules = `★ YÊU CẦU CHUYÊN BIỆT CHO VƯỢT ẢI DIỆT BOSS:
- 15 câu hỏi thiết kế theo 3 ải chiến đấu RPG:
  + Ải 1 (Câu 1-5): Đối đầu Tiểu Quái Ma Trận (Nhận biết định nghĩa & công thức).
  + Ải 2 (Câu 6-10): Đối đầu Hộ Vệ Cổ Đại (Thông hiểu & Vận dụng trung bình, biến đổi 2 bước).
  + Ải 3 (Câu 11-15): Đối đầu Hắc Long Bất Diệt (Vận dụng cao, bài toán thực tế và hình học không gian thử thách cao độ).`;
            } else if (gameType === 'cardflip') {
                gameTargetDesc = "Đấu trường Lật Thẻ 3D Trí Nhớ (Memory Match Cards)";
                gameSpecificRules = `★ YÊU CẦU CHUYÊN BIỆT CHO LẬT THẺ 3D:
- Câu hỏi và đáp án mang tính ghép đôi đối ứng kinh điển:
  + Đề bài (Thẻ A): Một công thức, biểu thức nguyên hàm/đạo hàm, hoặc tên hình học.
  + Đáp án đúng (Thẻ B): Kết quả rút gọn, tên gọi hoặc tính chất tương ứng.
  + Ví dụ: $\\int \\frac{1}{x} dx$ ghép đôi với $\\ln|x| + C$; Đồ thị Parabol $y = x^2 - 4x$ ghép đôi với Điểm cực tiểu $(2; -4)$.`;
            } else {
                gameTargetDesc = "Đấu trường Tổng Hợp (Vận hành tối ưu trên cả 4 Game)";
                gameSpecificRules = `★ YÊU CẦU CHUYÊN BIỆT ĐA NĂNG CHO CẢ 4 GAME:
- 15 câu hỏi trắc nghiệm 4 lựa chọn chuẩn mực với độ dốc khó tăng dần (Câu 1-5 dễ, 6-10 trung bình, 11-15 nâng cao).
- Câu 1-5 thiết kế phản xạ nhanh (hỗ trợ Speedrun), toàn bộ 15 câu phục vụ Triệu Phú và Diệt Boss, trường text và answer cô đọng hỗ trợ Lật thẻ 3D.`;
            }

            let rawTmpl2 = "Bạn là CHUYÊN GIA THIẾT KẾ GAMIFICATION TOÁN HỌC (MATH GAME DESIGNER) VÀ KHẢO THÍ HÀNG ĐẦU.\n\nNHIỆM VỤ CỐT LÕI:\nHãy biên soạn một BỘ CÂU HỎI ĐẤU TRƯỜNG GAMES TOÁN HỌC CHUYÊN BIỆT, ĐỈNH CAO VỀ MẶT SƯ PHẠM, KÍCH THÍCH HỨNG THÚ HỌC TẬP VÀ VẬN HÀNH HOÀN HẢO TRÊN 4 THỂ LOẠI GAME ĐẤU TRƯỜNG:\n1. 🏆 AI LÀ TRIỆU PHÚ (15 Mốc bậc thang thưởng từ cơ bản đến đỉnh cao)\n2. ⚡ ĐUA TỐC ĐỘ 60S (Phản xạ nhẩm nhanh 5-10s, đọc BBT & đồ thị thần tốc)\n3. ⚔️ VƯỢT ẢI DIỆT BOSS 3 HP (3 Ải RPG: Tiểu quái ➔ Hộ vệ ➔ Hắc long)\n4. 🃏 LẬT THẺ 3D TRÍ NHỚ (Ghép cặp công thức & kết quả tương ứng)\n\nTHÔNG TIN ĐẤU TRƯỜNG:\n- KHỐI LỚP: Môn Toán Lớp {{GRADE}} (Chương trình GDPT 2018)\n- CHUYÊN ĐỀ KIẾN THỨC: \"{{TOPIC}}\"\n- CHẾ ĐỘ GAME MỤC TIÊU: {{GAME_TARGET_DESC}}\n- NGÔN NGỮ: {{LANG_DESC}}{{BILINGUAL_INSTRUCTIONS}}\n\nCƠ CẤU VÀ ĐẶC THÙ THIẾT KẾ CÂU HỎI (GAME PEDAGOGY):\n{{GAME_SPECIFIC_RULES}}\n\n══════════════════════════════════════════════════════════════════════════════\nQUY TẮC BẢO ĐẢM TÍNH HẤP DẪN & ĐỘ CHÍNH XÁC TOÁN HỌC TUYỆT ĐỐI:\n══════════════════════════════════════════════════════════════════════════════\n1. ĐỘ DỐC THỬ THÁCH (DIFFICULTY CURVE) THEO 3 CHẶNG RÕ RỆT:\n   - Câu 1 đến 5 (Chặng 1 - Nhận biết): Câu hỏi ngắn gọn, tính nhẩm, công thức quen thuộc. Giúp học sinh tự tin nhập cuộc và vượt qua mốc an toàn đầu tiên.\n   - Câu 6 đến 10 (Chặng 2 - Thông hiểu & Vận dụng): Đòi hỏi 1-2 bước suy luận, đọc tính chất từ bảng biến thiên hoặc đồ thị, tính diện tích/tích phân đơn giản.\n   - Câu 11 đến 15 (Chặng 3 - Vận dụng cao): Thử thách tư duy đỉnh cao, bài toán chứa tham số m, cực trị hàm hợp, hình học không gian đa chiều hoặc tối ưu thực tế.\n\n2. PHẢN XẠ NHANH & LỜI VĂN LÔI CUỐN:\n   - Đề bài cô đọng, súc tích, tránh các văn bản dài dòng gây buồn ngủ.\n   - Các phương án sai phải là bẫy tư duy kinh điển để tạo cảm giác \"hồi hộp, kịch tính\".\n   - BẮT BUỘC có trường \"hint\": Cung cấp lời gợi ý ngắn gọn, súc tích giúp kích hoạt các quyền trợ giúp 50:50 hoặc trợ giúp trong game.\n\n3. QUY CHUẨN CÔNG THỨC LATEX & ESCAPE:\n   - Toàn bộ công thức toán đặt trong cặp dấu $...$.\n   - Ký tự \\ BẮT BUỘC escape thành \\\\ (ví dụ: \\\\frac{a}{b}, \\\\sqrt{x}, \\\\in, \\\\vec{u}).\n\n4. ★ BẮT BUỘC VẼ BẢNG, BẢNG BIẾN THIÊN, ĐỒ THỊ & HÌNH HỌC (VISUAL GRAPHICS):\n   - Bảng biến thiên: Nhúng mã LaTeX array MathJax:\n     $$\\\\begin{array}{c|ccccc} x & -\\\\infty & & x_0 & & +\\\\infty \\\\\\\\ \\\\hline y' & & + & 0 & - & \\\\\\\\ \\\\hline y & & & y_{CĐ} & & \\\\\\\\ & & \\\\nearrow & & \\\\searrow & \\\\\\\\ & -\\\\infty & & & & -\\\\infty \\\\end{array}$$\n   - Đồ thị Oxy & Hình học không gian 3D: Nhúng trực tiếp thẻ SVG vector gọn đẹp (<svg viewBox=\"0 0 360 240\" ...>...</svg>).\n\n══════════════════════════════════════════════════════════════════════════════\nCẤU TRÚC JSON ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI MÃ JSON CHỨA ĐỦ 15 CÂU):\n══════════════════════════════════════════════════════════════════════════════\n```json\n{\n  \"round1\": [\n    {\n      \"id\": 1,\n      \"text\": \"Mốc 1. Đạo hàm của hàm số $y = x^4$ là\",\n      \"options\": [\"A. $y' = 4x^3$\", \"B. $y' = x^3$\", \"C. $y' = 4x$\", \"D. $y' = \\\\frac{x^5}{5}$\"],\n      \"answer\": \"A. $y' = 4x^3$\",\n      \"hint\": \"Áp dụng công thức $(x^n)' = n \\\\cdot x^{n-1}$.\",\n      \"topic\": \"{{TOPIC}}\",\n      \"level\": \"Nhận biết\",\n      \"explanation\": \"Ta có $(x^4)' = 4x^3$. Chọn A.\"\n    },\n    {\n      \"id\": 2,\n      \"text\": \"Mốc 2. Cho hàm số $y = f(x)$ có bảng biến thiên như sau:\\n$$\\\\begin{array}{c|ccccc} x & -\\\\infty & & 1 & & +\\\\infty \\\\\\\\ \\\\hline y' & & + & 0 & - & \\\\\\\\ \\\\hline y & & & 5 & & \\\\\\\\ & & \\\\nearrow & & \\\\searrow & \\\\\\\\ & -\\\\infty & & & & -\\\\infty \\\\end{array}$$\\nĐiểm cực đại của hàm số đã cho là\",\n      \"options\": [\"A. $x = 1$\", \"B. $y = 5$\", \"C. $x = 5$\", \"D. $x = -\\\\infty$\"],\n      \"answer\": \"A. $x = 1$\",\n      \"hint\": \"Điểm cực đại của hàm số là giá trị x làm cho đạo hàm đổi dấu từ dương sang âm.\",\n      \"topic\": \"{{TOPIC}}\",\n      \"level\": \"Nhận biết\",\n      \"explanation\": \"Từ bảng biến thiên, đạo hàm đổi dấu từ dương sang âm qua $x = 1$ nên điểm cực đại là $x = 1$. Chọn A.\"\n    }\n  ]\n}\n```\n";
            finalPrompt = rawTmpl2
                .replace(/\{\{GRADE\}\}/g, grade)
                .replace(/\{\{TOPIC\}\}/g, finalTopic)
                .replace(/\{\{GAME_TARGET_DESC\}\}/g, gameTargetDesc)
                .replace(/\{\{GAME_SPECIFIC_RULES\}\}/g, gameSpecificRules)
                .replace(/\{\{LANG_DESC\}\}/g, langDesc)
                .replace(/\{\{BILINGUAL_INSTRUCTIONS\}\}/g, bilingualInstructions);
        } else {
            // PROMPT 1: THI CHUẨN GDPT 2018 (3 PHẦN & CV 7991)
            let reqStr = "";
            if (Array.isArray(window.aiStructure) && window.aiStructure.length > 0) {
                let p1 = 0, p2 = 0, p3 = 0;
                let lines = [];
                window.aiStructure.forEach((r, idx) => {
                    let f = r.format || r.round || 'round1';
                    let lvl = r.level || 'Nhận biết';
                    let count = parseInt(r.count) || 1;
                    let fTitle = (f === 'round1') ? "Trắc nghiệm 4 lựa chọn (Phần I)" : ((f === 'round2') ? "Trắc nghiệm Đúng/Sai 4 ý (Phần II)" : "Trả lời ngắn (Phần III)");
                    lines.push(`- Lệnh ${idx + 1}: ${count} câu ${fTitle} [Mức độ: ${lvl}]`);
                    if (f === 'round1') p1 += count;
                    else if (f === 'round2') p2 += count;
                    else if (f === 'round3') p3 += count;
                });
                reqStr = lines.join('\n') + `\n=> TỔNG CỘNG: ${p1} câu Phần I (round1), ${p2} câu Phần II (round2), ${p3} câu Phần III (round3).`;
            } else {
                reqStr = "- PHẦN I: 12 câu Trắc nghiệm 4 lựa chọn (4 phương án A, B, C, D)\n- PHẦN II: 4 câu Trắc nghiệm Đúng/Sai (mỗi câu gồm 4 ý mệnh đề a, b, c, d)\n- PHẦN III: 6 câu Trả lời ngắn (điền đáp số là một số thực duy nhất)";
            }

            let rawTmpl1 = "Bạn là CHUYÊN GIA KHẢO THÍ HÀNG ĐẦU VÀ TÁC GIẢ ĐỀ THI TỐT NGHIỆP THPT MÔN TOÁN theo Chương trình GDPT 2018 (CÔNG VĂN 7991/BGDĐT của Bộ GD&ĐT).\n\nNHIỆM VỤ CỐT LÕI:\nHãy biên soạn một BỘ ĐỀ THI TOÁN HỌC CHUẨN MỰC, TUYỆT ĐỐI CHÍNH XÁC VỀ MẶT TOÁN HỌC, KHÔNG ẢO GIÁC, ĐÁP ỨNG TIÊU CHUẨN ĐÁNH GIÁ NĂNG LỰC 2025.\nTrả về kết quả trong DUY NHẤT 1 KHỐI JSON HỢP LỆ (valid JSON block) theo schema ở cuối prompt.\n\nTHÔNG TIN ĐỀ THI:\n- KHỐI LỚP: Môn Toán Lớp {{GRADE}} (GDPT 2018)\n- CHUYÊN ĐỀ KIẾN THỨC: \"{{TOPIC}}\"\n- NGÔN NGỮ: {{LANG_DESC}}{{BILINGUAL_INSTRUCTIONS}}\n\nCƠ CẤU SỐ LƯỢNG VÀ MỨC ĐỘ YÊU CẦU:\n{{REQ_STR}}\n\n══════════════════════════════════════════════════════════════════════════════\nQUY TẮC BẢO ĐẢM ĐỘ CHÍNH XÁC TOÁN HỌC TUYỆT ĐỐI (MATHEMATICAL RIGOR):\n══════════════════════════════════════════════════════════════════════════════\n1. CHUỖI SUY LUẬN NGẦM (CHAIN-OF-THOUGHT):\n   - Với MỌI câu hỏi, bạn phải tự giải bài toán theo từng bước toán học cụ thể trong \"explanation\" trước khi chốt đáp án.\n   - Lời giải phải rõ ràng: Công thức ➔ Biến đổi đại số/hình học ➔ Kết luận.\n   - Đáp án trong \"answer\" hoặc \"isTrue\" phải TUYỆT ĐỐI NHẤT QUÁN 100% với lời giải. Không được giải ra A mà đáp án lại ghi B!\n\n2. QUY CHUẨN CÔNG THỨC TOÁN LATEX:\n   - Toàn bộ công thức, biến số, biểu thức toán học BẮT BUỘC đặt trong cặp dấu $...$ (ví dụ: $f(x) = x^3 - 3x^2 + 2$, $x \\in [0; 3]$, $\\vec{a} = (1; -2; 3)$).\n   - Ký hiệu chuẩn: Dấu nhân là \\cdot, phân số là \\frac{a}{b}, căn là \\sqrt{x}, tích phân là \\int_{a}^{b} f(x)\\,dx.\n   - ĐẶC BIỆT LƯU Ý: Trong chuỗi JSON, ký tự gạch chéo ngược \\ PHẢI ĐƯỢC ESCAPE thành \\\\ (ví dụ: \\\\frac{1}{2}, \\\\in, \\\\mathbb{R}) để không gây lỗi SyntaxError khi parse!\n\n══════════════════════════════════════════════════════════════════════════════\n★ BẮT BUỘC VẼ BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC TRONG CÂU HỎI:\n══════════════════════════════════════════════════════════════════════════════\nKhi câu hỏi liên quan đến bảng số liệu, bảng biến thiên, đồ thị hoặc hình học (hoặc trong tài liệu nguồn có đề cập), bạn BẮT BUỘC PHẢI NHÚNG TRỰC TIẾP MÃ HIỂN THỊ VÀO TRƯỜNG \"text\", tuyệt đối không được nói suông \"Cho hình vẽ bên\" hay \"Cho bảng biến thiên dưới đây\" mà không vẽ:\n\n1. BẢNG BIẾN THIÊN (BẮT BUỘC KHI KHẢO SÁT HÀM SỐ):\n   - Nhúng trực tiếp khối mã LaTeX array MathJax:\n   $$\\\\begin{array}{c|ccccccc} x & -\\\\infty & & x_1 & & x_2 & & +\\\\infty \\\\\\\\ \\\\hline y' & & + & 0 & - & 0 & + & \\\\\\\\ \\\\hline y & & & y_{CĐ} & & & & +\\\\infty \\\\\\\\ & & \\\\nearrow & & \\\\searrow & & \\\\nearrow & \\\\\\\\ & -\\\\infty & & & & y_{CT} & & \\\\end{array}$$\n   - Có đầy đủ hàng $x$, hàng dấu của $y'$, hàng mũi tên biến thiên của $y$ ($\\nearrow$, $\\searrow$, tiệm cận || nếu có). Ký tự \\\\ phải escape thành \\\\\\\\ trong chuỗi JSON.\n\n2. BẢNG THỐNG KÊ / BẢNG DỮ LIỆU GHÉP NHÓM (TABLE):\n   - Nhúng trực tiếp bảng HTML có style gọn đẹp:\n   <table class=\"w-full max-w-md mx-auto my-2 border-collapse border border-slate-300 text-xs text-center\"><tr class=\"bg-sky-100 font-bold\"><th class=\"border border-slate-300 p-1.5\">Khoảng giá trị</th><th class=\"border border-slate-300 p-1.5\">Tần số</th></tr><tr><td class=\"border border-slate-300 p-1\">[10; 20)</td><td class=\"border border-slate-300 p-1\">15</td></tr></table>\n\n3. ĐỒ THỊ HÀM SỐ Oxy (SVG GRAPH):\n   - Khi câu hỏi yêu cầu nhận dạng đồ thị hoặc tương giao từ hình vẽ, nhúng trực tiếp khối mã SVG:\n   <svg class=\"mx-auto my-3 block max-w-full\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"120\" x2=\"340\" y2=\"120\" stroke=\"#475569\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"220\" x2=\"180\" y2=\"20\" stroke=\"#475569\" stroke-width=\"1.5\"/><text x=\"330\" y=\"112\" font-size=\"12\" fill=\"#475569\">x</text><text x=\"188\" y=\"30\" font-size=\"12\" fill=\"#475569\">y</text><text x=\"168\" y=\"135\" font-size=\"12\" fill=\"#475569\">O</text><path d=\"M 60 210 Q 120 40 180 120 T 300 30\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2.5\"/></svg>\n\n4. HÌNH HỌC KHÔNG GIAN 3D & HÌNH PHẲNG 2D (SVG GEOMETRY):\n   - Khi câu hỏi về hình chóp (S.ABCD, S.ABC), lăng trụ, nón, trụ, cầu... nhúng trực tiếp thẻ SVG:\n   <svg class=\"mx-auto my-3 block max-w-full\" viewBox=\"0 0 360 260\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"180\" y1=\"30\" x2=\"60\" y2=\"210\" stroke=\"#1e293b\" stroke-width=\"2\"/><line x1=\"180\" y1=\"30\" x2=\"300\" y2=\"210\" stroke=\"#1e293b\" stroke-width=\"2\"/><line x1=\"180\" y1=\"30\" x2=\"200\" y2=\"240\" stroke=\"#1e293b\" stroke-width=\"2\"/><line x1=\"60\" y1=\"210\" x2=\"200\" y2=\"240\" stroke=\"#1e293b\" stroke-width=\"2\"/><line x1=\"200\" y1=\"240\" x2=\"300\" y2=\"210\" stroke=\"#1e293b\" stroke-width=\"2\"/><line x1=\"60\" y1=\"210\" x2=\"300\" y2=\"210\" stroke=\"#94a3b8\" stroke-width=\"1.8\" stroke-dasharray=\"5,5\"/><line x1=\"180\" y1=\"30\" x2=\"180\" y2=\"210\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"4,4\"/><text x=\"175\" y=\"22\" font-weight=\"bold\" fill=\"#1e293b\">S</text><text x=\"45\" y=\"215\" font-weight=\"bold\" fill=\"#1e293b\">A</text><text x=\"310\" y=\"215\" font-weight=\"bold\" fill=\"#1e293b\">C</text><text x=\"200\" y=\"255\" font-weight=\"bold\" fill=\"#1e293b\">B</text><text x=\"185\" y=\"205\" font-weight=\"bold\" fill=\"#dc2626\">H</text></svg>\n   (Quy tắc: Cạnh thấy nét liền #1e293b, cạnh khuất đáy nét đứt stroke-dasharray=\"5,5\", đường cao ẩn nét đứt màu đỏ #dc2626).\n\n══════════════════════════════════════════════════════════════════════════════\nTHIẾT KẾ CÁC PHẦN THEO CHUẨN BGD 2025:\n══════════════════════════════════════════════════════════════════════════════\n● PHẦN I (Trắc nghiệm 4 lựa chọn):\n  - Mỗi câu có 4 phương án A, B, C, D độc lập, không trùng lặp giá trị.\n  - 3 phương án sai phải là bẫy nhiễu sư phạm dựa trên SAI LẦM KINH ĐIỂN của học sinh (nhầm dấu, quên điều kiện xác định, nhầm đạo hàm với nguyên hàm).\n  - Trường \"answer\" ghi rõ nội dung phương án đúng hoặc ký tự chữ cái tương ứng.\n\n● PHẦN II (Trắc nghiệm Đúng / Sai):\n  - Mỗi câu hỏi là một TÌNH HUỐNG TOÁN HỌC HOÀN CHỈNH.\n  - 4 mệnh đề a, b, c, d phát triển liên hoàn từ nhận biết đến vận dụng:\n    * Ý a: Kiểm tra tập xác định, tính liên tục hoặc giá trị tại một điểm.\n    * Ý b: Kiểm tra biến đổi trung gian (đạo hàm, véc-tơ, nghiệm phương trình).\n    * Ý c: Khảo sát tính chất cốt lõi (cực trị, diện tích, thể tích, khoảng cách).\n    * Ý d: Bài toán mở rộng chứa tham số m hoặc tối ưu min/max thực tế.\n  - Mỗi mệnh đề có \"isTrue\": true/false và \"explanation\" giải thích rõ.\n\n● PHẦN III (Trả lời ngắn):\n  - Câu hỏi tính toán thực tế hoặc vận dụng cao đòi hỏi học sinh tự giải và điền số.\n  - BẮT BUỘC: Trường \"answer\" CHỈ LÀ MỘT CON SỐ DUY NHẤT (ví dụ: \"4\", \"-12.5\", \"30\").\n  - Tuyệt đối KHÔNG viết đơn vị, KHÔNG viết chữ cái, KHÔNG viết phân số \"3/4\" (phải đổi ra số thập phân \"0.75\" hoặc làm tròn theo yêu cầu đề bài).\n\n══════════════════════════════════════════════════════════════════════════════\nCẤU TRÚC JSON ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI MÃ JSON):\n══════════════════════════════════════════════════════════════════════════════\n```json\n{\n  \"round1\": [\n    {\n      \"id\": 1,\n      \"text\": \"Câu 1. Cho hàm số $y = f(x)$ có bảng biến thiên như sau:\\n$$\\\\begin{array}{c|ccccc} x & -\\\\infty & & 0 & & 2 & & +\\\\infty \\\\\\\\ \\\\hline y' & & + & 0 & - & 0 & + & \\\\\\\\ \\\\hline y & & & 3 & & & & +\\\\infty \\\\\\\\ & & \\\\nearrow & & \\\\searrow & & \\\\nearrow & \\\\\\\\ & -\\\\infty & & & & -1 & & \\\\end{array}$$\\nGiá trị cực tiểu của hàm số đã cho bằng\",\n      \"options\": [\"A. $3$\", \"B. $2$\", \"C. $-1$\", \"D. $0$\"],\n      \"answer\": \"C. $-1$\",\n      \"points\": 0.25,\n      \"topic\": \"{{TOPIC}}\",\n      \"level\": \"Nhận biết\",\n      \"explanation\": \"Từ bảng biến thiên, tại điểm $x = 2$ hàm số đạt cực tiểu và giá trị cực tiểu tương ứng là $y_{CT} = -1$. Chọn C.\"\n    }\n  ],\n  \"round2\": [\n    {\n      \"id\": 1,\n      \"text\": \"Câu 1. Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B$, $AB = a$, $BC = a\\\\sqrt{3}$. Cạnh bên $SA$ vuông góc với mặt phẳng $(ABC)$ và $SA = 2a$.\\n<svg class=\\\"mx-auto my-3 block max-w-full\\\" viewBox=\\\"0 0 360 240\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><line x1=\\\"180\\\" y1=\\\"30\\\" x2=\\\"80\\\" y2=\\\"190\\\" stroke=\\\"#1e293b\\\" stroke-width=\\\"2\\\"/><line x1=\\\"180\\\" y1=\\\"30\\\" x2=\\\"280\\\" y2=\\\"190\\\" stroke=\\\"#1e293b\\\" stroke-width=\\\"2\\\"/><line x1=\\\"180\\\" y1=\\\"30\\\" x2=\\\"170\\\" y2=\\\"220\\\" stroke=\\\"#1e293b\\\" stroke-width=\\\"2\\\"/><line x1=\\\"80\\\" y1=\\\"190\\\" x2=\\\"170\\\" y2=\\\"220\\\" stroke=\\\"#1e293b\\\" stroke-width=\\\"2\\\"/><line x1=\\\"170\\\" y1=\\\"220\\\" x2=\\\"280\\\" y2=\\\"190\\\" stroke=\\\"#1e293b\\\" stroke-width=\\\"2\\\"/><line x1=\\\"80\\\" y1=\\\"190\\\" x2=\\\"280\\\" y2=\\\"190\\\" stroke=\\\"#94a3b8\\\" stroke-width=\\\"1.8\\\" stroke-dasharray=\\\"5,5\\\"/><text x=\\\"175\\\" y=\\\"22\\\" font-weight=\\\"bold\\\" fill=\\\"#1e293b\\\">S</text><text x=\\\"65\\\" y=\\\"195\\\" font-weight=\\\"bold\\\" fill=\\\"#1e293b\\\">A</text><text x=\\\"290\\\" y=\\\"195\\\" font-weight=\\\"bold\\\" fill=\\\"#1e293b\\\">C</text><text x=\\\"170\\\" y=\\\"235\\\" font-weight=\\\"bold\\\" fill=\\\"#1e293b\\\">B</text></svg>\",\n      \"statements\": [\n        { \"label\": \"a\", \"text\": \"Diện tích tam giác đáy $ABC$ bằng $\\\\frac{a^2\\\\sqrt{3}}{2}$.\", \"isTrue\": true, \"points\": 0.1 },\n        { \"label\": \"b\", \"text\": \"Đoạn thẳng $AC = 3a$.\", \"isTrue\": false, \"points\": 0.25 },\n        { \"label\": \"c\", \"text\": \"Thể tích khối chóp $S.ABC$ là $V = \\\\frac{a^3\\\\sqrt{3}}{3}$.\", \"isTrue\": true, \"points\": 0.5 },\n        { \"label\": \"d\", \"text\": \"Khoảng cách từ điểm $A$ đến mặt phẳng $(SBC)$ bằng $\\\\frac{2a}{\\\\sqrt{5}}$.\", \"isTrue\": true, \"points\": 1.0 }\n      ],\n      \"topic\": \"{{TOPIC}}\",\n      \"level\": \"Thông hiểu - Vận dụng\",\n      \"explanation\": \"Ta có $S_{\\\\Delta ABC} = \\\\frac{1}{2}AB \\\\cdot BC = \\\\frac{a^2\\\\sqrt{3}}{2}$ nên ý a đúng. $AC = \\\\sqrt{a^2 + 3a^2} = 2a$ nên ý b sai. Thể tích $V = \\\\frac{1}{3}SA \\\\cdot S_{ABC} = \\\\frac{a^3\\\\sqrt{3}}{3}$ nên ý c đúng...\"\n    }\n  ],\n  \"round3\": [\n    {\n      \"id\": 1,\n      \"text\": \"Câu 1. Khảo sát thời gian tự học (giờ/tuần) của một nhóm học sinh được ghi lại trong bảng sau:\\n<table class=\\\"w-full max-w-sm mx-auto my-2 border-collapse border border-slate-300 text-xs text-center\\\"><tr class=\\\"bg-sky-100 font-bold\\\"><th class=\\\"border border-slate-300 p-1\\\">Thời gian</th><th class=\\\"border border-slate-300 p-1\\\">Số học sinh</th></tr><tr><td class=\\\"border border-slate-300 p-1\\\">[0; 5)</td><td class=\\\"border border-slate-300 p-1\\\">4</td></tr><tr><td class=\\\"border border-slate-300 p-1\\\">[5; 10)</td><td class=\\\"border border-slate-300 p-1\\\">12</td></tr><tr><td class=\\\"border border-slate-300 p-1\\\">[10; 15)</td><td class=\\\"border border-slate-300 p-1\\\">18</td></tr><tr><td class=\\\"border border-slate-300 p-1\\\">[15; 20)</td><td class=\\\"border border-slate-300 p-1\\\">6</td></tr></table>\\nTính số trung bình mẫu số liệu ghép nhóm trên (kết quả làm tròn đến hàng phần mười).\",\n      \"answer\": \"11.1\",\n      \"points\": 0.5,\n      \"topic\": \"{{TOPIC}}\",\n      \"level\": \"Vận dụng\",\n      \"explanation\": \"Giá trị đại diện các nhóm lần lượt là 2.5, 7.5, 12.5, 17.5. Trung bình = (4*2.5 + 12*7.5 + 18*12.5 + 6*17.5)/40 = 445/40 = 11.125. Làm tròn đến hàng phần mười: 11.1.\"\n    }\n  ]\n}\n```\n";
            finalPrompt = rawTmpl1
                .replace(/\{\{GRADE\}\}/g, grade)
                .replace(/\{\{TOPIC\}\}/g, finalTopic)
                .replace(/\{\{LANG_DESC\}\}/g, langDesc)
                .replace(/\{\{BILINGUAL_INSTRUCTIONS\}\}/g, bilingualInstructions)
                .replace(/\{\{REQ_STR\}\}/g, reqStr);
        }

        if (sourceBlock) {
            finalPrompt += sourceBlock;
        }

        let outArea = document.getElementById('ai-prompt-text') || document.getElementById('ai-prompt-input');
        if (outArea) {
            outArea.value = finalPrompt;
        }
        return finalPrompt;
    } catch (err) {
        console.error("Lỗi sinh AI prompt:", err);
    }
}

function handleAiImageScanUpload(event) { let file = event.target.files[0]; if (!file) return; let reader = new FileReader(); reader.onload = function(e) { currentAiImageBase64 = e.target.result.split(',')[1]; document.getElementById('ai-source-text').value = "[Ảnh đã được đính kèm vào phân tích]"; showToast("Đã tải ảnh lên để AI phân tích!"); }; reader.readAsDataURL(file); }
        
        async function generateQuestionsViaAPI() { 
            let apiKey = getGeminiApiKey(); 
            if (!apiKey) return showToast("Vui lòng nhập API Key!", true); 
            let src = document.getElementById('ai-source-text').value.trim(); 
            if (!src && !currentAiImageBase64) return showToast("Nhập nội dung văn bản hoặc ảnh!", true); 
            
            let btn = document.getElementById('btn-call-api'); let old = btn.innerHTML; 
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang yêu cầu AI xử lý...'; 
            btn.disabled = true; 
            
            try { 
                let parts = [{ text: document.getElementById('ai-prompt-text').value + "\n\nNỘI DUNG/ẢNH CẦN XỬ LÝ:\n" + src }]; 
                if (currentAiImageBase64) parts.push({ inlineData: { mimeType: "image/jpeg", data: currentAiImageBase64 } }); 
                
                const responseSchema = {
                    type: "OBJECT",
                    properties: {
                        matrixData: { type: "ARRAY", items: { type: "OBJECT", properties: { topic: { type: "STRING" }, nb: { type: "NUMBER" }, th: { type: "NUMBER" }, vd: { type: "NUMBER" }, r1: { type: "NUMBER" }, r2: { type: "NUMBER" }, r3: { type: "NUMBER" } } } },
                        specData: { type: "ARRAY", items: { type: "OBJECT", properties: { topic: { type: "STRING" }, level: { type: "STRING" }, reqSkill: { type: "STRING" }, questions: { type: "STRING" } } } },
                        round1: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "INTEGER" }, text: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, answer: { type: "STRING" }, points: { type: "NUMBER" }, topic: { type: "STRING" }, level: { type: "STRING" }, reqSkill: { type: "STRING" }, explanation: { type: "STRING" } }, required: ["id", "text", "options", "answer"] } },
                        round2: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "INTEGER" }, text: { type: "STRING" }, statements: { type: "ARRAY", items: { type: "OBJECT", properties: { label: { type: "STRING" }, text: { type: "STRING" }, isTrue: { type: "BOOLEAN" }, points: { type: "NUMBER" } }, required: ["label", "text", "isTrue"] } }, topic: { type: "STRING" }, level: { type: "STRING" }, reqSkill: { type: "STRING" }, explanation: { type: "STRING" } }, required: ["id", "text", "statements"] } },
                        round3: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "INTEGER" }, text: { type: "STRING" }, answer: { type: "STRING" }, points: { type: "NUMBER" }, topic: { type: "STRING" }, level: { type: "STRING" }, reqSkill: { type: "STRING" }, explanation: { type: "STRING" } }, required: ["id", "text", "answer"] } }
                    },
                    required: ["round1", "round2", "round3"]
                };

                let payload = {
                    systemInstruction: { parts: [{ text: "BẠN LÀ CHUYÊN GIA KHẢO THÍ TOÁN HỌC CAO CẤP CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO (GDPT 2018).\n\nQUY TẮC CỐT LÕI:\n1. ĐỘ CHÍNH XÁC TOÁN HỌC: Mọi câu hỏi phải được giải nháp từng bước trong explanation trước khi điền answer/isTrue. Đáp án và lời giải phải trùng khớp 100%, không được ảo giác.\n2. QUY CHUẨN LATEX: Toàn bộ công thức kẹp trong $...$. Escape dấu gạch chéo \\\\frac, \\\\sqrt, \\\\int, \\\\vec chuẩn xác.\n3. PHẦN I: 4 lựa chọn không trùng lặp, bẫy nhiễu xuất phát từ sai lầm điển hình của học sinh.\n4. PHẦN II: Tình huống toán học sâu sắc, 4 mệnh đề a, b, c, d phát triển logic liên hoàn từ nhận biết đến vận dụng cao.\n5. PHẦN III: Đáp án bắt buộc là MỘT CON SỐ duy nhất (ví dụ: '4', '-12.5', '30'). Tuyệt đối không chứa chữ cái, đơn vị đo, hoặc biểu thức." }] },
                    contents: [{ parts: parts }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: responseSchema
                    }
                };

                let data = await callGeminiApiEndpoint(payload, apiKey);
                let jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                let parsed = smartParseJSON(jsonStr);
                if (!parsed) throw new Error("AI trả về kết quả không đúng cấu trúc JSON!");
                
                let sanitized = sanitizeGameData(parsed);
                let totalQs = (sanitized.round1?.length || 0) + (sanitized.round2?.length || 0) + (sanitized.round3?.length || 0);
                if (totalQs === 0) {
                    throw new Error("AI không sinh ra câu hỏi nào trong dữ liệu JSON!");
                }

                let chosenGrade = document.getElementById('ai-prompt-grade')?.value || '12';
                if (!adminState.meta) adminState.meta = {};
                adminState.meta.grade = chosenGrade;
                if (typeof setExportExamFolderValue === 'function') {
                    setExportExamFolderValue(getMathFolderFromGrade(chosenGrade));
                }
                if (document.getElementById('meta-grade')) document.getElementById('meta-grade').value = chosenGrade;

                adminState.loadedCode = null; 
                adminState.round = 'round1'; 
                adminState.data = sanitized; 
                GAME_DATA = JSON.parse(JSON.stringify(adminState.data)); 
                
                showToast(`AI đã sinh ${totalQs} câu hỏi thành công!`); 
                closeImportModal(); 
                renderAdminUI(); 
            } catch(e) { 
                showToast("Có lỗi từ AI: " + e.message, true); 
            } finally { 
                btn.innerHTML = old; btn.disabled = false; 
            } 
        }

        function handleImportPaste() { 
            try { 
                let rawText = document.getElementById('import-json-textarea').value;
                if (!rawText || !rawText.trim()) throw new Error("Vui lòng dán nội dung JSON vào ô nhập!");
                let parsed = smartParseJSON(rawText);
                if (!parsed) throw new Error("Vui lòng dán nội dung JSON hợp lệ!");
                
                let sanitized = sanitizeGameData(parsed);
                let totalQs = (sanitized.round1?.length || 0) + (sanitized.round2?.length || 0) + (sanitized.round3?.length || 0);
                if (totalQs === 0) {
                    throw new Error("Không tìm thấy câu hỏi nào hợp lệ trong dữ liệu JSON. Vui lòng kiểm tra lại cấu trúc JSON!");
                }

                adminState.loadedCode = null; 
                adminState.round = 'round1'; 
                adminState.data = sanitized; 
                GAME_DATA = JSON.parse(JSON.stringify(adminState.data)); 
                
                showToast(`Import JSON thành công (${totalQs} câu hỏi)!`); 
                closeImportModal(); 
                renderAdminUI(); 
            } catch(e) { 
                showToast("Cấu trúc JSON bị lỗi: " + (e.message || "Vui lòng kiểm tra lại!"), true); 
            } 
        }
        function resetToDefaultData() { showConfirmModal("Khôi phục", "Xóa toàn bộ đề hiện tại để về mẫu trắng?", () => { adminState.loadedCode = null; GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(DEFAULT_GAME_DATA))); adminState.data = JSON.parse(JSON.stringify(GAME_DATA)); adminSetTab('round1'); showToast("Đã làm sạch bản nháp!"); }); }

        let adminStudentList = [];
        let selectedStudentIds = new Set();
        let currentStudentClassFilter = 'ALL';

        async function loadAdminStudents() {
            try {
                let snap = await db.collection("Students").get();
                adminStudentList = [];
                snap.forEach(doc => adminStudentList.push(doc.data()));
                
                // Remove any selected ids that no longer exist
                let existingIds = new Set(adminStudentList.map(s => s.id));
                selectedStudentIds = new Set([...selectedStudentIds].filter(id => existingIds.has(id)));
                
                renderStudentManagement(document.getElementById('admin-content-area'), true);
            } catch(e) {
                showToast("Lỗi tải danh sách Học sinh", true);
            }
        }

        function getFilteredStudents() {
            let kw = (document.getElementById('search-student')?.value || '').toLowerCase().trim();
            let clsFilter = currentStudentClassFilter;
            return adminStudentList.filter(s => {
                let matchKw = !kw || String(s.id).toLowerCase().includes(kw) || String(s.name).toLowerCase().includes(kw) || String(s.cls).toLowerCase().includes(kw);
                let matchCls = clsFilter === 'ALL' || String(s.cls).trim() === clsFilter;
                return matchKw && matchCls;
            });
        }

        function renderStudentManagement(contentArea, skipFetch = false) {
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            
            // Extract unique class list for filter
            let classes = [...new Set(adminStudentList.map(s => s.cls).filter(Boolean))].sort();
            let classOptions = `<option value="ALL">Tất cả Lớp (${adminStudentList.length})</option>` + classes.map(c => {
                let count = adminStudentList.filter(s => s.cls === c).length;
                return `<option value="${c}" ${currentStudentClassFilter === c ? 'selected' : ''}>Lớp ${c} (${count})</option>`;
            }).join('');

            contentArea.innerHTML = `<div class="h-full flex flex-col p-6 lg:p-8 bg-slate-50 relative">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-2 border-slate-200 pb-5 mb-5 gap-4">
                    <div>
                        <div class="flex items-center gap-3">
                            <h3 class="text-2xl font-black text-mainDark uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-user-graduate mr-1"></i>Quản Lý Học Sinh</h3>
                            <span class="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full border border-indigo-200">${adminStudentList.length} Học sinh</span>
                        </div>
                        <p class="text-sm font-bold text-slate-500 mt-1">Cấp tài khoản, mật khẩu và quản trị danh sách dự thi</p>
                    </div>
                    <div class="flex gap-2.5 flex-wrap items-center">
                        <input type="text" id="search-student" oninput="renderAdminStudentsTable()" placeholder="Tìm ID, Tên, Lớp..." class="p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-main font-bold text-sm shadow-inner min-w-[180px]">
                        <select id="filter-student-class" onchange="currentStudentClassFilter=this.value; renderAdminStudentsTable();" class="p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-main font-bold text-sm bg-white shadow-inner">
                            ${classOptions}
                        </select>
                        <button onclick="document.getElementById('import-students-modal').classList.remove('hidden')" class="px-4 py-3 bg-mainLight text-mainDark hover:bg-main hover:text-white rounded-xl font-black text-sm transition shadow-sm btn-3d"><i class="fa-solid fa-file-import mr-1"></i> Import Nhanh</button>
                        <button onclick="openAddStudentModal()" class="px-4 py-3 bg-mainDark text-white hover:bg-indigo-700 rounded-xl font-black text-sm transition shadow-sm btn-3d"><i class="fa-solid fa-plus mr-1"></i> Thêm HS</button>
                        <button onclick="openBulkDeleteStudentsModal()" class="px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-2 border-rose-200 rounded-xl font-black text-sm transition shadow-sm btn-3d flex items-center gap-1.5" title="Mở tùy chọn xóa danh sách"><i class="fa-solid fa-trash-arrow-up"></i> Xóa Danh Sách</button>
                    </div>
                </div>

                <!-- Selection Action Bar (Appears when items are selected) -->
                <div id="student-selection-bar" class="hidden mb-4 p-3.5 bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm zoom-in">
                    <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-sm font-black"><i class="fa-solid fa-check-double"></i></span>
                        <span class="text-sm font-bold text-rose-900">Đang chọn: <b id="selected-students-count" class="text-rose-600 font-black text-base">0</b> / ${adminStudentList.length} học sinh</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="deleteSelectedStudents()" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md btn-3d flex items-center gap-1.5"><i class="fa-solid fa-trash-can"></i> Xóa Đã Chọn</button>
                        <button onclick="clearStudentSelection()" class="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs transition shadow-sm">Bỏ chọn</button>
                    </div>
                </div>

                <div class="flex-grow overflow-auto bg-white rounded-3xl shadow-inner border-2 border-slate-100 p-2">
                    <table class="w-full text-left text-sm whitespace-nowrap">
                        <thead class="bg-slate-50 sticky top-0 shadow-sm rounded-xl z-10 border-b border-slate-200">
                            <tr>
                                <th class="p-3.5 text-center w-12"><input type="checkbox" id="check-all-students" onchange="toggleSelectAllStudents(this)" class="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer" title="Chọn tất cả danh sách đang hiển thị"></th>
                                <th class="p-4 text-slate-600 font-black uppercase text-center w-16">STT</th>
                                <th class="p-4 text-slate-600 font-black uppercase">Mã ID</th>
                                <th class="p-4 text-slate-600 font-black uppercase">Họ Tên</th>
                                <th class="p-4 text-slate-600 font-black uppercase text-center">Lớp</th>
                                <th class="p-4 text-slate-600 font-black uppercase text-center">Mật Khẩu</th>
                                <th class="p-4 text-center text-slate-600 font-black uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="admin-students-body">
                            <tr><td colspan="7" class="text-center p-8 text-slate-400 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>`;
            
            if (!skipFetch) {
                loadAdminStudents();
            } else {
                renderAdminStudentsTable();
            }
        }

        function renderAdminStudentsTable() {
            let tbody = document.getElementById('admin-students-body');
            if(!tbody) return;
            let filtered = getFilteredStudents();
            
            if(filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center p-12 text-slate-400 font-bold"><i class="fa-solid fa-box-open text-4xl mb-3 block text-slate-300"></i> Không tìm thấy học sinh nào phù hợp</td></tr>`;
                updateSelectionBarUI();
                return;
            }

            // Check if all filtered are selected
            let allFilteredSelected = filtered.length > 0 && filtered.every(s => selectedStudentIds.has(s.id));
            let checkAllBox = document.getElementById('check-all-students');
            if (checkAllBox) checkAllBox.checked = allFilteredSelected;

            tbody.innerHTML = filtered.map((s, i) => {
                let isSelected = selectedStudentIds.has(s.id);
                let isDefaultPw = !s.password || s.password === 'hungtbs' || s.password === '123456';
                return `<tr class="border-b border-slate-100 hover:bg-amber-50/50 transition ${isSelected ? 'bg-rose-50/50' : ''}">
                    <td class="p-3 text-center"><input type="checkbox" class="student-checkbox w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer" value="${s.id}" ${isSelected ? 'checked' : ''} onchange="toggleSelectStudent('${s.id}', this)"></td>
                    <td class="p-3 text-center font-bold text-slate-400">${i+1}</td>
                    <td class="p-3 font-black text-mainDark tracking-wider">${s.id}</td>
                    <td class="p-3 font-bold text-slate-700">${s.name}</td>
                    <td class="p-3 text-center"><span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold text-xs border border-slate-200">${s.cls}</span></td>
                    <td class="p-3 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <span class="font-mono ${isDefaultPw ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} px-2 py-0.5 rounded border text-xs font-bold">${isDefaultPw ? 'hungtbs' : '••••••••'}</span>
                            ${isDefaultPw ? '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs" title="Chưa đổi MK mặc định (hungtbs)"></i>' : '<i class="fa-solid fa-shield-check text-emerald-500 text-xs" title="Đã đổi MK cá nhân"></i>'}
                        </div>
                    </td>
                    <td class="p-3 text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="resetStudentPassword('${s.id}')" class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition shadow-sm btn-3d" title="Đặt lại MK mặc định (hungtbs)"><i class="fa-solid fa-key"></i></button>
                            <button onclick="editStudentInfo('${s.id}')" class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition shadow-sm btn-3d" title="Sửa thông tin"><i class="fa-solid fa-pen"></i></button>
                            ${isCurrentUserSuperAdmin() ? `<button onclick="deleteStudent('${s.id}')" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition shadow-sm btn-3d" title="Xóa học sinh"><i class="fa-solid fa-trash"></i></button>` : ''}
                        </div>
                    </td>
                </tr>`;
            }).join('');

            updateSelectionBarUI();
        }

        function toggleSelectAllStudents(checkbox) {
            let filtered = getFilteredStudents();
            if (checkbox.checked) {
                filtered.forEach(s => selectedStudentIds.add(s.id));
            } else {
                filtered.forEach(s => selectedStudentIds.delete(s.id));
            }
            renderAdminStudentsTable();
        }

        function toggleSelectStudent(id, checkbox) {
            if (checkbox.checked) {
                selectedStudentIds.add(id);
            } else {
                selectedStudentIds.delete(id);
            }
            updateSelectionBarUI();
            
            let tr = checkbox.closest('tr');
            if (tr) {
                if (checkbox.checked) tr.classList.add('bg-rose-50/50');
                else tr.classList.remove('bg-rose-50/50');
            }

            let filtered = getFilteredStudents();
            let checkAllBox = document.getElementById('check-all-students');
            if (checkAllBox) {
                checkAllBox.checked = filtered.length > 0 && filtered.every(s => selectedStudentIds.has(s.id));
            }
        }

        function clearStudentSelection() {
            selectedStudentIds.clear();
            renderAdminStudentsTable();
        }

        function updateSelectionBarUI() {
            let bar = document.getElementById('student-selection-bar');
            let countEl = document.getElementById('selected-students-count');
            if (!bar) return;
            if (selectedStudentIds.size > 0 && isCurrentUserSuperAdmin()) {
                bar.classList.remove('hidden');
                if (countEl) countEl.innerText = selectedStudentIds.size;
            } else {
                bar.classList.add('hidden');
            }
        }

        // ======================= BULK DELETE STUDENTS LOGIC =======================
        function openBulkDeleteStudentsModal() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            let modal = document.getElementById('bulk-delete-students-modal');
            if (!modal) return;

            let filtered = getFilteredStudents();
            let selectedCount = selectedStudentIds.size;
            let filteredCount = filtered.length;
            let totalCount = adminStudentList.length;

            document.getElementById('modal-selected-count').innerText = selectedCount;
            document.getElementById('modal-filtered-count').innerText = filteredCount;
            document.getElementById('modal-total-count').innerText = totalCount;

            let btnSel = document.getElementById('btn-modal-del-selected');
            if (btnSel) {
                if (selectedCount === 0) {
                    btnSel.classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                    btnSel.classList.remove('opacity-50', 'cursor-not-allowed');
                }
            }

            modal.classList.remove('hidden');
        }

        function closeBulkDeleteStudentsModal() {
            let modal = document.getElementById('bulk-delete-students-modal');
            if (modal) modal.classList.add('hidden');
        }

        async function executeBatchDeleteStudents(idsToDelete, confirmTitle, confirmMsg) {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            if (!idsToDelete || idsToDelete.length === 0) {
                return showToast("Không có học sinh nào được chọn để xóa!", true);
            }

            showConfirmModal(confirmTitle, confirmMsg, async () => {
                showToast(`Đang xóa ${idsToDelete.length} học sinh khỏi CSDL...`);
                try {
                    let batch = db.batch();
                    let count = 0;
                    for (let id of idsToDelete) {
                        let ref = db.collection("Students").doc(id);
                        batch.delete(ref);
                        count++;
                        if (count % 400 === 0) {
                            await batch.commit();
                            batch = db.batch();
                        }
                    }
                    if (count % 400 !== 0) {
                        await batch.commit();
                    }

                    selectedStudentIds.clear();
                    showToast(`Đã xóa thành công ${count} học sinh!`);
                    closeBulkDeleteStudentsModal();
                    loadAdminStudents();
                } catch(e) {
                    showToast("Lỗi khi xóa học sinh: " + e.message, true);
                }
            });
        }

        function deleteSelectedStudents() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            if (selectedStudentIds.size === 0) {
                return showToast("Vui lòng tích chọn học sinh cần xóa!", true);
            }
            let ids = Array.from(selectedStudentIds);
            executeBatchDeleteStudents(
                ids,
                "Xác nhận xóa học sinh đã chọn",
                `Bạn có chắc chắn muốn xóa vĩnh viễn ${ids.length} học sinh đã tích chọn khỏi hệ thống?`
            );
        }

        function confirmDeleteSelectedFromModal() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            if (selectedStudentIds.size === 0) {
                return showToast("Chưa có học sinh nào được tích chọn trong bảng!", true);
            }
            deleteSelectedStudents();
        }

        function confirmDeleteFilteredFromModal() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            let filtered = getFilteredStudents();
            if (filtered.length === 0) {
                return showToast("Không có học sinh nào trong danh sách đang lọc!", true);
            }
            let ids = filtered.map(s => s.id);
            let filterDesc = currentStudentClassFilter !== 'ALL' ? `Lớp ${currentStudentClassFilter}` : "đang lọc";
            executeBatchDeleteStudents(
                ids,
                "Xóa danh sách học sinh đang lọc",
                `Bạn có chắc chắn muốn xóa toàn bộ ${ids.length} học sinh thuộc danh sách ${filterDesc}?`
            );
        }

        function confirmDeleteAllFromModal() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            if (adminStudentList.length === 0) {
                return showToast("Hệ thống chưa có học sinh nào để xóa!", true);
            }
            let ids = adminStudentList.map(s => s.id);
            executeBatchDeleteStudents(
                ids,
                "CẢNH BÁO: XÓA TOÀN BỘ HỌC SINH",
                `CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn xóa TOÀN BỘ ${ids.length} học sinh trong hệ thống? Thao tác này sẽ làm sạch cơ sở dữ liệu học sinh và không thể hoàn tác!`
            );
        }
        function openAddStudentModal(studentId = null) {
            let s = studentId ? adminStudentList.find(x => x.id === studentId) : null;
            document.getElementById('edit-stu-id').value = s ? s.id : '';
            document.getElementById('edit-stu-id').disabled = !!s;
            document.getElementById('edit-stu-name').value = s ? s.name : '';
            document.getElementById('edit-stu-cls').value = s ? s.cls : '';
            document.getElementById('edit-stu-modal').classList.remove('hidden');
        }
        function closeAddStudentModal() { document.getElementById('edit-stu-modal').classList.add('hidden'); }
        async function confirmAddStudent() {
            let id = document.getElementById('edit-stu-id').value.trim();
            let name = document.getElementById('edit-stu-name').value.trim();
            let cls = document.getElementById('edit-stu-cls').value.trim();
            if(!id || !name || !cls) return showToast("Vui lòng điền đủ thông tin!", true);
            let btn = document.getElementById('btn-save-stu'); let old = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; btn.disabled = true;
            try {
                let docRef = db.collection("Students").doc(id);
                let snap = await docRef.get();
                let isNew = !document.getElementById('edit-stu-id').disabled;
                if(isNew && snap.exists) throw new Error("Mã ID này đã tồn tại!");
                
                let data = { id: id, name: name, cls: cls };
                if (isNew) data.password = 'hungtbs'; 
                await docRef.set(data, { merge: true });
                showToast(isNew ? "Thêm học sinh thành công!" : "Cập nhật thành công!");
                closeAddStudentModal();
                loadAdminStudents();
            } catch(e) {
                showToast(e.message, true);
            } finally {
                btn.innerHTML = old; btn.disabled = false;
            }
        }
        function editStudentInfo(id) { openAddStudentModal(id); }
        async function resetStudentPassword(id) {
            showConfirmModal("Đặt lại mật khẩu", `Bạn muốn đặt lại MK của ${id} về mặc định 'hungtbs'?`, async () => {
                try {
                    await db.collection("Students").doc(id).update({ password: 'hungtbs' });
                    showToast("Đã Reset Mật khẩu về 'hungtbs'!");
                    loadAdminStudents();
                } catch(e) { showToast("Lỗi Reset MK", true); }
            });
        }
        async function deleteStudent(id) {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa học sinh!", true);
            }
            showConfirmModal("Xóa Học sinh", `Xóa vĩnh viễn học sinh ${id} khỏi hệ thống?`, async () => {
                try {
                    await db.collection("Students").doc(id).delete();
                    selectedStudentIds.delete(id);
                    showToast("Đã xóa học sinh!");
                    loadAdminStudents();
                } catch(e) { showToast("Lỗi xóa", true); }
            });
        }
        function closeImportStudentsModal() { document.getElementById('import-students-modal').classList.add('hidden'); }
        
        function handleExcelUpload(event) {
            let file = event.target.files[0];
            if(!file) return;
            let reader = new FileReader();
            reader.onload = function(e) {
                try {
                    let data = new Uint8Array(e.target.result);
                    let workbook = XLSX.read(data, {type: 'array'});
                    let firstSheetName = workbook.SheetNames[0];
                    let worksheet = workbook.Sheets[firstSheetName];
                    let json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                    
                    let resultText = "";
                    for(let i = 0; i < json.length; i++) {
                        let row = json[i];
                        if(!row || row.length === 0 || row.join('').trim() === '') continue;
                        // Bỏ qua dòng tiêu đề nếu có chữ ID hoặc Mã
                        if(String(row[0]).toLowerCase().includes('id') || String(row[0]).toLowerCase().includes('mã')) continue;
                        
                        let id = row[0] ? String(row[0]).trim() : '';
                        let name = row[1] ? String(row[1]).trim() : '';
                        let cls = row[2] ? String(row[2]).trim() : '';
                        
                        if(id) {
                            resultText += `${id}\t${name}\t${cls}\n`;
                        }
                    }
                    
                    document.getElementById('import-stu-data').value = resultText;
                    showToast("Đã đọc file Excel thành công! Vui lòng kiểm tra lại bảng bên dưới trước khi nạp.", false);
                } catch(err) {
                    showToast("Lỗi đọc file Excel: " + err.message, true);
                }
                event.target.value = ""; // Reset input
            };
            reader.readAsArrayBuffer(file);
        }

        async function processImportStudents() {
            let raw = document.getElementById('import-stu-data').value.trim();
            if(!raw) return showToast("Chưa dán dữ liệu!", true);
            let lines = raw.split('\n').map(x => x.trim()).filter(Boolean);
            let parsed = [];
            for (let line of lines) {
                let parts = line.split('\t');
                if (parts.length >= 3) {
                    parsed.push({ id: parts[0].trim(), name: parts[1].trim(), cls: parts[2].trim(), password: 'hungtbs' });
                }
            }
            if(parsed.length === 0) return showToast("Dữ liệu không đúng định dạng (ID - Tên - Lớp phân cách bằng Tab)", true);
            
            let btn = document.getElementById('btn-import-stu'); let old = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang nạp...'; btn.disabled = true;
            try {
                let batch = db.batch();
                let count = 0;
                for (let s of parsed) {
                    let ref = db.collection("Students").doc(s.id);
                    batch.set(ref, s, { merge: true });
                    count++;
                    if(count % 400 === 0) { await batch.commit(); batch = db.batch(); }
                }
                if(count % 400 !== 0) await batch.commit();
                showToast(`Đã import thành công ${count} học sinh!`);
                closeImportStudentsModal();
                loadAdminStudents();
            } catch(e) {
                showToast("Lỗi Import: " + e.message, true);
            } finally {
                btn.innerHTML = old; btn.disabled = false;
                document.getElementById('import-stu-data').value = '';
            }
        }

        function renderTeacherManagement(contentArea) { 
            let isSuperAdmin = isCurrentUserSuperAdmin();
            let superAdminClean = (typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com').toLowerCase().trim();

            if (!isSuperAdmin) { 
                contentArea.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50">
                    <i class="fa-solid fa-lock text-6xl text-slate-300 mb-4"></i>
                    <h3 class="text-2xl font-black text-slate-700 uppercase">Khu vực hạn chế</h3>
                    <p class="text-slate-500 mt-2 font-medium">Chỉ Quản trị viên cấp cao (Super Admin: <b>${SUPER_ADMIN_EMAIL}</b>) mới có quyền phân quyền thành viên hệ thống.</p>
                </div>`; 
                return; 
            } 

            // Đảm bảo Super Admin luôn có trong danh sách
            if (!state.authorizedEmails.map(e => (e || '').toLowerCase().trim()).includes(superAdminClean)) {
                state.authorizedEmails.unshift(SUPER_ADMIN_EMAIL);
            }

            let listHtml = state.authorizedEmails.map((email, idx) => {
                let isSuper = email.toLowerCase().trim() === superAdminClean;
                return `
                <div class="flex justify-between items-center bg-white p-4 md:p-5 rounded-2xl border border-slate-200 mb-3 shadow-sm hover:border-sky-300 transition">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-10 h-10 rounded-xl ${isSuper ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'} flex items-center justify-center text-lg shrink-0">
                            <i class="fa-solid ${isSuper ? 'fa-crown' : 'fa-user-shield'}"></i>
                        </div>
                        <div class="truncate">
                            <span class="font-bold text-slate-800 text-sm md:text-base block truncate">${email}</span>
                            <span class="text-xs text-slate-400">${isSuper ? 'Chủ sở hữu hệ thống (Toàn quyền)' : 'Giáo viên được cấp quyền Quản trị'}</span>
                        </div>
                    </div>
                    <div class="shrink-0 ml-3">
                        ${!isSuper ? `
                            <button onclick="removeAuthorizedTeacher('${email}')" class="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-1.5 border border-rose-200 btn-3d" title="Hủy quyền giáo viên này">
                                <i class="fa-solid fa-trash-can"></i> <span class="hidden sm:inline">Hủy Quyền</span>
                            </button>
                        ` : `
                            <span class="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider border border-rose-200 shadow-xs flex items-center gap-1">
                                <i class="fa-solid fa-crown text-[10px]"></i> Super Admin
                            </span>
                        `}
                    </div>
                </div>`;
            }).join(''); 

            contentArea.innerHTML = `
            <div class="h-full flex flex-col p-6 md:p-8 bg-slate-50/80 overflow-hidden">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 shrink-0">
                    <div>
                        <h3 class="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-wide flex items-center gap-2.5">
                            <i class="fa-solid fa-user-shield text-rose-500"></i> Phân Quyền Giáo Viên
                            <span class="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">${state.authorizedEmails.length} tài khoản</span>
                        </h3>
                        <p class="text-xs text-slate-500 font-medium mt-1">Cấp quyền cho các tài khoản Google của Giáo viên truy cập khu vực Quản trị & Tạo đề thi</p>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 shrink-0">
                    <label class="block text-xs font-bold text-slate-600 uppercase mb-2">Thêm tài khoản Giáo viên mới (Google Email):</label>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <div class="relative flex-grow">
                            <i class="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input type="email" id="new-teacher-email" onkeydown="if(event.key==='Enter') addAuthorizedTeacher()" placeholder="VD: giaovien.toan@gmail.com..." class="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-sky-500 font-semibold text-sm bg-slate-50/50 focus:bg-white transition">
                        </div>
                        <button onclick="addAuthorizedTeacher()" id="btn-add-teacher" class="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-black text-sm btn-3d hover:from-sky-600 hover:to-indigo-700 transition shadow-md flex items-center justify-center gap-2 shrink-0">
                            <i class="fa-solid fa-user-plus"></i> Cấp Quyền Mới
                        </button>
                    </div>
                </div>

                <div class="flex-grow overflow-y-auto custom-scrollbar pr-1">
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Danh sách Giáo viên đã phân quyền:</div>
                    ${listHtml}
                </div>
            </div>`; 
        }

        async function addAuthorizedTeacher() { 
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền phân quyền giáo viên!", true);
            }
            let emailInput = document.getElementById('new-teacher-email');
            let e = emailInput ? emailInput.value.trim().toLowerCase() : ''; 
            if (!e || !e.includes('@') || !e.includes('.')) return showToast("Email Google không hợp lệ!", true); 
            
            let cleanList = state.authorizedEmails.map(x => (x || '').toLowerCase().trim());
            if (cleanList.includes(e)) return showToast("Email này đã có trong danh sách phân quyền!", true); 

            let btn = document.getElementById('btn-add-teacher');
            let oldHtml = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang thêm...'; btn.disabled = true; }

            state.authorizedEmails.push(e); 
            localStorage.setItem('tbs_authorized_teachers', JSON.stringify(state.authorizedEmails));

            try { 
                await db.collection("GameData").doc("AuthorizedTeachers").set({ 
                    list: state.authorizedEmails,
                    updatedAt: new Date().toISOString(),
                    updatedBy: state.currentUser ? (state.currentUser.email || 'SuperAdmin') : 'SuperAdmin'
                }); 
                showToast(`Đã cấp quyền thành công cho "${e}"!`); 
                if (emailInput) emailInput.value = '';
                renderTeacherManagement(document.getElementById('admin-content-area')); 
            } catch(err) { 
                state.authorizedEmails = state.authorizedEmails.filter(x => x.toLowerCase().trim() !== e); 
                localStorage.setItem('tbs_authorized_teachers', JSON.stringify(state.authorizedEmails));
                showToast("Lỗi hệ thống lưu trữ: " + err.message, true); 
            } finally {
                if (btn) { btn.innerHTML = oldHtml; btn.disabled = false; }
            }
        }

        async function removeAuthorizedTeacher(e) { 
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền hủy quyền giáo viên!", true);
            }
            let superAdminClean = (SUPER_ADMIN_EMAIL || 'tailieutoantbs@gmail.com').toLowerCase().trim();
            if (e.toLowerCase().trim() === superAdminClean) {
                return showToast("Không thể hủy quyền của Super Admin!", true);
            } 
            
            showConfirmModal("Hủy quyền truy cập", `Thầy/Cô có chắc muốn hủy quyền Quản trị của: "${e}"?`, async () => { 
                let prev = [...state.authorizedEmails]; 
                state.authorizedEmails = state.authorizedEmails.filter(x => x.toLowerCase().trim() !== e.toLowerCase().trim()); 
                localStorage.setItem('tbs_authorized_teachers', JSON.stringify(state.authorizedEmails));

                try { 
                    await db.collection("GameData").doc("AuthorizedTeachers").set({ 
                        list: state.authorizedEmails,
                        updatedAt: new Date().toISOString(),
                        updatedBy: state.currentUser ? (state.currentUser.email || 'SuperAdmin') : 'SuperAdmin'
                    }); 
                    showToast(`Đã hủy quyền tài khoản "${e}"!`); 
                    renderTeacherManagement(document.getElementById('admin-content-area')); 
                } catch(err) { 
                    state.authorizedEmails = prev; 
                    localStorage.setItem('tbs_authorized_teachers', JSON.stringify(state.authorizedEmails));
                    showToast("Lỗi xóa quyền: " + err.message, true); 
                } 
            }); 
        }

        // =========================================================================
        // QUẢN LÝ INFOGRAPHIC GDPT 2018 CHO MENU HAMBURGER (TEACHER STUDIO)
        // =========================================================================
        let cachedTeacherInfographics = [];
        let currentInfographicsGradeFilter = 'all';
        let currentInfographicsSearchQuery = '';
        let currentInfographicsViewMode = localStorage.getItem('tbs_teacher_info_view_mode') || 'list';

        function setInfographicsViewMode(mode) {
            currentInfographicsViewMode = mode;
            try { localStorage.setItem('tbs_teacher_info_view_mode', mode); } catch(e){}
            renderInfographicManagement(document.getElementById('admin-content-area'));
        }

        async function loadTeacherInfographics() {
            if (typeof InfographicsService !== 'undefined') {
                cachedTeacherInfographics = await InfographicsService.getAll();
            } else {
                try {
                    let local = localStorage.getItem('tbs_custom_infographics');
                    if (local) cachedTeacherInfographics = JSON.parse(local);
                } catch(e){}
            }
            return cachedTeacherInfographics;
        }

        async function renderInfographicManagement(contentArea) {
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            if (!contentArea) return;

            // Load latest data
            await loadTeacherInfographics();
            let driveUrl = typeof GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL !== 'undefined' ? GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL : "https://drive.google.com/drive/folders/1SFTz4ONPh1EodIWm84b1Qsgj58ggGEjG?lfhs=2";

            let grades = ['all', '12', '11', '10', '9', '8', '7', '6'];
            let gradeFilterHtml = grades.map(g => {
                let isSel = (g === currentInfographicsGradeFilter);
                let label = g === 'all' ? 'Tất cả khối lớp' : `Lớp ${g}`;
                let count = g === 'all' 
                    ? cachedTeacherInfographics.length 
                    : cachedTeacherInfographics.filter(x => String(x.grade) === String(g)).length;
                return `
                    <button type="button" onclick="currentInfographicsGradeFilter='${g}'; renderInfographicManagement(document.getElementById('admin-content-area'));" class="px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${isSel ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200'}">
                        <span>${label}</span>
                        <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'} font-bold">${count}</span>
                    </button>
                `;
            }).join('');

            // Filter infographics list
            let filteredList = cachedTeacherInfographics.filter(item => {
                if (currentInfographicsGradeFilter !== 'all' && String(item.grade) !== String(currentInfographicsGradeFilter)) {
                    return false;
                }
                if (currentInfographicsSearchQuery) {
                    let q = removeVietnameseTones(currentInfographicsSearchQuery).toLowerCase();
                    let t = removeVietnameseTones(item.title || '').toLowerCase();
                    let c = removeVietnameseTones(item.lessonCode || '').toLowerCase();
                    let s = removeVietnameseTones(item.summary || '').toLowerCase();
                    if (!t.includes(q) && !c.includes(q) && !s.includes(q)) return false;
                }
                return true;
            });

            // Infographics Items HTML (Grid or List View)
            let itemsHtml = '';
            if (filteredList.length === 0) {
                itemsHtml = `
                    <div class="col-span-full p-8 md:p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300 space-y-4">
                        <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <i class="fa-solid fa-shapes"></i>
                        </div>
                        <div>
                            <h4 class="text-base md:text-lg font-black text-slate-700">Chưa có Infographic nào trong bộ lọc này</h4>
                            <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">Thầy/Cô có thể bấm "+ Thêm Infographic Mới" hoặc chọn nhanh bài học từ cây kiến thức GDPT 2018 bên dưới để tạo sơ đồ tư duy cho học sinh xem trong Menu Hamburger.</p>
                        </div>
                        <button type="button" onclick="openAddInfographicModal('${currentInfographicsGradeFilter === 'all' ? '12' : currentInfographicsGradeFilter}')" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-xl font-black text-xs shadow-md transition btn-3d inline-flex items-center gap-2">
                            <i class="fa-solid fa-plus-circle"></i> Thêm Infographic Đầu Tiên
                        </button>
                    </div>
                `;
            } else if (currentInfographicsViewMode === 'list') {
                // ================= LIST VIEW (DẠNG DANH SÁCH GỌN GÀNG) =================
                let listRows = filteredList.map((item, idx) => {
                    let previewImg = item.imageUrl || (item.driveUrl ? InfographicsService.convertDriveUrl(item.driveUrl) : '');
                    let hasRealImg = previewImg && (previewImg.startsWith('http') || previewImg.startsWith('data:image'));
                    let displayImg = hasRealImg ? previewImg : '';
                    let updateDateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : 'Mới tạo';

                    return `
                        <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                            <!-- Left: Thumbnail & Info -->
                            <div class="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                                <!-- Thumbnail Thumbnail with zoom click -->
                                <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer group/thumb" onclick="openModalInfographicFullPreview('${displayImg.replace(/'/g, "\\'")}', '${(item.title||'').replace(/'/g, "\\'")}')">
                                    ${hasRealImg ? `
                                        <img src="${displayImg}" alt="${item.title}" class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" onerror="this.parentElement.innerHTML='<div class=\\'text-slate-400 text-[10px] text-center p-1\\'>Lỗi ảnh</div>';">
                                        <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                            <i class="fa-solid fa-expand"></i>
                                        </div>
                                    ` : `
                                        <div class="flex flex-col items-center justify-center text-indigo-400 text-center p-1">
                                            <i class="fa-solid fa-file-image text-xl sm:text-2xl"></i>
                                            <span class="text-[9px] text-slate-400 mt-0.5 font-bold">Drive</span>
                                        </div>
                                    `}
                                </div>

                                <!-- Metadata & Title -->
                                <div class="space-y-1.5 flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-black text-[11px] border border-indigo-200">
                                            Lớp ${item.grade || '12'}
                                        </span>
                                        ${item.lessonCode ? `
                                            <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-indigo-900 font-mono font-black text-[11px] border border-slate-300">
                                                ${item.lessonCode}
                                            </span>
                                        ` : ''}
                                        <span class="text-[11px] text-slate-400 font-medium">
                                            <i class="fa-regular fa-clock mr-1"></i>${updateDateStr}
                                        </span>
                                    </div>

                                    <h4 class="font-black text-sm text-slate-800 group-hover:text-indigo-600 transition truncate" title="${item.title}">
                                        ${item.title || 'Chưa có tiêu đề'}
                                    </h4>

                                    <p class="text-xs text-slate-500 line-clamp-1 leading-relaxed" title="${item.summary || ''}">
                                        ${item.summary || 'Tóm tắt kiến thức cốt lõi & Sơ đồ tư duy định hướng GDPT 2018.'}
                                    </p>

                                    ${item.driveUrl ? `
                                        <div class="pt-0.5">
                                            <a href="${item.driveUrl}" target="_blank" class="text-[11px] font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1.5 truncate" title="${item.driveUrl}">
                                                <i class="fa-brands fa-google-drive text-xs"></i>
                                                <span class="truncate">Mở Google Drive</span>
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Right: Action Buttons Group -->
                            <div class="flex items-center gap-1.5 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                                ${hasRealImg ? `
                                    <button type="button" onclick="openModalInfographicFullPreview('${displayImg.replace(/'/g, "\\'")}', '${(item.title||'').replace(/'/g, "\\'")}')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5" title="Xem phóng to infographic">
                                        <i class="fa-solid fa-expand text-slate-500"></i> <span class="hidden sm:inline">Xem</span>
                                    </button>
                                ` : ''}
                                <button type="button" onclick="openEditInfographicModal('${item.id}')" class="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs border border-indigo-200 transition flex items-center gap-1.5" title="Chỉnh sửa nội dung">
                                    <i class="fa-solid fa-pen-to-square"></i> <span>Sửa</span>
                                </button>
                                <button type="button" onclick="openReplaceInfographicModal('${item.id}')" class="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs border border-amber-200 transition flex items-center gap-1.5" title="Thay thế ảnh / liên kết">
                                    <i class="fa-solid fa-arrows-rotate"></i> <span>Thay thế</span>
                                </button>
                                <button type="button" onclick="deleteTeacherInfographic('${item.id}')" class="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 text-xs transition flex items-center justify-center border border-rose-200" title="Xóa infographic">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                itemsHtml = `
                    <div class="space-y-3">
                        ${listRows}
                    </div>
                `;
            } else {
                // ================= GRID VIEW (DẠNG LƯỚI THẺ CARD) =================
                let cardsHtml = filteredList.map((item, idx) => {
                    let previewImg = item.imageUrl || (item.driveUrl ? InfographicsService.convertDriveUrl(item.driveUrl) : '');
                    let hasRealImg = previewImg && (previewImg.startsWith('http') || previewImg.startsWith('data:image'));
                    let displayImg = hasRealImg ? previewImg : '';
                    let updateDateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : 'Mới tạo';

                    return `
                        <div class="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
                            <!-- Image / Thumbnail Header -->
                            <div class="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center cursor-pointer" onclick="openModalInfographicFullPreview('${displayImg.replace(/'/g, "\\'")}', '${(item.title||'').replace(/'/g, "\\'")}')">
                                ${hasRealImg ? `
                                    <img src="${displayImg}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.parentElement.innerHTML='<div class=\\'flex flex-col items-center justify-center h-full text-slate-400 text-xs gap-1\\'><i class=\\'fa-regular fa-image text-3xl mb-1 text-slate-500\\'></i><span>Lỗi tải ảnh</span></div>';">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                    <span class="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-white font-bold flex items-center gap-1 border border-white/20">
                                        <i class="fa-solid fa-expand"></i> Phóng to
                                    </span>
                                ` : `
                                    <div class="flex flex-col items-center justify-center text-slate-400 p-4 text-center space-y-1">
                                        <i class="fa-solid fa-file-image text-4xl text-indigo-400/80 mb-1"></i>
                                        <span class="text-xs font-bold text-slate-300">Infographic Google Drive</span>
                                        <span class="text-[10px] text-slate-400">(Chưa đính kèm ảnh trực tiếp)</span>
                                    </div>
                                `}
                                <!-- Grade Badge -->
                                <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                    <span class="px-2.5 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white font-black text-[11px] shadow-sm border border-white/20">
                                        Lớp ${item.grade || '12'}
                                    </span>
                                    ${item.lessonCode ? `
                                        <span class="px-2 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-amber-300 font-mono font-black text-[10px] border border-amber-300/30">
                                            ${item.lessonCode}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Card Body -->
                            <div class="p-4 flex flex-col flex-grow space-y-2.5 text-left">
                                <h4 class="font-black text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-700 transition" title="${item.title}">
                                    ${item.title || 'Chưa có tiêu đề'}
                                </h4>
                                
                                <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-grow">
                                    ${item.summary || 'Tóm tắt kiến thức cốt lõi & Sơ đồ tư duy định hướng GDPT 2018.'}
                                </p>

                                ${item.driveUrl ? `
                                    <div class="pt-1">
                                        <a href="${item.driveUrl}" target="_blank" class="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 truncate" title="${item.driveUrl}">
                                            <i class="fa-brands fa-google-drive text-xs shrink-0"></i>
                                            <span class="truncate">Mở liên kết Drive</span>
                                        </a>
                                    </div>
                                ` : ''}

                                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                    <span><i class="fa-regular fa-clock mr-1"></i>${updateDateStr}</span>
                                    <span>${item.updatedBy || 'Giáo viên TBS'}</span>
                                </div>
                            </div>

                            <!-- Action Buttons Footer -->
                            <div class="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 shrink-0">
                                <button type="button" onclick="openEditInfographicModal('${item.id}')" class="flex-1 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs border border-slate-200 hover:border-indigo-300 transition flex items-center justify-center gap-1" title="Cập nhật tiêu đề, mô tả, nội dung">
                                    <i class="fa-solid fa-pen-to-square"></i> <span>Sửa</span>
                                </button>
                                <button type="button" onclick="openReplaceInfographicModal('${item.id}')" class="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-xs border border-amber-200 transition flex items-center justify-center gap-1" title="Thay thế nhanh hình ảnh hoặc liên kết">
                                    <i class="fa-solid fa-arrows-rotate"></i> <span>Thay thế</span>
                                </button>
                                <button type="button" onclick="deleteTeacherInfographic('${item.id}')" class="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 text-xs transition flex items-center justify-center border border-rose-200" title="Xóa infographic">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                itemsHtml = `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        ${cardsHtml}
                    </div>
                `;
            }

            // GDPT 2018 Quick Lesson Explorer (Tree for current grade)
            let currGrade = currentInfographicsGradeFilter === 'all' ? '12' : currentInfographicsGradeFilter;
            let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[currGrade]) || (currGrade === '10' ? '0' : (currGrade === '11' ? '1' : (currGrade === '12' ? '2' : currGrade)));
            let gData = (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) || null;
            let curriculumQuickBrowseHtml = '';

            if (gData && gData.branches) {
                let branchesHtml = Object.keys(gData.branches).map(bKey => {
                    let bData = gData.branches[bKey];
                    let chsHtml = Object.keys(bData.chapters || {}).map(cKey => {
                        let cData = bData.chapters[cKey];
                        let chPrefix = `[${gCode}${bKey}${cKey}]`;
                        let lessonsHtml = Object.keys(cData.lessons || {}).map(lKey => {
                            let lData = cData.lessons[lKey];
                            let lsCode = `[${gCode}${bKey}${cKey}?${lKey}]`;
                            let lsTitle = `Bài ${lKey}: ${lData.name}`;
                            let existing = cachedTeacherInfographics.find(x => x.lessonCode === lsCode || (x.grade === currGrade && x.title && x.title.includes(lsTitle)));
                            
                            return `
                                <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs hover:border-indigo-300 transition">
                                    <div class="flex items-center gap-2 overflow-hidden pr-2">
                                        <span class="font-mono font-bold text-indigo-700 text-[11px] shrink-0">${lsCode}</span>
                                        <span class="font-medium text-slate-800 truncate">${lsTitle}</span>
                                        ${existing ? `<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0 flex items-center gap-1"><i class="fa-solid fa-check"></i> Đã có</span>` : ''}
                                    </div>
                                    <button type="button" onclick="openAddInfographicModal('${currGrade}', '${lsCode}', '${lsTitle.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg ${existing ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'} text-[11px] font-bold shrink-0 transition flex items-center gap-1">
                                        <i class="fa-solid ${existing ? 'fa-pen' : 'fa-plus'}"></i> ${existing ? 'Sửa' : 'Tạo Infographic'}
                                    </button>
                                </div>
                            `;
                        }).join('');

                        return `
                            <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                                <div class="text-xs font-black text-slate-800 flex items-center justify-between">
                                    <span>${chPrefix} Chương ${cKey}: ${cData.name}</span>
                                    <span class="text-[10px] text-slate-500 font-bold">${Object.keys(cData.lessons || {}).length} bài</span>
                                </div>
                                <div class="space-y-1.5">
                                    ${lessonsHtml}
                                </div>
                            </div>
                        `;
                    }).join('');

                    return `
                        <div class="space-y-3">
                            <div class="text-xs font-black text-indigo-900 uppercase tracking-wide flex items-center gap-2 pb-1 border-b border-indigo-200">
                                <i class="fa-solid ${bKey === 'D' ? 'fa-calculator' : 'fa-shapes'} text-indigo-600"></i>
                                <span>Phần: ${bData.name}</span>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${chsHtml}
                            </div>
                        </div>
                    `;
                }).join('');

                curriculumQuickBrowseHtml = `
                    <div class="mt-8 pt-6 border-t-2 border-slate-200">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h4 class="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                    <i class="fa-solid fa-sitemap text-indigo-600"></i> Cây Bài Học GDPT 2018 (Lớp ${currGrade})
                                </h4>
                                <p class="text-xs text-slate-500">Bấm "Tạo Infographic" để gán sơ đồ tư duy trực tiếp vào từng bài trong cây kiến thức</p>
                            </div>
                        </div>
                        <div class="space-y-6">
                            ${branchesHtml}
                        </div>
                    </div>
                `;
            }

            contentArea.innerHTML = `
                <div class="h-full flex flex-col p-4 md:p-6 bg-slate-50/80 overflow-y-auto admin-scroll">
                    <!-- Top Infographic Header & Stats -->
                    <div class="bg-white p-4 md:p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
                        <div class="flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                                <i class="fa-solid fa-shapes"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">
                                        Quản Trị Infographic (Menu Hamburger)
                                    </h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black border border-indigo-200">
                                        ${cachedTeacherInfographics.length} Infographic
                                    </span>
                                </div>
                                <p class="text-xs text-slate-500 mt-0.5">Tạo mới, cập nhật, xóa hoặc thay thế ảnh sơ đồ tư duy & kiến thức cốt lõi cho học sinh tra cứu</p>
                            </div>
                        </div>

                        <!-- Top Action Buttons -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <a href="${driveUrl}" target="_blank" class="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs transition border border-amber-200 flex items-center gap-2 btn-3d">
                                <i class="fa-brands fa-google-drive text-amber-600 text-sm"></i> Kho Google Drive
                            </a>
                            <button type="button" onclick="openAddInfographicModal('${currentInfographicsGradeFilter === 'all' ? '12' : currentInfographicsGradeFilter}')" class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-black rounded-xl text-xs shadow-md transition btn-3d flex items-center gap-2">
                                <i class="fa-solid fa-plus-circle"></i> + Thêm Infographic Mới
                            </button>
                        </div>
                    </div>

                    <!-- Filter Bar & Search & View Mode Toggle -->
                    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 shrink-0">
                        <!-- Grade Tabs -->
                        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                            ${gradeFilterHtml}
                        </div>

                        <!-- Right: Search & View Mode Switcher -->
                        <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <!-- Search Bar -->
                            <div class="relative flex-1 min-w-[200px] sm:min-w-[280px]">
                                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                                <input type="text" id="teacher-infographic-search" value="${currentInfographicsSearchQuery}" oninput="currentInfographicsSearchQuery=this.value; renderInfographicManagement(document.getElementById('admin-content-area'));" placeholder="Tìm kiếm theo mã ID, bài học, chuyên đề..." class="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 shadow-inner">
                            </div>

                            <!-- View Mode Toggle Buttons -->
                            <div class="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300 shrink-0">
                                <button type="button" onclick="setInfographicsViewMode('list')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${currentInfographicsViewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}" title="Hiển thị dạng Danh Sách">
                                    <i class="fa-solid fa-list-ul"></i> <span class="hidden sm:inline">Danh sách</span>
                                </button>
                                <button type="button" onclick="setInfographicsViewMode('grid')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${currentInfographicsViewMode === 'grid' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}" title="Hiển thị dạng Lưới Ảnh">
                                    <i class="fa-solid fa-table-cells-large"></i> <span class="hidden sm:inline">Lưới</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Infographics List / Grid Container -->
                    ${itemsHtml}

                    <!-- Quick GDPT 2018 Browser -->
                    ${curriculumQuickBrowseHtml}
                </div>
            `;
        }

        // ======================= MODAL LOGIC & EVENT HANDLERS =======================
        function openAddInfographicModal(grade, lessonCode, lessonTitle) {
            let modal = document.getElementById('infographic-editor-modal');
            if (!modal) return;
            
            document.getElementById('infographic-editor-modal-title').innerText = "Thêm Infographic Mới";
            document.getElementById('info-edit-id').value = '';
            
            let g = grade || (currentInfographicsGradeFilter !== 'all' ? currentInfographicsGradeFilter : '12');
            let gradeSelect = document.getElementById('info-edit-grade');
            if (gradeSelect) gradeSelect.value = g;
            
            onInfographicModalGradeChange(g);

            if (lessonCode) {
                document.getElementById('info-edit-code').value = lessonCode;
            }
            if (lessonTitle) {
                document.getElementById('info-edit-title').value = lessonTitle;
            }
            
            document.getElementById('info-edit-summary').value = '';
            document.getElementById('info-edit-image-url').value = '';
            document.getElementById('info-edit-drive-url').value = '';
            clearModalInfographicImage();

            modal.classList.remove('hidden');
        }

        function openEditInfographicModal(id) {
            let item = cachedTeacherInfographics.find(x => x.id === id);
            if (!item) return showToast("Không tìm thấy Infographic!", true);

            let modal = document.getElementById('infographic-editor-modal');
            if (!modal) return;

            document.getElementById('infographic-editor-modal-title').innerText = "Cập Nhật Infographic";
            document.getElementById('info-edit-id').value = item.id;
            
            let gradeSelect = document.getElementById('info-edit-grade');
            if (gradeSelect) gradeSelect.value = item.grade || '12';
            onInfographicModalGradeChange(item.grade || '12');

            document.getElementById('info-edit-code').value = item.lessonCode || '';
            document.getElementById('info-edit-title').value = item.title || '';
            document.getElementById('info-edit-summary').value = item.summary || '';
            document.getElementById('info-edit-image-url').value = item.imageUrl || '';
            document.getElementById('info-edit-drive-url').value = item.driveUrl || '';

            if (item.imageUrl) {
                onInfographicModalImageUrlChange(item.imageUrl);
            } else {
                clearModalInfographicImage();
            }

            modal.classList.remove('hidden');
        }

        function closeInfographicEditorModal() {
            let modal = document.getElementById('infographic-editor-modal');
            if (modal) modal.classList.add('hidden');
        }

        function onInfographicModalGradeChange(grade) {
            grade = String(grade || '12');
            let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[grade]) || (grade === '10' ? '0' : (grade === '11' ? '1' : (grade === '12' ? '2' : grade)));
            let gData = (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) || null;
            
            let chSelect = document.getElementById('info-edit-chapter');
            if (!chSelect) return;
            chSelect.innerHTML = '<option value="">-- Chọn Chương / Chuyên đề --</option>';

            if (gData && gData.branches) {
                Object.keys(gData.branches).forEach(bKey => {
                    let bData = gData.branches[bKey];
                    Object.keys(bData.chapters || {}).forEach(cKey => {
                        let cData = bData.chapters[cKey];
                        let opt = document.createElement('option');
                        opt.value = `${bKey}:${cKey}`;
                        opt.textContent = `[${bKey === 'D' ? 'Đại/GT' : 'Hình'}] Chương ${cKey}: ${cData.name}`;
                        chSelect.appendChild(opt);
                    });
                });
            }
            onInfographicModalChapterChange();
        }

        function onInfographicModalChapterChange() {
            let grade = document.getElementById('info-edit-grade')?.value || '12';
            let chVal = document.getElementById('info-edit-chapter')?.value || '';
            let lsSelect = document.getElementById('info-edit-lesson');
            if (!lsSelect) return;
            lsSelect.innerHTML = '<option value="">-- Chọn Bài học cốt lõi --</option>';

            if (!chVal) return;
            let parts = chVal.split(':');
            let bKey = parts[0];
            let cKey = parts[1];

            let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[grade]) || (grade === '10' ? '0' : (grade === '11' ? '1' : (grade === '12' ? '2' : grade)));
            let gData = (window.MATH_ID_TAXONOMY && window.MATH_ID_TAXONOMY[gCode]) || null;
            
            if (gData && gData.branches && gData.branches[bKey] && gData.branches[bKey].chapters[cKey]) {
                let cData = gData.branches[bKey].chapters[cKey];
                Object.keys(cData.lessons || {}).forEach(lKey => {
                    let lData = cData.lessons[lKey];
                    let opt = document.createElement('option');
                    opt.value = lKey;
                    opt.setAttribute('data-code', `[${gCode}${bKey}${cKey}?${lKey}]`);
                    opt.setAttribute('data-name', `Bài ${lKey}: ${lData.name}`);
                    opt.textContent = `[${gCode}${bKey}${cKey}?${lKey}] Bài ${lKey}: ${lData.name}`;
                    lsSelect.appendChild(opt);
                });
            }
        }

        function onInfographicModalLessonChange() {
            let lsSelect = document.getElementById('info-edit-lesson');
            if (!lsSelect || !lsSelect.value) return;
            let selectedOpt = lsSelect.options[lsSelect.selectedIndex];
            if (selectedOpt) {
                let code = selectedOpt.getAttribute('data-code');
                let name = selectedOpt.getAttribute('data-name');
                if (code) document.getElementById('info-edit-code').value = code;
                if (name) document.getElementById('info-edit-title').value = name;
            }
        }

        async function handleModalInfographicFileUpload(input) {
            if (!input.files || !input.files[0]) return;
            let file = input.files[0];
            let statusEl = document.getElementById('info-upload-status');
            if (statusEl) statusEl.innerHTML = '<span class="text-indigo-600 font-bold"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang tải ảnh lên Cloud...</span>';

            try {
                let url = await InfographicsService.uploadImage(file);
                document.getElementById('info-edit-image-url').value = url;
                onInfographicModalImageUrlChange(url);
                if (statusEl) statusEl.innerHTML = '<span class="text-emerald-600 font-bold"><i class="fa-solid fa-check mr-1"></i> Đã tải ảnh lên thành công!</span>';
                showToast("Tải ảnh Infographic thành công!");
            } catch(err) {
                if (statusEl) statusEl.innerHTML = '<span class="text-rose-500 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Lỗi: ' + err.message + '</span>';
                showToast("Lỗi tải ảnh: " + err.message, true);
            }
        }

        function onInfographicModalImageUrlChange(url) {
            let previewCont = document.getElementById('info-preview-container');
            let previewImg = document.getElementById('info-preview-img');
            let previewInfo = document.getElementById('info-preview-info');
            if (!url || !url.trim()) {
                if (previewCont) previewCont.classList.add('hidden');
                return;
            }
            url = InfographicsService.convertDriveUrl(url.trim());
            if (previewImg) previewImg.src = url;
            if (previewInfo) previewInfo.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sẵn sàng hiển thị';
            if (previewCont) previewCont.classList.remove('hidden');
        }

        function clearModalInfographicImage() {
            document.getElementById('info-edit-image-url').value = '';
            let previewCont = document.getElementById('info-preview-container');
            if (previewCont) previewCont.classList.add('hidden');
            let statusEl = document.getElementById('info-upload-status');
            if (statusEl) statusEl.innerHTML = 'Chấp nhận JPG, PNG, WebP, SVG...';
        }

        function openModalInfographicFullPreview(url, title) {
            url = url || document.getElementById('info-edit-image-url')?.value;
            if (!url) {
                return showToast("Chưa có ảnh Infographic để xem!", true);
            }
            url = InfographicsService.convertDriveUrl(url);
            let modal = document.getElementById('infographic-preview-modal');
            let img = document.getElementById('info-preview-modal-large-img');
            let titleEl = document.getElementById('info-preview-modal-title');
            let dlBtn = document.getElementById('info-preview-modal-download-btn');

            if (img) img.src = url;
            if (titleEl) titleEl.innerText = title || "Xem Infographic Sắc Nét";
            if (dlBtn) dlBtn.href = url;

            if (modal) {
                modal.classList.remove('hidden');
                updateTeacherPreviewFullscreenUI();
            }
        }

        function toggleTeacherPreviewFullscreen() {
            let modal = document.getElementById('infographic-preview-modal');
            if (!modal) return;
            let modalBox = modal.querySelector('.bg-slate-900') || modal;
            let isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

            if (!isFs) {
                let elem = modalBox || modal;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(e => {
                        modalBox.classList.toggle('teacher-preview-fullscreen-mode');
                        updateTeacherPreviewFullscreenUI();
                    });
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else {
                    modalBox.classList.toggle('teacher-preview-fullscreen-mode');
                    updateTeacherPreviewFullscreenUI();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }

        function updateTeacherPreviewFullscreenUI() {
            let isNativeFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            let modalBox = document.querySelector('#infographic-preview-modal > div');
            let isClassFs = modalBox && modalBox.classList.contains('teacher-preview-fullscreen-mode');
            let isFs = isNativeFs || isClassFs;

            let btn = document.getElementById('teacher-preview-fullscreen-btn');
            let img = document.getElementById('info-preview-modal-large-img');
            if (btn) {
                let icon = btn.querySelector('i');
                let span = btn.querySelector('span');
                if (isFs) {
                    if (icon) icon.className = 'fa-solid fa-compress text-amber-300';
                    if (span) span.innerText = 'Thu nhỏ';
                    if (modalBox) {
                        modalBox.classList.add('h-screen', 'max-h-screen', 'w-screen', 'max-w-none', 'rounded-none', 'border-0');
                    }
                    if (img) img.style.maxHeight = '90vh';
                } else {
                    if (icon) icon.className = 'fa-solid fa-expand text-amber-300';
                    if (span) span.innerText = 'Toàn màn hình';
                    if (modalBox) {
                        modalBox.classList.remove('h-screen', 'max-h-screen', 'w-screen', 'max-w-none', 'rounded-none', 'border-0');
                    }
                    if (img) img.style.maxHeight = '100%';
                }
            }
        }

        document.addEventListener('fullscreenchange', updateTeacherPreviewFullscreenUI);
        document.addEventListener('webkitfullscreenchange', updateTeacherPreviewFullscreenUI);
        document.addEventListener('mozfullscreenchange', updateTeacherPreviewFullscreenUI);
        document.addEventListener('MSFullscreenChange', updateTeacherPreviewFullscreenUI);

        function closeModalInfographicFullPreview() {
            let isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            if (isFs && document.exitFullscreen) {
                try { document.exitFullscreen(); } catch(e){}
            }
            let modal = document.getElementById('infographic-preview-modal');
            if (modal) modal.classList.add('hidden');
            let modalBox = document.querySelector('#infographic-preview-modal > div');
            if (modalBox) modalBox.classList.remove('teacher-preview-fullscreen-mode');
            updateTeacherPreviewFullscreenUI();
        }

        async function saveInfographicFromModal() {
            let id = document.getElementById('info-edit-id')?.value.trim();
            let grade = document.getElementById('info-edit-grade')?.value.trim() || '12';
            let code = document.getElementById('info-edit-code')?.value.trim();
            let title = document.getElementById('info-edit-title')?.value.trim();
            let summary = document.getElementById('info-edit-summary')?.value.trim();
            let imageUrl = document.getElementById('info-edit-image-url')?.value.trim();
            let driveUrl = document.getElementById('info-edit-drive-url')?.value.trim();

            if (!title) {
                return showToast("Vui lòng nhập Tiêu đề Infographic!", true);
            }

            let btn = document.getElementById('btn-save-infographic');
            let oldHtml = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang lưu...'; btn.disabled = true; }

            let item = {
                id: id || ('info_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
                grade: grade,
                lessonCode: code || '',
                title: title,
                summary: summary || '',
                imageUrl: imageUrl ? InfographicsService.convertDriveUrl(imageUrl) : '',
                driveUrl: driveUrl || '',
                updatedBy: state.currentUser ? (state.currentUser.email || 'Giáo viên TBS') : 'Giáo viên TBS'
            };

            try {
                await InfographicsService.saveItem(item, item.updatedBy);
                showToast(id ? "Đã cập nhật Infographic thành công!" : "Đã thêm mới Infographic thành công!");
                closeInfographicEditorModal();
                await renderInfographicManagement(document.getElementById('admin-content-area'));
            } catch(e) {
                showToast("Lỗi khi lưu Infographic: " + e.message, true);
            } finally {
                if (btn) { btn.innerHTML = oldHtml; btn.disabled = false; }
            }
        }

        function openReplaceInfographicModal(id) {
            let item = cachedTeacherInfographics.find(x => x.id === id);
            if (!item) return showToast("Không tìm thấy Infographic!", true);

            let modal = document.getElementById('infographic-replace-modal');
            if (!modal) return;

            document.getElementById('replace-info-id').value = item.id;
            document.getElementById('replace-info-title').innerText = item.title || '---';
            document.getElementById('replace-info-code').innerText = item.lessonCode || 'Chưa gán ID';
            document.getElementById('replace-info-image-url').value = item.imageUrl || '';
            document.getElementById('replace-info-drive-url').value = item.driveUrl || '';
            
            let fileInput = document.getElementById('replace-info-file');
            if (fileInput) fileInput.value = '';

            modal.classList.remove('hidden');
        }

        function closeInfographicReplaceModal() {
            let modal = document.getElementById('infographic-replace-modal');
            if (modal) modal.classList.add('hidden');
        }

        async function handleQuickReplaceFileUpload(input) {
            if (!input.files || !input.files[0]) return;
            let file = input.files[0];
            let btn = document.getElementById('btn-submit-quick-replace');
            let oldHtml = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang nạp ảnh...'; btn.disabled = true; }

            try {
                let url = await InfographicsService.uploadImage(file);
                document.getElementById('replace-info-image-url').value = url;
                showToast("Đã nạp ảnh mới thành công!");
            } catch(e) {
                showToast("Lỗi nạp ảnh: " + e.message, true);
            } finally {
                if (btn) { btn.innerHTML = oldHtml; btn.disabled = false; }
            }
        }

        async function saveQuickReplaceInfographic() {
            let id = document.getElementById('replace-info-id')?.value.trim();
            let newImg = document.getElementById('replace-info-image-url')?.value.trim();
            let newDrive = document.getElementById('replace-info-drive-url')?.value.trim();

            let item = cachedTeacherInfographics.find(x => x.id === id);
            if (!item) return showToast("Không tìm thấy Infographic!", true);

            let btn = document.getElementById('btn-submit-quick-replace');
            let oldHtml = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang thay thế...'; btn.disabled = true; }

            item.imageUrl = newImg ? InfographicsService.convertDriveUrl(newImg) : item.imageUrl;
            item.driveUrl = newDrive || item.driveUrl;
            item.updatedAt = new Date().toISOString();
            item.updatedBy = state.currentUser ? (state.currentUser.email || 'Giáo viên TBS') : 'Giáo viên TBS';

            try {
                await InfographicsService.saveItem(item, item.updatedBy);
                showToast(`Đã thay thế Infographic cho "${item.title}" thành công!`);
                closeInfographicReplaceModal();
                await renderInfographicManagement(document.getElementById('admin-content-area'));
            } catch(e) {
                showToast("Lỗi thay thế Infographic: " + e.message, true);
            } finally {
                if (btn) { btn.innerHTML = oldHtml; btn.disabled = false; }
            }
        }

        async function deleteTeacherInfographic(id) {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa Infographic!", true);
            }
            let item = cachedTeacherInfographics.find(x => x.id === id);
            if (!item) return;

            showConfirmModal("Xóa Infographic", `Thầy/Cô có chắc chắn muốn xóa Infographic bài:\n"${item.title}"?`, async () => {
                try {
                    await InfographicsService.deleteItem(id, state.currentUser ? state.currentUser.email : 'Giáo viên TBS');
                    showToast("Đã xóa Infographic thành công!");
                    await renderInfographicManagement(document.getElementById('admin-content-area'));
                } catch(e) {
                    showToast("Lỗi xóa Infographic: " + e.message, true);
                }
            });
        }

        // Teacher Leaderboard Config Logic
        let teacherLbConfig = { resetAt: null, resetDateStr: null, resetBy: null, cycleTitle: "Toàn thời gian" };
        async function loadTeacherLeaderboardConfig() {
            try {
                let doc = await db.collection("GameData").doc("LeaderboardConfig").get();
                if (doc.exists) teacherLbConfig = doc.data() || {};
                else teacherLbConfig = { resetAt: null, resetDateStr: null, resetBy: null, cycleTitle: "Toàn thời gian" };
            } catch(e) {
                console.warn("Lỗi load config bảng vàng teacher:", e);
            }
        }

        let adminLbResetTimeMode = 'now';
        function setAdminLbResetTimeMode(mode) {
            adminLbResetTimeMode = mode;
            let btnNow = document.getElementById('btn-admin-reset-now');
            let btnCustom = document.getElementById('btn-admin-reset-custom');
            let contCustom = document.getElementById('admin-lb-custom-time-cont');
            if (!btnNow || !btnCustom) return;
            if (mode === 'now') {
                btnNow.classList.add('bg-amber-500', 'text-white', 'shadow');
                btnNow.classList.remove('bg-slate-100', 'text-slate-600');
                btnCustom.classList.remove('bg-amber-500', 'text-white', 'shadow');
                btnCustom.classList.add('bg-slate-100', 'text-slate-600');
                if (contCustom) contCustom.classList.add('hidden');
            } else {
                btnCustom.classList.add('bg-amber-500', 'text-white', 'shadow');
                btnCustom.classList.remove('bg-slate-100', 'text-slate-600');
                btnNow.classList.remove('bg-amber-500', 'text-white', 'shadow');
                btnNow.classList.add('bg-slate-100', 'text-slate-600');
                if (contCustom) {
                    contCustom.classList.remove('hidden');
                    let now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                    document.getElementById('admin-lb-reset-time').value = now.toISOString().slice(0, 16);
                }
            }
        }

        async function openAdminLeaderboardResetModal() {
            await loadTeacherLeaderboardConfig();
            document.getElementById('admin-lb-reset-title').value = teacherLbConfig.cycleTitle && teacherLbConfig.cycleTitle !== 'Toàn thời gian' ? teacherLbConfig.cycleTitle : '';
            setAdminLbResetTimeMode('now');
            document.getElementById('admin-lb-reset-modal').classList.remove('hidden');
        }

        function closeAdminLeaderboardResetModal() {
            document.getElementById('admin-lb-reset-modal').classList.add('hidden');
        }

        async function confirmAdminLeaderboardReset() {
            let title = document.getElementById('admin-lb-reset-title').value.trim() || `Đợt thi ${new Date().toLocaleDateString('vi-VN')}`;
            let resetDate = new Date();
            if (adminLbResetTimeMode === 'custom') {
                let customVal = document.getElementById('admin-lb-reset-time').value;
                if (customVal) resetDate = new Date(customVal);
            }

            let newConfig = {
                resetAt: resetDate.toISOString(),
                resetDateStr: resetDate.toLocaleDateString('vi-VN') + ' ' + resetDate.toLocaleTimeString('vi-VN'),
                resetBy: state.currentUser ? state.currentUser.email : 'Giáo viên TBS',
                cycleTitle: title,
                updatedAt: new Date().toISOString()
            };

            let btn = document.getElementById('btn-confirm-admin-lb-reset');
            let oldText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang thiết lập...';
            btn.disabled = true;

            try {
                await db.collection("GameData").doc("LeaderboardConfig").set(newConfig);
                teacherLbConfig = newConfig;
                showToast("Đã tạo mới Bảng Vàng toàn trường thành công!");
                closeAdminLeaderboardResetModal();
                updateStudentResultsUI();
            } catch(e) {
                showToast("Lỗi lưu cấu hình: " + e.message, true);
            } finally {
                btn.innerHTML = oldText;
                btn.disabled = false;
            }
        }

        async function clearAdminLeaderboardReset() {
            if (!confirm("Khôi phục Bảng Vàng về chế độ Toàn Thời Gian (tính điểm cho toàn bộ bài thi)?")) return;
            try {
                let emptyConfig = {
                    resetAt: null,
                    resetDateStr: null,
                    resetBy: null,
                    cycleTitle: "Toàn thời gian",
                    updatedAt: new Date().toISOString()
                };
                await db.collection("GameData").doc("LeaderboardConfig").set(emptyConfig);
                teacherLbConfig = emptyConfig;
                showToast("Đã khôi phục tính điểm toàn thời gian!");
                if (document.getElementById('admin-lb-reset-modal') && !document.getElementById('admin-lb-reset-modal').classList.contains('hidden')) {
                    closeAdminLeaderboardResetModal();
                }
                updateStudentResultsUI();
            } catch(e) {
                showToast("Lỗi khôi phục: " + e.message, true);
            }
        }

        let currentAdminResults = [];
        let currentClassFilter = 'ALL';
        let currentGradeFilter = 'ALL';
        let currentCodeFilter = 'ALL';

        async function renderStudentResults(contentArea) {
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            contentArea.innerHTML = `<div class="flex justify-center items-center h-full"><i class="fa-solid fa-spinner fa-spin text-5xl text-amber-500"></i></div>`;
            await loadTeacherLeaderboardConfig();
            try { 
                let r = await fetch(GOOGLE_WEB_APP_URL + "?action=getResults&t=" + Date.now()); 
                let rawResults = JSON.parse(await r.text()); 
                if(rawResults.length === 0) { 
                    contentArea.innerHTML=`<div class="text-center mt-20 text-slate-400 font-bold text-lg"><i class="fa-solid fa-folder-open text-5xl mb-4"></i><br>Hệ thống chưa ghi nhận bảng điểm nào</div>`; 
                    return; 
                } 
                
                let groupedData = {}; 
                rawResults.forEach(item => { 
                    let key = String(item.id || '').trim().toLowerCase() + "_" + String(item.name || '').trim().toLowerCase() + "_" + String(item.code || '').trim().toUpperCase(); 
                    let currentScore = Number(item.score) || 0; 
                    
                    const getPartScore = (r, pNum) => {
                        if (!r) return '-';
                        let val = undefined;
                        if (pNum === 1) val = r.scoreR1 ?? r.score1 ?? r.r1 ?? r.R1 ?? r.ScoreR1 ?? r.Score1 ?? r["Phần 1"] ?? r["Phần I"] ?? r["phan1"];
                        else if (pNum === 2) val = r.scoreR2 ?? r.score2 ?? r.r2 ?? r.R2 ?? r.ScoreR2 ?? r.Score2 ?? r["Phần 2"] ?? r["Phần II"] ?? r["phan2"];
                        else if (pNum === 3) val = r.scoreR3 ?? r.score3 ?? r.r3 ?? r.R3 ?? r.ScoreR3 ?? r.Score3 ?? r["Phần 3"] ?? r["Phần III"] ?? r["phan3"];
                        if (val === undefined || val === null || String(val).trim() === '') {
                            for (let k in r) {
                                let norm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
                                if (pNum === 1 && (norm === 'scorer1' || norm === 'r1' || norm === 'phan1' || norm === 'phani' || norm === 'score1')) return r[k];
                                if (pNum === 2 && (norm === 'scorer2' || norm === 'r2' || norm === 'phan2' || norm === 'phanii' || norm === 'score2')) return r[k];
                                if (pNum === 3 && (norm === 'scorer3' || norm === 'r3' || norm === 'phan3' || norm === 'phaniii' || norm === 'score3')) return r[k];
                            }
                        }
                        return (val !== undefined && val !== null && String(val).trim() !== '') ? val : '-';
                    };

                    let sR1 = getPartScore(item, 1);
                    let sR2 = getPartScore(item, 2);
                    let sR3 = getPartScore(item, 3);
                    let itemViolations = Number(item.violations) || 0;

                    if (!groupedData[key]) { 
                        groupedData[key] = { 
                            ...item, 
                            attempts: 1, 
                            maxScore: currentScore,
                            violations: itemViolations,
                            scoreR1: sR1,
                            scoreR2: sR2,
                            scoreR3: sR3
                        }; 
                    } else { 
                        groupedData[key].attempts += 1; 
                        groupedData[key].violations = Math.max(groupedData[key].violations || 0, itemViolations);
                        if (currentScore >= groupedData[key].maxScore) { 
                            groupedData[key].maxScore = currentScore; 
                            groupedData[key].scoreR1 = sR1; 
                            groupedData[key].scoreR2 = sR2; 
                            groupedData[key].scoreR3 = sR3; 
                            groupedData[key].date = item.date; 
                        } else {
                            if (groupedData[key].scoreR1 === '-' && sR1 !== '-') groupedData[key].scoreR1 = sR1;
                            if (groupedData[key].scoreR2 === '-' && sR2 !== '-') groupedData[key].scoreR2 = sR2;
                            if (groupedData[key].scoreR3 === '-' && sR3 !== '-') groupedData[key].scoreR3 = sR3;
                        }
                    } 
                }); 
                
                let finalResults = Object.values(groupedData).sort((a, b) => b.maxScore - a.maxScore); 
                currentAdminResults = finalResults;
                
                updateStudentResultsUI(contentArea);
            } catch(e) { 
                contentArea.innerHTML = `<div class="text-red-500 text-center mt-20 font-bold">Lỗi lấy dữ liệu từ Google Script!</div>`; 
            } 
        }

        function updateStudentResultsUI(contentArea) {
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            
            // Extract distinct classes, grades, and codes for filters
            let classes = [...new Set(currentAdminResults.map(r => r.cls).filter(Boolean))].sort();
            let grades = [...new Set(classes.map(c => c.replace(/\D/g, '')).filter(Boolean))].sort();
            let codes = [...new Set(currentAdminResults.map(r => String(r.code || '').trim().toUpperCase()).filter(Boolean))].sort();

            let filteredResults = currentAdminResults;
            if (currentGradeFilter !== 'ALL') {
                filteredResults = filteredResults.filter(r => r.cls && r.cls.replace(/\D/g, '') === currentGradeFilter);
            }
            if (currentClassFilter !== 'ALL') {
                filteredResults = filteredResults.filter(r => r.cls === currentClassFilter);
            }
            if (currentCodeFilter !== 'ALL') {
                filteredResults = filteredResults.filter(r => String(r.code || '').trim().toUpperCase() === currentCodeFilter);
            }

            let classOptions = `<option value="ALL">Tất cả Lớp</option>` + classes.map(c => `<option value="${c}" ${currentClassFilter === c ? 'selected' : ''}>${c}</option>`).join('');
            let gradeOptions = `<option value="ALL">Tất cả Khối</option>` + grades.map(g => `<option value="${g}" ${currentGradeFilter === g ? 'selected' : ''}>Khối ${g}</option>`).join('');
            let codeOptions = `<option value="ALL">🎯 Tất cả Mã Đề (${codes.length})</option>` + codes.map(c => `<option value="${c}" ${currentCodeFilter === c ? 'selected' : ''}>📌 Mã Đề: ${c}</option>`).join('');

            let rows = filteredResults.map((x, i) => `<tr class="border-b-2 border-slate-100 hover:bg-amber-50 transition"><td class="p-3 text-center font-bold text-slate-500">${i+1}</td><td class="p-3 font-black text-slate-700">${x.name || '-'} <span class="text-[10px] bg-slate-200 px-1.5 rounded ml-1">${x.cls || '-'}</span></td><td class="p-3 text-center"><span class="bg-sky-100 text-sky-700 px-2 py-1 rounded-lg font-black text-xs tracking-widest">${x.code}</span></td><td class="p-3 text-center font-black text-rose-500">${x.attempts} lần</td><td class="p-3 text-center font-bold ${x.violations > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}">${x.violations > 0 ? x.violations + ' lần' : '0'}</td><td class="p-3 text-center font-bold text-sky-600">${(x.scoreR1 !== undefined ? x.scoreR1 : '-')}</td><td class="p-3 text-center font-bold text-amber-600">${(x.scoreR2 !== undefined ? x.scoreR2 : '-')}</td><td class="p-3 text-center font-bold text-red-600">${(x.scoreR3 !== undefined ? x.scoreR3 : '-')}</td><td class="p-3 text-center font-black text-emerald-600 text-lg">${x.maxScore}</td></tr>`).join(''); 
            
            let cycleStatusHtml = (teacherLbConfig && teacherLbConfig.resetAt)
                ? `<span class="text-amber-800 font-bold">Đang hiển thị đợt: "${teacherLbConfig.cycleTitle || 'Đợt mới'}" (Bắt đầu: ${teacherLbConfig.resetDateStr || teacherLbConfig.resetAt})</span>`
                : `<span class="text-slate-500 font-medium">Toàn thời gian (Chưa đặt mốc tạo mới Bảng Vàng)</span>`;

            contentArea.innerHTML = `
                <div class="p-6 h-full flex flex-col">
                    <!-- Leaderboard Management Card -->
                    <div class="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 p-4 rounded-2xl border-2 border-amber-200 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md shrink-0"><i class="fa-solid fa-trophy"></i></div>
                            <div>
                                <div class="font-black text-amber-900 text-sm uppercase tracking-wide flex items-center gap-2">Bảng Vàng Vinh Dự (Trang Chủ)</div>
                                <div class="text-xs mt-0.5">${cycleStatusHtml}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button onclick="openAdminLeaderboardResetModal()" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow-md hover:from-amber-600 hover:to-orange-600 transition btn-3d"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Tạo Mới (Reset) Bảng Vàng</button>
                            <button onclick="clearAdminLeaderboardReset()" class="px-3 py-2 bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold transition shadow-sm" title="Khôi phục tính điểm toàn bộ lịch sử"><i class="fa-solid fa-rotate-left mr-1"></i> Khôi phục</button>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
                        <h3 class="font-black text-2xl text-amber-600 uppercase tracking-widest"><i class="fa-solid fa-ranking-star mr-2"></i> Bảng Điểm Học Sinh</h3>
                        <div class="flex items-center gap-3 flex-wrap">
                            <select onchange="currentGradeFilter=this.value; currentClassFilter='ALL'; updateStudentResultsUI()" class="p-2 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-amber-400">
                                ${gradeOptions}
                            </select>
                            <select onchange="currentClassFilter=this.value; updateStudentResultsUI()" class="p-2 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-amber-400">
                                ${classOptions}
                            </select>
                            <select onchange="currentCodeFilter=this.value; updateStudentResultsUI()" class="p-2 border-2 border-sky-300 bg-sky-50 text-sky-900 rounded-xl font-bold outline-none focus:border-sky-500 shadow-xs">
                                ${codeOptions}
                            </select>
                            <button onclick="exportAdminResultsCSV()" class="px-5 py-2.5 bg-main text-white rounded-xl shadow-sm text-sm font-black hover:bg-mainDark transition btn-3d"><i class="fa-solid fa-file-csv mr-1"></i> Xuất CSV Kèm Thống Kê</button>
                            <button onclick="currentClassFilter='ALL'; currentGradeFilter='ALL'; currentCodeFilter='ALL'; renderStudentResults(document.getElementById('admin-content-area'))" class="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl shadow-sm text-sm font-black hover:bg-slate-50 transition btn-3d"><i class="fa-solid fa-rotate-right mr-1"></i> Tải Lại</button>
                        </div>
                    </div>
                    <div class="flex-grow overflow-auto bg-white rounded-3xl shadow-inner border-2 border-slate-100">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-slate-100 sticky top-0 shadow-sm">
                                <tr><th class="p-4 text-center text-slate-500 font-black uppercase">STT</th><th class="p-4 text-slate-500 font-black uppercase">Học Sinh</th><th class="p-4 text-center text-slate-500 font-black uppercase">Mã Đề</th><th class="p-4 text-center text-slate-500 font-black uppercase">Số Lần Làm</th><th class="p-4 text-center text-rose-500 font-black uppercase">Vi Phạm</th><th class="p-4 text-center text-slate-500 font-black uppercase">P1</th><th class="p-4 text-center text-slate-500 font-black uppercase">P2</th><th class="p-4 text-center text-slate-500 font-black uppercase">P3</th><th class="p-4 text-center text-emerald-600 font-black uppercase">Tổng</th></tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            `; 
        }

        function exportAdminResultsCSV() {
            let filteredResults = currentAdminResults;
            if (currentGradeFilter !== 'ALL') {
                filteredResults = filteredResults.filter(r => r.cls && r.cls.replace(/\D/g, '') === currentGradeFilter);
            }
            if (currentClassFilter !== 'ALL') {
                filteredResults = filteredResults.filter(r => r.cls === currentClassFilter);
            }
            if (currentCodeFilter !== 'ALL') {
                filteredResults = filteredResults.filter(r => String(r.code || '').trim().toUpperCase() === currentCodeFilter);
            }

            if(filteredResults.length === 0) return showToast("Không có dữ liệu để xuất!", true);

            let totalCount = filteredResults.length;
            let scores = filteredResults.map(r => Number(r.maxScore || 0)).filter(s => !isNaN(s));
            let avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
            let maxScore = scores.length > 0 ? Math.max(...scores) : 0;
            let minScore = scores.length > 0 ? Math.min(...scores) : 0;

            let p1Scores = filteredResults.map(r => Number(r.scoreR1)).filter(s => !isNaN(s));
            let avgP1 = p1Scores.length > 0 ? (p1Scores.reduce((a, b) => a + b, 0) / p1Scores.length).toFixed(2) : '-';

            let p2Scores = filteredResults.map(r => Number(r.scoreR2)).filter(s => !isNaN(s));
            let avgP2 = p2Scores.length > 0 ? (p2Scores.reduce((a, b) => a + b, 0) / p2Scores.length).toFixed(2) : '-';

            let p3Scores = filteredResults.map(r => Number(r.scoreR3)).filter(s => !isNaN(s));
            let avgP3 = p3Scores.length > 0 ? (p3Scores.reduce((a, b) => a + b, 0) / p3Scores.length).toFixed(2) : '-';

            let countExcellent = scores.filter(s => s >= 9.0).length;
            let countGood = scores.filter(s => s >= 8.0 && s < 9.0).length;
            let countFair = scores.filter(s => s >= 6.5 && s < 8.0).length;
            let countAverage = scores.filter(s => s >= 5.0 && s < 6.5).length;
            let countWeak = scores.filter(s => s < 5.0).length;

            let filterLabel = "TOÀN TRƯỜNG";
            if (currentCodeFilter !== 'ALL') filterLabel = "MÃ ĐỀ " + currentCodeFilter;
            if (currentClassFilter !== 'ALL') filterLabel += (currentCodeFilter !== 'ALL' ? " - " : "") + "LỚP " + currentClassFilter;
            else if (currentGradeFilter !== 'ALL') filterLabel += (currentCodeFilter !== 'ALL' ? " - " : "") + "KHỐI " + currentGradeFilter;

            let csvContent = "\uFEFF";
            csvContent += `=== BÁO CÁO THỐNG KÊ KẾT QUẢ THI (${filterLabel}) ===\n`;
            csvContent += `Ngày xuất báo cáo: "${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}"\n`;
            csvContent += `Tổng số học sinh/lượt thi: ${totalCount}\n`;
            csvContent += `Điểm trung bình: ${avgScore}\n`;
            csvContent += `Điểm cao nhất: ${maxScore}\n`;
            csvContent += `Điểm thấp nhất: ${minScore}\n`;
            csvContent += `Điểm TB Phần 1 (Trắc nghiệm): ${avgP1}\n`;
            csvContent += `Điểm TB Phần 2 (Đúng/Sai): ${avgP2}\n`;
            csvContent += `Điểm TB Phần 3 (Điền khuyết): ${avgP3}\n`;
            csvContent += `THỐNG KÊ XẾP LOẠI:\n`;
            csvContent += ` - Xuất sắc (>=9.0): ${countExcellent} học sinh (${((countExcellent/totalCount)*100).toFixed(1)}%)\n`;
            csvContent += ` - Giỏi (8.0 - 8.9): ${countGood} học sinh (${((countGood/totalCount)*100).toFixed(1)}%)\n`;
            csvContent += ` - Khá (6.5 - 7.9): ${countFair} học sinh (${((countFair/totalCount)*100).toFixed(1)}%)\n`;
            csvContent += ` - Trung bình (5.0 - 6.4): ${countAverage} học sinh (${((countAverage/totalCount)*100).toFixed(1)}%)\n`;
            csvContent += ` - Yếu (<5.0): ${countWeak} học sinh (${((countWeak/totalCount)*100).toFixed(1)}%)\n`;
            csvContent += `\n`;
            csvContent += `=== DANH SÁCH BÀI THI CHI TIẾT ===\n`;
            csvContent += "STT,Ngày Thi,Mã Đề,Họ Tên,Lớp,Số Lần Làm,Số Lần Vi Phạm,Phần 1,Phần 2,Phần 3,Tổng Điểm,Xếp Loại\n";

            filteredResults.forEach((r, idx) => {
                let r1 = r.scoreR1 !== undefined ? r.scoreR1 : '-';
                let r2 = r.scoreR2 !== undefined ? r.scoreR2 : '-';
                let r3 = r.scoreR3 !== undefined ? r.scoreR3 : '-';
                let escName = (r.name || '-').replace(/"/g, '""');
                let escCls = (r.cls || '').replace(/"/g, '""');
                let s = Number(r.maxScore || 0);
                let rank = "Yếu";
                if (s >= 9.0) rank = "Xuất sắc";
                else if (s >= 8.0) rank = "Giỏi";
                else if (s >= 6.5) rank = "Khá";
                else if (s >= 5.0) rank = "Trung bình";

                csvContent += `"${idx + 1}","${r.date || '-'}","${r.code}","${escName}","${escCls}","${r.attempts}","${r.violations || 0}","${r1}","${r2}","${r3}","${r.maxScore}","${rank}"\n`;
            });

            let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            let link = document.createElement("a");
            if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                let fname = "BaoCaoThongKe_ToanTruong";
                if(currentCodeFilter !== 'ALL') fname = "BaoCaoThongKe_MaDe_" + currentCodeFilter;
                if(currentClassFilter !== 'ALL') fname += "_Lop_" + currentClassFilter;
                else if(currentGradeFilter !== 'ALL') fname += "_Khoi_" + currentGradeFilter;
                link.setAttribute("download", fname + ".csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast("Đã xuất file báo cáo thống kê thành công!");
            }
        }

        let selectedExamCodes = new Set();
        let currentBankFolderFilter = 'ALL';

        function toggleSelectExam(code, cb) {
            if (cb.checked) selectedExamCodes.add(code);
            else selectedExamCodes.delete(code);
            updateExamBankSelectionUI();
        }

        function toggleSelectAllExams(cb) {
            let filteredData = currentBankFolderFilter === 'ALL' ? currentAdminBankData : currentAdminBankData.filter(h => (h.folder || 'Chung') === currentBankFolderFilter);
            if (cb.checked) {
                filteredData.forEach(h => selectedExamCodes.add(h.code));
            } else {
                filteredData.forEach(h => selectedExamCodes.delete(h.code));
            }
            renderAdminBank(null, currentBankFolderFilter, true);
        }

        function updateExamBankSelectionUI() {
            let btnDel = document.getElementById('btn-delete-selected-exams');
            let countEl = document.getElementById('selected-exams-count');
            if (countEl) countEl.innerText = selectedExamCodes.size;
            if (btnDel) {
                if (selectedExamCodes.size > 0) btnDel.classList.remove('hidden');
                else btnDel.classList.add('hidden');
            }
        }

        async function deleteSelectedExamsFromBank() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa đề thi!", true);
            }
            if (selectedExamCodes.size === 0) return showToast("Vui lòng tích chọn đề cần xóa!", true);
            let codesToDelete = Array.from(selectedExamCodes);
            showConfirmModal(
                "Xác nhận xóa đề đã chọn",
                `Bạn có chắc chắn muốn xóa vĩnh viễn ${codesToDelete.length} đề thi đã tích chọn khỏi Kho Cloud?`,
                async () => {
                    showToast(`Đang xóa ${codesToDelete.length} đề thi...`);
                    try {
                        for (let code of codesToDelete) {
                            try {
                                let gameDoc = await db.collection("SharedGames").doc(code).get();
                                if(gameDoc.exists) {
                                    let urls = extractCloudinaryUrls(gameDoc.data());
                                    if(urls.length > 0) {
                                        fetch(GOOGLE_WEB_APP_URL + "?action=deleteCloudinary", {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                            body: 'urls=' + encodeURIComponent(JSON.stringify(urls))
                                        }).catch(e=>{});
                                    }
                                }
                                await db.collection("SharedGames").doc(code).delete();
                                let docRef = db.collection("AdminHistory").doc(code);
                                let snap = await docRef.get();
                                if(snap.exists) await docRef.delete();
                            } catch(e){}
                        }
                        currentAdminBankData = currentAdminBankData.filter(h => !selectedExamCodes.has(h.code));
                        await db.collection("GameData").doc("AdminHistory").set({ list: currentAdminBankData });
                        selectedExamCodes.clear();
                        showToast("Đã xóa vĩnh viễn các đề đã chọn!");
                        renderAdminBank(null, currentBankFolderFilter, true);
                    } catch(e) {
                        showToast("Không thể xóa lúc này", true);
                    }
                }
            );
        }

        let currentBankTypeFilter = 'ALL'; // 'ALL', 'EXAMS', 'GAMES'

        async function renderAdminBank(contentArea, filterFolder = 'ALL', skipFetch = false, filterType = null) { 
            if (!contentArea) contentArea = document.getElementById('admin-content-area'); 
            currentBankFolderFilter = filterFolder;
            if (filterType !== null) currentBankTypeFilter = filterType;

            if (!skipFetch && (filterFolder === 'ALL' || currentAdminBankData.length === 0)) { 
                contentArea.innerHTML = '<div class="flex items-center justify-center h-full text-sky-500 font-bold text-xl"><i class="fa-solid fa-spinner fa-spin mr-3 text-4xl"></i> Đang tải kho đề & game Cloud...</div>'; 
                try { 
                    let snap = await db.collection("AdminHistory").orderBy('createdAt', 'desc').get(); 
                    let newHist = []; 
                    snap.forEach(doc => newHist.push(doc.data())); 
                    let d = await db.collection("GameData").doc("AdminHistory").get(); 
                    let oldHist = d.exists ? d.data().list : []; 

                    // Also fetch GamesHistory
                    let gamesHist = [];
                    try {
                        let gSnap = await db.collection("GamesHistory").orderBy('createdAt', 'desc').get();
                        gSnap.forEach(doc => gamesHist.push(doc.data()));
                        let gDoc = await db.collection("GameData").doc("GamesHistory").get();
                        if (gDoc.exists && gDoc.data().list) gamesHist.push(...gDoc.data().list);
                    } catch(e){}

                    let allHist = [...gamesHist, ...newHist, ...oldHist]; 
                    let uniqueHist = []; 
                    let seen = new Set(); 
                    for (let h of allHist) { 
                        if(!seen.has(h.code)) { 
                            seen.add(h.code); 
                            uniqueHist.push(h); 
                        } 
                    } 
                    currentAdminBankData = uniqueHist; 
                } catch(e) { 
                    currentAdminBankData = JSON.parse(localStorage.getItem('math12ExportHistory')||'[]'); 
                } 
            } 
            if(currentAdminBankData.length === 0) { 
                contentArea.innerHTML = `<div class="text-center text-slate-400 mt-20 font-bold text-lg"><i class="fa-solid fa-cloud-arrow-down text-5xl mb-4"></i><br>Hệ thống Cloud chưa có đề hoặc game lưu trữ.</div>`; 
                return; 
            } 
            let detectedFolders = currentAdminBankData.map(h => normalizeMathFolder(h.folder));
            let standardOrder = ['TOAN 12', 'TOAN 11', 'TOAN 10', 'TOAN 9', 'TOAN 8', 'TOAN 7', 'TOAN 6', 'KHAC'];
            let extraFolders = [...new Set(detectedFolders)].filter(f => !standardOrder.includes(f));
            let folders = [...standardOrder, ...extraFolders];
            let filterHtml = `<select onchange="renderAdminBank(null, this.value, true)" class="ml-2 p-2 border-2 border-sky-200 rounded-xl text-xs bg-white font-black text-sky-700 outline-none shadow-sm cursor-pointer"><option value="ALL">📁 Tất Cả Thư Mục</option>` + folders.map(f => `<option value="${f}" ${f === filterFolder ? 'selected' : ''}>📂 ${f}</option>`).join('') + `</select>`; 
            
            let filteredData = currentAdminBankData.filter(h => {
                if (filterFolder !== 'ALL' && normalizeMathFolder(h.folder) !== filterFolder) return false;
                let isGameItem = (h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_')));
                if (currentBankTypeFilter === 'EXAMS' && isGameItem) return false;
                if (currentBankTypeFilter === 'GAMES' && !isGameItem) return false;
                return true;
            });

            let totalExamsCount = currentAdminBankData.filter(h => !(h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_')))).length;
            let totalGamesCount = currentAdminBankData.filter(h => (h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_')))).length;

            let isSuperGlobal = isCurrentUserSuperAdmin(); 
            let allSelected = filteredData.length > 0 && filteredData.every(h => selectedExamCodes.has(h.code));

            let html = filteredData.map(h => { 
                let canEdit = isSuperGlobal || (h.author && state.currentUser && state.currentUser.email.toLowerCase() === h.author.toLowerCase()) || isCurrentUserAuthorizedTeacher(); 
                let isSelected = selectedExamCodes.has(h.code);
                let folderName = normalizeMathFolder(h.folder);
                let folderBadge = getMathFolderBadgeClass(folderName);
                return `<div class="bg-white p-5 border-2 ${isSelected ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100'} rounded-2xl mb-3 flex items-center justify-between group shadow-sm hover:shadow-md transition hover:border-sky-300">
                    <div class="flex items-center gap-3">
                        ${isSuperGlobal ? `<input type="checkbox" class="exam-checkbox w-5 h-5 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer" value="${h.code}" ${isSelected ? 'checked' : ''} onchange="toggleSelectExam('${h.code}', this)">` : ''}
                        <div>
                            <b class="text-sky-800 text-lg uppercase tracking-wide">${h.name}</b> 
                            <span class="text-[10px] ${folderBadge} px-2.5 py-1 rounded-lg font-black uppercase ml-2 shadow-2xs border">${folderName}</span>
                            <div class="text-xs text-slate-500 mt-2 font-medium"><i class="fa-solid fa-calendar-day mr-1"></i> ${h.date} <span class="mx-2">|</span> <i class="fa-solid fa-user-pen mr-1"></i> Tác giả: <span class="font-bold text-slate-700">${h.author?h.author.split('@')[0]:'Admin'}</span></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        ${(h.type === 'game' || h.isGame || (h.gameMode && h.gameMode.startsWith('game_'))) 
                            ? `<span class="text-[11px] font-black uppercase px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 border border-amber-300 shadow-2xs flex items-center gap-1"><i class="fa-solid fa-gamepad"></i> GAME</span>` 
                            : `<span class="text-[11px] font-black uppercase px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs flex items-center gap-1"><i class="fa-solid fa-file-lines"></i> ĐỀ THI</span>`}
                        <span class="font-black text-2xl text-slate-700 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-200 shadow-inner tracking-widest">${h.code}</span>
                        <div class="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300">
                            <a href="student.html?code=${h.code}${(h.type==='game'||h.isGame)?'&game='+(h.gameMode||'millionaire'):''}" target="_blank" class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm transition btn-3d flex items-center justify-center" title="Chạy Thử"><i class="fa-solid fa-play"></i></a>
                            ${canEdit ? `<button onclick="loadExamIntoAdmin('${h.code}')" class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white shadow-sm transition btn-3d" title="Chỉnh Sửa Đề Cũ"><i class="fa-solid fa-download"></i></button><button onclick="editExamInfo('${h.code}')" class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white shadow-sm transition btn-3d" title="Đổi Tên/Thư Mục"><i class="fa-solid fa-pen"></i></button>` : ''}
                            <button onclick="copyFromHistory('${h.code}')" class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-main hover:text-white shadow-sm transition btn-3d" title="Copy Mã Code"><i class="fa-solid fa-copy"></i></button>
                            ${isSuperGlobal ? `<button onclick="deleteExamCode('${h.code}')" class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white shadow-sm transition btn-3d" title="Xóa Vĩnh Viễn"><i class="fa-solid fa-trash-can"></i></button>` : ''}
                        </div>
                    </div>
                </div>`; 
            }).join(''); 

            contentArea.innerHTML = `<div class="p-6 h-full flex flex-col">
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center flex-wrap gap-2">
                                <h3 class="font-black text-2xl text-slate-800 uppercase tracking-widest flex items-center"><i class="fa-solid fa-cloud-arrow-down text-sky-500 mr-2"></i> Kho Cloud ${filterHtml}</h3>
                            </div>
                            <div class="flex items-center gap-2 mt-1">
                                <button onclick="renderAdminBank(null, currentBankFolderFilter, true, 'ALL')" class="px-3 py-1 rounded-xl text-xs font-black transition ${currentBankTypeFilter==='ALL'?'bg-indigo-600 text-white shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    Tất cả (${currentAdminBankData.length})
                                </button>
                                <button onclick="renderAdminBank(null, currentBankFolderFilter, true, 'EXAMS')" class="px-3 py-1 rounded-xl text-xs font-black transition ${currentBankTypeFilter==='EXAMS'?'bg-sky-600 text-white shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    📄 Đề Thi (${totalExamsCount})
                                </button>
                                <button onclick="renderAdminBank(null, currentBankFolderFilter, true, 'GAMES')" class="px-3 py-1 rounded-xl text-xs font-black transition ${currentBankTypeFilter==='GAMES'?'bg-amber-500 text-slate-950 shadow-sm':'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    🎮 Games (${totalGamesCount})
                                </button>
                            </div>
                        </div>
                        ${isSuperGlobal ? `
                        <label class="inline-flex items-center gap-2 cursor-pointer ml-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
                            <input type="checkbox" id="check-all-exams" ${allSelected ? 'checked' : ''} onchange="toggleSelectAllExams(this)" class="w-4 h-4 text-rose-600 rounded">
                            <span>Chọn tất cả (${filteredData.length})</span>
                        </label>` : ''}
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="autoMigrateAllFoldersToStandard()" class="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-700 transition shadow-sm btn-3d text-xs flex items-center gap-1.5" title="Tự động phân loại toàn bộ đề thi & game cũ về TOAN 6 - 12 hoặc KHAC"><i class="fa-solid fa-wand-magic-sparkles"></i> <span>Chuẩn Hóa Thư Mục</span></button>
                        ${isSuperGlobal ? `
                            <button id="btn-delete-selected-exams" onclick="deleteSelectedExamsFromBank()" class="${selectedExamCodes.size > 0 ? '' : 'hidden'} px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition shadow-sm btn-3d text-sm flex items-center gap-1.5"><i class="fa-solid fa-trash-can"></i> Xóa Đề Đã Chọn (<span id="selected-exams-count">${selectedExamCodes.size}</span>)</button>
                            <button onclick="clearExportHistoryAdmin()" class="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-500 hover:text-white transition shadow-sm btn-3d text-sm" title="Xóa toàn bộ kho đề lưu trữ"><i class="fa-solid fa-dumpster-fire mr-1"></i> Xóa Toàn Bộ Kho</button>
                        ` : `
                            <span class="text-xs bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1">
                                <i class="fa-solid fa-shield-halved text-sky-500"></i> Chế độ Giáo viên
                            </span>
                        `}
                    </div>
                </div>
                <div class="flex-grow overflow-y-auto admin-scroll pr-2">${html}</div>
            </div>`; 
        }

        async function autoMigrateAllFoldersToStandard() {
            if (!currentAdminBankData || currentAdminBankData.length === 0) {
                return showToast("Kho đề hiện chưa có dữ liệu!", true);
            }
            showConfirmModal(
                "⚡ Chuẩn Hóa Thư Mục Tự Động",
                `Hệ thống sẽ tự động quét ${currentAdminBankData.length} đề thi/games và phân loại lại về các thư mục chuẩn: TOAN 6 đến TOAN 12 (hoặc KHAC). Thầy/Cô có muốn thực hiện không?`,
                async () => {
                    let updatedCount = 0;
                    showToast("Đang chuẩn hóa thư mục cho toàn bộ kho...", false);
                    try {
                        for (let h of currentAdminBankData) {
                            let oldFolder = h.folder || '';
                            let newFolder = normalizeMathFolder(oldFolder);
                            if (newFolder !== oldFolder) {
                                h.folder = newFolder;
                                updatedCount++;
                                try {
                                    let docRef = db.collection("AdminHistory").doc(h.code);
                                    let snap = await docRef.get();
                                    if (snap.exists) await docRef.update({ folder: newFolder });
                                } catch(e){}
                                try {
                                    let sRef = db.collection("SharedGames").doc(h.code);
                                    let sSnap = await sRef.get();
                                    if (sSnap.exists) await sRef.update({ "settings.folder": newFolder });
                                } catch(e){}
                                try {
                                    let gRef = db.collection("GamesHistory").doc(h.code);
                                    let gSnap = await gRef.get();
                                    if (gSnap.exists) await gRef.update({ folder: newFolder });
                                } catch(e){}
                            }
                        }
                        try {
                            await db.collection("GameData").doc("AdminHistory").set({ list: currentAdminBankData });
                        } catch(e){}
                        showToast(`🎉 Đã chuẩn hóa thành công ${updatedCount} đề thi/games về đúng thư mục!`);
                        currentAdminBankData = [];
                        renderAdminBank(null, 'ALL', false);
                    } catch(err) {
                        showToast("Có lỗi trong quá trình chuẩn hóa: " + err.message, true);
                    }
                }
            );
        }
        async function loadExamIntoAdmin(code) { showConfirmModal("Tải Dữ Liệu Đám Mây", "Thầy/Cô muốn ghi đè bộ đề tải về lên giao diện đang soạn?", async () => { try { let snap = await db.collection("SharedGames").doc(code).get(); if(!snap.exists) throw new Error("Đề này đã bị xóa hoặc không tồn tại!"); let d = snap.data(); GAME_DATA = sanitizeGameData(d.data); adminState.data = JSON.parse(JSON.stringify(GAME_DATA)); adminState.loadedCode = code; adminState.loadedSettings = d.settings; showToast("Đã nhập thành công!"); adminSetTab('round1'); } catch (e) { showToast(e.message, true); } }); }
        async function updateExistingExam() { if (!adminState.loadedCode) return; adminSaveCurrentQ(false, true); GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data))); showConfirmModal("Ghi Đè Cập Nhật", `Ghi đè nội dung mới lên mã đề ${adminState.loadedCode}? Các học sinh đang thi có thể bị lỗi tiến trình.`, async () => { let btn = document.getElementById('btn-update-loaded-exam'); let old = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải lên...'; btn.disabled = true; try { await db.collection("SharedGames").doc(adminState.loadedCode).update({ data: GAME_DATA, "settings.lastUpdated": new Date().toISOString() }); showToast("Đã lưu đè lên Cloud!"); let docRef = db.collection("AdminHistory").doc(adminState.loadedCode); let snap = await docRef.get(); if (snap.exists) { await docRef.update({ date: new Date().toLocaleDateString('vi-VN') + " (Vừa sửa)" }); } else { let hDoc = await db.collection("GameData").doc("AdminHistory").get(); if(hDoc.exists) { let history = hDoc.data().list || []; let i = history.findIndex(h => h.code === adminState.loadedCode); if(i !== -1) { history[i].date = new Date().toLocaleDateString('vi-VN') + " (Vừa sửa)"; await db.collection("GameData").doc("AdminHistory").set({ list: history }); } } } currentAdminBankData = []; } catch (e) { showToast("Gặp sự cố kết nối!", true); } finally { btn.innerHTML = old; btn.disabled = false; } }); }
        function copyFromHistory(code) { let t = document.createElement("input"); t.value = code; document.body.appendChild(t); t.select(); document.execCommand("copy"); showToast("Đã Copy Code!"); document.body.removeChild(t); }
        let currentEditCode = "";
        function editExamInfo(code) {
            let item = currentAdminBankData.find(h => h.code === code);
            if (item) {
                currentEditCode = code;
                document.getElementById('edit-info-target-code').innerText = code;
                document.getElementById('edit-info-name').value = item.name || "";
                let f = normalizeMathFolder(item.folder);
                if (typeof setEditInfoFolderQuick === 'function') {
                    setEditInfoFolderQuick(f);
                } else {
                    document.getElementById('edit-info-folder').value = f;
                }
                document.getElementById('edit-info-modal').classList.remove('hidden');
            }
        }
        function closeEditInfoModal() {
            document.getElementById('edit-info-modal').classList.add('hidden');
        }
        async function confirmEditInfo() {
            let n = document.getElementById('edit-info-name').value.trim();
            let rawFolder = document.getElementById('edit-info-folder') ? document.getElementById('edit-info-folder').value.trim() : '';
            let f = normalizeMathFolder(rawFolder);
            if (!n) return;
            let item = currentAdminBankData.find(h => h.code === currentEditCode);
            if (item) {
                item.name = n;
                item.folder = f;
                try {
                    let docRef = db.collection("AdminHistory").doc(currentEditCode);
                    let snap = await docRef.get();
                    if (snap.exists) {
                        await docRef.update({ name: n, folder: f });
                    } else {
                        await db.collection("GameData").doc("AdminHistory").set({ list: currentAdminBankData });
                    }
                    try {
                        let gRef = db.collection("GamesHistory").doc(currentEditCode);
                        let gSnap = await gRef.get();
                        if (gSnap.exists) {
                            await gRef.update({ name: n, folder: f });
                        }
                    } catch(e){}
                    try {
                        let sRef = db.collection("SharedGames").doc(currentEditCode);
                        let sSnap = await sRef.get();
                        if (sSnap.exists) {
                            await sRef.update({ "settings.title": n, "settings.folder": f });
                        }
                    } catch(e){}
                } catch(e){}
                showToast("Lưu thông tin thành công!");
                closeEditInfoModal();
                currentAdminBankData = [];
                renderAdminBank();
            }
        }
        let currentDeleteCode = ""; function deleteExamCode(code) { if(!isCurrentUserSuperAdmin()) return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa đề thi!", true); currentDeleteCode = code; document.getElementById('delete-target-code').innerText = code; document.getElementById('delete-code-modal').classList.remove('hidden'); } function closeDeleteCodeModal() { document.getElementById('delete-code-modal').classList.add('hidden'); } 
        function extractCloudinaryUrls(obj) { let str = JSON.stringify(obj); let regex = /https?:\/\/res\.cloudinary\.com\/[^"'\s<>\\]+/g; let matches = str.match(regex); return matches ? [...new Set(matches)] : []; }
        async function confirmDeleteCode() { if(!isCurrentUserSuperAdmin()) return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa đề thi!", true); closeDeleteCodeModal(); try { let gameDoc = await db.collection("SharedGames").doc(currentDeleteCode).get(); if(gameDoc.exists) { let urls = extractCloudinaryUrls(gameDoc.data()); if(urls.length > 0) { fetch(GOOGLE_WEB_APP_URL + "?action=deleteCloudinary", { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'urls=' + encodeURIComponent(JSON.stringify(urls)) }).catch(e=>{}); } } await db.collection("SharedGames").doc(currentDeleteCode).delete(); let docRef = db.collection("AdminHistory").doc(currentDeleteCode); let snap = await docRef.get(); if(snap.exists) await docRef.delete(); currentAdminBankData = currentAdminBankData.filter(h => h.code !== currentDeleteCode); await db.collection("GameData").doc("AdminHistory").set({ list: currentAdminBankData }); showToast("Đã xóa vĩnh viễn!"); currentAdminBankData = []; renderAdminBank(); } catch(e) { showToast("Không thể xóa lúc này", true); } }
        function clearExportHistoryAdmin() { if(!isCurrentUserSuperAdmin()) return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa kho đề!", true); document.getElementById('clear-history-modal').classList.remove('hidden'); } function closeClearHistoryModal() { document.getElementById('clear-history-modal').classList.add('hidden'); } async function confirmClearHistory() { if(!isCurrentUserSuperAdmin()) return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền dọn dẹp kho đề Cloud!", true); closeClearHistoryModal(); try { let allUrls = []; for (let h of currentAdminBankData) { let gameDoc = await db.collection("SharedGames").doc(h.code).get(); if(gameDoc.exists) { let urls = extractCloudinaryUrls(gameDoc.data()); allUrls.push(...urls); } } if(allUrls.length > 0) { fetch(GOOGLE_WEB_APP_URL + "?action=deleteCloudinary", { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'urls=' + encodeURIComponent(JSON.stringify([...new Set(allUrls)])) }).catch(e=>{}); } } catch(e) {} await db.collection("GameData").doc("AdminHistory").set({ list: [] }); currentAdminBankData.forEach(async (h) => { try { await db.collection("AdminHistory").doc(h.code).delete(); } catch(e){} }); currentAdminBankData = []; renderAdminBank(); showToast("Đã dọn dẹp kho Cloud!"); }

        let currentMatrixGrade = 'all';

        function buildMatrixTopicOptions(grade, selectedVal) {
            let html = '';
            let sVal = String(selectedVal || '').trim();
            
            // 1. Chuẩn Hệ thống Mã định danh Quốc gia GDPT 2018 (MATH_ID_TAXONOMY)
            if (window.MATH_ID_TAXONOMY) {
                let gradesToInclude = (grade && grade !== 'all') ? [String(grade)] : ['12', '11', '10', '9', '8', '7', '6'];
                gradesToInclude.forEach(g => {
                    let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[g]) || g;
                    let gData = window.MATH_ID_TAXONOMY[gCode];
                    if (!gData || !gData.branches) return;
                    
                    html += `<optgroup label="🏷️ ${gData.gradeName || ('Toán Lớp ' + g)} (Chuẩn Mã ID Quốc Gia)">`;
                    Object.keys(gData.branches).forEach(bKey => {
                        let bData = gData.branches[bKey];
                        Object.keys(bData.chapters).forEach(cKey => {
                            let cData = bData.chapters[cKey];
                            let chPrefix = `[${gCode}${bKey}${cKey}]`;
                            let chVal = `${chPrefix} Chương ${cKey}: ${cData.name}`;
                            let selCh = (sVal && (sVal === chVal || sVal.startsWith(chPrefix))) ? 'selected' : '';
                            html += `<option value="${chVal}" ${selCh}> ⭐ ${chPrefix} Chương ${cKey}: ${cData.name}</option>`;
                            
                            Object.keys(cData.lessons || {}).forEach(lKey => {
                                let lData = cData.lessons[lKey];
                                let lsPrefix = `[${gCode}${bKey}${cKey}?${lKey}]`;
                                let lsVal = `${lsPrefix} Bài ${lKey}: ${lData.name}`;
                                let selLs = (sVal && (sVal === lsVal || sVal.startsWith(lsPrefix))) ? 'selected' : '';
                                html += `<option value="${lsVal}" ${selLs}> &nbsp;&nbsp; 📄 ${lsPrefix} Bài ${lKey}: ${lData.name}</option>`;
                                
                                Object.keys(lData.types || {}).forEach(tKey => {
                                    let tName = lData.types[tKey];
                                    let tpCode = `[${gCode}${bKey}${cKey}?${lKey}-${tKey}]`;
                                    let tpVal = `${tpCode} ${tName}`;
                                    let selTp = (sVal && (sVal === tpVal || sVal.startsWith(tpCode))) ? 'selected' : '';
                                    html += `<option value="${tpVal}" ${selTp}> &nbsp;&nbsp;&nbsp;&nbsp; 🔹 ${tpCode} ${tName}</option>`;
                                });
                            });
                        });
                    });
                    html += `</optgroup>`;
                });
            } else if (window.MATH_CURRICULUM_KNTT) {
                // Fallback KNTT Curriculum Topics
                let gradesToInclude = (grade && grade !== 'all') ? [grade] : ['12', '11', '10', '9', '8', '7', '6'];
                gradesToInclude.forEach(g => {
                    let gData = window.MATH_CURRICULUM_KNTT[g];
                    if (!gData || !gData.chapters) return;
                    
                    html += `<optgroup label="📚 ${gData.gradeName || ('Toán Lớp ' + g)} (KNTT)">`;
                    gData.chapters.forEach(ch => {
                        let chName = ch.name || ch.title || `Chương ${ch.id}`;
                        let chVal = `[KNTT] Lớp ${g} - ${chName}`;
                        let selCh = (sVal === chVal) ? 'selected' : '';
                        html += `<option value="${chVal}" ${selCh}> ⭐ [CHƯƠNG] Lớp ${g}: ${chName}</option>`;
                        (ch.lessons || []).forEach(ls => {
                            let lsName = typeof ls === 'string' ? ls : (ls.name || ls.title || 'Bài học');
                            let lsVal = `[KNTT] Lớp ${g} - ${lsName}`;
                            let selLs = (sVal === lsVal) ? 'selected' : '';
                            html += `<option value="${lsVal}" ${selLs}> &nbsp;&nbsp; 🔹 ${lsName}</option>`;
                        });
                    });
                    html += `</optgroup>`;
                });
            }

            // 2. Original Topics from Google Sheet Question Bank
            if (Array.isArray(globalQuestionBank) && globalQuestionBank.length > 0) {
                let sheetTopics = [...new Set(globalQuestionBank.map(q => q.topic))].filter(Boolean);
                if (sheetTopics.length > 0) {
                    html += `<optgroup label="📂 Chủ đề từ Ngân hàng Sheet">`;
                    sheetTopics.forEach(t => {
                        let selT = (sVal === t) ? 'selected' : '';
                        html += `<option value="${t}" ${selT}>${t}</option>`;
                    });
                    html += `</optgroup>`;
                }
            }

            return html;
        }

        async function renderQuestionBankSheet(contentArea) { 
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            contentArea.innerHTML = `<div class="flex justify-center items-center h-full flex-col"><i class="fa-solid fa-spinner fa-spin text-5xl text-emerald-500 mb-6"></i><p class="font-bold text-xl text-slate-600">Đang quét Ngân hàng Google Sheet...</p><p class="text-xs text-slate-400 mt-2 font-mono">ID: ${typeof GOOGLE_SHEET_BANK_ID !== 'undefined' ? GOOGLE_SHEET_BANK_ID : '1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI'}</p></div>`; 
            
            try { 
                let sheetIdParam = typeof GOOGLE_SHEET_BANK_ID !== 'undefined' ? `&sheetId=${GOOGLE_SHEET_BANK_ID}` : '';
                let r = await fetch(GOOGLE_WEB_APP_URL + "?action=getBank" + sheetIdParam + "&t=" + Date.now()); 
                let resText = await r.text();
                try {
                    globalQuestionBank = JSON.parse(resText);
                } catch(pe) {
                    console.warn("JSON parse getBank failed, attempting fallback:", pe);
                }
                
                // Fallback to Firestore / Local Cache if empty
                if (!Array.isArray(globalQuestionBank) || globalQuestionBank.length === 0) {
                    try {
                        if (typeof db !== 'undefined' && db) {
                            let snap = await db.collection("QuestionBank").get();
                            if (!snap.empty) {
                                let list = [];
                                snap.forEach(doc => list.push(doc.data()));
                                if (list.length > 0) globalQuestionBank = list;
                            }
                        }
                    } catch(fe) {}
                }

                if (!Array.isArray(globalQuestionBank)) globalQuestionBank = [];
                
                matrixRows = []; 
                renderMatrixBuilderUI(contentArea); 
            } catch(e) { 
                console.error("Lỗi getBank:", e);
                // Try reading from cache or Firestore before showing error
                let loadedFromCache = false;
                try {
                    if (typeof db !== 'undefined' && db) {
                        let snap = await db.collection("QuestionBank").get();
                        if (!snap.empty) {
                            let list = [];
                            snap.forEach(doc => list.push(doc.data()));
                            if (list.length > 0) {
                                globalQuestionBank = list;
                                loadedFromCache = true;
                            }
                        }
                    }
                } catch(err) {}

                if (loadedFromCache) {
                    showToast("Đã tải dữ liệu Ngân hàng từ Cloud lưu trữ!");
                    matrixRows = [];
                    renderMatrixBuilderUI(contentArea);
                } else {
                    contentArea.innerHTML = `
                    <div class="text-center mt-20 p-6 max-w-lg mx-auto bg-white rounded-3xl border-2 border-rose-200 shadow-lg">
                        <i class="fa-solid fa-triangle-exclamation text-5xl text-rose-500 mb-4 block"></i>
                        <h4 class="font-black text-xl text-slate-800 mb-2">Chưa thể tải dữ liệu tự động</h4>
                        <p class="text-xs text-slate-500 mb-5 leading-relaxed">Không thể kết nối đến Google Apps Script. Thầy/Cô có thể mở trực tiếp file Google Sheet hoặc nạp câu hỏi mới vào hệ thống.</p>
                        <div class="flex gap-3 justify-center">
                            <a href="${typeof GOOGLE_SHEET_BANK_URL !== 'undefined' ? GOOGLE_SHEET_BANK_URL : 'https://docs.google.com/spreadsheets/d/1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI/edit?gid=0#gid=0'}" target="_blank" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2">
                                <i class="fa-solid fa-file-excel"></i> Mở Google Sheet
                            </a>
                            <button onclick="globalQuestionBank=[]; renderMatrixBuilderUI()" class="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition">
                                Mở Trình Thiết Lập
                            </button>
                        </div>
                    </div>`; 
                }
            } 
        }

        function renderMatrixBuilderUI(contentArea) { 
            if (!contentArea) contentArea = document.getElementById('admin-content-area'); 
            window.matrixTopicOptions = buildMatrixTopicOptions(currentMatrixGrade);
            let sheetUrl = typeof GOOGLE_SHEET_BANK_URL !== 'undefined' ? GOOGLE_SHEET_BANK_URL : 'https://docs.google.com/spreadsheets/d/1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI/edit?gid=0#gid=0';

            contentArea.innerHTML = `
            <div class="h-full flex flex-col p-6 lg:p-8 bg-slate-50">
                <div class="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h3 class="text-2xl font-black text-slate-800 uppercase tracking-wider flex items-center">
                            <i class="fa-solid fa-layer-group text-emerald-500 mr-2.5"></i> Thiết Lập Ma Trận & Trộn Đề
                        </h3>
                        <p class="text-xs text-slate-500 mt-1 font-medium">Tích hợp khung chương trình Kết Nối Tri Thức (Lớp 6–12) & Ngân hàng Google Sheet</p>
                    </div>
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <button onclick="openImportQuestionBankModal('current')" class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl shadow-md hover:shadow-lg transition btn-3d text-xs flex items-center gap-1.5">
                            <i class="fa-solid fa-cloud-arrow-up"></i> Nạp Câu Vào Bank
                        </button>
                        <button onclick="openImportQuestionBankModal('browse')" class="px-3.5 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 font-black rounded-xl hover:bg-emerald-50 transition shadow-xs text-xs flex items-center gap-1.5">
                            <i class="fa-solid fa-database"></i> Xem Kho (<span id="matrix-bank-count">${globalQuestionBank ? globalQuestionBank.length : 0}</span>)
                        </button>
                        <a href="${sheetUrl}" target="_blank" class="px-3.5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition text-xs flex items-center gap-1.5" title="Mở file Google Sheet ngân hàng trực tiếp">
                            <i class="fa-solid fa-file-excel text-emerald-600"></i> Google Sheet
                        </a>
                        <div class="flex items-center gap-1.5 bg-white border-2 border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                            <i class="fa-solid fa-book-open text-sky-500 text-sm"></i>
                            <span class="text-xs font-bold text-slate-600">Lớp:</span>
                            <select id="matrix-grade-filter" onchange="onMatrixGradeFilterChange(this.value)" class="outline-none font-black text-sm text-sky-700 bg-transparent cursor-pointer">
                                <option value="all" ${currentMatrixGrade==='all'?'selected':''}>Tất cả Lớp (6-12)</option>
                                <option value="12" ${currentMatrixGrade==='12'?'selected':''}>Toán 12 (KNTT)</option>
                                <option value="11" ${currentMatrixGrade==='11'?'selected':''}>Toán 11 (KNTT)</option>
                                <option value="10" ${currentMatrixGrade==='10'?'selected':''}>Toán 10 (KNTT)</option>
                                <option value="9" ${currentMatrixGrade==='9'?'selected':''}>Toán 9 (KNTT)</option>
                                <option value="8" ${currentMatrixGrade==='8'?'selected':''}>Toán 8 (KNTT)</option>
                                <option value="7" ${currentMatrixGrade==='7'?'selected':''}>Toán 7 (KNTT)</option>
                                <option value="6" ${currentMatrixGrade==='6'?'selected':''}>Toán 6 (KNTT)</option>
                            </select>
                        </div>
                        <button onclick="setMatrixBGD2025()" class="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition btn-3d text-xs">
                            <i class="fa-solid fa-star mr-1.5"></i> Cấu trúc BGD 2025 (12-4-6)
                        </button>
                        <button onclick="setMatrixMidTermKNTT()" class="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition btn-3d text-xs">
                            <i class="fa-solid fa-graduation-cap mr-1.5"></i> Đề Giữa Kỳ
                        </button>
                        <button onclick="addMatrixRow()" class="px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-md btn-3d text-xs">
                            <i class="fa-solid fa-plus mr-1.5"></i> Thêm Dòng
                        </button>
                        <button onclick="clearMatrixRows()" class="px-3 py-2.5 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-rose-100 hover:text-rose-600 transition shadow-sm text-xs" title="Xóa toàn bộ dòng">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div class="flex-grow overflow-y-auto admin-scroll bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
                    <table class="w-full text-left border-collapse">
                        <thead class="sticky top-0 bg-slate-100 shadow-sm z-10 border-b-2 border-slate-200 text-xs">
                            <tr>
                                <th class="p-3.5 text-slate-600 font-black uppercase w-[40%]">Chủ Đề / Chương / Bài Học (KNTT & Sheet)</th>
                                <th class="p-3.5 text-slate-600 font-black uppercase w-[22%]">Hình Thức Câu</th>
                                <th class="p-3.5 text-slate-600 font-black uppercase w-[18%]">Mức Độ Tư Duy</th>
                                <th class="p-3.5 text-center text-slate-600 font-black uppercase w-[12%]">Số Câu</th>
                                <th class="p-3.5 text-center text-rose-500 font-black uppercase w-[8%]">Xóa</th>
                            </tr>
                        </thead>
                        <tbody id="matrix-body"></tbody>
                    </table>
                </div>

                <div class="mt-5 pt-4 border-t-2 border-slate-200 flex justify-between items-center flex-wrap gap-4">
                    <div class="flex items-center gap-6">
                        <div class="font-black text-lg text-slate-700 uppercase tracking-wider">
                            Tổng Câu Sinh: <span id="matrix-total-q" class="text-emerald-600 text-3xl ml-1.5 font-black">0</span>
                        </div>
                        <div class="text-xs text-slate-500 font-medium hidden sm:block">
                            (Phần I: <b>0.25đ/câu</b> | Phần II: <b>1.0đ/câu</b> | Phần III: <b>0.5đ/câu</b>)
                        </div>
                    </div>
                    <button id="btn-generate-matrix" onclick="generateTestFromMatrix()" class="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl btn-3d disabled:opacity-50 uppercase tracking-wider transition flex items-center">
                        <i class="fa-solid fa-bolt mr-2 text-lg"></i> Bốc Đề Tự Động Theo Ma Trận
                    </button>
                </div>
            </div>`; 
            updateMatrixUI(); 
        }

        function onMatrixGradeFilterChange(grade) {
            currentMatrixGrade = grade;
            window.matrixTopicOptions = buildMatrixTopicOptions(currentMatrixGrade);
            updateMatrixUI();
        }

        function setMatrixBGD2025() { 
            matrixRows = [ 
                { topic: '', type: 'MC', level: 'Nhận biết', count: 4 }, 
                { topic: '', type: 'MC', level: 'Thông hiểu', count: 4 }, 
                { topic: '', type: 'MC', level: 'Vận dụng', count: 4 }, 
                { topic: '', type: 'TF', level: 'Thông hiểu', count: 2 }, 
                { topic: '', type: 'TF', level: 'Vận dụng', count: 2 }, 
                { topic: '', type: 'SA', level: 'Vận dụng', count: 4 }, 
                { topic: '', type: 'SA', level: 'Vận dụng cao', count: 2 } 
            ]; 
            updateMatrixUI(); 
            showToast("Đã nạp chuẩn 12 MCQ + 4 TF + 6 SA (Bộ GD&ĐT 2025). Vui lòng chọn Chủ đề/Bài học!"); 
        }

        function setMatrixMidTermKNTT() {
            matrixRows = [ 
                { topic: '', type: 'MC', level: 'Nhận biết', count: 6 }, 
                { topic: '', type: 'MC', level: 'Thông hiểu', count: 4 }, 
                { topic: '', type: 'MC', level: 'Vận dụng', count: 2 }, 
                { topic: '', type: 'TF', level: 'Thông hiểu', count: 2 }, 
                { topic: '', type: 'TF', level: 'Vận dụng', count: 2 }, 
                { topic: '', type: 'SA', level: 'Thông hiểu', count: 2 }, 
                { topic: '', type: 'SA', level: 'Vận dụng', count: 4 } 
            ]; 
            updateMatrixUI(); 
            showToast("Đã nạp khung ma trận đề kiểm tra Giữa kỳ KNTT!"); 
        }

        function clearMatrixRows() {
            matrixRows = [];
            updateMatrixUI();
        }

        function addMatrixRow() { 
            matrixRows.push({ topic: '', type: 'MC', level: 'Nhận biết', count: 1 }); 
            updateMatrixUI(); 
        } 
        
        function removeMatrixRow(index) { 
            matrixRows.splice(index, 1); 
            updateMatrixUI(); 
        }

        function updateMatrixUI() { 
            let tbody = document.getElementById('matrix-body'); 
            let totalEl = document.getElementById('matrix-total-q'); 
            if (!tbody) return;

            if (matrixRows.length === 0) { 
                tbody.innerHTML = `<tr><td colspan="5" class="text-center py-16 text-slate-400 font-bold"><i class="fa-solid fa-list-ol text-4xl mb-3 block text-slate-300"></i>Chưa có dòng ma trận nào. Nhấn "+ Thêm Dòng" hoặc chọn cấu trúc mẫu phía trên.</td></tr>`; 
                if (totalEl) totalEl.innerText = '0'; 
                let btnGen = document.getElementById('btn-generate-matrix');
                if (btnGen) btnGen.disabled = true; 
                return; 
            } 

            let btnGen = document.getElementById('btn-generate-matrix');
            if (btnGen) btnGen.disabled = false; 

            let totalCount = 0; 
            tbody.innerHTML = matrixRows.map((row, i) => { 
                totalCount += parseInt(row.count) || 0; 
                return `
                <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td class="p-2.5">
                        <select class="w-full p-2.5 text-xs border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-400 font-bold text-slate-700 shadow-inner" onchange="matrixRows[${i}].topic = this.value">
                            <option value="">-- Chọn Chủ Đề / Bài Học (KNTT hoặc Sheet) --</option>
                            ${window.matrixTopicOptions}
                        </select>
                    </td>
                    <td class="p-2.5">
                        <select class="w-full p-2.5 text-xs border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-400 font-bold text-slate-700 shadow-inner" onchange="matrixRows[${i}].type = this.value">
                            <option value="MC" ${row.type==='MC'?'selected':''}>Phần I: Trắc nghiệm 4LC</option>
                            <option value="TF" ${row.type==='TF'?'selected':''}>Phần II: Đúng / Sai (4 ý)</option>
                            <option value="SA" ${row.type==='SA'?'selected':''}>Phần III: Điền Khuyết / Ngắn</option>
                        </select>
                    </td>
                    <td class="p-2.5">
                        <select class="w-full p-2.5 text-xs border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-400 font-bold text-slate-700 shadow-inner" onchange="matrixRows[${i}].level = this.value">
                            <option value="Nhận biết" ${row.level==='Nhận biết'?'selected':''}>Nhận biết</option>
                            <option value="Thông hiểu" ${row.level==='Thông hiểu'?'selected':''}>Thông hiểu</option>
                            <option value="Vận dụng" ${row.level==='Vận dụng'?'selected':''}>Vận dụng</option>
                            <option value="Vận dụng cao" ${row.level==='Vận dụng cao'?'selected':''}>Vận dụng cao</option>
                        </select>
                    </td>
                    <td class="p-2.5 text-center">
                        <input type="number" min="1" max="50" class="w-16 border-2 border-slate-200 rounded-xl text-center p-2 font-black text-base text-mainDark outline-none focus:border-emerald-400 shadow-inner" value="${row.count}" onchange="matrixRows[${i}].count = parseInt(this.value)||1; updateMatrixUI();">
                    </td>
                    <td class="p-2.5 text-center">
                        <button onclick="removeMatrixRow(${i})" class="text-rose-400 hover:text-white bg-rose-50 hover:bg-rose-500 w-8 h-8 rounded-lg transition shadow-sm btn-3d inline-flex items-center justify-center" title="Xóa dòng này">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </td>
                </tr>`; 
            }).join(''); 

            matrixRows.forEach((row, i) => { 
                let s = tbody.querySelectorAll(`tr:nth-child(${i+1}) select`); 
                if(s[0]) s[0].value = row.topic; 
            }); 

            if (totalEl) totalEl.innerText = totalCount; 
        }

        async function generateTestFromMatrix() { 
            let btn = document.getElementById('btn-generate-matrix'); 
            let old = btn.innerHTML; 
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2 text-xl"></i> HỆ THỐNG ĐANG QUÉT KHO & NỘI SUY...'; 
            btn.disabled = true; 
            await new Promise(r => setTimeout(r, 400)); 

            let newExam = { round1: [], round2: [], round3: [] }; 
            let r1Id = 1, r2Id = 1, r3Id = 1; 
            let errors = []; 

            // Hàm chuẩn hóa so khớp linh hoạt
            let normalizeStr = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

            for (let i = 0; i < matrixRows.length; i++) { 
                let rule = matrixRows[i]; 
                if(!rule.topic) continue; 

                let cleanRuleTopic = rule.topic.replace(/^\[KNTT\]\s*/i, '').trim();
                let ruleTypeNorm = normalizeStr(rule.type);
                let ruleLevelNorm = normalizeStr(rule.level);

                let pool = globalQuestionBank.filter(q => {
                    let qTypeNorm = normalizeStr(q.type);
                    // Match type (MC vs Trắc nghiệm, TF vs Đúng sai, SA vs Trả lời ngắn/Điền khuyết)
                    let typeMatches = false;
                    if (ruleTypeNorm === 'mc' && (qTypeNorm === 'mc' || qTypeNorm.includes('trac nghiem') || qTypeNorm.includes('4lc'))) typeMatches = true;
                    else if (ruleTypeNorm === 'tf' && (qTypeNorm === 'tf' || qTypeNorm.includes('dung sai') || qTypeNorm.includes('true'))) typeMatches = true;
                    else if (ruleTypeNorm === 'sa' && (qTypeNorm === 'sa' || qTypeNorm.includes('ngan') || qTypeNorm.includes('dien'))) typeMatches = true;
                    else if (qTypeNorm === ruleTypeNorm) typeMatches = true;

                    if (!typeMatches) return false;

                    // Match level
                    let qLevelNorm = normalizeStr(q.level);
                    let levelMatches = false;
                    if (ruleLevelNorm === 'nhan biet' && (qLevelNorm.includes('biet') || qLevelNorm.includes('nhan biet'))) levelMatches = true;
                    else if (ruleLevelNorm === 'thong hieu' && (qLevelNorm.includes('hieu') || qLevelNorm.includes('thong hieu'))) levelMatches = true;
                    else if (ruleLevelNorm === 'van dung' && (qLevelNorm === 'van dung' || qLevelNorm === 'vd')) levelMatches = true;
                    else if (ruleLevelNorm === 'van dung cao' && (qLevelNorm.includes('cao') || qLevelNorm === 'vdc')) levelMatches = true;
                    else if (qLevelNorm === ruleLevelNorm) levelMatches = true;

                    if (!levelMatches) return false;

                    // Match Topic / KNTT Lesson
                    let qTopicNorm = normalizeStr(q.topic);
                    let ruleTopicNorm = normalizeStr(cleanRuleTopic);
                    let qFullTextNorm = normalizeStr((q.question || '') + ' ' + (q.explain || '') + ' ' + (q.topic || ''));

                    // Exact topic match
                    if (qTopicNorm === ruleTopicNorm || qTopicNorm.includes(ruleTopicNorm) || ruleTopicNorm.includes(qTopicNorm)) {
                        return true;
                    }

                    // KNTT keyword match
                    let cleanKeywords = ruleTopicNorm.replace(/^(lop\s*\d+\s*-|chuong\s*\d+|bai\s*\d+[:.]?)/g, '').trim().split(/\s+/).filter(w => w.length > 2);
                    if (cleanKeywords.length > 0) {
                        let matchedKw = cleanKeywords.filter(kw => qFullTextNorm.includes(kw));
                        if (matchedKw.length >= Math.min(2, cleanKeywords.length)) return true;
                    }

                    return false;
                });

                if (pool.length < rule.count) { 
                    errors.push(`[Dòng ${i+1}]: Chỉ quét được ${pool.length}/${rule.count} câu phù hợp.`); 
                    rule.count = pool.length; 
                } 

                // Xáo trộn ngẫu nhiên câu hỏi
                for (let j = pool.length - 1; j > 0; j--) { 
                    const k = Math.floor(Math.random() * (j + 1)); 
                    [pool[j], pool[k]] = [pool[k], pool[j]]; 
                } 

                pool.slice(0, rule.count).forEach(q => { 
                    let formatted = { text: q.question || "", explanation: q.explain || "" }; 
                    if (rule.type === 'MC') { 
                        formatted.id = r1Id++; 
                        formatted.options = [q.opt1, q.opt2, q.opt3, q.opt4].filter(Boolean); 
                        formatted.answer = q.answer || ""; 
                        formatted.points = 25; 
                        newExam.round1.push(formatted); 
                    } else if (rule.type === 'TF') { 
                        formatted.id = r2Id++; 
                        let aStr = String(q.answer || "").toUpperCase().replace(/[^TFDĐS]/g, ''); 
                        let aArr = aStr.split(''); 
                        if(aArr.length<4) aArr=['F','F','F','F']; 
                        formatted.statements = [ 
                            {label:"a",text:q.opt1||"",isTrue:(aArr[0]==='T'||aArr[0]==='Đ'),points:25}, 
                            {label:"b",text:q.opt2||"",isTrue:(aArr[1]==='T'||aArr[1]==='Đ'),points:25}, 
                            {label:"c",text:q.opt3||"",isTrue:(aArr[2]==='T'||aArr[2]==='Đ'),points:25}, 
                            {label:"d",text:q.opt4||"",isTrue:(aArr[3]==='T'||aArr[3]==='Đ'),points:25} 
                        ]; 
                        newExam.round2.push(formatted); 
                    } else if (rule.type === 'SA') { 
                        formatted.id = r3Id++; 
                        formatted.answer = q.answer || ""; 
                        formatted.points = 100; 
                        newExam.round3.push(formatted); 
                    } 
                }); 
            } 

            if (errors.length > 0) showToast("Báo cáo quét kho: " + errors.join(" "), true); 
            
            adminState.loadedCode = null; 
            adminState.data = sanitizeGameData(newExam); 
            GAME_DATA = JSON.parse(JSON.stringify(adminState.data)); 
            showToast(`Trộn sinh đề mới thành công (${r1Id-1} MCQ + ${r2Id-1} TF + ${r3Id-1} SA)!`); 
            btn.innerHTML = old; 
            btn.disabled = false; 
            adminSetTab('round1'); 
        }

        // =========================================================================
        // QUESTION BANK IMPORTER & MANAGER (SUPABASE & GOOGLE SHEET SYNC)
        // =========================================================================
        let currentBankImportTab = 'current';
        window.bankStagingQuestions = [];

        async function renderQuestionBankSheet(contentArea) { 
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            contentArea.innerHTML = `
            <div class="flex justify-center items-center h-full flex-col">
                <i class="fa-solid fa-spinner fa-spin text-5xl text-emerald-500 mb-6"></i>
                <p class="font-bold text-xl text-slate-700">Đang quét Ngân hàng dữ liệu Supabase & Sheet...</p>
                <p class="text-xs text-slate-400 mt-2 font-mono">Supabase Sync + Google Sheet ID: ${typeof GOOGLE_SHEET_BANK_ID !== 'undefined' ? GOOGLE_SHEET_BANK_ID : '1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI'}</p>
            </div>`; 
            
            try { 
                let loadedQuestions = [];

                // 1. Ưu tiên 1: Tải trực tiếp từ Supabase Question Bank Service
                if (typeof SupabaseQuestionBankService !== 'undefined') {
                    try {
                        let supaData = await SupabaseQuestionBankService.getAll();
                        if (Array.isArray(supaData) && supaData.length > 0) {
                            loadedQuestions = supaData;
                        }
                    } catch(se) {
                        console.warn("Supabase QuestionBank load warning:", se);
                    }
                }

                // 2. Ưu tiên 2: Tải bổ sung từ Google Apps Script / Google Sheet
                if (loadedQuestions.length === 0) {
                    try {
                        let sheetIdParam = typeof GOOGLE_SHEET_BANK_ID !== 'undefined' ? `&sheetId=${GOOGLE_SHEET_BANK_ID}` : '';
                        let r = await fetch(GOOGLE_WEB_APP_URL + "?action=getBank" + sheetIdParam + "&t=" + Date.now()); 
                        let resText = await r.text();
                        let sheetData = JSON.parse(resText);
                        if (Array.isArray(sheetData) && sheetData.length > 0) {
                            loadedQuestions = sheetData;
                            // Đồng bộ ngược sang Supabase nếu Supabase đang trống
                            if (typeof SupabaseQuestionBankService !== 'undefined' && loadedQuestions.length > 0) {
                                SupabaseQuestionBankService.saveBatch(loadedQuestions).catch(()=>{});
                            }
                        }
                    } catch(ge) {
                        console.warn("Google Apps Script getBank warning:", ge);
                    }
                }

                // 3. Fallback: LocalStorage / Firestore
                if (loadedQuestions.length === 0) {
                    try {
                        let localRaw = localStorage.getItem('tbs_question_bank_cache');
                        if (localRaw) {
                            let parsed = JSON.parse(localRaw);
                            if (Array.isArray(parsed) && parsed.length > 0) loadedQuestions = parsed;
                        }
                    } catch(le) {}
                }

                globalQuestionBank = loadedQuestions;
                try {
                    localStorage.setItem('tbs_question_bank_cache', JSON.stringify(globalQuestionBank));
                } catch(e) {}
                
                matrixRows = []; 
                renderMatrixBuilderUI(contentArea); 
            } catch(e) { 
                console.error("Lỗi getBank tổng hợp:", e);
                matrixRows = [];
                renderMatrixBuilderUI(contentArea);
            } 
        }

        function openImportQuestionBankModal(tab = 'current') {
            let modal = document.getElementById('import-question-bank-modal');
            if (!modal) return;
            
            let sheetLink = document.getElementById('btn-open-google-sheet-link');
            if (sheetLink) {
                sheetLink.href = (typeof GOOGLE_SHEET_BANK_URL !== 'undefined') ? GOOGLE_SHEET_BANK_URL : 'https://docs.google.com/spreadsheets/d/1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI/edit?gid=0#gid=0';
            }

            let badge = document.getElementById('bank-total-count-badge');
            if (badge) badge.innerText = Array.isArray(globalQuestionBank) ? globalQuestionBank.length : 0;

            modal.classList.remove('hidden');
            switchBankImportTab(tab);
        }

        function closeImportQuestionBankModal() {
            let modal = document.getElementById('import-question-bank-modal');
            if (modal) modal.classList.add('hidden');
        }

        function switchBankImportTab(tab, preserveStaging = false) {
            currentBankImportTab = tab;
            let tabs = ['current', 'paste', 'single', 'browse'];
            tabs.forEach(t => {
                let btn = document.getElementById(`tab-bank-${t === 'current' ? 'cur' : t}`);
                let view = document.getElementById(`view-bank-${t === 'current' ? 'cur' : t}`);
                if (btn) {
                    btn.className = (t === tab)
                        ? "px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white shadow-md transition flex items-center gap-1.5"
                        : "px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-700 border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1.5";
                }
                if (view) view.classList.toggle('hidden', t !== tab);
            });

            let submitBtn = document.getElementById('btn-submit-bank-import');
            let submitText = document.getElementById('btn-submit-bank-import-text');
            let statusText = document.getElementById('bank-import-status-text');

            if (tab === 'current') {
                if (submitBtn) submitBtn.classList.remove('hidden');
                if (submitText) submitText.innerText = "Nạp Các Câu Đã Soát Duyệt Vào Supabase & Sheet";
                if (statusText) statusText.innerText = "Soát duyệt, chỉnh sửa nội dung/mức độ/ID và xóa câu không đạt trước khi nạp.";
                if (preserveStaging) {
                    renderBankStagingUI();
                } else {
                    initBankCurStaging();
                }
            } else if (tab === 'paste') {
                if (submitBtn) submitBtn.classList.remove('hidden');
                if (submitText) submitText.innerText = "Phân Tích & Đưa Vào Danh Sách Soát Duyệt";
                if (statusText) statusText.innerText = "Dán đề thi văn bản thô để hệ thống bóc tách câu hỏi vào bàn soát duyệt.";
                initBankPasteTab();
            } else if (tab === 'single') {
                if (submitBtn) submitBtn.classList.remove('hidden');
                if (submitText) submitText.innerText = "Lưu Câu Hỏi Này Vào Supabase & Sheet";
                if (statusText) statusText.innerText = "Nhập thông tin câu hỏi và lưu trực tiếp vào Ngân hàng.";
                initBankSingleTab();
            } else if (tab === 'browse') {
                if (submitBtn) submitBtn.classList.add('hidden');
                if (statusText) statusText.innerText = `Đang hiển thị ${Array.isArray(globalQuestionBank) ? globalQuestionBank.length : 0} câu hỏi trong ngân hàng dữ liệu (Supabase).`;
                renderBankBrowserQuestions();
            }
        }

        // ==================== BÀN SOÁT DUYỆT & QUẢN TRỊ CÂU HỎI TRƯỚC KHI NẠP ====================
        function initBankCurStaging() {
            let data = adminState.data || GAME_DATA || { round1: [], round2: [], round3: [] };
            let r1 = data.round1 || [];
            let r2 = data.round2 || [];
            let r3 = data.round3 || [];
            let curGrade = document.getElementById('bank-cur-grade')?.value || (adminState?.meta?.grade || '12');
            let autoInter = document.getElementById('bank-cur-auto-interpolate')?.checked !== false;

            window.bankStagingQuestions = [];
            let countId = 1;

            function resolveStagingMeta(q, defaultType) {
                let idCode = q.idCode || '';
                let topic = q.topic || '';
                let level = q.level || (defaultType === 'MC' ? 'Thông hiểu' : 'Vận dụng');

                if (idCode) {
                    if (window.getMathIdDetails && typeof window.getMathIdDetails === 'function') {
                        let details = window.getMathIdDetails(idCode);
                        if (details) {
                            topic = `[${details.idClean}] ${details.typeName || details.lessonName || details.chapterName}`;
                            if (details.levelName) level = details.levelName;
                        }
                    }
                    if (!topic) topic = idCode;
                }

                if (!topic && autoInter && typeof findBestKNTTTopicForQuestion === 'function') {
                    topic = findBestKNTTTopicForQuestion((q.text || '') + ' ' + (q.explanation || ''), curGrade);
                }

                if (!topic) {
                    let gCode = (window.GRADE_NAME_TO_CODE && window.GRADE_NAME_TO_CODE[curGrade]) || curGrade;
                    topic = `[${gCode}D1?1-1] Chủ đề chung Lớp ${curGrade}`;
                }

                let finalId = idCode || `Q${curGrade}_${defaultType}_${String(countId++).padStart(3, '0')}`;
                return { finalId, topic, level };
            }

            r1.forEach((q, idx) => {
                let meta = resolveStagingMeta(q, 'MC');
                window.bankStagingQuestions.push({
                    id: meta.finalId,
                    grade: curGrade,
                    topic: meta.topic,
                    type: 'MC',
                    level: meta.level,
                    question: q.text || '',
                    opt1: q.options && q.options[0] ? q.options[0] : '',
                    opt2: q.options && q.options[1] ? q.options[1] : '',
                    opt3: q.options && q.options[2] ? q.options[2] : '',
                    opt4: q.options && q.options[3] ? q.options[3] : '',
                    answer: q.answer || 'A',
                    explain: q.explanation || '',
                    selected: true
                });
            });

            r2.forEach((q, idx) => {
                let meta = resolveStagingMeta(q, 'TF');
                let stmts = q.statements || [];
                let ansStr = stmts.map(s => s.isTrue ? 'Đ' : 'S').join('');
                window.bankStagingQuestions.push({
                    id: meta.finalId,
                    grade: curGrade,
                    topic: meta.topic,
                    type: 'TF',
                    level: meta.level,
                    question: q.text || '',
                    opt1: stmts[0] ? stmts[0].text : '',
                    opt2: stmts[1] ? stmts[1].text : '',
                    opt3: stmts[2] ? stmts[2].text : '',
                    opt4: stmts[3] ? stmts[3].text : '',
                    answer: ansStr.length === 4 ? ansStr : 'ĐSĐS',
                    explain: q.explanation || '',
                    selected: true
                });
            });

            r3.forEach((q, idx) => {
                let meta = resolveStagingMeta(q, 'SA');
                window.bankStagingQuestions.push({
                    id: meta.finalId,
                    grade: curGrade,
                    topic: meta.topic,
                    type: 'SA',
                    level: meta.level,
                    question: q.text || '',
                    opt1: '', opt2: '', opt3: '', opt4: '',
                    answer: q.answer || '',
                    explain: q.explanation || '',
                    selected: true
                });
            });

            renderBankStagingUI();
        }

        function renderBankStagingUI() {
            let container = document.getElementById('bank-cur-questions-list');
            if (!container) return;

            let curGrade = document.getElementById('bank-cur-grade')?.value || (adminState?.meta?.grade || '12');

            if (!window.bankStagingQuestions || window.bankStagingQuestions.length === 0) {
                container.innerHTML = `
                <div class="text-center py-12 bg-white rounded-2xl border-2 border-slate-200">
                    <i class="fa-solid fa-clipboard-check text-4xl text-slate-300 mb-3 block"></i>
                    <p class="font-bold text-slate-600 text-sm">Chưa có câu hỏi nào trong danh sách soát duyệt.</p>
                    <p class="text-xs text-slate-400 mt-1">Thầy/Cô hãy tải câu hỏi từ đề đang mở hoặc dán văn bản để nạp vào.</p>
                    <button onclick="addEmptyStagingQuestion()" class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition">
                        <i class="fa-solid fa-plus mr-1"></i> Thêm 1 Câu Thủ Công Vào Bàn Soát Duyệt
                    </button>
                </div>`;
                return;
            }

            container.innerHTML = `
            <div class="flex justify-between items-center bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 mb-3">
                <span>Danh sách soát duyệt: <b>${window.bankStagingQuestions.length} câu</b> (Thầy/Cô có thể chỉnh sửa ID, nội dung, mức độ hoặc xóa các câu không đạt)</span>
                <button onclick="addEmptyStagingQuestion()" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-xs flex items-center gap-1">
                    <i class="fa-solid fa-plus text-xs"></i> Thêm câu
                </button>
            </div>` + window.bankStagingQuestions.map((q, i) => {
                let typeBadge = q.type === 'MC' 
                    ? `<span class="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md">Phần I: MCQ</span>`
                    : q.type === 'TF'
                    ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">Phần II: Đúng/Sai</span>`
                    : `<span class="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md">Phần III: TL Ngắn</span>`;

                return `
                <div class="bg-white p-4 rounded-2xl border-2 ${q.selected ? 'border-emerald-300 shadow-sm' : 'border-slate-200 opacity-60'} space-y-3 transition">
                    <!-- Top control row -->
                    <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                        <div class="flex items-center gap-2">
                            <input type="checkbox" ${q.selected ? 'checked' : ''} onchange="window.bankStagingQuestions[${i}].selected = this.checked; renderBankStagingUI()" class="w-4 h-4 text-emerald-600 rounded cursor-pointer">
                            <span class="font-black text-xs text-slate-700">#${i+1}</span>
                            <div class="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                                <span class="text-[10px] font-bold text-slate-500">Mã ID:</span>
                                <input type="text" value="${q.id || ''}" onchange="window.bankStagingQuestions[${i}].id = this.value" placeholder="[2D1N1-1]" class="w-28 text-xs font-mono font-bold text-indigo-700 outline-none bg-transparent">
                            </div>
                            ${typeBadge}
                        </div>
                        <div class="flex items-center gap-2">
                            <select onchange="window.bankStagingQuestions[${i}].type = this.value; renderBankStagingUI()" class="p-1 px-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 outline-none">
                                <option value="MC" ${q.type==='MC'?'selected':''}>Dạng MCQ 4LC</option>
                                <option value="TF" ${q.type==='TF'?'selected':''}>Dạng Đúng/Sai</option>
                                <option value="SA" ${q.type==='SA'?'selected':''}>Dạng Trả lời ngắn</option>
                            </select>
                            <select onchange="window.bankStagingQuestions[${i}].level = this.value" class="p-1 px-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 outline-none">
                                <option value="Nhận biết" ${q.level==='Nhận biết'?'selected':''}>Nhận biết</option>
                                <option value="Thông hiểu" ${q.level==='Thông hiểu'?'selected':''}>Thông hiểu</option>
                                <option value="Vận dụng" ${q.level==='Vận dụng'?'selected':''}>Vận dụng</option>
                                <option value="Vận dụng cao" ${q.level==='Vận dụng cao'?'selected':''}>Vận dụng cao</option>
                            </select>
                            <button onclick="removeStagingQuestion(${i})" class="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-rose-200" title="Xóa câu này khỏi danh sách nạp (không đạt)">
                                <i class="fa-solid fa-trash-can"></i> Xóa
                            </button>
                        </div>
                    </div>

                    <!-- Topic Selector -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-600 shrink-0">Chủ đề / Mã ID:</span>
                        <select onchange="window.bankStagingQuestions[${i}].topic = this.value" class="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 outline-none">
                            ${buildMatrixTopicOptions(q.grade || curGrade, q.topic)}
                        </select>
                    </div>

                    <!-- Question Content Area -->
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <label class="text-xs font-bold text-slate-600">Đề bài câu hỏi:</label>
                            <div class="flex gap-1">
                                <button type="button" onclick="openMathModal('staging-q-text-${i}')" class="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[11px] font-bold hover:bg-sky-100"><i class="fa-solid fa-calculator mr-1"></i> Toán</button>
                                <button type="button" onclick="openMathStudioModal('staging-q-text-${i}')" class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[11px] font-bold hover:bg-purple-100"><i class="fa-solid fa-shapes mr-1"></i> Vẽ hình</button>
                            </div>
                        </div>
                        <textarea id="staging-q-text-${i}" rows="2" onchange="window.bankStagingQuestions[${i}].question = this.value" class="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-sans shadow-inner leading-relaxed">${q.question || ''}</textarea>
                    </div>

                    <!-- Options / Statements -->
                    ${q.type === 'MC' ? `
                    <div class="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div class="text-[11px] font-bold text-slate-500 mb-1">Phương án và Đáp án đúng (Tick chọn):</div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            ${['A', 'B', 'C', 'D'].map((opt, oIdx) => `
                            <div class="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200">
                                <input type="radio" name="staging-mc-ans-${i}" value="${opt}" ${q.answer===opt?'checked':''} onchange="window.bankStagingQuestions[${i}].answer = this.value" class="w-3.5 h-3.5 text-emerald-600">
                                <b class="text-xs text-blue-600 shrink-0">${opt}.</b>
                                <input type="text" value="${q['opt'+(oIdx+1)] || ''}" onchange="window.bankStagingQuestions[${i}]['opt'+(${oIdx+1})] = this.value" placeholder="Phương án ${opt}" class="w-full text-xs outline-none bg-transparent">
                            </div>`).join('')}
                        </div>
                    </div>` : ''}

                    ${q.type === 'TF' ? `
                    <div class="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div class="text-[11px] font-bold text-slate-500 mb-1">4 Ý phát biểu và Đáp án Đúng / Sai:</div>
                        ${['a', 'b', 'c', 'd'].map((stmt, sIdx) => {
                            let curVal = (q.answer && q.answer[sIdx]) ? q.answer[sIdx] : 'Đ';
                            return `
                            <div class="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200">
                                <b class="text-xs text-emerald-700 shrink-0 w-5">${stmt})</b>
                                <input type="text" value="${q['opt'+(sIdx+1)] || ''}" onchange="window.bankStagingQuestions[${i}]['opt'+(${sIdx+1})] = this.value" placeholder="Nội dung ý ${stmt}..." class="w-full text-xs outline-none bg-transparent">
                                <select onchange="updateStagingTfAnswer(${i}, ${sIdx}, this.value)" class="p-1 px-1.5 border border-slate-200 rounded text-xs font-bold outline-none bg-slate-50">
                                    <option value="Đ" ${curVal==='Đ'?'selected':''}>Đúng</option>
                                    <option value="S" ${curVal==='S'?'selected':''}>Sai</option>
                                </select>
                            </div>`;
                        }).join('')}
                    </div>` : ''}

                    ${q.type === 'SA' ? `
                    <div class="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span class="text-xs font-bold text-slate-600 shrink-0">Đáp án chính xác:</span>
                        <input type="text" value="${q.answer || ''}" onchange="window.bankStagingQuestions[${i}].answer = this.value" placeholder="Số hoặc biểu thức..." class="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-emerald-700 outline-none">
                    </div>` : ''}

                    <!-- Explanation -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 mb-1">Hướng dẫn giải:</label>
                        <textarea rows="1" onchange="window.bankStagingQuestions[${i}].explain = this.value" class="w-full p-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 bg-slate-50 font-sans shadow-inner">${q.explain || ''}</textarea>
                    </div>
                </div>`;
            }).join('');

            // Restore topic selects
            window.bankStagingQuestions.forEach((q, i) => {
                let card = container.querySelectorAll('.bg-white')[i + 1];
                if (card) {
                    let sel = card.querySelector('select');
                    if (sel && q.topic) sel.value = q.topic;
                }
            });
        }

        function updateStagingTfAnswer(qIdx, stmtIdx, val) {
            if (!window.bankStagingQuestions[qIdx]) return;
            let current = (window.bankStagingQuestions[qIdx].answer || 'ĐSĐS').split('');
            while (current.length < 4) current.push('Đ');
            current[stmtIdx] = val;
            window.bankStagingQuestions[qIdx].answer = current.join('');
        }

        function removeStagingQuestion(idx) {
            if (window.bankStagingQuestions && window.bankStagingQuestions[idx]) {
                window.bankStagingQuestions.splice(idx, 1);
                renderBankStagingUI();
                showToast("Đã loại bỏ câu hỏi khỏi danh sách soát duyệt!");
            }
        }

        function addEmptyStagingQuestion() {
            let curGrade = document.getElementById('bank-cur-grade')?.value || '12';
            let newId = `Q${curGrade}_MC_${String((window.bankStagingQuestions.length || 0) + 1).padStart(3, '0')}`;
            window.bankStagingQuestions.push({
                id: newId,
                grade: curGrade,
                topic: `[KNTT] Lớp ${curGrade} - Chủ đề chung`,
                type: 'MC',
                level: 'Thông hiểu',
                question: '',
                opt1: '', opt2: '', opt3: '', opt4: '',
                answer: 'A',
                explain: '',
                selected: true
            });
            renderBankStagingUI();
        }

        function toggleSelectAllBankCurQuestions(checked) {
            (window.bankStagingQuestions || []).forEach(q => q.selected = checked);
            renderBankStagingUI();
        }

        function onBankCurGradeChange(grade) {
            initBankCurStaging();
        }

        function toggleBankFormatGuide() {
            let card = document.getElementById('bank-format-guide-card');
            if (card) card.classList.toggle('hidden');
        }

        function insertBankSampleText() {
            let textarea = document.getElementById('bank-paste-raw-text');
            if (!textarea) return;
            let sample = `Câu 1: Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = x(x-2)$. Hàm số đồng biến trên khoảng nào dưới đây?
A. $(2; +\\infty)$
B. $(0; 2)$
C. $(-\\infty; 0)$
D. $(-2; 2)$
Đáp án: A
Lời giải: Ta có $f'(x) > 0 \\Leftrightarrow x > 2$ hoặc $x < 0$. Do đó hàm số đồng biến trên khoảng $(2; +\\infty)$.

Câu 2: Cho hàm số $y = x^3 - 3x + 2$.
a) Tập xác định của hàm số là $D = \\mathbb{R}$. (Đúng)
b) Đạo hàm của hàm số là $y' = 3x^2 - 3$. (Đúng)
c) Hàm số đạt cực đại tại điểm $x = 1$. (Sai)
d) Điểm cực tiểu của đồ thị hàm số là $(1; 0)$. (Đúng)
Lời giải: Đạo hàm $y' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Hàm số đạt cực đại tại $x = -1$ và cực tiểu tại $x = 1$ với $y(1) = 0$.

Câu 3: Tìm giá trị lớn nhất của hàm số $y = -x^2 + 4x + 1$ trên đoạn $[0; 3]$.
Đáp án: 5
Lời giải: Tọa độ đỉnh parabol là $x = 2 \\in [0; 3]$. Ta có $y(0) = 1$, $y(2) = 5$, $y(3) = 4$. Vậy $\\max_{[0; 3]} y = 5$.`;
            textarea.value = sample;
            showToast("Đã chèn bộ đề mẫu chuẩn BGD 2025!");
        }

        function openBankAiPromptModal() {
            let modal = document.getElementById('bank-ai-prompt-modal');
            if (!modal) return;
            generateBankAiPrompt();
            modal.classList.remove('hidden');
        }

        function closeBankAiPromptModal() {
            let modal = document.getElementById('bank-ai-prompt-modal');
            if (modal) modal.classList.add('hidden');
        }

        window.bankAiPromptMode = window.bankAiPromptMode || 'formal';

        function setBankAiPromptMode(mode) {
            window.bankAiPromptMode = mode;
            let btnFormal = document.getElementById('btn-bank-ai-mode-formal');
            let btnPractice = document.getElementById('btn-bank-ai-mode-practice');
            if (btnFormal && btnPractice) {
                if (mode === 'formal') {
                    btnFormal.className = "flex-1 py-2 px-3 rounded-xl border border-purple-500 bg-purple-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition";
                    btnPractice.className = "flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition";
                } else {
                    btnPractice.className = "flex-1 py-2 px-3 rounded-xl border border-amber-500 bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition";
                    btnFormal.className = "flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition";
                }
            }
            generateBankAiPrompt();
        }

        function generateBankAiPrompt() {
            let grade = document.getElementById('bank-paste-grade')?.value || '12';
            let topic = document.getElementById('bank-paste-topic')?.value || '';
            let level = document.getElementById('bank-paste-level')?.value || 'Thông hiểu';
            let rawText = document.getElementById('bank-paste-raw-text')?.value || '';
            
            let numMC = document.getElementById('bank-ai-num-mc')?.value || 4;
            let numTF = document.getElementById('bank-ai-num-tf')?.value || 2;
            let numSA = document.getElementById('bank-ai-num-sa')?.value || 2;

            let prompt = '';
            if (window.bankAiPromptMode === 'formal') {
                prompt = `Bạn là chuyên gia khảo thí và biên soạn đề kiểm tra định kỳ môn Toán THPT theo đúng quy chuẩn CÔNG VĂN 7991/BGDĐT và cấu trúc GDPT 2018 (Chuẩn BGD 2025).

NHIỆM VỤ: Hãy biên soạn bộ câu hỏi đánh giá năng lực Toán học lớp ${grade} ${topic ? `thuộc chủ đề: "${topic}"` : ''} mức độ chủ đạo: "${level}".
${rawText.trim() ? `\nKIẾN THỨC / LÝ THUYẾT TRỌNG TÂM CẦN BÁM SÁT:\n"""\n${rawText.trim()}\n"""\n` : ''}
YÊU CẦU CẤU TRÚC THEO QUY TRÌNH CÔNG VĂN 7991/BGDĐT:
1. PHẦN I (${numMC} câu Trắc nghiệm 4 lựa chọn A, B, C, D):
Mỗi câu có 4 phương án A, B, C, D; kèm theo 'Chủ đề:', 'Mức độ:', 'Yêu cầu cần đạt:', 'Đáp án: [A/B/C/D]' và 'Lời giải: [Chi tiết]'.
Ví dụ:
Câu 1: [Đề bài câu hỏi]
A. [Phương án A]
B. [Phương án B]
C. [Phương án C]
D. [Phương án D]
Chủ đề: ${topic || 'Khảo sát hàm số'}
Mức độ: Nhận biết
Yêu cầu cần đạt: Nhận biết tính chất cơ bản
Đáp án: A
Lời giải: [Các bước giải chi tiết]

2. PHẦN II (${numTF} câu Trắc nghiệm Đúng / Sai):
Mỗi câu có 1 ngữ cảnh chung và 4 ý phát biểu a), b), c), d). Ở cuối mỗi ý ghi rõ (Đúng) hoặc (Sai); kèm theo 'Chủ đề:', 'Mức độ:', 'Yêu cầu cần đạt:' và 'Lời giải: [Chi tiết từng ý a, b, c, d]'.
Ví dụ:
Câu 2: [Đề bài chung]
a) [Phát biểu ý a] (Đúng)
b) [Phát biểu ý b] (Sai)
c) [Phát biểu ý c] (Đúng)
d) [Phát biểu ý d] (Sai)
Chủ đề: ${topic || 'Hàm số'}
Mức độ: Thông hiểu
Yêu cầu cần đạt: Khảo sát và biện luận tính chất
Lời giải: [Lời giải chi tiết cho 4 ý a, b, c, d]

3. PHẦN III (${numSA} câu Trắc nghiệm Trả lời ngắn):
Mỗi câu hỏi yêu cầu học sinh tính toán ra kết quả là số hoặc biểu thức; kèm theo 'Chủ đề:', 'Mức độ:', 'Yêu cầu cần đạt:', 'Đáp án: [Kết quả]' và 'Lời giải: [Chi tiết]'.
Ví dụ:
Câu 3: [Đề bài câu hỏi]
Chủ đề: ${topic || 'Hàm số'}
Mức độ: Vận dụng
Yêu cầu cần đạt: Giải quyết bài toán cực trị thực tế
Đáp án: 5
Lời giải: [Các bước giải chi tiết]

QUY CHUẨN TRÌNH BÀY & TRỰC QUAN HÓA TOÁN HỌC:
- Tất cả công thức toán học BẮT BUỘC đặt trong cặp dấu đô la $...$ (chuẩn LaTeX).
- ★ BẮT BUỘC VẼ BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHI CÂU HỎI CẦN HOẶC TRONG NGUỒN CÓ:
  + Bảng biến thiên: BẮT BUỘC nhúng khối mã LaTeX array MathJax:
    $\\begin{array}{c|ccccc} x & -\\infty & & x_0 & & +\\infty \\\\ \\hline y' & & + & 0 & - & \\\\ \\hline y & & & y_{CĐ} & & \\\\ & & \\nearrow & & \\searrow & \\\\ & -\\infty & & & & -\\infty \\end{array}$
  + Bảng số liệu / thống kê ghép nhóm: BẮT BUỘC nhúng bảng HTML table có viền rõ ràng:
    <table class="w-full max-w-md mx-auto my-2 border-collapse border border-slate-300 text-xs text-center"><tr class="bg-sky-100 font-bold"><th class="border border-slate-300 p-1">Nhóm</th><th class="border border-slate-300 p-1">Tần số</th></tr><tr><td class="border border-slate-300 p-1">[10; 20)</td><td class="border border-slate-300 p-1">15</td></tr></table>
  + Đồ thị Oxy & Hình học không gian 3D: BẮT BUỘC nhúng trực tiếp khối mã SVG vector:
    <svg class="mx-auto my-3 block max-w-full" viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg">...</svg>
    (Nét liền cho cạnh thấy, nét đứt stroke-dasharray="5,5" cho cạnh khuất đáy, nhãn đỉnh chữ in hoa rõ ràng).
- Chỉ trả về nội dung câu hỏi và đáp án theo đúng định dạng mẫu trên, không thêm trích dẫn nguồn hay văn bản chào hỏi.`;
            } else {
                prompt = `Bạn là chuyên gia khảo thí và biên soạn câu hỏi môn Toán THPT theo Chương trình GDPT 2018 (Bộ sách Kết nối tri thức với cuộc sống).

NHIỆM VỤ: Hãy biên soạn bộ câu hỏi luyện tập đánh giá năng lực Toán học lớp ${grade} ${topic ? `thuộc chủ đề: "${topic}"` : ''} mức độ chủ đạo: "${level}".
${rawText.trim() ? `\nKIẾN THỨC / LÝ THUYẾT TRỌNG TÂM CẦN BÁM SÁT:\n"""\n${rawText.trim()}\n"""\n` : ''}
YÊU CẦU CẤU TRÚC ĐỀ THI (CHUẨN ĐỊNH DẠNG BGD 2025):
1. PHẦN I (${numMC} câu Trắc nghiệm 4 lựa chọn A, B, C, D):
Mỗi câu có 4 phương án A, B, C, D; kèm theo dòng 'Đáp án: [A/B/C/D]' và 'Lời giải: [Chi tiết]'.
Ví dụ:
Câu 1: [Đề bài câu hỏi]
A. [Phương án A]
B. [Phương án B]
C. [Phương án C]
D. [Phương án D]
Đáp án: A
Lời giải: [Các bước giải chi tiết]

2. PHẦN II (${numTF} câu Trắc nghiệm Đúng / Sai):
Mỗi câu có 1 ngữ cảnh chung và 4 ý phát biểu a), b), c), d). Ở cuối mỗi ý ghi rõ (Đúng) hoặc (Sai); kèm theo dòng 'Lời giải: [Chi tiết từng ý]'.
Ví dụ:
Câu 2: [Đề bài chung]
a) [Phát biểu ý a] (Đúng)
b) [Phát biểu ý b] (Sai)
c) [Phát biểu ý c] (Đúng)
d) [Phát biểu ý d] (Sai)
Lời giải: [Lời giải chi tiết cho 4 ý a, b, c, d]

3. PHẦN III (${numSA} câu Trắc nghiệm Trả lời ngắn):
Mỗi câu hỏi yêu cầu học sinh tính toán ra kết quả là số hoặc biểu thức; kèm theo dòng 'Đáp án: [Kết quả]' và 'Lời giải: [Chi tiết]'.
Ví dụ:
Câu 3: [Đề bài câu hỏi]
Đáp án: 5
Lời giải: [Các bước giải chi tiết]

QUY CHUẨN TRÌNH BÀY & TRỰC QUAN HÓA TOÁN HỌC:
- Tất cả công thức toán học BẮT BUỘC đặt trong cặp dấu đô la $...$ (chuẩn LaTeX).
- ★ BẮT BUỘC VẼ BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHI CÂU HỎI CẦN HOẶC TRONG NGUỒN CÓ:
  + Bảng biến thiên: Nhúng mã LaTeX array MathJax ($\\begin{array}...\\end{array}$).
  + Bảng dữ liệu / thống kê: Nhúng bảng HTML table (<table class="...">...</table>).
  + Đồ thị Oxy / Hình không gian: Nhúng mã vector SVG (<svg ...>...</svg>).
- Chỉ trả về nội dung đề thi và đáp án theo đúng định dạng mẫu trên, không giải thích dài dòng ở đầu hoặc cuối.`;
            }

            let textarea = document.getElementById('bank-ai-generated-prompt');
            if (textarea) textarea.value = prompt;
        }

        function copyBankAiPrompt() {
            let textarea = document.getElementById('bank-ai-generated-prompt');
            if (!textarea || !textarea.value) return;
            navigator.clipboard.writeText(textarea.value).then(() => {
                showToast("Đã sao chép câu lệnh Prompt thành công! Hãy dán vào Gemini hoặc ChatGPT.");
            }).catch(() => {
                textarea.select();
                document.execCommand('copy');
                showToast("Đã sao chép prompt!");
            });
        }

        function initBankPasteTab() {
            let gradeSelect = document.getElementById('bank-paste-grade');
            let topicSelect = document.getElementById('bank-paste-topic');
            if (!gradeSelect || !topicSelect) return;
            let g = gradeSelect.value || '12';
            topicSelect.innerHTML = `<option value="">-- Tự động nhận diện hoặc chọn --</option>` + buildMatrixTopicOptions(g);
            gradeSelect.onchange = () => {
                topicSelect.innerHTML = `<option value="">-- Tự động nhận diện hoặc chọn --</option>` + buildMatrixTopicOptions(gradeSelect.value);
            };
        }

        function initBankSingleTab() {
            let g = document.getElementById('bank-single-grade')?.value || '12';
            onBankSingleGradeChange(g);
            onBankSingleTypeChange(document.getElementById('bank-single-type')?.value || 'MC');
        }

        function onBankSingleGradeChange(grade) {
            let topicSelect = document.getElementById('bank-single-topic');
            if (!topicSelect) return;
            topicSelect.innerHTML = buildMatrixTopicOptions(grade);
        }

        function onBankSingleTypeChange(type) {
            let container = document.getElementById('bank-single-dynamic-inputs');
            if (!container) return;

            if (type === 'MC') {
                container.innerHTML = `
                <div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label class="block text-xs font-black text-slate-700">4 Phương án lựa chọn (Tick chọn đáp án đúng):</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${['A', 'B', 'C', 'D'].map((opt, idx) => `
                        <div class="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                            <input type="radio" name="bank-single-mc-ans" value="${opt}" ${idx===0?'checked':''} class="w-4 h-4 text-emerald-600">
                            <b class="text-xs text-blue-600 shrink-0">${opt}.</b>
                            <input type="text" id="bank-single-opt-${idx+1}" placeholder="Nội dung lựa chọn ${opt}" class="w-full text-xs outline-none bg-transparent font-medium">
                        </div>`).join('')}
                    </div>
                </div>`;
            } else if (type === 'TF') {
                container.innerHTML = `
                <div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label class="block text-xs font-black text-slate-700">4 Ý phát biểu và Đáp án Đúng/Sai:</label>
                    <div class="space-y-2">
                        ${['a', 'b', 'c', 'd'].map((stmt, idx) => `
                        <div class="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                            <b class="text-xs text-emerald-700 shrink-0 w-6">${stmt})</b>
                            <input type="text" id="bank-single-tf-stmt-${idx+1}" placeholder="Nội dung ý ${stmt}..." class="w-full text-xs outline-none bg-transparent font-medium">
                            <select id="bank-single-tf-ans-${idx+1}" class="p-1 px-2 border border-slate-200 rounded-lg text-xs font-bold outline-none shrink-0 bg-slate-50">
                                <option value="Đ">Đúng (Đ)</option>
                                <option value="S">Sai (S)</option>
                            </select>
                        </div>`).join('')}
                    </div>
                </div>`;
            } else if (type === 'SA') {
                container.innerHTML = `
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label class="block text-xs font-black text-slate-700 mb-1">Đáp án chính xác (Số hoặc biểu thức rút gọn):</label>
                    <input type="text" id="bank-single-sa-ans" placeholder="Ví dụ: 5 hoặc -3/2 hoặc 2.5..." class="w-full p-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-black text-emerald-700 outline-none focus:border-emerald-500">
                </div>`;
            }
        }

        function parseRawTextToBankQuestions(rawText, defaultGrade, defaultTopic, defaultLevel) {
            let questions = [];
            if (!rawText || !rawText.trim()) return questions;

            // Resilient splitting:
            // Matches: "Câu 1:", "Câu 1.", "Bài 1:", "1.", "1)", "1/", "BT 1:", "Ví dụ 1:"
            let splitRegex = /(?:^|\n)(?=(?:(?:Câu|Bài|Ví dụ|Dạng|BT)\s*\d+|\d+[\.\)\/])[\.:\s\-])/i;
            let blocks = rawText.split(splitRegex).map(b => b.trim()).filter(b => b.length > 0);

            // Fallback: if only 1 block or no numbered questions, check if double newlines separate multiple MC/TF questions
            if (blocks.length <= 1) {
                let doubleNewlineBlocks = rawText.split(/\n\s*\n+/).map(b => b.trim()).filter(b => b.length > 0);
                if (doubleNewlineBlocks.length > 1) {
                    blocks = doubleNewlineBlocks;
                } else {
                    blocks = [rawText.trim()];
                }
            }

            blocks.forEach((block, bIdx) => {
                let text = block.trim();
                if (!text) return;

                let type = 'MC';
                let opt1 = '', opt2 = '', opt3 = '', opt4 = '';
                let answer = 'A';
                let explain = '';

                let explainMatch = text.match(/(?:Lời giải|Hướng dẫn giải|Giải chi tiết|HDG|Giải)[\.:\s]*([\s\S]*)$/i);
                if (explainMatch) {
                    explain = explainMatch[1].trim();
                    text = text.substring(0, explainMatch.index).trim();
                }

                // Case-sensitive check to distinguish uppercase MCQ (A, B, C, D) vs lowercase True/False (a, b, c, d)
                let hasMC = /(?:^|\n|\s)[A-D][\)\.\:]\s*/.test(text) && /(?:^|\n|\s)B[\)\.\:]/.test(text);
                let hasTF = /(?:^|\n|\s)[a-d][\)\.\:]\s*/.test(text) && /(?:^|\n|\s)b[\)\.\:]/.test(text);

                let qId = `Q${defaultGrade}_${hasMC ? 'MC' : hasTF ? 'TF' : 'SA'}_${String(bIdx + 1).padStart(3, '0')}`;

                if (hasMC) {
                    type = 'MC';
                    let mcMatch = text.match(/([\s\S]*?)(?:^|\n|\s)A[\)\.\:]([\s\S]*?)(?:^|\n|\s)B[\)\.\:]([\s\S]*?)(?:^|\n|\s)C[\)\.\:]([\s\S]*?)(?:^|\n|\s)D[\)\.\:]([\s\S]*)$/s);
                    if (mcMatch) {
                        let qText = stripQuestionPrefix(mcMatch[1].trim());
                        opt1 = mcMatch[2].trim();
                        opt2 = mcMatch[3].trim();
                        opt3 = mcMatch[4].trim();
                        opt4 = mcMatch[5].trim();

                        let ansLineMatch = opt4.match(/(?:^|\n)(?:Đáp án|Chọn|Key|Lời giải|HDG)[\.:\s]*([^\n]*)/i);
                        if (ansLineMatch) {
                            opt4 = opt4.substring(0, ansLineMatch.index).trim();
                        }

                        let ansMatch = (explain + ' ' + text).match(/(?:Đáp án|Chọn|Key)\s*[:\s]*([A-D])\b/i);
                        if (ansMatch) answer = ansMatch[1].toUpperCase();

                        let detectedTopic = defaultTopic;
                        if (!detectedTopic && typeof findBestKNTTTopicForQuestion === 'function') {
                            detectedTopic = findBestKNTTTopicForQuestion(qText + ' ' + explain, defaultGrade);
                        }

                        questions.push({
                            id: qId,
                            grade: defaultGrade,
                            topic: detectedTopic || `[KNTT] Lớp ${defaultGrade} - Chủ đề chung`,
                            type: 'MC',
                            level: defaultLevel,
                            question: qText || 'Đề bài câu hỏi',
                            opt1, opt2, opt3, opt4,
                            answer,
                            explain,
                            selected: true
                        });
                        return;
                    }
                } else if (hasTF) {
                    type = 'TF';
                    let tfMatch = text.match(/([\s\S]*?)(?:^|\n|\s)a[\)\.\:]([\s\S]*?)(?:^|\n|\s)b[\)\.\:]([\s\S]*?)(?:^|\n|\s)c[\)\.\:]([\s\S]*?)(?:^|\n|\s)d[\)\.\:]([\s\S]*)$/s);
                    if (tfMatch) {
                        let qText = stripQuestionPrefix(tfMatch[1].trim());
                        opt1 = tfMatch[2].trim();
                        opt2 = tfMatch[3].trim();
                        opt3 = tfMatch[4].trim();
                        opt4 = tfMatch[5].trim();

                        let ansLineMatch = opt4.match(/(?:^|\n)(?:Lời giải|HDG|Hướng dẫn)[\.:\s]*([^\n]*)/i);
                        if (ansLineMatch) {
                            opt4 = opt4.substring(0, ansLineMatch.index).trim();
                        }
                        
                        let ansArr = ['Đ', 'S', 'Đ', 'S'];
                        [opt1, opt2, opt3, opt4].forEach((opt, idx) => {
                            if (/\b(?:Đ|Đúng|True|T)\b/i.test(opt)) ansArr[idx] = 'Đ';
                            else if (/\b(?:S|Sai|False|F)\b/i.test(opt)) ansArr[idx] = 'S';
                        });
                        answer = ansArr.join('');

                        let detectedTopic = defaultTopic;
                        if (!detectedTopic && typeof findBestKNTTTopicForQuestion === 'function') {
                            detectedTopic = findBestKNTTTopicForQuestion(qText + ' ' + explain, defaultGrade);
                        }

                        questions.push({
                            id: qId,
                            grade: defaultGrade,
                            topic: detectedTopic || `[KNTT] Lớp ${defaultGrade} - Chủ đề chung`,
                            type: 'TF',
                            level: defaultLevel,
                            question: qText || 'Đề bài câu hỏi Đúng/Sai',
                            opt1, opt2, opt3, opt4,
                            answer,
                            explain,
                            selected: true
                        });
                        return;
                    }
                }

                let saAnsMatch = text.match(/(?:Đáp án|Kết quả|Đáp số|Ans)[\.:\s]*([^\n]+)/i);
                if (saAnsMatch) {
                    answer = saAnsMatch[1].trim();
                    text = text.replace(saAnsMatch[0], '').trim();
                }

                let qText = stripQuestionPrefix(text);
                let detectedTopic = defaultTopic;
                if (!detectedTopic && typeof findBestKNTTTopicForQuestion === 'function') {
                    detectedTopic = findBestKNTTTopicForQuestion(qText + ' ' + explain, defaultGrade);
                }

                if (qText) {
                    questions.push({
                        id: qId,
                        grade: defaultGrade,
                        topic: detectedTopic || `[KNTT] Lớp ${defaultGrade} - Chủ đề chung`,
                        type: 'SA',
                        level: defaultLevel,
                        question: qText,
                        opt1: '', opt2: '', opt3: '', opt4: '',
                        answer: answer || '',
                        explain,
                        selected: true
                    });
                }
            });

            return questions;
        }

        async function executeBankImportAction() {
            let btn = document.getElementById('btn-submit-bank-import');
            let oldText = btn ? btn.innerHTML : '';
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> ĐANG ĐỒNG BỘ VÀO SUPABASE & SHEET...';
                btn.disabled = true;
            }

            try {
                if (currentBankImportTab === 'paste') {
                    // Paste tab: Parse questions and send to Staging area for review!
                    let rawText = document.getElementById('bank-paste-raw-text')?.value || '';
                    if (!rawText.trim()) throw new Error("Vui lòng dán nội dung câu hỏi!");

                    let pasteGrade = document.getElementById('bank-paste-grade')?.value || '12';
                    let pasteTopic = document.getElementById('bank-paste-topic')?.value || '';
                    let pasteLevel = document.getElementById('bank-paste-level')?.value || 'Thông hiểu';

                    let parsed = parseRawTextToBankQuestions(rawText, pasteGrade, pasteTopic, pasteLevel);
                    if (parsed.length === 0) {
                        openBankAiPromptModal();
                        throw new Error("Nội dung vừa dán là kiến thức/lý thuyết thô. Hệ thống đã tự động tạo Prompt AI để Thầy/Cô sinh bộ câu hỏi!");
                    }

                    window.bankStagingQuestions = parsed;
                    switchBankImportTab('current', true);
                    showToast(`Đã bóc tách thành công ${parsed.length} câu hỏi vào bàn soát duyệt!`);
                    return;
                }

                let approvedQuestions = [];

                if (currentBankImportTab === 'current') {
                    approvedQuestions = (window.bankStagingQuestions || []).filter(q => q.selected && q.question && q.question.trim());
                } else if (currentBankImportTab === 'single') {
                    let grade = document.getElementById('bank-single-grade')?.value || '12';
                    let topic = document.getElementById('bank-single-topic')?.value || `[KNTT] Lớp ${grade} - Chủ đề chung`;
                    let level = document.getElementById('bank-single-level')?.value || 'Thông hiểu';
                    let type = document.getElementById('bank-single-type')?.value || 'MC';
                    let question = document.getElementById('bank-single-question')?.value || '';
                    let explain = document.getElementById('bank-single-explain')?.value || '';

                    if (!question.trim()) throw new Error("Vui lòng nhập đề bài câu hỏi!");

                    let qItem = {
                        id: `Q${grade}_${type}_${Date.now().toString().slice(-4)}`,
                        grade,
                        topic,
                        level,
                        type,
                        question,
                        explain,
                        createdAt: new Date().toISOString()
                    };

                    if (type === 'MC') {
                        qItem.opt1 = document.getElementById('bank-single-opt-1')?.value || '';
                        qItem.opt2 = document.getElementById('bank-single-opt-2')?.value || '';
                        qItem.opt3 = document.getElementById('bank-single-opt-3')?.value || '';
                        qItem.opt4 = document.getElementById('bank-single-opt-4')?.value || '';
                        let checkedRadio = document.querySelector('input[name="bank-single-mc-ans"]:checked');
                        qItem.answer = checkedRadio ? checkedRadio.value : 'A';
                    } else if (type === 'TF') {
                        qItem.opt1 = document.getElementById('bank-single-tf-stmt-1')?.value || '';
                        qItem.opt2 = document.getElementById('bank-single-tf-stmt-2')?.value || '';
                        qItem.opt3 = document.getElementById('bank-single-tf-stmt-3')?.value || '';
                        qItem.opt4 = document.getElementById('bank-single-tf-stmt-4')?.value || '';
                        let a1 = document.getElementById('bank-single-tf-ans-1')?.value || 'Đ';
                        let a2 = document.getElementById('bank-single-tf-ans-2')?.value || 'S';
                        let a3 = document.getElementById('bank-single-tf-ans-3')?.value || 'Đ';
                        let a4 = document.getElementById('bank-single-tf-ans-4')?.value || 'S';
                        qItem.answer = `${a1}${a2}${a3}${a4}`;
                    } else if (type === 'SA') {
                        qItem.opt1 = ''; qItem.opt2 = ''; qItem.opt3 = ''; qItem.opt4 = '';
                        qItem.answer = document.getElementById('bank-single-sa-ans')?.value || '';
                    }

                    approvedQuestions.push(qItem);
                }

                if (approvedQuestions.length === 0) {
                    throw new Error("Không có câu hỏi nào được chọn để nạp vào ngân hàng!");
                }

                await saveQuestionsToBankStorage(approvedQuestions);

                showToast(`Đã nạp thành công ${approvedQuestions.length} câu hỏi vào Supabase & Google Sheet!`);
                
                // Clear staging
                window.bankStagingQuestions = [];

                // Refresh UI
                window.matrixTopicOptions = buildMatrixTopicOptions(currentMatrixGrade);
                updateMatrixUI();

                let badge = document.getElementById('bank-total-count-badge');
                if (badge) badge.innerText = globalQuestionBank.length;

                let matrixBadge = document.getElementById('matrix-bank-count');
                if (matrixBadge) matrixBadge.innerText = globalQuestionBank.length;

                switchBankImportTab('browse');
            } catch(e) {
                showToast(e.message || "Lỗi nạp câu hỏi", true);
            } finally {
                if (btn) {
                    btn.innerHTML = oldText;
                    btn.disabled = false;
                }
            }
        }

        async function saveQuestionsToBankStorage(questionsList) {
            if (!Array.isArray(questionsList) || questionsList.length === 0) return;

            // 1. Sync to Supabase (Primary storage for Question Bank)
            if (typeof SupabaseQuestionBankService !== 'undefined') {
                try {
                    await SupabaseQuestionBankService.saveBatch(questionsList);
                } catch(se) {
                    console.warn("Supabase saveBatch warning:", se);
                }
            }

            // 2. Sync to Google Apps Script / Google Sheet
            try {
                if (typeof GOOGLE_WEB_APP_URL !== 'undefined') {
                    let payload = {
                        action: "addBankQuestions",
                        sheetId: typeof GOOGLE_SHEET_BANK_ID !== 'undefined' ? GOOGLE_SHEET_BANK_ID : "1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI",
                        questions: questionsList
                    };
                    fetch(GOOGLE_WEB_APP_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(payload)
                    }).catch(err => console.warn("Google Apps Script bank dispatch:", err));
                }
            } catch(e) {}

            // 3. Update in-memory globalQuestionBank & local cache
            if (!Array.isArray(globalQuestionBank)) globalQuestionBank = [];
            questionsList.forEach(q => {
                let existingIdx = globalQuestionBank.findIndex(item => item.id && item.id === q.id);
                if (existingIdx !== -1) {
                    globalQuestionBank[existingIdx] = q;
                } else {
                    globalQuestionBank.unshift(q);
                }
            });

            try {
                localStorage.setItem('tbs_question_bank_cache', JSON.stringify(globalQuestionBank));
            } catch(e) {}
        }

        function renderBankBrowserQuestions() {
            filterBankBrowserQuestions();
        }

        function copyBankQuestionId(id) {
            if (!id) return;
            navigator.clipboard.writeText(id).then(() => {
                showToast(`Đã sao chép mã ID: ${id}`);
            }).catch(() => {
                showToast(`Mã ID: ${id}`);
            });
        }

        function insertSingleBankQuestionToExam(id) {
            let q = (globalQuestionBank || []).find(item => String(item.id) === String(id));
            if (!q) return showToast("Không tìm thấy câu hỏi trong ngân hàng!", true);

            if (!adminState.data) {
                adminState.data = { round1: [], round2: [], round3: [] };
            }
            if (!Array.isArray(adminState.data.round1)) adminState.data.round1 = [];
            if (!Array.isArray(adminState.data.round2)) adminState.data.round2 = [];
            if (!Array.isArray(adminState.data.round3)) adminState.data.round3 = [];

            let qType = String(q.type || 'MC').toUpperCase();

            if (qType === 'MC') {
                let newId = adminState.data.round1.length + 1;
                adminState.data.round1.push({
                    id: newId,
                    bankId: q.id,
                    text: q.question || '',
                    options: [q.opt1, q.opt2, q.opt3, q.opt4].filter(Boolean),
                    answer: q.answer || 'A',
                    explanation: q.explain || '',
                    points: 25
                });
                showToast(`Đã chèn câu hỏi [${q.id}] vào Phần I (MCQ) Câu ${newId}!`);
            } else if (qType === 'TF') {
                let newId = adminState.data.round2.length + 1;
                let aStr = String(q.answer || "").toUpperCase().replace(/[^TFDĐS]/g, '');
                let aArr = aStr.split('');
                while (aArr.length < 4) aArr.push('S');
                adminState.data.round2.push({
                    id: newId,
                    bankId: q.id,
                    text: q.question || '',
                    statements: [
                        { label: "a", text: q.opt1 || "", isTrue: (aArr[0] === 'T' || aArr[0] === 'Đ'), points: 25 },
                        { label: "b", text: q.opt2 || "", isTrue: (aArr[1] === 'T' || aArr[1] === 'Đ'), points: 25 },
                        { label: "c", text: q.opt3 || "", isTrue: (aArr[2] === 'T' || aArr[2] === 'Đ'), points: 25 },
                        { label: "d", text: q.opt4 || "", isTrue: (aArr[3] === 'T' || aArr[3] === 'Đ'), points: 25 }
                    ],
                    explanation: q.explain || ''
                });
                showToast(`Đã chèn câu hỏi [${q.id}] vào Phần II (Đúng/Sai) Câu ${newId}!`);
            } else if (qType === 'SA') {
                let newId = adminState.data.round3.length + 1;
                adminState.data.round3.push({
                    id: newId,
                    bankId: q.id,
                    text: q.question || '',
                    answer: q.answer || '',
                    explanation: q.explain || '',
                    points: 100
                });
                showToast(`Đã chèn câu hỏi [${q.id}] vào Phần III (Trả lời ngắn) Câu ${newId}!`);
            }

            GAME_DATA = JSON.parse(JSON.stringify(adminState.data));
            if (typeof renderAdminQuestionsList === 'function') {
                renderAdminQuestionsList();
            }
        }

        function insertBankQuestionsByIds() {
            let inputEl = document.getElementById('bank-pick-by-ids-input');
            let rawStr = inputEl ? inputEl.value.trim() : '';
            if (!rawStr) return showToast("Vui lòng nhập ít nhất một mã ID câu hỏi!", true);

            let idList = rawStr.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
            if (idList.length === 0) return showToast("Không nhận diện được mã ID hợp lệ!", true);

            let addedCount = 0;
            let missingIds = [];

            idList.forEach(id => {
                let q = (globalQuestionBank || []).find(item => String(item.id).toLowerCase() === id.toLowerCase());
                if (q) {
                    insertSingleBankQuestionToExam(q.id);
                    addedCount++;
                } else {
                    missingIds.push(id);
                }
            });

            if (addedCount > 0) {
                showToast(`Đã bốc thành công ${addedCount} câu hỏi theo mã ID vào đề thi đang soạn!`);
            }
            if (missingIds.length > 0) {
                showToast(`Không tìm thấy ${missingIds.length} mã ID: ${missingIds.slice(0, 3).join(', ')}${missingIds.length > 3 ? '...' : ''}`, true);
            }
        }

        function filterBankBrowserQuestions() {
            let container = document.getElementById('bank-browse-list');
            if (!container) return;

            let search = (document.getElementById('bank-browse-search')?.value || '').toLowerCase().trim();
            let grade = document.getElementById('bank-browse-grade')?.value || 'all';
            let type = document.getElementById('bank-browse-type')?.value || 'all';
            let level = document.getElementById('bank-browse-level')?.value || 'all';

            let pool = Array.isArray(globalQuestionBank) ? globalQuestionBank : [];
            let filtered = pool.filter(q => {
                if (grade !== 'all' && String(q.grade || '').trim() !== grade) return false;
                if (type !== 'all' && String(q.type || '').trim().toUpperCase() !== type) return false;
                if (level !== 'all' && String(q.level || '').trim().toLowerCase() !== level.toLowerCase()) return false;
                if (search) {
                    let qId = String(q.id || '').toLowerCase();
                    // If search matches ID exactly or partly
                    if (qId.includes(search)) return true;
                    // Or search is a list of comma/space separated IDs
                    let searchTokens = search.split(/[\s,;]+/).filter(Boolean);
                    if (searchTokens.some(tok => qId.includes(tok))) return true;

                    let full = ((q.question || '') + ' ' + (q.topic || '') + ' ' + (q.explain || '')).toLowerCase();
                    if (!full.includes(search)) return false;
                }
                return true;
            });

            let badge = document.getElementById('bank-total-count-badge');
            if (badge) badge.innerText = pool.length;

            if (filtered.length === 0) {
                container.innerHTML = `
                <div class="text-center py-12 bg-white rounded-2xl border-2 border-slate-200">
                    <i class="fa-solid fa-magnifying-glass text-4xl text-slate-300 mb-3 block"></i>
                    <p class="font-bold text-slate-500 text-sm">Không tìm thấy câu hỏi nào phù hợp với mã ID hoặc bộ lọc.</p>
                </div>`;
                return;
            }

            container.innerHTML = filtered.slice(0, 100).map((q, idx) => {
                let typeBadge = q.type === 'MC' 
                    ? `<span class="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md">Phần I: MCQ</span>`
                    : q.type === 'TF'
                    ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">Phần II: Đúng/Sai</span>`
                    : `<span class="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md">Phần III: TL Ngắn</span>`;

                let qIdDisplay = q.id || ('#Q' + (idx+1));

                return `
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2 flex-wrap">
                            <button onclick="copyBankQuestionId('${q.id}')" class="font-mono font-black text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition shadow-2xs" title="Bấm để sao chép mã ID này">
                                <i class="fa-regular fa-copy text-[10px] text-indigo-500"></i> ${qIdDisplay}
                            </button>
                            ${typeBadge}
                            <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">${q.level || 'Thông hiểu'}</span>
                            <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Lớp ${q.grade || '12'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-sky-700 truncate max-w-xs hidden sm:inline">${q.topic || 'Chung'}</span>
                            <button onclick="insertSingleBankQuestionToExam('${q.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-xs" title="Chèn ngay câu hỏi này vào đề đang mở">
                                <i class="fa-solid fa-plus text-[10px]"></i> Chèn vào đề
                            </button>
                            <button onclick="openEditBankQuestionModal('${q.id}')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-lg text-xs transition flex items-center gap-1" title="Chỉnh sửa câu hỏi này">
                                <i class="fa-solid fa-pen text-[10px]"></i> Sửa
                            </button>
                            ${isCurrentUserSuperAdmin() ? `
                            <button onclick="confirmDeleteBankQuestion('${q.id}')" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 font-bold rounded-lg text-xs transition flex items-center gap-1" title="Xóa vĩnh viễn khỏi Ngân hàng">
                                <i class="fa-solid fa-trash-can text-[10px]"></i> Xóa
                            </button>` : ''}
                        </div>
                    </div>
                    <div class="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        ${sanitizeMathText(q.question || '')}
                    </div>
                    ${q.type === 'MC' && (q.opt1 || q.opt2) ? `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        <div class="p-2 rounded-lg ${q.answer==='A'?'bg-emerald-50 font-bold border border-emerald-300 text-emerald-800':'bg-slate-50'}"><b>A.</b> ${sanitizeMathText(q.opt1||'')}</div>
                        <div class="p-2 rounded-lg ${q.answer==='B'?'bg-emerald-50 font-bold border border-emerald-300 text-emerald-800':'bg-slate-50'}"><b>B.</b> ${sanitizeMathText(q.opt2||'')}</div>
                        <div class="p-2 rounded-lg ${q.answer==='C'?'bg-emerald-50 font-bold border border-emerald-300 text-emerald-800':'bg-slate-50'}"><b>C.</b> ${sanitizeMathText(q.opt3||'')}</div>
                        <div class="p-2 rounded-lg ${q.answer==='D'?'bg-emerald-50 font-bold border border-emerald-300 text-emerald-800':'bg-slate-50'}"><b>D.</b> ${sanitizeMathText(q.opt4||'')}</div>
                    </div>` : ''}
                    ${q.type === 'TF' && (q.opt1 || q.opt2) ? `
                    <div class="space-y-1.5 text-xs text-slate-700">
                        <div class="p-2 bg-slate-50 rounded-lg flex justify-between"><span><b>a)</b> ${sanitizeMathText(q.opt1||'')}</span><b class="text-emerald-700">${(q.answer||'')[0]||'Đ'}</b></div>
                        <div class="p-2 bg-slate-50 rounded-lg flex justify-between"><span><b>b)</b> ${sanitizeMathText(q.opt2||'')}</span><b class="text-emerald-700">${(q.answer||'')[1]||'S'}</b></div>
                        <div class="p-2 bg-slate-50 rounded-lg flex justify-between"><span><b>c)</b> ${sanitizeMathText(q.opt3||'')}</span><b class="text-emerald-700">${(q.answer||'')[2]||'Đ'}</b></div>
                        <div class="p-2 bg-slate-50 rounded-lg flex justify-between"><span><b>d)</b> ${sanitizeMathText(q.opt4||'')}</span><b class="text-emerald-700">${(q.answer||'')[3]||'S'}</b></div>
                    </div>` : ''}
                    ${q.type === 'SA' ? `<div class="text-xs font-black text-emerald-700">Đáp án: ${sanitizeMathText(q.answer||'')}</div>` : ''}
                    ${q.explain ? `<div class="text-xs text-slate-500 bg-amber-50/50 p-2 rounded-lg border-l-2 border-amber-400"><b>Lời giải:</b> ${sanitizeMathText(q.explain)}</div>` : ''}
                </div>`;
            }).join('');

            triggerMathJax();
        }

        async function refreshQuestionBankSheet() {
            showToast("Đang tải lại dữ liệu từ Supabase & Google Sheet...");
            await renderQuestionBankSheet();
            showToast(`Đã làm tươi kho! Hiện có ${globalQuestionBank.length} câu hỏi.`);
        }

        // ==================== MODAL CHỈNH SỬA CÂU HỎI TRONG NGÂN HÀNG ====================
        let currentEditingBankQ = null;

        function openEditBankQuestionModal(id) {
            let q = (globalQuestionBank || []).find(item => String(item.id) === String(id));
            if (!q) return showToast("Không tìm thấy câu hỏi để sửa!", true);

            currentEditingBankQ = JSON.parse(JSON.stringify(q));
            let modal = document.getElementById('edit-bank-question-modal');
            if (!modal) return;

            document.getElementById('edit-bank-q-orig-id').value = q.id || '';
            document.getElementById('edit-bank-q-id').value = q.id || '';
            document.getElementById('edit-bank-q-grade').value = q.grade || '12';
            document.getElementById('edit-bank-q-type').value = q.type || 'MC';
            document.getElementById('edit-bank-q-level').value = q.level || 'Thông hiểu';
            document.getElementById('edit-bank-q-text').value = q.question || '';
            document.getElementById('edit-bank-q-explain').value = q.explain || '';

            onEditBankGradeChange(q.grade || '12', q.topic);
            onEditBankTypeChange(q.type || 'MC', q);

            modal.classList.remove('hidden');
        }

        function closeEditBankQuestionModal() {
            let modal = document.getElementById('edit-bank-question-modal');
            if (modal) modal.classList.add('hidden');
            currentEditingBankQ = null;
        }

        function onEditBankGradeChange(grade, selectedTopic) {
            let topicSelect = document.getElementById('edit-bank-q-topic');
            if (!topicSelect) return;
            topicSelect.innerHTML = buildMatrixTopicOptions(grade);
            if (selectedTopic) topicSelect.value = selectedTopic;
        }

        function onEditBankTypeChange(type, existingData) {
            let container = document.getElementById('edit-bank-dynamic-inputs');
            if (!container) return;

            let data = existingData || currentEditingBankQ || {};

            if (type === 'MC') {
                container.innerHTML = `
                <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-700">4 Phương án lựa chọn (Chọn đáp án đúng):</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${['A', 'B', 'C', 'D'].map((opt, idx) => `
                        <div class="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <input type="radio" name="edit-bank-mc-ans" value="${opt}" ${data.answer===opt?'checked':''} class="w-4 h-4 text-indigo-600">
                            <b class="text-xs text-blue-600 shrink-0">${opt}.</b>
                            <input type="text" id="edit-bank-opt-${idx+1}" value="${data['opt'+(idx+1)] || ''}" placeholder="Phương án ${opt}" class="w-full text-xs outline-none bg-transparent">
                        </div>`).join('')}
                    </div>
                </div>`;
            } else if (type === 'TF') {
                container.innerHTML = `
                <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-700">4 Ý phát biểu và Đáp án Đúng/Sai:</label>
                    <div class="space-y-2">
                        ${['a', 'b', 'c', 'd'].map((stmt, idx) => {
                            let ansVal = (data.answer && data.answer[idx]) ? data.answer[idx] : 'Đ';
                            return `
                            <div class="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                <b class="text-xs text-emerald-700 shrink-0 w-6">${stmt})</b>
                                <input type="text" id="edit-bank-tf-stmt-${idx+1}" value="${data['opt'+(idx+1)] || ''}" placeholder="Ý ${stmt}..." class="w-full text-xs outline-none bg-transparent">
                                <select id="edit-bank-tf-ans-${idx+1}" class="p-1 px-2 border border-slate-200 rounded-lg text-xs font-bold outline-none bg-white">
                                    <option value="Đ" ${ansVal==='Đ'?'selected':''}>Đúng</option>
                                    <option value="S" ${ansVal==='S'?'selected':''}>Sai</option>
                                </select>
                            </div>`;
                        }).join('')}
                    </div>
                </div>`;
            } else if (type === 'SA') {
                container.innerHTML = `
                <div>
                    <label class="block text-xs font-black text-slate-700 mb-1">Đáp án chính xác:</label>
                    <input type="text" id="edit-bank-sa-ans" value="${data.answer || ''}" placeholder="Kết quả ngắn..." class="w-full p-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-black text-emerald-700 outline-none focus:border-indigo-500">
                </div>`;
            }
        }

        async function confirmSaveEditedBankQuestion() {
            let origId = document.getElementById('edit-bank-q-orig-id')?.value;
            let newId = document.getElementById('edit-bank-q-id')?.value || origId;
            let grade = document.getElementById('edit-bank-q-grade')?.value || '12';
            let topic = document.getElementById('edit-bank-q-topic')?.value || `[KNTT] Lớp ${grade} - Chủ đề chung`;
            let type = document.getElementById('edit-bank-q-type')?.value || 'MC';
            let level = document.getElementById('edit-bank-q-level')?.value || 'Thông hiểu';
            let question = document.getElementById('edit-bank-q-text')?.value || '';
            let explain = document.getElementById('edit-bank-q-explain')?.value || '';

            if (!question.trim()) return showToast("Đề bài không được để trống!", true);

            let btn = document.getElementById('btn-save-edit-bank-q');
            let oldText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang lưu...';
            btn.disabled = true;

            try {
                let updatedQ = {
                    id: newId,
                    grade,
                    topic,
                    type,
                    level,
                    question,
                    explain,
                    updatedAt: new Date().toISOString()
                };

                if (type === 'MC') {
                    updatedQ.opt1 = document.getElementById('edit-bank-opt-1')?.value || '';
                    updatedQ.opt2 = document.getElementById('edit-bank-opt-2')?.value || '';
                    updatedQ.opt3 = document.getElementById('edit-bank-opt-3')?.value || '';
                    updatedQ.opt4 = document.getElementById('edit-bank-opt-4')?.value || '';
                    let radio = document.querySelector('input[name="edit-bank-mc-ans"]:checked');
                    updatedQ.answer = radio ? radio.value : 'A';
                } else if (type === 'TF') {
                    updatedQ.opt1 = document.getElementById('edit-bank-tf-stmt-1')?.value || '';
                    updatedQ.opt2 = document.getElementById('edit-bank-tf-stmt-2')?.value || '';
                    updatedQ.opt3 = document.getElementById('edit-bank-tf-stmt-3')?.value || '';
                    updatedQ.opt4 = document.getElementById('edit-bank-tf-stmt-4')?.value || '';
                    let a1 = document.getElementById('edit-bank-tf-ans-1')?.value || 'Đ';
                    let a2 = document.getElementById('edit-bank-tf-ans-2')?.value || 'S';
                    let a3 = document.getElementById('edit-bank-tf-ans-3')?.value || 'Đ';
                    let a4 = document.getElementById('edit-bank-tf-ans-4')?.value || 'S';
                    updatedQ.answer = `${a1}${a2}${a3}${a4}`;
                } else if (type === 'SA') {
                    updatedQ.opt1 = ''; updatedQ.opt2 = ''; updatedQ.opt3 = ''; updatedQ.opt4 = '';
                    updatedQ.answer = document.getElementById('edit-bank-sa-ans')?.value || '';
                }

                await saveQuestionsToBankStorage([updatedQ]);

                // If ID changed, delete old ID
                if (origId && origId !== newId && typeof SupabaseQuestionBankService !== 'undefined') {
                    SupabaseQuestionBankService.delete(origId).catch(()=>{});
                    let oldIdx = globalQuestionBank.findIndex(q => q.id === origId);
                    if (oldIdx !== -1) globalQuestionBank.splice(oldIdx, 1);
                }

                showToast("Đã cập nhật câu hỏi thành công vào Supabase & Sheet!");
                closeEditBankQuestionModal();
                filterBankBrowserQuestions();
                window.matrixTopicOptions = buildMatrixTopicOptions(currentMatrixGrade);
                updateMatrixUI();
            } catch(e) {
                showToast("Lỗi khi lưu câu hỏi: " + e.message, true);
            } finally {
                btn.innerHTML = oldText;
                btn.disabled = false;
            }
        }

        function confirmDeleteBankQuestion(id) {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền xóa câu hỏi khỏi Ngân hàng!", true);
            }
            showConfirmModal("Xóa Câu Hỏi Khỏi Ngân Hàng", `Thầy/Cô có chắc chắn muốn xóa vĩnh viễn câu hỏi [${id}] khỏi Supabase và Google Sheet?`, async () => {
                try {
                    if (typeof SupabaseQuestionBankService !== 'undefined') {
                        await SupabaseQuestionBankService.delete(id);
                    }
                    if (typeof GOOGLE_WEB_APP_URL !== 'undefined') {
                        fetch(GOOGLE_WEB_APP_URL, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                            body: JSON.stringify({ action: "deleteBankQuestion", id: id })
                        }).catch(()=>{});
                    }
                    globalQuestionBank = (globalQuestionBank || []).filter(q => String(q.id) !== String(id));
                    try {
                        localStorage.setItem('tbs_question_bank_cache', JSON.stringify(globalQuestionBank));
                    } catch(e) {}
                    showToast("Đã xóa câu hỏi khỏi Ngân hàng thành công!");
                    filterBankBrowserQuestions();
                    window.matrixTopicOptions = buildMatrixTopicOptions(currentMatrixGrade);
                    updateMatrixUI();
                } catch(e) {
                    showToast("Lỗi khi xóa câu hỏi: " + e.message, true);
                }
            });
        }

        let confirmCb = null; function showConfirmModal(title, msg, cb) { confirmCb = cb; document.getElementById('generic-confirm-title').innerText = title; document.getElementById('generic-confirm-message').innerText = msg; document.getElementById('generic-confirm-modal').classList.remove('hidden'); } function closeGenericConfirm() { document.getElementById('generic-confirm-modal').classList.add('hidden'); } function executeGenericConfirm() { if(confirmCb) confirmCb(); closeGenericConfirm(); }

        document.addEventListener('keydown', function(event) {
            const activeTag = document.activeElement.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'math-field') return;
            
            // Xử lý phím tắt khi đang mở Modal Xem Trước Câu Hỏi
            let prevModal = document.getElementById('preview-full-question-modal');
            if (prevModal && !prevModal.classList.contains('hidden')) {
                if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
                    navigatePreviewQuestion(1);
                } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
                    navigatePreviewQuestion(-1);
                } else if (event.key === 'Escape') {
                    closeFullQuestionPreviewModal();
                }
                return;
            }

            let adminModal = document.getElementById('admin-modal');
            if (adminModal && !adminModal.classList.contains('hidden')) return;

            let isLecturePresenting = document.querySelector('[onclick*="nextLectureStep"]') || document.querySelector('[title*="Slide"]') || document.getElementById('lecture-teacher-note');
            if (isLecturePresenting) {
                let lectures = (GAME_DATA && GAME_DATA.lectures) ? GAME_DATA.lectures : [];
                let curSlide = lectures[currentLectureSlideIdx] || { steps: [] };
                let totalSteps = (curSlide.steps || []).length;

                if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd' || event.code === 'Space' || event.key === 'Enter') {
                    event.preventDefault();
                    if (currentLectureStepIdx < totalSteps) {
                        nextLectureStep(currentLectureSlideIdx);
                    } else if (currentLectureSlideIdx < lectures.length - 1) {
                        renderLecturePresentation(currentLectureSlideIdx + 1, 0);
                        playSound('click');
                    }
                } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
                    event.preventDefault();
                    if (currentLectureSlideIdx > 0) {
                        renderLecturePresentation(currentLectureSlideIdx - 1, 0);
                        playSound('click');
                    }
                } else if (event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 'b') {
                    openWhiteboardWindow();
                } else if (event.key === 'Escape') {
                    renderTeacherSetupScreen();
                }
                return;
            }

            let isPresenting = document.getElementById('scoreboard') && !document.getElementById('scoreboard').classList.contains('hidden');
            
            if (isPresenting && state.currentQuestion) {
                if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
                    let nextBtn = document.getElementById('btn-next-q');
                    if (nextBtn && !nextBtn.disabled) nextBtn.click();
                }
                else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
                    let prevBtn = document.getElementById('btn-prev-q');
                    if (prevBtn && !prevBtn.disabled) prevBtn.click();
                }
                else if (event.key === 'Escape') {
                    selectRound(state.currentRound);
                }
                else if (event.key === 'Enter' && state.currentRound === 'round3') {
                    let qK = `round3_${state.currentQuestion.id}`;
                    if (!state.answeredQuestions.includes(qK)) {
                        state.answeredQuestions.push(qK);
                        openQuestion(state.currentQuestion.id);
                        triggerConfetti(); 
                        playSound('powerup');
                    }
                }
            }

            if (isPresenting && event.code === 'Space') {
                event.preventDefault(); 
                let diceBtn = document.getElementById('btn-random-picker');
                if (diceBtn && !diceBtn.disabled) diceBtn.click();
            }
        });

        // ===============================================
        // 1-CLICK EXAM IMAGE CROPPER LOGIC
        // ===============================================
        let cropState = { img: null, canvas: null, ctx: null, isDragging: false, startX: 0, startY: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 };

        function openCropModal() {
            document.getElementById('crop-image-modal').classList.remove('hidden');
            setTimeout(() => {
                let container = document.getElementById('crop-canvas-container');
                if (container) container.focus();
            }, 100);
            setupCropCanvasEvents();
        }

        function closeCropModal() {
            document.getElementById('crop-image-modal').classList.add('hidden');
        }

        function setupCropCanvasEvents() {
            let canvas = document.getElementById('crop-canvas');
            if (!canvas) return;
            
            window.removeEventListener('paste', handleCropModalPaste);
            window.addEventListener('paste', handleCropModalPaste);

            canvas.onmousedown = (e) => {
                if (!cropState.img) return;
                let rect = canvas.getBoundingClientRect();
                let scaleX = canvas.width / rect.width;
                let scaleY = canvas.height / rect.height;
                cropState.isDragging = true;
                cropState.startX = (e.clientX - rect.left) * scaleX;
                cropState.startY = (e.clientY - rect.top) * scaleY;
                cropState.cropW = 0;
                cropState.cropH = 0;
                let btn = document.getElementById('btn-do-crop');
                if (btn) { btn.disabled = true; btn.classList.add('opacity-50', 'cursor-not-allowed'); }
            };

            canvas.onmousemove = (e) => {
                if (!cropState.isDragging || !cropState.img) return;
                let rect = canvas.getBoundingClientRect();
                let scaleX = canvas.width / rect.width;
                let scaleY = canvas.height / rect.height;
                let currentX = (e.clientX - rect.left) * scaleX;
                let currentY = (e.clientY - rect.top) * scaleY;

                cropState.cropX = Math.min(cropState.startX, currentX);
                cropState.cropY = Math.min(cropState.startY, currentY);
                cropState.cropW = Math.abs(currentX - cropState.startX);
                cropState.cropH = Math.abs(currentY - cropState.startY);

                drawCropCanvas();
            };

            canvas.onmouseup = () => {
                if (!cropState.isDragging) return;
                cropState.isDragging = false;
                if (cropState.cropW > 10 && cropState.cropH > 10) {
                    let btn = document.getElementById('btn-do-crop');
                    if (btn) { btn.disabled = false; btn.classList.remove('opacity-50', 'cursor-not-allowed'); }
                }
            };
        }

        function handleCropModalPaste(e) {
            let modal = document.getElementById('crop-image-modal');
            if (!modal || modal.classList.contains('hidden')) return;
            let items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let index in items) {
                if (items[index].kind === 'file' && items[index].type.startsWith('image/')) {
                    let file = items[index].getAsFile();
                    loadCropImageFromFile(file);
                    break;
                }
            }
        }

        function loadCropImageFromFile(file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                let img = new Image();
                img.onload = () => {
                    cropState.img = img;
                    let canvas = document.getElementById('crop-canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    cropState.ctx = canvas.getContext('2d');
                    canvas.classList.remove('hidden');
                    document.getElementById('crop-placeholder').classList.add('hidden');
                    document.getElementById('crop-status-text').innerText = `Kích thước ảnh đề thi gốc: ${img.width}x${img.height}px. Hãy dùng chuột kéo khoanh vùng hình vẽ!`;
                    drawCropCanvas();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function handleCropFileSelect(e) {
            let file = e.target.files[0];
            if (file) loadCropImageFromFile(file);
        }

        function drawCropCanvas() {
            let canvas = document.getElementById('crop-canvas');
            let ctx = cropState.ctx;
            if (!canvas || !ctx || !cropState.img) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(cropState.img, 0, 0);

            if (cropState.cropW > 0 && cropState.cropH > 0) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(
                    cropState.img,
                    cropState.cropX, cropState.cropY, cropState.cropW, cropState.cropH,
                    cropState.cropX, cropState.cropY, cropState.cropW, cropState.cropH
                );

                ctx.strokeStyle = '#0ea5e9';
                ctx.lineWidth = Math.max(2, Math.round(canvas.width / 400));
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(cropState.cropX, cropState.cropY, cropState.cropW, cropState.cropH);
                ctx.setLineDash([]);
            }
        }

        async function executeCropAndAttach() {
            if (!cropState.img || cropState.cropW < 10 || cropState.cropH < 10) return;
            
            let offCanvas = document.createElement('canvas');
            let maxWidth = 800;
            let targetW = cropState.cropW;
            let targetH = cropState.cropH;
            if (targetW > maxWidth) {
                targetH = Math.round((targetH * maxWidth) / targetW);
                targetW = maxWidth;
            }
            offCanvas.width = targetW;
            offCanvas.height = targetH;
            let ctx = offCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, targetW, targetH);
            ctx.drawImage(
                cropState.img,
                cropState.cropX, cropState.cropY, cropState.cropW, cropState.cropH,
                0, 0, targetW, targetH
            );

            let webpUrl = offCanvas.toDataURL('image/webp', 0.85);

            let previewEl = document.getElementById('image-preview');
            if (previewEl) {
                previewEl.innerHTML = `<img src="${webpUrl}" class="max-h-[160px] rounded-xl object-contain mx-auto shadow-sm border border-slate-100">`;
            }
            if (adminState.editingQ) {
                adminState.editingQ.image = webpUrl;
            }

            showToast("Đã trích xuất & nén hình ảnh câu hỏi thành công (~5-15KB)!");
            closeCropModal();
        }

        /* --- TÍNH NĂNG SỬA LỖI CÂU HỎI & CHUẨN HÓA AI --- */
        let currentFixFilter = 'ALL';
        let currentFixSelectedId = null;

        function validateQuestionErrors(q, roundKey) {
            let errors = [];
            if (!q) return errors;

            let fullText = (q.text || '') + ' ' + (q.explanation || '');
            if (roundKey === 'round1' && q.options) fullText += ' ' + q.options.join(' ');
            if (roundKey === 'round2' && q.statements) fullText += ' ' + q.statements.map(s => s.text).join(' ');

            // 1. Math Formula Errors ($ unclosed)
            let dollarMatches = (fullText.match(/\$/g) || []).length;
            if (dollarMatches % 2 !== 0) {
                errors.push({ type: 'math', label: 'Cú pháp $', msg: 'Số lượng dấu $ không chẵn (thiếu dấu $ đóng/mở công thức).' });
            }

            // 2. LaTeX environment mismatches
            let beginCount = (fullText.match(/\\begin/g) || []).length;
            let endCount = (fullText.match(/\\end/g) || []).length;
            if (beginCount !== endCount) {
                errors.push({ type: 'math', label: 'Lỗi LaTeX', msg: `Có ${beginCount} thẻ \\begin nhưng có ${endCount} thẻ \\end.` });
            }

            // Check for LaTeX commands written outside $...$
            let textOutsideMath = fullText.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^\$]+\$/g, '');
            let latexCmds = ['\\frac', '\\sqrt', '\\log', '\\lim', '\\int', '\\begin', '\\vec', '\\alpha', '\\beta', '\\pi'];
            let foundOutside = latexCmds.filter(cmd => textOutsideMath.includes(cmd));
            if (foundOutside.length > 0) {
                errors.push({ type: 'math', label: 'Mã ngoài $', msg: `Phát hiện lệnh LaTeX (${foundOutside.join(', ')}) nằm ngoài cặp $...$.` });
            }

            // 3. Image & SVG errors
            let keywordsImg = ['bảng biến thiên', 'đồ thị', 'hình vẽ', 'hình bên', 'cho hình', 'sơ đồ'];
            let textLower = (q.text || '').toLowerCase();
            let hasMentionImg = keywordsImg.some(k => textLower.includes(k));
            let hasImgAttr = !!(q.image && q.image.trim());
            let hasSvgCode = (q.text || '').includes('<svg') || (q.explanation || '').includes('<svg');
            if (hasMentionImg && !hasImgAttr && !hasSvgCode) {
                errors.push({ type: 'img', label: 'Thiếu Ảnh/SVG', msg: 'Nội dung nhắc tới hình/đồ thị/BBT nhưng chưa có ảnh đính kèm hoặc thẻ <svg>.' });
            }
            if (hasSvgCode) {
                let svgOpen = ((q.text || '') + (q.explanation || '')).split('<svg').length - 1;
                let svgClose = ((q.text || '') + (q.explanation || '')).split('</svg>').length - 1;
                if (svgOpen !== svgClose) {
                    errors.push({ type: 'img', label: 'Lỗi thẻ SVG', msg: 'Mã SVG bị rách (thẻ <svg> không có thẻ đóng </svg> tương ứng).' });
                }
            }

            // 4. Answer / Statement errors
            if (roundKey === 'round1') {
                if (!q.options || q.options.length < 4 || q.options.some(o => o === undefined || o === null || String(o).trim() === '')) {
                    errors.push({ type: 'ans', label: 'Lỗi Phương Án', msg: 'Chưa đủ 4 phương án A, B, C, D hoặc có phương án rỗng.' });
                }
                if (!q.answer || !String(q.answer).trim()) {
                    errors.push({ type: 'ans', label: 'Thiếu Đáp Án', msg: 'Chưa thiết lập đáp án chính xác cho câu hỏi này.' });
                }
            } else if (roundKey === 'round2') {
                if (!q.statements || q.statements.length < 4 || q.statements.some(s => !s.text || !s.text.trim())) {
                    errors.push({ type: 'ans', label: 'Lỗi Mệnh Đề', msg: 'Thiếu hoặc có ý a, b, c, d bị rỗng nội dung.' });
                }
            } else if (roundKey === 'round3') {
                if (q.answer === undefined || q.answer === null || String(q.answer).trim() === '') {
                    errors.push({ type: 'ans', label: 'Thiếu Đáp Án', msg: 'Chưa nhập đáp án số/ngắn cho câu hỏi này.' });
                }
            }

            return errors;
        }

        function getAllExamQuestions() {
            let list = [];
            ['round1', 'round2', 'round3'].forEach(rKey => {
                let rName = rKey === 'round1' ? 'Phần I (Trắc nghiệm)' : (rKey === 'round2' ? 'Phần II (Đúng/Sai)' : 'Phần III (Trả lời ngắn)');
                (adminState.data[rKey] || []).forEach(q => {
                    let errs = validateQuestionErrors(q, rKey);
                    list.push({ uid: `${rKey}_${q.id}`, roundKey: rKey, roundName: rName, q: q, errors: errs });
                });
            });
            return list;
        }

        function renderErrorFixUI(contentArea, filterType, targetId) {
            if (!contentArea) contentArea = document.getElementById('admin-content-area');
            if (filterType) currentFixFilter = filterType;
            
            let allQuestions = getAllExamQuestions();
            let totalQs = allQuestions.length;
            let errorQsCount = allQuestions.filter(x => x.errors.length > 0).length;
            let mathErrCount = allQuestions.filter(x => x.errors.some(e => e.type === 'math')).length;
            let imgErrCount = allQuestions.filter(x => x.errors.some(e => e.type === 'img')).length;
            let ansErrCount = allQuestions.filter(x => x.errors.some(e => e.type === 'ans')).length;

            let filteredList = allQuestions.filter(item => {
                if (currentFixFilter === 'ERRORS') return item.errors.length > 0;
                if (currentFixFilter === 'MATH') return item.errors.some(e => e.type === 'math');
                if (currentFixFilter === 'IMG') return item.errors.some(e => e.type === 'img');
                if (currentFixFilter === 'ANS') return item.errors.some(e => e.type === 'ans');
                return true;
            });

            if (targetId) currentFixSelectedId = targetId;
            else if (!currentFixSelectedId || !filteredList.some(x => x.uid === currentFixSelectedId)) {
                currentFixSelectedId = filteredList.length > 0 ? filteredList[0].uid : null;
            }

            let filterOptions = [
                { id: 'ALL', label: `Tất cả (${totalQs})`, icon: 'fa-list' },
                { id: 'ERRORS', label: `⚠️ Cần sửa lỗi (${errorQsCount})`, icon: 'fa-triangle-exclamation' },
                { id: 'MATH', label: `📐 Lỗi Công Thức (${mathErrCount})`, icon: 'fa-calculator' },
                { id: 'IMG', label: `🖼️ Thiếu/Lỗi Ảnh SVG (${imgErrCount})`, icon: 'fa-image' },
                { id: 'ANS', label: `❓ Thiếu Đáp Án (${ansErrCount})`, icon: 'fa-circle-question' }
            ];

            let filterHtml = filterOptions.map(f => {
                let active = currentFixFilter === f.id ? 'bg-purple-600 text-white shadow-md font-black' : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200 font-bold';
                return `<button onclick="renderErrorFixUI(null, '${f.id}')" class="px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition btn-3d ${active}"><i class="fa-solid ${f.icon}"></i> ${f.label}</button>`;
            }).join('');

            let listItemsHtml = filteredList.map(item => {
                let isSelected = item.uid === currentFixSelectedId;
                let activeClass = isSelected ? 'border-purple-500 bg-purple-50 shadow-md scale-[1.01]' : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50';
                
                let txt = item.q.text || "(Chưa có nội dung)";
                let pTxt = txt.length > 40 ? txt.substring(0, 40) + '...' : txt;

                let badgesHtml = '';
                if (item.errors.length === 0) {
                    badgesHtml = `<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase"><i class="fa-solid fa-check mr-1"></i> Chuẩn</span>`;
                } else {
                    item.errors.forEach(e => {
                        let color = e.type === 'math' ? 'bg-rose-100 text-rose-700' : (e.type === 'img' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800');
                        badgesHtml += `<span class="${color} px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase">${e.label}</span>`;
                    });
                }

                let roundBadgeColor = item.roundKey === 'round1' ? 'bg-sky-100 text-sky-700' : (item.roundKey === 'round2' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700');
                let roundBadgeName = item.roundKey === 'round1' ? 'P1' : (item.roundKey === 'round2' ? 'P2' : 'P3');

                return `
                <div onclick="selectFixQuestion('${item.roundKey}', '${item.q.id}')" class="p-3.5 border-2 rounded-2xl cursor-pointer transition-all duration-150 ${activeClass}">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-1.5 font-black text-xs text-purple-900">
                            <span class="${roundBadgeColor} px-2 py-0.5 rounded-md text-[10px] font-black">${roundBadgeName}</span>
                            CÂU ${item.q.id}
                        </div>
                        <div class="flex gap-1 flex-wrap justify-end">${badgesHtml}</div>
                    </div>
                    <div class="text-[11px] text-slate-600 font-medium truncate leading-tight">${pTxt}</div>
                </div>`;
            }).join('');

            let selectedItem = allQuestions.find(x => x.uid === currentFixSelectedId);

            contentArea.innerHTML = `
            <div class="flex flex-col h-full w-full bg-slate-100">
                <!-- Top Header Control -->
                <div class="p-4 bg-white border-b-2 border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-black shrink-0"><i class="fa-solid fa-wrench"></i></div>
                        <div>
                            <h3 class="font-black text-lg text-purple-900 uppercase tracking-wide leading-tight">Trung Tâm Sửa Lỗi & Tinh Chỉnh AI</h3>
                            <p class="text-xs text-slate-500 font-bold">Phát hiện lỗi công thức Toán, hình ảnh & AI tự động sửa lỗi 1-Click</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">${filterHtml}</div>

                    <div class="flex items-center gap-2">
                        <button id="btn-fix-all-ai" onclick="aiFixAllDetectedErrors()" class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider ${errorQsCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}"><i class="fa-solid fa-wand-magic-sparkles mr-1.5 text-amber-300"></i> AI Sửa Lỗi Toàn Bộ (${errorQsCount} câu)</button>
                    </div>
                </div>

                <!-- Main Grid Layout -->
                <div class="flex flex-grow overflow-hidden">
                    <!-- Left List Sidebar -->
                    <div class="w-1/3 lg:w-1/4 border-r-2 border-slate-200 overflow-y-auto p-4 flex flex-col gap-2.5 bg-slate-50 admin-scroll">
                        <div class="flex justify-between items-center px-1 mb-1">
                            <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Danh sách (${filteredList.length})</span>
                            ${errorQsCount > 0 ? `<span class="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">${errorQsCount} câu lỗi</span>` : `<span class="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">100% Hoàn hảo</span>`}
                        </div>
                        ${filteredList.length > 0 ? listItemsHtml : `<div class="p-8 text-center text-slate-400 font-bold text-sm"><i class="fa-solid fa-folder-open text-3xl mb-2"></i><br>Không có câu hỏi nào trong bộ lọc này</div>`}
                    </div>

                    <!-- Right Fix Editor Workspace -->
                    <div class="w-2/3 lg:w-3/4 overflow-y-auto p-6 bg-white admin-scroll flex flex-col justify-between" id="fix-editor-container">
                        ${selectedItem ? renderSingleFixEditorHtml(selectedItem) : `<div class="flex items-center justify-center h-full text-slate-400 font-bold text-lg"><i class="fa-solid fa-hand-pointer mr-2 text-2xl"></i> Chọn câu hỏi bên trái để sửa lỗi</div>`}
                    </div>
                </div>
            </div>`;

            if (selectedItem) {
                adminState.editingQ = selectedItem.q;
                triggerMathJax();
                setupImagePasteZone();
            }
        }

        function renderSingleFixEditorHtml(item) {
            let q = item.q;
            let roundKey = item.roundKey;

            // Render Error Warning Banner
            let errBannerHtml = '';
            if (item.errors.length > 0) {
                let errListHtml = item.errors.map(e => `<li class="flex items-start gap-2"><i class="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i> <span><b>[${e.label}]</b> ${e.msg}</span></li>`).join('');
                errBannerHtml = `
                <div class="mb-6 bg-rose-50 border-2 border-rose-200 p-5 rounded-2xl text-rose-900 shadow-sm">
                    <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
                        <div class="font-black text-sm uppercase tracking-wide text-rose-700 flex items-center"><i class="fa-solid fa-triangle-exclamation mr-2 text-lg"></i> Cảnh báo lỗi phát hiện (${item.errors.length}):</div>
                        <button id="btn-ai-fix-q-${q.id}" onclick="aiFixSingleQuestion('${roundKey}', '${q.id}')" class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider"><i class="fa-solid fa-wand-magic-sparkles mr-1.5 text-amber-300"></i> AI Sửa Lỗi Câu Này (1-Click)</button>
                    </div>
                    <ul class="text-xs font-bold space-y-1.5 pl-1">${errListHtml}</ul>
                </div>`;
            } else {
                errBannerHtml = `
                <div class="mb-6 bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl text-emerald-900 flex justify-between items-center shadow-sm">
                    <div class="font-bold text-xs flex items-center text-emerald-700"><i class="fa-solid fa-circle-check text-emerald-500 text-xl mr-2.5"></i> Câu hỏi này đã hợp lệ! Không phát hiện lỗi cú pháp hay thiếu đáp án.</div>
                    <button id="btn-ai-fix-q-${q.id}" onclick="aiFixSingleQuestion('${roundKey}', '${q.id}')" class="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition shadow-sm btn-3d"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> AI Chuẩn Hóa Cú Pháp</button>
                </div>`;
            }

            // Textarea for Question Content
            let textHtml = `
            <div class="mb-6 bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm">
                <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <label class="font-black text-xs text-slate-700 uppercase tracking-widest">Nội dung câu hỏi (Công thức bọc bằng $...$):</label>
                    <div class="flex gap-2">
                        <button onclick="openSvgHelperModal('fix-q-text')" class="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 hover:bg-amber-500 hover:text-white transition btn-3d"><i class="fa-solid fa-chart-line mr-1"></i> Chèn Đồ Thị & BBT SVG</button>
                        <button onclick="openMathModal('fix-q-text')" class="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-xs font-bold border border-sky-100 hover:bg-sky-600 hover:text-white transition btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Phím Toán</button>
                    </div>
                </div>
                <textarea id="fix-q-text" oninput="updateQPreviewLive('fix-q-text', 'fix-q-preview')" class="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-purple-500 text-base font-medium text-slate-800 transition shadow-inner" rows="4">${String(q.text || '')}</textarea>
                <div class="mt-3 p-4 bg-slate-50 border border-dashed border-purple-200 rounded-xl">
                    <div class="text-[10px] font-black text-purple-700 uppercase tracking-wider mb-1 flex items-center justify-between flex-wrap gap-1">
                        <span class="flex items-center"><i class="fa-solid fa-eye mr-1.5"></i> Xem trước hiển thị trực tiếp (Live Preview):</span>
                        <button id="btn-ai-draw-fix-preview" onclick="aiRegenerateSvgForCurrentQ('fix-q-text', 'fix-q-preview')" class="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-[10px] font-black shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> AI Vẽ Lại Đồ Thị/BBT</button>
                    </div>
                    <div id="fix-q-preview" class="text-base font-bold text-slate-800 math-scroll">${String(q.text || '')}</div>
                </div>
            </div>`;

            // Image Paste / Upload Zone
            let imageHtml = `
            <div class="mb-6 bg-purple-50/40 p-5 rounded-2xl border-2 border-purple-100 shadow-sm">
                <label class="block font-black mb-3 text-xs text-purple-900 uppercase tracking-widest"><i class="fa-solid fa-image mr-1.5"></i> Hình Ảnh Đính Kèm (Dán Ctrl+V hoặc Tải File):</label>
                <div class="flex flex-col lg:flex-row gap-4 items-center">
                    <div id="image-paste-zone" tabindex="0" class="flex-grow w-full min-h-[120px] border-[2px] border-dashed border-purple-300 bg-white rounded-xl flex items-center justify-center cursor-text outline-none focus:border-purple-500 relative transition hover:bg-purple-50/50">
                        <div id="image-preview" class="pointer-events-none text-center p-3">
                            ${q.image ? `<img src="${q.image}" class="max-h-[140px] rounded-lg object-contain mx-auto shadow-sm border border-slate-100">` : `<i class="fa-solid fa-paste text-4xl text-purple-200 mb-2"></i><div class="text-xs text-slate-500 font-bold">Click vào đây và nhấn Ctrl+V để dán ảnh</div>`}
                        </div>
                    </div>
                    <div class="flex lg:flex-col gap-2 shrink-0 w-full lg:w-44">
                        <button onclick="openCropModal()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition btn-3d shadow-sm uppercase"><i class="fa-solid fa-crop-simple mr-1"></i> Cắt Ảnh 1-Click</button>
                        <label class="flex-1 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition btn-3d shadow-sm uppercase"><i class="fa-solid fa-cloud-arrow-up mr-1"></i> Tải File Lên<input type="file" id="image-upload" class="hidden" accept="image/*" onchange="handleFileUpload(event)"></label>
                        <button onclick="clearPastedImage()" class="flex-1 bg-white border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-500 font-bold py-2.5 px-3 rounded-xl text-xs transition btn-3d shadow-sm uppercase"><i class="fa-solid fa-trash-can mr-1"></i> Gỡ Ảnh</button>
                    </div>
                </div>
            </div>`;

            // Specific options/statements/answer per round
            let subHtml = '';
            if (roundKey === 'round1') {
                subHtml += `<div class="mb-6 bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm"><label class="block font-black mb-4 text-xs text-slate-700 uppercase tracking-widest">Các phương án lựa chọn:</label><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
                (q.options || ["", "", "", ""]).forEach((opt, idx) => {
                    subHtml += `<div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200"><div class="flex justify-between items-center mb-2"><label class="font-black text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase">Phương án ${['A', 'B', 'C', 'D'][idx]}</label><button onclick="openMathModal('fix-q-opt-${idx}')" class="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 hover:text-purple-600 font-bold btn-3d"><i class="fa-solid fa-calculator"></i> Toán</button></div><input type="text" id="fix-q-opt-${idx}" value="${String(opt || '').replace(/"/g, '&quot;')}" class="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-purple-400 text-sm bg-white font-medium text-slate-800"></div>`;
                });
                subHtml += `</div></div><div class="mb-6 flex flex-col md:flex-row gap-4"><div class="flex-grow bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 shadow-sm"><div class="flex justify-between items-center mb-2"><label class="font-black text-xs text-emerald-800 uppercase tracking-widest">Đáp án đúng chính xác:</label><button onclick="openMathModal('fix-q-ans')" class="text-[10px] bg-white border border-emerald-200 px-2 py-1 rounded text-emerald-700 font-bold btn-3d"><i class="fa-solid fa-calculator"></i> Toán</button></div><input type="text" id="fix-q-ans" value="${String(q.answer || '').replace(/"/g, '&quot;')}" class="w-full p-3.5 border-2 border-emerald-300 rounded-xl bg-white outline-none focus:border-emerald-500 font-black text-base text-emerald-800 shadow-inner"></div></div>`;
            } else if (roundKey === 'round2') {
                subHtml += `<div class="mb-6 space-y-4">`;
                (q.statements || []).forEach((stmt, idx) => {
                    subHtml += `
                    <div class="p-4 border-2 border-slate-200 rounded-2xl bg-white shadow-sm hover:border-purple-300 transition">
                        <div class="flex items-center justify-between mb-3 gap-3">
                            <div class="flex items-center gap-2">
                                <label class="font-black text-sm text-white bg-purple-600 w-8 h-8 flex items-center justify-center rounded-lg uppercase">${stmt.label}</label>
                                <button onclick="openMathModal('fix-q-stmt-txt-${idx}')" class="text-[10px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600 hover:text-purple-600 font-bold btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Toán</button>
                            </div>
                            <select id="fix-q-stmt-val-${idx}" class="p-2 border-2 rounded-lg text-xs font-black outline-none transition cursor-pointer uppercase ${stmt.isTrue ? 'border-emerald-400 text-emerald-800 bg-emerald-50' : 'border-rose-400 text-rose-800 bg-rose-50'}">
                                <option value="true" ${stmt.isTrue ? 'selected' : ''}>Mệnh đề ĐÚNG</option>
                                <option value="false" ${!stmt.isTrue ? 'selected' : ''}>Mệnh đề SAI</option>
                            </select>
                        </div>
                        <textarea id="fix-q-stmt-txt-${idx}" class="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-400 text-sm font-medium shadow-inner bg-slate-50 transition" rows="2">${String(stmt.text || '')}</textarea>
                    </div>`;
                });
                subHtml += `</div>`;
            } else if (roundKey === 'round3') {
                subHtml += `
                <div class="mb-6 bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
                    <div class="flex justify-between items-center mb-3">
                        <label class="font-black text-xs text-emerald-800 uppercase tracking-widest">Đáp án số (Ví dụ: 3/4 hoặc 5):</label>
                        <button onclick="openMathModal('fix-q-ans')" class="text-[10px] bg-white border border-emerald-200 px-2 py-1 rounded text-emerald-700 font-bold btn-3d"><i class="fa-solid fa-calculator"></i> Phím Toán</button>
                    </div>
                    <input type="text" id="fix-q-ans" value="${String(q.answer || '').replace(/"/g, '&quot;')}" class="w-full p-4 border-2 border-emerald-300 rounded-xl bg-white font-black text-2xl text-center text-emerald-800 outline-none focus:border-emerald-500 shadow-inner tracking-wider">
                </div>`;
            }

            // Explanation Editor
            let expHtml = `
            <div class="bg-purple-50/50 p-5 rounded-2xl border-2 border-purple-100 shadow-sm mb-6">
                <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <label class="block font-black text-xs text-purple-900 uppercase tracking-widest"><i class="fa-solid fa-lightbulb text-amber-500 mr-1.5 text-base"></i> Lời giải chi tiết (Hướng dẫn):</label>
                    <div class="flex gap-2">
                        <button onclick="openSvgHelperModal('fix-q-explanation')" class="text-[10px] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-800 font-bold btn-3d"><i class="fa-solid fa-chart-line mr-1"></i> Đồ Thị / BBT SVG</button>
                        <button onclick="openMathModal('fix-q-explanation')" class="text-[10px] bg-white border border-purple-200 px-2.5 py-1 rounded-lg text-purple-700 font-bold btn-3d"><i class="fa-solid fa-calculator mr-1"></i> Phím Toán</button>
                    </div>
                </div>
                <textarea id="fix-q-explanation" class="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 outline-none shadow-inner bg-white text-base font-medium transition" rows="4">${String(q.explanation || '')}</textarea>
            </div>`;

            // Bottom Action Footer
            let footerHtml = `
            <div class="pt-4 border-t-2 border-slate-200 flex flex-wrap justify-between items-center gap-3">
                <div class="text-xs font-bold text-slate-500 flex items-center">
                    <i class="fa-solid fa-keyboard mr-1.5 text-purple-500 text-sm"></i> Mẹo: Nhấn <kbd class="px-2 py-1 bg-slate-100 border rounded text-[10px] font-mono mx-1 shadow-sm font-black">Ctrl + Enter</kbd> để Lưu & Sang Câu Tiếp theo
                </div>
                <div class="flex gap-3">
                    <button onclick="saveFixQuestion('${roundKey}', '${q.id}', false)" class="px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-black text-xs rounded-xl shadow-sm hover:bg-purple-50 transition btn-3d uppercase"><i class="fa-solid fa-floppy-disk mr-1.5"></i> Lưu Thay Đổi</button>
                    <button onclick="saveFixQuestion('${roundKey}', '${q.id}', true)" class="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 transition btn-3d uppercase tracking-wider"><i class="fa-solid fa-circle-arrow-right mr-1.5"></i> Lưu & Sang CÂU TIẾP</button>
                </div>
            </div>`;

            return errBannerHtml + textHtml + imageHtml + subHtml + expHtml + footerHtml;
        }

        function selectFixQuestion(roundKey, qId) {
            saveFixQuestionState();
            currentFixSelectedId = `${roundKey}_${qId}`;
            renderErrorFixUI(null, currentFixFilter, currentFixSelectedId);
        }

        function saveFixQuestionState() {
            if (!adminState.editingQ || adminState.round !== 'fix_errors') return;
            let q = adminState.editingQ;
            let textEl = document.getElementById('fix-q-text');
            if (textEl) q.text = textEl.value;
            let expEl = document.getElementById('fix-q-explanation');
            if (expEl) q.explanation = expEl.value;

            let roundKey = adminState.round === 'fix_errors' && currentFixSelectedId ? currentFixSelectedId.split('_')[0] : 'round1';

            if (roundKey === 'round1') {
                q.options = [0, 1, 2, 3].map(i => {
                    let el = document.getElementById(`fix-q-opt-${i}`);
                    return el ? el.value : (q.options ? q.options[i] : "");
                });
                let ansEl = document.getElementById('fix-q-ans');
                if (ansEl) q.answer = ansEl.value.trim();
            } else if (roundKey === 'round2' && q.statements) {
                q.statements.forEach((stmt, idx) => {
                    let txtEl = document.getElementById(`fix-q-stmt-txt-${idx}`);
                    if (txtEl) stmt.text = txtEl.value;
                    let valEl = document.getElementById(`fix-q-stmt-val-${idx}`);
                    if (valEl) stmt.isTrue = valEl.value === 'true';
                });
            } else if (roundKey === 'round3') {
                let ansEl = document.getElementById('fix-q-ans');
                if (ansEl) q.answer = ansEl.value.trim();
            }

            let imgPreview = document.getElementById('image-preview')?.querySelector('img');
            q.image = (imgPreview && imgPreview.src && !imgPreview.src.includes('fa-paste')) ? imgPreview.src : (q.image || "");
            GAME_DATA = sanitizeGameData(JSON.parse(JSON.stringify(adminState.data)));
        }

        function saveFixQuestion(roundKey, qId, autoNext = false) {
            saveFixQuestionState();
            showToast("Đã lưu cập nhật câu hỏi!");

            if (autoNext) {
                let all = getAllExamQuestions();
                let filtered = all.filter(item => {
                    if (currentFixFilter === 'ERRORS') return item.errors.length > 0;
                    if (currentFixFilter === 'MATH') return item.errors.some(e => e.type === 'math');
                    if (currentFixFilter === 'IMG') return item.errors.some(e => e.type === 'img');
                    if (currentFixFilter === 'ANS') return item.errors.some(e => e.type === 'ans');
                    return true;
                });
                let currentIndex = filtered.findIndex(x => x.uid === `${roundKey}_${qId}`);
                if (currentIndex !== -1 && currentIndex < filtered.length - 1) {
                    let nextItem = filtered[currentIndex + 1];
                    currentFixSelectedId = nextItem.uid;
                }
            }

            renderErrorFixUI(null, currentFixFilter, currentFixSelectedId);
        }

        async function aiFixSingleQuestion(roundKey, qId) {
            let apiKey = getGeminiApiKey();
            if (!apiKey) return showToast("Vui lòng nhập Gemini API Key trong phần Nhập / AI!", true);

            let list = adminState.data[roundKey] || [];
            let q = list.find(x => String(x.id) === String(qId));
            if (!q) return showToast("Không tìm thấy câu hỏi!", true);

            let btn = document.getElementById(`btn-ai-fix-q-${qId}`);
            let oldText = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Bác sĩ AI Đang Khám & Vá Lỗi...'; btn.disabled = true; }

            try {
                let promptText = `Bạn là BÁC SĨ KHẢO THÍ TOÁN HỌC & CHUYÊN GIA KIỂM ĐỊNH ĐỀ THI THPT GDPT 2018 (CÔNG VĂN 7991/BGDĐT).

NHIỆM VỤ: Hãy phẫu thuật, kiểm định toán học và SỬA CHỮA TOÀN DIỆN câu hỏi Toán dưới đây để đạt độ CHUẨN XÁC 100% VỀ TOÁN HỌC, SƯ PHẠM VÀ TRỰC QUAN HÓA:

1. KIỂM ĐỊNH VÀ ĐỒNG BỘ ĐÁP ÁN VỚI LỜI GIẢI (ZERO CONFLICT):
   - Bạn BẮT BUỘC phải tự giải lại bài toán từng bước logic trong "explanation".
   - Nếu "answer" hoặc "isTrue" bị LỆCH với lời giải thực tế, BẮT BUỘC SỬA LẠI "answer" cho khớp 100% với lời giải!
   - 4 phương án A, B, C, D (nếu có) phải độc lập, không trùng lặp giá trị, các phương án sai phải là bẫy tư duy kinh điển hợp lý.

2. ★ BẮT BUỘC BỔ SUNG BẢNG (TABLE), BẢNG BIẾN THIÊN, ĐỒ THỊ VÀ HÌNH HỌC KHÔNG GIAN NẾU THIẾU:
   - Nếu trong "text" có nhắc tới "bảng biến thiên" (hoặc câu hỏi khảo sát hàm số, cực trị, tiệm cận) mà CHƯA CÓ BẢNG BIẾN THIÊN:
     BẮT BUỘC TỰ ĐỘNG CHÈN MÃ LaTeX MathJax array BBT vào ngay trong "text":
     $$\\begin{array}{c|ccccc} x & -\\infty & ... & +\\infty \\\\ \\hline y' & ... \\\\ \\hline y & ... \\end{array}$$
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
   - Ký tự gạch chéo ngược \ BẮT BUỘC escape thành \\ trong chuỗi JSON.

DỮ LIỆU CÂU HỎI CẦN BÁC SĨ AI KHÁM & SỬA:
Dạng thức: ${roundKey === 'round1' ? 'Trắc nghiệm 4 lựa chọn (Phần I)' : (roundKey === 'round2' ? 'Đúng / Sai 4 ý (Phần II)' : 'Trả lời ngắn (Phần III)')}
ID: ${q.id}
Text: ${JSON.stringify(q.text)}
Options: ${JSON.stringify(q.options || [])}
Answer: ${JSON.stringify(q.answer || '')}
Statements: ${JSON.stringify(q.statements || [])}
Explanation: ${JSON.stringify(q.explanation || '')}`;

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
                    let note = parsed.repairNotes ? ` [${parsed.repairNotes}]` : '';
                    showToast(`✨ Bác sĩ AI đã thẩm định & sửa câu hỏi thành công!${note}`);
                    renderErrorFixUI(null, currentFixFilter, `${roundKey}_${qId}`);
                } else {
                    throw new Error("AI trả về định dạng không đúng!");
                }
            } catch (e) {
                showToast("Lỗi từ AI: " + e.message, true);
            } finally {
                if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
            }
        }

        function aiFixAllDetectedErrors() {
            let apiKey = getGeminiApiKey();
            if (!apiKey) return showToast("Vui lòng nhập Gemini API Key trong phần Nhập / AI!", true);

            let all = getAllExamQuestions().filter(item => item.errors.length > 0);
            if (all.length === 0) return showToast("Không phát hiện câu hỏi nào có lỗi!");

            showConfirmModal("AI Sửa Lỗi Tự Động", `Tìm thấy ${all.length} câu hỏi có cảnh báo lỗi. Bạn có muốn dùng AI để tự động sửa lỗi cho tất cả ${all.length} câu này không?`, async () => {
                let btn = document.getElementById('btn-fix-all-ai');
                let old = btn ? btn.innerHTML : '';
                if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang tự động sửa...'; }
                let count = 0;
                for (let item of all) {
                    try {
                        await aiFixSingleQuestion(item.roundKey, item.q.id);
                        count++;
                    } catch (e) {}
                }
                showToast(`Đã dùng AI xử lý xong ${count}/${all.length} câu bị lỗi!`);
                renderErrorFixUI(null, currentFixFilter);
            });
        }

        window.openCopyrightModal = function() {
            let m = document.getElementById('copyright-modal');
            if (m) m.classList.remove('hidden');
        };
        window.closeCopyrightModal = function() {
            let m = document.getElementById('copyright-modal');
            if (m) m.classList.add('hidden');
        };

        window.openChangePasswordModal = function() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền đổi Mã PIN Giáo viên!", true);
            }
            let inputNew = document.getElementById('input-new-teacher-pin');
            let inputConf = document.getElementById('input-confirm-teacher-pin');
            if (inputNew) inputNew.value = '';
            if (inputConf) inputConf.value = '';
            let modal = document.getElementById('modal-teacher-change-pin');
            if (modal) modal.classList.remove('hidden');
        };

        window.closeTeacherChangePinModal = function() {
            let modal = document.getElementById('modal-teacher-change-pin');
            if (modal) modal.classList.add('hidden');
        };

        window.toggleTeacherPinVisibility = function(inputId, btn) {
            let el = document.getElementById(inputId);
            if (!el) return;
            if (el.type === 'password') {
                el.type = 'text';
                if (btn) btn.innerHTML = '<i class="fa-solid fa-eye-slash text-sm"></i>';
            } else {
                el.type = 'password';
                if (btn) btn.innerHTML = '<i class="fa-solid fa-eye text-sm"></i>';
            }
        };

        window.submitChangeTeacherPin = async function() {
            if (!isCurrentUserSuperAdmin()) {
                return showToast("⚠️ Chỉ Quản trị viên cấp cao (tailieutoantbs@gmail.com) mới có quyền đổi Mã PIN Giáo viên!", true);
            }
            let p1 = document.getElementById('input-new-teacher-pin')?.value.trim();
            let p2 = document.getElementById('input-confirm-teacher-pin')?.value.trim();
            if (!p1 || p1.length < 4) {
                return showToast("Mã PIN mới phải có tối thiểu 4 ký tự!", true);
            }
            if (p1 !== p2) {
                return showToast("Mã PIN xác nhận không khớp nhau!", true);
            }

            let btn = document.getElementById('btn-submit-change-teacher-pin') || document.getElementById('btn-submit-teacher-pin');
            let oldText = btn ? btn.innerHTML : '';
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Đang lưu...'; btn.disabled = true; }

            try {
                if (typeof saveDynamicTeacherPin === 'function') {
                    await saveDynamicTeacherPin(p1, SUPER_ADMIN_EMAIL);
                } else {
                    localStorage.setItem('teacher_admin_pin', p1);
                }
                showToast("✅ Đã cập nhật Mã PIN Giáo viên thành công!");
                closeTeacherChangePinModal();
            } catch(e) {
                showToast("Lỗi: " + (e.message || e), true);
            } finally {
                if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
            }
        };
function updatePublishTargetUI(val) {
    let badge = document.getElementById('export-publish-target-badge');
    let expSel = document.getElementById('export-experience-mode');
    let nameInput = document.getElementById('export-exam-name');
    if (val === 'game') {
        if (badge) {
            badge.innerText = 'Kho Games Hamburger';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-2xs';
        }
        if (expSel && (expSel.value === 'exam' || expSel.value === 'practice_all')) {
            expSel.value = 'game_millionaire';
        }
        if (nameInput && !nameInput.value) {
            nameInput.placeholder = 'Ví dụ: Đấu Trường Triệu Phú - Khảo Sát Hàm Số...';
        }
    } else {
        if (badge) {
            badge.innerText = 'Kho Đề Thi';
            badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs';
        }
        if (nameInput && !nameInput.value) {
            nameInput.placeholder = 'Ví dụ: Kiểm tra học kỳ I...';
        }
    }
}
window.updatePublishTargetUI = updatePublishTargetUI;
