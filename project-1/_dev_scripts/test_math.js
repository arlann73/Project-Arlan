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

let pathD = '';
const anchors = [];

for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const cx = c.x + c.w * 0.5;
    const cy = c.y + c.h * 0.5;
    
    // Compute next direction
    let dirX = 0, dirY = 1;
    if (i < cards.length - 1) {
        const nextC = cards[i + 1];
        const nextCx = nextC.x + nextC.w * 0.5;
        const nextCy = nextC.y + nextC.h * 0.5;
        const dx = nextCx - cx;
        const dy = nextCy - cy;
        const dist = Math.hypot(dx, dy) || 1;
        dirX = dx / dist;
        dirY = dy / dist;
    } else {
        // Last card exits slightly downwards
        dirX = 0; dirY = 1;
    }
    
    // Prev direction for entry
    let prevDirX = 0, prevDirY = 1;
    if (i > 0) {
        const prevC = cards[i - 1];
        const prevCx = prevC.x + prevC.w * 0.5;
        const prevCy = prevC.y + prevC.h * 0.5;
        const dx = cx - prevCx;
        const dy = cy - prevCy;
        const dist = Math.hypot(dx, dy) || 1;
        prevDirX = dx / dist;
        prevDirY = dy / dist;
    }

    const enter = {
        x: cx - prevDirX * (c.w * 0.26),
        y: cy - Math.max(prevDirY, 0.35) * (c.h * 0.28)
    };

    const exit = {
        x: cx + dirX * (c.w * 0.26),
        y: cy + Math.max(dirY, 0.35) * (c.h * 0.28)
    };

    anchors.push({ enter, exit });
}

for (let i = 0; i < cards.length; i++) {
    const { enter, exit } = anchors[i];
    if (i === 0) {
        pathD = `M ${(enter.x - 15).toFixed(1)} ${Math.max(0, enter.y - 100).toFixed(1)} C ${(enter.x - 8).toFixed(1)} ${(enter.y - 50).toFixed(1)}, ${enter.x.toFixed(1)} ${(enter.y - 20).toFixed(1)}, ${enter.x.toFixed(1)} ${enter.y.toFixed(1)}`;
        pathD += ` L ${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`;
    } else {
        const prevExit = anchors[i - 1].exit;
        const spanX = enter.x - prevExit.x;
        const spanY = enter.y - prevExit.y;
        const cp1 = {
            x: prevExit.x + spanX * 0.12,
            y: prevExit.y + spanY * 0.50
        };
        const cp2 = {
            x: enter.x - spanX * 0.12,
            y: enter.y - spanY * 0.50
        };
        pathD += ` C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${enter.x.toFixed(1)} ${enter.y.toFixed(1)}`;
        pathD += ` L ${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`;
    }
}

console.log('Path length in chars:', pathD.length);
console.log('Sample Path:\n', pathD.substring(0, 300) + '...');
