document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Full-Screen Editorial Splash Cover Controller ---
    const splashCover = document.getElementById('splash-cover');
    const splashSkip = document.getElementById('splash-skip');
    const splashProgressBar = document.getElementById('splash-progress');

    if (splashCover) {
        let progress = 0;
        const duration = 3000; // 4.5s balanced display time
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

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-editorial-submit');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending Message... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            const jsonPayload = JSON.stringify(formObject);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: jsonPayload
                });

                const result = await response.json();

                if (result.success) {
                    submitBtn.innerHTML = 'Message Delivered <i class="fas fa-check"></i>';
                    submitBtn.style.backgroundColor = '#2d6a4f';
                    contactForm.reset();
                    openSuccessModal();
                } else {
                    console.error('Web3Forms API error:', result);
                    submitBtn.innerHTML = (result.message || 'Submission Error') + ' <i class="fas fa-exclamation-circle"></i>';
                    submitBtn.style.backgroundColor = '#b7094c';
                }
            } catch (error) {
                console.error('Contact Form Fetch/CORS error:', error);
                if (window.location.protocol === 'file:') {
                    submitBtn.innerHTML = 'file:/// blocks API (Use localhost/live server) <i class="fas fa-info-circle"></i>';
                } else {
                    submitBtn.innerHTML = 'Network Error. Try Again';
                }
                submitBtn.style.backgroundColor = '#b7094c';
            }

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 4500);
        });
    }

    // --- 4. Sequential Experience Timeline Scroll Observer ---
    const expItems = document.querySelectorAll('.experience-item');
    if (expItems.length > 0) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        };

        const expObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        expItems.forEach(item => {
            expObserver.observe(item);
        });
    }

    // --- 5. Smooth Scroll to Top ---
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
