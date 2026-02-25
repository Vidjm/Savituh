document.addEventListener('DOMContentLoaded', () => {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Dynamic Glass Navbar
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Form Elements & Logic
    const form = document.getElementById('waitlistForm');
    const successMsg = document.getElementById('formSuccess');
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    const teenSurvey = document.getElementById('teenSurvey');
    const surveyInputs = teenSurvey ? teenSurvey.querySelectorAll('input') : [];

    // Handle conditional revealing of teen survey
    if (userTypeRadios.length && teenSurvey) {
        userTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'teen') {
                    teenSurvey.classList.remove('hidden-survey');
                    teenSurvey.style.position = 'relative';
                    teenSurvey.style.visibility = 'visible';
                    // Make inputs required when active
                    surveyInputs.forEach(input => input.setAttribute('required', 'true'));
                } else {
                    teenSurvey.classList.add('hidden-survey');
                    teenSurvey.style.position = 'absolute';
                    teenSurvey.style.visibility = 'hidden';
                    // Remove required when hidden
                    surveyInputs.forEach(input => input.removeAttribute('required'));
                }
            });
        });
    }

    // Form Submission to Google Sheets
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            // Loading state
            btn.textContent = "Joining...";
            btn.style.opacity = "0.7";
            btn.disabled = true;

            // IMPORTANT: Replace this string with your Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyALITI7jMLR1mmx8jsO1nF8pKxl4C_YVvqnSctWdIsZjEmlXjUww7sGpVBF7CzaGS2/exec';

            // If the URL is not set yet, simulate success for testing
            if (scriptURL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                console.warn("Google Script URL not set. Simulating success.");
                setTimeout(() => showSuccess(), 1000);
                return;
            }

            const formData = new FormData(form);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    showSuccess();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    btn.textContent = originalText;
                    btn.style.opacity = "1";
                    btn.disabled = false;
                    alert("Something went wrong. Please try again.");
                });

            function showSuccess() {
                form.style.display = "none";
                successMsg.classList.remove('hidden');
                successMsg.style.position = "static";

                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
            }
        });
    }

    // Glow Effect on feature cards following mouse cursor
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
