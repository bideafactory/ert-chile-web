/**
 * HTS Chile - Galería con Auto-Play (3 segundos)
 */

let proyectosData = [];
let currentIndex = 0;
let slideshowTimer;

const mainViewer = document.getElementById('main-viewer');
const thumbTrack = document.getElementById('thumbnails-track');
const counter = document.getElementById('media-counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const folderPath = 'images/proyectos/';

/**
 * Escáner Automático de Archivos Numerados (Solución Dinámica)
 */
async function autoDiscoverMedia() {
    try {
        proyectosData = [];
        const extensiones = ['png', 'jpg', 'jpeg', 'mp4', 'webm'];
        let numeroActual = 1;
        let seguirBuscando = true;

        // Mostrar un mensaje de carga mientras busca
        mainViewer.innerHTML = '<div class="viewer-placeholder">Cargando galería...</div>';

        while (seguirBuscando) {
            let archivoEncontrado = false;

            // Probamos cada extensión para el número actual
            for (const ext of extensiones) {
                const urlPrueba = `${folderPath}${numeroActual}.${ext}`;
                
                try {
                    // Usamos el método HEAD para preguntar si existe sin descargar el archivo completo
                    const respuesta = await fetch(urlPrueba, { method: 'HEAD' });

                    if (respuesta.ok) {
                        // ¡Existe! Lo agregamos a la lista
                        const type = (ext === 'mp4' || ext === 'webm') ? 'video' : 'image';
                        proyectosData.push({ type: type, url: urlPrueba });
                        archivoEncontrado = true;
                        break; // Rompemos el ciclo de extensiones porque ya hallamos el de este número
                    }
                } catch (error) {
                    // Error de red temporal, el ciclo continúa probando
                }
            }

            if (archivoEncontrado) {
                numeroActual++; // Pasamos al siguiente número (ej. de 23 a 24)
            } else {
                seguirBuscando = false; // No encontró ninguna extensión para este número, FIN DEL ESCANEO.
            }
        }

        // Renderizamos la galería final
        if (proyectosData.length > 0) {
            renderThumbnails();
            loadMedia(0);
            startSlideshow();
        } else {
            mainViewer.innerHTML = '<div class="viewer-placeholder">No hay archivos en la galería</div>';
        }

    } catch (error) {
        console.error("Error crítico al armar la galería:", error);
        mainViewer.innerHTML = '<div class="viewer-placeholder">Error al cargar la galería</div>';
    }
}

/**
 * Funciones del Carrusel Automático
 */
function startSlideshow() {
    clearInterval(slideshowTimer);
    
    slideshowTimer = setInterval(() => {
        let nextIndex = (currentIndex + 1) % proyectosData.length;
        loadMedia(nextIndex);
    }, 3000);
}

function resetSlideshow() {
    startSlideshow();
}

/**
 * Cambia el recurso en el visualizador
 */
function loadMedia(index) {
    currentIndex = index;
    const item = proyectosData[index];
    mainViewer.innerHTML = '';

    if (item.type === 'image') {
        mainViewer.innerHTML = `<img src="${item.url}" style="width:100%; height:100%; object-fit:contain;">`;
    } else if (item.type === 'video') {
        mainViewer.innerHTML = `
            <video controls autoplay style="width:100%; height:100%;">
                <source src="${item.url}" type="video/mp4">
            </video>`;
    }

    counter.innerText = `${index + 1} / ${proyectosData.length}`;
    
    const thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });

    if (thumbs[index]) {
        thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function renderThumbnails() {
    thumbTrack.innerHTML = '';
    proyectosData.forEach((item, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumb-item';
        thumb.innerHTML = `<img src="${item.url}" alt="thumb" style="width:100%; height:100%; object-fit:cover;">`;
        thumb.onclick = () => {
            loadMedia(index);
            resetSlideshow(); // Reinicia el tiempo si el usuario hace clic
        };
        thumbTrack.appendChild(thumb);
    });
}

/**
 * LÓGICA DE BOTONES
 */
nextBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let nextIndex = (currentIndex + 1) % proyectosData.length;
    loadMedia(nextIndex);
    resetSlideshow(); // Reinicia el tiempo al usar el botón
});

prevBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let prevIndex = (currentIndex - 1 + proyectosData.length) % proyectosData.length;
    loadMedia(prevIndex);
    resetSlideshow();
});

document.addEventListener('DOMContentLoaded', autoDiscoverMedia);