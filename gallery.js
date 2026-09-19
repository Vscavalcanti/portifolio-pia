/* =====================================================
   gallery.js — Sistema de Galeria
   =====================================================
   As obras vêm do painel /admin (publicadas via Netlify
   Blobs). A lista é buscada em /api/obras e cada imagem
   é exibida a partir de /img/<id>.
   ===================================================== */

let IMAGES = [];
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

/* --- Carregar obras publicadas e filtros --- */
function carregarObras() {
  return fetch('/api/obras', { cache: 'no-store' })
    .then(r => r.json())
    .then(obras => {
      IMAGES = obras.map(o => ({
        file: '/img/' + o.id,
        title: o.title,
        category: o.category,
      }));
    })
    .catch(() => { IMAGES = []; });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarObras().then(() => {
    const activeBtn = document.querySelector('.filter-btn.active');
    renderGallery(activeBtn ? activeBtn.dataset.filter : 'all');
  });

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
