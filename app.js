const vocabularyCards = [
    { front: "😍 LOVE", back: "J'adore ! (+ gérondif/nom)\n'I love dancing' 💃", hint: "Sentiment très fort et positif" },
    { front: "😊 LIKE", back: "J'aime (+ gérondif/nom)\n'I like reading' 📚", hint: "Sentiment positif modéré" },
    { front: "😐 DISLIKE", back: "Je n'aime pas (+ gérondif/nom)\n'I dislike waiting' ⏰", hint: "Sentiment négatif modéré" },
    { front: "😤 HATE", back: "Je déteste (+ gérondif/nom)\n'I hate cleaning' 🧹", hint: "Sentiment très négatif" },
    { front: "🤩 BE CRAZY ABOUT", back: "Être fou/folle de (+ gérondif/nom)\n'I'm crazy about football' ⚽", hint: "Passion extrême" },
    { front: "😌 ENJOY", back: "Apprécier (+ gérondif seulement !)\n'I enjoy cooking' 👨‍🍳", hint: "Toujours suivi du gérondif" },
    { front: "🧐 BE INTERESTED IN", back: "S'intéresser à (+ gérondif/nom)\n'I'm interested in science' 🔬", hint: "Curiosité intellectuelle" },
    { front: "🥰 BE FOND OF", back: "Avoir de l'affection pour (+ gérondif/nom)\n'I'm fond of cats' 🐱", hint: "Affection tendre" },
    { front: "😰 CAN'T BEAR", back: "Ne pas supporter (+ gérondif/infinitif)\n'I can't bear waiting' ⏳", hint: "Intolérance forte" },
    { front: "😱 DREAD", back: "Redouter (+ gérondif/nom)\n'I dread exams' 📝", hint: "Peur anticipée" }
];

const grammarCards = [
    { front: "LOVE + ?", back: "LOVE + gérondif OU infinitif\n'I love dancing/to dance' 💃", hint: "Les deux formes sont possibles" },
    { front: "ENJOY + ?", back: "ENJOY + gérondif SEULEMENT\n'I enjoy reading' (pas 'to read') 📖", hint: "Jamais d'infinitif après ENJOY" },
    { front: "CAN'T STAND + ?", back: "CAN'T STAND + gérondif\n'I can't stand waiting' ⏰", hint: "Expression d'intolérance" },
    { front: "BE INTERESTED + ?", back: "BE INTERESTED + IN + gérondif/nom\n'I'm interested IN cooking' 👨‍🍳", hint: "N'oubliez pas la préposition IN" },
    { front: "BE FOND + ?", back: "BE FOND + OF + gérondif/nom\n'I'm fond OF music' 🎵", hint: "N'oubliez pas la préposition OF" },
    { front: "DREAD + ?", back: "DREAD + gérondif/nom\n'I dread going there' 😰", hint: "Exprime une peur du futur" },
    { front: "FEAR + ?", back: "FEAR + gérondif/nom/infinitif\n'I fear flying/to fly' ✈️", hint: "Plusieurs constructions possibles" },
    { front: "Gérondif = ?", back: "Verbe + ING utilisé comme nom\n'Swimming is fun' 🏊‍♀️", hint: "Le verbe devient un nom" },
    { front: "Après préposition ?", back: "Toujours GÉRONDIF après préposition\n'I'm good AT singing' 🎤", hint: "IN, OF, AT, etc. + gérondif" },
    { front: "MIND + ?", back: "MIND + gérondif\n'I don't mind waiting' 😊", hint: "Exprime que ça ne dérange pas" }
];

let currentMode = 'vocabulary';
let flashcards = vocabularyCards;

let currentCard = null;
let stats = {
    correct: 0,
    incorrect: 0,
    total: 0
};
let startTime = null;
let cardStartTime = null;
let timerInterval = null;
let score = 0;
let wrongCards = [];
let isReviewMode = false;

function createCards() {
    const grid = document.getElementById('cardsGrid');
    grid.innerHTML = '';
    
    flashcards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'flashcard';
        cardElement.innerHTML = `
            <div class="card-inner" onclick="flipCard(${index})">
                <div class="card-front">
                    <div>${card.front}</div>
                </div>
                <div class="card-back">
                    <div style="white-space: pre-line; text-align: center;">${card.back}</div>
                </div>
            </div>
        `;
        grid.appendChild(cardElement);
    });
}

function flipCard(index) {
    const cards = document.querySelectorAll('.flashcard');
    const card = cards[index];
    
    if (card.classList.contains('flipped')) return;
    
    if (!startTime) {
        startTime = Date.now();
        startTimer();
    }
    
    cardStartTime = Date.now();
    card.classList.add('flipped');
    currentCard = { index, element: card, data: flashcards[index] };
    
    setTimeout(() => {
        if (currentCard && currentCard.index === index) {
            showHint(flashcards[index].hint);
        }
    }, 5000);
    
    setTimeout(() => {
        document.getElementById('controls').style.display = 'block';
        document.getElementById('controls').scrollIntoView({ behavior: 'smooth' });
    }, 400);
}

function markAnswer(isCorrect) {
    if (!currentCard) return;
    
    const feedback = document.getElementById('feedback');
    const cardBack = currentCard.element.querySelector('.card-back');
    const responseTime = Date.now() - cardStartTime;
    
    let points = 0;
    if (isCorrect) {
        stats.correct++;
        cardBack.classList.add('card-correct');
        
        if (responseTime < 3000) points = 100;
        else if (responseTime < 5000) points = 75;
        else if (responseTime < 8000) points = 50;
        else points = 25;
        
        score += points;
        feedback.textContent = `🎉 Excellent ! +${points} points ! 🌟`;
        feedback.className = 'feedback correct show';
    } else {
        stats.incorrect++;
        cardBack.classList.add('card-incorrect');
        wrongCards.push(currentCard.data);
        feedback.textContent = '😅 Pas grave ! On apprend de ses erreurs ! 💪';
        feedback.className = 'feedback incorrect show';
    }
    
    stats.total++;
    updateStats();
    hideHint();
    
    document.getElementById('controls').style.display = 'none';
    
    if (wrongCards.length > 0) {
        document.getElementById('reviewBtn').style.display = 'inline-block';
    }
    
    currentCard = null;
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

function updateStats() {
    document.getElementById('correctCount').textContent = stats.correct;
    document.getElementById('incorrectCount').textContent = stats.incorrect;
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('score').textContent = `⭐ Score: ${score}`;
    
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    const progress = (stats.total / flashcards.length) * 100;
    document.getElementById('progressFill').style.width = Math.min(progress, 100) + '%';
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `⏰ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function showHint(hintText) {
    document.getElementById('hintText').textContent = hintText;
    document.getElementById('hintSection').style.display = 'block';
}

function hideHint() {
    document.getElementById('hintSection').style.display = 'none';
}

function toggleMode() {
    currentMode = currentMode === 'vocabulary' ? 'grammar' : 'vocabulary';
    flashcards = currentMode === 'vocabulary' ? vocabularyCards : grammarCards;
    document.getElementById('modeBtn').textContent = 
        currentMode === 'vocabulary' ? '🎯 Mode: Vocabulaire' : '📝 Mode: Grammaire';
    resetGame();
}

function reviewErrors() {
    if (wrongCards.length === 0) return;
    
    isReviewMode = true;
    flashcards = [...wrongCards];
    wrongCards = [];
    document.getElementById('reviewBtn').style.display = 'none';
    resetGame();
    
    const feedback = document.getElementById('feedback');
    feedback.textContent = '📚 Mode révision activé ! Révisez vos erreurs 🎯';
    feedback.className = 'feedback show';
    setTimeout(() => feedback.classList.remove('show'), 3000);
}

function resetGame() {
    stats = { correct: 0, incorrect: 0, total: 0 };
    
    if (!isReviewMode) {
        score = 0;
        wrongCards = [];
        flashcards = currentMode === 'vocabulary' ? vocabularyCards : grammarCards;
    }
    
    isReviewMode = false;
    startTime = null;
    cardStartTime = null;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    document.getElementById('timer').textContent = '⏰ 00:00';
    updateStats();
    createCards();
    document.getElementById('controls').style.display = 'none';
    document.getElementById('feedback').classList.remove('show');
    hideHint();
    currentCard = null;
}

function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    resetGame();
}

// Initialisation
createCards();
updateStats();
