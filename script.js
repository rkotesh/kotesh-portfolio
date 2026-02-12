// DOM Elements
const navbar = document.getElementById('navbar');
// const themeToggle = document.getElementById('theme-toggle'); // Removed
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const roleText = document.querySelector('.role-text');
const updateTime = document.getElementById('update-time');
const updateContent = document.getElementById('update-content');
const contactForm = document.getElementById('contact-form');
const activityTimeline = document.getElementById('activity-timeline');

// Theme Management
// Theme Management - REMOVED (Light theme deprecated)
// const currentTheme = localStorage.getItem('theme') || 'light';
// document.documentElement.setAttribute('data-theme', currentTheme);

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typing Animation for Role Text
const roles = [
    'Web Developer',
    'Python Programmer',
    'AI Enthusiast'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeRole, typingSpeed);
}

// Start typing animation
setTimeout(typeRole, 1000);

// Animated Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const count = parseInt(counter.textContent);
        const increment = target / 200;

        if (count < target) {
            counter.textContent = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 10);
        } else {
            counter.textContent = target;
        }
    });
}

const aboutSection = document.querySelector(".about");
const objects = document.querySelectorAll(".bg-object");

aboutSection.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5; // range -0.5 to 0.5
    const y = e.clientY / window.innerHeight - 0.5;

    objects.forEach((obj, index) => {
        const factor = (index + 1) * 15; // depth factor
        obj.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
    });
});


// Skill Bar Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');

            // Trigger specific animations
            if (entry.target.classList.contains('about-stats')) {
                animateCounters();
            }

            if (entry.target.classList.contains('skills-content')) {
                setTimeout(animateSkillBars, 500);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Also observe stats and skills sections
const statsSection = document.querySelector('.about-stats');
const skillsSection = document.querySelector('.skills-content');

if (statsSection) observer.observe(statsSection);
if (skillsSection) observer.observe(skillsSection);

// Contact Form Handling
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    this.reset();

    // Add to activity feed
    addActivity('contact', `New message received from ${name}`, new Date());
});

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10B981' : '#EF4444'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Activity Feed
const activities = [
    { type: 'project', text: 'Started working with College Website', time: new Date() },
    { type: 'achievement', text: 'Attended the AI Masterclass by Freedom With AI', time: new Date() },
    { type: 'project', text: 'Revamped Portfolio with "Pitch Black & Glass" theme, optimized typography, and enhanced profile visuals', time: new Date() },
    { type: 'project', text: 'Successfully deployed the Employee Leave Management System (ELMS) application on Render', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { type: 'skill', text: 'Gained hands-on experience in backend development using Flask during the Employee Leave Management System project at Flipkart', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { type: 'achievement', text: 'Selected for the prestigious Flipkart Launchpad Internship', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { type: 'project', text: 'Deployed the Hospital Chatbot application on Streamlit for real-time healthcare assistance', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { type: 'project', text: 'Launched the Weather Chatbot application on Streamlit to provide dynamic weather forecasts', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { type: 'project', text: 'Deployed the QR Code Generator application to Streamlit with advanced features for QR code customization and bulk generation', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { type: 'skill', text: 'Successfully completed comprehensive training in MERN (MongoDB, Express.js, React, Node.js) stack development', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { type: 'learning', text: 'Embarked on learning Java and Data Structures and Algorithms (DSA) to strengthen programming and problem-solving skills', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { type: 'learning', text: 'Pursuing advanced studies in Python programming to deepen knowledge in object-oriented programming and software development', time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
];

function getActivityIcon(type) {
    const icons = {
        project: 'fas fa-rocket',
        skill: 'fas fa-graduation-cap',
        learning: 'fas fa-book',
        contact: 'fas fa-envelope',
        achievement: 'fas fa-trophy'
    };
    return icons[type] || 'fas fa-circle';
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    }
}

function addActivity(type, text, time) {
    activities.unshift({ type, text, time });
    if (activities.length > 5) {
        activities.pop();
    }
    renderActivityFeed();
}

function renderActivityFeed() {
    if (!activityTimeline) return;

    activityTimeline.innerHTML = '';

    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${formatTimeAgo(activity.time)}</div>
            </div>
        `;

        activityTimeline.appendChild(activityItem);
    });
}

// Initialize activity feed
renderActivityFeed();

// Auto-refresh activity times every minute
setInterval(renderActivityFeed, 60000);

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Floating Cards Animation Enhancement
document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.1) translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) translateY(0)';
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add initial delay for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Preload images if needed
    const imageUrls = [
        'https://drive.google.com/uc?export=view&id=1A0MmjRaGI1z7WsBGi7uRU7ZUbtGw-wE0'
        // Add any image URLs here for preloading
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading animation
const style = document.createElement('style');
style.textContent = `
    .notification {
        font-family: var(--font-family);
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    body.loaded .hero-title .title-line {
        animation: fadeInUp 0.8s ease forwards;
        opacity: 0;
    }
    
    body.loaded .hero-title .title-line:nth-child(1) {
        animation-delay: 0.2s;
    }
    
    body.loaded .hero-title .title-line:nth-child(2) {
        animation-delay: 0.4s;
    }
    
    body.loaded .hero-title .title-line:nth-child(3) {
        animation-delay: 0.6s;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            height: calc(100vh - 70px);
            background: var(--bg-primary);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 40px;
            border-top: 1px solid var(--border-color);
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

document.head.appendChild(style);

