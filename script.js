// ==================== ROLLA AI ASSISTANT ====================
        class RollaAI {
            constructor() {
                this.fab = document.getElementById('rolla-fab');
                this.chatWindow = document.getElementById('rolla-chat-window');
                this.closeBtn = document.getElementById('rolla-close');
                this.messagesContainer = document.getElementById('rolla-messages');
                this.input = document.getElementById('rolla-input');
                this.sendBtn = document.getElementById('rolla-send');
                this.voiceBtn = document.getElementById('rolla-voice');
                this.suggestionsContainer = document.getElementById('rolla-suggestions');

                this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = this.SpeechRecognition ? new this.SpeechRecognition() : null;
                this.isListening = false;
                this.isOpen = false;

                this.portfolioData = {
                    name: 'Sankula Koteswara Rao',
                    nickname: 'SKR',
                    email: 'srkotesh23@gmail.com',
                    phone: '+91 9182015717',
                    location: 'Bapatla, Andhra Pradesh, 523303',
                    linkedin: 'https://www.linkedin.com/in/sankula-koteswararao',
                    github: 'https://github.com/rkotesh',
                    education: {
                        current: {
                            degree: 'B.Tech in AI & ML',
                            institution: 'Chalapathi Institute Of Engineering & Technology, Lam',
                            period: '2023 - 2027',
                            cgpa: '7.80'
                        },
                        intermediate: {
                            school: 'Sri Saraswathi Jr College, Ongole',
                            period: '2021 - 2023',
                            percentage: '90.07%'
                        },
                        ssc: {
                            school: 'Govt Z P H School, Vaidana',
                            period: '2020 - 2021',
                            percentage: '97.00%'
                        }
                    },
                    skills: {
                        frontend: ['HTML/CSS', 'JavaScript', 'Bootstrap', 'React', 'Tailwind CSS'],
                        programming: ['Python', 'Flask', 'Django', 'SQL', 'AI Tools', 'TensorFlow', 'OpenCV'],
                        tools: ['VS Code', 'Git', 'GitHub', 'Canva', 'MySQL', 'MongoDB']
                    },
                    projects: [
                        { name: 'kotesh-portfolio', description: 'Personal portfolio showcasing projects, skills, and experience with modern web technologies.', tech: ['CSS', 'HTML', 'JavaScript'], url: 'https://rkotesh.github.io/kotesh-portfolio/', github: 'https://github.com/rkotesh/kotesh-portfolio' },
                        { name: 'ciet_erp', description: 'College ERP portal for managing academic operations and student data.', tech: ['HTML', 'JavaScript'], url: 'https://github.com/rkotesh/ciet_erp', github: 'https://github.com/rkotesh/ciet_erp' },
                        { name: 'inventory_management_and_billing_system', description: 'A console-based Python application that manages product inventory, processes customer orders, and generates bills.', tech: ['Python'], url: 'https://github.com/rkotesh/inventory_management_and_billing_system', github: 'https://github.com/rkotesh/inventory_management_and_billing_system' },
                        { name: 'Automation_System', description: 'An automated system designed to streamline repetitive tasks and improve operational efficiency.', tech: ['Python'], url: 'https://github.com/rkotesh/Automation_System', github: 'https://github.com/rkotesh/Automation_System' },
                        { name: 'asset_management', description: 'A web application for tracking and managing digital and physical assets within an organization.', tech: ['JavaScript', 'Web App'], url: 'https://github.com/rkotesh/asset_management', github: 'https://github.com/rkotesh/asset_management' },
                        { name: 'anti_cheating_detection_system', description: 'A system utilizing computer vision and AI techniques to detect cheating behaviors during online examinations.', tech: ['JavaScript', 'AI', 'Computer Vision'], url: 'https://github.com/rkotesh/anti_cheating_detection_system', github: 'https://github.com/rkotesh/anti_cheating_detection_system' },
                        { name: 'Automation-Researcher', description: 'A Gen AI project focused on automated research and data synthesis powered by large language models.', tech: ['Python', 'GenAI', 'LLM'], url: 'https://github.com/rkotesh/Automation-Researcher', github: 'https://github.com/rkotesh/Automation-Researcher' },
                        { name: 'feedback_monitoring_system', description: 'A system for collecting, analyzing, and reporting on user feedback to drive product improvements.', tech: ['Python', 'Analytics'], url: 'https://github.com/rkotesh/feedback_monitoring_system', github: 'https://github.com/rkotesh/feedback_monitoring_system' },
                        { name: 'elms', description: 'Electronic Leave Management System to digitize and manage employee leave applications.', tech: ['Python', 'Management'], url: 'https://elms-3.onrender.com', github: 'https://github.com/rkotesh/elms' },
                        { name: 'weather_forecast', description: 'Application that fetches real-time weather data from open APIs to display local forecasts.', tech: ['Python', 'API'], url: 'https://github.com/rkotesh/weather_forecast', github: 'https://github.com/rkotesh/weather_forecast' },
                        { name: 'hospital_chatbot', description: 'AI-driven conversational agent to assist patients with booking appointments and basic medical queries.', tech: ['Python', 'AI', 'Chatbot'], url: 'https://hospitalchatbot04.streamlit.app', github: 'https://github.com/rkotesh/hospital_chatbot' },
                        { name: 'QR-Generator', description: 'A simple utility to generate customizable QR codes for URLs, text, and contact information.', tech: ['Python', 'Utility'], url: 'https://qr-generator04.streamlit.app', github: 'https://github.com/rkotesh/QR-Generator' }
                    ],
                    achievements: [
                        'AI & ML Engineer Certification (2026) - Freedom With AI',
                        'MERN Stack Training (2025) - Chalapathi Institute Of Engineering & Technology',
                        '12 Projects Showcased',
                        '7 Core Skills',
                        '3 Years of Learning'
                    ],
                    stats: {
                        projectsCompleted: 12,
                        skills: 7,
                        yearsLearning: 3
                    }
                };

                this.init();
            }

            init() {
                this.fab.addEventListener('click', () => this.toggleChat());
                this.closeBtn.addEventListener('click', () => this.toggleChat(false));
                this.sendBtn.addEventListener('click', () => this.sendMessage());
                this.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') this.sendMessage();
                });

                if (this.voiceBtn && this.recognition) {
                    this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
                    this.recognition.continuous = false;
                    this.recognition.lang = 'en-US';
                    this.recognition.interimResults = false;
                    this.recognition.onstart = () => {
                        this.isListening = true;
                        this.voiceBtn.classList.add('listening');
                        this.input.placeholder = 'Listening...';
                    };
                    this.recognition.onend = () => {
                        this.isListening = false;
                        this.voiceBtn.classList.remove('listening');
                        this.input.placeholder = 'Ask Rolla anything...';
                    };
                    this.recognition.onresult = (event) => {
                        this.input.value = event.results[0][0].transcript;
                        this.sendMessage();
                    };
                    this.recognition.onerror = () => {
                        this.isListening = false;
                        this.voiceBtn.classList.remove('listening');
                        this.input.placeholder = 'Voice unavailable';
                    };
                } else if (this.voiceBtn) {
                    this.voiceBtn.style.display = 'none';
                }

                this.chatWindow.querySelectorAll('[data-rolla-action]').forEach(button => {
                    button.addEventListener('click', () => this.handleQuickAction(button.dataset.rollaAction));
                });

                this.showWelcomeMessage();
            }

            toggleChat(forceOpen = null) {
                this.isOpen = forceOpen === null ? !this.isOpen : forceOpen;
                this.chatWindow.classList.toggle('open', this.isOpen);
                this.fab.setAttribute('aria-expanded', String(this.isOpen));
                if (this.isOpen) {
                    this.input.focus();
                }
            }

            toggleVoiceRecognition() {
                if (!this.recognition) return;
                if (this.isListening) {
                    this.recognition.stop();
                } else {
                    try {
                        this.recognition.start();
                    } catch (error) {
                        console.warn('Voice recognition already active');
                    }
                }
            }

            showWelcomeMessage() {
                this.addMessage({
                    type: 'assistant',
                    text: `Hi, I'm **Rolla**. I can help you explore ${this.portfolioData.name}'s portfolio in a quick, recruiter-friendly way.\n\nTry **Projects**, **Resume**, **Achievements**, or **Contact**.`
                });
                this.showSuggestions([
                    'Show projects 🚀',
                    'Open resume 📄',
                    'Show contact 📞',
                    'Show achievements 🏆'
                ]);
            }

            sendMessage() {
                const text = this.input.value.trim();
                if (!text) return;
                this.addMessage({ type: 'user', text });
                this.input.value = '';
                this.respond(text.toLowerCase());
            }

            addMessage(message) {
                const messageEl = document.createElement('div');
                messageEl.className = `rolla-message ${message.type}`;

                const avatar = document.createElement('div');
                avatar.className = 'rolla-avatar';
                avatar.innerHTML = message.type === 'assistant'
                    ? '<i class="fa-solid fa-robot"></i>'
                    : '<i class="fa-solid fa-user"></i>';

                const bubble = document.createElement('div');
                bubble.className = 'rolla-bubble';
                bubble.innerHTML = this.formatMessage(message.text);

                messageEl.appendChild(avatar);
                messageEl.appendChild(bubble);

                this.messagesContainer.appendChild(messageEl);
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }

            formatMessage(text) {
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>');
            }

            showTyping() {
                const typingEl = document.createElement('div');
                typingEl.className = 'rolla-message assistant';
                typingEl.id = 'typing-indicator';

                const avatar = document.createElement('div');
                avatar.className = 'rolla-avatar';
                avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

                const typing = document.createElement('div');
                typing.className = 'rolla-typing';
                typing.innerHTML = '<div class="rolla-typing-dot"></div><div class="rolla-typing-dot"></div><div class="rolla-typing-dot"></div>';

                typingEl.appendChild(avatar);
                typingEl.appendChild(typing);
                this.messagesContainer.appendChild(typingEl);
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }

            hideTyping() {
                const typing = document.getElementById('typing-indicator');
                if (typing) typing.remove();
            }

            showSuggestions(items) {
                this.suggestionsContainer.innerHTML = '';
                items.forEach(item => {
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'rolla-suggestion-chip';
                    chip.textContent = item;
                    chip.addEventListener('click', () => {
                        this.input.value = item.replace(/[🚀🧠🎓🏆]/g, '').trim();
                        this.sendMessage();
                    });
                    this.suggestionsContainer.appendChild(chip);
                });
            }

            respond(query) {
                this.showTyping();
                setTimeout(() => {
                    this.hideTyping();
                    const navResult = this.getNavigationTarget(query);
                    if (navResult) {
                        this.addMessage({ type: 'assistant', text: navResult.message });
                        this.navigate(navResult.targetId);
                        return;
                    }

                    this.addMessage({ type: 'assistant', text: this.generateResponse(query) });
                    this.updateSuggestions(query);
                }, 450);
            }

            getNavigationTarget(query) {
                if (query.includes('about')) return { message: 'Scrolling to About.', targetId: 'about' };
                if (query.includes('skill')) return { message: 'Opening Skills & Expertise.', targetId: 'skills' };
                if (query.includes('project') || query.includes('work')) return { message: 'Opening Projects.', targetId: 'projects' };
                if (query.includes('education') || query.includes('study')) return { message: 'Opening Education.', targetId: 'education' };
                if (query.includes('achievement')) return { message: 'Opening Achievements.', targetId: 'achievements' };
                if (query.includes('contact') || query.includes('email') || query.includes('phone')) return { message: 'Opening Contact.', targetId: 'contact' };
                return null;
            }

            navigate(sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            generateResponse(query) {
                if (this.containsAny(query, ['achievement', 'award', 'certification'])) {
                    return `Here’s a quick achievements snapshot:\n\n${this.portfolioData.achievements.map(item => `• ${item}`).join('\n')}`;
                }

                const specificProject = this.findProject(query);
                if (specificProject) {
                    return this.getProjectDetailResponse(specificProject, query);
                }

                if (this.containsAny(query, ['project', 'work', 'built', 'portfolio'])) {
                    return this.getProjectsResponse(query);
                }

                if (this.containsAny(query, ['skill', 'technology', 'tech stack'])) {
                    return this.getSkillsResponse();
                }

                if (this.containsAny(query, ['education', 'college', 'cgpa', 'academic'])) {
                    return this.getEducationResponse();
                }

                if (this.containsAny(query, ['contact', 'email', 'phone', 'linkedin', 'github'])) {
                    return this.getContactResponse();
                }

                if (this.containsAny(query, ['resume', 'cv'])) {
                    return `Absolutely. You can download the resume from the hero button or use this direct link:\n\n• [Sankula_Koteswararao_Resume.pdf](./assets/Sankula_Koteswararao_Resume.pdf)`;
                }

                if (this.containsAny(query, ['who are you', 'about', 'summary'])) {
                    return this.getAboutResponse();
                }

                return `I can help with **projects**, **skills**, **education**, **achievements**, **resume**, or **contact info**. If you want, I can also jump straight to that section for you.`;
            }

            containsAny(query, list) {
                return list.some(item => query.includes(item));
            }

            findProject(query) {
                return this.portfolioData.projects.find(project => {
                    const normalizedName = project.name.toLowerCase().replace(/_/g, ' ');
                    return query.includes(project.name.toLowerCase()) || query.includes(normalizedName);
                }) || null;
            }

            classifyProject(project) {
                const name = project.name.toLowerCase();
                if (name.includes('portfolio') || name.includes('erp') || name.includes('asset')) return 'Web';
                if (name.includes('automation') || name.includes('feedback') || name.includes('elms')) return 'Automation';
                if (name.includes('cheating') || name.includes('researcher') || name.includes('chatbot')) return 'AI';
                return 'Python';
            }

            getProjectsResponse(query) {
                const groups = this.portfolioData.projects.reduce((acc, project) => {
                    const type = this.classifyProject(project);
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(project);
                    return acc;
                }, {});

                if (query.includes('live') || query.includes('demo')) {
                    const liveProjects = this.portfolioData.projects.filter(p => p.url.includes('streamlit') || p.url.includes('onrender') || p.url.includes('github.io'));
                    return `Here are the live links I can point you to right now:\n\n${liveProjects.map(p => `• **${p.name}**: ${p.url}`).join('\n')}`;
                }

                return `Here’s the portfolio grouped by type:\n\n${Object.entries(groups).map(([type, projects]) => `**${type}**\n${projects.map(p => `• ${p.name} — ${p.description}`).join('\n')}`).join('\n\n')}\n\nAsk me about any project name and I’ll give you the link or a quick summary.`;
            }

            getProjectDetailResponse(project, query) {
                const liveLink = project.url && (project.url.includes('streamlit') || project.url.includes('onrender') || project.url.includes('github.io'))
                    ? `\n\nLive demo: ${project.url}`
                    : '';
                const repoLink = project.github ? `\nGitHub: ${project.github}` : '';
                return `**${project.name}**\n\n${project.description}\n\nTechnologies: ${project.tech.join(', ')}${liveLink}${repoLink}`;
            }

            getSkillsResponse() {
                const skills = this.portfolioData.skills;
                return `**Skills:**\n\n**Frontend:** ${skills.frontend.join(', ')}\n**Programming & AI:** ${skills.programming.join(', ')}\n**Tools:** ${skills.tools.join(', ')}`;
            }

            getEducationResponse() {
                const edu = this.portfolioData.education;
                return `**Education:**\n\n**Current:** ${edu.current.degree} at ${edu.current.institution} (${edu.current.period}) - CGPA ${edu.current.cgpa}\n**Intermediate:** ${edu.intermediate.school} (${edu.intermediate.period}) - ${edu.intermediate.percentage}\n**SSC:** ${edu.ssc.school} (${edu.ssc.period}) - ${edu.ssc.percentage}`;
            }

            getContactResponse() {
                return `**Contact:**\n\n• Email: ${this.portfolioData.email}\n• Phone: ${this.portfolioData.phone}\n• Location: ${this.portfolioData.location}\n• GitHub: ${this.portfolioData.github}\n• LinkedIn: ${this.portfolioData.linkedin}`;
            }

            getAboutResponse() {
                return `**About:**\n\n${this.portfolioData.name} is an aspiring **AI & ML Engineer** focused on web development, Python programming, and AI automation.\n\n**Quick Stats:**\n• ${this.portfolioData.stats.projectsCompleted} projects\n• ${this.portfolioData.stats.skills} skills\n• ${this.portfolioData.stats.yearsLearning} years learning\n\nIf you want a faster overview, I can jump straight to projects or resume.`;
            }

            handleQuickAction(action) {
                if (action === 'projects') {
                    this.navigate('projects');
                    this.addMessage({ type: 'assistant', text: 'Taking you to Projects.' });
                    return;
                }

                if (action === 'resume') {
                    window.open('./assets/Sankula_Koteswararao_Resume.pdf', '_blank', 'noopener');
                    this.addMessage({ type: 'assistant', text: 'Opening the resume now.' });
                    return;
                }

                if (action === 'contact') {
                    this.navigate('contact');
                    this.addMessage({ type: 'assistant', text: 'Jumping to Contact.' });
                }
            }

            updateSuggestions(query) {
                let suggestions = ['Show projects 🚀', 'Skills & tech 🧠', 'Education details 🎓', 'Contact info 📧'];
                if (query.includes('project')) suggestions = ['Open ELMS 🚀', 'Show achievements 🏆', 'What tech stacks? 🧠', 'Live demos 🔗'];
                if (query.includes('skill')) suggestions = ['Show projects 🚀', 'Education details 🎓', 'Achievements 🏆', 'Contact info 📧'];
                if (query.includes('achievement')) suggestions = ['Projects 🚀', 'Education 🎓', 'Contact info 📧'];
                this.showSuggestions(suggestions);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            window.rolla = new RollaAI();
        });

        // ==================== LOADER ====================
        const loaderCounter = document.getElementById('loaderCounter');
        let count = 0;
        const loaderInterval = setInterval(() => {
            count += Math.floor(Math.random() * 3) + 1;
            if (count > 100) count = 100;
            loaderCounter.textContent = String(count).padStart(3, '0');
            if (count >= 100) {
                clearInterval(loaderInterval);
                setTimeout(() => {
                    document.getElementById('loader').classList.add('hidden');
                    setTimeout(() => {
                        document.querySelectorAll('.curtain').forEach(c => c.classList.add('reveal'));
                        setTimeout(() => {
                            document.getElementById('navbar').classList.add('visible');
                            animateHero();
                        }, 500);
                    }, 200);
                }, 600);
            }
        }, 40);

        // ==================== HERO ANIMATION ====================
        function animateHero() {
            // Greeting
            const greeting = document.querySelector('.hero-greeting span');
            if (greeting) {
                greeting.style.transition = 'all 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                greeting.style.opacity = '1';
                greeting.style.transform = 'translateY(0)';
            }

            // Name lines
            document.querySelectorAll('.hero-name .name-line span').forEach((span, i) => {
                setTimeout(() => {
                    span.style.transition = 'all 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 200 + i * 150);
            });

            // Title
            setTimeout(() => {
                const titleSpan = document.querySelector('.hero-title span');
                if (titleSpan) {
                    titleSpan.style.transition = 'all 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                    titleSpan.style.opacity = '1';
                    titleSpan.style.transform = 'translateY(0)';
                }
            }, 700);

            // Desc and buttons
            setTimeout(() => {
                const desc = document.querySelector('.hero-desc');
                desc.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
                desc.style.opacity = '1';
                desc.style.transform = 'translateY(0)';
            }, 900);

            setTimeout(() => {
                const btns = document.querySelector('.hero-buttons');
                btns.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
                btns.style.opacity = '1';
                btns.style.transform = 'translateY(0)';
            }, 1100);

            // Visual
            setTimeout(() => {
                const visual = document.querySelector('.hero-visual');
                visual.style.transition = 'all 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)';
                visual.style.opacity = '1';
            }, 600);
        }

        // ==================== THREE.JS BACKGROUND ====================
        const canvas = document.getElementById('three-bg');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        // Particles - white/gray
        const particleCount = 2000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            velocities[i * 3] = (Math.random() - 0.5) * 0.015;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
            sizes[i] = Math.random() * 2 + 0.3;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            vertexShader: `
    attribute float size;
    varying float vAlpha;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      vAlpha = size / 2.3;
    }
  `,
            fragmentShader: `
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d) * vAlpha * 0.4;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Lines
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.03,
            blending: THREE.AdditiveBlending
        });
        const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(linesMesh);

        // Geometric shapes - wireframe white
        const shapes = [];
        const shapeMaterials = [];
        for (let i = 0; i < 10; i++) {
            let geo;
            const r = Math.random();
            if (r < 0.25) geo = new THREE.IcosahedronGeometry(Math.random() * 2.5 + 0.8, 0);
            else if (r < 0.5) geo = new THREE.OctahedronGeometry(Math.random() * 2 + 0.8, 0);
            else if (r < 0.75) geo = new THREE.TetrahedronGeometry(Math.random() * 2 + 0.8, 0);
            else geo = new THREE.BoxGeometry(Math.random() * 2 + 0.6, Math.random() * 2 + 0.6, Math.random() * 2 + 0.6);

            const mat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.04 + Math.random() * 0.04
            });
            shapeMaterials.push(mat);

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40
            );
            mesh.userData = {
                rotSpeed: { x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.008 },
                floatSpeed: Math.random() * 0.004 + 0.001,
                floatOffset: Math.random() * Math.PI * 2,
                origY: mesh.position.y,
                origX: mesh.position.x
            };
            scene.add(mesh);
            shapes.push(mesh);
        }

        // Mouse
        let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
        document.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function updateLines() {
            const posArr = particleGeometry.attributes.position.array;
            const linePositions = [];
            const maxDist = 7;
            for (let i = 0; i < Math.min(particleCount, 250); i++) {
                for (let j = i + 1; j < Math.min(particleCount, 250); j++) {
                    const dx = posArr[i * 3] - posArr[j * 3];
                    const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                    const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                    const dist = dx * dx + dy * dy + dz * dz;
                    if (dist < maxDist * maxDist) {
                        linePositions.push(posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2]);
                        linePositions.push(posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]);
                    }
                }
            }
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        }

        let time = 0;
        let frameCount = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.008;
            frameCount++;

            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            const posArr = particleGeometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                posArr[i * 3] += velocities[i * 3];
                posArr[i * 3 + 1] += velocities[i * 3 + 1];
                posArr[i * 3 + 2] += velocities[i * 3 + 2];
                if (Math.abs(posArr[i * 3]) > 50) velocities[i * 3] *= -1;
                if (Math.abs(posArr[i * 3 + 1]) > 50) velocities[i * 3 + 1] *= -1;
                if (Math.abs(posArr[i * 3 + 2]) > 50) velocities[i * 3 + 2] *= -1;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            if (frameCount % 4 === 0) updateLines();

            particles.rotation.y += 0.0003;
            particles.rotation.x = mouseY * 0.08;
            particles.rotation.y += mouseX * 0.0005;

            shapes.forEach(s => {
                s.rotation.x += s.userData.rotSpeed.x;
                s.rotation.y += s.userData.rotSpeed.y;
                s.position.y = s.userData.origY + Math.sin(time * 2 + s.userData.floatOffset) * 2.5;
                s.position.x = s.userData.origX + Math.cos(time * 1.5 + s.userData.floatOffset) * 1.5;
            });

            camera.position.x += (mouseX * 4 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        // ==================== ABOUT CANVAS 3D ====================
        const aboutCanvas = document.getElementById('about-canvas');
        const aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
        const aboutScene = new THREE.Scene();
        const aboutCamera = new THREE.PerspectiveCamera(60, aboutCanvas.clientWidth / aboutCanvas.clientHeight, 0.1, 100);
        aboutCamera.position.z = 5;

        function resizeAbout() {
            const w = aboutCanvas.clientWidth;
            const h = aboutCanvas.clientHeight;
            aboutRenderer.setSize(w, h);
            aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            aboutCamera.aspect = w / h;
            aboutCamera.updateProjectionMatrix();
        }
        resizeAbout();

        // Torus Knot — white wireframe
        const torusKnotGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
        const torusKnotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 });
        const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
        aboutScene.add(torusKnot);

        // Inner sphere
        const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03 });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        aboutScene.add(sphere);

        // Orbiting dots - white
        const orbitGroup = new THREE.Group();
        for (let i = 0; i < 60; i++) {
            const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
            const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
            const dot = new THREE.Mesh(dotGeo, dotMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.8 + Math.random() * 0.6;
            const yOff = (Math.random() - 0.5) * 2.5;
            dot.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
            dot.userData = { angle, radius, yOff, speed: 0.003 + Math.random() * 0.008 };
            orbitGroup.add(dot);
        }
        aboutScene.add(orbitGroup);

        // Outer ring
        const ringGeo = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        aboutScene.add(ring);

        function animateAbout() {
            requestAnimationFrame(animateAbout);
            torusKnot.rotation.x += 0.004;
            torusKnot.rotation.y += 0.006;
            sphere.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
            ring.rotation.z += 0.002;

            orbitGroup.children.forEach(d => {
                d.userData.angle += d.userData.speed;
                d.position.x = Math.cos(d.userData.angle) * d.userData.radius;
                d.position.z = Math.sin(d.userData.angle) * d.userData.radius;
            });

            aboutRenderer.render(aboutScene, aboutCamera);
        }
        animateAbout();

        // ==================== CUSTOM CURSOR ====================
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursorDot');
        let cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;

        document.addEventListener('mousemove', e => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function updateCursor() {
            dotX += (cursorX - dotX) * 0.4;
            dotY += (cursorY - dotY) * 0.4;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        document.querySelectorAll('a, button, .project-card, .skill-category, .stat-card, .contact-card, .skill-tag, .floating-icon').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // ==================== MAGNETIC EFFECT ====================
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });

        // ==================== SCROLL REVEAL ====================
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger, .text-reveal').forEach(el => observer.observe(el));

        // ==================== NAV SCROLL ====================
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 60) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');

            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');

            sections.forEach(section => {
                const top = section.offsetTop - 200;
                const bottom = top + section.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        });

        // ==================== COUNTER ====================
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.count);
                        const duration = 2200;
                        const start = performance.now();
                        function updateCounter(now) {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 4);
                            counter.textContent = Math.round(target * eased) + (target === 100 ? '%' : '+');
                            if (progress < 1) requestAnimationFrame(updateCounter);
                        }
                        requestAnimationFrame(updateCounter);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    document.getElementById('navLinks').classList.remove('mobile-open');
                }
            });
        });

        // ==================== MOBILE NAV ====================
        function toggleMobile() {
            document.getElementById('navLinks').classList.toggle('mobile-open');
        }

        // ==================== FORM ====================
        function handleSubmit(e) {
            e.preventDefault();
            const btn = e.target.querySelector('.btn-submit');
            btn.textContent = 'Message Sent ✓';
            btn.style.background = '#444';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.textContent = 'Send Message →';
                btn.style.background = '';
                btn.style.color = '';
                e.target.reset();
            }, 3000);
        }

        // ==================== 3D TILT CARDS ====================
        const projectModal = document.getElementById('project-modal');
        const projectModalImage = document.getElementById('project-modal-image');
        const projectModalNumber = document.getElementById('project-modal-number');
        const projectModalKicker = document.getElementById('project-modal-kicker');
        const projectModalTitle = document.getElementById('project-modal-title');
        const projectModalDescription = document.getElementById('project-modal-description');
        const projectModalTech = document.getElementById('project-modal-tech');
        const projectModalLinks = document.getElementById('project-modal-links');
        let activeProjectCard = null;

        function closeProjectModal() {
            if (!projectModal) return;
            projectModal.classList.remove('is-open');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('project-modal-open');
            if (activeProjectCard) {
                activeProjectCard.classList.remove('is-active');
                activeProjectCard = null;
            }
        }

        function openProjectModal(card) {
            if (!projectModal) return;

            const previewImage = card.querySelector('.project-preview img');
            const title = card.querySelector('.project-info h3')?.textContent?.trim() || 'Project';
            const description = card.querySelector('.project-info p')?.textContent?.trim() || '';
            const techItems = Array.from(card.querySelectorAll('.project-tech span')).map(el => el.textContent.trim());
            const links = Array.from(card.querySelectorAll('.project-links a')).map(link => ({
                label: link.textContent.replace('↗', '').trim() || 'Open',
                href: link.href
            }));
            const number = card.querySelector('.project-number')?.textContent?.trim() || '';
            const groupLabel = card.closest('.project-group')?.querySelector('.project-group-header span')?.textContent?.trim() || 'Project';

            projectModalImage.src = previewImage?.src || '';
            projectModalImage.alt = `${title} preview`;
            projectModalNumber.textContent = number;
            projectModalKicker.textContent = groupLabel;
            projectModalTitle.textContent = title;
            projectModalDescription.textContent = description;
            projectModalTech.innerHTML = techItems.map(tech => `<span>${tech}</span>`).join('');
            projectModalLinks.innerHTML = links.map(link => `<a class="project-modal-link" href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`).join('');

            if (activeProjectCard) {
                activeProjectCard.classList.remove('is-active');
            }
            activeProjectCard = card;
            activeProjectCard.classList.add('is-active');

            projectModal.classList.add('is-open');
            projectModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('project-modal-open');
        }

        document.querySelectorAll('.project-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const tiltX = (y - 0.5) * 12;
                const tiltY = (x - 0.5) * -12;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-12px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });

            card.addEventListener('click', e => {
                if (e.target.closest('a')) return;
                openProjectModal(card);
            });

            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(card);
                }
            });
        });

        if (projectModal) {
            projectModal.addEventListener('click', e => {
                if (e.target.matches('[data-project-modal-close]')) {
                    closeProjectModal();
                }
            });
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        });

        document.querySelectorAll('.skill-category').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const tiltX = (y - 0.5) * 8;
                const tiltY = (x - 0.5) * -8;
                card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        // ==================== TYPING EFFECT ====================
        const heroTitleEl = document.querySelector('.hero-title span');
        const titles = ['WEB DEVELOPER', 'AI ENTHUSIAST', 'PYTHON DEVELOPER', 'FULL STACK DEV', 'PROBLEM SOLVER'];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const current = titles[titleIndex];
            if (isDeleting) {
                heroTitleEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                heroTitleEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            // Blinking cursor
            heroTitleEl.style.borderRight = '2px solid rgba(255,255,255,0.6)';

            let speed = isDeleting ? 40 : 80;
            if (!isDeleting && charIndex === current.length) {
                speed = 2500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                speed = 600;
            }
            setTimeout(typeEffect, speed);
        }

        setTimeout(typeEffect, 3000);

        // ==================== RESIZE ====================
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            resizeAbout();
        });

        // ==================== PARALLAX SECTIONS ====================
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Subtle parallax on hero content
            const heroContent = document.querySelector('.hero-content');
            const heroVisual = document.querySelector('.hero-visual');
            if (heroContent && scrollY < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
                heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
                heroVisual.style.opacity = 1 - scrollY / (window.innerHeight * 0.9);
            }
        });
