/**
 * Portfolio Scripts - Main Application Logic
 */

/* =========================================
   UTILITY FUNCTIONS
   ========================================= */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px;
        background: ${type === 'success' ? '#0a0a0c' : '#ff4444'};
        color: white; padding: 15px 25px; border-radius: 4px;
        border-left: 4px solid ${type === 'success' ? '#00f3ff' : '#ff0000'};
        box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
        z-index: 9999; transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => { notification.remove(); }, 300);
    }, 3000);
}

/* =========================================
   TERMINAL UTILITIES
   ========================================= */
function addTerminalLine(text, delay = 0) {
    const terminalBody = document.getElementById('terminal-body');
    const inputLine = document.querySelector('.terminal-input-line');

    if (!terminalBody || !inputLine) return;

    const addLine = () => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        terminalBody.insertBefore(line, inputLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    if (delay > 0) {
        setTimeout(addLine, delay);
    } else {
        addLine();
    }
}

function executeCommand(command) {
    const inputLine = document.querySelector('.terminal-input-line');
    const terminalBody = document.getElementById('terminal-body');

    if (!inputLine || !terminalBody) return;

    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="prompt">$</span> ${command}`;
    terminalBody.insertBefore(commandLine, inputLine);

    const lowerCmd = command.toLowerCase().trim();
    let response = '';
    let scrollTarget = null;

    switch (lowerCmd) {
        case 'help':
            response = 'Available commands: help, about, skills, projects, contact, clear, whoami, date, sudo, matrix';
            break;
        case 'about':
            response = 'Opening about section...';
            scrollTarget = 'about';
            break;
        case 'skills':
            response = 'Displaying skills...';
            scrollTarget = 'skills';
            break;
        case 'projects':
            response = 'Loading projects...';
            scrollTarget = 'projects';
            break;
        case 'contact':
            response = 'Opening contact form...';
            scrollTarget = 'contact';
            break;
        case 'clear':
            const lines = terminalBody.querySelectorAll('.terminal-line');
            lines.forEach(line => {
                if (!line.parentElement.classList.contains('terminal-input-line')) {
                    line.remove();
                }
            });
            return;
        case 'whoami':
            response = 'oussama@portfolio (Oussama Zahid - Cybersecurity Analyst & Full-Stack Developer)';
            break;
        case 'date':
            response = new Date().toLocaleString();
            break;
        case 'sudo':
            response = 'Nice try! Permission denied.';
            break;
        case 'matrix':
            response = 'Matrix digital rain already active.';
            break;
        default:
            response = `Command not found: ${command}. Type "help" for available commands.`;
    }

    if (response) addTerminalLine(response);

    if (scrollTarget) {
        setTimeout(() => {
            const section = document.getElementById(scrollTarget);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

/* =========================================
   COMPONENTS INITIALIZATION
   ========================================= */
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"#&_(),.;:?!|{}<>';
        this.drops = [];
        this.dropSettings = {
            fontSize: 14, columnWidth: 20, minSpeed: 1, maxSpeed: 3,
            minLength: 8, maxLength: 20, intensity: 0.15
        };
        this.init();
    }
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createDrops();
        this.draw();
    }
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.font = `${this.dropSettings.fontSize}px 'Courier New', monospace`;
        this.ctx.textBaseline = 'top';
    }
    setupEventListeners() {
        window.addEventListener('resize', debounce(() => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createDrops();
        }, 250));
    }
    createDrops() {
        const columns = Math.floor(this.canvas.width / this.dropSettings.columnWidth);
        this.drops = [];
        for (let i = 0; i < columns; i++) {
            this.drops[i] = {
                x: i * this.dropSettings.columnWidth,
                y: Math.random() * -500,
                speed: this.dropSettings.minSpeed + Math.random() * (this.dropSettings.maxSpeed - this.dropSettings.minSpeed),
                length: Math.floor(this.dropSettings.minLength + Math.random() * (this.dropSettings.maxLength - this.dropSettings.minLength)),
                chars: [], updateCounter: 0
            };
            this.generateDropChars(this.drops[i]);
        }
    }
    generateDropChars(drop) {
        drop.chars = [];
        for (let i = 0; i < drop.length; i++) {
            drop.chars.push({
                char: this.characters[Math.floor(Math.random() * this.characters.length)],
                opacity: (drop.length - i) / drop.length,
                isCyan: Math.random() > 0.8
            });
        }
    }
    draw() {
        this.ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            drop.updateCounter++;
            if (drop.updateCounter >= 2) {
                drop.y += drop.speed;
                drop.updateCounter = 0;
            }
            for (let j = 0; j < drop.chars.length; j++) {
                const charObj = drop.chars[j];
                const yPos = drop.y - (j * this.dropSettings.fontSize);
                if (yPos > this.canvas.height) continue;
                this.ctx.fillStyle = j === 0 ? (charObj.isCyan ? 'rgba(0, 243, 255, 0.9)' : 'rgba(10, 255, 0, 0.9)') :
                    (charObj.isCyan ? `rgba(0, 243, 255, ${charObj.opacity * 0.7})` : `rgba(10, 255, 0, ${charObj.opacity * 0.7})`);
                this.ctx.fillText(charObj.char, drop.x, yPos);
            }
            if (drop.y - (drop.length * this.dropSettings.fontSize) > this.canvas.height) {
                drop.y = -drop.length * this.dropSettings.fontSize;
                this.generateDropChars(drop);
            }
        }
        requestAnimationFrame(() => this.draw());
    }
}

function initTerminal() {
    const terminalBody = document.getElementById('terminal-body');
    const inputField = document.getElementById('terminal-input');
    if (!terminalBody || !inputField) return;

    let history = [];
    let historyIndex = -1;
    inputField.focus();

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value.trim();
            if (command) {
                history.push(command);
                historyIndex = history.length;
                executeCommand(command);
                inputField.value = '';
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                inputField.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                inputField.value = '';
            }
        }
    });

    document.querySelector('.terminal-container')?.addEventListener('click', () => inputField.focus());
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, href);
            }
        });
    });
    window.addEventListener('scroll', debounce(updateActiveNav, 100));
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
}

function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.skills-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) setTimeout(() => content.classList.add('active'), 50);
            });
        });
    });
}

function initFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        if (!formData.name || !formData.email || !formData.message) {
            addTerminalLine('Error: All fields are required.');
            return;
        }

        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
        submitBtn.disabled = true;

        setTimeout(() => {
            addTerminalLine('✓ Message prepared. Opening email client...');
            addTerminalLine('Note: For production, connect to Formspree or similar service.');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification('Message ready to send!', 'success');
        }, 1500);
    });
}

function initScrollAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-bar').forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => bar.style.width = width, 100);
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skills-content').forEach(section => observer.observe(section));
}

/* =========================================
   BOOTSTRAP
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    new MatrixBackground();
    initTerminal();
    initMobileMenu();
    initSmoothScroll();
    initTabSwitching();
    initFormSubmission();
    initScrollAnimations();
});
