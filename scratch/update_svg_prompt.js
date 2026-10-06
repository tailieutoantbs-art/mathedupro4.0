const fs = require('fs');

let teacher = fs.readFileSync('js/teacher.js', 'utf8');

const targetOldPrompt = `let promptText = \`Bạn là chuyên gia khảo sát hàm số và đồ họa SVG cho bài tập Toán THPT GDPT 2018.
Nhiệm vụ: Hãy đọc câu hỏi Toán sau, xác định hàm số cần vẽ đồ thị hoặc bảng biến thiên.
Yêu cầu mã SVG chuẩn xác 100% về mặt hình học & toán học:
1. Trả về DUY NHẤT 1 khối mã SVG đặt trong thẻ <svg class="mx-auto my-3 max-w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">...</svg>.
2. Đồ thị Hệ trục Oxy:
   - Gốc tọa độ O(180, 180), nét vẽ rõ ràng, mũi tên x, y và nhãn O, x, y.
   - Các tiệm cận đứng, tiệm cận ngang, tiệm cận xiên (ĐẶC BIỆT: Tiệm cận xiên y = a*x + b PHẢI ĐI QUA ĐÚNG ĐIỂM (0, b), nếu y = x thì PHẢI ĐI QUA ĐÚNG GỐC TỌA ĐỘ O(180, 180)). Nét đứt stroke-dasharray="5,5".
   - Nhánh đồ thị dùng <path d="..." fill="none" stroke="#2563eb" stroke-width="3"/> uốn mượt đi qua đúng các điểm cực trị.
3. Trả về 1 JSON object có thuộc tính "svg" chứa chuỗi mã SVG.

NỘI DUNG CÂU HỎI:
\${textEl.value}\`;`;

const newPrompt = `let promptText = \`Bạn là HỌA SĨ TOÁN HỌC & CHUYÊN GIA ĐỒ HỌA VECTOR SVG TOÁN THPT GDPT 2018.
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
\${textEl.value}\`;`;

// Normalize
const normTeacher = teacher.replace(/\r\n/g, '\n');
const normOld = targetOldPrompt.replace(/\r\n/g, '\n');

if (normTeacher.includes(normOld)) {
  teacher = normTeacher.replace(normOld, newPrompt);
  fs.writeFileSync('js/teacher.js', teacher, 'utf8');
  console.log('Successfully updated aiRegenerateSvgForCurrentQ prompt!');
} else {
  console.error('targetOldPrompt not found in teacher.js');
}
