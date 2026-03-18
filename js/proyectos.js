/**
 * ER Trenchless - Galería de Proyectos (Versión Estable para GitHub Pages)
 */

// 1. Declaramos manualmente la cantidad de fotos que tienes (15 según tu captura)
const TOTAL_IMAGENES = 15; 
const folderPath = 'images/proyectos/';

let proyectosData = [];
let currentIndex = 0;
let slideshowTimer;

const mainViewer = document.getElementById('main-viewer');
const thumbTrack = document.getElementById('thumbnails-track');
const counter = document.getElementById('media-counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

/**
 * Carga las imágenes basadas en el número total definido
 */
function loadGalleryData() {
    proyectosData = [];
    
    // Llenamos el array con los 15 archivos que confirmaste que existen
    for (let i = 1; i <= TOTAL_IMAGENES; i++) {
        proyectosData.push({
            type: 'image',
            url: `${folderPath}${i}.jpg` // Todos son .jpg según tu carpeta
        });
    }

    if (proyectosData.length > 0) {
        renderThumbnails();
        loadMedia(0);
        startSlideshow();
    } else {
        mainViewer.innerHTML = '<div class="viewer-placeholder">No hay archivos en la galería</div>';
    }
}

function loadMedia(index) {
    currentIndex = index;
    const item = proyectosData[index];
    mainViewer.innerHTML = `<img src="${item.url}" style="width:100%; height:100%; object-fit:contain; border-radius: 8px;">`;

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
            startSlideshow();
        };
        thumbTrack.appendChild(thumb);
    });
}

function startSlideshow() {
    clearInterval(slideshowTimer);
    slideshowTimer = setInterval(() => {
        let nextIndex = (currentIndex + 1) % proyectosData.length;
        loadMedia(nextIndex);
    }, 3000);
}

// Botones
nextBtn.addEventListener('click', () => {
    let nextIndex = (currentIndex + 1) % proyectosData.length;
    loadMedia(nextIndex);
    startSlideshow();
});

prevBtn.addEventListener('click', () => {
    let prevIndex = (currentIndex - 1 + proyectosData.length) % proyectosData.length;
    loadMedia(prevIndex);
    startSlideshow();
});

document.addEventListener('DOMContentLoaded', loadGalleryData);