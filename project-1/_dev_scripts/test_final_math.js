const TRAJECTORY_CONFIG = {
    ANCHOR_DEPTH_X: 0.28,
    ANCHOR_DEPTH_Y: 0.30,
    CURVE_FACTOR_DESKTOP: 0.16,
    CURVE_FACTOR_MOBILE: 0.22,
    VERTICAL_BIAS: 0.50,
    MIN_CURVATURE_OFFSET: 18,
    MAX_CURVATURE_OFFSET_RATIO: 0.35,
    ARRIVAL_EASING_STRENGTH: 0.20
};

const cards = [
    { side: 'right', x: 500, y: 100, w: 380, h: 220 },
    { side: 'left',  x: -50, y: 450, w: 380, h: 220 },
    { side: 'right', x: 500, y: 800, w: 380, h: 220 },
    { side: 'left',  x: -50, y: 1150, w: 380, h: 220 },
    { side: 'right', x: 500, y: 1500, w: 380, h: 220 },
    { side: 'left',  x: -50, y: 1850, w: 380, h: 220 },
    { side: 'right', x: 500, y: 2200, w: 380, h: 220 },
    { side: 'left',  x: -50, y: 2550, w: 380, h: 220 },
    { side: 'center', x: 225, y: 2900, w: 380, h: 220 }
];

const cardData = cards.map(c => ({
    side: c.side,
    cx: c.x + c.w * 0.5,
    cy: c.y + c.h * 0.5,
    w: c.w,
    h: c.h
}));

const anchors = [];
for (let i = 0; i < cardData.length; i++) {
    const c = cardData[i];
    
    let dirX = 0, dirY = 1;
    if (i < cardData.length - 1) {
        const nextC = cardData[i + 1];
        const dx = nextC.cx - c.cx;
        const dy = nextC.cy - c.cy;
        const dist = Math.hypot(dx, dy) || 1;
        dirX = dx / dist;
        dirY = dy / dist;
    }

    let prevDirX = 0, prevDirY = 1;
    if (i > 0) {
        const prevC = cardData[i - 1];
        const dx = c.cx - prevC.cx;
        const dy = c.cy - prevC.cy;
        const dist = Math.hypot(dx, dy) || 1;
        prevDirX = dx / dist;
        prevDirY = dy / dist;
    }

    const enter = {
        x: c.cx - prevDirX * (c.w * TRAJECTORY_CONFIG.ANCHOR_DEPTH_X),
        y: c.cy - Math.max(prevDirY, 0.35) * (c.h * TRAJECTORY_CONFIG.ANCHOR_DEPTH_Y)
    };

    const exit = {
        x: c.cx + dirX * (c.w * TRAJECTORY_CONFIG.ANCHOR_DEPTH_X),
        y: c.cy + Math.max(dirY, 0.35) * (c.h * TRAJECTORY_CONFIG.ANCHOR_DEPTH_Y)
    };

    anchors.push({ enter, exit });
}

let pathD = '';
const curveFactor = TRAJECTORY_CONFIG.CURVE_FACTOR_DESKTOP;

for (let i = 0; i < cardData.length; i++) {
    const { enter, exit } = anchors[i];
    
    // Internal curve across the island (zero straight lines)
    const internalSpanY = exit.y - enter.y;
    const internalCp1 = { x: enter.x, y: enter.y + internalSpanY * 0.5 };
    const internalCp2 = { x: exit.x, y: exit.y - internalSpanY * 0.5 };
    const internalSegment = ` C ${internalCp1.x.toFixed(1)} ${internalCp1.y.toFixed(1)}, ${internalCp2.x.toFixed(1)} ${internalCp2.y.toFixed(1)}, ${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`;

    if (i === 0) {
        const introStartY = Math.max(0, enter.y - 110);
        const introCp1 = { x: enter.x - 12, y: enter.y - 60 };
        const introCp2 = { x: enter.x, y: enter.y - 25 };
        pathD = `M ${(enter.x - 18).toFixed(1)} ${introStartY.toFixed(1)} C ${introCp1.x.toFixed(1)} ${introCp1.y.toFixed(1)}, ${introCp2.x.toFixed(1)} ${introCp2.y.toFixed(1)}, ${enter.x.toFixed(1)} ${enter.y.toFixed(1)}`;
        pathD += internalSegment;
    } else {
        const prevExit = anchors[i - 1].exit;
        const spanX = enter.x - prevExit.x;
        const spanY = enter.y - prevExit.y;

        const directionRatio = Math.abs(spanX) / (Math.abs(spanY) || 1);
        let rawCurveOffset = spanX * curveFactor * (1 + Math.min(directionRatio, 1.5) * 0.5);

        const maxOffset = Math.abs(spanX) * TRAJECTORY_CONFIG.MAX_CURVATURE_OFFSET_RATIO;
        const sign = spanX >= 0 ? 1 : -1;
        let clampedOffset = Math.max(TRAJECTORY_CONFIG.MIN_CURVATURE_OFFSET, Math.min(Math.abs(rawCurveOffset), maxOffset)) * sign;

        const cp1 = {
            x: prevExit.x + clampedOffset,
            y: prevExit.y + spanY * TRAJECTORY_CONFIG.VERTICAL_BIAS
        };

        const cp2 = {
            x: enter.x - clampedOffset * (1 - TRAJECTORY_CONFIG.ARRIVAL_EASING_STRENGTH),
            y: enter.y - spanY * (1 - TRAJECTORY_CONFIG.VERTICAL_BIAS + TRAJECTORY_CONFIG.ARRIVAL_EASING_STRENGTH * 0.3)
        };

        pathD += ` C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${enter.x.toFixed(1)} ${enter.y.toFixed(1)}`;
        pathD += internalSegment;
    }
}

console.log('Path length:', pathD.length);
console.log('Generated path sample:\n', pathD.substring(0, 350) + '...');
