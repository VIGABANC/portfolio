document.addEventListener('DOMContentLoaded', async () => {
    // --- Global Data State ---
    let portfolioData = {};

    // --- Fetch Data ---
    try {
        const response = await fetch('assets/data/profile.json');
        portfolioData = await response.json();
        renderContent(portfolioData);
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
        // Fallback or error handling
    }

    // --- Rendering Logic ---
    function renderContent(data) {
        // Site Metadata
        if (data.site) {
            document.title = data.site.title;
            const footerYear = document.getElementById('year');
            if (footerYear) footerYear.textContent = data.site.copyright_year || new Date().getFullYear();
            const footerSub = document.querySelector('.footer-sub');
            if (footerSub) footerSub.innerHTML = data.site.footer_text || 'Built with HTML5 + CSS3 + JavaScript';
        }

        // Hero
        if (data.profile) {
            const nameEl = document.querySelector('.glitch');
            if (nameEl) {
                nameEl.textContent = data.profile.name;
                nameEl.setAttribute('data-text', data.profile.name);
            }

            const roleEl = document.getElementById('role-text');
            if (roleEl) {
                roleEl.innerHTML = `${data.profile.role_line1} ${data.profile.role_main} ${data.profile.role_line1_end}`;
            }

            const descEl = document.getElementById('hero-desc');
            if (descEl) {
                descEl.innerHTML = `
                    ${data.profile.description_prefix} 
                    <span class="text-accent">${data.profile.description_highlight}</span> 
                    ${data.profile.description_suffix}<br>
                    <span class="text-primary animate-text-glow">${data.profile.description_highlight2}</span>
                `;
            }

            const profileImg = document.getElementById('profile-img');
            if (profileImg) profileImg.src = data.profile.avatar;
        }

        // About Text
        if (data.profile && data.profile.about) {
            const aboutContainer = document.getElementById('about-text-container');
            const about = data.profile.about;
            aboutContainer.innerHTML = `
                <h3>Professional Summary</h3>
                <p>${about.summary_intro} <span class="text-primary">${about.summary_highlight1}</span> ${about.summary_text1} <span class="text-accent">${about.summary_highlight2}</span> ${about.summary_text2}</p>
                <p>${about.methodology}</p>
            `;
        }

        // About Highlights
        if (data.about_highlights) {
            const highlightGrid = document.getElementById('about-highlights');
            highlightGrid.innerHTML = data.about_highlights.map(item => `
                <div class="cyber-card">
                    <div class="highlight-image">
                        <img src="${item.image}" alt="${item.title}" class="project-img">
                    </div>
                    <div class="highlight-info">
                        <span class="highlight-caption">${item.title}</span>
                        ${item.description ? `<p class="highlight-desc">${item.description}</p>` : ''}
                    </div>
                </div>
            `).join('');
        }

        // Skills
        if (data.skills) {
            const skillsGrid = document.getElementById('skills-grid-container');
            skillsGrid.innerHTML = data.skills.map(skill => `
                <div class="cyber-card skill-item" style="--level: ${skill.level}%;">
                    <div class="skill-info">
                        <i class="${skill.icon} icon-text text-primary"></i>
                        <span>${skill.name}</span>
                    </div>
                    <div class="skill-bar">
                        <div class="bar-fill"></div>
                    </div>
                    <div class="skill-footer">
                        <span class="category">${skill.category}</span>
                        <span class="percent">${skill.level}%</span>
                    </div>
                </div>
            `).join('');
        }

        // Education
        if (data.education) {
            const educationGrid = document.getElementById('education-grid-container');
            educationGrid.className = 'education-timeline';
            educationGrid.innerHTML = data.education.map(edu => `
                <div class="timeline-item">
                    <div class="timeline-label">${edu.period}</div>
                    <div class="timeline-marker">
                        <div class="timeline-dot ${edu.current ? 'active' : ''}"></div>
                    </div>
                    <div class="timeline-content terminal-box">
                        <h3 class="text-primary">${edu.degree}</h3>
                        <div class="institution text-accent">
                            ${edu.institution}
                        </div>
                        <p>${edu.description}</p>
                    </div>
                </div>
            `).join('');
        }

        // Projects
        if (data.projects) {
            const projectsGrid = document.getElementById('projects-grid-container');
            projectsGrid.innerHTML = data.projects.map(project => `
                <div class="cyber-card project-card">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" class="project-img">
                        <div class="glitch-overlay"></div>
                        <div class="scanlines"></div>
                    </div>
                    <div class="project-content">
                        <h3>${project.title} <span class="title-line"></span></h3>
                        <p>${project.description}</p>
                        <div class="tags">
                            ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                        <div class="project-btns">
                            <a href="${project.links.code}" target="_blank" class="btn btn-outline btn-sm">
                                <i class="fab fa-github"></i> Code
                            </a>
                            <a href="${project.links.demo}" target="_blank" class="btn btn-primary btn-sm">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Contact JSON
        if (data.contact_info) {
            const contactContainer = document.getElementById('contact-json-container');
            const info = data.contact_info;
            contactContainer.innerHTML = `
                <div class="line"><span class="text-primary">{</span></div>
                <div class="line indent"><span class="text-accent">"location"</span>: "${info.location}",</div>
                <div class="line indent"><span class="text-accent">"email"</span>: "${info.email}",</div>
                <div class="line indent"><span class="text-accent">"status"</span>: <span class="text-accent">"${info.status}"</span></div>
                <div class="line"><span class="text-primary">}</span></div>
            `;
        }

        // Social Links
        if (data.profile && data.profile.socials) {
            const socialContainer = document.getElementById('social-links-container');
            socialContainer.innerHTML = data.profile.socials.map(social => `
                <a href="${social.url}" target="_blank"
                    class="cyber-card social-btn ${social.class}" aria-label="${social.name}">
                    <i class="${social.icon}"></i>
                </a>
            `).join('');
        }
    }

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
    const tileCount = 20;

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
        snakeGameInterval = setInterval(gameLoop, 100);

        document.addEventListener('keydown', handleSnakeInput);
    };

    const resetGame = () => {
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        direction = { x: 0, y: 0 };
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
                if (direction.y === 1) return;
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
        if (direction.x === 0 && direction.y === 0) return;

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

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = generateFood();
            addLine(`Score: ${score}`, 'output');
        } else {
            snake.pop();
        }
    };

    const drawSnakeGame = () => {
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        // Draw snake
        for (let i = 0; i < snake.length; i++) {
            snakeCtx.fillStyle = i === 0 ? '#0f0' : '#0a0';
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
        drawSnakeGame();
    };

    const quitSnakeGame = () => {
        if (snakeGameInterval) clearInterval(snakeGameInterval);
        document.removeEventListener('keydown', handleSnakeInput);
        if (snakeCanvas && snakeCanvas.parentNode) {
            snakeCanvas.parentNode.removeChild(snakeCanvas);
        }
        addLine('Snake game terminated. Thanks for playing!', 'output');
        gameOver = true;
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
  cat contact_info.json - View contact details
  clear          - Clear terminal
  date           - Show current date/time
  ls             - List available sections
  pwd            - Print current directory
  cv             - Download CV (PDF)
  games          - Launch mini-arcade (Snake)
`.trim(),

        whoami: () => {
            const p = portfolioData.profile || {};
            const c = portfolioData.contact_info || {};
            return `
+-------------------------------------------+
|             DEVELOPER PROFILE             |
+-------------------------------------------+
| Name:      ${p.name || 'Unknown'}        |
| Role:      ${p.role_main || 'Developer'} |
| Location:  ${c.location || 'Unknown'} |
| Status:    ${c.status || 'N/A'} |
+-------------------------------------------+
`.trim();
        },

        skills: () => {
            setTimeout(() => {
                const skillsSection = document.getElementById('skills');
                if (skillsSection) skillsSection.scrollIntoView({ behavior: 'smooth' });
                const skillsTab = document.getElementById('skills-tab-btn');
                if (skillsTab) skillsTab.click();
            }, 500);
            const skillsList = portfolioData.skills ? portfolioData.skills.map(s => s.name).join(', ') : 'Loading...';
            return `[TECHNICAL SKILLS LOADED]\n\n${skillsList}\n\n→ Scrolling to Skills section...`;
        },

        projects: () => {
            setTimeout(() => {
                const projSection = document.getElementById('projects');
                if (projSection) projSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            const projs = portfolioData.projects ? portfolioData.projects.map((p, i) => `${i + 1}. ${p.title}`).join('\n') : 'Loading...';
            return `[PROJECTS DATABASE ACCESSED]\n\n${projs}\n\n→ Scrolling to Projects section...`;
        },

        education: () => {
            setTimeout(() => {
                const eduSection = document.getElementById('education');
                if (eduSection) eduSection.scrollIntoView({ behavior: 'smooth' });
                // Auto-switch to education tab
                const eduBtn = document.getElementById('education-tab-btn');
                if (eduBtn) eduBtn.click();
            }, 500);

            if (!portfolioData.education) return 'No education data found.';

            const eduList = portfolioData.education.map(e => `
 [${e.period}]
 🎓 ${e.degree}
 🏛️  ${e.institution}
 📝 ${e.description}
 ---------------------------------------------------`).join('\n');

            return `[EDUCATION DATABASE ACCESSED]\n\n${eduList}\n\n→ Scrolling to Education section...`;
        },

        contact: () => {
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            const c = portfolioData.contact_info || {};
            return `[CONTACT INFORMATION]\n\n📧 Email:    ${c.email}\n💼 LinkedIn: ${c.linkedin}\n🐙 GitHub:   ${c.github}\n\n→ Scrolling to Contact section...`;
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

        'cat resume.txt': () => {
            const p = portfolioData.profile || {};
            const about = p.about || {};
            return `
╔═══════════════════════════════════════════╗
║            RESUME.TXT                     ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ${p.name || 'OUSSAMA ZAHID'}              ║
║  ${p.role_main || ''}                     ║
║                                           ║
║  ${about.summary_intro || ''} ${about.summary_highlight1 || ''}   ║
║  ${about.summary_text1 || ''} ${about.summary_highlight2 || ''}   ║
║                                           ║
║  PHILOSOPHY:                              ║
║  "Security is not a product,              ║
║   but a process." - Bruce Schneier        ║
║                                           ║
╚═══════════════════════════════════════════╝
`.trim();
        },

        'cat contact_info.json': () => JSON.stringify(portfolioData.contact_info || {}, null, 2),

        clear: () => {
            // 1. Stop the game
            if (snakeGameInterval) {
                clearInterval(snakeGameInterval);
                snakeGameInterval = null;
            }
            gameOver = true;
            document.removeEventListener('keydown', handleSnakeInput);

            // 2. NUCLEAR OPTION: Clear innerHTML and recreate form
            terminalBody.innerHTML = '';

            // 3. Re-append the form
            terminalBody.appendChild(terminalForm);

            // 4. Reset game internal state
            snake = null;
            food = null;

            return '';
        },
        cclear: () => commands.clear(),

        date: () => new Date().toString(),
        ls: () => 'resume.txt  contact_info.json  home  about  skills  projects  contact',
        pwd: () => '/home/developer/portfolio',
        games: () => {
            quitSnakeGame();
            initSnakeGame();

            return '[LAUNCHING ARCADE PROTOCOL]... Initializing Snake engine. Use ARROW KEYS to move. Press Q to quit.';
        },
        cv: () => {
            // Note: In real scenarios, path should be updated
            // For now, assuming cv is in root or we can point to assets/docs/ if moved
            const link = document.createElement('a');
            link.href = 'cv final.pdf';
            link.download = 'Oussama_Zahid_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return '';
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
    const educationTabBtn = document.getElementById('education-tab-btn');
    const skillsContent = document.getElementById('skills-content');
    const educationContent = document.getElementById('education-content');

    skillsTabBtn.addEventListener('click', () => {
        skillsTabBtn.classList.add('active');
        educationTabBtn.classList.remove('active');
        skillsContent.classList.add('active');
        educationContent.classList.remove('active');
    });

    educationTabBtn.addEventListener('click', () => {
        educationTabBtn.classList.add('active');
        skillsTabBtn.classList.remove('active');
        educationContent.classList.add('active');
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

    // --- Hacker Mode & Simulation ---
    const hackerModeToggle = document.getElementById('hacker-mode-toggle');
    const hackerTerminal = document.getElementById('hacker-terminal');
    const hackerTerminalBody = document.getElementById('hacker-terminal-body');

    hackerModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('hacker-mode-active');
        if (!hackerModeToggle.checked) {
            hackerTerminal.classList.add('hidden');
        }
    });

    const addSimulationLine = (text, color = 'white', delay = 500) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.style.color = color;
                line.innerHTML = text;
                hackerTerminalBody.appendChild(line);
                hackerTerminalBody.scrollTop = hackerTerminalBody.scrollHeight;
                resolve();
            }, delay);
        });
    };

    const runSimulation = async (formData) => {
        hackerTerminal.classList.remove('hidden');
        hackerTerminalBody.innerHTML = '';

        await addSimulationLine('[*] Initiating secure connection...', 'var(--primary)', 800);
        await addSimulationLine('[*] Establishing tunnel via anonymous proxies...', 'white', 1000);

        // Progress bar simulation
        let progress = 0;
        const progressLine = document.createElement('div');
        progressLine.className = 'terminal-line progress-bar';
        hackerTerminalBody.appendChild(progressLine);

        while (progress <= 100) {
            const bars = '#'.repeat(Math.floor(progress / 5));
            const dots = '.'.repeat(20 - Math.floor(progress / 5));
            progressLine.innerHTML = `[*] Encrypting message: [${bars}${dots}] ${progress}%`;
            progress += 10;
            await new Promise(r => setTimeout(r, 200));
        }

        await addSimulationLine('[✓] PGP Encryption successful', '#4ade80', 500);
        await addSimulationLine('[*] Tracing user session IP...', 'white', 800);

        let ip = '127.0.0.1';
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ip = data.ip;
        } catch (e) {
            console.error('IP fetch failed', e);
        }

        await addSimulationLine(`[*] IP Captured: <span style="color:var(--primary)">${ip}</span>`, 'white', 1000);
        await addSimulationLine(`[*] Scanning vulnerabilities on target node...`, 'white', 1200);
        await addSimulationLine(`[!] WARNING: Potential intrusion detected!`, '#ef4444', 500);
        await addSimulationLine(`[*] Bypassing firewall...`, 'white', 1000);
        await addSimulationLine(`[✓] ACCESS GRANTED. System compromised.`, '#4ade80', 1500);
        await addSimulationLine(`[*] Injecting message payload into master database...`, 'white', 1000);
        await addSimulationLine(`[✓] SUCCESS: Message delivered securely!`, '#4ade80', 1000);
        await addSimulationLine(`[!] NOTE: This was a simulation. No real systems were harmed.`, '#eab308', 2000);

        // Save to local storage
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        submissions.push({ ...formData, ip, timestamp: new Date().toISOString() });
        localStorage.setItem('submissions', JSON.stringify(submissions));
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) return;

        const formData = { name, email, message };

        if (hackerModeToggle && hackerModeToggle.checked) {
            // Hacker Simulation Flow
            contactForm.querySelector('button').disabled = true;
            await runSimulation(formData);
            contactForm.querySelector('button').disabled = false;
            contactForm.reset();
        } else {
            // Normal Flow
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            contactForm.querySelector('button').disabled = true;

            await new Promise(r => setTimeout(r, 1500));

            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            contactForm.querySelector('button').disabled = false;
            contactForm.reset();
            showToast('Message Sent!', "Thank you for reaching out. I'll get back to you soon.");
        }
    });

    // Handle "rm -rf /" Easter Egg
    terminalForm.addEventListener('submit', async (e) => {
        const input = terminalInput.value.trim().toLowerCase();
        if (input === 'rm -rf /') {
            e.preventDefault();
            terminalInput.value = '';
            addLine('[!] ERROR: Permission denied.', 'error');
            addLine('[!] Critical system files protected by V-Sentinel.', 'error');
            addLine('[*] Nice try! But you can\'t delete me that easily. 😉', 'output');
            return;
        }
    });

    // --- Footer Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Matrix Rain Effect ---
    // (Already handled by initMatrix call above)
});
