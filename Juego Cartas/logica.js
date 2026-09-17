// ==========================================
// 1. ESTRUCTURA DE DATOS (ESCALABLE)
// ==========================================

// Definición de temas
const TEMAS = {
    ORIGEN: 'Origen de los Derechos de la Naturaleza',
    TENSIONES: 'Tensiones Jurídicas',
    PRINCIPIOS: 'Principios Culturales'
};

// Datos de los pares de cartas (2 pares por tema = 6 pares en total = 12 cartas)
const PARES_CARTAS = [
    // --- ORIGEN ---
    {
        idPar: 'origen-1',
        tema: TEMAS.ORIGEN,
        titulo: 'Sentencia T-622/16',
        contenidoModal: 'La Sentencia T-622 de 2016 reconoció al río Atrato como sujeto de derechos en Colombia, sentando un hito histórico en la jurisprudencia constitucional.'
    },
    {
        idPar: 'origen-2',
        tema: TEMAS.ORIGEN,
        titulo: 'Pacto por la Amazonía',
        contenidoModal: 'En 2018, la Corte Suprema de Justicia declaró a la Amazonía colombiana como sujeto de derechos para combatir la deforestación y proteger las generaciones futuras.'
    },
    // --- TENSIONES JURÍDICAS ---
    {
        idPar: 'tensiones-1',
        tema: TEMAS.TENSIONES,
        titulo: 'Desarrollo vs. Conservación',
        contenidoModal: 'Existe una tensión constante entre el modelo económico extractivista (minería, hidrocarburos) y la protección integral de los ecosistemas reconocidos como sujetos de derechos.'
    },
    {
        idPar: 'tensiones-2',
        tema: TEMAS.TENSIONES,
        titulo: 'Efectividad de Sentencias',
        contenidoModal: 'Una de las mayores tensiones es la falta de presupuesto y la compleja coordinación interinstitucional para ejecutar los planes de acción ordenados por las cortes.'
    },
    // --- PRINCIPIOS CULTURALES ---
    {
        idPar: 'principios-1',
        tema: TEMAS.PRINCIPIOS,
        titulo: 'Buen Vivir (Sumak Kawsay)',
        contenidoModal: 'Inspirado en cosmovisiones indígenas, este principio concibe al ser humano como parte armónica de la naturaleza, rompiendo con la visión antropocéntrica tradicional.'
    },
    {
        idPar: 'principios-2',
        tema: TEMAS.PRINCIPIOS,
        titulo: 'Biocentrismo',
        contenidoModal: 'El biocentrismo otorga valor intrínseco a la naturaleza y a todas las formas de vida, independientemente de la utilidad o beneficio que representen para la especie humana.'
    }
];

// Banco de preguntas (se activan al fallar una pareja).
const BANCO_PREGUNTAS = [
    {
        id: 1,
        tema: TEMAS.ORIGEN,
        pregunta: '¿Cuál fue el primer río en Colombia en ser declarado sujeto de derechos?',
        opciones: ['Río Magdalena', 'Río Atrato', 'Río Cauca', 'Río Amazonas'],
        correcta: 1 // Índice de la respuesta correcta en el arreglo
    },
    {
        id: 2,
        tema: TEMAS.ORIGEN,
        pregunta: '¿Qué tribunal emitió la histórica Sentencia T-622 de 2016 sobre el río Atrato?',
        opciones: ['El Consejo de Estado', 'La Corte Suprema de Justicia', 'La Corte Constitucional', 'La Fiscalía General'],
        correcta: 2
    },
    {
        id: 3,
        tema: TEMAS.TENSIONES,
        pregunta: '¿Cuál es uno de los principales obstáculos jurídicos en la implementación de las sentencias ambientales en Colombia?',
        opciones: [
            'Falta de apoyo ciudadano',
            'Desarticulación institucional y falta de presupuesto',
            'Prohibición constitucional de proteger ríos',
            'Oposición de la comunidad internacional'
        ],
        correcta: 1
    },
    {
        id: 4,
        tema: TEMAS.PRINCIPIOS,
        pregunta: '¿Qué postura filosófica reconoce a la naturaleza como poseedora de derechos propios y valor intrínseco?',
        opciones: ['Antropocentrismo', 'Biocentrismo', 'Utilitarismo', 'Egocentrismo'],
        correcta: 1
    },
    {
        id: 5,
        tema: TEMAS.PRINCIPIOS,
        pregunta: 'El concepto del "Buen Vivir" proviene principalmente de:',
        opciones: [
            'Tratados económicos europeos',
            'Leyes de propiedad privada',
            'Cosmovisiones de pueblos originarios / indígenas',
            'Políticas de industrialización'
        ],
        correcta: 2
    }
];

// ==========================================
// 2. ESTADO DEL JUEGO
// ==========================================
let cartasJuego = [];
let cartasVolteadas = [];
let aciertos = 0;
let intentos = 0;
let fallos = 0;
let bloqueado = false; // Evita que el usuario volteé más de 2 cartas a la vez

// Referencias al DOM
const tablero = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const attemptsEl = document.getElementById('attempts');

// Modales
// Modales cuando se acierta una pareja
const infoModal = document.getElementById('info-modal');
const infoTitle = document.getElementById('info-title');
const infoText = document.getElementById('info-text');
const closeInfoBtn = document.getElementById('close-info-btn');

//Modales cuando se falla al encontrar una pareja
const quizModal = document.getElementById('quiz-modal');
const quizTopic = document.getElementById('quiz-topic');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const closeQuizBtn = document.getElementById('close-quiz-btn');

//Modales cuando se encuentran todas las parejas
const victoryModal = document.getElementById('victory-modal');
const finalAttemptsEl = document.getElementById('final-attempts');
const finalFailuresEl = document.getElementById('final-failures');
const restartBtn = document.getElementById('restart-btn');

//Modal de instrucciones del juego
const modalInstrucciones = document.getElementById('modal-instrucciones');
const btnInstrucciones = document.getElementById('btn-instrucciones');
const btnCerrarInstrucciones = document.getElementById('btn-cerrar-instrucciones');

// ==========================================
// 3. LÓGICA Y FUNCIONES
// ==========================================

// Inicializar el juego
function iniciarJuego() {
    aciertos = 0;
    intentos = 0;
    fallos = 0;
    cartasVolteadas = [];
    bloqueado = false;
    scoreEl.textContent = aciertos;
    attemptsEl.textContent = intentos;
    victoryModal.classList.add('hidden');
    // Duplicar los pares para crear el total de cartas
    cartasJuego = [];
    PARES_CARTAS.forEach(par => {
        // Se generan dos carta individuales asociadas al mismo par
        cartasJuego.push({ ...par, idUnico: Math.random() });
        cartasJuego.push({ ...par, idUnico: Math.random() });
    });

    // Mezclar cartas
    cartasJuego.sort(() => Math.random() - 0.5);

    // Renderizar en el DOM
    renderizarTablero();
}

// Generar las cartas HTML
function renderizarTablero() {
    tablero.innerHTML = '';
    cartasJuego.forEach((carta, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">
                <span>${carta.titulo}</span>
                </div>
            </div>
        `;
        cardElement.addEventListener('click', () => voltearCarta(cardElement, carta));
        tablero.appendChild(cardElement);
    });
}

// Acción al hacer clic en una carta
function voltearCarta(cardElement, carta) {
    if (bloqueado || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
        return;
    }
    cardElement.classList.add('flipped');
    cartasVolteadas.push({ element: cardElement, data: carta });
    if (cartasVolteadas.length === 2) {
        intentos++;
        attemptsEl.textContent = intentos;
        verificarPareja();
    }
}

// Comparar las dos cartas seleccionadas
function verificarPareja() {
    bloqueado = true;
    const [carta1, carta2] = cartasVolteadas;
    if (carta1.data.idPar === carta2.data.idPar) {
        // ACIERTO: Marcamos las cartas como emparejadas (se quedan volteadas automáticamente)
        carta1.element.classList.add('matched');
        carta2.element.classList.add('matched');
        aciertos++;
        scoreEl.textContent = aciertos;
        // Si completó los 6 pares
        if (aciertos === PARES_CARTAS.length) {
            setTimeout(() => {
                mostrarModalVictoria();
        }, 800);
        } else {
        // Mostrar modal con información del tema
            mostrarInfoModal(carta1.data);
        }
    cartasVolteadas = [];
    bloqueado = false;
    } else {
        // ERROR: Se incrementa el contador de fallos y muestra la pregunta aleatoria
        fallos++;
        setTimeout(() => {
            lanzarPreguntaAleatoria();
        }, 600);
    }
}


// Mostrar Modal Informativo (al acertar)
function mostrarInfoModal(datosCarta) {
    infoTitle.textContent = `¡Par Encontrado! - ${datosCarta.tema}`;
    infoText.textContent = datosCarta.contenidoModal;
    infoModal.classList.remove('hidden');
}

// Lanzar Modal de Pregunta (al fallar)
function lanzarPreguntaAleatoria() {
    const preguntaRandom = BANCO_PREGUNTAS[Math.floor(Math.random() * BANCO_PREGUNTAS.length)];
    quizTopic.textContent = preguntaRandom.tema;
    quizQuestion.textContent = preguntaRandom.pregunta;
    quizOptions.innerHTML = '';
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback hidden';
    closeQuizBtn.classList.add('hidden');
    quizFeedback.classList.add('hidden');
    closeQuizBtn.classList.add('hidden');
    preguntaRandom.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = opcion;
        btn.addEventListener('click', () => evaluarRespuesta(index, preguntaRandom.correcta));
        quizOptions.appendChild(btn);
    });
    quizModal.classList.remove('hidden');
}

// Evaluar respuesta de la pregunta
function evaluarRespuesta(indiceSeleccionado, indiceCorrecto) {
    const botones = quizOptions.querySelectorAll('.option-btn');
    botones.forEach(btn => btn.disabled = true);
    if (indiceSeleccionado === indiceCorrecto) {
        quizFeedback.textContent = '¡Correcto! Has respondido bien a la pregunta.';
        quizFeedback.className = 'feedback correct';
    } else {
        quizFeedback.textContent = `Incorrecto. La respuesta correcta era: "${botones[indiceCorrecto].textContent}".`;
        quizFeedback.className = 'feedback incorrect';
    }
    quizFeedback.classList.remove('hidden');
    closeQuizBtn.classList.remove('hidden');
}

// Mostrar la pantalla de victoria
function mostrarModalVictoria() {
    finalAttemptsEl.textContent = intentos;
    finalFailuresEl.textContent = fallos;
    victoryModal.classList.remove('hidden');
}

// Event Listeners para cerrar modales
closeInfoBtn.addEventListener('click', () => {
    infoModal.classList.add('hidden');
});

closeQuizBtn.addEventListener('click', () => {
    quizModal.classList.add('hidden');
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback hidden';
    // Desvoltear las dos cartas falladas
    cartasVolteadas.forEach(item => item.element.classList.remove('flipped'));
    cartasVolteadas = [];
    bloqueado = false;
});

// Event Listener para reiniciar el juego
restartBtn.addEventListener('click', iniciarJuego);

//Abrir instrucciones con el botón
if (btnInstrucciones) {
    btnInstrucciones.addEventListener('click', () => {
        modalInstrucciones.classList.remove('hidden');
    });
}

//Cerrar modal de instrucciones
if (btnCerrarInstrucciones) {
    btnCerrarInstrucciones.addEventListener('click', () => {
        modalInstrucciones.classList.add('hidden');
    });
}

//Abrir modal de instrucciones automáticamente al cargar la pagina
window.addEventListener('DOMContentLoaded', () => {
    modalInstrucciones.classList.remove('hidden');
});

// Inicializar el tablero al cargar
document.addEventListener('DOMContentLoaded', iniciarJuego);