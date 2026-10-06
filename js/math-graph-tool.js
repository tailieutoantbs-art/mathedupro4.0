/**
 * MATH VISUAL STUDIO - HỆ THỐNG VẼ ĐỒ THỊ, BẢNG BIẾN THIÊN & HÌNH HỌC TOÁN HỌC
 * Hỗ trợ tạo SVG đồ thị Oxy, Bảng biến thiên, Hình học 2D/3D và tùy chỉnh kích thước linh hoạt
 */

(function(window) {
    'use strict';

    // State lưu cấu hình hiện tại của công cụ
    const MathStudioState = {
        activeTab: 'graph', // 'graph' | 'bbt' | 'geo3d' | 'geo2d' | 'custom'
        targetInputId: 'edit-q-text',
        
        // Cấu hình Kích thước & Trình bày
        layout: {
            widthType: '400', // '250', '320', '400', '500', '100%', 'custom'
            customWidth: 420,
            alignment: 'center', // 'center', 'left', 'right'
            hasBorder: true,
            hasBg: true
        },

        // Cấu hình Đồ thị Oxy
        graph: {
            type: 'bac3', // 'bac1', 'bac2', 'bac3', 'trungphuong', 'nhatbien', 'phanthuc21', 'sin', 'cos', 'custom'
            a: 1, b: 0, c: -3, d: 1, e: 1,
            xMin: -4, xMax: 4,
            yMin: -4, yMax: 4,
            color: '#2563eb', // Blue
            showGrid: true,
            showAsymptotes: true,
            showPoints: true,
            showLabels: true,
            customExpr: 'x^3 - 3*x + 1'
        },

        // Cấu hình Bảng Biến Thiên
        bbt: {
            type: 'bac3', // 'bac3', 'trungphuong', 'nhatbien', 'phanthuc21', 'bac2', 'custom'
            xCols: '-∞, -1, 1, +∞',
            yPrimeSigns: '+, 0, -, 0, +',
            yValues: '-∞, 3, -1, +∞',
            arrows: 'up, down, up',
            customLatex: ''
        },

        // Cấu hình Hình Học Không Gian 3D
        geo3d: {
            type: 'pyramid_quad', // 'pyramid_tri', 'pyramid_quad', 'prism_tri', 'box', 'cube', 'cone', 'cylinder', 'sphere', 'oxyz'
            vertexLabels: 'S, A, B, C, D',
            showHeight: true,
            showHiddenLines: true
        },

        // Cấu hình Hình Học Phẳng 2D
        geo2d: {
            type: 'triangle_right', // 'triangle_right', 'triangle_equi', 'circle_tangent', 'quad_trap', 'parallelogram'
            labels: 'A, B, C, H'
        },

        // Mã tùy chỉnh hoặc kết quả SVG/LaTeX
        customCode: ''
    };

    // Khởi tạo công cụ
    function initMathStudio() {
        // Gắn listener nếu cần
    }

    // Mở Studio
    function openMathGraphStudio(targetId = 'edit-q-text') {
        MathStudioState.targetInputId = targetId || 'edit-q-text';
        let modal = document.getElementById('math-studio-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        renderStudioCurrentTab();
        updateStudioPreview();
    }

    // Đóng Studio
    function closeMathStudio() {
        let modal = document.getElementById('math-studio-modal');
        if (modal) modal.classList.add('hidden');
    }

    // Chuyển Tab
    function setStudioTab(tab) {
        MathStudioState.activeTab = tab;
        ['graph', 'bbt', 'geo3d', 'geo2d', 'custom'].forEach(t => {
            let btn = document.getElementById(`studio-tab-btn-${t}`);
            let pane = document.getElementById(`studio-tab-pane-${t}`);
            if (btn) {
                if (t === tab) {
                    btn.className = "px-4 py-2.5 rounded-xl font-black text-xs md:text-sm bg-sky-600 text-white shadow-md flex items-center gap-2 transition";
                } else {
                    btn.className = "px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition";
                }
            }
            if (pane) {
                if (t === tab) pane.classList.remove('hidden');
                else pane.classList.add('hidden');
            }
        });

        updateStudioPreview();
    }

    // Cập nhật giá trị kích thước
    function setStudioWidth(type, val = null) {
        MathStudioState.layout.widthType = type;
        if (val) MathStudioState.layout.customWidth = parseInt(val) || 400;
        
        let customInput = document.getElementById('studio-custom-width-input');
        if (customInput) {
            if (type === 'custom') customInput.classList.remove('hidden');
            else customInput.classList.add('hidden');
        }

        ['250', '320', '400', '500', '100%', 'custom'].forEach(w => {
            let btn = document.getElementById(`studio-width-btn-${w}`);
            if (btn) {
                if (w === type) {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-black bg-amber-500 text-white shadow-xs";
                } else {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200";
                }
            }
        });

        updateStudioPreview();
    }

    // Cập nhật căn lề
    function setStudioAlign(align) {
        MathStudioState.layout.alignment = align;
        ['left', 'center', 'right'].forEach(a => {
            let btn = document.getElementById(`studio-align-btn-${a}`);
            if (btn) {
                if (a === align) {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-black bg-indigo-600 text-white shadow-xs";
                } else {
                    btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200";
                }
            }
        });

        updateStudioPreview();
    }

    // Toggle Khung / Nền
    function toggleStudioBoxOption(key) {
        if (key === 'border') MathStudioState.layout.hasBorder = !MathStudioState.layout.hasBorder;
        if (key === 'bg') MathStudioState.layout.hasBg = !MathStudioState.layout.hasBg;
        updateStudioPreview();
    }

    // =========================================================================
    // 1. THUẬT TOÁN SINH ĐỒ THỊ HÀM SỐ (SVG GRAPH PLOTTER)
    // =========================================================================
    function generateFunctionGraphSVG() {
        let g = MathStudioState.graph;
        let svgW = 420, svgH = 340;
        let pad = 35;
        let xMin = parseFloat(g.xMin) || -4;
        let xMax = parseFloat(g.xMax) || 4;
        let yMin = parseFloat(g.yMin) || -4;
        let yMax = parseFloat(g.yMax) || 4;

        if (xMax <= xMin) xMax = xMin + 1;
        if (yMax <= yMin) yMax = yMin + 1;

        // Hàm chuyển đổi tọa độ thực -> tọa độ SVG
        function toSvgX(x) {
            return pad + ((x - xMin) / (xMax - xMin)) * (svgW - 2 * pad);
        }
        function toSvgY(y) {
            return svgH - pad - ((y - yMin) / (yMax - yMin)) * (svgH - 2 * pad);
        }

        let oX = toSvgX(0);
        let oY = toSvgY(0);

        // Kẹp gốc tọa độ hiển thị hợp lý
        let oX_clamped = Math.max(pad + 15, Math.min(svgW - pad - 15, oX));
        let oY_clamped = Math.max(pad + 15, Math.min(svgH - pad - 15, oY));

        let elements = [];

        // 1. Nền
        elements.push(`<rect width="${svgW}" height="${svgH}" fill="${MathStudioState.layout.hasBg ? '#f8fafc' : 'transparent'}" rx="12"/>`);

        // 2. Lưới Grid
        if (g.showGrid) {
            for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                if (x === 0) continue;
                let sx = toSvgX(x);
                elements.push(`<line x1="${sx}" y1="${pad}" x2="${sx}" y2="${svgH - pad}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>`);
            }
            for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
                if (y === 0) continue;
                let sy = toSvgY(y);
                elements.push(`<line x1="${pad}" y1="${sy}" x2="${svgW - pad}" y2="${sy}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>`);
            }
        }

        // 3. Trục tọa độ Ox, Oy
        // Trục Ox
        elements.push(`<line x1="${pad - 10}" y1="${oY_clamped}" x2="${svgW - pad + 15}" y2="${oY_clamped}" stroke="#334155" stroke-width="1.8"/>`);
        elements.push(`<polygon points="${svgW - pad + 15},${oY_clamped} ${svgW - pad + 6},${oY_clamped - 4} ${svgW - pad + 6},${oY_clamped + 4}" fill="#334155"/>`);
        elements.push(`<text x="${svgW - pad + 12}" y="${oY_clamped - 8}" font-size="13" font-weight="bold" fill="#334155" font-style="italic">x</text>`);

        // Trục Oy
        elements.push(`<line x1="${oX_clamped}" y1="${svgH - pad + 10}" x2="${oX_clamped}" y2="${pad - 15}" stroke="#334155" stroke-width="1.8"/>`);
        elements.push(`<polygon points="${oX_clamped},${pad - 15} ${oX_clamped - 4},${pad - 6} ${oX_clamped + 4},${pad - 6}" fill="#334155"/>`);
        elements.push(`<text x="${oX_clamped + 8}" y="${pad - 10}" font-size="13" font-weight="bold" fill="#334155" font-style="italic">y</text>`);

        // Gốc O
        elements.push(`<text x="${oX_clamped - 12}" y="${oY_clamped + 14}" font-size="12" font-weight="bold" fill="#475569">O</text>`);

        // Vạch chia trục Ox, Oy
        if (g.showLabels) {
            for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                if (x === 0) continue;
                let sx = toSvgX(x);
                elements.push(`<line x1="${sx}" y1="${oY_clamped - 3}" x2="${sx}" y2="${oY_clamped + 3}" stroke="#475569" stroke-width="1.2"/>`);
                elements.push(`<text x="${sx}" y="${oY_clamped + 13}" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">${x}</text>`);
            }
            for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
                if (y === 0) continue;
                let sy = toSvgY(y);
                elements.push(`<line x1="${oX_clamped - 3}" y1="${sy}" x2="${oX_clamped + 3}" y2="${sy}" stroke="#475569" stroke-width="1.2"/>`);
                elements.push(`<text x="${oX_clamped - 7}" y="${sy + 3.5}" font-size="10" font-weight="bold" fill="#64748b" text-anchor="end">${y}</text>`);
            }
        }

        // 4. Tính toán đường cong hàm số $f(x)$
        let f = function(x) {
            let a = parseFloat(g.a) || 0;
            let b = parseFloat(g.b) || 0;
            let c = parseFloat(g.c) || 0;
            let d = parseFloat(g.d) || 0;
            let e = parseFloat(g.e) || 1;

            if (g.type === 'bac1') return a * x + b;
            if (g.type === 'bac2') return a * x * x + b * x + c;
            if (g.type === 'bac3') return a * x * x * x + b * x * x + c * x + d;
            if (g.type === 'trungphuong') return a * Math.pow(x, 4) + b * x * x + c;
            if (g.type === 'nhatbien') {
                let denom = c * x + d;
                if (Math.abs(denom) < 1e-4) return null;
                return (a * x + b) / denom;
            }
            if (g.type === 'phanthuc21') {
                let denom = d * x + e;
                if (Math.abs(denom) < 1e-4) return null;
                return (a * x * x + b * x + c) / denom;
            }
            if (g.type === 'sin') return a * Math.sin(b * x + c) + d;
            if (g.type === 'cos') return a * Math.cos(b * x + c) + d;
            if (g.type === 'exp') return a * Math.pow(b || Math.E, x) + c;
            if (g.type === 'ln') return x > 0 ? a * Math.log(x) + b : null;
            return a * x * x * x + b * x + c;
        };

        // Vẽ Tiệm Cận nếu là hàm phân thức
        if (g.showAsymptotes) {
            if (g.type === 'nhatbien') {
                let cVal = parseFloat(g.c) || 1;
                let dVal = parseFloat(g.d) || 0;
                let aVal = parseFloat(g.a) || 1;
                if (cVal !== 0) {
                    let xTc = -dVal / cVal;
                    let yTc = aVal / cVal;
                    if (xTc >= xMin && xTc <= xMax) {
                        let sxTc = toSvgX(xTc);
                        elements.push(`<line x1="${sxTc}" y1="${pad}" x2="${sxTc}" y2="${svgH - pad}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4"/>`);
                        elements.push(`<text x="${sxTc + 4}" y="${pad + 15}" font-size="10" font-weight="bold" fill="#dc2626">x=${formatNumber(xTc)}</text>`);
                    }
                    if (yTc >= yMin && yTc <= yMax) {
                        let syTc = toSvgY(yTc);
                        elements.push(`<line x1="${pad}" y1="${syTc}" x2="${svgW - pad}" y2="${syTc}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4"/>`);
                        elements.push(`<text x="${svgW - pad - 40}" y="${syTc - 4}" font-size="10" font-weight="bold" fill="#dc2626">y=${formatNumber(yTc)}</text>`);
                    }
                }
            } else if (g.type === 'phanthuc21') {
                let dVal = parseFloat(g.d) || 1;
                let eVal = parseFloat(g.e) || 0;
                let aVal = parseFloat(g.a) || 1;
                let bVal = parseFloat(g.b) || 0;
                let cVal = parseFloat(g.c) || 0;

                // Tiệm cận đứng x = -e/d
                if (dVal !== 0) {
                    let xTc = -eVal / dVal;
                    if (xTc >= xMin && xTc <= xMax) {
                        let sxTc = toSvgX(xTc);
                        elements.push(`<line x1="${sxTc}" y1="${pad}" x2="${sxTc}" y2="${svgH - pad}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4"/>`);
                        elements.push(`<text x="${sxTc + 4}" y="${pad + 15}" font-size="10" font-weight="bold" fill="#dc2626">x=${formatNumber(xTc)}</text>`);
                    }

                    // Tiệm cận xiên y = (a/d)x + (b*d - a*e)/(d*d)
                    let slope = aVal / dVal;
                    let intercept = (bVal * dVal - aVal * eVal) / (dVal * dVal);
                    let x1 = xMin, y1 = slope * x1 + intercept;
                    let x2 = xMax, y2 = slope * x2 + intercept;
                    elements.push(`<line x1="${toSvgX(x1)}" y1="${toSvgY(y1)}" x2="${toSvgX(x2)}" y2="${toSvgY(y2)}" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4,4"/>`);
                    elements.push(`<text x="${toSvgX(xMax) - 55}" y="${toSvgY(y2) + 15}" font-size="10" font-weight="bold" fill="#16a34a">TCX</text>`);
                }
            }
        }

        // Vẽ các nhánh đồ thị
        let samples = 300;
        let step = (xMax - xMin) / samples;
        let paths = [];
        let currentPath = [];

        for (let i = 0; i <= samples; i++) {
            let x = xMin + i * step;
            let y = f(x);

            if (y === null || isNaN(y) || !isFinite(y) || y < yMin - 10 || y > yMax + 10) {
                if (currentPath.length > 1) paths.push(currentPath);
                currentPath = [];
                continue;
            }

            let sx = toSvgX(x);
            let sy = toSvgY(y);

            // Kẹp vào khung vẽ an toàn
            currentPath.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
        }
        if (currentPath.length > 1) paths.push(currentPath);

        paths.forEach(p => {
            let d = "M " + p.join(" L ");
            elements.push(`<path d="${d}" fill="none" stroke="${g.color || '#2563eb'}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`);
        });

        // 5. Điểm cực trị / điểm đặc biệt
        if (g.showPoints) {
            let specialPoints = findSpecialPoints(g);
            specialPoints.forEach(pt => {
                if (pt.x >= xMin && pt.x <= xMax && pt.y >= yMin && pt.y <= yMax) {
                    let sx = toSvgX(pt.x);
                    let sy = toSvgY(pt.y);
                    // Đường dóng nét đứt
                    elements.push(`<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${oY_clamped}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>`);
                    elements.push(`<line x1="${sx}" y1="${sy}" x2="${oX_clamped}" y2="${sy}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>`);
                    // Chấm điểm
                    elements.push(`<circle cx="${sx}" cy="${sy}" r="3.5" fill="#e11d48" stroke="#ffffff" stroke-width="1.5"/>`);
                }
            });
        }

        return `<svg class="${getAlignmentClass()}" viewBox="0 0 ${svgW} ${svgH}" style="${getSvgStyleAttr()}" xmlns="http://www.w3.org/2000/svg">\n${elements.join('\n')}\n</svg>`;
    }

    // Tìm các điểm đặc biệt (cực trị, đỉnh parabol...)
    function findSpecialPoints(g) {
        let pts = [];
        let a = parseFloat(g.a) || 0, b = parseFloat(g.b) || 0, c = parseFloat(g.c) || 0, d = parseFloat(g.d) || 0;
        
        if (g.type === 'bac2' && a !== 0) {
            let xV = -b / (2 * a);
            let yV = a * xV * xV + b * xV + c;
            pts.push({ x: xV, y: yV });
        } else if (g.type === 'bac3' && a !== 0) {
            // y' = 3ax^2 + 2bx + c = 0
            let delta = 4 * b * b - 12 * a * c;
            if (delta > 0) {
                let x1 = (-2 * b + Math.sqrt(delta)) / (6 * a);
                let x2 = (-2 * b - Math.sqrt(delta)) / (6 * a);
                pts.push({ x: x1, y: a * x1 * x1 * x1 + b * x1 * x1 + c * x1 + d });
                pts.push({ x: x2, y: a * x2 * x2 * x2 + b * x2 * x2 + c * x2 + d });
            }
        } else if (g.type === 'trungphuong' && a !== 0) {
            // y = ax^4 + bx^2 + c => y' = 4ax^3 + 2bx = 0 => x=0 or x^2 = -b/(2a)
            pts.push({ x: 0, y: c });
            if (-b / (2 * a) > 0) {
                let x1 = Math.sqrt(-b / (2 * a));
                let x2 = -x1;
                pts.push({ x: x1, y: a * Math.pow(x1, 4) + b * x1 * x1 + c });
                pts.push({ x: x2, y: a * Math.pow(x2, 4) + b * x2 * x2 + c });
            }
        }
        return pts;
    }

    function formatNumber(num) {
        return Math.round(num * 100) / 100;
    }

    // =========================================================================
    // 2. THUẬT TOÁN SINH BẢNG BIẾN THIÊN (BBT GENERATOR)
    // =========================================================================
    function generateBBTLatex() {
        let b = MathStudioState.bbt;
        let type = b.type;

        if (type === 'bac3') {
            return `$$\\begin{array}{c|ccccccc} x & -\\infty & & x_1 & & x_2 & & +\\infty \\\\ \\hline y' & & + & 0 & - & 0 & + & \\\\ \\hline y & & & y_{CĐ} & & & & +\\infty \\\\ & & \\nearrow & & \\searrow & & \\nearrow & \\\\ & -\\infty & & & & y_{CT} & & \\end{array}$$`;
        } else if (type === 'bac3_am') {
            return `$$\\begin{array}{c|ccccccc} x & -\\infty & & x_1 & & x_2 & & +\\infty \\\\ \\hline y' & & - & 0 & + & 0 & - & \\\\ \\hline y & +\\infty & & & & y_{CĐ} & & \\\\ & & \\searrow & & \\nearrow & & \\searrow & \\\\ & & & y_{CT} & & & & -\\infty \\end{array}$$`;
        } else if (type === 'trungphuong') {
            return `$$\\begin{array}{c|ccccccccc} x & -\\infty & & x_1 & & 0 & & x_2 & & +\\infty \\\\ \\hline y' & & - & 0 & + & 0 & - & 0 & + & \\\\ \\hline y & +\\infty & & & & y_{CĐ} & & & & +\\infty \\\\ & & \\searrow & & \\nearrow & & \\searrow & & \\nearrow & \\\\ & & & y_1 & & & & y_2 & & \\end{array}$$`;
        } else if (type === 'nhatbien') {
            return `$$\\begin{array}{c|ccccc} x & -\\infty & & x_0 & & +\\infty \\\\ \\hline y' & & + & || & + & \\\\ \\hline y & & +\\infty & || & & y_{TCN} \\\\ & & \\nearrow & || & \\nearrow & \\\\ & y_{TCN} & & || & -\\infty & \\end{array}$$`;
        } else if (type === 'phanthuc21') {
            return `$$\\begin{array}{c|ccccccc} x & -\\infty & & x_1 & & x_0 & & x_2 & & +\\infty \\\\ \\hline y' & & + & 0 & - & || & - & 0 & + & \\\\ \\hline y & & & y_1 & & || & & & & +\\infty \\\\ & & \\nearrow & & \\searrow & || & & & \\nearrow & \\\\ & -\\infty & & & -\\infty & || & +\\infty & & y_2 & \\end{array}$$`;
        } else if (type === 'bac2') {
            return `$$\\begin{array}{c|ccccc} x & -\\infty & & x_v & & +\\infty \\\\ \\hline y' & & - & 0 & + & \\\\ \\hline y & +\\infty & & & & +\\infty \\\\ & & \\searrow & & \\nearrow & \\\\ & & & y_v & & \\end{array}$$`;
        } else {
            // Tùy chỉnh
            let xArr = b.xCols.split(',').map(s => s.trim());
            let ypArr = b.yPrimeSigns.split(',').map(s => s.trim());
            let yArr = b.yValues.split(',').map(s => s.trim());
            
            return `$$\\begin{array}{c|${'c'.repeat(xArr.length * 2)}} x & ${xArr.join(' & & ')} \\\\ \\hline y' & ${ypArr.join(' & ')} \\\\ \\hline y & ${yArr.join(' & ')} \\end{array}$$`;
        }
    }

    // =========================================================================
    // 3. THUẬT TOÁN SINH HÌNH HỌC KHÔNG GIAN 3D (3D GEOMETRY)
    // =========================================================================
    function generateGeo3dSVG() {
        let g = MathStudioState.geo3d;
        let svgW = 420, svgH = 340;
        let elements = [];

        elements.push(`<rect width="${svgW}" height="${svgH}" fill="${MathStudioState.layout.hasBg ? '#f8fafc' : 'transparent'}" rx="12"/>`);

        let labels = (g.vertexLabels || 'S, A, B, C, D, H').split(',').map(s => s.trim());
        let S = labels[0] || 'S', A = labels[1] || 'A', B = labels[2] || 'B', C = labels[3] || 'C', D = labels[4] || 'D', H = labels[5] || 'H';

        if (g.type === 'pyramid_quad') {
            // Chóp tứ giác S.ABCD
            // Đáy ABCD: A(100, 210), B(220, 250), C(340, 220), D(220, 180)
            // Đỉnh S(210, 45)
            elements.push(`<line x1="210" y1="45" x2="100" y2="210" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="45" x2="220" y2="250" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="45" x2="340" y2="220" stroke="#1e293b" stroke-width="2"/>`);
            
            elements.push(`<line x1="100" y1="210" x2="220" y2="250" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="220" y1="250" x2="340" y2="220" stroke="#1e293b" stroke-width="2"/>`);
            
            // Cạnh ẩn AD, CD, SD
            elements.push(`<line x1="100" y1="210" x2="220" y2="180" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);
            elements.push(`<line x1="220" y1="180" x2="340" y2="220" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);
            elements.push(`<line x1="210" y1="45" x2="220" y2="180" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);

            if (g.showHeight) {
                // Đường cao SH (H là tâm đáy: 220, 215)
                elements.push(`<line x1="210" y1="45" x2="220" y2="215" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,4"/>`);
                elements.push(`<text x="225" y="225" font-size="12" font-weight="bold" fill="#dc2626">${H}</text>`);
            }

            elements.push(`<text x="205" y="35" font-size="13" font-weight="bold" fill="#1e293b">${S}</text>`);
            elements.push(`<text x="85" y="215" font-size="13" font-weight="bold" fill="#1e293b">${A}</text>`);
            elements.push(`<text x="215" y="270" font-size="13" font-weight="bold" fill="#1e293b">${B}</text>`);
            elements.push(`<text x="350" y="225" font-size="13" font-weight="bold" fill="#1e293b">${C}</text>`);
            elements.push(`<text x="220" y="170" font-size="13" font-weight="bold" fill="#64748b">${D}</text>`);

        } else if (g.type === 'pyramid_tri') {
            // Chóp tam giác S.ABC
            // A(90, 220), B(210, 260), C(330, 210), S(190, 45)
            elements.push(`<line x1="190" y1="45" x2="90" y2="220" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="190" y1="45" x2="210" y2="260" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="190" y1="45" x2="330" y2="210" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="90" y1="220" x2="210" y2="260" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="260" x2="330" y2="210" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="90" y1="220" x2="330" y2="210" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);

            if (g.showHeight) {
                elements.push(`<line x1="190" y1="45" x2="190" y2="230" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,4"/>`);
                elements.push(`<text x="185" y="245" font-size="12" font-weight="bold" fill="#dc2626">${H}</text>`);
            }

            elements.push(`<text x="185" y="35" font-size="13" font-weight="bold" fill="#1e293b">${S}</text>`);
            elements.push(`<text x="75" y="225" font-size="13" font-weight="bold" fill="#1e293b">${A}</text>`);
            elements.push(`<text x="210" y="280" font-size="13" font-weight="bold" fill="#1e293b">${B}</text>`);
            elements.push(`<text x="340" y="215" font-size="13" font-weight="bold" fill="#1e293b">${C}</text>`);

        } else if (g.type === 'prism_tri') {
            // Lăng trụ tam giác ABC.A'B'C'
            // Đáy trên: A'(110, 60), B'(210, 85), C'(290, 50)
            // Đáy dưới: A(110, 220), B(210, 245), C(290, 210)
            elements.push(`<line x1="110" y1="60" x2="210" y2="85" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="85" x2="290" y2="50" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="110" y1="60" x2="290" y2="50" stroke="#1e293b" stroke-width="2"/>`);

            elements.push(`<line x1="110" y1="220" x2="210" y2="245" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="245" x2="290" y2="210" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="110" y1="220" x2="290" y2="210" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);

            elements.push(`<line x1="110" y1="60" x2="110" y2="220" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="85" x2="210" y2="245" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="290" y1="50" x2="290" y2="210" stroke="#1e293b" stroke-width="2"/>`);

            elements.push(`<text x="95" y="55" font-size="12" font-weight="bold" fill="#1e293b">A'</text>`);
            elements.push(`<text x="210" y="105" font-size="12" font-weight="bold" fill="#1e293b">B'</text>`);
            elements.push(`<text x="300" y="45" font-size="12" font-weight="bold" fill="#1e293b">C'</text>`);
            elements.push(`<text x="95" y="225" font-size="12" font-weight="bold" fill="#1e293b">A</text>`);
            elements.push(`<text x="210" y="265" font-size="12" font-weight="bold" fill="#1e293b">B</text>`);
            elements.push(`<text x="300" y="215" font-size="12" font-weight="bold" fill="#1e293b">C</text>`);

        } else if (g.type === 'box') {
            // Hình hộp chữ nhật ABCD.A'B'C'D'
            // Đáy dưới: A(90, 200), B(210, 240), C(310, 210), D(190, 170)
            // Đáy trên: A'(90, 90), B'(210, 130), C'(310, 100), D'(190, 60)
            // Nét liền
            elements.push(`<polygon points="90,90 210,130 310,100 190,60" fill="none" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="90" y1="90" x2="90" y2="200" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="130" x2="210" y2="240" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="310" y1="100" x2="310" y2="210" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="90" y1="200" x2="210" y2="240" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="240" x2="310" y2="210" stroke="#1e293b" stroke-width="2"/>`);

            // Nét đứt (cạnh sau)
            elements.push(`<line x1="190" y1="60" x2="190" y2="170" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);
            elements.push(`<line x1="90" y1="200" x2="190" y2="170" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);
            elements.push(`<line x1="310" y1="210" x2="190" y2="170" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);

            elements.push(`<text x="75" y="85" font-size="12" font-weight="bold" fill="#1e293b">A'</text>`);
            elements.push(`<text x="210" y="145" font-size="12" font-weight="bold" fill="#1e293b">B'</text>`);
            elements.push(`<text x="320" y="100" font-size="12" font-weight="bold" fill="#1e293b">C'</text>`);
            elements.push(`<text x="190" y="50" font-size="12" font-weight="bold" fill="#1e293b">D'</text>`);
            elements.push(`<text x="75" y="210" font-size="12" font-weight="bold" fill="#1e293b">A</text>`);
            elements.push(`<text x="210" y="260" font-size="12" font-weight="bold" fill="#1e293b">B</text>`);
            elements.push(`<text x="320" y="220" font-size="12" font-weight="bold" fill="#1e293b">C</text>`);
            elements.push(`<text x="195" y="165" font-size="12" font-weight="bold" fill="#64748b">D</text>`);

        } else if (g.type === 'cone') {
            // Hình nón đỉnh S(210, 50), đáy tâm O(210, 240), bán kính R=110, r=30
            elements.push(`<ellipse cx="210" cy="240" rx="110" ry="30" fill="none" stroke="#1e293b" stroke-width="2"/>`);
            // Che nửa sau bằng nét đứt
            elements.push(`<path d="M 100 240 A 110 30 0 0 1 320 240" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);
            elements.push(`<path d="M 100 240 A 110 30 0 0 0 320 240" fill="none" stroke="#1e293b" stroke-width="2"/>`);
            
            elements.push(`<line x1="210" y1="50" x2="100" y2="240" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="50" x2="320" y2="240" stroke="#1e293b" stroke-width="2"/>`);
            // Trục SO và bán kính OA
            elements.push(`<line x1="210" y1="50" x2="210" y2="240" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,4"/>`);
            elements.push(`<line x1="210" y1="240" x2="320" y2="240" stroke="#64748b" stroke-width="1.8" stroke-dasharray="4,4"/>`);

            elements.push(`<text x="205" y="40" font-size="13" font-weight="bold" fill="#1e293b">S</text>`);
            elements.push(`<text x="215" y="235" font-size="12" font-weight="bold" fill="#dc2626">O</text>`);
            elements.push(`<text x="330" y="245" font-size="12" font-weight="bold" fill="#1e293b">A</text>`);
            elements.push(`<text x="260" y="235" font-size="11" font-weight="bold" fill="#64748b">R</text>`);
            elements.push(`<text x="195" y="150" font-size="11" font-weight="bold" fill="#dc2626">h</text>`);

        } else if (g.type === 'cylinder') {
            // Hình trụ
            elements.push(`<ellipse cx="210" cy="80" rx="100" ry="25" fill="none" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<path d="M 110 240 A 100 25 0 0 1 310 240" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,5"/>`);
            elements.push(`<path d="M 110 240 A 100 25 0 0 0 310 240" fill="none" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="110" y1="80" x2="110" y2="240" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="310" y1="80" x2="310" y2="240" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<line x1="210" y1="80" x2="210" y2="240" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,4"/>`);
            elements.push(`<text x="215" y="75" font-size="12" font-weight="bold" fill="#dc2626">O'</text>`);
            elements.push(`<text x="215" y="235" font-size="12" font-weight="bold" fill="#dc2626">O</text>`);

        } else if (g.type === 'oxyz') {
            // Hệ tọa độ không gian Oxyz
            let oX = 180, oY = 200;
            // Trục Oz hướng lên
            elements.push(`<line x1="${oX}" y1="${oY}" x2="${oX}" y2="40" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<polygon points="${oX},35 ${oX - 4},45 ${oX + 4},45" fill="#1e293b"/>`);
            elements.push(`<text x="${oX + 8}" y="45" font-size="13" font-weight="bold" fill="#1e293b">z</text>`);

            // Trục Oy hướng sang phải
            elements.push(`<line x1="${oX}" y1="${oY}" x2="360" y2="${oY}" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<polygon points="365,${oY} 355,${oY - 4} 355,${oY + 4}" fill="#1e293b"/>`);
            elements.push(`<text x="360" y="${oY - 8}" font-size="13" font-weight="bold" fill="#1e293b">y</text>`);

            // Trục Ox hướng chéo trái xuống dưới (135 độ)
            elements.push(`<line x1="${oX}" y1="${oY}" x2="60" y2="290" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<polygon points="55,294 62,284 69,291" fill="#1e293b"/>`);
            elements.push(`<text x="45" y="295" font-size="13" font-weight="bold" fill="#1e293b">x</text>`);

            elements.push(`<text x="${oX - 15}" y="${oY + 15}" font-size="13" font-weight="bold" fill="#475569">O</text>`);
        }

        return `<svg class="${getAlignmentClass()}" viewBox="0 0 ${svgW} ${svgH}" style="${getSvgStyleAttr()}" xmlns="http://www.w3.org/2000/svg">\n${elements.join('\n')}\n</svg>`;
    }

    // =========================================================================
    // 4. THUẬT TOÁN SINH HÌNH HỌC PHẲNG 2D (2D SHAPES)
    // =========================================================================
    function generateGeo2dSVG() {
        let g = MathStudioState.geo2d;
        let svgW = 420, svgH = 320;
        let elements = [];

        elements.push(`<rect width="${svgW}" height="${svgH}" fill="${MathStudioState.layout.hasBg ? '#f8fafc' : 'transparent'}" rx="12"/>`);

        let labels = (g.labels || 'A, B, C, H').split(',').map(s => s.trim());
        let A = labels[0] || 'A', B = labels[1] || 'B', C = labels[2] || 'C', H = labels[3] || 'H';

        if (g.type === 'triangle_right') {
            // Tam giác vuông tại A: A(80, 240), B(80, 70), C(340, 240)
            elements.push(`<polygon points="80,240 80,70 340,240" fill="none" stroke="#1e293b" stroke-width="2.2"/>`);
            // Ký hiệu góc vuông tại A
            elements.push(`<polyline points="80,225 95,225 95,240" fill="none" stroke="#1e293b" stroke-width="1.5"/>`);
            // Đường cao AH
            // H trên BC: hình chiếu của A lên BC
            let hX = 145, hY = 197;
            elements.push(`<line x1="80" y1="240" x2="${hX}" y2="${hY}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="3,3"/>`);
            elements.push(`<text x="${hX + 4}" y="${hY - 4}" font-size="12" font-weight="bold" fill="#dc2626">${H}</text>`);

            elements.push(`<text x="60" y="255" font-size="13" font-weight="bold" fill="#1e293b">${A}</text>`);
            elements.push(`<text x="75" y="60" font-size="13" font-weight="bold" fill="#1e293b">${B}</text>`);
            elements.push(`<text x="350" y="250" font-size="13" font-weight="bold" fill="#1e293b">${C}</text>`);

        } else if (g.type === 'triangle_equi') {
            // Tam giác đều A(210, 50), B(80, 250), C(340, 250)
            elements.push(`<polygon points="210,50 80,250 340,250" fill="none" stroke="#1e293b" stroke-width="2.2"/>`);
            elements.push(`<line x1="210" y1="50" x2="210" y2="250" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="3,3"/>`);
            elements.push(`<polyline points="210,238 198,238 198,250" fill="none" stroke="#1e293b" stroke-width="1.5"/>`);

            elements.push(`<text x="205" y="40" font-size="13" font-weight="bold" fill="#1e293b">${A}</text>`);
            elements.push(`<text x="65" y="260" font-size="13" font-weight="bold" fill="#1e293b">${B}</text>`);
            elements.push(`<text x="350" y="260" font-size="13" font-weight="bold" fill="#1e293b">${C}</text>`);
            elements.push(`<text x="205" y="270" font-size="12" font-weight="bold" fill="#dc2626">${H}</text>`);

        } else if (g.type === 'circle_tangent') {
            // Đường tròn tâm O(210, 160) bán kính R=90, tiếp tuyến d tại M
            elements.push(`<circle cx="210" cy="160" r="90" fill="none" stroke="#1e293b" stroke-width="2"/>`);
            elements.push(`<circle cx="210" cy="160" r="3" fill="#1e293b"/>`);
            elements.push(`<text x="215" y="155" font-size="12" font-weight="bold" fill="#1e293b">O</text>`);

            // Tiếp tuyến ngang tại tiếp điểm M(210, 70)
            elements.push(`<line x1="60" y1="70" x2="360" y2="70" stroke="#2563eb" stroke-width="2"/>`);
            elements.push(`<circle cx="210" cy="70" r="3.5" fill="#dc2626"/>`);
            elements.push(`<text x="215" y="62" font-size="12" font-weight="bold" fill="#dc2626">M</text>`);
            elements.push(`<text x="365" y="65" font-size="12" font-weight="bold" fill="#2563eb">d</text>`);
            elements.push(`<line x1="210" y1="160" x2="210" y2="70" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3"/>`);
            elements.push(`<text x="215" y="120" font-size="11" font-weight="bold" fill="#dc2626">R</text>`);
        }

        return `<svg class="${getAlignmentClass()}" viewBox="0 0 ${svgW} ${svgH}" style="${getSvgStyleAttr()}" xmlns="http://www.w3.org/2000/svg">\n${elements.join('\n')}\n</svg>`;
    }

    // =========================================================================
    // HELPER STYLES CHO KÍCH THƯỚC VÀ CĂN LỀ
    // =========================================================================
    function getAlignmentClass() {
        let align = MathStudioState.layout.alignment;
        if (align === 'left') return 'mr-auto block';
        if (align === 'right') return 'ml-auto block';
        return 'mx-auto block'; // center
    }

    function getSvgStyleAttr() {
        let l = MathStudioState.layout;
        let styles = [];
        
        if (l.widthType === '100%') {
            styles.push('width: 100%; max-width: 100%;');
        } else if (l.widthType === 'custom') {
            styles.push(`width: ${l.customWidth}px; max-width: 100%;`);
        } else {
            styles.push(`width: ${l.widthType}px; max-width: 100%;`);
        }

        styles.push('height: auto;');

        if (l.hasBorder) {
            styles.push('border: 1px solid #e2e8f0; border-radius: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);');
        }

        return styles.join(' ');
    }

    // =========================================================================
    // CẬP NHẬT GIAO DIỆN & LIVE PREVIEW TRONG MODAL
    // =========================================================================
    function updateStudioPreview() {
        let previewBox = document.getElementById('studio-live-preview-box');
        let codeOutput = document.getElementById('studio-code-output');
        let sizeBadge = document.getElementById('studio-current-size-badge');
        if (!previewBox) return;

        let content = '';
        let tab = MathStudioState.activeTab;

        if (tab === 'graph') {
            content = generateFunctionGraphSVG();
        } else if (tab === 'bbt') {
            content = generateBBTLatex();
        } else if (tab === 'geo3d') {
            content = generateGeo3dSVG();
        } else if (tab === 'geo2d') {
            content = generateGeo2dSVG();
        } else if (tab === 'custom') {
            content = document.getElementById('studio-custom-svg-input')?.value || MathStudioState.customCode;
        }

        MathStudioState.currentGeneratedCode = content;

        // Cập nhật Badge kích thước
        if (sizeBadge) {
            let wTxt = MathStudioState.layout.widthType === 'custom' ? `${MathStudioState.layout.customWidth}px` : (MathStudioState.layout.widthType === '100%' ? '100%' : `${MathStudioState.layout.widthType}px`);
            sizeBadge.innerText = `Rộng: ${wTxt} | Căn: ${MathStudioState.layout.alignment}`;
        }

        // Render Preview
        if (tab === 'bbt') {
            previewBox.innerHTML = `<div class="p-6 bg-white rounded-2xl flex items-center justify-center min-h-[220px] text-lg font-bold">${content}</div>`;
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([previewBox]).catch(err => console.warn(err));
            }
        } else {
            previewBox.innerHTML = `<div class="flex items-center justify-center p-2">${content}</div>`;
        }

        if (codeOutput) {
            codeOutput.value = content;
        }
    }

    // Render Form theo loại Hàm Số được chọn
    function onGraphTypeChange(type) {
        MathStudioState.graph.type = type;
        let coefRow = document.getElementById('studio-graph-coef-container');
        if (!coefRow) return;

        let html = '';
        if (type === 'bac1') {
            html = `
                <div class="grid grid-cols-2 gap-2">
                    <div><label class="text-xs font-bold text-slate-600">Hệ số a (y = ax + b):</label><input type="number" step="0.5" id="g-param-a" value="${MathStudioState.graph.a}" oninput="updateGraphParam('a', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-xs font-bold text-slate-600">Hệ số b:</label><input type="number" step="0.5" id="g-param-b" value="${MathStudioState.graph.b}" oninput="updateGraphParam('b', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                </div>`;
        } else if (type === 'bac2') {
            html = `
                <div class="grid grid-cols-3 gap-2">
                    <div><label class="text-xs font-bold text-slate-600">a (y=ax²+bx+c):</label><input type="number" step="0.5" id="g-param-a" value="${MathStudioState.graph.a}" oninput="updateGraphParam('a', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-xs font-bold text-slate-600">b:</label><input type="number" step="0.5" id="g-param-b" value="${MathStudioState.graph.b}" oninput="updateGraphParam('b', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-xs font-bold text-slate-600">c:</label><input type="number" step="0.5" id="g-param-c" value="${MathStudioState.graph.c}" oninput="updateGraphParam('c', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                </div>`;
        } else if (type === 'bac3') {
            html = `
                <div class="grid grid-cols-4 gap-2">
                    <div><label class="text-[11px] font-bold text-slate-600">a (ax³):</label><input type="number" step="0.5" id="g-param-a" value="${MathStudioState.graph.a}" oninput="updateGraphParam('a', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[11px] font-bold text-slate-600">b (bx²):</label><input type="number" step="0.5" id="g-param-b" value="${MathStudioState.graph.b}" oninput="updateGraphParam('b', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[11px] font-bold text-slate-600">c (cx):</label><input type="number" step="0.5" id="g-param-c" value="${MathStudioState.graph.c}" oninput="updateGraphParam('c', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[11px] font-bold text-slate-600">d:</label><input type="number" step="0.5" id="g-param-d" value="${MathStudioState.graph.d}" oninput="updateGraphParam('d', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                </div>`;
        } else if (type === 'trungphuong') {
            html = `
                <div class="grid grid-cols-3 gap-2">
                    <div><label class="text-xs font-bold text-slate-600">a (ax⁴):</label><input type="number" step="0.5" id="g-param-a" value="${MathStudioState.graph.a}" oninput="updateGraphParam('a', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-xs font-bold text-slate-600">b (bx²):</label><input type="number" step="0.5" id="g-param-b" value="${MathStudioState.graph.b}" oninput="updateGraphParam('b', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-xs font-bold text-slate-600">c:</label><input type="number" step="0.5" id="g-param-c" value="${MathStudioState.graph.c}" oninput="updateGraphParam('c', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                </div>`;
        } else if (type === 'nhatbien') {
            html = `
                <div class="bg-sky-50/70 p-3 rounded-2xl border border-sky-200 mb-2 text-xs text-sky-900 font-bold">Dạng: y = (ax + b) / (cx + d)</div>
                <div class="grid grid-cols-4 gap-2">
                    <div><label class="text-[11px] font-bold text-slate-600">a:</label><input type="number" step="0.5" id="g-param-a" value="${MathStudioState.graph.a}" oninput="updateGraphParam('a', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[11px] font-bold text-slate-600">b:</label><input type="number" step="0.5" id="g-param-b" value="${MathStudioState.graph.b}" oninput="updateGraphParam('b', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[11px] font-bold text-slate-600">c:</label><input type="number" step="0.5" id="g-param-c" value="${MathStudioState.graph.c}" oninput="updateGraphParam('c', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[11px] font-bold text-slate-600">d:</label><input type="number" step="0.5" id="g-param-d" value="${MathStudioState.graph.d}" oninput="updateGraphParam('d', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                </div>`;
        } else if (type === 'phanthuc21') {
            html = `
                <div class="bg-sky-50/70 p-3 rounded-2xl border border-sky-200 mb-2 text-xs text-sky-900 font-bold">Dạng: y = (ax² + bx + c) / (dx + e)</div>
                <div class="grid grid-cols-5 gap-2">
                    <div><label class="text-[10px] font-bold text-slate-600">a:</label><input type="number" step="0.5" id="g-param-a" value="${MathStudioState.graph.a}" oninput="updateGraphParam('a', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[10px] font-bold text-slate-600">b:</label><input type="number" step="0.5" id="g-param-b" value="${MathStudioState.graph.b}" oninput="updateGraphParam('b', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[10px] font-bold text-slate-600">c:</label><input type="number" step="0.5" id="g-param-c" value="${MathStudioState.graph.c}" oninput="updateGraphParam('c', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[10px] font-bold text-slate-600">d:</label><input type="number" step="0.5" id="g-param-d" value="${MathStudioState.graph.d}" oninput="updateGraphParam('d', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                    <div><label class="text-[10px] font-bold text-slate-600">e:</label><input type="number" step="0.5" id="g-param-e" value="${MathStudioState.graph.e}" oninput="updateGraphParam('e', this.value)" class="w-full p-2 border rounded-xl font-black text-sky-700 bg-white shadow-xs"></div>
                </div>`;
        }

        coefRow.innerHTML = html;
        updateStudioPreview();
    }

    function updateGraphParam(key, val) {
        MathStudioState.graph[key] = parseFloat(val) || 0;
        updateStudioPreview();
    }

    function updateGraphOption(key, val) {
        MathStudioState.graph[key] = val;
        updateStudioPreview();
    }

    function updateBBTOption(key, val) {
        MathStudioState.bbt[key] = val;
        updateStudioPreview();
    }

    function updateGeo3dOption(key, val) {
        MathStudioState.geo3d[key] = val;
        updateStudioPreview();
    }

    function updateGeo2dOption(key, val) {
        MathStudioState.geo2d[key] = val;
        updateStudioPreview();
    }

    function renderStudioCurrentTab() {
        onGraphTypeChange(MathStudioState.graph.type);
    }

    // =========================================================================
    // HÀNH ĐỘNG: CHÈN VÀO MỤC TIÊU (QUESTION / EXPLANATION / OPTIONS)
    // =========================================================================
    function insertMathStudioResult(customTarget = null) {
        let targetId = customTarget || MathStudioState.targetInputId || 'edit-q-text';
        let code = MathStudioState.currentGeneratedCode;
        if (!code) return;

        // Xử lý chèn trực tiếp lên Bảng Trắng Whiteboard (Giai đoạn 3)
        if (targetId === 'whiteboard' || (typeof window.insertSvgToWhiteboard === 'function' && document.getElementById('main-canvas'))) {
            window.insertSvgToWhiteboard(code, { width: 440, height: 320 });
            closeMathStudio();
            return;
        }

        let target = document.getElementById(targetId);
        if (target) {
            let start = target.selectionStart !== undefined ? target.selectionStart : target.value.length;
            let end = target.selectionEnd !== undefined ? target.selectionEnd : target.value.length;
            
            // Bổ sung xuống dòng trước và sau để mã SVG / LaTeX hiển thị tách biệt rõ ràng
            let insertStr = `\n${code}\n`;
            target.value = target.value.substring(0, start) + insertStr + target.value.substring(end);
            target.focus();
            target.selectionStart = target.selectionEnd = start + insertStr.length;

            if (typeof window.updateQPreviewLive === 'function') {
                window.updateQPreviewLive();
            }

            if (typeof window.showToast === 'function') {
                window.showToast("🎉 Đã chèn hình vẽ / bảng biến thiên thành công!");
            }
        } else {
            // Sao chép clipboard nếu không tìm thấy target
            copyStudioCode();
        }

        closeMathStudio();
    }

    function copyStudioCode() {
        let code = MathStudioState.currentGeneratedCode;
        if (!code) return;
        navigator.clipboard.writeText(code).then(() => {
            if (typeof window.showToast === 'function') {
                window.showToast("📋 Đã sao chép mã hình vẽ vào bộ nhớ tạm!");
            }
        }).catch(() => {
            let el = document.getElementById('studio-code-output');
            if (el) { el.select(); document.execCommand('copy'); }
        });
    }

    // Gán API ra window
    window.openMathGraphStudio = openMathGraphStudio;
    window.closeMathStudio = closeMathStudio;
    window.setStudioTab = setStudioTab;
    window.setStudioWidth = setStudioWidth;
    window.setStudioAlign = setStudioAlign;
    window.toggleStudioBoxOption = toggleStudioBoxOption;
    window.onGraphTypeChange = onGraphTypeChange;
    window.updateGraphParam = updateGraphParam;
    window.updateGraphOption = updateGraphOption;
    window.updateBBTOption = updateBBTOption;
    window.updateGeo3dOption = updateGeo3dOption;
    window.updateGeo2dOption = updateGeo2dOption;
    window.updateStudioPreview = updateStudioPreview;
    window.insertMathStudioResult = insertMathStudioResult;
    window.copyStudioCode = copyStudioCode;

    // Giữ tương thích hàm cũ
    window.openSvgHelperModal = openMathGraphStudio;
    window.closeSvgHelperModal = closeMathStudio;
    window.openMathStudioModal = openMathGraphStudio;
    window.closeMathStudioModal = closeMathStudio;

})(window);
