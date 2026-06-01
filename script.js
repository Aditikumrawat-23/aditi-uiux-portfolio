/* ============================================
   PORTFOLIO INTERACTIVE FEATURES
   ============================================ */

class Portfolio {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }

    /* ============================================
       EVENT LISTENERS
       ============================================ */

    setupEventListeners() {
        // Hamburger menu toggle
        this.hamburger?.addEventListener('click', () => this.toggleMenu());

        // Nav links click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Close menu when link is clicked
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });

        // Projects scroll button
        const scrollBtn = document.getElementById('scrollBtn');
        const projectsContainer = document.getElementById('projectsContainer');
        
        if (scrollBtn && projectsContainer) {
            scrollBtn.addEventListener('click', () => {
                projectsContainer.scrollBy({
                    left: 320,
                    behavior: 'smooth'
                });
            });
        }
    }

    /* ============================================
       MENU TOGGLE
       ============================================ */

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    /* ============================================
       SCROLL HANDLING
       ============================================ */

    handleScroll() {
        // Update navbar on scroll
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Update active nav link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    /* ============================================
       SMOOTH SCROLL NAVIGATION
       ============================================ */

    handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    /* ============================================
       INTERSECTION OBSERVER - SCROLL ANIMATIONS
       ============================================ */

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in');
                        entry.target.style.opacity = '1';
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Observe cards and elements for animation
        document.querySelectorAll(
            '.project-card, .cert-card, .stat-card, .education-card, .skill-category'
        ).forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    }

    setupScrollAnimations() {
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const blobs = document.querySelectorAll('.blob');
            
            blobs.forEach((blob, index) => {
                const speed = 0.5 + index * 0.1;
                blob.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
}

/* ============================================
   INITIALIZE PORTFOLIO
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    // Set initial active link
    portfolio.updateActiveNavLink();

    console.log('✨ Portfolio initialized successfully!');
});

/* ============================================
   SMOOTH SCROLL POLYFILL
   ============================================ */

if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScroll = function(target, duration) {
        const start = window.scrollY;
        const distance = target - start;
        let startTime;

        const ease = function(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const run = function(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            if (progress < 1) {
                window.scrollTo(0, start + distance * ease(progress));
                requestAnimationFrame(run);
            } else {
                window.scrollTo(0, target);
            }
        };

        requestAnimationFrame(run);
    };
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ============================================
   BUTTON INTERACTIONS
   ============================================ */

document.querySelectorAll('.btn, .contact-btn, .social-link, .cert-link').forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });

    button.addEventListener('mouseup', function() {
        this.style.transform = '';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

/* ============================================
   FORM INTERACTIONS
   ============================================ */

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);
}

/* ============================================
   SCROLL PERFORMANCE
   ============================================ */

let scrollTimeout;
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (isScrolling) {
        clearTimeout(scrollTimeout);
    } else {
        isScrolling = true;
    }

    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 150);
}, { passive: true });

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */

// Focus management
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = 'none';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press '1' to scroll to top
    if (e.key === '1' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get element offset
function getElementOffset(element) {
    let top = 0, left = 0;
    let el = element;

    while (el) {
        top += el.offsetTop;
        left += el.offsetLeft;
        el = el.offsetParent;
    }

    return { top, left };
}

/* ============================================
   ERROR HANDLING
   ============================================ */

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    });
}

/* ============================================
   CUSTOM CURSOR (Optional Enhancement)
   ============================================ */

// Uncomment to enable custom cursor
/*
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});

document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});
*/

/* ============================================
   ANALYTICS (Optional)
   ============================================ */

// Track section views
const sectionViewTracker = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('section_view', {
                        section: entry.target.id
                    });
                }
            });
        });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    },

    trackEvent(eventName, eventData) {
        // Send to your analytics service
        if (window.gtag) {
            gtag('event', eventName, eventData);
        }
    }
};

// Uncomment to enable analytics tracking
// sectionViewTracker.init();

/* ============================================
   FEATURE DETECTION
   ============================================ */

const features = {
    supportsWebP: (() => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    })(),

    supportsCSS: (() => {
        const style = document.createElement('style');
        style.textContent = '@supports (display: grid) { #test { display: grid; } }';
        document.head.appendChild(style);
        const el = document.getElementById('test');
        const result = el && getComputedStyle(el).display === 'grid';
        style.remove();
        return result;
    })(),

    touchSupport: () => {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }
};

// Log feature support
console.log('Feature Support:', features);

/* ============================================
   DARK MODE SUPPORT (Optional)
   ============================================ */

// Uncomment to enable dark mode support
/*
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});
*/
