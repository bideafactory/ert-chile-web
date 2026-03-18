/**
 * HTS Chile - Script de Interactividad Básica
 * Funcionalidades: Menú Responsive y Validación de Formulario
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DEL MENÚ MÓVIL (HAMBURGUESA) ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            // Alterna la clase 'show' definida en el CSS
            mainNav.classList.toggle('show');
            
            // Cambia el icono de hamburguesa (☰) a una X (✕) al abrir
            if (mainNav.classList.contains('show')) {
                menuBtn.innerHTML = '&#10005;'; // Signo de multiplicación/X
            } else {
                menuBtn.innerHTML = '&#9776;';  // Signo de hamburguesa
            }
        });
    }
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('show');
            if (menuBtn) menuBtn.innerHTML = '&#9776;';
        });
    });

    // --- 2. VALIDACIÓN DE FORMULARIO DE CONTACTO ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            if (emailInput && !emailInput.value.includes('@')) {
                alert('Por favor, ingrese un correo electrónico válido.');
                isValid = false;
            }
            if (messageInput && messageInput.value.trim() === '') {
                alert('Por favor, escriba su mensaje.');
                isValid = false;
            }
            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // --- 3. EFECTO DE SCROLL EN EL HEADER ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.9)';
        } else {
            header.style.padding = '15px 0';
            header.style.backgroundColor = '#000000';
        }
    });

    //console.log('HTS Chile: Scripts cargados y listos.');
});

document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    if (!localStorage.getItem("cookiesDecision")) {
        setTimeout(() => {
            banner.classList.add("show");
        }, 1000);
    }
    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookiesDecision", "accepted");
        banner.classList.remove("show");
    });
    rejectBtn.addEventListener("click", () => {
        localStorage.setItem("cookiesDecision", "rejected");
        banner.classList.remove("show");
    });
});