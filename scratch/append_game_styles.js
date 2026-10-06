const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const gameCss = `
/* ==========================================================================
   🎮 TBS GAMIFICATION & MATH ARENA SUITE 3.0 (PRO NEON & 3D GRAPHICS)
   ========================================================================== */

/* 1. Neon Glowing Choice Buttons for Ai Là Triệu Phú */
.m-choice-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95));
}

.m-choice-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 25px -4px rgba(245, 158, 11, 0.35), 0 0 0 2px #f59e0b;
}

.m-choice-btn:active {
    transform: translateY(1px) scale(0.99);
}

.m-choice-correct {
    background: linear-gradient(135deg, #10b981, #059669) !important;
    color: #ffffff !important;
    border-color: #34d399 !important;
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.6) !important;
    animation: correctPulse 0.6s ease infinite alternate;
}

.m-choice-wrong {
    background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
    color: #ffffff !important;
    border-color: #f87171 !important;
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.6) !important;
}

@keyframes correctPulse {
    from { transform: scale(1); filter: brightness(1); }
    to { transform: scale(1.03); filter: brightness(1.15); }
}

/* 2. Millionaire Prize Ladder Light Strip */
.ladder-active-step {
    background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
    color: #0f172a !important;
    font-weight: 900 !important;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.8), inset 0 1px 2px rgba(255,255,255,0.8);
    transform: scale(1.06);
    border: 2px solid #fef3c7 !important;
    animation: ladderGlow 1s ease-in-out infinite alternate;
}

@keyframes ladderGlow {
    from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
    to { box-shadow: 0 0 24px rgba(245, 158, 11, 0.95); }
}

/* 3. Speed Run Cyberpunk Fire Glow & Combo Pop */
.speedrun-timer-glow {
    text-shadow: 0 0 15px rgba(244, 63, 94, 0.8), 0 0 30px rgba(245, 158, 11, 0.5);
}

.combo-pop-badge {
    animation: comboPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes comboPop {
    0% { transform: scale(0.6); opacity: 0.5; }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); opacity: 1; }
}

/* 4. RPG Boss Battle Shake & Critical Flash */
.shake-screen {
    animation: bossScreenShake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes bossScreenShake {
    10%, 90% { transform: translate3d(-3px, 0, 0); }
    20%, 80% { transform: translate3d(5px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
    40%, 60% { transform: translate3d(6px, 0, 0); }
}

.boss-hp-bar {
    background: linear-gradient(90deg, #ef4444 0%, #f97316 50%, #eab308 100%);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
    transition: width 0.4s ease-out;
}

.boss-avatar-pulse {
    animation: bossBreath 2.5s ease-in-out infinite alternate;
}

@keyframes bossBreath {
    from { transform: scale(1) translateY(0); filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.4)); }
    to { transform: scale(1.08) translateY(-4px); filter: drop-shadow(0 0 25px rgba(239, 68, 68, 0.7)); }
}

/* 5. 3D Memory Card Flip System */
.card-3d-scene {
    perspective: 1000px;
}

.card-3d-object {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border-radius: 1.25rem;
}

.card-3d-object.is-flipped {
    transform: rotateY(180deg);
}

.card-3d-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.75rem;
    box-shadow: 0 8px 16px -2px rgba(0,0,0,0.15);
}

.card-3d-front {
    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
    border: 2px solid rgba(129, 140, 248, 0.3);
    color: #fbbf24;
}

.card-3d-front:hover {
    border-color: #fbbf24;
    box-shadow: 0 10px 20px -2px rgba(251, 191, 36, 0.3);
    transform: translateY(-2px);
}

.card-3d-back {
    background: #ffffff;
    border: 2px solid #6366f1;
    color: #1e1b4b;
    transform: rotateY(180deg);
}

.card-3d-matched {
    border-color: #10b981 !important;
    background: #ecfdf5 !important;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5) !important;
    transform: rotateY(180deg) scale(0.97);
    pointer-events: none;
}
`;

if (!cssContent.includes('TBS GAMIFICATION & MATH ARENA SUITE 3.0')) {
    cssContent += gameCss;
    fs.writeFileSync(cssPath, cssContent, 'utf8');
    console.log('Successfully appended Game Arena styles to css/style.css!');
} else {
    console.log('Game Arena styles already present in css/style.css');
}
