const fs = require('fs');
const path = require('path');

const css = `

/* Timeline Signal Dot Animation */
@keyframes signalPulse {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.6); opacity: 0; }
}

.signal-ring {
    transform-origin: center;
    animation: signalPulse 2s infinite cubic-bezier(0.165, 0.84, 0.44, 1);
}

.signal-ring-1 {
    animation-delay: 0s;
}

.signal-ring-2 {
    animation-delay: 1s;
}
`;

fs.appendFileSync(path.join(__dirname, 'style.css'), css);
console.log('Appended signal animation CSS.');
