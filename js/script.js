/**
 * ER Trenchless Chile - Script de Interactividad
 * Funcionalidades: Menú Responsive, Envío AJAX y Cookies
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DEL MENÚ MÓVIL ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('show');
            menuBtn.innerHTML = mainNav.classList.contains('show') ? '&#10005;' : '&#9776;';
        });

        const navLinks = document.querySelectorAll('#main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('show');
                menuBtn.innerHTML = '&#9776;';
            });
        });
    }

    // --- 2. ENVÍO DE FORMULARIO SIN RECARGA (AJAX - OPCIÓN 2) ---
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Detiene la redirección a Formspree
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Validación básica
            const emailInput = document.getElementById('email');
            if (emailInput && !emailInput.value.includes('@')) {
                alert('Por favor, ingrese un correo electrónico válido.');
                return;
            }

            // Cambiamos estado del botón
            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            // Preparamos los datos
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Éxito: Ocultamos formulario y mostramos mensaje
                    contactForm.innerHTML = `
                        <div style="padding: 40px; text-align: center; background: #f4f7f9; border-radius: 12px; border: 2px dashed var(--color-primario);">
                            <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 15px;"></i>
                            <h3 style="color: var(--color-secundario);">¡Mensaje Enviado!</h3>
                            <p>Gracias por contactarnos. Nuestro equipo le responderá a la brevedad.</p>
                            <button onclick="location.reload()" class="cta-button" style="margin-top:20px; font-size: 0.8rem;">Enviar otro mensaje</button>
                        </div>
                    `;
                } else {
                    throw new Error();
                }
            } catch (error) {
                alert('Lo sentimos, hubo un problema al enviar tu mensaje. Por favor intenta de nuevo o escríbenos por WhatsApp.');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    // --- 3. EFECTO DE SCROLL EN EL HEADER ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.padding = '5px 0';
                header.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
            } else {
                header.style.padding = '10px 0';
                header.style.backgroundColor = '#111111';
            }
        }
    });

    // --- 4. AVISO DE COOKIES (CON ESCUDO PROTECTOR) ---
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    if (banner && acceptBtn && rejectBtn) {
        if (!localStorage.getItem("cookiesDecision")) {
            setTimeout(() => {
                banner.classList.add("show");
            }, 1500);
        }

        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("cookiesDecision", "accepted");
            banner.classList.remove("show");
        });

        rejectBtn.addEventListener("click", () => {
            localStorage.setItem("cookiesDecision", "rejected");
            banner.classList.remove("show");
        });
    }
});