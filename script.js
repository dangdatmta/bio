/**
 * Minimal vanilla JS for the bio page
 * Optimized for Lighthouse performance
 */

(function () {
    'use strict';

    // Bio text for typing animation
    const bioText = "Developer, creator, and tech enthusiast. Passionate about AI, automation, and building cool stuff. Always learning, always improving.";

    // Typing animation - runs after page load
    function initTypingAnimation() {
        const typingElement = document.getElementById('typing-bio');
        if (!typingElement) return;

        let charIndex = 0;
        const typingSpeed = 40;

        function typeText() {
            if (charIndex < bioText.length) {
                typingElement.textContent += bioText.charAt(charIndex);
                charIndex++;
                requestAnimationFrame(() => setTimeout(typeText, typingSpeed));
            } else {
                // Remove cursor after typing is complete
                const cursor = document.querySelector('.cursor');
                if (cursor) {
                    setTimeout(() => {
                        cursor.style.opacity = '0';
                    }, 2000);
                }
            }
        }

        // Start typing after page is ready
        setTimeout(typeText, 300);
    }

    // Subtle parallax effect on aurora (desktop only, non-blocking)
    function initParallax() {
        const auroraShapes = document.querySelectorAll('.aurora-shape');
        if (!auroraShapes.length) return;
        if (!window.matchMedia('(min-width: 768px)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let ticking = false;

        document.addEventListener('mousemove', function (e) {
            if (ticking) return;

            ticking = true;
            requestAnimationFrame(() => {
                const mouseX = e.clientX / window.innerWidth - 0.5;
                const mouseY = e.clientY / window.innerHeight - 0.5;

                auroraShapes.forEach((shape, index) => {
                    const speed = (index + 1) * 15;
                    shape.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
                });

                ticking = false;
            });
        }, { passive: true });
    }

    // Intersection Observer for fade-in (performance optimized)
    function initFadeIn() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Skip animations for users who prefer reduced motion
            document.querySelectorAll('.bento-item').forEach(item => {
                item.style.opacity = '1';
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.bento-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.08}s`;
            observer.observe(item);
        });
    }

    // USDT Network selector and copy functionality
    function initUSDTSelector() {
        const networkSelect = document.getElementById('usdt-network-select');
        const qrImage = document.getElementById('usdt-qr-image');
        const copyButton = document.getElementById('usdt-copy-button');

        if (!networkSelect || !qrImage || !copyButton) return;

        // Get current address from selected option
        function getCurrentAddress() {
            const selectedOption = networkSelect.options[networkSelect.selectedIndex];
            return selectedOption.dataset.address;
        }

        // Update QR image when network changes
        networkSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const newQR = selectedOption.dataset.qr;

            // Fade transition for QR image
            qrImage.style.opacity = '0.5';
            qrImage.src = newQR;
            qrImage.onload = function () {
                qrImage.style.opacity = '1';
            };
        });

        // Copy address to clipboard
        copyButton.addEventListener('click', async function () {
            const address = getCurrentAddress();
            const span = this.querySelector('span');
            const originalText = span.textContent;

            try {
                await navigator.clipboard.writeText(address);
                span.textContent = 'Copied!';
                this.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                setTimeout(() => {
                    span.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            } catch (err) {
                span.textContent = 'Failed';
                setTimeout(() => {
                    span.textContent = originalText;
                }, 2000);
            }
        });
    }

    // QR Code Modal Zoom
    function initQRModal() {
        const modal = document.getElementById('qr-modal');
        const modalImage = document.getElementById('qr-modal-image');
        const closeButton = modal?.querySelector('.modal-close');
        const qrImages = document.querySelectorAll('.coffee-qr');

        if (!modal || !modalImage || !qrImages.length) return;

        // Open modal when clicking QR
        qrImages.forEach(qr => {
            qr.addEventListener('click', function () {
                modalImage.src = this.src;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close on button click
        closeButton?.addEventListener('click', closeModal);

        // Close on backdrop click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initTypingAnimation();
        initFadeIn();
        initUSDTSelector();
        initQRModal();
        // Defer parallax to not block initial load
        requestAnimationFrame(initParallax);
    }

})();
