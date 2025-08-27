// Performance-optimized JavaScript for Navin Kumar's quadrant website
// Using modern ES6+ patterns and Web APIs

// Performance timing and metrics
const performanceMonitor = {
    startTime: performance.now(),
    logMetric(name, value) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'custom_metric', {
                metric_name: name,
                metric_value: value
            });
        }
        console.log(`Performance: ${name} = ${value}ms`);
    }
};

// Intersection Observer for better performance
const createIntersectionObserver = (callback, options = {}) => {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        callback();
        return null;
    }
    return new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
    });
};

// Utility function to add more quadrant levels (for future extensibility)
function addQuadrantLevel(parentSection, newQuadrants) {
    // This function can be extended to add more recursive quadrant levels
    // For now, it's a placeholder for future enhancements
    console.log(`Adding new quadrant level to ${parentSection}:`, newQuadrants);
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Enhanced performance-optimized loading animation
window.addEventListener('load', function() {
    const header = document.querySelector('.header');
    const mainContainer = document.querySelector('.quadrant-container');
    
    // Performance timing
    const loadTime = performance.now() - performanceMonitor.startTime;
    performanceMonitor.logMetric('page_load_time', loadTime);
    
    if (header) {
        // GPU-accelerated header animation
        header.style.opacity = '0';
        header.style.transform = 'translate3d(0, -50px, 0)';
        header.style.backfaceVisibility = 'hidden';
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                header.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                header.style.opacity = '1';
                header.style.transform = 'translate3d(0, 0, 0)';
            }, 200);
        });
    }
    
    if (mainContainer) {
        // GPU-accelerated quadrant animation with stagger
        setTimeout(() => {
            mainContainer.style.opacity = '0';
            mainContainer.style.transform = 'translate3d(0, 0, 0) scale3d(0.95, 0.95, 1)';
            mainContainer.style.backfaceVisibility = 'hidden';
            
            requestAnimationFrame(() => {
                setTimeout(() => {
                    mainContainer.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    mainContainer.style.opacity = '1';
                    mainContainer.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
                }, 100);
            });
        }, 600);
    }
});

// Main application initialization
class QuadrantApp {
    constructor() {
        this.currentSection = null;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Bind methods to maintain 'this' context
        this.handleQuadrantClick = this.handleQuadrantClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    setupApp() {
        const setupStart = performance.now();
        
        try {
            this.initializeMainQuadrants();
            this.initializeSocialMediaQuadrants();
            this.setupAccessibility();
            this.setupTouchGestures();
            this.lazyLoadSubQuadrants();
            this.preloadCriticalContent();
            
            performanceMonitor.logMetric('app_setup_time', performance.now() - setupStart);
            performanceMonitor.logMetric('total_load_time', performance.now() - performanceMonitor.startTime);
            
            console.log('✅ Quadrant App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }

    initializeMainQuadrants() {
        const quadrants = document.querySelectorAll('.quadrant[data-section]');
        
        if (quadrants.length === 0) {
            console.warn('No quadrants found');
            return;
        }
        
        // Use event delegation for better performance
        const quadrantContainer = document.getElementById('mainQuadrants');
        if (quadrantContainer) {
            quadrantContainer.addEventListener('click', this.handleQuadrantClick);
            quadrantContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleQuadrantClick(e);
                }
            });
        }
        
        // Initialize back buttons with event delegation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.back-button[data-action="back"]')) {
                e.preventDefault();
                this.showMainQuadrants();
            }
        });
        
        // Setup keyboard navigation
        document.addEventListener('keydown', this.handleKeydown);
        
        console.log(`✅ Initialized ${quadrants.length} quadrants`);
    }
    
    handleQuadrantClick(e) {
        const quadrant = e.target.closest('.quadrant[data-section]');
        if (!quadrant || this.isTransitioning) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const section = quadrant.getAttribute('data-section');
        if (section) {
            // Scroll to the section instead of showing sub-quadrants
            const targetSection = document.getElementById(`${section}-sub`);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update breadcrumb navigation
                this.updateBreadcrumb(section);
            }
            
            // Analytics tracking
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'quadrant_click', {
                    section: section,
                    timestamp: Date.now()
                });
            }
        }
    }

    showSubQuadrants(section) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSection = section;
        
        // Update breadcrumb navigation
        this.updateBreadcrumb(section);
        
        const transitionStart = performance.now();
        
        // Enhanced transition with quadrant-specific effects
        requestAnimationFrame(() => {
            try {
                // Hide main quadrants with staggered animation
                const mainQuadrants = document.getElementById('mainQuadrants');
                if (mainQuadrants) {
                    const quadrants = mainQuadrants.querySelectorAll('.quadrant');
                    
                    // Animate each quadrant out individually
                    quadrants.forEach((quad, index) => {
                        setTimeout(() => {
                            quad.style.transform = 'scale(0.8) rotateY(15deg)';
                            quad.style.opacity = '0';
                        }, index * 50);
                    });
                    
                    setTimeout(() => {
                        mainQuadrants.style.display = 'none';
                        this.showTargetSection(section);
                        
                        performanceMonitor.logMetric('section_transition_time', 
                            performance.now() - transitionStart);
                    }, 400);
                } else {
                    console.error('❌ Main quadrants element not found');
                    this.isTransitioning = false;
                }
            } catch (error) {
                console.error('❌ Error in showSubQuadrants:', error);
                this.isTransitioning = false;
            }
        });
    }
    
    showTargetSection(section) {
        // Hide all sub-quadrant containers
        const allSubContainers = document.querySelectorAll('.sub-quadrant-container');
        allSubContainers.forEach(container => {
            container.style.display = 'none';
            container.setAttribute('aria-hidden', 'true');
        });
        
        // Show the selected sub-quadrant container with enhanced animation
        const targetContainer = document.getElementById(`${section}-sub`);
        
        if (targetContainer) {
            targetContainer.style.display = 'block';
            targetContainer.setAttribute('aria-hidden', 'false');
            
            // Enhanced entrance animation
            targetContainer.style.opacity = '0';
            targetContainer.style.transform = 'translateY(30px) scale(0.95)';
            
            requestAnimationFrame(() => {
                targetContainer.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                targetContainer.style.opacity = '1';
                targetContainer.style.transform = 'translateY(0) scale(1)';
                
                // Staggered sub-quadrant animation
                const subQuads = targetContainer.querySelectorAll('.sub-quadrant');
                subQuads.forEach((quad, index) => {
                    quad.style.opacity = '0';
                    quad.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        quad.style.transition = 'all 0.4s ease-out';
                        quad.style.opacity = '1';
                        quad.style.transform = 'translateY(0)';
                    }, 200 + (index * 100));
                });
                
                // Focus management for accessibility
                const firstFocusable = targetContainer.querySelector('h2, .back-button');
                if (firstFocusable) {
                    setTimeout(() => firstFocusable.focus(), 300);
                }
                
                this.isTransitioning = false;
            });
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            console.error(`❌ Target container not found: ${section}-sub`);
            this.isTransitioning = false;
        }
    }

    showMainQuadrants() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSection = null;
        
        // Reset breadcrumb to home
        this.updateBreadcrumb(null);
        
        // Hide all sub-quadrant containers with animation
        const allSubContainers = document.querySelectorAll('.sub-quadrant-container');
        allSubContainers.forEach(container => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            container.setAttribute('aria-hidden', 'true');
        });
        
        setTimeout(() => {
            allSubContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            // Show main quadrants
            const mainQuadrants = document.getElementById('mainQuadrants');
            if (mainQuadrants) {
                mainQuadrants.style.display = 'grid';
                
                requestAnimationFrame(() => {
                    mainQuadrants.style.opacity = '1';
                    mainQuadrants.style.transform = 'translateY(0)';
                    mainQuadrants.setAttribute('aria-hidden', 'false');
                    
                    // Focus management
                    const firstQuadrant = mainQuadrants.querySelector('.quadrant');
                    if (firstQuadrant) {
                        firstQuadrant.focus();
                    }
                    
                    this.isTransitioning = false;
                });
            } else {
                console.error('❌ Main quadrants element not found');
                this.isTransitioning = false;
            }
        }, 300);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    updateBreadcrumb(section) {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;
        
        const sectionNames = {
            'standup': 'Stand-up Comedy',
            'branding': 'Branding',
            'writing': 'Writing',
            'corporates': 'Corporate Services'
        };
        
        if (!section) {
            // Home breadcrumb
            breadcrumb.innerHTML = `
                <li class="breadcrumb-item active">
                    <span>Home</span>
                </li>
            `;
        } else {
            // Section breadcrumb
            breadcrumb.innerHTML = `
                <li class="breadcrumb-item">
                    <a onclick="app.showMainQuadrants()">Home</a>
                </li>
                <li class="breadcrumb-item active">
                    <span>${sectionNames[section] || section}</span>
                </li>
            `;
        }
    }

    setupAccessibility() {
        // Add ARIA live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'navigation-announcer';
        document.body.appendChild(liveRegion);
        
        // Add skip navigation link
        const skipLink = document.createElement('a');
        skipLink.href = '#mainQuadrants';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        console.log('✅ Accessibility features initialized');
    }
    
    handleKeydown(e) {
        // Press 'Escape' to go back to main quadrants
        if (e.key === 'Escape') {
            e.preventDefault();
            this.showMainQuadrants();
            this.announceNavigation('Returned to main sections');
        }
        
        // Press numbers 1-4 to navigate to main quadrants
        if (['1', '2', '3', '4'].includes(e.key)) {
            const sections = ['standup', 'branding', 'writing', 'corporates'];
            const sectionNames = ['Stand-up Comedy', 'Branding', 'Writing', 'Corporate Services'];
            const sectionIndex = parseInt(e.key) - 1;
            
            if (sections[sectionIndex]) {
                e.preventDefault();
                this.showSubQuadrants(sections[sectionIndex]);
                this.announceNavigation(`Navigated to ${sectionNames[sectionIndex]} section`);
            }
        }
    }
    
    announceNavigation(message) {
        const announcer = document.getElementById('navigation-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    setupTouchGestures() {
        // Enhanced touch support with better gesture recognition
        document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        
        console.log('✅ Touch gestures initialized');
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        const minSwipeDistance = 100;
        
        // Swipe right to go back to main quadrants
        if (deltaX > minSwipeDistance && Math.abs(deltaY) < 50 && this.currentSection) {
            e.preventDefault();
            this.showMainQuadrants();
            this.announceNavigation('Swiped back to main sections');
        }
        
        // Reset touch coordinates
        this.touchStartX = 0;
        this.touchStartY = 0;
    }

    lazyLoadSubQuadrants() {
        const observer = createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Load content when visible
                    entry.target.classList.add('loaded');
                    
                    // Preload images in this quadrant
                    const images = entry.target.querySelectorAll('img[data-src]');
                    images.forEach(img => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    });
                    
                    // Stop observing this element
                    observer.unobserve(entry.target);
                }
            });
        });
        
        if (observer) {
            document.querySelectorAll('.sub-quadrant').forEach(quad => {
                observer.observe(quad);
            });
        }
        
        console.log('✅ Lazy loading initialized');
    }
    
    preloadCriticalContent() {
        // Preload critical resources
        const criticalImages = document.querySelectorAll('img[data-preload]');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
        
        console.log(`✅ Preloaded ${criticalImages.length} critical images`);
    }

    initializeSocialMediaQuadrants() {
        const socialQuadrants = document.querySelectorAll('.social-quadrant');
        
        socialQuadrants.forEach(quadrant => {
            quadrant.addEventListener('click', function() {
                const link = this.querySelector('.social-cta');
                if (link && link.getAttribute('href')) {
                    window.open(link.getAttribute('href'), '_blank');
                }
            });
            
            // Add hover effects
            quadrant.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            quadrant.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        console.log('✅ Social media quadrants initialized');
    }
    
    // Social media content update methods
    updateInstagramContent() {
        const instagramStats = document.querySelector('.instagram-quadrant .social-stats span');
        if (instagramStats) {
            instagramStats.textContent = 'Recent Comedy Posts';
        }
    }
    
    updateYouTubeContent() {
        const youtubeStats = document.querySelector('.youtube-quadrant .social-stats span');
        if (youtubeStats) {
            youtubeStats.textContent = 'Latest Comedy Videos';
        }
    }
    
    updateLinkedInContent() {
        const linkedinStats = document.querySelector('.linkedin-quadrant .social-stats span');
        if (linkedinStats) {
            linkedinStats.textContent = 'Professional Updates';
        }
    }
}

// Enhanced Innovative Features
class InnovativeFeatures {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollProgress();
        this.setupFloatingContact();
        this.setupParallaxElements();
        this.setupTooltips();
        this.setupPortfolioShowcase();
    }
    
    setupScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / documentHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };
        
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }
    
    setupFloatingContact() {
        const floatingBtn = document.querySelector('.floating-contact');
        if (!floatingBtn) return;
        
        floatingBtn.addEventListener('click', () => {
            // Trigger contact action - could open modal or navigate to contact
            this.showContactOptions();
        });
        
        // Hide/show based on scroll position
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 200) {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.visibility = 'visible';
            } else {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.visibility = 'hidden';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }
    
    showContactOptions() {
        // Create dynamic contact modal
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Get in Touch</h3>
                <div class="contact-options">
                    <a href="https://www.instagram.com/comedian_navin" target="_blank" class="contact-option">
                        📱 Instagram
                    </a>
                    <a href="https://www.linkedin.com/in/navinkumar91/" target="_blank" class="contact-option">
                        💼 LinkedIn
                    </a>
                    <a href="mailto:contact@navinkumar.com" class="contact-option">
                        📧 Email
                    </a>
                </div>
                <button class="close-modal">×</button>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(modal);
        
        // Close functionality
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => e.target === modal && modal.remove();
    }
    
    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        if (parallaxElements.length === 0) return;
        
        const handleParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${45 + scrollY * 0.1}deg)`;
            });
        };
        
        window.addEventListener('scroll', handleParallax, { passive: true });
    }
    
    setupTooltips() {
        const tooltips = document.querySelectorAll('.tooltip');
        
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', () => {
                // Enhanced tooltip positioning logic could go here
            });
        });
    }
    
    setupPortfolioShowcase() {
        // Add portfolio navigation functionality
        const portfolioSection = document.getElementById('portfolioShowcase');
        if (!portfolioSection) return;
        
        // Portfolio item interactions
        const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.querySelector('.portfolio-cta')?.dataset.action;
                
                if (action) {
                    this.handlePortfolioAction(action, item);
                }
            });
        });
    }
    
    handlePortfolioAction(action, item) {
        switch (action) {
            case 'view-gallery':
                console.log('Opening performance gallery...');
                break;
            case 'view-reels':
                window.open('https://www.instagram.com/comedian_navin', '_blank');
                break;
            case 'learn-framework':
                // Could navigate to framework explanation
                console.log('Explaining Quadrant Framework...');
                break;
            default:
                console.log(`Action: ${action}`);
        }
    }
}

// Initialize all applications
const app = new QuadrantApp();
const innovativeFeatures = new InnovativeFeatures();

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuadrantApp, InnovativeFeatures };
}