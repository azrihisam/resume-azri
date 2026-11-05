document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        icon.className = 'fas fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scroll with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 72;
                const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    // Single Intersection Observer for Scroll Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.section-title, .about-text p, .skill-category, .cert-showcase, .timeline-item, .portfolio-card, .cert-card, .testimonial-card, .blog-card, .edu-card, .contact-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Animated Counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (isNaN(target)) return;
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(el, target) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.round(increment * step);
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current + '+';
        }, duration / steps);
    }

    // Back to Top
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Carousel Logic
    const track = document.getElementById('tpgCarousel');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dots = Array.from(document.querySelectorAll('.carousel-dot'));
        let currentIndex = 0;

        function updateCarousel(index) {
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }

        nextButton.addEventListener('click', () => {
            let nextIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateCarousel(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            updateCarousel(prevIndex);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => updateCarousel(index));
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox) {
        triggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                lightbox.style.display = 'block';
                const imgSrc = this.getAttribute('data-img') || this.src || this.querySelector('img')?.src;
                const caption = this.getAttribute('data-caption') || this.alt || this.querySelector('img')?.alt || '';
                lightboxImg.src = imgSrc;
                captionText.innerHTML = caption;
                document.body.style.overflow = 'hidden';
            });
        });

        const openCertModalBtn = document.getElementById('openCertModalBtn');
        if (openCertModalBtn) {
            openCertModalBtn.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = 'ctfl-certificate.jpg';
                captionText.innerHTML = 'ISTQB® Certified Tester Foundation Level (CTFL v4.0) — Muhamad Azri Bin Hisam (ASTQB)';
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Copy Certificate ID to Clipboard
    const copyCertIdBtn = document.getElementById('copyCertIdBtn');
    const copyCertIdIcon = document.getElementById('copyCertIdIcon');
    const copyFeedbackToast = document.getElementById('copyFeedbackToast');
    const certIdValue = document.getElementById('certIdValue');

    if (copyCertIdBtn && certIdValue) {
        copyCertIdBtn.addEventListener('click', () => {
            const textToCopy = certIdValue.textContent.trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (copyCertIdIcon) {
                    copyCertIdIcon.className = 'fas fa-check';
                    copyCertIdIcon.style.color = 'var(--success-color)';
                }
                if (copyFeedbackToast) {
                    copyFeedbackToast.classList.add('show');
                }
                setTimeout(() => {
                    if (copyCertIdIcon) {
                        copyCertIdIcon.className = 'far fa-copy';
                        copyCertIdIcon.style.color = '';
                    }
                    if (copyFeedbackToast) {
                        copyFeedbackToast.classList.remove('show');
                    }
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // Insight Modal Logic
    const insightModal = document.getElementById('insightModal');
    const insightModalClose = document.querySelector('.insight-modal-close');
    const insightModalBadge = document.getElementById('insightModalBadge');
    const insightModalTitle = document.getElementById('insightModalTitle');
    const insightModalBody = document.getElementById('insightModalBody');
    const insightCards = document.querySelectorAll('.insight-card');

    if (insightModal) {
        insightCards.forEach(card => {
            card.addEventListener('click', function() {
                insightModal.style.display = 'block';
                insightModalBadge.textContent = this.getAttribute('data-badge');
                insightModalTitle.textContent = this.getAttribute('data-title');
                insightModalBody.innerHTML = this.getAttribute('data-body');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        if (insightModalClose) {
            insightModalClose.addEventListener('click', () => {
                insightModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === insightModal) {
                insightModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});
