/**
 * ROLLA AI ASSISTANT
 * An evolving AI-powered Personal Portfolio Assistant
 * Version: 2.1 (Voice & Navigation Enabled)
 */

class RollaAI {
    constructor() {
        // Core Identity
        this.name = "Rolla";
        this.version = "2.1";
        this.currentMode = "casual"; // casual, quick, technical, recruiter

        // DOM Elements
        this.fab = document.getElementById('rolla-fab');
        this.chatWindow = document.getElementById('rolla-chat-window');
        this.closeBtn = document.getElementById('rolla-close');
        this.messagesContainer = document.getElementById('rolla-messages');
        this.input = document.getElementById('rolla-input');
        this.sendBtn = document.getElementById('rolla-send');
        this.voiceBtn = document.getElementById('rolla-voice');
        this.suggestionsContainer = document.getElementById('rolla-suggestions');

        // Voice Recognition Support
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = this.SpeechRecognition ? new this.SpeechRecognition() : null;
        this.isListening = false;

        // Portfolio  Data (Knowledge Boundary)
        this.portfolioData = {
            name: "Sankula Koteswara Rao",
            nickname: "Koteswararao S",
            email: "srkotesh23@gmail.com",
            phone: "+91 9182015717",
            location: "Bapatla, Andhra Pradesh, 523303",
            linkedin: "https://www.linkedin.com/in/sankula-koteswararao",
            github: "https://github.com/rkotesh",

            education: {
                current: {
                    degree: "B.Tech in AI & ML",
                    institution: "Chalapathi Institute Of Engineering & Technology, Lam",
                    period: "2023 - 2027",
                    cgpa: "7.80"
                },
                intermediate: {
                    school: "Sri Saraswathi Jr College, Ongole",
                    period: "2021 - 2023",
                    percentage: "90.07%"
                },
                ssc: {
                    school: "Govt Z P H School, Vaidana",
                    period: "2020 - 2021",
                    percentage: "97.00%"
                }
            },

            skills: {
                frontend: ["HTML/CSS (90%)", "JavaScript (75%)", "Bootstrap (80%)", "React (40%)"],
                programming: ["Python (80%)", "SQL (60%)", "AI Tools (85%)"],
                tools: ["VS Code", "AI Tools", "Canva"]
            },

            projects: [
                {
                    name: "Employee Leave Management System",
                    tech: ["Python", "Flask", "SQLAlchemy", "Jinja2"],
                    description: "A comprehensive system for managing employee leave requests and approvals.",
                    url: "https://elms-3.onrender.com/",
                    type: "web"
                },
                {
                    name: "Hospital Chatbot",
                    tech: ["Python", "Streamlit", "AI"],
                    description: "AI-powered chatbot for hospital information and assistance.",
                    url: "https://hospitalchatbot04.streamlit.app",
                    type: "ai"
                },
                {
                    name: "Weather Chatbot",
                    tech: ["Python", "Streamlit", "AI"],
                    description: "AI-powered chatbot for providing weather updates and forecasts.",
                    url: "https://weatherchatbot04.streamlit.app/",
                    type: "ai"
                },
                {
                    name: "QR Code Generator",
                    tech: ["Python", "Streamlit"],
                    description: "Dynamic QR code generation tool using URLs.",
                    url: "https://qr-generator04.streamlit.app/",
                    type: "utility"
                },
                {
                    name: "Inventory Management & Billing System",
                    tech: ["Python"],
                    description: "A console application for product inventory, order processing, and billing.",
                    url: "https://github.com/rkotesh/inventory_management_and_billing_system.git",
                    type: "utility"
                },
                {
                    name: "Customer Feedback & Sentiment Analyzer",
                    tech: ["Python", "NLTK", "Automation"],
                    description: "Real-time sentiment analysis system with negative feedback alerts and daily reporting.",
                    url: "https://github.com/rkotesh/feedback_monitoring_system",
                    type: "automation"
                },
                {
                    name: "Automated Document Processing System",
                    tech: ["Python", "ReportLab", "PDF Processing"],
                    description: "Enterprise pipeline for document classification, metadata extraction, and report generation.",
                    url: "https://github.com/rkotesh/Automation_System",
                    type: "automation"
                },
                {
                    name: "Scroll-Synced 3D Motion Engine",
                    tech: ["Three.js", "GSAP", "WebGL"],
                    description: "A premium 3D interaction layer integrated into this portfolio. Features a scroll-driven cyber bike with physics-based damping and reactive lighting.",
                    url: "#",
                    type: "feature"
                }
            ],

            achievements: [
                "AI & ML Engineer Certification (2026) - Freedom With AI",
                "MERN Stack Training (2025) - Chalapathi Institute Of Engineering & Technology",
                "05 Projects Completed",
                "7 Technical Skills Mastered",
                "3 Years of Learning Experience"
            ],

            stats: {
                projectsCompleted: 5,
                skills: 7,
                yearsLearning: 3
            }
        };

        // Conversation History
        this.conversationHistory = [];

        // Learning Metrics
        this.metrics = {
            totalInteractions: 0,
            projectViews: {},
            commonQuestions: {},
            modeUsage: { casual: 0, quick: 0, technical: 0, recruiter: 0 },
            engagementQuality: []
        };

        // Initialize
        this.init();
    }

    init() {
        // Event Listeners
        this.fab.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        }

        // Initialize Voice Recognition if supported
        if (this.recognition) {
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.voiceBtn.classList.add('listening');
                this.input.placeholder = "Listening...";
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.voiceBtn.classList.remove('listening');
                this.input.placeholder = "Ask Rolla anything...";
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.input.value = transcript;
                this.sendMessage(); // Auto-send after voice input
            };

            this.recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                this.isListening = false;
                this.voiceBtn.classList.remove('listening');
                this.input.placeholder = "Error. Try again.";
            };
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
            if (this.voiceBtn) this.voiceBtn.style.display = 'none';
        }

        // Show welcome message
        this.showWelcomeMessage();
    }

    toggleVoiceRecognition() {
        if (!this.recognition) return;

        if (this.isListening) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch (e) {
                console.error("Recognition already started");
            }
        }
    }

    toggleChat() {
        this.chatWindow.classList.toggle('hidden');
        if (!this.chatWindow.classList.contains('hidden')) {
            this.input.focus();
        }
    }

    showWelcomeMessage() {
        const welcomeMsg = {
            text: `Hi, I'm **Rolla** — your AI guide to ${this.portfolioData.name}'s portfolio.\n\nI can help you with:\n• **Quick Overview** of skills and projects\n• **Deep Technical** breakdowns\n• **Recruiter-focused** summaries\n• **Project recommendations**\n\nHow can I assist you today?`,
            type: "assistant"
        };
        this.addMessage(welcomeMsg);
        this.showSuggestions([
            "Show me the projects 🚀",
            "What are his skills? 🧠",
            "Tell me about education 🎓",
            "Contact information 📧"
        ]);
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        // Add user message
        this.addMessage({ text, type: "user" });
        this.input.value = '';

        // Process and respond
        this.processMessage(text);

        // Update metrics
        this.metrics.totalInteractions++;
    }

    addMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `rolla-message ${message.type}`;

        const avatar = document.createElement('div');
        avatar.className = 'rolla-avatar';
        avatar.innerHTML = message.type === 'assistant'
            ? '<i class="fas fa-robot"></i>'
            : '<i class="fas fa-user"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'rolla-bubble';
        bubble.innerHTML = this.formatMessage(message.text);

        messageEl.appendChild(avatar);
        messageEl.appendChild(bubble);

        this.messagesContainer.appendChild(messageEl);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Store in history
        this.conversationHistory.push(message);
    }

    formatMessage(text) {
        // Convert markdown-style formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '•');
    }

    showTyping() {
        const typingEl = document.createElement('div');
        typingEl.className = 'rolla-message assistant';
        typingEl.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'rolla-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';

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

    showSuggestions(suggestions) {
        this.suggestionsContainer.innerHTML = '';
        suggestions.forEach(suggestion => {
            const chip = document.createElement('button');
            chip.className = 'rolla-suggestion-chip';
            chip.textContent = suggestion;
            chip.addEventListener('click', () => {
                this.input.value = suggestion.replace(/[🚀🧠🎓📧💼]/g, '').trim();
                this.sendMessage();
            });
            this.suggestionsContainer.appendChild(chip);
        });
    }

    processMessage(userMessage) {
        this.showTyping();

        // Simulate AI processing delay
        setTimeout(() => {
            this.hideTyping();

            // Core Logic: Check for Navigation First
            const navResult = this.checkNavigationIntent(userMessage.toLowerCase());
            if (navResult) {
                this.addMessage({ text: navResult.message, type: "assistant" });
                this.navigate(navResult.targetId);
                return;
            }

            const response = this.generateResponse(userMessage.toLowerCase());
            this.addMessage({ text: response, type: "assistant" });

            // Update suggestions based on context
            this.updateSuggestionsBasedOnContext(userMessage.toLowerCase());
        }, 800);
    }

    // Navigation Logic
    checkNavigationIntent(query) {
        // Simple Intent Recognition
        if (query.includes('go to') || query.includes('navigate to') || query.includes('show me') || query.includes('scroll to')) {
            if (query.includes('home')) return { message: "Navigating to Home...", targetId: "home" };
            if (query.includes('about')) return { message: "Scrolling to About section...", targetId: "about" };
            if (query.includes('skill')) return { message: "Moving to Skills & Expertise...", targetId: "skills" };
            if (query.includes('project')) return { message: "Here are the Projects...", targetId: "projects" };
            if (query.includes('education') || query.includes('academic')) return { message: "Showing Education history...", targetId: "education" };
            if (query.includes('contact') || query.includes('touch')) return { message: "Taking you to Contact info...", targetId: "contact" };
        }
        return null;
    }

    navigate(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Visual feedback: Highlight the section briefly
            section.classList.add('highlight-section');
            setTimeout(() => section.classList.remove('highlight-section'), 2000);
        }
    }

    generateResponse(query) {
        // Detect intent and mode
        const mode = this.detectMode(query);
        this.currentMode = mode;
        this.metrics.modeUsage[mode]++;

        // Project-related queries
        if (this.matchesIntent(query, ['project', 'work', 'built', 'developed', 'portfolio'])) {
            return this.getProjectsResponse(mode);
        }

        // Skills queries
        if (this.matchesIntent(query, ['skill', 'technology', 'tech stack', 'know', 'programming'])) {
            return this.getSkillsResponse(mode);
        }

        // Education queries
        if (this.matchesIntent(query, ['education', 'study', 'college', 'degree', 'cgpa', 'academic'])) {
            return this.getEducationResponse(mode);
        }

        // Contact queries
        if (this.matchesIntent(query, ['contact', 'email', 'phone', 'reach', 'connect', 'linkedin'])) {
            return this.getContactResponse(mode);
        }

        // Specific project queries
        for (const project of this.portfolioData.projects) {
            if (query.includes(project.name.toLowerCase()) ||
                project.tech.some(tech => query.includes(tech.toLowerCase()))) {
                this.trackProjectView(project.name);
                return this.getProjectDetailResponse(project, mode);
            }
        }

        // About/Overview queries
        if (this.matchesIntent(query, ['about', 'who', 'overview', 'summary', 'tell me'])) {
            return this.getAboutResponse(mode);
        }

        // Hiring/Opportunity queries
        if (this.matchesIntent(query, ['hire', 'available', 'opportunity', 'internship', 'job'])) {
            return this.getHiringResponse();
        }

        // Default response
        return this.getDefaultResponse();
    }

    detectMode(query) {
        if (this.matchesIntent(query, ['technical', 'architecture', 'how', 'algorithm', 'design pattern'])) {
            return 'technical';
        }
        if (this.matchesIntent(query, ['recruiter', 'hire', 'cv', 'resume', 'qualification'])) {
            return 'recruiter';
        }
        if (this.matchesIntent(query, ['quick', 'brief', 'summary', 'short'])) {
            return 'quick';
        }
        return 'casual';
    }

    matchesIntent(query, keywords) {
        return keywords.some(keyword => query.includes(keyword));
    }

    getProjectsResponse(mode) {
        const projects = this.portfolioData.projects;

        if (mode === 'quick') {
            return `**${this.portfolioData.name}** has completed **${projects.length} projects**:\n\n${projects.slice(0, 3).map(p => `• **${p.name}** (${p.tech[0]})`).join('\n')}\n\nWant details on any specific project?`;
        }

        if (mode === 'technical') {
            return `Here's a **technical breakdown** of key projects:\n\n${projects.map(p =>
                `**${p.name}**\n  Stack: ${p.tech.join(', ')}\n  Architecture: ${this.getTechnicalDetail(p.name)}\n  Live: ${p.url}`
            ).join('\n\n')}`;
        }

        if (mode === 'recruiter') {
            return `**Project Portfolio (${projects.length} completed)**:\n\n${projects.map(p =>
                `• **${p.name}** — ${p.description}\n  Technologies: ${p.tech.join(', ')}\n  Impact: Production-ready application`
            ).join('\n\n')}\n\n**Demonstrates:** Full-stack development, AI integration, system design.`;
        }

        // Casual mode
        return `${this.portfolioData.name} has built some really cool projects! Here are the highlights:\n\n${projects.map(p =>
            `**${p.name}**\n${p.description}\n[View Live Demo](${p.url})`
        ).join('\n\n')}\n\nWhich one would you like to explore?`;
    }

    getTechnicalDetail(projectName) {
        const details = {
            "Employee Leave Management System": "MVC pattern with Flask backend, SQLAlchemy ORM for database management, Jinja2 templating",
            "Hospital Chatbot": " NLP-powered conversational AI with Streamlit frontend, real-time query processing",
            "Weather Chatbot": "API-integrated chatbot with dynamic weather data fetching and conversational interface",
            "QR Code Generator": "Server-side QR encoding with customizable parameters and bulk generation support",
            "Inventory Management & Billing System": "Console-based CRUD operations with file-based persistence",
            "Customer Feedback & Sentiment Analyzer": "Rule-based sentiment engine with regex pattern matching and automated logging pipeline",
            "Automated Document Processing System": "Multi-format ingest pipeline utilizing pdfplumber and ReportLab for automated report generation"
        };
        return details[projectName] || "Full-stack implementation with modern best practices";
    }

    getProjectDetailResponse(project, mode) {
        if (mode === 'technical') {
            return `**${project.name} — Technical Deep Dive**\n\n**Stack:** ${project.tech.join(', ')}\n\n**Architecture:**\n${this.getTechnicalDetail(project.name)}\n\n**Description:** ${project.description}\n\n**Live Demo:** ${project.url}\n\nNeed more specific technical details?`;
        }

        return `**${project.name}**\n\n${project.description}\n\n**Technologies:** ${project.tech.join(', ')}\n\n**Check it out:** ${project.url}\n\nWant to see other projects?`;
    }

    getSkillsResponse(mode) {
        const skills = this.portfolioData.skills;

        if (mode === 'quick') {
            return `**Top Skills:**\n• Python (80%)\n• HTML/CSS (90%)\n• AI Tools (85%)\n• JavaScript (75%)\n\nStrong focus on **web development** and **AI integration**.`;
        }

        if (mode === 'recruiter') {
            return `**Technical Proficiency:**\n\n**Frontend:** ${skills.frontend.join(', ')}\n**Programming:** ${skills.programming.join(', ')}\n**Tools:** ${skills.tools.join(', ')}\n\n**Strengths:**\n• Full-stack web development\n• Python automation & AI\n• Rapid prototyping with modern frameworks\n\n**Actively Learning:** Java, Data Structures & Algorithms`;
        }

        return `**${this.portfolioData.name}'s Tech Stack:**\n\n**Frontend Development:**\n${skills.frontend.map(s => `• ${s}`).join('\n')}\n\n**Programming & AI:**\n${skills.programming.map(s => `• ${s}`).join('\n')}\n\n**Tools & Design:**\n${skills.tools.map(s => `• ${s}`).join('\n')}\n\nAnything specific you'd like to know?`;
    }

    getEducationResponse(mode) {
        const edu = this.portfolioData.education;

        if (mode === 'quick') {
            return `**${edu.current.degree}** at ${edu.current.institution}\n**CGPA:** ${edu.current.cgpa}\n**Period:** ${edu.current.period}`;
        }

        if (mode === 'recruiter') {
            return `**Academic Background:**\n\n**Current:** ${edu.current.degree}\n${edu.current.institution}\nCGPA: **${edu.current.cgpa}** (${edu.current.period})\n\n**Intermediate:** ${edu.intermediate.percentage} — ${edu.intermediate.school}\n\n**SSC:** ${edu.ssc.percentage} — ${edu.ssc.school}\n\n**Certifications:**\n• MERN Stack Training (2025)`;
        }

        return `**Education Journey:**\n\n🎓 **${edu.current.degree}**\n${edu.current.institution}\nCGPA: ${edu.current.cgpa} | ${edu.current.period}\n\n📚 **Intermediate:** ${edu.intermediate.percentage}\n${edu.intermediate.school} (${edu.intermediate.period})\n\n🏫 **SSC:** ${edu.ssc.percentage}\n${edu.ssc.school} (${edu.ssc.period})\n\n🏆 **Achievement:** MERN Stack Training (2025)`;
    }

    getContactResponse(mode) {
        const contact = this.portfolioData;
        return `**Let's Connect!**\n\n📧 **Email:** ${contact.email}\n📱 **Phone:** ${contact.phone}\n📍 **Location:** ${contact.location}\n\n🔗 **LinkedIn:** [Connect Here](${contact.linkedin})\n💻 **GitHub:** [View Projects](${contact.github})\n\nFeel free to reach out for opportunities or collaborations!`;
    }

    getAboutResponse(mode) {
        if (mode === 'quick') {
            return `**${this.portfolioData.name}** is an **AI & ML Engineering student** with ${this.portfolioData.stats.projectsCompleted} completed projects. Specializes in **Python**, **Web Development**, and **AI automation**.`;
        }

        if (mode === 'recruiter') {
            return `**Candidate Profile:**\n\n**Name:** ${this.portfolioData.name}\n**Education:** B.Tech in AI & ML (CGPA: 7.80)\n**Core Competencies:**\n• Full-stack web development (MERN, Flask)\n• Python programming & automation\n• AI/ML tools integration\n\n**Portfolio Highlights:**\n• ${this.portfolioData.stats.projectsCompleted} production-ready projects\n• ${this.portfolioData.stats.skills} technical skills\n• ${this.portfolioData.stats.yearsLearning} years of hands-on experience\n\n**Contact:** ${this.portfolioData.email}`;
        }

        return `I'm **${this.portfolioData.name}**, an aspiring **AI & ML Engineer** passionate about creating innovative solutions.\n\n**Currently:**\n• Pursuing ${this.portfolioData.education.current.degree}\n• Building AI-powered applications\n• Exploring automation and web development\n\n**Quick Stats:**\n• ${this.portfolioData.stats.projectsCompleted} Projects\n• ${this.portfolioData.stats.skills} Skills\n• ${this.portfolioData.stats.yearsLearning} Years Learning\n\nWhat would you like to explore?`;
    }

    getHiringResponse() {
        return `**Yes, ${this.portfolioData.name} is actively seeking opportunities!**\n\n**Available for:**\n• Internships\n• Full-time roles\n• Collaborative projects\n• Freelance work\n\n**Best fit for:**\n• AI/ML Engineering roles\n• Full-stack development\n• Python automation projects\n\n**Contact:**\n📧 ${this.portfolioData.email}\n📱 ${this.portfolioData.phone}\n\nWould you like to see the resume or specific project demos?`;
    }

    getDefaultResponse() {
        this.trackCommonQuestion('unclear');
        return `I'm here to help! I can tell you about:\n\n• **Projects** — See what ${this.portfolioData.name} has built\n• **Skills** — Technical expertise and tools\n• **Education** — Academic background\n• **Contact** — How to get in touch\n\nWhat would you like to know?`;
    }

    updateSuggestionsBasedOnContext(lastQuery) {
        let suggestions = [];

        if (lastQuery.includes('project')) {
            suggestions = [
                "Tell me about ELMS 🚀",
                "Show AI projects 🤖",
                "What tech stacks used? 💻"
            ];
        } else if (lastQuery.includes('skill')) {
            suggestions = [
                "Show me projects 🚀",
                "Python experience? 🐍",
                "Education background 🎓"
            ];
        } else if (lastQuery.includes('education')) {
            suggestions = [
                "View projects 🚀",
                "What are his skills? 💡",
                "Contact info 📧"
            ];
        } else {
            suggestions = [
                "View all projects 🚀",
                "Technical skills 🧠",
                "Get in touch 📧",
                "About overview 👤"
            ];
        }

        this.showSuggestions(suggestions);
    }

    // Learning System Methods
    trackProjectView(projectName) {
        if (!this.metrics.projectViews[projectName]) {
            this.metrics.projectViews[projectName] = 0;
        }
        this.metrics.projectViews[projectName]++;
    }

    trackCommonQuestion(question) {
        if (!this.metrics.commonQuestions[question]) {
            this.metrics.commonQuestions[question] = 0;
        }
        this.metrics.commonQuestions[question]++;
    }

    getOptimizationInsights() {
        // For developer debugging - shows what users are most interested in
        console.log("📊 Rolla Learning Insights:", {
            totalInteractions: this.metrics.totalInteractions,
            mostViewedProjects: Object.entries(this.metrics.projectViews)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3),
            preferredMode: Object.entries(this.metrics.modeUsage)
                .sort((a, b) => b[1] - a[1])[0],
            commonQuestions: this.metrics.commonQuestions
        });
    }
}

// Initialize Rolla when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rolla = new RollaAI();
    console.log("🤖 Rolla AI Assistant loaded successfully!");
});
