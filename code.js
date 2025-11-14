// Elementos DOM
const display = document.getElementById('display');
const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');
const progressBar = document.getElementById('progress-bar');
const inActive = document.getElementById('active-input');
const inRest = document.getElementById('rest-input');
const colorActive = document.getElementById('color-active');
const colorRest = document.getElementById('color-rest');
let totalTimeText = document.getElementById('total-time');

let activeSecs = 0;
let restSecs = 0;
let remaining = 0;
let totalTime = 0;

let isActivePhase = true;
let timer = null;


// Elementos de configuración
const unitToggle = document.getElementById('unitToggle');
const labelActive = document.getElementById('label-active');
const labelRest = document.getElementById('label-rest');

let usarSegundos = true;
const beep = new Audio("https://cdn.freesound.org/previews/362/362420_4910111-lq.mp3");

const flashOverlay = document.getElementById('flash-overlay');

function obtenerValorSegundos(input) {
    const valor = parseInt(input.value) || 0;
    remaining = valor;
    updateUI();
    return usarSegundos ? valor : valor * 60;
}

function actualizarEtiquetas() {
    if (usarSegundos) {
        labelActive.textContent = "Tiempo activo (seg)";
        labelRest.textContent = "Tiempo descanso (seg)";
    } else {
        labelActive.textContent = "Tiempo activo (min)";
        labelRest.textContent = "Tiempo descanso (min)";
    }
}

unitToggle.addEventListener('change', () => {
    usarSegundos = unitToggle.checked;
    actualizarEtiquetas();
    // Actualiza los valores sin reiniciar
    activeSecs = obtenerValorSegundos(inActive);
    restSecs = obtenerValorSegundos(inRest);
    updateUI();
});

function updateUI() {
    // Actualizar el tiempo total
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    totalTimeText.textContent = `Tiempo total: ${String(Math.floor(totalTime / 60)).padStart(2, '0')}:${String(totalTime % 60).padStart(2, '0')}`;

    const total = isActivePhase ? activeSecs : restSecs;
    const pct = (remaining / total) * 100;
    progressBar.style.width = `${pct}%`;
    progressBar.className = 'progress-bar';
    progressBar.classList.add(isActivePhase ? 'bg-success' : 'bg-danger');

    progressBar.style.backgroundColor = isActivePhase ? colorActive.value : colorRest.value;

    btnToggle.textContent = timer ? 'Pausar' : 'Comenzar';
}

function toggleTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    } else {
        activeSecs = obtenerValorSegundos(inActive);
        restSecs = obtenerValorSegundos(inRest);
        remaining = isActivePhase ? activeSecs : restSecs;
        timer = setInterval(tick, 1000);
    }
    updateUI();
}

function tick() {
    remaining--;
    totalTime++;

    if (remaining < 0) {
        // Actualizar duraciones por si han cambiado en tiempo real
        activeSecs = obtenerValorSegundos(inActive);
        restSecs = obtenerValorSegundos(inRest);

        isActivePhase = !isActivePhase;
        remaining = isActivePhase ? activeSecs : restSecs;

        beep.play();
        flashOverlay.classList.remove('flash-green', 'flash-red');
        flashOverlay.classList.add(isActivePhase ? 'flash-green' : 'flash-red');
        setTimeout(() => {
            flashOverlay.classList.remove('flash-green', 'flash-red');
        }, 400);
    }

    updateUI();
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    isActivePhase = true;
    activeSecs = obtenerValorSegundos(inActive);
    restSecs = obtenerValorSegundos(inRest);
    remaining = activeSecs;
    updateUI();
}

btnToggle.addEventListener('click', toggleTimer);
btnReset.addEventListener('click', resetTimer);

// ✅ Ahora solo actualizan los valores sin reiniciar el cronómetro
inActive.addEventListener('change', () => {
    activeSecs = obtenerValorSegundos(inActive);
});
inRest.addEventListener('change', () => {
    restSecs = obtenerValorSegundos(inRest);
});

colorActive.addEventListener('change', updateUI);
colorRest.addEventListener('change', updateUI);

// Estado inicial
usarSegundos = true;
actualizarEtiquetas();
activeSecs = obtenerValorSegundos(inActive);
restSecs = obtenerValorSegundos(inRest);
remaining = activeSecs;
updateUI();
