// Modern JavaScript for SSD Course Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize clock
    startTime();

    // Initialize smooth scrolling for navigation links
    initializeSmoothScrolling();

    // Initialize responsive navigation
    initializeResponsiveNav();

    // Initialize scroll animations
    initializeScrollAnimations();
});

// Clock functionality
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    // Add AM/PM format
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // Convert 0 to 12

    m = checkTime(m);
    s = checkTime(s);

    const timeString = h + ":" + m + ":" + s + " " + ampm;

    // Update both clock displays
    const clockElement = document.getElementById('clock');
    const footerClockElement = document.getElementById('footerClock');

    if (clockElement) {
        clockElement.innerHTML = timeString;
    }

    if (footerClockElement) {
        footerClockElement.innerHTML = timeString;
    }

    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// Responsive navigation enhancements
function initializeResponsiveNav() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        // Add backdrop for mobile menu
        navbarCollapse.addEventListener('show.bs.collapse', function() {
            document.body.style.overflow = 'hidden';
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            document.body.style.overflow = '';
        });
    }
}

// Scroll animations and effects
function initializeScrollAnimations() {
    // Navbar background opacity on scroll
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            header.style.background = 'rgba(37, 99, 235, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '';
            header.style.backdropFilter = '';
        }
    });

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe policy items
    const policyItems = document.querySelectorAll('.policy-item');
    policyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Skip to main content on Tab
    if (e.key === 'Tab' && !e.shiftKey) {
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent && document.activeElement === document.body) {
            e.preventDefault();
            mainContent.focus();
        }
    }

    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.click();
        }
    }
});

// Add focus indicators for better accessibility
document.addEventListener('focusin', function(e) {
    if (e.target.matches('.nav-link, .table a, .footer-links a')) {
        e.target.style.outline = '2px solid #f59e0b';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.matches('.nav-link, .table a, .footer-links a')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

// Print functionality
function printPage() {
    window.print();
}

// Add print button (optional - can be added to the interface if needed)
function addPrintButton() {
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️ Print';
    printButton.className = 'btn btn-outline-primary btn-sm position-fixed';
    printButton.style.cssText = 'top: 100px; right: 20px; z-index: 1000;';
    printButton.onclick = printPage;

    document.body.appendChild(printButton);
}

// Performance optimization - debounce scroll events
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        header.style.background = 'rgba(37, 99, 235, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '';
        header.style.backdropFilter = '';
    }
}, 10);

// Replace the original scroll listener with the optimized one
window.removeEventListener('scroll', initializeScrollAnimations);
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Add to window for global access (useful for debugging)
window.SSD = {
    startTime,
    printPage,
    addPrintButton
};
