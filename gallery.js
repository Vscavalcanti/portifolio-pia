/* =====================================================
   gallery.js — Sistema de Galeria
   =====================================================
   COMO ADICIONAR IMAGENS:
   1. Coloque os arquivos de imagem na pasta /images/
   2. Edite a lista IMAGES abaixo adicionando cada obra
   3. Salve e abra o index.html no navegador
   ===================================================== */

const IMAGES = [
  {
  file: "images/trag.jpeg",  // caminho da imagem
  title: "Trag",
  category: "fanart",  // ou: ilustracao / fanart
},
 {
  file: "images/arkaedius.jpeg",  // caminho da imagem
  title: "",
  category: "character",  // ou: ilustracao / fanart
},
  /* EXEMPLO — remova ou edite estes itens:
  {
    file: "images/obra1.jpg",       // caminho da imagem
    title: "Nome da Obra",          // título exibido no hover e lightbox
    category: "character",          // character | ilustracao | fanart
  },
  {
    file: "images/obra2.png",
    title: "Outra Obra",
    category: "ilustracao",
  },
  */
];

/* =====================================================
   NÃO É PRECISO EDITAR ABAIXO DESTA LINHA
   ===================================================== */

let currentImages = [];
let currentIndex  = 0;

function renderGallery(filter = 'all') {
  const grid  = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');
  if (!grid) return;

  const filtered = filter === 'all'
    ? IMAGES
    : IMAGES.filter(img => img.category === filter);

  currentImages = filtered;

  grid.innerHTML = '';

  if (filtered.length === 0) {
    empty.classList.add('visible');
    return;
  }

  empty.classList.remove('visible');

  filtered.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-index', idx);

    const catLabel = {
      character:  'Character Design',
      ilustracao: 'Ilustração',
      fanart:     'Fan Art',
    }[img.category] || img.category || '';

    item.innerHTML = `
      <img
        src="${img.file}"
        alt="${img.title || ''}"
        loading="lazy"
        onerror="this.parentElement.style.display='none'"
      >
      <div class="gallery-item-overlay">
        <p class="gallery-item-title">${img.title || ''}</p>
        ${catLabel ? `<p class="gallery-item-cat">${catLabel}</p>` : ''}
      </div>
    `;

    item.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(item);
  });

  /* Stagger fade-in */
  const items = grid.querySelectorAll('.gallery-item');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, i * 60);
  });
}

/* --- Filtros --- */
document.addEventListener('DOMContentLoaded', () => {
  renderGallery();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });
});

/* --- Lightbox --- */
function openLightbox(idx) {
  currentIndex = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('lb-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img  = currentImages[currentIndex];
  const catLabel = {
    character:  'Character Design',
    ilustracao: 'Ilustração',
    fanart:     'Fan Art',
  }[img.category] || img.category || '';

  document.getElementById('lbImg').src         = img.file;
  document.getElementById('lbImg').alt         = img.title || '';
  document.getElementById('lbTitle').textContent    = img.title || '';
  document.getElementById('lbCategory').textContent = catLabel;
}

function changeImage(dir) {
  currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
  updateLightbox();
}

/* Teclado: setas e ESC */
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') changeImage(1);
  if (e.key === 'ArrowLeft')  changeImage(-1);
  if (e.key === 'Escape')     { lb.classList.remove('open'); document.body.style.overflow = ''; }
});

/* --- Menu mobile --- */
function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open');
}
