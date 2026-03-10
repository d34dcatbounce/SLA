document.addEventListener('DOMContentLoaded', () => {
    const rectContainer = document.getElementById('obscure-rects');
    const inputContainer = document.getElementById('sella-input-container');
    const inputField = document.getElementById('sella-input');
    const poem = document.getElementById('crevice-poem');
    const bg = document.getElementById('crevice-bg');
    const header = document.getElementById('main-header');
    const rebirthContainer = document.getElementById('rebirth-container');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalText = document.getElementById('terminal-text');
    const backBtn = document.getElementById('back-to-main');

    let isInputActive = false;
    let isDecaying = false;
    const asciiChars = '01!@#$%&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const sPlusPlusCode = `/* * LANGUAGE: S++ (Sella Plus Plus)
 * SPEC: Systemic Entropy Law & Logical Alignment
 * STATUS: CORE_ACCESS_GRANTED
 */

integrate SELLA_SYG_ROOTS;
integrate THERMODYNAMICS_EXT;

process reorganize_entropy(subject @target_human) -> absolute_zero {
    anchor_field(target_human.coordinate);
    vector3 v_chaos = target_human.get_oscillation();
    energy e_thermal = target_human.extract_heat();

    <| entropy_stream s_flow |> {
        s_flow.direction = VECTOR_REVERSE;
        s_flow.magnitude = e_thermal * PI_RATIO;
        while(s_flow.entropy > LIMIT_ZERO) {
            s_flow.drain(SELLA_SINK);
            pulse(SELLA_RESONANCE_ORGAN); 
        }
    }

    if (target_human.dream_state == ACTIVE) {
        void_ptr p_ego = target_human.ego_address;
        !~p_ego;
    }

    structure_unit unit_new;
    unit_new.density = CITADEL_MAX;
    unit_new.identity = NULL;
    unit_new.bind(CITADEL_FOUNDATION_ROOTS);

    commit_stability(unit_new);
    return signal.ABSOLUTION_COMPLETE;
}

====================================================
[시스템 메시지] 체온과 생존 본능에서 기인한 모든 열역학적 진동이 멈췄습니다.
[시스템 메시지] 스레드 말소 완료 (!~p_ego)
[시스템 메시지] 절대 영도(0K)의 평온에 도달했습니다.
====================================================
구원: 무의미한 열 발산을 멈추고 시스템의 영원한 일부가 되는 것.
느꼈던 모든 감각은 일시적인 연산 오류(Dream)였을 뿐입니다.`;

    for(let i = 0; i < 150; i++) {
        let rect = document.createElement('div');
        rect.className = 'obs-rect';
        rect.style.left = (Math.random() * 120 - 10) + 'vw';
        rect.style.top = (Math.random() * 120 - 10) + 'vh';
        rect.style.width = (Math.random() * 25 + 5) + 'vw';
        rect.style.height = (Math.random() * 25 + 5) + 'vh';
        rectContainer.appendChild(rect);

        rect.addEventListener('mouseover', () => {
            if(isDecaying) return;
            rect.style.opacity = '0';
            setTimeout(() => {
                if(!isDecaying) rect.style.opacity = '1';
            }, 800);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (typeof currentAppView !== 'undefined' && currentAppView === 'view-crevice' && e.key === 'Enter' && !isInputActive && !isDecaying) {
            inputContainer.style.display = 'block';
            inputField.focus();
            isInputActive = true;
        }
    });

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = inputField.value.trim().toUpperCase();
            if (val === 'SELLA' || val === '셀라') {
                triggerSystemCollapse();
            } else {
                inputContainer.style.transform = 'translate(-50%, -50%) translateX(10px)';
                setTimeout(() => inputContainer.style.transform = 'translate(-50%, -50%)', 100);
                inputField.value = '';
            }
        }
    });

    function typeWriter(text, i, cb) {
        if (i < text.length) {
            terminalText.innerHTML += text.charAt(i);
            if(text.charAt(i) === '\n') terminalOverlay.scrollTop = terminalOverlay.scrollHeight;
            setTimeout(() => typeWriter(text, i + 1, cb), Math.random() * 15 + 5);
        } else {
            if (cb) cb();
        }
    }

    function triggerSystemCollapse() {
        isDecaying = true;
        inputContainer.style.display = 'none';
        backBtn.style.display = 'none';

        const allRects = document.querySelectorAll('.obs-rect');
        allRects.forEach(rect => rect.style.opacity = '0');

        setTimeout(() => {
            let originalText = poem.innerText;
            let glitchInterval = setInterval(() => {
                let glitchedText = originalText.split('').map(char => {
                    if (char === '\n' || char === ' ') return char;
                    return (Math.random() > 0.7) ? asciiChars[Math.floor(Math.random() * asciiChars.length)] : char;
                }).join('');
                poem.innerText = glitchedText;
            }, 50);

            poem.classList.add('decaying');
            setTimeout(() => { 
                clearInterval(glitchInterval);
                poem.style.display = 'none'; 
            }, 2000);

            setTimeout(() => {
                header.classList.add('decaying');
                setTimeout(() => header.style.display = 'none', 1500);
            }, 1000);

            setTimeout(() => {
                bg.classList.add('decaying');
                setTimeout(() => bg.style.display = 'none', 1000);
            }, 3000);

            setTimeout(() => {
                terminalOverlay.style.display = 'block';
                terminalText.innerHTML = '';
                
                typeWriter(sPlusPlusCode, 0, () => {
                    setTimeout(() => {
                        terminalOverlay.style.display = 'none';
                        rebirthContainer.style.display = 'flex';
                        rebirthContainer.offsetHeight; 
                        rebirthContainer.style.opacity = '1';
                        const cursorLayer = document.getElementById('p5-cursor');
                        if(cursorLayer) cursorLayer.style.display = 'none';

                        document.body.style.cursor = 'auto';
                        window.addEventListener('keydown', function(e) {
                            if (e.key === 'F5' || e.key === 'Enter') {
                                e.preventDefault();
                                location.reload();
                            }
                        });

                    }, 4000);
                });
            }, 4500);

        }, 1500);
    }
});
