// Smooth scroll para los enlaces de navegación
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Animación de header al hacer scroll
    const header = document.querySelector('.header-main');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Navegación móvil: mostrar/ocultar menú accesible
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMenu();
        });

        mainNav.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                toggleMenu(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                toggleMenu(false);
            }
        });

        function toggleMenu(forceState = null) {
            const isOpen = mainNav.classList.contains('open');
            const shouldOpen = forceState !== null ? forceState : !isOpen;

            mainNav.classList.toggle('open', shouldOpen);
            menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            document.body.classList.toggle('menu-open', shouldOpen);

            if (shouldOpen) {
                document.addEventListener('click', handleOutsideClick);
            } else {
                document.removeEventListener('click', handleOutsideClick);
            }
        }

        function handleOutsideClick(event) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                toggleMenu(false);
            }
        }
    }
    
    // Mejora de rendimiento con throttling para el evento scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10);
    });
    
    // Filtro de la galería de proyectos
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const proyectos = document.querySelectorAll('.proyecto');
    
    if (filtroBtns.length > 0 && proyectos.length > 0) {
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase activa
                filtroBtns.forEach(b => b.classList.remove('active'));
                // Añadir clase activa al botón pulsado
                btn.classList.add('active');
                
                const filtro = btn.getAttribute('data-filter');
                
                proyectos.forEach(proyecto => {
                    // Añadir animación de fade
                    proyecto.classList.add('fade-out');
                    
                    setTimeout(() => {
                        if (filtro === 'todos') {
                            proyecto.style.display = 'block';
                        } else {
                            const categoria = proyecto.getAttribute('data-category');
                            if (categoria === filtro) {
                                proyecto.style.display = 'block';
                            } else {
                                proyecto.style.display = 'none';
                            }
                        }
                        
                        setTimeout(() => {
                            proyecto.classList.remove('fade-out');
                        }, 50);
                    }, 300);
                });
            });
        });
    }
    
    // Contador de estadísticas animado
    function animateNumbers() {
        const stats = document.querySelectorAll('.number');
        
        stats.forEach(stat => {
            const originalText = stat.textContent;
            const numberMatch = originalText.match(/\d+/);
            
            if (!numberMatch) return; // Si no hay número, no animar
            
            const targetValue = parseInt(numberMatch[0]);
            const prefix = originalText.substring(0, numberMatch.index);
            const suffix = originalText.substring(numberMatch.index + numberMatch[0].length);
            
            const duration = 2000; // duración en milisegundos
            const startTime = Date.now();
            const startValue = 0;
            
            function updateCount() {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easedProgress = easeOutCubic(progress);
                const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
                
                stat.textContent = prefix + currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }
            
            function easeOutCubic(x) {
                return 1 - Math.pow(1 - x, 3);
            }
            
            updateCount();
        });
    }
    
    // Observer para activar la animación cuando el elemento sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // Animación de elementos al hacer scroll
    const animatedElements = document.querySelectorAll('.servicio-card, .paso, .proyecto, .testimonio, .info-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('element-visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        appearOnScroll.observe(el);
    });
    
    // Añadir estilos dinámicos para las animaciones de scroll
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.element-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // (Se eliminó el formulario de contacto: solo CTA de WhatsApp)

    // Metodología: activar paso dinámicamente
    const pasos = document.querySelectorAll('.proceso .paso');
    if (pasos.length) {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // En móvil, activar con IntersectionObserver al hacer scroll
            const pasoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        pasos.forEach(p => p.classList.remove('active'));
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.6, rootMargin: '-30% 0px -30% 0px' });

            pasos.forEach(paso => pasoObserver.observe(paso));
        } else {
            // En desktop, activar con hover
            const setActivePaso = (target) => {
                pasos.forEach(p => p.classList.remove('active'));
                target.classList.add('active');
            };

            pasos.forEach(paso => {
                paso.setAttribute('tabindex', '0');
                paso.setAttribute('role', 'button');

                paso.addEventListener('mouseenter', () => setActivePaso(paso));
                paso.addEventListener('focusin', () => setActivePaso(paso));
                paso.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActivePaso(paso);
                    }
                });
            });
        }
    }

    // Servicios: manejar featured card dinámicamente (hover en desktop, tap en móvil)
    const servicioCards = document.querySelectorAll('.servicio-card');
    if (servicioCards.length) {
        let isMobile = window.innerWidth <= 768;
        
        // Detectar cambios de tamaño de pantalla
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth <= 768;
        });

        servicioCards.forEach(card => {
            // Desktop: hover para cambiar featured
            card.addEventListener('mouseenter', () => {
                if (!isMobile) {
                    servicioCards.forEach(c => c.classList.remove('featured'));
                    card.classList.add('featured');
                }
            });

            // Móvil: usar click en lugar de touchstart para evitar conflictos con scroll
            card.addEventListener('click', (e) => {
                if (isMobile) {
                    const wasFeatured = card.classList.contains('featured');
                    servicioCards.forEach(c => c.classList.remove('featured'));
                    card.classList.add('featured');
                    
                    // Si no estaba featured, prevenir navegación accidental
                    if (!wasFeatured) {
                        e.preventDefault();
                    }
                }
            });
        });

        // Desktop: restaurar primer card como featured cuando mouse sale de la sección
        const serviciosSection = document.querySelector('.servicios');
        if (serviciosSection) {
            let mouseLeaveTimeout;
            
            serviciosSection.addEventListener('mouseleave', () => {
                if (!isMobile) {
                    mouseLeaveTimeout = setTimeout(() => {
                        servicioCards.forEach(c => c.classList.remove('featured'));
                        servicioCards[0]?.classList.add('featured');
                    }, 300);
                }
            });

            serviciosSection.addEventListener('mouseenter', () => {
                clearTimeout(mouseLeaveTimeout);
            });
        }
    }
});

// Animación para hacer aparecer elementos al hacer scroll (consolidada)
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = { threshold: 0.25 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        revealObserver.observe(section);
    });

    const cards = document.querySelectorAll('.servicio-card, .paso, .proyecto, .testimonio, .info-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        revealObserver.observe(card);
    });
});