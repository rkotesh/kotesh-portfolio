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
    const tiltElements = document.querySelectorAll('.project-card, .highlight-card, .education-card, .social-link, .hero-image-wrapper');
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
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .form-submit, .otw-cta, .nav-links a, .nav-logo');
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
        }
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
});
