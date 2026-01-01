document.addEventListener('DOMContentLoaded', () => {
    // --- Matrix Background ---
    const initMatrix = () => {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\[]{}!@#$%^&*()';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                const opacity = Math.random() * 0.5 + 0.3;
                ctx.fillStyle = `hsla(140, 100%, 45%, ${opacity})`;
                ctx.fillText(char, x, y);

                if (Math.random() > 0.98) {
                    ctx.fillStyle = 'hsl(140, 100%, 70%)';
                    ctx.fillText(char, x, y);
                }

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 50);
    };
    initMatrix();

    // --- Navigation ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuIcon.classList.toggle('hidden', isOpen);
        closeIcon.classList.toggle('hidden', !isOpen);
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // --- Terminal Logic ---
    const terminalBody = document.getElementById('terminal-body');
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');

    let isTyping = false;

    // --- Snake Game Engine ---
    let snakeGameInterval;
    let snakeCanvas, snakeCtx;
    let snake, food, direction, score, gameOver;
    const gridSize = 20;
    const tileCount = 20; // 400x400 canvas, 20x20 grid

    const initSnakeGame = () => {
        snakeCanvas = document.createElement('canvas');
        snakeCanvas.id = 'snake-canvas';
        snakeCanvas.width = gridSize * tileCount;
        snakeCanvas.height = gridSize * tileCount;
        snakeCanvas.style.border = '2px solid #0f0';
        snakeCanvas.style.backgroundColor = '#000';
        snakeCanvas.style.display = 'block';
        snakeCanvas.style.margin = '10px auto';
        terminalBody.insertBefore(snakeCanvas, terminalForm);
        snakeCtx = snakeCanvas.getContext('2d');

        resetGame();
        if (snakeGameInterval) clearInterval(snakeGameInterval);
        snakeGameInterval = setInterval(gameLoop, 100); // Game speed

        document.addEventListener('keydown', handleSnakeInput);
    };

    const resetGame = () => {
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        direction = { x: 0, y: 0 }; // Initial state: not moving
        score = 0;
        gameOver = false;
        addLine('Snake game started! Score: 0', 'output');
    };

    const generateFood = () => {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            let collisionWithSnake = false;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
                    collisionWithSnake = true;
                    break;
                }
            }
            if (!collisionWithSnake) {
                return newFood;
            }
        }
    };

    const handleSnakeInput = (e) => {
        if (gameOver && e.key === 'r') {
            resetGame();
            return;
        }
        if (e.key === 'q' || e.key === 'Q') {
            quitSnakeGame();
            return;
        }

        const newDirection = { x: direction.x, y: direction.y };
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 1) return; // Prevent 180 degree turn
                newDirection.x = 0; newDirection.y = -1;
                break;
            case 'ArrowDown':
                if (direction.y === -1) return;
                newDirection.x = 0; newDirection.y = 1;
                break;
            case 'ArrowLeft':
                if (direction.x === 1) return;
                newDirection.x = -1; newDirection.y = 0;
                break;
            case 'ArrowRight':
                if (direction.x === -1) return;
                newDirection.x = 1; newDirection.y = 0;
                break;
            default:
                return;
        }
        // Only update direction if it's a valid change and not a 180-degree turn
        if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
            direction = newDirection;
        }
    };

    const gameLoop = () => {
        if (gameOver) {
            clearInterval(snakeGameInterval);
            return;
        }
        update();
        drawSnakeGame();
    };

    const update = () => {
        if (direction.x === 0 && direction.y === 0) return; // Don't move if no direction set

        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Check for wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            endGame();
            return;
        }

        // Check for self-collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame();
                return;
            }
        }

        snake.unshift(head); // Add new head

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = generateFood();
            addLine(`Score: ${score}`, 'output');
        } else {
            snake.pop(); // Remove tail if no food eaten
        }
    };

    const drawSnakeGame = () => {
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        // Draw snake
        for (let i = 0; i < snake.length; i++) {
            snakeCtx.fillStyle = i === 0 ? '#0f0' : '#0a0'; // Head is brighter green
            snakeCtx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
        }

        // Draw food
        snakeCtx.fillStyle = '#f00';
        snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

        if (gameOver) {
            snakeCtx.fillStyle = 'white';
            snakeCtx.font = '30px monospace';
            snakeCtx.textAlign = 'center';
            snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, snakeCanvas.height / 2 - 20);
            snakeCtx.font = '15px monospace';
            snakeCtx.fillText('Press R to Restart or Q to Quit', snakeCanvas.width / 2, snakeCanvas.height / 2 + 10);
        }
    };

    const endGame = () => {
        gameOver = true;
        clearInterval(snakeGameInterval);
        addLine(`Game Over! Final Score: ${score}. Press 'R' to restart or 'Q' to quit.`, 'error');
        drawSnakeGame(); // Redraw to show game over message
    };

    const quitSnakeGame = () => {
        if (snakeGameInterval) clearInterval(snakeGameInterval);
        document.removeEventListener('keydown', handleSnakeInput);
        if (snakeCanvas && snakeCanvas.parentNode) {
            snakeCanvas.parentNode.removeChild(snakeCanvas);
        }
        addLine('Snake game terminated. Thanks for playing!', 'output');
        gameOver = true; // Ensure game state is reset
    };

    const commands = {
        help: () => `
Available commands:
  help           - Show this help message
  whoami         - Display developer info
  skills         - List technical skills
  projects       - Show project portfolio
  education      - Display education & certifications
  contact        - Get contact information
  sudo hire-me   - Try to hire the developer ;)
  cat resume.txt - View resume summary
  clear          - Clear terminal
  date           - Show current date/time
  ls             - List available sections
  pwd            - Print current directory
  games          - Launch mini-arcade (Snake)
  cv             - Download Oussama's CV (PDF)
`.trim(),

        whoami: () => `
+-------------------------------------------+
|             DEVELOPER PROFILE             |
+-------------------------------------------+
| Name:      Oussama Zahid                  |
| Role:      Full-Stack Dev | Analyste      |
| Location:  Fquih Ben Salah                |
| Status:    Open to opportunities          |
+-------------------------------------------+
`.trim(),

        skills: () => {
            setTimeout(() => {
                document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return `[TECHNICAL SKILLS LOADED]\n\nFrontend:  React, TypeScript, Tailwind CSS, Next.js\nBackend:   Node.js, Python, Express, PostgreSQL\nSecurity:  Penetration Testing, Network Security\nDevOps:    Docker, Linux, CI/CD, AWS\nTools:     Git, Burp Suite, Wireshark, Nmap\n\n→ Scrolling to Skills section...`;
        },

        projects: () => {
            setTimeout(() => {
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return `[PROJECTS DATABASE ACCESSED]\n\n1. SecureAuth Platform\n2. Network Monitor Dashboard\n3. Vulnerability Scanner\n4. Encrypted Chat App\n\n→ Scrolling to Projects section...`;
        },

        education: () => `
[EDUCATION & CERTIFICATIONS]

🎓 Cybersecurity Program
   ├── Core Fundamentals Track
   │   ├── Network Protocols & Security
   │   ├── Linux System Administration
   │   └── Programming Fundamentals
   │
   └── Specialization Track
       ├── Ethical Hacking & Pen Testing
       ├── Malware Analysis
       └── Incident Response

📜 Certifications: [Add your certs here]
`.trim(),

        contact: () => {
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return `[CONTACT INFORMATION]\n\n📧 Email:    oussamazahis3@gmail.com\n💼 LinkedIn: linkedin.com/in/oussamazahid\n🐙 GitHub:   github.com/oussamazahid\n\n→ Scrolling to Contact section...`;
        },

        'sudo hire-me': () => [
            '[sudo] password for developer: ********',
            'Verifying credentials...',
            `
╔══════════════════════════════════════╗
║                                      ║
║   🎉 CONGRATULATIONS! 🎉             ║
║                                      ║
║   ACCESS GRANTED                     ║
║   HIRING PROTOCOL INITIATED          ║
║                                      ║
║   Let's build something amazing!     ║
║                                      ║
╚══════════════════════════════════════╝
            `.trim()
        ],

        'cat resume.txt': () => `
╔═══════════════════════════════════════════╗
║            RESUME.TXT                     ║
╠═══════════════════════════════════════════╣
║                                           ║
║  FULL-STACK WEB & SECURITY DEVELOPER      ║
║                                           ║
║  Passionate about building secure,        ║
║  scalable web applications and            ║
║  protecting digital assets.               ║
║                                           ║
║  EXPERIENCE:                              ║
║  • Web Development: X years               ║
║  • Cybersecurity: X years                 ║
║                                           ║
║  PHILOSOPHY:                              ║
║  "Security is not a product,              ║
║   but a process." - Bruce Schneier        ║
║                                           ║
╚═══════════════════════════════════════════╝
`.trim(),

        clear: () => {
            const lines = terminalBody.querySelectorAll('.output-line, .input-line-copy');
            lines.forEach(line => line.remove());
            return '';
        },

        date: () => new Date().toString(),
        ls: () => 'home  about  skills  projects  contact',
        pwd: () => '/home/developer/portfolio',
        games: () => {
            initSnakeGame();
            return '[LAUNCHING ARCADE PROTOCOL]... Initializing Snake engine. Use ARROW KEYS to move. Press Q to quit.';
        },
        cv: () => {
            const link = document.createElement('a');
            link.href = 'cv final.pdf';
            link.download = 'Oussama_Zahid_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return ''; // Keeping it silent as requested
        }
    };

    const addLine = (content, type = 'output') => {
        const line = document.createElement('div');
        line.className = 'output-line';
        if (type === 'input') line.classList.add('text-accent');
        if (type === 'error') line.classList.add('text-destructive');
        line.textContent = content;
        terminalBody.insertBefore(line, terminalForm);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const typeLines = async (lines) => {
        isTyping = true;
        terminalInput.disabled = true;
        for (const line of lines) {
            await new Promise(r => setTimeout(r, 150));
            addLine(line);
        }
        isTyping = false;
        terminalInput.disabled = false;
        terminalInput.focus();
    };

    terminalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = terminalInput.value.trim();
        const cmdKey = input.toLowerCase();

        if (!input || isTyping) return;

        // Add input to history
        const historyLine = document.createElement('div');
        historyLine.className = 'output-line';
        historyLine.innerHTML = `<span class="prompt">$</span> <span class="text-accent">${input}</span>`;
        terminalBody.insertBefore(historyLine, terminalForm);

        terminalInput.value = '';

        if (commands[cmdKey]) {
            const result = commands[cmdKey]();
            if (Array.isArray(result)) {
                await typeLines(result);
            } else if (result) {
                addLine(result);
            }
        } else {
            addLine(`Command not found: ${input}. Type "help" for available commands.`, 'error');
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    });

    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    // --- Skills Tab Switching ---
    const skillsTabBtn = document.getElementById('skills-tab-btn');
    const curriculumTabBtn = document.getElementById('curriculum-tab-btn');
    const skillsContent = document.getElementById('skills-content');
    const curriculumContent = document.getElementById('curriculum-content');

    skillsTabBtn.addEventListener('click', () => {
        skillsTabBtn.classList.add('active');
        curriculumTabBtn.classList.remove('active');
        skillsContent.classList.add('active');
        curriculumContent.classList.remove('active');
    });

    curriculumTabBtn.addEventListener('click', () => {
        curriculumTabBtn.classList.add('active');
        skillsTabBtn.classList.remove('active');
        curriculumContent.classList.add('active');
        skillsContent.classList.remove('active');
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    const btnText = contactForm.querySelector('.btn-text');
    const btnLoader = contactForm.querySelector('.btn-loader');
    const toast = document.getElementById('toast');

    const showToast = (title, desc) => {
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-desc').textContent = desc;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 5000);
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) return;

        // Simulate submission
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        contactForm.querySelector('button').disabled = true;

        await new Promise(r => setTimeout(r, 1500));

        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        contactForm.querySelector('button').disabled = false;
        contactForm.reset();

        showToast('Message Sent!', "Thank you for reaching out. I'll get back to you soon.");
    });

    // --- Footer Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Matrix Rain Effect ---
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;

        function resizeCanvas() {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        }
        resizeCanvas();

        const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*';
        const fontSize = 14;
        let columns = window.innerWidth / fontSize;
        let drops = [];

        function initDrops() {
            columns = Math.ceil(window.innerWidth / fontSize);
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = Math.random() * -100; // Randomize start to prevent "curtain" effect
            }
        }
        initDrops();

        function drawMatrix() {
            ctx.fillStyle = 'rgba(1, 4, 9, 0.1)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));

                const colorSeed = Math.random();
                const opacity = Math.random() * 0.6 + 0.4;

                if (colorSeed > 0.98) ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                else if (colorSeed > 0.8) ctx.fillStyle = `rgba(14, 165, 233, ${opacity})`;
                else ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.98) {
                    drops[i] = 0;
                }
                drops[i] += 1;
            }
        }

        let matrixInterval = setInterval(drawMatrix, 35);

        window.addEventListener('resize', () => {
            resizeCanvas();
            initDrops();
        });
    }
});
