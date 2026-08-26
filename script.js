/* ==========================================
   レコード（アコーディオン）の開閉処理
　 ========================================== */
/* 他のレコードを閉じ、クリックされた詳細エリアを開いてスムーズスクロールする。*/

function toggleRecord(id, button){
    const target = document.getElementById(id);
    const records = document.querySelectorAll('.record');
    const buttons = document.querySelectorAll('.recordBtn');

    // 他のレコードとボタンをリセット
    records.forEach(record => {
        if(record !== target) record.classList.remove('show');
    });
    buttons.forEach(btn => {
        if(btn !== button) btn.textContent = 'レコードを見る';
    });

    // 開閉の切り替え
    if(target.classList.contains('show')){
        target.classList.remove('show');
        button.textContent = 'レコードを見る';
    }else{
        target.classList.add('show');
        button.textContent = '閉じる';

        // 開いた位置へ画面をスクロール
        setTimeout(() => {
            target.scrollIntoView({ behavior:'smooth', block:'nearest' });
        }, 100);
    }
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
let timer;
function autoSlide() {
    changeSlide(current + 1);
}
if (hero) {
    timer = setInterval(autoSlide, 3500);
    changeSlide(0);
}
function resetTimer(){
    if (hero) {
        clearInterval(timer);
        timer = setInterval(autoSlide, 3500);
    }
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