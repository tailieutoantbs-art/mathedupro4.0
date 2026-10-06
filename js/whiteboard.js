// whiteboard.js - Interactive Canvas Whiteboard, Geometric Toolset & Presentation Engine 3.0
// Hệ sinh thái EduMath TBS v3.0

const state = {
  tabs: [],
  activeTabId: null,
  tool: 'select', // 'select' | 'laser' | 'pen' | 'highlighter' | 'eraser' | 'rect' | 'ellipse' | 'triangle' | 'oxy' | 'line' | 'arrow' | 'text' | 'sticky' | 'mindmap' | 'flow' | 'connector'
  color: '#000000',
  strokeWidth: 3,
  textSize: 20,
  fill: false,
  zoom: 1,
  pan: { x: 0, y: 0 },
  isDrawing: false,
  isPanning: false,
  spaceDown: false,
  currentObject: null,
  startPt: null,
  selectedId: null,
  dragOffset: null,
  draggingSelection: false,
  resizingSelection: false,
  resizeHandle: null,
  resizeStart: null,
  undoStack: [],
  redoStack: [],
  clipboard: null,
  connectorFrom: null,
  bgMode: 'dot',
};
let tabIdCounter = 1;

// =========================================================================
// LASER POINTER ENGINE (GIAI ĐOẠN 3)
// =========================================================================
let laserTrail = [];
let laserAnimationId = null;

function addLaserPoint(x, y) {
  const pt = {
    x, y,
    time: Date.now(),
    color: state.color && state.color !== '#000000' ? state.color : '#f43f5e'
  };
  laserTrail.push(pt);
  if (!laserAnimationId) {
    laserAnimationId = requestAnimationFrame(renderLaserLoop);
  }
}

function renderLaserLoop() {
  const now = Date.now();
  const maxAge = 1200; // 1.2s fade out
  laserTrail = laserTrail.filter(pt => now - pt.time < maxAge);

  if (overlayCanvas && ovCtx) {
    drawOverlay(); // Redraw selection handles etc.
    
    if (laserTrail.length > 0) {
      const t = activeTab();
      ovCtx.save();
      
      // Draw glowing laser trail
      for (let i = 1; i < laserTrail.length; i++) {
        const p1 = worldToScreen(laserTrail[i-1].x, laserTrail[i-1].y);
        const p2 = worldToScreen(laserTrail[i].x, laserTrail[i].y);
        const age = now - laserTrail[i].time;
        const alpha = Math.max(0, 1 - (age / maxAge));
        
        ovCtx.beginPath();
        ovCtx.moveTo(p1.x, p1.y);
        ovCtx.lineTo(p2.x, p2.y);
        ovCtx.strokeStyle = laserTrail[i].color;
        ovCtx.lineWidth = Math.max(2, 6 * alpha);
        ovCtx.lineCap = 'round';
        ovCtx.lineJoin = 'round';
        ovCtx.shadowColor = laserTrail[i].color;
        ovCtx.shadowBlur = 12 * alpha;
        ovCtx.globalAlpha = alpha;
        ovCtx.stroke();
      }

      // Draw laser tip core
      const last = laserTrail[laserTrail.length - 1];
      const sc = worldToScreen(last.x, last.y);
      ovCtx.beginPath();
      ovCtx.arc(sc.x, sc.y, 6, 0, Math.PI * 2);
      ovCtx.fillStyle = '#ffffff';
      ovCtx.shadowColor = last.color;
      ovCtx.shadowBlur = 16;
      ovCtx.globalAlpha = 1;
      ovCtx.fill();
      
      ovCtx.restore();
      laserAnimationId = requestAnimationFrame(renderLaserLoop);
    } else {
      laserAnimationId = null;
    }
  } else {
    laserAnimationId = null;
  }
}

// =========================================================================
// QUẢN LÝ THẺ (TABS)
// =========================================================================
function newTab(name) {
  const t = { id: tabIdCounter++, name: name || `Phiên ${tabIdCounter-1}`, objects: [], pan: { x:0, y:0 }, zoom: 1 };
  state.tabs.push(t);
  state.activeTabId = t.id;
  renderTabs();
  redraw();
  scheduleAutosave();
  return t;
}
function activeTab() { return state.tabs.find(t => t.id === state.activeTabId); }

// =========================================================================
// QUẢN LÝ GIAO DIỆN (THEME)
// =========================================================================
const themeBtn = document.getElementById('theme-btn');
const themeMenu = document.getElementById('theme-menu');

const savedTheme = localStorage.getItem('whiteboard.theme');
if (savedTheme && savedTheme !== 'default') {
  document.body.classList.add(`theme-${savedTheme}`);
}

if (themeBtn) {
  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = themeBtn.getBoundingClientRect();
    if (themeMenu) {
      themeMenu.style.top = (rect.bottom + 8) + 'px';
      themeMenu.style.left = rect.left + 'px';
      themeMenu.classList.toggle('show');
    }
  });
}

window.addEventListener('click', (e) => {
  if (themeMenu && !themeMenu.contains(e.target) && e.target !== themeBtn) {
    themeMenu.classList.remove('show');
  }
});

document.querySelectorAll('#theme-menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    const themeName = btn.dataset.theme;
    document.body.className = '';
    if (themeName !== 'default') {
      document.body.classList.add(`theme-${themeName}`);
    }
    localStorage.setItem('whiteboard.theme', themeName);
    if (themeMenu) themeMenu.classList.remove('show');
    drawOverlay(); 
  });
});

// =========================================================================
// DOM CANVASES & RESIZING
// =========================================================================
const bgCanvas = document.getElementById('bg-canvas');
const mainCanvas = document.getElementById('main-canvas');
const overlayCanvas = document.getElementById('overlay-canvas');
const wrap = document.getElementById('canvas-wrap');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
const ctx = mainCanvas ? mainCanvas.getContext('2d') : null;
const ovCtx = overlayCanvas ? overlayCanvas.getContext('2d') : null;

function resizeCanvases() {
  if (!wrap || !bgCanvas || !mainCanvas || !overlayCanvas) return;
  const r = wrap.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  [bgCanvas, mainCanvas, overlayCanvas].forEach(c => {
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    c.style.width = r.width + 'px';
    c.style.height = r.height + 'px';
    c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);
  });
  redraw();
}
window.addEventListener('resize', resizeCanvases);

function screenToWorld(x, y) {
  const t = activeTab(); if (!t) return {x,y};
  return { x: (x - t.pan.x) / t.zoom, y: (y - t.pan.y) / t.zoom };
}
function worldToScreen(x, y) {
  const t = activeTab(); if (!t) return {x,y};
  return { x: x * t.zoom + t.pan.x, y: y * t.zoom + t.pan.y };
}

function drawBackground() {
  if (!bgCanvas || !bgCtx) return;
  const t = activeTab(); if (!t) return;
  const w = bgCanvas.width / (window.devicePixelRatio||1);
  const h = bgCanvas.height / (window.devicePixelRatio||1);
  bgCtx.fillStyle = '#fafafa';
  bgCtx.fillRect(0,0,w,h);
  if (state.bgMode === 'none') return;
  
  const gridSize = 40 * t.zoom;
  if (gridSize > 8) {
    const offX = t.pan.x % gridSize;
    const offY = t.pan.y % gridSize;
    
    if (state.bgMode === 'dot') {
      bgCtx.fillStyle = '#d0d0d0';
      for (let x = offX; x < w; x += gridSize) {
        for (let y = offY; y < h; y += gridSize) {
          bgCtx.beginPath();
          bgCtx.arc(x, y, 1.2, 0, Math.PI*2);
          bgCtx.fill();
        }
      }
    } else if (state.bgMode === 'grid') {
      bgCtx.strokeStyle = '#e0e0e0';
      bgCtx.lineWidth = 1;
      bgCtx.beginPath();
      for (let x = offX; x < w; x += gridSize) {
        bgCtx.moveTo(x, 0); bgCtx.lineTo(x, h);
      }
      for (let y = offY; y < h; y += gridSize) {
        bgCtx.moveTo(0, y); bgCtx.lineTo(w, y);
      }
      bgCtx.stroke();
    }
  }
}

// =========================================================================
// OBJECTS & DRAWING PIPELINE
// =========================================================================
function isConnectable(o) {
  return !!o && ['mindmap', 'flow', 'sticky', 'rect', 'ellipse', 'triangle', 'text', 'card'].includes(o.type);
}
function isResizable(o) {
  return !!o && ['text', 'sticky', 'mindmap', 'flow', 'rect', 'ellipse', 'triangle', 'oxy', 'image', 'card'].includes(o.type);
}
function objectCenter(o) {
  const b = getBounds(o);
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
}
function getObjectById(id) {
  const t = activeTab();
  return t ? t.objects.find(o => o.id === id) : null;
}
function connectionPoint(o, toward) {
  const b = getBounds(o);
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { x: dx >= 0 ? b.x + b.w : b.x, y: cy };
  }
  return { x: cx, y: dy >= 0 ? b.y + b.h : b.y };
}
function endpointFromWorldPoint(p) {
  const snapped = hitTest(p.x, p.y);
  if (snapped && isConnectable(snapped)) return { objectId: snapped.id };
  return { x: p.x, y: p.y };
}
function resolveConnectorPoints(o) {
  const fromObj = o.fromId ? getObjectById(o.fromId) : null;
  const toObj = o.toId ? getObjectById(o.toId) : null;
  let a = { x: o.x1 || 0, y: o.y1 || 0 };
  let b = { x: o.x2 || 0, y: o.y2 || 0 };
  if (fromObj && toObj) {
    const ca = objectCenter(fromObj);
    const cb = objectCenter(toObj);
    a = connectionPoint(fromObj, cb);
    b = connectionPoint(toObj, ca);
  } else if (fromObj) {
    b = { x: o.x2 || objectCenter(fromObj).x + 120, y: o.y2 || objectCenter(fromObj).y };
    a = connectionPoint(fromObj, b);
  } else if (toObj) {
    a = { x: o.x1 || objectCenter(toObj).x - 120, y: o.y1 || objectCenter(toObj).y };
    b = connectionPoint(toObj, a);
  }
  return { a, b };
}
function makeConnector(fromEndpoint, toEndpoint) {
  const o = { id: uid(), type:'connector', color:state.color, width:Math.max(2, state.strokeWidth) };
  if (fromEndpoint.objectId) o.fromId = fromEndpoint.objectId;
  else { o.x1 = fromEndpoint.x; o.y1 = fromEndpoint.y; }
  if (toEndpoint.objectId) o.toId = toEndpoint.objectId;
  else { o.x2 = toEndpoint.x; o.y2 = toEndpoint.y; }
  const pts = resolveConnectorPoints(o);
  o.x1 = pts.a.x; o.y1 = pts.a.y; o.x2 = pts.b.x; o.y2 = pts.b.y;
  return o;
}
function nearestConnectableTo(o, maxDist) {
  const t = activeTab();
  if (!t) return null;
  const centre = objectCenter(o);
  let best = null, bestD = Infinity;
  for (const candidate of t.objects) {
    if (candidate.id === o.id || !isConnectable(candidate)) continue;
    const c = objectCenter(candidate);
    const d = Math.hypot(c.x - centre.x, c.y - centre.y);
    if (d < bestD) { best = candidate; bestD = d; }
  }
  return bestD <= maxDist ? best : null;
}
function autoConnectForNewObject(newObj, preferredParentId) {
  const t = activeTab();
  if (!t || !isConnectable(newObj)) return false;
  let parent = preferredParentId ? t.objects.find(o => o.id === preferredParentId && isConnectable(o) && o.id !== newObj.id) : null;
  if (!parent) parent = nearestConnectableTo(newObj, 300);
  if (!parent) return false;
  t.objects.push(makeConnector({ objectId: parent.id }, { objectId: newObj.id }));
  return true;
}
function drawArrowHead(c, from, to, size) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  c.beginPath();
  c.moveTo(to.x, to.y);
  c.lineTo(to.x - size*Math.cos(angle - Math.PI/6), to.y - size*Math.sin(angle - Math.PI/6));
  c.lineTo(to.x - size*Math.cos(angle + Math.PI/6), to.y - size*Math.sin(angle + Math.PI/6));
  c.closePath();
  c.fill();
}

function drawObject(c, o) {
  c.save();
  c.strokeStyle = o.color || '#000';
  c.fillStyle = o.color || '#000';
  c.lineWidth = (o.width || 2);
  c.lineCap = 'round';
  c.lineJoin = 'round';
  
  if (o.type === 'stroke') {
    c.globalAlpha = o.alpha || 1;
    if (!o.points || o.points.length < 2) { c.restore(); return; }
    c.beginPath();
    c.moveTo(o.points[0].x, o.points[0].y);
    for (let i=1; i<o.points.length; i++) {
      const p = o.points[i], prev = o.points[i-1];
      const mx = (p.x+prev.x)/2, my = (p.y+prev.y)/2;
      c.quadraticCurveTo(prev.x, prev.y, mx, my);
    }
    c.stroke();
  } else if (o.type === 'rect') {
    if (o.filled) { c.fillStyle = o.color; c.fillRect(o.x, o.y, o.w, o.h); }
    else c.strokeRect(o.x, o.y, o.w, o.h);
  } else if (o.type === 'ellipse') {
    c.beginPath();
    c.ellipse(o.x + o.w/2, o.y + o.h/2, Math.abs(o.w/2), Math.abs(o.h/2), 0, 0, Math.PI*2);
    if (o.filled) c.fill(); else c.stroke();
  } else if (o.type === 'triangle') {
    c.beginPath();
    c.moveTo(o.x + o.w / 2, o.y);
    c.lineTo(o.x + o.w, o.y + o.h);
    c.lineTo(o.x, o.y + o.h);
    c.closePath();
    if (o.filled) c.fill(); else c.stroke();
  } else if (o.type === 'oxy') {
    const cx = o.x + o.w / 2;
    const cy = o.y + o.h / 2;
    c.beginPath();
    c.moveTo(o.x, cy); c.lineTo(o.x + o.w, cy);
    c.moveTo(cx, o.y); c.lineTo(cx, o.y + o.h);
    c.stroke();
    const ah = 10 + o.width;
    c.fillStyle = o.color;
    c.beginPath();
    c.moveTo(o.x + o.w, cy);
    c.lineTo(o.x + o.w - ah*Math.cos(Math.PI/6), cy - ah*Math.sin(Math.PI/6));
    c.lineTo(o.x + o.w - ah*Math.cos(-Math.PI/6), cy - ah*Math.sin(-Math.PI/6));
    c.closePath(); c.fill();
    c.beginPath();
    c.moveTo(cx, o.y);
    c.lineTo(cx - ah*Math.cos(Math.PI/3), o.y + ah*Math.sin(Math.PI/3));
    c.lineTo(cx - ah*Math.cos(2*Math.PI/3), o.y + ah*Math.sin(2*Math.PI/3));
    c.closePath(); c.fill();
    c.font = 'italic 16px "Times New Roman", serif';
    c.fillText('x', o.x + o.w - 15, cy + 18);
    c.fillText('y', cx - 20, o.y + 10);
    c.fillText('O', cx - 18, cy + 18);
  } else if (o.type === 'line') {
    c.beginPath(); c.moveTo(o.x1, o.y1); c.lineTo(o.x2, o.y2); c.stroke();
  } else if (o.type === 'arrow') {
    c.beginPath(); c.moveTo(o.x1, o.y1); c.lineTo(o.x2, o.y2); c.stroke();
    const angle = Math.atan2(o.y2-o.y1, o.x2-o.x1);
    const ah = 12 + o.width*1.5;
    c.beginPath();
    c.moveTo(o.x2, o.y2);
    c.lineTo(o.x2 - ah*Math.cos(angle - Math.PI/6), o.y2 - ah*Math.sin(angle - Math.PI/6));
    c.lineTo(o.x2 - ah*Math.cos(angle + Math.PI/6), o.y2 - ah*Math.sin(angle + Math.PI/6));
    c.closePath(); c.fill();
  } else if (o.type === 'text') {
    c.fillStyle = o.color;
    c.font = `${o.fontSize||20}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    c.textBaseline = 'top';
    const lines = (o.text||'').split('\n');
    lines.forEach((l, i) => c.fillText(l, o.x, o.y + i*(o.fontSize||20)*1.2));
  } else if (o.type === 'sticky') {
    c.fillStyle = o.bg || '#fff59d';
    c.strokeStyle = 'rgba(0,0,0,.1)';
    c.lineWidth = 1;
    c.fillRect(o.x, o.y, o.w, o.h);
    c.strokeRect(o.x, o.y, o.w, o.h);
    c.fillStyle = '#333';
    c.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    c.textBaseline = 'top';
    wrapText(c, o.text||'', o.x+10, o.y+10, o.w-20, 20);
  } else if (o.type === 'mindmap') {
    c.fillStyle = o.bg || '#e3f2fd';
    c.strokeStyle = o.color;
    c.lineWidth = 2;
    const r = 30;
    c.beginPath();
    roundRect(c, o.x, o.y, o.w, o.h, Math.min(r, o.h/2));
    c.fill(); c.stroke();
    c.fillStyle = '#222';
    c.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'center';
    c.fillText(o.text||'Ý tưởng', o.x + o.w/2, o.y + o.h/2);
  } else if (o.type === 'card') {
    // Math Presentation Question Card on Canvas
    c.fillStyle = o.bg || '#f8fafc';
    c.strokeStyle = o.color || '#3b82f6';
    c.lineWidth = 2;
    roundRect(c, o.x, o.y, o.w, o.h, 12);
    c.fill(); c.stroke();
    
    // Header tag
    c.fillStyle = o.color || '#3b82f6';
    c.font = 'bold 13px "Be Vietnam Pro", sans-serif';
    c.textAlign = 'left';
    c.textBaseline = 'top';
    c.fillText(o.tag || 'CÂU HỎI TRÌNH CHIẾU', o.x + 14, o.y + 12);
    
    // Content
    c.fillStyle = '#1e293b';
    c.font = '14px "Be Vietnam Pro", sans-serif';
    wrapText(c, o.text || '', o.x + 14, o.y + 36, o.w - 28, 22);
  } else if (o.type === 'flow') {
    c.fillStyle = o.bg || '#fff';
    c.strokeStyle = o.color;
    c.lineWidth = 2;
    if (o.shape === 'diamond') {
      c.beginPath();
      c.moveTo(o.x + o.w/2, o.y);
      c.lineTo(o.x + o.w, o.y + o.h/2);
      c.lineTo(o.x + o.w/2, o.y + o.h);
      c.lineTo(o.x, o.y + o.h/2);
      c.closePath();
      c.fill(); c.stroke();
    } else if (o.shape === 'oval') {
      c.beginPath();
      c.ellipse(o.x+o.w/2, o.y+o.h/2, o.w/2, o.h/2, 0, 0, Math.PI*2);
      c.fill(); c.stroke();
    } else {
      c.beginPath();
      roundRect(c, o.x, o.y, o.w, o.h, 6);
      c.fill(); c.stroke();
    }
    c.fillStyle = '#222';
    c.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    c.textBaseline = 'middle';
    c.textAlign = 'center';
    c.fillText(o.text||'Bước', o.x + o.w/2, o.y + o.h/2);
  } else if (o.type === 'image' && o.img) {
    c.drawImage(o.img, o.x, o.y, o.w, o.h);
  } else if (o.type === 'connector') {
    const pts = resolveConnectorPoints(o);
    const a = pts.a, b = pts.b;
    const dx = b.x - a.x;
    const midX = a.x + dx/2;
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.bezierCurveTo(midX, a.y, midX, b.y, b.x, b.y);
    c.stroke();
    drawArrowHead(c, { x: midX, y: b.y }, b, 10 + (o.width || 2));
  }
  c.restore();
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x+r, y);
  c.lineTo(x+w-r, y);
  c.quadraticCurveTo(x+w, y, x+w, y+r);
  c.lineTo(x+w, y+h-r);
  c.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  c.lineTo(x+r, y+h);
  c.quadraticCurveTo(x, y+h, x, y+h-r);
  c.lineTo(x, y+r);
  c.quadraticCurveTo(x, y, x+r, y);
  c.closePath();
}

function wrapText(c, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '', yy = y;
  for (let i=0;i<words.length;i++) {
    const test = line + words[i] + ' ';
    if (c.measureText(test).width > maxW && i > 0) {
      c.fillText(line, x, yy); line = words[i]+' '; yy += lh;
    } else line = test;
  }
  c.fillText(line, x, yy);
}

function redraw() {
  if (!mainCanvas || !ctx) return;
  drawBackground();
  const t = activeTab();
  if (!t) return;
  const w = mainCanvas.width / (window.devicePixelRatio||1);
  const h = mainCanvas.height / (window.devicePixelRatio||1);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(t.pan.x, t.pan.y);
  ctx.scale(t.zoom, t.zoom);
  for (const o of t.objects) drawObject(ctx, o);
  if (state.currentObject) drawObject(ctx, state.currentObject);
  ctx.restore();
  drawOverlay();
  let zoomValEl = document.getElementById('zoom-val');
  if (zoomValEl) zoomValEl.textContent = Math.round(t.zoom*100) + '%';
}

function getAccentColor() {
  const tempEl = document.createElement('div');
  tempEl.style.color = 'var(--accent, #4a7cff)';
  document.body.appendChild(tempEl);
  const color = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  return color;
}

function drawOverlay() {
  if (!overlayCanvas || !ovCtx) return;
  const w = overlayCanvas.width / (window.devicePixelRatio||1);
  const h = overlayCanvas.height / (window.devicePixelRatio||1);
  ovCtx.clearRect(0, 0, w, h);
  const t = activeTab();
  if (!t || !state.selectedId) return;
  const o = t.objects.find(x => x.id === state.selectedId);
  if (!o) return;
  const b = getBounds(o);
  const tl = worldToScreen(b.x, b.y);
  const br = worldToScreen(b.x+b.w, b.y+b.h);
  
  const accentColor = getAccentColor();
  
  ovCtx.save();
  ovCtx.strokeStyle = accentColor;
  ovCtx.setLineDash([4, 4]);
  ovCtx.lineWidth = 1.5;
  ovCtx.strokeRect(tl.x-4, tl.y-4, br.x-tl.x+8, br.y-tl.y+8);
  ovCtx.setLineDash([]);
  
  if (isResizable(o)) {
    const handles = getResizeHandlesScreen(b);
    ovCtx.fillStyle = '#fff';
    ovCtx.strokeStyle = accentColor;
    ovCtx.lineWidth = 2;
    Object.values(handles).forEach(r => {
      ovCtx.fillRect(r.x, r.y, r.w, r.h);
      ovCtx.strokeRect(r.x, r.y, r.w, r.h);
    });
  }
  if (isConnectable(o)) {
    const pts = [
      worldToScreen(b.x + b.w/2, b.y),
      worldToScreen(b.x + b.w, b.y + b.h/2),
      worldToScreen(b.x + b.w/2, b.y + b.h),
      worldToScreen(b.x, b.y + b.h/2)
    ];
    ovCtx.fillStyle = accentColor;
    pts.forEach(p => { ovCtx.beginPath(); ovCtx.arc(p.x, p.y, 4, 0, Math.PI*2); ovCtx.fill(); });
  }
  ovCtx.restore();
}

function getResizeHandlesScreen(b) {
  const tl = worldToScreen(b.x, b.y);
  const br = worldToScreen(b.x + b.w, b.y + b.h);
  const s = 10;
  const mk = (x, y) => ({ x:x - s/2, y:y - s/2, w:s, h:s });
  return { nw:mk(tl.x,tl.y), ne:mk(br.x,tl.y), sw:mk(tl.x,br.y), se:mk(br.x,br.y) };
}

function hitResizeHandle(sx, sy) {
  const t = activeTab();
  if (!t || !state.selectedId) return null;
  const o = t.objects.find(x => x.id === state.selectedId);
  if (!o || !isResizable(o)) return null;
  const handles = getResizeHandlesScreen(getBounds(o));
  for (const [name, r] of Object.entries(handles)) {
    if (sx >= r.x-4 && sx <= r.x+r.w+4 && sy >= r.y-4 && sy <= r.y+r.h+4) return name;
  }
  return null;
}

function getBounds(o) {
  if (o.type === 'stroke') {
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for (const p of o.points) { minX=Math.min(minX,p.x); minY=Math.min(minY,p.y); maxX=Math.max(maxX,p.x); maxY=Math.max(maxY,p.y); }
    return { x:minX, y:minY, w:maxX-minX, h:maxY-minY };
  }
  if (o.type === 'line' || o.type === 'arrow') {
    const x = Math.min(o.x1,o.x2), y = Math.min(o.y1,o.y2);
    return { x, y, w: Math.abs(o.x2-o.x1), h: Math.abs(o.y2-o.y1) };
  }
  if (o.type === 'connector') {
    const pts = resolveConnectorPoints(o);
    const x = Math.min(pts.a.x, pts.b.x), y = Math.min(pts.a.y, pts.b.y);
    return { x, y, w: Math.abs(pts.b.x-pts.a.x), h: Math.abs(pts.b.y-pts.a.y) };
  }
  if (o.type === 'text') {
    const lines = (o.text||'').split('\n');
    const fs = o.fontSize||20;
    if (ctx) ctx.font = `${fs}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    let maxW = 0;
    for (const l of lines) maxW = Math.max(maxW, ctx ? ctx.measureText(l).width : fs * l.length * 0.6);
    return { x: o.x, y: o.y, w: maxW, h: lines.length*fs*1.2 };
  }
  return { x:o.x, y:o.y, w:o.w, h:o.h };
}

function hitTest(px, py) {
  const t = activeTab();
  if (!t) return null;
  for (let i = t.objects.length - 1; i >= 0; i--) {
    const o = t.objects[i];
    const b = getBounds(o);
    const pad = 6 / t.zoom;
    if (px >= b.x-pad && px <= b.x+b.w+pad && py >= b.y-pad && py <= b.y+b.h+pad) return o;
  }
  return null;
}

function beginResizeSelection(handle, worldPoint) {
  const t = activeTab();
  const o = t && state.selectedId ? t.objects.find(x => x.id === state.selectedId) : null;
  if (!o || !isResizable(o)) return false;
  pushUndo();
  state.resizingSelection = true;
  state.resizeHandle = handle;
  state.resizeStart = {
    startPoint: { x: worldPoint.x, y: worldPoint.y },
    bounds: getBounds(o),
    object: JSON.parse(JSON.stringify({...o, img: undefined}))
  };
  return true;
}

function resizeSelectedObject(worldPoint) {
  const t = activeTab();
  const o = t && state.selectedId ? t.objects.find(x => x.id === state.selectedId) : null;
  if (!o || !state.resizeStart) return;
  const h = state.resizeHandle;
  const b = {...state.resizeStart.bounds};
  let x1 = b.x, y1 = b.y, x2 = b.x + b.w, y2 = b.y + b.h;
  if (h.includes('w')) x1 = worldPoint.x;
  if (h.includes('e')) x2 = worldPoint.x;
  if (h.includes('n')) y1 = worldPoint.y;
  if (h.includes('s')) y2 = worldPoint.y;
  if (x2 < x1) [x1, x2] = [x2, x1];
  if (y2 < y1) [y1, y2] = [y2, y1];
  const min = 12 / (activeTab().zoom || 1);
  const nb = { x:x1, y:y1, w:Math.max(min, x2-x1), h:Math.max(min, y2-y1) };
  if (o.type === 'text') {
    const original = state.resizeStart.object;
    const origB = state.resizeStart.bounds;
    const scaleW = origB.w ? nb.w / origB.w : 1;
    const scaleH = origB.h ? nb.h / origB.h : 1;
    const scale = Math.max(0.25, Math.min(6, Math.max(scaleW, scaleH)));
    o.x = nb.x;
    o.y = nb.y;
    o.fontSize = Math.round(Math.max(8, Math.min(160, (original.fontSize || 20) * scale)));
    state.textSize = o.fontSize;
    syncPropsPanel();
  } else if (['sticky','mindmap','flow','rect','ellipse','image','triangle','oxy','card'].includes(o.type)) {
    o.x = nb.x; o.y = nb.y; o.w = nb.w; o.h = nb.h;
  }
}

// =========================================================================
// RULER SNAP HELPER
// =========================================================================
function snapPointToRuler(worldP) {
  const snapCheckbox = document.getElementById('snap-ruler');
  if (!rulerState.visible || !snapCheckbox || !snapCheckbox.checked) return worldP;
  
  // Convert ruler center to world point
  const wrapRect = wrap.getBoundingClientRect();
  const rulerEl = document.getElementById('ruler-widget');
  if (!rulerEl) return worldP;
  
  const rx = rulerState.x;
  const ry = rulerState.y;
  const rad = (rulerState.angle * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  
  // Distance from screen point to ruler top edge line
  const pScreen = worldToScreen(worldP.x, worldP.y);
  const dx = pScreen.x - rx;
  const dy = pScreen.y - ry;
  
  // Projection along ruler direction
  const proj = dx * dirX + dy * dirY;
  // Perpendicular distance
  const perp = -dx * dirY + dy * dirX;
  
  if (Math.abs(perp) < 25 && proj >= -30 && proj <= rulerState.length + 30) {
    // Snap to ruler top edge
    const snappedScreenX = rx + proj * dirX;
    const snappedScreenY = ry + proj * dirY;
    return screenToWorld(snappedScreenX, snappedScreenY);
  }
  return worldP;
}

// =========================================================================
// POINTER EVENTS & DRAWING INTERACTION
// =========================================================================
let lastMouse = {x:0, y:0};
let activePointers = new Map();
let pinchStartDist = null;
let pinchStartZoom = null;

if (wrap) {
  wrap.addEventListener('contextmenu', (e) => e.preventDefault());
  wrap.addEventListener('pointerdown', (e) => {
    wrap.setPointerCapture(e.pointerId);
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (e.button === 2 || e.button === 1 || state.spaceDown || activePointers.size >= 2) {
      e.preventDefault();
      state.isPanning = true;
      wrap.classList.add('panning');
      
      state.isDrawing = false;
      state.currentObject = null;
      state.draggingSelection = false;
      state.resizingSelection = false;
      
      if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchStartZoom = activeTab() ? activeTab().zoom : 1;
        lastMouse = { x: (pts[0].x + pts[1].x)/2, y: (pts[0].y + pts[1].y)/2 };
      } else {
        lastMouse = { x: e.clientX, y: e.clientY };
      }
      return;
    }
    
    if (activePointers.size > 1) return;

    const rect = wrap.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    let p = screenToWorld(sx, sy);
    p = snapPointToRuler(p);
    state.startPt = p;
    const t = activeTab();

    if (state.tool === 'laser') {
      addLaserPoint(p.x, p.y);
      return;
    }

    if (state.tool === 'select') {
      const handle = hitResizeHandle(sx, sy);
      if (handle && beginResizeSelection(handle, p)) return;
      const obj = hitTest(p.x, p.y);
      if (obj) {
        state.selectedId = obj.id;
        state.draggingSelection = true;
        state.dragOffset = p;
        syncPropsPanel();
        redraw();
      } else {
        state.selectedId = null;
        syncPropsPanel();
        redraw();
      }
      return;
    }
    if (state.tool === 'eraser') {
      state.isDrawing = true;
      eraseAt(p.x, p.y);
      return;
    }
    if (state.tool === 'text') {
      openTextEditor(sx, sy, p);
      return;
    }
    if (state.tool === 'sticky') {
      const o = { id: uid(), type:'sticky', x:p.x-80, y:p.y-60, w:160, h:120, text:'', bg:'#fff59d' };
      pushUndo();
      t.objects.push(o);
      state.selectedId = o.id;
      syncPropsPanel();
      redraw();
      setTimeout(() => editObjectText(o), 10);
      return;
    }
    if (state.tool === 'mindmap') {
      const parentId = state.selectedId;
      const o = { id: uid(), type:'mindmap', x:p.x-70, y:p.y-25, w:140, h:50, text:'Ý tưởng', color:state.color, bg:'#e3f2fd' };
      pushUndo();
      t.objects.push(o);
      const connected = autoConnectForNewObject(o, parentId);
      state.selectedId = o.id;
      syncPropsPanel();
      redraw();
      if (connected) showToast('Đã tự động nối khối');
      setTimeout(() => editObjectText(o), 10);
      return;
    }
    if (state.tool === 'flow') {
      const parentId = state.selectedId;
      const o = { id: uid(), type:'flow', shape:'rect', x:p.x-60, y:p.y-25, w:120, h:50, text:'Bước', color:state.color, bg:'#fff' };
      pushUndo();
      t.objects.push(o);
      const connected = autoConnectForNewObject(o, parentId);
      state.selectedId = o.id;
      syncPropsPanel();
      redraw();
      if (connected) showToast('Đã tự động nối khối');
      setTimeout(() => editObjectText(o), 10);
      return;
    }
    if (state.tool === 'connector') {
      const end = endpointFromWorldPoint(p);
      if (!state.connectorFrom) {
        state.connectorFrom = end;
        showToast(end.objectId ? 'Đã bắt đầu nối. Nhấn vào khối khác.' : 'Đã bắt đầu nối. Nhấn vào một điểm hoặc khối khác.');
      } else {
        if (state.connectorFrom.objectId && end.objectId && state.connectorFrom.objectId === end.objectId) {
          showToast('Hãy chọn một khối khác để nối');
          return;
        }
        const o = makeConnector(state.connectorFrom, end);
        pushUndo();
        t.objects.push(o);
        state.selectedId = o.id;
        state.connectorFrom = null;
        syncPropsPanel();
        redraw();
        scheduleAutosave();
        showToast('Đã thêm đường nối');
      }
      return;
    }
    state.isDrawing = true;
    if (state.tool === 'pen' || state.tool === 'highlighter') {
      state.currentObject = {
        id: uid(), type:'stroke',
        points:[p],
        color: state.color,
        width: state.tool==='highlighter' ? state.strokeWidth*4 : state.strokeWidth,
        alpha: state.tool==='highlighter' ? 0.3 : 1
      };
    } else if (state.tool === 'rect') {
      state.currentObject = { id:uid(), type:'rect', x:p.x, y:p.y, w:0, h:0, color:state.color, width:state.strokeWidth, filled:state.fill };
    } else if (state.tool === 'ellipse') {
      state.currentObject = { id:uid(), type:'ellipse', x:p.x, y:p.y, w:0, h:0, color:state.color, width:state.strokeWidth, filled:state.fill };
    } else if (state.tool === 'triangle') {
      state.currentObject = { id:uid(), type:'triangle', x:p.x, y:p.y, w:0, h:0, color:state.color, width:state.strokeWidth, filled:state.fill };
    } else if (state.tool === 'oxy') {
      state.currentObject = { id:uid(), type:'oxy', x:p.x, y:p.y, w:0, h:0, color:state.color, width:state.strokeWidth };
    } else if (state.tool === 'line') {
      state.currentObject = { id:uid(), type:'line', x1:p.x, y1:p.y, x2:p.x, y2:p.y, color:state.color, width:state.strokeWidth };
    } else if (state.tool === 'arrow') {
      state.currentObject = { id:uid(), type:'arrow', x1:p.x, y1:p.y, x2:p.x, y2:p.y, color:state.color, width:state.strokeWidth };
    }
  });

  wrap.addEventListener('pointermove', (e) => {
    if (activePointers.has(e.pointerId)) {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    const rect = wrap.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    
    if (state.isPanning) {
      const t = activeTab();
      let dx, dy;
      if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const center = { x: (pts[0].x + pts[1].x)/2, y: (pts[0].y + pts[1].y)/2 };
        dx = center.x - lastMouse.x;
        dy = center.y - lastMouse.y;
        lastMouse = center;
        
        if (pinchStartDist > 0) {
          const zoomFactor = currentDist / pinchStartDist;
          const newZoom = Math.max(0.01, Math.min(3, pinchStartZoom * zoomFactor));
          const sxCenter = center.x - rect.left;
          const syCenter = center.y - rect.top;
          const worldBefore = { x: (sxCenter - t.pan.x) / t.zoom, y: (syCenter - t.pan.y) / t.zoom };
          
          t.zoom = newZoom;
          t.pan.x = sxCenter - worldBefore.x * t.zoom;
          t.pan.y = syCenter - worldBefore.y * t.zoom;
        }
      } else {
        dx = e.clientX - lastMouse.x;
        dy = e.clientY - lastMouse.y;
        lastMouse = { x: e.clientX, y: e.clientY };
        t.pan.x += dx;
        t.pan.y += dy;
      }
      redraw();
      return;
    }

    let p = screenToWorld(sx, sy);
    p = snapPointToRuler(p);

    if (state.tool === 'laser') {
      addLaserPoint(p.x, p.y);
      return;
    }

    if (state.resizingSelection) {
      resizeSelectedObject(p);
      redraw();
      return;
    }

    if (state.draggingSelection) {
      const t = activeTab();
      const o = t.objects.find(x => x.id === state.selectedId);
      if (o) {
        const dx = p.x - state.dragOffset.x, dy = p.y - state.dragOffset.y;
        if (o.type === 'line' || o.type === 'arrow') {
          o.x1 += dx; o.y1 += dy; o.x2 += dx; o.y2 += dy;
        } else if (o.type === 'stroke') {
          o.points.forEach(pt => { pt.x += dx; pt.y += dy; });
        } else {
          o.x += dx; o.y += dy;
        }
        state.dragOffset = p;
        redraw();
      }
      return;
    }

    if (state.isDrawing && state.tool === 'eraser') {
      eraseAt(p.x, p.y);
      return;
    }

    if (state.isDrawing && state.currentObject) {
      const co = state.currentObject;
      if (co.type === 'stroke') {
        co.points.push(p);
      } else if (['rect','ellipse','triangle','oxy'].includes(co.type)) {
        co.w = p.x - state.startPt.x;
        co.h = p.y - state.startPt.y;
      } else if (co.type === 'line' || co.type === 'arrow') {
        co.x2 = p.x; co.y2 = p.y;
      }
      redraw();
    }
  });

  wrap.addEventListener('pointerup', (e) => {
    activePointers.delete(e.pointerId);
    if (activePointers.size === 0) {
      wrap.releasePointerCapture(e.pointerId);
    }
    
    if (state.isPanning) {
      if (activePointers.size === 0) {
        state.isPanning = false;
        wrap.classList.remove('panning');
      }
      return;
    }

    if (state.resizingSelection) {
      state.resizingSelection = false;
      state.resizeHandle = null;
      state.resizeStart = null;
      scheduleAutosave();
      return;
    }

    if (state.draggingSelection) {
      state.draggingSelection = false;
      scheduleAutosave();
      return;
    }

    if (state.isDrawing) {
      state.isDrawing = false;
      if (state.currentObject) {
        const t = activeTab();
        if (t) {
          pushUndo();
          t.objects.push(state.currentObject);
          scheduleAutosave();
        }
        state.currentObject = null;
        redraw();
      }
    }
  });

  wrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    const t = activeTab(); if (!t) return;
    const rect = wrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.01, Math.min(3, t.zoom * factor));
    
    const worldBefore = { x: (mouseX - t.pan.x) / t.zoom, y: (mouseY - t.pan.y) / t.zoom };
    t.zoom = newZoom;
    t.pan.x = mouseX - worldBefore.x * t.zoom;
    t.pan.y = mouseY - worldBefore.y * t.zoom;
    redraw();
  }, { passive: false });
}

// =========================================================================
// TEXT EDITOR
// =========================================================================
function openTextEditor(sx, sy, worldP) {
  let ed = document.getElementById('text-editor');
  if (!ed) {
    ed = document.createElement('div');
    ed.id = 'text-editor';
    ed.contentEditable = true;
    wrap.appendChild(ed);
  }
  ed.style.left = sx + 'px';
  ed.style.top = sy + 'px';
  ed.style.fontSize = (state.textSize * (activeTab()?.zoom || 1)) + 'px';
  ed.style.color = state.color;
  ed.style.display = 'block';
  ed.innerText = '';
  ed.focus();

  const onBlur = () => {
    ed.style.display = 'none';
    ed.removeEventListener('blur', onBlur);
    const txt = ed.innerText.trim();
    if (txt) {
      const t = activeTab();
      if (t) {
        pushUndo();
        t.objects.push({
          id: uid(), type: 'text',
          x: worldP.x, y: worldP.y,
          text: txt, color: state.color, fontSize: state.textSize
        });
        redraw();
        scheduleAutosave();
      }
    }
  };
  ed.addEventListener('blur', onBlur);
}

function editObjectText(o) {
  const t = activeTab();
  if (!t) return;
  const screenP = worldToScreen(o.x, o.y);
  let ed = document.getElementById('text-editor');
  if (!ed) {
    ed = document.createElement('div');
    ed.id = 'text-editor';
    ed.contentEditable = true;
    wrap.appendChild(ed);
  }
  ed.style.left = screenP.x + 'px';
  ed.style.top = screenP.y + 'px';
  ed.style.width = Math.max(120, o.w * t.zoom) + 'px';
  ed.style.minHeight = Math.max(40, o.h * t.zoom) + 'px';
  ed.style.display = 'block';
  ed.innerText = o.text || '';
  ed.focus();

  const onBlur = () => {
    ed.style.display = 'none';
    ed.removeEventListener('blur', onBlur);
    o.text = ed.innerText.trim();
    redraw();
    scheduleAutosave();
  };
  ed.addEventListener('blur', onBlur);
}

function eraseAt(x, y) {
  const t = activeTab();
  if (!t) return;
  const radius = 20 / t.zoom;
  const prevLen = t.objects.length;
  t.objects = t.objects.filter(o => {
    const b = getBounds(o);
    const cx = b.x + b.w/2, cy = b.y + b.h/2;
    return Math.hypot(cx - x, cy - y) > radius;
  });
  if (t.objects.length !== prevLen) {
    redraw();
    scheduleAutosave();
  }
}

// =========================================================================
// UNDO / REDO / CLIPBOARD
// =========================================================================
function pushUndo() {
  const t = activeTab();
  if (!t) return;
  state.undoStack.push(JSON.stringify(t.objects));
  state.redoStack = [];
}
function undo() {
  const t = activeTab();
  if (!t || state.undoStack.length === 0) return;
  state.redoStack.push(JSON.stringify(t.objects));
  t.objects = JSON.parse(state.undoStack.pop());
  redraw();
}
function redo() {
  const t = activeTab();
  if (!t || state.redoStack.length === 0) return;
  state.undoStack.push(JSON.stringify(t.objects));
  t.objects = JSON.parse(state.redoStack.pop());
  redraw();
}

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    if (e.shiftKey) redo(); else undo();
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (state.selectedId) {
      pushUndo();
      deleteObjectAndAttachedConnectors(state.selectedId);
      state.selectedId = null;
      redraw();
    }
  }
  if (e.key === ' ') state.spaceDown = true;
  if (e.key.toLowerCase() === 'k') {
    selectTool('laser');
  }
  if (e.key.toLowerCase() === 'p') selectTool('pen');
  if (e.key.toLowerCase() === 'v') selectTool('select');
  if (e.key.toLowerCase() === 'e') selectTool('eraser');
  if (e.key.toLowerCase() === 'r') selectTool('rect');
  if (e.key.toLowerCase() === 'l') selectTool('line');
  if (e.key.toLowerCase() === 't') selectTool('text');
});
window.addEventListener('keyup', (e) => { if (e.key === ' ') state.spaceDown = false; });

function selectTool(name) {
  state.tool = name;
  document.querySelectorAll('.tool').forEach(b => {
    b.classList.toggle('active', b.dataset.tool === name);
  });
  if (wrap) {
    wrap.classList.toggle('laser-mode', name === 'laser');
  }
  syncPropsPanel();
}
document.querySelectorAll('.tool').forEach(btn => {
  btn.addEventListener('click', () => selectTool(btn.dataset.tool));
});

// =========================================================================
// BỘ DỤNG CỤ HÌNH HỌC KỸ THUẬT SỐ (GIAI ĐOẠN 3)
// =========================================================================

// 1. THƯỚC THẲNG (RULER)
const rulerState = {
  visible: false,
  x: 200, y: 140,
  angle: 0,
  length: 480
};

function initRuler() {
  const rulerEl = document.getElementById('ruler-widget');
  const canvas = document.getElementById('ruler-canvas');
  if (!rulerEl || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 480, 72);
  
  // Ticks: 20 cm scale
  const pixelsPerCm = 22;
  const startX = 30;
  
  ctx.strokeStyle = '#1e3a8a';
  ctx.fillStyle = '#1e3a8a';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  
  for (let cm = 0; cm <= 18; cm++) {
    const x = startX + cm * pixelsPerCm;
    // Major tick (cm)
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, 20);
    ctx.stroke();
    ctx.fillText(cm.toString(), x, 30);
    
    if (cm < 18) {
      // Half-cm tick
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + pixelsPerCm / 2, 0); ctx.lineTo(x + pixelsPerCm / 2, 12);
      ctx.stroke();
      
      // mm ticks
      for (let mm = 1; mm < 10; mm++) {
        if (mm === 5) continue;
        ctx.beginPath();
        ctx.moveTo(x + mm * (pixelsPerCm / 10), 0);
        ctx.lineTo(x + mm * (pixelsPerCm / 10), 7);
        ctx.stroke();
      }
    }
  }

  // Draggable widget
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  
  rulerEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.ruler-rotate-handle') || e.target.closest('.ruler-close-btn')) return;
    isDragging = true;
    dragStart = { x: e.clientX - rulerState.x, y: e.clientY - rulerState.y };
    rulerEl.setPointerCapture(e.pointerId);
  });
  
  rulerEl.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    rulerState.x = e.clientX - dragStart.x;
    rulerState.y = e.clientY - dragStart.y;
    rulerEl.style.left = rulerState.x + 'px';
    rulerEl.style.top = rulerState.y + 'px';
  });
  
  rulerEl.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      rulerEl.releasePointerCapture(e.pointerId);
    }
  });

  // Rotate handle
  const rotateHandle = document.getElementById('ruler-rotate-handle');
  let isRotating = false;
  if (rotateHandle) {
    rotateHandle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      isRotating = true;
      rotateHandle.setPointerCapture(e.pointerId);
    });
    rotateHandle.addEventListener('pointermove', (e) => {
      if (!isRotating) return;
      const angleRad = Math.atan2(e.clientY - rulerState.y, e.clientX - rulerState.x);
      let deg = Math.round((angleRad * 180 / Math.PI) * 10) / 10;
      if (deg < 0) deg += 360;
      rulerState.angle = deg;
      rulerEl.style.transform = `rotate(${deg}deg)`;
      const valEl = document.getElementById('ruler-angle-val');
      if (valEl) valEl.textContent = deg.toFixed(1) + '°';
    });
    rotateHandle.addEventListener('pointerup', (e) => {
      if (isRotating) {
        isRotating = false;
        rotateHandle.releasePointerCapture(e.pointerId);
      }
    });
  }
}

function toggleRuler(forced) {
  const rulerEl = document.getElementById('ruler-widget');
  const btn = document.getElementById('ruler-toggle-btn');
  rulerState.visible = forced !== undefined ? forced : !rulerState.visible;
  if (rulerEl) rulerEl.classList.toggle('active', rulerState.visible);
  if (btn) btn.classList.toggle('active', rulerState.visible);
  if (rulerState.visible) initRuler();
}

// 2. THƯỚC ĐO GÓC (PROTRACTOR)
const protractorState = {
  visible: false,
  x: 300, y: 140,
  armAngle: 45
};

function initProtractor() {
  const protractorEl = document.getElementById('protractor-widget');
  const canvas = document.getElementById('protractor-canvas');
  if (!protractorEl || !canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 360, 200);

  const cx = 180, cy = 190, r = 160;
  ctx.strokeStyle = '#065f46';
  ctx.fillStyle = '#065f46';
  ctx.lineWidth = 1;
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Semicircle arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.stroke();

  // Degree ticks 0 to 180
  for (let deg = 0; deg <= 180; deg += 5) {
    const rad = Math.PI - (deg * Math.PI / 180);
    const tickLen = deg % 10 === 0 ? 14 : 7;
    const x1 = cx + (r - tickLen) * Math.cos(rad);
    const y1 = cy - (r - tickLen) * Math.sin(rad);
    const x2 = cx + r * Math.cos(rad);
    const y2 = cy - r * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (deg % 30 === 0) {
      const tx = cx + (r - 26) * Math.cos(rad);
      const ty = cy - (r - 26) * Math.sin(rad);
      ctx.fillText(deg.toString(), tx, ty);
    }
  }

  // Draggable Protractor
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  protractorEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#protractor-handle') || e.target.closest('.ruler-close-btn')) return;
    isDragging = true;
    dragStart = { x: e.clientX - protractorState.x, y: e.clientY - protractorState.y };
    protractorEl.setPointerCapture(e.pointerId);
  });
  protractorEl.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    protractorState.x = e.clientX - dragStart.x;
    protractorState.y = e.clientY - dragStart.y;
    protractorEl.style.left = protractorState.x + 'px';
    protractorEl.style.top = protractorState.y + 'px';
  });
  protractorEl.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      protractorEl.releasePointerCapture(e.pointerId);
    }
  });

  // Measuring Arm Handle
  const arm = document.getElementById('protractor-arm');
  const handle = document.getElementById('protractor-handle');
  let isMeasuring = false;
  if (handle && arm) {
    handle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      isMeasuring = true;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!isMeasuring) return;
      const rect = protractorEl.getBoundingClientRect();
      const originX = rect.left + 180;
      const originY = rect.top + 190;
      const angleRad = Math.atan2(originY - e.clientY, e.clientX - originX);
      let deg = Math.round((angleRad * 180 / Math.PI) * 10) / 10;
      if (deg < 0) deg = 0;
      if (deg > 180) deg = 180;
      protractorState.armAngle = deg;
      arm.style.transform = `rotate(${-deg}deg)`;
      const badge = document.getElementById('protractor-angle-val');
      if (badge) badge.textContent = `📐 Góc: ${deg.toFixed(1)}°`;
    });
    handle.addEventListener('pointerup', (e) => {
      if (isMeasuring) {
        isMeasuring = false;
        handle.releasePointerCapture(e.pointerId);
      }
    });
  }
}

function toggleProtractor(forced) {
  const el = document.getElementById('protractor-widget');
  const btn = document.getElementById('protractor-toggle-btn');
  protractorState.visible = forced !== undefined ? forced : !protractorState.visible;
  if (el) el.classList.toggle('active', protractorState.visible);
  if (btn) btn.classList.toggle('active', protractorState.visible);
  if (protractorState.visible) initProtractor();
}

// 3. COMPA KỸ THUẬT SỐ (COMPASS)
const compassState = {
  visible: false,
  x: 400, y: 180,
  radius: 100,
  angle: 0
};

function initCompass() {
  const compassEl = document.getElementById('compass-widget');
  const needle = document.getElementById('compass-needle');
  const pencil = document.getElementById('compass-pencil');
  const rotator = document.getElementById('compass-rotator');
  const canvas = document.getElementById('compass-canvas');
  if (!compassEl || !needle || !pencil || !rotator || !canvas) return;

  function renderCompassLegs() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 260, 260);
    const cx = 130, cy = 130;
    const px = cx + compassState.radius;
    const py = cy;
    
    // Legs
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(130, 30); // Top hinge
    ctx.lineTo(cx, cy);   // Needle
    ctx.moveTo(130, 30);
    ctx.lineTo(px, py);   // Pencil
    ctx.stroke();

    // Arc preview
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, compassState.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  renderCompassLegs();

  // Needle Drag (Move Center)
  let isMovingNeedle = false;
  needle.addEventListener('pointerdown', (e) => {
    isMovingNeedle = true;
    needle.setPointerCapture(e.pointerId);
  });
  needle.addEventListener('pointermove', (e) => {
    if (!isMovingNeedle) return;
    compassState.x = e.clientX - 130;
    compassState.y = e.clientY - 130;
    compassEl.style.left = compassState.x + 'px';
    compassEl.style.top = compassState.y + 'px';
  });
  needle.addEventListener('pointerup', (e) => {
    if (isMovingNeedle) { isMovingNeedle = false; needle.releasePointerCapture(e.pointerId); }
  });

  // Pencil Drag (Adjust Radius)
  let isAdjustingRadius = false;
  pencil.addEventListener('pointerdown', (e) => {
    isAdjustingRadius = true;
    pencil.setPointerCapture(e.pointerId);
  });
  pencil.addEventListener('pointermove', (e) => {
    if (!isAdjustingRadius) return;
    const r = Math.max(20, Math.min(120, e.clientX - (compassState.x + 130)));
    compassState.radius = r;
    pencil.style.left = (130 + r) + 'px';
    renderCompassLegs();
  });
  pencil.addEventListener('pointerup', (e) => {
    if (isAdjustingRadius) { isAdjustingRadius = false; pencil.releasePointerCapture(e.pointerId); }
  });

  // Rotator Drag (Draw Circle to Canvas)
  let isDrawingCircle = false;
  rotator.addEventListener('pointerdown', (e) => {
    isDrawingCircle = true;
    rotator.setPointerCapture(e.pointerId);
  });
  rotator.addEventListener('pointerup', (e) => {
    if (isDrawingCircle) {
      isDrawingCircle = false;
      rotator.releasePointerCapture(e.pointerId);
      
      // Add drawn circle object to active tab
      const centerWorld = screenToWorld(compassState.x + 130, compassState.y + 130);
      const radiusWorld = compassState.radius / (activeTab()?.zoom || 1);
      const circleObj = {
        id: uid(),
        type: 'ellipse',
        x: centerWorld.x - radiusWorld,
        y: centerWorld.y - radiusWorld,
        w: radiusWorld * 2,
        h: radiusWorld * 2,
        color: state.color,
        width: state.strokeWidth,
        filled: state.fill
      };
      pushUndo();
      activeTab().objects.push(circleObj);
      redraw();
      scheduleAutosave();
      showToast('⭕ Đã vẽ đường tròn hoàn hảo từ Compa!');
    }
  });
}

function toggleCompass(forced) {
  const el = document.getElementById('compass-widget');
  const btn = document.getElementById('compass-toggle-btn');
  compassState.visible = forced !== undefined ? forced : !compassState.visible;
  if (el) el.classList.toggle('active', compassState.visible);
  if (btn) btn.classList.toggle('active', compassState.visible);
  if (compassState.visible) initCompass();
}

// =========================================================================
// DESMOS GRAPHING CALCULATOR STUDIO INTEGRATION (GIAI ĐOẠN 3)
// =========================================================================
let desmosCalculatorInstance = null;

function openDesmosModal() {
  const modal = document.getElementById('desmos-modal');
  if (!modal) return;
  modal.classList.add('show');
  
  if (!desmosCalculatorInstance && window.Desmos) {
    const elt = document.getElementById('desmos-container');
    if (elt) {
      desmosCalculatorInstance = Desmos.GraphingCalculator(elt, {
        keypad: true,
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        fontSize: 16
      });
      // Default equation
      desmosCalculatorInstance.setExpression({ id: 'graph1', latex: 'y = x^3 - 3x + 1', color: '#2563eb' });
    }
  }
}

function closeDesmosModal() {
  const modal = document.getElementById('desmos-modal');
  if (modal) modal.classList.remove('show');
}

function insertDesmosPreset(type) {
  if (!desmosCalculatorInstance) return;
  if (type === 'bac3') {
    desmosCalculatorInstance.setExpression({ id: 'graph1', latex: 'y = x^3 - 3x + 1', color: '#2563eb' });
  } else if (type === 'nhatbien') {
    desmosCalculatorInstance.setExpression({ id: 'graph1', latex: 'y = \\frac{2x - 1}{x + 1}', color: '#10b981' });
  } else if (type === 'trungphuong') {
    desmosCalculatorInstance.setExpression({ id: 'graph1', latex: 'y = x^4 - 2x^2 - 1', color: '#f59e0b' });
  } else if (type === 'trig') {
    desmosCalculatorInstance.setExpression({ id: 'graph1', latex: 'y = 2\\sin(x) + 1', color: '#8b5cf6' });
  }
}

function insertDesmosGraphToWhiteboard() {
  if (!desmosCalculatorInstance) return;
  desmosCalculatorInstance.asyncScreenshot({ width: 800, height: 600, targetPixelRatio: 2 }, function(dataUri) {
    const img = new Image();
    img.onload = () => {
      const t = activeTab();
      if (!t) return;
      const wrapRect = wrap.getBoundingClientRect();
      const centerWorld = screenToWorld(wrapRect.width / 2, wrapRect.height / 2);
      const w = 480;
      const h = 360;
      const obj = {
        id: uid(),
        type: 'image',
        img: img,
        src: dataUri,
        x: centerWorld.x - w / 2,
        y: centerWorld.y - h / 2,
        w: w,
        h: h
      };
      pushUndo();
      t.objects.push(obj);
      state.selectedId = obj.id;
      redraw();
      scheduleAutosave();
      closeDesmosModal();
      showToast('🎉 Đã chèn đồ thị Desmos vào Bảng Trắng!');
    };
    img.src = dataUri;
  });
}

// =========================================================================
// MATH STUDIO SVG INSERTION TO WHITEBOARD
// =========================================================================
function insertSvgToWhiteboard(svgString, options = {}) {
  const t = activeTab();
  if (!t) return;
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const wrapRect = wrap.getBoundingClientRect();
    const centerWorld = screenToWorld(wrapRect.width / 2, wrapRect.height / 2);
    const w = options.width || 420;
    const h = options.height || 320;
    const obj = {
      id: uid(),
      type: 'image',
      img: img,
      src: url,
      svgData: svgString,
      x: centerWorld.x - w / 2,
      y: centerWorld.y - h / 2,
      w: w,
      h: h
    };
    pushUndo();
    t.objects.push(obj);
    state.selectedId = obj.id;
    redraw();
    scheduleAutosave();
    if (typeof closeMathStudio === 'function') closeMathStudio();
    showToast('🎉 Đã chèn Bảng biến thiên / Đồ thị vào Bảng Trắng!');
  };
  img.src = url;
}
window.insertSvgToWhiteboard = insertSvgToWhiteboard;

// =========================================================================
// TRÌNH CHIẾU ĐỀ THI TƯƠNG TÁC & CHIA ĐÔI MÀN HÌNH (GIAI ĐOẠN 3)
// =========================================================================
const examPresState = {
  isOpen: false,
  currentIndex: 0,
  showSolution: false,
  exam: null
};

const SAMPLE_EXAM_2025 = {
  title: "Đề Minh Họa Tốt Nghiệp THPT 2025 - Môn Toán",
  questions: [
    {
      part: "PHẦN 1: TRẮC NGHIỆM 4 PHƯƠNG ÁN",
      tag: "Phần 1 - Câu 1",
      content: "Cho hàm số $y = f(x)$ có bảng biến thiên như hình vẽ. Hàm số đã cho đồng biến trên khoảng nào dưới đây?",
      options: ["$(-1; 1)$", "$(0; 2)$", "$(-\\infty; -1)$", "$(1; +\\infty)$"],
      answer: "A",
      explanation: "Dựa vào bảng biến thiên, ta thấy $f'(x) > 0$ trên khoảng $(-1; 1)$, do đó hàm số đồng biến trên khoảng $(-1; 1)$."
    },
    {
      part: "PHẦN 1: TRẮC NGHIỆM 4 PHƯƠNG ÁN",
      tag: "Phần 1 - Câu 2",
      content: "Cho khối lăng trụ có diện tích đáy $B = 6a^2$ và chiều cao $h = 3a$. Thể tích của khối lăng trụ đã cho bằng:",
      options: ["$18a^3$", "$6a^3$", "$9a^3$", "$54a^3$"],
      answer: "A",
      explanation: "Thể tích khối lăng trụ là: $V = B \\cdot h = 6a^2 \\cdot 3a = 18a^3$."
    },
    {
      part: "PHẦN 2: TRẮC NGHIỆM ĐÚNG / SAI",
      tag: "Phần 2 - Câu 1",
      content: "Cho hàm số $f(x) = x^3 - 3x^2 + 2$. Xét tính đúng/sai của các khẳng định sau:\n\na) Hàm số đạt cực đại tại điểm $x = 0$.\nb) Giá trị cực tiểu của hàm số bằng $-2$.\nc) Đồ thị hàm số có tâm đối xứng là $I(1; 0)$.\nd) Phương trình $f(x) = m$ có 3 nghiệm phân biệt khi $-2 < m < 2$.",
      options: ["a) Đúng", "b) Đúng", "c) Đúng", "d) Đúng"],
      answer: "a) Đúng, b) Đúng, c) Đúng, d) Đúng",
      explanation: "Ta có $f'(x) = 3x^2 - 6x = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$.\n• $f(0) = 2$ (Cực đại tại $x=0$).\n• $f(2) = -2$ (Cực tiểu tại $x=2$).\n• Điểm uốn $I(1; 0)$ là tâm đối xứng.\n• 3 nghiệm khi $y_{CT} < m < y_{CĐ} \\Leftrightarrow -2 < m < 2$."
    },
    {
      part: "PHẦN 3: TRẢ LỜI NGẮN",
      tag: "Phần 3 - Câu 1",
      content: "Một doanh nghiệp sản xuất một loại sản phẩm với hàm tổng chi phí $C(x) = x^3 - 30x^2 + 500x + 1000$ (nghìn đồng), trong đó $x$ là số lượng sản phẩm sản xuất ($x > 0$). Biết chi phí trung bình là $\\overline{C}(x) = \\frac{C(x)}{x}$. Hỏi doanh nghiệp cần sản xuất bao nhiêu sản phẩm để chi phí trung bình là nhỏ nhất?",
      answer: "15",
      explanation: "Chi phí trung bình $\\overline{C}(x) = x^2 - 30x + 500 + \\frac{1000}{x}$.\nLấy đạo hàm $\\overline{C}'(x) = 2x - 30 - \\frac{1000}{x^2} = 0 \\Leftrightarrow x = 15$ sản phẩm."
    }
  ]
};

function toggleExamPresentation() {
  const drawer = document.getElementById('exam-pres-drawer');
  const btn = document.getElementById('exam-pres-btn');
  examPresState.isOpen = !examPresState.isOpen;
  
  if (drawer) drawer.classList.toggle('open', examPresState.isOpen);
  if (btn) btn.classList.toggle('active', examPresState.isOpen);
  
  if (examPresState.isOpen && !examPresState.exam) {
    loadSampleExamToPresentation();
  }
  setTimeout(resizeCanvases, 300);
}

function loadSampleExamToPresentation() {
  examPresState.exam = SAMPLE_EXAM_2025;
  examPresState.currentIndex = 0;
  examPresState.showSolution = false;
  presRenderCurrentQuestion();
  showToast('📄 Đã nạp Đề thi Chuẩn Tốt Nghiệp 2025!');
}

function presRenderCurrentQuestion() {
  const container = document.getElementById('exam-pres-container');
  const counter = document.getElementById('pres-q-counter');
  if (!container || !examPresState.exam) return;

  const q = examPresState.exam.questions[examPresState.currentIndex];
  if (!q) return;

  if (counter) counter.textContent = `${examPresState.currentIndex + 1}/${examPresState.exam.questions.length}`;

  let optionsHtml = '';
  if (q.options && q.options.length) {
    optionsHtml = q.options.map((opt, idx) => {
      const labels = ['A', 'B', 'C', 'D'];
      const lbl = labels[idx] || (idx + 1);
      return `
        <button class="exam-choice-btn" onclick="presCheckAnswer('${lbl}', this)">
          <span style="font-weight:bold; color:var(--accent); min-width:20px;">${lbl}.</span>
          <span>${opt}</span>
        </button>
      `;
    }).join('');
  }

  let solutionHtml = '';
  if (examPresState.showSolution) {
    solutionHtml = `
      <div style="margin-top:16px; padding:12px; background:rgba(16,185,129,0.12); border-left:4px solid #10b981; border-radius:8px;">
        <div style="font-weight:bold; color:#10b981; margin-bottom:6px;"><i class="fa-solid fa-check-circle mr-1"></i> Đáp án: ${q.answer}</div>
        <div style="font-size:13px; color:var(--text);">${q.explanation}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="exam-q-box">
      <span class="exam-q-tag" style="background:var(--accent-tint); color:var(--accent-hover);">${q.tag}</span>
      <div style="font-weight:600; margin-bottom:12px; font-size:14.5px;">${q.content}</div>
      <div style="margin-top:8px;">${optionsHtml}</div>
      ${solutionHtml}
    </div>
  `;

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([container]);
  }
}

function presPrevQuestion() {
  if (!examPresState.exam) return;
  if (examPresState.currentIndex > 0) {
    examPresState.currentIndex--;
    examPresState.showSolution = false;
    presRenderCurrentQuestion();
  }
}

function presNextQuestion() {
  if (!examPresState.exam) return;
  if (examPresState.currentIndex < examPresState.exam.questions.length - 1) {
    examPresState.currentIndex++;
    examPresState.showSolution = false;
    presRenderCurrentQuestion();
  }
}

function presToggleSolution() {
  examPresState.showSolution = !examPresState.showSolution;
  presRenderCurrentQuestion();
}

function presCheckAnswer(lbl, btnEl) {
  const q = examPresState.exam?.questions[examPresState.currentIndex];
  if (!q) return;
  if (q.answer === lbl || q.answer.includes(lbl)) {
    btnEl.classList.add('correct-highlight');
    showToast('🎉 Chính xác!');
  } else {
    showToast('❌ Chưa chính xác, hãy kiểm tra lại!');
  }
}

function presCopyQuestionToCanvas() {
  const q = examPresState.exam?.questions[examPresState.currentIndex];
  if (!q) return;
  const t = activeTab();
  if (!t) return;

  const wrapRect = wrap.getBoundingClientRect();
  const centerWorld = screenToWorld(wrapRect.width / 2, wrapRect.height / 2);
  
  const textContent = `${q.content}\n\n${(q.options||[]).join('    ')}`;
  const cardObj = {
    id: uid(),
    type: 'card',
    tag: q.tag,
    text: textContent,
    x: centerWorld.x - 220,
    y: centerWorld.y - 140,
    w: 440,
    h: 240,
    color: '#3b82f6',
    bg: '#f8fafc'
  };
  pushUndo();
  t.objects.push(cardObj);
  state.selectedId = cardObj.id;
  redraw();
  scheduleAutosave();
  showToast('📋 Đã chép câu hỏi ra Bảng Trắng!');
}

// Gán toàn cục
window.openDesmosModal = openDesmosModal;
window.closeDesmosModal = closeDesmosModal;
window.insertDesmosPreset = insertDesmosPreset;
window.insertDesmosGraphToWhiteboard = insertDesmosGraphToWhiteboard;
window.toggleRuler = toggleRuler;
window.toggleProtractor = toggleProtractor;
window.toggleCompass = toggleCompass;
window.toggleExamPresentation = toggleExamPresentation;
window.loadSampleExamToPresentation = loadSampleExamToPresentation;
window.presRenderCurrentQuestion = presRenderCurrentQuestion;
window.presPrevQuestion = presPrevQuestion;
window.presNextQuestion = presNextQuestion;
window.presToggleSolution = presToggleSolution;
window.presCheckAnswer = presCheckAnswer;
window.presCopyQuestionToCanvas = presCopyQuestionToCanvas;

// =========================================================================
// PROPERTIES PANEL & SYNC
// =========================================================================
function syncPropsPanel() {
  const strokeInput = document.getElementById('stroke-width');
  const strokeVal = document.getElementById('stroke-width-val');
  if (strokeInput) strokeInput.value = state.strokeWidth;
  if (strokeVal) strokeVal.textContent = state.strokeWidth;
  
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.color.toLowerCase() === state.color.toLowerCase());
  });
}

document.querySelectorAll('.color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    state.color = sw.dataset.color;
    syncPropsPanel();
    if (state.selectedId) {
      const t = activeTab();
      const o = t?.objects.find(x => x.id === state.selectedId);
      if (o) { o.color = state.color; redraw(); scheduleAutosave(); }
    }
  });
});

const strokeInput = document.getElementById('stroke-width');
if (strokeInput) {
  strokeInput.addEventListener('input', (e) => {
    state.strokeWidth = parseInt(e.target.value, 10);
    const val = document.getElementById('stroke-width-val');
    if (val) val.textContent = state.strokeWidth;
    if (state.selectedId) {
      const t = activeTab();
      const o = t?.objects.find(x => x.id === state.selectedId);
      if (o) { o.width = state.strokeWidth; redraw(); scheduleAutosave(); }
    }
  });
}

const fillCheckbox = document.getElementById('fill-shape');
if (fillCheckbox) {
  fillCheckbox.addEventListener('change', (e) => {
    state.fill = e.target.checked;
  });
}

// =========================================================================
// ZOOM CONTROLS
// =========================================================================
document.getElementById('zoom-in')?.addEventListener('click', () => {
  const t = activeTab(); if (!t) return;
  t.zoom = Math.min(3, t.zoom * 1.2);
  redraw();
});
document.getElementById('zoom-out')?.addEventListener('click', () => {
  const t = activeTab(); if (!t) return;
  t.zoom = Math.max(0.1, t.zoom / 1.2);
  redraw();
});
document.getElementById('zoom-reset')?.addEventListener('click', () => {
  const t = activeTab(); if (!t) return;
  t.zoom = 1; t.pan = { x:0, y:0 };
  redraw();
});

// =========================================================================
// RENDER TABS
// =========================================================================
function renderTabs() {
  const container = document.getElementById('tabs');
  if (!container) return;
  container.innerHTML = '';
  state.tabs.forEach(t => {
    const tab = document.createElement('div');
    tab.className = `tab ${t.id === state.activeTabId ? 'active' : ''}`;
    tab.innerHTML = `
      <span>${t.name}</span>
      ${state.tabs.length > 1 ? `<span class="close" onclick="closeTab(${t.id}, event)">✕</span>` : ''}
    `;
    tab.onclick = () => {
      state.activeTabId = t.id;
      renderTabs();
      redraw();
    };
    container.appendChild(tab);
  });
}

function closeTab(id, e) {
  e.stopPropagation();
  state.tabs = state.tabs.filter(t => t.id !== id);
  if (state.activeTabId === id) state.activeTabId = state.tabs[0]?.id;
  renderTabs();
  redraw();
  scheduleAutosave();
}

document.getElementById('new-tab-btn')?.addEventListener('click', () => newTab());
document.getElementById('clear-btn')?.addEventListener('click', () => {
  if (confirm('Bạn có chắc muốn xóa toàn bộ nội dung bảng hiện tại?')) {
    const t = activeTab();
    if (t) { pushUndo(); t.objects = []; redraw(); scheduleAutosave(); }
  }
});
document.getElementById('grid-btn')?.addEventListener('click', () => {
  state.bgMode = state.bgMode === 'dot' ? 'grid' : (state.bgMode === 'grid' ? 'none' : 'dot');
  redraw();
  showToast(`Chế độ lưới: ${state.bgMode.toUpperCase()}`);
});

// =========================================================================
// STORAGE & AUTOSAVE
// =========================================================================
let autosaveTimer = null;
function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(autosave, 500);
}
function autosave() {
  try {
    const data = {
      tabs: state.tabs.map(t => ({
        id: t.id, name: t.name, pan: t.pan, zoom: t.zoom,
        objects: t.objects.map(o => ({...o, img: undefined}))
      })),
      activeTabId: state.activeTabId
    };
    localStorage.setItem('whiteboard.autosave.v3', JSON.stringify(data));
  } catch(e) {}
}
function loadFromAutosave() {
  try {
    const raw = localStorage.getItem('whiteboard.autosave.v3');
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.tabs || data.tabs.length === 0) return false;
    state.tabs = data.tabs.map(t => {
      t.objects = (t.objects || []).map(o => {
        if (o.type === 'image' && o.src) {
          const img = new Image();
          img.src = o.src;
          o.img = img;
        }
        return o;
      });
      return t;
    });
    state.activeTabId = data.activeTabId || state.tabs[0].id;
    return true;
  } catch(e) { return false; }
}

function uid() { return Math.random().toString(36).slice(2, 10); }
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2200);
}

// Sidebars & Properties toggle
const sidebarEl = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebarEl?.classList.toggle('collapsed');
    setTimeout(resizeCanvases, 200);
  });
}
const propsEl = document.getElementById('props');
const propsToggle = document.getElementById('props-toggle');
if (propsToggle) {
  propsToggle.addEventListener('click', () => propsEl?.classList.toggle('collapsed'));
}

// Help Modal
document.getElementById('guide-btn')?.addEventListener('click', () => {
  document.getElementById('help-modal')?.classList.add('show');
});
document.getElementById('help-btn')?.addEventListener('click', () => {
  document.getElementById('help-modal')?.classList.add('show');
});

// =========================================================================
// INITIALIZE
// =========================================================================
function initWhiteboard() {
  if (loadFromAutosave()) {
    renderTabs();
    syncPropsPanel();
    redraw();
  } else {
    newTab('Bài Giảng 1');
    document.body.className = 'theme-ocean';
    localStorage.setItem('whiteboard.theme', 'ocean');
  }
  syncPropsPanel();
  resizeCanvases();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initWhiteboard();
} else {
  document.addEventListener('DOMContentLoaded', initWhiteboard);
}
