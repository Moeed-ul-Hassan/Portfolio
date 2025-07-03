/**
 * Main JavaScript file for portfolio website
 * Handles navigation, interactions, and general functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeProgressBars();
    initializeProjectModals();
    initializeMobileNavigation();
    initializeScrollEffects();
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = getCurrentPage();
    
    // Set active navigation link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * Get current page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

/**
 * Initialize animations and effects
 */
function initializeAnimations() {
    // Initialize typing animations if on index page
    if (getCurrentPage() === 'index.html' || getCurrentPage() === '') {
        initializeTypingAnimations();
    }
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize glitch effects for abandoned projects
    initializeGlitchEffects();
}

/**
 * Initialize typing animations for hero section
 */
function initializeTypingAnimations() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach((element, index) => {
        const text = element.getAttribute('data-text');
        const delay = parseInt(element.getAttribute('data-delay')) || 0;
        
        // Skip if already processed
        if (element.dataset.processed === 'true') {
            return;
        }
        element.dataset.processed = 'true';
        
        setTimeout(() => {
            typeText(element, text);
        }, delay);
    });
}

/**
 * Type text animation
 */
function typeText(element, text) {
    // Clear any existing content and animations
    element.innerHTML = '';
    element.textContent = '';
    element.style.borderRight = '2px solid var(--accent-cyan)';
    
    // Prevent multiple typing animations on the same element
    if (element.dataset.typing === 'true') {
        return;
    }
    element.dataset.typing = 'true';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            element.dataset.typing = 'false';
            // Keep cursor blinking for a while, then remove it
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 3000);
        }
    }, 50);
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                entry.target.style.animationDelay = '0.1s';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.project-card, .skill-item, .value-card, .timeline-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize glitch effects for abandoned projects
 */
function initializeGlitchEffects() {
    const abandonedCards = document.querySelectorAll('.project-card.abandoned');
    
    abandonedCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

/**
 * Initialize progress bars animation
 */
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 500);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * Initialize form handling
 */
function initializeFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add input animations
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.querySelector('.prompt').style.color = 'var(--accent-cyan)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.querySelector('.prompt').style.color = 'var(--text-secondary)';
            });
        });
    }
}

/**
 * Handle form submission
 */
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showTransmissionSuccess();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        e.target.reset();
    }, 2000);
}

/**
 * Validate form data
 */
function validateForm(data) {
    const required = ['name', 'email', 'message'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    return true;
}

/**
 * Show transmission success
 */
function showTransmissionSuccess() {
    const statusElement = document.getElementById('transmission-status');
    if (statusElement) {
        statusElement.classList.remove('hidden');
        
        // Hide after 5 seconds
        setTimeout(() => {
            statusElement.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--terminal-bg);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border: 1px solid var(--${type === 'error' ? 'error-red' : 'accent-cyan'});
        border-radius: 6px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Initialize project modals
 */
function initializeProjectModals() {
    const detailsButtons = document.querySelectorAll('.details-btn');
    const modal = document.getElementById('project-modal');
    
    if (!modal) return;
    
    const modalClose = modal.querySelector('.modal-close');
    const modalContent = modal.querySelector('#modal-content');
    const modalTitle = modal.querySelector('#modal-title');
    
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectCard = this.closest('.project-card');
            const projectData = getProjectData(projectCard);
            
            modalTitle.textContent = projectData.name;
            modalContent.innerHTML = generateModalContent(projectData);
            modal.style.display = 'block';
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * Get project data from card
 */
function getProjectData(card) {
    const projectId = card.getAttribute('data-project');
    const name = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
    
    // Mock detailed project data
    const projectDetails = {
        'mail-hawk': {
            fullDescription: 'Mail Hawk is a comprehensive email management system designed to help users organize, filter, and manage their email communications efficiently. The application features advanced filtering capabilities, automatic categorization, and a clean, intuitive interface.',
            features: ['Advanced email filtering', 'Automatic categorization', 'Search functionality', 'Export capabilities', 'User-friendly interface'],
            challenges: ['Implementing efficient email parsing', 'Creating flexible filtering system', 'Optimizing database queries'],
            learnings: ['Email protocol handling', 'Database optimization', 'User interface design']
        },
        'food-rescue': {
            fullDescription: 'Food Rescue Network is a social impact application that connects food donors (restaurants, grocery stores, individuals) with recipients (food banks, shelters, individuals in need) to reduce food waste and help fight hunger in local communities.',
            features: ['Donor registration system', 'Real-time food listing', 'Location-based matching', 'Donation tracking', 'Impact analytics'],
            challenges: ['Coordinating real-time logistics', 'Ensuring food safety compliance', 'Building trust between users'],
            learnings: ['Social impact design', 'Real-time data handling', 'Community building features']
        },
        'addictions-blocker': {
            fullDescription: 'Addictions Blocker is a productivity tool designed to help users overcome digital addictions and distractions by blocking access to time-wasting websites and applications during focused work sessions.',
            features: ['Website/app blocking', 'Custom block lists', 'Scheduled sessions', 'Progress tracking', 'Motivational messages'],
            challenges: ['System-level integration', 'Bypass prevention', 'User motivation maintenance'],
            learnings: ['System programming', 'User behavior psychology', 'Motivation design patterns']
        }
    };
    
    return {
        name,
        description,
        technologies: techTags,
        details: projectDetails[projectId] || {
            fullDescription: description,
            features: ['Feature details not available'],
            challenges: ['Challenge details not available'],
            learnings: ['Learning details not available']
        }
    };
}

/**
 * Generate modal content
 */
function generateModalContent(project) {
    return `
        <div class="modal-project-details">
            <div class="project-description">
                <h3><i class="fas fa-info-circle"></i> Project Overview</h3>
                <p>${project.details.fullDescription}</p>
            </div>
            
            <div class="project-features">
                <h3><i class="fas fa-star"></i> Key Features</h3>
                <ul>
                    ${project.details.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-technologies">
                <h3><i class="fas fa-tools"></i> Technologies Used</h3>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="project-challenges">
                <h3><i class="fas fa-mountain"></i> Challenges Overcome</h3>
                <ul>
                    ${project.details.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-learnings">
                <h3><i class="fas fa-graduation-cap"></i> Key Learnings</h3>
                <ul>
                    ${project.details.learnings.map(learning => `<li>${learning}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <style>
            .modal-project-details h3 {
                color: var(--accent-blue);
                margin: 1.5rem 0 1rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.1rem;
            }
            
            .modal-project-details ul {
                list-style: none;
                padding-left: 1rem;
            }
            
            .modal-project-details li {
                margin-bottom: 0.5rem;
                color: var(--text-secondary);
                position: relative;
            }
            
            .modal-project-details li::before {
                content: '▸';
                color: var(--accent-cyan);
                position: absolute;
                left: -1rem;
            }
            
            .project-description p {
                line-height: 1.7;
                color: var(--text-primary);
                margin-bottom: 1rem;
            }
            
            .project-technologies .tech-stack {
                margin-top: 1rem;
            }
        </style>
    `;
}

/**
 * Initialize mobile navigation
 */
function initializeMobileNavigation() {
    // Create mobile nav toggle if it doesn't exist
    if (!document.querySelector('.mobile-nav-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-nav-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // Close sidebar when clicking on nav links on mobile
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                const toggleBtn = document.querySelector('.mobile-nav-toggle');
                
                sidebar.classList.remove('active');
                toggleBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    });
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Navbar background on scroll
    const sidebar = document.querySelector('.sidebar');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            sidebar.style.background = 'rgba(10, 10, 10, 0.95)';
            sidebar.style.backdropFilter = 'blur(10px)';
        } else {
            sidebar.style.background = '';
            sidebar.style.backdropFilter = '';
        }
    });
}

/**
 * Add CSS animations dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);

// Console easter egg
console.log(`
██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ 
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
███████║███████║██║     █████╔╝ █████╗  ██████╔╝
██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

Welcome to Moeed's Portfolio Terminal!
Type: help() for available commands
`);

// Console commands
window.help = function() {
    console.log(`
Available commands:
- about()      : Show developer info
- skills()     : List technical skills  
- projects()   : Show project list
- contact()    : Get contact information
- matrix()     : Toggle matrix effect
    `);
};

window.about = function() {
    console.log(`
Developer: Moeed ul Hassan
Location: Gujrat, Pakistan
Experience: 1+ year freelancing
Status: Available for hire
Mission: Building meaningful applications
    `);
};

window.skills = function() {
    console.log(`
Technical Skills:
▪ Python      → ★★★★☆
▪ FastAPI     → ★★★★☆  
▪ JavaScript  → ★★★☆☆
▪ React       → ★★☆☆☆ (Learning)
▪ Supabase    → ★★★☆☆
▪ Git         → ★★★☆☆
▪ Tailwind    → ★★★☆☆
    `);
};

window.projects = function() {
    console.log(`
Completed Projects:
• Mail Hawk - Email Management System
• Food Rescue Network - Social Impact App
• Addictions Blocker - Productivity Tool

Archived Projects:
• Task Buddy - AI Task Management
• Freelance Shield - Freelancer Protection
• Talking Mask - Voice Communication Device
• PriceGenie - AI Price Comparison
    `);
};

window.contact = function() {
    console.log(`
Contact Information:
Email: moeed@portfolio.dev
LinkedIn: linkedin.com/in/moeedhassan
GitHub: github.com/moeedhassan
Location: Gujrat, Pakistan
Status: Available for opportunities
    `);
};

window.matrix = function() {
    const canvas = document.getElementById('matrix-canvas');
    canvas.style.opacity = canvas.style.opacity === '0.3' ? '0.1' : '0.3';
    console.log('Matrix effect toggled!');
};
