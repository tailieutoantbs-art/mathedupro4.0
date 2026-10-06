const fs = require('fs');

const teacherContent = fs.readFileSync('js/teacher.js', 'utf8');
const templateText = fs.readFileSync('scratch/prompt1_template.txt', 'utf8');

const idxStart = teacherContent.indexOf('function generateAiPrompt()');
const idxEnd = teacherContent.indexOf('function handleAiImageScanUpload');

console.log('idxStart:', idxStart, 'idxEnd:', idxEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error('Indices not found!');
  process.exit(1);
}

// Inspect what preceded idxStart and what starts at idxEnd
console.log('Before idxStart:', teacherContent.slice(Math.max(0, idxStart - 100), idxStart));
console.log('At idxEnd:', teacherContent.slice(idxEnd, idxEnd + 100));

// Build the new generateAiPrompt function:
// Notice: we can embed the template text safely using JSON.stringify
const newFunction = `function generateAiPrompt() {
  const grade = document.getElementById('ai-grade')?.value || '12';
  const topic = document.getElementById('ai-topic')?.value || 'Khảo sát hàm số và ứng dụng đạo hàm';
  const target = document.getElementById('ai-target')?.value || 'Ôn tập học kỳ & Thi tốt nghiệp THPT';
  const countP1 = document.getElementById('ai-count-p1')?.value || '12';
  const countP2 = document.getElementById('ai-count-p2')?.value || '4';
  const countP3 = document.getElementById('ai-count-p3')?.value || '6';
  const diffSelect = document.getElementById('ai-difficulty')?.value || 'Chuẩn cấu trúc Bộ GD&ĐT (40% NB - 30% TH - 20% VDC)';
  const customReq = document.getElementById('ai-custom-req')?.value || 'Tập trung các bẫy sai lầm phổ biến, ứng dụng thực tế và câu hỏi phân loại sắc bén.';

  const rawTemplate = ${JSON.stringify(templateText)};

  const finalPrompt = rawTemplate
    .replace(/\\{\\{GRADE\\}\\}/g, grade)
    .replace(/\\{\\{TOPIC\\}\\}/g, topic)
    .replace(/\\{\\{TARGET\\}\\}/g, target)
    .replace(/\\{\\{NUM_P1\\}\\}/g, countP1)
    .replace(/\\{\\{NUM_P2\\}\\}/g, countP2)
    .replace(/\\{\\{NUM_P3\\}\\}/g, countP3)
    .replace(/\\{\\{DIFFICULTY\\}\\}/g, diffSelect)
    .replace(/\\{\\{CUSTOM_REQ\\}\\}/g, customReq);

  const promptArea = document.getElementById('ai-prompt-input') || document.getElementById('ai-prompt-text');
  if (promptArea) {
    promptArea.value = finalPrompt;
  }
  return finalPrompt;
}

`;

const updatedTeacher = teacherContent.substring(0, idxStart) + newFunction + teacherContent.substring(idxEnd);

fs.writeFileSync('js/teacher.js', updatedTeacher, 'utf8');
console.log('Successfully updated js/teacher.js. New size:', updatedTeacher.length);
