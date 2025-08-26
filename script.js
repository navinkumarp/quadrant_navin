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

// Add loading animation
window.addEventListener('load', function() {
    const header = document.querySelector('.header');
    const mainContainer = document.querySelector('.quadrant-container');
    
    if (header) {
        // Animate header
        header.style.opacity = '0';
        header.style.transform = 'translateY(-50px)';
        
        setTimeout(() => {
            header.style.transition = 'all 1s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (mainContainer) {
        // Animate main quadrants
        setTimeout(() => {
            mainContainer.style.opacity = '0';
            mainContainer.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                mainContainer.style.transition = 'all 0.8s ease';
                mainContainer.style.opacity = '1';
                mainContainer.style.transform = 'scale(1)';
            }, 100);
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
            this.showSubQuadrants(section);
            
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
        
        const transitionStart = performance.now();
        
        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => {
            try {
                // Hide main quadrants with animation
                const mainQuadrants = document.getElementById('mainQuadrants');
                if (mainQuadrants) {
                    mainQuadrants.style.opacity = '0';
                    mainQuadrants.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        mainQuadrants.style.display = 'none';
                        this.showTargetSection(section);
                        
                        performanceMonitor.logMetric('section_transition_time', 
                            performance.now() - transitionStart);
                    }, 300);
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
        
        // Show the selected sub-quadrant container
        const targetContainer = document.getElementById(`${section}-sub`);
        
        if (targetContainer) {
            targetContainer.style.display = 'block';
            targetContainer.setAttribute('aria-hidden', 'false');
            
            // Animate in
            requestAnimationFrame(() => {
                targetContainer.style.opacity = '1';
                targetContainer.style.transform = 'translateY(0)';
                
                // Focus management for accessibility
                const firstFocusable = targetContainer.querySelector('h2, .back-button');
                if (firstFocusable) {
                    firstFocusable.focus();
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

// Initialize the application
const app = new QuadrantApp();

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuadrantApp;
}