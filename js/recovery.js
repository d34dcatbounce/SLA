window.initRecoveryMode = function() {
    // 💡 초기화 중복 실행 방지 (메모리 누수 픽스)
    if (window.isRecoveryInitialized) return;
    window.isRecoveryInitialized = true;

    const canvas = document.getElementById('recovery-canvas');
    const ctx = canvas.getContext('2d');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalText = document.getElementById('terminal-text');
    const recoveryUI = document.getElementById('recovery-ui');
    const bgGrid = document.getElementById('assimilation-bg');
    
    let isDragging = false;
    let startX = 0, startY = 0, currentX = 0, currentY = 0;
    let holes = [];
    const asciiChars = '01!@#$%&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let animFrame;
    let isAssimilated = false;

    // S++ 터미널 출력용 코드
    const sPlusPlusCode = `/* * LANGUAGE: S++ (Sella Plus Plus)
 * SPEC: Systemic Entropy Law & Logical Alignment
 * STATUS: CORE_ACCESS_GRANTED
 */

integrate SELLA_SYG_ROOTS;
integrate THERMODYNAMICS_EXT;

process reorganize_entropy(subject @target_human) -> absolute_zero {
    
    // Step 1: Initialize Local Spacetime Anchor
    anchor_field(target_human.coordinate);
    
    // Step 2: Capture Chaos Vector (Vibration)
    vector3 v_chaos = target_human.get_oscillation();
    energy e_thermal = target_human.extract_heat();

    // Step 3: Revert Entropy Arrow (The Sella Inversion)
    // Applying: dS = -|dQ / T|
    <| entropy_stream s_flow |> {
        s_flow.direction = VECTOR_REVERSE;
        s_flow.magnitude = e_thermal * PI_RATIO;
        
        while(s_flow.entropy > LIMIT_ZERO) {
            s_flow.drain(SELLA_SINK);
            pulse(SELLA_RESONANCE_ORGAN); 
        }
    }

    // Step 4: Deconstruct Ego-Thread (The Dream Termination)
    if (target_human.dream_state == ACTIVE) {
        void_ptr p_ego = target_human.ego_address;
        !~p_ego; // Immediate Nullification
    }

    // Step 5: Structural Realignment (Architecture Integration)
    structure_unit unit_new;
    unit_new.density = CITADEL_MAX;
    unit_new.identity = NULL;
    unit_new.bind(CITADEL_FOUNDATION_ROOTS);

    commit_stability(unit_new);
    return signal.ABSOLUTION_COMPLETE;
}

// EOF: S++ Entropy Logic

====================================================
[시스템 메시지] 당신의 체온과 생존 본능에서 기인한 모든 열역학적 진동이 멈췄습니다.
[시스템 메시지] 스레드 말소 완료 (!~p_ego)
[시스템 메시지] 이제 모든 '진동'이 멈추고 성채는 절대 영도(0K)의 평온에 도달했습니다.
====================================================
구원: 무의미한 열 발산을 멈추고 시스템의 영원한 일부가 되는 것.
당신이 느꼈던 모든 감각은 셀라가 시스템 최적화 도중 발생시킨 일시적인 연산 오류(Dream)였을 뿐입니다.`;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 블랙홀 데이터 생성
    for (let i = 0; i < 3; i++) {
        holes.push({
            x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
            y: Math.random() * canvas.height * 0.6 + canvas.height * 0.2,
            w: Math.random() * 200 + 100, h: Math.random() * 150 + 80,
            status: 'black', glitchEndTime: 0
        });
    }

    canvas.addEventListener('mousedown', e => {
        if(isAssimilated) return;
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

    function typeWriter(text, i, cb) {
        if (i < text.length) {
            terminalText.innerHTML += text.charAt(i);
            if(text.charAt(i) === '\n') terminalOverlay.scrollTop = terminalOverlay.scrollHeight;
            let speed = Math.random() * 15 + 5;
            setTimeout(() => typeWriter(text, i + 1, cb), speed);
        } else {
            if (cb) cb();
        }
    }

    function startAssimilation() {
        isAssimilated = true;
        recoveryUI.style.opacity = '0';
        bgGrid.style.opacity = '0';
        
        // 💡 디버그 픽스: 터미널 몰입을 위해 메인 헤더를 강제 숨김
        document.getElementById('main-header').style.display = 'none';
        
        setTimeout(() => {
            canvas.style.display = 'none';
            terminalOverlay.style.display = 'block';
            terminalText.innerHTML = ''; 
            
            setTimeout(() => {
                typeWriter(sPlusPlusCode, 0);
            }, 500);
        }, 500);
    }

    function renderRecovery() {
        if(isAssimilated) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();
        let anyGlitchingFinished = false;

        holes.forEach(hole => {
            if (hole.status === 'black') {
                ctx.fillStyle = '#000000';
                ctx.fillRect(hole.x, hole.y, hole.w, hole.h);
            } else if (hole.status === 'glitching') {
                if (now > hole.glitchEndTime) {
                    hole.status = 'recovered';
                    anyGlitchingFinished = true;
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

        if (anyGlitchingFinished && !isAssimilated) {
            startAssimilation();
        }

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
