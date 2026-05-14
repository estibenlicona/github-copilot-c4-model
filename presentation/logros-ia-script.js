// Logros IA Presentation - Navigation Script

class LogrosIAPresentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicatorsContainer = document.getElementById('indicators');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressFill = document.getElementById('progressFill');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.createIndicators();
        this.setupNavigation();
        this.setupKeyboard();
        this.setupTouch();
        this.setupWheel();
        this.updateUI();
    }

    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator' + (i === 0 ? ' active' : '');
            indicator.addEventListener('click', () => this.goTo(i));
            this.indicatorsContainer.appendChild(indicator);
        }
        this.indicators = document.querySelectorAll('.indicator');
    }

    setupNavigation() {
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.next();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goTo(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goTo(this.totalSlides - 1);
                    break;
            }
        });
    }

    setupTouch() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }

    setupWheel() {
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (wheelTimeout) return;
            
            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, 800);

            if (e.deltaY > 0) {
                this.next();
            } else {
                this.prev();
            }
        }, { passive: true });
    }

    goTo(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        if (index < 0 || index >= this.totalSlides) return;

        this.isAnimating = true;
        const direction = index > this.currentSlide ? 1 : -1;

        // Update slides
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add(direction > 0 ? 'prev' : '');
        
        this.slides[index].classList.remove('prev');
        this.slides[index].classList.add('active');

        this.currentSlide = index;
        this.updateUI();

        setTimeout(() => {
            this.slides.forEach((slide, i) => {
                if (i !== this.currentSlide) {
                    slide.classList.remove('prev');
                }
            });
            this.isAnimating = false;
        }, 600);
    }

    next() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goTo(this.currentSlide + 1);
        }
    }

    prev() {
        if (this.currentSlide > 0) {
            this.goTo(this.currentSlide - 1);
        }
    }

    updateUI() {
        // Update indicators
        this.indicators?.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }

        // Update progress
        if (this.progressFill) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = progress + '%';
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new LogrosIAPresentation();
});
