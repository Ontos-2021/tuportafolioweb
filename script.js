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
    
    // Manejo de tap en tarjetas de proyectos para mobile
    const isMobileDevice = () => window.innerWidth <= 768;
    
    proyectos.forEach(proyecto => {
        // Prevenir comportamiento por defecto en mobile para controlar la interacción
        proyecto.addEventListener('click', (e) => {
            if (isMobileDevice()) {
                const isActive = proyecto.classList.contains('active');
                
                // Si la tarjeta no está activa, activarla y prevenir navegación
                if (!isActive) {
                    e.preventDefault();
                    
                    // Desactivar todas las demás tarjetas
                    proyectos.forEach(p => p.classList.remove('active'));
                    
                    // Activar la tarjeta actual
                    proyecto.classList.add('active');
                } 
                // Si ya está activa, permitir que el link funcione normalmente
            }
        });
    });
    
    // Cerrar tarjetas activas al hacer scroll en mobile
    let scrollTimeout2;
    window.addEventListener('scroll', () => {
        if (isMobileDevice()) {
            clearTimeout(scrollTimeout2);
            scrollTimeout2 = setTimeout(() => {
                proyectos.forEach(p => p.classList.remove('active'));
            }, 150);
        }
    });
    
    // Cerrar tarjetas activas al hacer tap fuera de ellas
    document.addEventListener('click', (e) => {
        if (isMobileDevice()) {
            const clickedProyecto = e.target.closest('.proyecto');
            if (!clickedProyecto) {
                proyectos.forEach(p => p.classList.remove('active'));
            }
        }
    });
    
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
    // Activar las estadísticas apenas sean visibles en el viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px 50px 0px' });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // (Se eliminó el formulario de contacto: solo CTA de WhatsApp)

    // Metodología: activar paso dinámicamente
    const pasos = document.querySelectorAll('.proceso .paso');
    if (pasos.length) {
        let isMobile = window.innerWidth <= 768;
        let mobilePasoObserver = null;

        const observePasosOnMobile = () => {
            if (mobilePasoObserver || !isMobile) return;
            // En móvil, activar con IntersectionObserver al hacer scroll
            mobilePasoObserver = new IntersectionObserver((entries) => {
                // Buscar entre TODOS los pasos observados (no solo los entries actuales)
                // para encontrar el que tiene mayor visibilidad en este momento
                let bestPaso = null;
                let bestRatio = 0;
                
                pasos.forEach(paso => {
                    const rect = paso.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // Calcular qué porcentaje del paso está en el área visible central
                    const pasoTop = rect.top;
                    const pasoBottom = rect.bottom;
                    const pasoHeight = rect.height;
                    
                    // Zona "activa" central: 20% superior y 20% inferior removidos
                    const activeZoneTop = windowHeight * 0.2;
                    const activeZoneBottom = windowHeight * 0.8;
                    
                    // Calcular intersección con la zona activa
                    const visibleTop = Math.max(pasoTop, activeZoneTop);
                    const visibleBottom = Math.min(pasoBottom, activeZoneBottom);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                    
                    // Ratio de visibilidad: cuánto del paso está en la zona activa
                    const visibilityRatio = visibleHeight / pasoHeight;
                    
                    if (visibilityRatio > bestRatio) {
                        bestRatio = visibilityRatio;
                        bestPaso = paso;
                    }
                });
                
                // Solo cambiar si hay un paso claramente más visible (threshold mínimo)
                if (bestPaso && bestRatio > 0.3) {
                    const currentActive = document.querySelector('.proceso .paso.active');
                    if (currentActive !== bestPaso) {
                        pasos.forEach(p => p.classList.remove('active'));
                        bestPaso.classList.add('active');
                    }
                }
            }, { 
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], 
                rootMargin: '0px'
            });

            pasos.forEach(paso => mobilePasoObserver.observe(paso));
        };

        const unobservePasosOnMobile = () => {
            if (mobilePasoObserver) {
                mobilePasoObserver.disconnect();
                mobilePasoObserver = null;
            }
        };

        // Detectar cambios de tamaño de pantalla
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth <= 768;
            if (isMobile) {
                observePasosOnMobile();
            } else {
                unobservePasosOnMobile();
            }
        });

        // Desktop: setup de listeners
        const setActivePaso = (target) => {
            pasos.forEach(p => p.classList.remove('active'));
            target.classList.add('active');
        };

        pasos.forEach(paso => {
            paso.setAttribute('tabindex', '0');
            paso.setAttribute('role', 'button');

            // Desktop: hover fija el 'active' temporalmente, similar a Servicios
            paso.addEventListener('mouseenter', () => {
                if (!isMobile) {
                    setActivePaso(paso);
                }
            });
            // Teclado: activar al enfocar y limpiar al salir
            paso.addEventListener('focusin', () => setActivePaso(paso));
            paso.addEventListener('focusout', () => {
                pasos.forEach(p => p.classList.remove('active'));
            });
            paso.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePaso(paso);
                }
            });
        });

        // Desktop: restaurar primer paso como activo cuando mouse sale de la sección
        const procesoSection = document.querySelector('.proceso');
        if (procesoSection) {
            let mouseLeaveTimeoutProceso;
            procesoSection.addEventListener('mouseleave', () => {
                if (!isMobile) {
                    mouseLeaveTimeoutProceso = setTimeout(() => {
                        pasos.forEach(p => p.classList.remove('active'));
                        pasos[0]?.classList.add('active');
                    }, 300);
                }
            });
            procesoSection.addEventListener('mouseenter', () => {
                clearTimeout(mouseLeaveTimeoutProceso);
            });
        }

        // Inicializar según el entorno actual
        if (isMobile) {
            observePasosOnMobile();
        }
    }

    // Servicios: manejar featured card dinámicamente (hover en desktop, scroll en móvil)
    const servicioCards = document.querySelectorAll('.servicio-card');
    if (servicioCards.length) {
        let isMobile = window.innerWidth <= 768;
        let mobileServiciosObserver = null;

        const observeServiciosOnMobile = () => {
            if (mobileServiciosObserver || !isMobile) return;
            // Activar la card "featured" según cuál esté más visible al scrollear
            mobileServiciosObserver = new IntersectionObserver((entries) => {
                // Elegir la entrada con mayor intersección visible
                let best = null;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!best || entry.intersectionRatio > best.intersectionRatio) {
                            best = entry;
                        }
                    }
                });
                if (best) {
                    servicioCards.forEach(c => c.classList.remove('featured'));
                    best.target.classList.add('featured');
                }
            }, { threshold: [0.35, 0.5, 0.65, 0.8, 1], rootMargin: '-20% 0px -20% 0px' });

            servicioCards.forEach(card => mobileServiciosObserver.observe(card));
        };

        const unobserveServiciosOnMobile = () => {
            if (mobileServiciosObserver) {
                mobileServiciosObserver.disconnect();
                mobileServiciosObserver = null;
            }
        };
        
        // Detectar cambios de tamaño de pantalla y activar/desactivar observer móvil
        window.addEventListener('resize', () => {
            isMobile = window.innerWidth <= 768;
            if (isMobile) {
                observeServiciosOnMobile();
            } else {
                unobserveServiciosOnMobile();
            }
        });

        servicioCards.forEach(card => {
            // Desktop: hover para cambiar featured
            card.addEventListener('mouseenter', () => {
                if (!isMobile) {
                    servicioCards.forEach(c => c.classList.remove('featured'));
                    card.classList.add('featured');
                }
            });

            // Móvil: click como fallback (por si el usuario quiere fijar una card)
            card.addEventListener('click', (e) => {
                if (isMobile) {
                    const wasFeatured = card.classList.contains('featured');
                    servicioCards.forEach(c => c.classList.remove('featured'));
                    card.classList.add('featured');
                    // Evitar navegación accidental en el primer toque
                    if (!wasFeatured) e.preventDefault();
                }
            });
        });

        // Inicializar según el entorno actual
        if (isMobile) {
            observeServiciosOnMobile();
        }

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
    // Reveal observer: activar cuando los elementos están a punto de aparecer
    // Margen positivo aumentado para que empiecen a animarse antes (250px antes de entrar)
    const observerOptions = { threshold: 0.05, rootMargin: '0px 0px 250px 0px' };
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
        card.style.transitionDelay = `${index * 0.08}s`; // Reducido de 0.1s a 0.08s para más rapidez
        card.classList.add('fade-in');
        revealObserver.observe(card);
    });
});