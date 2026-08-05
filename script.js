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
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', () => {
            const isOpen = links.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close mobile nav when clicking a link
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
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

    // Slot-roll headings and body-copy reveals inspired by animated text and scroll-reveal UI kits.
    const sectionHeadings = document.querySelectorAll('.split-flip-heading');
    sectionHeadings.forEach(heading => {
        const text = heading.textContent.trim();
        heading.setAttribute('aria-label', text);
        heading.innerHTML = '';

        [...text].forEach((char, index) => {
            const charEl = document.createElement('span');
            charEl.className = char === ' ' ? 'split-char split-space' : 'split-char';
            charEl.textContent = char === ' ' ? '\u00A0' : char;
            charEl.dataset.char = char === ' ' ? '\u00A0' : char;
            charEl.style.setProperty('--char-index', index);
            heading.appendChild(charEl);
        });
    });

    const motionText = document.querySelectorAll(
        '.section-label, .section-headline, .about-text p, .highlight-card p, .experience-body p, .experience-body li, .education-body p, .education-body li, .certificate-info p, .project-info p, .contact-info p, .contact-email, .social-link, .otw-label, .otw-role'
    );
    motionText.forEach((el, index) => {
        el.classList.add('text-dust-reveal');
        el.style.setProperty('--copy-delay', `${Math.min(index % 8, 7) * 45}ms`);
    });

    const showMotionElement = el => {
        el.classList.add('visible');
        if (el.classList.contains('split-flip-heading')) {
            el.closest('.section-header')?.classList.add('visible');
            el.querySelectorAll('.split-char').forEach((char, index) => {
                char.style.animationDelay = `${index * 44}ms`;
                char.classList.add('flip-in');
            });
        }
    };

    if ('IntersectionObserver' in window) {
        const headingObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showMotionElement(entry.target);
                    headingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.45 });

        sectionHeadings.forEach(heading => headingObserver.observe(heading));

        const copyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    copyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        motionText.forEach(el => copyObserver.observe(el));
    } else {
        sectionHeadings.forEach(showMotionElement);
        motionText.forEach(el => el.classList.add('visible'));
    }

    // Interactive 3D Perspective Card Tilt Effect & Card Spotlight hover tracker
    // Interactive 3D Perspective Card Tilt Effect & Card Spotlight hover tracker for ALL CARDS
    const tiltElements = document.querySelectorAll('.project-card, .highlight-card, .education-card, .experience-card, .certificate-card, .skills-category, .social-link, .contact-form-card, .hero-image-wrapper');
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

    // Interactive Magnetic Hover Pull Effect on Buttons, Nav Links, Orbit Pills & Skill Badges
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .form-submit, .otw-cta, .rolla-fab, .rolla-send-btn, .floating-orbit-pill, .skill-tag');
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
            githubLink: "https://github.com/rkotesh/rolla-ai"
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
            tags: ["Python", "Flask", "REST APIs", "HTML", "CSS", "JavaScript"],
            description: "A production-grade full-stack Employee Leave Management System built during the Flipkart internship to digitize leave applications, secure approvals, and support real employee workflows.",
            highlights: [
                "Designed secure user authentication for employee and manager workflows.",
                "Integrated RESTful API patterns with responsive front-end screens.",
                "Built to replace manual leave tracking with scalable digital request flows."
            ],
            liveLink: "https://elms-3.onrender.com",
            githubLink: "https://github.com/rkotesh/elms"
        },
        personal_portfolio: {
            title: "Personal Developer Portfolio",
            tags: ["HTML", "CSS", "JavaScript", "Vercel"],
            description: "A full-stack personal portfolio deployed on Vercel to showcase projects in Python, Django, Flask, automation, certifications, education, contact details, and an interactive portfolio assistant.",
            highlights: [
                "Built with responsive HTML, CSS, and JavaScript for smooth navigation across devices.",
                "Highlights live projects, certificates, education, and social links in one recruiter-friendly experience.",
                "Includes an interactive assistant that answers questions about skills, projects, resume, and contact details."
            ],
            liveLink: "https://kotesh-portfolio-nine.vercel.app/",
            githubLink: "https://github.com/rkotesh/kotesh-portfolio"
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
        
        college_website: {
            title: "College Website",
            tags: ["TypeScript", "Vercel"],
            description: "A deployed college website repository built with TypeScript and maintained as one of the most active recent GitHub projects.",
            highlights: [
                "Deployed on Vercel with a public live site.",
                "Maintained through frequent recent GitHub pushes.",
                "Organized as part of a growing public repository portfolio."
            ],
            liveLink: "https://college-website-omega-flax.vercel.app",
            githubLink: "https://github.com/rkotesh/college_website"
        },
        
        nandini: {
            title: "Nandini",
            tags: ["Python", "Utility"],
            description: "An open-source repository for Nandini built to solve development challenges.",
            highlights: [
                "Implemented robust application structures.",
                "Fully configured for easy deployment and local testing.",
                "Built using Python."
            ],
            liveLink: "",
            githubLink: "https://github.com/rkotesh/nandini"
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
            linkedin: 'https://www.linkedin.com/in/sankula-koteswararao/',
            github: 'https://github.com/rkotesh',
            portfolio: 'https://kotesh-portfolio-nine.vercel.app/',
            linkedinStats: {
                followers: '735',
                connections: '500+',
                handle: 'sankula-koteswararao',
                service: 'Web Development',
                focus: 'Python and Django development, AI tools learning, project updates, and recruiter-facing career posts'
            },
            githubStats: {
                username: 'rkotesh',
                publicRepos: '12',
                followers: '3',
                following: '8',
                recentPushEvents: '42',
                recentPullRequestEvents: '4',
                activeRepos: ['college_website', 'ciet_erp', 'kotesh-portfolio', 'asset-management-spa'],
                focus: 'Python, Django, REST APIs, React, MERN, and practical portfolio deployments'
            },
            services: ['Web Development'],
            articles: [
                'Transformative Learning Experience at the be10x AI Tools Workshop!',
                'My Experience Attending the AI Masterclass by Avinash Mada',
                'The Interview Integrity Crisis: Why Modern Hiring Demands Smarter Protection'
            ],
            education: [
                {
                    degree: 'B.Tech in AI & ML',
                    institution: 'Chalapathi Institute Of Engineering & Technology, Lam',
                    period: '2023 – 2027',
                    details: 'Focusing on advanced AI concepts, data structures, machine learning algorithms, and practical applications. Currently holding a B.Tech CGPA of 8.03.'
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
                    role: 'Python Development Intern',
                    company: 'Flipkart',
                    period: 'Aug 2025 – Jan 2026',
                    location: 'Remote (Bengaluru, India)',
                    details: 'Completed the 6-Month Launchpad Student Internship Programme at Flipkart in the Python Development domain, organised by Corvyx. Worked on Python development projects in an e-commerce environment and gained hands-on experience in software development practices.'
                },
                /* AUTO_CHATBOT_EXPERIENCES_MARKER */
            ],
            skills: {
                languages: ['HTML', 'CSS', 'JavaScript', 'Python', 'MySQL'],
                frameworks: ['Bootstrap', 'Streamlit', 'Flask', 'Django', 'React (MERN Stack)', 'REST APIs'],
                tools: ['Prompt Engineering', 'Git', 'GitHub', 'VS Code', 'Canva', 'AI Tools', 'Vercel']
            },
            projects: [
                {
                    id: 'rolla_ai',
                    title: 'Rolla AI — Custom Web Agency',
                    tech: ['MERN Stack', 'Django', 'Next.js', 'Tailwind CSS'],
                    description: 'A premium, professional digital web agency and custom software development platform featuring sub-second page performance, modern glassmorphic designs, responsive UI/UX, and highly optimized SEO structures.',
                    live: 'https://rolla-ai.vercel.app/',
                    github: 'https://github.com/rkotesh/rolla-ai'
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
                    tech: ['Python', 'Flask', 'REST APIs', 'HTML', 'CSS', 'JavaScript'],
                    description: 'A production-grade full-stack Employee Leave Management System built during the Flipkart internship, with secure authentication, RESTful API integration, and responsive employee workflows.',
                    live: 'https://elms-3.onrender.com',
                    github: 'https://github.com/rkotesh/elms'
                },
                {
                    id: 'personal_portfolio',
                    title: 'Personal Developer Portfolio',
                    tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
                    description: 'A personal developer portfolio deployed on Vercel to showcase projects, skills, education, certifications, contact details, and an interactive portfolio assistant.',
                    live: 'https://kotesh-portfolio-nine.vercel.app/',
                    github: 'https://github.com/rkotesh/kotesh-portfolio'
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
                
                {
                    id: 'college_website',
                    title: 'College Website',
                    tech: ['TypeScript', 'Vercel'],
                    description: 'A deployed college website repository built with TypeScript and maintained as one of the most active recent GitHub projects.',
                    live: 'https://college-website-omega-flax.vercel.app',
                    github: 'https://github.com/rkotesh/college_website'
                },
                
                {
                    id: 'nandini',
                    title: 'Nandini',
                    tech: ['Python', 'Utility'],
                    description: 'An open-source repository for Nandini built to solve development challenges.',
                    github: 'https://github.com/rkotesh/nandini'
                },
                
                /* AUTO_CHATBOT_PROJECTS_MARKER */
            ],
            certifications: [
                'Certified AI & ML Engineer (2025) - Freedom With AI',
                'MERN Stack Training (2025) - Chalapathi Institute Of Engineering & Technology'
            ]
        };

        this.intentMap = {
            greeting: ['hi', 'hello', 'hey', 'greetings', 'sup', 'welcome'],
            about: ['who are you', 'about', 'bio', 'background', 'yourself', 'kotesh', 'koteswara', 'summary', 'intro', 'quick pitch', 'pitch'],
            skills: ['skills', 'skill', 'languages', 'technologies', 'technology', 'tech', 'stack', 'frameworks', 'tools', 'python', 'django', 'react', 'javascript'],
            experience: ['experience', 'work', 'job', 'internship', 'intern', 'flipkart', 'rolla', 'techno future', 'coordinator', 'founder'],
            projects: ['projects', 'project', 'built', 'showcase', 'portfolio', 'work samples', 'case study'],
            github: ['github', 'git hub', 'repositories', 'repository', 'repos', 'repo', 'contribution', 'contributions', 'commits', 'push events', 'pull request', 'pull requests', 'open source'],
            linkedin: ['linkedin', 'followers', 'connections', 'articles', 'article', 'posts', 'profile', 'service', 'services'],
            links: ['live demo', 'live links', 'demos', 'links', 'website', 'open project', 'view project'],
            education: ['education', 'college', 'study', 'timeline', 'cgpa', 'ciet', 'university', 'degree', 'btech'],
            contact: ['contact', 'email', 'phone', 'reach', 'socials', 'call', 'message'],
            resume: ['resume', 'cv', 'download resume', 'download cv', 'profile'],
            achievements: ['achievements', 'achievement', 'certifications', 'certification', 'certified', 'awards', 'certificate'],
            hire: ['why hire', 'hire you', 'available', 'open to work', 'strength', 'fit', 'role']
        };

        this.projectAliases = {
            rolla_ai: ['rolla', 'rolla ai', 'agency', 'web agency', 'saas'],
            hospital_chatbot: ['hospital chatbot', 'hospital', 'medical chatbot', 'patient'],
            qr_generator: ['qr code generator', 'qr generator', 'qr code', 'qr'],
            elms: ['elms', 'leave management', 'leave'],
            ciet_erp: ['erp portal', 'erp', 'college erp', 'portal'],
            inventory_system: ['inventory', 'billing', 'inventory billing'],
            automation_system: ['automation', 'automated system', 'automation system'],
            asset_management_spa: ['asset', 'asset management', 'spa'],
            feedback_monitoring_system: ['feedback', 'feedback monitoring'],
            weather_forecast: ['weather', 'forecast', 'weather forecast'],
            personal_portfolio: ['personal portfolio', 'developer portfolio', 'portfolio site', 'vercel portfolio', 'kotesh portfolio']
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
        this.addMessage('assistant', `Hi, I'm **Kotesh AI**. I can give recruiters a quick overview, explain projects, find live links, open the resume, or jump to the right section of this portfolio.`);
        
        this.showSuggestions([
            'Give me a quick pitch',
            'Best projects for hiring',
            'LinkedIn profile',
            'GitHub contributions',
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

    getIntent(query) {
        const scores = Object.entries(this.intentMap).map(([intent, keywords]) => {
            const score = keywords.reduce((total, keyword) => {
                return total + (query.includes(keyword) ? keyword.length : 0);
            }, 0);
            return { intent, score };
        }).sort((a, b) => b.score - a.score);

        return scores[0]?.score > 0 ? scores[0].intent : 'unknown';
    }

    findProject(query) {
        const normalizedQuery = this.normalize(query);
        const aliasMatch = Object.entries(this.projectAliases).find(([, aliases]) => {
            return aliases.some(alias => normalizedQuery.includes(this.normalize(alias)));
        });

        if (aliasMatch) {
            return this.portfolioData.projects.find(project => project.id === aliasMatch[0]);
        }

        return this.portfolioData.projects.find(project => {
            const title = this.normalize(project.title);
            const tech = this.normalize(project.tech.join(' '));
            return title.split(' ').some(part => part.length > 3 && normalizedQuery.includes(part)) ||
                project.tech.some(item => normalizedQuery.includes(this.normalize(item))) ||
                tech.includes(normalizedQuery);
        });
    }

    normalize(value) {
        return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    }

    formatProject(project) {
        const links = [
            project.live ? `• [Live Demo](${project.live})` : '',
            project.github ? `• [GitHub Repository](${project.github})` : ''
        ].filter(Boolean).join('\n');

        return `**${project.title}**\n${project.description}\n\n` +
               `• **Tech**: ${project.tech.join(', ')}\n` +
               `${links}`;
    }

    getLiveLinks() {
        const links = this.portfolioData.projects
            .filter(project => project.live)
            .map(project => `• [${project.title}](${project.live})`);

        return `Here are the live demos I can show right now:\n\n${links.join('\n')}`;
    }

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    processQuery(query) {
        const lowerQuery = query.toLowerCase().trim();
        let response = '';
        let suggestions = [];
        let shouldScrollTo = null;
        const intent = this.getIntent(lowerQuery);
        const matchedProject = this.findProject(lowerQuery);

        if (this.containsAny(lowerQuery, ['open resume', 'download resume', 'resume download', 'get cv', 'download cv'])) {
            window.open('./assets/Sankula_Koteswara_Rao_Resume.pdf', '_blank', 'noopener');
        }
        
        // Help / greetings
        if (intent === 'greeting') {
            response = `Hello! I can help you scan Kotesh's portfolio fast. Ask for a **quick pitch**, **best projects**, **skills**, **resume**, or **contact details**.`;
            suggestions = ['Give me a quick pitch', 'LinkedIn profile', 'GitHub contributions'];
        }
        // About / Who are you
        else if (intent === 'about') {
            response = `**Sankula Koteswara Rao** is a final-year **B.Tech AI & ML** student, aspiring **Python & Django Developer**, and web development service provider focused on Python, Flask/Django, React, REST APIs, and practical AI tooling.\n\nQuick snapshot:\n• CIET student with 8.03 CGPA\n• ${this.portfolioData.linkedinStats.followers} LinkedIn followers and ${this.portfolioData.linkedinStats.connections} connections\n• ${this.portfolioData.githubStats.publicRepos} public GitHub repositories at @${this.portfolioData.githubStats.username}\n• Flipkart Python Development internship\n• Builds projects across AI, automation, and full-stack web`;
            suggestions = ['LinkedIn profile', 'GitHub contributions', 'Show skills'];
            shouldScrollTo = 'about';
        }
        // Skills / Tech Stack
        else if (intent === 'skills') {
            response = `Here is my tech stack:\n\n` +
                       `• **Languages**: ${this.portfolioData.skills.languages.join(', ')}\n` +
                       `• **Web Frameworks**: ${this.portfolioData.skills.frameworks.join(', ')}\n` +
                       `• **Tools & Specializations**: ${this.portfolioData.skills.tools.join(', ')}\n\n` +
                       `Strongest fit: Python-backed web apps, Django/Flask APIs, React interfaces, and AI workflow automation.`;
            suggestions = ['Best projects for hiring', 'Tell me about experience', 'Contact Kotesh'];
            shouldScrollTo = 'brands'; // the Tech stack section id is "brands"
        }
        // LinkedIn profile / articles / services
        else if (intent === 'linkedin') {
            response = `LinkedIn profile highlights:\n\n` +
                       `• **Profile**: [${this.portfolioData.linkedinStats.handle}](${this.portfolioData.linkedin})\n` +
                       `• **Followers**: ${this.portfolioData.linkedinStats.followers}\n` +
                       `• **Connections**: ${this.portfolioData.linkedinStats.connections}\n` +
                       `• **Service listed**: ${this.portfolioData.linkedinStats.service}\n` +
                       `• **Website links**: [Portfolio](${this.portfolioData.portfolio}), [GitHub](${this.portfolioData.github}), [Rolla AI](https://rolla-ai.vercel.app/)\n\n` +
                       `Content focus: ${this.portfolioData.linkedinStats.focus}.\n\n` +
                       `Recent article topics include AI tools workshops, AI masterclass learning, and interview integrity in modern hiring.`;
            suggestions = ['GitHub contributions', 'Best projects for hiring', 'Contact Kotesh'];
            shouldScrollTo = 'linkedin';
        }
        // GitHub / Contributions
        else if (intent === 'github') {
            response = `GitHub snapshot for **@${this.portfolioData.githubStats.username}**:\n\n` +
                       `• **Profile**: [github.com/rkotesh](${this.portfolioData.github})\n` +
                       `• **Public repositories**: ${this.portfolioData.githubStats.publicRepos}\n` +
                       `• **Recent public push events**: ${this.portfolioData.githubStats.recentPushEvents}\n` +
                       `• **Recent pull request events**: ${this.portfolioData.githubStats.recentPullRequestEvents}\n` +
                       `• **Followers / following**: ${this.portfolioData.githubStats.followers} / ${this.portfolioData.githubStats.following}\n` +
                       `• **Active repos**: ${this.portfolioData.githubStats.activeRepos.join(', ')}\n\n` +
                       `Main contribution focus: ${this.portfolioData.githubStats.focus}.`;
            suggestions = ['Best projects for hiring', 'Show live demos', 'Contact Kotesh'];
            shouldScrollTo = 'github';
        }
        // Experience / Work / Internship
        else if (intent === 'experience') {
            response = `Here is a summary of my work experience:\n\n` +
                       `• **Coordinator** at **Techno Future India** (May 2026 - Present)\n` +
                       `  Guiding student cohorts through MERN Stack concepts and software development practices.\n\n` +
                       `• **Founder** at **Rolla** (May 2026 - Present)\n` +
                       `  Managing custom Django & MERN stack web development solutions integrated with AI workflows.\n\n` +
                       `• **Python Development Intern** at **Flipkart** (Aug 2025 - Jan 2026)\n` +
                       `  Completed the Launchpad Student Internship Programme by Corvyx x Flipkart in the Python Development domain.\n\n` +
                       `You can find more detail in the Work Experience timeline on my page.`;
            suggestions = ['Download resume', 'Show projects', 'Contact Kotesh'];
            shouldScrollTo = 'experience';
        }
        // Hiring fit
        else if (intent === 'hire') {
            response = `Kotesh is a good fit for **junior web developer**, **Python developer**, **AI tools**, or **internship** roles because he combines:\n\n` +
                       `• Python and full-stack project practice\n` +
                       `• Real internship exposure through Flipkart Launchpad\n` +
                       `• AI & ML academic background\n` +
                       `• ${this.portfolioData.githubStats.publicRepos} public GitHub repositories with recent contribution activity\n\n` +
                       `For a recruiter, I would start with Rolla AI, ELMS, Personal Developer Portfolio, Hospital Chatbot, and QR Code Generator.`;
            suggestions = ['LinkedIn profile', 'GitHub contributions', 'Contact Kotesh'];
            shouldScrollTo = 'projects';
        }
        // Specific Project
        else if (matchedProject && !['education', 'contact', 'projects', 'links', 'linkedin'].includes(intent)) {
            response = this.formatProject(matchedProject);
            suggestions = ['Show live demos', 'Best projects for hiring', 'Contact Kotesh'];
            shouldScrollTo = 'projects';
        }
        // Projects List
        else if (intent === 'projects') {
            response = `Strong portfolio picks:\n\n` +
                       `1. **Rolla AI** — Custom web agency and SaaS development platform.\n` +
                       `2. **ELMS** — Flask and REST API leave management system built during the Flipkart internship.\n` +
                       `3. **Personal Developer Portfolio** — Vercel-deployed HTML/CSS/JS portfolio.\n` +
                       `4. **College Website** — TypeScript deployed college website from the current GitHub activity.\n` +
                       `5. **Hospital Chatbot** — AI assistant for patient inquiries and appointments.\n\n` +
                       `You can ask about a specific project by name, or ask for all live demo links.`;
            suggestions = ['Rolla AI details', 'GitHub contributions', 'Show live demos', 'Contact Kotesh'];
            shouldScrollTo = 'projects';
        }
        // Live links
        else if (intent === 'links') {
            response = this.getLiveLinks();
            suggestions = ['Rolla AI details', 'Hospital Chatbot details', 'Show projects'];
            shouldScrollTo = 'projects';
        }
        // Education
        else if (intent === 'education') {
            response = `My educational path:\n\n` +
                       `• **B.Tech in AI & ML** (2023 - 2027) at CIET, Lam. CGPA: 8.03. Focus on ML, algorithms, data structures.\n` +
                       `• **Intermediate (12th Grade)** (2021 - 2023) at Sri Saraswathi Jr College. Percentage: 90.07%.\n` +
                       `• **SSC (10th Grade)** (2020 - 2021) at Govt Z Z P H School. Percentage: 97.00%.`;
            suggestions = ['Show achievements', 'What are your skills?', 'Contact Kotesh'];
            shouldScrollTo = 'education';
        }
        // Contact
        else if (intent === 'contact') {
            response = `I would love to connect! You can reach me here:\n\n` +
                       `• **Email**: [srkotesh23@gmail.com](mailto:srkotesh23@gmail.com)\n` +
                       `• **Phone**: +91 9182015717\n` +
                       `• **LinkedIn**: [LinkedIn Profile](${this.portfolioData.linkedin})\n` +
                       `• **GitHub**: [GitHub Profile](${this.portfolioData.github})\n` +
                       `• **Location**: Bapatla, AP, India\n` +
                       `• **LinkedIn audience**: ${this.portfolioData.linkedinStats.followers} followers, ${this.portfolioData.linkedinStats.connections} connections\n` +
                       `• **GitHub repos**: ${this.portfolioData.githubStats.publicRepos} public repositories`;
            suggestions = ['Download resume', 'GitHub contributions', 'What are your skills?'];
            shouldScrollTo = 'contact';
        }
        // Resume / CV
        else if (intent === 'resume') {
            response = `Sure thing! You can download my resume using this link:\n\n` +
                       `• [Download Sankula_Koteswara_Rao_Resume.pdf](./assets/Sankula_Koteswara_Rao_Resume.pdf)\n\n` +
                       `I'm currently open to internships and full-time junior AI or web development roles!`;
            suggestions = ['Contact Kotesh', 'Show projects', 'What are your skills?'];
        }
        // Achievements / Certifications
        else if (intent === 'achievements') {
            response = `Here are my key achievements & certifications:\n\n` +
                       `• **Certified AI & ML Engineer** (2025) — Issued by Freedom With AI\n` +
                       `• **MERN Stack Training Certificate** (2025) — Chalapathi Institute Of Engineering & Technology\n` +
                       `• Published ${this.portfolioData.githubStats.publicRepos} public GitHub repositories across Python, JavaScript, HTML/CSS, and TypeScript.\n` +
                       `• Maintained a B.Tech CGPA of 8.03.`;
            suggestions = ['What are your skills?', 'Show projects', 'Education details'];
            shouldScrollTo = 'certificates';
        }
        // Default
        else {
            response = `I can answer portfolio questions, but I may need a clearer keyword. Try asking:\n\n` +
                       `• "What are Kotesh's best projects?"\n` +
                       `• "Why should we hire him?"\n` +
                       `• "Show live demos"\n` +
                       `• "How can I contact him?"`;
            suggestions = ['Give me a quick pitch', 'Best projects for hiring', 'Show live demos', 'Contact Kotesh'];
        }
        
        this.addMessage('assistant', response);
        this.showSuggestions(suggestions);
        
        if (shouldScrollTo) {
            this.scrollToSection(shouldScrollTo);
        }
    }
    
    containsAny(str, words) {
        return words.some(word => str.includes(word));
    }
}

/* ==========================================================================
   NEXT-GEN HIGH-PERFORMANCE ANIMATION ENGINE 
   (OriginKit, AnimMasterLib, Skiper UI, & Vengence UI Inspired)
   ========================================================================== */

// 1. Cosmic Interactive Particle Plasma Canvas Engine (AnimMaster & OriginKit)
(function initCosmicPlasmaCanvas() {
    const canvas = document.getElementById('cosmicPlasmaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = -1000, mouseY = -1000;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2.5 + 1;
            this.baseAlpha = Math.random() * 0.4 + 0.15;
            this.alpha = this.baseAlpha;
            this.color = Math.random() > 0.5 ? '153, 102, 255' : '66, 133, 244';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse proximity repulsion & glow
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                this.alpha = Math.min(0.9, this.baseAlpha + (1 - dist / 180) * 0.7);
                this.x -= (dx / dist) * 0.8;
                this.y -= (dy / dist) * 0.8;
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 16), 70);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby cosmic particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const lineAlpha = (1 - dist / 130) * 0.22;
                    ctx.strokeStyle = `rgba(${particles[i].color}, ${lineAlpha})`;
                    ctx.lineWidth = 0.9;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// 2. Ultra-Fast Laser Trail Sparkles Canvas Engine (AnimMaster & Skiper UI)
(function initLaserTrailCanvas() {
    const canvas = document.getElementById('laserTrailCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let trail = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', e => {
        trail.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 4 + 2,
            alpha: 1,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5
        });
        if (trail.length > 25) trail.shift();
    });

    function drawTrail() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < trail.length; i++) {
            const p = trail[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha *= 0.92;
            p.size *= 0.94;

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(153, 102, 255, ${p.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#9966ff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        trail = trail.filter(p => p.alpha > 0.05);
        requestAnimationFrame(drawTrail);
    }
    drawTrail();
})();

// 3. Ultra-Fast Precision Crosshair & Laser Reticle Cursor Engine (Vengence UI Inspired)
(function initFastPrecisionCursor() {
    const crosshair = document.getElementById('cursorCrosshair');
    const halo = document.getElementById('cursorHalo');
    if (!crosshair || !halo) return;

    let targetX = -100, targetY = -100;
    let haloX = -100, haloY = -100;

    // Zero Latency Core Crosshair
    window.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
        crosshair.style.left = `${targetX}px`;
        crosshair.style.top = `${targetY}px`;
    });

    // High-Speed 0.35 Spring Lerp Outer Halo
    function loop() {
        haloX += (targetX - haloX) * 0.35;
        haloY += (targetY - haloY) * 0.35;
        halo.style.left = `${haloX}px`;
        halo.style.top = `${haloY}px`;
        requestAnimationFrame(loop);
    }
    loop();

    // Hover state on all interactive cards, links, buttons
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .highlight-card, .education-card, .experience-card, .certificate-card, .skills-category, .social-link, .contact-form-card, .skill-tag');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

// 4. Click Water Ripple Effect
window.addEventListener('click', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 650);
});

// 5. Interactive Text Scramble Decoder (Skiper UI & Vengence UI)
(function initTextScramble() {
    const scrambleElements = document.querySelectorAll('.scramble-text');
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    scrambleElements.forEach(el => {
        const originalText = el.getAttribute('data-original') || el.innerText;
        let isScrambling = false;

        function scramble() {
            if (isScrambling) return;
            isScrambling = true;
            el.classList.add('scrambling');

            let iteration = 0;
            const maxIterations = originalText.length * 3;

            const interval = setInterval(() => {
                el.innerText = originalText
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration / 3) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= maxIterations) {
                    clearInterval(interval);
                    el.innerText = originalText;
                    el.classList.remove('scrambling');
                    isScrambling = false;
                }
                iteration++;
            }, 25);
        }

        el.addEventListener('mouseenter', scramble);

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        scramble();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(el);
        }
    });
})();

// 6. ALL Cards Electric Border Beam Auto-Injector (OriginKit & Skiper UI)
(function injectBorderBeamsAllCards() {
    const allCards = document.querySelectorAll('.project-card, .highlight-card, .education-card, .experience-card, .certificate-card, .skills-category, .social-link, .contact-form-card, .otw-container');
    allCards.forEach(el => {
        if (!el.querySelector('.border-beam')) {
            const beam = document.createElement('div');
            beam.className = 'border-beam';
            el.appendChild(beam);
        }
    });
})();

// 7. Dynamic Typewriter Role Switcher (OriginKit & Skiper UI)
(function initTypewriterRoleSwitcher() {
    const el = document.getElementById('typewriterRole');
    if (!el) return;

    const roles = [
        "Open to Opportunities",
        "AI & ML Specialist",
        "Python & Django Developer",
        "Full Stack Web Engineer",
        "Flipkart Launchpad Intern"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            el.innerText = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.innerText = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 35 : 75;

        if (!isDeleting && charIdx === currentRole.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 350;
        }

        setTimeout(type, speed);
    }
    type();
})();



