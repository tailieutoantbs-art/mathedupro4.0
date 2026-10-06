// theme.js - Global Theme, Typography, Font Scaling & Display Engine for EduMath TBS

// Safe Storage Helper to prevent crash on ByetHost / sandboxed / cookie-restricted environments
const SafeStorage = {
    _mem: {},
    getItem(key, fallback = null) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                let val = window.localStorage.getItem(key);
                return val !== null ? val : fallback;
            }
        } catch (e) {
            console.warn('[SafeStorage] localStorage read blocked, using fallback memory:', e);
        }
        return this._mem[key] !== undefined ? this._mem[key] : fallback;
    },
    setItem(key, value) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, String(value));
            }
        } catch (e) {
            console.warn('[SafeStorage] localStorage write blocked, caching in memory:', e);
        }
        this._mem[key] = String(value);
    },
    removeItem(key) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } catch (e) {
            console.warn('[SafeStorage] localStorage remove blocked:', e);
        }
        delete this._mem[key];
    }
};

const APP_FONT_SCALES = [0.85, 1.0, 1.15, 1.3, 1.5];

function applyThemeFromStorage() {
    try {
        // 1. Color Theme
        let main = SafeStorage.getItem('themeMain');
        let dark = SafeStorage.getItem('themeDark');
        let light = SafeStorage.getItem('themeLight');
        if (main) {
            document.documentElement.style.setProperty('--color-main', main);
            document.documentElement.style.setProperty('--color-main-glow', main + '55');
        }
        if (dark) {
            document.documentElement.style.setProperty('--color-main-dark', dark);
        }
        if (light) {
            document.documentElement.style.setProperty('--color-main-light', light);
        }

        // 2. Font Scale
        let fontScale = parseFloat(SafeStorage.getItem('appFontScale', '1.0'));
        if (isNaN(fontScale) || fontScale < 0.7) fontScale = 1.0;
        document.documentElement.style.setProperty('--app-font-scale', fontScale);
        updateFontScaleUI(fontScale);

        // 3. Font Family
        let fontFamily = SafeStorage.getItem('appFontFamily', 'vietnam');
        document.documentElement.setAttribute('data-font', fontFamily);

        // 4. Display Mode (Light / Dark)
        let displayMode = SafeStorage.getItem('appDisplayMode', 'light');
        document.documentElement.setAttribute('data-display-mode', displayMode);
        updateDarkModeUI(displayMode === 'dark');
    } catch (err) {
        console.error('[Theme] Error applying theme from storage:', err);
    }
}

// Apply immediately on parse
if (typeof document !== 'undefined') {
    applyThemeFromStorage();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyThemeFromStorage);
    }
}

/**
 * Change Font Scaling by delta (-1 or +1)
 */
function changeAppFontSize(delta) {
    try {
        let currentScale = parseFloat(SafeStorage.getItem('appFontScale', '1.0'));
        let currentIdx = APP_FONT_SCALES.findIndex(s => Math.abs(s - currentScale) < 0.05);
        if (currentIdx === -1) currentIdx = 1;

        let nextIdx = currentIdx + delta;
        if (nextIdx < 0) nextIdx = 0;
        if (nextIdx >= APP_FONT_SCALES.length) nextIdx = APP_FONT_SCALES.length - 1;

        let nextScale = APP_FONT_SCALES[nextIdx];
        setAppFontScale(nextScale, false);
    } catch (e) {
        console.error('[Theme] Error changing font size:', e);
    }
}

/**
 * Direct font scale setter
 */
function setAppFontScale(scale, silent = false) {
    try {
        scale = parseFloat(scale);
        if (isNaN(scale) || scale < 0.7) scale = 1.0;
        SafeStorage.setItem('appFontScale', scale);
        document.documentElement.style.setProperty('--app-font-scale', scale);
        updateFontScaleUI(scale);
        if (typeof window !== 'undefined' && window.triggerMathJax) {
            window.triggerMathJax();
        }
        if (!silent && typeof showToast === 'function') {
            showToast(`🔍 Cỡ chữ: ${Math.round(scale * 100)}%`);
        }
    } catch (e) {
        console.error('[Theme] Error setting font scale:', e);
    }
}

function updateFontScaleUI(scale) {
    try {
        let displays = document.querySelectorAll('.font-scale-display, #font-scale-val, #modal-font-scale-text');
        displays.forEach(el => {
            el.innerText = `${Math.round(scale * 100)}%`;
        });

        // Update active state on preset scale buttons in modal if open
        document.querySelectorAll('.font-scale-preset-btn').forEach(btn => {
            let btnScale = parseFloat(btn.getAttribute('data-scale') || '1.0');
            if (Math.abs(btnScale - scale) < 0.05) {
                btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600', 'shadow-md');
                btn.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
            } else {
                btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600', 'shadow-md');
                btn.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200');
            }
        });
    } catch (e) {}
}

/**
 * Change Font Family
 */
function setAppFontFamily(fontKey, silent = false) {
    try {
        SafeStorage.setItem('appFontFamily', fontKey);
        document.documentElement.setAttribute('data-font', fontKey);
        
        // Highlight active font option
        document.querySelectorAll('.font-family-btn').forEach(btn => {
            if (btn.getAttribute('data-font-key') === fontKey) {
                btn.classList.add('border-indigo-600', 'bg-indigo-50/50', 'ring-2', 'ring-indigo-200');
                btn.classList.remove('border-slate-200');
            } else {
                btn.classList.remove('border-indigo-600', 'bg-indigo-50/50', 'ring-2', 'ring-indigo-200');
                btn.classList.add('border-slate-200');
            }
        });

        if (!silent && typeof showToast === 'function') {
            let fontName = fontKey === 'times' ? 'Times New Roman (Sách giáo khoa)' : (fontKey === 'montserrat' ? 'Montserrat' : 'Be Vietnam Pro (Hiện đại)');
            showToast(`🔤 Phông chữ: ${fontName}`);
        }
    } catch (e) {
        console.error('[Theme] Error setting font family:', e);
    }
}

/**
 * Toggle Dark Mode
 */
function toggleAppDarkMode() {
    try {
        let current = SafeStorage.getItem('appDisplayMode', 'light');
        let next = current === 'dark' ? 'light' : 'dark';
        SafeStorage.setItem('appDisplayMode', next);
        document.documentElement.setAttribute('data-display-mode', next);
        updateDarkModeUI(next === 'dark');

        if (typeof showToast === 'function') {
            showToast(next === 'dark' ? '🌙 Đã bật Chế độ Ban Đêm / Tương Phản Cao' : '☀️ Đã bật Chế độ Sáng Chuẩn');
        }
    } catch (e) {
        console.error('[Theme] Error toggling dark mode:', e);
    }
}

function updateDarkModeUI(isDark) {
    try {
        let icons = document.querySelectorAll('.dark-mode-icon');
        icons.forEach(ic => {
            ic.className = `dark-mode-icon fa-solid ${isDark ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'}`;
        });
        let texts = document.querySelectorAll('.dark-mode-text');
        texts.forEach(tx => {
            tx.innerText = isDark ? 'Chế độ Sáng Chuẩn' : 'Chế độ Tối / Ban Đêm';
        });
    } catch (e) {}
}

/**
 * Set Color Theme
 */
function setTheme(main, dark, light) {
    try {
        SafeStorage.setItem('themeMain', main);
        SafeStorage.setItem('themeDark', dark);
        SafeStorage.setItem('themeLight', light);
        applyThemeFromStorage();
        if (typeof showToast === 'function') {
            showToast("🎨 Đã áp dụng giao diện màu mới!");
        }
    } catch (e) {
        console.error('[Theme] Error setting theme:', e);
    }
}

function toggleThemePicker(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const m = document.getElementById('theme-picker-menu');
    if (m) m.classList.toggle('hidden');
}

/**
 * Open Display & Typography Customizer Modal (Scientifically centered, fully scrollable & responsive)
 */
function openDisplayCustomizerModal() {
    try {
        let modal = document.getElementById('display-customizer-modal');
        if (!modal) {
            let div = document.createElement('div');
            div.id = 'display-customizer-modal';
            div.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto fade-in';
            div.style.cssText = 'position:fixed!important;inset:0!important;z-index:9999999!important;display:flex!important;align-items:center!important;justify-content:center!important;background-color:rgba(15,23,42,0.75)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;padding:12px;overflow-y:auto;';
            div.innerHTML = `
                <div class="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border-2 border-slate-100 zoom-in flex flex-col space-y-4 max-h-[90vh] overflow-y-auto admin-scroll my-auto relative z-10" style="position:relative;z-index:10000000;">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3 sticky top-0 bg-white/95 backdrop-blur z-10">
                        <div class="flex items-center gap-2.5">
                            <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-black shrink-0"><i class="fa-solid fa-sliders"></i></div>
                            <div>
                                <h3 class="font-black text-slate-800 text-sm sm:text-base uppercase tracking-wide">TÙY BIẾN HIỂN THỊ & PHÔNG CHỮ</h3>
                                <p class="text-[11px] font-bold text-slate-400">Cỡ chữ • Phông chữ • Màu sắc • Chế độ tối</p>
                            </div>
                        </div>
                        <button onclick="closeDisplayCustomizerModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center text-base transition shrink-0"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <!-- 1. Font Size Scale Quick Presets -->
                    <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                        <label class="block text-xs font-black text-slate-700 uppercase mb-2 flex items-center justify-between">
                            <span class="flex items-center gap-1.5"><i class="fa-solid fa-text-height text-indigo-600"></i> Cỡ chữ & Thu phóng bài thi:</span>
                            <span id="modal-font-scale-text" class="text-xs bg-indigo-100 text-indigo-800 font-mono px-2.5 py-0.5 rounded-lg font-black font-scale-display">100%</span>
                        </label>
                        <div class="grid grid-cols-5 gap-1.5 mb-2.5">
                            <button onclick="setAppFontScale(0.85)" data-scale="0.85" class="font-scale-preset-btn py-2 rounded-xl border text-xs font-black transition text-center">85%</button>
                            <button onclick="setAppFontScale(1.0)" data-scale="1.0" class="font-scale-preset-btn py-2 rounded-xl border text-xs font-black transition text-center">100%</button>
                            <button onclick="setAppFontScale(1.15)" data-scale="1.15" class="font-scale-preset-btn py-2 rounded-xl border text-xs font-black transition text-center">115%</button>
                            <button onclick="setAppFontScale(1.3)" data-scale="1.3" class="font-scale-preset-btn py-2 rounded-xl border text-xs font-black transition text-center">130%</button>
                            <button onclick="setAppFontScale(1.5)" data-scale="1.5" class="font-scale-preset-btn py-2 rounded-xl border text-xs font-black transition text-center">150%</button>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="changeAppFontSize(-1)" class="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 shadow-2xs btn-3d"><i class="fa-solid fa-minus mr-1"></i> Nhỏ hơn (A-)</button>
                            <button onclick="changeAppFontSize(1)" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-2xs btn-3d"><i class="fa-solid fa-plus mr-1"></i> Lớn hơn (A+)</button>
                        </div>
                    </div>

                    <!-- 2. Font Family Selection -->
                    <div>
                        <label class="block text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-font text-indigo-600"></i> Kiểu phông chữ:
                        </label>
                        <div class="grid grid-cols-3 gap-2">
                            <button onclick="setAppFontFamily('vietnam')" data-font-key="vietnam" class="font-family-btn p-3 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 font-bold text-xs text-slate-700 transition flex flex-col items-center gap-1 text-center bg-white shadow-2xs" style="font-family: 'Be Vietnam Pro', sans-serif;">
                                <span class="text-base font-black text-indigo-600">Aa</span>
                                <span class="font-black">Be Vietnam</span>
                                <span class="text-[10px] text-slate-400 font-normal">Hiện đại chuẩn</span>
                            </button>
                            <button onclick="setAppFontFamily('times')" data-font-key="times" class="font-family-btn p-3 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 font-bold text-xs text-slate-700 transition flex flex-col items-center gap-1 text-center bg-white shadow-2xs" style="font-family: 'Times New Roman', serif;">
                                <span class="text-base font-black text-indigo-600">Aa</span>
                                <span class="font-black">Times Roman</span>
                                <span class="text-[10px] text-slate-400 font-normal">Sách giáo khoa</span>
                            </button>
                            <button onclick="setAppFontFamily('montserrat')" data-font-key="montserrat" class="font-family-btn p-3 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 font-bold text-xs text-slate-700 transition flex flex-col items-center gap-1 text-center bg-white shadow-2xs" style="font-family: 'Montserrat', sans-serif;">
                                <span class="text-base font-black text-indigo-600">Aa</span>
                                <span class="font-black">Montserrat</span>
                                <span class="text-[10px] text-slate-400 font-normal">Nét dày rõ</span>
                            </button>
                        </div>
                    </div>

                    <!-- 3. Dark Mode / Light Mode -->
                    <div>
                        <label class="block text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-half-stroke text-indigo-600"></i> Chế độ màu nền & Độ tương phản:
                        </label>
                        <button onclick="toggleAppDarkMode()" class="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-xs text-slate-700 transition flex items-center justify-between border border-slate-200 shadow-2xs">
                            <span class="flex items-center gap-2.5"><i class="dark-mode-icon fa-solid fa-moon text-indigo-600 text-lg"></i> <span class="dark-mode-text font-bold">Chế độ Tối / Ban Đêm</span></span>
                            <span class="text-[10px] bg-white px-2.5 py-1 rounded-lg border border-slate-300 font-black text-indigo-700 shadow-2xs">Chuyển đổi</span>
                        </button>
                    </div>

                    <!-- 4. Color Palettes -->
                    <div>
                        <label class="block text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                            <i class="fa-solid fa-palette text-indigo-600"></i> Gam màu chủ đạo giao diện:
                        </label>
                        <div class="grid grid-cols-6 gap-2">
                            <button onclick="setTheme('#0ea5e9', '#0284c7', '#e0f2fe')" class="h-10 rounded-2xl bg-[#0ea5e9] shadow-sm hover:scale-105 active:scale-95 transition-transform border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white text-xs font-black" title="Xanh Dương (Sky)">💧</button>
                            <button onclick="setTheme('#10b981', '#059669', '#d1fae5')" class="h-10 rounded-2xl bg-[#10b981] shadow-sm hover:scale-105 active:scale-95 transition-transform border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white text-xs font-black" title="Xanh Lục (Emerald)">🌿</button>
                            <button onclick="setTheme('#8b5cf6', '#6d28d9', '#ede9fe')" class="h-10 rounded-2xl bg-[#8b5cf6] shadow-sm hover:scale-105 active:scale-95 transition-transform border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white text-xs font-black" title="Tím (Purple)">🔮</button>
                            <button onclick="setTheme('#f43f5e', '#e11d48', '#ffe4e6')" class="h-10 rounded-2xl bg-[#f43f5e] shadow-sm hover:scale-105 active:scale-95 transition-transform border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white text-xs font-black" title="Đỏ Hoa Hồng (Rose)">🌺</button>
                            <button onclick="setTheme('#f59e0b', '#d97706', '#fef3c7')" class="h-10 rounded-2xl bg-[#f59e0b] shadow-sm hover:scale-105 active:scale-95 transition-transform border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white text-xs font-black" title="Vàng Ánh Kim (Amber)">⭐</button>
                            <button onclick="setTheme('#4f46e5', '#3730a3', '#e0e7ff')" class="h-10 rounded-2xl bg-[#4f46e5] shadow-sm hover:scale-105 active:scale-95 transition-transform border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-white text-xs font-black" title="Xanh Indigo (Chuẩn)">💎</button>
                        </div>
                    </div>

                    <div class="pt-2 sticky bottom-0 bg-white/95 backdrop-blur pb-1">
                        <button onclick="closeDisplayCustomizerModal()" class="w-full py-3 bg-slate-800 text-white font-black rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-900 transition shadow-md btn-3d">Đóng & Hoàn Tất</button>
                    </div>
                </div>
            `;
            document.body.appendChild(div);
            modal = div;

            // Close when clicking outside the dialog card
            div.addEventListener('click', (e) => {
                if (e.target === div) closeDisplayCustomizerModal();
            });
        } else {
            document.body.appendChild(modal);
        }
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        let curScale = parseFloat(SafeStorage.getItem('appFontScale', '1.0'));
        updateFontScaleUI(curScale);
        let curFont = SafeStorage.getItem('appFontFamily', 'vietnam');
        setAppFontFamily(curFont, true);
    } catch (e) {
        console.error('[Theme] Error opening display customizer modal:', e);
    }
}

function closeDisplayCustomizerModal() {
    try {
        let modal = document.getElementById('display-customizer-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    } catch (e) {}
}

// Global click listener to close menus when clicking outside
document.addEventListener('click', (e) => {
    const m = document.getElementById('theme-picker-menu');
    if (m && !m.classList.contains('hidden') && !e.target.closest('#theme-picker-menu') && !e.target.closest('button[onclick*="toggleThemePicker"]')) {
        m.classList.add('hidden');
    }
});

// Explicit Global Attachment to window to prevent ReferenceError across any host/iframe/sandbox
if (typeof window !== 'undefined') {
    window.SafeStorage = SafeStorage;
    window.applyThemeFromStorage = applyThemeFromStorage;
    window.changeAppFontSize = changeAppFontSize;
    window.setAppFontScale = setAppFontScale;
    window.updateFontScaleUI = updateFontScaleUI;
    window.setAppFontFamily = setAppFontFamily;
    window.toggleAppDarkMode = toggleAppDarkMode;
    window.updateDarkModeUI = updateDarkModeUI;
    window.setTheme = setTheme;
    window.toggleThemePicker = toggleThemePicker;
    window.openDisplayCustomizerModal = openDisplayCustomizerModal;
    window.closeDisplayCustomizerModal = closeDisplayCustomizerModal;
}

