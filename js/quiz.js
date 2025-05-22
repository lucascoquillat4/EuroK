const questions = [
    {
        question: "En quelle année a eu lieu la première édition des Eurockéennes de Belfort ?",
        options: ["1989", "1990", "1992", "1995"],
        correctAnswer: 0
    },
    {
        question: "Où se déroule précisément le festival des Eurockéennes ?",
        options: ["À Mulhouse", "Au Malsaucy, près de Belfort", "Dans le centre-ville de Belfort", " À Strasbourg"],
        correctAnswer: 1
    },
    {
        question: "Quel genre musical est principalement représenté aux Eurockéennes ?",
        options: ["Musique classique", "Jazz", "Musiques actuelles (rock, rap, électro...)", "Techno"],
        correctAnswer: 2
    },
    {
        question: "Combien de scènes principales accueillent les concerts pendant le festival (en moyenne) ?",
        options: ["1", "2", "4", "6"],
        correctAnswer: 2
    },
    {
        question: "Quel grand nom de la musique a déjà été tête d’affiche aux Eurockéennes ?",
        options: ["Daft Punk", "Nirvana", "Red Hot Chili Peppers", "BTS"],
        correctAnswer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const authMessage = document.getElementById('auth-message');
const quizContent = document.getElementById('quiz-content');
const questionContainer = document.getElementById('questionContainer');
const submitBtn = document.getElementById('submitAnswer');
const currentQuestionSpan = document.getElementById('currentQuestion');
const quizResults = document.getElementById('quiz-results');
const totalPoints = document.getElementById('totalPoints');
const retryQuiz = document.getElementById('retryQuiz');
const loginPrompt = document.getElementById('loginPrompt');

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        authMessage.style.display = 'block';
        quizContent.style.display = 'none';
        return false;
    }
    authMessage.style.display = 'none';
    quizContent.style.display = 'block';
    return true;
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    questionContainer.innerHTML = `
        <div class="question">${question.question}</div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <div class="option" data-index="${index}">${option}</div>
            `).join('')}
        </div>
    `;

    // Ajouter les événements click sur les options
    const options = questionContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

function updateUserPoints(points) {
    const user = JSON.parse(localStorage.getItem('user'));
    user.points = (user.points || 0) + points;
    localStorage.setItem('user', JSON.stringify(user));
}

function checkQuizCooldown() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return false;

    const lastQuizAttempt = localStorage.getItem(`lastQuizAttempt_${user.email}`);
    if (!lastQuizAttempt) return true;

    const now = new Date().getTime();
    const lastAttempt = parseInt(lastQuizAttempt);
    const hoursSinceLastAttempt = (now - lastAttempt) / (1000 * 60 * 60);

    return hoursSinceLastAttempt >= 24;
}

function getTimeRemaining() {
    const user = JSON.parse(localStorage.getItem('user'));
    const lastQuizAttempt = parseInt(localStorage.getItem(`lastQuizAttempt_${user.email}`));
    const now = new Date().getTime();
    const timeRemaining = 24 - ((now - lastQuizAttempt) / (1000 * 60 * 60));
    
    const hours = Math.floor(timeRemaining);
    const minutes = Math.floor((timeRemaining % 1) * 60);
    
    return `${hours}h ${minutes}min`;
}

submitBtn.addEventListener('click', () => {
    const selectedOption = questionContainer.querySelector('.option.selected');
    if (!selectedOption) return;

    const userAnswer = parseInt(selectedOption.dataset.index);
    if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
        score += 30;
        updateUserPoints(30);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    const user = JSON.parse(localStorage.getItem('user'));
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    totalPoints.textContent = score;
    
    // Enregistrer la date de la dernière tentative
    localStorage.setItem(`lastQuizAttempt_${user.email}`, new Date().getTime().toString());
    
    // Mettre à jour les points de l'utilisateur
    user.points = (parseInt(user.points) || 0) + score;
    localStorage.setItem('user', JSON.stringify(user));
    
    // Mettre à jour l'affichage des points dans la navbar
    const userPoints = document.getElementById('userPoints');
    if (userPoints) {
        userPoints.textContent = `EuroKoins: ${user.points}`;
    }
}

retryQuiz.addEventListener('click', () => {
    if (checkQuizCooldown()) {
        startQuiz();
    } else {
        const timeLeft = getTimeRemaining();
        alert(`Vous devez attendre ${timeLeft} avant de pouvoir rejouer.`);
    }
});

loginPrompt.addEventListener('click', () => {
    window.location.href = 'Accueil.html';
});

document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        startQuiz();
    }
});

function startQuiz() {
    if (!checkQuizCooldown()) {
        const timeLeft = getTimeRemaining();
        quizContent.style.display = 'none';
        const cooldownMessage = document.createElement('div');
        cooldownMessage.className = 'cooldown-message';
        cooldownMessage.innerHTML = `
            <h3>Quiz en pause</h3>
            <p>Vous pourrez rejouer dans ${timeLeft}</p>
        `;
        document.querySelector('.quiz-container').appendChild(cooldownMessage);
        return;
    }

    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
    quizContent.style.display = 'block';
    quizResults.style.display = 'none';
}