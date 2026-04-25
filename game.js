// Security Sanitization

/**
 * Strict URL sanitizer for HTML attributes (src, etc).
 * Enforces https/http whitelist and percent-encodes quotes.
 */
function safeUrl(url) {
    if (typeof url !== 'string') return '';
    if (!url.startsWith('https://') && !url.startsWith('http://')) return '';
    // encodeURI handles spaces and double quotes (%22).
    // Manually escape single quotes (%27) for attribute safety.
    return encodeURI(url).replace(/'/g, '%27');
}

/**
 * Strict URL sanitizer for CSS values (url(...)).
 * Prevents injection via quotes or parentheses.
 */
function safeCSSUrl(url) {
    if (typeof url !== 'string') return '';
    if (!url.startsWith('https://') && !url.startsWith('http://')) return '';
    // For CSS url(), we must escape single quotes and parentheses
    return encodeURI(url)
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
}

let db = [], pool = [];
let leftItem, rightItem;
let isNSFW = false;
let locked = false;
let score = 0;
let bestScore = localStorage.getItem('pg_best') || 0;

// Новая переменная для хранения ID анимации
let currentAnimId = null;

// Элементы (will be populated on DOMContentLoaded)
let els = {};

/**
 * Fisher-Yates Shuffle for O(n) unbiased shuffling.
 * Replaces O(n log n) sort-based shuffle.
 */
function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function resetPool() {
    pool = shuffle([...db]);
}

function getNext() {
    if (pool.length === 0) resetPool();
    return pool.pop();
}

// Функция для остановки текущей анимации
function stopAnimation() {
    if (currentAnimId) {
        cancelAnimationFrame(currentAnimId);
        currentAnimId = null;
    }
}

function startFirstRound() {
    stopAnimation(); // Останавливаем старую анимацию перед стартом
    leftItem = getNext();
    rightItem = getNext();
    updateUI(false);

    // Сброс стилей
    locked = false;
    els.c1.classList.remove('win', 'lose');
    els.c2.classList.remove('win', 'lose');
    els.btn.classList.remove('show');

    preloadNext();
}

function next() {
    stopAnimation(); // КРИТИЧНО ВАЖНО: Останавливаем анимацию здесь

    // Двигаем победителя влево
    leftItem = rightItem;
    rightItem = getNext();

    updateUI(false); // Здесь поставится "?"

    // Сброс
    els.btn.classList.remove('show');
    locked = false;
    els.c1.classList.remove('win', 'lose');
    els.c2.classList.remove('win', 'lose');

    preloadNext();
}

function getVal(item) {
    return isNSFW ? item.counts.nsfw : item.counts.total;
}

function getImg(item) {
    let url;
    if (isNSFW && item.images.nsfw) url = item.images.nsfw;
    else url = item.images.sfw || item.images.nsfw;
    return url;
}

function updateUI(revealed) {
    // Левая
    // OPTIMIZATION: Use textContent instead of innerHTML/innerText to prevent layout thrashing
    els.name1.textContent = leftItem.name;
    els.fran1.textContent = leftItem.franchise;
    els.cnt1.textContent = getVal(leftItem).toLocaleString();

    const rawUrl1 = getImg(leftItem);
    const url1 = safeUrl(rawUrl1);
    if (els.img1.dataset.src !== url1) {
        els.img1.style.opacity = '0';
        els.img1.src = url1;
        els.img1.dataset.src = url1;
        els.c1.style.setProperty('--bg-image', `url('${safeCSSUrl(rawUrl1)}')`);
    }
    els.img1.alt = `${leftItem.name} (${leftItem.franchise})`;
    els.c1.setAttribute('aria-label', `Vote for ${leftItem.name}`);

    // Правая
    els.name2.textContent = rightItem.name;
    els.fran2.textContent = rightItem.franchise;

    const rawUrl2 = getImg(rightItem);
    const url2 = safeUrl(rawUrl2);
    if (els.img2.dataset.src !== url2) {
        els.img2.style.opacity = '0';
        els.img2.src = url2;
        els.img2.dataset.src = url2;
        els.c2.style.setProperty('--bg-image', `url('${safeCSSUrl(rawUrl2)}')`);
    }
    els.img2.alt = `${rightItem.name} (${rightItem.franchise})`;
    els.c2.setAttribute('aria-label', `Vote for ${rightItem.name}`);

    if (revealed) {
        animateValue(els.cnt2, 0, getVal(rightItem), 600);
    } else {
        els.cnt2.textContent = "?";
    }
}

function vote(side) {
    if (locked) return;
    locked = true;

    const v1 = getVal(leftItem);
    const v2 = getVal(rightItem);
    const isWin = (side === 'left' && v1 >= v2) || (side === 'right' && v2 >= v1);

    updateUI(true); // Запускает анимацию

    if (isWin) {
        score++;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('pg_best', bestScore);
        }
        if (side === 'left') els.c1.classList.add('win');
        else els.c2.classList.add('win');
    } else {
        score = 0;
        if (side === 'left') { els.c1.classList.add('lose'); els.c2.classList.add('win'); }
        else { els.c2.classList.add('lose'); els.c1.classList.add('win'); }
    }

    updateScoreUI();
    els.btn.classList.add('show');
}

function updateScoreUI() {
    els.score.textContent = score;
    els.best.textContent = bestScore;
}

function animateValue(obj, start, end, duration) {
    stopAnimation(); // На всякий случай сбрасываем перед запуском новой

    let startTimestamp = null;
    // Bolt: Instantiate NumberFormat outside the loop to avoid per-frame GC pressure and implicit locale resolution overhead.
    const formatter = new Intl.NumberFormat();
    let lastFormatted = '';
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        const formattedValue = formatter.format(currentValue);
        // Bolt: Guard DOM updates with value-change check to prevent unnecessary browser repaints
        if (formattedValue !== lastFormatted) {
            obj.textContent = formattedValue;
            lastFormatted = formattedValue;
        }
        if (progress < 1) {
            currentAnimId = window.requestAnimationFrame(step);
        } else {
            currentAnimId = null;
        }
    };
    currentAnimId = window.requestAnimationFrame(step);
}

// Keyboard Support
function handleCardKey(e, side) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (locked) next();
        else vote(side);
    }
}

function preloadNext() {
    // OPTIMIZATION: Preload upcoming 3 images to prevent lag between rounds
    const PRELOAD_COUNT = 3;

    // If the pool is empty, refill it now to identify the next image.
    // This shifts the shuffle timing slightly but preserves randomness.
    if (pool.length === 0) resetPool();

    if (pool.length > 0) {
        // Preload up to PRELOAD_COUNT images from the end of the pool
        for (let i = 1; i <= PRELOAD_COUNT; i++) {
            const idx = pool.length - i;
            if (idx >= 0) {
                const nextItem = pool[idx];
                const img = new Image();
                img.src = safeUrl(getImg(nextItem));
            } else {
                break;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    els = {
        c1: document.getElementById('c1'), c2: document.getElementById('c2'),
        img1: document.getElementById('img1'), img2: document.getElementById('img2'),
        name1: document.getElementById('name1'), name2: document.getElementById('name2'),
        fran1: document.getElementById('fran1'), fran2: document.getElementById('fran2'),
        cnt1: document.getElementById('count1'), cnt2: document.getElementById('count2'),
        score: document.getElementById('score'), best: document.getElementById('best'),
        btn: document.getElementById('nextBtn')
    };

    // Event Listeners for Cards
    els.c1.addEventListener('click', () => vote('left'));
    els.c1.addEventListener('keydown', (e) => handleCardKey(e, 'left'));

    els.c2.addEventListener('click', () => vote('right'));
    els.c2.addEventListener('keydown', (e) => handleCardKey(e, 'right'));

    // Event Listener for Next Button
    els.btn.addEventListener('click', next);

    // Event Listener for Mode Switch
    document.getElementById('modeSwitch').addEventListener('change', (e) => {
        isNSFW = e.target.checked;
        score = 0; updateScoreUI();
        resetPool();
        startFirstRound();
    });

    // Smooth image loading handlers
    els.img1.onload = () => els.img1.style.opacity = '1';
    els.img2.onload = () => els.img2.style.opacity = '1';

    // Start
    els.best.textContent = bestScore;

    // OPTIMIZATION: Removed timestamp query param to enable browser caching
    fetch('characters.json')
        .then(r => r.json())
        .then(data => {
            db = data;
            if(db.length < 2) {
                alert("В базе мало персонажей! Запустите manage.py.");
                return;
            }
            resetPool();
            startFirstRound();
        })
        .catch(e => {
            console.error("Ошибка загрузки:", e);
            const err = document.getElementById('errorMsg');
            if (err) {
                err.style.display = 'block';
                err.innerHTML = `Failed to load game data.<br><span style="font-size:0.8em; font-weight:400; opacity:0.8">Please check your connection and refresh.</span>`;
            }
        });

    // Global Keydown
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !locked) vote('left');
        if (e.key === 'ArrowRight' && !locked) vote('right');
        if (e.key === 'Enter' && locked && document.activeElement === document.body) next();
    });
});
