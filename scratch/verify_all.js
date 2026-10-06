const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = 'd:\\APP\\hungdt_v3';

const htmlFiles = ['index.html', 'student.html', 'teacher.html', 'bang_trang.html'];
const jsDir = path.join(rootDir, 'js');
const cssDir = path.join(rootDir, 'css');

console.log('=== 1. CHECKING MISSING SCRIPT AND CSS REFERENCES IN HTML ===');

const htmlContents = {};
const htmlIds = {};
const htmlScripts = {};
const definedFunctions = new Set();

// Gather all function names from JS files using regex
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
const jsContents = {};

jsFiles.forEach(file => {
    const fullPath = path.join(jsDir, file);
    const code = fs.readFileSync(fullPath, 'utf8');
    jsContents[file] = code;

    // Standard function declaration: function funcName(...)
    const fnRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
    let match;
    while ((match = fnRegex.exec(code)) !== null) {
        definedFunctions.add(match[1]);
    }

    // Window properties: window.funcName = ...
    const winRegex = /window\.([a-zA-Z0-9_$]+)\s*=/g;
    while ((match = winRegex.exec(code)) !== null) {
        definedFunctions.add(match[1]);
    }

    // Const/let/var function assignments: const funcName = function... or const funcName = (...) =>
    const varFnRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>|\w+\s*=>)/g;
    while ((match = varFnRegex.exec(code)) !== null) {
        definedFunctions.add(match[1]);
    }
});

console.log(`Extracted ${definedFunctions.size} global function/variable declarations across JS files.`);

htmlFiles.forEach(htmlFile => {
    const filePath = path.join(rootDir, htmlFile);
    if (!fs.existsSync(filePath)) {
        console.error(`ERROR: ${htmlFile} does not exist!`);
        return;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    htmlContents[htmlFile] = html;

    // Check script tags
    const scriptSrcRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
    let match;
    const loadedScripts = [];
    while ((match = scriptSrcRegex.exec(html)) !== null) {
        const src = match[1];
        loadedScripts.push(src);
        const cleanSrc = src.split('?')[0];
        if (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://') || cleanSrc.startsWith('//')) {
            // External CDN
            continue;
        }
        const targetPath = path.join(rootDir, cleanSrc.replace(/\//g, path.sep));
        if (!fs.existsSync(targetPath)) {
            console.error(`[${htmlFile}] BROKEN SCRIPT LINK: ${src} (File not found)`);
        }
    }
    htmlScripts[htmlFile] = loadedScripts;

    // Check CSS links
    const cssLinkRegex = /<link\s+[^>]*href=["']([^"']+)["']/gi;
    while ((match = cssLinkRegex.exec(html)) !== null) {
        const href = match[1];
        const cleanHref = href.split('?')[0];
        if (cleanHref.startsWith('http://') || cleanHref.startsWith('https://') || cleanHref.startsWith('//') || cleanHref.startsWith('data:')) {
            continue;
        }
        const targetPath = path.join(rootDir, cleanHref.replace(/\//g, path.sep));
        if (!fs.existsSync(targetPath)) {
            console.error(`[${htmlFile}] BROKEN CSS LINK: ${href} (File not found)`);
        }
    }

    // Extract all element IDs and check for duplicate IDs
    const idRegex = /\sid=["']([^"']+)["']/gi;
    const ids = new Set();
    const duplicateIds = new Set();
    while ((match = idRegex.exec(html)) !== null) {
        const id = match[1];
        if (ids.has(id)) {
            duplicateIds.add(id);
        } else {
            ids.add(id);
        }
    }
    htmlIds[htmlFile] = ids;

    if (duplicateIds.size > 0) {
        console.warn(`[${htmlFile}] DUPLICATE IDs found (${duplicateIds.size}):`, Array.from(duplicateIds));
    }
});

console.log('\n=== 2. CHECKING INLINE EVENT HANDLERS IN HTML ===');

htmlFiles.forEach(htmlFile => {
    const html = htmlContents[htmlFile];
    if (!html) return;

    // Extract inline event handlers: onclick="funcName(...)" etc.
    const handlerRegex = /\son[a-z]+=["']([^"']+)["']/gi;
    let match;
    const missingHandlers = [];

    while ((match = handlerRegex.exec(html)) !== null) {
        const handlerExpr = match[1].trim();
        // Skip simple inline statements like "this.style...", "return false", "location.href=..."
        if (handlerExpr.includes(';') && !handlerExpr.includes('(')) continue;

        // Find initial function name called
        const fnCallMatch = handlerExpr.match(/^([a-zA-Z0-9_$]+)\s*\(/);
        if (fnCallMatch) {
            const fnName = fnCallMatch[1];
            // Ignore built-ins or common globals
            if (['alert', 'confirm', 'prompt', 'console', 'preventDefault', 'stopPropagation', 'close', 'open', 'event'].includes(fnName)) continue;
            
            if (!definedFunctions.has(fnName)) {
                // Check inline script blocks in HTML as well
                const inlineScriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
                let foundInInline = false;
                let sMatch;
                while ((sMatch = inlineScriptRegex.exec(html)) !== null) {
                    if (sMatch[1].includes(fnName)) {
                        foundInInline = true;
                        break;
                    }
                }
                if (!foundInInline) {
                    missingHandlers.push({ fnName, expr: handlerExpr });
                }
            }
        }
    }

    if (missingHandlers.length > 0) {
        console.error(`[${htmlFile}] MISSING EVENT HANDLERS (${missingHandlers.length}):`);
        missingHandlers.forEach(h => console.error(`   - Function '${h.fnName}' in expression: ${h.expr}`));
    } else {
        console.log(`[${htmlFile}] All inline event handlers resolved successfully.`);
    }
});

console.log('\n=== 3. CHECKING DOM ELEMENT REFERENCES (getElementById / querySelector) ===');

jsFiles.forEach(file => {
    const code = jsContents[file];
    
    // getElementById
    const getElemRegex = /document\.getElementById\s*\(\s*["']([^"']+)["']\s*\)/g;
    let match;
    const missingIdsMap = {};

    while ((match = getElemRegex.exec(code)) !== null) {
        const id = match[1];
        // Ignore dynamic template strings or common dynamic patterns
        if (id.includes('${') || id.includes('+')) continue;

        // Check which HTML file loads this JS file, and verify if ID exists
        htmlFiles.forEach(htmlFile => {
            const loadedScripts = htmlScripts[htmlFile] || [];
            const isLoaded = loadedScripts.some(s => s.endsWith(file));
            if (isLoaded) {
                const ids = htmlIds[htmlFile];
                if (ids && !ids.has(id)) {
                    if (!missingIdsMap[htmlFile]) missingIdsMap[htmlFile] = new Set();
                    missingIdsMap[htmlFile].add(id);
                }
            }
        });
    }

    Object.keys(missingIdsMap).forEach(htmlFile => {
        const missing = Array.from(missingIdsMap[htmlFile]);
        // Filter out IDs that might be created dynamically in JS
        const dynamicIdCreated = missing.filter(id => {
            const createRegex = new RegExp(`id=["'\\\`]?${id}["'\\\`]?|setAttribute\\(['"]id['"],\\s*['"]${id}['"]\\)`);
            return !createRegex.test(code);
        });
        if (dynamicIdCreated.length > 0) {
            console.warn(`[${file} -> ${htmlFile}] References non-existent DOM element IDs (${dynamicIdCreated.length}):`, dynamicIdCreated.slice(0, 15));
        }
    });
});

console.log('\n=== 4. CHECKING JS RUNTIME ERRORS & SYNTAX IN VARIOUS PLACES ===');

// Check JSON parse strings inside JS
jsFiles.forEach(file => {
    const code = jsContents[file];
    const jsonParseRegex = /JSON\.parse\s*\(\s*["']([^"']+)["']\s*\)/g;
    let match;
    while ((match = jsonParseRegex.exec(code)) !== null) {
        try {
            JSON.parse(match[1]);
        } catch (e) {
            console.error(`[${file}] INVALID HARDCODED JSON PARSE: "${match[1]}" -> ${e.message}`);
        }
    }
});

console.log('=== VERIFICATION COMPLETED ===');
