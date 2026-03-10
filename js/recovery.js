window.initRecoveryMode = function() {
    if (window.isRecoveryInitialized) return;
    window.isRecoveryInitialized = true;

    const canvas = document.getElementById('recovery-canvas');
    const ctx = canvas.getContext('2d');
    
    let isDragging = false;
    let startX = 0, startY = 0, currentX = 0, currentY = 0;
    let holes = [];
    const asciiChars = '01!@#$%&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 5; i++) {
        holes.push({
            x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
            y: Math.random() * canvas.height * 0.6 + canvas.height * 0.2,
            w: Math.random() * 200 + 100, h: Math.random() * 150 + 80,
            status: 'black', glitchEndTime: 0
        });
    }

    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX; startY = e.clientY - 80;
        currentX = startX; currentY = startY;
    });

    canvas.addEventListener('mousemove', e => {
        if (!isDragging) return;
        currentX = e.clientX; currentY = e.clientY - 80;
    });

    canvas.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;

        const selX = Math.min(startX, currentX), selY = Math.min(startY, currentY);
        const selW = Math.abs(currentX - startX), selH = Math.abs(currentY - startY);

        holes.forEach(hole => {
            if (hole.status === 'black' &&
                selX < hole.x + hole.w && selX + selW > hole.x &&
                selY < hole.y + hole.h && selY + selH > hole.y) {
                hole.status = 'glitching';
                hole.glitchEndTime = Date.now() + 1000;
            }
        });
    });

    function renderRecovery() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();

        holes.forEach(hole => {
            if (hole.status === 'black') {
                ctx.fillStyle = '#000000';
                ctx.fillRect(hole.x, hole.y, hole.w, hole.h);
            } else if (hole.status === 'glitching') {
                if (now > hole.glitchEndTime) {
                    hole.status = 'recovered';
                } else {
                    ctx.fillStyle = '#111111'; ctx.fillRect(hole.x, hole.y, hole.w, hole.h);
                    ctx.fillStyle = '#FF4D4D'; ctx.font = '14px monospace'; ctx.textBaseline = 'top';
                    for (let dy = 0; dy < hole.h; dy += 14) {
                        for (let dx = 0; dx < hole.w; dx += 10) {
                            if (Math.random() > 0.3) {
                                const char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
                                ctx.fillText(char, hole.x + dx + (Math.random()-0.5)*5, hole.y + dy + (Math.random()-0.5)*5);
                            }
                        }
                    }
                }
            }
        });

        if (isDragging) {
            const x = Math.min(startX, currentX), y = Math.min(startY, currentY);
            const w = Math.abs(currentX - startX), h = Math.abs(currentY - startY);
            ctx.fillStyle = 'rgba(255, 77, 77, 0.2)'; ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = '#FF4D4D'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
        }

        animFrame = requestAnimationFrame(renderRecovery);
    }
    
    cancelAnimationFrame(animFrame);
    renderRecovery();
};
