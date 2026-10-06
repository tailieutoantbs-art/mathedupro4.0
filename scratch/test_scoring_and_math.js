const fs = require('fs');
const path = require('path');

// Load config.js
const configCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'config.js'), 'utf8');
// Mock window & document for Node environment
global.window = global;
global.document = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

// Evaluate config
eval(configCode);

console.log('=== TEST 1: isMathAnswerCorrect ===');
const testCases = [
    { u: '0.5', c: '0,5', expected: true, desc: 'Decimal comma vs dot' },
    { u: '-1.5', c: '-1,5', expected: true, desc: 'Negative decimal' },
    { u: '1/2', c: '0.5', expected: true, desc: 'Fraction vs decimal' },
    { u: '2/4', c: '1/2', expected: true, desc: 'Equivalent fractions' },
    { u: '\\frac{1}{2}', c: '0.5', expected: true, desc: 'LaTeX fraction vs decimal' },
    { u: 'x = 5', c: '5', expected: true, desc: 'Prefix x = ' },
    { u: 'S = 12.5', c: '12,5', expected: true, desc: 'Prefix S = with decimal comma' },
    { u: '3.14159', c: '3.14', expected: true, desc: 'Precision tolerance' },
    { u: '1/2', c: '1/2; 0.5; 0,5', expected: true, desc: 'Multiple target variants with semicolon' },
    { u: '0.5', c: '1/2 | 0.5', expected: true, desc: 'Multiple target variants with pipe' },
    { u: '2', c: '3', expected: false, desc: 'Wrong integer' },
    { u: '-4', c: '4', expected: false, desc: 'Wrong sign' },
    { u: '\\sqrt{4}', c: '2', expected: true, desc: 'Sqrt(4) vs 2' }
];

let passCount = 0;
testCases.forEach((tc, idx) => {
    const res = isMathAnswerCorrect(tc.u, tc.c);
    const passed = res === tc.expected;
    if (passed) passCount++;
    console.log(`Test ${idx + 1} [${tc.desc}]: ${passed ? 'PASSED' : 'FAILED'} (Got: ${res}, Expected: ${tc.expected})`);
});
console.log(`Math Correctness Result: ${passCount}/${testCases.length} passed.`);

console.log('\n=== TEST 2: Scoring Formula for 2025 BGD format ===');
// Test Round 2 scoring: 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0
function calculateRound2QuestionScore(correctCount) {
    if (correctCount === 1) return 0.1;
    if (correctCount === 2) return 0.25;
    if (correctCount === 3) return 0.5;
    if (correctCount === 4) return 1.0;
    return 0;
}

const r2Cases = [
    { count: 0, expected: 0 },
    { count: 1, expected: 0.1 },
    { count: 2, expected: 0.25 },
    { count: 3, expected: 0.5 },
    { count: 4, expected: 1.0 }
];

let r2Pass = 0;
r2Cases.forEach(c => {
    const s = calculateRound2QuestionScore(c.count);
    if (s === c.expected) r2Pass++;
});
console.log(`Round 2 Scoring Result: ${r2Pass}/${r2Cases.length} passed.`);
