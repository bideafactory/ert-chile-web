/**
 * ER Trenchless - Galería de Hincados Destacados con Auto-Play
 */

let proyectosData = [];
let currentIndex = 0;
let slideshowTimer;

const mainViewer = document.getElementById('main-viewer');
const thumbTrack = document.getElementById('thumbnails-track');
const counter = document.getElementById('media-counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// ⚠️ CAMBIO CLAVE: La ruta ahora busca la carpeta de imágenes desde la subcarpeta /servicios/
const folderPath = '../images/hincados/'; 

/**
 * Escáner Automático de Archivos Numerados
 */
async function autoDiscoverMedia() {
    try {
        proyectosData = [];
        const extensiones = ['png', 'jpg', 'jpeg', 'mp4', 'webm'];
        let numeroActual = 1;
        let seguirBuscando = true;

        mainViewer.innerHTML = '<div class="viewer-placeholder">Cargando galería...</div>';

        while (seguirBuscando) {
            let archivoEncontrado = false;

            for (const ext of extensiones) {
                const urlPrueba = `${folderPath}${numeroActual}.${ext}`;
                
                try {
                    const respuesta = await fetch(urlPrueba, { method: 'HEAD' });

                    if (respuesta.ok) {
                        const type = (ext === 'mp4' || ext === 'webm') ? 'video' : 'image';
                        proyectosData.push({ type: type, url: urlPrueba });
                        archivoEncontrado = true;
                        break; 
                    }
                } catch (error) {
                    // Continúa probando
                }
            }

            if (archivoEncontrado) {
                numeroActual++; 
            } else {
                seguirBuscando = false; 
            }
        }

        if (proyectosData.length > 0) {
            renderThumbnails();
            loadMedia(0);
            startSlideshow();
        } else {
            mainViewer.innerHTML = '<div class="viewer-placeholder">No hay fotos de hincados aún.</div>';
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
        mainViewer.innerHTML = `<img src="${item.url}" style="width:100%; height:100%; object-fit:contain; border-radius: 8px;">`;
    } else if (item.type === 'video') {
        mainViewer.innerHTML = `
            <video controls autoplay style="width:100%; height:100%; border-radius: 8px;">
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
        thumb.innerHTML = `<img src="${item.url}" alt="thumb" style="width:100%; height:100%; object-fit:cover; border-radius: 4px;">`;
        thumb.onclick = () => {
            loadMedia(index);
            resetSlideshow();
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
    resetSlideshow();
});

prevBtn.addEventListener('click', () => {
    if (proyectosData.length === 0) return;
    let prevIndex = (currentIndex - 1 + proyectosData.length) % proyectosData.length;
    loadMedia(prevIndex);
    resetSlideshow();
});

// Iniciamos todo cuando carga la página
document.addEventListener('DOMContentLoaded', autoDiscoverMedia);