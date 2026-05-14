// GitHub Copilot Presentation - JavaScript

class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('indicators');
        this.progressFill = document.getElementById('progressFill');
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.bindEvents();
        this.updateUI();
    }
    
    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator' + (i === 0 ? ' active' : '');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(indicator);
        }
    }
    
    bindEvents() {
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
        
        // Mouse wheel navigation
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else if (e.deltaY < 0) {
                    this.prevSlide();
                }
            }, 50);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(index) {
        if (index === this.currentSlide) return;
        
        // Remove classes from all slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i < index) {
                slide.classList.add('prev');
            }
        });
        
        // Activate current slide
        this.slides[index].classList.add('active');
        this.currentSlide = index;
        
        this.updateUI();
        this.animateSlideContent(this.slides[index]);
    }
    
    updateUI() {
        // Update buttons
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Update indicators
        const indicatorDots = this.indicators.querySelectorAll('.indicator');
        indicatorDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        
        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    animateSlideContent(slide) {
        // Reset animations by removing and re-adding elements
        const elements = slide.querySelectorAll('.activity-list li, .roi-card, .benefit-card, .timeline-item, .investment-card');
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (i * 100));
        });
        
        // Animate circular progress
        const progressCircles = slide.querySelectorAll('.circular-progress .progress');
        progressCircles.forEach(circle => {
            circle.style.strokeDashoffset = '283';
            setTimeout(() => {
                circle.style.transition = 'stroke-dashoffset 1.5s ease';
                circle.style.strokeDashoffset = '141.5';
            }, 300);
        });
        
        // Animate growth bar
        const growthFills = slide.querySelectorAll('.growth-fill');
        growthFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.transition = 'width 1s ease';
                fill.style.width = targetWidth;
            }, 500);
        });
    }
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .metric-value');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const hasPercent = text.includes('%');
        const hasDollar = text.includes('$');
        const value = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(value)) return;
        
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current >= value) {
                current = value;
            }
            
            let display = current.toFixed(value % 1 !== 0 ? 1 : 0);
            if (hasDollar) display = '$' + display;
            if (hasPercent) display += '%';
            
            counter.textContent = display;
            
            if (current < value) {
                setTimeout(updateCounter, stepDuration);
            }
        };
        
        // Start counter when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    current = 0;
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Particle background effect (optional)
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.3;';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 217, 255, ${p.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    resize();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new Presentation();
    animateCounters();
    createParticles();
    
    // Expose presentation object for debugging
    window.presentation = presentation;
    
    console.log('GitHub Copilot Presentation loaded');
    console.log('Controls: Arrow keys, Space, Mouse wheel, Touch swipe');
});
