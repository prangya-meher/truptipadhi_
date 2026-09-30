document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu if clicked outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Full-Screen Editorial Splash Cover Controller ---
    const splashCover = document.getElementById('splash-cover');
    const splashSkip = document.getElementById('splash-skip');
    const splashProgressBar = document.getElementById('splash-progress');

    if (splashCover) {
        let progress = 0;
        const duration = 3000; // 3s balanced display time
        const intervalTime = 30;
        const increment = (intervalTime / duration) * 100;

        const dismissSplash = () => {
            if (!splashCover.classList.contains('splash-dismissed')) {
                splashCover.classList.add('splash-dismissed');
                setTimeout(() => {
                    splashCover.style.display = 'none';
                }, 950);
            }
        };

        const progressTimer = setInterval(() => {
            progress += increment;
            if (splashProgressBar) {
                splashProgressBar.style.width = `${Math.min(progress, 100)}%`;
            }
            if (progress >= 100) {
                clearInterval(progressTimer);
                dismissSplash();
            }
        }, intervalTime);

        if (splashSkip) {
            splashSkip.addEventListener('click', () => {
                clearInterval(progressTimer);
                dismissSplash();
            });
        }

        // Tap or click anywhere on the splash cover to dismiss immediately
        splashCover.addEventListener('click', () => {
            clearInterval(progressTimer);
            dismissSplash();
        });

        // Also allow wheel scroll or keypress to immediately slide up
        window.addEventListener('wheel', () => {
            clearInterval(progressTimer);
            dismissSplash();
        }, { once: true });

        window.addEventListener('keydown', () => {
            clearInterval(progressTimer);
            dismissSplash();
        }, { once: true });
    }

    // --- 2. Editorial Case Study Filtering & Expand Toggle ---
    const filterLinks = document.querySelectorAll('.filter-link');
    const caseCardsHorizontal = document.querySelectorAll('.case-study-card-horizontal');

    filterLinks.forEach(link => {
        link.addEventListener('click', () => {
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const filter = link.getAttribute('data-filter');

            caseCardsHorizontal.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (filter === 'all' || cardCat === filter) {
                    card.style.display = 'block';
                    card.classList.add('is-revealed');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Plus/Minus Expand Toggle Handler
    document.querySelectorAll('.expand-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.case-study-card-horizontal');
            if (card) {
                card.classList.toggle('expanded');
                const icon = btn.querySelector('i');
                if (card.classList.contains('expanded')) {
                    icon.className = 'fas fa-minus';
                    btn.setAttribute('aria-label', 'Collapse Details');
                } else {
                    icon.className = 'fas fa-plus';
                    btn.setAttribute('aria-label', 'Expand Details');
                }
            }
        });
    });

    // --- 3. Web3Forms Contact Submission & Pop-up Modal ---
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('contact-success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    function openSuccessModal() {
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            // Fallback dynamic modal creation if element missing
            const modalEl = document.createElement('div');
            modalEl.className = 'editorial-modal-backdrop active';
            modalEl.id = 'contact-success-modal';
            modalEl.innerHTML = `
                <div class="editorial-modal-card">
                    <button type="button" class="modal-close-btn" aria-label="Close message">&times;</button>
                    <div class="modal-status-icon"><i class="fas fa-paper-plane"></i></div>
                    <div class="modal-tag"><span class="section-dash">—</span><span>MESSAGE CONFIRMATION</span></div>
                    <h3 class="modal-title">Message Delivered</h3>
                    <p class="modal-desc">Thank you for reaching out! Your message has been successfully delivered. I will review your details and contact you soon.</p>
                    <div class="modal-actions">
                        <button type="button" class="btn-editorial-primary modal-action-btn">Got It <i class="fas fa-check"></i></button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalEl);
            document.body.style.overflow = 'hidden';
            modalEl.querySelectorAll('.modal-close-btn, .modal-action-btn').forEach(btn => {
                btn.addEventListener('click', () => closeSuccessModal(modalEl));
            });
            modalEl.addEventListener('click', (e) => {
                if (e.target === modalEl) closeSuccessModal(modalEl);
            });
        }
    }

    function closeSuccessModal(targetModal = successModal) {
        if (targetModal) {
            targetModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (successModal) {
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => closeSuccessModal());
        if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', () => closeSuccessModal());
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSuccessModal();
        }
    });

    // --- Direct Email Mailbox Compose Handler ---
    const composeEmailLinks = document.querySelectorAll('.email-compose-link, #direct-email-link');
    composeEmailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const recipient = 'truptymaipadhy@gmail.com';
            const subject = encodeURIComponent('Consulting & Research Inquiry — Truptimayee Padhi');
            const body = encodeURIComponent('Receiver (To): truptymaipadhy@gmail.com\nSender (From): \n\nHello Truptimayee,\n\nI would like to discuss a project regarding:\n- Scope:\n- Timeline:\n- Contact Details:\n');

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
            const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

            // Synchronously open Gmail compose window in a new tab (never blocked by popup blockers)
            const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

            // If popup was blocked or browser prefers mailto client, invoke system mail app
            if (!win || win.closed || typeof win.closed === 'undefined') {
                window.location.href = mailtoUrl;
            }
        });
    });

    // --- Web3Forms Contact Form Submission Handler ---
if (contactForm) {

    contactForm.addEventListener('submit', async function (e) {

        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-editorial-submit');

        const originalHTML = submitBtn
            ? submitBtn.innerHTML
            : 'Send Message';

        // Disable button while sending
        if (submitBtn) {
            submitBtn.innerHTML =
                'Sending Message... <i class="fas fa-spinner fa-spin"></i>';

            submitBtn.disabled = true;
        }

        // Collect form data
        const formData = new FormData(contactForm);

        try {

            const response = await fetch(
                'https://api.web3forms.com/submit',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const result = await response.json();

            console.log('Web3Forms response:', result);

            if (response.ok && result.success) {

                // Show successful state
                if (submitBtn) {
                    submitBtn.innerHTML =
                        'Message Delivered <i class="fas fa-check"></i>';

                    submitBtn.style.backgroundColor = '#2d6a4f';
                }

                // Clear form
                contactForm.reset();

                // Open your existing success modal
                openSuccessModal();

            } else {

                console.error(
                    'Web3Forms submission failed:',
                    result
                );

                if (submitBtn) {
                    submitBtn.innerHTML =
                        'Submission Failed <i class="fas fa-exclamation-circle"></i>';

                    submitBtn.style.backgroundColor = '#b7094c';
                }

                alert(
                    result.message ||
                    'Unable to send your message. Please try again.'
                );
            }

        } catch (error) {

            console.error(
                'Web3Forms network error:',
                error
            );

            if (submitBtn) {
                submitBtn.innerHTML =
                    'Try Again <i class="fas fa-exclamation-circle"></i>';

                submitBtn.style.backgroundColor = '#b7094c';
            }

            alert(
                'Unable to connect to the email service. Please try again.'
            );

        } finally {

            // Restore button after 4.5 seconds
            setTimeout(() => {

                if (submitBtn) {

                    submitBtn.innerHTML = originalHTML;

                    submitBtn.disabled = false;

                    submitBtn.style.backgroundColor = '';
                }

            }, 4500);
        }

    });

}

    // --- 4. Dynamic Animated Key Metrics Counter ---
    const tickerSection = document.querySelector('.ticker-section');
    const metricNums = document.querySelectorAll('.metric-num');

    if (metricNums.length > 0) {
        let hasAnimated = false;

        const animateCounters = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            metricNums.forEach(numEl => {
                const target = parseInt(numEl.getAttribute('data-target'), 10);
                if (isNaN(target)) return;

                const suffix = numEl.getAttribute('data-suffix') || '';
                const prefix = numEl.getAttribute('data-prefix') || '';
                const padLength = parseInt(numEl.getAttribute('data-pad'), 10) || 0;
                const duration = 2000; // 2 seconds smooth counting
                const startTime = performance.now();

                const formatValue = (val) => {
                    let str = String(val);
                    if (padLength > 0) {
                        str = str.padStart(padLength, '0');
                    }
                    return `${prefix}${str}${suffix}`;
                };

                // Start from 0 (or 00)
                numEl.textContent = formatValue(0);
                const parentBlock = numEl.closest('.metric-block');
                if (parentBlock) {
                    parentBlock.classList.add('counter-active');
                }

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Smooth easeOutCubic curve for realistic decelerating odometer feel
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.round(easeOut * target);

                    numEl.textContent = formatValue(currentVal);

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        numEl.textContent = formatValue(target);
                    }
                };

                requestAnimationFrame(updateCounter);
            });
        };

        const triggerTarget = tickerSection || metricNums[0];
        if (triggerTarget) {
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        // Check if editorial splash cover is still active
                        const splash = document.getElementById('splash-cover');
                        if (splash && !splash.classList.contains('splash-dismissed') && getComputedStyle(splash).display !== 'none') {
                            const checkSplashInterval = setInterval(() => {
                                if (!splash || splash.classList.contains('splash-dismissed') || getComputedStyle(splash).display === 'none') {
                                    clearInterval(checkSplashInterval);
                                    animateCounters();
                                }
                            }, 100);
                        } else {
                            animateCounters();
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            });

            counterObserver.observe(triggerTarget);
        }
    }

    // --- 5. Sequential Experience Timeline Scroll Observer ---
    const expTimeline = document.querySelector('.experience-timeline');
    const expItems = document.querySelectorAll('.experience-item');

    if (expTimeline || expItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('experience-timeline')) {
                        entry.target.classList.add('timeline-active');
                    }
                    if (entry.target.classList.contains('experience-item')) {
                        entry.target.classList.add('animated');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        if (expTimeline) {
            timelineObserver.observe(expTimeline);
        }
        expItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // --- 6. Universal Editorial Scroll Reveal Observer ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 7. Smooth Scroll to Top ---
    const backToTopLinks = document.querySelectorAll('.back-top-link');
    backToTopLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

});
