// Elementos DOM
const display = document.getElementById('display');
const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');
const progressBar = document.getElementById('progress-bar');
const inActive = document.getElementById('active-input');
const inRest = document.getElementById('rest-input');
const colorActive = document.getElementById('color-active');
const colorRest = document.getElementById('color-rest');


let activeSecs = 0;
let restSecs = 0;
let remaining = 0;

let isActivePhase = true;
let timer = null;

const unitToggle = document.getElementById('unitToggle');
const labelActive = document.getElementById('label-active');
const labelRest = document.getElementById('label-rest');

let usarSegundos = true;
// Alerta sonora simple (puedes reemplazarlo con otro sonido si prefieres)
const beep = new Audio("https://cdn.freesound.org/previews/362/362420_4910111-lq.mp3");

// Elemento de flash overlay
const flashOverlay = document.getElementById('flash-overlay');


// Convierte los valores según la unidad elegida
function obtenerValorSegundos(input) {
    const valor = parseInt(input.value) || 0;
    return usarSegundos ? valor : valor * 60;
}

// Actualiza las etiquetas según el modo seleccionado
function actualizarEtiquetas() {
    if (usarSegundos) {
        labelActive.textContent = "Tiempo activo (seg)";
        labelRest.textContent = "Tiempo descanso (seg)";
    } else {
        labelActive.textContent = "Tiempo activo (min)";
        labelRest.textContent = "Tiempo descanso (min)";
    }
}

// Evento para cambiar el tipo de unidad
unitToggle.addEventListener('change', () => {
    usarSegundos = unitToggle.checked;
    actualizarEtiquetas();
    resetTimer();
});


// Actualiza la interfaz basada en estado
function updateUI() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const total = isActivePhase ? activeSecs : restSecs;
    const pct = (remaining / total) * 100;
    progressBar.style.width = `${pct}%`;
    progressBar.className = 'progress-bar';
    progressBar.classList.add(isActivePhase ? 'bg-success' : 'bg-danger');

    if (isActivePhase) {
        progressBar.style.backgroundColor = colorActive.value;
    } else {
        progressBar.style.backgroundColor = colorRest.value;
    }

    btnToggle.textContent = timer ? 'Pausar' : 'Comenzar';


}

// Inicia o detiene el cronómetro
function toggleTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    } else {
        activeSecs = obtenerValorSegundos(inActive);
        restSecs = obtenerValorSegundos(inRest);
        remaining = isActivePhase ? activeSecs : restSecs;
        updateUI();
        timer = setInterval(tick, 1000);
    }
    updateUI();
}


// Tick cada segundo

function tick() {
    remaining--;
    if (remaining < 0) {
        isActivePhase = !isActivePhase;
        activeSecs = obtenerValorSegundos(inActive);
        restSecs = obtenerValorSegundos(inRest);
        remaining = isActivePhase ? activeSecs : restSecs;

        // Reproduce sonido
        beep.play();

        // Flash visual con color del nuevo estado
        flashOverlay.classList.remove('flash-green', 'flash-red');
        flashOverlay.classList.add(isActivePhase ? 'flash-green' : 'flash-red');
        setTimeout(() => {
            flashOverlay.classList.remove('flash-green', 'flash-red');
        }, 400);
    }
    updateUI();
}


// Reiniciar
function resetTimer() {
    clearInterval(timer);
    timer = null;
    isActivePhase = true;
    remaining = activeSecs;
    updateUI();
}

// Eventos
btnToggle.addEventListener('click', toggleTimer);
btnReset.addEventListener('click', resetTimer);
inActive.addEventListener('change', resetTimer);
inRest.addEventListener('change', resetTimer);
colorActive.addEventListener('change', updateUI);
colorRest.addEventListener('change', updateUI);

// Estado inicial
usarSegundos = true;
actualizarEtiquetas();
activeSecs = obtenerValorSegundos(inActive);
restSecs = obtenerValorSegundos(inRest);
remaining = activeSecs;
updateUI();
