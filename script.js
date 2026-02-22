// Preloader Logic
let progress = 0;
let currentTextIndex = 0;
const loadingTexts = [
    "Initializing Go environment...",
    "Importing packages...",
    "Building concurrent systems...",
    "Optimizing goroutines...",
    "Almost ready to go!"
];

// Update progress bar
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progress < 100) {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        if (progressBar && progressText) {
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
        }
    }

    if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(hidePreloader, 500);
    }
}

// Cycle through loading texts
function cycleLoadingText() {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.textContent = loadingTexts[currentTextIndex];
        currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
    }
}

// Hide preloader
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
}

// Start preloader animations
const progressInterval = setInterval(updateProgress, 300);
const textInterval = setInterval(cycleLoadingText, 1200);

// Ensure minimum display time and complete loading
window.addEventListener('load', () => {
    setTimeout(() => {
        progress = 100;
        updateProgress();
    }, 1000);
});

// If page loads too quickly, ensure minimum display time
setTimeout(() => {
    if (progress < 100) {
        progress = 100;
        updateProgress();
    }
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('section, .skill-card, .project-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Form Submission Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#27C93F';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
