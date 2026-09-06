// Smooth scroll para los enlaces de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Utilidad: resize debounced compartido
    const resizeCallbacks = [];
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCallbacks.forEach(fn => fn());
        }, 150);
    });
    function onResize(fn) { resizeCallbacks.push(fn); }
    const isMobileDevice = () => window.innerWidth <= 768;
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Referencias compartidas (declaradas arriba para evitar TDZ en handlers async)
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const proyectos = document.querySelectorAll('.proyecto');

    // Helper genérico: resalta la card más visible dentro de la zona central (móvil)
    function observeBestVisible(cards, activeClass = 'active', topRatio = 0.25, bottomRatio = 0.75, threshold = 0.15) {
        const observer = new IntersectionObserver(() => {
            let best = null;
            let bestRatio = 0;
            const vh = window.innerHeight;
            const zoneTop = vh * topRatio;
            const zoneBottom = vh * bottomRatio;
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const visible = Math.max(0, Math.min(rect.bottom, zoneBottom) - Math.max(rect.top, zoneTop));
                const ratio = rect.height ? visible / rect.height : 0;
                if (ratio > bestRatio) { bestRatio = ratio; best = card; }
            });
            if (best && bestRatio > threshold && !best.classList.contains(activeClass)) {
                cards.forEach(c => c.classList.remove(activeClass));
                best.classList.add(activeClass);
            }
        }, { threshold: [0, 0.3, 0.6, 1], rootMargin: '0px' });
        cards.forEach(card => observer.observe(card));
        return observer;
    }

    // Tracking liviano de CTAs WhatsApp (data-plan) — listo para GA/Pixel
    document.querySelectorAll('a[data-plan]').forEach(a => {
        a.addEventListener('click', () => {
            const plan = a.getAttribute('data-plan');
            try {
                if (window.gtag) window.gtag('event', 'whatsapp_click', { plan });
                if (window.fbq) window.fbq('trackCustom', 'WhatsAppClick', { plan });
            } catch (e) { /* noop */ }
        });
    });

    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            // El skip-link debe conservar su comportamiento nativo + foco
            if (this.classList.contains('skip-link')) return;

            e.preventDefault();

            const href = this.getAttribute('href');
            
            // Si el href es solo "#", scrollear al inicio
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                // Usar getBoundingClientRect para posición más confiable (especialmente mobile)
                const headerHeight = document.querySelector('.header-main')?.offsetHeight || 80;
                const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
                window.scrollTo({
                    top: top,
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

        onResize(() => {
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
    
    // Mejora de rendimiento con rAF para el evento scroll
    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                if (header) header.classList.toggle('scrolled', window.scrollY > 50);
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Filtro de la galería de proyectos
    if (filtroBtns.length > 0 && proyectos.length > 0) {
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase activa + estado accesible
                filtroBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                // Añadir clase activa al botón pulsado
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                
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
    
    // Overlay siempre visible en móvil (CSS): un solo tap abre el proyecto.
    // Solo usamos .active para el zoom sutil, sin bloquear la navegación.
    proyectos.forEach(proyecto => {
        proyecto.addEventListener('click', () => {
            if (isMobileDevice()) {
                proyectos.forEach(p => p.classList.remove('active'));
                proyecto.classList.add('active');
            }
        });
    });
    
    // Contador de estadísticas animado (respeta reduced-motion)
    function animateNumbers() {
        if (prefersReducedMotion()) return;
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
            mobilePasoObserver = observeBestVisible(pasos, 'active', 0.2, 0.8, 0.3);
        };

        const unobservePasosOnMobile = () => {
            if (mobilePasoObserver) {
                mobilePasoObserver.disconnect();
                mobilePasoObserver = null;
            }
        };

        // Detectar cambios de tamaño de pantalla
        onResize(() => {
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
            // Los pasos son contenido informativo, no controles: sin role="button"
            // ni tabindex para no crear paradas de tab innecesarias.
            paso.addEventListener('mouseenter', () => {
                if (!isMobile) {
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

    // Servicios: scroll-based highlighting on mobile (similar to casos de uso)
    const servicioCards = document.querySelectorAll('.servicio-card');
    if (servicioCards.length) {
        let isMobileSvc = window.innerWidth <= 768;
        let mobileServiciosObserver = null;

        const observeServiciosOnMobile = () => {
            if (mobileServiciosObserver || !isMobileSvc) return;
            mobileServiciosObserver = observeBestVisible(servicioCards, 'active', 0.25, 0.75, 0.15);
        };

        const unobserveServiciosOnMobile = () => {
            if (mobileServiciosObserver) {
                mobileServiciosObserver.disconnect();
                mobileServiciosObserver = null;
                // Limpiar estado active al salir de mobile
                servicioCards.forEach(c => c.classList.remove('active'));
            }
        };

        onResize(() => {
            isMobileSvc = window.innerWidth <= 768;
            if (isMobileSvc) {
                observeServiciosOnMobile();
            } else {
                unobserveServiciosOnMobile();
            }
        });

        if (isMobileSvc) {
            observeServiciosOnMobile();
        }
    }

    // Casos de uso: manejar cards dinámicamente (hover en desktop, scroll/click en móvil)
    const casosCards = document.querySelectorAll('.caso-card');
    if (casosCards.length) {
        let isMobile = window.innerWidth <= 768;
        let mobileCasosObserver = null;

        const observeCasosOnMobile = () => {
            if (mobileCasosObserver || !isMobile) return;
            mobileCasosObserver = observeBestVisible(casosCards, 'active', 0.25, 0.75, 0.15);
        };

        const unobserveCasosOnMobile = () => {
            if (mobileCasosObserver) {
                mobileCasosObserver.disconnect();
                mobileCasosObserver = null;
            }
        };
        
        // Detectar cambios de tamaño de pantalla y activar/desactivar observer móvil
        onResize(() => {
            isMobile = window.innerWidth <= 768;
            if (isMobile) {
                observeCasosOnMobile();
            } else {
                unobserveCasosOnMobile();
            }
        });

        casosCards.forEach(card => {
            // Desktop: hover para cambiar active
            card.addEventListener('mouseenter', () => {
                if (!isMobile) {
                    casosCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }
            });

            // Móvil: click fija la card activa (las caso-card no contienen links,
            // así que no hay navegación que prevenir).
            card.addEventListener('click', () => {
                if (isMobile) {
                    casosCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }
            });
        });

        // Inicializar según el entorno actual
        if (isMobile) {
            observeCasosOnMobile();
        }

        // Desktop: restaurar primer card como active cuando mouse sale de la sección
        const casosSection = document.querySelector('.casos-uso');
        if (casosSection) {
            let mouseLeaveTimeout;
            
            casosSection.addEventListener('mouseleave', () => {
                if (!isMobile) {
                    mouseLeaveTimeout = setTimeout(() => {
                        casosCards.forEach(c => c.classList.remove('active'));
                        casosCards[0]?.classList.add('active');
                    }, 300);
                }
            });

            casosSection.addEventListener('mouseenter', () => {
                clearTimeout(mouseLeaveTimeout);
            });
        }
    }

    // Animación para hacer aparecer elementos al hacer scroll (consolidada)
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

    const sections = document.querySelectorAll('.section-header');
    sections.forEach(section => {
        section.classList.add('fade-in');
        revealObserver.observe(section);
    });

    const cards = document.querySelectorAll('.servicio-card, .paso, .proyecto, .testimonio, .info-card, .escena-item, .valor-item, .caso-card, .faq-item');
    // Agrupar cards por sección padre para que el stagger se reinicie en cada sección
    const sectionGroups = new Map();
    cards.forEach(card => {
        const section = card.closest('section') || card.parentElement;
        if (!sectionGroups.has(section)) {
            sectionGroups.set(section, []);
        }
        sectionGroups.get(section).push(card);
    });

    sectionGroups.forEach(groupCards => {
        groupCards.forEach((card, index) => {
            card.style.transitionDelay = `${Math.min(index * 0.08, 0.48)}s`; // Stagger per-section, máximo 0.48s
            card.classList.add('fade-in');
            revealObserver.observe(card);
        });
    });

    // FAQ accordion: solo un item abierto a la vez
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item && other.open) other.open = false;
                });
            }
        });
    });
});

