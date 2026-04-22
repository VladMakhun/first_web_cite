document.addEventListener('DOMContentLoaded', init);

// Глобальний стан для роботи каталогу
let allItems = [];
let filteredItems = [];
let itemsPerPage = 4;
let visibleCount = 4;

async function init() {
  initActiveNav();
  initThemeToggle();
  initBackToTop();
  initAccordion();
  initContactForm();
  
  await initCatalog();
}

async function initCatalog() {
  const catalogContainer = document.getElementById('catalog');
  if (!catalogContainer) return;

  const loader = document.getElementById('loader');
  const errorMsg = document.getElementById('error-message');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortOrder = document.getElementById('sortOrder');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  try {
    loader.classList.remove('hidden');
    const response = await fetch('./data/items.json');
    if (!response.ok) throw new Error('Помилка завантаження');
    allItems = await response.json();
    filteredItems = [...allItems];
    loader.classList.add('hidden');

    updateCatalog();

    // Слухачі подій для фільтрації та пошуку
    const handleFilter = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const category = categoryFilter.value;
      const sort = sortOrder.value;

      filteredItems = allItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesSearch && matchesCategory;
      });

      sortItems(sort);
      visibleCount = 4; // Скидаємо пагінацію
      updateCatalog();
    };

    searchInput.addEventListener('input', handleFilter);
    categoryFilter.addEventListener('change', handleFilter);
    sortOrder.addEventListener('change', handleFilter);

    // Пагінація (Показати ще)
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 4;
      updateCatalog();
    });

  } catch (err) {
    loader.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    console.error(err);
  }
}

// Сортування (Пункт 7)
function sortItems(criteria) {
  if (criteria === 'rating') filteredItems.sort((a, b) => b.rating - a.rating);
  else if (criteria === 'title') filteredItems.sort((a, b) => a.title.localeCompare(b.title));
}

function updateCatalog() {
  const container = document.getElementById('catalog');
  const emptyMsg = document.getElementById('empty-message');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  const itemsToRender = filteredItems.slice(0, visibleCount);
  
  if (filteredItems.length === 0) emptyMsg.classList.remove('hidden');
  else emptyMsg.classList.add('hidden');

  container.innerHTML = itemsToRender.map(item => `
    <div class="card" onclick="showDetails(${item.id})">
      <h3>${item.title}</h3>
      <p><strong>Рейтинг:</strong> ${item.rating}</p>
      <button onclick="event.stopPropagation(); toggleFavorite(${item.id})">❤️</button>
    </div>
  `).join('');

  loadMoreBtn.style.display = visibleCount >= filteredItems.length ? 'none' : 'block';
}

// Модальне вікно (Пункт 10)
function showDetails(id) {
  const item = allItems.find(i => i.id === id);
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  
  body.innerHTML = `<h2>${item.title}</h2><p>${item.description}</p><p>Рівень: ${item.level}</p>`;
  modal.classList.remove('hidden');
}

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// --- Існуючі функції (Nav, Theme, Top, Accordion, Form, Favorite) ---
function initActiveNav() {
  const links = document.querySelectorAll('.nav-list a');
  const current = window.location.pathname;
  links.forEach(link => { if (current.includes(link.getAttribute('href'))) link.classList.add('is-active'); });
}

function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (localStorage.getItem('siteTheme') === 'dark') document.body.classList.add('theme-dark');
  btn?.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    localStorage.setItem('siteTheme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => { if(btn) btn.hidden = window.scrollY < 300 });
  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initAccordion() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    item.querySelector('.accordion-header')?.addEventListener('click', () => item.classList.toggle('active'));
  });
}

function initContactForm() { /* Ваша логіка форми */ }

function toggleFavorite(id) {
  let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  favs.includes(id) ? favs = favs.filter(i => i !== id) : favs.push(id);
  localStorage.setItem('favorites', JSON.stringify(favs));
  alert('Оновлено в обраному!');
}