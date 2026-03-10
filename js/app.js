// 전역 상태 변수
let currentAppView = 'intro';

// Lerp 및 스크롤 상태
let targetIntroScroll = 0, currentIntroScroll = 0;
let targetGalleryAngle = 0, currentGalleryAngle = 0;
let isZoomedOutReady = false;

// DOM 요소
const world = document.querySelector('#world');
const circle = document.querySelector('#universe-circle');
const selahText = document.querySelector('#selah-text');
const photoCards = document.querySelectorAll('.photo-card');

const gRadius = window.innerWidth * 1.2;
const gSpacing = 12;

// 라우팅 (페이지 전환)
window.navigateTo = function(pageId, themeClass) {
    currentAppView = pageId;
    document.body.className = themeClass;
    
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        document.getElementById(pageId).classList.add('active');
        
        // 데이터 복구 페이지 진입 시 초기화
        if(pageId === 'view-artwork' && window.initRecoveryMode) {
            window.initRecoveryMode();
        }
    }, 100);
}

// 휠 스크롤 감지 (인트로 & 사진첩 궤도용)
window.addEventListener('wheel', (e) => {
    if (currentAppView === 'intro') {
        targetIntroScroll += e.deltaY * 1.5;
        if (targetIntroScroll < 0) targetIntroScroll = 0;
    } else if (currentAppView === 'view-photograph') {
        targetGalleryAngle += e.deltaY * 0.05;
        
        let maxAngle = (photoCards.length - 1) * gSpacing;
        if (targetGalleryAngle < 0) targetGalleryAngle = 0;
        if (targetGalleryAngle > maxAngle) targetGalleryAngle = maxAngle;
    }
});

// 메인 렌더링 루프
function appLoop() {
    if (currentAppView === 'intro') {
        currentIntroScroll += (targetIntroScroll - currentIntroScroll) * 0.08;
        updateIntroView(currentIntroScroll);
    } else if (currentAppView === 'view-photograph') {
        currentGalleryAngle += (targetGalleryAngle - currentGalleryAngle) * 0.08;
        updateGalleryView(currentGalleryAngle);
    }
    requestAnimationFrame(appLoop);
}

function updateIntroView(scrollValue) {
    const slideLimit = 4000, zoomLimit = 3000;
    let screenW = window.innerWidth, screenH = window.innerHeight;

    if (scrollValue <= slideLimit) {
        let progress = scrollValue / slideLimit;
        let currentX = 500 + (4500 - 500) * progress;
        world.style.transform = `translate(${(screenW/2) - currentX}px, ${(screenH/2) - 2500}px) scale(1)`;
        circle.style.backgroundColor = `rgba(213, 185, 66, ${progress})`;
        selahText.style.opacity = '0';
        if(isZoomedOutReady) { isZoomedOutReady = false; circle.classList.remove('ready-to-click'); }
    } else {
        let zoomProgress = Math.min((scrollValue - slideLimit) / zoomLimit, 1);
        let scale = 1 - (zoomProgress * 0.92);
        let currentX = 4500 + (2500 - 4500) * zoomProgress;
        world.style.transform = `translate(${(screenW/2) - currentX*scale}px, ${(screenH/2) - 2500*scale}px) scale(${scale})`;
        circle.style.backgroundColor = `rgba(213, 185, 66, 1)`;

        if (zoomProgress > 0.8) selahText.style.opacity = ((zoomProgress - 0.8) * 5).toString();
        else selahText.style.opacity = '0';

        if (zoomProgress >= 0.98 && !isZoomedOutReady) {
            isZoomedOutReady = true; circle.classList.add('ready-to-click');
        } else if (zoomProgress < 0.98 && isZoomedOutReady) {
            isZoomedOutReady = false; circle.classList.remove('ready-to-click');
        }
    }
}

function updateGalleryView(angleValue) {
    photoCards.forEach((card, i) => {
        let cardAngle = 270 + (i * gSpacing) - angleValue;
        let rad = cardAngle * (Math.PI / 180);
        let x = Math.cos(rad) * gRadius, y = gRadius + (Math.sin(rad) * gRadius);
        let diff = Math.abs(270 - cardAngle);
        let scale = Math.max(0.6, 1 - (diff * 0.015));
        card.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
        card.style.opacity = Math.max(0.1, 1 - (diff * 0.02));
        card.style.zIndex = Math.round(scale * 100);
    });
}

// 인트로에서 메인 허브 진입
circle.addEventListener('click', () => {
    if (isZoomedOutReady && currentAppView === 'intro') {
        document.getElementById('view-intro').style.opacity = '0'; 
        setTimeout(() => {
            document.getElementById('view-intro').style.display = 'none';
            document.getElementById('main-header').classList.add('active'); 
            navigateTo('view-main', 'theme-mustard'); 
        }, 800);
    }
});

// 세계관 스크롤 감지
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
document.querySelectorAll('.story-block').forEach(b => observer.observe(b));

// 초기화
world.style.transform = `translate(${(window.innerWidth/2) - 500}px, ${(window.innerHeight/2) - 2500}px) scale(1)`;
requestAnimationFrame(appLoop);
