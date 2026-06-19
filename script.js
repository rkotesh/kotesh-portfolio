document.addEventListener('DOMContentLoaded', () => {
    // Dynamic year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Navbar scrolled class toggle
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Mobile nav toggle
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });

        // Close mobile nav when clicking a link
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
            });
        });
    }

    // IntersectionObserver for Scroll Reveal & Staggered items
    const reveals = document.querySelectorAll('.reveal');
    const staggerContainers = document.querySelectorAll('.stagger-reveal');

    if ('IntersectionObserver' in window) {
        // Standard single elements reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));

        // Staggered lists reveal (skills, projects, timeline, socials)
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.reveal-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 65); // 65ms delay stagger
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        staggerContainers.forEach(container => staggerObserver.observe(container));

    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('visible'));
        document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('visible'));
    }

    // Interactive 3D Perspective Card Tilt Effect & Card Spotlight hover tracker
    const tiltElements = document.querySelectorAll('.project-card, .highlight-card, .education-card, .experience-card, .social-link, .hero-image-wrapper');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 8; // Max tilt X degrees
            const tiltY = (x - 0.5) * -8; // Max tilt Y degrees
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
            el.style.transition = 'transform 0.18s cubic-bezier(0.25, 1, 0.5, 1)';

            // Track local cursor coords inside card for spotlight glow effect
            const glowX = e.clientX - rect.left;
            const glowY = e.clientY - rect.top;
            el.style.setProperty('--card-x', `${glowX}px`);
            el.style.setProperty('--card-y', `${glowY}px`);
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            el.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s';
        });
    });

    // Interactive Magnetic Hover Pull Effect on Buttons & Nav Links
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .form-submit, .otw-cta, .rolla-fab, .rolla-send-btn');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            el.style.transition = 'none';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
            el.style.transition = 'transform 0.4s ease';
        });
    });



    // Page Scroll Progress Indicator
    const progressEl = document.getElementById('scrollProgress');
    if (progressEl) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressEl.style.width = scrolled + '%';
        });
    }

    // Hero Scroll Parallax Effect
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.16}px)`;
            heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.7);
        }
    });



    // Project detail data
    const projectDb = {
        rolla_ai: {
            title: "Rolla AI — Digital Agency",
            tags: ["MERN Stack", "Django", "Next.js", "Tailwind CSS", "SEO & Analytics"],
            description: "A premium, professional digital web agency and custom software development platform. Built with sub-second page performance, modern glassmorphic designs, responsive UI/UX architectures, and highly optimized SEO structures.",
            highlights: [
                "Features an agency-grade web development framework optimized for loading speeds and Core Web Vitals.",
                "Custom interactive micro-animations and responsive components built entirely from scratch.",
                "Complete headless CMS (Sanity) and secure payment gateway (Stripe) integration readiness.",
                "Built to attract and engage clients with modern typography, smooth color palettes, and SEO configurations."
            ],
            liveLink: "https://rolla-ai.vercel.app/",
            githubLink: "https://github.com/rkotesh"
        },
        hospital_chatbot: {
            title: "Hospital Chatbot",
            tags: ["Python", "AI", "Streamlit", "NLP"],
            description: "An AI-driven conversational agent utilizing natural language processing to assist patients with booking appointments, checking doctor availability, and answering basic medical FAQs.",
            highlights: [
                "Built with Streamlit frontend and Python backend NLP processing.",
                "Integrates a mock database for real-time doctor availability checking.",
                "Designed conversational flows that reduced simulated booking time by 60%."
            ],
            liveLink: "https://hospitalchatbot04.streamlit.app",
            githubLink: "https://github.com/rkotesh/hospital_chatbot"
        },
        qr_generator: {
            title: "QR Code Generator",
            tags: ["Python", "Utility", "Streamlit"],
            description: "A lightweight web utility that allows users to generate, customize (colors, borders), and download high-resolution QR codes for URLs, plain text data, and contact info (vCards).",
            highlights: [
                "Features live preview color customize rendering for borders and body elements.",
                "Instant local downloads in PNG format directly in the browser.",
                "Automated validation checks ensuring valid inputs before code generation."
            ],
            liveLink: "https://qr-generator04.streamlit.app",
            githubLink: "https://github.com/rkotesh/QR-Generator"
        },
        elms: {
            title: "ELMS (Leave Management)",
            tags: ["Python", "Django/Flask", "Management"],
            description: "A full-stack employee leave tracking system that digitizes leave applications, approvals, and balance monitoring, replacing manual paper workflows.",
            highlights: [
                "Deployed on Render with responsive DB integration.",
                "Role-based authentication dashboard separating Admin managers and Employees.",
                "Tracks balance changes in real-time with automated approval request logs."
            ],
            liveLink: "https://elms-3.onrender.com",
            githubLink: "https://github.com/rkotesh/elms"
        },
        ciet_erp: {
            title: "College ERP Portal",
            tags: ["HTML", "CSS", "JavaScript", "ERP"],
            description: "Academic dashboard portal built to manage student attendance, grades database, assignments, and announcements.",
            highlights: [
                "Clean UI matching university brand colors and structural layout grid.",
                "Includes student records management interface for administrators.",
                "Fully responsive design optimized for tablet and mobile devices."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/ciet_erp"
        },
        inventory_system: {
            title: "Inventory & Billing System",
            tags: ["Python", "SQLite", "CLI Tool"],
            description: "A backend CLI application that tracks store inventories, alerts users when stocks are low, handles custom orders, and generates printable PDF invoices.",
            highlights: [
                "SQLite database integration with robust transactional logging.",
                "Generates automated low-stock warnings based on customizable threshold values.",
                "Includes terminal-based invoice billing generator."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/inventory_management_and_billing_system"
        },
        automation_system: {
            title: "Automation System",
            tags: ["Python", "Automation", "Scripts"],
            description: "Automated scripts designed to clean directories, organize messy downloads, and run scheduled database backups automatically.",
            highlights: [
                "Organizes local desktop files into categorical directories in seconds.",
                "Estimated time savings of 4 hours of manual desktop cleaning weekly.",
                "Low system resource footprint utilizing optimized Python file system methods."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/Automation_System"
        },
        asset_management_spa: {
            title: "Asset Management Spa",
            tags: ["JavaScript", "Utility"],
            description: "An open-source repository for Asset Management Spa built to solve development challenges.",
            highlights: [
                "Implemented robust application structures.",
                "Fully configured for easy deployment and local testing.",
                "Built using JavaScript."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/asset-management-spa"
        },
        
        feedback_monitoring_system: {
            title: "Feedback Monitoring System",
            tags: ["Python", "Utility"],
            description: "An open-source repository for Feedback Monitoring System built to solve development challenges.",
            highlights: [
                "Implemented robust application structures.",
                "Fully configured for easy deployment and local testing.",
                "Built using Python."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/feedback_monitoring_system"
        },
        
        weather_forecast: {
            title: "Weather Forecast",
            tags: ["Python", "Utility"],
            description: "An open-source repository for Weather Forecast built to solve development challenges.",
            highlights: [
                "Implemented robust application structures.",
                "Fully configured for easy deployment and local testing.",
                "Built using Python."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/weather_forecast"
        },
        
        /* AUTO_PROJECT_DB_MARKER */
    };

    // Modal DOM Elements
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalDesc = document.getElementById('modalDesc');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalGithubLink = document.getElementById('modalGithubLink');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Open Modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent opening modal if link inside card is clicked
            if (e.target.closest('a')) return;

            const projectId = card.getAttribute('data-project');
            const data = projectDb[projectId];
            if (!data) return;

            // Populate Modal Content
            modalTitle.textContent = data.title;
            
            // Populate Tags
            modalTags.innerHTML = '';
            data.tags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag;
                modalTags.appendChild(span);
            });

            modalDesc.textContent = data.description;

            // Populate Highlights
            modalHighlights.innerHTML = '';
            data.highlights.forEach(highlight => {
                const li = document.createElement('li');
                li.textContent = highlight;
                modalHighlights.appendChild(li);
            });

            // Populate Links
            if (data.liveLink) {
                modalLiveLink.href = data.liveLink;
                modalLiveLink.style.display = 'inline-flex';
            } else {
                modalLiveLink.style.display = 'none';
            }

            if (data.githubLink) {
                modalGithubLink.href = data.githubLink;
                modalGithubLink.style.display = 'inline-flex';
            } else {
                modalGithubLink.style.display = 'none';
            }

            // Show Modal
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Disable page scroll
        });
    });

    // Close Modal Function
    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Enable page scroll
        }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Stats count up animation
    const stats = document.querySelectorAll('.stat h3');
    const animateStats = () => {
        stats.forEach(stat => {
            const text = stat.textContent;
            const isPlus = text.includes('+');
            const targetVal = parseFloat(text.replace('+', ''));
            const isFloat = text.includes('.');
            
            const duration = 1500; // 1.5s
            const start = performance.now();
            
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                // Easing out quad
                const ease = progress * (2 - progress);
                const currentVal = ease * targetVal;
                
                if (isFloat) {
                    stat.textContent = currentVal.toFixed(2) + (isPlus ? '+' : '');
                } else {
                    stat.textContent = Math.floor(currentVal) + (isPlus ? '+' : '');
                }
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = text; // safety reset to initial text
                }
            };
            requestAnimationFrame(step);
        });
    };
    
    // Trigger when stats section enters view
    const heroStatsContainer = document.querySelector('.hero-stats');
    if (heroStatsContainer && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStatsContainer);
    } else {
        animateStats(); // fallback
    }

    // Initialize AI Assistant
    window.koteshAI = new KoteshAI();
});

class KoteshAI {
    constructor() {
        this.fab = document.getElementById('rollaFab');
        this.chatWindow = document.getElementById('rollaChatWindow');
        this.closeBtn = document.getElementById('rollaCloseBtn');
        this.messagesContainer = document.getElementById('rollaMessages');
        this.input = document.getElementById('rollaInput');
        this.inputArea = document.getElementById('rollaInputArea');
        this.suggestionsContainer = document.getElementById('rollaSuggestions');
        this.notification = document.getElementById('rollaNotification');
        
        this.isOpen = false;
        this.hasOpenedBefore = false;
        
        this.portfolioData = {
            name: 'Sankula Koteswara Rao',
            nickname: 'Kotesh',
            email: 'srkotesh23@gmail.com',
            phone: '+91 9182015717',
            location: 'Bapatla, Andhra Pradesh, India',
            linkedin: 'https://linkedin.com/in/sankula-koteswararao',
            github: 'https://github.com/rkotesh',
            education: [
                {
                    degree: 'B.Tech in AI & ML',
                    institution: 'Chalapathi Institute Of Engineering & Technology, Lam',
                    period: '2023 – 2027',
                    details: 'Focusing on advanced AI concepts, data structures, machine learning algorithms, and practical applications. Currently holding a B.Tech CGPA of 7.80.'
                },
                {
                    degree: 'Intermediate (12th Grade)',
                    institution: 'Sri Saraswathi Jr College',
                    period: '2021 – 2023',
                    details: 'Completed senior secondary education focusing on Mathematics, Physics, and Chemistry. Achieved 90.07%.'
                },
                {
                    degree: 'SSC (10th Grade)',
                    institution: 'Govt Z Z P H School',
                    period: '2020 – 2021',
                    details: 'Completed secondary education with 97.00%.'
                }
            ],
            experiences: [
                {
                    role: 'Coordinator',
                    company: 'Techno Future India',
                    period: 'May 2026 – Present',
                    location: 'Guntur, AP',
                    details: 'Accomplished end-to-end mentorship of internship cohorts by guiding students through MERN Stack concepts and real-world development practices. Accomplished structured learning delivery by designing industry-focused sessions.'
                },
                {
                    role: 'Founder',
                    company: 'Rolla',
                    period: 'May 2026 – Present',
                    location: 'Remote',
                    details: 'Rolla is a custom web development agency offering Django & MERN stack solutions. As an AI Tools Specialist, I integrate advanced AI workflows and prompt engineering to design and deploy SaaS platforms, client portals, e-commerce stores, and secure API integrations.'
                },
                {
                    role: 'Python Developer Intern',
                    company: 'Flipkart',
                    period: 'Sep 2025 – Feb 2026',
                    location: 'Remote',
                    details: 'Accomplished full-stack delivery of a Flask web application by designing RESTful backend APIs and integrating user-facing features from scratch. Accomplished a 3x reduction in repetitive manual workflows by building 3 Python automation console tools.'
                },
                /* AUTO_CHATBOT_EXPERIENCES_MARKER */
            ],
            skills: {
                languages: ['HTML', 'CSS', 'JavaScript', 'Python', 'MySQL'],
                frameworks: ['Bootstrap', 'Streamlit', 'Flask', 'Django', 'React (MERN Stack)'],
                tools: ['Prompt Engineering', 'Git', 'GitHub', 'VS Code', 'Canva', 'AI Tools']
            },
            projects: [
                {
                    id: 'rolla_ai',
                    title: 'Rolla AI — Custom Web Agency',
                    tech: ['MERN Stack', 'Django', 'Next.js', 'Tailwind CSS'],
                    description: 'A premium, professional digital web agency and custom software development platform featuring sub-second page performance, modern glassmorphic designs, responsive UI/UX, and highly optimized SEO structures.',
                    live: 'https://rolla-ai.vercel.app/',
                    github: 'https://github.com/rkotesh'
                },
                {
                    id: 'hospital_chatbot',
                    title: 'Hospital Chatbot',
                    tech: ['Python', 'AI', 'Streamlit', 'Chatbot'],
                    description: 'An AI-driven conversational agent to assist patients with booking appointments and basic medical queries.',
                    live: 'https://hospitalchatbot04.streamlit.app',
                    github: 'https://github.com/rkotesh/hospital_chatbot'
                },
                {
                    id: 'qr_generator',
                    title: 'QR Code Generator',
                    tech: ['Python', 'Streamlit'],
                    description: 'A simple utility to generate customizable QR codes for URLs, text, and contact information.',
                    live: 'https://qr-generator04.streamlit.app',
                    github: 'https://github.com/rkotesh/QR-Generator'
                },
                {
                    id: 'elms',
                    title: 'ELMS (Leave Management)',
                    tech: ['Python', 'Flask'],
                    description: 'Electronic Leave Management System to digitize and manage employee leave applications.',
                    live: 'https://elms-3.onrender.com',
                    github: 'https://github.com/rkotesh/elms'
                },
                {
                    id: 'ciet_erp',
                    title: 'College ERP Portal',
                    tech: ['Python', 'Django'],
                    description: 'ERP system built for managing college academic operations, student attendance, and administrative records.',
                    github: 'https://github.com/rkotesh/ciet_erp'
                },
                {
                    id: 'inventory_system',
                    title: 'Inventory & Billing System',
                    tech: ['Python'],
                    description: 'A console-based Python application that manages product inventory, processes customer orders, and generates bills.',
                    github: 'https://github.com/rkotesh/inventory_management_and_billing_system'
                },
                {
                    id: 'automation_system',
                    title: 'Automation System',
                    tech: ['Python', 'Automation'],
                    description: 'An automated system designed to streamline repetitive tasks and improve operational efficiency.',
                    github: 'https://github.com/rkotesh/Automation_System'
                },
                {
                    id: 'asset_management_spa',
                    title: 'Asset Management Spa',
                    tech: ['JavaScript', 'Utility'],
                    description: 'An open-source repository for Asset Management Spa built to solve development challenges.',
                    github: 'https://github.com/rkotesh/asset-management-spa'
                },
                
                {
                    id: 'feedback_monitoring_system',
                    title: 'Feedback Monitoring System',
                    tech: ['Python', 'Utility'],
                    description: 'An open-source repository for Feedback Monitoring System built to solve development challenges.',
                    github: 'https://github.com/rkotesh/feedback_monitoring_system'
                },
                
                {
                    id: 'weather_forecast',
                    title: 'Weather Forecast',
                    tech: ['Python', 'Utility'],
                    description: 'An open-source repository for Weather Forecast built to solve development challenges.',
                    github: 'https://github.com/rkotesh/weather_forecast'
                },
                
                /* AUTO_CHATBOT_PROJECTS_MARKER */
            ],
            certifications: [
                'Certified AI & ML Engineer (2025) - Freedom With AI',
                'MERN Stack Training (2025) - Chalapathi Institute Of Engineering & Technology'
            ]
        };
        
        this.init();
    }
    
    init() {
        // Toggle chat window
        this.fab.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat(false));
        
        // Form submit
        this.inputArea.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSend();
        });
        
        // Escape key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChat(false);
            }
        });
        
        // Show notification bubble initially
        setTimeout(() => {
            if (!this.isOpen && !this.hasOpenedBefore) {
                this.notification.style.display = 'block';
            }
        }, 5000);
        
        this.showWelcomeMessage();
    }
    
    toggleChat(forceState = null) {
        this.isOpen = forceState !== null ? forceState : !this.isOpen;
        this.chatWindow.classList.toggle('open', this.isOpen);
        this.fab.setAttribute('aria-expanded', String(this.isOpen));
        
        if (this.isOpen) {
            this.hasOpenedBefore = true;
            this.notification.style.display = 'none';
            this.input.focus();
        }
    }
    
    showWelcomeMessage() {
        this.addMessage('assistant', `Hi there! 👋 I'm Kotesh's AI avatar. I built this chatbot to tell you about my skills, projects, education, and contact info in first person! How can I help you today?`);
        
        this.showSuggestions([
            'Tell me about yourself 👨‍💻',
            'Show your projects 🚀',
            'What are your skills? 🧠',
            'Get contact info 📞'
        ]);
    }
    
    addMessage(sender, text) {
        const messageEl = document.createElement('div');
        messageEl.className = `rolla-message ${sender}`;
        
        const avatarEl = document.createElement('div');
        avatarEl.className = 'rolla-msg-avatar';
        if (sender === 'assistant') {
            avatarEl.innerHTML = `<img src="assets/profile.jpg" alt="Kotesh">`;
        } else {
            avatarEl.innerHTML = `👤`;
        }
        
        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'rolla-bubble';
        bubbleEl.innerHTML = this.formatMarkdown(text);
        
        messageEl.appendChild(avatarEl);
        messageEl.appendChild(bubbleEl);
        
        this.messagesContainer.appendChild(messageEl);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    showTyping() {
        const typingEl = document.createElement('div');
        typingEl.className = 'rolla-message assistant';
        typingEl.id = 'rollaTypingIndicator';
        
        const avatarEl = document.createElement('div');
        avatarEl.className = 'rolla-msg-avatar';
        avatarEl.innerHTML = `<img src="assets/profile.jpg" alt="Kotesh">`;
        
        const typingDotEl = document.createElement('div');
        typingDotEl.className = 'rolla-typing';
        typingDotEl.innerHTML = `
            <div class="rolla-typing-dot"></div>
            <div class="rolla-typing-dot"></div>
            <div class="rolla-typing-dot"></div>
        `;
        
        typingEl.appendChild(avatarEl);
        typingEl.appendChild(typingDotEl);
        
        this.messagesContainer.appendChild(typingEl);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        const indicator = document.getElementById('rollaTypingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    showSuggestions(chips) {
        this.suggestionsContainer.innerHTML = '';
        chips.forEach(chip => {
            const button = document.createElement('button');
            button.className = 'rolla-suggestion-chip';
            button.type = 'button';
            button.textContent = chip;
            button.addEventListener('click', () => {
                this.input.value = chip;
                this.handleSend();
            });
            this.suggestionsContainer.appendChild(button);
        });
    }
    
    formatMarkdown(text) {
        // Simple formatter for bold and links
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/\n/g, '<br>');
    }
    
    handleSend() {
        const query = this.input.value.trim();
        if (!query) return;
        
        this.addMessage('user', query);
        this.input.value = '';
        
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.processQuery(query);
        }, 800 + Math.random() * 600); // realistic delay
    }
    
    processQuery(query) {
        const lowerQuery = query.toLowerCase().trim();
        let response = '';
        let suggestions = [];
        let shouldScrollTo = null;
        
        // Help / greetings
        if (this.containsAny(lowerQuery, ['hi', 'hello', 'hey', 'greetings', 'sup', 'welcome'])) {
            response = `Hello! Always great to meet new people. I'm ready to answer any questions you have about my engineering journey. Try asking about my **skills**, **projects**, or how to **contact** me.`;
            suggestions = ['Tell me about yourself 👨‍💻', 'Show your projects 🚀', 'What are your skills? 🧠'];
        }
        // About / Who are you
        else if (this.containsAny(lowerQuery, ['who are you', 'about', 'bio', 'background', 'yourself', 'kotesh', 'koteswara'])) {
            response = `I'm **Sankula Koteswara Rao** (you can call me Kotesh). I'm an aspiring **AI & ML Engineer** and full-stack web developer currently pursuing my B.Tech. I enjoy writing python automation scripts and building modern, responsive web systems.`;
            suggestions = ['What are your skills? 🧠', 'Show your projects 🚀', 'Education details 🎓'];
            shouldScrollTo = 'about';
        }
        // Skills / Tech Stack
        else if (this.containsAny(lowerQuery, ['skills', 'skill', 'languages', 'technologies', 'tech', 'stack', 'frameworks'])) {
            response = `Here is my tech stack:\n\n` +
                       `• **Languages**: ${this.portfolioData.skills.languages.join(', ')}\n` +
                       `• **Web Frameworks**: ${this.portfolioData.skills.frameworks.join(', ')}\n` +
                       `• **Tools & Specializations**: ${this.portfolioData.skills.tools.join(', ')}`;
            suggestions = ['Show your projects 🚀', 'Tell me about achievements 🏆', 'Get contact info 📞'];
            shouldScrollTo = 'brands'; // the Tech stack section id is "brands"
        }
        // Experience / Work / Internship
        else if (this.containsAny(lowerQuery, ['experience', 'work', 'job', 'internship', 'intern', 'flipkart', 'rolla', 'techno future'])) {
            response = `Here is a summary of my work experience:\n\n` +
                       `• **Coordinator** at **Techno Future India** (May 2026 - Present)\n` +
                       `  Guiding student cohorts through MERN Stack concepts and software development practices.\n\n` +
                       `• **Founder** at **Rolla** (May 2026 - Present)\n` +
                       `  Managing custom Django & MERN stack web development solutions integrated with AI workflows.\n\n` +
                       `• **Python Developer Intern** at **Flipkart** (Sep 2025 - Feb 2026)\n` +
                       `  Built Flask RESTful APIs and optimized manual operations using Python console automation tools.\n\n` +
                       `You can find more detail in the Work Experience timeline on my page.`;
            suggestions = ['Download resume 📄', 'Show your projects 🚀', 'Get contact info 📞'];
            shouldScrollTo = 'experience';
        }
        // Projects List
        else if (this.containsAny(lowerQuery, ['projects', 'project', 'built', 'showcase', 'portfolio'])) {
            response = `I have completed **10+ projects** in AI & ML, Python, and Full-Stack web dev. Some of my favorites are:\n\n` +
                       `1. **Rolla AI** — A custom web agency & SaaS development platform.\n` +
                       `2. **Hospital Chatbot** — An AI agent for patient inquiries & appointments.\n` +
                       `3. **QR Code Generator** — High-res, customizable QR code generator.\n` +
                       `4. **ELMS** — Full-stack Employee Leave Management System.\n\n` +
                       `Ask me about any specific project (e.g. "tell me about Rolla AI") or ask for live demo links!`;
            suggestions = ['Rolla AI details ✨', 'Hospital Chatbot details 🤖', 'Give me live demo links 🔗', 'Get contact info 📞'];
            shouldScrollTo = 'projects';
        }
        // Specific Project: Rolla AI
        else if (this.containsAny(lowerQuery, ['rolla', 'rolla ai', 'agency', 'web agency'])) {
            const p = this.portfolioData.projects[0];
            response = `**${p.title}**:\n${p.description}\n\n` +
                       `• **Tech**: ${p.tech.join(', ')}\n` +
                       `• [Live Demo](${p.live})\n` +
                       `• [GitHub Profile](${p.github})`;
            suggestions = ['Hospital Chatbot details 🤖', 'ELMS details 📄', 'Show other projects 🚀'];
            shouldScrollTo = 'projects';
        }
        // Specific Project: Hospital Chatbot
        else if (this.containsAny(lowerQuery, ['hospital chatbot', 'hospital', 'medical chatbot'])) {
            const p = this.portfolioData.projects[1];
            response = `**${p.title}**:\n${p.description}\n\n` +
                       `• **Tech**: ${p.tech.join(', ')}\n` +
                       `• [Live Demo](${p.live})\n` +
                       `• [GitHub Repository](${p.github})`;
            suggestions = ['Rolla AI details ✨', 'ELMS details 📄', 'QR Code Generator details 📱', 'Show other projects 🚀'];
            shouldScrollTo = 'projects';
        }
        // Specific Project: QR Code Generator
        else if (this.containsAny(lowerQuery, ['qr code generator', 'qr generator', 'qr code'])) {
            const p = this.portfolioData.projects[2];
            response = `**${p.title}**:\n${p.description}\n\n` +
                       `• **Tech**: ${p.tech.join(', ')}\n` +
                       `• [Live Demo](${p.live})\n` +
                       `• [GitHub Repository](${p.github})`;
            suggestions = ['Rolla AI details ✨', 'Hospital Chatbot details 🤖', 'ELMS details 📄', 'Show other projects 🚀'];
            shouldScrollTo = 'projects';
        }
        // Specific Project: ELMS
        else if (this.containsAny(lowerQuery, ['elms', 'leave management', 'leave'])) {
            const p = this.portfolioData.projects[3];
            response = `**${p.title}**:\n${p.description}\n\n` +
                       `• **Tech**: ${p.tech.join(', ')}\n` +
                       `• [Live Demo](${p.live})\n` +
                       `• [GitHub Repository](${p.github})`;
            suggestions = ['Hospital Chatbot details 🤖', 'College ERP details 🏫', 'Show other projects 🚀'];
            shouldScrollTo = 'projects';
        }
        // Specific Project: ERP Portal
        else if (this.containsAny(lowerQuery, ['erp portal', 'erp', 'college erp', 'portal'])) {
            const p = this.portfolioData.projects[4];
            response = `**${p.title}**:\n${p.description}\n\n` +
                       `• **Tech**: ${p.tech.join(', ')}\n` +
                       `• [GitHub Repository](${p.github})`;
            suggestions = ['Rolla AI details ✨', 'ELMS details 📄', 'Show other projects 🚀'];
            shouldScrollTo = 'projects';
        }
        // Live links
        else if (this.containsAny(lowerQuery, ['live demo', 'live links', 'demos', 'links'])) {
            response = `Here are my live links:\n\n` +
                       `• [Rolla AI Agency](https://rolla-ai.vercel.app/)\n` +
                       `• [Hospital Chatbot](https://hospitalchatbot04.streamlit.app)\n` +
                       `• [QR Code Generator](https://qr-generator04.streamlit.app)\n` +
                       `• [ELMS](https://elms-3.onrender.com)`;
            suggestions = ['Rolla AI details ✨', 'Hospital Chatbot details 🤖', 'Show other projects 🚀'];
        }
        // Education
        else if (this.containsAny(lowerQuery, ['education', 'college', 'study', 'timeline', 'cgpa', 'ciet', 'university'])) {
            response = `My educational path:\n\n` +
                       `• **B.Tech in AI & ML** (2023 - 2027) at CIET, Lam. CGPA: 7.80. Focus on ML, algorithms, data structures.\n` +
                       `• **Intermediate (12th Grade)** (2021 - 2023) at Sri Saraswathi Jr College. Percentage: 90.07%.\n` +
                       `• **SSC (10th Grade)** (2020 - 2021) at Govt Z Z P H School. Percentage: 97.00%.`;
            suggestions = ['Show achievements 🏆', 'What are your skills? 🧠', 'Get contact info 📞'];
            shouldScrollTo = 'education';
        }
        // Contact
        else if (this.containsAny(lowerQuery, ['contact', 'email', 'phone', 'reach', 'hire', 'linkedin', 'github', 'socials', 'call'])) {
            response = `I would love to connect! You can reach me here:\n\n` +
                       `• **Email**: [srkotesh23@gmail.com](mailto:srkotesh23@gmail.com)\n` +
                       `• **Phone**: +91 9182015717\n` +
                       `• **LinkedIn**: [LinkedIn Profile](${this.portfolioData.linkedin})\n` +
                       `• **GitHub**: [GitHub Profile](${this.portfolioData.github})\n` +
                       `• **Location**: Bapatla, AP, India`;
            suggestions = ['Download resume 📄', 'Show your projects 🚀', 'What are your skills? 🧠'];
            shouldScrollTo = 'contact';
        }
        // Resume / CV
        else if (this.containsAny(lowerQuery, ['resume', 'cv', 'download resume', 'download cv'])) {
            response = `Sure thing! You can download my resume using this link:\n\n` +
                       `• [Download Sankula_Koteswara_Rao_Resume.pdf](./assets/Sankula_Koteswara_Rao_Resume.pdf)\n\n` +
                       `I'm currently open to internships and full-time junior AI or web development roles!`;
            suggestions = ['Get contact info 📞', 'Show your projects 🚀', 'What are your skills? 🧠'];
        }
        // Achievements / Certifications
        else if (this.containsAny(lowerQuery, ['achievements', 'achievement', 'certifications', 'certification', 'certified', 'awards'])) {
            response = `Here are my key achievements & certifications:\n\n` +
                       `• **Certified AI & ML Engineer** (2025) — Issued by Freedom With AI\n` +
                       `• **MERN Stack Training Certificate** (2025) — Chalapathi Institute Of Engineering & Technology\n` +
                       `• Completed 9+ practical projects in Python and Javascript.\n` +
                       `• Maintained a B.Tech CGPA of 7.80.`;
            suggestions = ['What are your skills? 🧠', 'Show your projects 🚀', 'Education details 🎓'];
            shouldScrollTo = 'education'; // Achievements are in education timeline
        }
        // Default
        else {
            response = `I'm not sure if I understand that. I can tell you about my **projects**, **skills**, **education**, **achievements**, or how to **contact** me. Try using one of the quick suggestions below!`;
            suggestions = ['Tell me about yourself 👨‍💻', 'Show your projects 🚀', 'What are your skills? 🧠', 'Get contact info 📞'];
        }
        
        this.addMessage('assistant', response);
        this.showSuggestions(suggestions);
        
        if (shouldScrollTo) {
            const target = document.getElementById(shouldScrollTo);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
    
    containsAny(str, words) {
        return words.some(word => str.includes(word));
    }
}
