/* ============================================================
   KREATAL MOCEAN - MAIN JAVASCRIPT
   Version: 1.0.0
   Author: Kreatal Mocean Development Team
   ============================================================ */

'use strict';

/* ============================================================
   TABLE OF CONTENTS
   ============================================================
   1. DOM Elements & Variables
   2. Utility Functions
   3. Header & Navigation
   4. Mobile Menu
   5. Smooth Scrolling
   6. Back to Top Button
   7. Stats Counter Animation
   8. Active Navigation Highlighting
   9. Form Validation & Submission
   10. Partners Slider Enhancement
   11. Service Cards Interaction
   12. AOS Initialization
   13. Page Load Animations
   14. Event Listeners
   15. Initialize Application
   ============================================================ */

// ============================================================
// 1. DOM ELEMENTS & VARIABLES
// ============================================================

const DOM = {
    // Header & Navigation
    header: document.getElementById('header'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Sections
    sections: document.querySelectorAll('section[id]'),
    
    // Back to Top
    backToTop: document.getElementById('backToTop'),
    
    // Stats
    statNumbers: document.querySelectorAll('.stat-number'),
    
    // Footer Year
    currentYear: document.getElementById('currentYear'),
    
    // Partners Slider
    partnersTrack: document.querySelector('.partners-track'),
    
    // Forms
    forms: document.querySelectorAll('form'),
    
    // Service Cards
    serviceCards: document.querySelectorAll('.service-card')
};

const CONFIG = {
    headerScrollThreshold: 50,
    backToTopThreshold: 300,
    animationDuration: 1000,
    statsAnimationDuration: 2000,
    mobileBreakpoint: 992
};

let isScrolling = false;
let statsAnimated = false;

// ============================================================
// 2. UTILITY FUNCTIONS
// ============================================================

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 100) {
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

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset from viewport edge
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight - offset || document.documentElement.clientHeight - offset) &&
        rect.bottom >= 0
    );
}

/**
 * Animate number counting
 * @param {HTMLElement} element - Element containing the number
 * @param {number} target - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 */
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(easeProgress * target);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Format phone number for WhatsApp link
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneForWhatsApp(phone) {
    return phone.replace(/[^0-9]/g, '');
}

/**
 * Get URL parameters
 * @returns {URLSearchParams} URL parameters
 */
function getURLParams() {
    return new URLSearchParams(window.location.search);
}

/**
 * Show notification/toast message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                min-width: 300px;
                max-width: 450px;
                padding: 1rem 1.5rem;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 9999;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid;
            }
            .notification-success { border-color: #10b981; }
            .notification-error { border-color: #ef4444; }
            .notification-warning { border-color: #f59e0b; }
            .notification-info { border-color: #3b82f6; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-content i {
                font-size: 1.25rem;
            }
            .notification-success i { color: #10b981; }
            .notification-error i { color: #ef4444; }
            .notification-warning i { color: #f59e0b; }
            .notification-info i { color: #3b82f6; }
            .notification-content span {
                font-size: 0.95rem;
                color: #374151;
            }
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
                transition: color 0.3s;
            }
            .notification-close:hover { color: #374151; }
            .notification.hiding {
                animation: slideOutRight 0.3s ease forwards;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @media (max-width: 576px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Font Awesome icon class
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ============================================================
// 3. HEADER & NAVIGATION
// ============================================================

/**
 * Handle header scroll effect
 */
function handleHeaderScroll() {
    if (!DOM.header) return;
    
    const scrollY = window.scrollY;
    
    if (scrollY > CONFIG.headerScrollThreshold) {
        DOM.header.classList.add('scrolled');
    } else {
        DOM.header.classList.remove('scrolled');
    }
}

// ============================================================
// 4. MOBILE MENU
// ============================================================

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    if (!DOM.navToggle || !DOM.navMenu) return;
    
    const isOpen = DOM.navMenu.classList.contains('active');
    
    DOM.navToggle.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
    DOM.navToggle.setAttribute('aria-expanded', !isOpen);
    
    // Toggle body scroll
    document.body.classList.toggle('menu-open');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    if (!DOM.navToggle || !DOM.navMenu) return;
    
    DOM.navToggle.classList.remove('active');
    DOM.navMenu.classList.remove('active');
    DOM.navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

/**
 * Handle click outside mobile menu
 * @param {Event} event - Click event
 */
function handleClickOutside(event) {
    if (!DOM.navMenu || !DOM.navToggle) return;
    
    const isMenuOpen = DOM.navMenu.classList.contains('active');
    const isClickInsideMenu = DOM.navMenu.contains(event.target);
    const isClickOnToggle = DOM.navToggle.contains(event.target);
    
    if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
        closeMobileMenu();
    }
}

/**
 * Handle window resize for mobile menu
 */
function handleResize() {
    if (window.innerWidth > CONFIG.mobileBreakpoint) {
        closeMobileMenu();
    }
}

// ============================================================
// 5. SMOOTH SCROLLING
// ============================================================

/**
 * Smooth scroll to element
 * @param {string} targetId - Target element ID
 */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    
    if (!target) return;
    
    const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Handle anchor link clicks for smooth scrolling
 * @param {Event} event - Click event
 */
function handleAnchorClick(event) {
    const link = event.target.closest('a[href^="#"]');
    
    if (!link) return;
    
    const targetId = link.getAttribute('href');
    
    if (targetId === '#' || !targetId) return;
    
    event.preventDefault();
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Smooth scroll to target
    smoothScrollTo(targetId);
    
    // Update URL without scrolling
    if (history.pushState) {
        history.pushState(null, null, targetId);
    }
}

// ============================================================
// 6. BACK TO TOP BUTTON
// ============================================================

/**
 * Handle back to top button visibility
 */
function handleBackToTop() {
    if (!DOM.backToTop) return;
    
    const scrollY = window.scrollY;
    
    if (scrollY > CONFIG.backToTopThreshold) {
        DOM.backToTop.classList.add('visible');
    } else {
        DOM.backToTop.classList.remove('visible');
    }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================================
// 7. STATS COUNTER ANIMATION
// ============================================================

/**
 * Animate stats numbers when in viewport
 */
function animateStats() {
    if (statsAnimated || !DOM.statNumbers.length) return;
    
    const heroStats = document.querySelector('.hero-stats');
    
    if (!heroStats) return;
    
    if (isInViewport(heroStats, 100)) {
        DOM.statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            if (!isNaN(target)) {
                animateNumber(stat, target, CONFIG.statsAnimationDuration);
            }
        });
        statsAnimated = true;
    }
}

// ============================================================
// 8. ACTIVE NAVIGATION HIGHLIGHTING
// ============================================================

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    if (!DOM.sections.length || !DOM.navLinks.length) return;
    
    const scrollY = window.scrollY;
    const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
    
    DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}` || 
                    link.getAttribute('href').includes(`#${sectionId}`)) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================================
// 9. FORM VALIDATION & SUBMISSION
// ============================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (Indian)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
function isValidPhone(phone) {
    const phoneRegex = /^[+]?[0-9]{10,13}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validate form field
 * @param {HTMLElement} field - Form field to validate
 * @returns {boolean} True if field is valid
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required;
    
    // Remove previous error state
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Check required
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Check email
    if (type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Check phone
    if (type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    // Check minimum length
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength, 10)) {
        showFieldError(field, `Minimum ${minLength} characters required`);
        return false;
    }
    
    return true;
}

/**
 * Show field error message
 * @param {HTMLElement} field - Form field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 0.25rem; display: block;';
    
    field.parentNode.appendChild(errorElement);
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} True if form is valid
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    data.page = window.location.href;
    
    // Get submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    try {
        // Determine which sheet to submit to based on form ID
        const formType = form.getAttribute('data-form-type') || 'contact';
        const scriptURL = getScriptURL(formType);
        
        // Submit to Google Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Success
        showNotification('Form submitted successfully! We will contact you soon.', 'success', 5000);
        form.reset();
        
        // Redirect to thank you page or show success message
        // window.location.href = 'thank-you.html';
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Something went wrong. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

/**
 * Get Google Apps Script URL based on form type
 * @param {string} formType - Type of form (contact, internship)
 * @returns {string} Script URL
 */
function getScriptURL(formType) {
    // Replace these with your actual Google Apps Script deployment URLs
    const urls = {
        contact: 'https://script.google.com/macros/s/AKfycbwXBNts-NKRLo7_foR-soHEti7HOPXxDAJLQTzvAZhjm8FlfX7cJWQAul1PIhlN0bsH/exec',
        internship: 'https://script.google.com/macros/s/AKfycbwXBNts-NKRLo7_foR-soHEti7HOPXxDAJLQTzvAZhjm8FlfX7cJWQAul1PIhlN0bsH/exec'
    };
    return urls[formType] || urls.contact;
}

/**
 * Setup form field validation on blur
 * @param {HTMLFormElement} form - Form element
 */
function setupFormValidation(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            // Remove error state on input
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
}

// ============================================================
// 10. PARTNERS SLIDER ENHANCEMENT
// ============================================================

/**
 * Pause partners slider on hover (already handled in CSS, but adding JS backup)
 */
function setupPartnersSlider() {
    if (!DOM.partnersTrack) return;
    
    const slider = DOM.partnersTrack.parentElement;
    
    slider.addEventListener('mouseenter', () => {
        DOM.partnersTrack.style.animationPlayState = 'paused';
    });
    
    slider.addEventListener('mouseleave', () => {
        DOM.partnersTrack.style.animationPlayState = 'running';
    });
}

// ============================================================
// 11. SERVICE CARDS INTERACTION
// ============================================================

/**
 * Handle service card click for redirection
 */
function setupServiceCards() {
    if (!DOM.serviceCards.length) return;
    
    DOM.serviceCards.forEach(card => {
        const serviceId = card.getAttribute('data-service');
        
        // View More button
        const viewMoreBtn = card.querySelector('.btn-outline');
        if (viewMoreBtn && serviceId) {
            viewMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `services.html#${serviceId}`;
            });
        }
        
        // Enroll Now button - WhatsApp redirect
        const enrollBtn = card.querySelector('.btn-primary');
        if (enrollBtn && serviceId) {
            enrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceName = card.querySelector('.service-title')?.textContent || 'Service';
                redirectToWhatsApp(serviceName);
            });
        }
    });
}

/**
 * Redirect to WhatsApp with service details
 * @param {string} serviceName - Name of the service
 */
function redirectToWhatsApp(serviceName) {
    const phone = '919350802001';
    const message = encodeURIComponent(
        `Hello RIGHTNEW!\n\nI'm interested in enrolling for: ${serviceName}\n\nPlease provide more details about this program.\n\nThank you!`
    );
    const whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// ============================================================
// 12. AOS INITIALIZATION
// ============================================================

/**
 * Initialize AOS (Animate On Scroll) library
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0,
            disable: function() {
                // Disable on mobile if performance is an issue
                return window.innerWidth < 768 && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }
}

// ============================================================
// 13. PAGE LOAD ANIMATIONS
// ============================================================

/**
 * Handle page load animations
 */
function handlePageLoad() {
    // Update current year in footer
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Check for hash in URL and scroll to section
    if (window.location.hash) {
        setTimeout(() => {
            smoothScrollTo(window.location.hash);
        }, 100);
    }
    
    // Initial animations
    animateStats();
}

/**
 * Handle URL hash changes
 */
function handleHashChange() {
    if (window.location.hash) {
        smoothScrollTo(window.location.hash);
    }
}

// ============================================================
// 14. KEYBOARD NAVIGATION
// ============================================================

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboard(event) {
    // Close mobile menu on Escape
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Handle Enter/Space on custom buttons
    if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target;
        
        if (target.classList.contains('nav-toggle')) {
            event.preventDefault();
            toggleMobileMenu();
        }
        
        if (target.classList.contains('back-to-top')) {
            event.preventDefault();
            scrollToTop();
        }
    }
}

// ============================================================
// 15. SCROLL PERFORMANCE OPTIMIZATION
// ============================================================

/**
 * Optimized scroll handler using requestAnimationFrame
 */
function optimizedScrollHandler() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleHeaderScroll();
            handleBackToTop();
            animateStats();
            updateActiveNavLink();
            isScrolling = false;
        });
        isScrolling = true;
    }
}

// ============================================================
// 16. LAZY LOADING IMAGES
// ============================================================

/**
 * Setup lazy loading for images (native support check)
 */
function setupLazyLoading() {
    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ============================================================
// 17. SERVICE PAGE SPECIFIC FUNCTIONS
// ============================================================

/**
 * Handle service page - auto open service section based on hash
 */
function handleServicePageLoad() {
    const hash = window.location.hash;
    
    if (!hash) return;
    
    const serviceId = hash.replace('#', '');
    const serviceSection = document.getElementById(serviceId);
    
    if (serviceSection) {
        // Add active class or expand the service
        serviceSection.classList.add('active', 'expanded');
        
        // Scroll to the service after a short delay
        setTimeout(() => {
            smoothScrollTo(hash);
        }, 300);
    }
}

// ============================================================
// 18. CONTACT FORM TO WHATSAPP
// ============================================================

/**
 * Create WhatsApp message from form data
 * @param {Object} formData - Form data object
 * @returns {string} Encoded WhatsApp message
 */
function createWhatsAppMessage(formData) {
    let message = `*New Inquiry from Website*\n\n`;
    
    if (formData.name) message += `*Name:* ${formData.name}\n`;
    if (formData.email) message += `*Email:* ${formData.email}\n`;
    if (formData.phone) message += `*Phone:* ${formData.phone}\n`;
    if (formData.service) message += `*Service:* ${formData.service}\n`;
    if (formData.subject) message += `*Subject:* ${formData.subject}\n`;
    if (formData.message) message += `*Message:* ${formData.message}\n`;
    if (formData.college) message += `*College:* ${formData.college}\n`;
    if (formData.course) message += `*Course:* ${formData.course}\n`;
    
    message += `\n_Sent from kreatalmocean.com_`;
    
    return encodeURIComponent(message);
}

/**
 * Redirect to WhatsApp with form data
 * @param {Object} formData - Form data object
 */
function sendToWhatsApp(formData) {
    const phone = '919350802001';
    const message = createWhatsAppMessage(formData);
    const whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// ============================================================
// 19. EVENT LISTENERS
// ============================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Scroll events (throttled for performance)
    window.addEventListener('scroll', throttle(optimizedScrollHandler, 16));
    
    // Resize events (debounced)
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Mobile menu toggle
    if (DOM.navToggle) {
        DOM.navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links - close menu on click
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Click outside mobile menu
    document.addEventListener('click', handleClickOutside);
    
    // Smooth scroll for anchor links
    document.addEventListener('click', handleAnchorClick);
    
    // Back to top button
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', scrollToTop);
    }
    
    // Form submissions
    DOM.forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        setupFormValidation(form);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Hash change
    window.addEventListener('hashchange', handleHashChange);
    
    // Page visibility change (pause animations when tab is inactive)
    document.addEventListener('visibilitychange', () => {
        if (DOM.partnersTrack) {
            if (document.hidden) {
                DOM.partnersTrack.style.animationPlayState = 'paused';
            } else {
                DOM.partnersTrack.style.animationPlayState = 'running';
            }
        }
    });
}

// ============================================================
// 20. INITIALIZE APPLICATION
// ============================================================

/**
 * Initialize the entire application
 */
function initApp() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

/**
 * Main initialization function
 */
function init() {
    console.log('🚀 Kreatal Mocean Website Initialized');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize AOS animations
    initAOS();
    
    // Setup partners slider
    setupPartnersSlider();
    
    // Setup service cards
    setupServiceCards();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Handle page load
    handlePageLoad();
    
    // Handle service page specific functionality
    if (window.location.pathname.includes('services')) {
        handleServicePageLoad();
    }
    
    // Initial header state
    handleHeaderScroll();
    handleBackToTop();
}

// Start the application
initApp();

// ============================================================
// 21. EXPORT FUNCTIONS (For use in other scripts if needed)
// ============================================================

// Make functions available globally for inline event handlers
window.KreatalMocean = {
    showNotification,
    smoothScrollTo,
    scrollToTop,
    sendToWhatsApp,
    redirectToWhatsApp,
    validateForm,
    closeMobileMenu
};
// ============================================================
// COUNTER — Counts from 0 to data-count value
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    const counters = document.querySelectorAll('.h-stat-num[data-count]');

    // ---- Counter Function ----
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(easedProgress * target);

            el.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ---- Intersection Observer ----
    // Counter starts ONLY when stats become visible on screen

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const statsInside = entry.target.querySelectorAll('.h-stat-num[data-count]');
                statsInside.forEach(function (counter) {
                    // Prevent counting again if already counted
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter);
                    }
                });
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe the stats row container
    const statsRow = document.querySelector('.hero-stats-row');
    if (statsRow) {
        observer.observe(statsRow);
    }

});
