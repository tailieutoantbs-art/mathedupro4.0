const fs = require('fs');

const tmpl2 = fs.readFileSync('scratch/prompt2_template.txt', 'utf8');

function buildGamePrompt(grade, topic, gameType, lang) {
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

  let langDesc = (lang === 'en') ? "Tiếng Anh (English - Math Terminology)" : ((lang === 'bi') ? "Song ngữ Việt - Anh" : "Tiếng Việt chuẩn mực sư phạm");

  return tmpl2
    .replace(/\{\{GRADE\}\}/g, grade)
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{GAME_TARGET_DESC\}\}/g, gameTargetDesc)
    .replace(/\{\{GAME_SPECIFIC_RULES\}\}/g, gameSpecificRules)
    .replace(/\{\{LANG_DESC\}\}/g, langDesc)
    .replace(/\{\{BILINGUAL_INSTRUCTIONS\}\}/g, "");
}

console.log('--- TEST GAME PROMPT (MILLIONAIRE) ---');
const pMillionaire = buildGamePrompt('12', 'Khảo sát hàm số & Khối đa diện', 'millionaire', 'vi');
console.log(pMillionaire.slice(0, 1000));
console.log('...\nContains Visual Graphics Rule:', pMillionaire.includes('VISUAL GRAPHICS'));
