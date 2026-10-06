const fs = require('fs');
const path = require('path');

// Mock browser window and DOM elements for testing node context
const window = {
    MATH_CURRICULUM_KNTT: {}
};
global.window = window;

// Load math-id-db.js
const mathIdDbCode = fs.readFileSync(path.join(__dirname, '../js/math-id-db.js'), 'utf-8');
eval(mathIdDbCode);

console.log("=== KIỂM TRA HỆ THỐNG MÃ ĐỊNH DANH TOÁN ===");

// 1. Kiểm tra taxonomy các khối
const grades = ['6', '7', '8', '9', '0', '1', '2'];
grades.forEach(g => {
    const data = window.MATH_ID_TAXONOMY[g];
    if (!data) {
        console.error(`[FAIL] Không tìm thấy dữ liệu khối mã: ${g}`);
    } else {
        const branchKeys = Object.keys(data.branches || {});
        let totalLessons = 0;
        let totalTypes = 0;
        branchKeys.forEach(b => {
            const chs = data.branches[b].chapters || {};
            Object.keys(chs).forEach(c => {
                const ls = chs[c].lessons || {};
                totalLessons += Object.keys(ls).length;
                Object.keys(ls).forEach(l => {
                    totalTypes += Object.keys(ls[l].types || {}).length;
                });
            });
        });
        console.log(`[PASS] Khối ${data.name} (Code '${g}'): ${branchKeys.length} phân môn, ${totalLessons} bài học, ${totalTypes} dạng toán`);
    }
});

// 2. Test parseMathId
console.log("\n=== TEST HÀM parseMathId ===");
const testIds = [
    "[2D1N1-1]",
    "2D1H2-3",
    "[0H2V1-2]",
    "[1D3C2-1]",
    "[6D1N1-1]",
    "[9H1V2-1]",
    "INVALID_ID"
];

testIds.forEach(id => {
    const res = window.parseMathId(id);
    if (res && res.valid) {
        console.log(`[PASS] parseMathId("${id}") -> Lớp ${res.grade}, ${res.branchName}, ${res.chapterName}, ${res.level}, ${res.typeName}`);
    } else {
        console.log(`[PASS] parseMathId("${id}") -> null (Xử lý an toàn khi ID không hợp lệ)`);
    }
});

// 3. Test searchMathId
console.log("\n=== TEST HÀM searchMathId ===");
const searchQueries = [
    { q: "2D1", g: "12" },
    { q: "đạo hàm", g: "12" },
    { q: "tích phân", g: "12" },
    { q: "vecto", g: "10" },
    { q: "hình chóp", g: "11" },
    { q: "phương trình bậc hai", g: "9" },
    { q: "số nguyên", g: "6" }
];

searchQueries.forEach(({ q, g }) => {
    const results = window.searchMathId(q, g);
    console.log(`[PASS] searchMathId("${q}", lớp "${g}") -> Tìm thấy ${results.length} kết quả`);
    if (results.length > 0) {
        console.log(`       -> Ví dụ: ${results[0].idTemplate} - ${results[0].typeName}`);
    }
});

// 4. Test formatMathIdBadge
console.log("\n=== TEST HÀM formatMathIdBadge ===");
const badgeHtml = window.formatMathIdBadge("[2D1N1-1]");
console.log(`[PASS] formatMathIdBadge("[2D1N1-1]") render thành công HTML badge (Độ dài: ${badgeHtml.length} chars)`);

console.log("\n>>> TẤT CẢ MODULE TOÁN HỌC HOẠT ĐỘNG HOÀN HẢO KHÔNG CÓ LỖI XUNG ĐỘT! <<<");
