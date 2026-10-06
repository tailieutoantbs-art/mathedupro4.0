// Test Prompt 4 AI Exam Doctor & Auto-Repair Engine
const testQuestionRound1 = {
  id: 1,
  text: "Cho hàm số y = f(x) có bảng biến thiên như hình vẽ. Hàm số đồng biến trên khoảng nào?",
  options: ["A. (0; 2)", "B. (-oo; 0)", "C. (2; +oo)", "D. (-1; 1)"],
  answer: "A. (0; 2)", // Giả sử đáp án bị sai, thực tế đồng biến trên (-oo; 0) và (2; +oo)
  explanation: "Từ bảng biến thiên ta thấy y' > 0 trên (-oo; 0) và (2; +oo). Do đó chọn B." // Lệch với answer!
};

console.log('Original Question with errors:');
console.log('- Thiếu BBT trong text');
console.log('- Thiếu dấu $ công thức');
console.log('- Answer A lệch với Lời giải B');
