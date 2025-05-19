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
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';
        totalPoints.textContent = score;
    }
});

retryQuiz.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    quizResults.style.display = 'none';
    if (checkAuth()) {
        quizContent.style.display = 'block';
        displayQuestion();
    }
});

loginPrompt.addEventListener('click', () => {
    window.location.href = 'Accueil.html';
});

// Initialiser le quiz
if (checkAuth()) {
    displayQuestion();
}