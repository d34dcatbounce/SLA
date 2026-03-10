document.addEventListener('DOMContentLoaded', () => {
    const rectContainer = document.getElementById('obscure-rects');
    const inputContainer = document.getElementById('sella-input-container');
    const inputField = document.getElementById('sella-input');
    const poem = document.getElementById('crevice-poem');
    const bg = document.getElementById('crevice-bg');
    const header = document.getElementById('main-header');
    const rebirthContainer = document.getElementById('rebirth-container');

    let isInputActive = false;
    let isDecaying = false;
    const asciiChars = '01!@#$%&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // 1. 들쭉날쭉한 검은 사각형 생성
    for(let i = 0; i < 150; i++) {
        let rect = document.createElement('div');
        rect.className = 'obs-rect';
        rect.style.left = (Math.random() * 120 - 10) + 'vw';
        rect.style.top = (Math.random() * 120 - 10) + 'vh';
        rect.style.width = (Math.random() * 25 + 5) + 'vw';
        rect.style.height = (Math.random() * 25 + 5) + 'vh';
        rectContainer.appendChild(rect);

        // 마우스 오버 시 일시적으로 시야 확보
        rect.addEventListener('mouseover', () => {
            if(isDecaying) return;
            rect.style.opacity = '0';
            setTimeout(() => {
                if(!isDecaying) rect.style.opacity = '1';
            }, 800);
        });
    }

    // 2. 엔터키 감지 -> 입력창 활성화
    window.addEventListener('keydown', (e) => {
        if (typeof currentAppView !== 'undefined' && currentAppView === 'view-crevice' && e.key === 'Enter' && !isInputActive && !isDecaying) {
            inputContainer.style.display = 'block';
            inputField.focus();
            isInputActive = true;
        }
    });

    // 3. SELLA 단어 입력 검사
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

    // 4. 시스템 붕괴 및 재탄생 (빅뱅) 시퀀스
    function triggerSystemCollapse() {
        isDecaying = true;
        inputContainer.style.display = 'none';

        // 1단계: 가림막 모두 해제
        const allRects = document.querySelectorAll('.obs-rect');
        allRects.forEach(rect => rect.style.opacity = '0');

        // 2단계: 텍스트 노이즈 붕괴
        setTimeout(() => {
            // 💡 디버그 픽스: HTML 구조를 망가뜨리지 않도록 innerText 속성만 사용
            let originalText = poem.innerText;
            
            let glitchInterval = setInterval(() => {
                let glitchedText = originalText.split('').map(char => {
                    // 줄바꿈 기호와 띄어쓰기는 보존하여 레이아웃 붕괴 방지
                    if (char === '\n' || char === ' ') return char;
                    return (Math.random() > 0.7) 
                           ? asciiChars[Math.floor(Math.random() * asciiChars.length)] 
                           : char;
                }).join('');
                
                poem.innerText = glitchedText;
            }, 50);

            // 3단계: 요소 도미노 삭제
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

            // 4단계: 빅뱅 (Rebirth) 트리거
            setTimeout(() => {
                rebirthContainer.style.display = 'flex';
                rebirthContainer.offsetHeight; // 리플로우 강제
                rebirthContainer.style.opacity = '1';

                const cursorLayer = document.getElementById('p5-cursor');
                if(cursorLayer) cursorLayer.style.display = 'none';
            }, 4500);

        }, 1500);
    }
});
