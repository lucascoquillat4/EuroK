document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

//Slider Début//

document.querySelectorAll('.slider').forEach(slider => {
    const upBtn = slider.querySelector('.up-btn');
    const downBtn = slider.querySelector('.down-btn');
    const content = slider.querySelector('.slider-content');

    let scrollAmount = 0;
    const scrollStep = 50;

    upBtn.addEventListener('click', () => {
        scrollAmount -= scrollStep;
        content.scrollTo({ top: scrollAmount, behavior: 'smooth' });
    });

    downBtn.addEventListener('click', () => {
        scrollAmount += scrollStep;
        content.scrollTo({ top: scrollAmount, behavior: 'smooth' });
    });
});
// Slider Fin //

document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const closeBtns = document.querySelectorAll('.close');
    const userSection = document.getElementById('userSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmail = document.getElementById('userEmail');
    const userPoints = document.getElementById('userPoints');

    // Éléments du profil
    const profileBtn = document.getElementById('profileBtn');
    const profileModal = document.getElementById('profileModal');
    const profileEmail = document.getElementById('profileEmail');
    const profilePoints = document.getElementById('profilePoints');

    // Modifier la fonction openModal
    function openModal(modal) {
        modal.style.display = 'flex';
        // Déclencher le reflow pour que l'animation fonctionne
        modal.offsetHeight;
        modal.classList.add('active');
    }

    // Modifier la fonction closeModal
    function closeModal(modal) {
        modal.classList.remove('active');
        // Attendre la fin de l'animation avant de cacher le modal
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Ouvrir le modal de connexion
    loginBtn.onclick = () => openModal(loginModal);

    // Ouvrir le modal profil
    profileBtn.onclick = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            profileEmail.textContent = user.email;
            profilePoints.textContent = user.points;
            openModal(profileModal);
        }
    }

    // Gérer les boutons de fermeture
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            closeModal(loginModal);
            closeModal(registerModal);
            closeModal(profileModal);
        }
    });

    // Fermer les modaux en cliquant en dehors
    window.onclick = (event) => {
        if (event.target == loginModal) closeModal(loginModal);
        if (event.target == registerModal) closeModal(registerModal);
        if (event.target == profileModal) closeModal(profileModal);
    }

    // Switcher entre connexion et inscription
    switchToRegister.onclick = () => {
        closeModal(loginModal);
        openModal(registerModal);
    }

    switchToLogin.onclick = () => {
        closeModal(registerModal);
        openModal(loginModal);
    }

    // Vérifier si l'utilisateur est connecté au chargement
    function checkAuthStatus() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            showUserSection(user);
        }
    }

    // Afficher la section utilisateur
    function showUserSection(user) {
        loginBtn.style.display = 'none';
        userSection.style.display = 'flex';
        
        // Vérifier si c'est un admin
        const isAdmin = user.email === 'admin@test.com';
        
        // Gérer l'affichage des sections
        const adminBadge = document.getElementById('adminBadge');
        const adminCredentials = document.getElementById('adminCredentials');
        const personalInfoSection = document.getElementById('personalInfoSection');
        
        if (isAdmin) {
            // Afficher les éléments admin et cacher les infos personnelles
            if (adminBadge) adminBadge.style.display = 'block';
            if (adminCredentials) adminCredentials.style.display = 'block';
            if (personalInfoSection) personalInfoSection.style.display = 'none';
            
            // Ajouter le badge admin dans la navbar
            const userPoints = document.getElementById('userPoints');
            if (userPoints) {
                userPoints.innerHTML = `Mon Compte <span class="admin-badge">ADMIN</span>`;
            }
        } else {
            // Afficher les infos personnelles pour les utilisateurs normaux
            if (adminBadge) adminBadge.style.display = 'none';
            if (adminCredentials) adminCredentials.style.display = 'none';
            if (personalInfoSection) personalInfoSection.style.display = 'block';
        }
        
        // Mettre à jour les points
        const profilePoints = document.getElementById('profilePoints');
        if (profilePoints) profilePoints.textContent = user.points || 0;
    }

    // Gérer la déconnexion
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        loginBtn.style.display = 'block';
        userSection.style.display = 'none';
    });

    // Création du compte admin s'il n'existe pas
    if (!localStorage.getItem('adminAccount')) {
        const adminUser = {
            email: 'admin@test.com',
            password: 'admin123',
            points: 1000,
            isAdmin: true
        };
        localStorage.setItem('adminAccount', JSON.stringify(adminUser));
    }

    // Gestion du formulaire de connexion
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Vérifier si c'est l'admin
        if (email === 'admin@test.com' && password === 'admin123') {
            const adminUser = {
                email: email,
                password: password,
                points: 1000,
                isAdmin: true
            };
            localStorage.setItem('user', JSON.stringify(adminUser));
            showUserSection(adminUser);
            closeModal(loginModal);
            return;
        }
        
        // Vérification utilisateur normal
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            showUserSection(storedUser);
            closeModal(loginModal);
        } else {
            alert('Email ou mot de passe incorrect');
        }
    });

    // Gestion du formulaire d'inscription
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        
        const user = {
            email: email,
            password: password, // Note: En production, ne jamais stocker les mots de passe en clair
            points: 0
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        showUserSection(user);
        closeModal(registerModal);
    });

    // Vérifier le statut d'authentification au chargement
    checkAuthStatus();
});