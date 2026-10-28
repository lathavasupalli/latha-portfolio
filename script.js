/* =============================================
   Vasupalli Latha — Portfolio JavaScript
   Interactivity: Matrix BG, Typing Effect, Nav,
   Scroll Reveal, Skill Bars, Contact Form
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== Matrix Rain Background ===== */
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const matrixChars = '01<>{}[]/\\|+-*=&$#@!?ABCDEFabcdef0123456789';
    const charArray = matrixChars.split('');
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        // Translucent black for trail effect
        ctx.fillStyle = 'rgba(10, 14, 20, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff9c';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Fade brightness for distant characters
            ctx.fillStyle = drops[i] % 2 === 0 ? '#00ff9c' : '#00d9ff';
            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    // Reset columns on resize
    window.addEventListener('resize', () => {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    });

    /* ===== Typing Effect ===== */
    const roles = [
        'Cybersecurity Student',
        'Aspiring Ethical Hacker',
        'CTF Player',
        'Security Researcher',
        'Bug Bounty Hunter'
    ];

    const typedText = document.getElementById('typed-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typedText.textContent = currentRole.substring(0, charIndex);

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2200; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // pause before next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();

    /* ===== Navbar Scroll Effect ===== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Add scrolled background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active section in nav
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    /* ===== Mobile Menu Toggle ===== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksList.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinksList.classList.remove('open');
        });
    });

    /* ===== Scroll Reveal Animations ===== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ===== Animated Skill Bars ===== */
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    skillFills.forEach(fill => skillObserver.observe(fill));

    /* ===== Contact Form Handling (Formspree) ===== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.form-submit');
    const formEndpoint = contactForm.getAttribute('action');
    const formFeedback = document.getElementById('form-feedback');

    function showFeedback(type, message) {
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback show ' + type;
        setTimeout(() => {
            formFeedback.className = 'form-feedback';
        }, 5000);
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !subject || !message) {
            shakeForm();
            showFeedback('error', 'Please fill in all fields correctly.');
            return;
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            shakeForm();
            showFeedback('error', 'Please enter a valid email address.');
            return;
        }

        // Check if Formspree endpoint is configured
        if (!formEndpoint || formEndpoint === 'YOUR_FORMSPREE_ENDPOINT') {
            // Fallback to mailto if Formspree not set up yet
            submitBtn.classList.add('sending');
            submitBtn.disabled = true;
            const mailtoLink = `mailto:lathavasupalli14@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            window.location.href = mailtoLink;
            setTimeout(() => {
                submitBtn.classList.remove('sending');
                submitBtn.classList.add('sent');
                submitBtn.disabled = false;
                showFeedback('success', 'Opening your email app...');
                setTimeout(() => {
                    submitBtn.classList.remove('sent');
                    contactForm.reset();
                }, 3000);
            }, 1000);
            return;
        }

        // Show sending state
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(formEndpoint, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Success
                submitBtn.classList.remove('sending');
                submitBtn.classList.add('sent');
                contactForm.reset();
                showFeedback('success', '✓ Message sent successfully! I\'ll get back to you soon.');

                // Reset button after 4 seconds
                setTimeout(() => {
                    submitBtn.classList.remove('sent');
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                // Formspree returned an error
                throw new Error('Submission failed');
            }
        } catch (error) {
            // Fallback to mailto if fetch fails
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
            showFeedback('error', 'Could not send directly. Opening email app instead...');
            const mailtoLink = `mailto:lathavasupalli14@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            window.location.href = mailtoLink;
        }
    });

    function shakeForm() {
        contactForm.style.animation = 'none';
        setTimeout(() => {
            contactForm.style.animation = 'shake 0.4s ease';
        }, 10);
    }

    // Inject shake keyframe dynamically
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    /* ===== Smooth Scroll for Anchor Links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ===== Footer Year ===== */
    document.getElementById('year').textContent = new Date().getFullYear();

});
