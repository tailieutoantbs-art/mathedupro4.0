const fs = require('fs');

global.document = {
  getElementById: (id) => null
};
global.getGeminiApiKey = () => 'test_key';
global.adminState = {
  data: {
    round1: [
      {
        id: 1,
        text: 'Cho hàm số y = f(x) có bảng biến thiên như hình vẽ. Hàm số đồng biến trên khoảng nào?',
        options: ['A. (0; 2)', 'B. (-oo; 0)', 'C. (2; +oo)', 'D. (-1; 1)'],
        answer: 'A. (0; 2)',
        explanation: 'Ta thấy y\' > 0 trên (-oo; 0). Do đó chọn B.'
      }
    ]
  }
};

let capturedPayload = null;
global.callGeminiApiEndpoint = async (payload, key) => {
  capturedPayload = payload;
  return {
    candidates: [{
      content: {
        parts: [{
          text: JSON.stringify({
            text: 'Cho hàm số $y = f(x)$ có bảng biến thiên như sau:\n$$\\begin{array}{c|ccccc} x & -\\infty & & 0 & & 2 & & +\\infty \\\\ \\hline y\' & & + & 0 & - & 0 & + & \\\\ \\hline y & & & 3 & & & & +\\infty \\\\ & & \\nearrow & & \\searrow & & \\nearrow & \\\\ & -\\infty & & & & -1 & & \\end{array}$$\nHàm số đã cho đồng biến trên khoảng nào dưới đây?',
            options: ['A. $(0; 2)$', 'B. $(-\\infty; 0)$', 'C. $(-1; 1)$', 'D. $(0; 3)$'],
            answer: 'B. $(-\\infty; 0)$',
            explanation: 'Dựa vào bảng biến thiên, $y\' > 0$ trên $(-\\infty; 0)$ và $(2; +\\infty)$. Do đó hàm số đồng biến trên $(-\\infty; 0)$. Chọn B.',
            repairNotes: 'Đã sửa đáp án từ A sang B cho khớp lời giải, chèn Bảng biến thiên LaTeX, bọc công thức $...$'
          })
        }]
      }
    }]
  };
};
global.smartParseJSON = JSON.parse;
global.sanitizeGameData = (d) => d;
global.showToast = (msg) => console.log('TOAST:', msg);
global.renderErrorFixUI = () => {};

const teacherContent = fs.readFileSync('js/teacher.js', 'utf8');
const fnIdx = teacherContent.indexOf('async function aiFixSingleQuestion(roundKey, qId)');
const fnEnd = teacherContent.indexOf('function aiFixAllDetectedErrors()');
eval(teacherContent.slice(fnIdx, fnEnd));

aiFixSingleQuestion('round1', 1).then(() => {
  console.log('=== TEST RESULT: QUESTION REPAIRED SUCCESSFULLY ===');
  console.log('New text preview:\n', adminState.data.round1[0].text.slice(0, 150));
  console.log('New answer:', adminState.data.round1[0].answer);
  console.log('Has BBT in text:', adminState.data.round1[0].text.includes('begin{array}'));
});
