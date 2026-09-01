document.addEventListener('DOMContentLoaded', () => {
/* ==========================================
   レコード（アコーディオン）の開閉処理 ＆ カウントアップ（色変化演出付き）
   ========================================== */
/* 他のレコードを閉じ、クリックされた詳細エリアを開いてスムーズスクロール＆カウントアップ。*/

function toggleRecord(id, button){
    const target = document.getElementById(id);
    const records = document.querySelectorAll('.record');
    const buttons = document.querySelectorAll('.recordBtn');

    // 他のレコードとボタンをリセット
    records.forEach(record => {
        if(record !== target) {
            record.classList.remove('show');
            record.style.maxHeight = null;
        }
    });
    buttons.forEach(btn => {
        if(btn !== button) btn.textContent = 'レコードを見る';
    });

    // 開閉の切り替え
    if(target.classList.contains('show')){
        target.classList.remove('show');
        target.style.maxHeight = null;
        button.textContent = 'レコードを見る';
    }else{
        target.classList.add('show');
        target.style.maxHeight = target.scrollHeight + "px";
        button.textContent = '閉じる';

        // 開いた瞬間にカウントアップを開始
        startCountUp(target);

        setTimeout(() => {
            target.scrollIntoView({ behavior:'smooth', block:'nearest' });
        }, 100);
    }
}

// カウントアップ＆色変化を制御する関数
function startCountUp(container) {
    const textParagraphs = container.querySelectorAll('.recordText p');
    
    textParagraphs.forEach(p => {
        if (p.innerHTML.includes('⏱ レコードタイム')) {
            const originalHTML = p.innerHTML;
            
            if (p.dataset.isCounting === 'true') return;
            
            const match = originalHTML.match(/(\d+)分(\d+)秒(\d+)/);
            if (!match) return;

            p.dataset.isCounting = 'true';

            const targetMin = parseInt(match[1], 10);
            const targetSec = parseInt(match[2], 10);
            const targetMs = parseInt(match[3], 10);

            const targetTotalSeconds = (targetMin * 60) + targetSec + (targetMs / 10);

            const duration = 5000;
            const startTime = performance.now();

            function updateNumber(nowTime) {
                const elapsedTime = nowTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                // 後半にかけて少し減速させる
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentTotalSeconds = easeProgress * targetTotalSeconds;

                const currentMin = Math.floor(currentTotalSeconds / 60);
                const currentSec = Math.floor(currentTotalSeconds % 60);
                const currentMs = Math.floor((currentTotalSeconds % 1) * 10);

                p.innerHTML = `<strong>⏱ レコードタイム</strong><br>${currentMin}分${String(currentSec).padStart(2, '0')}秒${currentMs}`;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    //目標に達した瞬間、文字を強調
                    p.innerHTML = `<strong>⏱ レコードタイム</strong><br><span class="record-hit">${targetMin}分${String(targetSec).padStart(2, '0')}秒${targetMs}</span>`;
                    p.dataset.isCounting = 'false';
                }
            }
            requestAnimationFrame(updateNumber);
        }
    });
}

/* ==========================================
   メインビジュアルのスライダー処理
   ==========================================*/
/* 画像を横スクロールで切り替える無限ループスライダー。*/
const hero = document.querySelector(".hero");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const dots = document.querySelectorAll(".dot");

const images = [
    "img/hero1.jpg",
    "img/hero2.jpg",
    "img/hero3.jpg",
    "img/hero4.jpg"
];

let current = 0;
const heroSlider = document.querySelector(".heroSlider");

// スライド切り替えのコア関数
function changeSlide(index){
    const totalSlides = images.length; 

    if (heroSlider) {
        // 4枚目を超えて1枚目に戻る瞬間
        if (index >= totalSlides) {
            current = 0;
            heroSlider.style.transition = 'transform 0.8s ease-in-out';
            heroSlider.style.transform = `translateX(-80%)`;
            setTimeout(() => {
                heroSlider.style.transition = 'none';
                heroSlider.style.transform = `translateX(0%)`;
            }, 800);
        } 
        // 1枚目から前のボタンを押して4枚目に戻る瞬間
        else if (index < 0) {
            current = totalSlides - 1;
            heroSlider.style.transition = 'none';
            heroSlider.style.transform = `translateX(-80%)`;
            setTimeout(() => {
                heroSlider.style.transition = 'transform 0.8s ease-in-out';
                heroSlider.style.transform = `translateX(-60%)`;
            }, 20);
        } 
        // 通常の切り替え
        else {
            current = index;
            heroSlider.style.transition = 'transform 0.8s ease-in-out';
            heroSlider.style.transform = `translateX(-${current * 20}%)`;
        }
    }

    // ドットの点灯切り替え
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[current]) dots[current].classList.add("active");
}

// 各種ボタンのクリックイベント（要素が存在するときだけ動作）
if (next) {
    next.addEventListener("click", function(){
        changeSlide(current + 1);
        resetTimer();
    });
}
if (prev) {
    prev.addEventListener("click", function(){
        changeSlide(current - 1);
        resetTimer();
    });
}
if (dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener("click", function(){
            changeSlide(index);
            resetTimer();
        });
    });
}

// 自動再生タイマーの管理
let timer = null;
function autoSlide() {
    changeSlide(current + 1);
}

function startTimer() {
    if (hero && !timer) {
        timer = setInterval(autoSlide, 3500);
    }
}

function resetTimer(){
    if (hero) {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        startTimer();
    }
}

if (hero) {
    changeSlide(0);
    startTimer();
}

/* ==========================================
   ページトップに戻るボタン（▲）の表示制御
   ========================================== */
/* 1000px以上スクロールしたらボタンを表示。*/
window.addEventListener('scroll', () => {
    const topBtn = document.getElementById('pageTopBtn');
    if (topBtn) {
        if (window.scrollY > 1000) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    }
});

/* ==========================================
   スクロールふわっとアニメーション（Intersection Observer）
   ==========================================*/
/* 画面内に要素が入ってきたらクラスを付与して浮き出させる */
const scrollElements = document.querySelectorAll(".scrollReveal");

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
},{
    threshold:0.15
});

// すべての対象要素を監視
scrollElements.forEach((element) => {
    scrollObserver.observe(element);
});

// 初期読み込み時の表示のブレ防止
window.dispatchEvent(new Event('scroll'));

/* ==========================================
   背景に季節のアイテムを舞い上がらせる・降らせる処理
   ========================================== */
const body = document.body;

// 対象のクラスがどれか1つでもbodyにあれば実行
const seasons = ['season-sakura', 'season-green', 'season-gold', 'season-autumn'];
const hasSeason = seasons.some(className => body.classList.contains(className));

if (hasSeason) {
    // 花びらを入れるコンテナ
    const container = document.createElement('div');
    container.className = 'petal-container';
    body.appendChild(container);

    // 一定間隔で花びらを生成するタイマー
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'petal';

        petal.style.left = Math.random() * 100 + 'vw';

        const scale = Math.random() * 0.9 + 0.6;
        petal.style.transform = `scale(${scale})`;

        const duration = Math.random() * 4 + 4;
        petal.style.animationDuration = duration + 's';

        const drift = (Math.random() * 150 - 75) + 'px';
        const rotation = (Math.random() * 360 + 360) + 'deg';
        petal.style.setProperty('--drift', drift);
        petal.style.setProperty('--rotation', rotation);

        container.appendChild(petal);

        // アニメーション終了または安全タイマーで確実に削除
        const removePetal = () => {
            if (petal.parentNode) {
                petal.remove();
            }
        };

        petal.addEventListener('animationend', removePetal, { once: true });
        setTimeout(removePetal, (duration + 0.5) * 1000);

    }, 300);
}

/* ==========================================
   スクロール連動：馬の足跡（イベント完全解体版）
   ========================================== */
let lastScrollTop = window.scrollY;
let scrollDistance = 0;
let isLeftFoot = true;

// 🐾 足跡を発生させるコア関数
function handleHoofprintScroll() {
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    if (!isIndexPage) return;

    const currentScroll = window.scrollY;
    const diff = Math.abs(currentScroll - lastScrollTop);
    lastScrollTop = currentScroll;

    scrollDistance += diff;

    // 足跡が出る頻度（ピクセル移動量）
    const stepFrequency = 480;

    if (scrollDistance > stepFrequency) {
        scrollDistance = 0;

        const hoof = document.createElement('div');
        hoof.className = 'hoofprint';

        const randomRot = (Math.random() * 10 - 5);
        const randomX = (Math.random() * 2);

        if (isLeftFoot) {
            hoof.style.left = (4 + randomX) + '%'; 
            hoof.style.setProperty('--hoof-rot', (-15 + randomRot) + 'deg');
        } else {
            hoof.style.right = (4 + randomX) + '%'; 
            hoof.style.setProperty('--hoof-rot', (15 + randomRot) + 'deg');
        }

        const randomY = Math.random() * 40 + 40; 
        hoof.style.top = randomY + 'vh';

        document.body.appendChild(hoof);
        isLeftFoot = !isLeftFoot;

        setTimeout(() => {
            hoof.remove();
        }, 1200);
    }
}

// ページ読み込み時に、足跡の監視を開始
window.addEventListener('scroll', handleHoofprintScroll);


// すべてのボタンクリックや、ホイールクリックを監視
document.addEventListener('mousedown', (e) => {
    const target = e.target;
    
    if (
        target.closest('button') || 
        target.closest('a[href^="#"]') || 
        target.closest('.recordBtn') || 
        target.id === 'pageTopBtn' ||
        e.button === 1
    ) {
        //  スクロール監視を【完全に消去】して足跡が出ないようにする
        window.removeEventListener('scroll', handleHoofprintScroll);
        scrollDistance = 0;

        //  自動スクロールが完全に終わる頃（1.2秒後）に、監視を再登録して復活させる
        setTimeout(() => {
            lastScrollTop = window.scrollY;
            scrollDistance = 0;
            window.addEventListener('scroll', handleHoofprintScroll);
        }, 1200);
    }
}, true);
});