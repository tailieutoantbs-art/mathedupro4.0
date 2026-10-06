// math-render.js - MathJax, MathLive, Markdown & LaTeX Processing Engine for EduMath TBS

// MathJax Config object (must be defined before MathJax script loads)
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    svg: { fontCache: 'global' },
    startup: { typeset: false }
};

/**
 * Trigger MathJax and Highlight.js to re-render elements on DOM updates.
 * Supports passing a specific target element or array of elements for fast local re-render.
 */
let isMathJaxRendering = false;
let pendingMathJaxQueue = [];

function triggerMathJax(targetElement) { 
    if (window.MathJax && MathJax.typesetPromise) {
        let targets = targetElement ? (Array.isArray(targetElement) ? targetElement : [targetElement]) : null;
        
        if (isMathJaxRendering) {
            pendingMathJaxQueue.push(targets);
            return;
        }

        isMathJaxRendering = true;
        let promise = targets ? MathJax.typesetPromise(targets) : MathJax.typesetPromise();
        promise.catch(err => {
            console.warn("MathJax typeset warning:", err);
        }).finally(() => {
            isMathJaxRendering = false;
            if (pendingMathJaxQueue.length > 0) {
                let nextTargets = pendingMathJaxQueue.shift();
                triggerMathJax(nextTargets);
            }
        });
    } 

    if (window.hljs && hljs.highlightAll) {
        try {
            if (targetElement && targetElement.querySelectorAll) {
                targetElement.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
            } else {
                hljs.highlightAll(); 
            }
        } catch(e) {
            console.warn("Highlight.js warning:", e);
        }
    } 
}

/**
 * Trigger Confetti animation effect
 */
function triggerConfetti() { 
    if (window.confetti) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); 
    }
}

/**
 * Clean and normalize LaTeX / Math expressions in text before rendering.
 * Safely preserves LaTeX environments (cases, aligned, matrix), fixes common syntax issues without destructive deletion.
 */
function sanitizeMathText(text) {
    if (!text || typeof text !== 'string') return '';
    let s = text.trim();

    // 1. Remove AI citation tags like [cite: 1], [doc: 2], [1]
    s = s.replace(/\[\s*(?:cite|doc)\s*:[^\]]*\]/gi, '');
    s = s.replace(/\[\s*\d+\s*\]/g, (m, offset, str) => {
        if (offset > 0 && /[a-zA-Z0-9_]/.test(str[offset - 1])) return '';
        return m;
    });

    // 2. Protect SVG blocks from math sanitization
    let svgBlocks = [];
    s = s.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
        svgBlocks.push(match);
        return `___SVG_BLOCK_${svgBlocks.length - 1}___`;
    });

    // 3. Protect code blocks from math parsing
    let codeBlocks = [];
    s = s.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
        codeBlocks.push(match);
        return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
    });

    // 4. Normalize escaped math delimiters: \\( -> \(, \\) -> \), \\[ -> \[, \\] -> \]
    s = s.replace(/\\\\([()\[\]])/g, '\\$1');

    // 4b. Normalize \left\{ \begin{array} ... \end{array} \right. to \begin{cases} ... \end{cases}
    s = s.replace(/\\left\\?\{\s*\\begin\{array\}(?:\{[lcr| ]*\})?([\s\S]*?)\\end\{array\}\s*\\right(?:\.|\\[.}]|)/gi, '\\begin{cases}$1\\end{cases}');

    // 4c. Auto-wrap standalone \begin{cases}...\end{cases} or \left\{...\right. if not already in math delimiters
    s = s.replace(/(?<!\$)(?:\\left\\?\{[\s\S]*?\\right(?:\.|\\[.}]|)|\b\\begin\{(?:cases|aligned|matrix|bmatrix|pmatrix|vmatrix|array)\}[\s\S]*?\\end\{(?:cases|aligned|matrix|bmatrix|pmatrix|vmatrix|array)\})(?!\$)/gi, (m) => {
        return `$${m.trim()}$`;
    });

    // 5. Handle unclosed single $ at the very end of string if unbalanced
    let singleDollars = (s.match(/(?<!\\)\$/g) || []).length;
    if (singleDollars % 2 !== 0) {
        // If odd, check if ends with lone $, remove or append closing $
        if (s.endsWith('$')) {
            s = s.slice(0, -1);
        } else {
            s = s + '$';
        }
    }

    // 6. Handle $...$ blocks that mistakenly contain raw Vietnamese words
    const vnHasAccentRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúũụưứừửữựỳýỷỹỵ]/i;
    s = s.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (match, inner) => {
        let trimmed = inner.trim();
        let hasMath = /[\\[\]{}_^=<>+*/±∓≠≤≥∈∉⊂⊃∪∩∫∑lim]/.test(trimmed);
        let hasVn = vnHasAccentRegex.test(trimmed) || /\b(với|mọi|khi|ta có|suy ra|do đó|thỏa mãn|đồng biến|nghịch biến)\b/i.test(trimmed);

        if (hasVn && !trimmed.includes('\\text')) {
            if (!hasMath) {
                // Pure Vietnamese sentence wrapped in $ -> strip outer $
                return trimmed;
            } else {
                // Math with raw Vietnamese words -> wrap Vietnamese phrases in \text{...}
                let fixed = trimmed.replace(/([àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúũụưứừửữựỳýỷỹỵa-zA-ZÀ-ỹ\s]+)/gi, (w) => {
                    let wt = w.trim();
                    if (vnHasAccentRegex.test(wt) || /\b(với|mọi|khi|ta có|suy ra|do đó|thỏa mãn|đồng biến|nghịch biến)\b/i.test(wt)) {
                        return `\\text{ ${wt} }`;
                    }
                    return w;
                });
                return `$${fixed}$`;
            }
        }
        return match;
    });

    // 7. Auto-fix missing backslashes for common TeX symbols when preceded by whitespace/start
    s = s.replace(/(?<![a-zA-Z\\])(cdot|frac|sqrt|infty|mathbb|setminus|nearrow|searrow|neq|perp|parallel|Leftrightarrow|Rightarrow|rightarrow|Leftarrow|leftarrow|angle|triangle|notin|subset|cap|cup|alpha|beta|gamma|delta|pi|theta|phi|omega|vec|overline|underline)(?![a-zA-Z])/g, '\\$1');

    // 8. Restore Code blocks
    s = s.replace(/___CODE_BLOCK_(\d+)___/g, (match, idx) => codeBlocks[parseInt(idx, 10)]);

    // 9. Restore SVG blocks
    s = s.replace(/___SVG_BLOCK_(\d+)___/g, (match, idx) => svgBlocks[parseInt(idx, 10)]);

    return s;
}

/**
 * Remove prefixes like "Câu 12: ", "Bài 3. " from question text
 */
function stripQuestionPrefix(text) {
    if (!text) return "";
    return String(text).replace(/^(?:Câu|Bài)\s*\d+[\.\:]\s*/i, '');
}

/**
 * Remove prefixes like "A. ", "B) " from option text
 */
function stripOptionPrefix(text) {
    if (!text) return "";
    return String(text).replace(/^[A-D][\.\:\)]\s*/i, '');
}

/**
 * Render Markdown safely without corrupting LaTeX math syntax.
 */
function parseMarkdownSafe(text, isInline = false) {
    if (!text || typeof text !== 'string') return '';

    let cleaned = sanitizeMathText(text);

    // Support highlight syntax: ==highlight text== -> <mark class="bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-bold">highlight text</mark>
    cleaned = cleaned.replace(/==([^=\n]+)==/g, '<mark class="bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-md font-bold shadow-2xs">$1</mark>');

    // Protect all Math blocks ($$, \[\], \(\), and $...$) and SVGs before passing to marked parser
    let mathBlocks = [];
    let placeholderText = cleaned.replace(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$[^$\n]+?(?<!\\)\$|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\}|\\left\\?\{[\s\S]*?\\right(?:\.|\\[.}]|))/gi, (match) => {
        mathBlocks.push(match);
        return `@@@MATH_BLOCK_${mathBlocks.length - 1}@@@`;
    });

    let html = placeholderText;
    if (typeof marked !== 'undefined') {
        try {
            if (isInline && marked.parseInline) {
                html = marked.parseInline(placeholderText);
            } else if (marked.parse) {
                html = marked.parse(placeholderText, { breaks: true, gfm: true });
            }
        } catch(e) {
            console.warn("Markdown parse error:", e);
            html = placeholderText;
        }
    }

    // Restore Math blocks
    html = html.replace(/@@@MATH_BLOCK_(\d+)@@@/g, (match, idx) => mathBlocks[parseInt(idx, 10)] || '');
    return html;
}

/**
 * Format mathematical explanation scientifically with clear line breaks, spacing, and structure.
 */
function formatExplanation(text) {
    if (!text || typeof text !== 'string') return '';

    let sanitized = sanitizeMathText(text);

    // CRITICAL: Protect all Math blocks ($$, \[\], \(\), $...$) and SVGs before formatting text and splitting lines!
    let mathBlocks = [];
    let hidden = sanitized.replace(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$[^$\n]+?(?<!\\)\$|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\})/gi, (match) => {
        mathBlocks.push(match);
        return `___MATH_SAFE_${mathBlocks.length - 1}___`;
    });

    // If explanation does not already have double newlines, insert structured line breaks
    if (!hidden.includes('\n\n')) {
        // 1. Break before structured question items:
        hidden = hidden.replace(/(?:([.;?!])\s*|^)(Ý\s*[a-d1-4][):.]|Mệnh đề\s*[a-d1-4][):.]|\([a-d]\)|[a-d]\))\s*/gim, (m, p1, p2) => {
            return (p1 ? p1 + '\n\n' : '') + p2 + ' ';
        });
        
        // 2. Break before distinct bullet points (• or - followed by space)
        hidden = hidden.replace(/(?:([.;?!])\s*|^)([•]\s*|[-]\s+)/g, (m, p1, p2) => {
            return (p1 ? p1 + '\n\n' : '') + p2;
        });

        // 3. Break before logical transition phrases ONLY when preceded by sentence-ending punctuation (.;?!)
        hidden = hidden.replace(/([.;?!])\s*(Ta có|Tại|Thay|Vận tốc|Gia tốc|Quãng đường|Khi đó|Do đó|Suy ra|Bảng biến thiên|Xét hàm|Tập xác định|Điều kiện|Kết luận|Lời giải|Phương trình|Hệ phương trình|Bất phương trình)\b/g, '$1\n\n$2');
        
        // 4. Break before "Xét ý a", "Xét ý b"
        hidden = hidden.replace(/([.;?!])\s*(Xét\s+ý\s+[a-d])/gi, '$1\n\n$2');
    }

    // Split lines, trim, and rejoin with double newlines
    let lines = hidden.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let mdText = lines.join('\n\n');

    // Restore protected math blocks
    mdText = mdText.replace(/___MATH_SAFE_(\d+)___/g, (match, idx) => mathBlocks[parseInt(idx, 10)] || '');

    return parseMarkdownSafe(mdText, false);
}
