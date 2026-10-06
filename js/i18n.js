/**
 * Internationalization (i18n) Engine for Math & IT Ecosystem v3.0
 * Supports: 'vi' (Vietnamese), 'en' (English), 'bilingual' (Dual Language)
 */

window.APP_LANG = localStorage.getItem('app_lang') || 'vi';

const I18N_DICTIONARY = {
    vi: {
        appName: "HỆ SINH THÁI KHẢO THÍ & HỌC TẬP TOÁN HỌC & CNTT",
        subTitle: "Nền tảng Tích hợp Toàn diện: Biên Soạn, Trình Chiếu, Ôn Luyện & Kiểm Tra Đánh Giá",
        coreValuesTitle: "GIÁ TRỊ CỐT LÕI & NGHĨA VỤ HỌC TẬP",
        coreValuesSub: "Xây Dựng Tri Thức & Rèn Luyện Nhân Cách Học Sinh",
        honest: "TRUNG THỰC",
        respect: "TÔN TRỌNG",
        responsibility: "TRÁCH NHIỆM",
        discipline: "KỶ LUẬT",
        progress: "TIẾN BỘ MỖI NGÀY",
        
        pillar1Title: "BIÊN SOẠN",
        pillar1Sub: "/ AUTHORING",
        pillar1Desc: "Soạn thảo ngân hàng câu hỏi chuẩn ma trận, xuất đề thi PDF/Word/LaTeX, quản lý bài giảng Supabase.",
        pillar1Btn1: "Ngân Hàng Đề",
        pillar1Btn2: "Kho Tài Nguyên",

        pillar2Title: "TRÌNH CHIẾU",
        pillar2Sub: "/ PRESENTATION",
        pillar2Desc: "Bảng trắng kỹ thuật số thông minh, vẽ đồ thị hàm số động, trình chiếu đề thi tương tác trên lớp.",
        pillar2MainBtn: "MỞ BẢNG TRẮNG TOÁN / WHITEBOARD",
        pillar2Btn1: "Tab Bảng Riêng",
        pillar2Btn2: "Máy Tính Desmos",

        pillar3Title: "ÔN LUYỆN",
        pillar3Sub: "/ PRACTICE & DRILL",
        pillar3Desc: "Danh mục đề rèn luyện theo chủ đề, sơ đồ tư duy Infographic, xem lời giải chi tiết từng bước.",
        pillar3MainBtn: "DANH MỤC ĐỀ LUYỆN TẬP / CATALOG",
        pillar3Btn1: "Bảng Tin Sự Kiện",
        pillar3Btn2: "Hướng Dẫn Ôn",

        pillar4Title: "KIỂM TRA ĐÁNH GIÁ",
        pillar4Sub: "/ ASSESSMENT",
        pillar4Desc: "Đấu trường khảo thí trực tuyến, nhập mã đề 6 ký tự, tra cứu điểm và vinh danh Bảng vàng 3D.",
        pillar4Placeholder: "MÃ ĐỀ THI",
        pillar4StartBtn: "VÀO THI",
        pillar4Btn1: "Tra Cứu Điểm",
        pillar4Btn2: "Bảng Vàng 3D",

        teacherLoginBtn: "ĐĂNG NHẬP GIÁO VIÊN / HỌC SINH",
        teacherDashboardBtn: "TRANG QUẢN TRỊ THI AI (TEACHER DASHBOARD)",
        langVi: "Tiếng Việt",
        langEn: "English",
        langBilingual: "Song ngữ (Bilingual)"
    },
    en: {
        appName: "MATHEMATICS & IT ASSESSMENT & LEARNING ECOSYSTEM",
        subTitle: "Comprehensive Integrated Platform: Authoring, Presentation, Practice & Assessment",
        coreValuesTitle: "CORE VALUES & LEARNING OBLIGATIONS",
        coreValuesSub: "Building Knowledge & Cultivating Student Character",
        honest: "HONESTY",
        respect: "RESPECT",
        responsibility: "RESPONSIBILITY",
        discipline: "DISCIPLINE",
        progress: "DAILY PROGRESS",
        
        pillar1Title: "AUTHORING",
        pillar1Sub: "/ CONTENT CREATION",
        pillar1Desc: "Draft matrix-aligned item banks, export PDF/Word/LaTeX exams, manage Supabase lecture notes.",
        pillar1Btn1: "Question Bank",
        pillar1Btn2: "Resource Library",

        pillar2Title: "PRESENTATION",
        pillar2Sub: "/ SMART BOARD",
        pillar2Desc: "Smart digital whiteboard, dynamic function graphing, interactive classroom presentation.",
        pillar2MainBtn: "OPEN MATH WHITEBOARD",
        pillar2Btn1: "Separate Tab",
        pillar2Btn2: "Desmos Calculator",

        pillar3Title: "PRACTICE",
        pillar3Sub: "/ SELF-STUDY",
        pillar3Desc: "Topic-based practice catalog, Infographic mindmaps, step-by-step detailed solutions.",
        pillar3MainBtn: "PRACTICE EXAM CATALOG",
        pillar3Btn1: "Event Board",
        pillar3Btn2: "Study Guide",

        pillar4Title: "ASSESSMENT",
        pillar4Sub: "/ EXAM ARENA",
        pillar4Desc: "Online assessment arena, enter 6-character PIN, score lookup and 3D Leaderboard honor roll.",
        pillar4Placeholder: "EXAM CODE",
        pillar4StartBtn: "START EXAM",
        pillar4Btn1: "Lookup Score",
        pillar4Btn2: "3D Leaderboard",

        teacherLoginBtn: "TEACHER / STUDENT LOGIN",
        teacherDashboardBtn: "TEACHER AI DASHBOARD",
        langVi: "Vietnamese",
        langEn: "English",
        langBilingual: "Bilingual"
    },
    bilingual: {
        appName: "HỆ SINH THÁI TOÁN HỌC & CNTT • MATH & IT ECOSYSTEM",
        subTitle: "Nền tảng Tích hợp Toàn diện • Comprehensive Integrated Platform",
        coreValuesTitle: "GIÁ TRỊ CỐT LÕI & NGHĨA VỤ HỌC TẬP • CORE VALUES",
        coreValuesSub: "Xây Dựng Tri Thức & Rèn Luyện Nhân Cách • Building Knowledge & Character",
        honest: "TRUNG THỰC • HONESTY",
        respect: "TÔN TRỌNG • RESPECT",
        responsibility: "TRÁCH NHIỆM • RESPONSIBILITY",
        discipline: "KỶ LUẬT • DISCIPLINE",
        progress: "TIẾN BỘ MỖI NGÀY • DAILY PROGRESS",
        
        pillar1Title: "BIÊN SOẠN / AUTHORING",
        pillar1Sub: "/ CONTENT CREATION",
        pillar1Desc: "Soạn thảo ngân hàng câu hỏi chuẩn ma trận, xuất đề thi PDF/Word/LaTeX. Draft matrix-aligned question banks.",
        pillar1Btn1: "Ngân Hàng Đề (Item Bank)",
        pillar1Btn2: "Kho Tài Nguyên (Resources)",

        pillar2Title: "TRÌNH CHIẾU / PRESENTATION",
        pillar2Sub: "/ SMART BOARD",
        pillar2Desc: "Bảng trắng kỹ thuật số thông minh, vẽ đồ thị hàm số động. Smart digital whiteboard & graphing.",
        pillar2MainBtn: "MỞ BẢNG TRẮNG TOÁN / MATH WHITEBOARD",
        pillar2Btn1: "Tab Bảng Riêng",
        pillar2Btn2: "Máy Tính Desmos",

        pillar3Title: "ÔN LUYỆN / PRACTICE",
        pillar3Sub: "/ SELF-STUDY",
        pillar3Desc: "Danh mục đề rèn luyện theo chủ đề, sơ đồ tư duy Infographic. Topic-based practice catalog & mindmaps.",
        pillar3MainBtn: "DANH MỤC ĐỀ LUYỆN TẬP / PRACTICE CATALOG",
        pillar3Btn1: "Bảng Tin Sự Kiện",
        pillar3Btn2: "Hướng Dẫn Ôn",

        pillar4Title: "KIỂM TRA ĐÁNH GIÁ / ASSESSMENT",
        pillar4Sub: "/ EXAM ARENA",
        pillar4Desc: "Đấu trường khảo thí trực tuyến, nhập mã đề 6 ký tự. Online assessment arena & 3D Leaderboard.",
        pillar4Placeholder: "MÃ ĐỀ THI / PIN",
        pillar4StartBtn: "VÀO THI / START",
        pillar4Btn1: "Tra Cứu Điểm",
        pillar4Btn2: "Bảng Vàng 3D",

        teacherLoginBtn: "ĐĂNG NHẬP (LOGIN)",
        teacherDashboardBtn: "QUẢN TRỊ THI AI (TEACHER DASHBOARD)",
        langVi: "Tiếng Việt",
        langEn: "English",
        langBilingual: "Song ngữ (Bilingual)"
    }
};

function t(key) {
    const lang = window.APP_LANG || 'vi';
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY['vi'];
    return dict[key] || I18N_DICTIONARY['vi'][key] || key;
}

function setAppLanguage(lang) {
    if (!['vi', 'en', 'bilingual'].includes(lang)) lang = 'vi';
    window.APP_LANG = lang;
    localStorage.setItem('app_lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (k) el.innerText = t(k);
    });

    if (typeof renderPortal === 'function') {
        renderPortal();
    }
    
    if (typeof showToast === 'function') {
        const label = lang === 'vi' ? 'Tiếng Việt 🇻🇳' : (lang === 'en' ? 'English 🇬🇧' : 'Song ngữ 🌐');
        showToast(`Đã chuyển ngôn ngữ: ${label}`);
    }
}

window.t = t;
window.setAppLanguage = setAppLanguage;
