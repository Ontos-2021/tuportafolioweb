// Navegación suave al hacer clic en los enlaces del menú
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a, .btn-principal');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Desplazamiento suave
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Ajuste para el header fijo
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Cambiar estilo del header al hacer scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Manejar el envío del formulario
    const contactForm = document.querySelector('.contacto-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Aquí normalmente se enviaría la información a un backend
            // Por ahora, solo mostraremos un mensaje de éxito
            alert(`¡Gracias ${nombre} por contactarnos! Te responderemos a la brevedad.`);
            
            // Limpiar el formulario
            contactForm.reset();
        });
    }
});

// Animación para hacer aparecer elementos al hacer scroll
const observerOptions = {
    threshold: 0.25
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Cuando el DOM esté cargado, añadir las clases y observar los elementos
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Añadir clases para animaciones específicas
    const cards = document.querySelectorAll('.servicio-card, .paso, .proyecto, .testimonio');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        observer.observe(card);
    });
});