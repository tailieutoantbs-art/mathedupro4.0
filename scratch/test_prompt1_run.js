const fs = require('fs');

// Mock DOM
global.document = {
  getElementById: (id) => {
    if (id === 'ai-prompt-grade') return { value: '12' };
    if (id === 'ai-prompt-topic-custom') return { value: '' };
    if (id === 'ai-prompt-text') return { value: '' };
    return null;
  }
};
global.window = {
  selectedAiTopics: ['Khảo sát hàm số và ứng dụng đạo hàm', 'Khối đa diện và thể tích'],
  aiPromptMode: 'formal'
};
global.aiStructure = [
  { count: 12, format: 'round1', level: 'Nhận biết' },
  { count: 4, format: 'round2', level: 'Thông hiểu' },
  { count: 6, format: 'round3', level: 'Vận dụng' }
];

// Load teacher.js function
const teacherContent = fs.readFileSync('js/teacher.js', 'utf8');
const fnIdx = teacherContent.indexOf('function generateAiPrompt()');
const fnEnd = teacherContent.indexOf('function handleAiImageScanUpload');
const fnCode = teacherContent.slice(fnIdx, fnEnd);

eval(fnCode);

const prompt = generateAiPrompt();
console.log('=== GENERATED PROMPT PREVIEW (First 800 chars) ===');
console.log(prompt.slice(0, 800));
console.log('\n=== GENERATED PROMPT PREVIEW (Last 500 chars) ===');
console.log(prompt.slice(-500));
